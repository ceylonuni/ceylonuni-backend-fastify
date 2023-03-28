"use strict";
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const moment = require("moment");
module.exports = async function (fastify, opts) {
  fastify.post(
    "/login",
    {
      schema: {
        tags: ["Admin"],
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
        var item = await fastify.prisma.admins.findUnique({
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
              role: "admin",
              id: item.id,
            });

            reply.send({ token: token, admin: item });
          } else {
            throw new Error("Email or Password wrong.");
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
};
