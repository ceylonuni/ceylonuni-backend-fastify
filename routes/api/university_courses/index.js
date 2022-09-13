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
        var items = await fastify.prisma.university_courses.findMany({
          where: {
            deleted_at: null,
          },
          include: {
            universities: true,
            courses: true,
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
          required: ["university_id", "course_id"],
          properties: {
            university_id: {
              type: "integer",
              default: 1,
            },
            course_id: {
              type: "integer",
              default: 1,
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var item = await fastify.prisma.university_courses.create({
          data: {
            university_id: request.body.university_id,
            course_id: request.body.course_id,
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
          required: ["id"],
          properties: {
            id: {
              type: "integer",
              default: 1,
            },
            university_id: {
              type: "integer",
              default: 1,
            },
            course_id: {
              type: "integer",
              default: 1,
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var item = await fastify.prisma.university_courses.update({
          where: {
            id: request.body.id,
          },
          data: {
            university_id: request.body.university_id,
            course_id: request.body.course_id,
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
