"use strict";

/*
TinyUI for WEBSF, a set of very small UI components for using inside WAs.
Must load after all main components.
*/

(self.HTMLImageElement || (function () {})).prototype.resize = function (width, height) {
	if (width == undefined) {} else if (width.constructor == Number) {
		if (width > 0) {
			this.style.width = width.toString() + "px";
		};
	} else if (width.constructor == String) {
		this.style.width = width;
	} else {
		this.style.width = undefined;
	};
	if (height == undefined) {} else if (height.constructor == Number) {
		if (height > 0) {
			this.style.height = height.toString() + "px";
		};
	} else if (height.constructor == String) {
		this.style.height = height;
	} else {
		this.style.height = "";
	};
};
(self.HTMLImageElement || (function () {})).prototype.fit = function (technique = "", dim = {}) {
	let nWidth = this.naturalWidth;
	let nHeight = this.naturalHeight;
	let nRatio = nWidth / nHeight;
	let dWidth = dim.w || this.clientWidth;
	let dHeight = dim.h || this.clientHeight;
	let dRatio = dWidth / dHeight;
	if (!!nRatio) {
		switch (technique.toLowerCase()) {
			case "fit": {
				if (nRatio > dRatio) {
					this.resize(-1, Math.round(dWidth / nRatio));
				} else if (nRatio < dRatio) {
					this.resize(Math.round(dHeight * nRatio));
				};
				break;
			};
			case "fill": {
				if (nRatio > dRatio) {
					this.resize(Math.round(dHeight * nRatio));
				} else if (nRatio < dRatio) {
					this.resize(-1, Math.round(dWidth / nRatio));
				};
				break;
			};
			default: {
				throw(new Error("Non-existent fitting technique"));
			};
		};
	};
};
