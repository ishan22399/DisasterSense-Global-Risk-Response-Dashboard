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
exports.id = "app/api/satellite/real-time/route";
exports.ids = ["app/api/satellite/real-time/route"];
exports.modules = {

/***/ "(rsc)/./app/api/satellite/real-time/route.ts":
/*!**********************************************!*\
  !*** ./app/api/satellite/real-time/route.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n\n// Utility to fetch data with error handling\nasync function fetchAPI(url, errorMessage) {\n    try {\n        const response = await fetch(url);\n        if (!response.ok) {\n            throw new Error(`${errorMessage}: ${response.status} ${response.statusText}`);\n        }\n        return await response.json();\n    } catch (error) {\n        console.error(error);\n        throw error;\n    }\n}\nasync function GET(request) {\n    const { searchParams } = new URL(request.url);\n    const lat = searchParams.get('lat');\n    const lon = searchParams.get('lon');\n    const disasterType = searchParams.get('disasterType');\n    if (!lat || !lon) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Latitude and longitude are required'\n        }, {\n            status: 400\n        });\n    }\n    try {\n        // 1. Geocoding (Reverse)\n        const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;\n        const geocoding = await fetchAPI(geoUrl, 'Geocoding failed');\n        // 2. Weather Data (now handled client-side by Google Maps Platform)\n        // 3. Satellite & Analysis Data (Simulated for now, but can be replaced with real APIs)\n        const satellite = {\n            timestamp: new Date().toISOString(),\n            nextPass: new Date(Date.now() + 90 * 60 * 1000).toISOString(),\n            resolution: '10m',\n            cloudCover: 0,\n            quality: 100,\n            sensors: [\n                'RGB',\n                'Multispectral',\n                'Thermal IR'\n            ]\n        };\n        const analysis = {\n            vegetationIndex: Math.random(),\n            thermalAnomaly: disasterType === 'wildfire' && Math.random() > 0.5,\n            waterLevels: disasterType === 'flood' ? Math.random() : 0,\n            fireDetection: disasterType === 'wildfire' ? Math.random() : 0,\n            changeDetection: Math.random()\n        };\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            geocoding,\n            satellite,\n            analysis\n        });\n    } catch (error) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: error.message\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3NhdGVsbGl0ZS9yZWFsLXRpbWUvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDMkM7QUFFM0MsNENBQTRDO0FBQzVDLGVBQWVDLFNBQVNDLEdBQVcsRUFBRUMsWUFBb0I7SUFDdkQsSUFBSTtRQUNGLE1BQU1DLFdBQVcsTUFBTUMsTUFBTUg7UUFDN0IsSUFBSSxDQUFDRSxTQUFTRSxFQUFFLEVBQUU7WUFDaEIsTUFBTSxJQUFJQyxNQUFNLEdBQUdKLGFBQWEsRUFBRSxFQUFFQyxTQUFTSSxNQUFNLENBQUMsQ0FBQyxFQUFFSixTQUFTSyxVQUFVLEVBQUU7UUFDOUU7UUFDQSxPQUFPLE1BQU1MLFNBQVNNLElBQUk7SUFDNUIsRUFBRSxPQUFPQyxPQUFPO1FBQ2RDLFFBQVFELEtBQUssQ0FBQ0E7UUFDZCxNQUFNQTtJQUNSO0FBQ0Y7QUFFTyxlQUFlRSxJQUFJQyxPQUFnQjtJQUN4QyxNQUFNLEVBQUVDLFlBQVksRUFBRSxHQUFHLElBQUlDLElBQUlGLFFBQVFaLEdBQUc7SUFDNUMsTUFBTWUsTUFBTUYsYUFBYUcsR0FBRyxDQUFDO0lBQzdCLE1BQU1DLE1BQU1KLGFBQWFHLEdBQUcsQ0FBQztJQUM3QixNQUFNRSxlQUFlTCxhQUFhRyxHQUFHLENBQUM7SUFFdEMsSUFBSSxDQUFDRCxPQUFPLENBQUNFLEtBQUs7UUFDaEIsT0FBT25CLHFEQUFZQSxDQUFDVSxJQUFJLENBQUM7WUFBRUMsT0FBTztRQUFzQyxHQUFHO1lBQUVILFFBQVE7UUFBSTtJQUMzRjtJQUVBLElBQUk7UUFDRix5QkFBeUI7UUFDekIsTUFBTWEsU0FBUyxDQUFDLDREQUE0RCxFQUFFSixJQUFJLEtBQUssRUFBRUUsS0FBSztRQUM5RixNQUFNRyxZQUFZLE1BQU1yQixTQUFTb0IsUUFBUTtRQUV6QyxvRUFBb0U7UUFFcEUsdUZBQXVGO1FBQ3ZGLE1BQU1FLFlBQVk7WUFDaEJDLFdBQVcsSUFBSUMsT0FBT0MsV0FBVztZQUNqQ0MsVUFBVSxJQUFJRixLQUFLQSxLQUFLRyxHQUFHLEtBQUssS0FBSyxLQUFLLE1BQU1GLFdBQVc7WUFDM0RHLFlBQVk7WUFDWkMsWUFBWTtZQUNaQyxTQUFTO1lBQ1RDLFNBQVM7Z0JBQUM7Z0JBQU87Z0JBQWlCO2FBQWE7UUFDakQ7UUFFQSxNQUFNQyxXQUFXO1lBQ2ZDLGlCQUFpQkMsS0FBS0MsTUFBTTtZQUM1QkMsZ0JBQWdCakIsaUJBQWlCLGNBQWNlLEtBQUtDLE1BQU0sS0FBSztZQUMvREUsYUFBYWxCLGlCQUFpQixVQUFVZSxLQUFLQyxNQUFNLEtBQUs7WUFDeERHLGVBQWVuQixpQkFBaUIsYUFBYWUsS0FBS0MsTUFBTSxLQUFLO1lBQzdESSxpQkFBaUJMLEtBQUtDLE1BQU07UUFDOUI7UUFFQSxPQUFPcEMscURBQVlBLENBQUNVLElBQUksQ0FBQztZQUN2Qlk7WUFDQUM7WUFDQVU7UUFDRjtJQUVGLEVBQUUsT0FBT3RCLE9BQVk7UUFDbkIsT0FBT1gscURBQVlBLENBQUNVLElBQUksQ0FBQztZQUFFQyxPQUFPQSxNQUFNOEIsT0FBTztRQUFDLEdBQUc7WUFBRWpDLFFBQVE7UUFBSTtJQUNuRTtBQUNGIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXEFTVVNcXERvd25sb2Fkc1xcZGlzYXN0ZXItZGFzaGJvYXJkXFxhcHBcXGFwaVxcc2F0ZWxsaXRlXFxyZWFsLXRpbWVcXHJvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xuXG4vLyBVdGlsaXR5IHRvIGZldGNoIGRhdGEgd2l0aCBlcnJvciBoYW5kbGluZ1xuYXN5bmMgZnVuY3Rpb24gZmV0Y2hBUEkodXJsOiBzdHJpbmcsIGVycm9yTWVzc2FnZTogc3RyaW5nKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpO1xuICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgJHtlcnJvck1lc3NhZ2V9OiAke3Jlc3BvbnNlLnN0YXR1c30gJHtyZXNwb25zZS5zdGF0dXNUZXh0fWApO1xuICAgIH1cbiAgICByZXR1cm4gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgIHRocm93IGVycm9yO1xuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQocmVxdWVzdDogUmVxdWVzdCkge1xuICBjb25zdCB7IHNlYXJjaFBhcmFtcyB9ID0gbmV3IFVSTChyZXF1ZXN0LnVybCk7XG4gIGNvbnN0IGxhdCA9IHNlYXJjaFBhcmFtcy5nZXQoJ2xhdCcpO1xuICBjb25zdCBsb24gPSBzZWFyY2hQYXJhbXMuZ2V0KCdsb24nKTtcbiAgY29uc3QgZGlzYXN0ZXJUeXBlID0gc2VhcmNoUGFyYW1zLmdldCgnZGlzYXN0ZXJUeXBlJyk7XG5cbiAgaWYgKCFsYXQgfHwgIWxvbikge1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnTGF0aXR1ZGUgYW5kIGxvbmdpdHVkZSBhcmUgcmVxdWlyZWQnIH0sIHsgc3RhdHVzOiA0MDAgfSk7XG4gIH1cblxuICB0cnkge1xuICAgIC8vIDEuIEdlb2NvZGluZyAoUmV2ZXJzZSlcbiAgICBjb25zdCBnZW9VcmwgPSBgaHR0cHM6Ly9ub21pbmF0aW0ub3BlbnN0cmVldG1hcC5vcmcvcmV2ZXJzZT9mb3JtYXQ9anNvbiZsYXQ9JHtsYXR9Jmxvbj0ke2xvbn1gO1xuICAgIGNvbnN0IGdlb2NvZGluZyA9IGF3YWl0IGZldGNoQVBJKGdlb1VybCwgJ0dlb2NvZGluZyBmYWlsZWQnKTtcblxuICAgIC8vIDIuIFdlYXRoZXIgRGF0YSAobm93IGhhbmRsZWQgY2xpZW50LXNpZGUgYnkgR29vZ2xlIE1hcHMgUGxhdGZvcm0pXG5cbiAgICAvLyAzLiBTYXRlbGxpdGUgJiBBbmFseXNpcyBEYXRhIChTaW11bGF0ZWQgZm9yIG5vdywgYnV0IGNhbiBiZSByZXBsYWNlZCB3aXRoIHJlYWwgQVBJcylcbiAgICBjb25zdCBzYXRlbGxpdGUgPSB7XG4gICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIG5leHRQYXNzOiBuZXcgRGF0ZShEYXRlLm5vdygpICsgOTAgKiA2MCAqIDEwMDApLnRvSVNPU3RyaW5nKCksXG4gICAgICByZXNvbHV0aW9uOiAnMTBtJyxcbiAgICAgIGNsb3VkQ292ZXI6IDAsIC8vIENsb3VkIGNvdmVyIHdpbGwgYmUgaGFuZGxlZCBieSBHb29nbGUgTWFwcyBXZWF0aGVyIExheWVyXG4gICAgICBxdWFsaXR5OiAxMDAsXG4gICAgICBzZW5zb3JzOiBbJ1JHQicsICdNdWx0aXNwZWN0cmFsJywgJ1RoZXJtYWwgSVInXSxcbiAgICB9O1xuXG4gICAgY29uc3QgYW5hbHlzaXMgPSB7XG4gICAgICB2ZWdldGF0aW9uSW5kZXg6IE1hdGgucmFuZG9tKCksXG4gICAgICB0aGVybWFsQW5vbWFseTogZGlzYXN0ZXJUeXBlID09PSAnd2lsZGZpcmUnICYmIE1hdGgucmFuZG9tKCkgPiAwLjUsXG4gICAgICB3YXRlckxldmVsczogZGlzYXN0ZXJUeXBlID09PSAnZmxvb2QnID8gTWF0aC5yYW5kb20oKSA6IDAsXG4gICAgICBmaXJlRGV0ZWN0aW9uOiBkaXNhc3RlclR5cGUgPT09ICd3aWxkZmlyZScgPyBNYXRoLnJhbmRvbSgpIDogMCxcbiAgICAgIGNoYW5nZURldGVjdGlvbjogTWF0aC5yYW5kb20oKSxcbiAgICB9O1xuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHtcbiAgICAgIGdlb2NvZGluZyxcbiAgICAgIHNhdGVsbGl0ZSxcbiAgICAgIGFuYWx5c2lzLFxuICAgIH0pO1xuXG4gIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogZXJyb3IubWVzc2FnZSB9LCB7IHN0YXR1czogNTAwIH0pO1xuICB9XG59XG4iXSwibmFtZXMiOlsiTmV4dFJlc3BvbnNlIiwiZmV0Y2hBUEkiLCJ1cmwiLCJlcnJvck1lc3NhZ2UiLCJyZXNwb25zZSIsImZldGNoIiwib2siLCJFcnJvciIsInN0YXR1cyIsInN0YXR1c1RleHQiLCJqc29uIiwiZXJyb3IiLCJjb25zb2xlIiwiR0VUIiwicmVxdWVzdCIsInNlYXJjaFBhcmFtcyIsIlVSTCIsImxhdCIsImdldCIsImxvbiIsImRpc2FzdGVyVHlwZSIsImdlb1VybCIsImdlb2NvZGluZyIsInNhdGVsbGl0ZSIsInRpbWVzdGFtcCIsIkRhdGUiLCJ0b0lTT1N0cmluZyIsIm5leHRQYXNzIiwibm93IiwicmVzb2x1dGlvbiIsImNsb3VkQ292ZXIiLCJxdWFsaXR5Iiwic2Vuc29ycyIsImFuYWx5c2lzIiwidmVnZXRhdGlvbkluZGV4IiwiTWF0aCIsInJhbmRvbSIsInRoZXJtYWxBbm9tYWx5Iiwid2F0ZXJMZXZlbHMiLCJmaXJlRGV0ZWN0aW9uIiwiY2hhbmdlRGV0ZWN0aW9uIiwibWVzc2FnZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./app/api/satellite/real-time/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsatellite%2Freal-time%2Froute&page=%2Fapi%2Fsatellite%2Freal-time%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsatellite%2Freal-time%2Froute.ts&appDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsatellite%2Freal-time%2Froute&page=%2Fapi%2Fsatellite%2Freal-time%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsatellite%2Freal-time%2Froute.ts&appDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_ASUS_Downloads_disaster_dashboard_app_api_satellite_real_time_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/satellite/real-time/route.ts */ \"(rsc)/./app/api/satellite/real-time/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/satellite/real-time/route\",\n        pathname: \"/api/satellite/real-time\",\n        filename: \"route\",\n        bundlePath: \"app/api/satellite/real-time/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\ASUS\\\\Downloads\\\\disaster-dashboard\\\\app\\\\api\\\\satellite\\\\real-time\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_ASUS_Downloads_disaster_dashboard_app_api_satellite_real_time_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZzYXRlbGxpdGUlMkZyZWFsLXRpbWUlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRnNhdGVsbGl0ZSUyRnJlYWwtdGltZSUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRnNhdGVsbGl0ZSUyRnJlYWwtdGltZSUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNBU1VTJTVDRG93bmxvYWRzJTVDZGlzYXN0ZXItZGFzaGJvYXJkJTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1DJTNBJTVDVXNlcnMlNUNBU1VTJTVDRG93bmxvYWRzJTVDZGlzYXN0ZXItZGFzaGJvYXJkJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUN3QztBQUNySDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiQzpcXFxcVXNlcnNcXFxcQVNVU1xcXFxEb3dubG9hZHNcXFxcZGlzYXN0ZXItZGFzaGJvYXJkXFxcXGFwcFxcXFxhcGlcXFxcc2F0ZWxsaXRlXFxcXHJlYWwtdGltZVxcXFxyb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvc2F0ZWxsaXRlL3JlYWwtdGltZS9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL3NhdGVsbGl0ZS9yZWFsLXRpbWVcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL3NhdGVsbGl0ZS9yZWFsLXRpbWUvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCJDOlxcXFxVc2Vyc1xcXFxBU1VTXFxcXERvd25sb2Fkc1xcXFxkaXNhc3Rlci1kYXNoYm9hcmRcXFxcYXBwXFxcXGFwaVxcXFxzYXRlbGxpdGVcXFxccmVhbC10aW1lXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsatellite%2Freal-time%2Froute&page=%2Fapi%2Fsatellite%2Freal-time%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsatellite%2Freal-time%2Froute.ts&appDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fsatellite%2Freal-time%2Froute&page=%2Fapi%2Fsatellite%2Freal-time%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fsatellite%2Freal-time%2Froute.ts&appDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5CASUS%5CDownloads%5Cdisaster-dashboard&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();