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
      handler: handler.candidateAcceptedAppliedHandler,
    },{
      method: "POST",
      path: "/candidateJob/applyJob/{slug_job}",
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
      method: "POST",
      path: "/candidateJob/givenOffer",
      config: {
        auth: "user_jwt",
        payload: {
          parse: true,
          allow: 'multipart/form-data',
          multipart: {output: 'stream'},
        }
      },
      handler: handler.givenOfferHandler,
    },
    {
      method: "POST",
      path: "/candidateJob/acceptApplications",
      config: {
        auth: "user_jwt",
        payload: {
          parse: true,
          allow: 'multipart/form-data',
          multipart: {output: 'stream'},
        }
      },
      handler: handler.acceptApplicationsHandler,
    },
    {
      method: "POST",
      path: "/candidateJob/acceptOffers",
      config: {
        auth: "user_jwt",
        payload: {
          parse: true,
          allow: 'multipart/form-data',
          multipart: {output: 'stream'},
        }
      },
      handler: handler.acceptOffersHandler,
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
