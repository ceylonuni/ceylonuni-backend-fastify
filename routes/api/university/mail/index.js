"use strict";

const moment = require("moment");

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
        var items = await fastify.prisma.university_mails.findMany({
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
    "/add",
    {
      schema: {
        tags: ["Admin"],
        body: {
          type: "object",
          required: ["email"],
          properties: {
            email: {
              type: "string",
              default:"example@stu.kln.ac.lk"
            },
          },
          // example: {
          //   email: "Example School",
          // },
        },
      },
    },
    async (request, reply) => {
      try {
        var item = await fastify.prisma.university_mails.create({
          data: {
            email: request.body.email,
            created_at:moment().toISOString(),
            updated_at:moment().toISOString(),
          },
        });
        reply.send(item);
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );

  fastify.post(
    "/update",
    {
      schema: {
        tags: ["Admin"],
        body: {
          type: "object",
          required: ["id", "email"],
          properties: {
            id: {
              type: "integer",
              default: 1,
            },
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
        var item = await fastify.prisma.university_mails.update({
          where: {
            id: request.body.id,
          },
          data: {
            email: request.body.email,
            updated_at:moment().toISOString(),
          },
        });
        reply.send(item);
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );
};
