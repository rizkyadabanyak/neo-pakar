const Jwt = require("@hapi/jwt");
const InvariantError = require("../exceptions/InvariantError");
const Forbidden = require("../exceptions/Forbidden");
const PermissionsService = require("../services/postgres/PermissionsService");
const permissionsService = new PermissionsService();
const decodeJWTHelper = require("../helpers/decodeJWTHelper");

const permissionsHelper = {

    listPermission: () => {
        const data = {
            everything : ['can_access_everything'],
            master_role : ['can_show_role','can_create_role','can_update_role','can_delete_role','can_all_operate_role'],
            master_skill : ['can_show_skill','can_create_skill','can_update_skill','can_delete_skill','can_all_operate_skill'],
            master_permission : ['can_show_permission','can_set_permission','can_all_operate_permission'],
            master_qualification : ['can_show_qualification','can_create_qualification','can_update_qualification','can_delete_qualification','can_all_operate_qualification'],
            master_job_type_work : ['can_show_job_type_work','can_create_job_type_work','can_update_job_type_work','can_delete_job_type_work','can_all_operate_job_type_work'],
            master_time_experience : ['can_show_time_experience','can_create_time_experience','can_update_time_experience','can_delete_time_experience','can_all_operate_time_experience'],
            master_career_level : ['can_show_career_level','can_create_career_level','can_update_career_level','can_delete_career_level','can_all_operate_career_level'],
            master_job : ['can_show_job','can_create_job','can_update_job','can_delete_job','can_all_operate_job'],
            candidate_behavior : ['can_show_detail_profile','can_update_profile_candidate_behavior','can_add_skill_candidate_behavior','can_apply_job_candidate','can_show_apply_job_candidate','can_all_candidate_behavior'],
            company_behavior : ['can_show_detail_profile_company','can_update_profile_company_behavior','can_given_offer_company_behavior','can_show_apply_job_company_behavior','can_show_candidate','can_all_company_behavior'],
        };
        return data;
    },

    cekPermission: async(role_id,permission) =>{
        const you_permission = await permissionsService.getYouPermission(role_id);

        const cek_can_access_everything = you_permission.includes("can_access_everything")
        const cek_all_permission_access = you_permission.includes(permission[0])
        const cek = you_permission.includes(permission[1])

        // console.log(cek_all_permission_access);


        if (cek_can_access_everything==false && cek_all_permission_access==false && cek==false){
            throw new Forbidden("anda tidak memiliki access");
        }
    }

};

module.exports = permissionsHelper;