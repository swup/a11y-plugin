(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["SwupA11yPlugin"] = factory();
	else
		root["SwupA11yPlugin"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _index = __webpack_require__(1);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _index2.default; // this is here for webpack to expose SwupPlugin as window.SwupPlugin

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _plugin = __webpack_require__(2);

var _plugin2 = _interopRequireDefault(_plugin);

var _onDemandLiveRegion = __webpack_require__(3);

var _onDemandLiveRegion2 = _interopRequireDefault(_onDemandLiveRegion);

__webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SwupA11yPlugin = function (_Plugin) {
	_inherits(SwupA11yPlugin, _Plugin);

	function SwupA11yPlugin() {
		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, SwupA11yPlugin);

		var _this = _possibleConstructorReturn(this, (SwupA11yPlugin.__proto__ || Object.getPrototypeOf(SwupA11yPlugin)).call(this));

		_this.name = 'SwupA11yPlugin';

		_this.announceVisit = function () {
			requestAnimationFrame(function () {
				_this.announcePageName();
				_this.focusPageContent();
			});
		};

		_this.announcePageName = function () {
			var _this$options = _this.options,
			    contentSelector = _this$options.contentSelector,
			    headingSelector = _this$options.headingSelector,
			    urlTemplate = _this$options.urlTemplate,
			    announcementTemplate = _this$options.announcementTemplate;

			// Default: announce new /path/of/page.html

			var pageName = urlTemplate.replace('{url}', window.location.pathname);

			// Check for title tag
			if (document.title) {
				pageName = document.title;
			}

			// Look for first heading in content container
			var content = document.querySelector(contentSelector);
			if (content) {
				var headings = content.querySelectorAll(headingSelector);
				if (headings && headings.length) {
					var _headings = _slicedToArray(headings, 1),
					    heading = _headings[0];

					pageName = heading.getAttribute('aria-label') || heading.textContent;
				}
			}

			var announcement = announcementTemplate.replace('{title}', pageName.trim());
			_this.liveRegion.say(announcement);
		};

		_this.focusPageContent = function () {
			var content = document.querySelector(_this.options.contentSelector);
			if (content) {
				content.setAttribute('tabindex', '-1');
				content.focus({ preventScroll: true });
			}
		};

		_this.onTransitionStart = function () {
			document.documentElement.setAttribute('aria-busy', 'true');
		};

		_this.onTransitionEnd = function () {
			document.documentElement.removeAttribute('aria-busy');
		};

		_this.options = _extends({
			contentSelector: 'main',
			headingSelector: 'h1, h2, [role=heading]',
			announcementTemplate: 'Navigated to: {title}',
			urlTemplate: 'New page at {url}'
		}, options);

		_this.liveRegion = new _onDemandLiveRegion2.default();
		return _this;
	}

	_createClass(SwupA11yPlugin, [{
		key: 'mount',
		value: function mount() {
			this.swup.on('contentReplaced', this.announceVisit);
			this.swup.on('transitionStart', this.onTransitionStart);
			this.swup.on('transitionEnd', this.onTransitionEnd);
		}
	}, {
		key: 'unmount',
		value: function unmount() {
			this.swup.off('contentReplaced', this.announceVisit);
			this.swup.off('transitionStart', this.onTransitionStart);
			this.swup.off('transitionEnd', this.onTransitionEnd);
		}
	}]);

	return SwupA11yPlugin;
}(_plugin2.default);

exports.default = SwupA11yPlugin;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Plugin = function () {
    function Plugin() {
        _classCallCheck(this, Plugin);

        this.isSwupPlugin = true;
    }

    _createClass(Plugin, [{
        key: "mount",
        value: function mount() {
            // this is mount method rewritten by class extending
            // and is executed when swup is enabled with plugin
        }
    }, {
        key: "unmount",
        value: function unmount() {
            // this is unmount method rewritten by class extending
            // and is executed when swup with plugin is disabled
        }
    }, {
        key: "_beforeMount",
        value: function _beforeMount() {
            // here for any future hidden auto init
        }
    }, {
        key: "_afterUnmount",
        value: function _afterUnmount() {}
        // here for any future hidden auto-cleanup


        // this is here so we can tell if plugin was created by extending this class

    }]);

    return Plugin;
}();

exports.default = Plugin;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* global define */

(function (global) {
  'use strict'

  // Constructor
  function OnDemandLiveRegion (options) {
    options = options || {}

    // The default settings for the module.
    this.settings = {
      level: 'polite',
      parent: 'body',
      idPrefix: 'live-region-',
      delay: 0
    }

    // Overwrite defaults where they are provided in options
    for (var setting in options) {
      if (options.hasOwnProperty(setting)) {
        this.settings[setting] = options[setting]
      }
    }

    // Cast parent as DOM node
    this.settings.parent = document.querySelector(this.settings.parent)
  }

  // 'Say' method
  OnDemandLiveRegion.prototype.say = function (thingToSay, delay) {
    // Get rid of old live region if it exists
    var oldRegion = this.settings.parent.querySelector('[id^="' + this.settings.idPrefix + '"]') || false
    if (oldRegion) {
      this.settings.parent.removeChild(oldRegion)
    }

    // Did an override level get set?
    delay = delay || this.settings.delay

    // Create fresh live region
    this.currentRegion = document.createElement('span')
    this.currentRegion.id = this.settings.idPrefix + Math.floor(Math.random() * 10000)

    // Determine redundant role
    var role = this.settings.level !== 'assertive' ? 'status' : 'alert'

    // Add role and aria-live attribution
    this.currentRegion.setAttribute('aria-live', this.settings.level)
    this.currentRegion.setAttribute('role', role)

    // Hide live region element, but not from assistive technologies
    this.currentRegion.setAttribute('style', 'clip: rect(1px, 1px, 1px, 1px); height: 1px; overflow: hidden; position: absolute; white-space: nowrap; width: 1px')

    // Add live region to its designated parent
    this.settings.parent.appendChild(this.currentRegion)

    // Populate live region to trigger it
    window.setTimeout(function () {
      this.currentRegion.textContent = thingToSay
    }.bind(this), delay)

    return this
  }

  // Export OnDemandLiveRegion
  if ( true && typeof module.exports !== 'undefined') {
    module.exports = OnDemandLiveRegion
  } else if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
      return OnDemandLiveRegion
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
  } else {}
}(this))


