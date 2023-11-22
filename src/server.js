'use strict';
// mengimpor dotenv dan menjalankan konfigurasinya
require("dotenv").config();
const Path = require('path');
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


// jobs
const jobs = require("./api/jobs");
const JobsService = require("./services/postgres/JobsService");
const JobsValidator = require("./validator/jobs");

// candidateDetail
const candidateDetail = require("./api/candidateDetail");
const CandidateDetailService = require("./services/postgres/CandidateDetailService");
const CandidateDetailValidator = require("./validator/candidateDetail");

// companyDetail
const companyDetail = require("./api/companyDetail");
const CompanyDetailService = require("./services/postgres/CompanyDetailService");
const CompanyDetailValidator = require("./validator/comanyDetail");


// companyDetail
const candidateJobs = require("./api/candidateJobs");
const CandidateJobsService = require("./services/postgres/CandidateJobsService");
const CandidateJobsValidator = require("./validator/candidateJobs");


//candidate

const candidates = require("./api/candidates");
const CandidatesService = require("./services/postgres/CandidatesService");


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
    const jobService = new JobsService();
    const candidateDetailService = new CandidateDetailService();
    const companyDetailService = new CompanyDetailService();
    const candidateJobsService = new CandidateJobsService();
    const candidatesService = new CandidatesService();

    const authenticationsService = new AuthenticationsService();
    const server = Hapi.server({
        port: process.env.PORT_HOST,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ["*"],
            },

        },

    });
    await server.register(require('@hapi/inert'));
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
        },{
            plugin: jobs,
            options: {
                service: jobService,
                validator: JobsValidator,
            },
        },{
            plugin: candidateDetail,
            options: {
                service: candidateDetailService,
                validator: CandidateDetailValidator,
            },
        },{
            plugin: companyDetail,
            options: {
                service: companyDetailService,
                validator: CompanyDetailValidator,
            },
        },{
            plugin: candidateJobs,
            options: {
                service: candidateJobsService,
                validator: CandidateJobsValidator,
            },
        },
        {
            plugin: candidates,
            options: {
                service: candidatesService,
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
