"use strict";

const moment = require("moment");

module.exports = async function (fastify, opts) {
  fastify.post(
    "/add",
    {
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Event"],
        body: {
          type: "object",
          properties: {
            event_id: {
              type: "integer",
            },
            collaborator_id: {
              type: "integer",
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var item = await fastify.prisma.students.findMany({
          where: {
            id: request.body.collaborator_id, //1
          },
          select: {
            collaborator_request: true,
          },
        });

        let collaborator_request = item[0].collaborator_request;
        collaborator_request = JSON.parse(collaborator_request);

        const isInArray = collaborator_request.includes(
          request.body.collaborator_id
        );
        if (isInArray) {
          throw new Error("Alredy collaborator");
        }

        collaborator_request.push(request.user.student_id);

        item = await fastify.prisma.students.update({
          where: {
            id: request.body.collaborator_id,
          },
          data: {
            collaborator_request: JSON.stringify(collaborator_request),
            updated_at: moment().toISOString(),
          },
        });

        let result = {
          student_id: JSON.stringify(request.user.student_id),
          event_id: JSON.stringify(request.body.event_id),
        };

        reply.send(result);
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );

  fastify.post(
    "/accept",
    {
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Event"],
        body: {
          type: "object",
          properties: {
            event_id: {
              type: "integer",
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var item = await fastify.prisma.event_collaborators.findMany({
          where: {
            student_id: request.user.student_id, //1
            event_id: request.body.event_id, //1
          },
        });

        if (!item[0]) {
          throw new Error("No Item");
        }

        var collaborator = await fastify.prisma.event_collaborators.update({
          where: {
            id: item[0].id,
          },
          data: {
            accepted_at: moment().toISOString(),
            updated_at: moment().toISOString(),
          },
        });

        var event = await fastify.prisma.event_collaborators.findMany({
          where: {
            event_id: request.body.event_id, //1
            NOT:{
              accepted_at : null
            }
          },
        });
        if(event.length > 2){
          await fastify.prisma.events.update({
            where: {
              id: request.body.event_id,
            },
            data: {
              status: 'published',
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
    "/leave",
    {
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Event"],
        body: {
          type: "object",
          properties: {
            event_id: {
              type: "integer",
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var item = await fastify.prisma.event_collaborators.findMany({
          where: {
            student_id: request.user.student_id, //1
            event_id: request.body.event_id, //1
          },
        });

        if (!item[0]) {
          throw new Error("No Item");
        }

        var collaborator = await fastify.prisma.event_collaborators.delete({
          where: {
            id: item[0].id,
          },
        });

        var event = await fastify.prisma.event_collaborators.findMany({
          where: {
            event_id: request.body.event_id, //1
            NOT:{
              accepted_at : null
            }
          },
        });
        if(event.length < 3){
          await fastify.prisma.events.update({
            where: {
              id: request.body.event_id,
            },
            data: {
              status: 'pending',
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
    "/reject",
    {
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Event"],
        body: {
          type: "object",
          properties: {
            event_id: {
              type: "integer",
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var item = await fastify.prisma.event_collaborators.findMany({
          where: {
            student_id: request.user.student_id, //1
            event_id: request.body.event_id, //1
          },
        });

        if (!item[0]) {
          throw new Error("No Item");
        }

        var collaborator = await fastify.prisma.event_collaborators.delete({
          where: {
            id: item[0].id,
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
