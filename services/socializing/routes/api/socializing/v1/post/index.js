"use strict";

const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

module.exports = async function (fastify, opts) {
  fastify.post(
    "/add",
    {
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Socializing"],
        body: {
          type: "object",
          properties: {
            text: {
              type: "string",
            },
            video_url: {
              type: "string",
            },
            image_url: {
              type: "string",
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        if (
          !request.body.text &&
          !request.body.image_url &&
          !request.body.video_url
        ) {
          throw new Error("Body should be have at lest one content.");
        }
        var image_url = null;
        var key = uuidv4();
        if (request.body.image_url) {
          image_url = await fastify.image.upload({
            image_url: request.body.image_url,
            key: key,
          });
        }

        var post = await fastify.prisma.posts.create({
          data: {
            student_id: request.user.student_id,
            key: key,
            text: request.body.text,
            image_url: image_url,
            video_url: request.body.video_url,
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
    "/read",
    {
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Socializing"],
        body: {
          type: "object",
          properties: {
            key: {
              type: "string",
              default: "egdnssjc-jjahdnd-nnakakhd",
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var item = await fastify.prisma.posts.findUnique({
          where: {
            key: request.body.key,
          },
          select: {
            id: true,
            key: true,
            text: true,
            student_id: true,
            image_url: true,
            video_url: true,
            created_at: true,
            deleted_at: true,
            students: {
              select: {
                first_name: true,
                last_name: true,
                image_url: true,
                accounts: {
                  select: {
                    username: true,
                  },
                },
              },
            },
            events: {
              select: {
                name: true,
                venue: true,
                key: true,
              },
            },
            comments: {
              where: {
                deleted_at: null,
              },
              select: {
                id: true,
                text: true,
                created_at: true,
                students: {
                  select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    image_url: true,
                    accounts: {
                      select: {
                        username: true,
                      },
                    },
                  },
                },
              },
            },
            likes: {
              select: {
                students: {
                  select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    image_url: true,
                    accounts: {
                      select: {
                        username: true,
                      },
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
                },
              },
            },
          },
        });
        if (item.deleted_at) {
          throw new Error("Post not available.");
        }
        reply.send(item);
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );
  fastify.post(
    "/edit",
    {
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Socializing"],
        body: {
          type: "object",
          properties: {
            key: {
              type: "string",
              default: "egdnssjc-jjahdnd-nnakakhd",
            },
            text: {
              type: "string",
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var item = await fastify.prisma.posts.update({
          where: {
            key: request.body.key,
          },
          data: {
            text: request.body.text,
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
            deleted_at: null,
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

  fastify.post(
    "/delete",
    {
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Socializing"],
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
        if (!request.body.id) {
          throw new Error("Body should be have id.");
        }

        var post = await fastify.prisma.posts.update({
          where: {
            id: request.body.id,
          },
          data: {
            deleted_at: moment().toISOString(),
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
};
