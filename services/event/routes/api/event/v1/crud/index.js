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
        tags: ["Event"],
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
        var key = uuidv4();

        var event = await fastify.prisma.events.create({
          data: {
            name: request.body.name,
            key: key,
            student_id: request.user.student_id,
            venue: request.body.venue,
            start_at: moment().toISOString(),
            end_at: moment().toISOString(),
            created_at: moment().toISOString(),
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
