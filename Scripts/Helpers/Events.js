define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var topics = {};
    var $Event = (function () {
        function $Event() {
            this._Queue = [];
        }
        $Event.prototype.Subscribe = function (handle) {
            this._Queue.push(handle);
        };
        $Event.prototype.Remove = function (handle) {
            if (handle == null) {
                this._Queue = [];
                return;
            }
            var ind = this._Queue.indexOf(handle);
            if (ind < 0)
                return;
            this._Queue.splice(ind, 1);
        };
        $Event.prototype.Publish = function (obj) {
            this._Queue.forEach(function (handler) {
                handler(obj);
            });
        };
        return $Event;
    }());
    exports.$Event = $Event;
    exports.$PageLoad = new $Event();
    exports.$PageLeave = new $Event();
    window["PageLoad"] = function () {
        exports.$PageLoad.Publish(window);
    };
    window["PageLeave"] = function () {
        exports.$PageLeave.Publish(window);
    };
});
