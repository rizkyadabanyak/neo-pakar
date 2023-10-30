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
            master_category : ['can_show_category','can_create_category','can_update_category','can_delete_category','can_all_operate_category'],
        };

        return data
    },

    cekPermission: async(role_id,permission) =>{
        const you_permission = await permissionsService.getYouPermission(role_id);

        const cek_can_access_everything = you_permission.includes("can_access_everything")
        const cek_all_permission_access = you_permission.includes(permission[1])
        const cek = you_permission.includes(permission[2])

        if (cek_can_access_everything==false && cek_all_permission_access==false && cek==false){
            throw new Forbidden("anda tidak memiliki access");
        }
    }
};

module.exports = permissionsHelper;