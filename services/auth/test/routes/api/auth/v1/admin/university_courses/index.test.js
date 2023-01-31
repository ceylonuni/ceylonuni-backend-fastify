const test = require("tape");
const fastify = require("fastify")();

test("POST /resources", (t) => {
  // const createResource = async (req, res) => {
  //   // logic for creating a new resource
  //   res.status(201).send({ id: 1, name: "Test resource" });
  // };
  // fastify.post("/resources", createResource);

  fastify.inject(
    {
      method: "POST",
      url: "/services/auth/routes/api/auth/v1/admin/course/add",
      payload: { name: "Test Course" },
    },
    (err, res) => {
      t.error(err);
      t.equal(res.statusCode, 201);
      t.deepEqual(JSON.parse(res.payload), { id: 1, name: "Test Course" });
      fastify.close();
      t.end();
    }
  );
});
