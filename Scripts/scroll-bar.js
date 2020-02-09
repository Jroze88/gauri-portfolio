define(["require", "exports", "Scroll", "Menu", "Search"], function (require, exports, Scroll, Menu, Search) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var scrollContainer = Scroll.Container;
    var knob = document.querySelector(".body__knob");
    var start, startscroll, ratio, knowbheight, scrollHeight;
    var onresize = function () {
        scrollHeight = scrollContainer.scrollHeight;
        ratio = window.innerHeight / scrollHeight;
        knowbheight = ratio * window.innerHeight;
        if (ratio >= 1)
            knob.style.display = "none";
        else {
            knob.style.display = "block";
            knob.style.height = knowbheight + "px";
        }
    };
    var onScroll = function () {
        var lastscroll = scrollContainer.scrollTop / (scrollHeight - window.innerHeight);
        var fullsize = window.innerHeight - knowbheight;
        knob.style.top = lastscroll * fullsize + "px";
    };
    var onMouseMove = function (ev) {
        var delta = ev.pageY - start;
        var fullsize = window.innerHeight - knowbheight;
        scrollContainer.scrollTop = startscroll + ((scrollHeight - window.innerHeight) * (delta) / fullsize);
    };
    var onMouseDown = function (ev) {
        start = ev.pageY;
        startscroll = scrollContainer.scrollTop;
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        ev.preventDefault();
    };
    var onMouseUp = function (ev) {
        onMouseMove(ev);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
    };
    if (!Modernizr.touchevents && window.innerHeight < scrollContainer.scrollHeight) {
        knob.addEventListener("mousedown", onMouseDown);
        Scroll.$ScrollChanged.Subscribe(onScroll);
        var observeDOM = (function () {
            var MutationObserver = window["MutationObserver"] || window["WebKitMutationObserver"], eventListenerSupported = window.addEventListener;
            return function (obj, callback) {
                if (MutationObserver) {
                    var obs = new MutationObserver(function (mutations, observer) {
                        if (mutations[0].addedNodes.length || mutations[0].removedNodes.length)
                            callback();
                    });
                    obs.observe(obj, { childList: true, subtree: true });
                }
                else if (eventListenerSupported) {
                    obj.addEventListener('DOMNodeInserted', callback, false);
                    obj.addEventListener('DOMNodeRemoved', callback, false);
                }
            };
        })();
        observeDOM(document.body, function () {
            onresize();
            onScroll();
        });
        window.addEventListener("resize", function () {
            onresize();
            onScroll();
        });
        onScroll();
        onresize();
    }
    Menu.$MenuOpen.Subscribe(function () {
        knob.classList.add("body__knob--menu-opened");
        document.body.classList.add("body--no-scroll");
    });
    Menu.$MenuClose.Subscribe(function () {
        knob.classList.remove("body__knob--menu-opened");
        document.body.classList.remove("body--no-scroll");
    });
    Search.$SearchOpen.Subscribe(function () {
        knob.classList.add("body__knob--search-opened");
    });
    Search.$SearchClose.Subscribe(function () {
        knob.classList.remove("body__knob--search-opened");
    });
});
