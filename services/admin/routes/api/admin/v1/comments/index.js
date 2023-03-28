"use strict";
var moment = require("moment");
const { v4: uuidv4 } = require("uuid");

module.exports = async function (fastify, opts) {
  fastify.get(
    "/all",
    {
      preValidation: [fastify.authIsAdmin],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Admin"],
      },
    },
    async (request, reply) => {
      try {
        var items = await fastify.prisma.comments.findMany({
          where: {
            deleted_at: null,
          },
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

  fastify.post(
    "/add",
    {
      preValidation: [fastify.authIsAdmin],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Admin"],
        body: {
          type: "object",
          required: ["student_id"],
          properties: {
            student_id: {
              type: "integer",
              default: 1,
            },
            text: {
              type: "string",
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        if (
          !request.body.student_id &&
          !request.body.text &&
          !request.body.image_url &&
          !request.body.video_url
        ) {
          throw new Error("Body should be have at lest one content.");
        }

        var image_url = null;
        var key = uuidv4();

        if (request.body.image_url) {
          image_url = await fastify.image.upload({
            image_url: request.body.image_url,
            key: key,
          });
        }

        var post = await fastify.prisma.posts.create({
          data: {
            student_id: request.body.student_id,
            key: key,
            text: request.body.text,
            image_url: image_url,
            video_url: request.body.video_url,
            created_at: moment().toISOString(),
            updated_at: moment().toISOString(),
          },
        });

        reply.send(post);
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );

  // fastify.post(
  //   "/update",
  //   {
  //     schema: {
  //       tags: ["Admin"],
  //       body: {
  //         type: "object",
  //         required: ["id"],
  //         properties: {
  //           id: {
  //             type: "integer",
  //             default: 1,
  //           },
  //           text: {
  //             type: "string",
  //           },
  //           video_url: {
  //             type: "string",
  //           },
  //           image_url: {
  //             type: "string",
  //           },
  //         },
  //       },
  //     },
  //   },
  //   async (request, reply) => {
  //     try {
  //       var item = await fastify.prisma.posts.update({
  //         where: {
  //           id: request.body.id,
  //         },
  //         data: {
  //           text: request.body.text,
  //           updated_at: moment().toISOString(),
  //         },
  //       });
  //       reply.send(item);
  //     } catch (error) {
  //       reply.send(error);
  //     } finally {
  //       await fastify.prisma.$disconnect();
  //     }
  //   }
  // );

  fastify.post(
    "/delete",
    {
      preValidation: [fastify.authIsAdmin],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Admin"],
        body: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              default: 1,
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var item = await fastify.prisma.comments.update({
          where: {
            id: request.body.id,
          },
          data: {
            deleted_at: moment().toISOString(),
          },
        });

        reply.send("Comment Deleted");
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );
};
