/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/init": {
    get: operations["GetInit"];
  };
  "/user/login": {
    post: operations["PostUserLogin"];
  };
  "/user/logout": {
    post: operations["PostUserLogout"];
  };
  "/user": {
    get: operations["GetUser"];
  };
  "/install": {
    post: operations["PostInstall"];
  };
}

export interface components {
  schemas: {
    InitResponse: {
      version: string;
      installed: boolean;
    };
    ErrorResponse: {
      errorMessage: string;
    };
    UserLoginRequest: {
      username: string;
      password: string;
      persist: boolean;
    };
    UserResponse: {
      username: string;
      role: string;
    };
  };
}

export interface operations {
  GetInit: {
    responses: {
      /** 200 response */
      200: {
        content: {
          "application/json": components["schemas"]["InitResponse"];
        };
      };
      /** default response */
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
    };
  };
  PostUserLogin: {
    parameters: {};
    responses: {
      /** 201 response */
      201: unknown;
      /** 403 response */
      403: {
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UserLoginRequest"];
      };
    };
  };
  PostUserLogout: {
    responses: {
      /** 201 response */
      201: unknown;
      /** default response */
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
    };
  };
  GetUser: {
    responses: {
      /** 200 response */
      200: {
        content: {
          "application/json": components["schemas"]["UserResponse"];
        };
      };
      /** 403 response */
      403: {
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
    };
  };
  PostInstall: {
    responses: {
      /** 201 response */
      201: unknown;
      /** default response */
      default: {
        content: {
          "application/json": components["schemas"]["ErrorResponse"];
        };
      };
    };
  };
}

export interface external {}