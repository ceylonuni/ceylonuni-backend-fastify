"use strict";

const moment = require("moment");
module.exports = async function (fastify, opts) {
  //   fastify.get(
  //     "/all",
  //     {
  //       preValidation: [fastify.authenticate],
  //       schema: {
  //         security: [{ bearerAuth: [] }],
  //         tags: ["Socializing"],
  //         params: {
  //           type: "object",
  //           required: ["post_id"],
  //           properties: {
  //             post_id: {
  //               type: "integer",
  //               default: 1,
  //             },
  //           },
  //         },
  //       },
  //     },
  //     async (request, reply) => {
  //       try {
  //         var items = await fastify.prisma.comments.findMany({
  //           where: {
  //             deleted_at: null,
  //             post_id: request.params.post_id,
  //           },
  //         });
  //         reply.send(items);
  //       } catch (error) {
  //         reply.send(error);
  //       } finally {
  //         await fastify.prisma.$disconnect();
  //       }
  //     }
  //   );

  fastify.post(
    "/add",
    {
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Report"],
        body: {
          type: "object",
           // required: ["model, model_id, reason"],
          properties: {
            model: {
              type: "string",
            },
            model_id: {
              type: "integer",
              default: 1,
            },
            reason: {
              type: "string",
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        if (!request.body.model) {
          throw new Error(
            "Body should be have model(post | event ..) for reporting"
          );
        }

        if (!request.body.reason) {
          throw new Error("Body should be have Reason for reporting");
        }

        var report = await fastify.prisma.reports.create({
          data: {
            model: request.body.model,
            model_id: request.body.model_id,
            student_id: request.user.student_id,
            reason: request.body.reason,
            data: request.body.data,
            created_at: moment().toISOString(),
            updated_at: moment().toISOString(),
          },
        });

        console.log(report);
        reply.send({ message: "Report created" });
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }

      console.log(request.body);
    }
  );

  //   fastify.post(
  //     "/delete",
  //     {
  //       preValidation: [fastify.authenticate],
  //       schema: {
  //         security: [{ bearerAuth: [] }],
  //         tags: ["Socializing"],
  //         required: ["id"],
  //         params: {
  //           type: "object",
  //           required: ["post_id"],
  //           properties: {
  //             post_id: {
  //               type: "integer",
  //               default: 1,
  //             },
  //           },
  //         },
  //         body: {
  //           type: "object",
  //           properties: {
  //             id: {
  //               type: "integer",
  //               default: 1,
  //             },
  //           },
  //         },
  //       },
  //     },
  //     async (request, reply) => {
  //       try {
  //         var item = await fastify.prisma.comments.update({
  //           where: {
  //             id: request.body.id,
  //           },
  //           data: {
  //             deleted_at: moment().toISOString(),
  //           },
  //         });

  //         reply.send("Comment is successfully deleted");
  //       } catch (error) {
  //         reply.send(error);
  //       } finally {
  //         await fastify.prisma.$disconnect();
  //       }
  //     }
  //   );
};
