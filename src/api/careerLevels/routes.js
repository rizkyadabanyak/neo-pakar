const routes = (handler) => {
  return [
    {
      method: "POST",
      path: "/careerLevels",
      config: {
        auth: "user_jwt",
        payload: {
          parse: true,
          allow: 'multipart/form-data',
          multipart: {output: 'stream'},
        }
      },
      handler: handler.storeCareerLevelHandler,
    },{
      method: "PUT",
      path: "/careerLevels/{career_level_id}",
      config: {
        auth: "user_jwt",
        payload: {
          parse: true,
          allow: 'multipart/form-data',
          multipart: {output: 'stream'},
        }
      },
      handler: handler.updateCareerLevelHandler,
    },{
      method: "GET",
      path: "/careerLevels/{career_level_id}",
      config: {
        auth: "user_jwt",
      },
      handler: handler.getCareerLevelByIdHandler,
    },{
      method: "DELETE",
      path: "/careerLevels/{career_level_id}",
      config: {
        auth: "user_jwt",
      },
      handler: handler.deleteByIdHandler,
    },{
      method: "GET",
      path: "/careerLevels",
      config: {
        auth: "user_jwt",
      },
      handler: handler.getAllCareerLevelHandler,
    },
  ];
};

module.exports = routes;
