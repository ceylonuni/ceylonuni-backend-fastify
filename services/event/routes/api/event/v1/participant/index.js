"use strict";

const moment = require("moment");

module.exports = async function (fastify, opts) {
  fastify.post(
    "/add",
    {
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Event"],
        body: {
          type: "object",
          properties: {
            event_id: {
              type: "integer",
            },
            status: {
              type: "string",
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var participant ={}
        var item = await fastify.prisma.participants.findMany({
          where: {
            student_id: request.user.student_id,
            event_id: request.body.event_id,
          },
        });
        if (item[0]) {
          if(item[0].status == request.body.status){
            participant = await fastify.prisma.participants.delete({
              where:{
                id:item[0].id
              }
            })
          }else{
            participant = await fastify.prisma.participants.update({
              where:{
                id:item[0].id
              },
              data: {
                status: request.body.status,
                updated_at: moment().toISOString(),
              },
            });
          }
        }else{
          participant = await fastify.prisma.participants.create({
            data: {
              event_id: request.body.event_id,
              student_id: request.user.student_id,
              status: request.body.status,
              created_at: moment().toISOString(),
              updated_at: moment().toISOString(),
            },
          });
        }
      
        reply.send(participant);
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );
};
