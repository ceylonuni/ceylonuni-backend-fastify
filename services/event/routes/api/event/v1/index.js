"use strict";
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

module.exports = async function (fastify, opts) {
  fastify.get(
    "/get",
    {
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Auth"],
      },
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
    async (request, reply) => {
      try {
        var items = await fastify.prisma.events.findMany({
          select: {
            id: true,
            name: true,
            key: true,
            image_url: true,
            start_at: true,
            end_at: true,
            venue: true,
            student_id: true,
            participants: {
              where: {
                student_id: request.user.student_id,
              },
              select: {
                status: true,
              },
            },
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
  fastify.get(
    "/getYour",
    {
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Auth"],
      },
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
    async (request, reply) => {
      try {
        var items = await fastify.prisma.events.findMany({
          where: {
            student_id: request.user.student_id,
          },
          select: {
            id: true,
            name: true,
            key: true,
            image_url: true,
            start_at: true,
            end_at: true,
            venue: true,
            student_id: true,
            participants: {
              where: {
                student_id: request.user.student_id,
              },
              select: {
                status: true,
              },
            },
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
  fastify.get(
    "/getInterested",
    {
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Auth"],
      },
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
    async (request, reply) => {
      try {
        var items = await fastify.prisma.participants.findMany({
          where: {
            student_id: request.user.student_id,
          },
          select: {
            events:{
              select:{
                id: true,
                name: true,
                key: true,
                image_url: true,
                start_at: true,
                end_at: true,
                venue: true,
                student_id: true,
                participants: {
                  where: {
                    student_id: request.user.student_id,
                  },
                  select: {
                    status: true,
                  },
                },
              }
            }
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
    "/read",
    {
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Auth"],
      },
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
    async (request, reply) => {
      try {
        var item = await fastify.prisma.events.findUnique({
          where: {
            key: request.body.key,
          },
          select: {
            id: true,
            name: true,
            key: true,
            image_url: true,
            start_at: true,
            end_at: true,
            venue: true,
            student_id: true,
            posts: {
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
                    last_name: true,
                    image_url: true,
                  },
                },
                comments: {
                  select: {
                    text: true,
                    created_at: true,
                    students: {
                      select: {
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
    "/add",
    {
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Event"],
        body: {
          //name, student_id, collaborator_id str_date, end_date, venue
          type: "object",
          properties: {
            name: {
              type: "string",
            },
            image: {
              type: "string",
            },
            start_at: {
              type: "string",
            },
            end_at: {
              type: "string",
            },
            venue: {
              type: "string",
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var key = uuidv4();
        var event = await fastify.prisma.events.create({
          data: {
            name: request.body.name,
            key: key,
            student_id: request.user.student_id,
            venue: request.body.venue,
            start_at: request.body.start_at,
            end_at: request.body.end_at,
            created_at: moment().toISOString(),
            updated_at: moment().toISOString(),
          },
        });

        var image_url = null;
        if (request.body.image) {
          image_url = await fastify.image.upload({
            image_url: request.body.image,
            key: key,
          });

          var item = await fastify.prisma.events.update({
            where: {
              id: event.id,
            },
            data: {
              image_url: image_url,
              updated_at: moment().toISOString(),
            },
          });
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
    "/update",
    {
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Event"],
        params: {
          type: "object",
          required: ["event_id"],
          properties: {
            event_id: {
              type: "integer",
              default: 1,
            },
          },
        },
        body: {
          //name, student_id, collaborator_id str_date, end_date, venue
          type: "object",
          properties: {
            name: {
              type: "string",
            },

            start_at: {
              type: "string",
            },
            end_at: {
              type: "string",
            },
            venue: {
              type: "string",
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var event = await fastify.prisma.events.update({
          where: {
            id: request.params.event_id,
          },
          data: {
            name: request.body.name,
            venue: request.body.venue,
            start_at: moment().toISOString(),
            end_at: moment().toISOString(),
            updated_at: moment().toISOString(),
          },
        });
        reply.send(event);
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
        tags: ["Event"],
        params: {
          type: "object",
          required: ["event_id"],
          properties: {
            event_id: {
              type: "integer",
              default: 1,
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var event = await fastify.prisma.events.update({
          where: {
            id: request.params.event_id,
          },
          data: {
            deleted_at: moment().toISOString(),
            updated_at: moment().toISOString(),
          },
        });
        reply.send(event);
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );
};
