"use strict";
const moment = require("moment");
module.exports = async function (fastify, opts) {
  fastify.get(
    "/all",
    {
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Socializing"],
      },
    },
    async (request, reply) => {
      try {
        //get all friends ids
        var item = await fastify.prisma.students.findUnique({
          where: {
            id: request.user.student_id,
          },
          select: {
            friends: true,
          },
        });

        //convert to array
        var friends_id_array = JSON.parse(item.friends);

        //get active friends ids

        var active_ids = await fastify.prisma.students.findMany({
          where: {
            deleted_at: null,
          },
          select: {
            id: true,
          },
        });

         //convert to array
        var active_ids_array = active_ids.map((a) => a.id);

        //find active ads whithin friends list
        var active_friends_id_array = active_ids_array.filter((element) =>
          friends_id_array.includes(element)
        );
        //get active friends posts
        const results = await fastify.prisma.posts.findMany({
          where: {
            student_id: { in: active_friends_id_array },
          },
        });
        reply.send(results);
        // const myJSON = JSON.stringify(active_ids);

        // reply.send(results);
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );
};
