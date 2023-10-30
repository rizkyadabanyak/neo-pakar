const routes = (handler) => {
  return [
    {
      method: "POST",
      path: "/timeExperiences/store",
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
      path: "/timeExperiences/update/{time_experience_id}",
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
      path: "/timeExperiences/getById/{time_experience_id}",
      config: {
        auth: "user_jwt",
      },
      handler: handler.getTimeExperienceByIdHandler,
    },{
      method: "DELETE",
      path: "/timeExperiences/delete/{time_experience_id}",
      config: {
        auth: "user_jwt",
      },
      handler: handler.deleteByIdHandler,
    },{
      method: "GET",
      path: "/timeExperiences/getAllData",
      config: {
        auth: "user_jwt",
      },
      handler: handler.getAllTimeExperienceHandler,
    },
  ];
};

module.exports = routes;
