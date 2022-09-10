"use strict";

module.exports = async function (fastify, opts) {
  fastify.get(
    "/all",
    {
      schema: {
        tags: ["Test"],
      },
    },
    async (request, reply) => {
      try {
        var items = await fastify.prisma.supports.findMany();
        reply.send(items);
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );

  fastify.get(
    "/:id",
    {
      schema: {
        tags: ["Test"],
        params: {
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
        var item = await fastify.prisma.supports.findUnique({
          where: {
            id: request.params.id,
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
      schema: {
        tags: ["Test"],
        body: {
          type: "object",
          required: ["name"],
          properties: {
            name: {
              type: "string",
              default: "test name",
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var item = await fastify.prisma.supports.create({
          data: {
            name: request.body.name,
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
        tags: ["Test"],
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
              default: "test name",
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var item = await fastify.prisma.supports.update({
          where: {
            id: request.body.id,
          },
          data: {
            name: request.body.name,
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
