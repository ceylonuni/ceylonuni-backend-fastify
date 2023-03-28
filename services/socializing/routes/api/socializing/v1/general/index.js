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
                accounts:{
                  select:{
                    username:true,
                  }
                }
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
            send_requests:true,
            image_url:true,
            accounts:{
              select:{
                username: true,
              }
            },
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

  fastify.get(
    "/students",
    {
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Socializing"],
      },
    },
    async (request, reply) => {
      try {
        //get all students ids

        const results = await fastify.prisma.students.findMany({
          where: {
            deleted_at: null,
          },
          select: {
            id: true,
            first_name: true,
            last_name: true,
            friends:true,
            friend_requests: true,
            send_requests:true,
            image_url:true,
            accounts:{
              select:{
                username: true,
              }
            },
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
        reply.send(results);
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );

  fastify.get(
    "/requests",
    {
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Socializing"],
      },
    },
    async (request, reply) => {
      try {
       //get all student ids
       var item = await fastify.prisma.students.findUnique({
        where: {
          id: request.user.student_id,
        },
        select: {
          friend_requests: true,
        },
      });

      var student_ids = JSON.parse(item.friend_requests);
        const results = await fastify.prisma.students.findMany({
          where: {
            id: { in: student_ids },
            deleted_at: null,
          },
          select: {
            id: true,
            first_name: true,
            last_name: true,
            friends:true,
            friend_requests: true,
            send_requests:true,
            image_url:true,
            accounts:{
              select:{
                username: true,
              }
            },
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
        reply.send(results);
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );
};
