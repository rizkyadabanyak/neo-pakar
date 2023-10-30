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

// permissions master
const permissions = require("./api/permissions");
const PermissionsService = require("./services/postgres/PermissionsService");
const PermissionsValidator = require("./validator/permissions");

// roles master
const roles = require("./api/roles");
const RolesService = require("./services/postgres/RolesService");
const RolesValidator = require("./validator/roles");

// skills master
const skills = require("./api/skills");
const SkillsService = require("./services/postgres/SkillsService");
const SkillsValidator = require("./validator/skills");

// qualifications master
const qualifications = require("./api/qualifications");
const QualificationsService = require("./services/postgres/QualificaitonsService");
const QualificationsValidator = require("./validator/qualifications");

// jobTypeWorks master
const jobTypeWorks = require("./api/jobTypeWorks");
const JobTypeWorksService = require("./services/postgres/JobTypeWorksService");

// time experience master
const timeExperiences = require("./api/timeExperiences");
const TimeExperiencesService = require("./services/postgres/TimeExperiencesService");

// Career level master
const careerLevels = require("./api/careerLevels");
const CareerLevelService = require("./services/postgres/CareerLevelService");

// base master validator
const MasterDataValidator = require("./validator/masterData");

const AuthenticationsValidator = require("./validator/authentications");

const init = async () => {

    const usersService = new UsersService();
    const permissionService = new PermissionsService();
    const rolesService = new RolesService();
    const skillsService = new SkillsService();
    const qualificationsService = new QualificationsService();
    const jobTypeWorksService = new JobTypeWorksService();
    const timeExperiencesService = new TimeExperiencesService();
    const careerLevelService = new CareerLevelService();

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
        {
            plugin: permissions,
            options: {
                service: permissionService,
                validator: PermissionsValidator,
            },
        },
        {
            plugin: roles,
            options: {
                service: rolesService,
                validator: RolesValidator,
            },
        },{
            plugin: skills,
            options: {
                service: skillsService,
                validator: SkillsValidator,
            },
        },{
            plugin: qualifications,
            options: {
                service: qualificationsService,
                validator: QualificationsValidator,
            },
        },{
            plugin: jobTypeWorks,
            options: {
                service: jobTypeWorksService,
                validator: MasterDataValidator,
            },
        },{
            plugin: timeExperiences,
            options: {
                service: timeExperiencesService,
                validator: MasterDataValidator,
            },
        },{
            plugin: careerLevels,
            options: {
                service: careerLevelService,
                validator: MasterDataValidator,
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
