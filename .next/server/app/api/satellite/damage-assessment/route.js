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
exports.id = "app/api/satellite/damage-assessment/route";
exports.ids = ["app/api/satellite/damage-assessment/route"];
exports.modules = {

/***/ "(rsc)/./app/api/satellite/damage-assessment/route.ts":
/*!******************************************************!*\
  !*** ./app/api/satellite/damage-assessment/route.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n\n// Mock function to simulate AI-powered damage assessment\nconst assessDamage = (disaster)=>{\n    const { lat, lng } = disaster.location;\n    const assessment = {\n        disasterId: disaster.id,\n        heatmap: [],\n        summary: {\n            totalArea: 0,\n            highDamage: 0,\n            mediumDamage: 0,\n            lowDamage: 0\n        }\n    };\n    const numPoints = 150;\n    let totalArea = 0, high = 0, med = 0, low = 0;\n    for(let i = 0; i < numPoints; i++){\n        const pointLat = lat + (Math.random() - 0.5) * 0.2;\n        const pointLng = lng + (Math.random() - 0.5) * 0.2;\n        const intensity = Math.random(); // 0 to 1, where 1 is high damage\n        // @ts-ignore\n        assessment.heatmap.push([\n            pointLat,\n            pointLng,\n            intensity\n        ]);\n        const area = Math.random() * 0.5; // sq km\n        totalArea += area;\n        if (intensity > 0.7) high += area;\n        else if (intensity > 0.4) med += area;\n        else low += area;\n    }\n    assessment.summary = {\n        totalArea: totalArea,\n        highDamage: high,\n        mediumDamage: med,\n        lowDamage: low\n    };\n    return assessment;\n};\nasync function POST(request) {\n    try {\n        let disaster;\n        try {\n            disaster = await request.json();\n        } catch (jsonError) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Invalid JSON in request body.'\n            }, {\n                status: 400\n            });\n        }\n        if (!disaster || !disaster.location) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Invalid disaster data provided.'\n            }, {\n                status: 400\n            });\n        }\n        const damageAssessment = assessDamage(disaster);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(damageAssessment);\n    } catch (error) {\n        console.error('Damage assessment API error:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed to assess damage.'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3NhdGVsbGl0ZS9kYW1hZ2UtYXNzZXNzbWVudC9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7OztBQUEyQztBQUUzQyx5REFBeUQ7QUFDekQsTUFBTUMsZUFBZSxDQUFDQztJQUNwQixNQUFNLEVBQUVDLEdBQUcsRUFBRUMsR0FBRyxFQUFFLEdBQUdGLFNBQVNHLFFBQVE7SUFDdEMsTUFBTUMsYUFBYTtRQUNqQkMsWUFBWUwsU0FBU00sRUFBRTtRQUN2QkMsU0FBUyxFQUFFO1FBQ1hDLFNBQVM7WUFDUEMsV0FBVztZQUNYQyxZQUFZO1lBQ1pDLGNBQWM7WUFDZEMsV0FBVztRQUNiO0lBQ0Y7SUFFQSxNQUFNQyxZQUFZO0lBQ2xCLElBQUlKLFlBQVksR0FBR0ssT0FBTyxHQUFHQyxNQUFNLEdBQUdDLE1BQU07SUFFNUMsSUFBSyxJQUFJQyxJQUFJLEdBQUdBLElBQUlKLFdBQVdJLElBQUs7UUFDbEMsTUFBTUMsV0FBV2pCLE1BQU0sQ0FBQ2tCLEtBQUtDLE1BQU0sS0FBSyxHQUFFLElBQUs7UUFDL0MsTUFBTUMsV0FBV25CLE1BQU0sQ0FBQ2lCLEtBQUtDLE1BQU0sS0FBSyxHQUFFLElBQUs7UUFDL0MsTUFBTUUsWUFBWUgsS0FBS0MsTUFBTSxJQUFJLGlDQUFpQztRQUVsRSxhQUFhO1FBQ2JoQixXQUFXRyxPQUFPLENBQUNnQixJQUFJLENBQUM7WUFBQ0w7WUFBVUc7WUFBVUM7U0FBVTtRQUV2RCxNQUFNRSxPQUFPTCxLQUFLQyxNQUFNLEtBQUssS0FBSyxRQUFRO1FBQzFDWCxhQUFhZTtRQUNiLElBQUlGLFlBQVksS0FBS1IsUUFBUVU7YUFDeEIsSUFBSUYsWUFBWSxLQUFLUCxPQUFPUzthQUM1QlIsT0FBT1E7SUFDZDtJQUVBcEIsV0FBV0ksT0FBTyxHQUFHO1FBQ25CQyxXQUFXQTtRQUNYQyxZQUFZSTtRQUNaSCxjQUFjSTtRQUNkSCxXQUFXSTtJQUNiO0lBRUEsT0FBT1o7QUFDVDtBQUVPLGVBQWVxQixLQUFLQyxPQUFnQjtJQUN6QyxJQUFJO1FBQ0YsSUFBSTFCO1FBQ0osSUFBSTtZQUNGQSxXQUFXLE1BQU0wQixRQUFRQyxJQUFJO1FBQy9CLEVBQUUsT0FBT0MsV0FBVztZQUNsQixPQUFPOUIscURBQVlBLENBQUM2QixJQUFJLENBQUM7Z0JBQUVFLE9BQU87WUFBZ0MsR0FBRztnQkFBRUMsUUFBUTtZQUFJO1FBQ3JGO1FBRUEsSUFBSSxDQUFDOUIsWUFBWSxDQUFDQSxTQUFTRyxRQUFRLEVBQUU7WUFDbkMsT0FBT0wscURBQVlBLENBQUM2QixJQUFJLENBQUM7Z0JBQUVFLE9BQU87WUFBa0MsR0FBRztnQkFBRUMsUUFBUTtZQUFJO1FBQ3ZGO1FBRUEsTUFBTUMsbUJBQW1CaEMsYUFBYUM7UUFDdEMsT0FBT0YscURBQVlBLENBQUM2QixJQUFJLENBQUNJO0lBRTNCLEVBQUUsT0FBT0YsT0FBTztRQUNkRyxRQUFRSCxLQUFLLENBQUMsZ0NBQWdDQTtRQUM5QyxPQUFPL0IscURBQVlBLENBQUM2QixJQUFJLENBQUM7WUFBRUUsT0FBTztRQUEyQixHQUFHO1lBQUVDLFFBQVE7UUFBSTtJQUNoRjtBQUNGIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXEFTVVNcXERvd25sb2Fkc1xcZGlzYXN0ZXItZGFzaGJvYXJkXFxhcHBcXGFwaVxcc2F0ZWxsaXRlXFxkYW1hZ2UtYXNzZXNzbWVudFxccm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xuXG4vLyBNb2NrIGZ1bmN0aW9uIHRvIHNpbXVsYXRlIEFJLXBvd2VyZWQgZGFtYWdlIGFzc2Vzc21lbnRcbmNvbnN0IGFzc2Vzc0RhbWFnZSA9IChkaXNhc3RlcjogYW55KSA9PiB7XG4gIGNvbnN0IHsgbGF0LCBsbmcgfSA9IGRpc2FzdGVyLmxvY2F0aW9uO1xuICBjb25zdCBhc3Nlc3NtZW50ID0ge1xuICAgIGRpc2FzdGVySWQ6IGRpc2FzdGVyLmlkLFxuICAgIGhlYXRtYXA6IFtdLFxuICAgIHN1bW1hcnk6IHtcbiAgICAgIHRvdGFsQXJlYTogMCxcbiAgICAgIGhpZ2hEYW1hZ2U6IDAsXG4gICAgICBtZWRpdW1EYW1hZ2U6IDAsXG4gICAgICBsb3dEYW1hZ2U6IDAsXG4gICAgfSxcbiAgfTtcblxuICBjb25zdCBudW1Qb2ludHMgPSAxNTA7XG4gIGxldCB0b3RhbEFyZWEgPSAwLCBoaWdoID0gMCwgbWVkID0gMCwgbG93ID0gMDtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IG51bVBvaW50czsgaSsrKSB7XG4gICAgY29uc3QgcG9pbnRMYXQgPSBsYXQgKyAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAwLjI7XG4gICAgY29uc3QgcG9pbnRMbmcgPSBsbmcgKyAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAwLjI7XG4gICAgY29uc3QgaW50ZW5zaXR5ID0gTWF0aC5yYW5kb20oKTsgLy8gMCB0byAxLCB3aGVyZSAxIGlzIGhpZ2ggZGFtYWdlXG4gICAgXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGFzc2Vzc21lbnQuaGVhdG1hcC5wdXNoKFtwb2ludExhdCwgcG9pbnRMbmcsIGludGVuc2l0eV0pO1xuXG4gICAgY29uc3QgYXJlYSA9IE1hdGgucmFuZG9tKCkgKiAwLjU7IC8vIHNxIGttXG4gICAgdG90YWxBcmVhICs9IGFyZWE7XG4gICAgaWYgKGludGVuc2l0eSA+IDAuNykgaGlnaCArPSBhcmVhO1xuICAgIGVsc2UgaWYgKGludGVuc2l0eSA+IDAuNCkgbWVkICs9IGFyZWE7XG4gICAgZWxzZSBsb3cgKz0gYXJlYTtcbiAgfVxuXG4gIGFzc2Vzc21lbnQuc3VtbWFyeSA9IHtcbiAgICB0b3RhbEFyZWE6IHRvdGFsQXJlYSxcbiAgICBoaWdoRGFtYWdlOiBoaWdoLFxuICAgIG1lZGl1bURhbWFnZTogbWVkLFxuICAgIGxvd0RhbWFnZTogbG93LFxuICB9O1xuXG4gIHJldHVybiBhc3Nlc3NtZW50O1xufTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxdWVzdDogUmVxdWVzdCkge1xuICB0cnkge1xuICAgIGxldCBkaXNhc3RlcjtcbiAgICB0cnkge1xuICAgICAgZGlzYXN0ZXIgPSBhd2FpdCByZXF1ZXN0Lmpzb24oKTtcbiAgICB9IGNhdGNoIChqc29uRXJyb3IpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnSW52YWxpZCBKU09OIGluIHJlcXVlc3QgYm9keS4nIH0sIHsgc3RhdHVzOiA0MDAgfSk7XG4gICAgfVxuXG4gICAgaWYgKCFkaXNhc3RlciB8fCAhZGlzYXN0ZXIubG9jYXRpb24pIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnSW52YWxpZCBkaXNhc3RlciBkYXRhIHByb3ZpZGVkLicgfSwgeyBzdGF0dXM6IDQwMCB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBkYW1hZ2VBc3Nlc3NtZW50ID0gYXNzZXNzRGFtYWdlKGRpc2FzdGVyKTtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oZGFtYWdlQXNzZXNzbWVudCk7XG5cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdEYW1hZ2UgYXNzZXNzbWVudCBBUEkgZXJyb3I6JywgZXJyb3IpO1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnRmFpbGVkIHRvIGFzc2VzcyBkYW1hZ2UuJyB9LCB7IHN0YXR1czogNTAwIH0pO1xuICB9XG59XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiYXNzZXNzRGFtYWdlIiwiZGlzYXN0ZXIiLCJsYXQiLCJsbmciLCJsb2NhdGlvbiIsImFzc2Vzc21lbnQiLCJkaXNhc3RlcklkIiwiaWQiLCJoZWF0bWFwIiwic3VtbWFyeSIsInRvdGFsQXJlYSIsImhpZ2hEYW1hZ2UiLCJtZWRpdW1EYW1hZ2UiLCJsb3dEYW1hZ2UiLCJudW1Qb2ludHMiLCJoaWdoIiwibWVkIiwibG93IiwiaSIsInBvaW50TGF0IiwiTWF0aCIsInJhbmRvbSIsInBvaW50TG5nIiwiaW50ZW5zaXR5IiwicHVzaCIsImFyZWEiLCJQT1NUIiwicmVxdWVzdCIsImpzb24iLCJqc29uRXJyb3IiLCJlcnJvciIsInN0YXR1cyIsImRhbWFnZUFzc2Vzc21lbnQiLCJjb25zb2xlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/satellite/damage-assessment/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsatellite%2Fdamage-assessment%2Froute&page=%2Fapi%2Fsatellite%2Fdamage-assessment%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsatellite%2Fdamage-assessment%2Froute.ts&appDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsatellite%2Fdamage-assessment%2Froute&page=%2Fapi%2Fsatellite%2Fdamage-assessment%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsatellite%2Fdamage-assessment%2Froute.ts&appDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_ASUS_Downloads_disaster_dashboard_app_api_satellite_damage_assessment_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/satellite/damage-assessment/route.ts */ \"(rsc)/./app/api/satellite/damage-assessment/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/satellite/damage-assessment/route\",\n        pathname: \"/api/satellite/damage-assessment\",\n        filename: \"route\",\n        bundlePath: \"app/api/satellite/damage-assessment/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\ASUS\\\\Downloads\\\\disaster-dashboard\\\\app\\\\api\\\\satellite\\\\damage-assessment\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_ASUS_Downloads_disaster_dashboard_app_api_satellite_damage_assessment_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZzYXRlbGxpdGUlMkZkYW1hZ2UtYXNzZXNzbWVudCUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGc2F0ZWxsaXRlJTJGZGFtYWdlLWFzc2Vzc21lbnQlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZzYXRlbGxpdGUlMkZkYW1hZ2UtYXNzZXNzbWVudCUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNBU1VTJTVDRG93bmxvYWRzJTVDZGlzYXN0ZXItZGFzaGJvYXJkJTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1DJTNBJTVDVXNlcnMlNUNBU1VTJTVDRG93bmxvYWRzJTVDZGlzYXN0ZXItZGFzaGJvYXJkJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUNnRDtBQUM3SDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiQzpcXFxcVXNlcnNcXFxcQVNVU1xcXFxEb3dubG9hZHNcXFxcZGlzYXN0ZXItZGFzaGJvYXJkXFxcXGFwcFxcXFxhcGlcXFxcc2F0ZWxsaXRlXFxcXGRhbWFnZS1hc3Nlc3NtZW50XFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9zYXRlbGxpdGUvZGFtYWdlLWFzc2Vzc21lbnQvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9zYXRlbGxpdGUvZGFtYWdlLWFzc2Vzc21lbnRcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL3NhdGVsbGl0ZS9kYW1hZ2UtYXNzZXNzbWVudC9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkM6XFxcXFVzZXJzXFxcXEFTVVNcXFxcRG93bmxvYWRzXFxcXGRpc2FzdGVyLWRhc2hib2FyZFxcXFxhcHBcXFxcYXBpXFxcXHNhdGVsbGl0ZVxcXFxkYW1hZ2UtYXNzZXNzbWVudFxcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsatellite%2Fdamage-assessment%2Froute&page=%2Fapi%2Fsatellite%2Fdamage-assessment%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsatellite%2Fdamage-assessment%2Froute.ts&appDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsatellite%2Fdamage-assessment%2Froute&page=%2Fapi%2Fsatellite%2Fdamage-assessment%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsatellite%2Fdamage-assessment%2Froute.ts&appDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();