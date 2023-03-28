"use strict";

const moment = require("moment");

module.exports = async function (fastify, opts) {
  //get all students
  fastify.get(
    "/get",
    {
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["General"],
      },
    },
    async (request, reply) => {
      try {
        const results = await fastify.prisma.students.findMany({
          where: {
            deleted_at: null,
            NOT:{
              id: request.user.student_id
            }
          },
          select: {
            id: true,
            first_name: true,
            last_name: true,
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
