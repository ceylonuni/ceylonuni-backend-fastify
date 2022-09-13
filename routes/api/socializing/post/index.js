"use strict";

const { v4: uuidv4 } = require('uuid');
const moment = require("moment");
module.exports = async function (fastify, opts) {
  fastify.post(
    "/add",
    {
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Socializing"],
        body: {
          type: "object",
          properties: {
            text: {
              type: "string",
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
        var post = await fastify.prisma.posts.create({
          data: {
            student_id:request.user.student_id,
            key: uuidv4(),
            text:request.body.text,
            image_url:request.body.image_url,
            video_url:request.body.video_url,
            like_count:0,
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
};