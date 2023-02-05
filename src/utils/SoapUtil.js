
export function getErrorMessageFromResponse(response) {
    var XMLParser = require('react-xml-parser');
    var xmlResponse = new XMLParser().parseFromString(response);
    const errorMessage = xmlResponse.getElementsByTagName('faultstring')[0].value;
    return errorMessage;
}

export function getSoapLoginRequest(username, password) {
    return '<soap11env:Envelope xmlns:soap11env="http://schemas.xmlsoap.org/soap/envelope/" xmlns:service="services.auth.soap">' +
        '<soap11env:Body>' +
            '<service:login>' + 
                '<service:username>' + username + '</service:username>' + 
                '<service:password>' + password + '</service:password>' +
            '</service:login>' + 
        '</soap11env:Body>' +
    '</soap11env:Envelope>'
}

export function getSoapUsersWithRolesRequest(jws) {
    return '<soap11env:Envelope xmlns:soap11env="http://schemas.xmlsoap.org/soap/envelope/" xmlns:service="services.auth.soap">' +
        '<soap11env:Body>' +
            '<service:get_all_users_with_their_roles>' + 
                '<service:jws>' + jws + '</service:jws>' +
            '</service:get_all_users_with_their_roles>' + 
        '</soap11env:Body>' +
    '</soap11env:Envelope>'
}

export function getSoapRemoveUserRequest(userId, jws) {
    return '<soap11env:Envelope xmlns:soap11env="http://schemas.xmlsoap.org/soap/envelope/" xmlns:service="services.auth.soap">' +
        '<soap11env:Body>' +
            '<service:delete_user>' + 
                '<service:id_of_user>' + userId + '</service:id_of_user>' +
                '<service:jws>' + jws + '</service:jws>' +
            '</service:delete_user>' + 
        '</soap11env:Body>' +
    '</soap11env:Envelope>'
}

export function getSoapAllRolesRequest(jws) {
    return '<soap11env:Envelope xmlns:soap11env="http://schemas.xmlsoap.org/soap/envelope/" xmlns:service="services.auth.soap">' +
        '<soap11env:Body>' +
            '<service:get_roles>' + 
                '<service:jws>' + jws + '</service:jws>' +
            '</service:get_roles>' + 
        '</soap11env:Body>' +
    '</soap11env:Envelope>'
}

export function getSoapAssignRoleToUserRequest(userId, rolesList, jws) {
    return '<soap11env:Envelope xmlns:soap11env="http://schemas.xmlsoap.org/soap/envelope/" xmlns:service="services.auth.soap">' +
        '<soap11env:Body>' +
            '<service:assign_roles_to_user>' + 
                '<service:user_id>' + userId + '</service:user_id>' +
                '<service:roles_list>' + rolesList + '</service:roles_list>' +
                '<service:jws>' + jws + '</service:jws>' +
            '</service:assign_roles_to_user>' + 
        '</soap11env:Body>' +
    '</soap11env:Envelope>'
}

export function getSoapRegisterRequest(username, password) {
    return '<soap11env:Envelope xmlns:soap11env="http://schemas.xmlsoap.org/soap/envelope/" xmlns:service="services.auth.soap">' +
        '<soap11env:Body>' +
            '<service:create_new_user>' + 
                '<service:username>' + username + '</service:username>' + 
                '<service:password>' + password + '</service:password>' +
            '</service:create_new_user>' + 
        '</soap11env:Body>' +
    '</soap11env:Envelope>'
}