const routes = (handler) => {
  return [
    {
      method: "POST",
      path: "/skills",
      config: {
        auth: "user_jwt",
        payload: {
          parse: true,
          allow: 'multipart/form-data',
          multipart: {output: 'stream'},
        }
      },
      handler: handler.storeSkillHandler,
    },{
      method: "PUT",
      path: "/skills/{skill_id}",
      config: {
        auth: "user_jwt",
        payload: {
          parse: true,
          allow: 'multipart/form-data',
          multipart: {output: 'stream'},
        }
      },
      handler: handler.updateSkillHandler,
    },{
      method: "GET",
      path: "/skills/{skill_id}",
      config: {
        auth: "user_jwt",
      },
      handler: handler.getSkillByIdHandler,
    },{
      method: "DELETE",
      path: "/skills/{skill_id}",
      config: {
        auth: "user_jwt",
      },
      handler: handler.deleteByIdHandler,
    },{
      method: "GET",
      path: "/skills",
      config: {
        auth: "user_jwt",
      },
      handler: handler.getAllSkillHandler,
    },
  ];
};

module.exports = routes;
