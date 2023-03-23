"use strict";
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
    },
    async (request, reply) => {
      try {
        var friends = await fastify.prisma.students.findUnique({
          where: {
            id: request.user.student_id,
          },
          select: {
            friend_requests: true,
          },
        });

        var events = await fastify.prisma.event_collaborators.count({
          where: {
            student_id: request.user.student_id,
            accepted_at: null,
          },
        });
        var resp = {};
        resp.friend_requests = JSON.parse(friends.friend_requests).length;
        resp.event_collaborators = events
        reply.send(resp);
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );
};
