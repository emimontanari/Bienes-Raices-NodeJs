/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapa.js":
/*!************************!*\
  !*** ./src/js/mapa.js ***!
  \************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function() {\n\n    const lat = document.querySelector('#lat').value ||  -31.417509999999936;\n    const lng = document.querySelector('#lng').value || -64.18170999999995;\n    const mapa = L.map('mapa').setView([lat, lng ], 13);\n    let marker;\n    //Utilizar provider y geocoder\n    const geocodeService = L.esri.Geocoding.geocodeService()\n\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\n    }).addTo(mapa);\n\n    // el pin\n    marker = new L.marker([lat,lng],{\n        draggable: true,\n        autoPan: true\n    }).addTo(mapa)\n\n    //Detectar el movimiento del pin\n    marker.on('moveend',function(e){\n        marker = e.target\n\n        const posicion = marker.getLatLng();\n        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng))\n\n        //obetener la informacion de la calle a soltar el pin\n\n        geocodeService.reverse().latlng(posicion, 13).run(function(error, resultado){\n            console.log(resultado)\n            marker.bindPopup(resultado.address.LongLabel)\n\n            //Llenar los campos\n\n            document.querySelector('.calle').textContent = resultado?.address?.Address ?? ''\n            document.querySelector('#calle').value = resultado?.address?.Address ?? ''\n            document.querySelector('#lat').value = resultado?.latlng?.lat ?? ''\n            document.querySelector('#lng').value = resultado?.latlng?.lng ?? ''\n        })\n    })\n})()\n\n//# sourceURL=webpack://bienesraices_mvc/./src/js/mapa.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapa.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;