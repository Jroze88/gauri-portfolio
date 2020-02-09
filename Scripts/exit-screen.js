define(["require", "exports", "Transitions"], function (require, exports, Transitions) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var container = document.querySelector("*[data-behavior='exit-screen']");
    var animation;
    var domainName = window.location.hostname.replace("www.", "");
    var links = document.querySelectorAll("a[href^='/'], a[href^='?'], a[href^='http://www." + domainName + "'], a[href^='http://" + domainName + "'], a[href^='https://www." + domainName + "'], a[href^='https://" + domainName + "']");
    var _loop_1 = function () {
        var link = links[i];
        if (link.getAttribute("data-exit-screen") == "disabled")
            return "continue";
        if (link.getAttribute("href").match("^.+\.pdf"))
            return "continue";
        link.addEventListener("click", function (e) {
            e.preventDefault();
            if (animation)
                animation.Abort();
            animation = Transitions.Create()
                .Chain({ elt: container, state: "show" })
                .Chain({ elt: document.body, state: "hide" })
                .Wait(100)
                .Call(function () {
                document.location.href = link.getAttribute("href");
            })
                .Start();
        });
    };
    for (var i = 0; i < links.length; i++) {
        _loop_1();
    }
    window.addEventListener("pagehide", function (e) {
        Transitions.Clean(container, document.body);
    });
});
