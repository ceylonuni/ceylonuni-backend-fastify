"use strict";

const { v4: uuidv4 } = require("uuid");
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
            text: {
              type: "string",
            },
            event_id: {
              type: "integer",
            },
            video_url: {
              type: "string",
            },
            image_url: {
              type: "string",
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        if (
          !request.body.text &&
          !request.body.image_url &&
          !request.body.video_url
        ) {
          throw new Error("Body should be have at lest one content.");
        }
        var image_url = null
        var key = uuidv4()
        if(request.body.image_url){
          image_url = await fastify.image.upload({
            image_url: request.body.image_url,
            key:key,
          })  
        }
        
        var post = await fastify.prisma.posts.create({
          data: {
            student_id: request.user.student_id,
            key: key,
            text: request.body.text,
            event_id: request.body.event_id,
            image_url: image_url,
            video_url: request.body.video_url,
            created_at: moment().toISOString(),
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
  //get all own posts
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
        const results = await fastify.prisma.posts.findMany({
          where: {
            student_id: request.user.student_id,
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
