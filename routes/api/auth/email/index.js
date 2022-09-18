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
        var message = { valid: false, existing: false };
        var item = await fastify.prisma.students.findUnique({
          where: {
            email: request.body.email,
          },
        });
        items = await fastify.prisma.university_mails.findMany({
          where: {
            deleted_at: null,
            email: {
              endsWith: end_domin,
            },
          },
        });

        if (item) {
          message.existing = true;
          message.valid = true;
        } else if (items.length == 0) {
          message.valid = false;
          message.existing = false;
        } else if (items.length != 0) {
          message.valid = true;
          message.existing = false;
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
        var message = {};
        var item = await fastify.prisma.students.findUnique({
          where: {
            email: request.body.email,
          },
        });
        if (item) {
          throw new Error("The mail you entered is not valid.");
        }

        items = await fastify.prisma.university_mails.findMany({
          where: {
            deleted_at: null,
            email: {
              endsWith: end_domin,
            },
          },
          select:{
            universities:true
          }
        });
        
        if (items.length == 0) {
          throw new Error("The mail you entered is not valid.");
        } else {
          const token = fastify.jwt.sign({ email: request.body.email, university:{name:items[0].universities.name,id:items[0].universities.id} });
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

          var link = "http://localhost:8080/entry/register?token=" + token
          // send mail with defined transport object
          let info = await transporter.sendMail({
            from: '"Ceylonuni" <test@ceylonuni.com>', // sender address
            to: request.body.email, // list of receivers
            subject: "Ceylonuni", // Subject line
            text: "Email Verification", // plain text body
            html: "<a href="+link+">Click Here to verify</a>"
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
