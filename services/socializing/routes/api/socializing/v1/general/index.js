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
            deleted_at: null,
            text: {
              contains: request.body.key_word,
            },
          },
          select: {
            id: true,
            key: true,
            text: true,
            image_url: true,
            video_url: true,
            created_at: true,
            students: {
              select: {
                first_name: true,
                last_name:true,
                image_url: true,
              },
            },
            comments:{
              select:{
                text:true,
                created_at:true,
                students: {
                  select: {
                    first_name: true,
                    last_name:true,
                    image_url: true,
                  },
                },
              }
            },
            likes:{
              select:{
                students: {
                  select: {
                    id:true,
                    first_name: true,
                    last_name:true,
                    image_url: true,
                  },
                },
              }
            }
          },
          orderBy: {
            id: "desc",
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
          select: {
            id: true,
            first_name: true,
            last_name: true,
            friends:true,
            friend_requests: true,
            image_url:true,
            university_courses: {
              select: {
                universities: {
                  select: {
                    name: true,
                  },
                },
                courses: {
                  select: {
                    name: true,
                  },
                },
              },
            },
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

};
