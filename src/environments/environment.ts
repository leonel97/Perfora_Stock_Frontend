// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  expirationTime: 5000000,
  backend: 'http://173.249.57.60:8081/api',
  backend2: 'http://127.0.0.1:8084/perfora-stock/v1',
  backend3: 'http://127.0.0.1:8084'
  //backend2: 'http://192.168.1.158:8080/perfora-stock/v1'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
