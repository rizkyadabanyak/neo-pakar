const Jwt = require("@hapi/jwt");
const InvariantError = require("../exceptions/InvariantError");
const {jwtDecode} = require("jwt-decode");

const decodeJWTHelper = {

    decode: (header) => {

        const arrayHeader = header.split(" ");
        const decoded = jwtDecode(arrayHeader[1]);

        return decoded
    }
};

module.exports = decodeJWTHelper;