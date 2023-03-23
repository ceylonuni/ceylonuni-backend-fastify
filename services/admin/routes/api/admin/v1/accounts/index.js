"use strict";
var moment = require("moment");

module.exports = async function (fastify, opts) {
  fastify.get(
    "/all",
    {
      schema: {
        tags: ["Admin"],
      },
    },
    async (request, reply) => {
      try {
        var items = await fastify.prisma.accounts.findMany({
          where: {
            deleted_at: null,
          },
        });

        reply.send(items);
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );

  fastify.post(
    "/delete",
    {
      schema: {
        tags: ["Admin"],
        body: {
          type: "object",
          required: ["ac_id"],
          properties: {
            ac_id: {
              type: "integer",
              default: 2,
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const account = await fastify.prisma.accounts.findUnique({
          where: {
            id: request.body.ac_id,
          },
        });

        var updatedStudent = await fastify.prisma.students.update({
          where: {
            id: account.student_id,
          },
          data: {
            deleted_at: moment().toISOString(),
          },
        });

        var updatedAccount = await fastify.prisma.accounts.update({
          where: {
            id: request.body.ac_id,
          },
          data: {
            deleted_at: moment().toISOString(),
          },
        });

        reply.send("Account Deeleted");
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );
};
