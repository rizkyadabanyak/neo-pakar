const Jwt = require("@hapi/jwt");
const InvariantError = require("../exceptions/InvariantError");

const permissionsHelper = {

    listPermission: () => {
        const data = {
            master_skill : ['can_show_skill','can_edit_skill','can_delete_skill','can_all_operate_skill'],
            master_category : ['can_show_category','can_edit_category','can_delete_category','can_all_operate_category'],
        };

        return data
    }
};

module.exports = permissionsHelper;