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
exports.id = "app/api/satellite/geocode-suggest/route";
exports.ids = ["app/api/satellite/geocode-suggest/route"];
exports.modules = {

/***/ "(rsc)/./app/api/satellite/geocode-suggest/route.ts":
/*!****************************************************!*\
  !*** ./app/api/satellite/geocode-suggest/route.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n\nasync function GET(request) {\n    const { searchParams } = new URL(request.url);\n    const query = searchParams.get('q');\n    if (!query) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Query parameter 'q' is required\"\n        }, {\n            status: 400\n        });\n    }\n    try {\n        const apiKey = process.env.GOOGLE_GEOCODING_API_KEY;\n        if (!apiKey) {\n            throw new Error('Google Geocoding API key not configured.');\n        }\n        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`);\n        if (!response.ok) {\n            throw new Error(`Google Geocoding API request failed: ${response.status}`);\n        }\n        const data = await response.json();\n        if (data.status !== 'OK') {\n            throw new Error(`Google Geocoding API error: ${data.status} - ${data.error_message || 'Unknown error'}`);\n        }\n        const suggestions = data.results.map((result)=>({\n                id: result.place_id,\n                name: result.formatted_address,\n                country: result.address_components.find((comp)=>comp.types.includes('country'))?.long_name || '',\n                state: result.address_components.find((comp)=>comp.types.includes('administrative_area_level_1'))?.long_name || '',\n                city: result.address_components.find((comp)=>comp.types.includes('locality'))?.long_name || '',\n                postcode: result.address_components.find((comp)=>comp.types.includes('postal_code'))?.long_name || '',\n                coordinates: {\n                    lat: result.geometry.location.lat,\n                    lng: result.geometry.location.lng\n                },\n                displayName: result.formatted_address\n            }));\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(suggestions);\n    } catch (error) {\n        console.error('Geocode suggest error:', error);\n        // @ts-ignore\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: error.message || 'Failed to fetch Google geocoding suggestions.'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3NhdGVsbGl0ZS9nZW9jb2RlLXN1Z2dlc3Qvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBMkM7QUFFcEMsZUFBZUMsSUFBSUMsT0FBZ0I7SUFDeEMsTUFBTSxFQUFFQyxZQUFZLEVBQUUsR0FBRyxJQUFJQyxJQUFJRixRQUFRRyxHQUFHO0lBQzVDLE1BQU1DLFFBQVFILGFBQWFJLEdBQUcsQ0FBQztJQUUvQixJQUFJLENBQUNELE9BQU87UUFDTixPQUFPTixxREFBWUEsQ0FBQ1EsSUFBSSxDQUFDO1lBQUVDLE9BQU87UUFBa0MsR0FBRztZQUFFQyxRQUFRO1FBQUk7SUFDM0Y7SUFFQSxJQUFJO1FBQ0YsTUFBTUMsU0FBU0MsUUFBUUMsR0FBRyxDQUFDQyx3QkFBd0I7UUFFbkQsSUFBSSxDQUFDSCxRQUFRO1lBQ1gsTUFBTSxJQUFJSSxNQUFNO1FBQ2xCO1FBRUEsTUFBTUMsV0FBVyxNQUFNQyxNQUFNLENBQUMsMERBQTBELEVBQUVDLG1CQUFtQlosT0FBTyxLQUFLLEVBQUVLLFFBQVE7UUFFbkksSUFBSSxDQUFDSyxTQUFTRyxFQUFFLEVBQUU7WUFDaEIsTUFBTSxJQUFJSixNQUFNLENBQUMscUNBQXFDLEVBQUVDLFNBQVNOLE1BQU0sRUFBRTtRQUMzRTtRQUVBLE1BQU1VLE9BQU8sTUFBTUosU0FBU1IsSUFBSTtRQUVoQyxJQUFJWSxLQUFLVixNQUFNLEtBQUssTUFBTTtZQUN4QixNQUFNLElBQUlLLE1BQU0sQ0FBQyw0QkFBNEIsRUFBRUssS0FBS1YsTUFBTSxDQUFDLEdBQUcsRUFBRVUsS0FBS0MsYUFBYSxJQUFJLGlCQUFpQjtRQUN6RztRQUVBLE1BQU1DLGNBQWNGLEtBQUtHLE9BQU8sQ0FBQ0MsR0FBRyxDQUFDLENBQUNDLFNBQWlCO2dCQUNyREMsSUFBSUQsT0FBT0UsUUFBUTtnQkFDbkJDLE1BQU1ILE9BQU9JLGlCQUFpQjtnQkFDOUJDLFNBQVNMLE9BQU9NLGtCQUFrQixDQUFDQyxJQUFJLENBQUMsQ0FBQ0MsT0FBY0EsS0FBS0MsS0FBSyxDQUFDQyxRQUFRLENBQUMsYUFBYUMsYUFBYTtnQkFDckdDLE9BQU9aLE9BQU9NLGtCQUFrQixDQUFDQyxJQUFJLENBQUMsQ0FBQ0MsT0FBY0EsS0FBS0MsS0FBSyxDQUFDQyxRQUFRLENBQUMsaUNBQWlDQyxhQUFhO2dCQUN2SEUsTUFBTWIsT0FBT00sa0JBQWtCLENBQUNDLElBQUksQ0FBQyxDQUFDQyxPQUFjQSxLQUFLQyxLQUFLLENBQUNDLFFBQVEsQ0FBQyxjQUFjQyxhQUFhO2dCQUNuR0csVUFBVWQsT0FBT00sa0JBQWtCLENBQUNDLElBQUksQ0FBQyxDQUFDQyxPQUFjQSxLQUFLQyxLQUFLLENBQUNDLFFBQVEsQ0FBQyxpQkFBaUJDLGFBQWE7Z0JBQzFHSSxhQUFhO29CQUNYQyxLQUFLaEIsT0FBT2lCLFFBQVEsQ0FBQ0MsUUFBUSxDQUFDRixHQUFHO29CQUNqQ0csS0FBS25CLE9BQU9pQixRQUFRLENBQUNDLFFBQVEsQ0FBQ0MsR0FBRztnQkFDbkM7Z0JBQ0FDLGFBQWFwQixPQUFPSSxpQkFBaUI7WUFDdkM7UUFFQSxPQUFPN0IscURBQVlBLENBQUNRLElBQUksQ0FBQ2M7SUFDM0IsRUFBRSxPQUFPYixPQUFPO1FBQ2RxQyxRQUFRckMsS0FBSyxDQUFDLDBCQUEwQkE7UUFDeEMsYUFBYTtRQUNiLE9BQU9ULHFEQUFZQSxDQUFDUSxJQUFJLENBQUM7WUFBRUMsT0FBT0EsTUFBTXNDLE9BQU8sSUFBSTtRQUFnRCxHQUFHO1lBQUVyQyxRQUFRO1FBQUk7SUFDdEg7QUFDRiIsInNvdXJjZXMiOlsiQzpcXFVzZXJzXFxBU1VTXFxEb3dubG9hZHNcXGRpc2FzdGVyLWRhc2hib2FyZFxcYXBwXFxhcGlcXHNhdGVsbGl0ZVxcZ2VvY29kZS1zdWdnZXN0XFxyb3V0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcic7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQocmVxdWVzdDogUmVxdWVzdCkge1xuICBjb25zdCB7IHNlYXJjaFBhcmFtcyB9ID0gbmV3IFVSTChyZXF1ZXN0LnVybCk7XG4gIGNvbnN0IHF1ZXJ5ID0gc2VhcmNoUGFyYW1zLmdldCgncScpO1xuXG4gIGlmICghcXVlcnkpIHtcbiAgICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFwiUXVlcnkgcGFyYW1ldGVyICdxJyBpcyByZXF1aXJlZFwiIH0sIHsgc3RhdHVzOiA0MDAgfSk7XG4gIH1cblxuICB0cnkge1xuICAgIGNvbnN0IGFwaUtleSA9IHByb2Nlc3MuZW52LkdPT0dMRV9HRU9DT0RJTkdfQVBJX0tFWTtcblxuICAgIGlmICghYXBpS2V5KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0dvb2dsZSBHZW9jb2RpbmcgQVBJIGtleSBub3QgY29uZmlndXJlZC4nKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGBodHRwczovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvZ2VvY29kZS9qc29uP2FkZHJlc3M9JHtlbmNvZGVVUklDb21wb25lbnQocXVlcnkpfSZrZXk9JHthcGlLZXl9YCk7XG4gICAgXG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBHb29nbGUgR2VvY29kaW5nIEFQSSByZXF1ZXN0IGZhaWxlZDogJHtyZXNwb25zZS5zdGF0dXN9YCk7XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcblxuICAgIGlmIChkYXRhLnN0YXR1cyAhPT0gJ09LJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBHb29nbGUgR2VvY29kaW5nIEFQSSBlcnJvcjogJHtkYXRhLnN0YXR1c30gLSAke2RhdGEuZXJyb3JfbWVzc2FnZSB8fCAnVW5rbm93biBlcnJvcid9YCk7XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IHN1Z2dlc3Rpb25zID0gZGF0YS5yZXN1bHRzLm1hcCgocmVzdWx0OiBhbnkpID0+ICh7XG4gICAgICBpZDogcmVzdWx0LnBsYWNlX2lkLFxuICAgICAgbmFtZTogcmVzdWx0LmZvcm1hdHRlZF9hZGRyZXNzLCAvLyBVc2UgZm9ybWF0dGVkX2FkZHJlc3MgYXMgdGhlIHByaW1hcnkgbmFtZVxuICAgICAgY291bnRyeTogcmVzdWx0LmFkZHJlc3NfY29tcG9uZW50cy5maW5kKChjb21wOiBhbnkpID0+IGNvbXAudHlwZXMuaW5jbHVkZXMoJ2NvdW50cnknKSk/LmxvbmdfbmFtZSB8fCAnJyxcbiAgICAgIHN0YXRlOiByZXN1bHQuYWRkcmVzc19jb21wb25lbnRzLmZpbmQoKGNvbXA6IGFueSkgPT4gY29tcC50eXBlcy5pbmNsdWRlcygnYWRtaW5pc3RyYXRpdmVfYXJlYV9sZXZlbF8xJykpPy5sb25nX25hbWUgfHwgJycsXG4gICAgICBjaXR5OiByZXN1bHQuYWRkcmVzc19jb21wb25lbnRzLmZpbmQoKGNvbXA6IGFueSkgPT4gY29tcC50eXBlcy5pbmNsdWRlcygnbG9jYWxpdHknKSk/LmxvbmdfbmFtZSB8fCAnJyxcbiAgICAgIHBvc3Rjb2RlOiByZXN1bHQuYWRkcmVzc19jb21wb25lbnRzLmZpbmQoKGNvbXA6IGFueSkgPT4gY29tcC50eXBlcy5pbmNsdWRlcygncG9zdGFsX2NvZGUnKSk/LmxvbmdfbmFtZSB8fCAnJyxcbiAgICAgIGNvb3JkaW5hdGVzOiB7XG4gICAgICAgIGxhdDogcmVzdWx0Lmdlb21ldHJ5LmxvY2F0aW9uLmxhdCxcbiAgICAgICAgbG5nOiByZXN1bHQuZ2VvbWV0cnkubG9jYXRpb24ubG5nLFxuICAgICAgfSxcbiAgICAgIGRpc3BsYXlOYW1lOiByZXN1bHQuZm9ybWF0dGVkX2FkZHJlc3MsXG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHN1Z2dlc3Rpb25zKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdHZW9jb2RlIHN1Z2dlc3QgZXJyb3I6JywgZXJyb3IpO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogZXJyb3IubWVzc2FnZSB8fCAnRmFpbGVkIHRvIGZldGNoIEdvb2dsZSBnZW9jb2Rpbmcgc3VnZ2VzdGlvbnMuJyB9LCB7IHN0YXR1czogNTAwIH0pO1xuICB9XG59Il0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsIkdFVCIsInJlcXVlc3QiLCJzZWFyY2hQYXJhbXMiLCJVUkwiLCJ1cmwiLCJxdWVyeSIsImdldCIsImpzb24iLCJlcnJvciIsInN0YXR1cyIsImFwaUtleSIsInByb2Nlc3MiLCJlbnYiLCJHT09HTEVfR0VPQ09ESU5HX0FQSV9LRVkiLCJFcnJvciIsInJlc3BvbnNlIiwiZmV0Y2giLCJlbmNvZGVVUklDb21wb25lbnQiLCJvayIsImRhdGEiLCJlcnJvcl9tZXNzYWdlIiwic3VnZ2VzdGlvbnMiLCJyZXN1bHRzIiwibWFwIiwicmVzdWx0IiwiaWQiLCJwbGFjZV9pZCIsIm5hbWUiLCJmb3JtYXR0ZWRfYWRkcmVzcyIsImNvdW50cnkiLCJhZGRyZXNzX2NvbXBvbmVudHMiLCJmaW5kIiwiY29tcCIsInR5cGVzIiwiaW5jbHVkZXMiLCJsb25nX25hbWUiLCJzdGF0ZSIsImNpdHkiLCJwb3N0Y29kZSIsImNvb3JkaW5hdGVzIiwibGF0IiwiZ2VvbWV0cnkiLCJsb2NhdGlvbiIsImxuZyIsImRpc3BsYXlOYW1lIiwiY29uc29sZSIsIm1lc3NhZ2UiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/satellite/geocode-suggest/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsatellite%2Fgeocode-suggest%2Froute&page=%2Fapi%2Fsatellite%2Fgeocode-suggest%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsatellite%2Fgeocode-suggest%2Froute.ts&appDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsatellite%2Fgeocode-suggest%2Froute&page=%2Fapi%2Fsatellite%2Fgeocode-suggest%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsatellite%2Fgeocode-suggest%2Froute.ts&appDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_ASUS_Downloads_disaster_dashboard_app_api_satellite_geocode_suggest_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/satellite/geocode-suggest/route.ts */ \"(rsc)/./app/api/satellite/geocode-suggest/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/satellite/geocode-suggest/route\",\n        pathname: \"/api/satellite/geocode-suggest\",\n        filename: \"route\",\n        bundlePath: \"app/api/satellite/geocode-suggest/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\ASUS\\\\Downloads\\\\disaster-dashboard\\\\app\\\\api\\\\satellite\\\\geocode-suggest\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_ASUS_Downloads_disaster_dashboard_app_api_satellite_geocode_suggest_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZzYXRlbGxpdGUlMkZnZW9jb2RlLXN1Z2dlc3QlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRnNhdGVsbGl0ZSUyRmdlb2NvZGUtc3VnZ2VzdCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRnNhdGVsbGl0ZSUyRmdlb2NvZGUtc3VnZ2VzdCUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNBU1VTJTVDRG93bmxvYWRzJTVDZGlzYXN0ZXItZGFzaGJvYXJkJTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1DJTNBJTVDVXNlcnMlNUNBU1VTJTVDRG93bmxvYWRzJTVDZGlzYXN0ZXItZGFzaGJvYXJkJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUM4QztBQUMzSDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiQzpcXFxcVXNlcnNcXFxcQVNVU1xcXFxEb3dubG9hZHNcXFxcZGlzYXN0ZXItZGFzaGJvYXJkXFxcXGFwcFxcXFxhcGlcXFxcc2F0ZWxsaXRlXFxcXGdlb2NvZGUtc3VnZ2VzdFxcXFxyb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvc2F0ZWxsaXRlL2dlb2NvZGUtc3VnZ2VzdC9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL3NhdGVsbGl0ZS9nZW9jb2RlLXN1Z2dlc3RcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL3NhdGVsbGl0ZS9nZW9jb2RlLXN1Z2dlc3Qvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCJDOlxcXFxVc2Vyc1xcXFxBU1VTXFxcXERvd25sb2Fkc1xcXFxkaXNhc3Rlci1kYXNoYm9hcmRcXFxcYXBwXFxcXGFwaVxcXFxzYXRlbGxpdGVcXFxcZ2VvY29kZS1zdWdnZXN0XFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsatellite%2Fgeocode-suggest%2Froute&page=%2Fapi%2Fsatellite%2Fgeocode-suggest%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsatellite%2Fgeocode-suggest%2Froute.ts&appDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsatellite%2Fgeocode-suggest%2Froute&page=%2Fapi%2Fsatellite%2Fgeocode-suggest%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsatellite%2Fgeocode-suggest%2Froute.ts&appDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();