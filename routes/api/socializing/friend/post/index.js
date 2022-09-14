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

        //get friends posts
        var friends_id_array = JSON.parse(item.friends);
        const results = await fastify.prisma.posts.findMany({
          where: {
            student_id: { in: friends_id_array },
          },
        });

        //get active friends ids

        var active_ids = await fastify.prisma.students.findMany({
          where: {
            deleted_at: null,
          },
          select: {
            id: true,
          },
        });

        let active_ids_array = active_ids.map(a => a.id);

        var last_array = friends_id_array.filter( function( el ) {
            return active_ids.includes( el );
          } );
        reply.send(last_array);
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
