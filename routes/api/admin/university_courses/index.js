"use strict";
var moment = require('moment');
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
                where:{
                    deleted_at:null
                },
                include:{
                  universities:true,
                  courses:true,
                }
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
    };
    