const routes = (handler) => {
  return [
    {
      method: "POST",
      path: "/jobTypeWorks/store",
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
      path: "/jobTypeWorks/update/{job_type_work_id}",
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
      path: "/jobTypeWorks/getById/{job_type_work_id}",
      config: {
        auth: "user_jwt",
      },
      handler: handler.getJobTypeWorkByIdHandler,
    },{
      method: "DELETE",
      path: "/jobTypeWorks/delete/{job_type_work_id}",
      config: {
        auth: "user_jwt",
      },
      handler: handler.deleteByIdHandler,
    },{
      method: "GET",
      path: "/jobTypeWorks/getAllData",
      config: {
        auth: "user_jwt",
      },
      handler: handler.getAllJobTypeWorkHandler,
    },
  ];
};

module.exports = routes;
