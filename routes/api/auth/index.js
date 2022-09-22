"use strict";
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const moment = require("moment");
module.exports = async function (fastify, opts) {
  fastify.post(
    "/register",
    {
      preValidation: [fastify.verifyEmail],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Auth"],
        body: {
          type: "object",
          required: [
            "first_name",
            "last_name",
            "password",
            "mobile",
            "address",
            "university_course_id",
          ],
          properties: {
            first_name: {
              type: "string",
              default: "First name",
            },
            last_name: {
              type: "string",
              default: "Last name",
            },
            password: {
              type: "string",
              default: "Password",
            },
            mobile: {
              type: "string",
              default: "0771234567",
            },
            address: {
              type: "string",
              default: "Address",
            },
            university_course_id: {
              type: "integer",
              default: 1,
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var item = await fastify.prisma.students.findUnique({
          where: {
            email: request.user.email,
          },
        });
        if (item) {
          throw new Error("This email is alreday taken.");
        }
        var student = await fastify.prisma.students.create({
          data: {
            first_name: request.body.first_name,
            last_name: request.body.last_name,
            mobile: request.body.mobile,
            address: request.body.address,
            email: request.user.email,
            university_course_id: request.body.university_course_id,
            friends: "[]",
            friend_requests: "[]",
            collaborator_request: "[]",
            created_at: moment().toISOString(),
            updated_at: moment().toISOString(),
          },
        });
        // const salt = await bcrypt.genSalt(10);
        // const password = await bcrypt.hash(request.body.password, salt);

        const password = await bcrypt.hash(request.body.password, 10);
        var account = await fastify.prisma.accounts.create({
          data: {
            student_id: student.id,
            username: request.body.first_name + moment(),
            email: request.user.email,
            password: password,
            created_at: moment().toISOString(),
            updated_at: moment().toISOString(),
          },
        });

        const token = fastify.jwt.sign({
          email: account.email,
          id: account.id,
          student_id: account.student_id,
        });
        var account = {};
        account.id = student.id;
        account.first_name = student.first_name;
        account.last_name = student.last_name;
        reply.send({ token: token, student: account });
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );

  fastify.post(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              default: "Last name",
            },
            password: {
              type: "string",
              default: "Password",
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var item = await fastify.prisma.accounts.findUnique({
          where: {
            email: request.body.email,
          },
        });
        if (item) {
          if (item.deleted_at) {
            throw new Error("This account is deleted");
          }
          // console.log(item);
          let pass = request.body.password;
          let hash = item.password;

          const result = await bcrypt.compare(pass, hash);

          if (result) {
            const token = fastify.jwt.sign({
              email: item.email,
              id: item.id,
              student_id: item.student_id,
            });
            var student = await fastify.prisma.students.findUnique({
              where: {
                id: item.student_id,
              },
            });
            var account = {};
            account.id = item.student_id;
            account.first_name = student.first_name;
            account.last_name = student.last_name;
            reply.send({ token: token, student: account });
          } else {
            reply.send("Email or Password wrong.");
          }
        } else {
          throw new Error("This email don't have an account");
        }
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );

  fastify.get(
    "/validate-link",
    {
      preValidation: [fastify.verifyEmail],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Auth"],
      },
    },
    async (request, reply) => {
      try {
        reply.send({ message: "Link is validate." });
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );

  fastify.get(
    "/register",
    {
      preValidation: [fastify.verifyEmail],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Auth"],
      },
    },
    async (request, reply) => {
      try {
        var items = {};
        var courses = [];
        var universityCourses =
          await fastify.prisma.university_courses.findMany({
            where: {
              deleted_at: null,
              university_id: request.user.university.id,
            },
            select: {
              id: true,
              courses: {
                select: {
                  name: true,
                },
              },
            },
          });

        for (var key in universityCourses) {
          var item = {};
          item.university_course_id = universityCourses[key].id;
          item.name = universityCourses[key].courses.name;
          courses.push(item);
        }
        items.university = request.user.university.name;
        items.email = request.user.email;
        items.courses = courses;
        reply.send(items);
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );

  fastify.post(
    "/password-reset",
    {
      preValidation: [fastify.authenticate],
      schema: {
        tags: ["Auth"],
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["email", "old_password", "new_password"],
          properties: {
            email: {
              type: "string",
              default: "email",
            },
            old_password: {
              type: "string",
              default: "Password 1",
            },
            new_password: {
              type: "string",
              default: "Password 2",
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var item = await fastify.prisma.accounts.findUnique({
          where: {
            email: request.body.email,
          },
        });

        let pass = request.body.old_password;
        let hash = item.password;

        const result = await bcrypt.compare(pass, hash);

        if (result) {
          const hashed_password = await bcrypt.hash(
            request.body.new_password,
            10
          );
          var item = await fastify.prisma.accounts.update({
            where: {
              email: request.body.email,
            },
            data: {
              password: hashed_password,
              updated_at: moment().toISOString(),
            },
          });
          reply.send("Password updated successfully");
        } else {
          reply.send("Email or Password wrong.");
        }
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );

  fastify.post(
    "/send-reset-email",
    {
      preValidation: [fastify.authenticate],
      schema: {
        tags: ["Auth"],
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            email: {
              type: "string",
              default: "example@stu.kln.ac.lk",
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const token = fastify.jwt.sign({
          email: request.body.email,
        });

        let testAccount = await nodemailer.createTestAccount();
        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: fastify.config.EMAIL_HOST_USER,
            pass: fastify.config.EMAIL_HOST_PASSWORD,
          },
        });

        var link = "ceylonuni.lk/reset password?token=" + token;
        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: '"Ceylonuni" <test@ceylonuni.com>', // sender address
          to: request.body.email, // list of receivers
          subject: "Ceylonuni Email Reset", // Subject line
          text: "Email Verification", // plain text body
          html: "<p>Click Here to verify " + token + "</p>",
        });

        transporter.sendMail(function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
        // message.message = "Verification link has been sent to your mail.";

        reply.send(token);
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );

  fastify.post(
    "/forgot-password-reset",
    {
      preValidation: [fastify.verifyEmail],
      schema: {
        tags: ["Auth"],
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["email", "new_password"],
          properties: {
            email: {
              type: "string",
              default: "email",
            },
            new_password: {
              type: "string",
              default: "Password",
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const hashed_password = await bcrypt.hash(
          request.body.new_password,
          10
        );
        var item = await fastify.prisma.accounts.update({
          where: {
            email: request.body.email,
          },
          data: {
            password: hashed_password,
            updated_at: moment().toISOString(),
          },
        });
        reply.send("New password updated successfully");
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );
};
