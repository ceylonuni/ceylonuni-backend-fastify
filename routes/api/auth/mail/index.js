"use strict";
const nodemailer = require("nodemailer");

module.exports = async function (fastify, opts) {
  fastify.post(
    "/verify",
    {
      schema: {
        tags: ["Auth"],
        body: {
          type: "object",
          required: ["email"],
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
        var end_domin = request.body.email.split("@")[1];
        var items = [];
        var message = { vaild: true, existing: true };
        var item = await fastify.prisma.students.findUnique({
          where: {
            email: request.body.email,
          },
        });
        if (item) {
          message.existing = true
        }
        items = await fastify.prisma.university_mails.findMany({
          where: {
            deleted_at: null,
            email: {
              endsWith: end_domin,
            },
          },
        });
        if (items.length == 0) {
          message.vaild = false
          message.existing = false
        } else {
          message.vaild = true
          message.existing = true
        }
        reply.send(message);
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );

  fastify.post(
    "/send",
    {
      schema: {
        tags: ["Auth"],
        body: {
          type: "object",
          required: ["email"],
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
        var end_domin = request.body.email.split("@")[1];
        var items = [];
        var message = { vaild: true, existing: true };
        var item = await fastify.prisma.students.findUnique({
          where: {
            email: request.body.email,
          },
        });
        if (item) {
          message.existing = true
        }
        items = await fastify.prisma.university_mails.findMany({
          where: {
            deleted_at: null,
            email: {
              endsWith: end_domin,
            },
          },
        });
        if (items.length == 0) {
          message.vaild = false
          message.existing = false
        } else {
          const token = fastify.jwt.sign({ email: request.body.email });
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
          // send mail with defined transport object
          let info = await transporter.sendMail({
            from: '"Ceylonuni" <test@ceylonuni.com>', // sender address
            to: request.body.email, // list of receivers
            subject: "Ceylonuni", // Subject line
            text: "Email Verification", // plain text body
            html: "ceylonuni.lk/register?token=" + token,
          });

          transporter.sendMail(function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
          message.message = "Verification link has been sent to your mail.";
        }
        reply.send(message);
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );
};
