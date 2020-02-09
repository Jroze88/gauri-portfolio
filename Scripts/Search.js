define(["require", "exports", "Transitions", "Helpers/Events", "GlobalEvents"], function (require, exports, Transitions, Events, GlobalEvents) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$SearchOpen = new Events.$Event();
    exports.$SearchClose = new Events.$Event();
    var animation;
    var searchContainer = document.querySelector(".body__search");
    var form = document.querySelector(".search__inner");
    var fadeInUp = Transitions.Create()
        .Chain({ elt: form, state: "fade-in-up" });
    var slideDown = Transitions.Create()
        .Chain({ elt: searchContainer, state: "open" })
        .Chain({ elt: form, state: "fade-in-up" });
    var slideUp = Transitions.Create()
        .Chain({ elt: form, state: "fade-out-down" })
        .Chain({ elt: searchContainer, state: "close" });
    exports.Open = function () {
        if (animation)
            animation.Abort();
        animation = slideDown.Start();
        exports.$SearchOpen.Publish(null);
        GlobalEvents.$NavigationOpened.Publish({ Caller: "search" });
        searchContainer.classList.add("search--opened");
        document.body.classList.add("body--search-opened");
    };
    exports.Close = function () {
        if (animation)
            animation.Abort();
        animation = slideUp.Start();
        exports.$SearchClose.Publish(null);
        searchContainer.classList.remove("search--opened");
        document.body.classList.remove("body--search-opened");
    };
    exports.Toggle = function () {
        var opened = searchContainer.getAttribute("data-transition") == "open";
        if (opened)
            exports.Close();
        else
            exports.Open();
        return !opened;
    };
    GlobalEvents.$NavigationOpened.Subscribe(function (arg) {
        if (arg.Caller != "search")
            exports.Close();
    });
    var searchlinks = [].slice.call(document.querySelectorAll("*[data-search-open]"));
    searchlinks.forEach(function (searchlink) {
        searchlink.addEventListener("click", function (e) {
            e.stopPropagation();
            exports.Open();
        });
    });
});
