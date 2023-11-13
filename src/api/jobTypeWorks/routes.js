const routes = (handler) => {
  return [
    {
      method: "POST",
      path: "/jobTypeWorks",
      config: {
        auth: "user_jwt",
        payload: {
          parse: true,
          allow: 'multipart/form-data',
          multipart: {output: 'stream'},
        }
      },
      handler: handler.storeJobTypeWorkHandler,
    },{
      method: "PUT",
      path: "/jobTypeWorks/{job_type_work_id}",
      config: {
        auth: "user_jwt",
        payload: {
          parse: true,
          allow: 'multipart/form-data',
          multipart: {output: 'stream'},
        }
      },
      handler: handler.updateJobTypeWorkHandler,
    },{
      method: "GET",
      path: "/jobTypeWorks/{job_type_work_id}",
      config: {
        auth: "user_jwt",
      },
      handler: handler.getJobTypeWorkByIdHandler,
    },{
      method: "DELETE",
      path: "/jobTypeWorks/{job_type_work_id}",
      config: {
        auth: "user_jwt",
      },
      handler: handler.deleteByIdHandler,
    },{
      method: "GET",
      path: "/jobTypeWorks",
      config: {
        auth: "user_jwt",
      },
      handler: handler.getAllJobTypeWorkHandler,
    },
  ];
};

module.exports = routes;
