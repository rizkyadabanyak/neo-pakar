'use strict';
// mengimpor dotenv dan menjalankan konfigurasinya
require("dotenv").config();

const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");
const config = require('../src/database/config');

// users
const users = require("./api/users");
const UsersService = require("./services/postgres/UsersService");
const UsersValidator = require("./validator/users");

// authentications
const authentications = require("./api/authentications");
const AuthenticationsService = require("./services/postgres/auths/AuthenticationsService");
const TokenManagerCompany = require("./tokenize/TokenManager");



const AuthenticationsValidator = require("./validator/authentications");

const init = async () => {

    const usersService = new UsersService();
    const authenticationsService = new AuthenticationsService();
    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ["*"],
            },
        },
    });

    // registrasi plugin eksternal
    await server.register([
        {
            plugin: Jwt,
        },
        {
            plugin: require('hapi-pgsql'),
            options: {
                database_url: process.env.DATABASE_URL,
            }
        },
    ]);

    (async () => {
        await config.db.sync();
    })();

    // mendefinisikan strategy otentikasi jwt
    server.auth.strategy("user_jwt", "jwt", {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id,
            },
        }),
    });


    await server.register([
        {
            plugin: users,
            options: {
                service: usersService,
                validator: UsersValidator,
            },
        },
        {
            plugin: authentications,
            options: {
                authenticationsService,
                usersService,
                tokenManager: TokenManagerCompany,
                validator: AuthenticationsValidator,
            },
        },
        // {
        //     plugin: authenticationsCandidate,
        //     options: {
        //         authenticationsServiceCandidate,
        //         candidatesService,
        //         tokenManager: TokenManagerCandidate,
        //         validator: AuthenticationsValidator,
        //     },
        // },
    ]);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
