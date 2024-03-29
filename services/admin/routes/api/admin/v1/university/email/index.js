"use strict";

const moment = require("moment");

module.exports = async function (fastify, opts) {
  fastify.get(
    "/all",
    {
      preValidation: [fastify.authIsAdmin],
      schema: {
        security: [{ bearerAuth: [] }],
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
      preValidation: [fastify.authIsAdmin],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Admin"],
        body: {
          type: "object",
          required: ["university_id", "email"],
          properties: {
            email: {
              type: "string",
              default: "example@stu.kln.ac.lk",
            },
            university_id: {
              type: "integer",
              default: 1,
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
            university_id: request.body.university_id,
            created_at: moment().toISOString(),
            updated_at: moment().toISOString(),
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
      preValidation: [fastify.authIsAdmin],
      schema: {
        security: [{ bearerAuth: [] }],
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
            updated_at: moment().toISOString(),
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
    "/delete",
    {
      preValidation: [fastify.authIsAdmin],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Admin"],
        body: {
          type: "object",
          properties: {
            university_email_id: {
              type: "integer",
              default: 1,
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var item = await fastify.prisma.university_mails.update({
          where: {
            id: request.body.university_email_id,
          },
          data: {
            deleted_at: moment().toISOString(),
          },
        });

        reply.send("University Mail Deleted");
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );
};
