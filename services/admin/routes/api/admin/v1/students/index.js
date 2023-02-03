"use strict";
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
            var items = await fastify.prisma.students.findMany({
                where:{
                    deleted_at:null
                }
            });
           
            reply.send(items);
          } catch (error) {
            reply.send(error);
          } finally {
            await fastify.prisma.$disconnect();
          }
        }
        );
    };
    