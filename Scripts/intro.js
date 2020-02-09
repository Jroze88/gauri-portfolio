define(["require", "exports", "Transitions", "Helpers/Events", "GlobalEvents"], function (require, exports, Transitions, Events, GlobalEvents) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var animation;
    var introContainer = document.querySelector(".body__intro");
    var logo = document.querySelector(".intro__logo");
    var fadeInUp = Transitions.Create()
        .Chain({ elt: logo, state: "fade-in-up" });
    var closeTransition = Transitions.Create()
        .Chain({ elt: logo, state: "fade-out-down" })
        .Chain({ elt: introContainer, state: "hide" })
        .Call(function () { GlobalEvents.$IntroLeave.Publish(null); });
    Events.$PageLoad.Subscribe(function () {
        if (animation)
            animation.Abort();
        animation = fadeInUp.Start();
    });
    var closetimeoutID;
    var closeIntro = function () {
        clearTimeout(closetimeoutID);
        introContainer.removeEventListener("mousedown", closeIntro);
        if (animation)
            animation.Abort();
        animation = closeTransition.Start();
    };
    introContainer.addEventListener("mousedown", closeIntro);
    closetimeoutID = setTimeout(closeIntro, 3000);
});
