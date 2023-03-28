"use strict";
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const moment = require("moment");
module.exports = async function (fastify, opts) {
  fastify.get(
    "/admins",
    {
      schema: {
        tags: ["Admin"],
      },
    },
    async (request, reply) => {
      try {
        const newPassword = "password";
        const email = "sachchin06@gmail.com";
        const mobile = "0765326026";

        var item = await fastify.prisma.admins.findUnique({
          where: {
            email: email,
          },
        });
        if (item) {
          throw new Error("This email is alreday taken.");
        }

        const password = await bcrypt.hash(newPassword, 10);

        var admin = await fastify.prisma.admins.create({
          data: {
            mobile: mobile,
            email: email,
            password: password,
            created_at: moment().toISOString(),
            updated_at: moment().toISOString(),
          },
        });

        // console.log(admin);

        const token = fastify.jwt.sign({
          email: admin.email,
          role: "admin",
          id: admin.id,
        });

        reply.send({ token: token, admin: admin });
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );
};
