'use strict'
const fp = require("fastify-plugin")
const pack = require("./../package.json")

module.exports = fp(async function(fastify, opts) {
  const OAS3Format = {
    routePrefix: '/docs',
    hideUntagged: true,
    exposeRoute: true,
    openapi: {
      info: {
        title: 'Ceylonuni Auth Service API',
        version: pack.version,
      },
      tags: [
        {
          "name": "Auth",
          "description": "For Auth Use",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    uiConfig: {
      docExpansion: 'none',
      deepLinking: false
    },
    uiHooks: {
      onRequest: function(request, reply, next) { next(); },
      preHandler: function(request, reply, next) {
               next(); 
      }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  }
  fastify.register(require("@fastify/swagger"), OAS3Format)
})