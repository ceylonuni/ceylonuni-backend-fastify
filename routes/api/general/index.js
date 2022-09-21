"use strict";

module.exports = async function (fastify, opts) {
  fastify.post(
    "/search",
    {
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["General"],
        body: {
          type: "object",
          properties: {
            key_word: {
              type: "string",
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var posts = await fastify.prisma.posts.findMany({
          where: {
            text: {
              contains: request.body.key_word,
            },
          },
        });

        var students = await fastify.prisma.students.findMany({
          where: {
            deleted_at: null,
            OR: [
              {
                first_name: {
                  contains: request.body.key_word,
                },
              },
              {
                last_name: {
                  contains: request.body.key_word,
                },
              },
            ],
          },
        });

        var result = {};
        result.students = students;
        result.posts = posts;
        reply.send(result);
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );
  //get all own posts
  fastify.get(
    "/all",
    {
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Socializing"],
      },
    },
    async (request, reply) => {
      try {
        const results = await fastify.prisma.posts.findMany({
          where: {
            student_id: request.user.student_id,
          },
        });

        reply.send(results);
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );
};