/***/ }),
/* 4 */
/***/ (function(module, exports) {

// focus - focusOptions - preventScroll polyfill
(function() {
  if (
    typeof window === "undefined" ||
    typeof document === "undefined" ||
    typeof HTMLElement === "undefined"
  ) {
    return;
  }

  var supportsPreventScrollOption = false;
  try {
    var focusElem = document.createElement("div");
    focusElem.addEventListener(
      "focus",
      function(event) {
        event.preventDefault();
        event.stopPropagation();
      },
      true
    );
    focusElem.focus(
      Object.defineProperty({}, "preventScroll", {
        get: function() {
          supportsPreventScrollOption = true;
        }
      })
    );
  } catch (e) {}

  if (
    HTMLElement.prototype.nativeFocus === undefined &&
    !supportsPreventScrollOption
  ) {
    HTMLElement.prototype.nativeFocus = HTMLElement.prototype.focus;

    var calcScrollableElements = function(element) {
      var parent = element.parentNode;
      var scrollableElements = [];
      var rootScrollingElement =
        document.scrollingElement || document.documentElement;

      while (parent && parent !== rootScrollingElement) {
        if (
          parent.offsetHeight < parent.scrollHeight ||
          parent.offsetWidth < parent.scrollWidth
        ) {
          scrollableElements.push([
            parent,
            parent.scrollTop,
            parent.scrollLeft
          ]);
        }
        parent = parent.parentNode;
      }
      parent = rootScrollingElement;
      scrollableElements.push([parent, parent.scrollTop, parent.scrollLeft]);

      return scrollableElements;
    };

    var restoreScrollPosition = function(scrollableElements) {
      for (var i = 0; i < scrollableElements.length; i++) {
        scrollableElements[i][0].scrollTop = scrollableElements[i][1];
        scrollableElements[i][0].scrollLeft = scrollableElements[i][2];
      }
      scrollableElements = [];
    };

    var patchedFocus = function(args) {
      if (args && args.preventScroll) {
        var evScrollableElements = calcScrollableElements(this);
        this.nativeFocus();
        if (typeof setTimeout === 'function') {
          setTimeout(function () {
            restoreScrollPosition(evScrollableElements);
          }, 0);
        } else {
          restoreScrollPosition(evScrollableElements);          
        }
      }
      else {
        this.nativeFocus();
      }
    };

    HTMLElement.prototype.focus = patchedFocus;
  }
})();


/***/ })
/******/ ]);
});