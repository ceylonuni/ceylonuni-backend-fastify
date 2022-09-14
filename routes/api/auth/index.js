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
            username: request.body.first_name+moment(),
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

        reply.send({ token: token, message: "success" });
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
          if(item.deleted_at){
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
            reply.send({ token: token });
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
};
