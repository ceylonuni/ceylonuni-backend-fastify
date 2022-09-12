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
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(request.body.password, salt);
        var account = await fastify.prisma.accounts.create({
          data: {
            student_id: student.id,
            username:request.body.first_name,
            email: request.user.email,
            password: password,
            created_at: moment().toISOString(),
            updated_at: moment().toISOString(),
          },
        });
        reply.send({message:'success'});
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );
};
