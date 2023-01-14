'use strict'

const fp = require('fastify-plugin')

// the use of fastify-plugin is required to be able
// to export the decorators to the outer scope

module.exports = fp(async function (fastify, opts) {
  // fastify.register(require('fastify-mailer'), {
  //   defaults: { from: 'Ceylonuni'},
  //   transport: {
  //     host: 'smtp.gmail.com',
  //     port: 587,
  //     secure: true, // use TLS
  //     auth: {
  //       user: 'niroshmedia@gmail.com',
  //       pass: 'hngnrfkjdpqcpyub'
  //     }
  //   }
  // })
})
