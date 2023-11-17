const routes = (handler) => {
  return [
    {
      method: "POST",
      path: "/timeExperiences",
      config: {
        auth: "user_jwt",
        payload: {
          parse: true,
          allow: 'multipart/form-data',
          multipart: {output: 'stream'},
        }
      },
      handler: handler.storeTimeExperienceHandler,
    },{
      method: "PUT",
      path: "/timeExperiences/{time_experience_id}",
      config: {
        auth: "user_jwt",
        payload: {
          parse: true,
          allow: 'multipart/form-data',
          multipart: {output: 'stream'},
        }
      },
      handler: handler.updateTimeExperienceHandler,
    },{
      method: "GET",
      path: "/timeExperiences/{time_experience_id}",
      config: {
        auth: "user_jwt",
      },
      handler: handler.getTimeExperienceByIdHandler,
    },{
      method: "DELETE",
      path: "/timeExperiences/{time_experience_id}",
      config: {
        auth: "user_jwt",
      },
      handler: handler.deleteByIdHandler,
    },{
      method: "GET",
      path: "/timeExperiences",
      config: {
        auth: "user_jwt",
      },
      handler: handler.getAllTimeExperienceHandler,
    },
  ];
};

module.exports = routes;
