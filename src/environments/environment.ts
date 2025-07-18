// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    // apiUrl: 'http://192.168.0.107:443/api/', // Development
    // apiUrl: 'http://192.168.3.13:8080/api/',  // office Development
    // apiUrl: 'http://raonazariqbal.nayatel.net:8080/api',
    apiUrl: 'http://127.0.0.1:8000/', // django env
    apiKey: '1234567890abcdef'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.