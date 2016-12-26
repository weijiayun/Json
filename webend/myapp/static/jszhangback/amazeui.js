/*! Amaze UI v2.6.2 | by Amaze UI Team | (c) 2016 AllMobilize, Inc. | Licensed under MIT | 2016-04-22T15:38:46+0800 */
!



function(t, e) {
    "object" == typeof exports && "object" == typeof module ? module.exports = e(require("jquery")) : "function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof exports ? exports.AMUI = e(require("jquery")) : t.AMUI = e(t.jQuery)
} (this,
function(t) {
    return function(t) {
        function e(n) {
            if (i[n]) return i[n].exports;
            var o = i[n] = {
                exports: {},
                id: n,
                loaded: !1
            };
            return t[n].call(o.exports, o, o.exports, e),
            o.loaded = !0,
            o.exports
        }
        var i = {};
        return e.m = t,
        e.c = i,
        e.p = "",
        e(0)
    } ([function(t, e, i) {
        "use strict";
        var n = i(1),
        o = i(2);
        i(3),
        i(4),
        i(5),
        i(6),
        i(7),
        i(8),
        i(9),
        i(10),
        i(11),
        i(14),
        i(15),
        i(16),
        i(17),
        i(18),
        i(19),
        i(20),
        i(21),
        i(22),
        i(24),
        i(25),
        i(23),
        i(27),
        i(28),
        i(29),
        i(30),
        i(31),
        i(32),
        i(33),
        i(26),
        i(34),
        i(35),
        i(36),
        i(37),
        i(38),
        i(39),
        i(40),
        i(41),
        i(42),
        i(43),
        i(44),
        i(45),
        i(46),
        i(47),
        i(48),
        i(49),
        i(50),
        i(51),
        i(52),
        i(53),
        i(54),
        t.exports = n.AMUI = o
    },
    function(e, i) {
        e.exports = t
    },
    function(t, e, i) {
        "use strict";
        var n = i(1);
        if ("undefined" == typeof n) throw new Error("Amaze UI 2.x requires jQuery :-(\n\u7231\u4e0a\u4e00\u5339\u91ce\u9a6c\uff0c\u53ef\u4f60\u7684\u5bb6\u91cc\u6ca1\u6709\u8349\u539f\u2026");
        var o = n.AMUI || {},
        s = n(window),
        a = window.document,
        r = n("html");
        o.VERSION = "2.6.2",
        o.support = {},
        o.support.transition = function() {
            var t = function() {
                var t = a.body || a.documentElement,
                e = {
                    WebkitTransition: "webkitTransitionEnd",
                    MozTransition: "transitionend",
                    OTransition: "oTransitionEnd otransitionend",
                    transition: "transitionend"
                };
                for (var i in e) if (void 0 !== t.style[i]) return e[i]
            } ();
            return t && {
                end: t
            }
        } (),
        o.support.animation = function() {
            var t = function() {
                var t = a.body || a.documentElement,
                e = {
                    WebkitAnimation: "webkitAnimationEnd",
                    MozAnimation: "animationend",
                    OAnimation: "oAnimationEnd oanimationend",
                    animation: "animationend"
                };
                for (var i in e) if (void 0 !== t.style[i]) return e[i]
            } ();
            return t && {
                end: t
            }
        } (),
        o.support.touch = "ontouchstart" in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/) || window.DocumentTouch && document instanceof window.DocumentTouch || window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 0 || window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 0 || !1,
        o.support.mutationobserver = window.MutationObserver || window.WebKitMutationObserver || null,
        o.support.formValidation = "function" == typeof document.createElement("form").checkValidity,
        o.utils = {},
        o.utils.debounce = function(t, e, i) {
            var n;
            return function() {
                var o = this,
                s = arguments,
                a = function() {
                    n = null,
                    i || t.apply(o, s)
                },
                r = i && !n;
                clearTimeout(n),
                n = setTimeout(a, e),
                r && t.apply(o, s)
            }
        },
        o.utils.isInView = function(t, e) {
            var i = n(t),
            o = !(!i.width() && !i.height()) && "none" !== i.css("display");
            if (!o) return ! 1;
            var a = s.scrollLeft(),
            r = s.scrollTop(),
            l = i.offset(),
            c = l.left,
            h = l.top;
            return e = n.extend({
                topOffset: 0,
                leftOffset: 0
            },
            e),
            h + i.height() >= r && h - e.topOffset <= r + s.height() && c + i.width() >= a && c - e.leftOffset <= a + s.width()
        },
        o.utils.parseOptions = o.utils.options = function(t) {
            if (n.isPlainObject(t)) return t;
            var e = t ? t.indexOf("{") : -1,
            i = {};
            if ( - 1 != e) try {
                i = new Function("", "var json = " + t.substr(e) + "; return JSON.parse(JSON.stringify(json));")()
            } catch(o) {}
            return i
        },
        o.utils.generateGUID = function(t) {
            var e = t + "-" || "am-";
            do e += Math.random().toString(36).substring(2, 7);
            while (document.getElementById(e));
            return e
        },
        o.utils.getAbsoluteUrl = function() {
            var t;
            return function(e) {
                return t || (t = document.createElement("a")),
                t.href = e,
                t.href
            }
        } (),
        o.plugin = function(t, e, i) {
            var s = n.fn[t];
            i = i || {},
            n.fn[t] = function(s) {
                var a, r = Array.prototype.slice.call(arguments, 0),
                l = r.slice(1),
                c = this.each(function() {
                    var c = n(this),
                    h = "amui." + t,
                    u = i.dataOptions || "data-am-" + t,
                    d = c.data(h),
                    p = n.extend({},
                    o.utils.parseOptions(c.attr(u)), "object" == typeof s && s); (d || "destroy" !== s) && (d || c.data(h, d = new e(this, p)), i.methodCall ? i.methodCall.call(c, r, d) : (i.before && i.before.call(c, r, d), "string" == typeof s && (a = "function" == typeof d[s] ? d[s].apply(d, l) : d[s]), i.after && i.after.call(c, r, d)))
                });
                return void 0 === a ? c: a
            },
            n.fn[t].Constructor = e,
            n.fn[t].noConflict = function() {
                return n.fn[t] = s,
                this
            },
            o[t] = e
        },
        n.fn.emulateTransitionEnd = function(t) {
            var e = !1,
            i = this;
            n(this).one(o.support.transition.end,
            function() {
                e = !0
            });
            var s = function() {
                e || n(i).trigger(o.support.transition.end),
                i.transitionEndTimmer = void 0
            };
            return this.transitionEndTimmer = setTimeout(s, t),
            this
        },
        n.fn.redraw = function() {
            return this.each(function() {
                this.offsetHeight
            })
        },
        n.fn.transitionEnd = function(t) {
            function e(o) {
                t.call(this, o),
                i && n.off(i, e)
            }
            var i = o.support.transition.end,
            n = this;
            return t && i && n.on(i, e),
            this
        },
        n.fn.removeClassRegEx = function() {
            return this.each(function(t) {
                var e = n(this).attr("class");
                if (!e || !t) return ! 1;
                var i = [];
                e = e.split(" ");
                for (var o = 0,
                s = e.length; s > o; o++) e[o].match(t) || i.push(e[o]);
                n(this).attr("class", i.join(" "))
            })
        },
        n.fn.alterClass = function(t, e) {
            var i = this;
            if ( - 1 === t.indexOf("*")) return i.removeClass(t),
            e ? i.addClass(e) : i;
            var o = new RegExp("\\s" + t.replace(/\*/g, "[A-Za-z0-9-_]+").split(" ").join("\\s|\\s") + "\\s", "g");
            return i.each(function(t, e) {
                for (var i = " " + e.className + " "; o.test(i);) i = i.replace(o, " ");
                e.className = n.trim(i)
            }),
            e ? i.addClass(e) : i
        },
        o.utils.rAF = function() {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||
            function(t) {
                return window.setTimeout(t, 1e3 / 60)
            }
        } (),
        o.utils.cancelAF = function() {
            return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame ||
            function(t) {
                window.clearTimeout(t)
            }
        } (),
        o.utils.measureScrollbar = function() {
            if (document.body.clientWidth >= window.innerWidth) return 0;
            var t = n('<div style="width: 100px;height: 100px;overflow: scroll;position: absolute;top: -9999px;"></div>');
            n(document.body).append(t);
            var e = t[0].offsetWidth - t[0].clientWidth;
            return t.remove(),
            e
        },
        o.utils.imageLoader = function(t, e) {
            function i() {
                e(t[0])
            }
            function n() {
                if (this.one("load", i), /MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
                    var t = this.attr("src"),
                    e = t.match(/\?/) ? "&": "?";
                    e += "random=" + (new Date).getTime(),
                    this.attr("src", t + e)
                }
            }
            return t.attr("src") ? void(t[0].complete || 4 === t[0].readyState ? i() : n.call(t)) : void i()
        },
        o.template = function(t, e) {
            var i = o.template;
            return i.cache[t] || (i.cache[t] = function() {
                var e = t,
                n = /^[\w\-]+$/.test(t) ? i.get(t) : (e = "template(string)", t),
                o = 1,
                s = ("try { " + (i.variable ? "var " + i.variable + " = this.stash;": "with (this.stash) { ") + "this.ret += '" + n.replace(/<%/g, "").replace(/%>/g, "").replace(/'(?![^\x11\x13]+?\x13)/g, "\\x27").replace(/^\s*|\s*$/g, "").replace(/\n/g,
                function() {
                    return "';\nthis.line = " + ++o + "; this.ret += '\\n"
                }).replace(/\x11-(.+?)\x13/g, "' + ($1) + '").replace(/\x11=(.+?)\x13/g, "' + this.escapeHTML($1) + '").replace(/\x11(.+?)\x13/g, "'; $1; this.ret += '") + "'; " + (i.variable ? "": "}") + "return this.ret;} catch (e) { throw 'TemplateError: ' + e + ' (on " + e + "' + ' line ' + this.line + ')'; } //@ sourceURL=" + e + "\n").replace(/this\.ret \+= '';/g, ""),
                a = new Function(s),
                r = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&#x22;",
                    "'": "&#x27;"
                },
                l = function(t) {
                    return ("" + t).replace(/[&<>\'\"]/g,
                    function(t) {
                        return r[t]
                    })
                };
                return function(t) {
                    return a.call(i.context = {
                        escapeHTML: l,
                        line: 1,
                        ret: "",
                        stash: t
                    })
                }
            } ()),
            e ? i.cache[t](e) : i.cache[t]
        },
        o.template.cache = {},
        o.template.get = function(t) {
            if (t) {
                var e = document.getElementById(t);
                return e && e.innerHTML || ""
            }
        },
        o.DOMWatchers = [],
        o.DOMReady = !1,
        o.ready = function(t) {
            o.DOMWatchers.push(t),
            o.DOMReady && t(document)
        },
        o.DOMObserve = function(t, e, i) {
            var s = o.support.mutationobserver;
            s && (e = n.isPlainObject(e) ? e: {
                childList: !0,
                subtree: !0
            },
            i = "function" == typeof i && i ||
            function() {},
            n(t).each(function() {
                var t = this,
                a = n(t);
                if (!a.data("am.observer")) try {
                    var r = new s(o.utils.debounce(function(e, n) {
                        i.call(t, e, n),
                        a.trigger("changed.dom.amui")
                    },
                    50));
                    r.observe(t, e),
                    a.data("am.observer", r)
                } catch(l) {}
            }))
        },
        n.fn.DOMObserve = function(t, e) {
            return this.each(function() {
                o.DOMObserve(this, t, e)
            })
        },
        o.support.touch && r.addClass("am-touch"),
        n(document).on("changed.dom.amui",
        function(t) {
            var e = t.target;
            n.each(o.DOMWatchers,
            function(t, i) {
                i(e)
            })
        }),
        n(function() {
            var t = n("body");
            o.DOMReady = !0,
            n.each(o.DOMWatchers,
            function(t, e) {
                e(document)
            }),
            o.DOMObserve("[data-am-observe]"),
            r.removeClass("no-js").addClass("js"),
            o.support.animation && r.addClass("cssanimations"),
            window.navigator.standalone && r.addClass("am-standalone"),
            n(".am-topbar-fixed-top").length && t.addClass("am-with-topbar-fixed-top"),
            n(".am-topbar-fixed-bottom").length && t.addClass("am-with-topbar-fixed-bottom");
            var e = n(".am-layout");
            e.find('[class*="md-block-grid"]').alterClass("md-block-grid-*"),
            e.find('[class*="lg-block-grid"]').alterClass("lg-block-grid"),
            n("[data-am-widget]").each(function() {
                var t = n(this);
                0 === t.parents(".am-layout").length && t.addClass("am-no-layout")
            })
        }),
        t.exports = o
    },
    function(t, e, i) {
        "use strict";
        function n(t, e, i) {
            return setTimeout(l(t, i), e)
        }
        function o(t, e, i) {
            return Array.isArray(t) ? (s(t, i[e], i), !0) : !1
        }
        function s(t, e, i) {
            var n;
            if (t) if (t.forEach) t.forEach(e, i);
            else if (void 0 !== t.length) for (n = 0; n < t.length;) e.call(i, t[n], n, t),
            n++;
            else for (n in t) t.hasOwnProperty(n) && e.call(i, t[n], n, t)
        }
        function a(t, e, i) {
            var n = "DEPRECATED METHOD: " + e + "\n" + i + " AT \n";
            return function() {
                var e = new Error("get-stack-trace"),
                i = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, "").replace(/^\s+at\s+/gm, "").replace(/^Object.<anonymous>\s*\(/gm, "{anonymous}()@") : "Unknown Stack Trace",
                o = window.console && (window.console.warn || window.console.log);
                return o && o.call(window.console, n, i),
                t.apply(this, arguments)
            }
        }
        function r(t, e, i) {
            var n, o = e.prototype;
            n = t.prototype = Object.create(o),
            n.constructor = t,
            n._super = o,
            i && at(n, i)
        }
        function l(t, e) {
            return function() {
                return t.apply(e, arguments)
            }
        }
        function c(t, e) {
            return typeof t == ut ? t.apply(e ? e[0] || void 0 : void 0, e) : t
        }
        function h(t, e) {
            return void 0 === t ? e: t
        }
        function u(t, e, i) {
            s(f(e),
            function(e) {
                t.addEventListener(e, i, !1)
            })
        }
        function d(t, e, i) {
            s(f(e),
            function(e) {
                t.removeEventListener(e, i, !1)
            })
        }
        function p(t, e) {
            for (; t;) {
                if (t == e) return ! 0;
                t = t.parentNode
            }
            return ! 1
        }
        function m(t, e) {
            return t.indexOf(e) > -1
        }
        function f(t) {
            return t.trim().split(/\s+/g)
        }
        function v(t, e, i) {
            if (t.indexOf && !i) return t.indexOf(e);
            for (var n = 0; n < t.length;) {
                if (i && t[n][i] == e || !i && t[n] === e) return n;
                n++
            }
            return - 1
        }
        function g(t) {
            return Array.prototype.slice.call(t, 0)
        }
        function w(t, e, i) {
            for (var n = [], o = [], s = 0; s < t.length;) {
                var a = e ? t[s][e] : t[s];
                v(o, a) < 0 && n.push(t[s]),
                o[s] = a,
                s++
            }
            return i && (n = e ? n.sort(function(t, i) {
                return t[e] > i[e]
            }) : n.sort()),
            n
        }
        function y(t, e) {
            for (var i, n, o = e[0].toUpperCase() + e.slice(1), s = 0; s < ct.length;) {
                if (i = ct[s], n = i ? i + o: e, n in t) return n;
                s++
            }
        }
        function b() {
            return gt++
        }
        function T(t) {
            var e = t.ownerDocument || t;
            return e.defaultView || e.parentWindow || window
        }
        function x(t, e) {
            var i = this;
            this.manager = t,
            this.callback = e,
            this.element = t.element,
            this.target = t.options.inputTarget,
            this.domHandler = function(e) {
                c(t.options.enable, [t]) && i.handler(e)
            },
            this.init()
        }
        function C(t) {
            var e, i = t.options.inputClass;
            return new(e = i ? i: bt ? _: Tt ? q: yt ? H: L)(t, E)
        }
        function E(t, e, i) {
            var n = i.pointers.length,
            o = i.changedPointers.length,
            s = e & Dt && n - o === 0,
            a = e & (At | $t) && n - o === 0;
            i.isFirst = !!s,
            i.isFinal = !!a,
            s && (t.session = {}),
            i.eventType = e,
            S(t, i),
            t.emit("hammer.input", i),
            t.recognize(i),
            t.session.prevInput = i
        }
        function S(t, e) {
            var i = t.session,
            n = e.pointers,
            o = n.length;
            i.firstInput || (i.firstInput = F(e)),
            o > 1 && !i.firstMultiple ? i.firstMultiple = F(e) : 1 === o && (i.firstMultiple = !1);
            var s = i.firstInput,
            a = i.firstMultiple,
            r = a ? a.center: s.center,
            l = e.center = A(n);
            e.timeStamp = mt(),
            e.deltaTime = e.timeStamp - s.timeStamp,
            e.angle = N(r, l),
            e.distance = P(r, l),
            k(i, e),
            e.offsetDirection = M(e.deltaX, e.deltaY);
            var c = $(e.deltaTime, e.deltaX, e.deltaY);
            e.overallVelocityX = c.x,
            e.overallVelocityY = c.y,
            e.overallVelocity = pt(c.x) > pt(c.y) ? c.x: c.y,
            e.scale = a ? O(a.pointers, n) : 1,
            e.rotation = a ? I(a.pointers, n) : 0,
            e.maxPointers = i.prevInput ? e.pointers.length > i.prevInput.maxPointers ? e.pointers.length: i.prevInput.maxPointers: e.pointers.length,
            D(i, e);
            var h = t.element;
            p(e.srcEvent.target, h) && (h = e.srcEvent.target),
            e.target = h
        }
        function k(t, e) {
            var i = e.center,
            n = t.offsetDelta || {},
            o = t.prevDelta || {},
            s = t.prevInput || {};
            e.eventType !== Dt && s.eventType !== At || (o = t.prevDelta = {
                x: s.deltaX || 0,
                y: s.deltaY || 0
            },
            n = t.offsetDelta = {
                x: i.x,
                y: i.y
            }),
            e.deltaX = o.x + (i.x - n.x),
            e.deltaY = o.y + (i.y - n.y)
        }
        function D(t, e) {
            var i, n, o, s, a = t.lastInterval || e,
            r = e.timeStamp - a.timeStamp;
            if (e.eventType != $t && (r > kt || void 0 === a.velocity)) {
                var l = e.deltaX - a.deltaX,
                c = e.deltaY - a.deltaY,
                h = $(r, l, c);
                n = h.x,
                o = h.y,
                i = pt(h.x) > pt(h.y) ? h.x: h.y,
                s = M(l, c),
                t.lastInterval = e
            } else i = a.velocity,
            n = a.velocityX,
            o = a.velocityY,
            s = a.direction;
            e.velocity = i,
            e.velocityX = n,
            e.velocityY = o,
            e.direction = s
        }
        function F(t) {
            for (var e = [], i = 0; i < t.pointers.length;) e[i] = {
                clientX: dt(t.pointers[i].clientX),
                clientY: dt(t.pointers[i].clientY)
            },
            i++;
            return {
                timeStamp: mt(),
                pointers: e,
                center: A(e),
                deltaX: t.deltaX,
                deltaY: t.deltaY
            }
        }
        function A(t) {
            var e = t.length;
            if (1 === e) return {
                x: dt(t[0].clientX),
                y: dt(t[0].clientY)
            };
            for (var i = 0,
            n = 0,
            o = 0; e > o;) i += t[o].clientX,
            n += t[o].clientY,
            o++;
            return {
                x: dt(i / e),
                y: dt(n / e)
            }
        }
        function $(t, e, i) {
            return {
                x: e / t || 0,
                y: i / t || 0
            }
        }
        function M(t, e) {
            return t === e ? Mt: pt(t) >= pt(e) ? 0 > t ? Pt: Nt: 0 > e ? It: Ot
        }
        function P(t, e, i) {
            i || (i = Rt);
            var n = e[i[0]] - t[i[0]],
            o = e[i[1]] - t[i[1]];
            return Math.sqrt(n * n + o * o)
        }
        function N(t, e, i) {
            i || (i = Rt);
            var n = e[i[0]] - t[i[0]],
            o = e[i[1]] - t[i[1]];
            return 180 * Math.atan2(o, n) / Math.PI
        }
        function I(t, e) {
            return N(e[1], e[0], qt) + N(t[1], t[0], qt)
        }
        function O(t, e) {
            return P(e[0], e[1], qt) / P(t[0], t[1], qt)
        }
        function L() {
            this.evEl = Ht,
            this.evWin = Vt,
            this.allow = !0,
            this.pressed = !1,
            x.apply(this, arguments)
        }
        function _() {
            this.evEl = Xt,
            this.evWin = Yt,
            x.apply(this, arguments),
            this.store = this.manager.session.pointerEvents = []
        }
        function z() {
            this.evTarget = Zt,
            this.evWin = Gt,
            this.started = !1,
            x.apply(this, arguments)
        }
        function R(t, e) {
            var i = g(t.touches),
            n = g(t.changedTouches);
            return e & (At | $t) && (i = w(i.concat(n), "identifier", !0)),
            [i, n]
        }
        function q() {
            this.evTarget = Kt,
            this.targetIds = {},
            x.apply(this, arguments)
        }
        function W(t, e) {
            var i = g(t.touches),
            n = this.targetIds;
            if (e & (Dt | Ft) && 1 === i.length) return n[i[0].identifier] = !0,
            [i, i];
            var o, s, a = g(t.changedTouches),
            r = [],
            l = this.target;
            if (s = i.filter(function(t) {
                return p(t.target, l)
            }), e === Dt) for (o = 0; o < s.length;) n[s[o].identifier] = !0,
            o++;
            for (o = 0; o < a.length;) n[a[o].identifier] && r.push(a[o]),
            e & (At | $t) && delete n[a[o].identifier],
            o++;
            return r.length ? [w(s.concat(r), "identifier", !0), r] : void 0
        }
        function H() {
            x.apply(this, arguments);
            var t = l(this.handler, this);
            this.touch = new q(this.manager, t),
            this.mouse = new L(this.manager, t)
        }
        function V(t, e) {
            this.manager = t,
            this.set(e)
        }
        function B(t) {
            if (m(t, oe)) return oe;
            var e = m(t, se),
            i = m(t, ae);
            return e && i ? oe: e || i ? e ? se: ae: m(t, ne) ? ne: ie
        }
        function U(t) {
            this.options = at({},
            this.defaults, t || {}),
            this.id = b(),
            this.manager = null,
            this.options.enable = h(this.options.enable, !0),
            this.state = re,
            this.simultaneous = {},
            this.requireFail = []
        }
        function X(t) {
            return t & de ? "cancel": t & he ? "end": t & ce ? "move": t & le ? "start": ""
        }
        function Y(t) {
            return t == Ot ? "down": t == It ? "up": t == Pt ? "left": t == Nt ? "right": ""
        }
        function j(t, e) {
            var i = e.manager;
            return i ? i.get(t) : t
        }
        function Z() {
            U.apply(this, arguments)
        }
        function G() {
            Z.apply(this, arguments),
            this.pX = null,
            this.pY = null
        }
        function J() {
            Z.apply(this, arguments)
        }
        function K() {
            U.apply(this, arguments),
            this._timer = null,
            this._input = null
        }
        function Q() {
            Z.apply(this, arguments)
        }
        function tt() {
            Z.apply(this, arguments)
        }
        function et() {
            U.apply(this, arguments),
            this.pTime = !1,
            this.pCenter = !1,
            this._timer = null,
            this._input = null,
            this.count = 0
        }
        function it(t, e) {
            return e = e || {},
            e.recognizers = h(e.recognizers, it.defaults.preset),
            new nt(t, e)
        }
        function nt(t, e) {
            this.options = at({},
            it.defaults, e || {}),
            this.options.inputTarget = this.options.inputTarget || t,
            this.handlers = {},
            this.session = {},
            this.recognizers = [],
            this.element = t,
            this.input = C(this),
            this.touchAction = new V(this, this.options.touchAction),
            ot(this, !0),
            s(this.options.recognizers,
            function(t) {
                var e = this.add(new t[0](t[1]));
                t[2] && e.recognizeWith(t[2]),
                t[3] && e.requireFailure(t[3])
            },
            this)
        }
        function ot(t, e) {
            var i = t.element;
            i.style && s(t.options.cssProps,
            function(t, n) {
                i.style[y(i.style, n)] = e ? t: ""
            })
        }
        function st(t, e) {
            var i = document.createEvent("Event");
            i.initEvent(t, !0, !0),
            i.gesture = e,
            e.target.dispatchEvent(i)
        }
        var at, rt = i(1),
        lt = i(2),
        ct = ["", "webkit", "Moz", "MS", "ms", "o"],
        ht = document.createElement("div"),
        ut = "function",
        dt = Math.round,
        pt = Math.abs,
        mt = Date.now;
        at = "function" != typeof Object.assign ?
        function(t) {
            if (void 0 === t || null === t) throw new TypeError("Cannot convert undefined or null to object");
            for (var e = Object(t), i = 1; i < arguments.length; i++) {
                var n = arguments[i];
                if (void 0 !== n && null !== n) for (var o in n) n.hasOwnProperty(o) && (e[o] = n[o])
            }
            return e
        }: Object.assign;
        var ft = a(function(t, e, i) {
            for (var n = Object.keys(e), o = 0; o < n.length;)(!i || i && void 0 === t[n[o]]) && (t[n[o]] = e[n[o]]),
            o++;
            return t
        },
        "extend", "Use `assign`."),
        vt = a(function(t, e) {
            return ft(t, e, !0)
        },
        "merge", "Use `assign`."),
        gt = 1,
        wt = /mobile|tablet|ip(ad|hone|od)|android/i,
        yt = "ontouchstart" in window,
        bt = void 0 !== y(window, "PointerEvent"),
        Tt = yt && wt.test(navigator.userAgent),
        xt = "touch",
        Ct = "pen",
        Et = "mouse",
        St = "kinect",
        kt = 25,
        Dt = 1,
        Ft = 2,
        At = 4,
        $t = 8,
        Mt = 1,
        Pt = 2,
        Nt = 4,
        It = 8,
        Ot = 16,
        Lt = Pt | Nt,
        _t = It | Ot,
        zt = Lt | _t,
        Rt = ["x", "y"],
        qt = ["clientX", "clientY"];
        x.prototype = {
            handler: function() {},
            init: function() {
                this.evEl && u(this.element, this.evEl, this.domHandler),
                this.evTarget && u(this.target, this.evTarget, this.domHandler),
                this.evWin && u(T(this.element), this.evWin, this.domHandler)
            },
            destroy: function() {
                this.evEl && d(this.element, this.evEl, this.domHandler),
                this.evTarget && d(this.target, this.evTarget, this.domHandler),
                this.evWin && d(T(this.element), this.evWin, this.domHandler)
            }
        };
        var Wt = {
            mousedown: Dt,
            mousemove: Ft,
            mouseup: At
        },
        Ht = "mousedown",
        Vt = "mousemove mouseup";
        r(L, x, {
            handler: function(t) {
                var e = Wt[t.type];
                e & Dt && 0 === t.button && (this.pressed = !0),
                e & Ft && 1 !== t.which && (e = At),
                this.pressed && this.allow && (e & At && (this.pressed = !1), this.callback(this.manager, e, {
                    pointers: [t],
                    changedPointers: [t],
                    pointerType: Et,
                    srcEvent: t
                }))
            }
        });
        var Bt = {
            pointerdown: Dt,
            pointermove: Ft,
            pointerup: At,
            pointercancel: $t,
            pointerout: $t
        },
        Ut = {
            2 : xt,
            3 : Ct,
            4 : Et,
            5 : St
        },
        Xt = "pointerdown",
        Yt = "pointermove pointerup pointercancel";
        window.MSPointerEvent && !window.PointerEvent && (Xt = "MSPointerDown", Yt = "MSPointerMove MSPointerUp MSPointerCancel"),
        r(_, x, {
            handler: function(t) {
                var e = this.store,
                i = !1,
                n = t.type.toLowerCase().replace("ms", ""),
                o = Bt[n],
                s = Ut[t.pointerType] || t.pointerType,
                a = s == xt,
                r = v(e, t.pointerId, "pointerId");
                o & Dt && (0 === t.button || a) ? 0 > r && (e.push(t), r = e.length - 1) : o & (At | $t) && (i = !0),
                0 > r || (e[r] = t, this.callback(this.manager, o, {
                    pointers: e,
                    changedPointers: [t],
                    pointerType: s,
                    srcEvent: t
                }), i && e.splice(r, 1))
            }
        });
        var jt = {
            touchstart: Dt,
            touchmove: Ft,
            touchend: At,
            touchcancel: $t
        },
        Zt = "touchstart",
        Gt = "touchstart touchmove touchend touchcancel";
        r(z, x, {
            handler: function(t) {
                var e = jt[t.type];
                if (e === Dt && (this.started = !0), this.started) {
                    var i = R.call(this, t, e);
                    e & (At | $t) && i[0].length - i[1].length === 0 && (this.started = !1),
                    this.callback(this.manager, e, {
                        pointers: i[0],
                        changedPointers: i[1],
                        pointerType: xt,
                        srcEvent: t
                    })
                }
            }
        });
        var Jt = {
            touchstart: Dt,
            touchmove: Ft,
            touchend: At,
            touchcancel: $t
        },
        Kt = "touchstart touchmove touchend touchcancel";
        r(q, x, {
            handler: function(t) {
                var e = Jt[t.type],
                i = W.call(this, t, e);
                i && this.callback(this.manager, e, {
                    pointers: i[0],
                    changedPointers: i[1],
                    pointerType: xt,
                    srcEvent: t
                })
            }
        }),
        r(H, x, {
            handler: function(t, e, i) {
                var n = i.pointerType == xt,
                o = i.pointerType == Et;
                if (n) this.mouse.allow = !1;
                else if (o && !this.mouse.allow) return;
                e & (At | $t) && (this.mouse.allow = !0),
                this.callback(t, e, i)
            },
            destroy: function() {
                this.touch.destroy(),
                this.mouse.destroy()
            }
        });
        var Qt = y(ht.style, "touchAction"),
        te = void 0 !== Qt,
        ee = "compute",
        ie = "auto",
        ne = "manipulation",
        oe = "none",
        se = "pan-x",
        ae = "pan-y";
        V.prototype = {
            set: function(t) {
                t == ee && (t = this.compute()),
                te && this.manager.element.style && (this.manager.element.style[Qt] = t),
                this.actions = t.toLowerCase().trim()
            },
            update: function() {
                this.set(this.manager.options.touchAction)
            },
            compute: function() {
                var t = [];
                return s(this.manager.recognizers,
                function(e) {
                    c(e.options.enable, [e]) && (t = t.concat(e.getTouchAction()))
                }),
                B(t.join(" "))
            },
            preventDefaults: function(t) {
                if (!te) {
                    var e = t.srcEvent,
                    i = t.offsetDirection;
                    if (this.manager.session.prevented) return void e.preventDefault();
                    var n = this.actions,
                    o = m(n, oe),
                    s = m(n, ae),
                    a = m(n, se);
                    if (o) {
                        var r = 1 === t.pointers.length,
                        l = t.distance < 2,
                        c = t.deltaTime < 250;
                        if (r && l && c) return
                    }
                    if (!a || !s) return o || s && i & Lt || a && i & _t ? this.preventSrc(e) : void 0
                }
            },
            preventSrc: function(t) {
                this.manager.session.prevented = !0,
                t.preventDefault()
            }
        };
        var re = 1,
        le = 2,
        ce = 4,
        he = 8,
        ue = he,
        de = 16,
        pe = 32;
        U.prototype = {
            defaults: {},
            set: function(t) {
                return at(this.options, t),
                this.manager && this.manager.touchAction.update(),
                this
            },
            recognizeWith: function(t) {
                if (o(t, "recognizeWith", this)) return this;
                var e = this.simultaneous;
                return t = j(t, this),
                e[t.id] || (e[t.id] = t, t.recognizeWith(this)),
                this
            },
            dropRecognizeWith: function(t) {
                return o(t, "dropRecognizeWith", this) ? this: (t = j(t, this), delete this.simultaneous[t.id], this)
            },
            requireFailure: function(t) {
                if (o(t, "requireFailure", this)) return this;
                var e = this.requireFail;
                return t = j(t, this),
                -1 === v(e, t) && (e.push(t), t.requireFailure(this)),
                this
            },
            dropRequireFailure: function(t) {
                if (o(t, "dropRequireFailure", this)) return this;
                t = j(t, this);
                var e = v(this.requireFail, t);
                return e > -1 && this.requireFail.splice(e, 1),
                this
            },
            hasRequireFailures: function() {
                return this.requireFail.length > 0
            },
            canRecognizeWith: function(t) {
                return !! this.simultaneous[t.id]
            },
            emit: function(t) {
                function e(e) {
                    i.manager.emit(e, t)
                }
                var i = this,
                n = this.state;
                he > n && e(i.options.event + X(n)),
                e(i.options.event),
                t.additionalEvent && e(t.additionalEvent),
                n >= he && e(i.options.event + X(n))
            },
            tryEmit: function(t) {
                return this.canEmit() ? this.emit(t) : void(this.state = pe)
            },
            canEmit: function() {
                for (var t = 0; t < this.requireFail.length;) {
                    if (! (this.requireFail[t].state & (pe | re))) return ! 1;
                    t++
                }
                return ! 0
            },
            recognize: function(t) {
                var e = at({},
                t);
                return c(this.options.enable, [this, e]) ? (this.state & (ue | de | pe) && (this.state = re), this.state = this.process(e), void(this.state & (le | ce | he | de) && this.tryEmit(e))) : (this.reset(), void(this.state = pe))
            },
            process: function(t) {},
            getTouchAction: function() {},
            reset: function() {}
        },
        r(Z, U, {
            defaults: {
                pointers: 1
            },
            attrTest: function(t) {
                var e = this.options.pointers;
                return 0 === e || t.pointers.length === e
            },
            process: function(t) {
                var e = this.state,
                i = t.eventType,
                n = e & (le | ce),
                o = this.attrTest(t);
                return n && (i & $t || !o) ? e | de: n || o ? i & At ? e | he: e & le ? e | ce: le: pe
            }
        }),
        r(G, Z, {
            defaults: {
                event: "pan",
                threshold: 10,
                pointers: 1,
                direction: zt
            },
            getTouchAction: function() {
                var t = this.options.direction,
                e = [];
                return t & Lt && e.push(ae),
                t & _t && e.push(se),
                e
            },
            directionTest: function(t) {
                var e = this.options,
                i = !0,
                n = t.distance,
                o = t.direction,
                s = t.deltaX,
                a = t.deltaY;
                return o & e.direction || (e.direction & Lt ? (o = 0 === s ? Mt: 0 > s ? Pt: Nt, i = s != this.pX, n = Math.abs(t.deltaX)) : (o = 0 === a ? Mt: 0 > a ? It: Ot, i = a != this.pY, n = Math.abs(t.deltaY))),
                t.direction = o,
                i && n > e.threshold && o & e.direction
            },
            attrTest: function(t) {
                return Z.prototype.attrTest.call(this, t) && (this.state & le || !(this.state & le) && this.directionTest(t))
            },
            emit: function(t) {
                this.pX = t.deltaX,
                this.pY = t.deltaY;
                var e = Y(t.direction);
                e && (t.additionalEvent = this.options.event + e),
                this._super.emit.call(this, t)
            }
        }),
        r(J, Z, {
            defaults: {
                event: "pinch",
                threshold: 0,
                pointers: 2
            },
            getTouchAction: function() {
                return [oe]
            },
            attrTest: function(t) {
                return this._super.attrTest.call(this, t) && (Math.abs(t.scale - 1) > this.options.threshold || this.state & le)
            },
            emit: function(t) {
                if (1 !== t.scale) {
                    var e = t.scale < 1 ? "in": "out";
                    t.additionalEvent = this.options.event + e
                }
                this._super.emit.call(this, t)
            }
        }),
        r(K, U, {
            defaults: {
                event: "press",
                pointers: 1,
                time: 251,
                threshold: 9
            },
            getTouchAction: function() {
                return [ie]
            },
            process: function(t) {
                var e = this.options,
                i = t.pointers.length === e.pointers,
                o = t.distance < e.threshold,
                s = t.deltaTime > e.time;
                if (this._input = t, !o || !i || t.eventType & (At | $t) && !s) this.reset();
                else if (t.eventType & Dt) this.reset(),
                this._timer = n(function() {
                    this.state = ue,
                    this.tryEmit()
                },
                e.time, this);
                else if (t.eventType & At) return ue;
                return pe
            },
            reset: function() {
                clearTimeout(this._timer)
            },
            emit: function(t) {
                this.state === ue && (t && t.eventType & At ? this.manager.emit(this.options.event + "up", t) : (this._input.timeStamp = mt(), this.manager.emit(this.options.event, this._input)))
            }
        }),
        r(Q, Z, {
            defaults: {
                event: "rotate",
                threshold: 0,
                pointers: 2
            },
            getTouchAction: function() {
                return [oe]
            },
            attrTest: function(t) {
                return this._super.attrTest.call(this, t) && (Math.abs(t.rotation) > this.options.threshold || this.state & le)
            }
        }),
        r(tt, Z, {
            defaults: {
                event: "swipe",
                threshold: 10,
                velocity: .3,
                direction: Lt | _t,
                pointers: 1
            },
            getTouchAction: function() {
                return G.prototype.getTouchAction.call(this)
            },
            attrTest: function(t) {
                var e, i = this.options.direction;
                return i & (Lt | _t) ? e = t.overallVelocity: i & Lt ? e = t.overallVelocityX: i & _t && (e = t.overallVelocityY),
                this._super.attrTest.call(this, t) && i & t.offsetDirection && t.distance > this.options.threshold && t.maxPointers == this.options.pointers && pt(e) > this.options.velocity && t.eventType & At
            },
            emit: function(t) {
                var e = Y(t.offsetDirection);
                e && this.manager.emit(this.options.event + e, t),
                this.manager.emit(this.options.event, t)
            }
        }),
        r(et, U, {
            defaults: {
                event: "tap",
                pointers: 1,
                taps: 1,
                interval: 300,
                time: 250,
                threshold: 9,
                posThreshold: 10
            },
            getTouchAction: function() {
                return [ne]
            },
            process: function(t) {
                var e = this.options,
                i = t.pointers.length === e.pointers,
                o = t.distance < e.threshold,
                s = t.deltaTime < e.time;
                if (this.reset(), t.eventType & Dt && 0 === this.count) return this.failTimeout();
                if (o && s && i) {
                    if (t.eventType != At) return this.failTimeout();
                    var a = this.pTime ? t.timeStamp - this.pTime < e.interval: !0,
                    r = !this.pCenter || P(this.pCenter, t.center) < e.posThreshold;
                    this.pTime = t.timeStamp,
                    this.pCenter = t.center,
                    r && a ? this.count += 1 : this.count = 1,
                    this._input = t;
                    var l = this.count % e.taps;
                    if (0 === l) return this.hasRequireFailures() ? (this._timer = n(function() {
                        this.state = ue,
                        this.tryEmit()
                    },
                    e.interval, this), le) : ue
                }
                return pe
            },
            failTimeout: function() {
                return this._timer = n(function() {
                    this.state = pe
                },
                this.options.interval, this),
                pe
            },
            reset: function() {
                clearTimeout(this._timer)
            },
            emit: function() {
                this.state == ue && (this._input.tapCount = this.count, this.manager.emit(this.options.event, this._input))
            }
        }),
        it.VERSION = "2.0.6",
        it.defaults = {
            domEvents: !1,
            touchAction: ee,
            enable: !0,
            inputTarget: null,
            inputClass: null,
            preset: [[Q, {
                enable: !1
            }], [J, {
                enable: !1
            },
            ["rotate"]], [tt, {
                direction: Lt
            }], [G, {
                direction: Lt
            },
            ["swipe"]], [et], [et, {
                event: "doubletap",
                taps: 2
            },
            ["tap"]], [K]],
            cssProps: {
                userSelect: "none",
                touchSelect: "none",
                touchCallout: "none",
                contentZooming: "none",
                userDrag: "none",
                tapHighlightColor: "rgba(0,0,0,0)"
            }
        };
        var me = 1,
        fe = 2;
        nt.prototype = {
            set: function(t) {
                return at(this.options, t),
                t.touchAction && this.touchAction.update(),
                t.inputTarget && (this.input.destroy(), this.input.target = t.inputTarget, this.input.init()),
                this
            },
            stop: function(t) {
                this.session.stopped = t ? fe: me
            },
            recognize: function(t) {
                var e = this.session;
                if (!e.stopped) {
                    this.touchAction.preventDefaults(t);
                    var i, n = this.recognizers,
                    o = e.curRecognizer; (!o || o && o.state & ue) && (o = e.curRecognizer = null);
                    for (var s = 0; s < n.length;) i = n[s],
                    e.stopped === fe || o && i != o && !i.canRecognizeWith(o) ? i.reset() : i.recognize(t),
                    !o && i.state & (le | ce | he) && (o = e.curRecognizer = i),
                    s++
                }
            },
            get: function(t) {
                if (t instanceof U) return t;
                for (var e = this.recognizers,
                i = 0; i < e.length; i++) if (e[i].options.event == t) return e[i];
                return null
            },
            add: function(t) {
                if (o(t, "add", this)) return this;
                var e = this.get(t.options.event);
                return e && this.remove(e),
                this.recognizers.push(t),
                t.manager = this,
                this.touchAction.update(),
                t
            },
            remove: function(t) {
                if (o(t, "remove", this)) return this;
                if (t = this.get(t)) {
                    var e = this.recognizers,
                    i = v(e, t); - 1 !== i && (e.splice(i, 1), this.touchAction.update())
                }
                return this
            },
            on: function(t, e) {
                var i = this.handlers;
                return s(f(t),
                function(t) {
                    i[t] = i[t] || [],
                    i[t].push(e)
                }),
                this
            },
            off: function(t, e) {
                var i = this.handlers;
                return s(f(t),
                function(t) {
                    e ? i[t] && i[t].splice(v(i[t], e), 1) : delete i[t]
                }),
                this
            },
            emit: function(t, e) {
                this.options.domEvents && st(t, e);
                var i = this.handlers[t] && this.handlers[t].slice();
                if (i && i.length) {
                    e.type = t,
                    e.preventDefault = function() {
                        e.srcEvent.preventDefault()
                    };
                    for (var n = 0; n < i.length;) i[n](e),
                    n++
                }
            },
            destroy: function() {
                this.element && ot(this, !1),
                this.handlers = {},
                this.session = {},
                this.input.destroy(),
                this.element = null
            }
        },
        at(it, {
            INPUT_START: Dt,
            INPUT_MOVE: Ft,
            INPUT_END: At,
            INPUT_CANCEL: $t,
            STATE_POSSIBLE: re,
            STATE_BEGAN: le,
            STATE_CHANGED: ce,
            STATE_ENDED: he,
            STATE_RECOGNIZED: ue,
            STATE_CANCELLED: de,
            STATE_FAILED: pe,
            DIRECTION_NONE: Mt,
            DIRECTION_LEFT: Pt,
            DIRECTION_RIGHT: Nt,
            DIRECTION_UP: It,
            DIRECTION_DOWN: Ot,
            DIRECTION_HORIZONTAL: Lt,
            DIRECTION_VERTICAL: _t,
            DIRECTION_ALL: zt,
            Manager: nt,
            Input: x,
            TouchAction: V,
            TouchInput: q,
            MouseInput: L,
            PointerEventInput: _,
            TouchMouseInput: H,
            SingleTouchInput: z,
            Recognizer: U,
            AttrRecognizer: Z,
            Tap: et,
            Pan: G,
            Swipe: tt,
            Pinch: J,
            Rotate: Q,
            Press: K,
            on: u,
            off: d,
            each: s,
            merge: vt,
            extend: ft,
            assign: at,
            inherit: r,
            bindFn: l,
            prefixed: y
        }),
        function(t, e) {
            function i(i, n) {
                var o = t(i);
                o.data("hammer") || o.data("hammer", new e(o[0], n))
            }
            t.fn.hammer = function(t) {
                return this.each(function() {
                    i(this, t)
                })
            },
            e.Manager.prototype.emit = function(e) {
                return function(i, n) {
                    e.call(this, i, n),
                    t(this.element).trigger({
                        type: i,
                        gesture: n
                    })
                }
            } (e.Manager.prototype.emit)
        } (rt, it),
        t.exports = lt.Hammer = it
    },
    function(t, e, i) {
        "use strict";
        function n() {
            window.removeEventListener("load", n, !1),
            c = !0
        }
        function o(t) {
            return h = h || new o.Class(t)
        }
        function s(t, e) {
            for (var i in e) t[i] = e[i];
            return t
        }
        function a() {
            "#ath" == document.location.hash && history.replaceState("", window.document.title, document.location.href.split("#")[0]),
            u.test(document.location.href) && history.replaceState("", window.document.title, document.location.href.replace(u, "$1")),
            d.test(document.location.search) && history.replaceState("", window.document.title, document.location.href.replace(d, "$2"))
        }
        var r = i(2),
        l = "addEventListener" in window,
        c = !1;
        "complete" === document.readyState ? c = !0 : l && window.addEventListener("load", n, !1);
        var h, u = /\/ath(\/)?$/,
        d = /([\?&]ath=[^&]*$|&ath=[^&]*(&))/;
        o.intl = {
            en_us: {
                ios: "To add this web app to the home screen: tap %icon and then <strong>Add to Home Screen</strong>.",
                android: 'To add this web app to the home screen open the browser option menu and tap on <strong>Add to homescreen</strong>. <small>The menu can be accessed by pressing the menu hardware button if your device has one, or by tapping the top right menu icon <span class="ath-action-icon">icon</span>.</small>'
            },
            zh_cn: {
                ios: "\u5982\u8981\u628a\u5e94\u7528\u7a0b\u5f0f\u52a0\u81f3\u4e3b\u5c4f\u5e55,\u8bf7\u70b9\u51fb%icon, \u7136\u540e<strong>\u52a0\u81f3\u4e3b\u5c4f\u5e55</strong>",
                android: 'To add this web app to the home screen open the browser option menu and tap on <strong>Add to homescreen</strong>. <small>The menu can be accessed by pressing the menu hardware button if your device has one, or by tapping the top right menu icon <span class="ath-action-icon">icon</span>.</small>'
            },
            zh_tw: {
                ios: "\u5982\u8981\u628a\u61c9\u7528\u7a0b\u5f0f\u52a0\u81f3\u4e3b\u5c4f\u5e55, \u8acb\u9ede\u64ca%icon, \u7136\u5f8c<strong>\u52a0\u81f3\u4e3b\u5c4f\u5e55</strong>.",
                android: 'To add this web app to the home screen open the browser option menu and tap on <strong>Add to homescreen</strong>. <small>The menu can be accessed by pressing the menu hardware button if your device has one, or by tapping the top right menu icon <span class="ath-action-icon">icon</span>.</small>'
            }
        };
        for (var p in o.intl) o.intl[p.substr(0, 2)] = o.intl[p];
        o.defaults = {
            appID: "org.cubiq.addtohome",
            fontSize: 15,
            debug: !1,
            logging: !1,
            modal: !1,
            mandatory: !1,
            autostart: !0,
            skipFirstVisit: !1,
            startDelay: 1,
            lifespan: 15,
            displayPace: 1440,
            maxDisplayCount: 0,
            icon: !0,
            message: "",
            validLocation: [],
            onInit: null,
            onShow: null,
            onRemove: null,
            onAdd: null,
            onPrivate: null,
            privateModeOverride: !1,
            detectHomescreen: !1
        };
        var m = window.navigator.userAgent,
        f = window.navigator;
        s(o, {
            hasToken: "#ath" == document.location.hash || u.test(document.location.href) || d.test(document.location.search),
            isRetina: window.devicePixelRatio && window.devicePixelRatio > 1,
            isIDevice: /iphone|ipod|ipad/i.test(m),
            isMobileChrome: m.indexOf("Android") > -1 && /Chrome\/[.0-9]*/.test(m) && -1 == m.indexOf("Version"),
            isMobileIE: m.indexOf("Windows Phone") > -1,
            language: f.language && f.language.toLowerCase().replace("-", "_") || ""
        }),
        o.language = o.language && o.language in o.intl ? o.language: "en_us",
        o.isMobileSafari = o.isIDevice && m.indexOf("Safari") > -1 && m.indexOf("CriOS") < 0,
        o.OS = o.isIDevice ? "ios": o.isMobileChrome ? "android": o.isMobileIE ? "windows": "unsupported",
        o.OSVersion = m.match(/(OS|Android) (\d+[_\.]\d+)/),
        o.OSVersion = o.OSVersion && o.OSVersion[2] ? +o.OSVersion[2].replace("_", ".") : 0,
        o.isStandalone = "standalone" in window.navigator && window.navigator.standalone,
        o.isTablet = o.isMobileSafari && m.indexOf("iPad") > -1 || o.isMobileChrome && m.indexOf("Mobile") < 0,
        o.isCompatible = o.isMobileSafari && o.OSVersion >= 6 || o.isMobileChrome;
        var v = {
            lastDisplayTime: 0,
            returningVisitor: !1,
            displayCount: 0,
            optedout: !1,
            added: !1
        };
        o.removeSession = function(t) {
            try {
                if (!localStorage) throw new Error("localStorage is not defined");
                localStorage.removeItem(t || o.defaults.appID);
            } catch(e) {}
        },
        o.doLog = function(t) {
            this.options.logging && console.log(t)
        },
        o.Class = function(t) {
            if (this.doLog = o.doLog, this.options = s({},
            o.defaults), s(this.options, t), this.options.debug && (this.options.logging = !0), l) {
                if (this.options.mandatory = this.options.mandatory && ("standalone" in window.navigator || this.options.debug), this.options.modal = this.options.modal || this.options.mandatory, this.options.mandatory && (this.options.startDelay = -.5), this.options.detectHomescreen = this.options.detectHomescreen === !0 ? "hash": this.options.detectHomescreen, this.options.debug && (o.isCompatible = !0, o.OS = "string" == typeof this.options.debug ? this.options.debug: "unsupported" == o.OS ? "android": o.OS, o.OSVersion = "ios" == o.OS ? "8": "4"), this.container = document.documentElement, this.session = this.getItem(this.options.appID), this.session = this.session ? JSON.parse(this.session) : void 0, !o.hasToken || o.isCompatible && this.session || (o.hasToken = !1, a()), !o.isCompatible) return void this.doLog("Add to homescreen: not displaying callout because device not supported");
                this.session = this.session || v;
                try {
                    if (!localStorage) throw new Error("localStorage is not defined");
                    localStorage.setItem(this.options.appID, JSON.stringify(this.session)),
                    o.hasLocalStorage = !0
                } catch(e) {
                    o.hasLocalStorage = !1,
                    this.options.onPrivate && this.options.onPrivate.call(this)
                }
                for (var i = !this.options.validLocation.length,
                n = this.options.validLocation.length; n--;) if (this.options.validLocation[n].test(document.location.href)) {
                    i = !0;
                    break
                }
                if (this.getItem("addToHome") && this.optOut(), this.session.optedout) return void this.doLog("Add to homescreen: not displaying callout because user opted out");
                if (this.session.added) return void this.doLog("Add to homescreen: not displaying callout because already added to the homescreen");
                if (!i) return void this.doLog("Add to homescreen: not displaying callout because not a valid location");
                if (o.isStandalone) return this.session.added || (this.session.added = !0, this.updateSession(), this.options.onAdd && o.hasLocalStorage && this.options.onAdd.call(this)),
                void this.doLog("Add to homescreen: not displaying callout because in standalone mode");
                if (this.options.detectHomescreen) {
                    if (o.hasToken) return a(),
                    this.session.added || (this.session.added = !0, this.updateSession(), this.options.onAdd && o.hasLocalStorage && this.options.onAdd.call(this)),
                    void this.doLog("Add to homescreen: not displaying callout because URL has token, so we are likely coming from homescreen");
                    "hash" == this.options.detectHomescreen ? history.replaceState("", window.document.title, document.location.href + "#ath") : "smartURL" == this.options.detectHomescreen ? history.replaceState("", window.document.title, document.location.href.replace(/(\/)?$/, "/ath$1")) : history.replaceState("", window.document.title, document.location.href + (document.location.search ? "&": "?") + "ath=")
                }
                if (!this.session.returningVisitor && (this.session.returningVisitor = !0, this.updateSession(), this.options.skipFirstVisit)) return void this.doLog("Add to homescreen: not displaying callout because skipping first visit");
                if (!this.options.privateModeOverride && !o.hasLocalStorage) return void this.doLog("Add to homescreen: not displaying callout because browser is in private mode");
                this.ready = !0,
                this.options.onInit && this.options.onInit.call(this),
                this.options.autostart && (this.doLog("Add to homescreen: autostart displaying callout"), this.show())
            }
        },
        o.Class.prototype = {
            events: {
                load: "_delayedShow",
                error: "_delayedShow",
                orientationchange: "resize",
                resize: "resize",
                scroll: "resize",
                click: "remove",
                touchmove: "_preventDefault",
                transitionend: "_removeElements",
                webkitTransitionEnd: "_removeElements",
                MSTransitionEnd: "_removeElements"
            },
            handleEvent: function(t) {
                var e = this.events[t.type];
                e && this[e](t)
            },
            show: function(t) {
                if (this.options.autostart && !c) return void setTimeout(this.show.bind(this), 50);
                if (this.shown) return void this.doLog("Add to homescreen: not displaying callout because already shown on screen");
                var e = Date.now(),
                i = this.session.lastDisplayTime;
                if (t !== !0) {
                    if (!this.ready) return void this.doLog("Add to homescreen: not displaying callout because not ready");
                    if (e - i < 6e4 * this.options.displayPace) return void this.doLog("Add to homescreen: not displaying callout because displayed recently");
                    if (this.options.maxDisplayCount && this.session.displayCount >= this.options.maxDisplayCount) return void this.doLog("Add to homescreen: not displaying callout because displayed too many times already")
                }
                this.shown = !0,
                this.session.lastDisplayTime = e,
                this.session.displayCount++,
                this.updateSession(),
                this.applicationIcon || ("ios" == o.OS ? this.applicationIcon = document.querySelector('head link[rel^=apple-touch-icon][sizes="152x152"],head link[rel^=apple-touch-icon][sizes="144x144"],head link[rel^=apple-touch-icon][sizes="120x120"],head link[rel^=apple-touch-icon][sizes="114x114"],head link[rel^=apple-touch-icon]') : this.applicationIcon = document.querySelector('head link[rel^="shortcut icon"][sizes="196x196"],head link[rel^=apple-touch-icon]'));
                var n = "";
                "object" == typeof this.options.message && o.language in this.options.message ? n = this.options.message[o.language][o.OS] : "object" == typeof this.options.message && o.OS in this.options.message ? n = this.options.message[o.OS] : this.options.message in o.intl ? n = o.intl[this.options.message][o.OS] : "" !== this.options.message ? n = this.options.message: o.OS in o.intl[o.language] && (n = o.intl[o.language][o.OS]),
                n = "<p>" + n.replace("%icon", '<span class="ath-action-icon">icon</span>') + "</p>",
                this.viewport = document.createElement("div"),
                this.viewport.className = "ath-viewport",
                this.options.modal && (this.viewport.className += " ath-modal"),
                this.options.mandatory && (this.viewport.className += " ath-mandatory"),
                this.viewport.style.position = "absolute",
                this.element = document.createElement("div"),
                this.element.className = "ath-container ath-" + o.OS + " ath-" + o.OS + (o.OSVersion + "").substr(0, 1) + " ath-" + (o.isTablet ? "tablet": "phone"),
                this.element.style.cssText = "-webkit-transition-property:-webkit-transform,opacity;-webkit-transition-duration:0s;-webkit-transition-timing-function:ease-out;transition-property:transform,opacity;transition-duration:0s;transition-timing-function:ease-out;",
                this.element.style.webkitTransform = "translate3d(0,-" + window.innerHeight + "px,0)",
                this.element.style.transform = "translate3d(0,-" + window.innerHeight + "px,0)",
                this.options.icon && this.applicationIcon && (this.element.className += " ath-icon", this.img = document.createElement("img"), this.img.className = "ath-application-icon", this.img.addEventListener("load", this, !1), this.img.addEventListener("error", this, !1), this.img.src = this.applicationIcon.href, this.element.appendChild(this.img)),
                this.element.innerHTML += n,
                this.viewport.style.left = "-99999em",
                this.viewport.appendChild(this.element),
                this.container.appendChild(this.viewport),
                this.img ? this.doLog("Add to homescreen: not displaying callout because waiting for img to load") : this._delayedShow()
            },
            _delayedShow: function(t) {
                setTimeout(this._show.bind(this), 1e3 * this.options.startDelay + 500)
            },
            _show: function() {
                var t = this;
                this.updateViewport(),
                window.addEventListener("resize", this, !1),
                window.addEventListener("scroll", this, !1),
                window.addEventListener("orientationchange", this, !1),
                this.options.modal && document.addEventListener("touchmove", this, !0),
                this.options.mandatory || setTimeout(function() {
                    t.element.addEventListener("click", t, !0)
                },
                1e3),
                setTimeout(function() {
                    t.element.style.webkitTransitionDuration = "1.2s",
                    t.element.style.transitionDuration = "1.2s",
                    t.element.style.webkitTransform = "translate3d(0,0,0)",
                    t.element.style.transform = "translate3d(0,0,0)"
                },
                0),
                this.options.lifespan && (this.removeTimer = setTimeout(this.remove.bind(this), 1e3 * this.options.lifespan)),
                this.options.onShow && this.options.onShow.call(this)
            },
            remove: function() {
                clearTimeout(this.removeTimer),
                this.img && (this.img.removeEventListener("load", this, !1), this.img.removeEventListener("error", this, !1)),
                window.removeEventListener("resize", this, !1),
                window.removeEventListener("scroll", this, !1),
                window.removeEventListener("orientationchange", this, !1),
                document.removeEventListener("touchmove", this, !0),
                this.element.removeEventListener("click", this, !0),
                this.element.addEventListener("transitionend", this, !1),
                this.element.addEventListener("webkitTransitionEnd", this, !1),
                this.element.addEventListener("MSTransitionEnd", this, !1),
                this.element.style.webkitTransitionDuration = "0.3s",
                this.element.style.opacity = "0"
            },
            _removeElements: function() {
                this.element.removeEventListener("transitionend", this, !1),
                this.element.removeEventListener("webkitTransitionEnd", this, !1),
                this.element.removeEventListener("MSTransitionEnd", this, !1),
                this.container.removeChild(this.viewport),
                this.shown = !1,
                this.options.onRemove && this.options.onRemove.call(this)
            },
            updateViewport: function() {
                if (this.shown) {
                    this.viewport.style.width = window.innerWidth + "px",
                    this.viewport.style.height = window.innerHeight + "px",
                    this.viewport.style.left = window.scrollX + "px",
                    this.viewport.style.top = window.scrollY + "px";
                    var t = document.documentElement.clientWidth;
                    this.orientation = t > document.documentElement.clientHeight ? "landscape": "portrait";
                    var e = "ios" == o.OS ? "portrait" == this.orientation ? screen.width: screen.height: screen.width;
                    this.scale = screen.width > t ? 1 : e / window.innerWidth,
                    this.element.style.fontSize = this.options.fontSize / this.scale + "px"
                }
            },
            resize: function() {
                clearTimeout(this.resizeTimer),
                this.resizeTimer = setTimeout(this.updateViewport.bind(this), 100)
            },
            updateSession: function() {
                o.hasLocalStorage !== !1 && localStorage && localStorage.setItem(this.options.appID, JSON.stringify(this.session))
            },
            clearSession: function() {
                this.session = v,
                this.updateSession()
            },
            getItem: function(t) {
                try {
                    if (!localStorage) throw new Error("localStorage is not defined");
                    return localStorage.getItem(t)
                } catch(e) {
                    o.hasLocalStorage = !1
                }
            },
            optOut: function() {
                this.session.optedout = !0,
                this.updateSession()
            },
            optIn: function() {
                this.session.optedout = !1,
                this.updateSession()
            },
            clearDisplayCount: function() {
                this.session.displayCount = 0,
                this.updateSession()
            },
            _preventDefault: function(t) {
                t.preventDefault(),
                t.stopPropagation()
            }
        },
        o.VERSION = "3.2.2",
        t.exports = r.addToHomescreen = o
    },
    function(t, e, i) {
        "use strict";
        var n = i(1),
        o = i(2),
        s = function(t, e) {
            var i = this;
            this.options = n.extend({},
            s.DEFAULTS, e),
            this.$element = n(t),
            this.$element.addClass("am-fade am-in").on("click.alert.amui", ".am-close",
            function() {
                i.close()
            })
        };
        s.DEFAULTS = {
            removeElement: !0
        },
        s.prototype.close = function() {
            function t() {
                e.trigger("closed.alert.amui").remove()
            }
            var e = this.$element;
            e.trigger("close.alert.amui").removeClass("am-in"),
            o.support.transition && e.hasClass("am-fade") ? e.one(o.support.transition.end, t).emulateTransitionEnd(200) : t()
        },
        o.plugin("alert", s),
        n(document).on("click.alert.amui.data-api", "[data-am-alert]",
        function(t) {
            var e = n(t.target);
            e.is(".am-close") && n(this).alert("close")
        }),
        t.exports = s
    },
    function(t, e, i) {
        "use strict";
        var n = i(1),
        o = i(2),
        s = function(t, e) {
            this.$element = n(t),
            this.options = n.extend({},
            s.DEFAULTS, e),
            this.isLoading = !1,
            this.hasSpinner = !1
        };
        s.DEFAULTS = {
            loadingText: "loading...",
            disabledClassName: "am-disabled",
            spinner: void 0
        },
        s.prototype.setState = function(t, e) {
            var i = this.$element,
            s = "disabled",
            a = i.data(),
            r = this.options,
            l = i.is("input") ? "val": "html",
            c = "am-btn-" + t + " " + r.disabledClassName;
            t += "Text",
            r.resetText || (r.resetText = i[l]()),
            o.support.animation && r.spinner && "html" === l && !this.hasSpinner && (r.loadingText = '<span class="am-icon-' + r.spinner + ' am-icon-spin"></span>' + r.loadingText, this.hasSpinner = !0),
            e = e || (void 0 === a[t] ? r[t] : a[t]),
            i[l](e),
            setTimeout(n.proxy(function() {
                "loadingText" === t ? (i.addClass(c).attr(s, s), this.isLoading = !0) : this.isLoading && (i.removeClass(c).removeAttr(s), this.isLoading = !1)
            },
            this), 0)
        },
        s.prototype.toggle = function() {
            var t = !0,
            e = this.$element,
            i = this.$element.parent('[class*="am-btn-group"]');
            if (i.length) {
                var n = this.$element.find("input");
                "radio" == n.prop("type") && (n.prop("checked") && e.hasClass("am-active") ? t = !1 : i.find(".am-active").removeClass("am-active")),
                t && n.prop("checked", !e.hasClass("am-active")).trigger("change")
            }
            t && (e.toggleClass("am-active"), e.hasClass("am-active") || e.blur())
        },
        o.plugin("button", s, {
            dataOptions: "data-am-loading",
            methodCall: function(t, e) {
                "toggle" === t[0] ? e.toggle() : "string" == typeof t[0] && e.setState.apply(e, t)
            }
        }),
        n(document).on("click.button.amui.data-api", "[data-am-button]",
        function(t) {
            t.preventDefault();
            var e = n(t.target);
            e.hasClass("am-btn") || (e = e.closest(".am-btn")),
            e.button("toggle")
        }),
        o.ready(function(t) {
            n("[data-am-loading]", t).button()
        }),
        t.exports = o.button = s
    },
    function(t, e, i) {
        "use strict";
        function n(t) {
            return this.each(function() {
                var e = o(this),
                i = e.data("amui.collapse"),
                n = o.extend({},
                a.DEFAULTS, s.utils.options(e.attr("data-am-collapse")), "object" == typeof t && t); ! i && n.toggle && "open" === t && (t = !t),
                i || e.data("amui.collapse", i = new a(this, n)),
                "string" == typeof t && i[t]()
            })
        }
        var o = i(1),
        s = i(2),
        a = function(t, e) {
            this.$element = o(t),
            this.options = o.extend({},
            a.DEFAULTS, e),
            this.transitioning = null,
            this.options.parent && (this.$parent = o(this.options.parent)),
            this.options.toggle && this.toggle()
        };
        a.DEFAULTS = {
            toggle: !0
        },
        a.prototype.open = function() {
            if (!this.transitioning && !this.$element.hasClass("am-in")) {
                var t = o.Event("open.collapse.amui");
                if (this.$element.trigger(t), !t.isDefaultPrevented()) {
                    var e = this.$parent && this.$parent.find("> .am-panel > .am-in");
                    if (e && e.length) {
                        var i = e.data("amui.collapse");
                        if (i && i.transitioning) return;
                        n.call(e, "close"),
                        i || e.data("amui.collapse", null)
                    }
                    this.$element.removeClass("am-collapse").addClass("am-collapsing").height(0),
                    this.transitioning = 1;
                    var a = function() {
                        this.$element.removeClass("am-collapsing").addClass("am-collapse am-in").height("").trigger("opened.collapse.amui"),
                        this.transitioning = 0
                    };
                    if (!s.support.transition) return a.call(this);
                    var r = this.$element[0].scrollHeight;
                    this.$element.one(s.support.transition.end, o.proxy(a, this)).emulateTransitionEnd(300).css({
                        height: r
                    })
                }
            }
        },
        a.prototype.close = function() {
            if (!this.transitioning && this.$element.hasClass("am-in")) {
                var t = o.Event("close.collapse.amui");
                if (this.$element.trigger(t), !t.isDefaultPrevented()) {
                    this.$element.height(this.$element.height()).redraw(),
                    this.$element.addClass("am-collapsing").removeClass("am-collapse am-in"),
                    this.transitioning = 1;
                    var e = function() {
                        this.transitioning = 0,
                        this.$element.trigger("closed.collapse.amui").removeClass("am-collapsing").addClass("am-collapse")
                    };
                    return s.support.transition ? void this.$element.height(0).one(s.support.transition.end, o.proxy(e, this)).emulateTransitionEnd(300) : e.call(this)
                }
            }
        },
        a.prototype.toggle = function() {
            this[this.$element.hasClass("am-in") ? "close": "open"]()
        },
        o.fn.collapse = n,
        o(document).on("click.collapse.amui.data-api", "[data-am-collapse]",
        function(t) {
            var e, i = o(this),
            a = s.utils.options(i.attr("data-am-collapse")),
            r = a.target || t.preventDefault() || (e = i.attr("href")) && e.replace(/.*(?=#[^\s]+$)/, ""),
            l = o(r),
            c = l.data("amui.collapse"),
            h = c ? "toggle": a,
            u = a.parent,
            d = u && o(u);
            c && c.transitioning || (d && d.find("[data-am-collapse]").not(i).addClass("am-collapsed"), i[l.hasClass("am-in") ? "addClass": "removeClass"]("am-collapsed")),
            n.call(l, h)
        }),
        t.exports = s.collapse = a
    },
    function(t, e, i) {
        "use strict";
        var n = i(1),
        o = i(2),
        s = n(document),
        a = function(t, e) {
            if (this.$element = n(t), this.options = n.extend({},
            a.DEFAULTS, e), this.format = r.parseFormat(this.options.format), this.$element.data("date", this.options.date), this.language = this.getLocale(this.options.locale), this.theme = this.options.theme, this.$picker = n(r.template).appendTo("body").on({
                click: n.proxy(this.click, this)
            }), this.isInput = this.$element.is("input"), this.component = this.$element.is(".am-datepicker-date") ? this.$element.find(".am-datepicker-add-on") : !1, this.isInput ? this.$element.on({
                "click.datepicker.amui": n.proxy(this.open, this),
                "keyup.datepicker.amui": n.proxy(this.update, this)
            }) : this.component ? this.component.on("click.datepicker.amui", n.proxy(this.open, this)) : this.$element.on("click.datepicker.amui", n.proxy(this.open, this)), this.minViewMode = this.options.minViewMode, "string" == typeof this.minViewMode) switch (this.minViewMode) {
            case "months":
                this.minViewMode = 1;
                break;
            case "years":
                this.minViewMode = 2;
                break;
            default:
                this.minViewMode = 0
            }
            if (this.viewMode = this.options.viewMode, "string" == typeof this.viewMode) switch (this.viewMode) {
            case "months":
                this.viewMode = 1;
                break;
            case "years":
                this.viewMode = 2;
                break;
            default:
                this.viewMode = 0
            }
            this.startViewMode = this.viewMode,
            this.weekStart = (this.options.weekStart || a.locales[this.language].weekStart || 0) % 7,
            this.weekEnd = (this.weekStart + 6) % 7,
            this.onRender = this.options.onRender,
            this.setTheme(),
            this.fillDow(),
            this.fillMonths(),
            this.update(),
            this.showMode()
        };
        a.DEFAULTS = {
            locale: "zh_CN",
            format: "yyyy-mm-dd",
            weekStart: void 0,
            viewMode: 0,
            minViewMode: 0,
            date: "",
            theme: "",
            autoClose: 1,
            onRender: function(t) {
                return ""
            }
        },
        a.prototype.open = function(t) {
            this.$picker.show(),
            this.height = this.component ? this.component.outerHeight() : this.$element.outerHeight(),
            this.place(),
            n(window).on("resize.datepicker.amui", n.proxy(this.place, this)),
            t && (t.stopPropagation(), t.preventDefault());
            var e = this;
            s.on("mousedown.datapicker.amui touchstart.datepicker.amui",
            function(t) {
                0 === n(t.target).closest(".am-datepicker").length && e.close()
            }),
            this.$element.trigger({
                type: "open.datepicker.amui",
                date: this.date
            })
        },
        a.prototype.close = function() {
            this.$picker.hide(),
            n(window).off("resize.datepicker.amui", this.place),
            this.viewMode = this.startViewMode,
            this.showMode(),
            this.isInput || n(document).off("mousedown.datapicker.amui touchstart.datepicker.amui", this.close),
            this.$element.trigger({
                type: "close.datepicker.amui",
                date: this.date
            })
        },
        a.prototype.set = function() {
            var t, e = r.formatDate(this.date, this.format);
            this.isInput ? t = this.$element.attr("value", e) : (this.component && (t = this.$element.find("input").attr("value", e)), this.$element.data("date", e)),
            t && t.trigger("change")
        },
        a.prototype.setValue = function(t) {
            "string" == typeof t ? this.date = r.parseDate(t, this.format) : this.date = new Date(t),
            this.set(),
            this.viewDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1, 0, 0, 0, 0),
            this.fill()
        },
        a.prototype.place = function() {
            var t = this.component ? this.component.offset() : this.$element.offset(),
            e = this.component ? this.component.width() : this.$element.width(),
            i = t.top + this.height,
            n = t.left,
            o = s.width() - t.left - e,
            a = this.isOutView();
            if (this.$picker.removeClass("am-datepicker-right"), this.$picker.removeClass("am-datepicker-up"), s.width() > 640) {
                if (a.outRight) return this.$picker.addClass("am-datepicker-right"),
                void this.$picker.css({
                    top: i,
                    left: "auto",
                    right: o
                });
                a.outBottom && (this.$picker.addClass("am-datepicker-up"), i = t.top - this.$picker.outerHeight(!0))
            } else n = 0;
            this.$picker.css({
                top: i,
                left: n
            })
        },
        a.prototype.update = function(t) {
            this.date = r.parseDate("string" == typeof t ? t: this.isInput ? this.$element.prop("value") : this.$element.data("date"), this.format),
            this.viewDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1, 0, 0, 0, 0),
            this.fill()
        },
        a.prototype.fillDow = function() {
            for (var t = this.weekStart,
            e = "<tr>"; t < this.weekStart + 7;) e += '<th class="am-datepicker-dow">' + a.locales[this.language].daysMin[t++%7] + "</th>";
            e += "</tr>",
            this.$picker.find(".am-datepicker-days thead").append(e)
        },
        a.prototype.fillMonths = function() {
            for (var t = "",
            e = 0; 12 > e;) t += '<span class="am-datepicker-month">' + a.locales[this.language].monthsShort[e++] + "</span>";
            this.$picker.find(".am-datepicker-months td").append(t)
        },
        a.prototype.fill = function() {
            var t = new Date(this.viewDate),
            e = t.getFullYear(),
            i = t.getMonth(),
            n = this.date.valueOf(),
            o = new Date(e, i - 1, 28, 0, 0, 0, 0),
            s = r.getDaysInMonth(o.getFullYear(), o.getMonth()),
            l = this.$picker.find(".am-datepicker-days .am-datepicker-select");
            "zh_CN" === this.language ? l.text(e + a.locales[this.language].year[0] + " " + a.locales[this.language].months[i]) : l.text(a.locales[this.language].months[i] + " " + e),
            o.setDate(s),
            o.setDate(s - (o.getDay() - this.weekStart + 7) % 7);
            var c = new Date(o);
            c.setDate(c.getDate() + 42),
            c = c.valueOf();
            for (var h, u, d, p = []; o.valueOf() < c;) o.getDay() === this.weekStart && p.push("<tr>"),
            h = this.onRender(o, 0),
            u = o.getFullYear(),
            d = o.getMonth(),
            i > d && u === e || e > u ? h += " am-datepicker-old": (d > i && u === e || u > e) && (h += " am-datepicker-new"),
            o.valueOf() === n && (h += " am-active"),
            p.push('<td class="am-datepicker-day ' + h + '">' + o.getDate() + "</td>"),
            o.getDay() === this.weekEnd && p.push("</tr>"),
            o.setDate(o.getDate() + 1);
            this.$picker.find(".am-datepicker-days tbody").empty().append(p.join(""));
            var m = this.date.getFullYear(),
            f = this.$picker.find(".am-datepicker-months").find(".am-datepicker-select").text(e);
            f = f.end().find("span").removeClass("am-active").removeClass("am-disabled");
            for (var v = 0; 12 > v;) this.onRender(t.setFullYear(e, v), 1) && f.eq(v).addClass("am-disabled"),
            v++;
            m === e && f.eq(this.date.getMonth()).removeClass("am-disabled").addClass("am-active"),
            p = "",
            e = 10 * parseInt(e / 10, 10);
            var g, w = this.$picker.find(".am-datepicker-years").find(".am-datepicker-select").text(e + "-" + (e + 9)).end().find("td"),
            y = new Date(this.viewDate);
            e -= 1;
            for (var b = -1; 11 > b; b++) g = this.onRender(y.setFullYear(e), 2),
            p += '<span class="' + g + ( - 1 === b || 10 === b ? " am-datepicker-old": "") + (m === e ? " am-active": "") + '">' + e + "</span>",
            e += 1;
            w.html(p)
        },
        a.prototype.click = function(t) {
            t.stopPropagation(),
            t.preventDefault();
            var e, i, o = this.$picker.find(".am-datepicker-days").find(".am-active"),
            s = this.$picker.find(".am-datepicker-months"),
            a = s.find(".am-active").index(),
            l = n(t.target).closest("span, td, th");
            if (1 === l.length) switch (l[0].nodeName.toLowerCase()) {
            case "th":
                switch (l[0].className) {
                case "am-datepicker-switch":
                    this.showMode(1);
                    break;
                case "am-datepicker-prev":
                case "am-datepicker-next":
                    this.viewDate["set" + r.modes[this.viewMode].navFnc].call(this.viewDate, this.viewDate["get" + r.modes[this.viewMode].navFnc].call(this.viewDate) + r.modes[this.viewMode].navStep * ("am-datepicker-prev" === l[0].className ? -1 : 1)),
                    this.fill(),
                    this.set()
                }
                break;
            case "span":
                if (l.is(".am-disabled")) return;
                l.is(".am-datepicker-month") ? (e = l.parent().find("span").index(l), l.is(".am-active") ? this.viewDate.setMonth(e, o.text()) : this.viewDate.setMonth(e)) : (i = parseInt(l.text(), 10) || 0, l.is(".am-active") ? this.viewDate.setFullYear(i, a, o.text()) : this.viewDate.setFullYear(i)),
                0 !== this.viewMode && (this.date = new Date(this.viewDate), this.$element.trigger({
                    type: "changeDate.datepicker.amui",
                    date: this.date,
                    viewMode: r.modes[this.viewMode].clsName
                })),
                this.showMode( - 1),
                this.fill(),
                this.set();
                break;
            case "td":
                if (l.is(".am-datepicker-day") && !l.is(".am-disabled")) {
                    var c = parseInt(l.text(), 10) || 1;
                    e = this.viewDate.getMonth(),
                    l.is(".am-datepicker-old") ? e -= 1 : l.is(".am-datepicker-new") && (e += 1),
                    i = this.viewDate.getFullYear(),
                    this.date = new Date(i, e, c, 0, 0, 0, 0),
                    this.viewDate = new Date(i, e, Math.min(28, c), 0, 0, 0, 0),
                    this.fill(),
                    this.set(),
                    this.$element.trigger({
                        type: "changeDate.datepicker.amui",
                        date: this.date,
                        viewMode: r.modes[this.viewMode].clsName
                    }),
                    this.options.autoClose && this.close()
                }
            }
        },
        a.prototype.mousedown = function(t) {
            t.stopPropagation(),
            t.preventDefault()
        },
        a.prototype.showMode = function(t) {
            t && (this.viewMode = Math.max(this.minViewMode, Math.min(2, this.viewMode + t))),
            this.$picker.find(">div").hide().filter(".am-datepicker-" + r.modes[this.viewMode].clsName).show()
        },
        a.prototype.isOutView = function() {
            var t = this.component ? this.component.offset() : this.$element.offset(),
            e = {
                outRight: !1,
                outBottom: !1
            },
            i = this.$picker,
            n = t.left + i.outerWidth(!0),
            o = t.top + i.outerHeight(!0) + this.$element.innerHeight();
            return n > s.width() && (e.outRight = !0),
            o > s.height() && (e.outBottom = !0),
            e
        },
        a.prototype.getLocale = function(t) {
            return t || (t = navigator.language && navigator.language.split("-"), t[1] = t[1].toUpperCase(), t = t.join("_")),
            a.locales[t] || (t = "en_US"),
            t
        },
        a.prototype.setTheme = function() {
            this.theme && this.$picker.addClass("am-datepicker-" + this.theme)
        },
        a.locales = {
            en_US: {
                days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
                months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                weekStart: 0
            },
            zh_CN: {
                days: ["\u661f\u671f\u65e5", "\u661f\u671f\u4e00", "\u661f\u671f\u4e8c", "\u661f\u671f\u4e09", "\u661f\u671f\u56db", "\u661f\u671f\u4e94", "\u661f\u671f\u516d"],
                daysShort: ["\u5468\u65e5", "\u5468\u4e00", "\u5468\u4e8c", "\u5468\u4e09", "\u5468\u56db", "\u5468\u4e94", "\u5468\u516d"],
                daysMin: ["\u65e5", "\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d"],
                months: ["\u4e00\u6708", "\u4e8c\u6708", "\u4e09\u6708", "\u56db\u6708", "\u4e94\u6708", "\u516d\u6708", "\u4e03\u6708", "\u516b\u6708", "\u4e5d\u6708", "\u5341\u6708", "\u5341\u4e00\u6708", "\u5341\u4e8c\u6708"],
                monthsShort: ["\u4e00\u6708", "\u4e8c\u6708", "\u4e09\u6708", "\u56db\u6708", "\u4e94\u6708", "\u516d\u6708", "\u4e03\u6708", "\u516b\u6708", "\u4e5d\u6708", "\u5341\u6708", "\u5341\u4e00\u6708", "\u5341\u4e8c\u6708"],
                weekStart: 1,
                year: ["\u5e74"]
            }
        };
        var r = {
            modes: [{
                clsName: "days",
                navFnc: "Month",
                navStep: 1
            },
            {
                clsName: "months",
                navFnc: "FullYear",
                navStep: 1
            },
            {
                clsName: "years",
                navFnc: "FullYear",
                navStep: 10
            }],
            isLeapYear: function(t) {
                return t % 4 === 0 && t % 100 !== 0 || t % 400 === 0
            },
            getDaysInMonth: function(t, e) {
                return [31, r.isLeapYear(t) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][e]
            },
            parseFormat: function(t) {
                var e = t.match(/[.\/\-\s].*?/),
                i = t.split(/\W+/);
                if (!e || !i || 0 === i.length) throw new Error("Invalid date format.");
                return {
                    separator: e,
                    parts: i
                }
            },
            parseDate: function(t, e) {
                var i, n = t.split(e.separator);
                if (t = new Date, t.setHours(0), t.setMinutes(0), t.setSeconds(0), t.setMilliseconds(0), n.length === e.parts.length) {
                    for (var o = t.getFullYear(), s = t.getDate(), a = t.getMonth(), r = 0, l = e.parts.length; l > r; r++) switch (i = parseInt(n[r], 10) || 1, e.parts[r]) {
                    case "dd":
                    case "d":
                        s = i,
                        t.setDate(i);
                        break;
                    case "mm":
                    case "m":
                        a = i - 1,
                        t.setMonth(i - 1);
                        break;
                    case "yy":
                        o = 2e3 + i,
                        t.setFullYear(2e3 + i);
                        break;
                    case "yyyy":
                        o = i,
                        t.setFullYear(i)
                    }
                    t = new Date(o, a, s, 0, 0, 0)
                }
                return t
            },
            formatDate: function(t, e) {
                var i = {
                    d: t.getDate(),
                    m: t.getMonth() + 1,
                    yy: t.getFullYear().toString().substring(2),
                    yyyy: t.getFullYear()
                },
                n = [];
                i.dd = (i.d < 10 ? "0": "") + i.d,
                i.mm = (i.m < 10 ? "0": "") + i.m;
                for (var o = 0,
                s = e.parts.length; s > o; o++) n.push(i[e.parts[o]]);
                return n.join(e.separator)
            },
            headTemplate: '<thead><tr class="am-datepicker-header"><th class="am-datepicker-prev"><i class="am-datepicker-prev-icon"></i></th><th colspan="5" class="am-datepicker-switch"><div class="am-datepicker-select"></div></th><th class="am-datepicker-next"><i class="am-datepicker-next-icon"></i></th></tr></thead>',
            contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>'
        };
        r.template = '<div class="am-datepicker am-datepicker-dropdown"><div class="am-datepicker-caret"></div><div class="am-datepicker-days"><table class="am-datepicker-table">' + r.headTemplate + '<tbody></tbody></table></div><div class="am-datepicker-months"><table class="am-datepicker-table">' + r.headTemplate + r.contTemplate + '</table></div><div class="am-datepicker-years"><table class="am-datepicker-table">' + r.headTemplate + r.contTemplate + "</table></div></div>",
        o.plugin("datepicker", a),
        o.ready(function(t) {
            n("[data-am-datepicker]").datepicker()
        }),
        t.exports = o.datepicker = a
    },
    function(t, e, i) {
        "use strict";
        var n = i(1),
        o = i(2),
        s = n(document),
        a = o.support.transition,
        r = function() {
            this.id = o.utils.generateGUID("am-dimmer"),
            this.$element = n(r.DEFAULTS.tpl, {
                id: this.id
            }),
            this.inited = !1,
            this.scrollbarWidth = 0,
            this.$used = n([])
        };
        r.DEFAULTS = {
            tpl: '<div class="am-dimmer" data-am-dimmer></div>'
        },
        r.prototype.init = function() {
            return this.inited || (n(document.body).append(this.$element), this.inited = !0, s.trigger("init.dimmer.amui"), this.$element.on("touchmove.dimmer.amui",
            function(t) {
                t.preventDefault()
            })),
            this
        },
        r.prototype.open = function(t) {
            this.inited || this.init();
            var e = this.$element;
            return t && (this.$used = this.$used.add(n(t))),
            this.checkScrollbar().setScrollbar(),
            e.show().trigger("open.dimmer.amui"),
            a && e.off(a.end),
            setTimeout(function() {
                e.addClass("am-active")
            },
            0),
            this
        },
        r.prototype.close = function(t, e) {
            function i() {
                o.hide(),
                this.resetScrollbar()
            }
            if (this.$used = this.$used.not(n(t)), !e && this.$used.length) return this;
            var o = this.$element;
            return o.removeClass("am-active").trigger("close.dimmer.amui"),
            i.call(this),
            this
        },
        r.prototype.checkScrollbar = function() {
            return this.scrollbarWidth = o.utils.measureScrollbar(),
            this
        },
        r.prototype.setScrollbar = function() {
            var t = n(document.body),
            e = parseInt(t.css("padding-right") || 0, 10);
            return this.scrollbarWidth && t.css("padding-right", e + this.scrollbarWidth),
            t.addClass("am-dimmer-active"),
            this
        },
        r.prototype.resetScrollbar = function() {
            return n(document.body).css("padding-right", "").removeClass("am-dimmer-active"),
            this
        },
        t.exports = o.dimmer = new r
    },
    function(t, e, i) {
        "use strict";
        var n = i(1),
        o = i(2),
        s = o.support.animation,
        a = function(t, e) {
            this.options = n.extend({},
            a.DEFAULTS, e),
            e = this.options,
            this.$element = n(t),
            this.$toggle = this.$element.find(e.selector.toggle),
            this.$dropdown = this.$element.find(e.selector.dropdown),
            this.$boundary = e.boundary === window ? n(window) : this.$element.closest(e.boundary),
            this.$justify = e.justify && n(e.justify).length && n(e.justify) || void 0,
            !this.$boundary.length && (this.$boundary = n(window)),
            this.active = !!this.$element.hasClass("am-active"),
            this.animating = null,
            this.events()
        };
        a.DEFAULTS = {
            animation: "am-animation-slide-top-fixed",
            boundary: window,
            justify: void 0,
            selector: {
                dropdown: ".am-dropdown-content",
                toggle: ".am-dropdown-toggle"
            },
            trigger: "click"
        },
        a.prototype.toggle = function() {
            this.clear(),
            this.animating || this[this.active ? "close": "open"]()
        },
        a.prototype.open = function(t) {
            var e = this.$toggle,
            i = this.$element,
            o = this.$dropdown;
            if (!e.is(".am-disabled, :disabled") && !this.active) {
                i.trigger("open.dropdown.amui").addClass("am-active"),
                e.trigger("focus"),
                this.checkDimensions();
                var a = n.proxy(function() {
                    i.trigger("opened.dropdown.amui"),
                    this.active = !0,
                    this.animating = 0
                },
                this);
                s ? (this.animating = 1, o.addClass(this.options.animation).on(s.end + ".open.dropdown.amui", n.proxy(function() {
                    a(),
                    o.removeClass(this.options.animation)
                },
                this))) : a()
            }
        },
        a.prototype.close = function() {
            if (this.active) {
                var t = "am-dropdown-animation",
                e = this.$element,
                i = this.$dropdown;
                e.trigger("close.dropdown.amui");
                var o = n.proxy(function() {
                    e.removeClass("am-active").trigger("closed.dropdown.amui"),
                    this.active = !1,
                    this.animating = 0,
                    this.$toggle.blur()
                },
                this);
                s ? (i.removeClass(this.options.animation), i.addClass(t), this.animating = 1, i.one(s.end + ".close.dropdown.amui",
                function() {
                    i.removeClass(t),
                    o()
                })) : o()
            }
        },
        a.prototype.enable = function() {
            this.$toggle.prop("disabled", !1)
        },
        a.prototype.disable = function() {
            this.$toggle.prop("disabled", !0)
        },
        a.prototype.checkDimensions = function() {
            if (this.$dropdown.length) {
                var t = this.$dropdown,
                e = t.offset(),
                i = t.outerWidth(),
                o = this.$boundary.width(),
                s = n.isWindow(this.boundary) && this.$boundary.offset() ? this.$boundary.offset().left: 0;
                this.$justify && t.css({
                    "min-width": this.$justify.css("width")
                }),
                i + (e.left - s) > o && this.$element.addClass("am-dropdown-flip")
            }
        },
        a.prototype.clear = function() {
            n("[data-am-dropdown]").not(this.$element).each(function() {
                var t = n(this).data("amui.dropdown");
                t && t.close()
            })
        },
        a.prototype.events = function() {
            var t = "dropdown.amui",
            e = this.$toggle;
            e.on("click." + t, n.proxy(function(t) {
                t.preventDefault(),
                this.toggle()
            },
            this)),
            n(document).on("keydown.dropdown.amui", n.proxy(function(t) {
                27 === t.keyCode && this.active && this.close()
            },
            this)).on("click.outer.dropdown.amui", n.proxy(function(t) { ! this.active || this.$element[0] !== t.target && this.$element.find(t.target).length || this.close()
            },
            this))
        },
        o.plugin("dropdown", a),
        o.ready(function(t) {
            n("[data-am-dropdown]", t).dropdown()
        }),
        n(document).on("click.dropdown.amui.data-api", ".am-dropdown form",
        function(t) {
            t.stopPropagation()
        }),
        t.exports = o.dropdown = a
    },
    function(t, e, i) { (function(e) {
            var n = i(1),
            o = i(2),
            s = !0;
            n.flexslider = function(t, i) {
                var o = n(t);
                o.vars = n.extend({},
                n.flexslider.defaults, i);
                var a, r = o.vars.namespace,
                l = window.navigator && window.navigator.msPointerEnabled && window.MSGesture,
                c = ("ontouchstart" in window || l || window.DocumentTouch && document instanceof DocumentTouch) && o.vars.touch,
                h = "click touchend MSPointerUp keyup",
                u = "",
                d = "vertical" === o.vars.direction,
                p = o.vars.reverse,
                m = o.vars.itemWidth > 0,
                f = "fade" === o.vars.animation,
                v = "" !== o.vars.asNavFor,
                g = {};
                n.data(t, "flexslider", o),
                g = {
                    init: function() {
                        o.animating = !1,
                        o.currentSlide = parseInt(o.vars.startAt ? o.vars.startAt: 0, 10),
                        isNaN(o.currentSlide) && (o.currentSlide = 0),
                        o.animatingTo = o.currentSlide,
                        o.atEnd = 0 === o.currentSlide || o.currentSlide === o.last,
                        o.containerSelector = o.vars.selector.substr(0, o.vars.selector.search(" ")),
                        o.slides = n(o.vars.selector, o),
                        o.container = n(o.containerSelector, o),
                        o.count = o.slides.length,
                        o.syncExists = n(o.vars.sync).length > 0,
                        "slide" === o.vars.animation && (o.vars.animation = "swing"),
                        o.prop = d ? "top": "marginLeft",
                        o.args = {},
                        o.manualPause = !1,
                        o.stopped = !1,
                        o.started = !1,
                        o.startTimeout = null,
                        o.transitions = !o.vars.video && !f && o.vars.useCSS &&
                        function() {
                            var t = document.createElement("div"),
                            e = ["perspectiveProperty", "WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective"];
                            for (var i in e) if (void 0 !== t.style[e[i]]) return o.pfx = e[i].replace("Perspective", "").toLowerCase(),
                            o.prop = "-" + o.pfx + "-transform",
                            !0;
                            return ! 1
                        } (),
                        o.ensureAnimationEnd = "",
                        "" !== o.vars.controlsContainer && (o.controlsContainer = n(o.vars.controlsContainer).length > 0 && n(o.vars.controlsContainer)),
                        "" !== o.vars.manualControls && (o.manualControls = n(o.vars.manualControls).length > 0 && n(o.vars.manualControls)),
                        "" !== o.vars.customDirectionNav && (o.customDirectionNav = 2 === n(o.vars.customDirectionNav).length && n(o.vars.customDirectionNav)),
                        o.vars.randomize && (o.slides.sort(function() {
                            return Math.round(Math.random()) - .5
                        }), o.container.empty().append(o.slides)),
                        o.doMath(),
                        o.setup("init"),
                        o.vars.controlNav && g.controlNav.setup(),
                        o.vars.directionNav && g.directionNav.setup(),
                        o.vars.keyboard && (1 === n(o.containerSelector).length || o.vars.multipleKeyboard) && n(document).bind("keyup",
                        function(t) {
                            var e = t.keyCode;
                            if (!o.animating && (39 === e || 37 === e)) {
                                var i = 39 === e ? o.getTarget("next") : 37 === e ? o.getTarget("prev") : !1;
                                o.flexAnimate(i, o.vars.pauseOnAction)
                            }
                        }),
                        o.vars.mousewheel && o.bind("mousewheel",
                        function(t, e, i, n) {
                            t.preventDefault();
                            var s = 0 > e ? o.getTarget("next") : o.getTarget("prev");
                            o.flexAnimate(s, o.vars.pauseOnAction)
                        }),
                        o.vars.pausePlay && g.pausePlay.setup(),
                        o.vars.slideshow && o.vars.pauseInvisible && g.pauseInvisible.init(),
                        o.vars.slideshow && (o.vars.pauseOnHover && o.hover(function() {
                            o.manualPlay || o.manualPause || o.pause()
                        },
                        function() {
                            o.manualPause || o.manualPlay || o.stopped || o.play()
                        }), o.vars.pauseInvisible && g.pauseInvisible.isHidden() || (o.vars.initDelay > 0 ? o.startTimeout = setTimeout(o.play, o.vars.initDelay) : o.play())),
                        v && g.asNav.setup(),
                        c && o.vars.touch && g.touch(),
                        (!f || f && o.vars.smoothHeight) && n(window).bind("resize orientationchange focus", g.resize),
                        o.find("img").attr("draggable", "false"),
                        setTimeout(function() {
                            o.vars.start(o)
                        },
                        200)
                    },
                    asNav: {
                        setup: function() {
                            o.asNav = !0,
                            o.animatingTo = Math.floor(o.currentSlide / o.move),
                            o.currentItem = o.currentSlide,
                            o.slides.removeClass(r + "active-slide").eq(o.currentItem).addClass(r + "active-slide"),
                            l ? (t._slider = o, o.slides.each(function() {
                                var t = this;
                                t._gesture = new MSGesture,
                                t._gesture.target = t,
                                t.addEventListener("MSPointerDown",
                                function(t) {
                                    t.preventDefault(),
                                    t.currentTarget._gesture && t.currentTarget._gesture.addPointer(t.pointerId)
                                },
                                !1),
                                t.addEventListener("MSGestureTap",
                                function(t) {
                                    t.preventDefault();
                                    var e = n(this),
                                    i = e.index();
                                    n(o.vars.asNavFor).data("flexslider").animating || e.hasClass("active") || (o.direction = o.currentItem < i ? "next": "prev", o.flexAnimate(i, o.vars.pauseOnAction, !1, !0, !0))
                                })
                            })) : o.slides.on(h,
                            function(t) {
                                t.preventDefault();
                                var e = n(this),
                                i = e.index(),
                                s = e.offset().left - n(o).scrollLeft();
                                0 >= s && e.hasClass(r + "active-slide") ? o.flexAnimate(o.getTarget("prev"), !0) : n(o.vars.asNavFor).data("flexslider").animating || e.hasClass(r + "active-slide") || (o.direction = o.currentItem < i ? "next": "prev", o.flexAnimate(i, o.vars.pauseOnAction, !1, !0, !0))
                            })
                        }
                    },
                    controlNav: {
                        setup: function() {
                            o.manualControls ? g.controlNav.setupManual() : g.controlNav.setupPaging()
                        },
                        setupPaging: function() {
                            var t, e, i = "thumbnails" === o.vars.controlNav ? "control-thumbs": "control-paging",
                            s = 1;
                            if (o.controlNavScaffold = n('<ol class="' + r + "control-nav " + r + i + '"></ol>'), o.pagingCount > 1) for (var a = 0; a < o.pagingCount; a++) {
                                if (e = o.slides.eq(a), void 0 === e.attr("data-thumb-alt") && e.attr("data-thumb-alt", ""), altText = "" !== e.attr("data-thumb-alt") ? altText = ' alt="' + e.attr("data-thumb-alt") + '"': "", t = "thumbnails" === o.vars.controlNav ? '<img src="' + e.attr("data-thumb") + '"' + altText + "/>": '<a href="#">' + s + "</a>", "thumbnails" === o.vars.controlNav && !0 === o.vars.thumbCaptions) {
                                    var l = e.attr("data-thumbcaption");
                                    "" !== l && void 0 !== l && (t += '<span class="' + r + 'caption">' + l + "</span>")
                                }
                                o.controlNavScaffold.append("<li>" + t + "<i></i></li>"),
                                s++
                            }
                            o.controlsContainer ? n(o.controlsContainer).append(o.controlNavScaffold) : o.append(o.controlNavScaffold),
                            g.controlNav.set(),
                            g.controlNav.active(),
                            o.controlNavScaffold.delegate("a, img", h,
                            function(t) {
                                if (t.preventDefault(), "" === u || u === t.type) {
                                    var e = n(this),
                                    i = o.controlNav.index(e);
                                    e.hasClass(r + "active") || (o.direction = i > o.currentSlide ? "next": "prev", o.flexAnimate(i, o.vars.pauseOnAction))
                                }
                                "" === u && (u = t.type),
                                g.setToClearWatchedEvent()
                            })
                        },
                        setupManual: function() {
                            o.controlNav = o.manualControls,
                            g.controlNav.active(),
                            o.controlNav.bind(h,
                            function(t) {
                                if (t.preventDefault(), "" === u || u === t.type) {
                                    var e = n(this),
                                    i = o.controlNav.index(e);
                                    e.hasClass(r + "active") || (i > o.currentSlide ? o.direction = "next": o.direction = "prev", o.flexAnimate(i, o.vars.pauseOnAction))
                                }
                                "" === u && (u = t.type),
                                g.setToClearWatchedEvent()
                            })
                        },
                        set: function() {
                            var t = "thumbnails" === o.vars.controlNav ? "img": "a";
                            o.controlNav = n("." + r + "control-nav li " + t, o.controlsContainer ? o.controlsContainer: o)
                        },
                        active: function() {
                            o.controlNav.removeClass(r + "active").eq(o.animatingTo).addClass(r + "active")
                        },
                        update: function(t, e) {
                            o.pagingCount > 1 && "add" === t ? o.controlNavScaffold.append(n('<li><a href="#">' + o.count + "</a></li>")) : 1 === o.pagingCount ? o.controlNavScaffold.find("li").remove() : o.controlNav.eq(e).closest("li").remove(),
                            g.controlNav.set(),
                            o.pagingCount > 1 && o.pagingCount !== o.controlNav.length ? o.update(e, t) : g.controlNav.active()
                        }
                    },
                    directionNav: {
                        setup: function() {
                            var t = n('<ul class="' + r + 'direction-nav"><li class="' + r + 'nav-prev"><a class="' + r + 'prev" href="#">' + o.vars.prevText + '</a></li><li class="' + r + 'nav-next"><a class="' + r + 'next" href="#">' + o.vars.nextText + "</a></li></ul>");
                            o.customDirectionNav ? o.directionNav = o.customDirectionNav: o.controlsContainer ? (n(o.controlsContainer).append(t), o.directionNav = n("." + r + "direction-nav li a", o.controlsContainer)) : (o.append(t), o.directionNav = n("." + r + "direction-nav li a", o)),
                            g.directionNav.update(),
                            o.directionNav.bind(h,
                            function(t) {
                                t.preventDefault();
                                var e;
                                "" !== u && u !== t.type || (e = n(this).hasClass(r + "next") ? o.getTarget("next") : o.getTarget("prev"), o.flexAnimate(e, o.vars.pauseOnAction)),
                                "" === u && (u = t.type),
                                g.setToClearWatchedEvent()
                            })
                        },
                        update: function() {
                            var t = r + "disabled";
                            1 === o.pagingCount ? o.directionNav.addClass(t).attr("tabindex", "-1") : o.vars.animationLoop ? o.directionNav.removeClass(t).removeAttr("tabindex") : 0 === o.animatingTo ? o.directionNav.removeClass(t).filter("." + r + "prev").addClass(t).attr("tabindex", "-1") : o.animatingTo === o.last ? o.directionNav.removeClass(t).filter("." + r + "next").addClass(t).attr("tabindex", "-1") : o.directionNav.removeClass(t).removeAttr("tabindex")
                        }
                    },
                    pausePlay: {
                        setup: function() {
                            var t = n('<div class="' + r + 'pauseplay"><a href="#"></a></div>');
                            o.controlsContainer ? (o.controlsContainer.append(t), o.pausePlay = n("." + r + "pauseplay a", o.controlsContainer)) : (o.append(t), o.pausePlay = n("." + r + "pauseplay a", o)),
                            g.pausePlay.update(o.vars.slideshow ? r + "pause": r + "play"),
                            o.pausePlay.bind(h,
                            function(t) {
                                t.preventDefault(),
                                "" !== u && u !== t.type || (n(this).hasClass(r + "pause") ? (o.manualPause = !0, o.manualPlay = !1, o.pause()) : (o.manualPause = !1, o.manualPlay = !0, o.play())),
                                "" === u && (u = t.type),
                                g.setToClearWatchedEvent()
                            })
                        },
                        update: function(t) {
                            "play" === t ? o.pausePlay.removeClass(r + "pause").addClass(r + "play").html(o.vars.playText) : o.pausePlay.removeClass(r + "play").addClass(r + "pause").html(o.vars.pauseText)
                        }
                    },
                    touch: function() {
                        function i(e) {
                            e.stopPropagation(),
                            o.animating ? e.preventDefault() : (o.pause(), t._gesture.addPointer(e.pointerId), C = 0, h = d ? o.h: o.w, v = Number(new Date), c = m && p && o.animatingTo === o.last ? 0 : m && p ? o.limit - (o.itemW + o.vars.itemMargin) * o.move * o.animatingTo: m && o.currentSlide === o.last ? o.limit: m ? (o.itemW + o.vars.itemMargin) * o.move * o.currentSlide: p ? (o.last - o.currentSlide + o.cloneOffset) * h: (o.currentSlide + o.cloneOffset) * h)
                        }
                        function n(i) {
                            i.stopPropagation();
                            var n = i.target._slider;
                            if (n) {
                                var o = -i.translationX,
                                s = -i.translationY;
                                return C += d ? s: o,
                                u = C,
                                b = d ? Math.abs(C) < Math.abs( - o) : Math.abs(C) < Math.abs( - s),
                                i.detail === i.MSGESTURE_FLAG_INERTIA ? void e(function() {
                                    t._gesture.stop()
                                }) : void((!b || Number(new Date) - v > 500) && (i.preventDefault(), !f && n.transitions && (n.vars.animationLoop || (u = C / (0 === n.currentSlide && 0 > C || n.currentSlide === n.last && C > 0 ? Math.abs(C) / h + 2 : 1)), n.setProps(c + u, "setTouch"))))
                            }
                        }
                        function s(t) {
                            t.stopPropagation();
                            var e = t.target._slider;
                            if (e) {
                                if (e.animatingTo === e.currentSlide && !b && null !== u) {
                                    var i = p ? -u: u,
                                    n = i > 0 ? e.getTarget("next") : e.getTarget("prev");
                                    e.canAdvance(n) && (Number(new Date) - v < 550 && Math.abs(i) > 50 || Math.abs(i) > h / 2) ? e.flexAnimate(n, e.vars.pauseOnAction) : f || e.flexAnimate(e.currentSlide, e.vars.pauseOnAction, !0)
                                }
                                a = null,
                                r = null,
                                u = null,
                                c = null,
                                C = 0
                            }
                        }
                        var a, r, c, h, u, v, g, w, y, b = !1,
                        T = 0,
                        x = 0,
                        C = 0;
                        l ? (t.style.msTouchAction = "none", t._gesture = new MSGesture, t._gesture.target = t, t.addEventListener("MSPointerDown", i, !1), t._slider = o, t.addEventListener("MSGestureChange", n, !1), t.addEventListener("MSGestureEnd", s, !1)) : (g = function(e) {
                            o.animating ? e.preventDefault() : (window.navigator.msPointerEnabled || 1 === e.touches.length) && (o.pause(), h = d ? o.h: o.w, v = Number(new Date), T = e.touches[0].pageX, x = e.touches[0].pageY, c = m && p && o.animatingTo === o.last ? 0 : m && p ? o.limit - (o.itemW + o.vars.itemMargin) * o.move * o.animatingTo: m && o.currentSlide === o.last ? o.limit: m ? (o.itemW + o.vars.itemMargin) * o.move * o.currentSlide: p ? (o.last - o.currentSlide + o.cloneOffset) * h: (o.currentSlide + o.cloneOffset) * h, a = d ? x: T, r = d ? T: x, t.addEventListener("touchmove", w, !1), t.addEventListener("touchend", y, !1))
                        },
                        w = function(t) {
                            T = t.touches[0].pageX,
                            x = t.touches[0].pageY,
                            u = d ? a - x: a - T,
                            b = d ? Math.abs(u) < Math.abs(T - r) : Math.abs(u) < Math.abs(x - r);
                            var e = 500; (!b || Number(new Date) - v > e) && (t.preventDefault(), !f && o.transitions && (o.vars.animationLoop || (u /= 0 === o.currentSlide && 0 > u || o.currentSlide === o.last && u > 0 ? Math.abs(u) / h + 2 : 1), o.setProps(c + u, "setTouch")))
                        },
                        y = function(e) {
                            if (t.removeEventListener("touchmove", w, !1), o.animatingTo === o.currentSlide && !b && null !== u) {
                                var i = p ? -u: u,
                                n = i > 0 ? o.getTarget("next") : o.getTarget("prev");
                                o.canAdvance(n) && (Number(new Date) - v < 550 && Math.abs(i) > 50 || Math.abs(i) > h / 2) ? o.flexAnimate(n, o.vars.pauseOnAction) : f || o.flexAnimate(o.currentSlide, o.vars.pauseOnAction, !0)
                            }
                            t.removeEventListener("touchend", y, !1),
                            a = null,
                            r = null,
                            u = null,
                            c = null
                        },
                        t.addEventListener("touchstart", g, !1))
                    },
                    resize: function() { ! o.animating && o.is(":visible") && (m || o.doMath(), f ? g.smoothHeight() : m ? (o.slides.width(o.computedW), o.update(o.pagingCount), o.setProps()) : d ? (o.viewport.height(o.h), o.setProps(o.h, "setTotal")) : (o.vars.smoothHeight && g.smoothHeight(), o.newSlides.width(o.computedW), o.setProps(o.computedW, "setTotal")))
                    },
                    smoothHeight: function(t) {
                        if (!d || f) {
                            var e = f ? o: o.viewport;
                            t ? e.animate({
                                height: o.slides.eq(o.animatingTo).height()
                            },
                            t) : e.height(o.slides.eq(o.animatingTo).height())
                        }
                    },
                    sync: function(t) {
                        var e = n(o.vars.sync).data("flexslider"),
                        i = o.animatingTo;
                        switch (t) {
                        case "animate":
                            e.flexAnimate(i, o.vars.pauseOnAction, !1, !0);
                            break;
                        case "play":
                            e.playing || e.asNav || e.play();
                            break;
                        case "pause":
                            e.pause()
                        }
                    },
                    uniqueID: function(t) {
                        return t.filter("[id]").add(t.find("[id]")).each(function() {
                            var t = n(this);
                            t.attr("id", t.attr("id") + "_clone")
                        }),
                        t
                    },
                    pauseInvisible: {
                        visProp: null,
                        init: function() {
                            var t = g.pauseInvisible.getHiddenProp();
                            if (t) {
                                var e = t.replace(/[H|h]idden/, "") + "visibilitychange";
                                document.addEventListener(e,
                                function() {
                                    g.pauseInvisible.isHidden() ? o.startTimeout ? clearTimeout(o.startTimeout) : o.pause() : o.started ? o.play() : o.vars.initDelay > 0 ? setTimeout(o.play, o.vars.initDelay) : o.play()
                                })
                            }
                        },
                        isHidden: function() {
                            var t = g.pauseInvisible.getHiddenProp();
                            return t ? document[t] : !1
                        },
                        getHiddenProp: function() {
                            var t = ["webkit", "moz", "ms", "o"];
                            if ("hidden" in document) return "hidden";
                            for (var e = 0; e < t.length; e++) if (t[e] + "Hidden" in document) return t[e] + "Hidden";
                            return null
                        }
                    },
                    setToClearWatchedEvent: function() {
                        clearTimeout(a),
                        a = setTimeout(function() {
                            u = ""
                        },
                        3e3)
                    }
                },
                o.flexAnimate = function(t, e, i, s, a) {
                    if (o.vars.animationLoop || t === o.currentSlide || (o.direction = t > o.currentSlide ? "next": "prev"), v && 1 === o.pagingCount && (o.direction = o.currentItem < t ? "next": "prev"), !o.animating && (o.canAdvance(t, a) || i) && o.is(":visible")) {
                        if (v && s) {
                            var l = n(o.vars.asNavFor).data("flexslider");
                            if (o.atEnd = 0 === t || t === o.count - 1, l.flexAnimate(t, !0, !1, !0, a), o.direction = o.currentItem < t ? "next": "prev", l.direction = o.direction, Math.ceil((t + 1) / o.visible) - 1 === o.currentSlide || 0 === t) return o.currentItem = t,
                            o.slides.removeClass(r + "active-slide").eq(t).addClass(r + "active-slide"),
                            !1;
                            o.currentItem = t,
                            o.slides.removeClass(r + "active-slide").eq(t).addClass(r + "active-slide"),
                            t = Math.floor(t / o.visible)
                        }
                        if (o.animating = !0, o.animatingTo = t, e && o.pause(), o.vars.before(o), o.syncExists && !a && g.sync("animate"), o.vars.controlNav && g.controlNav.active(), m || o.slides.removeClass(r + "active-slide").eq(t).addClass(r + "active-slide"), o.atEnd = 0 === t || t === o.last, o.vars.directionNav && g.directionNav.update(), t === o.last && (o.vars.end(o), o.vars.animationLoop || o.pause()), f) c ? (o.slides.eq(o.currentSlide).css({
                            opacity: 0,
                            zIndex: 1
                        }), o.slides.eq(t).css({
                            opacity: 1,
                            zIndex: 2
                        }), o.wrapup(y)) : (o.slides.eq(o.currentSlide).css({
                            zIndex: 1
                        }).animate({
                            opacity: 0
                        },
                        o.vars.animationSpeed, o.vars.easing), o.slides.eq(t).css({
                            zIndex: 2
                        }).animate({
                            opacity: 1
                        },
                        o.vars.animationSpeed, o.vars.easing, o.wrapup));
                        else {
                            var h, u, w, y = d ? o.slides.filter(":first").height() : o.computedW;
                            m ? (h = o.vars.itemMargin, w = (o.itemW + h) * o.move * o.animatingTo, u = w > o.limit && 1 !== o.visible ? o.limit: w) : u = 0 === o.currentSlide && t === o.count - 1 && o.vars.animationLoop && "next" !== o.direction ? p ? (o.count + o.cloneOffset) * y: 0 : o.currentSlide === o.last && 0 === t && o.vars.animationLoop && "prev" !== o.direction ? p ? 0 : (o.count + 1) * y: p ? (o.count - 1 - t + o.cloneOffset) * y: (t + o.cloneOffset) * y,
                            o.setProps(u, "", o.vars.animationSpeed),
                            o.transitions ? (o.vars.animationLoop && o.atEnd || (o.animating = !1, o.currentSlide = o.animatingTo), o.container.unbind("webkitTransitionEnd transitionend"), o.container.bind("webkitTransitionEnd transitionend",
                            function() {
                                clearTimeout(o.ensureAnimationEnd),
                                o.wrapup(y)
                            }), clearTimeout(o.ensureAnimationEnd), o.ensureAnimationEnd = setTimeout(function() {
                                o.wrapup(y)
                            },
                            o.vars.animationSpeed + 100)) : o.container.animate(o.args, o.vars.animationSpeed, o.vars.easing,
                            function() {
                                o.wrapup(y)
                            })
                        }
                        o.vars.smoothHeight && g.smoothHeight(o.vars.animationSpeed)
                    }
                },
                o.wrapup = function(t) {
                    f || m || (0 === o.currentSlide && o.animatingTo === o.last && o.vars.animationLoop ? o.setProps(t, "jumpEnd") : o.currentSlide === o.last && 0 === o.animatingTo && o.vars.animationLoop && o.setProps(t, "jumpStart")),
                    o.animating = !1,
                    o.currentSlide = o.animatingTo,
                    o.vars.after(o)
                },
                o.animateSlides = function() { ! o.animating && s && o.flexAnimate(o.getTarget("next"))
                },
                o.pause = function() {
                    clearInterval(o.animatedSlides),
                    o.animatedSlides = null,
                    o.playing = !1,
                    o.vars.pausePlay && g.pausePlay.update("play"),
                    o.syncExists && g.sync("pause")
                },
                o.play = function() {
                    o.playing && clearInterval(o.animatedSlides),
                    o.animatedSlides = o.animatedSlides || setInterval(o.animateSlides, o.vars.slideshowSpeed),
                    o.started = o.playing = !0,
                    o.vars.pausePlay && g.pausePlay.update("pause"),
                    o.syncExists && g.sync("play")
                },
                o.stop = function() {
                    o.pause(),
                    o.stopped = !0
                },
                o.canAdvance = function(t, e) {
                    var i = v ? o.pagingCount - 1 : o.last;
                    return e ? !0 : v && o.currentItem === o.count - 1 && 0 === t && "prev" === o.direction ? !0 : v && 0 === o.currentItem && t === o.pagingCount - 1 && "next" !== o.direction ? !1 : t !== o.currentSlide || v ? o.vars.animationLoop ? !0 : o.atEnd && 0 === o.currentSlide && t === i && "next" !== o.direction ? !1 : !o.atEnd || o.currentSlide !== i || 0 !== t || "next" !== o.direction: !1
                },
                o.getTarget = function(t) {
                    return o.direction = t,
                    "next" === t ? o.currentSlide === o.last ? 0 : o.currentSlide + 1 : 0 === o.currentSlide ? o.last: o.currentSlide - 1
                },
                o.setProps = function(t, e, i) {
                    var n = function() {
                        var i = t ? t: (o.itemW + o.vars.itemMargin) * o.move * o.animatingTo,
                        n = function() {
                            if (m) return "setTouch" === e ? t: p && o.animatingTo === o.last ? 0 : p ? o.limit - (o.itemW + o.vars.itemMargin) * o.move * o.animatingTo: o.animatingTo === o.last ? o.limit: i;
                            switch (e) {
                            case "setTotal":
                                return p ? (o.count - 1 - o.currentSlide + o.cloneOffset) * t: (o.currentSlide + o.cloneOffset) * t;
                            case "setTouch":
                                return p ? t: t;
                            case "jumpEnd":
                                return p ? t: o.count * t;
                            case "jumpStart":
                                return p ? o.count * t: t;
                            default:
                                return t
                            }
                        } ();
                        return - 1 * n + "px"
                    } ();
                    o.transitions && (n = d ? "translate3d(0," + n + ",0)": "translate3d(" + n + ",0,0)", i = void 0 !== i ? i / 1e3 + "s": "0s", o.container.css("-" + o.pfx + "-transition-duration", i), o.container.css("transition-duration", i)),
                    o.args[o.prop] = n,
                    (o.transitions || void 0 === i) && o.container.css(o.args),
                    o.container.css("transform", n)
                },
                o.setup = function(t) {
                    if (f) o.slides.css({
                        width: "100%",
                        "float": "left",
                        marginRight: "-100%",
                        position: "relative"
                    }),
                    "init" === t && (c ? o.slides.css({
                        opacity: 0,
                        display: "block",
                        webkitTransition: "opacity " + o.vars.animationSpeed / 1e3 + "s ease",
                        zIndex: 1
                    }).eq(o.currentSlide).css({
                        opacity: 1,
                        zIndex: 2
                    }) : 0 == o.vars.fadeFirstSlide ? o.slides.css({
                        opacity: 0,
                        display: "block",
                        zIndex: 1
                    }).eq(o.currentSlide).css({
                        zIndex: 2
                    }).css({
                        opacity: 1
                    }) : o.slides.css({
                        opacity: 0,
                        display: "block",
                        zIndex: 1
                    }).eq(o.currentSlide).css({
                        zIndex: 2
                    }).animate({
                        opacity: 1
                    },
                    o.vars.animationSpeed, o.vars.easing)),
                    o.vars.smoothHeight && g.smoothHeight();
                    else {
                        var e, i;
                        "init" === t && (o.viewport = n('<div class="' + r + 'viewport"></div>').css({
                            overflow: "hidden",
                            position: "relative"
                        }).appendTo(o).append(o.container), o.cloneCount = 0, o.cloneOffset = 0, p && (i = n.makeArray(o.slides).reverse(), o.slides = n(i), o.container.empty().append(o.slides))),
                        o.vars.animationLoop && !m && (o.cloneCount = 2, o.cloneOffset = 1, "init" !== t && o.container.find(".clone").remove(), o.container.append(g.uniqueID(o.slides.first().clone().addClass("clone")).attr("aria-hidden", "true")).prepend(g.uniqueID(o.slides.last().clone().addClass("clone")).attr("aria-hidden", "true"))),
                        o.newSlides = n(o.vars.selector, o),
                        e = p ? o.count - 1 - o.currentSlide + o.cloneOffset: o.currentSlide + o.cloneOffset,
                        d && !m ? (o.container.height(200 * (o.count + o.cloneCount) + "%").css("position", "absolute").width("100%"), setTimeout(function() {
                            o.newSlides.css({
                                display: "block"
                            }),
                            o.doMath(),
                            o.viewport.height(o.h),
                            o.setProps(e * o.h, "init")
                        },
                        "init" === t ? 100 : 0)) : (o.container.width(200 * (o.count + o.cloneCount) + "%"), o.setProps(e * o.computedW, "init"), setTimeout(function() {
                            o.doMath(),
                            o.newSlides.css({
                                width: o.computedW,
                                marginRight: o.computedM,
                                "float": "left",
                                display: "block"
                            }),
                            o.vars.smoothHeight && g.smoothHeight()
                        },
                        "init" === t ? 100 : 0))
                    }
                    m || o.slides.removeClass(r + "active-slide").eq(o.currentSlide).addClass(r + "active-slide"),
                    o.vars.init(o)
                },
                o.doMath = function() {
                    var t = o.slides.first(),
                    e = o.vars.itemMargin,
                    i = o.vars.minItems,
                    n = o.vars.maxItems;
                    o.w = void 0 === o.viewport ? o.width() : o.viewport.width(),
                    o.h = t.height(),
                    o.boxPadding = t.outerWidth() - t.width(),
                    m ? (o.itemT = o.vars.itemWidth + e, o.itemM = e, o.minW = i ? i * o.itemT: o.w, o.maxW = n ? n * o.itemT - e: o.w, o.itemW = o.minW > o.w ? (o.w - e * (i - 1)) / i: o.maxW < o.w ? (o.w - e * (n - 1)) / n: o.vars.itemWidth > o.w ? o.w: o.vars.itemWidth, o.visible = Math.floor(o.w / o.itemW), o.move = o.vars.move > 0 && o.vars.move < o.visible ? o.vars.move: o.visible, o.pagingCount = Math.ceil((o.count - o.visible) / o.move + 1), o.last = o.pagingCount - 1, o.limit = 1 === o.pagingCount ? 0 : o.vars.itemWidth > o.w ? o.itemW * (o.count - 1) + e * (o.count - 1) : (o.itemW + e) * o.count - o.w - e) : (o.itemW = o.w, o.itemM = e, o.pagingCount = o.count, o.last = o.count - 1),
                    o.computedW = o.itemW - o.boxPadding,
                    o.computedM = o.itemM
                },
                o.update = function(t, e) {
                    o.doMath(),
                    m || (t < o.currentSlide ? o.currentSlide += 1 : t <= o.currentSlide && 0 !== t && (o.currentSlide -= 1), o.animatingTo = o.currentSlide),
                    o.vars.controlNav && !o.manualControls && ("add" === e && !m || o.pagingCount > o.controlNav.length ? g.controlNav.update("add") : ("remove" === e && !m || o.pagingCount < o.controlNav.length) && (m && o.currentSlide > o.last && (o.currentSlide -= 1, o.animatingTo -= 1), g.controlNav.update("remove", o.last))),
                    o.vars.directionNav && g.directionNav.update()
                },
                o.addSlide = function(t, e) {
                    var i = n(t);
                    o.count += 1,
                    o.last = o.count - 1,
                    d && p ? void 0 !== e ? o.slides.eq(o.count - e).after(i) : o.container.prepend(i) : void 0 !== e ? o.slides.eq(e).before(i) : o.container.append(i),
                    o.update(e, "add"),
                    o.slides = n(o.vars.selector + ":not(.clone)", o),
                    o.setup(),
                    o.vars.added(o)
                },
                o.removeSlide = function(t) {
                    var e = isNaN(t) ? o.slides.index(n(t)) : t;
                    o.count -= 1,
                    o.last = o.count - 1,
                    isNaN(t) ? n(t, o.slides).remove() : d && p ? o.slides.eq(o.last).remove() : o.slides.eq(t).remove(),
                    o.doMath(),
                    o.update(e, "remove"),
                    o.slides = n(o.vars.selector + ":not(.clone)", o),
                    o.setup(),
                    o.vars.removed(o)
                },
                g.init()
            },
            n(window).blur(function(t) {
                s = !1
            }).focus(function(t) {
                s = !0
            }),
            n.flexslider.defaults = {
                namespace: "am-",
                selector: ".am-slides > li",
                animation: "slide",
                easing: "swing",
                direction: "horizontal",
                reverse: !1,
                animationLoop: !0,
                smoothHeight: !1,
                startAt: 0,
                slideshow: !0,
                slideshowSpeed: 5e3,
                animationSpeed: 600,
                initDelay: 0,
                randomize: !1,
                fadeFirstSlide: !0,
                thumbCaptions: !1,
                pauseOnAction: !0,
                pauseOnHover: !1,
                pauseInvisible: !0,
                useCSS: !0,
                touch: !0,
                video: !1,
                controlNav: !0,
                directionNav: !0,
                prevText: " ",
                nextText: " ",
                keyboard: !0,
                multipleKeyboard: !1,
                mousewheel: !1,
                pausePlay: !1,
                pauseText: "Pause",
                playText: "Play",
                controlsContainer: "",
                manualControls: "",
                customDirectionNav: "",
                sync: "",
                asNavFor: "",
                itemWidth: 0,
                itemMargin: 0,
                minItems: 1,
                maxItems: 0,
                move: 0,
                allowOneSlide: !0,
                start: function() {},
                before: function() {},
                after: function() {},
                end: function() {},
                added: function() {},
                removed: function() {},
                init: function() {}
            },
            n.fn.flexslider = function(t) {
                var e = Array.prototype.slice.call(arguments, 1);
                if (void 0 === t && (t = {}), "object" == typeof t) return this.each(function() {
                    var e = n(this),
                    i = t.selector ? t.selector: ".am-slides > li",
                    o = e.find(i);
                    1 === o.length && t.allowOneSlide === !0 || 0 === o.length ? (o.fadeIn(400), t.start && t.start(e)) : void 0 === e.data("flexslider") && new n.flexslider(this, t)
                });
                var i, o = n(this).data("flexslider");
                switch (t) {
                case "next":
                    o.flexAnimate(o.getTarget("next"), !0);
                    break;
                case "prev":
                case "previous":
                    o.flexAnimate(o.getTarget("prev"), !0);
                    break;
                default:
                    "number" == typeof t ? o.flexAnimate(t, !0) : "string" == typeof t && (i = "function" == typeof o[t] ? o[t].apply(o, e) : o[t])
                }
                return void 0 === i ? this: i
            },
            o.ready(function(t) {
                n("[data-am-flexslider]", t).each(function(t, e) {
                    var i = n(e),
                    s = o.utils.parseOptions(i.data("amFlexslider"));
                    s.before = function(t) {
                        t._pausedTimer && (window.clearTimeout(t._pausedTimer), t._pausedTimer = null)
                    },
                    s.after = function(t) {
                        var e = t.vars.playAfterPaused; ! e || isNaN(e) || t.playing || t.manualPause || t.manualPlay || t.stopped || (t._pausedTimer = window.setTimeout(function() {
                            t.play()
                        },
                        e))
                    },
                    i.flexslider(s)
                })
            }),
            t.exports = n.flexslider
        }).call(e, i(12).setImmediate)
    },
    function(t, e, i) { (function(t, n) {
            function o(t, e) {
                this._id = t,
                this._clearFn = e
            }
            var s = i(13).nextTick,
            a = Function.prototype.apply,
            r = Array.prototype.slice,
            l = {},
            c = 0;
            e.setTimeout = function() {
                return new o(a.call(setTimeout, window, arguments), clearTimeout)
            },
            e.setInterval = function() {
                return new o(a.call(setInterval, window, arguments), clearInterval)
            },
            e.clearTimeout = e.clearInterval = function(t) {
                t.close()
            },
            o.prototype.unref = o.prototype.ref = function() {},
            o.prototype.close = function() {
                this._clearFn.call(window, this._id)
            },
            e.enroll = function(t, e) {
                clearTimeout(t._idleTimeoutId),
                t._idleTimeout = e
            },
            e.unenroll = function(t) {
                clearTimeout(t._idleTimeoutId),
                t._idleTimeout = -1
            },
            e._unrefActive = e.active = function(t) {
                clearTimeout(t._idleTimeoutId);
                var e = t._idleTimeout;
                e >= 0 && (t._idleTimeoutId = setTimeout(function() {
                    t._onTimeout && t._onTimeout()
                },
                e))
            },
            e.setImmediate = "function" == typeof t ? t: function(t) {
                var i = c++,
                n = arguments.length < 2 ? !1 : r.call(arguments, 1);
                return l[i] = !0,
                s(function() {
                    l[i] && (n ? t.apply(null, n) : t.call(null), e.clearImmediate(i))
                }),
                i
            },
            e.clearImmediate = "function" == typeof n ? n: function(t) {
                delete l[t]
            }
        }).call(e, i(12).setImmediate, i(12).clearImmediate)
    },
    function(t, e) {
        function i() {
            c = !1,
            a.length ? l = a.concat(l) : h = -1,
            l.length && n()
        }
        function n() {
            if (!c) {
                var t = setTimeout(i);
                c = !0;
                for (var e = l.length; e;) {
                    for (a = l, l = []; ++h < e;) a && a[h].run();
                    h = -1,
                    e = l.length
                }
                a = null,
                c = !1,
                clearTimeout(t)
            }
        }
        function o(t, e) {
            this.fun = t,
            this.array = e
        }
        function s() {}
        var a, r = t.exports = {},
        l = [],
        c = !1,
        h = -1;
        r.nextTick = function(t) {
            var e = new Array(arguments.length - 1);
            if (arguments.length > 1) for (var i = 1; i < arguments.length; i++) e[i - 1] = arguments[i];
            l.push(new o(t, e)),
            1 !== l.length || c || setTimeout(n, 0)
        },
        o.prototype.run = function() {
            this.fun.apply(null, this.array)
        },
        r.title = "browser",
        r.browser = !0,
        r.env = {},
        r.argv = [],
        r.version = "",
        r.versions = {},
        r.on = s,
        r.addListener = s,
        r.once = s,
        r.off = s,
        r.removeListener = s,
        r.removeAllListeners = s,
        r.emit = s,
        r.binding = function(t) {
            throw new Error("process.binding is not supported")
        },
        r.cwd = function() {
            return "/"
        },
        r.chdir = function(t) {
            throw new Error("process.chdir is not supported")
        },
        r.umask = function() {
            return 0
        }
    },
    function(t, e, i) {
        "use strict";
        function n(t, e) {
            this.wrapper = "string" == typeof t ? document.querySelector(t) : t,
            this.scroller = this.wrapper.children[0],
            this.scrollerStyle = this.scroller.style,
            this.options = {
                startX: 0,
                startY: 0,
                scrollY: !0,
                directionLockThreshold: 5,
                momentum: !0,
                bounce: !0,
                bounceTime: 600,
                bounceEasing: "",
                preventDefault: !0,
                preventDefaultException: {
                    tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
                },
                HWCompositing: !0,
                useTransition: !0,
                useTransform: !0
            };
            for (var i in e) this.options[i] = e[i];
            this.translateZ = this.options.HWCompositing && a.hasPerspective ? " translateZ(0)": "",
            this.options.useTransition = a.hasTransition && this.options.useTransition,
            this.options.useTransform = a.hasTransform && this.options.useTransform,
            this.options.eventPassthrough = this.options.eventPassthrough === !0 ? "vertical": this.options.eventPassthrough,
            this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault,
            this.options.scrollY = "vertical" == this.options.eventPassthrough ? !1 : this.options.scrollY,
            this.options.scrollX = "horizontal" == this.options.eventPassthrough ? !1 : this.options.scrollX,
            this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough,
            this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold,
            this.options.bounceEasing = "string" == typeof this.options.bounceEasing ? a.ease[this.options.bounceEasing] || a.ease.circular: this.options.bounceEasing,
            this.options.resizePolling = void 0 === this.options.resizePolling ? 60 : this.options.resizePolling,
            this.options.tap === !0 && (this.options.tap = "tap"),
            this.x = 0,
            this.y = 0,
            this.directionX = 0,
            this.directionY = 0,
            this._events = {},
            this._init(),
            this.refresh(),
            this.scrollTo(this.options.startX, this.options.startY),
            this.enable()
        }
        var o = i(2),
        s = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(t) {
            window.setTimeout(t, 1e3 / 60)
        },
        a = function() {
            function t(t) {
                return n === !1 ? !1 : "" === n ? t: n + t.charAt(0).toUpperCase() + t.substr(1)
            }
            var e = {},
            i = document.createElement("div").style,
            n = function() {
                for (var t, e = ["t", "webkitT", "MozT", "msT", "OT"], n = 0, o = e.length; o > n; n++) if (t = e[n] + "ransform", t in i) return e[n].substr(0, e[n].length - 1);
                return ! 1
            } ();
            e.getTime = Date.now ||
            function() {
                return (new Date).getTime()
            },
            e.extend = function(t, e) {
                for (var i in e) t[i] = e[i]
            },
            e.addEvent = function(t, e, i, n) {
                t.addEventListener(e, i, !!n)
            },
            e.removeEvent = function(t, e, i, n) {
                t.removeEventListener(e, i, !!n)
            },
            e.prefixPointerEvent = function(t) {
                return window.MSPointerEvent ? "MSPointer" + t.charAt(9).toUpperCase() + t.substr(10) : t
            },
            e.momentum = function(t, e, i, n, o, s) {
                var a, r, l = t - e,
                c = Math.abs(l) / i;
                return s = void 0 === s ? 6e-4: s,
                a = t + c * c / (2 * s) * (0 > l ? -1 : 1),
                r = c / s,
                n > a ? (a = o ? n - o / 2.5 * (c / 8) : n, l = Math.abs(a - t), r = l / c) : a > 0 && (a = o ? o / 2.5 * (c / 8) : 0, l = Math.abs(t) + a, r = l / c),
                {
                    destination: Math.round(a),
                    duration: r
                }
            };
            var o = t("transform");
            return e.extend(e, {
                hasTransform: o !== !1,
                hasPerspective: t("perspective") in i,
                hasTouch: "ontouchstart" in window,
                hasPointer: window.PointerEvent || window.MSPointerEvent,
                hasTransition: t("transition") in i
            }),
            e.isBadAndroid = /Android /.test(window.navigator.appVersion) && !/Chrome\/\d/.test(window.navigator.appVersion),
            e.extend(e.style = {},
            {
                transform: o,
                transitionTimingFunction: t("transitionTimingFunction"),
                transitionDuration: t("transitionDuration"),
                transitionDelay: t("transitionDelay"),
                transformOrigin: t("transformOrigin")
            }),
            e.hasClass = function(t, e) {
                var i = new RegExp("(^|\\s)" + e + "(\\s|$)");
                return i.test(t.className)
            },
            e.addClass = function(t, i) {
                if (!e.hasClass(t, i)) {
                    var n = t.className.split(" ");
                    n.push(i),
                    t.className = n.join(" ")
                }
            },
            e.removeClass = function(t, i) {
                if (e.hasClass(t, i)) {
                    var n = new RegExp("(^|\\s)" + i + "(\\s|$)", "g");
                    t.className = t.className.replace(n, " ")
                }
            },
            e.offset = function(t) {
                for (var e = -t.offsetLeft,
                i = -t.offsetTop; t = t.offsetParent;) e -= t.offsetLeft,
                i -= t.offsetTop;
                return {
                    left: e,
                    top: i
                }
            },
            e.preventDefaultException = function(t, e) {
                for (var i in e) if (e[i].test(t[i])) return ! 0;
                return ! 1
            },
            e.extend(e.eventType = {},
            {
                touchstart: 1,
                touchmove: 1,
                touchend: 1,
                mousedown: 2,
                mousemove: 2,
                mouseup: 2,
                pointerdown: 3,
                pointermove: 3,
                pointerup: 3,
                MSPointerDown: 3,
                MSPointerMove: 3,
                MSPointerUp: 3
            }),
            e.extend(e.ease = {},
            {
                quadratic: {
                    style: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    fn: function(t) {
                        return t * (2 - t)
                    }
                },
                circular: {
                    style: "cubic-bezier(0.1, 0.57, 0.1, 1)",
                    fn: function(t) {
                        return Math.sqrt(1 - --t * t)
                    }
                },
                back: {
                    style: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    fn: function(t) {
                        var e = 4;
                        return (t -= 1) * t * ((e + 1) * t + e) + 1
                    }
                },
                bounce: {
                    style: "",
                    fn: function(t) {
                        return (t /= 1) < 1 / 2.75 ? 7.5625 * t * t: 2 / 2.75 > t ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : 2.5 / 2.75 > t ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
                    }
                },
                elastic: {
                    style: "",
                    fn: function(t) {
                        var e = .22,
                        i = .4;
                        return 0 === t ? 0 : 1 == t ? 1 : i * Math.pow(2, -10 * t) * Math.sin((t - e / 4) * (2 * Math.PI) / e) + 1
                    }
                }
            }),
            e.tap = function(t, e) {
                var i = document.createEvent("Event");
                i.initEvent(e, !0, !0),
                i.pageX = t.pageX,
                i.pageY = t.pageY,
                t.target.dispatchEvent(i)
            },
            e.click = function(t) {
                var e, i = t.target;
                /(SELECT|INPUT|TEXTAREA)/i.test(i.tagName) || (e = document.createEvent("MouseEvents"), e.initMouseEvent("click", !0, !0, t.view, 1, i.screenX, i.screenY, i.clientX, i.clientY, t.ctrlKey, t.altKey, t.shiftKey, t.metaKey, 0, null), e._constructed = !0, i.dispatchEvent(e))
            },
            e
        } ();
        n.prototype = {
            version: "5.1.3",
            _init: function() {
                this._initEvents()
            },
            destroy: function() {
                this._initEvents(!0),
                this._execEvent("destroy")
            },
            _transitionEnd: function(t) {
                t.target == this.scroller && this.isInTransition && (this._transitionTime(), this.resetPosition(this.options.bounceTime) || (this.isInTransition = !1, this._execEvent("scrollEnd")))
            },
            _start: function(t) {
                if ((1 == a.eventType[t.type] || 0 === t.button) && this.enabled && (!this.initiated || a.eventType[t.type] === this.initiated)) { ! this.options.preventDefault || a.isBadAndroid || a.preventDefaultException(t.target, this.options.preventDefaultException) || t.preventDefault();
                    var e, i = t.touches ? t.touches[0] : t;
                    this.initiated = a.eventType[t.type],
                    this.moved = !1,
                    this.distX = 0,
                    this.distY = 0,
                    this.directionX = 0,
                    this.directionY = 0,
                    this.directionLocked = 0,
                    this._transitionTime(),
                    this.startTime = a.getTime(),
                    this.options.useTransition && this.isInTransition ? (this.isInTransition = !1, e = this.getComputedPosition(), this._translate(Math.round(e.x), Math.round(e.y)), this._execEvent("scrollEnd")) : !this.options.useTransition && this.isAnimating && (this.isAnimating = !1, this._execEvent("scrollEnd")),
                    this.startX = this.x,
                    this.startY = this.y,
                    this.absStartX = this.x,
                    this.absStartY = this.y,
                    this.pointX = i.pageX,
                    this.pointY = i.pageY,
                    this._execEvent("beforeScrollStart")
                }
            },
            _move: function(t) {
                if (this.enabled && a.eventType[t.type] === this.initiated) {
                    this.options.preventDefault && t.preventDefault();
                    var e, i, n, o, s = t.touches ? t.touches[0] : t,
                    r = s.pageX - this.pointX,
                    l = s.pageY - this.pointY,
                    c = a.getTime();
                    if (this.pointX = s.pageX, this.pointY = s.pageY, this.distX += r, this.distY += l, n = Math.abs(this.distX), o = Math.abs(this.distY), !(c - this.endTime > 300 && 10 > n && 10 > o)) {
                        if (this.directionLocked || this.options.freeScroll || (n > o + this.options.directionLockThreshold ? this.directionLocked = "h": o >= n + this.options.directionLockThreshold ? this.directionLocked = "v": this.directionLocked = "n"), "h" == this.directionLocked) {
                            if ("vertical" == this.options.eventPassthrough) t.preventDefault();
                            else if ("horizontal" == this.options.eventPassthrough) return void(this.initiated = !1);
                            l = 0
                        } else if ("v" == this.directionLocked) {
                            if ("horizontal" == this.options.eventPassthrough) t.preventDefault();
                            else if ("vertical" == this.options.eventPassthrough) return void(this.initiated = !1);
                            r = 0
                        }
                        r = this.hasHorizontalScroll ? r: 0,
                        l = this.hasVerticalScroll ? l: 0,
                        e = this.x + r,
                        i = this.y + l,
                        (e > 0 || e < this.maxScrollX) && (e = this.options.bounce ? this.x + r / 3 : e > 0 ? 0 : this.maxScrollX),
                        (i > 0 || i < this.maxScrollY) && (i = this.options.bounce ? this.y + l / 3 : i > 0 ? 0 : this.maxScrollY),
                        this.directionX = r > 0 ? -1 : 0 > r ? 1 : 0,
                        this.directionY = l > 0 ? -1 : 0 > l ? 1 : 0,
                        this.moved || this._execEvent("scrollStart"),
                        this.moved = !0,
                        this._translate(e, i),
                        c - this.startTime > 300 && (this.startTime = c, this.startX = this.x, this.startY = this.y)
                    }
                }
            },
            _end: function(t) {
                if (this.enabled && a.eventType[t.type] === this.initiated) {
                    this.options.preventDefault && !a.preventDefaultException(t.target, this.options.preventDefaultException) && t.preventDefault();
                    var e, i, n = (t.changedTouches ? t.changedTouches[0] : t, a.getTime() - this.startTime),
                    o = Math.round(this.x),
                    s = Math.round(this.y),
                    r = Math.abs(o - this.startX),
                    l = Math.abs(s - this.startY),
                    c = 0,
                    h = "";
                    if (this.isInTransition = 0, this.initiated = 0, this.endTime = a.getTime(), !this.resetPosition(this.options.bounceTime)) return this.scrollTo(o, s),
                    this.moved ? this._events.flick && 200 > n && 100 > r && 100 > l ? void this._execEvent("flick") : (this.options.momentum && 300 > n && (e = this.hasHorizontalScroll ? a.momentum(this.x, this.startX, n, this.maxScrollX, this.options.bounce ? this.wrapperWidth: 0, this.options.deceleration) : {
                        destination: o,
                        duration: 0
                    },
                    i = this.hasVerticalScroll ? a.momentum(this.y, this.startY, n, this.maxScrollY, this.options.bounce ? this.wrapperHeight: 0, this.options.deceleration) : {
                        destination: s,
                        duration: 0
                    },
                    o = e.destination, s = i.destination, c = Math.max(e.duration, i.duration), this.isInTransition = 1), o != this.x || s != this.y ? ((o > 0 || o < this.maxScrollX || s > 0 || s < this.maxScrollY) && (h = a.ease.quadratic), void this.scrollTo(o, s, c, h)) : void this._execEvent("scrollEnd")) : (this.options.tap && a.tap(t, this.options.tap), this.options.click && a.click(t), void this._execEvent("scrollCancel"))
                }
            },
            _resize: function() {
                var t = this;
                clearTimeout(this.resizeTimeout),
                this.resizeTimeout = setTimeout(function() {
                    t.refresh()
                },
                this.options.resizePolling)
            },
            resetPosition: function(t) {
                var e = this.x,
                i = this.y;
                return t = t || 0,
                !this.hasHorizontalScroll || this.x > 0 ? e = 0 : this.x < this.maxScrollX && (e = this.maxScrollX),
                !this.hasVerticalScroll || this.y > 0 ? i = 0 : this.y < this.maxScrollY && (i = this.maxScrollY),
                e == this.x && i == this.y ? !1 : (this.scrollTo(e, i, t, this.options.bounceEasing), !0)
            },
            disable: function() {
                this.enabled = !1
            },
            enable: function() {
                this.enabled = !0
            },
            refresh: function() {
                this.wrapper.offsetHeight;
                this.wrapperWidth = this.wrapper.clientWidth,
                this.wrapperHeight = this.wrapper.clientHeight,
                this.scrollerWidth = this.scroller.offsetWidth,
                this.scrollerHeight = this.scroller.offsetHeight,
                this.maxScrollX = this.wrapperWidth - this.scrollerWidth,
                this.maxScrollY = this.wrapperHeight - this.scrollerHeight,
                this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0,
                this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0,
                this.hasHorizontalScroll || (this.maxScrollX = 0, this.scrollerWidth = this.wrapperWidth),
                this.hasVerticalScroll || (this.maxScrollY = 0, this.scrollerHeight = this.wrapperHeight),
                this.endTime = 0,
                this.directionX = 0,
                this.directionY = 0,
                this.wrapperOffset = a.offset(this.wrapper),
                this._execEvent("refresh"),
                this.resetPosition()
            },
            on: function(t, e) {
                this._events[t] || (this._events[t] = []),
                this._events[t].push(e)
            },
            off: function(t, e) {
                if (this._events[t]) {
                    var i = this._events[t].indexOf(e);
                    i > -1 && this._events[t].splice(i, 1)
                }
            },
            _execEvent: function(t) {
                if (this._events[t]) {
                    var e = 0,
                    i = this._events[t].length;
                    if (i) for (; i > e; e++) this._events[t][e].apply(this, [].slice.call(arguments, 1))
                }
            },
            scrollBy: function(t, e, i, n) {
                t = this.x + t,
                e = this.y + e,
                i = i || 0,
                this.scrollTo(t, e, i, n)
            },
            scrollTo: function(t, e, i, n) {
                n = n || a.ease.circular,
                this.isInTransition = this.options.useTransition && i > 0,
                !i || this.options.useTransition && n.style ? (this._transitionTimingFunction(n.style), this._transitionTime(i), this._translate(t, e)) : this._animate(t, e, i, n.fn)
            },
            scrollToElement: function(t, e, i, n, o) {
                if (t = t.nodeType ? t: this.scroller.querySelector(t)) {
                    var s = a.offset(t);
                    s.left -= this.wrapperOffset.left,
                    s.top -= this.wrapperOffset.top,
                    i === !0 && (i = Math.round(t.offsetWidth / 2 - this.wrapper.offsetWidth / 2)),
                    n === !0 && (n = Math.round(t.offsetHeight / 2 - this.wrapper.offsetHeight / 2)),
                    s.left -= i || 0,
                    s.top -= n || 0,
                    s.left = s.left > 0 ? 0 : s.left < this.maxScrollX ? this.maxScrollX: s.left,
                    s.top = s.top > 0 ? 0 : s.top < this.maxScrollY ? this.maxScrollY: s.top,
                    e = void 0 === e || null === e || "auto" === e ? Math.max(Math.abs(this.x - s.left), Math.abs(this.y - s.top)) : e,
                    this.scrollTo(s.left, s.top, e, o)
                }
            },
            _transitionTime: function(t) {
                t = t || 0,
                this.scrollerStyle[a.style.transitionDuration] = t + "ms",
                !t && a.isBadAndroid && (this.scrollerStyle[a.style.transitionDuration] = "0.001s")
            },
            _transitionTimingFunction: function(t) {
                this.scrollerStyle[a.style.transitionTimingFunction] = t
            },
            _translate: function(t, e) {
                this.options.useTransform ? this.scrollerStyle[a.style.transform] = "translate(" + t + "px," + e + "px)" + this.translateZ: (t = Math.round(t), e = Math.round(e), this.scrollerStyle.left = t + "px", this.scrollerStyle.top = e + "px"),
                this.x = t,
                this.y = e
            },
            _initEvents: function(t) {
                var e = t ? a.removeEvent: a.addEvent,
                i = this.options.bindToWrapper ? this.wrapper: window;
                e(window, "orientationchange", this),
                e(window, "resize", this),
                this.options.click && e(this.wrapper, "click", this, !0),
                this.options.disableMouse || (e(this.wrapper, "mousedown", this), e(i, "mousemove", this), e(i, "mousecancel", this), e(i, "mouseup", this)),
                a.hasPointer && !this.options.disablePointer && (e(this.wrapper, a.prefixPointerEvent("pointerdown"), this), e(i, a.prefixPointerEvent("pointermove"), this), e(i, a.prefixPointerEvent("pointercancel"), this), e(i, a.prefixPointerEvent("pointerup"), this)),
                a.hasTouch && !this.options.disableTouch && (e(this.wrapper, "touchstart", this), e(i, "touchmove", this), e(i, "touchcancel", this), e(i, "touchend", this)),
                e(this.scroller, "transitionend", this),
                e(this.scroller, "webkitTransitionEnd", this),
                e(this.scroller, "oTransitionEnd", this),
                e(this.scroller, "MSTransitionEnd", this)
            },
            getComputedPosition: function() {
                var t, e, i = window.getComputedStyle(this.scroller, null);
                return this.options.useTransform ? (i = i[a.style.transform].split(")")[0].split(", "), t = +(i[12] || i[4]), e = +(i[13] || i[5])) : (t = +i.left.replace(/[^-\d.]/g, ""), e = +i.top.replace(/[^-\d.]/g, "")),
                {
                    x: t,
                    y: e
                }
            },
            _animate: function(t, e, i, n) {
                function o() {
                    var d, p, m, f = a.getTime();
                    return f >= u ? (r.isAnimating = !1, r._translate(t, e), void(r.resetPosition(r.options.bounceTime) || r._execEvent("scrollEnd"))) : (f = (f - h) / i, m = n(f), d = (t - l) * m + l, p = (e - c) * m + c, r._translate(d, p), void(r.isAnimating && s(o)))
                }
                var r = this,
                l = this.x,
                c = this.y,
                h = a.getTime(),
                u = h + i;
                this.isAnimating = !0,
                o()
            },
            handleEvent: function(t) {
                switch (t.type) {
                case "touchstart":
                case "pointerdown":
                case "MSPointerDown":
                case "mousedown":
                    this._start(t);
                    break;
                case "touchmove":
                case "pointermove":
                case "MSPointerMove":
                case "mousemove":
                    this._move(t);
                    break;
                case "touchend":
                case "pointerup":
                case "MSPointerUp":
                case "mouseup":
                case "touchcancel":
                case "pointercancel":
                case "MSPointerCancel":
                case "mousecancel":
                    this._end(t);
                    break;
                case "orientationchange":
                case "resize":
                    this._resize();
                    break;
                case "transitionend":
                case "webkitTransitionEnd":
                case "oTransitionEnd":
                case "MSTransitionEnd":
                    this._transitionEnd(t);
                    break;
                case "wheel":
                case "DOMMouseScroll":
                case "mousewheel":
                    this._wheel(t);
                    break;
                case "keydown":
                    this._key(t);
                    break;
                case "click":
                    t._constructed || (t.preventDefault(), t.stopPropagation())
                }
            }
        },
        n.utils = a,
        t.exports = o.iScroll = n
    },
    function(t, e, i) {
        "use strict";
        function n(t, e) {
            return this.each(function() {
                var i = o(this),
                n = i.data("amui.modal"),
                s = "object" == typeof t && t;
                n || i.data("amui.modal", n = new c(this, s)),
                "string" == typeof t ? n[t] && n[t](e) : n.toggle(t && t.relatedTarget || void 0)
            })
        }
        var o = i(1),
        s = i(2),
        a = i(9),
        r = o(document),
        l = s.support.transition,
        c = function(t, e) {
            this.options = o.extend({},
            c.DEFAULTS, e || {}),
            this.$element = o(t),
            this.$dialog = this.$element.find(".am-modal-dialog"),
            this.$element.attr("id") || this.$element.attr("id", s.utils.generateGUID("am-modal")),
            this.isPopup = this.$element.hasClass("am-popup"),
            this.isActions = this.$element.hasClass("am-modal-actions"),
            this.isPrompt = this.$element.hasClass("am-modal-prompt"),
            this.isLoading = this.$element.hasClass("am-modal-loading"),
            this.active = this.transitioning = this.relatedTarget = null,
            this.dimmer = this.options.dimmer ? a: {
                open: function() {},
                close: function() {}
            },
            this.events()
        };
        c.DEFAULTS = {
            className: {
                active: "am-modal-active",
                out: "am-modal-out"
            },
            selector: {
                modal: ".am-modal",
                active: ".am-modal-active"
            },
            closeViaDimmer: !0,
            cancelable: !0,
            onConfirm: function() {},
            onCancel: function() {},
            closeOnCancel: !0,
            closeOnConfirm: !0,
            dimmer: !0,
            height: void 0,
            width: void 0,
            duration: 300,
            transitionEnd: l && l.end + ".modal.amui"
        },
        c.prototype.toggle = function(t) {
            return this.active ? this.close() : this.open(t)
        },
        c.prototype.open = function(t) {
            var e = this.$element,
            i = this.options,
            n = this.isPopup,
            s = i.width,
            a = i.height,
            r = {};
            if (!this.active && this.$element.length) {
                t && (this.relatedTarget = t),
                this.transitioning && (clearTimeout(e.transitionEndTimmer), e.transitionEndTimmer = null, e.trigger(i.transitionEnd).off(i.transitionEnd)),
                n && this.$element.show(),
                this.active = !0,
                e.trigger(o.Event("open.modal.amui", {
                    relatedTarget: t
                })),
                this.dimmer.open(e),
                e.show().redraw(),
                n || this.isActions || (s && (r.width = parseInt(s, 10) + "px"), a && (r.height = parseInt(a, 10) + "px"), this.$dialog.css(r)),
                e.removeClass(i.className.out).addClass(i.className.active),
                this.transitioning = 1;
                var c = function() {
                    e.trigger(o.Event("opened.modal.amui", {
                        relatedTarget: t
                    })),
                    this.transitioning = 0,
                    this.isPrompt && this.$dialog.find("input").eq(0).focus()
                };
                return l ? void e.one(i.transitionEnd, o.proxy(c, this)).emulateTransitionEnd(i.duration) : c.call(this)
            }
        },
        c.prototype.close = function(t) {
            if (this.active) {
                var e = this.$element,
                i = this.options,
                n = this.isPopup;
                this.transitioning && (clearTimeout(e.transitionEndTimmer), e.transitionEndTimmer = null, e.trigger(i.transitionEnd).off(i.transitionEnd), this.dimmer.close(e, !0)),
                this.$element.trigger(o.Event("close.modal.amui", {
                    relatedTarget: t
                })),
                this.transitioning = 1;
                var s = function() {
                    e.trigger("closed.modal.amui"),
                    n && e.removeClass(i.className.out),
                    e.hide(),
                    this.transitioning = 0,
                    this.dimmer.close(e, !1),
                    this.active = !1
                };
                return e.removeClass(i.className.active).addClass(i.className.out),
                l ? void e.one(i.transitionEnd, o.proxy(s, this)).emulateTransitionEnd(i.duration) : s.call(this)
            }
        },
        c.prototype.events = function() {
            var t = this.options,
            e = this,
            i = this.$element,
            n = i.find(".am-modal-prompt-input"),
            s = i.find("[data-am-modal-confirm]"),
            a = i.find("[data-am-modal-cancel]"),
            r = function() {
                var t = [];
                return n.each(function() {
                    t.push(o(this).val())
                }),
                0 === t.length ? void 0 : 1 === t.length ? t[0] : t
            };
            this.options.cancelable && i.on("keyup.modal.amui",
            function(t) {
                e.active && 27 === t.which && (i.trigger("cancel.modal.amui"), e.close())
            }),
            this.options.dimmer && this.options.closeViaDimmer && !this.isLoading && this.dimmer.$element.on("click.dimmer.modal.amui",
            function(t) {
                e.close()
            }),
            i.on("click.close.modal.amui", "[data-am-modal-close], .am-modal-btn",
            function(i) {
                i.preventDefault();
                var n = o(this);
                n.is(s) ? t.closeOnConfirm && e.close() : n.is(a) ? t.closeOnCancel && e.close() : e.close()
            }),
            s.on("click.confirm.modal.amui",
            function() {
                i.trigger(o.Event("confirm.modal.amui", {
                    trigger: this
                }))
            }),
            a.on("click.cancel.modal.amui",
            function() {
                i.trigger(o.Event("cancel.modal.amui", {
                    trigger: this
                }))
            }),
            i.on("confirm.modal.amui",
            function(t) {
                t.data = r(),
                e.options.onConfirm.call(e, t)
            }).on("cancel.modal.amui",
            function(t) {
                t.data = r(),
                e.options.onCancel.call(e, t)
            })
        },
        o.fn.modal = n,
        r.on("click.modal.amui.data-api", "[data-am-modal]",
        function() {
            var t = o(this),
            e = s.utils.parseOptions(t.attr("data-am-modal")),
            i = o(e.target || this.href && this.href.replace(/.*(?=#[^\s]+$)/, "")),
            a = i.data("amui.modal") ? "toggle": e;
            n.call(i, a, this)
        }),
        t.exports = s.modal = c
    },
    function(t, e, i) {
        "use strict";
        function n(t, e) {
            var i = Array.prototype.slice.call(arguments, 1);
            return this.each(function() {
                var n = o(this),
                s = n.data("amui.offcanvas"),
                a = o.extend({},
                "object" == typeof t && t);
                s || (n.data("amui.offcanvas", s = new c(this, a)), (!t || "object" == typeof t) && s.open(e)),
                "string" == typeof t && s[t] && s[t].apply(s, i)
            })
        }
        var o = i(1),
        s = i(2);
        i(3);
        var a, r = o(window),
        l = o(document),
        c = function(t, e) {
            this.$element = o(t),
            this.options = o.extend({},
            c.DEFAULTS, e),
            this.active = null,
            this.bindEvents()
        };
        c.DEFAULTS = {
            duration: 300,
            effect: "overlay"
        },
        c.prototype.open = function(t) {
            var e = this,
            i = this.$element;
            if (i.length && !i.hasClass("am-active")) {
                var n = this.options.effect,
                s = o("html"),
                l = o("body"),
                c = i.find(".am-offcanvas-bar").first(),
                h = c.hasClass("am-offcanvas-bar-flip") ? -1 : 1;
                c.addClass("am-offcanvas-bar-" + n),
                a = {
                    x: window.scrollX,
                    y: window.scrollY
                },
                i.addClass("am-active"),
                l.css({
                    width: window.innerWidth,
                    height: r.height()
                }).addClass("am-offcanvas-page"),
                "overlay" !== n && l.css({
                    "margin-left": c.outerWidth() * h
                }).width(),
                s.css("margin-top", -1 * a.y),
                setTimeout(function() {
                    c.addClass("am-offcanvas-bar-active").width()
                },
                0),
                i.trigger("open.offcanvas.amui"),
                this.active = 1,
                i.on("click.offcanvas.amui",
                function(t) {
                    var i = o(t.target);
                    i.hasClass("am-offcanvas-bar") || i.parents(".am-offcanvas-bar").first().length || (t.stopImmediatePropagation(), e.close())
                }),
                s.on("keydown.offcanvas.amui",
                function(t) {
                    27 === t.keyCode && e.close()
                })
            }
        },
        c.prototype.close = function(t) {
            function e() {
                r.removeClass("am-offcanvas-page").css({
                    width: "",
                    height: "",
                    "margin-left": "",
                    "margin-right": ""
                }),
                l.removeClass("am-active"),
                c.removeClass("am-offcanvas-bar-active"),
                n.css("margin-top", ""),
                window.scrollTo(a.x, a.y),
                l.trigger("closed.offcanvas.amui"),
                i.active = 0
            }
            var i = this,
            n = o("html"),
            r = o("body"),
            l = this.$element,
            c = l.find(".am-offcanvas-bar").first();
            l.length && this.active && l.hasClass("am-active") && (l.trigger("close.offcanvas.amui"), s.support.transition ? (setTimeout(function() {
                c.removeClass("am-offcanvas-bar-active")
            },
            0), r.css("margin-left", "").one(s.support.transition.end,
            function() {
                e()
            }).emulateTransitionEnd(this.options.duration)) : e(), l.off("click.offcanvas.amui"), n.off(".offcanvas.amui"))
        },
        c.prototype.bindEvents = function() {
            var t = this;
            return l.on("click.offcanvas.amui", '[data-am-dismiss="offcanvas"]',
            function(e) {
                e.preventDefault(),
                t.close()
            }),
            r.on("resize.offcanvas.amui orientationchange.offcanvas.amui",
            function() {
                t.active && t.close()
            }),
            this.$element.hammer().on("swipeleft swipeleft",
            function(e) {
                e.preventDefault(),
                t.close()
            }),
            this
        },
        o.fn.offCanvas = n,
        l.on("click.offcanvas.amui", "[data-am-offcanvas]",
        function(t) {
            t.preventDefault();
            var e = o(this),
            i = s.utils.parseOptions(e.data("amOffcanvas")),
            a = o(i.target || this.href && this.href.replace(/.*(?=#[^\s]+$)/, "")),
            r = a.data("amui.offcanvas") ? "open": i;
            n.call(a, r, this)
        }),
        t.exports = s.offcanvas = c
    },
    function(t, e, i) {
        "use strict";
        var n = i(1),
        o = i(2),
        s = function(t) {
            var e = function(e, i) {
                this.el = t(e),
                this.zoomFactor = 1,
                this.lastScale = 1,
                this.offset = {
                    x: 0,
                    y: 0
                },
                this.options = t.extend({},
                this.defaults, i),
                this.setupMarkup(),
                this.bindEvents(),
                this.update(),
                this.enable()
            },
            i = function(t, e) {
                return t + e
            },
            n = function(t, e) {
                return t > e - .01 && e + .01 > t
            };
            e.prototype = {
                defaults: {
                    tapZoomFactor: 2,
                    zoomOutFactor: 1.3,
                    animationDuration: 300,
                    animationInterval: 5,
                    maxZoom: 5,
                    minZoom: .5,
                    lockDragAxis: !1,
                    use2d: !1,
                    zoomStartEventName: "pz_zoomstart",
                    zoomEndEventName: "pz_zoomend",
                    dragStartEventName: "pz_dragstart",
                    dragEndEventName: "pz_dragend",
                    doubleTapEventName: "pz_doubletap"
                },
                handleDragStart: function(t) {
                    this.el.trigger(this.options.dragStartEventName),
                    this.stopAnimation(),
                    this.lastDragPosition = !1,
                    this.hasInteraction = !0,
                    this.handleDrag(t)
                },
                handleDrag: function(t) {
                    if (this.zoomFactor > 1) {
                        var e = this.getTouches(t)[0];
                        this.drag(e, this.lastDragPosition),
                        this.offset = this.sanitizeOffset(this.offset),
                        this.lastDragPosition = e
                    }
                },
                handleDragEnd: function() {
                    this.el.trigger(this.options.dragEndEventName),
                    this.end()
                },
                handleZoomStart: function(t) {
                    this.el.trigger(this.options.zoomStartEventName),
                    this.stopAnimation(),
                    this.lastScale = 1,
                    this.nthZoom = 0,
                    this.lastZoomCenter = !1,
                    this.hasInteraction = !0
                },
                handleZoom: function(t, e) {
                    var i = this.getTouchCenter(this.getTouches(t)),
                    n = e / this.lastScale;
                    this.lastScale = e,
                    this.nthZoom += 1,
                    this.nthZoom > 3 && (this.scale(n, i), this.drag(i, this.lastZoomCenter)),
                    this.lastZoomCenter = i
                },
                handleZoomEnd: function() {
                    this.el.trigger(this.options.zoomEndEventName),
                    this.end()
                },
                handleDoubleTap: function(t) {
                    var e = this.getTouches(t)[0],
                    i = this.zoomFactor > 1 ? 1 : this.options.tapZoomFactor,
                    n = this.zoomFactor,
                    o = function(t) {
                        this.scaleTo(n + t * (i - n), e)
                    }.bind(this);
                    this.hasInteraction || (n > i && (e = this.getCurrentZoomCenter()), this.animate(this.options.animationDuration, this.options.animationInterval, o, this.swing), this.el.trigger(this.options.doubleTapEventName))
                },
                sanitizeOffset: function(t) {
                    var e = (this.zoomFactor - 1) * this.getContainerX(),
                    i = (this.zoomFactor - 1) * this.getContainerY(),
                    n = Math.max(e, 0),
                    o = Math.max(i, 0),
                    s = Math.min(e, 0),
                    a = Math.min(i, 0);
                    return {
                        x: Math.min(Math.max(t.x, s), n),
                        y: Math.min(Math.max(t.y, a), o)
                    }
                },
                scaleTo: function(t, e) {
                    this.scale(t / this.zoomFactor, e)
                },
                scale: function(t, e) {
                    t = this.scaleZoomFactor(t),
                    this.addOffset({
                        x: (t - 1) * (e.x + this.offset.x),
                        y: (t - 1) * (e.y + this.offset.y)
                    })
                },
                scaleZoomFactor: function(t) {
                    var e = this.zoomFactor;
                    return this.zoomFactor *= t,
                    this.zoomFactor = Math.min(this.options.maxZoom, Math.max(this.zoomFactor, this.options.minZoom)),
                    this.zoomFactor / e
                },
                drag: function(t, e) {
                    e && (this.options.lockDragAxis ? Math.abs(t.x - e.x) > Math.abs(t.y - e.y) ? this.addOffset({
                        x: -(t.x - e.x),
                        y: 0
                    }) : this.addOffset({
                        y: -(t.y - e.y),
                        x: 0
                    }) : this.addOffset({
                        y: -(t.y - e.y),
                        x: -(t.x - e.x)
                    }))
                },
                getTouchCenter: function(t) {
                    return this.getVectorAvg(t)
                },
                getVectorAvg: function(t) {
                    return {
                        x: t.map(function(t) {
                            return t.x
                        }).reduce(i) / t.length,
                        y: t.map(function(t) {
                            return t.y
                        }).reduce(i) / t.length
                    }
                },
                addOffset: function(t) {
                    this.offset = {
                        x: this.offset.x + t.x,
                        y: this.offset.y + t.y
                    }
                },
                sanitize: function() {
                    this.zoomFactor < this.options.zoomOutFactor ? this.zoomOutAnimation() : this.isInsaneOffset(this.offset) && this.sanitizeOffsetAnimation()
                },
                isInsaneOffset: function(t) {
                    var e = this.sanitizeOffset(t);
                    return e.x !== t.x || e.y !== t.y
                },
                sanitizeOffsetAnimation: function() {
                    var t = this.sanitizeOffset(this.offset),
                    e = {
                        x: this.offset.x,
                        y: this.offset.y
                    },
                    i = function(i) {
                        this.offset.x = e.x + i * (t.x - e.x),
                        this.offset.y = e.y + i * (t.y - e.y),
                        this.update()
                    }.bind(this);
                    this.animate(this.options.animationDuration, this.options.animationInterval, i, this.swing)
                },
                zoomOutAnimation: function() {
                    var t = this.zoomFactor,
                    e = 1,
                    i = this.getCurrentZoomCenter(),
                    n = function(n) {
                        this.scaleTo(t + n * (e - t), i)
                    }.bind(this);
                    this.animate(this.options.animationDuration, this.options.animationInterval, n, this.swing)
                },
                updateAspectRatio: function() {
                    this.setContainerY()
                },
                getInitialZoomFactor: function() {
                    return this.container[0].offsetWidth / this.el[0].offsetWidth
                },
                getAspectRatio: function() {
                    return this.el[0].offsetWidth / this.el[0].offsetHeight
                },
                getCurrentZoomCenter: function() {
                    var t = this.container[0].offsetWidth * this.zoomFactor,
                    e = this.offset.x,
                    i = t - e - this.container[0].offsetWidth,
                    n = e / i,
                    o = n * this.container[0].offsetWidth / (n + 1),
                    s = this.container[0].offsetHeight * this.zoomFactor,
                    a = this.offset.y,
                    r = s - a - this.container[0].offsetHeight,
                    l = a / r,
                    c = l * this.container[0].offsetHeight / (l + 1);
                    return 0 === i && (o = this.container[0].offsetWidth),
                    0 === r && (c = this.container[0].offsetHeight),
                    {
                        x: o,
                        y: c
                    }
                },
                canDrag: function() {
                    return ! n(this.zoomFactor, 1)
                },
                getTouches: function(t) {
                    var e = this.container.offset();
                    return Array.prototype.slice.call(t.touches).map(function(t) {
                        return {
                            x: t.pageX - e.left,
                            y: t.pageY - e.top
                        }
                    })
                },
                animate: function(t, e, i, n, o) {
                    var s = (new Date).getTime(),
                    a = function() {
                        if (this.inAnimation) {
                            var r = (new Date).getTime() - s,
                            l = r / t;
                            r >= t ? (i(1), o && o(), this.update(), this.stopAnimation(), this.update()) : (n && (l = n(l)), i(l), this.update(), setTimeout(a, e))
                        }
                    }.bind(this);
                    this.inAnimation = !0,
                    a()
                },
                stopAnimation: function() {
                    this.inAnimation = !1
                },
                swing: function(t) {
                    return - Math.cos(t * Math.PI) / 2 + .5
                },
                getContainerX: function() {
                    return window.innerWidth
                },
                getContainerY: function() {
                    return window.innerHeight
                },
                setContainerY: function(t) {
                    var e = window.innerHeight;
                    return this.el.css({
                        height: e
                    }),
                    this.container.height(e)
                },
                setupMarkup: function() {
                    this.container = t('<div class="pinch-zoom-container"></div>'),
                    this.el.before(this.container),
                    this.container.append(this.el),
                    this.container.css({
                        overflow: "hidden",
                        position: "relative"
                    }),
                    this.el.css({
                        "-webkit-transform-origin": "0% 0%",
                        "-moz-transform-origin": "0% 0%",
                        "-ms-transform-origin": "0% 0%",
                        "-o-transform-origin": "0% 0%",
                        "transform-origin": "0% 0%",
                        position: "absolute"
                    })
                },
                end: function() {
                    this.hasInteraction = !1,
                    this.sanitize(),
                    this.update()
                },
                bindEvents: function() {
                    o(this.container.get(0), this),
                    t(window).on("resize", this.update.bind(this)),
                    t(this.el).find("img").on("load", this.update.bind(this))
                },
                update: function() {
                    this.updatePlaned || (this.updatePlaned = !0, setTimeout(function() {
                        this.updatePlaned = !1,
                        this.updateAspectRatio();
                        var t = this.getInitialZoomFactor() * this.zoomFactor,
                        e = -this.offset.x / t,
                        i = -this.offset.y / t,
                        n = "scale3d(" + t + ", " + t + ",1) translate3d(" + e + "px," + i + "px,0px)",
                        o = "scale(" + t + ", " + t + ") translate(" + e + "px," + i + "px)",
                        s = function() {
                            this.clone && (this.clone.remove(), delete this.clone)
                        }.bind(this); ! this.options.use2d || this.hasInteraction || this.inAnimation ? (this.is3d = !0, s(), this.el.css({
                            "-webkit-transform": n,
                            "-o-transform": o,
                            "-ms-transform": o,
                            "-moz-transform": o,
                            transform: n
                        })) : (this.is3d && (this.clone = this.el.clone(), this.clone.css("pointer-events", "none"), this.clone.appendTo(this.container), setTimeout(s, 200)), this.el.css({
                            "-webkit-transform": o,
                            "-o-transform": o,
                            "-ms-transform": o,
                            "-moz-transform": o,
                            transform: o
                        }), this.is3d = !1)
                    }.bind(this), 0))
                },
                enable: function() {
                    this.enabled = !0
                },
                disable: function() {
                    this.enabled = !1
                }
            };
            var o = function(t, e) {
                var i = null,
                n = 0,
                o = null,
                s = null,
                a = function(t, n) {
                    if (i !== t) {
                        if (i && !t) switch (i) {
                        case "zoom":
                            e.handleZoomEnd(n);
                            break;
                        case "drag":
                            e.handleDragEnd(n)
                        }
                        switch (t) {
                        case "zoom":
                            e.handleZoomStart(n);
                            break;
                        case "drag":
                            e.handleDragStart(n)
                        }
                    }
                    i = t
                },
                r = function(t) {
                    2 === n ? a("zoom") : 1 === n && e.canDrag() ? a("drag", t) : a(null, t)
                },
                l = function(t) {
                    return Array.prototype.slice.call(t).map(function(t) {
                        return {
                            x: t.pageX,
                            y: t.pageY
                        }
                    })
                },
                c = function(t, e) {
                    var i, n;
                    return i = t.x - e.x,
                    n = t.y - e.y,
                    Math.sqrt(i * i + n * n)
                },
                h = function(t, e) {
                    var i = c(t[0], t[1]),
                    n = c(e[0], e[1]);
                    return n / i
                },
                u = function(t) {
                    t.stopPropagation(),
                    t.preventDefault()
                },
                d = function(t) {
                    var s = (new Date).getTime();
                    if (n > 1 && (o = null), 300 > s - o) switch (u(t), e.handleDoubleTap(t), i) {
                    case "zoom":
                        e.handleZoomEnd(t);
                        break;
                    case "drag":
                        e.handleDragEnd(t)
                    }
                    1 === n && (o = s)
                },
                p = !0;
                t.addEventListener("touchstart",
                function(t) {
                    e.enabled && (p = !0, n = t.touches.length, d(t))
                }),
                t.addEventListener("touchmove",
                function(t) {
                    if (e.enabled) {
                        if (p) r(t),
                        i && u(t),
                        s = l(t.touches);
                        else {
                            switch (i) {
                            case "zoom":
                                e.handleZoom(t, h(s, l(t.touches)));
                                break;
                            case "drag":
                                e.handleDrag(t)
                            }
                            i && (u(t), e.update())
                        }
                        p = !1
                    }
                }),
                t.addEventListener("touchend",
                function(t) {
                    e.enabled && (n = t.touches.length, r(t))
                })
            };
            return e
        };
        t.exports = o.pichzoom = s(n)
    },
    function(t, e, i) {
        "use strict";
        var n = i(1),
        o = i(2),
        s = n(window),
        a = function(t, e) {
            this.options = n.extend({},
            a.DEFAULTS, e),
            this.$element = n(t),
            this.active = null,
            this.$popover = this.options.target && n(this.options.target) || null,
            this.init(),
            this._bindEvents()
        };
        a.DEFAULTS = {
            theme: null,
            trigger: "click",
            content: "",
            open: !1,
            target: null,
            tpl: '<div class="am-popover"><div class="am-popover-inner"></div><div class="am-popover-caret"></div></div>'
        },
        a.prototype.init = function() {
            function t() {
                i.sizePopover()
            }
            var e, i = this,
            s = this.$element;
            this.options.target || (this.$popover = this.getPopover(), this.setContent()),
            e = this.$popover,
            e.appendTo(n("body")),
            this.sizePopover(),
            s.on("open.popover.amui",
            function() {
                n(window).on("resize.popover.amui", o.utils.debounce(t, 50))
            }),
            s.on("close.popover.amui",
            function() {
                n(window).off("resize.popover.amui", t)
            }),
            this.options.open && this.open()
        },
        a.prototype.sizePopover = function() {
            var t = this.$element,
            e = this.$popover;
            if (e && e.length) {
                var i = e.outerWidth(),
                n = e.outerHeight(),
                o = e.find(".am-popover-caret"),
                a = o.outerWidth() / 2 || 8,
                r = n + 8,
                l = t.outerWidth(),
                c = t.outerHeight(),
                h = t.offset(),
                u = t[0].getBoundingClientRect(),
                d = s.height(),
                p = s.width(),
                m = 0,
                f = 0,
                v = 0,
                g = 2,
                w = "top";
                e.css({
                    left: "",
                    top: ""
                }).removeClass("am-popover-left am-popover-right am-popover-top am-popover-bottom"),
                r - g < u.top + g ? m = h.top - r - g: r < d - u.top - u.height ? (w = "bottom", m = h.top + c + a + g) : (w = "middle", m = c / 2 + h.top - n / 2),
                "top" === w || "bottom" === w ? (f = l / 2 + h.left - i / 2, v = f, 5 > f && (f = 5), f + i > p && (f = p - i - 20), "top" === w && e.addClass("am-popover-top"), "bottom" === w && e.addClass("am-popover-bottom"), v -= f) : "middle" === w && (f = h.left - i - a, e.addClass("am-popover-left"), 5 > f && (f = h.left + l + a, e.removeClass("am-popover-left").addClass("am-popover-right")), f + i > p && (f = p - i - 5, e.removeClass("am-popover-left").addClass("am-popover-right"))),
                e.css({
                    top: m + "px",
                    left: f + "px"
                })
            }
        },
        a.prototype.toggle = function() {
            return this[this.active ? "close": "open"]()
        },
        a.prototype.open = function() {
            var t = this.$popover;
            this.$element.trigger("open.popover.amui"),
            this.sizePopover(),
            t.show().addClass("am-active"),
            this.active = !0
        },
        a.prototype.close = function() {
            var t = this.$popover;
            this.$element.trigger("close.popover.amui"),
            t.removeClass("am-active").trigger("closed.popover.amui").hide(),
            this.active = !1
        },
        a.prototype.getPopover = function() {
            var t = o.utils.generateGUID("am-popover"),
            e = [];
            return this.options.theme && n.each(this.options.theme.split(" "),
            function(t, i) {
                e.push("am-popover-" + n.trim(i))
            }),
            n(this.options.tpl).attr("id", t).addClass(e.join(" "))
        },
        a.prototype.setContent = function(t) {
            t = t || this.options.content,
            this.$popover && this.$popover.find(".am-popover-inner").empty().html(t)
        },
        a.prototype._bindEvents = function() {
            for (var t = "popover.amui",
            e = this.options.trigger.split(" "), i = e.length; i--;) {
                var o = e[i];
                if ("click" === o) this.$element.on("click." + t, n.proxy(this.toggle, this));
                else {
                    var s = "hover" == o ? "mouseenter": "focusin",
                    a = "hover" == o ? "mouseleave": "focusout";
                    this.$element.on(s + "." + t, n.proxy(this.open, this)),
                    this.$element.on(a + "." + t, n.proxy(this.close, this))
                }
            }
        },
        a.prototype.destroy = function() {
            this.$element.off(".popover.amui").removeData("amui.popover"),
            this.$popover.remove()
        },
        o.plugin("popover", a),
        o.ready(function(t) {
            n("[data-am-popover]", t).popover()
        }),
        t.exports = a
    },
    function(t, e, i) {
        "use strict";
        var n = i(2),
        o = function() {
            function t(t, e, i) {
                return e > t ? e: t > i ? i: t
            }
            function e(t) {
                return 100 * ( - 1 + t)
            }
            function i(t, i, n) {
                var o;
                return o = "translate3d" === c.positionUsing ? {
                    transform: "translate3d(" + e(t) + "%,0,0)"
                }: "translate" === c.positionUsing ? {
                    transform: "translate(" + e(t) + "%,0)"
                }: {
                    "margin-left": e(t) + "%"
                },
                o.transition = "all " + i + "ms " + n,
                o
            }
            function n(t, e) {
                var i = "string" == typeof t ? t: a(t);
                return i.indexOf(" " + e + " ") >= 0
            }
            function o(t, e) {
                var i = a(t),
                o = i + e;
                n(i, e) || (t.className = o.substring(1))
            }
            function s(t, e) {
                var i, o = a(t);
                n(t, e) && (i = o.replace(" " + e + " ", " "), t.className = i.substring(1, i.length - 1))
            }
            function a(t) {
                return (" " + (t.className || "") + " ").replace(/\s+/gi, " ")
            }
            function r(t) {
                t && t.parentNode && t.parentNode.removeChild(t)
            }
            var l = {};
            l.version = "0.2.0";
            var c = l.settings = {
                minimum: .08,
                easing: "ease",
                positionUsing: "",
                speed: 200,
                trickle: !0,
                trickleRate: .02,
                trickleSpeed: 800,
                showSpinner: !0,
                parent: "body",
                barSelector: '[role="nprogress-bar"]',
                spinnerSelector: '[role="nprogress-spinner"]',
                template: '<div class="nprogress-bar" role="nprogress-bar"><div class="nprogress-peg"></div></div><div class="nprogress-spinner" role="nprogress-spinner"><div class="nprogress-spinner-icon"></div></div>'
            };
            l.configure = function(t) {
                var e, i;
                for (e in t) i = t[e],
                void 0 !== i && t.hasOwnProperty(e) && (c[e] = i);
                return this
            },
            l.status = null,
            l.set = function(e) {
                var n = l.isStarted();
                e = t(e, c.minimum, 1),
                l.status = 1 === e ? null: e;
                var o = l.render(!n),
                s = o.querySelector(c.barSelector),
                a = c.speed,
                r = c.easing;
                return o.offsetWidth,
                h(function(t) {
                    "" === c.positionUsing && (c.positionUsing = l.getPositioningCSS()),
                    u(s, i(e, a, r)),
                    1 === e ? (u(o, {
                        transition: "none",
                        opacity: 1
                    }), o.offsetWidth, setTimeout(function() {
                        u(o, {
                            transition: "all " + a + "ms linear",
                            opacity: 0
                        }),
                        setTimeout(function() {
                            l.remove(),
                            t()
                        },
                        a)
                    },
                    a)) : setTimeout(t, a)
                }),
                this
            },
            l.isStarted = function() {
                return "number" == typeof l.status
            },
            l.start = function() {
                l.status || l.set(0);
                var t = function() {
                    setTimeout(function() {
                        l.status && (l.trickle(), t())
                    },
                    c.trickleSpeed)
                };
                return c.trickle && t(),
                this
            },
            l.done = function(t) {
                return t || l.status ? l.inc(.3 + .5 * Math.random()).set(1) : this
            },
            l.inc = function(e) {
                var i = l.status;
                return i ? ("number" != typeof e && (e = (1 - i) * t(Math.random() * i, .1, .95)), i = t(i + e, 0, .994), l.set(i)) : l.start()
            },
            l.trickle = function() {
                return l.inc(Math.random() * c.trickleRate)
            },
            function() {
                var t = 0,
                e = 0;
                l.promise = function(i) {
                    return i && "resolved" !== i.state() ? (0 === e && l.start(), t++, e++, i.always(function() {
                        e--,
                        0 === e ? (t = 0, l.done()) : l.set((t - e) / t)
                    }), this) : this
                }
            } (),
            l.render = function(t) {
                if (l.isRendered()) return document.getElementById("nprogress");
                o(document.documentElement, "nprogress-busy");
                var i = document.createElement("div");
                i.id = "nprogress",
                i.innerHTML = c.template;
                var n, s = i.querySelector(c.barSelector),
                a = t ? "-100": e(l.status || 0),
                h = document.querySelector(c.parent);
                return u(s, {
                    transition: "all 0 linear",
                    transform: "translate3d(" + a + "%,0,0)"
                }),
                c.showSpinner || (n = i.querySelector(c.spinnerSelector), n && r(n)),
                h != document.body && o(h, "nprogress-custom-parent"),
                h.appendChild(i),
                i
            },
            l.remove = function() {
                s(document.documentElement, "nprogress-busy"),
                s(document.querySelector(c.parent), "nprogress-custom-parent");
                var t = document.getElementById("nprogress");
                t && r(t)
            },
            l.isRendered = function() {
                return !! document.getElementById("nprogress")
            },
            l.getPositioningCSS = function() {
                var t = document.body.style,
                e = "WebkitTransform" in t ? "Webkit": "MozTransform" in t ? "Moz": "msTransform" in t ? "ms": "OTransform" in t ? "O": "";
                return e + "Perspective" in t ? "translate3d": e + "Transform" in t ? "translate": "margin"
            };
            var h = function() {
                function t() {
                    var i = e.shift();
                    i && i(t)
                }
                var e = [];
                return function(i) {
                    e.push(i),
                    1 == e.length && t()
                }
            } (),
            u = function() {
                function t(t) {
                    return t.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi,
                    function(t, e) {
                        return e.toUpperCase()
                    })
                }
                function e(t) {
                    var e = document.body.style;
                    if (t in e) return t;
                    for (var i, n = o.length,
                    s = t.charAt(0).toUpperCase() + t.slice(1); n--;) if (i = o[n] + s, i in e) return i;
                    return t
                }
                function i(i) {
                    return i = t(i),
                    s[i] || (s[i] = e(i))
                }
                function n(t, e, n) {
                    e = i(e),
                    t.style[e] = n
                }
                var o = ["Webkit", "O", "Moz", "ms"],
                s = {};
                return function(t, e) {
                    var i, o, s = arguments;
                    if (2 == s.length) for (i in e) o = e[i],
                    void 0 !== o && e.hasOwnProperty(i) && n(t, i, o);
                    else n(t, s[1], s[2])
                }
            } ();
            return l
        } ();
        t.exports = n.progress = o
    },
    function(t, e, i) {
        "use strict";
        var n = i(1),
        o = i(2),
        s = i(17),
        a = i(3),
        r = o.support.animation,
        l = o.support.transition,
        c = function(t, e) {
            this.$element = n(t),
            this.$body = n(document.body),
            this.options = n.extend({},
            c.DEFAULTS, e),
            this.$pureview = n(this.options.tpl).attr("id", o.utils.generateGUID("am-pureview")),
            this.$slides = null,
            this.transitioning = null,
            this.scrollbarWidth = 0,
            this.init()
        };
        c.DEFAULTS = {
            tpl: '<div class="am-pureview am-pureview-bar-active"><ul class="am-pureview-slider"></ul><ul class="am-pureview-direction"><li class="am-pureview-prev"><a href=""></a></li><li class="am-pureview-next"><a href=""></a></li></ul><ol class="am-pureview-nav"></ol><div class="am-pureview-bar am-active"><span class="am-pureview-title"></span><div class="am-pureview-counter"><span class="am-pureview-current"></span> / <span class="am-pureview-total"></span></div></div><div class="am-pureview-actions am-active"><a href="javascript: void(0)" class="am-icon-chevron-left" data-am-close="pureview"></a></div></div>',
            className: {
                prevSlide: "am-pureview-slide-prev",
                nextSlide: "am-pureview-slide-next",
                onlyOne: "am-pureview-only",
                active: "am-active",
                barActive: "am-pureview-bar-active",
                activeBody: "am-pureview-active"
            },
            selector: {
                slider: ".am-pureview-slider",
                close: '[data-am-close="pureview"]',
                total: ".am-pureview-total",
                current: ".am-pureview-current",
                title: ".am-pureview-title",
                actions: ".am-pureview-actions",
                bar: ".am-pureview-bar",
                pinchZoom: ".am-pinch-zoom",
                nav: ".am-pureview-nav"
            },
            shareBtn: !1,
            toggleToolbar: !0,
            target: "img",
            weChatImagePreview: !0
        },
        c.prototype.init = function() {
            var t = this,
            e = this.options,
            i = this.$element,
            o = this.$pureview;
            this.refreshSlides(),
            n("body").append(o),
            this.$title = o.find(e.selector.title),
            this.$current = o.find(e.selector.current),
            this.$bar = o.find(e.selector.bar),
            this.$actions = o.find(e.selector.actions),
            e.shareBtn && this.$actions.append('<a href="javascript: void(0)" class="am-icon-share-square-o" data-am-toggle="share"></a>'),
            this.$element.on("click.pureview.amui", e.target,
            function(i) {
                i.preventDefault();
                var n = t.$images.index(this);
                e.weChatImagePreview && window.WeixinJSBridge ? window.WeixinJSBridge.invoke("imagePreview", {
                    current: t.imgUrls[n],
                    urls: t.imgUrls
                }) : t.open(n)
            }),
            o.find(".am-pureview-direction").on("click.direction.pureview.amui", "li",
            function(e) {
                e.preventDefault(),
                n(this).is(".am-pureview-prev") ? t.prevSlide() : t.nextSlide()
            }),
            o.find(e.selector.nav).on("click.nav.pureview.amui", "li",
            function() {
                var e = t.$navItems.index(n(this));
                t.activate(t.$slides.eq(e))
            }),
            o.find(e.selector.close).on("click.close.pureview.amui",
            function(e) {
                e.preventDefault(),
                t.close()
            }),
            this.$slider.hammer().on("swipeleft.pureview.amui",
            function(e) {
                e.preventDefault(),
                t.nextSlide()
            }).on("swiperight.pureview.amui",
            function(e) {
                e.preventDefault(),
                t.prevSlide()
            }).on("press.pureview.amui",
            function(i) {
                i.preventDefault(),
                e.toggleToolbar && t.toggleToolBar()
            }),
            this.$slider.data("hammer").get("swipe").set({
                direction: a.DIRECTION_HORIZONTAL,
                velocity: .35
            }),
            i.DOMObserve({
                childList: !0,
                subtree: !0
            },
            function(t, e) {}),
            i.on("changed.dom.amui",
            function(e) {
                e.stopPropagation(),
                t.refreshSlides()
            }),
            n(document).on("keydown.pureview.amui", n.proxy(function(t) {
                var e = t.keyCode;
                37 == e ? this.prevSlide() : 39 == e ? this.nextSlide() : 27 == e && this.close()
            },
            this))
        },
        c.prototype.refreshSlides = function() {
            this.$images = this.$element.find(this.options.target);
            var t = this,
            e = this.options,
            i = this.$pureview,
            s = n([]),
            a = n([]),
            r = this.$images,
            l = r.length;
            this.$slider = i.find(e.selector.slider),
            this.$nav = i.find(e.selector.nav);
            var c = "data-am-pureviewed";
            this.imgUrls = this.imgUrls || [],
            l && (1 === l && i.addClass(e.className.onlyOne), r.not("[" + c + "]").each(function(e, i) {
                var r, l;
                "A" === i.nodeName ? (r = i.href, l = i.title || "") : (r = n(i).data("rel") || i.src, r = o.utils.getAbsoluteUrl(r), l = n(i).attr("alt") || ""),
                i.setAttribute(c, "1"),
                t.imgUrls.push(r),
                s = s.add(n('<li data-src="' + r + '" data-title="' + l + '"></li>')),
                a = a.add(n("<li>" + (e + 1) + "</li>"))
            }), i.find(e.selector.total).text(l), this.$slider.append(s), this.$nav.append(a), this.$navItems = this.$nav.find("li"), this.$slides = this.$slider.find("li"))
        },
        c.prototype.loadImage = function(t, e) {
            var i = "image-appended";
            if (!t.data(i)) {
                var o = n("<img>", {
                    src: t.data("src"),
                    alt: t.data("title")
                });
                t.html(o).wrapInner('<div class="am-pinch-zoom"></div>').redraw();
                var a = t.find(this.options.selector.pinchZoom);
                a.data("amui.pinchzoom", new s(a[0], {})),
                t.data("image-appended", !0)
            }
            e && e.call(this)
        },
        c.prototype.activate = function(t) {
            var e = this.options,
            i = this.$slides,
            s = i.index(t),
            a = t.data("title") || "",
            r = e.className.active;
            i.find("." + r).is(t) || this.transitioning || (this.loadImage(t,
            function() {
                o.utils.imageLoader(t.find("img"),
                function(e) {
                    t.find(".am-pinch-zoom").addClass("am-pureview-loaded"),
                    n(e).addClass("am-img-loaded")
                })
            }), this.transitioning = 1, this.$title.text(a), this.$current.text(s + 1), i.removeClass(), t.addClass(r), i.eq(s - 1).addClass(e.className.prevSlide), i.eq(s + 1).addClass(e.className.nextSlide), this.$navItems.removeClass().eq(s).addClass(e.className.active), l ? t.one(l.end, n.proxy(function() {
                this.transitioning = 0
            },
            this)).emulateTransitionEnd(300) : this.transitioning = 0)
        },
        c.prototype.nextSlide = function() {
            if (1 !== this.$slides.length) {
                var t = this.$slides,
                e = t.filter(".am-active"),
                i = t.index(e),
                n = "am-animation-right-spring";
                i + 1 >= t.length ? r && e.addClass(n).on(r.end,
                function() {
                    e.removeClass(n)
                }) : this.activate(t.eq(i + 1))
            }
        },
        c.prototype.prevSlide = function() {
            if (1 !== this.$slides.length) {
                var t = this.$slides,
                e = t.filter(".am-active"),
                i = this.$slides.index(e),
                n = "am-animation-left-spring";
                0 === i ? r && e.addClass(n).on(r.end,
                function() {
                    e.removeClass(n)
                }) : this.activate(t.eq(i - 1))
            }
        },
        c.prototype.toggleToolBar = function() {
            this.$pureview.toggleClass(this.options.className.barActive)
        },
        c.prototype.open = function(t) {
            var e = t || 0;
            this.checkScrollbar(),
            this.setScrollbar(),
            this.activate(this.$slides.eq(e)),
            this.$pureview.show().redraw().addClass(this.options.className.active),
            this.$body.addClass(this.options.className.activeBody)
        },
        c.prototype.close = function() {
            function t() {
                this.$pureview.hide(),
                this.$body.removeClass(e.className.activeBody),
                this.resetScrollbar()
            }
            var e = this.options;
            this.$pureview.removeClass(e.className.active),
            this.$slides.removeClass(),
            l ? this.$pureview.one(l.end, n.proxy(t, this)).emulateTransitionEnd(300) : t.call(this)
        },
        c.prototype.checkScrollbar = function() {
            this.scrollbarWidth = o.utils.measureScrollbar()
        },
        c.prototype.setScrollbar = function() {
            var t = parseInt(this.$body.css("padding-right") || 0, 10);
            this.scrollbarWidth && this.$body.css("padding-right", t + this.scrollbarWidth)
        },
        c.prototype.resetScrollbar = function() {
            this.$body.css("padding-right", "")
        },
        o.plugin("pureview", c),
        o.ready(function(t) {
            n("[data-am-pureview]", t).pureview()
        }),
        t.exports = c
    },
    function(t, e, i) {
        "use strict";
        var n = i(1),
        o = i(2),
        s = function(t, e) {
            if (o.support.animation) {
                this.options = n.extend({},
                s.DEFAULTS, e),
                this.$element = n(t);
                var i = function() {
                    o.utils.rAF.call(window, n.proxy(this.checkView, this))
                }.bind(this);
                this.$window = n(window).on("scroll.scrollspy.amui", i).on("resize.scrollspy.amui orientationchange.scrollspy.amui", o.utils.debounce(i, 50)),
                this.timer = this.inViewState = this.initInView = null,
                i()
            }
        };
        s.DEFAULTS = {
            animation: "fade",
            className: {
                inView: "am-scrollspy-inview",
                init: "am-scrollspy-init"
            },
            repeat: !0,
            delay: 0,
            topOffset: 0,
            leftOffset: 0
        },
        s.prototype.checkView = function() {
            var t = this.$element,
            e = this.options,
            i = o.utils.isInView(t, e),
            n = e.animation ? " am-animation-" + e.animation: "";
            i && !this.inViewState && (this.timer && clearTimeout(this.timer), this.initInView || (t.addClass(e.className.init), this.offset = t.offset(), this.initInView = !0, t.trigger("init.scrollspy.amui")), this.timer = setTimeout(function() {
                i && t.addClass(e.className.inView + n).width()
            },
            e.delay), this.inViewState = !0, t.trigger("inview.scrollspy.amui")),
            !i && this.inViewState && e.repeat && (t.removeClass(e.className.inView + n), this.inViewState = !1, t.trigger("outview.scrollspy.amui"))
        },
        s.prototype.check = function() {
            o.utils.rAF.call(window, n.proxy(this.checkView, this))
        },
        o.plugin("scrollspy", s),
        o.ready(function(t) {
            n("[data-am-scrollspy]", t).scrollspy()
        }),
        t.exports = s
    },
    function(t, e, i) {
        "use strict";
        var n = i(1),
        o = i(2);
        i(23);
        var s = function(t, e) {
            this.options = n.extend({},
            s.DEFAULTS, e),
            this.$element = n(t),
            this.anchors = [],
            this.$links = this.$element.find('a[href^="#"]').each(function(t, e) {
                this.anchors.push(n(e).attr("href"))
            }.bind(this)),
            this.$targets = n(this.anchors.join(", "));
            var i = function() {
                o.utils.rAF.call(window, n.proxy(this.process, this))
            }.bind(this);
            this.$window = n(window).on("scroll.scrollspynav.amui", i).on("resize.scrollspynav.amui orientationchange.scrollspynav.amui", o.utils.debounce(i, 50)),
            i(),
            this.scrollProcess()
        };
        s.DEFAULTS = {
            className: {
                active: "am-active"
            },
            closest: !1,
            smooth: !0,
            offsetTop: 0
        },
        s.prototype.process = function() {
            var t = this.$window.scrollTop(),
            e = this.options,
            i = [],
            s = this.$links,
            a = this.$targets;
            if (a.each(function(t, n) {
                o.utils.isInView(n, e) && i.push(n)
            }), i.length) {
                var r;
                if (n.each(i,
                function(e, i) {
                    return n(i).offset().top >= t ? (r = n(i), !1) : void 0
                }), !r) return;
                e.closest ? (s.closest(e.closest).removeClass(e.className.active), s.filter('a[href="#' + r.attr("id") + '"]').closest(e.closest).addClass(e.className.active)) : s.removeClass(e.className.active).filter('a[href="#' + r.attr("id") + '"]').addClass(e.className.active)
            }
        },
        s.prototype.scrollProcess = function() {
            var t = this.$links,
            e = this.options;
            e.smooth && n.fn.smoothScroll && t.on("click",
            function(t) {
                t.preventDefault();
                var i = n(this),
                o = n(i.attr("href"));
                if (o) {
                    var s = e.offsetTop && !isNaN(parseInt(e.offsetTop)) && parseInt(e.offsetTop) || 0;
                    n(window).smoothScroll({
                        position: o.offset().top - s
                    })
                }
            })
        },
        o.plugin("scrollspynav", s),
        o.ready(function(t) {
            n("[data-am-scrollspy-nav]", t).scrollspynav()
        }),
        t.exports = s
    },
    function(t, e, i) {
        "use strict";
        var n = i(1),
        o = i(2),
        s = o.utils.rAF,
        a = o.utils.cancelAF,
        r = !1,
        l = function(t, e) {
            function i(t) {
                return (t /= .5) < 1 ? .5 * Math.pow(t, 5) : .5 * (Math.pow(t - 2, 5) + 2)
            }
            function o() {
                p.off("touchstart.smoothscroll.amui", y),
                r = !1
            }
            function c(t) {
                r && (h || (h = t), u = Math.min(1, Math.max((t - h) / w, 0)), d = Math.round(f + g * i(u)), g > 0 && d > m && (d = m), 0 > g && m > d && (d = m), v != d && p.scrollTop(d), v = d, d !== m ? (a(b), b = s(c)) : (a(b), o()))
            }
            e = e || {};
            var h, u, d, p = n(t),
            m = parseInt(e.position) || l.DEFAULTS.position,
            f = p.scrollTop(),
            v = f,
            g = m - f,
            w = e.speed || Math.min(750, Math.min(1500, Math.abs(f - m))),
            y = function() {
                o()
            };
            if (!r && 0 !== g) {
                p.on("touchstart.smoothscroll.amui", y),
                r = !0;
                var b = s(c)
            }
        };
        l.DEFAULTS = {
            position: 0
        },
        n.fn.smoothScroll = function(t) {
            return this.each(function() {
                new l(this, t)
            })
        },
        n(document).on("click.smoothScroll.amui.data-api", "[data-am-smooth-scroll]",
        function(t) {
            t.preventDefault();
            var e = o.utils.parseOptions(n(this).data("amSmoothScroll"));
            n(window).smoothScroll(e)
        }),
        t.exports = l
    },
    function(t, e, i) {
        "use strict";
        var n = i(1),
        o = i(2);
        n.expr[":"].containsNC = function(t, e, i, n) {
            return (t.textContent || t.innerText || "").toLowerCase().indexOf((i[3] || "").toLowerCase()) >= 0
        };
        var s = function(t, e) {
            this.$element = n(t),
            this.options = n.extend({},
            s.DEFAULTS, {
                placeholder: t.getAttribute("placeholder") || s.DEFAULTS.placeholder
            },
            e),
            this.$originalOptions = this.$element.find("option"),
            this.multiple = t.multiple,
            this.$selector = null,
            this.initialized = !1,
            this.init()
        };
        s.DEFAULTS = {
            btnWidth: null,
            btnSize: null,
            btnStyle: "default",
            dropUp: 0,
            maxHeight: null,
            maxChecked: null,
            placeholder: "\u70b9\u51fb\u9009\u62e9...",
            selectedClass: "am-checked",
            disabledClass: "am-disabled",
            searchBox: !1,
            tpl: '<div class="am-selected am-dropdown <%= dropUp ? \'am-dropdown-up\': \'\' %>" id="<%= id %>" data-am-dropdown>  <button type="button" class="am-selected-btn am-btn am-dropdown-toggle">    <span class="am-selected-status am-fl"></span>    <i class="am-selected-icon am-icon-caret-<%= dropUp ? \'up\' : \'down\' %>"></i>  </button>  <div class="am-selected-content am-dropdown-content">    <h2 class="am-selected-header"><span class="am-icon-chevron-left">\u8fd4\u56de</span></h2>   <% if (searchBox) { %>   <div class="am-selected-search">     <input autocomplete="off" class="am-form-field am-input-sm" />   </div>   <% } %>    <ul class="am-selected-list">      <% for (var i = 0; i < options.length; i++) { %>       <% var option = options[i] %>       <% if (option.header) { %>  <li data-group="<%= option.group %>" class="am-selected-list-header">       <%= option.text %></li>       <% } else { %>       <li class="<%= option.classNames%>"          data-index="<%= option.index %>"          data-group="<%= option.group || 0 %>"          data-value="<%= option.value %>" >         <span class="am-selected-text"><%= option.text %></span>         <i class="am-icon-check"></i></li>      <% } %>      <% } %>    </ul>    <div class="am-selected-hint"></div>  </div></div>',
            listTpl: '<% for (var i = 0; i < options.length; i++) { %>       <% var option = options[i] %>       <% if (option.header) { %>  <li data-group="<%= option.group %>" class="am-selected-list-header">       <%= option.text %></li>       <% } else { %>       <li class="<%= option.classNames %>"          data-index="<%= option.index %>"          data-group="<%= option.group || 0 %>"          data-value="<%= option.value %>" >         <span class="am-selected-text"><%= option.text %></span>         <i class="am-icon-check"></i></li>      <% } %>      <% } %>'
        },
        s.prototype.init = function() {
            var t = this,
            e = this.$element,
            i = this.options;
            e.hide();
            var s = {
                id: o.utils.generateGUID("am-selected"),
                multiple: this.multiple,
                options: [],
                searchBox: i.searchBox,
                dropUp: i.dropUp,
                placeholder: i.placeholder
            };
            this.$selector = n(o.template(this.options.tpl, s)),
            this.$selector.css({
                width: this.options.btnWidth
            }),
            this.$element[0].disabled && this.$selector.addClass(i.disabledClass),
            this.$list = this.$selector.find(".am-selected-list"),
            this.$searchField = this.$selector.find(".am-selected-search input"),
            this.$hint = this.$selector.find(".am-selected-hint");
            var a = this.$selector.find(".am-selected-btn"),
            r = [];
            i.btnSize && r.push("am-btn-" + i.btnSize),
            i.btnStyle && r.push("am-btn-" + i.btnStyle),
            a.addClass(r.join(" ")),
            this.$selector.dropdown({
                justify: a
            }),
            i.maxHeight && this.$selector.find(".am-selected-list").css({
                "max-height": i.maxHeight,
                "overflow-y": "scroll"
            });
            var l = [],
            c = e.attr("minchecked"),
            h = e.attr("maxchecked") || i.maxChecked;
            this.maxChecked = h || 1 / 0,
            e[0].required && l.push("\u5fc5\u9009"),
            (c || h) && (c && l.push("\u81f3\u5c11\u9009\u62e9 " + c + " \u9879"), h && l.push("\u81f3\u591a\u9009\u62e9 " + h + " \u9879")),
            this.$hint.text(l.join("\uff0c")),
            this.renderOptions(),
            this.$element.after(this.$selector),
            this.dropdown = this.$selector.data("amui.dropdown"),
            this.$status = this.$selector.find(".am-selected-status"),
            setTimeout(function() {
                t.syncData(),
                t.initialized = !0
            },
            0),
            this.bindEvents()
        },
        s.prototype.renderOptions = function() {
            function t(t, e, o) {
                if ("" === e.value) return ! 0;
                var s = "";
                e.disabled && (s += i.disabledClass),
                !e.disabled && e.selected && (s += i.selectedClass),
                n.push({
                    group: o,
                    index: t,
                    classNames: s,
                    text: e.text,
                    value: e.value
                })
            }
            var e = this.$element,
            i = this.options,
            n = [],
            s = e.find("optgroup");
            this.$originalOptions = this.$element.find("option"),
            this.multiple || null !== e.val() || this.$originalOptions.length && (this.$originalOptions.get(0).selected = !0),
            s.length ? s.each(function(e) {
                n.push({
                    header: !0,
                    group: e + 1,
                    text: this.label
                }),
                s.eq(e).find("option").each(function(i, n) {
                    t(i, n, e)
                })
            }) : this.$originalOptions.each(function(e, i) {
                t(e, i, null)
            }),
            this.$list.html(o.template(i.listTpl, {
                options: n
            })),
            this.$shadowOptions = this.$list.find("> li").not(".am-selected-list-header")
        },
        s.prototype.setChecked = function(t) {
            var e = this.options,
            i = n(t),
            o = i.hasClass(e.selectedClass);
            if (this.multiple) {
                var s = this.$list.find("." + e.selectedClass).length;
                if (!o && this.maxChecked <= s) return this.$element.trigger("checkedOverflow.selected.amui", {
                    selected: this
                }),
                !1
            } else {
                if (this.dropdown.close(), o) return ! 1;
                this.$shadowOptions.not(i).removeClass(e.selectedClass)
            }
            i.toggleClass(e.selectedClass),
            this.syncData(t)
        },
        s.prototype.syncData = function(t) {
            var e = this,
            i = this.options,
            o = [],
            s = n([]);
            if (this.$shadowOptions.filter("." + i.selectedClass).each(function() {
                var i = n(this);
                o.push(i.find(".am-selected-text").text()),
                t || (s = s.add(e.$originalOptions.filter('[value="' + i.data("value") + '"]').prop("selected", !0)))
            }), t) {
                var a = n(t);
                this.$originalOptions.filter('[value="' + a.data("value") + '"]').prop("selected", a.hasClass(i.selectedClass))
            } else this.$originalOptions.not(s).prop("selected", !1);
            this.$element.val() || (o = [i.placeholder]),
            this.$status.text(o.join(", ")),
            this.initialized && this.$element.trigger("change")
        },
        s.prototype.bindEvents = function() {
            var t = this,
            e = "am-selected-list-header",
            i = o.utils.debounce(function(i) {
                t.$shadowOptions.not("." + e).hide().filter(':containsNC("' + i.target.value + '")').show()
            },
            100);
            this.$list.on("click", "> li",
            function(i) {
                var o = n(this); ! o.hasClass(t.options.disabledClass) && !o.hasClass(e) && t.setChecked(this)
            }),
            this.$searchField.on("keyup.selected.amui", i),
            this.$selector.on("closed.dropdown.amui",
            function() {
                t.$searchField.val(""),
                t.$shadowOptions.css({
                    display: ""
                })
            }),
            this.$element.on("validated.field.validator.amui",
            function(e) {
                if (e.validity) {
                    var i = e.validity.valid,
                    n = "am-invalid";
                    t.$selector[(i ? "remove": "add") + "Class"](n)
                }
            }),
            o.support.mutationobserver && (this.observer = new o.support.mutationobserver(function() {
                t.$element.trigger("changed.selected.amui")
            }), this.observer.observe(this.$element[0], {
                childList: !0,
                attributes: !0,
                subtree: !0,
                characterData: !0
            })),
            this.$element.on("changed.selected.amui",
            function() {
                t.renderOptions(),
                t.syncData()
            })
        },
        s.prototype.select = function(t) {
            var e;
            e = "number" == typeof t ? this.$list.find("> li").not(".am-selected-list-header").eq(t) : "string" == typeof t ? this.$list.find(t) : n(t),
            e.trigger("click")
        },
        s.prototype.enable = function() {
            this.$element.prop("disable", !1),
            this.$selector.dropdown("enable")
        },
        s.prototype.disable = function() {
            this.$element.prop("disable", !0),
            this.$selector.dropdown("disable")
        },
        s.prototype.destroy = function() {
            this.$element.removeData("amui.selected").show(),
            this.$selector.remove()
        },
        o.plugin("selected", s),
        o.ready(function(t) {
            n("[data-am-selected]", t).selected()
        }),
        t.exports = s
    },
    function(t, e, i) {
        "use strict";
        i(15);
        var n = i(1),
        o = i(2),
        s = i(26),
        a = document,
        r = n(a),
        l = function(t) {
            this.options = n.extend({},
            l.DEFAULTS, t || {}),
            this.$element = null,
            this.$wechatQr = null,
            this.pics = null,
            this.inited = !1,
            this.active = !1
        };
        l.DEFAULTS = {
            sns: ["weibo", "qq", "qzone", "tqq", "wechat", "renren"],
            title: "\u5206\u4eab\u5230",
            cancel: "\u53d6\u6d88",
            closeOnShare: !0,
            id: o.utils.generateGUID("am-share"),
            desc: "Hi\uff0c\u5b64\u591c\u89c2\u5929\u8c61\uff0c\u53d1\u73b0\u4e00\u4e2a\u4e0d\u9519\u7684\u897f\u897f\uff0c\u5206\u4eab\u4e00\u4e0b\u4e0b ;-)",
            via: "Amaze UI",
            tpl: '<div class="am-share am-modal-actions" id="<%= id %>"><h3 class="am-share-title"><%= title %></h3><ul class="am-share-sns am-avg-sm-3"><% for(var i = 0; i < sns.length; i++) {%><li><a href="<%= sns[i].shareUrl %>" data-am-share-to="<%= sns[i].id %>" ><i class="am-icon-<%= sns[i].icon %>"></i><span><%= sns[i].title %></span></a></li><% } %></ul><div class="am-share-footer"><button class="am-btn am-btn-default am-btn-block" data-am-share-close><%= cancel %></button></div></div>'
        },
        l.SNS = {
            weibo: {
                title: "\u65b0\u6d6a\u5fae\u535a",
                url: "http://service.weibo.com/share/share.php",
                width: 620,
                height: 450,
                icon: "weibo"
            },
            qq: {
                title: "QQ \u597d\u53cb",
                url: "http://connect.qq.com/widget/shareqq/index.html",
                icon: "qq"
            },
            qzone: {
                title: "QQ \u7a7a\u95f4",
                url: "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey",
                icon: "star"
            },
            tqq: {
                title: "\u817e\u8baf\u5fae\u535a",
                url: "http://v.t.qq.com/share/share.php",
                icon: "tencent-weibo"
            },
            wechat: {
                title: "\u5fae\u4fe1",
                url: "[qrcode]",
                icon: "wechat"
            },
            renren: {
                title: "\u4eba\u4eba\u7f51",
                url: "http://widget.renren.com/dialog/share",
                icon: "renren"
            },
            douban: {
                title: "\u8c46\u74e3",
                url: "http://www.douban.com/recommend/",
                icon: "share-alt"
            },
            mail: {
                title: "\u90ae\u4ef6\u5206\u4eab",
                url: "mailto:",
                icon: "envelope-o"
            },
            sms: {
                title: "\u77ed\u4fe1\u5206\u4eab",
                url: "sms:",
                icon: "comment"
            }
        },
        l.prototype.render = function() {
            var t = this.options,
            e = [],
            i = encodeURIComponent(a.title),
            s = encodeURIComponent(a.location),
            r = "?body=" + i + s;
            return t.sns.forEach(function(n, o) {
                if (l.SNS[n]) {
                    var a, c = l.SNS[n];
                    c.id = n,
                    a = "mail" === n ? r + "&subject=" + t.desc: "sms" === n ? r: "?url=" + s + "&title=" + i,
                    c.shareUrl = c.url + a,
                    e.push(c)
                }
            }),
            o.template(t.tpl, n.extend({},
            t, {
                sns: e
            }))
        },
        l.prototype.init = function() {
            if (!this.inited) {
                var t = this,
                e = "[data-am-share-to]";
                r.ready(n.proxy(function() {
                    n("body").append(this.render()),
                    this.$element = n("#" + this.options.id),
                    this.$element.find("[data-am-share-close]").on("click.share.amui",
                    function() {
                        t.close()
                    })
                },
                this)),
                r.on("click.share.amui", e, n.proxy(function(t) {
                    var i = n(t.target),
                    o = i.is(e) && i || i.parent(e),
                    s = o.attr("data-am-share-to");
                    "mail" !== s && "sms" !== s && (t.preventDefault(), this.shareTo(s, this.setData(s))),
                    this.close()
                },
                this)),
                this.inited = !0
            }
        },
        l.prototype.open = function() { ! this.inited && this.init(),
            this.$element && this.$element.modal("open"),
            this.$element.trigger("open.share.amui"),
            this.active = !0
        },
        l.prototype.close = function() {
            this.$element && this.$element.modal("close"),
            this.$element.trigger("close.share.amui"),
            this.active = !1
        },
        l.prototype.toggle = function() {
            this.active ? this.close() : this.open()
        },
        l.prototype.setData = function(t) {
            if (t) {
                var e = {
                    url: a.location,
                    title: a.title
                },
                i = this.options.desc,
                n = this.pics || [],
                o = /^(qzone|qq|tqq)$/;
                if (o.test(t) && !n.length) {
                    for (var s = a.images,
                    r = 0; r < s.length && 10 > r; r++) !! s[r].src && n.push(encodeURIComponent(s[r].src));
                    this.pics = n
                }
                switch (t) {
                case "qzone":
                    e.desc = i,
                    e.site = this.options.via,
                    e.pics = n.join("|");
                    break;
                case "qq":
                    e.desc = i,
                    e.site = this.options.via,
                    e.pics = n[0];
                    break;
                case "tqq":
                    e.pic = n.join("|")
                }
                return e
            }
        },
        l.prototype.shareTo = function(t, e) {
            var i = l.SNS[t];
            if (i) {
                if ("wechat" === t || "weixin" === t) return this.wechatQr();
                var n = [];
                for (var o in e) e[o] && n.push(o.toString() + "=" + ("pic" === o || "pics" === o ? e[o] : encodeURIComponent(e[o])));
                window.open(i.url + "?" + n.join("&"))
            }
        },
        l.prototype.wechatQr = function() {
            if (!this.$wechatQr) {
                var t = o.utils.generateGUID("am-share-wechat"),
                e = n('<div class="am-modal am-modal-no-btn am-share-wechat-qr"><div class="am-modal-dialog"><div class="am-modal-hd">\u5206\u4eab\u5230\u5fae\u4fe1 <a href="" class="am-close am-close-spin" data-am-modal-close>&times;</a> </div><div class="am-modal-bd"><div class="am-share-wx-qr"></div><div class="am-share-wechat-tip">\u6253\u5f00\u5fae\u4fe1\uff0c\u70b9\u51fb\u5e95\u90e8\u7684<em>\u53d1\u73b0</em>\uff0c<br/> \u4f7f\u7528<em>\u626b\u4e00\u626b</em>\u5c06\u7f51\u9875\u5206\u4eab\u81f3\u670b\u53cb\u5708</div></div></div></div>');
                e.attr("id", t);
                var i = new s({
                    render: "canvas",
                    correctLevel: 0,
                    text: a.location.href,
                    width: 180,
                    height: 180,
                    background: "#fff",
                    foreground: "#000"
                });
                e.find(".am-share-wx-qr").html(i),
                e.appendTo(n("body")),
                this.$wechatQr = n("#" + t)
            }
            this.$wechatQr.modal("open")
        };
        var c = new l;
        r.on("click.share.amui.data-api", '[data-am-toggle="share"]',
        function(t) {
            t.preventDefault(),
            c.toggle()
        }),
        t.exports = o.share = c
    },
    function(t, e, i) {
        function n(t) {
            return 128 > t ? [t] : 2048 > t ? (c0 = 192 + (t >> 6), c1 = 128 + (63 & t), [c0, c1]) : (c0 = 224 + (t >> 12), c1 = 128 + (t >> 6 & 63), c2 = 128 + (63 & t), [c0, c1, c2])
        }
        function o(t) {
            for (var e = [], i = 0; i < t.length; i++) for (var o = t.charCodeAt(i), s = n(o), a = 0; a < s.length; a++) e.push(s[a]);
            return e
        }
        function s(t, e) {
            this.typeNumber = -1,
            this.errorCorrectLevel = e,
            this.modules = null,
            this.moduleCount = 0,
            this.dataCache = null,
            this.rsBlocks = null,
            this.totalDataCount = -1,
            this.data = t,
            this.utf8bytes = o(t),
            this.make()
        }
        function a(t, e) {
            if (void 0 == t.length) throw new Error(t.length + "/" + e);
            for (var i = 0; i < t.length && 0 == t[i];) i++;
            this.num = new Array(t.length - i + e);
            for (var n = 0; n < t.length - i; n++) this.num[n] = t[n + i]
        }
        function r() {
            this.buffer = new Array,
            this.length = 0
        }
        function n(t) {
            return 128 > t ? [t] : 2048 > t ? (c0 = 192 + (t >> 6), c1 = 128 + (63 & t), [c0, c1]) : (c0 = 224 + (t >> 12), c1 = 128 + (t >> 6 & 63), c2 = 128 + (63 & t), [c0, c1, c2])
        }
        function o(t) {
            for (var e = [], i = 0; i < t.length; i++) for (var o = t.charCodeAt(i), s = n(o), a = 0; a < s.length; a++) e.push(s[a]);
            return e
        }
        function s(t, e) {
            this.typeNumber = -1,
            this.errorCorrectLevel = e,
            this.modules = null,
            this.moduleCount = 0,
            this.dataCache = null,
            this.rsBlocks = null,
            this.totalDataCount = -1,
            this.data = t,
            this.utf8bytes = o(t),
            this.make()
        }
        function a(t, e) {
            if (void 0 == t.length) throw new Error(t.length + "/" + e);
            for (var i = 0; i < t.length && 0 == t[i];) i++;
            this.num = new Array(t.length - i + e);
            for (var n = 0; n < t.length - i; n++) this.num[n] = t[n + i]
        }
        function r() {
            this.buffer = new Array,
            this.length = 0
        }
        var c = i(1),
        h = i(2),
        u = [],
        d = function(t) {
            "string" == typeof t && (t = {
                text: t
            }),
            this.options = c.extend({},
            {
                text: "",
                render: "",
                width: 256,
                height: 256,
                correctLevel: 3,
                background: "#ffffff",
                foreground: "#000000"
            },
            t);
            for (var e = null,
            i = 0,
            n = u.length; n > i; i++) if (u[i].text == this.options.text && u[i].text.correctLevel == this.options.correctLevel) {
                e = u[i].obj;
                break
            }
            if (i == n && (e = new s(this.options.text, this.options.correctLevel), u.push({
                text: this.options.text,
                correctLevel: this.options.correctLevel,
                obj: e
            })), this.options.render) switch (this.options.render) {
            case "canvas":
                return this.createCanvas(e);
            case "table":
                return this.createTable(e);
            case "svg":
                return this.createSVG(e);
            default:
                return this.createDefault(e)
            }
            return this.createDefault(e)
        };
        d.prototype.createDefault = function(t) {
            var e = document.createElement("canvas");
            return e.getContext ? this.createCanvas(t) : document.createElementNS && document.createElementNS(SVG_NS, "svg").createSVGRect ? this.createSVG(t) : this.createTable(t)
        },
        d.prototype.createCanvas = function(t) {
            var e = document.createElement("canvas");
            e.width = this.options.width,
            e.height = this.options.height;
            for (var i = e.getContext("2d"), n = (this.options.width / t.getModuleCount()).toPrecision(4), o = this.options.height / t.getModuleCount().toPrecision(4), s = 0; s < t.getModuleCount(); s++) for (var a = 0; a < t.getModuleCount(); a++) {
                i.fillStyle = t.modules[s][a] ? this.options.foreground: this.options.background;
                var r = Math.ceil((a + 1) * n) - Math.floor(a * n),
                l = Math.ceil((s + 1) * n) - Math.floor(s * n);
                i.fillRect(Math.round(a * n), Math.round(s * o), r, l)
            }
            return e
        },
        d.prototype.createTable = function(t) {
            var e = [];
            e.push('<table style="border:0px; margin:0px; padding:0px; border-collapse:collapse; background-color: ' + this.options.background + ';">');
            var i = -1,
            n = -1,
            o = -1,
            s = -1;
            i = o = Math.floor(this.options.width / t.getModuleCount()),
            n = s = Math.floor(this.options.height / t.getModuleCount()),
            0 >= o && (i = t.getModuleCount() < 80 ? 2 : 1),
            0 >= s && (n = t.getModuleCount() < 80 ? 2 : 1),
            foreTd = '<td style="border:0px; margin:0px; padding:0px; width:' + i + "px; background-color: " + this.options.foreground + '"></td>',
            backTd = '<td style="border:0px; margin:0px; padding:0px; width:' + i + "px; background-color: " + this.options.background + '"></td>',
            l = t.getModuleCount();
            for (var a = 0; a < l; a++) {
                e.push('<tr style="border:0px; margin:0px; padding:0px; height: ' + n + 'px">');
                for (var r = 0; r < l; r++) e.push(t.modules[a][r] ? foreTd: backTd);
                e.push("</tr>")
            }
            e.push("</table>");
            var c = document.createElement("span");
            return c.innerHTML = e.join(""),
            c.firstChild
        },
        d.prototype.createSVG = function(t) {
            for (var e, i, n, o, s = t.getModuleCount(), a = this.options.height / this.options.width, r = '<svg xmlns="http://www.w3.org/2000/svg" width="' + this.options.width + 'px" height="' + this.options.height + 'px" viewbox="0 0 ' + 10 * s + " " + 10 * s * a + '">', l = "<path ", h = ' style="stroke-width:0.5;stroke:' + this.options.foreground + ";fill:" + this.options.foreground + ';"></path>', u = ' style="stroke-width:0.5;stroke:' + this.options.background + ";fill:" + this.options.background + ';"></path>', d = 0; s > d; d++) for (var p = 0; s > p; p++) e = 10 * p,
            n = 10 * d * a,
            i = 10 * (p + 1),
            o = 10 * (d + 1) * a,
            r += l + 'd="M ' + e + "," + n + " L " + i + "," + n + " L " + i + "," + o + " L " + e + "," + o + ' Z"',
            r += t.modules[d][p] ? h: u;
            return r += "</svg>",
            c(r)[0]
        },
        s.prototype = {
            constructor: s,
            getModuleCount: function() {
                return this.moduleCount
            },
            make: function() {
                this.getRightType(),
                this.dataCache = this.createData(),
                this.createQrcode()
            },
            makeImpl: function(t) {
                this.moduleCount = 4 * this.typeNumber + 17,
                this.modules = new Array(this.moduleCount);
                for (var e = 0; e < this.moduleCount; e++) this.modules[e] = new Array(this.moduleCount);
                this.setupPositionProbePattern(0, 0),
                this.setupPositionProbePattern(this.moduleCount - 7, 0),
                this.setupPositionProbePattern(0, this.moduleCount - 7),
                this.setupPositionAdjustPattern(),
                this.setupTimingPattern(),
                this.setupTypeInfo(!0, t),
                this.typeNumber >= 7 && this.setupTypeNumber(!0),
                this.mapData(this.dataCache, t)
            },
            setupPositionProbePattern: function(t, e) {
                for (var i = -1; 7 >= i; i++) if (! ( - 1 >= t + i || this.moduleCount <= t + i)) for (var n = -1; 7 >= n; n++) - 1 >= e + n || this.moduleCount <= e + n || (i >= 0 && 6 >= i && (0 == n || 6 == n) || n >= 0 && 6 >= n && (0 == i || 6 == i) || i >= 2 && 4 >= i && n >= 2 && 4 >= n ? this.modules[t + i][e + n] = !0 : this.modules[t + i][e + n] = !1)
            },
            createQrcode: function() {
                for (var t = 0,
                e = 0,
                i = null,
                n = 0; 8 > n; n++) {
                    this.makeImpl(n);
                    var o = f.getLostPoint(this); (0 == n || t > o) && (t = o, e = n, i = this.modules)
                }
                this.modules = i,
                this.setupTypeInfo(!1, e),
                this.typeNumber >= 7 && this.setupTypeNumber(!1)
            },
            setupTimingPattern: function() {
                for (var t = 8; t < this.moduleCount - 8; t++) null == this.modules[t][6] && (this.modules[t][6] = t % 2 == 0, null == this.modules[6][t] && (this.modules[6][t] = t % 2 == 0))
            },
            setupPositionAdjustPattern: function() {
                for (var t = f.getPatternPosition(this.typeNumber), e = 0; e < t.length; e++) for (var i = 0; i < t.length; i++) {
                    var n = t[e],
                    o = t[i];
                    if (null == this.modules[n][o]) for (var s = -2; 2 >= s; s++) for (var a = -2; 2 >= a; a++) - 2 == s || 2 == s || -2 == a || 2 == a || 0 == s && 0 == a ? this.modules[n + s][o + a] = !0 : this.modules[n + s][o + a] = !1
                }
            },
            setupTypeNumber: function(t) {
                for (var e = f.getBCHTypeNumber(this.typeNumber), i = 0; 18 > i; i++) {
                    var n = !t && 1 == (e >> i & 1);
                    this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = n,
                    this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = n
                }
            },
            setupTypeInfo: function(t, e) {
                for (var i = p[this.errorCorrectLevel] << 3 | e, n = f.getBCHTypeInfo(i), o = 0; 15 > o; o++) {
                    var s = !t && 1 == (n >> o & 1);
                    6 > o ? this.modules[o][8] = s: 8 > o ? this.modules[o + 1][8] = s: this.modules[this.moduleCount - 15 + o][8] = s;
                    var s = !t && 1 == (n >> o & 1);
                    8 > o ? this.modules[8][this.moduleCount - o - 1] = s: 9 > o ? this.modules[8][15 - o - 1 + 1] = s: this.modules[8][15 - o - 1] = s
                }
                this.modules[this.moduleCount - 8][8] = !t
            },
            createData: function() {
                var t = new r,
                e = this.typeNumber > 9 ? 16 : 8;
                t.put(4, 4),
                t.put(this.utf8bytes.length, e);
                for (var i = 0,
                n = this.utf8bytes.length; n > i; i++) t.put(this.utf8bytes[i], 8);
                for (t.length + 4 <= 8 * this.totalDataCount && t.put(0, 4); t.length % 8 != 0;) t.putBit(!1);
                for (;;) {
                    if (t.length >= 8 * this.totalDataCount) break;
                    if (t.put(s.PAD0, 8), t.length >= 8 * this.totalDataCount) break;
                    t.put(s.PAD1, 8)
                }
                return this.createBytes(t)
            },
            createBytes: function(t) {
                for (var e = 0,
                i = 0,
                n = 0,
                o = this.rsBlock.length / 3,
                s = new Array,
                r = 0; o > r; r++) for (var l = this.rsBlock[3 * r + 0], c = this.rsBlock[3 * r + 1], h = this.rsBlock[3 * r + 2], u = 0; l > u; u++) s.push([h, c]);
                for (var d = new Array(s.length), p = new Array(s.length), m = 0; m < s.length; m++) {
                    var v = s[m][0],
                    g = s[m][1] - v;
                    i = Math.max(i, v),
                    n = Math.max(n, g),
                    d[m] = new Array(v);
                    for (var r = 0; r < d[m].length; r++) d[m][r] = 255 & t.buffer[r + e];
                    e += v;
                    var w = f.getErrorCorrectPolynomial(g),
                    y = new a(d[m], w.getLength() - 1),
                    b = y.mod(w);
                    p[m] = new Array(w.getLength() - 1);
                    for (var r = 0; r < p[m].length; r++) {
                        var T = r + b.getLength() - p[m].length;
                        p[m][r] = T >= 0 ? b.get(T) : 0
                    }
                }
                for (var x = new Array(this.totalDataCount), C = 0, r = 0; i > r; r++) for (var m = 0; m < s.length; m++) r < d[m].length && (x[C++] = d[m][r]);
                for (var r = 0; n > r; r++) for (var m = 0; m < s.length; m++) r < p[m].length && (x[C++] = p[m][r]);
                return x
            },
            mapData: function(t, e) {
                for (var i = -1,
                n = this.moduleCount - 1,
                o = 7,
                s = 0,
                a = this.moduleCount - 1; a > 0; a -= 2) for (6 == a && a--;;) {
                    for (var r = 0; 2 > r; r++) if (null == this.modules[n][a - r]) {
                        var l = !1;
                        s < t.length && (l = 1 == (t[s] >>> o & 1));
                        var c = f.getMask(e, n, a - r);
                        c && (l = !l),
                        this.modules[n][a - r] = l,
                        o--,
                        -1 == o && (s++, o = 7)
                    }
                    if (n += i, 0 > n || this.moduleCount <= n) {
                        n -= i,
                        i = -i;
                        break
                    }
                }
            }
        },
        s.PAD0 = 236,
        s.PAD1 = 17;
        for (var p = [1, 0, 3, 2], m = {
            PATTERN000: 0,
            PATTERN001: 1,
            PATTERN010: 2,
            PATTERN011: 3,
            PATTERN100: 4,
            PATTERN101: 5,
            PATTERN110: 6,
            PATTERN111: 7
        },
        f = {
            PATTERN_POSITION_TABLE: [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]],
            G15: 1335,
            G18: 7973,
            G15_MASK: 21522,
            getBCHTypeInfo: function(t) {
                for (var e = t << 10; f.getBCHDigit(e) - f.getBCHDigit(f.G15) >= 0;) e ^= f.G15 << f.getBCHDigit(e) - f.getBCHDigit(f.G15);
                return (t << 10 | e) ^ f.G15_MASK
            },
            getBCHTypeNumber: function(t) {
                for (var e = t << 12; f.getBCHDigit(e) - f.getBCHDigit(f.G18) >= 0;) e ^= f.G18 << f.getBCHDigit(e) - f.getBCHDigit(f.G18);
                return t << 12 | e
            },
            getBCHDigit: function(t) {
                for (var e = 0; 0 != t;) e++,
                t >>>= 1;
                return e
            },
            getPatternPosition: function(t) {
                return f.PATTERN_POSITION_TABLE[t - 1]
            },
            getMask: function(t, e, i) {
                switch (t) {
                case m.PATTERN000:
                    return (e + i) % 2 == 0;
                case m.PATTERN001:
                    return e % 2 == 0;
                case m.PATTERN010:
                    return i % 3 == 0;
                case m.PATTERN011:
                    return (e + i) % 3 == 0;
                case m.PATTERN100:
                    return (Math.floor(e / 2) + Math.floor(i / 3)) % 2 == 0;
                case m.PATTERN101:
                    return e * i % 2 + e * i % 3 == 0;
                case m.PATTERN110:
                    return (e * i % 2 + e * i % 3) % 2 == 0;
                case m.PATTERN111:
                    return (e * i % 3 + (e + i) % 2) % 2 == 0;
                default:
                    throw new Error("bad maskPattern:" + t)
                }
            },
            getErrorCorrectPolynomial: function(t) {
                for (var e = new a([1], 0), i = 0; t > i; i++) e = e.multiply(new a([1, v.gexp(i)], 0));
                return e
            },
            getLostPoint: function(t) {
                for (var e = t.getModuleCount(), i = 0, n = 0, o = 0; e > o; o++) for (var s = 0,
                a = t.modules[o][0], r = 0; e > r; r++) {
                    var l = t.modules[o][r];
                    if (e - 6 > r && l && !t.modules[o][r + 1] && t.modules[o][r + 2] && t.modules[o][r + 3] && t.modules[o][r + 4] && !t.modules[o][r + 5] && t.modules[o][r + 6] && (e - 10 > r ? t.modules[o][r + 7] && t.modules[o][r + 8] && t.modules[o][r + 9] && t.modules[o][r + 10] && (i += 40) : r > 3 && t.modules[o][r - 1] && t.modules[o][r - 2] && t.modules[o][r - 3] && t.modules[o][r - 4] && (i += 40)), e - 1 > o && e - 1 > r) {
                        var c = 0;
                        l && c++,
                        t.modules[o + 1][r] && c++,
                        t.modules[o][r + 1] && c++,
                        t.modules[o + 1][r + 1] && c++,
                        0 != c && 4 != c || (i += 3)
                    }
                    a ^ l ? s++:(a = l, s >= 5 && (i += 3 + s - 5), s = 1),
                    l && n++
                }
                for (var r = 0; e > r; r++) for (var s = 0,
                a = t.modules[0][r], o = 0; e > o; o++) {
                    var l = t.modules[o][r];
                    e - 6 > o && l && !t.modules[o + 1][r] && t.modules[o + 2][r] && t.modules[o + 3][r] && t.modules[o + 4][r] && !t.modules[o + 5][r] && t.modules[o + 6][r] && (e - 10 > o ? t.modules[o + 7][r] && t.modules[o + 8][r] && t.modules[o + 9][r] && t.modules[o + 10][r] && (i += 40) : o > 3 && t.modules[o - 1][r] && t.modules[o - 2][r] && t.modules[o - 3][r] && t.modules[o - 4][r] && (i += 40)),
                    a ^ l ? s++:(a = l, s >= 5 && (i += 3 + s - 5), s = 1)
                }
                var h = Math.abs(100 * n / e / e - 50) / 5;
                return i += 10 * h
            }
        },
        v = {
            glog: function(t) {
                if (1 > t) throw new Error("glog(" + t + ")");
                return v.LOG_TABLE[t]
            },
            gexp: function(t) {
                for (; 0 > t;) t += 255;
                for (; t >= 256;) t -= 255;
                return v.EXP_TABLE[t]
            },
            EXP_TABLE: new Array(256),
            LOG_TABLE: new Array(256)
        },
        g = 0; 8 > g; g++) v.EXP_TABLE[g] = 1 << g;
        for (var g = 8; 256 > g; g++) v.EXP_TABLE[g] = v.EXP_TABLE[g - 4] ^ v.EXP_TABLE[g - 5] ^ v.EXP_TABLE[g - 6] ^ v.EXP_TABLE[g - 8];
        for (var g = 0; 255 > g; g++) v.LOG_TABLE[v.EXP_TABLE[g]] = g;
        a.prototype = {
            get: function(t) {
                return this.num[t]
            },
            getLength: function() {
                return this.num.length
            },
            multiply: function(t) {
                for (var e = new Array(this.getLength() + t.getLength() - 1), i = 0; i < this.getLength(); i++) for (var n = 0; n < t.getLength(); n++) e[i + n] ^= v.gexp(v.glog(this.get(i)) + v.glog(t.get(n)));
                return new a(e, 0)
            },
            mod: function(t) {
                var e = this.getLength(),
                i = t.getLength();
                if (0 > e - i) return this;
                for (var n = new Array(e), o = 0; e > o; o++) n[o] = this.get(o);
                for (; n.length >= i;) {
                    for (var s = v.glog(n[0]) - v.glog(t.get(0)), o = 0; o < t.getLength(); o++) n[o] ^= v.gexp(v.glog(t.get(o)) + s);
                    for (; 0 == n[0];) n.shift()
                }
                return new a(n, 0)
            }
        };
        var w = [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16], [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13], [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15], [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12], [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13], [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12], [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16], [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15], [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15], [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14], [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16], [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17], [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13], [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16], [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17], [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16], [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17], [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16], [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16], [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16], [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16], [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16], [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16], [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16], [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17], [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16], [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16], [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16], [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16], [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16], [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]];
        s.prototype.getRightType = function() {
            for (var t = 1; 41 > t; t++) {
                var e = w[4 * (t - 1) + this.errorCorrectLevel];
                if (void 0 == e) throw new Error("bad rs block @ typeNumber:" + t + "/errorCorrectLevel:" + this.errorCorrectLevel);
                for (var i = e.length / 3,
                n = 0,
                o = 0; i > o; o++) {
                    var s = e[3 * o + 0],
                    a = e[3 * o + 2];
                    n += a * s
                }
                var r = t > 9 ? 2 : 1;
                if (this.utf8bytes.length + r < n || 40 == t) {
                    this.typeNumber = t,
                    this.rsBlock = e,
                    this.totalDataCount = n;
                    break
                }
            }
        },
        r.prototype = {
            get: function(t) {
                var e = Math.floor(t / 8);
                return this.buffer[e] >>> 7 - t % 8 & 1
            },
            put: function(t, e) {
                for (var i = 0; e > i; i++) this.putBit(t >>> e - i - 1 & 1)
            },
            putBit: function(t) {
                var e = Math.floor(this.length / 8);
                this.buffer.length <= e && this.buffer.push(0),
                t && (this.buffer[e] |= 128 >>> this.length % 8),
                this.length++
            }
        },
        s.prototype = {
            constructor: s,
            getModuleCount: function() {
                return this.moduleCount
            },
            make: function() {
                this.getRightType(),
                this.dataCache = this.createData(),
                this.createQrcode()
            },
            makeImpl: function(t) {
                this.moduleCount = 4 * this.typeNumber + 17,
                this.modules = new Array(this.moduleCount);
                for (var e = 0; e < this.moduleCount; e++) this.modules[e] = new Array(this.moduleCount);
                this.setupPositionProbePattern(0, 0),
                this.setupPositionProbePattern(this.moduleCount - 7, 0),
                this.setupPositionProbePattern(0, this.moduleCount - 7),
                this.setupPositionAdjustPattern(),
                this.setupTimingPattern(),
                this.setupTypeInfo(!0, t),
                this.typeNumber >= 7 && this.setupTypeNumber(!0),
                this.mapData(this.dataCache, t)
            },
            setupPositionProbePattern: function(t, e) {
                for (var i = -1; 7 >= i; i++) if (! ( - 1 >= t + i || this.moduleCount <= t + i)) for (var n = -1; 7 >= n; n++) - 1 >= e + n || this.moduleCount <= e + n || (i >= 0 && 6 >= i && (0 == n || 6 == n) || n >= 0 && 6 >= n && (0 == i || 6 == i) || i >= 2 && 4 >= i && n >= 2 && 4 >= n ? this.modules[t + i][e + n] = !0 : this.modules[t + i][e + n] = !1)
            },
            createQrcode: function() {
                for (var t = 0,
                e = 0,
                i = null,
                n = 0; 8 > n; n++) {
                    this.makeImpl(n);
                    var o = f.getLostPoint(this); (0 == n || t > o) && (t = o, e = n, i = this.modules)
                }
                this.modules = i,
                this.setupTypeInfo(!1, e),
                this.typeNumber >= 7 && this.setupTypeNumber(!1)
            },
            setupTimingPattern: function() {
                for (var t = 8; t < this.moduleCount - 8; t++) null == this.modules[t][6] && (this.modules[t][6] = t % 2 == 0, null == this.modules[6][t] && (this.modules[6][t] = t % 2 == 0))
            },
            setupPositionAdjustPattern: function() {
                for (var t = f.getPatternPosition(this.typeNumber), e = 0; e < t.length; e++) for (var i = 0; i < t.length; i++) {
                    var n = t[e],
                    o = t[i];
                    if (null == this.modules[n][o]) for (var s = -2; 2 >= s; s++) for (var a = -2; 2 >= a; a++) - 2 == s || 2 == s || -2 == a || 2 == a || 0 == s && 0 == a ? this.modules[n + s][o + a] = !0 : this.modules[n + s][o + a] = !1
                }
            },
            setupTypeNumber: function(t) {
                for (var e = f.getBCHTypeNumber(this.typeNumber), i = 0; 18 > i; i++) {
                    var n = !t && 1 == (e >> i & 1);
                    this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = n,
                    this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = n
                }
            },
            setupTypeInfo: function(t, e) {
                for (var i = p[this.errorCorrectLevel] << 3 | e, n = f.getBCHTypeInfo(i), o = 0; 15 > o; o++) {
                    var s = !t && 1 == (n >> o & 1);
                    6 > o ? this.modules[o][8] = s: 8 > o ? this.modules[o + 1][8] = s: this.modules[this.moduleCount - 15 + o][8] = s;
                    var s = !t && 1 == (n >> o & 1);
                    8 > o ? this.modules[8][this.moduleCount - o - 1] = s: 9 > o ? this.modules[8][15 - o - 1 + 1] = s: this.modules[8][15 - o - 1] = s
                }
                this.modules[this.moduleCount - 8][8] = !t
            },
            createData: function() {
                var t = new r,
                e = this.typeNumber > 9 ? 16 : 8;
                t.put(4, 4),
                t.put(this.utf8bytes.length, e);
                for (var i = 0,
                n = this.utf8bytes.length; n > i; i++) t.put(this.utf8bytes[i], 8);
                for (t.length + 4 <= 8 * this.totalDataCount && t.put(0, 4); t.length % 8 != 0;) t.putBit(!1);
                for (;;) {
                    if (t.length >= 8 * this.totalDataCount) break;
                    if (t.put(s.PAD0, 8), t.length >= 8 * this.totalDataCount) break;
                    t.put(s.PAD1, 8)
                }
                return this.createBytes(t)
            },
            createBytes: function(t) {
                for (var e = 0,
                i = 0,
                n = 0,
                o = this.rsBlock.length / 3,
                s = new Array,
                r = 0; o > r; r++) for (var l = this.rsBlock[3 * r + 0], c = this.rsBlock[3 * r + 1], h = this.rsBlock[3 * r + 2], u = 0; l > u; u++) s.push([h, c]);
                for (var d = new Array(s.length), p = new Array(s.length), m = 0; m < s.length; m++) {
                    var v = s[m][0],
                    g = s[m][1] - v;
                    i = Math.max(i, v),
                    n = Math.max(n, g),
                    d[m] = new Array(v);
                    for (var r = 0; r < d[m].length; r++) d[m][r] = 255 & t.buffer[r + e];
                    e += v;
                    var w = f.getErrorCorrectPolynomial(g),
                    y = new a(d[m], w.getLength() - 1),
                    b = y.mod(w);
                    p[m] = new Array(w.getLength() - 1);
                    for (var r = 0; r < p[m].length; r++) {
                        var T = r + b.getLength() - p[m].length;
                        p[m][r] = T >= 0 ? b.get(T) : 0
                    }
                }
                for (var x = new Array(this.totalDataCount), C = 0, r = 0; i > r; r++) for (var m = 0; m < s.length; m++) r < d[m].length && (x[C++] = d[m][r]);
                for (var r = 0; n > r; r++) for (var m = 0; m < s.length; m++) r < p[m].length && (x[C++] = p[m][r]);
                return x
            },
            mapData: function(t, e) {
                for (var i = -1,
                n = this.moduleCount - 1,
                o = 7,
                s = 0,
                a = this.moduleCount - 1; a > 0; a -= 2) for (6 == a && a--;;) {
                    for (var r = 0; 2 > r; r++) if (null == this.modules[n][a - r]) {
                        var l = !1;
                        s < t.length && (l = 1 == (t[s] >>> o & 1));
                        var c = f.getMask(e, n, a - r);
                        c && (l = !l),
                        this.modules[n][a - r] = l,
                        o--,
                        -1 == o && (s++, o = 7)
                    }
                    if (n += i, 0 > n || this.moduleCount <= n) {
                        n -= i,
                        i = -i;
                        break
                    }
                }
            }
        },
        s.PAD0 = 236,
        s.PAD1 = 17;
        for (var p = [1, 0, 3, 2], m = {
            PATTERN000: 0,
            PATTERN001: 1,
            PATTERN010: 2,
            PATTERN011: 3,
            PATTERN100: 4,
            PATTERN101: 5,
            PATTERN110: 6,
            PATTERN111: 7
        },
        f = {
            PATTERN_POSITION_TABLE: [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]],
            G15: 1335,
            G18: 7973,
            G15_MASK: 21522,
            getBCHTypeInfo: function(t) {
                for (var e = t << 10; f.getBCHDigit(e) - f.getBCHDigit(f.G15) >= 0;) e ^= f.G15 << f.getBCHDigit(e) - f.getBCHDigit(f.G15);
                return (t << 10 | e) ^ f.G15_MASK
            },
            getBCHTypeNumber: function(t) {
                for (var e = t << 12; f.getBCHDigit(e) - f.getBCHDigit(f.G18) >= 0;) e ^= f.G18 << f.getBCHDigit(e) - f.getBCHDigit(f.G18);
                return t << 12 | e
            },
            getBCHDigit: function(t) {
                for (var e = 0; 0 != t;) e++,
                t >>>= 1;
                return e
            },
            getPatternPosition: function(t) {
                return f.PATTERN_POSITION_TABLE[t - 1]
            },
            getMask: function(t, e, i) {
                switch (t) {
                case m.PATTERN000:
                    return (e + i) % 2 == 0;
                case m.PATTERN001:
                    return e % 2 == 0;
                case m.PATTERN010:
                    return i % 3 == 0;
                case m.PATTERN011:
                    return (e + i) % 3 == 0;
                case m.PATTERN100:
                    return (Math.floor(e / 2) + Math.floor(i / 3)) % 2 == 0;
                case m.PATTERN101:
                    return e * i % 2 + e * i % 3 == 0;
                case m.PATTERN110:
                    return (e * i % 2 + e * i % 3) % 2 == 0;
                case m.PATTERN111:
                    return (e * i % 3 + (e + i) % 2) % 2 == 0;
                default:
                    throw new Error("bad maskPattern:" + t)
                }
            },
            getErrorCorrectPolynomial: function(t) {
                for (var e = new a([1], 0), i = 0; t > i; i++) e = e.multiply(new a([1, v.gexp(i)], 0));
                return e
            },
            getLostPoint: function(t) {
                for (var e = t.getModuleCount(), i = 0, n = 0, o = 0; e > o; o++) for (var s = 0,
                a = t.modules[o][0], r = 0; e > r; r++) {
                    var l = t.modules[o][r];
                    if (e - 6 > r && l && !t.modules[o][r + 1] && t.modules[o][r + 2] && t.modules[o][r + 3] && t.modules[o][r + 4] && !t.modules[o][r + 5] && t.modules[o][r + 6] && (e - 10 > r ? t.modules[o][r + 7] && t.modules[o][r + 8] && t.modules[o][r + 9] && t.modules[o][r + 10] && (i += 40) : r > 3 && t.modules[o][r - 1] && t.modules[o][r - 2] && t.modules[o][r - 3] && t.modules[o][r - 4] && (i += 40)), e - 1 > o && e - 1 > r) {
                        var c = 0;
                        l && c++,
                        t.modules[o + 1][r] && c++,
                        t.modules[o][r + 1] && c++,
                        t.modules[o + 1][r + 1] && c++,
                        0 != c && 4 != c || (i += 3)
                    }
                    a ^ l ? s++:(a = l, s >= 5 && (i += 3 + s - 5), s = 1),
                    l && n++
                }
                for (var r = 0; e > r; r++) for (var s = 0,
                a = t.modules[0][r], o = 0; e > o; o++) {
                    var l = t.modules[o][r];
                    e - 6 > o && l && !t.modules[o + 1][r] && t.modules[o + 2][r] && t.modules[o + 3][r] && t.modules[o + 4][r] && !t.modules[o + 5][r] && t.modules[o + 6][r] && (e - 10 > o ? t.modules[o + 7][r] && t.modules[o + 8][r] && t.modules[o + 9][r] && t.modules[o + 10][r] && (i += 40) : o > 3 && t.modules[o - 1][r] && t.modules[o - 2][r] && t.modules[o - 3][r] && t.modules[o - 4][r] && (i += 40)),
                    a ^ l ? s++:(a = l, s >= 5 && (i += 3 + s - 5), s = 1)
                }
                var h = Math.abs(100 * n / e / e - 50) / 5;
                return i += 10 * h
            }
        },
        v = {
            glog: function(t) {
                if (1 > t) throw new Error("glog(" + t + ")");
                return v.LOG_TABLE[t]
            },
            gexp: function(t) {
                for (; 0 > t;) t += 255;
                for (; t >= 256;) t -= 255;
                return v.EXP_TABLE[t]
            },
            EXP_TABLE: new Array(256),
            LOG_TABLE: new Array(256)
        },
        g = 0; 8 > g; g++) v.EXP_TABLE[g] = 1 << g;
        for (var g = 8; 256 > g; g++) v.EXP_TABLE[g] = v.EXP_TABLE[g - 4] ^ v.EXP_TABLE[g - 5] ^ v.EXP_TABLE[g - 6] ^ v.EXP_TABLE[g - 8];
        for (var g = 0; 255 > g; g++) v.LOG_TABLE[v.EXP_TABLE[g]] = g;
        a.prototype = {
            get: function(t) {
                return this.num[t]
            },
            getLength: function() {
                return this.num.length
            },
            multiply: function(t) {
                for (var e = new Array(this.getLength() + t.getLength() - 1), i = 0; i < this.getLength(); i++) for (var n = 0; n < t.getLength(); n++) e[i + n] ^= v.gexp(v.glog(this.get(i)) + v.glog(t.get(n)));
                return new a(e, 0)
            },
            mod: function(t) {
                var e = this.getLength(),
                i = t.getLength();
                if (0 > e - i) return this;
                for (var n = new Array(e), o = 0; e > o; o++) n[o] = this.get(o);
                for (; n.length >= i;) {
                    for (var s = v.glog(n[0]) - v.glog(t.get(0)), o = 0; o < t.getLength(); o++) n[o] ^= v.gexp(v.glog(t.get(o)) + s);
                    for (; 0 == n[0];) n.shift()
                }
                return new a(n, 0)
            }
        },
        w = [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16], [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13], [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15], [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12], [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13], [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12], [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16], [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15], [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15], [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14], [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16], [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17], [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13], [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16], [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17], [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16], [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17], [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16], [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16], [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16], [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16], [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16], [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16], [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16], [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17], [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16], [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16], [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16], [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16], [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16], [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]],
        s.prototype.getRightType = function() {
            for (var t = 1; 41 > t; t++) {
                var e = w[4 * (t - 1) + this.errorCorrectLevel];
                if (void 0 == e) throw new Error("bad rs block @ typeNumber:" + t + "/errorCorrectLevel:" + this.errorCorrectLevel);
                for (var i = e.length / 3,
                n = 0,
                o = 0; i > o; o++) {
                    var s = e[3 * o + 0],
                    a = e[3 * o + 2];
                    n += a * s
                }
                var r = t > 9 ? 2 : 1;
                if (this.utf8bytes.length + r < n || 40 == t) {
                    this.typeNumber = t,
                    this.rsBlock = e,
                    this.totalDataCount = n;
                    break
                }
            }
        },
        r.prototype = {
            get: function(t) {
                var e = Math.floor(t / 8);
                return this.buffer[e] >>> 7 - t % 8 & 1
            },
            put: function(t, e) {
                for (var i = 0; e > i; i++) this.putBit(t >>> e - i - 1 & 1)
            },
            putBit: function(t) {
                var e = Math.floor(this.length / 8);
                this.buffer.length <= e && this.buffer.push(0),
                t && (this.buffer[e] |= 128 >>> this.length % 8),
                this.length++
            }
        },
        c.fn.qrcode = function(t) {
            return this.each(function() {
                c(this).append(new d(t))
            })
        },
        t.exports = h.qrcode = d
    },
    function(t, e, i) {
        "use strict";
        var n = i(1),
        o = i(2),
        s = function(t, e) {
            var i = this;
            this.options = n.extend({},
            s.DEFAULTS, e),
            this.$element = n(t),
            this.sticked = null,
            this.inited = null,
            this.$holder = void 0,
            this.$window = n(window).on("scroll.sticky.amui", o.utils.debounce(n.proxy(this.checkPosition, this), 10)).on("resize.sticky.amui orientationchange.sticky.amui", o.utils.debounce(function() {
                i.reset(!0,
                function() {
                    i.checkPosition()
                })
            },
            50)).on("load.sticky.amui", n.proxy(this.checkPosition, this)),
            this.offset = this.$element.offset(),
            this.init()
        };
        s.DEFAULTS = {
            top: 0,
            bottom: 0,
            animation: "",
            className: {
                sticky: "am-sticky",
                resetting: "am-sticky-resetting",
                stickyBtm: "am-sticky-bottom",
                animationRev: "am-animation-reverse"
            }
        },
        s.prototype.init = function() {
            var t = this.check();
            if (!t) return ! 1;
            var e = this.$element,
            i = "";
            n.each(e.css(["marginTop", "marginRight", "marginBottom", "marginLeft"]),
            function(t, e) {
                return i += " " + e
            });
            var o = n('<div class="am-sticky-placeholder"></div>').css({
                height: "absolute" !== e.css("position") ? e.outerHeight() : "",
                "float": "none" != e.css("float") ? e.css("float") : "",
                margin: i
            });
            return this.$holder = e.css("margin", 0).wrap(o).parent(),
            this.inited = 1,
            !0
        },
        s.prototype.reset = function(t, e) {
            var i = this.options,
            n = this.$element,
            s = i.animation ? " am-animation-" + i.animation: "",
            a = function() {
                n.css({
                    position: "",
                    top: "",
                    width: "",
                    left: "",
                    margin: 0
                }),
                n.removeClass([s, i.className.animationRev, i.className.sticky, i.className.resetting].join(" ")),
                this.animating = !1,
                this.sticked = !1,
                this.offset = n.offset(),
                e && e()
            }.bind(this);
            n.addClass(i.className.resetting),
            !t && i.animation && o.support.animation ? (this.animating = !0, n.removeClass(s).one(o.support.animation.end,
            function() {
                a()
            }).width(), n.addClass(s + " " + i.className.animationRev)) : a()
        },
        s.prototype.check = function() {
            if (!this.$element.is(":visible")) return ! 1;
            var t = this.options.media;
            if (t) switch (typeof t) {
            case "number":
                if (window.innerWidth < t) return ! 1;
                break;
            case "string":
                if (window.matchMedia && !window.matchMedia(t).matches) return ! 1
            }
            return ! 0
        },
        s.prototype.checkPosition = function() {
            if (!this.inited) {
                var t = this.init();
                if (!t) return
            }
            var e = this.options,
            i = this.$window.scrollTop(),
            n = e.top,
            o = e.bottom,
            s = this.$element,
            a = e.animation ? " am-animation-" + e.animation: "",
            r = [e.className.sticky, a].join(" ");
            "function" == typeof o && (o = o(this.$element));
            var l = i > this.$holder.offset().top; ! this.sticked && l ? s.addClass(r) : this.sticked && !l && this.reset(),
            this.$holder.css({
                height: s.is(":visible") && "absolute" !== s.css("position") ? s.outerHeight() : ""
            }),
            l && s.css({
                top: n,
                left: this.$holder.offset().left,
                width: this.$holder.width()
            }),
            this.sticked = l
        },
        o.plugin("sticky", s),
        n(window).on("load",
        function() {
            n("[data-am-sticky]").sticky()
        }),
        t.exports = s
    },
    function(t, e, i) {
        "use strict";
        function n(t) {
            var e, i = Array.prototype.slice.call(arguments, 1);
            return this.each(function() {
                var n = o(this),
                a = n.is(".am-tabs") && n || n.closest(".am-tabs"),
                r = a.data("amui.tabs"),
                l = o.extend({},
                s.utils.parseOptions(n.data("amTabs")), o.isPlainObject(t) && t);
                r || a.data("amui.tabs", r = new c(a[0], l)),
                "string" == typeof t && ("open" === t && n.is(".am-tabs-nav a") ? r.open(n) : e = "function" == typeof r[t] ? r[t].apply(r, i) : r[t])
            }),
            void 0 === e ? this: e
        }
        var o = i(1),
        s = i(2),
        a = i(3),
        r = s.support.transition,
        l = s.support.animation,
        c = function(t, e) {
            this.$element = o(t),
            this.options = o.extend({},
            c.DEFAULTS, e || {}),
            this.transitioning = this.activeIndex = null,
            this.refresh(),
            this.init()
        };
        c.DEFAULTS = {
            selector: {
                nav: "> .am-tabs-nav",
                content: "> .am-tabs-bd",
                panel: "> .am-tab-panel"
            },
            activeClass: "am-active"
        },
        c.prototype.refresh = function() {
            var t = this.options.selector;
            this.$tabNav = this.$element.find(t.nav),
            this.$navs = this.$tabNav.find("a"),
            this.$content = this.$element.find(t.content),
            this.$tabPanels = this.$content.find(t.panel);
            var e = this.$tabNav.find("> ." + this.options.activeClass);
            1 !== e.length ? this.open(0) : this.activeIndex = this.$navs.index(e.children("a"))
        },
        c.prototype.init = function() {
            var t = this,
            e = this.options;
            if (this.$element.on("click.tabs.amui", e.selector.nav + " a",
            function(e) {
                e.preventDefault(),
                t.open(o(this))
            }), !e.noSwipe) {
                if (!this.$content.length) return this;
                var i = new a.Manager(this.$content[0]),
                n = new a.Swipe({
                    direction: a.DIRECTION_HORIZONTAL
                });
                i.add(n),
                i.on("swipeleft", s.utils.debounce(function(e) {
                    e.preventDefault(),
                    t.goTo("next")
                },
                100)),
                i.on("swiperight", s.utils.debounce(function(e) {
                    e.preventDefault(),
                    t.goTo("prev")
                },
                100)),
                this._hammer = i
            }
        },
        c.prototype.open = function(t) {
            var e = this.options.activeClass,
            i = "number" == typeof t ? t: this.$navs.index(o(t));
            if (t = "number" == typeof t ? this.$navs.eq(i) : o(t), t && t.length && !this.transitioning && !t.parent("li").hasClass(e)) {
                var n = this.$tabNav,
                s = t.attr("href"),
                a = /^#.+$/,
                r = a.test(s) && this.$content.find(s) || this.$tabPanels.eq(i),
                l = n.find("." + e + " a")[0],
                c = o.Event("open.tabs.amui", {
                    relatedTarget: l
                });
                t.trigger(c),
                c.isDefaultPrevented() || (this.activate(t.closest("li"), n), this.activate(r, this.$content,
                function() {
                    t.trigger({
                        type: "opened.tabs.amui",
                        relatedTarget: l
                    })
                }), this.activeIndex = i)
            }
        },
        c.prototype.activate = function(t, e, i) {
            this.transitioning = !0;
            var n = this.options.activeClass,
            s = e.find("> ." + n),
            a = i && r && !!s.length;
            s.removeClass(n + " am-in"),
            t.addClass(n),
            a ? (t.redraw(), t.addClass("am-in")) : t.removeClass("am-fade");
            var l = o.proxy(function() {
                i && i(),
                this.transitioning = !1
            },
            this);
            a ? s.one(r.end, l) : l()
        },
        c.prototype.goTo = function(t) {
            var e = this.activeIndex,
            i = "next" === t,
            n = i ? "am-animation-right-spring": "am-animation-left-spring";
            if (i && e + 1 >= this.$navs.length || !i && 0 === e) {
                var o = this.$tabPanels.eq(e);
                l && o.addClass(n).on(l.end,
                function() {
                    o.removeClass(n)
                })
            } else this.open(i ? e + 1 : e - 1)
        },
        c.prototype.destroy = function() {
            this.$element.off(".tabs.amui"),
            a.off(this.$content[0], "swipeleft swiperight"),
            this._hammer && this._hammer.destroy(),
            o.removeData(this.$element, "amui.tabs")
        },
        o.fn.tabs = n,
        s.ready(function(t) {
            o("[data-am-tabs]", t).tabs()
        }),
        o(document).on("click.tabs.amui.data-api", "[data-am-tabs] .am-tabs-nav a",
        function(t) {
            t.preventDefault(),
            n.call(o(this), "open")
        }),
        t.exports = s.tabs = c
    },
    function(t, e, i) {
        "use strict";
        var n = i(1),
        o = i(2),
        s = function(t, e) {
            this.options = n.extend({},
            s.DEFAULTS, e),
            this.$element = n(t),
            this.init()
        };
        s.DEFAULTS = {
            checkboxClass: "am-ucheck-checkbox",
            radioClass: "am-ucheck-radio",
            checkboxTpl: '<span class="am-ucheck-icons"><i class="am-icon-unchecked"></i><i class="am-icon-checked"></i></span>',
            radioTpl: '<span class="am-ucheck-icons"><i class="am-icon-unchecked"></i><i class="am-icon-checked"></i></span>'
        },
        s.prototype.init = function() {
            var t = this.$element,
            e = t[0],
            i = this.options;
            "checkbox" === e.type ? t.addClass(i.checkboxClass).after(i.checkboxTpl) : "radio" === e.type && t.addClass(i.radioClass).after(i.radioTpl)
        },
        s.prototype.check = function() {
            this.$element.prop("checked", !0).trigger("change.ucheck.amui").trigger("checked.ucheck.amui")
        },
        s.prototype.uncheck = function() {
            this.$element.prop("checked", !1).trigger("change").trigger("unchecked.ucheck.amui")
        },
        s.prototype.toggle = function() {
            this.$element.prop("checked",
            function(t, e) {
                return ! e
            }).trigger("change.ucheck.amui").trigger("toggled.ucheck.amui")
        },
        s.prototype.disable = function() {
            this.$element.prop("disabled", !0).trigger("change.ucheck.amui").trigger("disabled.ucheck.amui")
        },
        s.prototype.enable = function() {
            this.$element.prop("disabled", !1),
            this.$element.trigger("change.ucheck.amui").trigger("enabled.ucheck.amui")
        },
        s.prototype.destroy = function() {
            this.$element.removeData("amui.ucheck").removeClass(this.options.checkboxClass + " " + this.options.radioClass).next(".am-ucheck-icons").remove().end().trigger("destroyed.ucheck.amui")
        },
        o.plugin("uCheck", s, {
            after: function() {
                o.support.touch && this.parent().hover(function() {
                    n(this).addClass("am-nohover")
                },
                function() {
                    n(this).removeClass("am-nohover")
                })
            }
        }),
        o.ready(function(t) {
            n("[data-am-ucheck]", t).uCheck()
        }),
        t.exports = s
    },
    function(t, e, i) {
        "use strict";
        var n = i(1),
        o = i(2),
        s = function(t, e) {
            this.options = n.extend({},
            s.DEFAULTS, e),
            this.options.patterns = n.extend({},
            s.patterns, this.options.patterns);
            var i = this.options.locales; ! s.validationMessages[i] && (this.options.locales = "zh_CN"),
            this.$element = n(t),
            this.init()
        };
        s.DEFAULTS = {
            debug: !1,
            locales: "zh_CN",
            H5validation: !1,
            H5inputType: ["email", "url", "number"],
            patterns: {},
            patternClassPrefix: "js-pattern-",
            activeClass: "am-active",
            inValidClass: "am-field-error",
            validClass: "am-field-valid",
            validateOnSubmit: !0,
            alwaysRevalidate: !1,
            allFields: ":input:not(:submit, :button, :disabled, .am-novalidate)",
            ignore: ":hidden:not([data-am-selected], .am-validate)",
            customEvents: "validate",
            keyboardFields: ":input:not(:submit, :button, :disabled, .am-novalidate)",
            keyboardEvents: "focusout, change",
            activeKeyup: !1,
            textareaMaxlenthKeyup: !0,
            pointerFields: 'input[type="range"]:not(:disabled, .am-novalidate), input[type="radio"]:not(:disabled, .am-novalidate), input[type="checkbox"]:not(:disabled, .am-novalidate), select:not(:disabled, .am-novalidate), option:not(:disabled, .am-novalidate)',
            pointerEvents: "click",
            onValid: function(t) {},
            onInValid: function(t) {},
            markValid: function(t) {
                var e = this.options,
                i = n(t.field),
                o = i.closest(".am-form-group");
                i.addClass(e.validClass).removeClass(e.inValidClass),
                o.addClass("am-form-success").removeClass("am-form-error"),
                e.onValid.call(this, t)
            },
            markInValid: function(t) {
                var e = this.options,
                i = n(t.field),
                o = i.closest(".am-form-group");
                i.addClass(e.inValidClass + " " + e.activeClass).removeClass(e.validClass),
                o.addClass("am-form-error").removeClass("am-form-success"),
                e.onInValid.call(this, t)
            },
            validate: function(t) {},
            submit: null
        },
        s.VERSION = "2.6.2",
        s.patterns = {
            email: /^((([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-zA-Z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/,
            url: /^(https?|ftp):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/,
            number: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/,
            dateISO: /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/,
            integer: /^-?\d+$/
        },
        s.validationMessages = {
            zh_CN: {
                valueMissing: "\u8bf7\u586b\u5199\uff08\u9009\u62e9\uff09\u6b64\u5b57\u6bb5",
                customError: {
                    tooShort: "\u81f3\u5c11\u586b\u5199 %s \u4e2a\u5b57\u7b26",
                    checkedOverflow: "\u81f3\u591a\u9009\u62e9 %s \u9879",
                    checkedUnderflow: "\u81f3\u5c11\u9009\u62e9 %s \u9879"
                },
                patternMismatch: "\u8bf7\u6309\u7167\u8981\u6c42\u7684\u683c\u5f0f\u586b\u5199",
                rangeOverflow: "\u8bf7\u586b\u5199\u5c0f\u4e8e\u7b49\u4e8e %s \u7684\u503c",
                rangeUnderflow: "\u8bf7\u586b\u5199\u5927\u4e8e\u7b49\u4e8e %s \u7684\u503c",
                stepMismatch: "",
                tooLong: "\u81f3\u591a\u586b\u5199 %s \u4e2a\u5b57\u7b26",
                typeMismatch: "\u8bf7\u6309\u7167\u8981\u6c42\u7684\u7c7b\u578b\u586b\u5199"
            }
        },
        s.ERROR_MAP = {
            tooShort: "minlength",
            checkedOverflow: "maxchecked",
            checkedUnderflow: "minchecked",
            rangeOverflow: "max",
            rangeUnderflow: "min",
            tooLong: "maxlength"
        },
        s.prototype.init = function() {
            function t(t) {
                var e = t.toString();
                return e.substring(1, e.length - 1)
            }
            function e(t, e, a) {
                var r = e.split(","),
                l = function(t) {
                    i.validate(this)
                };
                a && (l = o.utils.debounce(l, a)),
                n.each(r,
                function(e, i) {
                    s.on(i + ".validator.amui", t, l)
                })
            }
            var i = this,
            s = this.$element,
            a = this.options;
            return a.H5validation && o.support.formValidation ? !1 : (s.attr("novalidate", "novalidate"), n.each(a.H5inputType,
            function(e, i) {
                var n = s.find("input[type=" + i + "]");
                n.attr("pattern") || n.is("[class*=" + a.patternClassPrefix + "]") || n.attr("pattern", t(a.patterns[i]))
            }), n.each(a.patterns,
            function(e, i) {
                var n = s.find("." + a.patternClassPrefix + e); ! n.attr("pattern") && n.attr("pattern", t(i))
            }), s.on("submit.validator.amui",
            function(t) {
                if ("function" == typeof a.submit) return a.submit.call(i, t);
                if (a.validateOnSubmit) {
                    var e = i.isFormValid();
                    return "boolean" === n.type(e) ? e: s.data("amui.checked") ? !0 : (n.when(e).then(function() {
                        s.data("amui.checked", !0).submit()
                    },
                    function() {
                        s.data("amui.checked", !1).find("." + a.inValidClass).eq(0).focus()
                    }), !1)
                }
            }), e(":input", a.customEvents), e(a.keyboardFields, a.keyboardEvents), e(a.pointerFields, a.pointerEvents), a.textareaMaxlenthKeyup && e("textarea[maxlength]", "keyup", 50), void(a.activeKeyup && e(".am-active", "keyup", 50)))
        },
        s.prototype.isValid = function(t) {
            var e = n(t),
            i = this.options;
            return (void 0 === e.data("validity") || i.alwaysRevalidate) && this.validate(t),
            e.data("validity") && e.data("validity").valid
        },
        s.prototype.validate = function(t) {
            var e = this,
            i = this.$element,
            o = this.options,
            s = n(t),
            a = s.data("equalTo");
            a && s.attr("pattern", "^" + i.find(a).val() + "$");
            var r = s.attr("pattern") || !1,
            l = new RegExp(r),
            c = null,
            h = null,
            u = s.is("[type=checkbox]") ? (h = i.find('input[name="' + t.name + '"]')).filter(":checked").length: s.is("[type=radio]") ? (c = this.$element.find('input[name="' + t.name + '"]')).filter(":checked").length > 0 : s.val();
            s = h && h.length ? h.first() : s;
            var d = void 0 !== s.attr("required") && "false" !== s.attr("required"),
            p = parseInt(s.attr("maxlength"), 10),
            m = parseInt(s.attr("minlength"), 10),
            f = Number(s.attr("min")),
            v = Number(s.attr("max")),
            g = this.createValidity({
                field: s[0],
                valid: !0
            });
            if (o.debug && window.console && (console.log("Validate: value -> [" + u + ", regex -> [" + l + "], required -> " + d), console.log("Regex test: " + l.test(u) + ", Pattern: " + r)), !isNaN(p) && u.length > p && (g.valid = !1, g.tooLong = !0), !isNaN(m) && u.length < m && (g.valid = !1, g.customError = "tooShort"), !isNaN(f) && Number(u) < f && (g.valid = !1, g.rangeUnderflow = !0), !isNaN(v) && Number(u) > v && (g.valid = !1, g.rangeOverflow = !0), d && !u) g.valid = !1,
            g.valueMissing = !0;
            else if ((h || s.is('select[multiple="multiple"]')) && u) {
                u = h ? u: u.length;
                var w = parseInt(s.attr("minchecked"), 10),
                y = parseInt(s.attr("maxchecked"), 10); ! isNaN(w) && w > u && (g.valid = !1, g.customError = "checkedUnderflow"),
                !isNaN(y) && u > y && (g.valid = !1, g.customError = "checkedOverflow")
            } else r && !l.test(u) && u && (g.valid = !1, g.patternMismatch = !0);
            var b, T = function(t) {
                this.markField(t);
                var i = n.Event("validated.field.validator.amui");
                i.validity = t,
                s.trigger(i).data("validity", t);
                var o = c || h;
                return o && o.not(s).data("validity", t).each(function() {
                    t.field = this,
                    e.markField(t)
                }),
                t
            };
            if ("function" == typeof o.validate && (b = o.validate.call(this, g)), b) {
                var x = new n.Deferred;
                return s.data("amui.dfdValidity", x.promise()),
                n.when(b).always(function(t) {
                    x[t.valid ? "resolve": "reject"](t),
                    T.call(e, t)
                })
            }
            T.call(this, g)
        },
        s.prototype.markField = function(t) {
            var e = this.options,
            i = "mark" + (t.valid ? "": "In") + "Valid";
            e[i] && e[i].call(this, t)
        },
        s.prototype.validateForm = function() {
            var t = this,
            e = this.$element,
            i = this.options,
            o = e.find(i.allFields).not(i.ignore),
            s = [],
            a = !0,
            r = [],
            l = n([]),
            c = [],
            h = !1;
            e.trigger("validate.form.validator.amui");
            var u = o.filter(function(t) {
                var e;
                if ("INPUT" === this.tagName && "radio" === this.type) {
                    if (e = this.name, s[e] === !0) return ! 1;
                    s[e] = !0
                }
                return ! 0
            });
            u.each(function() {
                var i = n(this),
                o = t.isValid(this),
                s = i.data("validity");
                a = !!o && a,
                r.push(s),
                o || (l = l.add(n(this), e));
                var u = i.data("amui.dfdValidity");
                if (u) c.push(u),
                h = !0;
                else {
                    var d = new n.Deferred;
                    c.push(d.promise()),
                    d[o ? "resolve": "reject"](s)
                }
            });
            var d = {
                valid: a,
                $invalidFields: l,
                validity: r,
                promises: c,
                async: h
            };
            return e.trigger("validated.form.validator.amui", d),
            d
        },
        s.prototype.isFormValid = function() {
            var t = this,
            e = this.validateForm(),
            i = function(e) {
                t.$element.trigger(e + ".validator.amui")
            };
            if (e.async) {
                var o = new n.Deferred;
                return n.when.apply(null, e.promises).then(function() {
                    o.resolve(),
                    i("valid")
                },
                function() {
                    o.reject(),
                    i("invalid")
                }),
                o.promise()
            }
            if (!e.valid) {
                var s = e.$invalidFields.first();
                return s.is("[data-am-selected]") && (s = s.next(".am-selected").find(".am-selected-btn")),
                s.focus(),
                i("invalid"),
                !1
            }
            return i("valid"),
            !0
        },
        s.prototype.createValidity = function(t) {
            return n.extend({
                customError: t.customError || !1,
                patternMismatch: t.patternMismatch || !1,
                rangeOverflow: t.rangeOverflow || !1,
                rangeUnderflow: t.rangeUnderflow || !1,
                stepMismatch: t.stepMismatch || !1,
                tooLong: t.tooLong || !1,
                typeMismatch: t.typeMismatch || !1,
                valid: t.valid || !0,
                valueMissing: t.valueMissing || !1
            },
            t)
        },
        s.prototype.getValidationMessage = function(t) {
            var e, i, o = s.validationMessages[this.options.locales],
            a = "%s",
            r = n(t.field);
            return (r.is('[type="checkbox"]') || r.is('[type="radio"]')) && (r = this.$element.find("[name=" + r.attr("name") + "]").first()),
            n.each(t,
            function(t, i) {
                return "field" === t || "valid" === t ? t: "customError" === t && i ? (e = i, o = o.customError, !1) : i === !0 ? (e = t, !1) : void 0
            }),
            i = o[e] || void 0,
            i && s.ERROR_MAP[e] && (i = i.replace(a, r.attr(s.ERROR_MAP[e]) || "\u89c4\u5b9a\u7684")),
            i
        },
        s.prototype.removeMark = function() {
            this.$element.find(".am-form-success, .am-form-error, ." + this.options.inValidClass + ", ." + this.options.validClass).removeClass(["am-form-success", "am-form-error", this.options.inValidClass, this.options.validClass].join(" "))
        },
        s.prototype.destroy = function() {
            this.removeMark(),
            this.$element.removeData("amui.validator amui.checked").off(".validator.amui").find(this.options.allFields).removeData("validity amui.dfdValidity")
        },
        o.plugin("validator", s),
        o.ready(function(t) {
            n("[data-am-validator]", t).validator()
        }),
        t.exports = s
    },
    function(t, e, i) {
        "use strict";
        var n = i(2),
        o = {
            get: function(t) {
                var e, i = encodeURIComponent(t) + "=",
                n = document.cookie.indexOf(i),
                o = null;
                return n > -1 && (e = document.cookie.indexOf(";", n), -1 == e && (e = document.cookie.length), o = decodeURIComponent(document.cookie.substring(n + i.length, e))),
                o
            },
            set: function(t, e, i, n, o, s) {
                var a = encodeURIComponent(t) + "=" + encodeURIComponent(e);
                i instanceof Date && (a += "; expires=" + i.toUTCString()),
                n && (a += "; path=" + n),
                o && (a += "; domain=" + o),
                s && (a += "; secure"),
                document.cookie = a
            },
            unset: function(t, e, i, n) {
                this.set(t, "", new Date(0), e, i, n)
            }
        };
        n.utils = n.utils || {},
        t.exports = n.utils.cookie = o
    },
    function(t, e, i) {
        "use strict";
        var n = i(2),
        o = function() {
            var t = "undefined" != typeof Element && "ALLOW_KEYBOARD_INPUT" in Element,
            e = function() {
                for (var t, e, i = [["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror"], ["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror"], ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitfullscreenerror"], ["mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror"], ["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError"]], n = 0, o = i.length, s = {}; o > n; n++) if (t = i[n], t && t[1] in document) {
                    for (n = 0, e = t.length; e > n; n++) s[i[0][n]] = t[n];
                    return s
                }
                return ! 1
            } (),
            i = {
                request: function(i) {
                    var n = e.requestFullscreen;
                    i = i || document.documentElement,
                    /5\.1[\.\d]* Safari/.test(navigator.userAgent) ? i[n]() : i[n](t && Element.ALLOW_KEYBOARD_INPUT)
                },
                exit: function() {
                    document[e.exitFullscreen]()
                },
                toggle: function(t) {
                    this.isFullscreen ? this.exit() : this.request(t)
                },
                raw: e
            };
            return e ? (Object.defineProperties(i, {
                isFullscreen: {
                    get: function() {
                        return !! document[e.fullscreenElement]
                    }
                },
                element: {
                    enumerable: !0,
                    get: function() {
                        return document[e.fullscreenElement]
                    }
                },
                enabled: {
                    enumerable: !0,
                    get: function() {
                        return !! document[e.fullscreenEnabled]
                    }
                }
            }), i.VERSION = "3.0.0", i) : !1
        } ();
        t.exports = n.fullscreen = o
    },
    function(t, e, i) {
        "use strict";
        var n = i(1),
        o = i(2);
        o.support.geolocation = window.navigator && window.navigator.geolocation;
        var s = o.support.geolocation,
        a = function(t) {
            this.options = t || {}
        };
        a.MESSAGES = {
            unsupportedBrowser: "Browser does not support location services",
            permissionDenied: "You have rejected access to your location",
            positionUnavailable: "Unable to determine your location",
            timeout: "Service timeout has been reached"
        },
        a.ERROR_CODE = {
            0 : "unsupportedBrowser",
            1 : "permissionDenied",
            2 : "positionUnavailable",
            3 : "timeout"
        },
        a.prototype.get = function(t) {
            var e = this;
            t = n.extend({},
            this.options, t);
            var i = new n.Deferred;
            return s ? this.watchID = s.getCurrentPosition(function(t) {
                i.resolve.call(e, t)
            },
            function(t) {
                i.reject(a.MESSAGES[a.ERROR_CODE[t.code]])
            },
            t) : i.reject(a.MESSAGES.unsupportedBrowser),
            i.promise()
        },
        a.prototype.watch = function(t) {
            if (s && (t = n.extend({},
            this.options, t), n.isFunction(t.done))) {
                this.clearWatch();
                var e = n.isFunction(t.fail) ? t.fail: null;
                return this.watchID = s.watchPosition(t.done, e, t),
                this.watchID
            }
        },
        a.prototype.clearWatch = function() {
            s && this.watchID && (s.clearWatch(this.watchID), this.watchID = null)
        },
        t.exports = o.Geolocation = a
    },
    function(t, e, i) { (function(e) {
            "use strict";
            function n() {
                try {
                    return l in r && r[l]
                } catch(t) {
                    return ! 1
                }
            }
            var o, s = i(2),
            a = {},
            r = "undefined" != typeof window ? window: e,
            l = "localStorage";
            a.disabled = !1,
            a.version = "1.3.20",
            a.set = function(t, e) {},
            a.get = function(t, e) {},
            a.has = function(t) {
                return void 0 !== a.get(t)
            },
            a.remove = function(t) {},
            a.clear = function() {},
            a.transact = function(t, e, i) {
                null == i && (i = e, e = null),
                null == e && (e = {});
                var n = a.get(t, e);
                i(n),
                a.set(t, n)
            },
            a.getAll = function() {},
            a.forEach = function() {},
            a.serialize = function(t) {
                return JSON.stringify(t)
            },
            a.deserialize = function(t) {
                if ("string" == typeof t) try {
                    return JSON.parse(t)
                } catch(e) {
                    return t || void 0
                }
            },
            n() && (o = r[l], a.set = function(t, e) {
                return void 0 === e ? a.remove(t) : (o.setItem(t, a.serialize(e)), e)
            },
            a.get = function(t, e) {
                var i = a.deserialize(o.getItem(t));
                return void 0 === i ? e: i
            },
            a.remove = function(t) {
                o.removeItem(t)
            },
            a.clear = function() {
                o.clear()
            },
            a.getAll = function() {
                var t = {};
                return a.forEach(function(e, i) {
                    t[e] = i
                }),
                t
            },
            a.forEach = function(t) {
                for (var e = 0; e < o.length; e++) {
                    var i = o.key(e);
                    t(i, a.get(i))
                }
            });
            try {
                var c = "__storejs__";
                a.set(c, c),
                a.get(c) != c && (a.disabled = !0),
                a.remove(c)
            } catch(h) {
                a.disabled = !0
            }
            a.enabled = !a.disabled,
            t.exports = s.store = a
        }).call(e,
        function() {
            return this
        } ())
    },
    function(t, e, i) {
        "use strict";
        function n() {
            var t = o('[data-am-widget="accordion"]'),
            e = {
                item: ".am-accordion-item",
                title: ".am-accordion-title",
                body: ".am-accordion-bd",
                disabled: ".am-disabled"
            };
            t.each(function(t, i) {
                var n = s.utils.parseOptions(o(i).attr("data-am-accordion")),
                a = o(i).find(e.title);
                a.on("click.accordion.amui",
                function() {
                    var t = o(this).next(e.body),
                    s = o(this).parent(e.item),
                    a = t.data("amui.collapse");
                    s.is(e.disabled) || (s.toggleClass("am-active"), a ? t.collapse("toggle") : t.collapse(), !n.multiple && o(i).children(".am-active").not(s).not(e.disabled).removeClass("am-active").find(e.body + ".am-in").collapse("close"))
                })
            })
        }
        var o = i(1),
        s = i(2);
        i(7),
        o(n),
        t.exports = s.accordion = {
            VERSION: "2.1.0",
            init: n
        }
    },
    function(t, e) {
        "use strict";
        t.exports = {
            VERSION: "2.0.1"
        }
    },
    function(t, e, i) {
        "use strict";
        function n() {
            var t = o(".ds-thread"),
            e = t.parent('[data-am-widget="duoshuo"]').attr("data-ds-short-name"),
            i = ("https:" == document.location.protocol ? "https:": "http:") + "//static.duoshuo.com/embed.js";
            if (t.length && e && (window.duoshuoQuery = {
                short_name: e
            },
            !o('script[src="' + i + '"]').length)) {
                var n = o("<script>", {
                    async: !0,
                    type: "text/javascript",
                    src: i,
                    charset: "utf-8"
                });
                o("body").append(n)
            }
        }
        var o = i(1),
        s = i(2);
        o(window).on("load", n),
        t.exports = s.duoshuo = {
            VERSION: "2.0.1",
            init: n
        }
    },
    function(t, e, i) {
        "use strict";
        function n() {
            o(".am-figure").each(function(t, e) {
                var i, n = s.utils.parseOptions(o(e).attr("data-am-figure")),
                a = o(e);
                if (n.pureview) if ("auto" === n.pureview) {
                    var r = o.isImgZoomAble(a.find("img")[0]);
                    r && a.pureview()
                } else a.addClass("am-figure-zoomable").pureview();
                i = a.data("amui.pureview"),
                i && a.on("click", ":not(img)",
                function() {
                    i.open(0)
                })
            })
        }
        var o = i(1),
        s = i(2);
        i(20),
        o.isImgZoomAble = function(t) {
            var e = new Image;
            e.src = t.src;
            var i = o(t).width() < e.width;
            return i && o(t).closest(".am-figure").addClass("am-figure-zoomable"),
            i
        },
        o(window).on("load", n),
        t.exports = s.figure = {
            VERSION: "2.0.3",
            init: n
        }
    },
    function(t, e, i) {
        "use strict";
        function n() {
            o(".am-footer-ysp").on("click",
            function() {
                o("#am-footer-modal").modal()
            });
            var t = s.utils.parseOptions(o(".am-footer").data("amFooter"));
            t.addToHS && a(),
            o('[data-rel="desktop"]').on("click",
            function(t) {
                t.preventDefault(),
                window.AMPlatform ? window.AMPlatform.util.goDesktop() : (r.set("allmobilize", "desktop", "", "/"), window.location = window.location)
            })
        }
        var o = i(1),
        s = i(2);
        i(15);
        var a = i(4),
        r = i(31);
        o(n),
        t.exports = s.footer = {
            VERSION: "3.1.2",
            init: n
        }
    },
    function(t, e, i) {
        "use strict";
        function n() {
            var t = o('[data-am-widget="gallery"]');
            t.each(function() {
                var t = s.utils.parseOptions(o(this).attr("data-am-gallery"));
                t.pureview && ("object" == typeof t.pureview ? o(this).pureview(t.pureview) : o(this).pureview())
            })
        }
        var o = i(1),
        s = i(2);
        i(20),
        o(n),
        t.exports = s.gallery = {
            VERSION: "3.0.0",
            init: n
        }
    },
    function(t, e, i) {
        "use strict";
        function n() {
            function t() {
                i[(n.scrollTop() > 50 ? "add": "remove") + "Class"]("am-active")
            }
            var e = o('[data-am-widget="gotop"]'),
            i = e.filter(".am-gotop-fixed"),
            n = o(window);
            e.data("init") || (e.find("a").on("click",
            function(t) {
                t.preventDefault(),
                n.smoothScroll()
            }), t(), n.on("scroll.gotop.amui", s.utils.debounce(t, 100)), e.data("init", !0))
        }
        var o = i(1),
        s = i(2);
        i(23),
        o(n),
        t.exports = s.gotop = {
            VERSION: "4.0.2",
            init: n
        }
    },
    function(t, e, i) {
        "use strict";
        function n() {
            o('[data-am-widget="header"]').each(function() {
                return o(this).hasClass("am-header-fixed") ? (o("body").addClass("am-with-fixed-header"), !1) : void 0
            })
        }
        var o = i(1),
        s = i(2);
        o(n),
        t.exports = s.header = {
            VERSION: "2.0.0",
            init: n
        }
    },
    function(t, e, i) {
        "use strict";
        var n = i(2);
        t.exports = n.intro = {
            VERSION: "4.0.2",
            init: function() {}
        }
    },
    function(t, e, i) {
        "use strict";
        var n = i(2);
        t.exports = n.listNews = {
            VERSION: "4.0.0",
            init: function() {}
        }
    },
    function(t, e, i) {
        function n(t) {
            var e = s("<script />", {
                id: "am-map-api-0"
            });
            s("body").append(e),
            e.on("load",
            function() {
                console.log("load");
                var e = s("<script/>", {
                    id: "am-map-api-1"
                });
                s("body").append(e),
                e.on("load",
                function() {
                    var e = document.createElement("script");
                    e.textContent = "(" + t.toString() + ")();",
                    s("body")[0].appendChild(e)
                }).attr("src", "http://api.map.baidu.com/getscript?type=quick&file=feature&ak=WVAXZ05oyNRXS5egLImmentg&t=20140109092002")
            }).attr("src", "http://api.map.baidu.com/getscript?type=quick&file=api&ak=WVAXZ05oyNRXS5egLImmentg&t=20140109092002")
        }
        function o() {
            var t = document.querySelector(".am-map"),
            e = 116.331398,
            i = 39.897445,
            n = t.getAttribute("data-name"),
            o = t.getAttribute("data-address"),
            s = t.getAttribute("data-longitude") || e,
            a = t.getAttribute("data-latitude") || i,
            r = t.getAttribute("data-setZoom") || 17,
            l = t.getAttribute("data-icon"),
            c = new BMap.Map("bd-map"),
            h = new BMap.Point(s, a);
            c.centerAndZoom(h, r),
            t.getAttribute("data-zoomControl") && c.addControl(new BMap.ZoomControl),
            t.getAttribute("data-scaleControl") && c.addControl(new BMap.ScaleControl);
            var u = new BMap.Marker(h);
            l && u.setIcon(new BMap.Icon(l, new BMap.Size(40, 40)));
            var d = {
                width: 200,
                title: n
            },
            p = new BMap.InfoWindow("\u5730\u5740\uff1a" + o, d),
            m = new BMap.Geocoder;
            s == e && a == i ? m.getPoint(o,
            function(t) {
                t && (c.centerAndZoom(t, r), u.setPosition(t), c.addOverlay(u), c.openInfoWindow(p, t))
            },
            "") : m.getLocation(h,
            function(t) {
                c.centerAndZoom(h, r),
                u.setPosition(h),
                c.addOverlay(u),
                o ? c.openInfoWindow(p, h) : c.openInfoWindow(new BMap.InfoWindow(o, d), h)
            })
        }
        var s = i(1),
        a = i(2),
        r = function() {
            s(".am-map").length && n(o)
        };
        s(r),
        t.exports = a.map = {
            VERSION: "2.0.2",
            init: r
        }
    },
    function(t, e, i) {
        "use strict";
        function n() {
            if (o("#mechat").length) {
                var t = o('[data-am-widget="mechat"]'),
                e = t.data("am-mechat-unitid"),
                i = o("<script>", {
                    charset: "utf-8",
                    src: "http://mechatim.com/js/unit/button.js?id=" + e
                });
                o("body").append(i)
            }
        }
        var o = i(1),
        s = i(2);
        o(window).on("load", n),
        t.exports = s.mechat = {
            VERSION: "2.0.1",
            init: n
        }
    },
    function(t, e, i) {
        "use strict";
        var n = i(1),
        o = i(2),
        s = i(14);
        i(16),
        i(7);
        var a = function() {
            var t = n('[data-am-widget="menu"]');
            t.find(".am-menu-nav .am-parent > a").on("click",
            function(t) {
                t.preventDefault();
                var e = n(this),
                i = e.parent(),
                o = e.next(".am-menu-sub");
                i.toggleClass("am-open"),
                o.collapse("toggle"),
                i.siblings(".am-parent").removeClass("am-open").children(".am-menu-sub.am-in").collapse("close")
            }),
            t.filter("[data-am-menu-collapse]").find("> .am-menu-toggle").on("click",
            function(t) {
                t.preventDefault();
                var e = n(this),
                i = e.next(".am-menu-nav");
                e.toggleClass("am-active"),
                i.collapse("toggle")
            }),
            t.filter("[data-am-menu-offcanvas]").find("> .am-menu-toggle").on("click",
            function(t) {
                t.preventDefault();
                var e = n(this),
                i = e.next(".am-offcanvas");
                e.toggleClass("am-active"),
                i.offCanvas("open")
            });
            var e = '.am-offcanvas[data-dismiss-on="click"]',
            i = n(e);
            i.find("a").not(".am-parent>a").on("click",
            function(t) {
                n(this).parents(e).offCanvas("close")
            }),
            t.filter(".am-menu-one").each(function(t) {
                var e, i = n(this),
                o = n('<div class="am-menu-nav-sub-wrap"></div>'),
                a = 0,
                r = i.find(".am-menu-nav"),
                l = r.children("li");
                l.filter(".am-parent").each(function(t) {
                    n(this).attr("data-rel", "#am-menu-sub-" + t),
                    n(this).find(".am-menu-sub").attr("id", "am-menu-sub-" + t).appendTo(o)
                }),
                i.append(o),
                r.wrap('<div class="am-menu-nav-wrap" id="am-menu-' + t + '">'),
                l.each(function(t) {
                    a += parseFloat(n(this).css("width"))
                }),
                r.width(a);
                var c = new s("#am-menu-" + t, {
                    eventPassthrough: !0,
                    scrollX: !0,
                    scrollY: !1,
                    preventDefault: !1
                });
                l.on("click",
                function() {
                    var t = n(this);
                    t.addClass("am-active").siblings().removeClass("am-active"),
                    o.find(".am-menu-sub.am-in").collapse("close"),
                    t.is(".am-parent") ? !t.hasClass(".am-open") && o.find(t.attr("data-rel")).collapse("open") : t.siblings().removeClass("am-open"),
                    void 0 === e && (e = n(this).index() ? 0 : 1);
                    var s, a = n(this).index() > e,
                    l = n(this)[a ? "next": "prev"](),
                    h = l.offset() || n(this).offset(),
                    u = i.offset(),
                    d = parseInt(i.css("padding-left")); (a ? h.left + h.width > u.left + u.width: h.left < u.left) && (s = r.offset(), c.scrollTo(a ? u.width - h.left + s.left - h.width - d: s.left - h.left, 0, 400)),
                    e = n(this).index()
                }),
                i.on("touchmove",
                function(t) {
                    t.preventDefault()
                })
            })
        };
        n(a),
        t.exports = o.menu = {
            VERSION: "4.0.3",
            init: a
        }
    },
    function(t, e, i) {
        "use strict";
        function n() {
            function t() {
                h.append(b),
                h.find("li").not(".am-navbar-more").slice(i() - 1).appendTo(y),
                n.append(y)
            }
            function e() {
                return i() >= d ? (b.hide(), void y.find("li").insertBefore(b)) : (!n.find(".am-navbar-actions").length && t(), b.show(), void(h.find("li").length < i() ? y.find("li").slice(0, i() - h.find("li").length).insertBefore(b) : h.find("li").length > i() && (y.find("li").length ? h.find("li").not(b).slice(i() - 1).insertBefore(y.find("li").first()) : h.find("li").not(b).slice(i() - 1).appendTo(y))))
            }
            function i() {
                return Math.floor((l.width() - f) / m)
            }
            var n = o('[data-am-widget="navbar"]');
            if (n.length) {
                var l = o(window),
                c = o("body"),
                h = n.find(".am-navbar-nav"),
                u = n.find("li"),
                d = u.length,
                p = h.attr("class") && parseInt(h.attr("class").match(/am-avg-sm-(\d+)/)[1]) || 3,
                m = 60,
                f = 16,
                v = u.filter("[data-am-navbar-share]"),
                g = u.filter("[data-am-navbar-qrcode]"),
                w = "am-active",
                y = o('<ul class="am-navbar-actions"></ul>', {
                    id: s.utils.generateGUID("am-navbar-actions")
                }),
                b = o('<li class="am-navbar-labels am-navbar-more"><a href="javascript: void(0);"><span class="am-icon-angle-up"></span><span class="am-navbar-label">\u66f4\u591a</span></a></li>');
                if ("fixed" == n.css("position") && c.addClass("am-with-fixed-navbar"), g.length) {
                    var T = "am-navbar-qrcode";
                    if (C = o("#" + T), !C.length) {
                        var x = g.attr("data-am-navbar-qrcode"),
                        C = o('<div class="am-modal am-modal-no-btn" id=""><div class="am-modal-dialog"><div class="am-modal-bd"></div></div></div>', {
                            id: T
                        }),
                        E = C.find(".am-modal-bd");
                        if (x) E.html('<img src="' + x + '"/>');
                        else {
                            var S = new r({
                                render: "canvas",
                                correctLevel: 0,
                                text: window.location.href,
                                width: 200,
                                height: 200,
                                background: "#fff",
                                foreground: "#000"
                            });
                            E.html(S)
                        }
                        c.append(C)
                    }
                    g.on("click",
                    function(t) {
                        t.preventDefault(),
                        C.modal()
                    })
                }
                d > p && d > i() && t(),
                n.on("click.navbar.amui", ".am-navbar-more",
                function(t) {
                    t.preventDefault(),
                    b[y.hasClass(w) ? "removeClass": "addClass"](w),
                    y.toggleClass(w)
                }),
                v.length && v.on("click.navbar.amui",
                function(t) {
                    t.preventDefault(),
                    a.toggle()
                }),
                l.on("resize.navbar.amui orientationchange.navbar.amui", s.utils.debounce(e, 150))
            }
        }
        var o = i(1),
        s = i(2),
        a = i(25),
        r = i(26);
        i(15),
        o(n),
        t.exports = s.navbar = {
            VERSION: "2.0.2",
            init: n
        }
    },
    function(t, e, i) {
        "use strict";
        var n = i(2);
        t.exports = n.pagination = {
            VERSION: "3.0.1"
        }
    },
    function(t, e, i) {
        "use strict";
        function n() {
            var t = o('[data-am-widget="paragraph"]');
            t.each(function(t) {
                var e = o(this),
                i = s.utils.parseOptions(e.attr("data-am-paragraph")),
                n = t;
                i.pureview && e.pureview(),
                i.tableScrollable && e.find("table").each(function(t) {
                    o(this).width() > o(window).width() && o(this).scrollTable(n + "-" + t)
                })
            })
        }
        var o = i(1),
        s = i(2),
        a = i(14);
        i(20),
        o.fn.scrollTable = function(t) {
            var e, i = o(this);
            i.wrap('<div class="am-paragraph-table-container" id="am-paragraph-table-' + t + '"><div class="am-paragraph-table-scroller"></div></div>'),
            e = i.parent(),
            e.width(i.width()),
            e.height(i.height()),
            new a("#am-paragraph-table-" + t, {
                eventPassthrough: !0,
                scrollX: !0,
                scrollY: !1,
                preventDefault: !1
            })
        },
        o(window).on("load", n),
        t.exports = s.paragraph = {
            VERSION: "2.0.1",
            init: n
        }
    },
    function(t, e, i) {
        "use strict";
        function n() {
            var t = o('[data-am-widget="slider"]');
            t.not(".am-slider-manual").each(function(t, e) {
                var i = s.utils.parseOptions(o(e).attr("data-am-slider"));
                o(e).flexslider(i)
            })
        }
        var o = i(1),
        s = i(2);
        i(11),
        o(n),
        t.exports = s.slider = {
            VERSION: "3.0.1",
            init: n
        }
    },
    function(t, e, i) {
        "use strict";
        function n() {
            o('[data-am-widget="tabs"]').each(function() {
                var t = o(this).data("amTabsNoswipe") ? {
                    noSwipe: 1
                }: {};
                o(this).tabs(t)
            })
        }
        var o = i(1),
        s = i(2);
        i(28),
        o(n),
        t.exports = s.tab = {
            VERSION: "4.0.1",
            init: n
        }
    },
    function(t, e, i) {
        "use strict";
        var n = i(2);
        t.exports = n.titlebar = {
            VERSION: "4.0.1"
        }
    },
    function(t, e, i) {
        "use strict";
        function n() {
            var t = o('[data-am-widget="wechatpay"]');
            return a ? void t.on("click", ".am-wechatpay-btn",
            function(t) {
                t.preventDefault();
                var e = s.utils.parseOptions(o(this).parent().data("wechatPay"));
                return window.wx ? void wx.checkJsApi({
                    jsApiList: ["chooseWXPay"],
                    success: function(t) {
                        t.checkResult.chooseWXPay ? wx.chooseWXPay(e) : alert("\u5fae\u4fe1\u7248\u672c\u4e0d\u652f\u6301\u652f\u4ed8\u63a5\u53e3\u6216\u6ca1\u6709\u5f00\u542f\uff01")
                    },
                    fail: function() {
                        alert("\u8c03\u7528 checkJsApi \u63a5\u53e3\u65f6\u53d1\u751f\u9519\u8bef!")
                    }
                }) : void alert("\u6ca1\u6709\u5fae\u4fe1 JS SDK")
            }) : (t.hide(), !1)
        }
        var o = i(1),
        s = i(2),
        a = window.navigator.userAgent.indexOf("MicroMessenger") > -1,
        r = n;
        o(r),
        t.exports = s.pay = {
            VERSION: "1.0.0",
            init: r
        }
    }])
});
