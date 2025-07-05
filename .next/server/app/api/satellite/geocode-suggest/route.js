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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n\nasync function GET(request) {\n    const { searchParams } = new URL(request.url);\n    const query = searchParams.get('q');\n    if (!query) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Query parameter 'q' is required\"\n        }, {\n            status: 400\n        });\n    }\n    try {\n        const apiKey = process.env.GOOGLE_GEOCODING_API_KEY;\n        if (!apiKey) {\n            throw new Error('Google Geocoding API key not configured.');\n        }\n        const sessionToken = crypto.randomUUID(); // Generate a new session token for each autocomplete session\n        const autocompleteResponse = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${apiKey}&sessiontoken=${sessionToken}`);\n        if (!autocompleteResponse.ok) {\n            throw new Error(`Google Places Autocomplete API request failed: ${autocompleteResponse.status}`);\n        }\n        const autocompleteData = await autocompleteResponse.json();\n        if (autocompleteData.status !== 'OK' && autocompleteData.status !== 'ZERO_RESULTS') {\n            throw new Error(`Google Places Autocomplete API error: ${autocompleteData.status} - ${autocompleteData.error_message || 'Unknown error'}`);\n        }\n        if (autocompleteData.status === 'ZERO_RESULTS') {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json([]);\n        }\n        const suggestions = autocompleteData.predictions.map((prediction)=>({\n                id: prediction.place_id,\n                name: prediction.structured_formatting.main_text,\n                country: '',\n                state: '',\n                city: '',\n                postcode: '',\n                coordinates: null,\n                displayName: prediction.description\n            }));\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(suggestions);\n    } catch (error) {\n        console.error('Geocode suggest error:', error);\n        // @ts-ignore\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: error.message || 'Failed to fetch Google Places Autocomplete suggestions.'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3NhdGVsbGl0ZS9nZW9jb2RlLXN1Z2dlc3Qvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBMkM7QUFFcEMsZUFBZUMsSUFBSUMsT0FBZ0I7SUFDeEMsTUFBTSxFQUFFQyxZQUFZLEVBQUUsR0FBRyxJQUFJQyxJQUFJRixRQUFRRyxHQUFHO0lBQzVDLE1BQU1DLFFBQVFILGFBQWFJLEdBQUcsQ0FBQztJQUUvQixJQUFJLENBQUNELE9BQU87UUFDTixPQUFPTixxREFBWUEsQ0FBQ1EsSUFBSSxDQUFDO1lBQUVDLE9BQU87UUFBa0MsR0FBRztZQUFFQyxRQUFRO1FBQUk7SUFDM0Y7SUFFQSxJQUFJO1FBQ0YsTUFBTUMsU0FBU0MsUUFBUUMsR0FBRyxDQUFDQyx3QkFBd0I7UUFFbkQsSUFBSSxDQUFDSCxRQUFRO1lBQ1gsTUFBTSxJQUFJSSxNQUFNO1FBQ2xCO1FBRUEsTUFBTUMsZUFBZUMsT0FBT0MsVUFBVSxJQUFJLDZEQUE2RDtRQUV2RyxNQUFNQyx1QkFBdUIsTUFBTUMsTUFBTSxDQUFDLG1FQUFtRSxFQUFFQyxtQkFBbUJmLE9BQU8sS0FBSyxFQUFFSyxPQUFPLGNBQWMsRUFBRUssY0FBYztRQUVyTCxJQUFJLENBQUNHLHFCQUFxQkcsRUFBRSxFQUFFO1lBQzVCLE1BQU0sSUFBSVAsTUFBTSxDQUFDLCtDQUErQyxFQUFFSSxxQkFBcUJULE1BQU0sRUFBRTtRQUNqRztRQUVBLE1BQU1hLG1CQUFtQixNQUFNSixxQkFBcUJYLElBQUk7UUFFeEQsSUFBSWUsaUJBQWlCYixNQUFNLEtBQUssUUFBUWEsaUJBQWlCYixNQUFNLEtBQUssZ0JBQWdCO1lBQ2xGLE1BQU0sSUFBSUssTUFBTSxDQUFDLHNDQUFzQyxFQUFFUSxpQkFBaUJiLE1BQU0sQ0FBQyxHQUFHLEVBQUVhLGlCQUFpQkMsYUFBYSxJQUFJLGlCQUFpQjtRQUMzSTtRQUVBLElBQUlELGlCQUFpQmIsTUFBTSxLQUFLLGdCQUFnQjtZQUM5QyxPQUFPVixxREFBWUEsQ0FBQ1EsSUFBSSxDQUFDLEVBQUU7UUFDN0I7UUFFQSxNQUFNaUIsY0FBY0YsaUJBQWlCRyxXQUFXLENBQUNDLEdBQUcsQ0FBQyxDQUFDQyxhQUFxQjtnQkFDekVDLElBQUlELFdBQVdFLFFBQVE7Z0JBQ3ZCQyxNQUFNSCxXQUFXSSxxQkFBcUIsQ0FBQ0MsU0FBUztnQkFDaERDLFNBQVM7Z0JBQ1RDLE9BQU87Z0JBQ1BDLE1BQU07Z0JBQ05DLFVBQVU7Z0JBQ1ZDLGFBQWE7Z0JBQ2JDLGFBQWFYLFdBQVdZLFdBQVc7WUFDckM7UUFFQSxPQUFPeEMscURBQVlBLENBQUNRLElBQUksQ0FBQ2lCO0lBQzNCLEVBQUUsT0FBT2hCLE9BQU87UUFDZGdDLFFBQVFoQyxLQUFLLENBQUMsMEJBQTBCQTtRQUN4QyxhQUFhO1FBQ2IsT0FBT1QscURBQVlBLENBQUNRLElBQUksQ0FBQztZQUFFQyxPQUFPQSxNQUFNaUMsT0FBTyxJQUFJO1FBQTBELEdBQUc7WUFBRWhDLFFBQVE7UUFBSTtJQUNoSTtBQUNGIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXEFTVVNcXERvd25sb2Fkc1xcZGlzYXN0ZXItZGFzaGJvYXJkXFxhcHBcXGFwaVxcc2F0ZWxsaXRlXFxnZW9jb2RlLXN1Z2dlc3RcXHJvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIEdFVChyZXF1ZXN0OiBSZXF1ZXN0KSB7XG4gIGNvbnN0IHsgc2VhcmNoUGFyYW1zIH0gPSBuZXcgVVJMKHJlcXVlc3QudXJsKTtcbiAgY29uc3QgcXVlcnkgPSBzZWFyY2hQYXJhbXMuZ2V0KCdxJyk7XG5cbiAgaWYgKCFxdWVyeSkge1xuICAgICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogXCJRdWVyeSBwYXJhbWV0ZXIgJ3EnIGlzIHJlcXVpcmVkXCIgfSwgeyBzdGF0dXM6IDQwMCB9KTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgYXBpS2V5ID0gcHJvY2Vzcy5lbnYuR09PR0xFX0dFT0NPRElOR19BUElfS0VZO1xuXG4gICAgaWYgKCFhcGlLZXkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignR29vZ2xlIEdlb2NvZGluZyBBUEkga2V5IG5vdCBjb25maWd1cmVkLicpO1xuICAgIH1cblxuICAgIGNvbnN0IHNlc3Npb25Ub2tlbiA9IGNyeXB0by5yYW5kb21VVUlEKCk7IC8vIEdlbmVyYXRlIGEgbmV3IHNlc3Npb24gdG9rZW4gZm9yIGVhY2ggYXV0b2NvbXBsZXRlIHNlc3Npb25cblxuICAgIGNvbnN0IGF1dG9jb21wbGV0ZVJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYGh0dHBzOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9wbGFjZS9hdXRvY29tcGxldGUvanNvbj9pbnB1dD0ke2VuY29kZVVSSUNvbXBvbmVudChxdWVyeSl9JmtleT0ke2FwaUtleX0mc2Vzc2lvbnRva2VuPSR7c2Vzc2lvblRva2VufWApO1xuICAgIFxuICAgIGlmICghYXV0b2NvbXBsZXRlUmVzcG9uc2Uub2spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgR29vZ2xlIFBsYWNlcyBBdXRvY29tcGxldGUgQVBJIHJlcXVlc3QgZmFpbGVkOiAke2F1dG9jb21wbGV0ZVJlc3BvbnNlLnN0YXR1c31gKTtcbiAgICB9XG5cbiAgICBjb25zdCBhdXRvY29tcGxldGVEYXRhID0gYXdhaXQgYXV0b2NvbXBsZXRlUmVzcG9uc2UuanNvbigpO1xuXG4gICAgaWYgKGF1dG9jb21wbGV0ZURhdGEuc3RhdHVzICE9PSAnT0snICYmIGF1dG9jb21wbGV0ZURhdGEuc3RhdHVzICE9PSAnWkVST19SRVNVTFRTJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBHb29nbGUgUGxhY2VzIEF1dG9jb21wbGV0ZSBBUEkgZXJyb3I6ICR7YXV0b2NvbXBsZXRlRGF0YS5zdGF0dXN9IC0gJHthdXRvY29tcGxldGVEYXRhLmVycm9yX21lc3NhZ2UgfHwgJ1Vua25vd24gZXJyb3InfWApO1xuICAgIH1cblxuICAgIGlmIChhdXRvY29tcGxldGVEYXRhLnN0YXR1cyA9PT0gJ1pFUk9fUkVTVUxUUycpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihbXSk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3VnZ2VzdGlvbnMgPSBhdXRvY29tcGxldGVEYXRhLnByZWRpY3Rpb25zLm1hcCgocHJlZGljdGlvbjogYW55KSA9PiAoe1xuICAgICAgaWQ6IHByZWRpY3Rpb24ucGxhY2VfaWQsXG4gICAgICBuYW1lOiBwcmVkaWN0aW9uLnN0cnVjdHVyZWRfZm9ybWF0dGluZy5tYWluX3RleHQsXG4gICAgICBjb3VudHJ5OiAnJywgLy8gTm90IGF2YWlsYWJsZSBmcm9tIEF1dG9jb21wbGV0ZSBBUEkgZGlyZWN0bHlcbiAgICAgIHN0YXRlOiAnJywgICAvLyBOb3QgYXZhaWxhYmxlIGZyb20gQXV0b2NvbXBsZXRlIEFQSSBkaXJlY3RseVxuICAgICAgY2l0eTogJycsICAgIC8vIE5vdCBhdmFpbGFibGUgZnJvbSBBdXRvY29tcGxldGUgQVBJIGRpcmVjdGx5XG4gICAgICBwb3N0Y29kZTogJycsLy8gTm90IGF2YWlsYWJsZSBmcm9tIEF1dG9jb21wbGV0ZSBBUEkgZGlyZWN0bHlcbiAgICAgIGNvb3JkaW5hdGVzOiBudWxsLCAvLyBDb29yZGluYXRlcyB3aWxsIGJlIGZldGNoZWQgb24gc2VsZWN0aW9uXG4gICAgICBkaXNwbGF5TmFtZTogcHJlZGljdGlvbi5kZXNjcmlwdGlvbixcbiAgICB9KSk7XG5cbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oc3VnZ2VzdGlvbnMpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0dlb2NvZGUgc3VnZ2VzdCBlcnJvcjonLCBlcnJvcik7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBlcnJvci5tZXNzYWdlIHx8ICdGYWlsZWQgdG8gZmV0Y2ggR29vZ2xlIFBsYWNlcyBBdXRvY29tcGxldGUgc3VnZ2VzdGlvbnMuJyB9LCB7IHN0YXR1czogNTAwIH0pO1xuICB9XG59Il0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsIkdFVCIsInJlcXVlc3QiLCJzZWFyY2hQYXJhbXMiLCJVUkwiLCJ1cmwiLCJxdWVyeSIsImdldCIsImpzb24iLCJlcnJvciIsInN0YXR1cyIsImFwaUtleSIsInByb2Nlc3MiLCJlbnYiLCJHT09HTEVfR0VPQ09ESU5HX0FQSV9LRVkiLCJFcnJvciIsInNlc3Npb25Ub2tlbiIsImNyeXB0byIsInJhbmRvbVVVSUQiLCJhdXRvY29tcGxldGVSZXNwb25zZSIsImZldGNoIiwiZW5jb2RlVVJJQ29tcG9uZW50Iiwib2siLCJhdXRvY29tcGxldGVEYXRhIiwiZXJyb3JfbWVzc2FnZSIsInN1Z2dlc3Rpb25zIiwicHJlZGljdGlvbnMiLCJtYXAiLCJwcmVkaWN0aW9uIiwiaWQiLCJwbGFjZV9pZCIsIm5hbWUiLCJzdHJ1Y3R1cmVkX2Zvcm1hdHRpbmciLCJtYWluX3RleHQiLCJjb3VudHJ5Iiwic3RhdGUiLCJjaXR5IiwicG9zdGNvZGUiLCJjb29yZGluYXRlcyIsImRpc3BsYXlOYW1lIiwiZGVzY3JpcHRpb24iLCJjb25zb2xlIiwibWVzc2FnZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/satellite/geocode-suggest/route.ts\n");

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