const Jwt = require("@hapi/jwt");
const InvariantError = require("../exceptions/InvariantError");
const {jwtDecode} = require("jwt-decode");
const fs = require("fs");

const uploadFileHelper = {

    getPagination: async (page, size) => {
        const limit = size ? +size : 10;
        const offset = page ? page * limit : 0;

        let data = []

        return { limit, offset };
    },

    getPagingData: async (models, page, limit) => {
        const { count: total, rows: data } = models;
        const currentPage = page ? +page : 0;
        const currentPageFront = page ? +page + Number(1) : Number(1);
        const totalPages = Math.ceil(total / limit - Number(1));
        const totalPagesFront = Math.ceil(total / limit);

        return {
            pagination: {
                total,
                totalPages,
                totalPagesFront,
                currentPage,
                currentPageFront,
            },
            data
        };
    },

};

module.exports = uploadFileHelper;