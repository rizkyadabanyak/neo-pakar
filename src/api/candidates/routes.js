const routes = (handler) => {
  return [
    {
      method: "GET",
      path: "/candidates",
      config: {
        auth: "user_jwt",
      },
      handler: handler.getCandidateHandler,
    },
  ];
};

module.exports = routes;
