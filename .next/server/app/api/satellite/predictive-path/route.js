/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/satellite/predictive-path/route";
exports.ids = ["app/api/satellite/predictive-path/route"];
exports.modules = {

/***/ "(rsc)/./app/api/satellite/predictive-path/route.ts":
/*!****************************************************!*\
  !*** ./app/api/satellite/predictive-path/route.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n\n// Mock function to simulate AI-powered predictive pathing\nconst generatePredictivePath = (disaster)=>{\n    const { lat, lng } = disaster.location;\n    const path = [];\n    let currentLat = lat;\n    let currentLng = lng;\n    // Simulate a path moving in a general direction with some randomness\n    const angle = Math.random() * 2 * Math.PI;\n    const speed = Math.random() * 0.05 + 0.02; // degrees per hour\n    for(let i = 1; i <= 48; i++){\n        currentLat += Math.sin(angle) * speed + (Math.random() - 0.5) * 0.01;\n        currentLng += Math.cos(angle) * speed + (Math.random() - 0.5) * 0.01;\n        path.push({\n            lat: currentLat,\n            lng: currentLng,\n            timestamp: new Date(Date.now() + i * 3600 * 1000).toISOString()\n        });\n    }\n    return {\n        disasterId: disaster.id,\n        predictedPath: path,\n        confidence: Math.random() * 0.3 + 0.65\n    };\n};\nasync function POST(request) {\n    try {\n        let disaster;\n        try {\n            disaster = await request.json();\n        } catch (jsonError) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Invalid JSON in request body.'\n            }, {\n                status: 400\n            });\n        }\n        if (!disaster || !disaster.location) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Invalid disaster data provided.'\n            }, {\n                status: 400\n            });\n        }\n        const predictivePath = generatePredictivePath(disaster);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(predictivePath);\n    } catch (error) {\n        console.error('Predictive path API error:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed to generate predictive path.'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3NhdGVsbGl0ZS9wcmVkaWN0aXZlLXBhdGgvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBMkM7QUFFM0MsMERBQTBEO0FBQzFELE1BQU1DLHlCQUF5QixDQUFDQztJQUM5QixNQUFNLEVBQUVDLEdBQUcsRUFBRUMsR0FBRyxFQUFFLEdBQUdGLFNBQVNHLFFBQVE7SUFDdEMsTUFBTUMsT0FBTyxFQUFFO0lBQ2YsSUFBSUMsYUFBYUo7SUFDakIsSUFBSUssYUFBYUo7SUFFakIscUVBQXFFO0lBQ3JFLE1BQU1LLFFBQVFDLEtBQUtDLE1BQU0sS0FBSyxJQUFJRCxLQUFLRSxFQUFFO0lBQ3pDLE1BQU1DLFFBQVEsS0FBTUYsTUFBTSxLQUFLLE9BQVEsTUFBTSxtQkFBbUI7SUFFaEUsSUFBSyxJQUFJRyxJQUFJLEdBQUdBLEtBQUssSUFBSUEsSUFBSztRQUM1QlAsY0FBY0csS0FBS0ssR0FBRyxDQUFDTixTQUFTSSxRQUFRLENBQUNILEtBQUtDLE1BQU0sS0FBSyxHQUFFLElBQUs7UUFDaEVILGNBQWNFLEtBQUtNLEdBQUcsQ0FBQ1AsU0FBU0ksUUFBUSxDQUFDSCxLQUFLQyxNQUFNLEtBQUssR0FBRSxJQUFLO1FBQ2hFTCxLQUFLVyxJQUFJLENBQUM7WUFDUmQsS0FBS0k7WUFDTEgsS0FBS0k7WUFDTFUsV0FBVyxJQUFJQyxLQUFLQSxLQUFLQyxHQUFHLEtBQUtOLElBQUksT0FBTyxNQUFNTyxXQUFXO1FBQy9EO0lBQ0Y7SUFFQSxPQUFPO1FBQ0xDLFlBQVlwQixTQUFTcUIsRUFBRTtRQUN2QkMsZUFBZWxCO1FBQ2ZtQixZQUFZZixLQUFLQyxNQUFNLEtBQUssTUFBTTtJQUNwQztBQUNGO0FBRU8sZUFBZWUsS0FBS0MsT0FBZ0I7SUFDekMsSUFBSTtRQUNGLElBQUl6QjtRQUNKLElBQUk7WUFDRkEsV0FBVyxNQUFNeUIsUUFBUUMsSUFBSTtRQUMvQixFQUFFLE9BQU9DLFdBQVc7WUFDbEIsT0FBTzdCLHFEQUFZQSxDQUFDNEIsSUFBSSxDQUFDO2dCQUFFRSxPQUFPO1lBQWdDLEdBQUc7Z0JBQUVDLFFBQVE7WUFBSTtRQUNyRjtRQUVBLElBQUksQ0FBQzdCLFlBQVksQ0FBQ0EsU0FBU0csUUFBUSxFQUFFO1lBQ25DLE9BQU9MLHFEQUFZQSxDQUFDNEIsSUFBSSxDQUFDO2dCQUFFRSxPQUFPO1lBQWtDLEdBQUc7Z0JBQUVDLFFBQVE7WUFBSTtRQUN2RjtRQUVBLE1BQU1DLGlCQUFpQi9CLHVCQUF1QkM7UUFDOUMsT0FBT0YscURBQVlBLENBQUM0QixJQUFJLENBQUNJO0lBRTNCLEVBQUUsT0FBT0YsT0FBTztRQUNkRyxRQUFRSCxLQUFLLENBQUMsOEJBQThCQTtRQUM1QyxPQUFPOUIscURBQVlBLENBQUM0QixJQUFJLENBQUM7WUFBRUUsT0FBTztRQUFzQyxHQUFHO1lBQUVDLFFBQVE7UUFBSTtJQUMzRjtBQUNGIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXEFTVVNcXERvd25sb2Fkc1xcZGlzYXN0ZXItZGFzaGJvYXJkXFxhcHBcXGFwaVxcc2F0ZWxsaXRlXFxwcmVkaWN0aXZlLXBhdGhcXHJvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJztcblxuLy8gTW9jayBmdW5jdGlvbiB0byBzaW11bGF0ZSBBSS1wb3dlcmVkIHByZWRpY3RpdmUgcGF0aGluZ1xuY29uc3QgZ2VuZXJhdGVQcmVkaWN0aXZlUGF0aCA9IChkaXNhc3RlcjogYW55KSA9PiB7XG4gIGNvbnN0IHsgbGF0LCBsbmcgfSA9IGRpc2FzdGVyLmxvY2F0aW9uO1xuICBjb25zdCBwYXRoID0gW107XG4gIGxldCBjdXJyZW50TGF0ID0gbGF0O1xuICBsZXQgY3VycmVudExuZyA9IGxuZztcblxuICAvLyBTaW11bGF0ZSBhIHBhdGggbW92aW5nIGluIGEgZ2VuZXJhbCBkaXJlY3Rpb24gd2l0aCBzb21lIHJhbmRvbW5lc3NcbiAgY29uc3QgYW5nbGUgPSBNYXRoLnJhbmRvbSgpICogMiAqIE1hdGguUEk7XG4gIGNvbnN0IHNwZWVkID0gKE1hdGgucmFuZG9tKCkgKiAwLjA1KSArIDAuMDI7IC8vIGRlZ3JlZXMgcGVyIGhvdXJcblxuICBmb3IgKGxldCBpID0gMTsgaSA8PSA0ODsgaSsrKSB7IC8vIDQ4IGhvdXJzIHByZWRpY3Rpb25cbiAgICBjdXJyZW50TGF0ICs9IE1hdGguc2luKGFuZ2xlKSAqIHNwZWVkICsgKE1hdGgucmFuZG9tKCkgLSAwLjUpICogMC4wMTtcbiAgICBjdXJyZW50TG5nICs9IE1hdGguY29zKGFuZ2xlKSAqIHNwZWVkICsgKE1hdGgucmFuZG9tKCkgLSAwLjUpICogMC4wMTtcbiAgICBwYXRoLnB1c2goeyBcbiAgICAgIGxhdDogY3VycmVudExhdCwgXG4gICAgICBsbmc6IGN1cnJlbnRMbmcsIFxuICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZShEYXRlLm5vdygpICsgaSAqIDM2MDAgKiAxMDAwKS50b0lTT1N0cmluZygpIFxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBkaXNhc3RlcklkOiBkaXNhc3Rlci5pZCxcbiAgICBwcmVkaWN0ZWRQYXRoOiBwYXRoLFxuICAgIGNvbmZpZGVuY2U6IE1hdGgucmFuZG9tKCkgKiAwLjMgKyAwLjY1LCAvLyA2NSUgLSA5NSUgY29uZmlkZW5jZVxuICB9O1xufTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxdWVzdDogUmVxdWVzdCkge1xuICB0cnkge1xuICAgIGxldCBkaXNhc3RlcjtcbiAgICB0cnkge1xuICAgICAgZGlzYXN0ZXIgPSBhd2FpdCByZXF1ZXN0Lmpzb24oKTtcbiAgICB9IGNhdGNoIChqc29uRXJyb3IpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnSW52YWxpZCBKU09OIGluIHJlcXVlc3QgYm9keS4nIH0sIHsgc3RhdHVzOiA0MDAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCFkaXNhc3RlciB8fCAhZGlzYXN0ZXIubG9jYXRpb24pIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnSW52YWxpZCBkaXNhc3RlciBkYXRhIHByb3ZpZGVkLicgfSwgeyBzdGF0dXM6IDQwMCB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBwcmVkaWN0aXZlUGF0aCA9IGdlbmVyYXRlUHJlZGljdGl2ZVBhdGgoZGlzYXN0ZXIpO1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihwcmVkaWN0aXZlUGF0aCk7XG5cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdQcmVkaWN0aXZlIHBhdGggQVBJIGVycm9yOicsIGVycm9yKTtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ0ZhaWxlZCB0byBnZW5lcmF0ZSBwcmVkaWN0aXZlIHBhdGguJyB9LCB7IHN0YXR1czogNTAwIH0pO1xuICB9XG59XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiZ2VuZXJhdGVQcmVkaWN0aXZlUGF0aCIsImRpc2FzdGVyIiwibGF0IiwibG5nIiwibG9jYXRpb24iLCJwYXRoIiwiY3VycmVudExhdCIsImN1cnJlbnRMbmciLCJhbmdsZSIsIk1hdGgiLCJyYW5kb20iLCJQSSIsInNwZWVkIiwiaSIsInNpbiIsImNvcyIsInB1c2giLCJ0aW1lc3RhbXAiLCJEYXRlIiwibm93IiwidG9JU09TdHJpbmciLCJkaXNhc3RlcklkIiwiaWQiLCJwcmVkaWN0ZWRQYXRoIiwiY29uZmlkZW5jZSIsIlBPU1QiLCJyZXF1ZXN0IiwianNvbiIsImpzb25FcnJvciIsImVycm9yIiwic3RhdHVzIiwicHJlZGljdGl2ZVBhdGgiLCJjb25zb2xlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/satellite/predictive-path/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsatellite%2Fpredictive-path%2Froute&page=%2Fapi%2Fsatellite%2Fpredictive-path%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsatellite%2Fpredictive-path%2Froute.ts&appDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsatellite%2Fpredictive-path%2Froute&page=%2Fapi%2Fsatellite%2Fpredictive-path%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsatellite%2Fpredictive-path%2Froute.ts&appDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_ASUS_Downloads_disaster_dashboard_app_api_satellite_predictive_path_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/satellite/predictive-path/route.ts */ \"(rsc)/./app/api/satellite/predictive-path/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/satellite/predictive-path/route\",\n        pathname: \"/api/satellite/predictive-path\",\n        filename: \"route\",\n        bundlePath: \"app/api/satellite/predictive-path/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\ASUS\\\\Downloads\\\\disaster-dashboard\\\\app\\\\api\\\\satellite\\\\predictive-path\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_ASUS_Downloads_disaster_dashboard_app_api_satellite_predictive_path_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZzYXRlbGxpdGUlMkZwcmVkaWN0aXZlLXBhdGglMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRnNhdGVsbGl0ZSUyRnByZWRpY3RpdmUtcGF0aCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRnNhdGVsbGl0ZSUyRnByZWRpY3RpdmUtcGF0aCUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNBU1VTJTVDRG93bmxvYWRzJTVDZGlzYXN0ZXItZGFzaGJvYXJkJTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1DJTNBJTVDVXNlcnMlNUNBU1VTJTVDRG93bmxvYWRzJTVDZGlzYXN0ZXItZGFzaGJvYXJkJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUM4QztBQUMzSDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiQzpcXFxcVXNlcnNcXFxcQVNVU1xcXFxEb3dubG9hZHNcXFxcZGlzYXN0ZXItZGFzaGJvYXJkXFxcXGFwcFxcXFxhcGlcXFxcc2F0ZWxsaXRlXFxcXHByZWRpY3RpdmUtcGF0aFxcXFxyb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvc2F0ZWxsaXRlL3ByZWRpY3RpdmUtcGF0aC9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL3NhdGVsbGl0ZS9wcmVkaWN0aXZlLXBhdGhcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL3NhdGVsbGl0ZS9wcmVkaWN0aXZlLXBhdGgvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCJDOlxcXFxVc2Vyc1xcXFxBU1VTXFxcXERvd25sb2Fkc1xcXFxkaXNhc3Rlci1kYXNoYm9hcmRcXFxcYXBwXFxcXGFwaVxcXFxzYXRlbGxpdGVcXFxccHJlZGljdGl2ZS1wYXRoXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsatellite%2Fpredictive-path%2Froute&page=%2Fapi%2Fsatellite%2Fpredictive-path%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsatellite%2Fpredictive-path%2Froute.ts&appDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsatellite%2Fpredictive-path%2Froute&page=%2Fapi%2Fsatellite%2Fpredictive-path%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsatellite%2Fpredictive-path%2Froute.ts&appDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();