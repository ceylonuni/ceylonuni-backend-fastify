"use strict";

const moment = require("moment");
module.exports = async function (fastify, opts) {
  fastify.get(
    "/all",
    {
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Socializing"],
        params: {
          type: "object",
          required: ["post_id"],
          properties: {
            post_id: {
              type: "integer",
              default: 1,
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var items = await fastify.prisma.comments.findMany({
          where: {
            deleted_at: null,
            post_id: request.params.post_id,
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
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Socializing"],
        params: {
          type: "object",
          required: ["post_id"],
          properties: {
            post_id: {
              type: "integer",
              default: 1,
            },
          },
        },
        body: {
          type: "object",
          required: ["text"],
          properties: {
            text: {
              type: "string",
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        if (!request.body.text) {
          throw new Error("Body should be have some text");
        }
        var comment = await fastify.prisma.comments.create({
          data: {
            post_id: request.params.post_id,
            student_id: request.user.student_id,
            text: request.body.text,
            like_count: 0,
            created_at: moment().toISOString(),
            updated_at: moment().toISOString(),
          },
        });

        reply.send({ message: "success" });
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
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Socializing"],
        required: ["id"],
        params: {
          type: "object",
          required: ["post_id"],
          properties: {
            post_id: {
              type: "integer",
              default: 1,
            },
          },
        },
        body: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              default: 1,
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var item = await fastify.prisma.comments.update({
          where: {
            id: request.body.id,
          },
          data: {
            deleted_at: moment().toISOString(),
          },
        });

        reply.send("Comment is successfully deleted");
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );
};
