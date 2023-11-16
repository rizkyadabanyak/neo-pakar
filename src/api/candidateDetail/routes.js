const routes = (handler) => {
  return [
    {
      method: "POST",
      path: "/candidateDetail",
      config: {
        auth: "user_jwt",
        payload: {
          parse: true,
          allow: 'multipart/form-data',
          multipart: {output: 'stream'},
        }
      },
      handler: handler.updateCandidateDetailHandler,
    },{
      method: "PUT",
      path: "/candidateDetail/{user_id}",
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
      path: "/candidateDetail",
      config: {
        auth: "user_jwt",
      },
      handler: handler.getCandidateDetailHandler,
    },
  ];
};

module.exports = routes;
