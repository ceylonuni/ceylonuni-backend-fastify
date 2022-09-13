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
            var items = await fastify.prisma.courses.findMany({
                where:{
                    deleted_at:null
                },
              
            });
            
            reply.send(items);
          } catch (error) {
            reply.send(error);
          } finally {
            await fastify.prisma.$disconnect();
          }
        }
        );
    
    fastify.post(
          "/add",
          {
            schema: {
              tags: ["Admin"],
              body: {
                type: "object",
                required: ["name"],
                properties: {
                  name: {
                    type: "string",
                    default: "Name",
                  },
                },
              },
            },
          },
          async (request, reply) => {
            try {
      
              // var item = await fastify.prisma.courses.findUnique({
              //   where: {
              //     name: request.body.name,
              //   },
              // });
              // if (item) {
              //   throw new Error("The course is alreday registered.");
              // } else {
                
                var item = await fastify.prisma.courses.create({
                  data: {
                    name: request.body.name,
                    created_at:moment().toISOString(),
                    updated_at:moment().toISOString(),
                  },
                });

                ;
                reply.send(item);
              // }
              
            } catch (error) {
              reply.send(error);
            } finally {
              await fastify.prisma.$disconnect();
            }
          }
     );

     fastify.post(
      "/update",
      {
        schema: {
          tags: ["Admin"],
          body: {
            type: "object",
            required: ["id", "name"],
            properties: {
              id: {
                type: "integer",
                default: 1,
              },
              name: {
                type: "string",
                default: "name",
              },
            },
          },
        },
      },
      async (request, reply) => {
        try {
          var item = await fastify.prisma.courses.update({
            where: {
              id: request.body.id,
            },
            data: {
              name: request.body.name,
              updated_at:moment().toISOString(),
            },
          });
          reply.send(item);
        } catch (error) {
          reply.send(error);
        } finally {
          await fastify.prisma.$disconnect();
        }
      }
    );
};
    