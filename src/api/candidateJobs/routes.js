const routes = (handler) => {
  return [
    {
      method: "POST",
      path: "/candidateJob/candidateAcceptedApplied/{slug_job}",
      config: {
        auth: "user_jwt",
        payload: {
          parse: true,
          allow: 'multipart/form-data',
          multipart: {output: 'stream'},
        }
      },
      handler: handler.candidateAcceptedApplieddHandler,
    },{
      method: "POST",
      path: "/candidateJob/{slug_job}",
      config: {
        auth: "user_jwt",
        payload: {
          parse: true,
          allow: 'multipart/form-data',
          multipart: {output: 'stream'},
        }
      },
      handler: handler.applyJobsHandler,
    },
    {
      method: "GET",
      path: "/candidateJob",
      config: {
        auth: "user_jwt",
      },
      handler: handler.showApplyJobsHandler,
    },

  ];
};

module.exports = routes;
