"use strict";
const moment = require("moment");
module.exports = async function (fastify, opts) {
  fastify.post(
    "/send-request",
    {
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Socializing"],
        body: {
          type: "object",
          required: ["student_id"],
          properties: {
            student_id: {
              type: "integer",
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var friends = [];
        var student = await fastify.prisma.students.findUnique({
          where: {
            id: request.body.student_id,
          },
          select: {
            friend_requests: true,
          },
        });
        if (!student.friend_requests) {
          friends.push(request.user.student_id);
          friends = JSON.stringify(friends)
        }else{
          friends = JSON.parse(student.friend_requests)
          friends.push(request.user.student_id)
          friends= JSON.stringify(friends)
        }
     
        var item = await fastify.prisma.students.update({
          where:{
            id:request.body.student_id
          },
          data: {
            friend_requests:friends,
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
