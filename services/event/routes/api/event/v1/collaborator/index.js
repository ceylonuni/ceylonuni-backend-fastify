"use strict";

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
            event_id: {
              type: "integer",
            },
            collaborator_id: {
              type: "integer",
            },
            
          },
        },
      },
    },
    async (request, reply) => {
      try {
        
        var item = await fastify.prisma.students.findMany({
          where: {
            id: request.body.collaborator_id, //1
          },
          select: {
            collaborator_request:true,
            
          },
        });

        let collaborator_request = item[0].collaborator_request
        collaborator_request = JSON.parse(collaborator_request)

        const isInArray = collaborator_request.includes(request.body.collaborator_id);
        if(isInArray){
          throw new Error("Alredy collaborator");
        }
      
        collaborator_request.push(request.user.student_id)

        item = await fastify.prisma.students.update({
          where: {
            id: request.body.collaborator_id
          },
          data: {
            collaborator_request: JSON.stringify(collaborator_request),
            updated_at: moment().toISOString(),
          },
        });
        
        let result= {
          student_id: JSON.stringify(request.user.student_id),
          event_id:JSON.stringify(request.body.event_id)

        }

      
       
        reply.send(result);

        
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );

  fastify.post(
    "/accept",
    {
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Event"],
        body: {
          type: "object",
          properties: {
            event_id: {
              type: "integer",
            },
            student_id: {
              type: "integer",
            },
            
          },
        },
      },
    },
    async (request, reply) => {
      try {
        // add studnet_id, event_id, accepeted_at to  event_colloborators
	      // remove studnet_id from  studnet.colloborator_request
        
        var item = await fastify.prisma.students.findUnique({
          where: {
            id: request.user.student_id, //1
          },
          select: {
            collaborator_request:true,
            
          },
        });

        let collaborator_request = item.collaborator_request
        collaborator_request = JSON.parse(collaborator_request)
         
        //remove id
        const isInArray = collaborator_request.includes(request.body.student_id);
        if(!isInArray){
          throw new Error("No request");
        }
        collaborator_request.splice(collaborator_request.indexOf(request.body.student_id), 1);
        
        
        var item = await fastify.prisma.students.update({
          where: {
            id: request.user.student_id, //1
          },
          data: {
            collaborator_request:JSON.stringify(collaborator_request),
            updated_at: moment().toISOString(),
          },
        });

      var event_collaborators = await fastify.prisma.event_collaborators.create({
          
          data: {
            //student_id, event_id, accepeted_at, created_at, 
            
            student_id: request.user.student_id,
            event_id: request.body.event_id,
            accepted_at: moment().toISOString(),
            created_at: moment().toISOString(),
            updated_at: moment().toISOString(),
          },
        });
        
        reply.send(event_collaborators);

        
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );

  fastify.post(
    "/delete",
    {
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Event"],
        body: {
          type: "object",
          properties: {
            
            event_id: {
              type: "integer",
            },
            student_id: {
              type: "integer",
            },
            
          },
        },
      },
    },
    async (request, reply) => {
      try {
        
        var item = await fastify.prisma.event_collaborators.findMany({
          where: {
            student_id: request.body.student_id,
            event_id: request.body.event_id
          
          },
          select: {
            id:true,
            deleted_at: true
          },
        });

        let id = item[0].id
       
        if(item[0].deleted_at){
          throw new Error("No student");
        }
     
        await fastify.prisma.event_collaborators.update({
          where: {
            id: id
          },
          data: {
            deleted_at: moment().toISOString(),
            updated_at: moment().toISOString(),
          },
        });
        
        reply.send({message: 'ok'});

        
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );


 
};
