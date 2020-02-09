define(["require", "exports", "Helpers/Events", "Scroll"], function (require, exports, Events, Scroll) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.$AffixTop = new Events.$Event(), exports.$AffixClose = new Events.$Event(), exports.$AffixOpen = new Events.$Event();
    var lastState;
    var lastScrollInDir = 0;
    var lastscroll = 0;
    var lastdir = 1;
    var onScroll = function (scrollContainer) {
        var previous = lastscroll;
        lastscroll = scrollContainer.scrollTop;
        if (scrollContainer.scrollTop < 10) {
            if (lastState !== exports.$AffixTop) {
                exports.$AffixTop.Publish(null);
                lastState = exports.$AffixTop;
            }
            return;
        }
        var d = (scrollContainer.scrollTop - previous);
        if (!d)
            return;
        var dir = d < 0 ? -1 : 1;
        if (lastdir != dir) {
            lastScrollInDir = 0;
            lastdir = dir;
        }
        lastScrollInDir++;
        if (lastScrollInDir < 5)
            return;
        if (dir > 0) {
            if (lastState !== exports.$AffixClose) {
                exports.$AffixClose.Publish(null);
                lastState = exports.$AffixClose;
            }
        }
        else {
            if (lastState !== exports.$AffixOpen) {
                exports.$AffixOpen.Publish(null);
                lastState = exports.$AffixOpen;
            }
        }
    };
    Scroll.$ScrollChanged.Subscribe(onScroll);
});
