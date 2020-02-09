define(["require", "exports", "Search"], function (require, exports, Search) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var mag = document.querySelector("*[data-magnifier]");
    mag.addEventListener("click", function () {
        var state = Search.Toggle();
    });
    Search.$SearchOpen.Subscribe(function () {
        mag.classList.add("magnifier--search-opened");
    });
    Search.$SearchClose.Subscribe(function () {
        mag.classList.remove("magnifier--search-opened");
    });
});
