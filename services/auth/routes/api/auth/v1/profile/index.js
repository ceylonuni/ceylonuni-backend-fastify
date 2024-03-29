"use strict";
const moment = require("moment");
module.exports = async function (fastify, opts) {
  fastify.post(
    "/get",
    {
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Auth"],

        body: {
          type: "object",
          properties: {
            username: {
              type: "string",
              default: "student12345678",
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var item = await fastify.prisma.accounts.findUnique({
          where: {
            username: request.body.username,
          },
          select: {
            username: true,
            email: true,
            students: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                friends: true,
                friend_requests: true,
                send_requests: true,
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
                posts: {
                  where: {
                    deleted_at: null,
                  },
                  select: {
                    id: true,
                    key: true,
                    text: true,
                    image_url: true,
                    video_url: true,
                    created_at: true,
                    events: {
                      select: {
                        name: true,
                        venue: true,
                        key: true,
                      },
                    },
                    students: {
                      select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        image_url: true,
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
                          },
                        },
                      },
                    },
                  },
                  orderBy: {
                    id: "desc",
                  },
                },
              },
            },
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
      preValidation: [fastify.authenticate],
      schema: {
        tags: ["Auth"],
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            first_name: {
              type: "string",
              default: "name",
            },
            last_name: {
              type: "string",
              default: "name",
            },
            mobile: {
              type: "string",
              default: "mobile",
            },
            address: {
              type: "string",
              default: "address",
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var item = await fastify.prisma.students.update({
          where: {
            id: request.user.id,
          },
          data: {
            first_name: request.body.first_name,
            last_name: request.body.last_name,
            mobile: request.body.mobile,
            address: request.body.address,
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
      preValidation: [fastify.authenticate],
      schema: {
        tags: ["Auth"],
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            email: {
              type: "string",
              default: "email",
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var item = await fastify.prisma.accounts.update({
          where: {
            //   id: request.user.id,
            email: request.body.email,
          },
          data: {
            deleted_at: moment().toISOString(),
          },
        });

        reply.send("Account Deleted");
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );

  fastify.post(
    "/image-upload",
    {
      preValidation: [fastify.authenticate],
      schema: {
        tags: ["Auth"],
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            image: {
              type: "string",
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var student = await fastify.prisma.students.findUnique({
          where: {
            id: request.user.id,
          },
        });
        var image_url = null;
        if (request.body.image) {
          image_url = await fastify.image.upload({
            image_url: request.body.image,
            key: student.id + "_" + student.first_name,
          });
        }
        var item = await fastify.prisma.students.update({
          where: {
            id: request.user.id,
          },
          data: {
            image_url: image_url,
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
};
