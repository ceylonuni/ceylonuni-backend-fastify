"use strict";

const moment = require("moment");
module.exports = async function (fastify, opts) {

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
      },
    },
    async (request, reply) => {
      try {
        var like = await fastify.prisma.likes.create({
          data: {
            post_id: request.params.post_id,
            student_id: request.user.student_id,
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
    "/remove",
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
        var like = await fastify.prisma.likes.delete({
        where:{
          student_id_post_id:{
            student_id:request.user.student_id,
            post_id:request.params.post_id
          }
        }
        });

        reply.send({ message: "success" });
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );
};
