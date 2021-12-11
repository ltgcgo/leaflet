"use strict";

if (self.matchMedia) {
	let isColorMode = self.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : (self.matchMedia("(inverted-colors: inverted)").matches ? "invert" : "light");
	console.log(`Color mode: ${(isColorMode)}`);
};

$invoke(false, function () {
	// Load bindings (lightfelt.main.binding)
	self.AppBinding = {};
	// Bind elements
	AppBinding.appVar = new Map();
	AppBinding.appTable = {};
	HTMLElement.prototype.bindVar = function () {
		if (!this.bindList) {
			let otxt = this.innerHTML;
			let bindList = new Set(), bindName = "";
			let mode = 0;
			Array.from(otxt).forEach((e) => {
				switch (mode) {
					case 0: {
						mode = (e == "$") ? 1 : ((e == "\\") ? 3 : 0);
						break;
					};
					case 1: {
						mode = +(e == "{") << 1;
						break;
					};
					case 2: {
						if (e == "\\") {
							mode = 5;
						} else if (e == "}") {
							bindList.add(bindName);
							bindName = "";
							mode = 0;
						} else {
							bindName += e;
						};
						break;
					};
					default: {
						mode = (mode + 3) % 3;
						console.log("Out of bound.");
					};
				};
			});
			Array.from(bindList).forEach((e) => {
				if (!AppBinding.appTable[e]) {
					AppBinding.appTable[e] = new Set();
				};
				AppBinding.appTable[e].add(this);
			});
			this.bindText = otxt;
			this.bindList = bindList;
		} else {
			throw Error("Element already bound");
		};
	};
	HTMLElement.prototype.unbindVar = function () {
		this.bindList.forEach((e) => {
			AppBinding.appTable[e].delete(this);
		});
		delete this.bindList;
		this.innerHTML = this.bindText;
		delete this.bindText;
	};
	HTMLElement.prototype.bindUpdate = function () {
		let replaceTable = {};
		this.bindList.forEach((e) => {
			replaceTable[e] = AppBinding.get(e);
		});
		this.innerHTML = this.bindText.alter(replaceTable);
	};
	let binds = $a(".bind-dyn");
	binds.forEach((e) => {
		e.bindVar();
		e.classList.off("bind-dyn");
	});
	// Bind variables
	AppBinding.metaVar = new Map();
	$a("meta.bind-var").forEach(function (e) {
		AppBinding.metaVar.set(e.name, e.content);
	});
	// Finishing binding
	AppBinding.set = function (name) {
		AppBinding.appVar.set(...arguments);
		if (AppBinding.appTable[name]) {
			Array.from(AppBinding.appTable[name]).forEach((e) => {
				e.bindUpdate();
			});
		};
	};
	AppBinding.get = function () {
		return AppBinding.appVar.get(...arguments);
	};
	// Set all variables
	let statusCode = AppBinding.metaVar.get("status-code");
	AppBinding.set("statusCode", statusCode);
	AppBinding.set("level", statusCode[0].withAny("45") ? "Error" : "Warn");
	AppBinding.set("realHost", location.hostname);
	self.switchStatusCode = function (code) {
		AppBinding.set("statusCode", code);
		AppBinding.set("statusMessage", (self.statusCode[code] || "Status unset").toUpperCase());
		AppBinding.set("statusDesc", (self.statusMsg[code] || "Status unset"));
	};
	fetch("/errors/status.json").then((e) => {return e.json()}).then((json) => {
		self.statusCode = json;
		AppBinding.set("statusMessage", (AppBinding.metaVar.get("status-msg") || json[statusCode] || AppBinding.metaVar.get("status-text") || "Status unset").toUpperCase());
	});
	fetch("/errors/statusDesc.json").then((e) => {return e.json()}).then((json) => {
		self.statusMsg = json;
		AppBinding.set("statusDesc", json[statusCode] || "Description unset");
	});
	// Is it CDN?
	let cdnString = "";
	if (AppBinding.metaVar.get("cdn-origin").length > 0) {
		cdnString += AppBinding.metaVar.get("cdn-origin") + " ";
	};
	if (AppBinding.metaVar.get("forwarded-proto").length > 0) {
		cdnString += AppBinding.metaVar.get("forwarded-proto") + " ";
	};
	if (AppBinding.metaVar.get("forwarded-for").length > 0) {
		cdnString += AppBinding.metaVar.get("forwarded-for") + " ";
	};
	AppBinding.set("cdnStatus", cdnString || "No CDN");
});
