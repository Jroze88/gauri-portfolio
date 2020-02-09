define(["require", "exports"], function (require, exports) {
    "use strict";
    var parseCSSDuration = function (duration) {
        var d = duration || "0s";
        return parseInt((parseFloat(d) * (/ms/.test(d) ? 1 : 1000)).toFixed(0));
    };
    var Transitions = (function () {
        function Transitions() {
        }
        Transitions.prototype.Create = function () {
            var _this = this;
            var queue = {
                Items: [],
                Chain: function () {
                    var transitions = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        transitions[_i] = arguments[_i];
                    }
                    return _this._Chain(queue, transitions);
                },
                Wait: function (milliseconds) { return _this._Wait(queue, milliseconds); },
                Call: function (fct) { return _this._Call(queue, fct); },
                Start: function () { return _this._Start(queue); }
            };
            return queue;
        };
        Transitions.prototype._Wait = function (queue, milliseconds) {
            queue.Items.push({ Timeout: milliseconds, Transitions: [] });
            return queue;
        };
        Transitions.prototype._Call = function (queue, fct) {
            queue.Items.push({ Callback: fct, Transitions: [] });
            return queue;
        };
        Transitions.prototype._Chain = function (queue, transitions) {
            queue.Items.push({ Transitions: transitions });
            return queue;
        };
        Transitions.prototype._Start = function (queue) {
            var items = queue.Items.slice();
            var animationqueue = {
                Items: items,
                TransitionEnds: [],
                Abort: function () {
                }
            };
            this._Animate(animationqueue);
            return animationqueue;
        };
        Transitions.prototype._Abort = function (queue) {
            if (queue.TimeOutId)
                clearTimeout(queue.TimeOutId);
            if (!queue.Items.length)
                return;
            queue.Items = [];
            queue.TransitionEnds.forEach(function (te) { return te(); });
        };
        Transitions.prototype._Animate = function (queue) {
            var _this = this;
            if (queue.TimeOutId)
                clearTimeout(queue.TimeOutId);
            if (!queue.Items.length) {
                this._End();
                return;
            }
            var queueitem = queue.Items.splice(0, 1)[0];
            var fallbackDelay = queueitem.Timeout || 0;
            queueitem.Transitions.forEach(function (t) {
                if (t.state == null || t.elt == null)
                    return;
                var previousState = t.elt.getAttribute("data-transition");
                if (previousState == t.state)
                    return;
                t.elt.setAttribute("data-transition-from", previousState ? previousState : "");
                t.elt.setAttribute("data-transition", t.state);
                var transitionDuration = parseCSSDuration(window.getComputedStyle(t.elt).transitionDuration);
                var transitionDelay = parseCSSDuration(window.getComputedStyle(t.elt).transitionDelay);
                var transitionTime = transitionDuration + transitionDelay;
                fallbackDelay = Math.max(fallbackDelay, transitionTime);
                var onTranend = function (e) {
                    if (e.target != t.elt)
                        return;
                    queue.TransitionEnds = queue.TransitionEnds.filter(function (t) { return t != onTranend; });
                    t.elt.removeEventListener("transitionend", onTranend);
                    if (!queue.TransitionEnds.length)
                        _this._Animate(queue);
                };
                queue.TransitionEnds.push(onTranend);
                t.elt.addEventListener("transitionend", onTranend);
            });
            if (queueitem.Callback)
                queueitem.Callback();
            if (!queue.TransitionEnds.length) {
                this._Animate(queue);
                return;
            }
            queue.TimeOutId = setTimeout(function () { return _this._Animate(queue); }, fallbackDelay + 10);
        };
        Transitions.prototype._End = function () {
        };
        Transitions.prototype.Clean = function () {
            var elts = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                elts[_i] = arguments[_i];
            }
            elts.forEach(function (elt) {
                elt.removeAttribute("data-transition-from");
                elt.removeAttribute("data-transition");
                var clone = elt.cloneNode(true);
                elt.parentNode.replaceChild(clone, elt);
            });
        };
        return Transitions;
    }());
    return new Transitions();
});
