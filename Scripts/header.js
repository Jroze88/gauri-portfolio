define(["require", "exports", "Affix", "Menu", "Search"], function (require, exports, Affix, Menu, Search) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var animation;
    var headerContainer = document.querySelector("*[data-header]");
    var opened = false;
    Affix.$AffixClose.Subscribe(function () {
        headerContainer.setAttribute("data-affix-state", "close");
    });
    Affix.$AffixOpen.Subscribe(function () {
        headerContainer.setAttribute("data-affix-state", "open");
    });
    Affix.$AffixTop.Subscribe(function () {
        headerContainer.setAttribute("data-affix-state", "top");
    });
    Menu.$MenuOpen.Subscribe(function () {
        headerContainer.classList.add("header--menu-opened");
    });
    Menu.$MenuClose.Subscribe(function () {
        headerContainer.classList.remove("header--menu-opened");
    });
    Search.$SearchOpen.Subscribe(function () {
        headerContainer.classList.add("header--search-opened");
    });
    Search.$SearchClose.Subscribe(function () {
        headerContainer.classList.remove("header--search-opened");
    });
});
