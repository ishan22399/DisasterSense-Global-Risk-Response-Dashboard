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
exports.id = "app/api/satellite/geocode-details/route";
exports.ids = ["app/api/satellite/geocode-details/route"];
exports.modules = {

/***/ "(rsc)/./app/api/satellite/geocode-details/route.ts":
/*!****************************************************!*\
  !*** ./app/api/satellite/geocode-details/route.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n\nasync function GET(request) {\n    const { searchParams } = new URL(request.url);\n    const placeId = searchParams.get('place_id');\n    if (!placeId) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Query parameter 'place_id' is required\"\n        }, {\n            status: 400\n        });\n    }\n    try {\n        const apiKey = process.env.GOOGLE_GEOCODING_API_KEY;\n        if (!apiKey) {\n            throw new Error('Google Geocoding API key not configured.');\n        }\n        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${apiKey}`);\n        if (!response.ok) {\n            throw new Error(`Google Geocoding API request failed: ${response.status}`);\n        }\n        const data = await response.json();\n        if (data.status !== 'OK' || data.results.length === 0) {\n            throw new Error(`Google Geocoding API error: ${data.status} - ${data.error_message || 'Unknown error'}`);\n        }\n        const result = data.results[0];\n        const geocodedData = {\n            id: result.place_id,\n            name: result.formatted_address,\n            country: result.address_components.find((comp)=>comp.types.includes('country'))?.long_name || '',\n            state: result.address_components.find((comp)=>comp.types.includes('administrative_area_level_1'))?.long_name || '',\n            city: result.address_components.find((comp)=>comp.types.includes('locality'))?.long_name || '',\n            postcode: result.address_components.find((comp)=>comp.types.includes('postal_code'))?.long_name || '',\n            coordinates: {\n                lat: result.geometry.location.lat,\n                lng: result.geometry.location.lng\n            },\n            displayName: result.formatted_address\n        };\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(geocodedData);\n    } catch (error) {\n        console.error('Geocode details error:', error);\n        // @ts-ignore\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: error.message || 'Failed to fetch geocoding details.'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3NhdGVsbGl0ZS9nZW9jb2RlLWRldGFpbHMvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBMkM7QUFFcEMsZUFBZUMsSUFBSUMsT0FBZ0I7SUFDeEMsTUFBTSxFQUFFQyxZQUFZLEVBQUUsR0FBRyxJQUFJQyxJQUFJRixRQUFRRyxHQUFHO0lBQzVDLE1BQU1DLFVBQVVILGFBQWFJLEdBQUcsQ0FBQztJQUVqQyxJQUFJLENBQUNELFNBQVM7UUFDWixPQUFPTixxREFBWUEsQ0FBQ1EsSUFBSSxDQUFDO1lBQUVDLE9BQU87UUFBeUMsR0FBRztZQUFFQyxRQUFRO1FBQUk7SUFDOUY7SUFFQSxJQUFJO1FBQ0YsTUFBTUMsU0FBU0MsUUFBUUMsR0FBRyxDQUFDQyx3QkFBd0I7UUFFbkQsSUFBSSxDQUFDSCxRQUFRO1lBQ1gsTUFBTSxJQUFJSSxNQUFNO1FBQ2xCO1FBRUEsTUFBTUMsV0FBVyxNQUFNQyxNQUFNLENBQUMsMkRBQTJELEVBQUVYLFFBQVEsS0FBSyxFQUFFSyxRQUFRO1FBRWxILElBQUksQ0FBQ0ssU0FBU0UsRUFBRSxFQUFFO1lBQ2hCLE1BQU0sSUFBSUgsTUFBTSxDQUFDLHFDQUFxQyxFQUFFQyxTQUFTTixNQUFNLEVBQUU7UUFDM0U7UUFFQSxNQUFNUyxPQUFPLE1BQU1ILFNBQVNSLElBQUk7UUFFaEMsSUFBSVcsS0FBS1QsTUFBTSxLQUFLLFFBQVFTLEtBQUtDLE9BQU8sQ0FBQ0MsTUFBTSxLQUFLLEdBQUc7WUFDckQsTUFBTSxJQUFJTixNQUFNLENBQUMsNEJBQTRCLEVBQUVJLEtBQUtULE1BQU0sQ0FBQyxHQUFHLEVBQUVTLEtBQUtHLGFBQWEsSUFBSSxpQkFBaUI7UUFDekc7UUFFQSxNQUFNQyxTQUFTSixLQUFLQyxPQUFPLENBQUMsRUFBRTtRQUM5QixNQUFNSSxlQUFlO1lBQ25CQyxJQUFJRixPQUFPRyxRQUFRO1lBQ25CQyxNQUFNSixPQUFPSyxpQkFBaUI7WUFDOUJDLFNBQVNOLE9BQU9PLGtCQUFrQixDQUFDQyxJQUFJLENBQUMsQ0FBQ0MsT0FBY0EsS0FBS0MsS0FBSyxDQUFDQyxRQUFRLENBQUMsYUFBYUMsYUFBYTtZQUNyR0MsT0FBT2IsT0FBT08sa0JBQWtCLENBQUNDLElBQUksQ0FBQyxDQUFDQyxPQUFjQSxLQUFLQyxLQUFLLENBQUNDLFFBQVEsQ0FBQyxpQ0FBaUNDLGFBQWE7WUFDdkhFLE1BQU1kLE9BQU9PLGtCQUFrQixDQUFDQyxJQUFJLENBQUMsQ0FBQ0MsT0FBY0EsS0FBS0MsS0FBSyxDQUFDQyxRQUFRLENBQUMsY0FBY0MsYUFBYTtZQUNuR0csVUFBVWYsT0FBT08sa0JBQWtCLENBQUNDLElBQUksQ0FBQyxDQUFDQyxPQUFjQSxLQUFLQyxLQUFLLENBQUNDLFFBQVEsQ0FBQyxpQkFBaUJDLGFBQWE7WUFDMUdJLGFBQWE7Z0JBQ1hDLEtBQUtqQixPQUFPa0IsUUFBUSxDQUFDQyxRQUFRLENBQUNGLEdBQUc7Z0JBQ2pDRyxLQUFLcEIsT0FBT2tCLFFBQVEsQ0FBQ0MsUUFBUSxDQUFDQyxHQUFHO1lBQ25DO1lBQ0FDLGFBQWFyQixPQUFPSyxpQkFBaUI7UUFDdkM7UUFFQSxPQUFPNUIscURBQVlBLENBQUNRLElBQUksQ0FBQ2dCO0lBQzNCLEVBQUUsT0FBT2YsT0FBTztRQUNkb0MsUUFBUXBDLEtBQUssQ0FBQywwQkFBMEJBO1FBQ3hDLGFBQWE7UUFDYixPQUFPVCxxREFBWUEsQ0FBQ1EsSUFBSSxDQUFDO1lBQUVDLE9BQU9BLE1BQU1xQyxPQUFPLElBQUk7UUFBcUMsR0FBRztZQUFFcEMsUUFBUTtRQUFJO0lBQzNHO0FBQ0YiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcQVNVU1xcRG93bmxvYWRzXFxkaXNhc3Rlci1kYXNoYm9hcmRcXGFwcFxcYXBpXFxzYXRlbGxpdGVcXGdlb2NvZGUtZGV0YWlsc1xccm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKHJlcXVlc3Q6IFJlcXVlc3QpIHtcbiAgY29uc3QgeyBzZWFyY2hQYXJhbXMgfSA9IG5ldyBVUkwocmVxdWVzdC51cmwpO1xuICBjb25zdCBwbGFjZUlkID0gc2VhcmNoUGFyYW1zLmdldCgncGxhY2VfaWQnKTtcblxuICBpZiAoIXBsYWNlSWQpIHtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJRdWVyeSBwYXJhbWV0ZXIgJ3BsYWNlX2lkJyBpcyByZXF1aXJlZFwiIH0sIHsgc3RhdHVzOiA0MDAgfSk7XG4gIH1cblxuICB0cnkge1xuICAgIGNvbnN0IGFwaUtleSA9IHByb2Nlc3MuZW52LkdPT0dMRV9HRU9DT0RJTkdfQVBJX0tFWTtcblxuICAgIGlmICghYXBpS2V5KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0dvb2dsZSBHZW9jb2RpbmcgQVBJIGtleSBub3QgY29uZmlndXJlZC4nKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwczovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvZ2VvY29kZS9qc29uP3BsYWNlX2lkPSR7cGxhY2VJZH0ma2V5PSR7YXBpS2V5fWApO1xuICAgIFxuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgR29vZ2xlIEdlb2NvZGluZyBBUEkgcmVxdWVzdCBmYWlsZWQ6ICR7cmVzcG9uc2Uuc3RhdHVzfWApO1xuICAgIH1cblxuICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG5cbiAgICBpZiAoZGF0YS5zdGF0dXMgIT09ICdPSycgfHwgZGF0YS5yZXN1bHRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBHb29nbGUgR2VvY29kaW5nIEFQSSBlcnJvcjogJHtkYXRhLnN0YXR1c30gLSAke2RhdGEuZXJyb3JfbWVzc2FnZSB8fCAnVW5rbm93biBlcnJvcid9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gZGF0YS5yZXN1bHRzWzBdO1xuICAgIGNvbnN0IGdlb2NvZGVkRGF0YSA9IHtcbiAgICAgIGlkOiByZXN1bHQucGxhY2VfaWQsXG4gICAgICBuYW1lOiByZXN1bHQuZm9ybWF0dGVkX2FkZHJlc3MsXG4gICAgICBjb3VudHJ5OiByZXN1bHQuYWRkcmVzc19jb21wb25lbnRzLmZpbmQoKGNvbXA6IGFueSkgPT4gY29tcC50eXBlcy5pbmNsdWRlcygnY291bnRyeScpKT8ubG9uZ19uYW1lIHx8ICcnLFxuICAgICAgc3RhdGU6IHJlc3VsdC5hZGRyZXNzX2NvbXBvbmVudHMuZmluZCgoY29tcDogYW55KSA9PiBjb21wLnR5cGVzLmluY2x1ZGVzKCdhZG1pbmlzdHJhdGl2ZV9hcmVhX2xldmVsXzEnKSk/LmxvbmdfbmFtZSB8fCAnJyxcbiAgICAgIGNpdHk6IHJlc3VsdC5hZGRyZXNzX2NvbXBvbmVudHMuZmluZCgoY29tcDogYW55KSA9PiBjb21wLnR5cGVzLmluY2x1ZGVzKCdsb2NhbGl0eScpKT8ubG9uZ19uYW1lIHx8ICcnLFxuICAgICAgcG9zdGNvZGU6IHJlc3VsdC5hZGRyZXNzX2NvbXBvbmVudHMuZmluZCgoY29tcDogYW55KSA9PiBjb21wLnR5cGVzLmluY2x1ZGVzKCdwb3N0YWxfY29kZScpKT8ubG9uZ19uYW1lIHx8ICcnLFxuICAgICAgY29vcmRpbmF0ZXM6IHtcbiAgICAgICAgbGF0OiByZXN1bHQuZ2VvbWV0cnkubG9jYXRpb24ubGF0LFxuICAgICAgICBsbmc6IHJlc3VsdC5nZW9tZXRyeS5sb2NhdGlvbi5sbmcsXG4gICAgICB9LFxuICAgICAgZGlzcGxheU5hbWU6IHJlc3VsdC5mb3JtYXR0ZWRfYWRkcmVzcyxcbiAgICB9O1xuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKGdlb2NvZGVkRGF0YSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignR2VvY29kZSBkZXRhaWxzIGVycm9yOicsIGVycm9yKTtcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfHwgJ0ZhaWxlZCB0byBmZXRjaCBnZW9jb2RpbmcgZGV0YWlscy4nIH0sIHsgc3RhdHVzOiA1MDAgfSk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJHRVQiLCJyZXF1ZXN0Iiwic2VhcmNoUGFyYW1zIiwiVVJMIiwidXJsIiwicGxhY2VJZCIsImdldCIsImpzb24iLCJlcnJvciIsInN0YXR1cyIsImFwaUtleSIsInByb2Nlc3MiLCJlbnYiLCJHT09HTEVfR0VPQ09ESU5HX0FQSV9LRVkiLCJFcnJvciIsInJlc3BvbnNlIiwiZmV0Y2giLCJvayIsImRhdGEiLCJyZXN1bHRzIiwibGVuZ3RoIiwiZXJyb3JfbWVzc2FnZSIsInJlc3VsdCIsImdlb2NvZGVkRGF0YSIsImlkIiwicGxhY2VfaWQiLCJuYW1lIiwiZm9ybWF0dGVkX2FkZHJlc3MiLCJjb3VudHJ5IiwiYWRkcmVzc19jb21wb25lbnRzIiwiZmluZCIsImNvbXAiLCJ0eXBlcyIsImluY2x1ZGVzIiwibG9uZ19uYW1lIiwic3RhdGUiLCJjaXR5IiwicG9zdGNvZGUiLCJjb29yZGluYXRlcyIsImxhdCIsImdlb21ldHJ5IiwibG9jYXRpb24iLCJsbmciLCJkaXNwbGF5TmFtZSIsImNvbnNvbGUiLCJtZXNzYWdlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/satellite/geocode-details/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsatellite%2Fgeocode-details%2Froute&page=%2Fapi%2Fsatellite%2Fgeocode-details%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsatellite%2Fgeocode-details%2Froute.ts&appDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsatellite%2Fgeocode-details%2Froute&page=%2Fapi%2Fsatellite%2Fgeocode-details%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsatellite%2Fgeocode-details%2Froute.ts&appDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_ASUS_Downloads_disaster_dashboard_app_api_satellite_geocode_details_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/satellite/geocode-details/route.ts */ \"(rsc)/./app/api/satellite/geocode-details/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/satellite/geocode-details/route\",\n        pathname: \"/api/satellite/geocode-details\",\n        filename: \"route\",\n        bundlePath: \"app/api/satellite/geocode-details/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\ASUS\\\\Downloads\\\\disaster-dashboard\\\\app\\\\api\\\\satellite\\\\geocode-details\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_ASUS_Downloads_disaster_dashboard_app_api_satellite_geocode_details_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZzYXRlbGxpdGUlMkZnZW9jb2RlLWRldGFpbHMlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRnNhdGVsbGl0ZSUyRmdlb2NvZGUtZGV0YWlscyUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRnNhdGVsbGl0ZSUyRmdlb2NvZGUtZGV0YWlscyUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNBU1VTJTVDRG93bmxvYWRzJTVDZGlzYXN0ZXItZGFzaGJvYXJkJTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1DJTNBJTVDVXNlcnMlNUNBU1VTJTVDRG93bmxvYWRzJTVDZGlzYXN0ZXItZGFzaGJvYXJkJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUM4QztBQUMzSDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiQzpcXFxcVXNlcnNcXFxcQVNVU1xcXFxEb3dubG9hZHNcXFxcZGlzYXN0ZXItZGFzaGJvYXJkXFxcXGFwcFxcXFxhcGlcXFxcc2F0ZWxsaXRlXFxcXGdlb2NvZGUtZGV0YWlsc1xcXFxyb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvc2F0ZWxsaXRlL2dlb2NvZGUtZGV0YWlscy9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL3NhdGVsbGl0ZS9nZW9jb2RlLWRldGFpbHNcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL3NhdGVsbGl0ZS9nZW9jb2RlLWRldGFpbHMvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCJDOlxcXFxVc2Vyc1xcXFxBU1VTXFxcXERvd25sb2Fkc1xcXFxkaXNhc3Rlci1kYXNoYm9hcmRcXFxcYXBwXFxcXGFwaVxcXFxzYXRlbGxpdGVcXFxcZ2VvY29kZS1kZXRhaWxzXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsatellite%2Fgeocode-details%2Froute&page=%2Fapi%2Fsatellite%2Fgeocode-details%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsatellite%2Fgeocode-details%2Froute.ts&appDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsatellite%2Fgeocode-details%2Froute&page=%2Fapi%2Fsatellite%2Fgeocode-details%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsatellite%2Fgeocode-details%2Froute.ts&appDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();