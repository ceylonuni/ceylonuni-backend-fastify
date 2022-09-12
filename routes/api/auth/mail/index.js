"use strict";
const nodemailer = require("nodemailer");

module.exports = async function (fastify, opts) {
  fastify.post(
    "/check",
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
        items = await fastify.prisma.university_mails.findMany({
          where: {
            deleted_at: null,
            email: {
              endsWith: end_domin,
            },
          },
        });
        if (items.length == 0) {
          message.is_university_mail = false;
        } else {
          const token = fastify.jwt.sign({email:request.body.email})
          let testAccount = await nodemailer.createTestAccount();
          let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
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
            html: "<b>Hello world?</b>" + token, // html body
          });
  
          transporter.sendMail(function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });
          message.is_university_mail = true;
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
