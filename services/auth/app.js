"use strict";

const path = require("path");
const AutoLoad = require("@fastify/autoload");

const fastifyEnv = require("@fastify/env");
const schema = {
  type: "object",
  required: ["DATABASE_URL","EMAIL_HOST_USER","EMAIL_HOST_PASSWORD","CLOULD_API_SECRET","CLOULD_API_KEY","CLOULD_NAME"],
  properties: {
    DATABASE_URL: {
      type: "string",
    },
    EMAIL_HOST_USER: {
      type: "string",
    },
    EMAIL_HOST_PASSWORD: {
      type: "string",
    },
    CLOULD_API_SECRET: {
      type: "string",
    },
    CLOULD_API_KEY: {
      type: "string",
    },
    CLOULD_NAME: {
      type: "string",
    },
  },
};
const options = {
  schema: schema,
  dotenv: true,
};
module.exports = async function (fastify, opts) {
  fastify.register(fastifyEnv, options).after((err) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    fastify.register(AutoLoad, {
      dir: path.join(__dirname, "plugins"),
      options: Object.assign({}, opts),
    });

    // This loads all plugins defined in routes
    // define your routes in one of these
    fastify.register(AutoLoad, {
      dir: path.join(__dirname, "routes"),
      options: Object.assign({}, opts),
      routeParams: true,
    });
  });
};
