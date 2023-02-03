"use strict";
const test = require("tap");
var moment = require("moment");
const fastify = require("fastify")();

test("POST /resources", (t) => {
  const createResource = async (request, reply) => {
    try {
      var item = await fastify.prisma.courses.create({
        data: {
          name: request.body.name,
          created_at: moment().toISOString(),
          updated_at: moment().toISOString(),
        },
      });

      reply.send(item);
    } catch (error) {
      reply.send(error);
    } finally {
      await fastify.prisma.$disconnect();
    }
  };

  fastify.post("/crud", createResource);

  fastify.inject(
    {
      method: "POST",
      url: "/crud",
      payload: { name: "Test resource" },
    },
    (err, res) => {
      t.error(err);
      t.equal(res.statusCode, 201);
      t.deepEqual(JSON.parse(res.payload), { id: 1, name: "Test resource" });
      fastify.close();
      t.end();
    }
  );
});
