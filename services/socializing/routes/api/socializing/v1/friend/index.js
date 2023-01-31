"use strict";
const moment = require("moment");
module.exports = async function (fastify, opts) {
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
        //get all friends ids
        var item = await fastify.prisma.students.findUnique({
          where: {
            id: request.user.student_id,
          },
          select: {
            friends: true,
          },
        });

        var friends_ids = JSON.parse(item.friends);

        const results = await fastify.prisma.students.findMany({
          where: {
            id: { in: friends_ids },
            deleted_at: null,
          },
          select: {
            id: true,
            first_name: true,
            last_name: true,
            accounts:{
              select:{
                username: true,
              }
            },
            university_courses: {
              select: {
                universities: {
                  select: {
                    name: true,
                  },
                },
                courses: {
                  select: {
                    name: true,
                  },
                },
              },
            },
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

  fastify.post(
    "/send-request",
    {
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Socializing"],
        body: {
          type: "object",
          required: ["student_id"], //2
          properties: {
            student_id: {
              type: "integer",
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {

        var my_friends = [];
        var send_requests = [];
        var friend_friends = [];
        var friend_friend_requests = [];

        //get student
        var student = await fastify.prisma.students.findUnique({
            where: {
              id: request.user.student_id, //1
            },
            select: {
              friends: true,
              send_requests: true,
            },
          });

          //get friend
          var friend = await fastify.prisma.students.findUnique({
            where: {
              id: request.body.student_id, //1
            },
            select: {
              friends:true,
              friend_requests: true,
            },
          });

          my_friends = JSON.parse(student.friends)
          friend_friends =JSON.parse(friend.friends)
          friend_friend_requests = JSON.parse(friend.friend_requests)
          send_requests = JSON.parse(student.send_requests)

        //check already in my_friends 
        const isInArray = my_friends.includes(request.body.student_id);
        if(isInArray){
          throw new Error("Alredy friend");
        }

         //check already in friend_friends
        const isInFriendArray = friend_friends.includes(request.user.student_id);
        if(isInFriendArray){
          throw new Error("Alredy friend");
          
        }

         //check already in friend_friend_requests
         const isInFriendRequestArray = friend_friend_requests.includes(request.user.student_id);
         if(isInFriendRequestArray){
          throw new Error("Alredy Request Send");
          
         }
        
      
        friend_friend_requests.push(request.user.student_id)
        send_requests.push(request.body.student_id)
        var friend = await fastify.prisma.students.update({
            where: {
              id: request.body.student_id,
            },
            data: {
              friend_requests: JSON.stringify(friend_friend_requests),
              updated_at: moment().toISOString(),
            },
          });

          var me = await fastify.prisma.students.update({
            where: {
              id: request.user.student_id,
            },
            data: {
              send_requests: JSON.stringify(send_requests),
              updated_at: moment().toISOString(),
            },
          });
        reply.send(friend);
          
        // var friends = [];
        // var student = await fastify.prisma.students.findUnique({
        //   where: {
        //     id: request.body.student_id, //2
        //   },
        //   select: {
        //     friend_requests: true,
        //   },
        // });
        // if (!student.friend_requests) {
        //   friends.push(request.user.student_id);
        //   friends = JSON.stringify(friends);
        // } else {
        //   friends = JSON.parse(student.friend_requests);
        //   friends.push(request.user.student_id);
        //   friends = JSON.stringify(friends);
        // }

        // var item = await fastify.prisma.students.update({
        //   where: {
        //     id: request.body.student_id,
        //   },
        //   data: {
        //     friend_requests: friends,
        //     updated_at: moment().toISOString(),
        //   },
        // });
        // reply.send({ message: "success" });
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );

  fastify.post(
    "/accept-request",
    {
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Socializing"],
        body: {
          type: "object",
          required: ["student_id"],
          properties: {
            student_id: {
              type: "integer",
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var my_friends = [];
        var friend_friends = [];
        var friend_requests = [];
        var send_requests = [];

        var user = await fastify.prisma.students.findUnique({
          where: {
            id: request.user.student_id,
          },
          select: {
            friends: true,
            friend_requests: true,
          },
        });

        var friend = await fastify.prisma.students.findUnique({
          where: {
            id: request.body.student_id,
          },
          select: {
            friends: true,
            send_requests: true,
          },
        });

       

        friend_requests = JSON.parse(user.friend_requests);
        my_friends = JSON.parse(user.friends);
        friend_friends = JSON.parse(friend.friends);
        send_requests = JSON.parse(friend.send_requests);
        
        //check already friends
        const isInArray = my_friends.includes(request.body.student_id);
        if(isInArray){
          throw new Error("Alredy friend");
        }else{
          my_friends.push(request.body.student_id)
        }

        //remove id from friend request 
        const index = friend_requests.indexOf(request.body.student_id);
        if (index > -1) {
          friend_requests.splice(index, 1); // 2nd parameter means remove one item only
        }

         //remove id from send request 
         const indexRequest = send_requests.indexOf(request.user.student_id);
         if (index > -1) {
           send_requests.splice(indexRequest, 1); // 2nd parameter means remove one item only
         }

        await fastify.prisma.students.update({
            where: {
              id: request.user.student_id,
            },
            data: {
              friends: JSON.stringify(my_friends),
              friend_requests: JSON.stringify(friend_requests),
              updated_at: moment().toISOString(),
            },
          });

          friend_friends.push(request.user.student_id)
          friend = await fastify.prisma.students.update({
            where: {
              id: request.body.student_id,
            },
            data: {
              friends: JSON.stringify(friend_friends),
              send_requests: JSON.stringify(send_requests),
              updated_at: moment().toISOString(),
            },
          });
        
          reply.send(friend);
        // var friends = [];
        // var my_friends = [];
        // var friend_requests = [];
        // var student = await fastify.prisma.students.findUnique({
        //   where: {
        //     id: request.body.student_id,  //1
        //   },
        //   select: {
        //     friend_requests: true,
        //     friends: true,
        //   },
        // });

        // var user = await fastify.prisma.students.findUnique({
        //   where: {
        //     id: request.user.student_id,
        //   },
        //   select: {
        //     friends: true,
        //   },
        // });
        // if (student.friends.length == 0) {
        //   friends.push(request.user.student_id);
        //   friends = JSON.stringify(friends);
        // } else {
        //   friends = JSON.parse(student.friends);
        //   friends.push(request.user.student_id);
        //   friends = JSON.stringify(friends);
        // }
        // if (user.friends.length == 0) {
        //   my_friends.push(request.body.student_id);
        //   my_friends = JSON.stringify(my_friends);
        // } else {
        //   my_friends = JSON.parse(student.friends);
        //   my_friends.push(request.body.student_id);
        //   my_friends = JSON.stringify(my_friends);
        // }
        // friend_requests = JSON.parse(student.friend_requests);
        // var index = friend_requests.indexOf(request.body.student_id);
        // if (index !== -1) {
        //   friend_requests.splice(index, 1);
        // }
        // await fastify.prisma.students.update({
        //   where: {
        //     id: request.body.student_id,
        //   },
        //   data: {
        //     friends: friends,
        //     friend_requests: JSON.stringify(friend_requests),
        //     updated_at: moment().toISOString(),
        //   },
        // });
        // await fastify.prisma.students.update({
        //   where: {
        //     id: request.user.student_id,
        //   },
        //   data: {
        //     friends: my_friends,
        //     updated_at: moment().toISOString(),
        //   },
        // });
        // reply.send({ message: "success" });
      } catch (error) {
        reply.send(error);
      } finally {
        await fastify.prisma.$disconnect();
      }
    }
  );
  fastify.post(
    "/reject-request",
    {
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Socializing"],
        body: {
          type: "object",
          required: ["student_id"],
          properties: {
            student_id: {
              type: "integer",
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var friend_requests = [];
        var send_requests = [];
        var student = await fastify.prisma.students.findUnique({
          where: {
            id: request.body.student_id,
          },
          select: {
            send_requests: true,
          },
        });

        var me = await fastify.prisma.students.findUnique({
          where: {
            id: request.user.student_id,
          },
          select: {
            friend_requests: true,
          },
        });
        send_requests = JSON.parse(student.send_requests);
        friend_requests = JSON.parse(me.friend_requests);
        var index = send_requests.indexOf(request.user.student_id);
        var indexMe = friend_requests.indexOf(request.body.student_id);
        if (index !== -1) {
          send_requests.splice(index, 1);
        }
        if (indexMe !== -1) {
          friend_requests.splice(indexMe, 1);
        }
        var item = await fastify.prisma.students.update({
          where: {
            id: request.body.student_id,
          },
          data: {
            send_requests: JSON.stringify(send_requests),
            updated_at: moment().toISOString(),
          },
        });

        await fastify.prisma.students.update({
          where: {
            id: request.user.student_id,
          },
          data: {
            friend_requests: JSON.stringify(friend_requests),
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
  fastify.post(
    "/cancel-request",
    {
      preValidation: [fastify.authenticate],
      schema: {
        security: [{ bearerAuth: [] }],
        tags: ["Socializing"],
        body: {
          type: "object",
          required: ["student_id"],
          properties: {
            student_id: {
              type: "integer",
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        var friend_requests = [];
        var send_requests = [];

        var me = await fastify.prisma.students.findUnique({
          where: {
            id: request.user.student_id,
          },
          select: {
            send_requests: true,
          },
        });

        var student = await fastify.prisma.students.findUnique({
          where: {
            id: request.body.student_id,
          },
          select: {
            friend_requests: true,
          },
        });
        friend_requests = JSON.parse(student.friend_requests);
        send_requests = JSON.parse(me.send_requests);
        var index = friend_requests.indexOf(request.user.student_id);
        var indexMe = send_requests.indexOf(request.body.student_id);
        if (index !== -1) {
          friend_requests.splice(index, 1);
        }
        if (indexMe !== -1) {
          send_requests.splice(indexMe, 1);
        }
        var item = await fastify.prisma.students.update({
          where: {
            id: request.body.student_id,
          },
          data: {
            friend_requests: JSON.stringify(friend_requests),
            updated_at: moment().toISOString(),
          },
        });

        await fastify.prisma.students.update({
          where: {
            id: request.user.student_id,
          },
          data: {
            send_requests: JSON.stringify(send_requests),
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
