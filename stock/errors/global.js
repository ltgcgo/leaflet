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
			let otxt = this.innerText;
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
		this.innerText = this.bindText;
		delete this.bindText;
	};
	HTMLElement.prototype.bindUpdate = function () {
		let replaceTable = {};
		this.bindList.forEach((e) => {
			replaceTable[e] = AppBinding.get(e);
		});
		this.innerText = this.bindText.alter(replaceTable);
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
	fetch("/errors/status.json").then((e) => {return e.json()}).then((json) => {
		AppBinding.set("statusMessage", (json[statusCode] || "Status unset").toUpperCase());
	});
	fetch("/errors/statusDesc.json").then((e) => {return e.json()}).then((json) => {
		AppBinding.set("statusDesc", json[statusCode] || "Description unset");
	});
});
