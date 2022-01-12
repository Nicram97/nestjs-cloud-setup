import actuator from 'express-actuator';

/**
 *
        Endpoints
    ID 	        Description
    info 	    Displays application information.
    metrics 	Shows metrics information for the current application.
    health 	    Shows application health information.
 */
export const actuatorOptions: actuator.Options = {
  basePath: '/actuator',
  infoGitMode: 'simple',
  infoBuildOptions: null,
  infoDateFormat: null,
  customEndpoints: [],
};
