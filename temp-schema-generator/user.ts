import { body, defaultResponse, endpoint, request, response } from '@airtasker/spot';

import { ErrorResponse, UserLoginRequest, UserResponse } from './models';

@endpoint({
    method: "GET",
    path: "/user",
})
class GetUser {
    @response({ status: 200 })
    success(@body body: UserResponse) { }

    @response({ status: 403 })
    failure(@body body: ErrorResponse) { }
}

@endpoint({
    method: "POST",
    path: "/user/login",
})
class PostUserLogin {
    @request
    request(@body body: UserLoginRequest) { }

    @response({ status: 201 })
    success() { }

    @response({ status: 403 })
    failure(@body body: ErrorResponse) { }
}

@endpoint({
    method: "POST",
    path: "/user/logout",
})
class PostUserLogout {
    @response({ status: 201 })
    success() { }

    @defaultResponse
    default(@body body: ErrorResponse) { }
}

@endpoint({
    method: "GET",
    path: "/user/sections",
})
export class GetAllowedSections {
    @response({ status: 200 })
    successResponse(
        @body body: AllowedSectionsResponse
    ) { }

    @defaultResponse
    defaultResponse(
        @body body: ErrorResponse
    ) { }
}

export interface AllowedSectionsResponse {
    sections: string[];
}