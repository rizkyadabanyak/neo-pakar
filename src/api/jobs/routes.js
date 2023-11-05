const routes = (handler) => {
  return [
    {
      method: "POST",
      path: "/jobs/store",
      config: {
        auth: "user_jwt",
        payload: {
          parse: true,
          allow: 'multipart/form-data',
          multipart: {output: 'stream'},
        }
      },
      handler: handler.storeJobHandler,
    },{
      method: "PUT",
      path: "/jobs/update/{job_id}",
      config: {
        auth: "user_jwt",
        payload: {
          parse: true,
          allow: 'multipart/form-data',
          multipart: {output: 'stream'},
        }
      },
      handler: handler.updateJobHandler,
    },
    {
      method: "GET",
      path: "/jobs/getById/{job_id}",
      config: {
        auth: "user_jwt",
      },
      handler: handler.getJobByIdHandler,
    },{
      method: "GET",
      path: "/jobs/getBySlug/{slug}",
      config: {
        auth: "user_jwt",
      },
      handler: handler.getJobBySlugHandler,
    }
    ,{
      method: "DELETE",
      path: "/jobs/delete/{job_id}",
      config: {
        auth: "user_jwt",
      },
      handler: handler.deleteByIdHandler,
    },{
      method: "GET",
      path: "/jobs/getAllData",
      config: {
        auth: "user_jwt",
      },
      handler: handler.getAllJobHandler,
    },
  ];
};

module.exports = routes;
