define(["require", "exports", "Helpers/Events", "Lib/lazyload"], function (require, exports, Events, LazyLoad) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$ScrollChanged = new Events.$Event();
    exports.Container = document.querySelector("*[data-scroll-bar]");
    var onScroll = function () {
        exports.$ScrollChanged.Publish(exports.Container);
    };
    exports.Container.addEventListener("scroll", onScroll);
    var myLazyLoad = new LazyLoad({
        container: exports.Container
    });
    var hash = document.location.hash;
    if (hash && hash.substr(1)) {
        var targetElt = document.getElementById(hash.substr(1));
        if (targetElt) {
            require(["Helpers/Scroller"], function (s) {
                s.ToHtmlElt(targetElt, 0, true, exports.Container);
            });
        }
    }
});
