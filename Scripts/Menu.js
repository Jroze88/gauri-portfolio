define(["require", "exports", "Transitions", "Helpers/Events", "GlobalEvents"], function (require, exports, Transitions, Events, GlobalEvents) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$MenuOpen = new Events.$Event();
    exports.$MenuClose = new Events.$Event();
    var animation;
    var menuContainer = document.querySelector(".body__menu");
    var menuInner = document.querySelector(".menu__inner");
    var withIntro = menuContainer.classList.contains("body__menu--with-intro");
    var homepage = menuContainer.classList.contains("body__menu--homepage");
    var fadeInUp = Transitions.Create()
        .Chain({ elt: menuInner, state: "fade-in-up" });
    var slideDown = Transitions.Create()
        .Chain({ elt: menuContainer, state: "open" })
        .Chain({ elt: menuInner, state: "fade-in-up" });
    var slideUp = Transitions.Create()
        .Chain({ elt: menuInner, state: "fade-out-down" })
        .Chain({ elt: menuContainer, state: "close" });
    if (withIntro) {
        GlobalEvents.$IntroLeave.Subscribe(function () {
            if (animation)
                animation.Abort();
            animation = fadeInUp.Start();
        });
    }
    else if (homepage) {
        Events.$PageLoad.Subscribe(function () {
            if (animation)
                animation.Abort();
            animation = fadeInUp.Start();
        });
    }
    exports.Open = function () {
        if (animation)
            animation.Abort();
        animation = slideDown.Start();
        exports.$MenuOpen.Publish(null);
        GlobalEvents.$NavigationOpened.Publish({ Caller: "menu" });
    };
    exports.Close = function () {
        if (animation)
            animation.Abort();
        animation = slideUp.Start();
        exports.$MenuClose.Publish(null);
    };
    exports.Toggle = function () {
        var opened = menuContainer.getAttribute("data-transition") == "open";
        if (opened)
            exports.Close();
        else
            exports.Open();
        return !opened;
    };
    var links = [].slice.call(document.querySelectorAll("*[data-color]"));
    var backgound = document.querySelector("*[data-background]");
    if (backgound) {
        links.forEach(function (link) {
            var color = link.getAttribute("data-color");
            var uid = link.getAttribute("data-uid");
            var backimage = backgound.querySelector("*[data-background-uid='" + uid + "']");
            link.addEventListener("mouseenter", function () {
                backgound.setAttribute("data-theme", color);
                if (backimage)
                    backimage.classList.add("menu__background-images--show");
            });
            link.addEventListener("mouseleave", function () {
                backgound.setAttribute("data-theme", "");
                if (backimage)
                    backimage.classList.remove("menu__background-images--show");
            });
        });
    }
    GlobalEvents.$NavigationOpened.Subscribe(function (arg) {
        if (arg.Caller != "menu" && menuContainer.classList.contains("body__menu--sliding"))
            exports.Close();
    });
});
