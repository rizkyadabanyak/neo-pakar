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

// companies
const companies = require("./api/companies");
const CompaniesService = require("./services/postgres/CompaniesService");
const CompaniesValidator = require("./validator/companies");

//candidates
const candidates = require("./api/candidates");
const CandidatesService = require("./services/postgres/CandidatesService");
const CandidateValidator = require("./validator/candidates");

// authentications company
const authenticationsCompany = require("./api/authentications/company");
const AuthenticationsServiceCompany = require("./services/postgres/auths/company/AuthenticationsService");
const TokenManagerCompany = require("./tokenize/company/TokenManager");

// authentications candidate
const authenticationsCandidate = require("./api/authentications/candidate");
const AuthenticationsServiceCandidate = require("./services/postgres/auths/candidate/AuthenticationsService");
const TokenManagerCandidate = require("./tokenize/candidate/TokenManager");


const AuthenticationsValidator = require("./validator/authentications");

const init = async () => {

    const usersService = new UsersService();
    const companiesService = new CompaniesService();
    const candidatesService = new CandidatesService();
    const authenticationsServiceCompany = new AuthenticationsServiceCompany();
    const authenticationsServiceCandidate = new AuthenticationsServiceCandidate();

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
    server.auth.strategy("company_jwt", "jwt", {
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
    server.auth.strategy("candidate_jwt", "jwt", {
        keys: process.env.ACCESS_TOKEN_KEY_CANDIDATE,
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
        },{
            plugin: companies,
            options: {
                service: companiesService,
                validator: CompaniesValidator,
            },
        },
        {
            plugin: authenticationsCompany,
            options: {
                authenticationsServiceCompany,
                companiesService,
                tokenManager: TokenManagerCompany,
                validator: AuthenticationsValidator,
            },
        },
        {
            plugin: authenticationsCandidate,
            options: {
                authenticationsServiceCandidate,
                candidatesService,
                tokenManager: TokenManagerCandidate,
                validator: AuthenticationsValidator,
            },
        },
    ]);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
