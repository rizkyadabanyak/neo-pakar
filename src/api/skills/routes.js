const routes = (handler) => {
  return [
    {
      method: "POST",
      path: "/skills/store",
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
      path: "/skills/update/{skill_id}",
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
      path: "/skills/getById/{skill_id}",
      config: {
        auth: "user_jwt",
      },
      handler: handler.getSkillByIdHandler,
    },{
      method: "DELETE",
      path: "/skills/delete/{skill_id}",
      config: {
        auth: "user_jwt",
      },
      handler: handler.deleteByIdHandler,
    },{
      method: "GET",
      path: "/skills/getAllData",
      config: {
        auth: "user_jwt",
      },
      handler: handler.getAllSkillHandler,
    },
  ];
};

module.exports = routes;
