"use strict";

document.addEventListener("readystatechange", function () {
	if (this.readyState == "interactive") {
		if (document.querySelector(".big-text").innerText == "BLOCKED") {
			document.querySelector("ul").remove();
		};
	};
});
