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

        //findMany method return array of objects
        //active_ids = [{"id": 2}, {  "id": 1}] type object
        //active_ids_array = [2,1] type object

        //add user id to ids list

        friends_ids.push(request.user.student_id);
        // reply.send(all_ids)
        console.log(request.user.student_id, friends_ids);

        //get active friends posts and own
        const results = await fastify.prisma.posts.findMany({
          where: {
            student_id: { in: friends_ids },
            deleted_at: null,
          },
          select: {
            id: true,
            key: true,
            text: true,
            image_url: true,
            video_url: true,
            like_count: true,
            created_at: true,
            students: {
              select: {
                first_name: true,
                last_name:true,
                image_url: true,
              },
            },
            comments:{
              select:{
                text:true,
                created_at:true,
                students: {
                  select: {
                    first_name: true,
                    last_name:true,
                    image_url: true,
                  },
                },
              }
            },
            likes:{
              select:{
                students: {
                  select: {
                    id:true,
                    first_name: true,
                    last_name:true,
                    image_url: true,
                  },
                },
              }
            }
          },
          orderBy: {
            id: "desc",
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