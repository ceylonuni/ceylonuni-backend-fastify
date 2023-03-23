"use strict";
var moment = require("moment");
module.exports = async function (fastify, opts) {
  fastify.get(
    "/all",
    {
      schema: {
        tags: ["Admin"],
      },
    },
    async (request, reply) => {
      try {
        var items = await fastify.prisma.universities.findMany({
          where: {
            deleted_at: null,
          },
        });
        // console.log(moment().toISOString())
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
      schema: {
        tags: ["Admin"],
        body: {
          type: "object",
          required: ["name"],
          properties: {
            name: {
              type: "string",
              default: "Name",
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var item = await fastify.prisma.universities.create({
          data: {
            name: request.body.name,
            created_at: moment().toISOString(),
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
    "/update",
    {
      schema: {
        tags: ["Admin"],
        body: {
          type: "object",
          required: ["id", "name"],
          properties: {
            id: {
              type: "integer",
              default: 1,
            },
            name: {
              type: "string",
              default: "name",
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var item = await fastify.prisma.universities.update({
          where: {
            id: request.body.id,
          },
          data: {
            name: request.body.name,
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
      schema: {
        tags: ["Admin"],
        body: {
          type: "object",
          properties: {
            university_id: {
              type: "integer",
              default: 1,
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var item = await fastify.prisma.universities.update({
          where: {
            id: request.body.university_id,
          },
          data: {
            deleted_at: moment().toISOString(),
          },
        });

        reply.send("University Deleted");
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );
};
