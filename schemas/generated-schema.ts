/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/install": {
    get: operations["GetInstall"];
    post: operations["PostInstall"];
  };
  "/install/database/validate": {
    post: operations["PostInstallValidateDatabase"];
  };
  "/server/status": {
    get: operations["GetStatus"];
  };
  "/server/version": {
    get: operations["GetVersion"];
  };
  "/user": {
    get: operations["GetUser"];
  };
  "/user/login": {
    post: operations["PostUserLogin"];
  };
  "/user/logout": {
    post: operations["PostUserLogout"];
  };
  "/user/sections": {
    get: operations["GetAllowedSections"];
  };
}

export interface components {
  schemas: {
    /** @enum {string} */
    ConsentLevel: "Minimal" | "Basic" | "Detailed";
    TelemetryModel: {
      level: components["schemas"]["ConsentLevel"];
      description: string;
    };
    UmbracoInstallerUserModel: {
      /** Format: float */
      minCharLength: number;
      /** Format: float */
      minNonAlphaNumericLength: number;
      consentLevels: components["schemas"]["TelemetryModel"][];
    };
    UmbracoInstallerDatabaseModel: {
      id: string;
      /** Format: float */
      sortOrder: number;
      displayName: string;
      defaultDatabaseName: string;
      providerName: string | null;
      isAvailable: boolean;
      requiresServer: boolean;
      serverPlaceholder: string | null;
      requiresCredentials: boolean;
      supportsIntegratedAuthentication: boolean;
      requiresConnectionTest: boolean;
    };
    UmbracoInstaller: {
      user: components["schemas"]["UmbracoInstallerUserModel"];
      databases: components["schemas"]["UmbracoInstallerDatabaseModel"][];
    };
    UmbracoPerformInstallDatabaseConfiguration: {
      server?: string | null;
      password?: string | null;
      username?: string | null;
      databaseName?: string | null;
      databaseType?: string | null;
      useIntegratedAuthentication?: boolean | null;
      connectionString?: string | null;
    };
    UmbracoPerformInstallRequest: {
      name: string;
      email: string;
      password: string;
      subscribeToNewsletter: boolean;
      telemetryLevel: components["schemas"]["ConsentLevel"];
      database: components["schemas"]["UmbracoPerformInstallDatabaseConfiguration"];
    };
    ProblemDetails: {
      type: string;
      /** Format: float */
      status: number;
      title?: string;
      detail?: string;
      instance?: string;
      errors?: { [key: string]: unknown };
    };
    StatusResponse: {
      installed: boolean;
    };
    VersionResponse: {
      version: string;
    };
    UserResponse: {
      username: string;
      role: string;
    };
    UserLoginRequest: {
      username: string;
      password: string;
      persist: boolean;
    };
    AllowedSectionsResponse: {
      sections: string[];
    };
  };
}

export interface operations {
  GetInstall: {
    responses: {
      /** 200 response */
      200: {
        content: {
          "application/json": components["schemas"]["UmbracoInstaller"];
        };
      };
    };
  };
  PostInstall: {
    parameters: {};
    responses: {
      /** 201 response */
      201: unknown;
      /** 400 response */
      400: {
        content: {
          "application/json": components["schemas"]["ProblemDetails"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UmbracoPerformInstallRequest"];
      };
    };
  };
  PostInstallValidateDatabase: {
    parameters: {};
    responses: {
      /** 201 response */
      201: unknown;
      /** 400 response */
      400: {
        content: {
          "application/json": components["schemas"]["ProblemDetails"];
        };
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["UmbracoPerformInstallDatabaseConfiguration"];
      };
    };
  };
  GetStatus: {
    responses: {
      /** 200 response */
      200: {
        content: {
          "application/json": components["schemas"]["StatusResponse"];
        };
      };
      /** default response */
      default: {
        content: {
          "application/json": components["schemas"]["ProblemDetails"];
        };
      };
    };
  };
  GetVersion: {
    responses: {
      /** 200 response */
      200: {
        content: {
          "application/json": components["schemas"]["VersionResponse"];
        };
      };
      /** default response */
      default: {
        content: {
          "application/json": components["schemas"]["ProblemDetails"];
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
          "application/json": components["schemas"]["ProblemDetails"];
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
          "application/json": components["schemas"]["ProblemDetails"];
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
          "application/json": components["schemas"]["ProblemDetails"];
        };
      };
    };
  };
  GetAllowedSections: {
    responses: {
      /** 200 response */
      200: {
        content: {
          "application/json": components["schemas"]["AllowedSectionsResponse"];
        };
      };
      /** default response */
      default: {
        content: {
          "application/json": components["schemas"]["ProblemDetails"];
        };
      };
    };
  };
}

export interface external {}
