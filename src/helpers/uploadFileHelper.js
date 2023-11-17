const Jwt = require("@hapi/jwt");
const InvariantError = require("../exceptions/InvariantError");
const {jwtDecode} = require("jwt-decode");
const fs = require("fs");

const uploadFileHelper = {

    upload: async (file_tmp,path_tmp,username) => {
        var random = Math.floor(Math.random() * 99999);
        const filename = file_tmp.hapi.filename;
        const array_filename = filename.split(".");
        const name = path_tmp+'/'+username +'_'+ random +'.'+ array_filename[1];

        const path = "./public/uploads/" + name;
        const path_save_db = "public/uploads/" + name;
        const file = fs.createWriteStream(path);

        file.on('error', (err) => console.error(err));

        file_tmp.pipe(file);

        file_tmp.on('end', (err) => {
            const ret = {
                filename: file_tmp.hapi.filename,
                headers: file_tmp.hapi.headers
            }
        })
        return path_save_db;
    }
};

module.exports = uploadFileHelper;