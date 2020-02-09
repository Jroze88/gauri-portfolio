define(["require", "exports", "Helpers/Events"], function (require, exports, Events) {
    "use strict";
    var DiaporamaOptions = (function () {
        function DiaporamaOptions() {
            this.current = 0;
            this.loop = true;
            this.shuffle = false;
            this.autoplay = true;
            this.delay = 6000;
            this.opacity = 1;
            this.stopOnInteract = true;
            this.keyboardEvents = false;
        }
        return DiaporamaOptions;
    }());
    var shuffle = function (array) {
        var m = array.length, t, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        return array;
    };
    var Diaporama = (function () {
        function Diaporama(container, slides, options) {
            if (options === void 0) { options = null; }
            var _this = this;
            this.$OnShow = new Events.$Event();
            this.$OnHide = new Events.$Event();
            this.Current = -1;
            this.Container = container;
            if (this.Container.hasAttribute("data-diaporama"))
                this.Container.removeAttribute("data-diaporama");
            this.Options = options ? options : new DiaporamaOptions();
            if (!slides.length)
                return;
            if (options.shuffle)
                slides = shuffle(slides);
            this._Slides = slides;
            this.Current = options.current == undefined ? -1 : (options.current - 1);
            var l = slides.length;
            var _loop_1 = function () {
                var slide = slides[l];
                slide.addEventListener("transitionend", function (e) {
                    if (slide.style.opacity == "0")
                        slide.style.display = "none";
                });
            };
            while (l--) {
                _loop_1();
            }
            if (options.autoplay)
                this.Play();
            else {
                this._Next();
            }
            if (options.keyboardEvents) {
                window.addEventListener("keydown", function (e) {
                    switch (e.keyCode) {
                        case 39:
                            _this.Next();
                            break;
                        case 37:
                            _this.Previous();
                            break;
                    }
                });
            }
        }
        Diaporama.prototype.Play = function () {
            this._Playing = true;
            this._Next();
        };
        Diaporama.prototype.Pause = function () {
            this._Playing = false;
        };
        Diaporama.prototype.Go = function (slideNum) {
            this.Pause();
            this._Go(slideNum);
        };
        Diaporama.prototype.Next = function () {
            this.Pause();
            this._Next();
        };
        Diaporama.prototype.Previous = function () {
            this.Pause();
            this._Previous();
        };
        Diaporama.prototype._Go = function (slideNum) {
            var _this = this;
            if (this.Current == slideNum)
                return;
            var newElt = this._Slides[slideNum];
            if (newElt.style.display == "none") {
                newElt.style.opacity = "0";
            }
            newElt.style.display = "block";
            newElt.style.zIndex = "1";
            setTimeout(function () {
                newElt.style.opacity = _this.Options.opacity.toString();
            }, 1);
            this._OnSlideShow(slideNum, newElt);
            if (this.Current >= 0) {
                var oldElt = this._Slides[this.Current];
                this._OnSlideHide(this.Current, oldElt);
                oldElt.style.zIndex = "0";
                setTimeout(function () {
                    oldElt.style.opacity = "0";
                }, 1);
            }
            this.Current = slideNum;
        };
        Diaporama.prototype._OnSlideShow = function (index, slide) {
            slide.classList.add("diaporama__slide--show");
            slide.classList.remove("diaporama__slide--hide");
            if (this._Playing && this._Slides.length > 1) {
                clearTimeout(this._PlayingInte);
                this._PlayingInte = setTimeout(this._Next.bind(this), this.Options.delay);
            }
            this.$OnShow.Publish({ diaporma: this, slide: slide, index: index });
        };
        Diaporama.prototype._OnSlideHide = function (index, slide) {
            slide.classList.remove("diaporama__slide--show");
            slide.classList.add("diaporama__slide--hide");
            this.$OnHide.Publish({ diaporma: this, slide: slide, index: index });
        };
        Diaporama.prototype._Next = function () {
            if (!this.Options.loop && this.Current >= (this._Slides.length - 1))
                return;
            this._Go((this.Current + 1) % this._Slides.length);
        };
        Diaporama.prototype._Previous = function () {
            if (!this.Options.loop && this.Current <= 0)
                return;
            this._Go((this.Current - 1 + this._Slides.length) % this._Slides.length);
        };
        Diaporama.prototype.Destroy = function () {
            if (this._PlayingInte)
                clearTimeout(this._PlayingInte);
        };
        Diaporama.prototype.OnShow = function (handler) {
            this.$OnShow.Subscribe(function (ev) { return handler(ev.diaporma, ev.slide, ev.index); });
            return this;
        };
        Diaporama.prototype.OnHide = function (handler) {
            this.$OnHide.Subscribe(function (ev) { return handler(ev.diaporma, ev.slide, ev.index); });
            return this;
        };
        return Diaporama;
    }());
    var Discover = function () {
        var sliders = [].slice.call(document.querySelectorAll("*[data-diaporama]"));
        sliders.forEach(function (container) {
            var slides = Array.prototype.slice.call(container.querySelectorAll("*[data-diaporama-slide]"));
            if (slides.length == 0)
                return;
            var options = new DiaporamaOptions();
            if (container.hasAttribute("data-diaporama-shuffle"))
                options.shuffle = true;
            if (container.hasAttribute("data-diaporama-loop")) {
                options.loop = container.getAttribute("data-diaporama-loop").toLowerCase() == "true" || container.getAttribute("data-slider-loop") == "";
            }
            if (container.hasAttribute("data-diaporama-keyboard-events")) {
                options.keyboardEvents = container.getAttribute("data-diaporama-keyboard-events").toLowerCase() == "true" || container.getAttribute("data-diaporama-keyboard-events") == "";
            }
            options.delay = container.hasAttribute("data-diaporama-delay") ? parseInt(container.getAttribute("data-diaporama-delay")) : options.delay;
            if (container.hasAttribute("data-diaporama-autoplay")) {
                options.autoplay = container.getAttribute("data-diaporama-autoplay") == "true" || container.getAttribute("data-diaporama-autoplay") == "";
            }
            if (container.hasAttribute("data-diaporama-stop-on-interact")) {
                options.stopOnInteract = container.getAttribute("data-diaporama-stop-on-interact") == "true" || container.getAttribute("data-diaporama-stop-on-interact") == "";
            }
            if (container.hasAttribute("data-diaporama-current")) {
                options.current = parseInt(container.getAttribute("data-diaporama-current"));
            }
            var diaporama = new Diaporama(container, slides, options);
            if (container.hasAttribute("data-diaporama-adapt-size")) {
                var adaptSize = function (slide) {
                    var ratio = parseFloat(slide.getAttribute("data-diaporama-slide-ratio"));
                    var maxH = window.innerHeight * 0.8;
                    var maxW = window.innerWidth * 0.8;
                    var dratio = maxH / maxW;
                    var finalwidth, finalHeight;
                    if (dratio > ratio) {
                        finalwidth = maxW;
                        finalHeight = maxW * ratio;
                    }
                    else {
                        finalwidth = maxH / ratio;
                        finalHeight = maxH;
                    }
                    container.style.height = finalHeight + "px";
                    container.style.width = finalwidth + "px";
                };
                diaporama.OnShow(function (d, slide, i) {
                    void slide.offsetWidth;
                    adaptSize(slide);
                });
                diaporama.OnHide(function (d, slide, i) {
                    void slide.offsetWidth;
                });
                void slides[0].offsetWidth;
                adaptSize(slides[0]);
            }
            var next = [].slice.call(container.querySelectorAll("*[data-diaporama-next]"));
            next.forEach(function (nextLink) {
                nextLink.addEventListener("click", function () { return diaporama.Next(); });
            });
            var gos = [].slice.call(container.querySelectorAll("*[data-diaporama-go]"));
            gos.forEach(function (goLink) {
                var ind = parseInt(goLink.getAttribute("data-diaporama-index"));
                goLink.addEventListener("click", function () { return diaporama.Go(ind); });
            });
            var previous = [].slice.call(container.querySelectorAll("*[data-diaporama-previous]"));
            previous.forEach(function (previousLink) {
                previousLink.addEventListener("click", function () { return diaporama.Previous(); });
            });
            var navs = [].slice.call(container.querySelectorAll("*[data-diaporama-nav-item]"));
            navs.forEach(function (navLink) {
                var index = parseInt(navLink.getAttribute("data-diaporama-index"));
                navLink.addEventListener("click", function () { return diaporama.Go(index); });
                navLink.classList.toggle("diaporama__nav-item--current", index == diaporama.Current);
                diaporama.OnShow(function (s, elt, i) {
                    navLink.classList.toggle("diaporama__nav-item--current", index == i);
                });
            });
        });
    };
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
    observeDOM(document.body, Discover);
    Discover();
    return Diaporama;
});
