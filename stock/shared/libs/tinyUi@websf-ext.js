"use strict";

/*
TinyUI for WEBSF, a set of very small UI components for using inside WAs.
Must load after all main components.
*/
// Fitting images
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

// Stylesheet generation
{
	let legitStyles = "";
	// Fitting icons
	{
		let legitSize = [16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512];
		legitSize.forEach((e) => {
			let s = e.toString();
			legitStyles += `.iconsize-${s} {width: ${s}px; height: ${s}px} `;
		});
	};
	// Final generation
	let styleMgr = document.createElement("link");
	styleMgr.rel = "stylesheet";
	styleMgr.href = new Blob(Array.from(legitStyles)).getURL();
	document.head.appendChild(styleMgr);
};

// Load jobs
{
// List collection
let listColFunc = function () {
	if ($a('*[class^=listcol-], *[class*=" listcol-"]').length > 0) {
		$a('*[class^=listcol-], *[class*=" listcol-"]').forEach(function (listCol) {
			let listColCls = [];
			listCol.classList.forEach((e) => {
				if (e.indexOf("listcol-") == 0) {
					listColCls.push(e.slice(8));
				};
			});
			Array.from(listCol.children).forEach(function (e) {
				listColCls.forEach(function (e1) {
					e.classList.on(e1);
				});
			});
			listColCls.forEach(function (e) {
				listCol.classList.off("listcol-" + e);
			});
		});
		console.log("Dealt.");
	};
	/* if (!self.listColThr) {
		setTimeout(listColFunc, 50);
	};*/
};

$invoke(false, function () {
	// List collection
	self.listColThr = setInterval(listColFunc, 50);
});
};
