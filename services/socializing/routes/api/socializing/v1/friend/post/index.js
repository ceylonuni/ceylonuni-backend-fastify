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

        //findunique method return one object
        // item = { "friends": "[1, 2]" } type object
        // item.friends = [1, 2] type string
        // item.friends = JSON.parse(item.friends) type object

        //convert to array

        var friends_ids = JSON.parse(item.friends); // [1, 2] type object

        //get active friends ids

        var active_ids = await fastify.prisma.students.findMany({
          where: {
            deleted_at: null,
          },
          select: {
            id: true,
          },
        });

        //findMany method return array of objects
        //active_ids = [{"id": 2}, {  "id": 1}] type object
        //active_ids_array = [2,1] type object

        var active_ids = active_ids.map((a) => a.id); //[2,1] type object

        //find active ads whithin friends list
        var active_friends_ids = active_ids.filter(
          (
            element //active_friend_ids contains all active friends for the user
          ) => friends_ids.includes(element)
        );


        //get active friends posts 
        const results = await fastify.prisma.posts.findMany({
          where: {
            student_id: { in: active_friends_ids },
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
