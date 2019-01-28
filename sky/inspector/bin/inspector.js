(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
			(global.Stats = factory());
}(this, (function () {
	'use strict';

	/**
	 * @author mrdoob / http://mrdoob.com/
	 */

	var Stats = function () {

		var mode = 0;

		var container = document.createElement('div');
		container.style.cssText = 'position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000';
		container.addEventListener('click', function (event) {

			event.preventDefault();
			showPanel(++mode % container.children.length);

		}, false);

		//

		function addPanel(panel) {

			container.appendChild(panel.dom);
			return panel;

		}

		function showPanel(id) {

			for (var i = 0; i < container.children.length; i++) {

				container.children[i].style.display = i === id ? 'block' : 'none';

			}

			mode = id;

		}

		//

		var beginTime = (performance || Date).now(), prevTime = beginTime, frames = 0;

		var fpsPanel = addPanel(new Stats.Panel('FPS', '#0ff', '#002'));
		var msPanel = addPanel(new Stats.Panel('MS', '#0f0', '#020'));

		if (self.performance && self.performance.memory) {

			var memPanel = addPanel(new Stats.Panel('MB', '#f08', '#201'));

		}

		showPanel(0);

		return {

			REVISION: 16,

			dom: container,

			addPanel: addPanel,
			showPanel: showPanel,

			begin: function () {

				beginTime = (performance || Date).now();

			},

			end: function () {

				frames++;

				var time = (performance || Date).now();

				msPanel.update(time - beginTime, 200);

				if (time > prevTime + 1000) {

					fpsPanel.update((frames * 1000) / (time - prevTime), 100);

					prevTime = time;
					frames = 0;

					if (memPanel) {

						var memory = performance.memory;
						memPanel.update(memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576);

					}

				}

				return time;

			},

			update: function () {

				beginTime = this.end();

			},

			// Backwards Compatibility

			domElement: container,
			setMode: showPanel

		};

	};

	Stats.Panel = function (name, fg, bg) {

		var min = Infinity, max = 0, round = Math.round;
		var PR = round(window.devicePixelRatio || 1);
		var W = 90;
		var H = 48;
		var B = 2;
		var DG = 15;

		var WIDTH = W * PR, HEIGHT = H * PR,
			TEXT_X = B * PR, TEXT_Y = B * PR,
			GRAPH_X = B * PR, GRAPH_Y = (B + DG) * PR,
			GRAPH_WIDTH = (W - B * 2) * PR, GRAPH_HEIGHT = (H - B * 2 - DG) * PR;

		var canvas = document.createElement('canvas');
		canvas.width = WIDTH;
		canvas.height = HEIGHT;
		canvas.style.cssText = `width:${W}px;height:${H}px`;

		var context = canvas.getContext('2d');
		context.font = 'bold ' + (9 * PR) + 'px Helvetica,Arial,sans-serif';
		context.textBaseline = 'top';

		context.fillStyle = bg;
		context.fillRect(0, 0, WIDTH, HEIGHT);

		context.fillStyle = fg;
		context.fillText(name, TEXT_X, TEXT_Y);
		context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

		context.fillStyle = bg;
		context.globalAlpha = 0.9;
		context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

		return {

			dom: canvas,

			update: function (value, maxValue) {

				min = Math.min(min, value);
				max = Math.max(max, value);

				context.fillStyle = bg;
				context.globalAlpha = 1;
				context.fillRect(0, 0, WIDTH, GRAPH_Y);
				context.fillStyle = fg;
				context.fillText(round(value) + ' ' + name + ' (' + round(min) + '-' + round(max) + ')', TEXT_X, TEXT_Y);

				context.drawImage(canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT);

				context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT);

				context.fillStyle = bg;
				context.globalAlpha = 0.9;
				context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round((1 - (value / maxValue)) * GRAPH_HEIGHT));

			}

		};

	};

	return Stats;

})));
/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.dat = {})));
}(this, (function (exports) { 'use strict';

function ___$insertStyle(css) {
  if (!css) {
    return;
  }
  if (typeof window === 'undefined') {
    return;
  }

  var style = document.createElement('style');

  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  document.head.appendChild(style);

  return css;
}

function colorToString (color, forceCSSHex) {
  var colorFormat = color.__state.conversionName.toString();
  var r = color.r.toFixed(2);
  var g = color.g.toFixed(2);
  var b = color.b.toFixed(2);
  var a = color.a.toFixed(2);
  var h = Math.round(color.h);
  var s = color.s.toFixed(1);
  var v = color.v.toFixed(1);
  if (forceCSSHex || colorFormat === 'THREE_CHAR_HEX' || colorFormat === 'SIX_CHAR_HEX') {
    var str = color.hex.toString(16);
    while (str.length < 6) {
      str = '0' + str;
    }
    return '#' + str;
  } else if (colorFormat === 'CSS_RGB') {
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  } else if (colorFormat === 'CSS_RGBA') {
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  } else if (colorFormat === 'HEX') {
    return '0x' + color.hex.toString(16);
  } else if (colorFormat === 'RGB_ARRAY') {
    return '[' + r + ',' + g + ',' + b + ']';
  } else if (colorFormat === 'RGBA_ARRAY') {
    return '[' + r + ',' + g + ',' + b + ',' + a + ']';
  } else if (colorFormat === 'RGB_OBJ') {
    return '{r:' + r + ',g:' + g + ',b:' + b + '}';
  } else if (colorFormat === 'RGBA_OBJ') {
    return '{r:' + r + ',g:' + g + ',b:' + b + ',a:' + a + '}';
  } else if (colorFormat === 'HSV_OBJ') {
    return '{h:' + h + ',s:' + s + ',v:' + v + '}';
  } else if (colorFormat === 'HSVA_OBJ') {
    return '{h:' + h + ',s:' + s + ',v:' + v + ',a:' + a + '}';
  }
  return 'unknown format';
}

var ARR_EACH = Array.prototype.forEach;
var ARR_SLICE = Array.prototype.slice;
var Common = {
  BREAK: {},
  extend: function extend(target) {
    this.each(ARR_SLICE.call(arguments, 1), function (obj) {
      var keys = this.isObject(obj) ? Object.keys(obj) : [];
      keys.forEach(function (key) {
        if (!this.isUndefined(obj[key])) {
          target[key] = obj[key];
        }
      }.bind(this));
    }, this);
    return target;
  },
  defaults: function defaults(target) {
    this.each(ARR_SLICE.call(arguments, 1), function (obj) {
      var keys = this.isObject(obj) ? Object.keys(obj) : [];
      keys.forEach(function (key) {
        if (this.isUndefined(target[key])) {
          target[key] = obj[key];
        }
      }.bind(this));
    }, this);
    return target;
  },
  compose: function compose() {
    var toCall = ARR_SLICE.call(arguments);
    return function () {
      var args = ARR_SLICE.call(arguments);
      for (var i = toCall.length - 1; i >= 0; i--) {
        args = [toCall[i].apply(this, args)];
      }
      return args[0];
    };
  },
  each: function each(obj, itr, scope) {
    if (!obj) {
      return;
    }
    if (ARR_EACH && obj.forEach && obj.forEach === ARR_EACH) {
      obj.forEach(itr, scope);
    } else if (obj.length === obj.length + 0) {
      var key = void 0;
      var l = void 0;
      for (key = 0, l = obj.length; key < l; key++) {
        if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) {
          return;
        }
      }
    } else {
      for (var _key in obj) {
        if (itr.call(scope, obj[_key], _key) === this.BREAK) {
          return;
        }
      }
    }
  },
  defer: function defer(fnc) {
    setTimeout(fnc, 0);
  },
  debounce: function debounce(func, threshold, callImmediately) {
    var timeout = void 0;
    return function () {
      var obj = this;
      var args = arguments;
      function delayed() {
        timeout = null;
        if (!callImmediately) func.apply(obj, args);
      }
      var callNow = callImmediately || !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(delayed, threshold);
      if (callNow) {
        func.apply(obj, args);
      }
    };
  },
  toArray: function toArray(obj) {
    if (obj.toArray) return obj.toArray();
    return ARR_SLICE.call(obj);
  },
  isUndefined: function isUndefined(obj) {
    return obj === undefined;
  },
  isNull: function isNull(obj) {
    return obj === null;
  },
  isNaN: function (_isNaN) {
    function isNaN(_x) {
      return _isNaN.apply(this, arguments);
    }
    isNaN.toString = function () {
      return _isNaN.toString();
    };
    return isNaN;
  }(function (obj) {
    return isNaN(obj);
  }),
  isArray: Array.isArray || function (obj) {
    return obj.constructor === Array;
  },
  isObject: function isObject(obj) {
    return obj === Object(obj);
  },
  isNumber: function isNumber(obj) {
    return obj === obj + 0;
  },
  isString: function isString(obj) {
    return obj === obj + '';
  },
  isBoolean: function isBoolean(obj) {
    return obj === false || obj === true;
  },
  isFunction: function isFunction(obj) {
    return Object.prototype.toString.call(obj) === '[object Function]';
  }
};

var INTERPRETATIONS = [
{
  litmus: Common.isString,
  conversions: {
    THREE_CHAR_HEX: {
      read: function read(original) {
        var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
        if (test === null) {
          return false;
        }
        return {
          space: 'HEX',
          hex: parseInt('0x' + test[1].toString() + test[1].toString() + test[2].toString() + test[2].toString() + test[3].toString() + test[3].toString(), 0)
        };
      },
      write: colorToString
    },
    SIX_CHAR_HEX: {
      read: function read(original) {
        var test = original.match(/^#([A-F0-9]{6})$/i);
        if (test === null) {
          return false;
        }
        return {
          space: 'HEX',
          hex: parseInt('0x' + test[1].toString(), 0)
        };
      },
      write: colorToString
    },
    CSS_RGB: {
      read: function read(original) {
        var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
        if (test === null) {
          return false;
        }
        return {
          space: 'RGB',
          r: parseFloat(test[1]),
          g: parseFloat(test[2]),
          b: parseFloat(test[3])
        };
      },
      write: colorToString
    },
    CSS_RGBA: {
      read: function read(original) {
        var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
        if (test === null) {
          return false;
        }
        return {
          space: 'RGB',
          r: parseFloat(test[1]),
          g: parseFloat(test[2]),
          b: parseFloat(test[3]),
          a: parseFloat(test[4])
        };
      },
      write: colorToString
    }
  }
},
{
  litmus: Common.isNumber,
  conversions: {
    HEX: {
      read: function read(original) {
        return {
          space: 'HEX',
          hex: original,
          conversionName: 'HEX'
        };
      },
      write: function write(color) {
        return color.hex;
      }
    }
  }
},
{
  litmus: Common.isArray,
  conversions: {
    RGB_ARRAY: {
      read: function read(original) {
        if (original.length !== 3) {
          return false;
        }
        return {
          space: 'RGB',
          r: original[0],
          g: original[1],
          b: original[2]
        };
      },
      write: function write(color) {
        return [color.r, color.g, color.b];
      }
    },
    RGBA_ARRAY: {
      read: function read(original) {
        if (original.length !== 4) return false;
        return {
          space: 'RGB',
          r: original[0],
          g: original[1],
          b: original[2],
          a: original[3]
        };
      },
      write: function write(color) {
        return [color.r, color.g, color.b, color.a];
      }
    }
  }
},
{
  litmus: Common.isObject,
  conversions: {
    RGBA_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.r) && Common.isNumber(original.g) && Common.isNumber(original.b) && Common.isNumber(original.a)) {
          return {
            space: 'RGB',
            r: original.r,
            g: original.g,
            b: original.b,
            a: original.a
          };
        }
        return false;
      },
      write: function write(color) {
        return {
          r: color.r,
          g: color.g,
          b: color.b,
          a: color.a
        };
      }
    },
    RGB_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.r) && Common.isNumber(original.g) && Common.isNumber(original.b)) {
          return {
            space: 'RGB',
            r: original.r,
            g: original.g,
            b: original.b
          };
        }
        return false;
      },
      write: function write(color) {
        return {
          r: color.r,
          g: color.g,
          b: color.b
        };
      }
    },
    HSVA_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.h) && Common.isNumber(original.s) && Common.isNumber(original.v) && Common.isNumber(original.a)) {
          return {
            space: 'HSV',
            h: original.h,
            s: original.s,
            v: original.v,
            a: original.a
          };
        }
        return false;
      },
      write: function write(color) {
        return {
          h: color.h,
          s: color.s,
          v: color.v,
          a: color.a
        };
      }
    },
    HSV_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.h) && Common.isNumber(original.s) && Common.isNumber(original.v)) {
          return {
            space: 'HSV',
            h: original.h,
            s: original.s,
            v: original.v
          };
        }
        return false;
      },
      write: function write(color) {
        return {
          h: color.h,
          s: color.s,
          v: color.v
        };
      }
    }
  }
}];
var result = void 0;
var toReturn = void 0;
var interpret = function interpret() {
  toReturn = false;
  var original = arguments.length > 1 ? Common.toArray(arguments) : arguments[0];
  Common.each(INTERPRETATIONS, function (family) {
    if (family.litmus(original)) {
      Common.each(family.conversions, function (conversion, conversionName) {
        result = conversion.read(original);
        if (toReturn === false && result !== false) {
          toReturn = result;
          result.conversionName = conversionName;
          result.conversion = conversion;
          return Common.BREAK;
        }
      });
      return Common.BREAK;
    }
  });
  return toReturn;
};

var tmpComponent = void 0;
var ColorMath = {
  hsv_to_rgb: function hsv_to_rgb(h, s, v) {
    var hi = Math.floor(h / 60) % 6;
    var f = h / 60 - Math.floor(h / 60);
    var p = v * (1.0 - s);
    var q = v * (1.0 - f * s);
    var t = v * (1.0 - (1.0 - f) * s);
    var c = [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][hi];
    return {
      r: c[0],
      g: c[1],
      b: c[2]
    };
  },
  rgb_to_hsv: function rgb_to_hsv(r, g, b) {
    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);
    var min = Math.min(r, g, b);
    var max = Math.max(r, g, b);
    var delta = max - min;
    var h = void 0;
    var s = void 0;
    if (max !== 0) {
      s = delta / max;
    } else {
      return {
        h: NaN,
        s: 0,
        v: 0
      };
    }
    if (r === max) {
      h = (g - b) / delta;
    } else if (g === max) {
      h = 2 + (b - r) / delta;
    } else {
      h = 4 + (r - g) / delta;
    }
    h /= 6;
    if (h < 0) {
      h += 1;
    }
    return {
      h: h * 360,
      s: s,
      v: max / 255
    };
  },
  rgb_to_hex: function rgb_to_hex(r, g, b) {
    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);
    var hex = this.hex_with_component(0, 2, r);
    hex = this.hex_with_component(hex, 1, g);
    hex = this.hex_with_component(hex, 0, b);
    return hex;
  },
  component_from_hex: function component_from_hex(hex, componentIndex) {
    return hex >> componentIndex * 8 & 0xFF;
  },
  hex_with_component: function hex_with_component(hex, componentIndex, value) {
    return value << (tmpComponent = componentIndex * 8) | hex & ~(0xFF << tmpComponent);
  }
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Color = function () {
  function Color() {
    classCallCheck(this, Color);
    this.__state = interpret.apply(this, arguments);
    if (this.__state === false) {
      throw new Error('Failed to interpret color arguments');
    }
    this.__state.a = this.__state.a || 1;
  }
  createClass(Color, [{
    key: 'toString',
    value: function toString() {
      return colorToString(this);
    }
  }, {
    key: 'toHexString',
    value: function toHexString() {
      return colorToString(this, true);
    }
  }, {
    key: 'toOriginal',
    value: function toOriginal() {
      return this.__state.conversion.write(this);
    }
  }]);
  return Color;
}();
function defineRGBComponent(target, component, componentHexIndex) {
  Object.defineProperty(target, component, {
    get: function get$$1() {
      if (this.__state.space === 'RGB') {
        return this.__state[component];
      }
      Color.recalculateRGB(this, component, componentHexIndex);
      return this.__state[component];
    },
    set: function set$$1(v) {
      if (this.__state.space !== 'RGB') {
        Color.recalculateRGB(this, component, componentHexIndex);
        this.__state.space = 'RGB';
      }
      this.__state[component] = v;
    }
  });
}
function defineHSVComponent(target, component) {
  Object.defineProperty(target, component, {
    get: function get$$1() {
      if (this.__state.space === 'HSV') {
        return this.__state[component];
      }
      Color.recalculateHSV(this);
      return this.__state[component];
    },
    set: function set$$1(v) {
      if (this.__state.space !== 'HSV') {
        Color.recalculateHSV(this);
        this.__state.space = 'HSV';
      }
      this.__state[component] = v;
    }
  });
}
Color.recalculateRGB = function (color, component, componentHexIndex) {
  if (color.__state.space === 'HEX') {
    color.__state[component] = ColorMath.component_from_hex(color.__state.hex, componentHexIndex);
  } else if (color.__state.space === 'HSV') {
    Common.extend(color.__state, ColorMath.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));
  } else {
    throw new Error('Corrupted color state');
  }
};
Color.recalculateHSV = function (color) {
  var result = ColorMath.rgb_to_hsv(color.r, color.g, color.b);
  Common.extend(color.__state, {
    s: result.s,
    v: result.v
  });
  if (!Common.isNaN(result.h)) {
    color.__state.h = result.h;
  } else if (Common.isUndefined(color.__state.h)) {
    color.__state.h = 0;
  }
};
Color.COMPONENTS = ['r', 'g', 'b', 'h', 's', 'v', 'hex', 'a'];
defineRGBComponent(Color.prototype, 'r', 2);
defineRGBComponent(Color.prototype, 'g', 1);
defineRGBComponent(Color.prototype, 'b', 0);
defineHSVComponent(Color.prototype, 'h');
defineHSVComponent(Color.prototype, 's');
defineHSVComponent(Color.prototype, 'v');
Object.defineProperty(Color.prototype, 'a', {
  get: function get$$1() {
    return this.__state.a;
  },
  set: function set$$1(v) {
    this.__state.a = v;
  }
});
Object.defineProperty(Color.prototype, 'hex', {
  get: function get$$1() {
    if (!this.__state.space !== 'HEX') {
      this.__state.hex = ColorMath.rgb_to_hex(this.r, this.g, this.b);
    }
    return this.__state.hex;
  },
  set: function set$$1(v) {
    this.__state.space = 'HEX';
    this.__state.hex = v;
  }
});

var Controller = function () {
  function Controller(object, property) {
    classCallCheck(this, Controller);
    this.initialValue = object[property];
    this.domElement = document.createElement('div');
    this.object = object;
    this.property = property;
    this.__onChange = undefined;
    this.__onFinishChange = undefined;
  }
  createClass(Controller, [{
    key: 'onChange',
    value: function onChange(fnc) {
      this.__onChange = fnc;
      return this;
    }
  }, {
    key: 'onFinishChange',
    value: function onFinishChange(fnc) {
      this.__onFinishChange = fnc;
      return this;
    }
  }, {
    key: 'setValue',
    value: function setValue(newValue) {
      this.object[this.property] = newValue;
      if (this.__onChange) {
        this.__onChange.call(this, newValue);
      }
      this.updateDisplay();
      return this;
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.object[this.property];
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      return this;
    }
  }, {
    key: 'isModified',
    value: function isModified() {
      return this.initialValue !== this.getValue();
    }
  }]);
  return Controller;
}();

var EVENT_MAP = {
  HTMLEvents: ['change'],
  MouseEvents: ['click', 'mousemove', 'mousedown', 'mouseup', 'mouseover'],
  KeyboardEvents: ['keydown']
};
var EVENT_MAP_INV = {};
Common.each(EVENT_MAP, function (v, k) {
  Common.each(v, function (e) {
    EVENT_MAP_INV[e] = k;
  });
});
var CSS_VALUE_PIXELS = /(\d+(\.\d+)?)px/;
function cssValueToPixels(val) {
  if (val === '0' || Common.isUndefined(val)) {
    return 0;
  }
  var match = val.match(CSS_VALUE_PIXELS);
  if (!Common.isNull(match)) {
    return parseFloat(match[1]);
  }
  return 0;
}
var dom = {
  makeSelectable: function makeSelectable(elem, selectable) {
    if (elem === undefined || elem.style === undefined) return;
    elem.onselectstart = selectable ? function () {
      return false;
    } : function () {};
    elem.style.MozUserSelect = selectable ? 'auto' : 'none';
    elem.style.KhtmlUserSelect = selectable ? 'auto' : 'none';
    elem.unselectable = selectable ? 'on' : 'off';
  },
  makeFullscreen: function makeFullscreen(elem, hor, vert) {
    var vertical = vert;
    var horizontal = hor;
    if (Common.isUndefined(horizontal)) {
      horizontal = true;
    }
    if (Common.isUndefined(vertical)) {
      vertical = true;
    }
    elem.style.position = 'absolute';
    if (horizontal) {
      elem.style.left = 0;
      elem.style.right = 0;
    }
    if (vertical) {
      elem.style.top = 0;
      elem.style.bottom = 0;
    }
  },
  fakeEvent: function fakeEvent(elem, eventType, pars, aux) {
    var params = pars || {};
    var className = EVENT_MAP_INV[eventType];
    if (!className) {
      throw new Error('Event type ' + eventType + ' not supported.');
    }
    var evt = document.createEvent(className);
    switch (className) {
      case 'MouseEvents':
        {
          var clientX = params.x || params.clientX || 0;
          var clientY = params.y || params.clientY || 0;
          evt.initMouseEvent(eventType, params.bubbles || false, params.cancelable || true, window, params.clickCount || 1, 0,
          0,
          clientX,
          clientY,
          false, false, false, false, 0, null);
          break;
        }
      case 'KeyboardEvents':
        {
          var init = evt.initKeyboardEvent || evt.initKeyEvent;
          Common.defaults(params, {
            cancelable: true,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            keyCode: undefined,
            charCode: undefined
          });
          init(eventType, params.bubbles || false, params.cancelable, window, params.ctrlKey, params.altKey, params.shiftKey, params.metaKey, params.keyCode, params.charCode);
          break;
        }
      default:
        {
          evt.initEvent(eventType, params.bubbles || false, params.cancelable || true);
          break;
        }
    }
    Common.defaults(evt, aux);
    elem.dispatchEvent(evt);
  },
  bind: function bind(elem, event, func, newBool) {
    var bool = newBool || false;
    if (elem.addEventListener) {
      elem.addEventListener(event, func, bool);
    } else if (elem.attachEvent) {
      elem.attachEvent('on' + event, func);
    }
    return dom;
  },
  unbind: function unbind(elem, event, func, newBool) {
    var bool = newBool || false;
    if (elem.removeEventListener) {
      elem.removeEventListener(event, func, bool);
    } else if (elem.detachEvent) {
      elem.detachEvent('on' + event, func);
    }
    return dom;
  },
  addClass: function addClass(elem, className) {
    if (elem.className === undefined) {
      elem.className = className;
    } else if (elem.className !== className) {
      var classes = elem.className.split(/ +/);
      if (classes.indexOf(className) === -1) {
        classes.push(className);
        elem.className = classes.join(' ').replace(/^\s+/, '').replace(/\s+$/, '');
      }
    }
    return dom;
  },
  removeClass: function removeClass(elem, className) {
    if (className) {
      if (elem.className === className) {
        elem.removeAttribute('class');
      } else {
        var classes = elem.className.split(/ +/);
        var index = classes.indexOf(className);
        if (index !== -1) {
          classes.splice(index, 1);
          elem.className = classes.join(' ');
        }
      }
    } else {
      elem.className = undefined;
    }
    return dom;
  },
  hasClass: function hasClass(elem, className) {
    return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(elem.className) || false;
  },
  getWidth: function getWidth(elem) {
    var style = getComputedStyle(elem);
    return cssValueToPixels(style['border-left-width']) + cssValueToPixels(style['border-right-width']) + cssValueToPixels(style['padding-left']) + cssValueToPixels(style['padding-right']) + cssValueToPixels(style.width);
  },
  getHeight: function getHeight(elem) {
    var style = getComputedStyle(elem);
    return cssValueToPixels(style['border-top-width']) + cssValueToPixels(style['border-bottom-width']) + cssValueToPixels(style['padding-top']) + cssValueToPixels(style['padding-bottom']) + cssValueToPixels(style.height);
  },
  getOffset: function getOffset(el) {
    var elem = el;
    var offset = { left: 0, top: 0 };
    if (elem.offsetParent) {
      do {
        offset.left += elem.offsetLeft;
        offset.top += elem.offsetTop;
        elem = elem.offsetParent;
      } while (elem);
    }
    return offset;
  },
  isActive: function isActive(elem) {
    return elem === document.activeElement && (elem.type || elem.href);
  }
};

var BooleanController = function (_Controller) {
  inherits(BooleanController, _Controller);
  function BooleanController(object, property) {
    classCallCheck(this, BooleanController);
    var _this2 = possibleConstructorReturn(this, (BooleanController.__proto__ || Object.getPrototypeOf(BooleanController)).call(this, object, property));
    var _this = _this2;
    _this2.__prev = _this2.getValue();
    _this2.__checkbox = document.createElement('input');
    _this2.__checkbox.setAttribute('type', 'checkbox');
    function onChange() {
      _this.setValue(!_this.__prev);
    }
    dom.bind(_this2.__checkbox, 'change', onChange, false);
    _this2.domElement.appendChild(_this2.__checkbox);
    _this2.updateDisplay();
    return _this2;
  }
  createClass(BooleanController, [{
    key: 'setValue',
    value: function setValue(v) {
      var toReturn = get(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'setValue', this).call(this, v);
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
      this.__prev = this.getValue();
      return toReturn;
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (this.getValue() === true) {
        this.__checkbox.setAttribute('checked', 'checked');
        this.__checkbox.checked = true;
        this.__prev = true;
      } else {
        this.__checkbox.checked = false;
        this.__prev = false;
      }
      return get(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return BooleanController;
}(Controller);

var OptionController = function (_Controller) {
  inherits(OptionController, _Controller);
  function OptionController(object, property, opts) {
    classCallCheck(this, OptionController);
    var _this2 = possibleConstructorReturn(this, (OptionController.__proto__ || Object.getPrototypeOf(OptionController)).call(this, object, property));
    var options = opts;
    var _this = _this2;
    _this2.__select = document.createElement('select');
    if (Common.isArray(options)) {
      var map = {};
      Common.each(options, function (element) {
        if ((typeof element === 'undefined' ? 'undefined' : _typeof(element)) === "object" && "label" in element && "value" in element) {
          map[element["label"]] = element["value"];
        } else {
          map[element] = element;
        }
      });
      options = map;
    }
    Common.each(options, function (value, key) {
      var opt = document.createElement('option');
      opt.innerHTML = key;
      opt.setAttribute('value', value);
      _this.__select.appendChild(opt);
    });
    _this2.updateDisplay();
    dom.bind(_this2.__select, 'change', function () {
      var desiredValue = options[this.options[this.selectedIndex].innerHTML];
      _this.setValue(desiredValue);
    });
    _this2.domElement.appendChild(_this2.__select);
    return _this2;
  }
  createClass(OptionController, [{
    key: 'setValue',
    value: function setValue(v) {
      var toReturn = get(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'setValue', this).call(this, v);
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
      return toReturn;
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (dom.isActive(this.__select)) return this;
      this.__select.value = this.getValue();
      return get(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return OptionController;
}(Controller);

var StringController = function (_Controller) {
  inherits(StringController, _Controller);
  function StringController(object, property) {
    classCallCheck(this, StringController);
    var _this2 = possibleConstructorReturn(this, (StringController.__proto__ || Object.getPrototypeOf(StringController)).call(this, object, property));
    var _this = _this2;
    function onChange() {
      _this.setValue(_this.__input.value);
    }
    function onBlur() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    _this2.__input = document.createElement('input');
    _this2.__input.setAttribute('type', 'text');
    dom.bind(_this2.__input, 'keyup', onChange);
    dom.bind(_this2.__input, 'change', onChange);
    dom.bind(_this2.__input, 'blur', onBlur);
    dom.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        this.blur();
      }
    });
    _this2.updateDisplay();
    _this2.domElement.appendChild(_this2.__input);
    return _this2;
  }
  createClass(StringController, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (!dom.isActive(this.__input)) {
        this.__input.value = this.getValue();
      }
      return get(StringController.prototype.__proto__ || Object.getPrototypeOf(StringController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return StringController;
}(Controller);

function numDecimals(x) {
  var _x = x.toString();
  if (_x.indexOf('.') > -1) {
    return _x.length - _x.indexOf('.') - 1;
  }
  return 0;
}
var NumberController = function (_Controller) {
  inherits(NumberController, _Controller);
  function NumberController(object, property, params) {
    classCallCheck(this, NumberController);
    var _this = possibleConstructorReturn(this, (NumberController.__proto__ || Object.getPrototypeOf(NumberController)).call(this, object, property));
    var _params = params || {};
    _this.__min = _params.min;
    _this.__max = _params.max;
    _this.__step = _params.step;
    if (Common.isUndefined(_this.__step)) {
      if (_this.initialValue === 0) {
        _this.__impliedStep = 1;
      } else {
        _this.__impliedStep = Math.pow(10, Math.floor(Math.log(Math.abs(_this.initialValue)) / Math.LN10)) / 10;
      }
    } else {
      _this.__impliedStep = _this.__step;
    }
    _this.__precision = numDecimals(_this.__impliedStep);
    return _this;
  }
  createClass(NumberController, [{
    key: 'setValue',
    value: function setValue(v) {
      var _v = v;
      if (this.__min !== undefined && _v < this.__min) {
        _v = this.__min;
      } else if (this.__max !== undefined && _v > this.__max) {
        _v = this.__max;
      }
      if (this.__step !== undefined && _v % this.__step !== 0) {
      }
      return get(NumberController.prototype.__proto__ || Object.getPrototypeOf(NumberController.prototype), 'setValue', this).call(this, _v);
    }
  }, {
    key: 'min',
    value: function min(minValue) {
      this.__min = minValue;
      return this;
    }
  }, {
    key: 'max',
    value: function max(maxValue) {
      this.__max = maxValue;
      return this;
    }
  }, {
    key: 'step',
    value: function step(stepValue) {
      this.__step = stepValue;
      this.__impliedStep = stepValue;
      this.__precision = 2;
      return this;
    }
  }]);
  return NumberController;
}(Controller);

function roundToDecimal(value, decimals) {
  var tenTo = Math.pow(10, decimals);
  return Math.round(value * tenTo) / tenTo;
}
var NumberControllerBox = function (_NumberController) {
  inherits(NumberControllerBox, _NumberController);
  function NumberControllerBox(object, property, params) {
    classCallCheck(this, NumberControllerBox);
    var _this2 = possibleConstructorReturn(this, (NumberControllerBox.__proto__ || Object.getPrototypeOf(NumberControllerBox)).call(this, object, property, params));
    _this2.__truncationSuspended = false;
    var _this = _this2;
    var prevY = void 0;
    _this2._mouseDown = false;
    function onChange() {
      var attempted = parseFloat(_this.__input.value);
      if (!Common.isNaN(attempted)) {
        _this.setValue(attempted);
      }
    }
    function onFinish() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    function onBlur() {
      onFinish();
    }
    function onMouseDrag(e) {
      var diff = prevY - e.clientY;
      _this.setValue(_this.getValue() + diff * _this.__impliedStep);
      prevY = e.clientY;
    }
    function onMouseUp() {
      _this._mouseDown = false;
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);
      onFinish();
    }
    function onMouseDown(e) {
      _this._mouseDown = true;
      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);
      prevY = e.clientY;
    }
    _this2.__input = document.createElement('input');
    _this2.__input.setAttribute('type', 'text');
    dom.bind(_this2.__input, 'change', onChange);
    dom.bind(_this2.__input, 'blur', onBlur);
    dom.bind(_this2.__input, 'mousedown', onMouseDown);
    dom.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        _this.__truncationSuspended = true;
        this.blur();
        _this.__truncationSuspended = false;
        onFinish();
      }
    });
    _this2.updateDisplay();
    _this2.domElement.appendChild(_this2.__input);
    return _this2;
  }
  createClass(NumberControllerBox, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (document.activeElement !== this.__input || this._mouseDown) {
        this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal(this.getValue(), this.__precision);
      }
      return get(NumberControllerBox.prototype.__proto__ || Object.getPrototypeOf(NumberControllerBox.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return NumberControllerBox;
}(NumberController);

function map(v, i1, i2, o1, o2) {
  return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
}
var NumberControllerSlider = function (_NumberController) {
  inherits(NumberControllerSlider, _NumberController);
  function NumberControllerSlider(object, property, min, max, step) {
    classCallCheck(this, NumberControllerSlider);
    var _this2 = possibleConstructorReturn(this, (NumberControllerSlider.__proto__ || Object.getPrototypeOf(NumberControllerSlider)).call(this, object, property, { min: min, max: max, step: step }));
    var _this = _this2;
    _this2.__background = document.createElement('div');
    _this2.__foreground = document.createElement('div');
    dom.bind(_this2.__background, 'mousedown', onMouseDown);
    dom.bind(_this2.__background, 'touchstart', onTouchStart);
    dom.addClass(_this2.__background, 'slider');
    dom.addClass(_this2.__foreground, 'slider-fg');
    function onMouseDown(e) {
      document.activeElement.blur();
      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);
      onMouseDrag(e);
    }
    function onMouseDrag(e) {
      e.preventDefault();
      var bgRect = _this.__background.getBoundingClientRect();
      _this.setValue(map(e.clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
      return false;
    }
    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    function onTouchStart(e) {
      if (e.touches.length !== 1) {
        return;
      }
      dom.bind(window, 'touchmove', onTouchMove);
      dom.bind(window, 'touchend', onTouchEnd);
      onTouchMove(e);
    }
    function onTouchMove(e) {
      var clientX = e.touches[0].clientX;
      var bgRect = _this.__background.getBoundingClientRect();
      _this.setValue(map(clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
    }
    function onTouchEnd() {
      dom.unbind(window, 'touchmove', onTouchMove);
      dom.unbind(window, 'touchend', onTouchEnd);
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    _this2.updateDisplay();
    _this2.__background.appendChild(_this2.__foreground);
    _this2.domElement.appendChild(_this2.__background);
    return _this2;
  }
  createClass(NumberControllerSlider, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      var pct = (this.getValue() - this.__min) / (this.__max - this.__min);
      this.__foreground.style.width = pct * 100 + '%';
      return get(NumberControllerSlider.prototype.__proto__ || Object.getPrototypeOf(NumberControllerSlider.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return NumberControllerSlider;
}(NumberController);

var FunctionController = function (_Controller) {
  inherits(FunctionController, _Controller);
  function FunctionController(object, property, text) {
    classCallCheck(this, FunctionController);
    var _this2 = possibleConstructorReturn(this, (FunctionController.__proto__ || Object.getPrototypeOf(FunctionController)).call(this, object, property));
    var _this = _this2;
    _this2.__button = document.createElement('div');
    _this2.__button.innerHTML = text === undefined ? 'Fire' : text;
    dom.bind(_this2.__button, 'click', function (e) {
      e.preventDefault();
      _this.fire();
      return false;
    });
    dom.addClass(_this2.__button, 'button');
    _this2.domElement.appendChild(_this2.__button);
    return _this2;
  }
  createClass(FunctionController, [{
    key: 'fire',
    value: function fire() {
      if (this.__onChange) {
        this.__onChange.call(this);
      }
      this.getValue().call(this.object);
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
    }
  }]);
  return FunctionController;
}(Controller);

var ColorController = function (_Controller) {
    inherits(ColorController, _Controller);
    function ColorController(object, property) {
        classCallCheck(this, ColorController);
        var _this2 = possibleConstructorReturn(this, (ColorController.__proto__ || Object.getPrototypeOf(ColorController)).call(this, object, property));
        _this2.__color = new Color(_this2.getValue());
        _this2.__temp = new Color(0);
        var _this = _this2;
        _this2.domElement = document.createElement('div');
        dom.makeSelectable(_this2.domElement, false);
        _this2.__selector = document.createElement('div');
        _this2.__selector.className = 'selector';
        _this2.__saturation_field = document.createElement('div');
        _this2.__saturation_field.className = 'saturation-field';
        _this2.__field_knob = document.createElement('div');
        _this2.__field_knob.className = 'field-knob';
        _this2.__field_knob_border = '2px solid ';
        _this2.__hue_knob = document.createElement('div');
        _this2.__hue_knob.className = 'hue-knob';
        _this2.__hue_field = document.createElement('div');
        _this2.__hue_field.className = 'hue-field';
        _this2.__input = document.createElement('input');
        _this2.__input.type = 'text';
        _this2.__input_textShadow = '0 1px 1px ';
        dom.bind(_this2.__input, 'keydown', function (e) {
            if (e.keyCode === 13) {
                onBlur.call(this);
            }
        });
        dom.bind(_this2.__input, 'blur', onBlur);
        dom.bind(_this2.__selector, 'mousedown', function ()        {
            dom.addClass(this, 'drag').bind(window, 'mouseup', function ()        {
                dom.removeClass(_this.__selector, 'drag');
            });
        });
        dom.bind(_this2.__selector, 'touchstart', function ()        {
            dom.addClass(this, 'drag').bind(window, 'touchend', function ()        {
                dom.removeClass(_this.__selector, 'drag');
            });
        });
        var valueField = document.createElement('div');
        Common.extend(_this2.__selector.style, {
            width: '122px',
            height: '102px',
            padding: '3px',
            backgroundColor: '#222',
            boxShadow: '0px 1px 3px rgba(0,0,0,0.3)'
        });
        Common.extend(_this2.__field_knob.style, {
            position: 'absolute',
            width: '12px',
            height: '12px',
            border: _this2.__field_knob_border + (_this2.__color.v < 0.5 ? '#fff' : '#000'),
            boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
            borderRadius: '12px',
            zIndex: 1
        });
        Common.extend(_this2.__hue_knob.style, {
            position: 'absolute',
            width: '15px',
            height: '2px',
            borderRight: '4px solid #fff',
            zIndex: 1
        });
        Common.extend(_this2.__saturation_field.style, {
            width: '100px',
            height: '100px',
            border: '1px solid #555',
            marginRight: '3px',
            display: 'inline-block',
            cursor: 'pointer'
        });
        Common.extend(valueField.style, {
            width: '100%',
            height: '100%',
            background: 'none'
        });
        linearGradient(valueField, 'top', 'rgba(0,0,0,0)', '#000');
        Common.extend(_this2.__hue_field.style, {
            width: '15px',
            height: '100px',
            border: '1px solid #555',
            cursor: 'ns-resize',
            position: 'absolute',
            top: '3px',
            right: '3px'
        });
        hueGradient(_this2.__hue_field);
        Common.extend(_this2.__input.style, {
            outline: 'none',
            textAlign: 'left',
            color: '#fff',
            border: 0,
            textShadow: _this2.__input_textShadow + 'rgba(0,0,0,0.7)'
        });
        dom.bind(_this2.__saturation_field, 'mousedown', fieldDown);
        dom.bind(_this2.__saturation_field, 'touchstart', fieldDown);
        dom.bind(_this2.__field_knob, 'mousedown', fieldDown);
        dom.bind(_this2.__field_knob, 'touchstart', fieldDown);
        dom.bind(_this2.__hue_field, 'mousedown', fieldDownH);
        dom.bind(_this2.__hue_field, 'touchstart', fieldDownH);
        function fieldDown(e) {
            setSV(e);
            dom.bind(window, 'mousemove', setSV);
            dom.bind(window, 'touchmove', setSV);
            dom.bind(window, 'mouseup', fieldUpSV);
            dom.bind(window, 'touchend', fieldUpSV);
        }
        function fieldDownH(e) {
            setH(e);
            dom.bind(window, 'mousemove', setH);
            dom.bind(window, 'touchmove', setH);
            dom.bind(window, 'mouseup', fieldUpH);
            dom.bind(window, 'touchend', fieldUpH);
        }
        function fieldUpSV() {
            dom.unbind(window, 'mousemove', setSV);
            dom.unbind(window, 'touchmove', setSV);
            dom.unbind(window, 'mouseup', fieldUpSV);
            dom.unbind(window, 'touchend', fieldUpSV);
            onFinish();
        }
        function fieldUpH() {
            dom.unbind(window, 'mousemove', setH);
            dom.unbind(window, 'touchmove', setH);
            dom.unbind(window, 'mouseup', fieldUpH);
            dom.unbind(window, 'touchend', fieldUpH);
            onFinish();
        }
        function onBlur() {
            var i = interpret(this.value);
            if (i !== false) {
                _this.__color.__state = i;
                _this.setValue(_this.__color.toOriginal());
            } else {
                this.value = _this.__color.toString();
            }
        }
        function onFinish() {
            if (_this.__onFinishChange) {
                _this.__onFinishChange.call(_this, _this.__color.toOriginal());
            }
        }
        _this2.__saturation_field.appendChild(valueField);
        _this2.__selector.appendChild(_this2.__field_knob);
        _this2.__selector.appendChild(_this2.__saturation_field);
        _this2.__selector.appendChild(_this2.__hue_field);
        _this2.__hue_field.appendChild(_this2.__hue_knob);
        _this2.domElement.appendChild(_this2.__input);
        _this2.domElement.appendChild(_this2.__selector);
        _this2.updateDisplay();
        function setSV(e) {
            if (e.type.indexOf('touch') === -1) {
                e.preventDefault();
            }
            var fieldRect = _this.__saturation_field.getBoundingClientRect();
            var _ref = e.touches && e.touches[0] || e,
                clientX = _ref.clientX,
                clientY = _ref.clientY;
            var s = (clientX - fieldRect.left) / (fieldRect.right - fieldRect.left);
            var v = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);
            if (v > 1) {
                v = 1;
            } else if (v < 0) {
                v = 0;
            }
            if (s > 1) {
                s = 1;
            } else if (s < 0) {
                s = 0;
            }
            _this.__color.v = v;
            _this.__color.s = s;
            _this.setValue(_this.__color.toOriginal());
            return false;
        }
        function setH(e) {
            if (e.type.indexOf('touch') === -1) {
                e.preventDefault();
            }
            var fieldRect = _this.__hue_field.getBoundingClientRect();
            var _ref2 = e.touches && e.touches[0] || e,
                clientY = _ref2.clientY;
            var h = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);
            if (h > 1) {
                h = 1;
            } else if (h < 0) {
                h = 0;
            }
            _this.__color.h = h * 360;
            _this.setValue(_this.__color.toOriginal());
            return false;
        }
        return _this2;
    }
    createClass(ColorController, [{
        key: 'updateDisplay',
        value: function updateDisplay() {
            var i = interpret(this.getValue());
            if (i !== false) {
                var mismatch = false;
                Common.each(Color.COMPONENTS, function (component) {
                    if (!Common.isUndefined(i[component]) && !Common.isUndefined(this.__color.__state[component]) && i[component] !== this.__color.__state[component]) {
                        mismatch = true;
                        return {};
                    }
                }, this);
                if (mismatch) {
                    Common.extend(this.__color.__state, i);
                }
            }
            Common.extend(this.__temp.__state, this.__color.__state);
            this.__temp.a = 1;
            var flip = this.__color.v < 0.5 || this.__color.s > 0.5 ? 255 : 0;
            var _flip = 255 - flip;
            Common.extend(this.__field_knob.style, {
                marginLeft: 100 * this.__color.s - 7 + 'px',
                marginTop: 100 * (1 - this.__color.v) - 7 + 'px',
                backgroundColor: this.__temp.toHexString(),
                border: this.__field_knob_border + 'rgb(' + flip + ',' + flip + ',' + flip + ')'
            });
            this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + 'px';
            this.__temp.s = 1;
            this.__temp.v = 1;
            linearGradient(this.__saturation_field, 'left', '#fff', this.__temp.toHexString());
            this.__input.value = this.__color.toString();
            Common.extend(this.__input.style, {
                backgroundColor: this.__color.toHexString(),
                color: 'rgb(' + flip + ',' + flip + ',' + flip + ')',
                textShadow: this.__input_textShadow + 'rgba(' + _flip + ',' + _flip + ',' + _flip + ',.7)'
            });
        }
    }]);
    return ColorController;
}(Controller);
var vendors = ['-moz-', '-o-', '-webkit-', '-ms-', ''];
function linearGradient(elem, x, a, b) {
    elem.style.background = '';
    Common.each(vendors, function (vendor) {
        elem.style.cssText += 'background: ' + vendor + 'linear-gradient(' + x + ', ' + a + ' 0%, ' + b + ' 100%); ';
    });
}
function hueGradient(elem) {
    elem.style.background = '';
    elem.style.cssText += 'background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);';
    elem.style.cssText += 'background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
    elem.style.cssText += 'background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
    elem.style.cssText += 'background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
    elem.style.cssText += 'background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
}

var css = {
  load: function load(url, indoc) {
    var doc = indoc || document;
    var link = doc.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;
    doc.getElementsByTagName('head')[0].appendChild(link);
  },
  inject: function inject(cssContent, indoc) {
    var doc = indoc || document;
    var injected = document.createElement('style');
    injected.type = 'text/css';
    injected.innerHTML = cssContent;
    var head = doc.getElementsByTagName('head')[0];
    try {
      head.appendChild(injected);
    } catch (e) {
    }
  }
};

var saveDialogContents = "<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Here's the new load parameter for your <code>GUI</code>'s constructor:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n  <div id=\"dg-save-locally\">\n\n    <input id=\"dg-local-storage\" type=\"checkbox\"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id=\"dg-local-explain\">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n\n    </div>\n\n  </div>\n\n</div>";

var ControllerFactory = function ControllerFactory(object, property) {
  var initialValue = object[property];
  if (Common.isArray(arguments[2]) || Common.isObject(arguments[2])) {
    return new OptionController(object, property, arguments[2]);
  }
  if (Common.isNumber(initialValue)) {
    if (Common.isNumber(arguments[2]) && Common.isNumber(arguments[3])) {
      if (Common.isNumber(arguments[4])) {
        return new NumberControllerSlider(object, property, arguments[2], arguments[3], arguments[4]);
      }
      return new NumberControllerSlider(object, property, arguments[2], arguments[3]);
    }
    if (Common.isNumber(arguments[4])) {
      return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3], step: arguments[4] });
    }
    return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3] });
  }
  if (Common.isString(initialValue)) {
    return new StringController(object, property);
  }
  if (Common.isFunction(initialValue)) {
    return new FunctionController(object, property, '');
  }
  if (Common.isBoolean(initialValue)) {
    return new BooleanController(object, property);
  }
  return null;
};

function requestAnimationFrame(callback) {
  setTimeout(callback, 1000 / 60);
}
var requestAnimationFrame$1 = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || requestAnimationFrame;

var CenteredDiv = function () {
  function CenteredDiv() {
    classCallCheck(this, CenteredDiv);
    this.backgroundElement = document.createElement('div');
    Common.extend(this.backgroundElement.style, {
      backgroundColor: 'rgba(0,0,0,0.8)',
      top: 0,
      left: 0,
      display: 'none',
      zIndex: '1000',
      opacity: 0,
      WebkitTransition: 'opacity 0.2s linear',
      transition: 'opacity 0.2s linear'
    });
    dom.makeFullscreen(this.backgroundElement);
    this.backgroundElement.style.position = 'fixed';
    this.domElement = document.createElement('div');
    Common.extend(this.domElement.style, {
      position: 'fixed',
      display: 'none',
      zIndex: '1001',
      opacity: 0,
      WebkitTransition: '-webkit-transform 0.2s ease-out, opacity 0.2s linear',
      transition: 'transform 0.2s ease-out, opacity 0.2s linear'
    });
    document.body.appendChild(this.backgroundElement);
    document.body.appendChild(this.domElement);
    var _this = this;
    dom.bind(this.backgroundElement, 'click', function () {
      _this.hide();
    });
  }
  createClass(CenteredDiv, [{
    key: 'show',
    value: function show() {
      var _this = this;
      this.backgroundElement.style.display = 'block';
      this.domElement.style.display = 'block';
      this.domElement.style.opacity = 0;
      this.domElement.style.webkitTransform = 'scale(1.1)';
      this.layout();
      Common.defer(function () {
        _this.backgroundElement.style.opacity = 1;
        _this.domElement.style.opacity = 1;
        _this.domElement.style.webkitTransform = 'scale(1)';
      });
    }
  }, {
    key: 'hide',
    value: function hide() {
      var _this = this;
      var hide = function hide() {
        _this.domElement.style.display = 'none';
        _this.backgroundElement.style.display = 'none';
        dom.unbind(_this.domElement, 'webkitTransitionEnd', hide);
        dom.unbind(_this.domElement, 'transitionend', hide);
        dom.unbind(_this.domElement, 'oTransitionEnd', hide);
      };
      dom.bind(this.domElement, 'webkitTransitionEnd', hide);
      dom.bind(this.domElement, 'transitionend', hide);
      dom.bind(this.domElement, 'oTransitionEnd', hide);
      this.backgroundElement.style.opacity = 0;
      this.domElement.style.opacity = 0;
      this.domElement.style.webkitTransform = 'scale(1.1)';
    }
  }, {
    key: 'layout',
    value: function layout() {
      this.domElement.style.left = window.innerWidth / 2 - dom.getWidth(this.domElement) / 2 + 'px';
      this.domElement.style.top = window.innerHeight / 2 - dom.getHeight(this.domElement) / 2 + 'px';
    }
  }]);
  return CenteredDiv;
}();

var styleSheet = ___$insertStyle(".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear;border:0;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button.close-top{position:relative}.dg.main .close-button.close-bottom{position:absolute}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:0px;overflow-y:visible}.dg.a.has-save>ul.close-top{margin-top:0}.dg.a.has-save>ul.close-bottom{margin-top:27px}.dg.a.has-save>ul.closed{margin-top:0}.dg.a .save-row{top:0;z-index:1002}.dg.a .save-row.close-top{position:relative}.dg.a .save-row.close-bottom{position:fixed}.dg li{-webkit-transition:height .1s ease-out;-o-transition:height .1s ease-out;-moz-transition:height .1s ease-out;transition:height .1s ease-out;-webkit-transition:overflow .1s linear;-o-transition:overflow .1s linear;-moz-transition:overflow .1s linear;transition:overflow .1s linear}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li>*{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px;overflow:hidden}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%;position:relative}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:7px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .cr.color{overflow:visible}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .selected li.title{background-color:#272727}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.color{border-left:3px solid}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2FA1D6}.dg .cr.number input[type=text]{color:#2FA1D6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2FA1D6;max-width:100%}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n");

css.inject(styleSheet);
var CSS_NAMESPACE = 'dg';
var HIDE_KEY_CODE = 72;
var CLOSE_BUTTON_HEIGHT = 20;
var DEFAULT_DEFAULT_PRESET_NAME = 'Default';
var SUPPORTS_LOCAL_STORAGE = function () {
  try {
    return !!window.localStorage;
  } catch (e) {
    return false;
  }
}();
var SAVE_DIALOGUE = void 0;
var autoPlaceVirgin = true;
var autoPlaceContainer = void 0;
var hide = false;
var hideableGuis = [];
var GUI = function GUI(pars) {
  var _this = this;
  var params = pars || {};
  this.domElement = document.createElement('div');
  this.__ul = document.createElement('ul');
  this.domElement.appendChild(this.__ul);
  dom.addClass(this.domElement, CSS_NAMESPACE);
  this.__folders = {};
  this.__controllers = [];
  this.__rememberedObjects = [];
  this.__rememberedObjectIndecesToControllers = [];
  this.__listening = [];
  params = Common.defaults(params, {
    closeOnTop: false,
    autoPlace: true,
    width: GUI.DEFAULT_WIDTH
  });
  params = Common.defaults(params, {
    resizable: params.autoPlace,
    hideable: params.autoPlace
  });
  if (!Common.isUndefined(params.load)) {
    if (params.preset) {
      params.load.preset = params.preset;
    }
  } else {
    params.load = { preset: DEFAULT_DEFAULT_PRESET_NAME };
  }
  if (Common.isUndefined(params.parent) && params.hideable) {
    hideableGuis.push(this);
  }
  params.resizable = Common.isUndefined(params.parent) && params.resizable;
  if (params.autoPlace && Common.isUndefined(params.scrollable)) {
    params.scrollable = true;
  }
  var useLocalStorage = SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(this, 'isLocal')) === 'true';
  var saveToLocalStorage = void 0;
  Object.defineProperties(this,
  {
    parent: {
      get: function get$$1() {
        return params.parent;
      }
    },
    scrollable: {
      get: function get$$1() {
        return params.scrollable;
      }
    },
    autoPlace: {
      get: function get$$1() {
        return params.autoPlace;
      }
    },
    closeOnTop: {
      get: function get$$1() {
        return params.closeOnTop;
      }
    },
    preset: {
      get: function get$$1() {
        if (_this.parent) {
          return _this.getRoot().preset;
        }
        return params.load.preset;
      },
      set: function set$$1(v) {
        if (_this.parent) {
          _this.getRoot().preset = v;
        } else {
          params.load.preset = v;
        }
        setPresetSelectIndex(this);
        _this.revert();
      }
    },
    width: {
      get: function get$$1() {
        return params.width;
      },
      set: function set$$1(v) {
        params.width = v;
        setWidth(_this, v);
      }
    },
    name: {
      get: function get$$1() {
        return params.name;
      },
      set: function set$$1(v) {
        params.name = v;
        if (titleRowName) {
          titleRowName.innerHTML = params.lable || params.name;
        }
      }
    },
    closed: {
      get: function get$$1() {
        return params.closed;
      },
      set: function set$$1(v) {
        params.closed = v;
        if (params.closed) {
          dom.addClass(_this.__ul, GUI.CLASS_CLOSED);
        } else {
          dom.removeClass(_this.__ul, GUI.CLASS_CLOSED);
        }
        this.onResize();
        if (_this.__closeButton && !this.name) {
          _this.__closeButton.innerHTML = v ? GUI.TEXT_OPEN : GUI.TEXT_CLOSED;
        }
      }
    },
    selected: {
      get: function get$$1() {
        return params.selected ? true : false;
      },
      set: function set$$1(v) {
        params.selected = v;
        if (params.selected) {
          dom.addClass(_this.__ul, GUI.CLASS_SELECTED);
        } else {
          dom.removeClass(_this.__ul, GUI.CLASS_SELECTED);
        }
        if (_this.__closeButton) {
        }
      }
    },
    load: {
      get: function get$$1() {
        return params.load;
      }
    },
    useLocalStorage: {
      get: function get$$1() {
        return useLocalStorage;
      },
      set: function set$$1(bool) {
        if (SUPPORTS_LOCAL_STORAGE) {
          useLocalStorage = bool;
          if (bool) {
            dom.bind(window, 'unload', saveToLocalStorage);
          } else {
            dom.unbind(window, 'unload', saveToLocalStorage);
          }
          localStorage.setItem(getLocalStorageHash(_this, 'isLocal'), bool);
        }
      }
    }
  });
  if (Common.isUndefined(params.parent)) {
    params.closed = false;
    dom.addClass(this.domElement, GUI.CLASS_MAIN);
    dom.makeSelectable(this.domElement, false);
    if (SUPPORTS_LOCAL_STORAGE) {
      if (useLocalStorage) {
        _this.useLocalStorage = true;
        var savedGui = localStorage.getItem(getLocalStorageHash(this, 'gui'));
        if (savedGui) {
          params.load = JSON.parse(savedGui);
        }
      }
    }
    this.__closeButton = document.createElement('div');
    this.__closeButton.innerHTML = this.label || GUI.TEXT_CLOSED;
    dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BUTTON);
    if (params.closeOnTop) {
      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_TOP);
      this.domElement.insertBefore(this.__closeButton, this.domElement.childNodes[0]);
    } else {
      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BOTTOM);
      this.domElement.appendChild(this.__closeButton);
    }
    dom.bind(this.__closeButton, 'click', function () {
      _this.closed = !_this.closed;
      if (_this.onClick) {
        _this.onClick(_this);
      }
    });
  } else {
    if (params.closed === undefined) {
      params.closed = true;
    }
    var _titleRowName = document.createTextNode(params.label || params.name);
    dom.addClass(_titleRowName, 'controller-name');
    var titleRow = addRow(_this, _titleRowName);
    var onClickTitle = function onClickTitle(e) {
      e.preventDefault();
      _this.closed = !_this.closed;
      if (_this.onClick) {
        _this.onClick(_this);
      }
      return false;
    };
    dom.addClass(this.__ul, GUI.CLASS_CLOSED);
    dom.addClass(titleRow, 'title');
    dom.bind(titleRow, 'click', onClickTitle);
    if (!params.closed) {
      this.closed = false;
    }
  }
  if (params.autoPlace) {
    if (Common.isUndefined(params.parent)) {
      if (autoPlaceVirgin) {
        autoPlaceContainer = document.createElement('div');
        dom.addClass(autoPlaceContainer, CSS_NAMESPACE);
        dom.addClass(autoPlaceContainer, GUI.CLASS_AUTO_PLACE_CONTAINER);
        document.body.appendChild(autoPlaceContainer);
        autoPlaceVirgin = false;
      }
      autoPlaceContainer.appendChild(this.domElement);
      dom.addClass(this.domElement, GUI.CLASS_AUTO_PLACE);
    }
    if (!this.parent) {
      setWidth(_this, params.width);
    }
  }
  this.__resizeHandler = function () {
    _this.onResizeDebounced();
  };
  dom.bind(window, 'resize', this.__resizeHandler);
  dom.bind(this.__ul, 'webkitTransitionEnd', this.__resizeHandler);
  dom.bind(this.__ul, 'transitionend', this.__resizeHandler);
  dom.bind(this.__ul, 'oTransitionEnd', this.__resizeHandler);
  this.onResize();
  if (params.resizable) {
    addResizeHandle(this);
  }
  saveToLocalStorage = function saveToLocalStorage() {
    if (SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(_this, 'isLocal')) === 'true') {
      localStorage.setItem(getLocalStorageHash(_this, 'gui'), JSON.stringify(_this.getSaveObject()));
    }
  };
  this.saveToLocalStorageIfPossible = saveToLocalStorage;
  function resetWidth() {
    var root = _this.getRoot();
    root.width += 1;
    Common.defer(function () {
      root.width -= 1;
    });
  }
  if (!params.parent) {
    resetWidth();
  }
};
GUI.toggleHide = function () {
  hide = !hide;
  Common.each(hideableGuis, function (gui) {
    gui.domElement.style.display = hide ? 'none' : '';
  });
};
GUI.CLASS_AUTO_PLACE = 'a';
GUI.CLASS_AUTO_PLACE_CONTAINER = 'ac';
GUI.CLASS_MAIN = 'main';
GUI.CLASS_CONTROLLER_ROW = 'cr';
GUI.CLASS_TOO_TALL = 'taller-than-window';
GUI.CLASS_CLOSED = 'closed';
GUI.CLASS_SELECTED = 'selected';
GUI.CLASS_CLOSE_BUTTON = 'close-button';
GUI.CLASS_CLOSE_TOP = 'close-top';
GUI.CLASS_CLOSE_BOTTOM = 'close-bottom';
GUI.CLASS_DRAG = 'drag';
GUI.DEFAULT_WIDTH = 245;
GUI.TEXT_CLOSED = 'Close Controls';
GUI.TEXT_OPEN = 'Open Controls';
GUI._keydownHandler = function (e) {
  if (document.activeElement.type !== 'text' && (e.which === HIDE_KEY_CODE || e.keyCode === HIDE_KEY_CODE)) {
    GUI.toggleHide();
  }
};
dom.bind(window, 'keydown', GUI._keydownHandler, false);
Common.extend(GUI.prototype,
{
  add: function add(object, property, label) {
    var hasLabel = typeof label === "string";
    return _add(this, object, property, {
      factoryArgs: Array.prototype.slice.call(arguments, hasLabel ? 3 : 2),
      label: hasLabel ? label : null
    });
  },
  addColor: function addColor(object, property) {
    return _add(this, object, property, {
      color: true
    });
  },
  remove: function remove(controller) {
    this.__ul.removeChild(controller.__li);
    this.__controllers.splice(this.__controllers.indexOf(controller), 1);
    var _this = this;
    Common.defer(function () {
      _this.onResize();
    });
  },
  destroy: function destroy() {
    if (this.parent) {
      throw new Error('Only the root GUI should be removed with .destroy(). ' + 'For subfolders, use gui.removeFolder(folder) instead.');
    }
    if (this.autoPlace) {
      autoPlaceContainer.removeChild(this.domElement);
    }
    var _this = this;
    Common.each(this.__folders, function (subfolder) {
      _this.removeFolder(subfolder);
    });
    dom.unbind(window, 'keydown', GUI._keydownHandler, false);
    removeListeners(this);
  },
  addFolder: function addFolder(name, label) {
    if (this.__folders[name] !== undefined) {
      throw new Error('You already have a folder in this GUI by the' + ' name "' + name + '"');
    }
    var newGuiParams = { name: name, label: label, parent: this };
    newGuiParams.autoPlace = this.autoPlace;
    if (this.load &&
    this.load.folders &&
    this.load.folders[name]) {
      newGuiParams.closed = this.load.folders[name].closed;
      newGuiParams.load = this.load.folders[name];
    }
    var gui = new GUI(newGuiParams);
    this.__folders[name] = gui;
    var li = addRow(this, gui.domElement);
    dom.addClass(li, 'folder');
    return gui;
  },
  removeFolder: function removeFolder(folder) {
    this.__ul.removeChild(folder.domElement.parentElement);
    delete this.__folders[folder.name];
    if (this.load &&
    this.load.folders &&
    this.load.folders[folder.name]) {
      delete this.load.folders[folder.name];
    }
    removeListeners(folder);
    var _this = this;
    Common.each(folder.__folders, function (subfolder) {
      folder.removeFolder(subfolder);
    });
    Common.defer(function () {
      _this.onResize();
    });
  },
  open: function open() {
    this.closed = false;
  },
  close: function close() {
    this.closed = true;
  },
  onResize: function onResize() {
    var root = this.getRoot();
    if (root.scrollable) {
      var top = dom.getOffset(root.__ul).top;
      var h = 0;
      Common.each(root.__ul.childNodes, function (node) {
        if (!(root.autoPlace && node === root.__save_row)) {
          h += dom.getHeight(node);
        }
      });
      if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT < h) {
        dom.addClass(root.domElement, GUI.CLASS_TOO_TALL);
        root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT + 'px';
      } else {
        dom.removeClass(root.domElement, GUI.CLASS_TOO_TALL);
        root.__ul.style.height = 'auto';
      }
    }
    if (root.__resize_handle) {
      Common.defer(function () {
        root.__resize_handle.style.height = root.__ul.offsetHeight + 'px';
      });
    }
    if (root.__closeButton) {
      root.__closeButton.style.width = root.width + 'px';
    }
  },
  onResizeDebounced: Common.debounce(function () {
    this.onResize();
  }, 50),
  remember: function remember() {
    if (Common.isUndefined(SAVE_DIALOGUE)) {
      SAVE_DIALOGUE = new CenteredDiv();
      SAVE_DIALOGUE.domElement.innerHTML = saveDialogContents;
    }
    if (this.parent) {
      throw new Error('You can only call remember on a top level GUI.');
    }
    var _this = this;
    Common.each(Array.prototype.slice.call(arguments), function (object) {
      if (_this.__rememberedObjects.length === 0) {
        addSaveMenu(_this);
      }
      if (_this.__rememberedObjects.indexOf(object) === -1) {
        _this.__rememberedObjects.push(object);
      }
    });
    if (this.autoPlace) {
      setWidth(this, this.width);
    }
  },
  getRoot: function getRoot() {
    var gui = this;
    while (gui.parent) {
      gui = gui.parent;
    }
    return gui;
  },
  getSaveObject: function getSaveObject() {
    var toReturn = this.load;
    toReturn.closed = this.closed;
    if (this.__rememberedObjects.length > 0) {
      toReturn.preset = this.preset;
      if (!toReturn.remembered) {
        toReturn.remembered = {};
      }
      toReturn.remembered[this.preset] = getCurrentPreset(this);
    }
    toReturn.folders = {};
    Common.each(this.__folders, function (element, key) {
      toReturn.folders[key] = element.getSaveObject();
    });
    return toReturn;
  },
  save: function save() {
    if (!this.load.remembered) {
      this.load.remembered = {};
    }
    this.load.remembered[this.preset] = getCurrentPreset(this);
    markPresetModified(this, false);
    this.saveToLocalStorageIfPossible();
  },
  saveAs: function saveAs(presetName) {
    if (!this.load.remembered) {
      this.load.remembered = {};
      this.load.remembered[DEFAULT_DEFAULT_PRESET_NAME] = getCurrentPreset(this, true);
    }
    this.load.remembered[presetName] = getCurrentPreset(this);
    this.preset = presetName;
    addPresetOption(this, presetName, true);
    this.saveToLocalStorageIfPossible();
  },
  revert: function revert(gui) {
    Common.each(this.__controllers, function (controller) {
      if (!this.getRoot().load.remembered) {
        controller.setValue(controller.initialValue);
      } else {
        recallSavedValue(gui || this.getRoot(), controller);
      }
      if (controller.__onFinishChange) {
        controller.__onFinishChange.call(controller, controller.getValue());
      }
    }, this);
    Common.each(this.__folders, function (folder) {
      folder.revert(folder);
    });
    if (!gui) {
      markPresetModified(this.getRoot(), false);
    }
  },
  listen: function listen(controller) {
    var init = this.__listening.length === 0;
    this.__listening.push(controller);
    if (init) {
      updateDisplays(this.__listening);
    }
  },
  updateDisplay: function updateDisplay() {
    Common.each(this.__controllers, function (controller) {
      controller.updateDisplay();
    });
    Common.each(this.__folders, function (folder) {
      folder.updateDisplay();
    });
  }
});
function addRow(gui, newDom, liBefore) {
  var li = document.createElement('li');
  if (newDom) {
    li.appendChild(newDom);
  }
  if (liBefore) {
    gui.__ul.insertBefore(li, liBefore);
  } else {
    gui.__ul.appendChild(li);
  }
  gui.onResize();
  return li;
}
function removeListeners(gui) {
  dom.unbind(window, 'resize', gui.__resizeHandler);
  if (gui.saveToLocalStorageIfPossible) {
    dom.unbind(window, 'unload', gui.saveToLocalStorageIfPossible);
  }
}
function markPresetModified(gui, modified) {
  var opt = gui.__preset_select[gui.__preset_select.selectedIndex];
  if (modified) {
    opt.innerHTML = opt.value + '*';
  } else {
    opt.innerHTML = opt.value;
  }
}
function augmentController(gui, li, controller) {
  controller.__li = li;
  controller.__gui = gui;
  Common.extend(controller,                                   {
    options: function options(_options) {
      if (arguments.length > 1) {
        var nextSibling = controller.__li.nextElementSibling;
        controller.remove();
        return _add(gui, controller.object, controller.property, {
          before: nextSibling,
          factoryArgs: [Common.toArray(arguments)]
        });
      }
      if (Common.isArray(_options) || Common.isObject(_options)) {
        var _nextSibling = controller.__li.nextElementSibling;
        controller.remove();
        return _add(gui, controller.object, controller.property, {
          before: _nextSibling,
          factoryArgs: [_options]
        });
      }
    },
    name: function name(_name) {
      controller.__li.firstElementChild.firstElementChild.innerHTML = _name;
      return controller;
    },
    listen: function listen() {
      controller.__gui.listen(controller);
      return controller;
    },
    remove: function remove() {
      controller.__gui.remove(controller);
      return controller;
    }
  });
  if (controller instanceof NumberControllerSlider) {
    var box = new NumberControllerBox(controller.object, controller.property, { min: controller.__min, max: controller.__max, step: controller.__step });
    Common.each(['updateDisplay', 'onChange', 'onFinishChange', 'step'], function (method) {
      var pc = controller[method];
      var pb = box[method];
      controller[method] = box[method] = function () {
        var args = Array.prototype.slice.call(arguments);
        pb.apply(box, args);
        return pc.apply(controller, args);
      };
    });
    dom.addClass(li, 'has-slider');
    controller.domElement.insertBefore(box.domElement, controller.domElement.firstElementChild);
  } else if (controller instanceof NumberControllerBox) {
    var r = function r(returned) {
      if (Common.isNumber(controller.__min) && Common.isNumber(controller.__max)) {
        var oldName = controller.__li.firstElementChild.firstElementChild.innerHTML;
        var wasListening = controller.__gui.__listening.indexOf(controller) > -1;
        controller.remove();
        var newController = _add(gui, controller.object, controller.property, {
          before: controller.__li.nextElementSibling,
          factoryArgs: [controller.__min, controller.__max, controller.__step]
        });
        newController.name(oldName);
        if (wasListening) newController.listen();
        return newController;
      }
      return returned;
    };
    controller.min = Common.compose(r, controller.min);
    controller.max = Common.compose(r, controller.max);
  } else if (controller instanceof BooleanController) {
    dom.bind(li, 'click', function () {
      dom.fakeEvent(controller.__checkbox, 'click');
    });
    dom.bind(controller.__checkbox, 'click', function (e) {
      e.stopPropagation();
    });
  } else if (controller instanceof FunctionController) {
    dom.bind(li, 'click', function () {
      dom.fakeEvent(controller.__button, 'click');
    });
    dom.bind(li, 'mouseover', function () {
      dom.addClass(controller.__button, 'hover');
    });
    dom.bind(li, 'mouseout', function () {
      dom.removeClass(controller.__button, 'hover');
    });
  } else if (controller instanceof ColorController) {
    dom.addClass(li, 'color');
    controller.updateDisplay = Common.compose(function (val) {
      li.style.borderLeftColor = controller.__color.toString();
      return val;
    }, controller.updateDisplay);
    controller.updateDisplay();
  }
  controller.setValue = Common.compose(function (val) {
    if (gui.getRoot().__preset_select && controller.isModified()) {
      markPresetModified(gui.getRoot(), true);
    }
    return val;
  }, controller.setValue);
}
function recallSavedValue(gui, controller) {
  var root = gui.getRoot();
  var matchedIndex = root.__rememberedObjects.indexOf(controller.object);
  if (matchedIndex !== -1) {
    var controllerMap = root.__rememberedObjectIndecesToControllers[matchedIndex];
    if (controllerMap === undefined) {
      controllerMap = {};
      root.__rememberedObjectIndecesToControllers[matchedIndex] = controllerMap;
    }
    controllerMap[controller.property] = controller;
    if (root.load && root.load.remembered) {
      var presetMap = root.load.remembered;
      var preset = void 0;
      if (presetMap[gui.preset]) {
        preset = presetMap[gui.preset];
      } else if (presetMap[DEFAULT_DEFAULT_PRESET_NAME]) {
        preset = presetMap[DEFAULT_DEFAULT_PRESET_NAME];
      } else {
        return;
      }
      if (preset[matchedIndex] && preset[matchedIndex][controller.property] !== undefined) {
        var value = preset[matchedIndex][controller.property];
        controller.initialValue = value;
        controller.setValue(value);
      }
    }
  }
}
function _add(gui, object, property, params) {
  if (object[property] === undefined) {
    throw new Error('Object "' + object + '" has no property "' + property + '"');
  }
  var controller = void 0;
  if (params.color) {
    controller = new ColorController(object, property);
  } else {
    var factoryArgs = [object, property].concat(params.factoryArgs);
    controller = ControllerFactory.apply(gui, factoryArgs);
  }
  if (params.before instanceof Controller) {
    params.before = params.before.__li;
  }
  recallSavedValue(gui, controller);
  dom.addClass(controller.domElement, 'c');
  var name = document.createElement('span');
  dom.addClass(name, 'property-name');
  name.innerHTML = params.label || controller.property;
  var container = document.createElement('div');
  container.appendChild(name);
  container.appendChild(controller.domElement);
  var li = addRow(gui, container, params.before);
  dom.addClass(li, GUI.CLASS_CONTROLLER_ROW);
  if (controller instanceof ColorController) {
    dom.addClass(li, 'color');
  } else {
    dom.addClass(li, _typeof(controller.getValue()));
  }
  augmentController(gui, li, controller);
  gui.__controllers.push(controller);
  return controller;
}
function getLocalStorageHash(gui, key) {
  return document.location.href + '.' + key;
}
function addPresetOption(gui, name, setSelected) {
  var opt = document.createElement('option');
  opt.innerHTML = name;
  opt.value = name;
  gui.__preset_select.appendChild(opt);
  if (setSelected) {
    gui.__preset_select.selectedIndex = gui.__preset_select.length - 1;
  }
}
function showHideExplain(gui, explain) {
  explain.style.display = gui.useLocalStorage ? 'block' : 'none';
}
function addSaveMenu(gui) {
  var div = gui.__save_row = document.createElement('li');
  dom.addClass(gui.domElement, 'has-save');
  gui.__ul.insertBefore(div, gui.__ul.firstChild);
  dom.addClass(div, 'save-row');
  var gears = document.createElement('span');
  gears.innerHTML = '&nbsp;';
  dom.addClass(gears, 'button gears');
  var button = document.createElement('span');
  button.innerHTML = 'Save';
  dom.addClass(button, 'button');
  dom.addClass(button, 'save');
  var button2 = document.createElement('span');
  button2.innerHTML = 'New';
  dom.addClass(button2, 'button');
  dom.addClass(button2, 'save-as');
  var button3 = document.createElement('span');
  button3.innerHTML = 'Revert';
  dom.addClass(button3, 'button');
  dom.addClass(button3, 'revert');
  var select = gui.__preset_select = document.createElement('select');
  if (gui.load && gui.load.remembered) {
    Common.each(gui.load.remembered, function (value, key) {
      addPresetOption(gui, key, key === gui.preset);
    });
  } else {
    addPresetOption(gui, DEFAULT_DEFAULT_PRESET_NAME, false);
  }
  dom.bind(select, 'change', function () {
    for (var index = 0; index < gui.__preset_select.length; index++) {
      gui.__preset_select[index].innerHTML = gui.__preset_select[index].value;
    }
    gui.preset = this.value;
  });
  div.appendChild(select);
  div.appendChild(gears);
  div.appendChild(button);
  div.appendChild(button2);
  div.appendChild(button3);
  if (SUPPORTS_LOCAL_STORAGE) {
    var explain = document.getElementById('dg-local-explain');
    var localStorageCheckBox = document.getElementById('dg-local-storage');
    var saveLocally = document.getElementById('dg-save-locally');
    saveLocally.style.display = 'block';
    if (localStorage.getItem(getLocalStorageHash(gui, 'isLocal')) === 'true') {
      localStorageCheckBox.setAttribute('checked', 'checked');
    }
    showHideExplain(gui, explain);
    dom.bind(localStorageCheckBox, 'change', function () {
      gui.useLocalStorage = !gui.useLocalStorage;
      showHideExplain(gui, explain);
    });
  }
  var newConstructorTextArea = document.getElementById('dg-new-constructor');
  dom.bind(newConstructorTextArea, 'keydown', function (e) {
    if (e.metaKey && (e.which === 67 || e.keyCode === 67)) {
      SAVE_DIALOGUE.hide();
    }
  });
  dom.bind(gears, 'click', function () {
    newConstructorTextArea.innerHTML = JSON.stringify(gui.getSaveObject(), undefined, 2);
    SAVE_DIALOGUE.show();
    newConstructorTextArea.focus();
    newConstructorTextArea.select();
  });
  dom.bind(button, 'click', function () {
    gui.save();
  });
  dom.bind(button2, 'click', function () {
    var presetName = prompt('Enter a new preset name.');
    if (presetName) {
      gui.saveAs(presetName);
    }
  });
  dom.bind(button3, 'click', function () {
    gui.revert();
  });
}
function addResizeHandle(gui) {
  var pmouseX = void 0;
  gui.__resize_handle = document.createElement('div');
  Common.extend(gui.__resize_handle.style, {
    width: '6px',
    marginLeft: '-3px',
    height: '200px',
    cursor: 'ew-resize',
    position: 'absolute'
  });
  function drag(e) {
    e.preventDefault();
    gui.width += pmouseX - e.clientX;
    gui.onResize();
    pmouseX = e.clientX;
    return false;
  }
  function dragStop() {
    dom.removeClass(gui.__closeButton, GUI.CLASS_DRAG);
    dom.unbind(window, 'mousemove', drag);
    dom.unbind(window, 'mouseup', dragStop);
  }
  function dragStart(e) {
    e.preventDefault();
    pmouseX = e.clientX;
    dom.addClass(gui.__closeButton, GUI.CLASS_DRAG);
    dom.bind(window, 'mousemove', drag);
    dom.bind(window, 'mouseup', dragStop);
    return false;
  }
  dom.bind(gui.__resize_handle, 'mousedown', dragStart);
  dom.bind(gui.__closeButton, 'mousedown', dragStart);
  gui.domElement.insertBefore(gui.__resize_handle, gui.domElement.firstElementChild);
}
function setWidth(gui, w) {
  gui.domElement.style.width = w + 'px';
  if (gui.__save_row && gui.autoPlace) {
    gui.__save_row.style.width = w + 'px';
  }
  if (gui.__closeButton) {
    gui.__closeButton.style.width = w + 'px';
  }
}
function getCurrentPreset(gui, useInitialValues) {
  var toReturn = {};
  Common.each(gui.__rememberedObjects, function (val, index) {
    var savedValues = {};
    var controllerMap = gui.__rememberedObjectIndecesToControllers[index];
    Common.each(controllerMap, function (controller, property) {
      savedValues[property] = useInitialValues ? controller.initialValue : controller.getValue();
    });
    toReturn[index] = savedValues;
  });
  return toReturn;
}
function setPresetSelectIndex(gui) {
  for (var index = 0; index < gui.__preset_select.length; index++) {
    if (gui.__preset_select[index].value === gui.preset) {
      gui.__preset_select.selectedIndex = index;
    }
  }
}
function updateDisplays(controllerArray) {
  if (controllerArray.length !== 0) {
    requestAnimationFrame$1.call(window, function () {
      updateDisplays(controllerArray);
    });
  }
  Common.each(controllerArray, function (c) {
    c.updateDisplay();
  });
}

var color = {
  Color: Color,
  math: ColorMath,
  interpret: interpret
};
var controllers = {
  Controller: Controller,
  BooleanController: BooleanController,
  OptionController: OptionController,
  StringController: StringController,
  NumberController: NumberController,
  NumberControllerBox: NumberControllerBox,
  NumberControllerSlider: NumberControllerSlider,
  FunctionController: FunctionController,
  ColorController: ColorController
};
var dom$1 = { dom: dom };
var gui = { GUI: GUI };
var GUI$1 = GUI;
var index = {
  color: color,
  controllers: controllers,
  dom: dom$1,
  gui: gui,
  GUI: GUI$1
};

exports.color = color;
exports.controllers = controllers;
exports.dom = dom$1;
exports.gui = gui;
exports.GUI = GUI$1;
exports['default'] = index;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=dat.gui.js.map
"use strict";
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        /**
         * 事件派发器
         */
        var EventDispatcher = (function () {
            function EventDispatcher() {
                this.__z_e_listeners = {};
            }
            EventDispatcher.prototype.addEventListener = function (type, fun, thisObj, level) {
                if (level === void 0) { level = 0; }
                var list = this.__z_e_listeners[type];
                if (list === undefined) {
                    list = [];
                    this.__z_e_listeners[type] = list;
                }
                var item = {
                    func: fun,
                    context: thisObj,
                    level: level
                };
                list.push(item);
                list.sort(function (a, b) {
                    return b.level - a.level;
                });
            };
            EventDispatcher.prototype.removeEventListener = function (type, fun, thisObj) {
                var list = this.__z_e_listeners[type];
                if (list !== undefined) {
                    var size = list.length;
                    for (var i = 0; i < size; i++) {
                        var obj = list[i];
                        if (obj.func === fun && obj.context === thisObj) {
                            list.splice(i, 1);
                            return;
                        }
                    }
                }
            };
            EventDispatcher.prototype.dispatchEvent = function (event) {
                var list = this.__z_e_listeners[event.type];
                if (list !== undefined) {
                    list.forEach(function (ef) {
                        ef['___dirty___'] = true;
                    });
                    var size = list.length;
                    for (var i = 0; i < size; i++) {
                        var ef = list[i];
                        if (ef['___dirty___']) {
                            var fun = ef.func;
                            var context = ef.context;
                            if (context) {
                                fun.call(context, event);
                            }
                            else {
                                fun(event);
                            }
                            ef['___dirty___'] = false;
                        }
                        if (size != list.length) {
                            size = list.length;
                            i = 0;
                        }
                    }
                }
            };
            return EventDispatcher;
        }());
        editor.EventDispatcher = EventDispatcher;
        __reflect(EventDispatcher.prototype, "paper.editor.EventDispatcher", ["paper.editor.IEventDispatcher"]);
        /**
         * 事件
         */
        var BaseEvent = (function () {
            function BaseEvent(type, data) {
                this.type = type;
                this.data = data;
            }
            return BaseEvent;
        }());
        editor.BaseEvent = BaseEvent;
        __reflect(BaseEvent.prototype, "paper.editor.BaseEvent");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        /**
         * @internal
         */
        var BaseSelectedGOComponent = (function (_super) {
            __extends(BaseSelectedGOComponent, _super);
            function BaseSelectedGOComponent() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            BaseSelectedGOComponent.prototype.update = function () {
                var modelComponent = this.gameObject.getComponent(editor.ModelComponent);
                var selectedGameObject = modelComponent.selectedGameObject;
                if (!selectedGameObject) {
                    this.gameObject.activeSelf = false;
                    return null;
                }
                this.gameObject.activeSelf = true;
                return selectedGameObject;
            };
            return BaseSelectedGOComponent;
        }(paper.BaseComponent));
        editor.BaseSelectedGOComponent = BaseSelectedGOComponent;
        __reflect(BaseSelectedGOComponent.prototype, "paper.editor.BaseSelectedGOComponent");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        var BaseState = (function () {
            function BaseState() {
                this.autoClear = false;
                this.batchIndex = 0;
                this._isDone = false;
            }
            BaseState.prototype.undo = function () {
                if (this._isDone) {
                    this._isDone = false;
                    return true;
                }
                return false;
            };
            BaseState.prototype.redo = function () {
                if (this._isDone) {
                    return false;
                }
                this._isDone = true;
                this.editorModel.dirty = true;
                return true;
            };
            Object.defineProperty(BaseState.prototype, "isDone", {
                get: function () {
                    return this._isDone;
                },
                set: function (value) {
                    this._isDone = value;
                },
                enumerable: true,
                configurable: true
            });
            BaseState.prototype.dispatchEditorModelEvent = function (type, data) {
                this.editorModel.dispatchEvent(new editor.EditorModelEvent(type, data));
            };
            BaseState.prototype.serialize = function () {
                return null;
            };
            BaseState.prototype.deserialize = function (data) {
            };
            return BaseState;
        }());
        editor.BaseState = BaseState;
        __reflect(BaseState.prototype, "paper.editor.BaseState");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        var EditorSceneModel = (function () {
            function EditorSceneModel() {
                this.viewCache = {};
            }
            Object.defineProperty(EditorSceneModel.prototype, "editorScene", {
                get: function () {
                    return paper.Application.sceneManager.editorScene;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditorSceneModel.prototype, "editorModel", {
                set: function (v) {
                    if (this.currentModel) {
                        this.viewCache[this.currentModel.contentUrl] = {
                            position: this.cameraObject.transform.position.clone(),
                            rotation: this.cameraObject.transform.rotation.clone()
                        };
                    }
                    // this.pickGameScript.clearSelected();
                    // this.geoController.clearSelected();//TODO:应在controller里新增清空状态函数
                    // this.editorCameraScript.editorModel = v;
                    // this.pickGameScript.editorModel = v;
                    // this.geoController.editorModel = v;
                    this.currentModel = v;
                    if (v && this.viewCache[v.contentUrl]) {
                        this.cameraObject.transform.setPosition(this.viewCache[v.contentUrl].position);
                        this.cameraObject.transform.setRotation(this.viewCache[v.contentUrl].rotation);
                    }
                    else {
                        this.cameraObject.transform.setLocalPosition(0.0, 10.0, -10.0);
                        this.cameraObject.transform.lookAt(egret3d.Vector3.ZERO);
                    }
                },
                enumerable: true,
                configurable: true
            });
            EditorSceneModel.prototype.init = function () {
                this.cameraObject = egret3d.Camera.editor.gameObject;
                // this.cameraObject = GameObject.create("EditorCamera", DefaultTags.EditorOnly, Application.sceneManager.editorScene);
                var camera = this.cameraObject.getOrAddComponent(egret3d.Camera);
                camera.near = 0.1;
                camera.far = 500.0;
                camera.backgroundColor.set(0.13, 0.28, 0.51, 1.00);
                this.cameraObject.transform.setLocalPosition(0.0, 10.0, -10.0);
                this.cameraObject.transform.lookAt(egret3d.Vector3.ZERO);
                paper.GameObject.globalGameObject.sendMessage("bootstrap");
                // this.editorCameraScript = this.cameraObject.addComponent(EditorCameraScript);
                // this.editorCameraScript.moveSpeed = 10;
                // this.editorCameraScript.rotateSpeed = 0.5;
                // this.pickGameScript = this.cameraObject.addComponent(PickGameObjectScript);
                // this.geoController = this.cameraObject.addComponent(Controller)
            };
            return EditorSceneModel;
        }());
        editor.EditorSceneModel = EditorSceneModel;
        __reflect(EditorSceneModel.prototype, "paper.editor.EditorSceneModel");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        var ValueUUID = (function () {
            function ValueUUID(_value) {
                this._value = _value;
                // empty
            }
            ValueUUID.prototype.asHex = function () {
                return this._value;
            };
            return ValueUUID;
        }());
        __reflect(ValueUUID.prototype, "ValueUUID", ["paper.editor.UUID"]);
        var V4UUID = (function (_super) {
            __extends(V4UUID, _super);
            function V4UUID() {
                return _super.call(this, [
                    V4UUID._randomHex(),
                    V4UUID._randomHex(),
                    V4UUID._randomHex(),
                    V4UUID._randomHex(),
                    V4UUID._randomHex(),
                    V4UUID._randomHex(),
                    V4UUID._randomHex(),
                    V4UUID._randomHex(),
                    '-',
                    V4UUID._randomHex(),
                    V4UUID._randomHex(),
                    V4UUID._randomHex(),
                    V4UUID._randomHex(),
                    '-',
                    '4',
                    V4UUID._randomHex(),
                    V4UUID._randomHex(),
                    V4UUID._randomHex(),
                    '-',
                    V4UUID._oneOf(V4UUID._timeHighBits),
                    V4UUID._randomHex(),
                    V4UUID._randomHex(),
                    V4UUID._randomHex(),
                    '-',
                    V4UUID._randomHex(),
                    V4UUID._randomHex(),
                    V4UUID._randomHex(),
                    V4UUID._randomHex(),
                    V4UUID._randomHex(),
                    V4UUID._randomHex(),
                    V4UUID._randomHex(),
                    V4UUID._randomHex(),
                    V4UUID._randomHex(),
                    V4UUID._randomHex(),
                    V4UUID._randomHex(),
                    V4UUID._randomHex(),
                ].join('')) || this;
            }
            V4UUID._oneOf = function (array) {
                return array[Math.floor(array.length * Math.random())];
            };
            V4UUID._randomHex = function () {
                return V4UUID._oneOf(V4UUID._chars);
            };
            V4UUID._chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
            V4UUID._timeHighBits = ['8', '9', 'a', 'b'];
            return V4UUID;
        }(ValueUUID));
        __reflect(V4UUID.prototype, "V4UUID");
        function v4() {
            return new V4UUID();
        }
        editor.v4 = v4;
        var _UUIDPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        function isUUID(value) {
            return _UUIDPattern.test(value);
        }
        editor.isUUID = isUUID;
        /**
         * Parses a UUID that is of the format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.
         * @param value A uuid string.
         */
        function parse(value) {
            if (!isUUID(value)) {
                throw new Error('invalid uuid');
            }
            return new ValueUUID(value);
        }
        editor.parse = parse;
        function generateUuid() {
            return v4().asHex();
        }
        editor.generateUuid = generateUuid;
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        /**
         * 状态组
         * @author 杨宁
         */
        var StateGroup = (function (_super) {
            __extends(StateGroup, _super);
            function StateGroup() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            StateGroup.create = function (stateList) {
                var instance = new StateGroup();
                instance.stateList = stateList;
                return instance;
            };
            StateGroup.prototype.redo = function () {
                for (var i = 0; i < this.stateList.length; i++) {
                    this.stateList[i].redo();
                }
                return true;
            };
            StateGroup.prototype.undo = function () {
                for (var i = this.stateList.length - 1; i >= 0; i--) {
                    this.stateList[i].undo();
                }
                return true;
            };
            StateGroup.prototype.serialize = function () {
                var states = this.stateList;
                var statesData = [];
                for (var index = 0; index < states.length; index++) {
                    var element = states[index];
                    var className = egret.getQualifiedClassName(element);
                    var data = {
                        className: className,
                        batchIndex: element.batchIndex,
                        data: element['serialize'] ? element['serialize']() : element.data,
                        autoClear: element.autoClear,
                        isDone: element.isDone,
                    };
                    statesData.push(data);
                }
                return states;
            };
            StateGroup.prototype.deserialize = function (data) {
                this.stateList = [];
                var statesData = data;
                for (var index = 0; index < statesData.length; index++) {
                    var element = statesData[index];
                    var clazz = egret.getDefinitionByName(element.className);
                    var state = void 0;
                    if (clazz) {
                        state = new clazz();
                        state.batchIndex = element.batchIndex;
                        state.data = element['deserialize'] ? element['deserialize'](element.data) : element.data;
                        state.autoClear = element.autoClear;
                        state.isDone = element.isDone;
                        this.stateList.push(state);
                    }
                }
            };
            return StateGroup;
        }(editor.BaseState));
        editor.StateGroup = StateGroup;
        __reflect(StateGroup.prototype, "paper.editor.StateGroup");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        /**
         * @internal
         */
        var BoxColliderDrawer = (function (_super) {
            __extends(BoxColliderDrawer, _super);
            function BoxColliderDrawer() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._drawer = [];
                return _this;
            }
            BoxColliderDrawer.prototype.initialize = function () {
                _super.prototype.initialize.call(this);
            };
            BoxColliderDrawer.prototype.update = function () {
                var selectedGameObject = _super.prototype.update.call(this);
                var colliders = selectedGameObject ? selectedGameObject.getComponents(egret3d.BoxCollider) : null;
                for (var i = 0, l = Math.max(this._drawer.length, colliders ? colliders.length : 0); i < l; ++i) {
                    if (i + 1 > this._drawer.length) {
                        var gameObject = editor.EditorMeshHelper.createBox("BoxCollider_" + i, egret3d.Color.YELLOW, 0.4, paper.Scene.editorScene);
                        gameObject.parent = this.gameObject;
                        this._drawer.push(gameObject);
                    }
                    var drawer = this._drawer[i];
                    if (!colliders || i + 1 > colliders.length) {
                        drawer.activeSelf = false;
                    }
                    else {
                        var collider = colliders[i];
                        if (collider.enabled) {
                            drawer.activeSelf = true;
                            drawer.transform.localPosition.applyMatrix(selectedGameObject.transform.localToWorldMatrix, collider.box.center).update();
                            drawer.transform.localRotation = selectedGameObject.transform.rotation;
                            drawer.transform.localScale.multiply(collider.box.size, selectedGameObject.transform.scale).update();
                        }
                        else {
                            drawer.activeSelf = false;
                        }
                    }
                }
                return selectedGameObject;
            };
            return BoxColliderDrawer;
        }(editor.BaseSelectedGOComponent));
        editor.BoxColliderDrawer = BoxColliderDrawer;
        __reflect(BoxColliderDrawer.prototype, "paper.editor.BoxColliderDrawer");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        /**
         * @internal
         */
        var BoxesDrawer = (function (_super) {
            __extends(BoxesDrawer, _super);
            function BoxesDrawer() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._hoverBox = editor.EditorMeshHelper.createBox("HoverAABB", egret3d.Color.WHITE, 0.6, paper.Scene.editorScene);
                _this._drawer = [];
                return _this;
            }
            BoxesDrawer.prototype.initialize = function () {
                _super.prototype.initialize.call(this);
                this._hoverBox.parent = this.gameObject;
            };
            BoxesDrawer.prototype.update = function () {
                var modelComponent = this.gameObject.getComponent(editor.ModelComponent);
                var selectedGameObjects = modelComponent.selectedGameObjects;
                var hoveredGameObject = modelComponent.hoveredGameObject;
                if (hoveredGameObject && hoveredGameObject.renderer) {
                    this._hoverBox.activeSelf = true;
                    this._hoverBox.transform.localPosition.applyMatrix(hoveredGameObject.transform.localToWorldMatrix, hoveredGameObject.renderer.localBoundingBox.center).update();
                    this._hoverBox.transform.localRotation = hoveredGameObject.transform.rotation;
                    this._hoverBox.transform.localScale.multiply(hoveredGameObject.renderer.localBoundingBox.size, hoveredGameObject.transform.scale).update();
                }
                else {
                    this._hoverBox.activeSelf = false;
                }
                for (var i = 0, l = Math.max(this._drawer.length, selectedGameObjects ? selectedGameObjects.length : 0); i < l; ++i) {
                    if (i + 1 > this._drawer.length) {
                        var gameObject = editor.EditorMeshHelper.createBox("AABB_" + i, egret3d.Color.INDIGO, 0.8, paper.Scene.editorScene);
                        gameObject.parent = this.gameObject;
                        this._drawer.push(gameObject);
                    }
                    var drawer = this._drawer[i];
                    if (i + 1 > selectedGameObjects.length) {
                        drawer.activeSelf = false;
                    }
                    else {
                        var gameObject = selectedGameObjects[i];
                        if (gameObject.activeSelf && gameObject.renderer) {
                            drawer.activeSelf = true;
                            drawer.transform.localPosition.applyMatrix(gameObject.transform.localToWorldMatrix, gameObject.renderer.localBoundingBox.center).update();
                            drawer.transform.localRotation = gameObject.transform.rotation;
                            drawer.transform.localScale.multiply(gameObject.renderer.localBoundingBox.size, gameObject.transform.scale).update();
                        }
                        else {
                            drawer.activeSelf = false;
                        }
                    }
                }
            };
            return BoxesDrawer;
        }(paper.BaseComponent));
        editor.BoxesDrawer = BoxesDrawer;
        __reflect(BoxesDrawer.prototype, "paper.editor.BoxesDrawer");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        /**
         * @internal
         */
        var CylinderColliderDrawer = (function (_super) {
            __extends(CylinderColliderDrawer, _super);
            function CylinderColliderDrawer() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._drawer = [];
                return _this;
            }
            CylinderColliderDrawer.prototype.initialize = function () {
                _super.prototype.initialize.call(this);
            };
            CylinderColliderDrawer.prototype.update = function () {
                var selectedGameObject = _super.prototype.update.call(this);
                var colliders = selectedGameObject ? selectedGameObject.getComponents(egret3d.CylinderCollider) : null;
                for (var i = 0, l = Math.max(this._drawer.length, colliders ? colliders.length : 0); i < l; ++i) {
                    if (i + 1 > this._drawer.length) {
                        var gameObject = editor.EditorMeshHelper.createGameObject("CylinderCollider_" + i);
                        gameObject.parent = this.gameObject;
                        editor.EditorMeshHelper.createCircle("Top", egret3d.Color.YELLOW, 0.4, paper.Scene.editorScene).transform
                            .setParent(gameObject.transform).setLocalPosition(0.0, 0.5, 0.0).setLocalEuler(0.0, 0.0, Math.PI * 0.5);
                        editor.EditorMeshHelper.createLine("Height", egret3d.Color.YELLOW, 0.4, paper.Scene.editorScene).transform
                            .setParent(gameObject.transform).setLocalPosition(0.0, -0.5, 0.0);
                        editor.EditorMeshHelper.createCircle("Bottom", egret3d.Color.YELLOW, 0.4, paper.Scene.editorScene).transform
                            .setParent(gameObject.transform).setLocalPosition(0.0, -0.5, 0.0).setLocalEuler(0.0, 0.0, -Math.PI * 0.5);
                        this._drawer.push(gameObject);
                    }
                    var drawer = this._drawer[i];
                    if (!colliders || i + 1 > colliders.length) {
                        drawer.activeSelf = false;
                    }
                    else {
                        var collider = colliders[i];
                        if (collider.enabled) {
                            drawer.activeSelf = true;
                            drawer.transform.localPosition.applyMatrix(selectedGameObject.transform.localToWorldMatrix, collider.center).update();
                            drawer.transform.localRotation = selectedGameObject.transform.rotation;
                            drawer.transform.find("Top").transform.setLocalScale(collider.topRadius * 2.0);
                            drawer.transform.find("Bottom").transform.setLocalScale(collider.bottomRadius * 2.0);
                            drawer.transform.localScale.set(1.0, collider.height, 1.0).multiply(selectedGameObject.transform.scale).update();
                        }
                        else {
                            drawer.activeSelf = false;
                        }
                    }
                }
                return selectedGameObject;
            };
            return CylinderColliderDrawer;
        }(editor.BaseSelectedGOComponent));
        editor.CylinderColliderDrawer = CylinderColliderDrawer;
        __reflect(CylinderColliderDrawer.prototype, "paper.editor.CylinderColliderDrawer");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        var icons = {
            camera: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIcSURBVFhH7ZbPjtMwEMYj7vAACCFg28Rx4oQmtGnLQo/7Du1pK3Hk2BtSHwYkXoA34C34I7Fozxxoy+6yaocZx9M6u4WkFaA95JN+qu0Z21/riVOnVq1a/0oiaoMXPdlCBxpxG0xaNXlB+vHqIl7Utfo5Jl3LxU2uxpkmmjNp1RTEGfg4kZhOp/eRe8xwOHzqmnjSPXxnpjhBlIEIM5BRb40f96Ch2jCZTO6atGryVQeESjVmqCA/zGNy15/2xuv4xcuBK1N4KBNw445FZugauG/ndKr9GlJRYWBBxcn7LHveHAyOHtC4iJKLbQW0C0IlBRNemH6jTzpSQqouOFQ89iSdibLHcrKKbObYBqhGaC9qc/yaAdnKdMKjoLUe08QpvH7zFsp08fOyMI8N0DHRPqUGRJhXsWr112ME5SwWM73Jp5NTzecvFtg/+XqK0UsQ1vNvG+Ax6nN7bYBN8GPW0HVRZL44h+VqdW2cafcOYYUW9jZAAZb3uHiWxPcfZQae7Wdgmw7wYuEk5r8a8MPNBGa+OIMVGpBRfyu9rI/bL/+OAU/Sy2azOS06m81xgzItoRkmm3l7G2gGr7gwGR8LU+JbLAcvEQ29bIi8L4Li0bEBunR4TK9v2r81QCIDwiQSblwNzifYAMkNW+Dil6A2x/9ogGQvtg8HQn0wS2mxIY5LlV98pRqNRnfG4/HtXcD/CrfM9Fq1at1kOc4vVSG2+aaGzOwAAAAASUVORK5CYII=",
            light: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAPcSURBVFhH3ZdLSNRRFMbn4fuZmtmYZpn0gCx6YbQokBZRq6hVL6xWUdCmICIoIYjaWBDRu3WShhUJLSKIIKISgqBWao9NlIsUwlKn33fnzDij/1HHsU0fHM693z333HPOffxnfNNBMBjcgRpCVjjiX6GwsHAJKhDpjYIAdqLCyEpHxKG8vLwgJyen2rrTR25uboPf7/+Ns31GxTBRAJmZmc2BQKC/rKys0qhpAz+Bt8inUCiUZ5xDsgAIeh5BDzCnzaj0kJ2d3YjDcFZW1imjHJIFkJGRcQf7waKiojqj0gdOH5DRz7y8vLlGeQZA6Vex+DBjLUalhtLS0iJrJoDsl+os4PiGUVqsHu48zVCEcYE+JdAfZF9qVAKS+XfgoM1nch+LnK2oqMg3OgYWvIhcsu44VFVV5RLAXYI9alQMBQUFsxm7prPk5dtBhwejdu03hr04Uonj4TftKy4ursVmP/bH0LvZmlgVQMwOBDlDh/D53bbmWklJSbGNeYMJW3D6kWaYBZ4Q/bLIiM+nM8BYG85G6Gr/ndD/owy5doWyE6joBmzf0Ayz8EsSXBsZmRqycHgCx/1MPieCyKtpdyNhgnTCluh2hHGuIFS519EgsGul/w27g3THPWRTAoemyg6OH2fPtLgWoz9OqI4CUNVu0Ve1QmxVidppgywaUUkXjwplVyWGsF9If+ZA5i3Knuw8F46KApCmEkfQKaEH+ewhWxG9xw+13zQnFJ0DBYl2DxHzDqO8/D5HRsGEVuTeWGFovcZx1D6VAKJVQl+gr8pt9/KLXNb4lIGjMzpgkwWhmyGN3V70zMHeguGJDqECtEP4k9M/Cy59cMe3ktUCtcnqKs7D+fn5bq+hEhYXrzZzjqN1DdcQcIPaKcOe2g6aKqfbr5qamhy4TnHKVA+QSh4V8ez/dbR7iml3Eugw+ibBzRE3KfRBYb+bmfhLwuLNY36IBFn4KGO6NfEVeI/tLhlEoS8ivq5gO8R4H4HoagYjox7AwXIMu5mgTDrIqtaGHOwTG31S/aoSduv0RBvnqhT/PRDYitX4fUFTt6NL35PIyBhoIkE8J8NtRiWAxR4x/tS642DV+4BcNCoefhJqYv5j2ql/F5i8GaV9PxlhXECbUM+QRY4AcLep4CC/pBcbNSMIUsIupFdZGuf5k4xTX0kAAwRy36j0QdkO6Fyg9xjl4BWAwOKnUSPcFFUoPegPBpl/RV7RTdi7ZAHoJxf2Xxh/TXd6vwOiIOt6HPWQzUajYkgWgMC8JsbfJT3xqaCuri7bmgmYKACgzDMizX+EuFswc39A/kfE/0RPAp/vL7M1A0/aWSCCAAAAAElFTkSuQmCC"
        };
        /**
         * @internal
         */
        var EditorDefaultTexture = (function (_super) {
            __extends(EditorDefaultTexture, _super);
            function EditorDefaultTexture() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            EditorDefaultTexture.prototype.initialize = function () {
                {
                    var texture_1 = new egret3d.GLTexture2D("builtin/camera_icon.image.json");
                    var image_1 = new Image();
                    image_1.setAttribute('src', icons["camera"]);
                    image_1.onload = function () { texture_1.uploadImage(image_1, false, true, true, false); };
                    EditorDefaultTexture.CAMERA_ICON = texture_1;
                    paper.Asset.register(texture_1);
                }
                {
                    var texture_2 = new egret3d.GLTexture2D("builtin/light_icon.image.json");
                    var image_2 = new Image();
                    image_2.setAttribute('src', icons["light"]);
                    image_2.onload = function () { texture_2.uploadImage(image_2, false, true, true, false); };
                    EditorDefaultTexture.LIGHT_ICON = texture_2;
                    paper.Asset.register(texture_2);
                }
            };
            return EditorDefaultTexture;
        }(paper.SingletonComponent));
        editor.EditorDefaultTexture = EditorDefaultTexture;
        __reflect(EditorDefaultTexture.prototype, "paper.editor.EditorDefaultTexture");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        /**
         * @internal
         */
        var GizmoPickComponent = (function (_super) {
            __extends(GizmoPickComponent, _super);
            function GizmoPickComponent() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.pickTarget = null;
                return _this;
            }
            GizmoPickComponent.prototype.onDestroy = function () {
                this.pickTarget = null;
            };
            return GizmoPickComponent;
        }(paper.Behaviour));
        editor.GizmoPickComponent = GizmoPickComponent;
        __reflect(GizmoPickComponent.prototype, "paper.editor.GizmoPickComponent");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        var _step = 5;
        /**
         * @internal
         */
        var GridDrawer = (function (_super) {
            __extends(GridDrawer, _super);
            function GridDrawer() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._gridA = _this._createGrid("GridA");
                _this._gridB = _this._createGrid("GridB", 100.0 * _step, 100 * _step);
                return _this;
            }
            GridDrawer.prototype._createGrid = function (name, size, divisions) {
                if (size === void 0) { size = 100.0; }
                if (divisions === void 0) { divisions = 100; }
                var step = size / divisions;
                var halfSize = size / 2;
                var vertices = [];
                for (var i = 0, k = -halfSize; i <= divisions; i++, k += step) {
                    vertices.push(-halfSize, 0, k);
                    vertices.push(halfSize, 0, k);
                    vertices.push(k, 0, -halfSize);
                    vertices.push(k, 0, halfSize);
                }
                var mesh = new egret3d.Mesh(vertices.length, 0, ["POSITION" /* POSITION */]);
                mesh.setAttributes("POSITION" /* POSITION */, vertices);
                mesh.glTFMesh.primitives[0].mode = 1 /* Lines */;
                var gameObject = editor.EditorMeshHelper.createGameObject(name, mesh, egret3d.DefaultMaterials.MESH_BASIC.clone());
                return gameObject;
            };
            GridDrawer.prototype.initialize = function () {
                _super.prototype.initialize.call(this);
                this._gridA.parent = this.gameObject;
                this._gridB.parent = this.gameObject;
                var mA = this._gridA.renderer.material;
                var mB = this._gridB.renderer.material;
                mA.setBlend(1 /* Blend */, 3000 /* Transparent */);
                mB.setBlend(1 /* Blend */, 3000 /* Transparent */);
            };
            GridDrawer.prototype.update = function () {
                var camera = egret3d.Camera.editor;
                var aaa = camera.gameObject.getComponent(editor.OrbitControls);
                var target = aaa.lookAtPoint.clone().add(aaa.lookAtOffset);
                var eyeDistance = (10000.0 - target.getDistance(camera.gameObject.transform.position)) * 0.01; // TODO
                var d = (eyeDistance % 1.0);
                var s = d * (_step - 1) + 1.0;
                this._gridA.transform.setLocalScale(s * _step, 0.0, s * _step);
                this._gridB.transform.setLocalScale(s, 0.0, s);
                var mA = this._gridA.renderer.material;
                var mB = this._gridB.renderer.material;
                mA.opacity = 1.0 * 0.2;
                mB.opacity = 0.2 * 0.2;
            };
            return GridDrawer;
        }(paper.BaseComponent));
        editor.GridDrawer = GridDrawer;
        __reflect(GridDrawer.prototype, "paper.editor.GridDrawer");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        /**
         *
         */
        var GUIComponent = (function (_super) {
            __extends(GUIComponent, _super);
            function GUIComponent() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.hierarchy = new dat.GUI({ closeOnTop: true, width: 300 });
                _this.inspector = new dat.GUI({ closeOnTop: true, width: 300 });
                _this.stats = new Stats();
                _this.renderPanel = _this.stats.addPanel(new Stats.Panel("MS(R)", "#ff8", "#221"));
                return _this;
            }
            GUIComponent.prototype.initialize = function () {
                _super.prototype.initialize.call(this);
                this.stats.showPanel(0);
            };
            return GUIComponent;
        }(paper.SingletonComponent));
        editor.GUIComponent = GUIComponent;
        __reflect(GUIComponent.prototype, "paper.editor.GUIComponent");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        /**
         *
         */
        var ModelComponent = (function (_super) {
            __extends(ModelComponent, _super);
            function ModelComponent() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                /**
                 * 所有选中的实体。
                 */
                _this.selectedGameObjects = [];
                /**
                 * 选中的场景。
                 */
                _this.selectedScene = null;
                /**
                 *
                 */
                _this.hoveredGameObject = null;
                /**
                 * 最后一个选中的实体。
                 */
                _this.selectedGameObject = null;
                //
                _this._editorModel = null;
                return _this;
            }
            ModelComponent.prototype._onEditorSelectGameObjects = function (event) {
                for (var _i = 0, _a = this.selectedGameObjects; _i < _a.length; _i++) {
                    var gameObject = _a[_i];
                    if (event.data.indexOf(gameObject) < 0) {
                        this._unselect(gameObject);
                    }
                }
                for (var _b = 0, _c = event.data; _b < _c.length; _b++) {
                    var gameObject = _c[_b];
                    this._select(gameObject);
                }
            };
            ModelComponent.prototype._onChangeProperty = function (data) {
                var selectedGameObject = this.selectedGameObject;
                if (selectedGameObject && (data.target instanceof egret3d.Transform) && data.propName) {
                    var propName = data.propName;
                    switch (propName) {
                        case "localPosition":
                            selectedGameObject.transform.localPosition = data.propValue;
                            break;
                        case "localRotation":
                            selectedGameObject.transform.localRotation = data.propValue;
                            break;
                        case "localScale":
                            selectedGameObject.transform.localScale = data.propValue;
                            break;
                        case "position":
                            selectedGameObject.transform.position = data.propValue;
                            break;
                        case "rotation":
                            selectedGameObject.transform.rotation = data.propValue;
                            break;
                        case "scale":
                            selectedGameObject.transform.scale = data.propValue;
                            break;
                    }
                }
                if (data.target instanceof paper.GameObject) {
                    var propName = data.propName;
                    console.log(propName);
                }
            };
            ModelComponent.prototype._onChangeEditMode = function (mode) {
            };
            ModelComponent.prototype._onChangeEditType = function (type) {
            };
            ModelComponent.prototype.initialize = function () {
                var _this = this;
                if (paper.Application.playerMode === 2 /* Editor */) {
                    editor.Editor.addEventListener(editor.EditorEvent.CHANGE_SCENE, function () {
                        if (_this._editorModel) {
                            _this._editorModel.removeEventListener(editor.EditorModelEvent.SELECT_GAMEOBJECTS, _this._onEditorSelectGameObjects, _this);
                            _this._editorModel.removeEventListener(editor.EditorModelEvent.CHANGE_PROPERTY, _this._onChangeProperty, _this);
                            _this._editorModel.removeEventListener(editor.EditorModelEvent.CHANGE_EDIT_MODE, _this._onChangeEditMode, _this);
                            _this._editorModel.removeEventListener(editor.EditorModelEvent.CHANGE_EDIT_TYPE, _this._onChangeEditType, _this);
                        }
                        _this._editorModel = editor.Editor.activeEditorModel;
                        _this._editorModel.addEventListener(editor.EditorModelEvent.SELECT_GAMEOBJECTS, _this._onEditorSelectGameObjects, _this);
                        _this._editorModel.addEventListener(editor.EditorModelEvent.CHANGE_PROPERTY, _this._onChangeProperty, _this);
                        _this._editorModel.addEventListener(editor.EditorModelEvent.CHANGE_EDIT_MODE, _this._onChangeEditMode, _this);
                        _this._editorModel.addEventListener(editor.EditorModelEvent.CHANGE_EDIT_TYPE, _this._onChangeEditType, _this);
                    }, this);
                }
            };
            ModelComponent.prototype._select = function (value, isReplace) {
                if (value) {
                    if (value instanceof paper.Scene) {
                        if (this.selectedScene === value) {
                            return;
                        }
                    }
                    else if (this.selectedGameObjects.indexOf(value) >= 0) {
                        return;
                    }
                }
                if (!value || value instanceof paper.Scene || this.selectedScene) {
                    isReplace = true;
                }
                if (isReplace) {
                    if (this.selectedScene) {
                        var selectedScene = this.selectedScene;
                        this.selectedScene = null;
                        ModelComponent.onSceneUnselected.dispatch(this, selectedScene);
                    }
                    else if (this.selectedGameObjects.length > 0) {
                        var gameObjects = this.selectedGameObjects.concat();
                        var selectedGameObject = this.selectedGameObject;
                        this.selectedGameObjects.length = 0;
                        this.selectedGameObject = null;
                        ModelComponent.onGameObjectSelectChanged.dispatch(this, selectedGameObject);
                        for (var _i = 0, gameObjects_1 = gameObjects; _i < gameObjects_1.length; _i++) {
                            var gameObject = gameObjects_1[_i];
                            ModelComponent.onGameObjectUnselected.dispatch(this, gameObject);
                        }
                    }
                }
                if (value) {
                    if (value instanceof paper.Scene) {
                        window["pse"] = window["psgo"] = null; // For quick debug.
                        this.selectedScene = value;
                        ModelComponent.onSceneSelected.dispatch(this, value);
                    }
                    else {
                        window["pse"] = window["psgo"] = value; // For quick debug.
                        this.selectedGameObjects.push(value);
                        this.selectedGameObject = value;
                        ModelComponent.onGameObjectSelectChanged.dispatch(this, this.selectedGameObject);
                        ModelComponent.onGameObjectSelected.dispatch(this, value);
                    }
                }
            };
            ModelComponent.prototype._unselect = function (value) {
                var index = this.selectedGameObjects.indexOf(value);
                if (index < 0) {
                    throw new Error();
                }
                if (this.selectedGameObject === value) {
                    if (this.selectedGameObjects.length > 1) {
                        this.selectedGameObject = this.selectedGameObjects[index - 1];
                    }
                    else {
                        this.selectedGameObject = null;
                    }
                    ModelComponent.onGameObjectSelectChanged.dispatch(this, value);
                }
                this.selectedGameObjects.splice(index, 1);
                ModelComponent.onGameObjectUnselected.dispatch(this, value);
            };
            ModelComponent.prototype.hover = function (value) {
                if (this.hoveredGameObject === value) {
                    return;
                }
                this.hoveredGameObject = value;
                ModelComponent.onGameObjectHovered.dispatch(this, this.hoveredGameObject);
            };
            ModelComponent.prototype.select = function (value, isReplace) {
                this._select(value, isReplace);
                if (this._editorModel !== null) {
                    this._editorModel.selectGameObject(this.selectedGameObjects);
                }
            };
            ModelComponent.prototype.remove = function (value) {
                if (this._editorModel !== null) {
                    this._editorModel.deleteGameObject(this.selectedGameObjects);
                }
            };
            ModelComponent.prototype.unselect = function (value) {
                this._unselect(value);
                if (this._editorModel !== null) {
                    this._editorModel.selectGameObject(this.selectedGameObjects);
                }
            };
            ModelComponent.prototype.changeProperty = function (propName, propOldValue, propNewValue, target) {
                if (this._editorModel) {
                    this._editorModel.setTransformProperty(propName, propOldValue, propNewValue, target);
                }
            };
            ModelComponent.onSceneSelected = new signals.Signal();
            ModelComponent.onSceneUnselected = new signals.Signal();
            ModelComponent.onGameObjectHovered = new signals.Signal();
            ModelComponent.onGameObjectSelectChanged = new signals.Signal();
            ModelComponent.onGameObjectSelected = new signals.Signal();
            ModelComponent.onGameObjectUnselected = new signals.Signal();
            return ModelComponent;
        }(paper.SingletonComponent));
        editor.ModelComponent = ModelComponent;
        __reflect(ModelComponent.prototype, "paper.editor.ModelComponent");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        /**
         * @internal
         */
        var OrbitControls = (function (_super) {
            __extends(OrbitControls, _super);
            function OrbitControls() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.lookAtPoint = egret3d.Vector3.create(0.0, 0.0, 0.0);
                _this.lookAtOffset = egret3d.Vector3.create();
                _this.distance = 30;
                _this.minPanAngle = -Infinity;
                _this.maxPanAngle = Infinity;
                _this.minTileAngle = -90;
                _this.maxTileAngle = 90;
                _this.moveSpped = 0.001;
                _this.scaleSpeed = 0.2;
                _this._enableMove = true;
                _this._mouseDown = false;
                _this._fingerTwo = false;
                _this._panAngle = 0;
                _this._panRad = 0;
                _this._tiltAngle = 0;
                _this._tiltRad = 0;
                _this._mouseDownHandler = function (event) {
                    if (event.button === 2) {
                        _this._mouseDown = true;
                        _this._lastMouseX = event.x;
                        _this._lastMouseY = event.y;
                        event.preventDefault();
                    }
                };
                _this._mouseUpHandler = function (event) {
                    if (event.button === 2) {
                        _this._mouseDown = false;
                        event.preventDefault();
                    }
                };
                _this._mouseMoveHandler = function (event) {
                    if (!_this._mouseDown || !_this._enableMove) {
                        return;
                    }
                    var move = egret3d.Vector3.create(event.x - _this._lastMouseX, event.y - _this._lastMouseY, 0);
                    if (event.ctrlKey) {
                        move.x = -move.x;
                        var center = _this.lookAtPoint;
                        var dis = _this.gameObject.transform.position.getDistance(center);
                        move.multiplyScalar(dis * _this.moveSpped).applyQuaternion(_this.gameObject.transform.rotation);
                        _this.lookAtOffset.add(move);
                    }
                    else {
                        _this.panAngle += move.x;
                        _this.tiltAngle += move.y;
                    }
                    _this._lastMouseX = event.x;
                    _this._lastMouseY = event.y;
                    move.release();
                    event.preventDefault();
                };
                _this._mouseWheelHandler = function (event) {
                    _this.distance = Math.max(_this.distance - (event.wheelDelta > 0 ? 2 : -2), 1);
                    event.preventDefault();
                };
                return _this;
                // private updateTouch(delta: number) {
                //     var touch = this.bindTouch;
                //     if (touch.touchCount > 0) {
                //         if (touch.touchCount == 1) {
                //             var _touch = touch.getTouch(0);
                //             if (_touch.phase == egret3d.TouchPhase.BEGAN || this._fingerTwo) {
                //                 this._lastTouchX = _touch.position.x;
                //                 this._lastTouchY = _touch.position.y;
                //             } else {
                //                 var moveX = _touch.position.x - this._lastTouchX;
                //                 var moveY = _touch.position.y - this._lastTouchY;
                //                 this.panAngle += moveX * 0.5;
                //                 this.tiltAngle += moveY * 0.5;
                //                 this._lastTouchX = _touch.position.x;
                //                 this._lastTouchY = _touch.position.y;
                //             }
                //             this._fingerTwo = false;
                //         } else if (touch.touchCount == 2) {
                //             var _touch1 = touch.getTouch(0);
                //             var _touch2 = touch.getTouch(1);
                //             if (_touch1.phase == egret3d.TouchPhase.BEGAN || _touch2.phase == egret3d.TouchPhase.BEGAN || this._fingerTwo == false) {
                //                 hVec2_1.copy(_touch1.position);
                //                 hVec2_2.copy(_touch2.position);
                //                 this._lastDistance = egret3d.Vector2.getDistance(hVec2_1, hVec2_2);
                //             } else {
                //                 hVec2_1.copy(_touch1.position);
                //                 hVec2_2.copy(_touch2.position);
                //                 var distance = egret3d.Vector2.getDistance(hVec2_1, hVec2_2);
                //                 var deltaDistance = distance - this._lastDistance;
                //                 this.distance = Math.max(this.distance - deltaDistance * this.scaleSpeed, 1);
                //                 this._lastDistance = distance;
                //             }
                //             this._fingerTwo = true;
                //         } else {
                //             this._fingerTwo = false;
                //         }
                //     }
                // }
            }
            Object.defineProperty(OrbitControls.prototype, "panAngle", {
                get: function () {
                    return this._panAngle;
                },
                set: function (value) {
                    this._panAngle = Math.max(this.minPanAngle, Math.min(this.maxPanAngle, value));
                    this._panRad = this._panAngle * Math.PI / 180;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(OrbitControls.prototype, "tiltAngle", {
                get: function () {
                    return this._tiltAngle;
                },
                set: function (value) {
                    this._tiltAngle = Math.max(this.minTileAngle, Math.min(this.maxTileAngle, value));
                    this._tiltRad = this._tiltAngle * Math.PI / 180;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(OrbitControls.prototype, "enableMove", {
                get: function () {
                    return this._enableMove;
                },
                set: function (value) {
                    if (this._enableMove === value) {
                        return;
                    }
                    this._enableMove = value;
                },
                enumerable: true,
                configurable: true
            });
            OrbitControls.prototype.onStart = function () {
            };
            OrbitControls.prototype.onEnable = function () {
                var canvas = egret3d.WebGLCapabilities.canvas;
                if (canvas) {
                    canvas.addEventListener("mousedown", this._mouseDownHandler);
                    canvas.addEventListener("mouseup", this._mouseUpHandler);
                    canvas.addEventListener("mouseout", this._mouseUpHandler);
                    canvas.addEventListener("dblclick", this._mouseUpHandler);
                    canvas.addEventListener("mousemove", this._mouseMoveHandler);
                    canvas.addEventListener("wheel", this._mouseWheelHandler);
                }
            };
            OrbitControls.prototype.onDisable = function () {
                var canvas = egret3d.WebGLCapabilities.canvas;
                if (canvas) {
                    canvas.removeEventListener("mousedown", this._mouseDownHandler);
                    canvas.removeEventListener("mouseup", this._mouseUpHandler);
                    canvas.removeEventListener("mouseout", this._mouseUpHandler);
                    canvas.removeEventListener("dblclick", this._mouseUpHandler);
                    canvas.removeEventListener("mousemove", this._mouseMoveHandler);
                    canvas.removeEventListener("wheel", this._mouseWheelHandler);
                }
            };
            OrbitControls.prototype.onUpdate = function (delta) {
                if (!this._enableMove) {
                    return;
                }
                this.move();
            };
            OrbitControls.prototype.move = function () {
                var distanceX = this.distance * Math.sin(this._panRad) * Math.cos(this._tiltRad);
                var distanceY = this.distance * (this._tiltRad === 0 ? 0 : Math.sin(this._tiltRad));
                var distanceZ = this.distance * Math.cos(this._panRad) * Math.cos(this._tiltRad);
                var target = egret3d.Vector3.create();
                target.copy(this.lookAtPoint);
                target.add(this.lookAtOffset);
                this.gameObject.transform.setPosition(target.x + distanceX, target.y + distanceY, target.z + distanceZ);
                this.gameObject.transform.lookAt(target);
                target.release();
            };
            OrbitControls = __decorate([
                paper.executeInEditMode
            ], OrbitControls);
            return OrbitControls;
        }(paper.Behaviour));
        editor.OrbitControls = OrbitControls;
        __reflect(OrbitControls.prototype, "paper.editor.OrbitControls");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        /**
         * @internal
         */
        var SkeletonDrawer = (function (_super) {
            __extends(SkeletonDrawer, _super);
            function SkeletonDrawer() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._skeletonMesh = egret3d.Mesh.create(128, 0, ["POSITION" /* POSITION */], null, 35048 /* Dynamic */);
                return _this;
            }
            SkeletonDrawer.prototype.initialize = function () {
                _super.prototype.initialize.call(this);
                var mesh = this._skeletonMesh;
                var material = egret3d.Material.create(egret3d.DefaultShaders.LINEDASHED);
                mesh.glTFMesh.primitives[0].mode = 1 /* Lines */;
                material
                    .setColor(egret3d.Color.YELLOW)
                    .setDepth(false, false)
                    .renderQueue = 4000 /* Overlay */;
                this.gameObject.getOrAddComponent(egret3d.MeshFilter).mesh = mesh;
                this.gameObject.getOrAddComponent(egret3d.MeshRenderer).material = material;
            };
            SkeletonDrawer.prototype.update = function () {
                var selectedGameObject = _super.prototype.update.call(this);
                var skinnedMeshRenderer = selectedGameObject ? selectedGameObject.getComponent(egret3d.SkinnedMeshRenderer) : null;
                if (selectedGameObject && skinnedMeshRenderer) {
                    var mesh = this._skeletonMesh;
                    var offset = 0;
                    var helpVertex3A = egret3d.Vector3.create().release();
                    var helpVertex3B = egret3d.Vector3.create().release();
                    var vertices = mesh.getVertices();
                    var bones = skinnedMeshRenderer.bones;
                    this.gameObject.transform.position = selectedGameObject.transform.position;
                    var worldToLocalMatrix = this.gameObject.transform.worldToLocalMatrix;
                    for (var _i = 0, bones_1 = bones; _i < bones_1.length; _i++) {
                        var bone = bones_1[_i];
                        if (bone) {
                            if (bone.parent && bones.indexOf(bone.parent) >= 0) {
                                helpVertex3A.applyMatrix(worldToLocalMatrix, bone.parent.position).toArray(vertices, offset);
                                helpVertex3A.applyMatrix(worldToLocalMatrix, bone.position).toArray(vertices, offset + 3);
                            }
                            else {
                                bone.getRight(helpVertex3B).applyDirection(worldToLocalMatrix).multiplyScalar(0.25); // Bone length.
                                helpVertex3A.applyMatrix(worldToLocalMatrix, bone.position).toArray(vertices, offset);
                                helpVertex3A.applyMatrix(worldToLocalMatrix, bone.position).add(helpVertex3B).toArray(vertices, offset + 3);
                            }
                        }
                        else {
                            egret3d.Vector3.ZERO.toArray(vertices, offset);
                            egret3d.Vector3.ZERO.toArray(vertices, offset + 3);
                        }
                        offset += 6;
                    }
                    mesh.uploadVertexBuffer();
                }
                else {
                    this.gameObject.activeSelf = false;
                }
                return selectedGameObject;
            };
            return SkeletonDrawer;
        }(editor.BaseSelectedGOComponent));
        editor.SkeletonDrawer = SkeletonDrawer;
        __reflect(SkeletonDrawer.prototype, "paper.editor.SkeletonDrawer");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        /**
         * @internal
         */
        var SphereColliderDrawer = (function (_super) {
            __extends(SphereColliderDrawer, _super);
            function SphereColliderDrawer() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._drawer = [];
                return _this;
            }
            SphereColliderDrawer.prototype.initialize = function () {
                _super.prototype.initialize.call(this);
            };
            SphereColliderDrawer.prototype.update = function () {
                var selectedGameObject = _super.prototype.update.call(this);
                var colliders = selectedGameObject ? selectedGameObject.getComponents(egret3d.SphereCollider) : null;
                for (var i = 0, l = Math.max(this._drawer.length, colliders ? colliders.length : 0); i < l; ++i) {
                    if (i + 1 > this._drawer.length) {
                        var gameObject = editor.EditorMeshHelper.createGameObject("SphereCollider_" + i);
                        gameObject.parent = this.gameObject;
                        editor.EditorMeshHelper.createCircle("AxisX", egret3d.Color.YELLOW, 0.4, paper.Scene.editorScene).transform
                            .setParent(gameObject.transform);
                        editor.EditorMeshHelper.createCircle("AxisY", egret3d.Color.YELLOW, 0.4, paper.Scene.editorScene).transform
                            .setParent(gameObject.transform).setLocalEuler(0.0, 0.0, Math.PI * 0.5);
                        editor.EditorMeshHelper.createCircle("AxisZ", egret3d.Color.YELLOW, 0.4, paper.Scene.editorScene).transform
                            .setParent(gameObject.transform).setLocalEuler(0.0, Math.PI * 0.5, 0.0);
                        this._drawer.push(gameObject);
                    }
                    var drawer = this._drawer[i];
                    if (!colliders || i + 1 > colliders.length) {
                        drawer.activeSelf = false;
                    }
                    else {
                        var collider = colliders[i];
                        if (collider.enabled) {
                            drawer.activeSelf = true;
                            drawer.transform.localPosition.applyMatrix(selectedGameObject.transform.localToWorldMatrix, collider.sphere.center).update();
                            drawer.transform.localRotation = selectedGameObject.transform.rotation;
                            drawer.transform.localScale.multiplyScalar(collider.sphere.radius * 2, selectedGameObject.transform.scale).update();
                        }
                        else {
                            drawer.activeSelf = false;
                        }
                    }
                }
                return selectedGameObject;
            };
            return SphereColliderDrawer;
        }(editor.BaseSelectedGOComponent));
        editor.SphereColliderDrawer = SphereColliderDrawer;
        __reflect(SphereColliderDrawer.prototype, "paper.editor.SphereColliderDrawer");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        /**
         * @internal
         */
        var TransformController = (function (_super) {
            __extends(TransformController, _super);
            function TransformController() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.isWorldSpace = false;
                _this.eye = egret3d.Vector3.create();
                _this.translate = editor.EditorMeshHelper.createGameObject("Translate");
                _this.rotate = editor.EditorMeshHelper.createGameObject("Rotate");
                _this.scale = editor.EditorMeshHelper.createGameObject("Scale");
                _this._controlling = false;
                _this._prsStarts = {};
                _this._offsetStart = egret3d.Vector3.create();
                _this._offsetEnd = egret3d.Vector3.create();
                _this._plane = egret3d.Plane.create();
                _this._quad = editor.EditorMeshHelper.createGameObject("Plane", egret3d.DefaultMeshes.QUAD, egret3d.DefaultMaterials.MESH_BASIC_DOUBLESIDE.clone().setBlend(1 /* Blend */, 3000 /* Transparent */).setOpacity(0.5));
                _this._highlights = {};
                _this._dir = { "X": egret3d.Vector3.RIGHT, "Y": egret3d.Vector3.UP, "Z": egret3d.Vector3.FORWARD };
                _this._mode = null;
                _this._hovered = null;
                return _this;
            }
            TransformController.prototype.initialize = function () {
                _super.prototype.initialize.call(this);
                {
                    var translate = this.translate;
                    var axisX = editor.EditorMeshHelper.createGameObject("AxisX", egret3d.DefaultMeshes.LINE_X, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var axisY = editor.EditorMeshHelper.createGameObject("AxisY", egret3d.DefaultMeshes.LINE_Y, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var axisZ = editor.EditorMeshHelper.createGameObject("AxisZ", egret3d.DefaultMeshes.LINE_Z, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var arrowX = editor.EditorMeshHelper.createGameObject("ArrowX", egret3d.DefaultMeshes.PYRAMID, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var arrowY = editor.EditorMeshHelper.createGameObject("ArrowY", egret3d.DefaultMeshes.PYRAMID, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var arrowZ = editor.EditorMeshHelper.createGameObject("ArrowZ", egret3d.DefaultMeshes.PYRAMID, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickX = editor.EditorMeshHelper.createGameObject("X", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickY = editor.EditorMeshHelper.createGameObject("Y", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickZ = editor.EditorMeshHelper.createGameObject("Z", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickXY = editor.EditorMeshHelper.createGameObject("XY", egret3d.DefaultMeshes.QUAD, egret3d.Material.create(egret3d.DefaultShaders.MESH_BASIC_DOUBLESIDE), "" /* Untagged */);
                    var pickYZ = editor.EditorMeshHelper.createGameObject("YZ", egret3d.DefaultMeshes.QUAD, egret3d.Material.create(egret3d.DefaultShaders.MESH_BASIC_DOUBLESIDE), "" /* Untagged */);
                    var pickZX = editor.EditorMeshHelper.createGameObject("ZX", egret3d.DefaultMeshes.QUAD, egret3d.Material.create(egret3d.DefaultShaders.MESH_BASIC_DOUBLESIDE), "" /* Untagged */);
                    this._highlights[pickX.uuid] = [pickX, axisX, arrowX];
                    this._highlights[pickY.uuid] = [pickY, axisY, arrowY];
                    this._highlights[pickZ.uuid] = [pickZ, axisZ, arrowZ];
                    translate.transform.setParent(this.gameObject.transform);
                    axisX.transform.setParent(translate.transform).setLocalPosition(0.001, 0.0, 0.0);
                    axisY.transform.setParent(translate.transform).setLocalPosition(0.0, 0.001, 0.0);
                    axisZ.transform.setParent(translate.transform).setLocalPosition(0.0, 0.0, 0.001);
                    arrowX.transform.setParent(translate.transform).setLocalPosition(egret3d.Vector3.RIGHT).setLocalEuler(0.0, 0.0, -Math.PI * 0.5).setLocalScale(0.1, 0.2, 0.1);
                    arrowY.transform.setParent(translate.transform).setLocalPosition(egret3d.Vector3.UP).setLocalScale(0.1, 0.2, 0.1);
                    arrowZ.transform.setParent(translate.transform).setLocalPosition(egret3d.Vector3.FORWARD).setLocalEuler(Math.PI * 0.5, 0.0, 0.0).setLocalScale(0.1, 0.2, 0.1);
                    pickX.transform.setParent(translate.transform).setLocalPosition(0.7, 0.0, 0.0).setLocalScale(0.9, 0.15, 0.15).gameObject.activeSelf = false;
                    pickY.transform.setParent(translate.transform).setLocalPosition(0.0, 0.7, 0.0).setLocalScale(0.15, 0.9, 0.15).gameObject.activeSelf = false;
                    pickZ.transform.setParent(translate.transform).setLocalPosition(0.0, 0.0, 0.7).setLocalScale(0.15, 0.15, 0.9).gameObject.activeSelf = false;
                    pickXY.transform.setParent(translate.transform).setLocalPosition(0.15, 0.15, 0.0).setLocalScale(0.3);
                    pickYZ.transform.setParent(translate.transform).setLocalPosition(0.0, 0.15, 0.15).setLocalEuler(0.0, Math.PI * 0.5, 0.0).setLocalScale(0.3);
                    pickZX.transform.setParent(translate.transform).setLocalPosition(0.15, 0.0, 0.15).setLocalEuler(Math.PI * 0.5, 0.0, 0.0).setLocalScale(0.3);
                    axisX.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */, 0.8).setColor(egret3d.Color.RED);
                    axisY.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */, 0.8).setColor(egret3d.Color.GREEN);
                    axisZ.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */, 0.8).setColor(egret3d.Color.BLUE);
                    arrowX.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */, 0.8).setColor(egret3d.Color.RED);
                    arrowY.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */, 0.8).setColor(egret3d.Color.GREEN);
                    arrowZ.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */, 0.8).setColor(egret3d.Color.BLUE);
                    pickX.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */, 0.8).setColor(egret3d.Color.RED);
                    pickY.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */, 0.8).setColor(egret3d.Color.GREEN);
                    pickZ.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */, 0.8).setColor(egret3d.Color.BLUE);
                    pickXY.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */, 0.8).setColor(egret3d.Color.YELLOW);
                    pickYZ.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */, 0.8).setColor(egret3d.Color.INDIGO);
                    pickZX.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */, 0.8).setColor(egret3d.Color.PURPLE);
                }
                {
                    var rotate = this.rotate;
                    var axisX = editor.EditorMeshHelper.createGameObject("AxisX", egret3d.MeshBuilder.createCircle(1.0, 0.5, 1), egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var axisY = editor.EditorMeshHelper.createGameObject("AxisY", egret3d.MeshBuilder.createCircle(1.0, 0.5, 2), egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var axisZ = editor.EditorMeshHelper.createGameObject("AxisZ", egret3d.MeshBuilder.createCircle(1.0, 0.5, 3), egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var axisE = editor.EditorMeshHelper.createGameObject("AxisE", egret3d.MeshBuilder.createCircle(1.25, 1.0, 3), egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var axisXYZE = editor.EditorMeshHelper.createGameObject("AxisXYZE", egret3d.MeshBuilder.createCircle(1, 1, 3), egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickX = editor.EditorMeshHelper.createGameObject("X", egret3d.MeshBuilder.createTorus(1.0, 0.1, 4, 12, 0.5, 1), egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickY = editor.EditorMeshHelper.createGameObject("Y", egret3d.MeshBuilder.createTorus(1.0, 0.1, 4, 12, 0.5, 2), egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickZ = editor.EditorMeshHelper.createGameObject("Z", egret3d.MeshBuilder.createTorus(1.0, 0.1, 4, 12, 0.5, 3), egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickE = editor.EditorMeshHelper.createGameObject("E", egret3d.MeshBuilder.createTorus(1.25, 0.1, 4, 24, 1.0, 3), egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickXYZE = editor.EditorMeshHelper.createGameObject("XYZE", egret3d.MeshBuilder.createSphere(0.7, 10, 8), egret3d.DefaultMaterials.MESH_BASIC.clone());
                    this._highlights[pickX.uuid] = [axisX];
                    this._highlights[pickY.uuid] = [axisY];
                    this._highlights[pickZ.uuid] = [axisZ];
                    this._highlights[pickE.uuid] = [axisE];
                    this._highlights[pickXYZE.uuid] = [axisXYZE];
                    rotate.transform.setParent(this.gameObject.transform);
                    axisX.transform.setParent(rotate.transform);
                    axisY.transform.setParent(rotate.transform);
                    axisZ.transform.setParent(rotate.transform);
                    axisE.transform.setParent(rotate.transform);
                    axisXYZE.transform.setParent(rotate.transform);
                    pickX.transform.setParent(rotate.transform).gameObject.activeSelf = false;
                    pickY.transform.setParent(rotate.transform).gameObject.activeSelf = false;
                    pickZ.transform.setParent(rotate.transform).gameObject.activeSelf = false;
                    pickE.transform.setParent(rotate.transform).gameObject.activeSelf = false;
                    pickXYZE.transform.setParent(rotate.transform).gameObject.activeSelf = false;
                    axisX.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */, 0.8).setColor(egret3d.Color.RED);
                    axisY.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */, 0.8).setColor(egret3d.Color.GREEN);
                    axisZ.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */, 0.8).setColor(egret3d.Color.BLUE);
                    axisE.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */, 0.8).setColor(egret3d.Color.YELLOW);
                    axisXYZE.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */ - 1, 0.8).setColor(egret3d.Color.GRAY);
                    pickX.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */, 0.8).setColor(egret3d.Color.RED);
                    pickY.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */, 0.8).setColor(egret3d.Color.GREEN);
                    pickZ.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */, 0.8).setColor(egret3d.Color.BLUE);
                    pickE.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */, 0.8).setColor(egret3d.Color.YELLOW);
                    pickXYZE.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */ - 1, 0.8).setColor(egret3d.Color.GRAY);
                }
                {
                    var scale = this.scale;
                    var axisX = editor.EditorMeshHelper.createGameObject("AxisX", egret3d.DefaultMeshes.LINE_X, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var axisY = editor.EditorMeshHelper.createGameObject("AxisY", egret3d.DefaultMeshes.LINE_Y, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var axisZ = editor.EditorMeshHelper.createGameObject("AxisZ", egret3d.DefaultMeshes.LINE_Z, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var arrowX = editor.EditorMeshHelper.createGameObject("ArrowX", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var arrowY = editor.EditorMeshHelper.createGameObject("ArrowY", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var arrowZ = editor.EditorMeshHelper.createGameObject("ArrowZ", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickX = editor.EditorMeshHelper.createGameObject("X", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickY = editor.EditorMeshHelper.createGameObject("Y", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickZ = editor.EditorMeshHelper.createGameObject("Z", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                    var pickXY = editor.EditorMeshHelper.createGameObject("XY", egret3d.DefaultMeshes.QUAD, egret3d.Material.create(egret3d.DefaultShaders.MESH_BASIC_DOUBLESIDE), "" /* Untagged */);
                    var pickYZ = editor.EditorMeshHelper.createGameObject("YZ", egret3d.DefaultMeshes.QUAD, egret3d.Material.create(egret3d.DefaultShaders.MESH_BASIC_DOUBLESIDE), "" /* Untagged */);
                    var pickZX = editor.EditorMeshHelper.createGameObject("ZX", egret3d.DefaultMeshes.QUAD, egret3d.Material.create(egret3d.DefaultShaders.MESH_BASIC_DOUBLESIDE), "" /* Untagged */);
                    this._highlights[pickX.uuid] = [pickX, axisX, arrowX];
                    this._highlights[pickY.uuid] = [pickX, axisY, arrowY];
                    this._highlights[pickZ.uuid] = [pickX, axisZ, arrowZ];
                    scale.transform.setParent(this.gameObject.transform);
                    axisX.transform.setParent(scale.transform).setLocalPosition(0.001, 0.0, 0.0);
                    axisY.transform.setParent(scale.transform).setLocalPosition(0.0, 0.001, 0.0);
                    axisZ.transform.setParent(scale.transform).setLocalPosition(0.0, 0.0, 0.001);
                    arrowX.transform.setParent(scale.transform).setLocalPosition(egret3d.Vector3.RIGHT).setLocalScale(0.15, 0.15, 0.15);
                    arrowY.transform.setParent(scale.transform).setLocalPosition(egret3d.Vector3.UP).setLocalScale(0.15, 0.15, 0.15);
                    arrowZ.transform.setParent(scale.transform).setLocalPosition(egret3d.Vector3.FORWARD).setLocalScale(0.15, 0.15, 0.15);
                    pickX.transform.setParent(scale.transform).setLocalPosition(0.7, 0.0, 0.0).setLocalScale(0.9, 0.15, 0.15).gameObject.activeSelf = false;
                    pickY.transform.setParent(scale.transform).setLocalPosition(0.0, 0.7, 0.0).setLocalScale(0.15, 0.9, 0.15).gameObject.activeSelf = false;
                    pickZ.transform.setParent(scale.transform).setLocalPosition(0.0, 0.0, 0.7).setLocalScale(0.15, 0.15, 0.9).gameObject.activeSelf = false;
                    pickXY.transform.setParent(scale.transform).setLocalPosition(0.15, 0.15, 0.0).setLocalScale(0.3);
                    pickYZ.transform.setParent(scale.transform).setLocalPosition(0.0, 0.15, 0.15).setLocalEuler(0.0, Math.PI * 0.5, 0.0).setLocalScale(0.3);
                    pickZX.transform.setParent(scale.transform).setLocalPosition(0.15, 0.0, 0.15).setLocalEuler(Math.PI * 0.5, 0.0, 0.0).setLocalScale(0.3);
                    axisX.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */, 0.8).setColor(egret3d.Color.RED);
                    axisY.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */, 0.8).setColor(egret3d.Color.GREEN);
                    axisZ.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */, 0.8).setColor(egret3d.Color.BLUE);
                    arrowX.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */, 0.8).setColor(egret3d.Color.RED);
                    arrowY.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */, 0.8).setColor(egret3d.Color.GREEN);
                    arrowZ.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */, 0.8).setColor(egret3d.Color.BLUE);
                    pickX.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */, 0.8).setColor(egret3d.Color.RED);
                    pickY.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */, 0.8).setColor(egret3d.Color.GREEN);
                    pickZ.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */, 0.8).setColor(egret3d.Color.BLUE);
                    pickXY.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */, 0.8).setColor(egret3d.Color.YELLOW);
                    pickYZ.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */, 0.8).setColor(egret3d.Color.INDIGO);
                    pickZX.renderer.material.setDepth(false, false).setBlend(1 /* Blend */, 4000 /* Overlay */, 0.8).setColor(egret3d.Color.PURPLE);
                }
                this.mode = this.translate; // Update mode.
                this._quad.parent = this.gameObject;
                this._quad.activeSelf = false;
            };
            TransformController.prototype._updateTransform = function (mousePosition) {
                var isWorldSpace = this.isWorldSpace;
                var hoveredName = this._hovered.name;
                var raycastInfo = editor.Helper.raycast(this._plane, mousePosition.x, mousePosition.y);
                if (!raycastInfo) {
                    //TODO
                    return;
                }
                var modelComponent = this.gameObject.getComponent(editor.ModelComponent);
                var selectedGameObject = modelComponent.selectedGameObject;
                var currentSelectedPRS = this._prsStarts[selectedGameObject.uuid];
                this._offsetEnd.subtract(currentSelectedPRS[3], raycastInfo.position);
                if (this._mode === this.scale) {
                    isWorldSpace = false;
                }
                else {
                    switch (hoveredName) {
                        case "E":
                        case "XYZ":
                        case "XYZE":
                            isWorldSpace = true;
                            break;
                    }
                }
                if (!isWorldSpace) {
                    this._offsetEnd.applyQuaternion(currentSelectedPRS[4].clone().inverse().release());
                }
                if (this._mode === this.translate) {
                    if (hoveredName.indexOf("X") < 0) {
                        this._offsetEnd.x = this._offsetStart.x;
                    }
                    if (hoveredName.indexOf("Y") < 0) {
                        this._offsetEnd.y = this._offsetStart.y;
                    }
                    if (hoveredName.indexOf("Z") < 0) {
                        this._offsetEnd.z = this._offsetStart.z;
                    }
                    var position = egret3d.Vector3.create();
                    for (var _i = 0, _a = modelComponent.selectedGameObjects; _i < _a.length; _i++) {
                        var gameObject = _a[_i];
                        if (gameObject.parent && modelComponent.selectedGameObjects.indexOf(gameObject.parent) >= 0) {
                            continue;
                        }
                        var selectedPRS = this._prsStarts[gameObject.uuid];
                        position.subtract(this._offsetStart, this._offsetEnd);
                        if (isWorldSpace) {
                            position.add(selectedPRS[3]);
                            // TODO translationSnap
                            gameObject.transform.position = position;
                        }
                        else {
                            position.applyQuaternion(selectedPRS[1]);
                            position.add(selectedPRS[0]);
                            // TODO translationSnap
                            gameObject.transform.localPosition = position;
                        }
                    }
                    position.release();
                }
                else if (this._mode === this.rotate) {
                    var camera = egret3d.Camera.editor;
                    var tempVector = egret3d.Vector3.create();
                    var rotationAxis = egret3d.Vector3.create();
                    var rotation = !isWorldSpace ? selectedGameObject.transform.rotation : egret3d.Quaternion.IDENTITY.clone();
                    var tempQuaternion = egret3d.Quaternion.create();
                    var ROTATION_SPEED = 20 / selectedGameObject.transform.position.getDistance(tempVector.applyMatrix(camera.gameObject.transform.localToWorldMatrix));
                    var rotationAngle = 0;
                    if (hoveredName.indexOf("XYZE") >= 0) {
                        tempVector.copy(this._offsetEnd).subtract(this._offsetStart, tempVector).cross(this.eye).normalize();
                        rotationAxis.copy(tempVector);
                        rotationAngle = this._offsetEnd.subtract(this._offsetStart, this._offsetEnd).dot(tempVector.cross(this.eye)) * ROTATION_SPEED;
                    }
                    else if (hoveredName.indexOf("E") >= 0) {
                        tempVector.copy(this._offsetEnd).cross(this._offsetStart);
                        rotationAxis.copy(this.eye);
                        rotationAngle = this._offsetEnd.getAngle(this._offsetStart) * (tempVector.dot(this.eye) < 0 ? 1 : -1);
                    }
                    else {
                        var unit = this._dir[hoveredName];
                        var tempVector2 = egret3d.Vector3.create();
                        rotationAxis.copy(unit);
                        tempVector.copy(unit);
                        tempVector2.subtract(this._offsetStart, this._offsetEnd);
                        if (!isWorldSpace) {
                            tempVector.applyQuaternion(rotation);
                            tempVector2.applyQuaternion(currentSelectedPRS[4]);
                        }
                        rotationAngle = tempVector2.dot(tempVector.cross(this.eye).normalize()) * ROTATION_SPEED;
                        tempVector2.release();
                    }
                    for (var _b = 0, _c = modelComponent.selectedGameObjects; _b < _c.length; _b++) {
                        var gameObject = _c[_b];
                        var selectedPRS = this._prsStarts[gameObject.uuid];
                        if (isWorldSpace) {
                            tempQuaternion.fromAxis(rotationAxis, rotationAngle).multiply(selectedPRS[4]).normalize();
                            gameObject.transform.rotation = tempQuaternion;
                        }
                        else {
                            tempQuaternion.fromAxis(rotationAxis, rotationAngle).premultiply(selectedPRS[1]).normalize();
                            gameObject.transform.localRotation = tempQuaternion;
                        }
                    }
                    tempVector.release();
                    rotationAxis.release();
                    tempQuaternion.release();
                    // TODO
                    selectedGameObject.transform.localEulerAngles;
                }
                else if (this._mode === this.scale) {
                    if (hoveredName.indexOf("XYZ") >= 0) {
                        var d = this._offsetEnd.length / this._offsetStart.length;
                        if (this._offsetEnd.dot(this._offsetStart) < 0.0)
                            d *= -1.0;
                        this._offsetEnd.set(d, d, d);
                    }
                    else {
                        this._offsetEnd.divide(this._offsetStart);
                        if (hoveredName.indexOf("X") < 0) {
                            this._offsetEnd.x = 1.0;
                        }
                        if (hoveredName.indexOf("Y") < 0) {
                            this._offsetEnd.y = 1.0;
                        }
                        if (hoveredName.indexOf("Z") < 0) {
                            this._offsetEnd.z = 1.0;
                        }
                    }
                    // TODO this._offsetEnd scale aabb size
                    var scale = egret3d.Vector3.create();
                    for (var _d = 0, _e = modelComponent.selectedGameObjects; _d < _e.length; _d++) {
                        var gameObject = _e[_d];
                        if (gameObject.parent && modelComponent.selectedGameObjects.indexOf(gameObject.parent) >= 0) {
                            continue;
                        }
                        var selectedPRS = this._prsStarts[gameObject.uuid];
                        gameObject.transform.localScale = scale.multiply(this._offsetEnd, selectedPRS[2]);
                    }
                    scale.release();
                }
            };
            TransformController.prototype._updateSelf = function () {
                var isWorldSpace = this._mode === this.scale ? false : this.isWorldSpace; // scale always oriented to local rotation
                var camera = egret3d.Camera.editor;
                var modelComponent = this.gameObject.getComponent(editor.ModelComponent);
                var selectedGameObject = modelComponent.selectedGameObject;
                var eye = this.eye.copy(camera.gameObject.transform.position);
                var eyeDistance = eye.getDistance(selectedGameObject.transform.position);
                if (camera.opvalue > 0.0) {
                    eye.subtract(selectedGameObject.transform.position);
                }
                eye.normalize();
                var quaternion = isWorldSpace ? egret3d.Quaternion.IDENTITY : selectedGameObject.transform.rotation;
                this.gameObject.transform.localPosition = selectedGameObject.transform.position;
                this.gameObject.transform.localRotation = quaternion;
                this.gameObject.transform.localScale = egret3d.Vector3.ONE.clone().multiplyScalar(eyeDistance / 10.0).release();
                if (this._mode === this.rotate) {
                    var tempQuaternion = quaternion.clone();
                    var tempQuaternion2 = quaternion.clone();
                    var alignVector = egret3d.Vector3.create();
                    alignVector.copy(this.eye).applyQuaternion(tempQuaternion.inverse());
                    {
                        tempQuaternion.fromAxis(egret3d.Vector3.RIGHT, Math.atan2(alignVector.y, -alignVector.z));
                        tempQuaternion.multiply(tempQuaternion2, tempQuaternion);
                        var axisX = this.rotate.transform.find("AxisX");
                        var pickX = this.rotate.transform.find("X");
                        axisX.setRotation(tempQuaternion);
                        pickX.setRotation(tempQuaternion);
                    }
                    {
                        tempQuaternion.fromAxis(egret3d.Vector3.UP, Math.atan2(-alignVector.x, -alignVector.z));
                        tempQuaternion.multiply(tempQuaternion2, tempQuaternion);
                        var axisY = this.rotate.transform.find("AxisY");
                        var pickY = this.rotate.transform.find("Y");
                        axisY.setRotation(tempQuaternion);
                        pickY.setRotation(tempQuaternion);
                    }
                    {
                        tempQuaternion.fromAxis(egret3d.Vector3.FORWARD, Math.atan2(-alignVector.x, alignVector.y));
                        tempQuaternion.multiply(tempQuaternion2, tempQuaternion);
                        var axisZ = this.rotate.transform.find("AxisZ");
                        var pickZ = this.rotate.transform.find("Z");
                        axisZ.setRotation(tempQuaternion);
                        pickZ.setRotation(tempQuaternion);
                    }
                    {
                        tempQuaternion2.fromMatrix(egret3d.Matrix4.create().lookAt(this.eye, egret3d.Vector3.ZERO, egret3d.Vector3.UP).release());
                        var axisE = this.rotate.transform.find("AxisE");
                        var pickE = this.rotate.transform.find("E");
                        axisE.setRotation(tempQuaternion2);
                        pickE.setRotation(tempQuaternion2);
                    }
                    {
                        tempQuaternion2.fromMatrix(egret3d.Matrix4.create().lookAt(this.eye, egret3d.Vector3.ZERO, egret3d.Vector3.UP).release());
                        var axisXYZE = this.rotate.transform.find("AxisXYZE");
                        axisXYZE.setRotation(tempQuaternion2);
                    }
                    tempQuaternion.release();
                    tempQuaternion2.release();
                    alignVector.release();
                }
            };
            TransformController.prototype._updatePlane = function () {
                var isWorldSpace = this._mode === this.scale ? false : this.isWorldSpace; // scale always oriented to local rotation
                var rotation = isWorldSpace ? egret3d.Quaternion.IDENTITY : this.gameObject.transform.rotation;
                var unitX = egret3d.Vector3.RIGHT.clone().applyQuaternion(rotation);
                var unitY = egret3d.Vector3.UP.clone().applyQuaternion(rotation);
                var unitZ = egret3d.Vector3.FORWARD.clone().applyQuaternion(rotation);
                // Align the plane for current transform mode, axis and space.
                var alignVector = unitY.clone();
                var dirVector = egret3d.Vector3.create();
                if (this._hovered && this._mode !== this.rotate) {
                    switch (this._hovered.name) {
                        case "X":
                            alignVector.cross(this.eye, unitX);
                            dirVector.cross(unitX, alignVector);
                            break;
                        case "Y":
                            alignVector.cross(this.eye, unitY);
                            dirVector.cross(unitY, alignVector);
                            break;
                        case "Z":
                            alignVector.cross(this.eye, unitZ);
                            dirVector.cross(unitZ, alignVector);
                            break;
                        case "XY":
                            dirVector.copy(unitZ);
                            break;
                        case "YZ":
                            dirVector.copy(unitX);
                            break;
                        case "ZX":
                            alignVector.copy(unitZ);
                            dirVector.copy(unitY);
                            break;
                    }
                }
                if (dirVector.length === 0.0) {
                    // If in rotate mode, make the plane parallel to camera
                    this._quad.transform.rotation = egret3d.Camera.editor.gameObject.transform.rotation;
                }
                else {
                    this._quad.transform.rotation = egret3d.Quaternion.create().fromMatrix(egret3d.Matrix4.create().lookAt(egret3d.Vector3.ZERO, dirVector, alignVector).release()).release();
                }
                if (!this._controlling) {
                    this._plane.fromPoint(this._quad.transform.position, this._quad.transform.getForward().release());
                }
                unitX.release();
                unitY.release();
                unitZ.release();
                alignVector.release();
                dirVector.release();
            };
            TransformController.prototype.start = function (mousePosition) {
                var isWorldSpace = this.isWorldSpace;
                var hoveredName = this._hovered.name;
                var raycastInfo = editor.Helper.raycast(this._plane, mousePosition.x, mousePosition.y);
                var modelComponent = this.gameObject.getComponent(editor.ModelComponent);
                for (var _i = 0, _a = modelComponent.selectedGameObjects; _i < _a.length; _i++) {
                    var gameObject = _a[_i];
                    var transform = gameObject.transform;
                    this._prsStarts[gameObject.uuid] = [
                        egret3d.Vector3.create().copy(transform.localPosition),
                        egret3d.Quaternion.create().copy(transform.localRotation),
                        egret3d.Vector3.create().copy(transform.localScale),
                        egret3d.Vector3.create().copy(transform.position),
                        egret3d.Quaternion.create().copy(transform.rotation),
                        egret3d.Vector3.create().copy(transform.scale),
                        egret3d.Vector3.create().copy(transform.localEulerAngles),
                    ];
                }
                var currentSelectedPRS = this._prsStarts[modelComponent.selectedGameObject.uuid];
                this._offsetStart.subtract(currentSelectedPRS[3], raycastInfo.position);
                this._controlling = true;
                if (this._mode === this.scale) {
                    isWorldSpace = false;
                }
                else {
                    switch (hoveredName) {
                        case "E":
                        case "XYZ":
                        case "XYZE":
                            isWorldSpace = true;
                            break;
                    }
                }
                if (!isWorldSpace) {
                    this._offsetStart.applyQuaternion(currentSelectedPRS[4].clone().inverse().release());
                }
            };
            TransformController.prototype.end = function () {
                //
                var modelComponent = this.gameObject.getComponent(editor.ModelComponent);
                for (var _i = 0, _a = modelComponent.selectedGameObjects; _i < _a.length; _i++) {
                    var gameObject = _a[_i];
                    var transform = gameObject.transform;
                    var currentPro = this._prsStarts[gameObject.uuid];
                    if (this.mode === this.translate) {
                        modelComponent.changeProperty("localPosition", currentPro[0], transform.localPosition, transform);
                    }
                    else if (this.mode === this.scale) {
                        modelComponent.changeProperty("localScale", currentPro[2], transform.localScale, transform);
                    }
                    else if (this.mode === this.rotate) {
                        modelComponent.changeProperty("localEulerAngles", currentPro[6], transform.localEulerAngles, transform);
                    }
                }
                for (var k in this._prsStarts) {
                    for (var _b = 0, _c = this._prsStarts[k]; _b < _c.length; _b++) {
                        var v = _c[_b];
                        v.release();
                    }
                    delete this._prsStarts[k];
                }
                this._controlling = false;
            };
            TransformController.prototype.update = function (mousePosition) {
                if (this._hovered && this._controlling) {
                    this._updateTransform(mousePosition);
                }
                this._updateSelf();
                this._updatePlane();
            };
            Object.defineProperty(TransformController.prototype, "mode", {
                get: function () {
                    return this._mode || this.translate;
                },
                set: function (value) {
                    if (this._mode === value) {
                        return;
                    }
                    this.translate !== value && (this.translate.activeSelf = false);
                    this.rotate !== value && (this.rotate.activeSelf = false);
                    this.scale !== value && (this.scale.activeSelf = false);
                    this._mode = value;
                    this._mode.activeSelf = true;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TransformController.prototype, "hovered", {
                get: function () {
                    return this._hovered;
                },
                set: function (value) {
                    if (this._hovered === value) {
                        return;
                    }
                    this._hovered = value;
                    if (this._hovered) {
                        var highlights = this._highlights[this._hovered.uuid] || [this._hovered];
                        for (var _i = 0, _a = this._mode.transform.children; _i < _a.length; _i++) {
                            var child = _a[_i];
                            if (!child.gameObject.renderer) {
                                continue;
                            }
                            var material = child.gameObject.renderer.material;
                            if (highlights.indexOf(child.gameObject) >= 0) {
                                material.opacity = 1.0;
                            }
                            else {
                                material.opacity = 0.2;
                            }
                        }
                    }
                    else {
                        for (var _b = 0, _c = this._mode.transform.children; _b < _c.length; _b++) {
                            var child = _c[_b];
                            if (!child.gameObject.renderer) {
                                continue;
                            }
                            child.gameObject.renderer.material.opacity = 0.8;
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            return TransformController;
        }(paper.BaseComponent));
        editor.TransformController = TransformController;
        __reflect(TransformController.prototype, "paper.editor.TransformController");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        /**
         *
         */
        var WorldAxisesDrawer = (function (_super) {
            __extends(WorldAxisesDrawer, _super);
            function WorldAxisesDrawer() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.cube = editor.EditorMeshHelper.createGameObject("Cube", egret3d.DefaultMeshes.CUBE, egret3d.DefaultMaterials.MESH_BASIC);
                _this.left = editor.EditorMeshHelper.createGameObject("Left", egret3d.DefaultMeshes.CONE, egret3d.DefaultMaterials.MESH_BASIC);
                _this.right = editor.EditorMeshHelper.createGameObject("Right", egret3d.DefaultMeshes.CONE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                _this.bottom = editor.EditorMeshHelper.createGameObject("Bottom", egret3d.DefaultMeshes.CONE, egret3d.DefaultMaterials.MESH_BASIC);
                _this.top = editor.EditorMeshHelper.createGameObject("Top", egret3d.DefaultMeshes.CONE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                _this.back = editor.EditorMeshHelper.createGameObject("Back", egret3d.DefaultMeshes.CONE, egret3d.DefaultMaterials.MESH_BASIC);
                _this.forward = editor.EditorMeshHelper.createGameObject("Forward", egret3d.DefaultMeshes.CONE, egret3d.DefaultMaterials.MESH_BASIC.clone());
                return _this;
            }
            WorldAxisesDrawer.prototype.initialize = function () {
                _super.prototype.initialize.call(this);
                this.cube.transform.setParent(this.gameObject.transform);
                this.left.transform.setLocalPosition(-1.5, 0.0, 0.0).setLocalEuler(0.0, 0.0, -Math.PI * 0.5).setLocalScale(1.0, 2.0, 1.0).setParent(this.cube.transform);
                this.right.transform.setLocalPosition(1.5, 0.0, 0.0).setLocalEuler(0.0, 0.0, Math.PI * 0.5).setLocalScale(1.0, 2.0, 1.0).setParent(this.cube.transform);
                this.bottom.transform.setLocalPosition(0.0, -1.5, 0.0).setLocalEuler(0.0, 0.0, 0.0).setLocalScale(1.0, 2.0, 1.0).setParent(this.cube.transform);
                this.top.transform.setLocalPosition(0.0, 1.5, 0.0).setLocalEuler(Math.PI, 0.0, 0.0).setLocalScale(1.0, 2.0, 1.0).setParent(this.cube.transform);
                this.back.transform.setLocalPosition(0.0, 0.0, -1.5).setLocalEuler(Math.PI * 0.5, 0.0, 0.0).setLocalScale(1.0, 2.0, 1.0).setParent(this.cube.transform);
                this.forward.transform.setLocalPosition(0.0, 0.0, 1.5).setLocalEuler(-Math.PI * 0.5, 0.0, 0.0).setLocalScale(1.0, 2.0, 1.0).setParent(this.cube.transform);
                this.right.renderer.material.setColor(egret3d.Color.RED);
                this.top.renderer.material.setColor(egret3d.Color.GREEN);
                this.forward.renderer.material.setColor(egret3d.Color.BLUE);
                this.gameObject.transform.setLocalScale(0.01);
            };
            WorldAxisesDrawer.prototype.update = function () {
                var stage = egret3d.stage;
                var camera = egret3d.Camera.editor;
                var scenePosition = egret3d.Vector3.create(stage.screenSize.w - 50.0, 50.0, 0.0);
                stage.screenToStage(scenePosition, scenePosition);
                camera.calcWorldPosFromScreenPos(scenePosition, scenePosition);
                this.gameObject.transform.position = scenePosition;
                this.gameObject.transform.lookAt(camera.transform);
            };
            return WorldAxisesDrawer;
        }(paper.BaseComponent));
        editor.WorldAxisesDrawer = WorldAxisesDrawer;
        __reflect(WorldAxisesDrawer.prototype, "paper.editor.WorldAxisesDrawer");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        var containerHTML = "\n    <div class=\"egret-hierarchy\" style=\"margin: auto;height: 100%;\"></div>\n    <div class=\"egret-inspector\" style=\"margin: auto;height: 100%;\"></div>\n";
        /**
         * @internal
         */
        var EditorSystem = (function (_super) {
            __extends(EditorSystem, _super);
            function EditorSystem() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._isMobile = false;
                _this._guiComponent = paper.Application.playerMode === 2 /* Editor */ ? null : paper.GameObject.globalGameObject.getOrAddComponent(editor.GUIComponent);
                return _this;
            }
            EditorSystem.prototype.onAwake = function () {
                paper.GameObject.globalGameObject.getOrAddComponent(editor.EditorDefaultTexture);
                //
                if (paper.Application.playerMode === 2 /* Editor */) {
                    paper.Application.systemManager.register(editor.SceneSystem, 6000 /* LaterUpdate */);
                }
                else {
                    var guiComponent_1 = this._guiComponent;
                    var oldContainer_1 = guiComponent_1.hierarchy.domElement.parentElement;
                    var container = document.createElement("div");
                    container.style.overflow = "hidden";
                    container.style.display = "flex";
                    container.style.width = "100%";
                    container.style.height = "100%";
                    container.style.height = "100%";
                    container.style.margin = "auto";
                    container.innerHTML = containerHTML;
                    document.body.insertBefore(container, document.body.firstElementChild);
                    var hierarchy_1 = document.getElementsByClassName("egret-hierarchy");
                    var inspector_1 = document.getElementsByClassName("egret-inspector");
                    container.insertBefore(document.getElementsByClassName("egret-player")[0], inspector_1[0]);
                    var empty = document.createElement("div");
                    empty.style.width = "100%";
                    oldContainer_1.style.display = "flex";
                    oldContainer_1.insertBefore(guiComponent_1.stats.dom, oldContainer_1.lastElementChild);
                    oldContainer_1.insertBefore(empty, oldContainer_1.lastElementChild);
                    guiComponent_1.hierarchy.onClick = function () {
                        if (guiComponent_1.hierarchy.closed) {
                            oldContainer_1.insertBefore(guiComponent_1.hierarchy.domElement, oldContainer_1.firstElementChild);
                        }
                        else {
                            hierarchy_1[0].appendChild(guiComponent_1.hierarchy.domElement);
                        }
                    };
                    guiComponent_1.inspector.onClick = function () {
                        if (guiComponent_1.inspector.closed) {
                            oldContainer_1.appendChild(guiComponent_1.inspector.domElement);
                        }
                        else {
                            inspector_1[0].appendChild(guiComponent_1.inspector.domElement);
                        }
                    };
                    this._isMobile = paper.Application.isMobile;
                    if (this._isMobile) {
                        // TODO 前置组件。
                        // const loadScript = (url: string, callback: any) => {
                        //     const script = document.createElement("script");
                        //     script.onload = () => callback();
                        //     script.src = url;
                        //     document.body.appendChild(script);
                        // };
                        // loadScript(
                        //     "https://res.wx.qq.com/mmbizwap/zh_CN/htmledition/js/vconsole/3.0.0/vconsole.min.js",
                        //     () => {
                        //         new VConsole();
                        //     }
                        // );
                        guiComponent_1.hierarchy.close();
                        guiComponent_1.inspector.close();
                    }
                    else {
                        hierarchy_1[0].appendChild(guiComponent_1.hierarchy.domElement);
                        inspector_1[0].appendChild(guiComponent_1.inspector.domElement);
                    }
                    paper.Application.systemManager.register(editor.GUISystem, 6000 /* LaterUpdate */ + 1); // Make sure the GUISystem update after the SceneSystem.
                }
            };
            EditorSystem.prototype.onUpdate = function () {
                if (paper.Application.playerMode === 2 /* Editor */) {
                    return;
                }
                var guiComponent = this._guiComponent;
                guiComponent.stats.update();
                guiComponent.renderPanel.update(paper.Application.systemManager.getSystem(egret3d["web"]["WebGLRenderSystem"]).deltaTime, 200);
                if (egret3d.inputCollecter.getKey("KeyH" /* KeyH */).isDown()) {
                    var statsDOM = guiComponent.stats.dom;
                    if (statsDOM.style.display !== "none") {
                        statsDOM.style.display = "none";
                    }
                    else {
                        statsDOM.style.display = "block";
                    }
                }
                // TODO dc tc vc
                var isMobile = paper.Application.isMobile;
                if (this._isMobile !== isMobile) {
                    if (isMobile) {
                        if (!guiComponent.hierarchy.closed) {
                            guiComponent.hierarchy.close();
                            if (guiComponent.hierarchy.onClick) {
                                guiComponent.hierarchy.onClick(guiComponent.hierarchy);
                            }
                        }
                        if (!guiComponent.inspector.closed) {
                            guiComponent.inspector.close();
                            if (guiComponent.inspector.onClick) {
                                guiComponent.inspector.onClick(guiComponent.inspector);
                            }
                        }
                    }
                    else {
                        if (guiComponent.hierarchy.closed) {
                            guiComponent.hierarchy.open();
                            if (guiComponent.hierarchy.onClick) {
                                guiComponent.hierarchy.onClick(guiComponent.hierarchy);
                            }
                        }
                        if (guiComponent.inspector.closed) {
                            guiComponent.inspector.open();
                            if (guiComponent.inspector.onClick) {
                                guiComponent.inspector.onClick(guiComponent.inspector);
                            }
                        }
                    }
                    this._isMobile = isMobile;
                }
            };
            return EditorSystem;
        }(paper.BaseSystem));
        editor.EditorSystem = EditorSystem;
        __reflect(EditorSystem.prototype, "paper.editor.EditorSystem");
        //
        paper.Application.systemManager.preRegister(EditorSystem, 0 /* Begin */ - 10000);
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
/// <reference path="./EventDispatcher.ts" />
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        /**
         * 检测一个实例对象是否为已被自定义
         * @param classInstance 实例对象
         */
        function isCustom(classInstance) {
            // let clzName = egret.getQualifiedClassName(classInstance);
            // let clz = egret.getDefinitionByName(clzName);
            var clz = classInstance.constructor;
            return clz['__custom__'] ? true : false;
        }
        editor.isCustom = isCustom;
        /**
         * 获取一个实例对象的编辑信息
         * @param classInstance 实例对象
         */
        function getEditInfo(classInstance) {
            var retrunList = [];
            // let clzName = egret.getQualifiedClassName(classInstance);
            // let clz = egret.getDefinitionByName(clzName);
            // let extend: string[] = clz.prototype.__types__;
            // for (let i = extend.length - 1; i >= 0; i--) {
            //     let clzName = extend[i];
            //     let clz = egret.getDefinitionByName(clzName);
            //     if (clz && clz.prototype.hasOwnProperty('__props__')) {
            //         retrunList = retrunList.concat(clz.prototype['__props__']);
            //     }
            // }
            var proto = classInstance;
            while (proto) {
                if (proto.constructor.prototype) {
                    if (proto.constructor.prototype.hasOwnProperty('__props__')) {
                        retrunList = retrunList.concat(proto.constructor.prototype['__props__']);
                    }
                    proto = proto.constructor.prototype.__proto__;
                    continue;
                }
                break;
            }
            return retrunList;
        }
        editor.getEditInfo = getEditInfo;
        /**
         * 获取一个实例对象某个属性的编辑类型
         * @param classInstance 实例对象
         * @param propName 属性名
         */
        function getEditType(classInstance, propName) {
            var editInfoList = getEditInfo(classInstance);
            for (var index = 0; index < editInfoList.length; index++) {
                var element = editInfoList[index];
                if (element.name === propName) {
                    return element.editType;
                }
            }
            return null;
        }
        editor.getEditType = getEditType;
        /**
         * 编辑器事件
         */
        var EditorEvent = (function (_super) {
            __extends(EditorEvent, _super);
            function EditorEvent(type, data) {
                return _super.call(this, type, data) || this;
            }
            EditorEvent.CHANGE_SCENE = "changeScene";
            return EditorEvent;
        }(editor.BaseEvent));
        editor.EditorEvent = EditorEvent;
        __reflect(EditorEvent.prototype, "paper.editor.EditorEvent");
        /**
         * 编辑器
         **/
        var Editor = (function () {
            function Editor() {
            }
            /**初始化 */
            Editor.init = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                this.eventDispatcher = new editor.EventDispatcher();
                                //覆盖生成 uuid 的方式。
                                paper.createUUID = editor.generateUuid;
                                //初始化编辑环境
                                this.initEditEnvironment();
                                //允许重新加载
                                RES.FEATURE_FLAG.FIX_DUPLICATE_LOAD = 0;
                                //初始化资源
                                return [4 /*yield*/, RES.loadConfig("resource/default.res.json", "resource/")];
                            case 1:
                                //初始化资源
                                _a.sent();
                                //初始化编辑场景
                                this.editorSceneModel = new editor.EditorSceneModel();
                                this.editorSceneModel.init();
                                return [2 /*return*/];
                        }
                    });
                });
            };
            Object.defineProperty(Editor, "activeEditorModel", {
                /**
                 * 当前激活的编辑模型
                 */
                get: function () {
                    return this._activeEditorModel;
                },
                enumerable: true,
                configurable: true
            });
            //设置激活模型
            Editor.setActiveModel = function (model) {
                this.activeScene(model.scene);
                this._activeEditorModel = model;
                this.editorSceneModel.editorModel = model;
                this.dispatchEvent(new EditorEvent(EditorEvent.CHANGE_SCENE));
            };
            Editor.activeScene = function (scene) {
                if (paper.Application.sceneManager.activeScene) {
                    var objs_1 = paper.Application.sceneManager.activeScene.getRootGameObjects();
                    objs_1.forEach(function (obj) {
                        obj.activeSelf = false;
                    });
                }
                paper.Application.sceneManager.activeScene = scene;
                var objs = paper.Application.sceneManager.activeScene.getRootGameObjects();
                objs.forEach(function (obj) {
                    obj.activeSelf = true;
                });
            };
            /**
             * 编辑场景
             * @param sceneUrl 场景资源URL
             */
            Editor.editScene = function (sceneUrl) {
                return __awaiter(this, void 0, void 0, function () {
                    var rawScene, scene, sceneEditorModel;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, RES.getResAsync(sceneUrl)];
                            case 1:
                                rawScene = _a.sent();
                                if (rawScene) {
                                    scene = rawScene.createInstance(true);
                                    if (scene) {
                                        if (this.activeEditorModel) {
                                            this.activeEditorModel.scene.destroy();
                                        }
                                        sceneEditorModel = new editor.EditorModel();
                                        sceneEditorModel.init(scene, 'scene', sceneUrl);
                                        this.setActiveModel(sceneEditorModel);
                                        this.currentEditInfo = { url: sceneUrl, type: 'scene' };
                                    }
                                }
                                return [2 /*return*/];
                        }
                    });
                });
            };
            /**
             * 编辑预置体
             * @param prefabUrl 预置体资源URL
             */
            Editor.editPrefab = function (prefabUrl) {
                return __awaiter(this, void 0, void 0, function () {
                    var prefab, scene, prefabInstance, prefabEditorModel_1, clearPrefabInfo_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, RES.getResAsync(prefabUrl)];
                            case 1:
                                prefab = _a.sent();
                                if (prefab) {
                                    scene = paper.Scene.createEmpty('prefabEditScene', false);
                                    prefabInstance = prefab.createInstance(scene, true);
                                    if (prefabInstance) {
                                        if (this.activeEditorModel) {
                                            this.activeEditorModel.scene.destroy();
                                        }
                                        prefabEditorModel_1 = new editor.EditorModel();
                                        prefabEditorModel_1.init(scene, 'prefab', prefabUrl);
                                        clearPrefabInfo_1 = function (obj) {
                                            obj.extras = {};
                                            for (var _i = 0, _a = obj.components; _i < _a.length; _i++) {
                                                var comp = _a[_i];
                                                comp.extras = {};
                                            }
                                            for (var i = 0; i < obj.transform.children.length; i++) {
                                                var child = obj.transform.children[i].gameObject;
                                                if (prefabEditorModel_1.isPrefabChild(child))
                                                    clearPrefabInfo_1(child);
                                            }
                                        };
                                        clearPrefabInfo_1(prefabInstance);
                                        this.setActiveModel(prefabEditorModel_1);
                                        this.currentEditInfo = { url: prefabUrl, type: 'prefab' };
                                    }
                                }
                                return [2 /*return*/];
                        }
                    });
                });
            };
            /**
             * 刷新
             */
            Editor.refresh = function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (this.activeEditorModel) {
                                    this.activeEditorModel.scene.destroy();
                                }
                                //初始化资源
                                return [4 /*yield*/, RES.loadConfig("resource/default.res.json", "resource/")];
                            case 1:
                                //初始化资源
                                _a.sent();
                                if (this.currentEditInfo) {
                                    switch (this.currentEditInfo.type) {
                                        case 'scene':
                                            this.editScene(this.currentEditInfo.url);
                                            break;
                                        case 'prefab':
                                            this.editPrefab(this.currentEditInfo.url);
                                            break;
                                    }
                                }
                                return [2 /*return*/];
                        }
                    });
                });
            };
            /**
             * 撤销
             */
            Editor.undo = function () {
                if (this.activeEditorModel)
                    this.activeEditorModel.history.back();
            };
            /**
             * 重做
             */
            Editor.redo = function () {
                if (this.activeEditorModel)
                    this.activeEditorModel.history.forward();
            };
            Editor.deserializeHistory = function (data) {
                this.activeEditorModel.history.deserialize(data);
            };
            Editor.serializeHistory = function () {
                var historyData = this.activeEditorModel.history.serialize();
                return JSON.stringify(historyData);
            };
            Editor.addEventListener = function (type, fun, thisObj, level) {
                if (level === void 0) { level = 0; }
                this.eventDispatcher.addEventListener(type, fun, thisObj, level);
            };
            Editor.removeEventListener = function (type, fun, thisObj) {
                this.eventDispatcher.removeEventListener(type, fun, thisObj);
            };
            Editor.dispatchEvent = function (event) {
                this.eventDispatcher.dispatchEvent(event);
            };
            Editor.initEditEnvironment = function () {
                egret3d.runEgret({
                    antialias: false,
                    alpha: false,
                    playerMode: 2 /* Editor */,
                });
            };
            return Editor;
        }());
        editor.Editor = Editor;
        __reflect(Editor.prototype, "paper.editor.Editor");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        /**
         * TODO
         */
        var SceneSystem = (function (_super) {
            __extends(SceneSystem, _super);
            function SceneSystem() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._interests = [
                    [
                        { componentClass: egret3d.Transform }
                    ]
                ];
                _this._cameraAndLightCollecter = paper.GameObject.globalGameObject.getOrAddComponent(egret3d.CameraAndLightCollecter);
                _this._modelComponent = paper.GameObject.globalGameObject.getOrAddComponent(editor.ModelComponent);
                _this._keyEscape = egret3d.inputCollecter.getKey("Escape" /* Escape */);
                _this._keyDelete = egret3d.inputCollecter.getKey("Delete" /* Delete */);
                _this._keyE = egret3d.inputCollecter.getKey("KeyE" /* KeyE */);
                _this._keyW = egret3d.inputCollecter.getKey("KeyW" /* KeyW */);
                _this._keyR = egret3d.inputCollecter.getKey("KeyR" /* KeyR */);
                _this._keyX = egret3d.inputCollecter.getKey("KeyX" /* KeyX */);
                _this._keyF = egret3d.inputCollecter.getKey("KeyF" /* KeyF */);
                _this._orbitControls = null;
                _this._transformController = null;
                _this._boxesDrawer = null;
                _this._boxColliderDrawer = null;
                _this._sphereColliderDrawer = null;
                _this._cylinderColliderDrawer = null;
                _this._skeletonDrawer = null;
                _this._cameraViewFrustum = null; // TODO封装一下
                _this._worldAxisesDrawer = null;
                _this._gridDrawer = null;
                _this._onGameObjectHovered = function (_c, value) {
                };
                _this._onGameObjectSelectChanged = function (_c, value) {
                    var selectedGameObject = _this._modelComponent.selectedGameObject;
                    _this._transformController.gameObject.activeSelf =
                        selectedGameObject ? true : false;
                    _this._cameraViewFrustum.activeSelf =
                        selectedGameObject && selectedGameObject !== paper.GameObject.globalGameObject && selectedGameObject.getComponent(egret3d.Camera) ? true : false;
                };
                _this._onGameObjectSelected = function (_c, value) {
                };
                _this._onGameObjectUnselected = function (_c, value) {
                };
                return _this;
            }
            SceneSystem.prototype._updateCameras = function () {
                var editorCamera = egret3d.Camera.editor;
                for (var _i = 0, _a = this._cameraAndLightCollecter.cameras; _i < _a.length; _i++) {
                    var camera = _a[_i];
                    if (camera === editorCamera) {
                        continue;
                    }
                    var icon = camera.gameObject.transform.find("__pickTarget");
                    if (!icon) {
                        icon = editor.EditorMeshHelper.createIcon("__pickTarget", camera.gameObject, editor.EditorDefaultTexture.CAMERA_ICON).transform;
                    }
                    var cameraPosition = egret3d.Camera.editor.gameObject.transform.position;
                    var eyeDistance = cameraPosition.getDistance(camera.gameObject.transform.position);
                    icon.gameObject.transform.setLocalScale(egret3d.Vector3.ONE.clone().multiplyScalar(eyeDistance / 40).release());
                    icon.gameObject.transform.rotation = egret3d.Camera.editor.gameObject.transform.rotation;
                }
                var setPoint = function (cameraProject, positions, x, y, z, points) {
                    var vector = egret3d.Vector3.create();
                    var matrix = egret3d.Matrix4.create();
                    vector.set(x, y, z).applyMatrix(matrix.inverse(cameraProject)).applyMatrix(egret3d.Matrix4.IDENTITY);
                    if (points !== undefined) {
                        for (var i = 0, l = points.length; i < l; i++) {
                            var index = points[i] * 3;
                            positions[index + 0] = vector.x;
                            positions[index + 1] = vector.y;
                            positions[index + 2] = vector.z;
                        }
                    }
                    vector.release();
                    matrix.release();
                };
                var cameraViewFrustum = this._cameraViewFrustum;
                if (cameraViewFrustum.activeSelf) {
                    var selectedCamera = this._modelComponent.selectedGameObject.getComponent(egret3d.Camera);
                    cameraViewFrustum.transform.position = selectedCamera.gameObject.transform.position;
                    cameraViewFrustum.transform.rotation = selectedCamera.gameObject.transform.rotation;
                    var mesh = cameraViewFrustum.getComponent(egret3d.MeshFilter).mesh;
                    var cameraProject = egret3d.Matrix4.create();
                    var viewPortPixel = { x: 0, y: 0, w: 0, h: 0 };
                    selectedCamera.calcViewPortPixel(viewPortPixel); // update viewport
                    selectedCamera.calcProjectMatrix(viewPortPixel.w / viewPortPixel.h, cameraProject);
                    var positions = mesh.getVertices();
                    // center / target
                    setPoint(cameraProject, positions, 0, 0, -1, [38, 41]);
                    setPoint(cameraProject, positions, 0, 0, 1, [39]);
                    // near,
                    setPoint(cameraProject, positions, -1, -1, -1, [0, 7, 16, 25]);
                    setPoint(cameraProject, positions, 1, -1, -1, [1, 2, 18, 27]);
                    setPoint(cameraProject, positions, -1, 1, -1, [5, 6, 20, 29]);
                    setPoint(cameraProject, positions, 1, 1, -1, [3, 4, 22, 31]);
                    // far,
                    setPoint(cameraProject, positions, -1, -1, 1, [8, 15, 17]);
                    setPoint(cameraProject, positions, 1, -1, 1, [9, 10, 19]);
                    setPoint(cameraProject, positions, -1, 1, 1, [13, 14, 21]);
                    setPoint(cameraProject, positions, 1, 1, 1, [11, 12, 23]);
                    // up,
                    setPoint(cameraProject, positions, 0.7, 1.1, -1, [32, 37]);
                    setPoint(cameraProject, positions, -0.7, 1.1, -1, [33, 34]);
                    setPoint(cameraProject, positions, 0, 2, -1, [35, 36]);
                    // cross,
                    setPoint(cameraProject, positions, -1, 0, 1, [42]);
                    setPoint(cameraProject, positions, 1, 0, 1, [43]);
                    setPoint(cameraProject, positions, 0, -1, 1, [44]);
                    setPoint(cameraProject, positions, 0, 1, 1, [45]);
                    setPoint(cameraProject, positions, -1, 0, -1, [46]);
                    setPoint(cameraProject, positions, 1, 0, -1, [47]);
                    setPoint(cameraProject, positions, 0, -1, -1, [48]);
                    setPoint(cameraProject, positions, 0, 1, -1, [49]);
                    mesh.uploadVertexBuffer("POSITION" /* POSITION */);
                    cameraProject.release();
                }
            };
            SceneSystem.prototype._updateLights = function () {
                for (var _i = 0, _a = this._cameraAndLightCollecter.lights; _i < _a.length; _i++) {
                    var light = _a[_i];
                    if (light.gameObject.tag === "EditorOnly" /* EditorOnly */) {
                        continue;
                    }
                    var icon = light.gameObject.transform.find("__pickTarget");
                    if (!icon) {
                        icon = editor.EditorMeshHelper.createIcon("__pickTarget", light.gameObject, editor.EditorDefaultTexture.LIGHT_ICON).transform;
                    }
                    var cameraPosition = egret3d.Camera.editor.gameObject.transform.position;
                    var eyeDistance = cameraPosition.getDistance(light.gameObject.transform.position);
                    icon.gameObject.transform.setLocalScale(egret3d.Vector3.ONE.clone().multiplyScalar(eyeDistance / 40).release());
                    icon.gameObject.transform.rotation = egret3d.Camera.editor.gameObject.transform.rotation;
                }
            };
            SceneSystem.prototype.lookAtSelected = function () {
                this._orbitControls.distance = 10.0;
                this._orbitControls.lookAtOffset.set(0.0, 0.0, 0.0);
                if (this._modelComponent.selectedGameObject) {
                    this._orbitControls.lookAtPoint.copy(this._modelComponent.selectedGameObject.transform.position);
                }
                else {
                    this._orbitControls.lookAtPoint.copy(egret3d.Vector3.ZERO);
                }
            };
            SceneSystem.prototype.onEnable = function () {
                editor.ModelComponent.onGameObjectHovered.add(this._onGameObjectHovered, this);
                editor.ModelComponent.onGameObjectSelectChanged.add(this._onGameObjectSelectChanged, this);
                editor.ModelComponent.onGameObjectSelected.add(this._onGameObjectSelected, this);
                editor.ModelComponent.onGameObjectUnselected.add(this._onGameObjectUnselected, this);
                this._orbitControls = egret3d.Camera.editor.gameObject.addComponent(editor.OrbitControls);
                this._transformController = editor.EditorMeshHelper.createGameObject("TransformController").addComponent(editor.TransformController);
                this._transformController.gameObject.activeSelf = false;
                this._boxesDrawer = editor.EditorMeshHelper.createGameObject("BoxesDrawer").addComponent(editor.BoxesDrawer);
                this._boxColliderDrawer = editor.EditorMeshHelper.createGameObject("BoxColliderDrawer").addComponent(editor.BoxColliderDrawer);
                this._sphereColliderDrawer = editor.EditorMeshHelper.createGameObject("SphereColliderDrawer").addComponent(editor.SphereColliderDrawer);
                this._cylinderColliderDrawer = editor.EditorMeshHelper.createGameObject("CylinderColliderDrawer").addComponent(editor.CylinderColliderDrawer);
                this._skeletonDrawer = editor.EditorMeshHelper.createGameObject("SkeletonDrawer").addComponent(editor.SkeletonDrawer);
                this._cameraViewFrustum = editor.EditorMeshHelper.createCameraWireframed("Camera");
                this._cameraViewFrustum.activeSelf = false;
                // this._worldAxisesDrawer = EditorMeshHelper.createGameObject("WorldAxisesDrawer").addComponent(WorldAxisesDrawer);
                this._gridDrawer = editor.EditorMeshHelper.createGameObject("GridDrawer").addComponent(editor.GridDrawer);
                // TODO
                // const editorCamera = egret3d.Camera.editor;
                // const mainCamera = egret3d.Camera.main;
                // editorCamera.transform.position = mainCamera.transform.position;
                // editorCamera.transform.rotation = mainCamera.transform.rotation;
            };
            SceneSystem.prototype.onDisable = function () {
                editor.ModelComponent.onGameObjectHovered.remove(this._onGameObjectHovered, this);
                editor.ModelComponent.onGameObjectSelectChanged.remove(this._onGameObjectSelectChanged, this);
                editor.ModelComponent.onGameObjectSelected.remove(this._onGameObjectSelected, this);
                editor.ModelComponent.onGameObjectUnselected.remove(this._onGameObjectUnselected, this);
                //
                for (var _i = 0, _a = this._cameraAndLightCollecter.cameras; _i < _a.length; _i++) {
                    var camera = _a[_i];
                    if (camera.gameObject.tag === "EditorOnly" /* EditorOnly */) {
                        continue;
                    }
                    var icon = camera.gameObject.transform.find("__pickTarget");
                    if (icon) {
                        icon.gameObject.destroy();
                    }
                }
                for (var _b = 0, _d = this._cameraAndLightCollecter.lights; _b < _d.length; _b++) {
                    var light = _d[_b];
                    if (light.gameObject.tag === "EditorOnly" /* EditorOnly */) {
                        continue;
                    }
                    var icon = light.gameObject.transform.find("__pickTarget");
                    if (icon) {
                        icon.gameObject.destroy();
                    }
                }
                egret3d.Camera.editor.gameObject.removeComponent(editor.OrbitControls);
                this._orbitControls = null;
                this._transformController.gameObject.destroy();
                this._transformController = null;
                this._boxesDrawer.gameObject.destroy();
                this._boxesDrawer = null;
                this._boxColliderDrawer.gameObject.destroy();
                this._boxColliderDrawer = null;
                this._sphereColliderDrawer.gameObject.destroy();
                this._sphereColliderDrawer = null;
                this._cylinderColliderDrawer.gameObject.destroy();
                this._cylinderColliderDrawer = null;
                this._skeletonDrawer.gameObject.destroy();
                this._skeletonDrawer = null;
                this._cameraViewFrustum.destroy();
                this._cameraViewFrustum = null;
                // this._worldAxisesDrawer!.gameObject.destroy();
                // this._worldAxisesDrawer = null;
                this._gridDrawer.gameObject.destroy();
                this._gridDrawer = null;
            };
            SceneSystem.prototype.onUpdate = function () {
                var transformController = this._transformController;
                var defaultPointer = egret3d.inputCollecter.defaultPointer;
                if (defaultPointer.isDown(1 /* LeftMouse */, false)) {
                    if (defaultPointer.event.buttons & 2 /* RightMouse */) {
                    }
                    else {
                        if (transformController.isActiveAndEnabled && transformController.hovered) {
                            transformController.start(defaultPointer.downPosition);
                        }
                    }
                }
                if (defaultPointer.isUp(1 /* LeftMouse */, false)) {
                    if (transformController.isActiveAndEnabled && transformController.hovered) {
                        transformController.end();
                    }
                    else {
                        var event_1 = defaultPointer.event;
                        var hoveredGameObject = this._modelComponent.hoveredGameObject;
                        if (hoveredGameObject) {
                            if (this._modelComponent.selectedGameObjects.indexOf(hoveredGameObject) >= 0) {
                                if (event_1.ctrlKey) {
                                    this._modelComponent.unselect(hoveredGameObject);
                                }
                            }
                            else {
                                if (defaultPointer.position.getDistance(defaultPointer.downPosition) < 5.0) {
                                    if (hoveredGameObject.renderer instanceof egret3d.SkinnedMeshRenderer && !hoveredGameObject.transform.find("__pickTarget")) {
                                        var animation = hoveredGameObject.getComponentInParent(egret3d.Animation);
                                        if (animation) {
                                            var pickGameObject = editor.EditorMeshHelper.createGameObject("__pickTarget", null, null, "EditorOnly" /* EditorOnly */, hoveredGameObject.scene);
                                            pickGameObject.transform.parent = hoveredGameObject.transform;
                                            pickGameObject.addComponent(editor.GizmoPickComponent).pickTarget = animation.gameObject;
                                        }
                                    }
                                    var pickHelper = hoveredGameObject.name === "__pickTarget" ? hoveredGameObject.transform : hoveredGameObject.transform.find("__pickTarget");
                                    if (pickHelper) {
                                        this._modelComponent.select(pickHelper.gameObject.getComponent(editor.GizmoPickComponent).pickTarget, !event_1.ctrlKey);
                                    }
                                    else {
                                        this._modelComponent.select(hoveredGameObject, !event_1.ctrlKey);
                                    }
                                }
                                else if (defaultPointer.event.ctrlKey) {
                                    // TODO
                                }
                                else {
                                    // TODO
                                }
                            }
                        }
                        else if (!event_1.ctrlKey && !event_1.shiftKey) {
                            if (this._modelComponent.selectedGameObject) {
                                this._modelComponent.select(paper.Scene.activeScene);
                            }
                        }
                    }
                }
                {
                    var event_2 = defaultPointer.event;
                    if (event_2) {
                        if (event_2.buttons & 2) {
                        }
                        else if (event_2.buttons & 1) {
                        }
                        else {
                            var transformController_1 = this._transformController;
                            if (transformController_1.isActiveAndEnabled) {
                                if (event_2.shiftKey || event_2.ctrlKey) {
                                    transformController_1.hovered = null;
                                }
                                else {
                                    var raycastInfos = editor.Helper.raycastAll(transformController_1.mode.transform.children, defaultPointer.position.x, defaultPointer.position.y);
                                    if (raycastInfos.length > 0) {
                                        transformController_1.hovered = raycastInfos[0].transform.gameObject;
                                    }
                                    else {
                                        transformController_1.hovered = null;
                                    }
                                }
                            }
                            else {
                                transformController_1.hovered = null;
                            }
                            if (!transformController_1 || !transformController_1.isActiveAndEnabled || !transformController_1.hovered) {
                                var raycastInfos = editor.Helper.raycastAll(paper.Scene.activeScene.getRootGameObjects(), defaultPointer.position.x, defaultPointer.position.y);
                                if (raycastInfos.length > 0) {
                                    this._modelComponent.hover(raycastInfos[0].transform.gameObject);
                                }
                                else {
                                    this._modelComponent.hover(null);
                                }
                            }
                            else {
                                this._modelComponent.hover(null);
                            }
                        }
                    }
                }
                if (this._keyEscape.isUp(false) && !this._keyEscape.event.altKey && !this._keyEscape.event.ctrlKey && !this._keyEscape.event.shiftKey) {
                    this._modelComponent.select(null);
                }
                if (this._keyDelete.isUp(false) && !this._keyDelete.event.altKey && !this._keyDelete.event.ctrlKey && !this._keyDelete.event.shiftKey) {
                    if (paper.Application.playerMode !== 2 /* Editor */) {
                        for (var _i = 0, _a = this._modelComponent.selectedGameObjects; _i < _a.length; _i++) {
                            var gameObject = _a[_i];
                            gameObject.destroy();
                        }
                    }
                }
                if (this._keyW.isUp(false) && !this._keyW.event.altKey && !this._keyW.event.ctrlKey && !this._keyW.event.shiftKey) {
                    transformController.mode = transformController.translate;
                }
                if (this._keyE.isUp(false) && !this._keyE.event.altKey && !this._keyE.event.ctrlKey && !this._keyE.event.shiftKey) {
                    transformController.mode = transformController.rotate;
                }
                if (this._keyR.isUp(false) && !this._keyR.event.altKey && !this._keyR.event.ctrlKey && !this._keyR.event.shiftKey) {
                    transformController.mode = transformController.scale;
                }
                if (this._keyX.isUp(false) && !this._keyX.event.altKey && !this._keyX.event.ctrlKey && !this._keyX.event.shiftKey) {
                    transformController.isWorldSpace = !transformController.isWorldSpace;
                }
                if (this._keyF.isUp(false) && !this._keyF.event.altKey && !this._keyF.event.ctrlKey && !this._keyF.event.shiftKey) {
                    this.lookAtSelected();
                }
                // Update model gameObjects.
                if (this._modelComponent.hoveredGameObject && this._modelComponent.hoveredGameObject.isDestroyed) {
                    this._modelComponent.hover(null);
                }
                {
                    var i = this._modelComponent.selectedGameObjects.length;
                    while (i--) {
                        var gameObject = this._modelComponent.selectedGameObjects[0];
                        if (gameObject.isDestroyed) {
                            this._modelComponent.unselect(gameObject);
                        }
                    }
                }
                if (transformController.isActiveAndEnabled) {
                    transformController.update(defaultPointer.position);
                }
                this._boxesDrawer.update();
                this._boxColliderDrawer.update();
                this._sphereColliderDrawer.update();
                this._cylinderColliderDrawer.update();
                this._skeletonDrawer.update();
                // this._worldAxisesDrawer!.update();
                this._gridDrawer.update();
                this._updateCameras();
                this._updateLights();
            };
            return SceneSystem;
        }(paper.BaseSystem));
        editor.SceneSystem = SceneSystem;
        __reflect(SceneSystem.prototype, "paper.editor.SceneSystem");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        /**
         * @internal
         */
        var StatsSystem = (function (_super) {
            __extends(StatsSystem, _super);
            function StatsSystem() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._guiComponent = paper.GameObject.globalGameObject.getOrAddComponent(editor.GUIComponent);
                return _this;
            }
            StatsSystem.prototype.onAwake = function () {
            };
            return StatsSystem;
        }(paper.BaseSystem));
        editor.StatsSystem = StatsSystem;
        __reflect(StatsSystem.prototype, "paper.editor.StatsSystem");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        /**
         * @internal
         */
        var EditorMeshHelper = (function () {
            function EditorMeshHelper() {
            }
            EditorMeshHelper.createGameObject = function (name, mesh, material, tag, scene) {
                if (mesh === void 0) { mesh = null; }
                if (material === void 0) { material = null; }
                if (tag === void 0) { tag = "EditorOnly" /* EditorOnly */; }
                if (scene === void 0) { scene = paper.Scene.editorScene; }
                var gameObject = paper.GameObject.create(name, tag, scene);
                gameObject.hideFlags = 3 /* HideAndDontSave */;
                if (mesh) {
                    gameObject.addComponent(egret3d.MeshFilter).mesh = mesh;
                }
                if (material) {
                    gameObject.addComponent(egret3d.MeshRenderer).material = material;
                }
                return gameObject;
            };
            EditorMeshHelper.createIcon = function (name, parent, icon) {
                var material = new egret3d.Material(egret3d.DefaultShaders.TRANSPARENT);
                material.renderQueue = 4000 /* Overlay */ - 1;
                material.setTexture("map" /* Map */, icon);
                material.setColor("diffuse" /* Diffuse */, egret3d.Color.RED);
                var iconObj = this.createGameObject(name, egret3d.DefaultMeshes.QUAD, material, parent.tag, parent.scene);
                iconObj.transform.setParent(parent.transform);
                iconObj.addComponent(editor.GizmoPickComponent).pickTarget = parent;
                return iconObj;
            };
            EditorMeshHelper.createLine = function (name, color, opacity, scene) {
                var gameObject = this.createGameObject(name, egret3d.DefaultMeshes.LINE_Y, egret3d.DefaultMaterials.LINEDASHED.clone(), "EditorOnly" /* EditorOnly */, scene);
                gameObject.getComponent(egret3d.MeshRenderer).material.setColor(color).setBlend(1 /* Blend */, 3000 /* Transparent */, opacity);
                return gameObject;
            };
            EditorMeshHelper.createBox = function (name, color, opacity, scene) {
                var gameObject = this.createGameObject(name, egret3d.DefaultMeshes.CUBE_LINE, egret3d.DefaultMaterials.LINEDASHED.clone(), "EditorOnly" /* EditorOnly */, scene);
                gameObject.getComponent(egret3d.MeshRenderer).material.setColor(color).setBlend(1 /* Blend */, 3000 /* Transparent */, opacity);
                return gameObject;
            };
            EditorMeshHelper.createCircle = function (name, color, opacity, scene) {
                var gameObject = this.createGameObject(name, egret3d.DefaultMeshes.CIRCLE_LINE, egret3d.DefaultMaterials.LINEDASHED.clone(), "EditorOnly" /* EditorOnly */, scene);
                gameObject.getComponent(egret3d.MeshRenderer).material.setColor(color).setBlend(1 /* Blend */, 3000 /* Transparent */, opacity);
                return gameObject;
            };
            EditorMeshHelper.createCameraWireframed = function (name, colorFrustum, colorCone, colorUp, colorTarget, colorCross) {
                if (colorFrustum === void 0) { colorFrustum = egret3d.Color.create(1.0, 0.7, 0); }
                if (colorCone === void 0) { colorCone = egret3d.Color.RED; }
                if (colorUp === void 0) { colorUp = egret3d.Color.create(0, 0.7, 1); }
                if (colorTarget === void 0) { colorTarget = egret3d.Color.WHITE; }
                if (colorCross === void 0) { colorCross = egret3d.Color.create(0.2, 0.2, 0.2); }
                var vertices = [], colors = [];
                var verticeCount = 50;
                for (var i = 0; i < verticeCount; i++) {
                    vertices.push(0.0, 0.0, 0.0);
                    if (i < 24) {
                        colors.push(colorFrustum.r, colorFrustum.g, colorFrustum.b, colorFrustum.a);
                    }
                    else if (i < 32) {
                        colors.push(colorCone.r, colorCone.g, colorCone.b, colorCone.a);
                    }
                    else if (i < 38) {
                        colors.push(colorUp.r, colorUp.g, colorUp.b, colorUp.a);
                    }
                    else if (i < 40) {
                        colors.push(colorTarget.r, colorTarget.g, colorTarget.b, colorTarget.a);
                    }
                    else {
                        colors.push(colorCross.r, colorCross.g, colorCross.b, colorCross.a);
                    }
                }
                var mesh = new egret3d.Mesh(verticeCount, 0, ["POSITION" /* POSITION */, "COLOR_0" /* COLOR_0 */]);
                mesh.setAttributes("POSITION" /* POSITION */, vertices);
                mesh.setAttributes("COLOR_0" /* COLOR_0 */, colors);
                mesh.glTFMesh.primitives[0].mode = 1 /* Lines */;
                var material = egret3d.DefaultMaterials.LINEDASHED_COLOR.clone();
                material.setBlend(1 /* Blend */, 3000 /* Transparent */, 0.8);
                var gameObject = this.createGameObject(name, mesh, material);
                return gameObject;
            };
            return EditorMeshHelper;
        }());
        editor.EditorMeshHelper = EditorMeshHelper;
        __reflect(EditorMeshHelper.prototype, "paper.editor.EditorMeshHelper");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        /**
         * @internal
         */
        var Helper = (function () {
            function Helper() {
            }
            Helper.raycastAll = function (targets, mousePositionX, mousePositionY) {
                var camera = egret3d.Camera.editor;
                var ray = camera.createRayByScreen(mousePositionX, mousePositionY).release();
                var raycastInfos = egret3d.raycastAll(ray, targets, 0.0, 16777215 /* Everything */, true);
                return raycastInfos;
            };
            Helper.raycast = function (raycastAble, mousePositionX, mousePositionY) {
                var camera = egret3d.Camera.editor;
                var ray = camera.createRayByScreen(mousePositionX, mousePositionY);
                var raycastInfo = egret3d.RaycastInfo.create();
                return raycastAble.raycast(ray, raycastInfo) ? raycastInfo : null;
            };
            return Helper;
        }());
        editor.Helper = Helper;
        __reflect(Helper.prototype, "paper.editor.Helper");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
/// <reference path="./EventDispatcher.ts" />
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        editor.context = new editor.EventDispatcher();
        var selectItemType;
        (function (selectItemType) {
            selectItemType[selectItemType["GAMEOBJECT"] = 0] = "GAMEOBJECT";
            selectItemType[selectItemType["ASSET"] = 1] = "ASSET";
        })(selectItemType = editor.selectItemType || (editor.selectItemType = {}));
        /**
         * 编辑模型事件
         */
        var EditorModelEvent = (function (_super) {
            __extends(EditorModelEvent, _super);
            function EditorModelEvent(type, data) {
                return _super.call(this, type, data) || this;
            }
            EditorModelEvent.ADD_GAMEOBJECTS = "addGameObject";
            EditorModelEvent.DELETE_GAMEOBJECTS = "deleteGameObject";
            EditorModelEvent.SELECT_GAMEOBJECTS = "selectGame";
            EditorModelEvent.CHANGE_DIRTY = 'change_dirty';
            EditorModelEvent.CHANGE_PROPERTY = "changeProperty";
            EditorModelEvent.CHANGE_EDIT_MODE = "changeEditMode";
            EditorModelEvent.CHANGE_EDIT_TYPE = "changeEditType";
            EditorModelEvent.ADD_COMPONENT = "addComponent";
            EditorModelEvent.REMOVE_COMPONENT = "removeComponent";
            EditorModelEvent.UPDATE_GAMEOBJECTS_HIREARCHY = "updateGameObjectsHierarchy";
            EditorModelEvent.SAVE_ASSET = "saveAsset";
            return EditorModelEvent;
        }(editor.BaseEvent));
        editor.EditorModelEvent = EditorModelEvent;
        __reflect(EditorModelEvent.prototype, "paper.editor.EditorModelEvent");
        var ModifyObjectType;
        (function (ModifyObjectType) {
            ModifyObjectType[ModifyObjectType["GAMEOBJECT"] = 0] = "GAMEOBJECT";
            ModifyObjectType[ModifyObjectType["BASECOMPONENT"] = 1] = "BASECOMPONENT";
        })(ModifyObjectType = editor.ModifyObjectType || (editor.ModifyObjectType = {}));
        /**
         * 编辑模型
         */
        var EditorModel = (function (_super) {
            __extends(EditorModel, _super);
            function EditorModel() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._dirty = false;
                _this._cacheIds = [];
                return _this;
            }
            Object.defineProperty(EditorModel.prototype, "history", {
                get: function () {
                    return this._history;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditorModel.prototype, "scene", {
                get: function () {
                    return this._scene;
                },
                set: function (value) {
                    this._scene = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditorModel.prototype, "contentType", {
                get: function () {
                    return this._contentType;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditorModel.prototype, "contentUrl", {
                get: function () {
                    return this._contentUrl;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditorModel.prototype, "dirty", {
                get: function () {
                    return this._dirty;
                },
                set: function (v) {
                    if (this._dirty !== v) {
                        this._dirty = v;
                        this.dispatchEvent(new EditorModelEvent(EditorModelEvent.CHANGE_DIRTY));
                    }
                },
                enumerable: true,
                configurable: true
            });
            /**
             * 初始化
             * @param history
             */
            EditorModel.prototype.init = function (scene, contentType, contentUrl) {
                this._history = new editor.History();
                this._scene = scene;
                this._contentType = contentType;
                this._contentUrl = contentUrl;
            };
            EditorModel.prototype.addState = function (state) {
                if (state) {
                    state.editorModel = this;
                    this.history.add(state);
                }
            };
            EditorModel.prototype.setTransformProperty = function (propName, propOldValue, propNewValue, target) {
                var valueEditType = editor.getEditType(target, propName);
                if (valueEditType !== null) {
                    var newPropertyData = {
                        propName: propName,
                        copyValue: this.serializeProperty(propNewValue, valueEditType),
                        valueEditType: valueEditType
                    };
                    var prePropertyData = {
                        propName: propName,
                        copyValue: this.serializeProperty(propOldValue, valueEditType),
                        valueEditType: valueEditType
                    };
                    this.createModifyComponent(target.gameObject.uuid, target.uuid, [newPropertyData], [prePropertyData]);
                }
            };
            EditorModel.prototype.createModifyGameObjectPropertyState = function (gameObjectUUid, newValueList, preValueCopylist) {
                var state = editor.ModifyGameObjectPropertyState.create(gameObjectUUid, newValueList, preValueCopylist);
                this.addState(state);
            };
            EditorModel.prototype.createModifyComponent = function (gameObjectUUid, componentUUid, newValueList, preValueCopylist) {
                var state = editor.ModifyComponentPropertyState.create(gameObjectUUid, componentUUid, newValueList, preValueCopylist);
                this.addState(state);
            };
            EditorModel.prototype.createPrefabState = function (prefab, parent) {
                var state = editor.CreatePrefabState.create(prefab, parent);
                this.addState(state);
            };
            EditorModel.prototype.serializeProperty = function (value, editType) {
                switch (editType) {
                    case "UINT" /* UINT */:
                    case "INT" /* INT */:
                    case "FLOAT" /* FLOAT */:
                    case "TEXT" /* TEXT */:
                    case "CHECKBOX" /* CHECKBOX */:
                        return value;
                    case "VECTOR2" /* VECTOR2 */:
                    case "VECTOR3" /* VECTOR3 */:
                    case "VECTOR4" /* VECTOR4 */:
                    case "QUATERNION" /* QUATERNION */:
                    case "COLOR" /* COLOR */:
                    case "RECT" /* RECT */:
                        var className = egret.getQualifiedClassName(value);
                        var serializeData = value.serialize(value);
                        return { className: className, serializeData: serializeData };
                    case "SHADER" /* SHADER */:
                        return value.name;
                    case "LIST" /* LIST */:
                        return value;
                    case "MATERIAL_ARRAY" /* MATERIAL_ARRAY */:
                        var data = value.map(function (item) {
                            return { name: item.name, url: item.name };
                        });
                        return data;
                    case "MESH" /* MESH */:
                        if (!value)
                            return null;
                        return value.name;
                    case "GAMEOBJECT" /* GAMEOBJECT */:
                        if (!value) {
                            return null;
                        }
                        return value.uuid;
                    case "MATERIAL" /* MATERIAL */:
                    case "TRANSFROM" /* TRANSFROM */:
                    case "SOUND" /* SOUND */:
                    case "ARRAY" /* ARRAY */:
                        //TODO
                        console.error("not supported!");
                        break;
                    default:
                        break;
                }
            };
            EditorModel.prototype.deserializeProperty = function (serializeData, editType) {
                switch (editType) {
                    case "UINT" /* UINT */:
                    case "INT" /* INT */:
                    case "FLOAT" /* FLOAT */:
                    case "TEXT" /* TEXT */:
                    case "CHECKBOX" /* CHECKBOX */:
                        return serializeData;
                    case "VECTOR2" /* VECTOR2 */:
                    case "VECTOR3" /* VECTOR3 */:
                    case "VECTOR4" /* VECTOR4 */:
                    case "QUATERNION" /* QUATERNION */:
                    case "COLOR" /* COLOR */:
                    case "RECT" /* RECT */:
                        var clazz = egret.getDefinitionByName(serializeData.className);
                        var target = null;
                        if (clazz) {
                            target = new clazz();
                            target.deserialize(serializeData.serializeData);
                        }
                        return target;
                    case "SHADER" /* SHADER */:
                        var url = serializeData;
                        var asset = paper.Asset.find(url);
                        return asset;
                    case "LIST" /* LIST */:
                        return serializeData;
                    case "MATERIAL_ARRAY" /* MATERIAL_ARRAY */:
                        var materials = [];
                        for (var _i = 0, serializeData_1 = serializeData; _i < serializeData_1.length; _i++) {
                            var matrial = serializeData_1[_i];
                            var asset_1 = paper.Asset.find(matrial.url);
                            materials.push(asset_1);
                        }
                        return materials;
                    case "MESH" /* MESH */:
                        if (!serializeData) {
                            return null;
                        }
                        return paper.Asset.find(serializeData);
                    case "GAMEOBJECT" /* GAMEOBJECT */:
                        if (!serializeData) {
                            return null;
                        }
                        return this.getGameObjectByUUid(serializeData);
                    case "MATERIAL" /* MATERIAL */:
                    case "TRANSFROM" /* TRANSFROM */:
                    case "SOUND" /* SOUND */:
                    case "ARRAY" /* ARRAY */:
                        //TODO
                        console.error("not supported!");
                        return null;
                    default:
                        break;
                }
            };
            EditorModel.prototype.createGameObject = function (parentList, createType, mesh) {
                var state = editor.CreateGameObjectState.create(parentList, createType, mesh);
                this.addState(state);
            };
            EditorModel.prototype.addComponent = function (gameObjectUUid, compClzName) {
                var data = {
                    gameObjectUUid: gameObjectUUid,
                    compClzName: compClzName
                };
                var state = editor.AddComponentState.create(gameObjectUUid, compClzName);
                this.addState(state);
            };
            EditorModel.prototype.removeComponent = function (gameObjectUUid, componentUUid) {
                var obj = this.getGameObjectByUUid(gameObjectUUid);
                if (!obj) {
                    return;
                }
                var removeComponent = this.getComponentById(obj, componentUUid);
                if (!removeComponent) {
                    return;
                }
                var serializeData = paper.serialize(removeComponent);
                var state = editor.RemoveComponentState.create(gameObjectUUid, componentUUid, serializeData);
                this.addState(state);
            };
            EditorModel.prototype.getComponentById = function (gameObject, componentId) {
                for (var i = 0; i < gameObject.components.length; i++) {
                    var comp = gameObject.components[i];
                    if (comp.uuid === componentId) {
                        return comp;
                    }
                }
                return null;
            };
            EditorModel.prototype.getComponentByAssetId = function (gameObject, assetId) {
                for (var i = 0; i < gameObject.components.length; i++) {
                    var comp = gameObject.components[i];
                    if (comp.extras.linkedID === assetId) {
                        return comp;
                    }
                }
                return null;
            };
            /**
             * 复制游戏对象
             * @param objs
             */
            EditorModel.prototype.copyGameObject = function (objs) {
                var clipboard = __global.runtimeModule.getClipborad();
                var content = [];
                //过滤
                this.filtTopHierarchyGameObjects(objs);
                //排序
                objs = this.sortGameObjectsForHierarchy(objs);
                for (var i = 0; i < objs.length; i++) {
                    var obj = objs[i];
                    content.push({
                        type: "gameObject",
                        serializeData: paper.serialize(obj)
                    });
                }
                clipboard.writeText(JSON.stringify(content), "paper");
            };
            /**
             * 粘贴游戏对象
             * @param parent
             */
            EditorModel.prototype.pasteGameObject = function (parent) {
                var clipboard = __global.runtimeModule.getClipborad();
                var msg = clipboard.readText("paper");
                var content = JSON.parse(msg);
                if (content && content.length > 0) {
                    var objData = [];
                    for (var i = 0; i < content.length; i++) {
                        objData.push(content[i].serializeData);
                    }
                    var state = editor.PasteGameObjectsState.create(objData, parent);
                    this.addState(state);
                }
            };
            /**
             * 克隆游戏对象
             * @param gameObjects
             */
            EditorModel.prototype.duplicateGameObjects = function (gameObjects) {
                var state = editor.DuplicateGameObjectsState.create(gameObjects, this);
                this.addState(state);
            };
            /**
             * 删除游戏对象
             * @param gameObjects
             */
            EditorModel.prototype.deleteGameObject = function (gameObjects) {
                var _this = this;
                var deleteState = editor.DeleteGameObjectsState.create(gameObjects, this);
                var breakList = [];
                gameObjects.forEach(function (obj) {
                    if (_this.isPrefabChild(obj) && !_this.isPrefabRoot(obj)) {
                        breakList.push(obj);
                    }
                });
                if (breakList.length > 0) {
                    var breakState = editor.BreakPrefabStructState.create(breakList);
                    var stateGroup = editor.StateGroup.create([breakState, deleteState]);
                    this.addState(stateGroup);
                }
                else {
                    this.addState(deleteState);
                }
            };
            /**
             * 解除预置体联系
             * @param gameObjects
             */
            EditorModel.prototype.breakPrefab = function (gameObjects) {
                var _this = this;
                var breakList = [];
                gameObjects.forEach(function (obj) {
                    if (_this.isPrefabChild(obj) || _this.isPrefabRoot(obj)) {
                        breakList.push(obj);
                    }
                });
                if (breakList.length > 0) {
                    var breakState = editor.BreakPrefabStructState.create(breakList);
                    this.addState(breakState);
                }
            };
            /**
             * 更改层级
             * */
            EditorModel.prototype.updateGameObjectsHierarchy = function (gameObjects, targetGameobjcet, dir) {
                var _this = this;
                var gameObjectHierarchyState = editor.GameObjectHierarchyState.create(gameObjects, targetGameobjcet, dir, this);
                var breakList = [];
                gameObjects.forEach(function (obj) {
                    if (_this.isPrefabChild(obj) &&
                        !_this.isPrefabRoot(obj) &&
                        (obj.transform.parent !== targetGameobjcet.transform.parent || dir === 'inner')) {
                        breakList.push(obj);
                    }
                });
                if (breakList.length > 0) {
                    var breakPrefabStructState = editor.BreakPrefabStructState.create(breakList);
                    var stateGroup = editor.StateGroup.create([breakPrefabStructState, gameObjectHierarchyState]);
                    this.addState(stateGroup);
                }
                else {
                    this.addState(gameObjectHierarchyState);
                }
            };
            /**
             * 设置对象的层级
             */
            EditorModel.prototype.setGameObjectsHierarchy = function (objects, targetObject, dir) {
                objects = objects.concat();
                //剔除所有父级
                objects.forEach(function (obj) { obj.transform.parent = null; });
                objects.reverse();
                if (dir === 'inner') {
                    var index = targetObject.transform.children.length;
                    for (var i = 0; i < objects.length; i++) {
                        var obj = objects[i];
                        obj.transform.parent = targetObject.transform;
                        var transform = targetObject.transform.children.pop();
                        targetObject.transform.children.splice(index, 0, transform);
                    }
                }
                else {
                    if (targetObject.transform.parent) {
                        var index = void 0;
                        switch (dir) {
                            case 'top':
                                index = targetObject.transform.parent.children.indexOf(targetObject.transform);
                                break;
                            case 'bottom':
                                index = targetObject.transform.parent.children.indexOf(targetObject.transform) + 1;
                                break;
                        }
                        for (var i = 0; i < objects.length; i++) {
                            var obj = objects[i];
                            obj.transform.parent = targetObject.transform.parent;
                            var transform = targetObject.transform.parent.children.pop();
                            targetObject.transform.parent.children.splice(index, 0, transform);
                        }
                    }
                    else {
                        var all = this.scene.gameObjects;
                        for (var i = 0; i < objects.length; i++) {
                            all.splice(all.indexOf(objects[i]), 1);
                        }
                        var index = void 0;
                        switch (dir) {
                            case 'top':
                                index = all.indexOf(targetObject);
                                break;
                            case 'bottom':
                                index = all.indexOf(targetObject) + 1;
                                break;
                        }
                        for (var i = 0; i < objects.length; i++) {
                            var obj = objects[i];
                            all.splice(index, 0, obj);
                        }
                    }
                }
            };
            /**
             * 筛选层级中的顶层游戏对象
             * @param gameObjects
             */
            EditorModel.prototype.filtTopHierarchyGameObjects = function (gameObjects) {
                var findParent = false;
                var parent = null;
                for (var index = gameObjects.length - 1; index >= 0; index--) {
                    var element = gameObjects[index];
                    findParent = false;
                    parent = element.transform.parent;
                    while (parent) {
                        for (var i = 0; i < gameObjects.length; i++) {
                            var element_1 = gameObjects[i];
                            if (element_1.transform === parent) {
                                gameObjects.splice(index, 1);
                                findParent = true;
                                break;
                            }
                        }
                        if (findParent) {
                            break;
                        }
                        parent = parent.parent;
                    }
                }
            };
            EditorModel.prototype.getGameObjectByUUid = function (uuid) {
                var objects = this.scene.gameObjects;
                for (var i = 0; i < objects.length; i++) {
                    if (objects[i].uuid === uuid) {
                        return objects[i];
                    }
                }
                return null;
            };
            EditorModel.prototype.getGameObjectsByUUids = function (uuids) {
                var objects = this.scene.gameObjects;
                var obj;
                var result = [];
                var idIndex;
                var cloneIds = uuids.concat();
                for (var i = 0; i < objects.length; i++) {
                    if (cloneIds.length === 0) {
                        return result;
                    }
                    obj = objects[i];
                    idIndex = cloneIds.indexOf(obj.uuid);
                    if (idIndex !== -1) {
                        result.push(obj);
                        cloneIds.splice(idIndex, 1);
                    }
                }
                return result;
            };
            EditorModel.prototype.getTargetByPropertyChain = function (propertyChain, target) {
                if (propertyChain.length == 1) {
                    return target;
                }
                var realTarget;
                for (var index = 0; index < propertyChain.length; index++) {
                    if (index === propertyChain.length - 1) {
                        return realTarget;
                    }
                    var element = propertyChain[index];
                    realTarget = realTarget ? realTarget[element] : target[element];
                }
                throw new Error("can not find target");
            };
            EditorModel.prototype.setTargetProperty = function (propNameOrpropertyChain, target, value, editType) {
                var propertyName;
                if (Array.isArray(propNameOrpropertyChain)) {
                    target = this.getTargetByPropertyChain(propNameOrpropertyChain, target);
                    propertyName = propNameOrpropertyChain[propNameOrpropertyChain.length - 1];
                }
                else {
                    propertyName = propNameOrpropertyChain;
                }
                if (editType !== "VECTOR2" /* VECTOR2 */ &&
                    editType !== "VECTOR3" /* VECTOR3 */ &&
                    editType !== "VECTOR4" /* VECTOR4 */ &&
                    editType !== "COLOR" /* COLOR */) {
                    target[propertyName] = value;
                    return;
                }
                if (this.propertyHasGetterSetter(propertyName, target)) {
                    target[propertyName] = value;
                }
                else {
                    switch (editType) {
                        case "VECTOR2" /* VECTOR2 */:
                            var vec2 = target[propertyName];
                            vec2.x = value.x;
                            vec2.y = value.y;
                            break;
                        case "VECTOR3" /* VECTOR3 */:
                            var vec3 = target[propertyName];
                            vec3.x = value.x;
                            vec3.y = value.y;
                            vec3.z = value.z;
                            break;
                        case "VECTOR4" /* VECTOR4 */:
                            var vec4 = target[propertyName];
                            vec4.x = value.x;
                            vec4.y = value.y;
                            vec4.z = value.z;
                            vec4.w = value.w;
                            break;
                        case "COLOR" /* COLOR */:
                            var color = target[propertyName];
                            color.r = value.r;
                            color.g = value.g;
                            color.b = value.b;
                            color.a = value.a;
                            break;
                        default:
                            break;
                    }
                }
            };
            EditorModel.prototype.propertyHasGetterSetter = function (propName, target) {
                var prototype = Object.getPrototypeOf(target);
                var descriptror;
                while (prototype) {
                    descriptror = Object.getOwnPropertyDescriptor(prototype, propName);
                    if (descriptror && descriptror.get && descriptror.set) {
                        return true;
                    }
                    prototype = Object.getPrototypeOf(prototype);
                }
                return false;
            };
            /**
             * 选择游戏对象
             *  */
            EditorModel.prototype.selectGameObject = function (objs) {
                this.currentSelected = objs;
                this.dispatchEvent(new EditorModelEvent(EditorModelEvent.SELECT_GAMEOBJECTS, objs));
            };
            /**
             * 切换编辑模式
             */
            EditorModel.prototype.changeEditMode = function (mode) {
                this.currentEditMode = mode;
                this.dispatchEvent(new EditorModelEvent(EditorModelEvent.CHANGE_EDIT_MODE, mode));
            };
            /**
             * 切换编辑类型
             */
            EditorModel.prototype.changeEditType = function (type) {
                this.dispatchEvent(new EditorModelEvent(EditorModelEvent.CHANGE_EDIT_TYPE, type));
            };
            EditorModel.prototype.isPrefabRoot = function (gameObj) {
                if (gameObj.extras && gameObj.extras.prefab) {
                    return true;
                }
                return false;
            };
            EditorModel.prototype.isPrefabChild = function (gameObj) {
                if (gameObj.extras && gameObj.extras.rootID) {
                    return true;
                }
                return false;
            };
            /**将对象按照层级进行排序
             */
            EditorModel.prototype.sortGameObjectsForHierarchy = function (gameobjects) {
                var _this = this;
                gameobjects = gameobjects.concat();
                if (gameobjects.length < 2) {
                    return gameobjects;
                }
                //生成每个对象的显示索引路径列表
                var displayPathList = [];
                gameobjects.forEach(function (obj) {
                    var result = [];
                    var currentObj = obj;
                    while (currentObj.transform.parent) {
                        result.unshift(currentObj.transform.parent.children.indexOf(currentObj.transform));
                        currentObj = currentObj.transform.parent.gameObject;
                    }
                    //追加一个根部索引
                    result.unshift(_this.scene.gameObjects.indexOf(currentObj));
                    displayPathList.push({ gameObject: obj, path: result });
                });
                function getPath(gameObject) {
                    for (var i_1 = 0; i_1 < displayPathList.length; i_1++) {
                        if (displayPathList[i_1].gameObject === gameObject) {
                            return displayPathList[i_1].path;
                        }
                    }
                    return [];
                }
                var length = gameobjects.length - 1;
                while (length > 0) {
                    for (var i = 0; i < length; i++) {
                        var A = getPath(gameobjects[i]);
                        var B = getPath(gameobjects[i + 1]);
                        var needChangeIndex = false;
                        var minLength = Math.min(A.length, B.length);
                        var k = 0;
                        b: for (k; k < minLength; k++) {
                            if (A[k] === B[k]) {
                                continue;
                            }
                            else if (A[k] > B[k]) {
                                needChangeIndex = true;
                                break b;
                            }
                            else if (A[k] < B[k]) {
                                needChangeIndex = false;
                                break b;
                            }
                        }
                        if (k === minLength && !needChangeIndex && A.length > B.length) {
                            needChangeIndex = true;
                        }
                        if (needChangeIndex) {
                            var tmpv = gameobjects[i];
                            gameobjects[i] = gameobjects[i + 1];
                            gameobjects[i + 1] = tmpv;
                        }
                    }
                    length--;
                }
                return gameobjects;
            };
            EditorModel.prototype.createApplyPrefabState = function (applyData, applyPrefabInstanceId, prefab) {
                var state = editor.ApplyPrefabInstanceState.create(applyData, applyPrefabInstanceId, prefab);
                this.addState(state);
            };
            EditorModel.prototype.createRevertPrefabState = function (revertData, revertPrefabInstanceId) {
                var state = editor.RevertPrefabInstanceState.create(revertData, revertPrefabInstanceId);
                this.addState(state);
            };
            EditorModel.prototype.deepClone = function (obj) {
                var _this = this;
                if (!obj || typeof obj !== 'object') {
                    return obj;
                }
                if (obj instanceof RegExp) {
                    return obj;
                }
                var result = Array.isArray(obj) ? [] : {};
                Object.keys(obj).forEach(function (key) {
                    var objTmp = obj;
                    if (objTmp[key] && typeof objTmp[key] === 'object') {
                        result[key] = _this.deepClone(objTmp[key]);
                    }
                    else {
                        result[key] = objTmp[key];
                    }
                });
                return result;
            };
            EditorModel.prototype.updateAsset = function (asset, prefabInstance) {
                if (prefabInstance === void 0) { prefabInstance = null; }
                var refs = this.findAssetRefs(this.scene, asset);
                var serializeData;
                if (asset instanceof paper.Prefab) {
                    serializeData = paper.serialize(prefabInstance);
                }
                else {
                }
                //save asset
                //destory asset,getRes
                //update refrence (paper.assets[])
                this._cacheIds.length = 0;
            };
            EditorModel.prototype.findAssetRefs = function (target, as, refs) {
                if (refs === void 0) { refs = null; }
                if (this._cacheIds.indexOf(target.uuid) >= 0) {
                    return;
                }
                this._cacheIds.push(target.uuid);
                refs = refs || [];
                for (var key in target) {
                    var source = target[key];
                    if ((typeof source) === "object") {
                        this.findFromChildren(source, as, refs, target, key);
                    }
                }
                return refs;
            };
            EditorModel.prototype.findFromChildren = function (source, as, refs, parent, key) {
                if ((typeof source) !== "object") {
                    return;
                }
                if (Array.isArray(source) || ArrayBuffer.isView(source)) {
                    for (var index = 0; index < source.length; index++) {
                        var element = source[index];
                        this.findFromChildren(element, as, refs, source, index);
                    }
                }
                if (source.constructor === Object) {
                    for (var key_1 in source) {
                        var element = source[key_1];
                        this.findFromChildren(element, as, refs, source, key_1);
                    }
                }
                if (source instanceof paper.BaseObject) {
                    if (source instanceof paper.Asset && source === as) {
                        refs.push({ p: parent, k: key });
                        return;
                    }
                    this.findAssetRefs(source, as, refs);
                }
            };
            EditorModel.prototype.getAllGameObjectsFromPrefabInstance = function (gameObj, objs) {
                if (objs === void 0) { objs = null; }
                if (gameObj) {
                    objs = objs || [];
                    if (gameObj.extras.linkedID) {
                        objs.push(gameObj);
                    }
                    for (var index = 0; index < gameObj.transform.children.length; index++) {
                        var element = gameObj.transform.children[index];
                        var obj = element.gameObject;
                        this.getAllGameObjectsFromPrefabInstance(obj, objs);
                    }
                }
                return objs;
            };
            EditorModel.prototype.modifyMaterialPropertyValues = function (target, valueList) {
                return __awaiter(this, void 0, void 0, function () {
                    var _i, valueList_1, propertyValue, propName, copyValue, uniformType, _glTFMaterial, gltfUnifromMap, uniformMap, key, value;
                    return __generator(this, function (_a) {
                        for (_i = 0, valueList_1 = valueList; _i < valueList_1.length; _i++) {
                            propertyValue = valueList_1[_i];
                            propName = propertyValue.propName, copyValue = propertyValue.copyValue, uniformType = propertyValue.uniformType;
                            switch (uniformType) {
                                case 35670 /* BOOL */:
                                    target.setBoolean(propName, copyValue);
                                    break;
                                case 5124 /* INT */:
                                    target.setInt(propName, copyValue);
                                case 5126 /* FLOAT */:
                                    target.setFloat(propName, copyValue);
                                    break;
                                case 35671 /* BOOL_VEC2 */:
                                case 35667 /* INT_VEC2 */:
                                case 35664 /* FLOAT_VEC2 */:
                                    target.setVector2v(propName, copyValue);
                                    break;
                                case 35672 /* BOOL_VEC3 */:
                                case 35668 /* INT_VEC3 */:
                                case 35665 /* FLOAT_VEC3 */:
                                    target.setVector3v(propName, copyValue);
                                    break;
                                case 35673 /* BOOL_VEC4 */:
                                case 35669 /* INT_VEC4 */:
                                case 35666 /* FLOAT_VEC4 */:
                                    target.setVector4v(propName, copyValue);
                                    break;
                                case 35678 /* SAMPLER_2D */:
                                    target.setTexture(propName, copyValue);
                                    break;
                                case 35674 /* FLOAT_MAT2 */:
                                case 35675 /* FLOAT_MAT3 */:
                                case 35676 /* FLOAT_MAT4 */:
                                    target.setMatrixv(propName, copyValue);
                                    break;
                                default:
                                    break;
                            }
                            if (propName === "renderQueue") {
                                target.config.materials[0].extensions.paper.renderQueue = copyValue;
                            }
                            this.dispatchEvent(new EditorModelEvent(EditorModelEvent.CHANGE_PROPERTY, { target: target, propName: propName, propValue: copyValue }));
                        }
                        _glTFMaterial = target.config.materials[0];
                        gltfUnifromMap = _glTFMaterial.extensions.KHR_techniques_webgl.values;
                        uniformMap = target._glTFTechnique.uniforms;
                        for (key in uniformMap) {
                            if (uniformMap[key].semantic === undefined) {
                                value = uniformMap[key].value;
                                if (Array.isArray(value)) {
                                    gltfUnifromMap[key] = value.concat();
                                }
                                else if (value instanceof egret3d.GLTexture2D) {
                                    gltfUnifromMap[key] = value.name;
                                }
                                else {
                                    gltfUnifromMap[key] = value;
                                }
                            }
                        }
                        return [2 /*return*/];
                    });
                });
            };
            return EditorModel;
        }(editor.EventDispatcher));
        editor.EditorModel = EditorModel;
        __reflect(EditorModel.prototype, "paper.editor.EditorModel");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        editor.EventType = {
            HistoryState: "HistoryState",
            HistoryAdd: "HistoryAdd",
            HistoryFree: "HistoryFree"
        };
        var History = (function () {
            function History() {
                this.dispatcher = null;
                this._locked = 0;
                this._index = -1;
                this._batchIndex = 0;
                this._states = [];
                this._batchStates = [];
                this._events = [];
            }
            History.prototype._free = function () {
                if (this._states.length > this._index + 1) {
                    this._states.length = this._index + 1; // TODO release.
                    if (this.dispatcher) {
                        this.dispatcher.dispatchEvent(new editor.BaseEvent(editor.EventType.HistoryFree, null));
                    }
                }
            };
            History.prototype._doState = function (state, isUndo) {
                if (isUndo) {
                    state.undo();
                }
                else {
                    state.redo();
                }
                var d = isUndo ? "undo" : "redo";
                if (this.dispatcher) {
                    var data = { isUndo: isUndo };
                    this._events.push(data);
                }
                return state.batchIndex > 0 && (isUndo ? this._index >= 0 : this._index < this._states.length - 1);
            };
            History.prototype.back = function () {
                if (this._index < 0 || this._batchIndex > 0) {
                    return false;
                }
                this._locked |= 1;
                while (this._doState(this._states[this._index--], true)) {
                }
                if (this.dispatcher && this._events.length > 0) {
                    for (var _i = 0, _a = this._events; _i < _a.length; _i++) {
                        var event_3 = _a[_i];
                        this.dispatcher.dispatchEvent(new editor.BaseEvent(editor.EventType.HistoryState, event_3));
                    }
                    this._events.length = 0;
                }
                this._locked &= 2;
                return true;
            };
            History.prototype.forward = function () {
                if (this._index >= this._states.length - 1 || this._batchIndex > 0) {
                    return false;
                }
                this._locked |= 1;
                while (this._doState(this._states[++this._index], false)) {
                }
                if (this.dispatcher && this._events.length > 0) {
                    for (var _i = 0, _a = this._events; _i < _a.length; _i++) {
                        var event_4 = _a[_i];
                        this.dispatcher.dispatchEvent(new editor.BaseEvent(editor.EventType.HistoryState, event_4));
                    }
                    this._events.length = 0;
                }
                this._locked &= 2;
                return true;
            };
            History.prototype.go = function (index) {
                if (this._batchIndex > 0) {
                    return false;
                }
                var result = false;
                if (this._index < index) {
                    while (this._index !== index && this.forward()) {
                        result = true;
                    }
                }
                else {
                    while (this._index !== index && this.back()) {
                        result = true;
                    }
                }
                return result;
            };
            History.prototype.add = function (state) {
                if (this._locked !== 0) {
                    return;
                }
                if (this._batchIndex > 0) {
                    state.batchIndex = this._batchIndex;
                    this._batchStates.push(state);
                }
                else {
                    this._states[this._index + 1] = state;
                    if (this.dispatcher !== null) {
                        this.dispatcher.dispatchEvent(new editor.BaseEvent(editor.EventType.HistoryAdd, event));
                    }
                    this.forward();
                    this._free();
                }
            };
            History.prototype.beginBatch = function () {
                this._batchIndex++;
            };
            History.prototype.endBatch = function () {
                if (this._batchIndex === 0) {
                    return;
                }
                this._batchIndex--;
                if (this._batchIndex === 0) {
                    var index = this._index + 1;
                    for (var _i = 0, _a = this._batchStates; _i < _a.length; _i++) {
                        var state = _a[_i];
                        this._states[index++] = state;
                    }
                    if (this.dispatcher !== null) {
                        this.dispatcher.dispatchEvent(new editor.BaseEvent(editor.EventType.HistoryAdd, event));
                    }
                    this._batchStates.length = 0;
                    this.go(this._states.length - 1);
                }
            };
            History.prototype.getState = function (index) {
                return this._states[index];
            };
            Object.defineProperty(History.prototype, "enabled", {
                get: function () {
                    return this._locked === 0;
                },
                set: function (value) {
                    if (value) {
                        this._locked &= 1;
                    }
                    else {
                        this._locked |= 2;
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(History.prototype, "count", {
                get: function () {
                    return this._states.length;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(History.prototype, "index", {
                get: function () {
                    return this._index;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(History.prototype, "batchIndex", {
                get: function () {
                    return this._batchIndex;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(History.prototype, "locked", {
                get: function () {
                    return this._locked;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(History.prototype, "states", {
                get: function () {
                    return this._states;
                },
                enumerable: true,
                configurable: true
            });
            History.prototype.serialize = function () {
                var states = this.states;
                var statesData = [];
                for (var index = 0; index < states.length; index++) {
                    var element = states[index];
                    var className = egret.getQualifiedClassName(element);
                    var data = {
                        className: className,
                        batchIndex: element.batchIndex,
                        data: element.hasOwnProperty('deserialize') ? element['serialize']() : element.data,
                        autoClear: element.autoClear,
                        isDone: element.isDone,
                    };
                    statesData.push(data);
                }
                var serializeHistory = {
                    index: this.index,
                    batchIndex: this.batchIndex,
                    locked: this.locked,
                    statesData: statesData,
                };
                return serializeHistory;
            };
            History.prototype.deserialize = function (serializeHistory) {
                var states = [];
                var statesData = serializeHistory.statesData;
                for (var index = 0; index < statesData.length; index++) {
                    var element = statesData[index];
                    var clazz = egret.getDefinitionByName(element.className);
                    var state = void 0;
                    if (clazz) {
                        state = new clazz();
                        state.batchIndex = element.batchIndex;
                        state.data = element.hasOwnProperty('deserialize') ? element['deserialize'](element.data) : element.data;
                        state.autoClear = element.autoClear;
                        state.isDone = element.isDone;
                        states.push(state);
                    }
                }
                var initData = {
                    states: states,
                    index: serializeHistory.index,
                    batchIndex: serializeHistory.batchIndex,
                    locked: serializeHistory.locked,
                };
                this._index = initData ? initData.index : -1;
                this._locked = initData ? initData.locked : 0;
                this._batchIndex = initData ? initData.batchIndex : 0;
                this._states = initData ? initData.states : [];
            };
            return History;
        }());
        editor.History = History;
        __reflect(History.prototype, "paper.editor.History");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        //添加组件
        var AddComponentState = (function (_super) {
            __extends(AddComponentState, _super);
            function AddComponentState() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            AddComponentState.toString = function () {
                return "[class common.AddComponentState]";
            };
            AddComponentState.create = function (gameObjectUUid, compClzName) {
                var state = new AddComponentState();
                var data = { gameObjectUUid: gameObjectUUid, compClzName: compClzName };
                state.data = data;
                return state;
            };
            Object.defineProperty(AddComponentState.prototype, "stateData", {
                get: function () {
                    return this.data;
                },
                enumerable: true,
                configurable: true
            });
            AddComponentState.prototype.undo = function () {
                if (_super.prototype.undo.call(this)) {
                    var gameObjectUUid = this.stateData.gameObjectUUid;
                    var componentId = this.stateData.cacheComponentId;
                    var gameObject = this.editorModel.getGameObjectByUUid(gameObjectUUid);
                    if (gameObject) {
                        var component = this.editorModel.getComponentById(gameObject, componentId);
                        if (component) {
                            gameObject.removeComponent(component);
                            this.dispatchEditorModelEvent(editor.EditorModelEvent.REMOVE_COMPONENT);
                        }
                    }
                    return true;
                }
                return false;
            };
            AddComponentState.prototype.redo = function () {
                if (_super.prototype.redo.call(this)) {
                    var gameObjectUUid = this.stateData.gameObjectUUid;
                    var compClzName = this.stateData.compClzName;
                    var gameObject = this.editorModel.getGameObjectByUUid(gameObjectUUid);
                    if (gameObject) {
                        if (this.stateData.serializeData) {
                            new paper.Deserializer().deserialize(this.data.serializeData, true, false, gameObject);
                        }
                        else {
                            var compClz = egret.getDefinitionByName(compClzName);
                            var addComponent = gameObject.addComponent(compClz);
                            this.stateData.serializeData = paper.serialize(addComponent);
                            this.stateData.cacheComponentId = addComponent.uuid;
                        }
                        this.dispatchEditorModelEvent(editor.EditorModelEvent.ADD_COMPONENT);
                    }
                    return true;
                }
                return false;
            };
            return AddComponentState;
        }(editor.BaseState));
        editor.AddComponentState = AddComponentState;
        __reflect(AddComponentState.prototype, "paper.editor.AddComponentState");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        var ApplyPrefabInstanceState = (function (_super) {
            __extends(ApplyPrefabInstanceState, _super);
            function ApplyPrefabInstanceState() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.firstRedo = true;
                return _this;
            }
            ApplyPrefabInstanceState.toString = function () {
                return "[class common.ApplyPrefabInstanceState]";
            };
            ApplyPrefabInstanceState.create = function (applyData, applyPrefabRootId, prefab) {
                var state = new ApplyPrefabInstanceState();
                var cachePrefabSerializedData = editor.Editor.activeEditorModel.deepClone(prefab._raw);
                var data = {
                    applyPrefabRootId: applyPrefabRootId,
                    prefab: prefab,
                    applyData: applyData,
                    cachePrefabSerializedData: cachePrefabSerializedData
                };
                data.cacheGameObjetsIds = [];
                data.cacheComponentsIds = {};
                state.data = data;
                return state;
            };
            Object.defineProperty(ApplyPrefabInstanceState.prototype, "stateData", {
                get: function () {
                    return this.data;
                },
                enumerable: true,
                configurable: true
            });
            ApplyPrefabInstanceState.prototype.undo = function () {
                if (_super.prototype.undo.call(this)) {
                    var applyGameObject = editor.Editor.activeEditorModel.getGameObjectByUUid(this.stateData.applyPrefabRootId);
                    var objects = this.editorModel.scene.gameObjects;
                    for (var index = objects.length - 1; index >= 0; index--) {
                        if (this.stateData.cacheGameObjetsIds.length === 0 && Object.keys(this.stateData.cacheComponentsIds).length === 0) {
                            break;
                        }
                        var gameObj = objects[index];
                        var gIndex = this.stateData.cacheGameObjetsIds.indexOf(gameObj.uuid);
                        if (gIndex >= 0) {
                            gameObj.destroy();
                            this.stateData.cacheGameObjetsIds.splice(gIndex, 1);
                        }
                        else if (this.stateData.cacheComponentsIds[gameObj.uuid] && this.stateData.cacheComponentsIds[gameObj.uuid].length > 0) {
                            var comIds = this.stateData.cacheComponentsIds[gameObj.uuid];
                            for (var comIndex = gameObj.components.length - 1; comIndex >= 0; comIndex--) {
                                var com = gameObj.components[comIndex];
                                var cIndex = comIds.indexOf(com.uuid);
                                if (cIndex >= 0) {
                                    gameObj.removeComponent(com);
                                    comIds.splice(cIndex, 1);
                                    if (comIds.length === 0) {
                                        delete this.stateData.cacheComponentsIds[gameObj.uuid];
                                    }
                                }
                            }
                        }
                    }
                    var tempPrefabObject = this.stateData.prefab.createInstance(paper.Application.sceneManager.globalScene, true);
                    for (var linkedId in this.stateData.applyData) {
                        var applyData = this.stateData.applyData[linkedId];
                        if (applyData.addGameObjects && applyData.addGameObjects.length > 0) {
                            for (var index = 0; index < applyData.addGameObjects.length; index++) {
                                var obj = applyData.addGameObjects[index];
                                var originalObj = this.getGameObjectByUUid(applyGameObject, obj.id);
                                if (originalObj) {
                                    this.clearLinkedId(originalObj);
                                }
                            }
                            this.dispatchEditorModelEvent(editor.EditorModelEvent.UPDATE_GAMEOBJECTS_HIREARCHY);
                        }
                        if (applyData.addComponents && applyData.addComponents.length > 0) {
                            for (var index = 0; index < applyData.addComponents.length; index++) {
                                var element = applyData.addComponents[index];
                                var id = element.id, gameObjId = element.gameObjId;
                                var originalObj = this.getGameObjectByUUid(applyGameObject, gameObjId);
                                if (originalObj) {
                                    var originalComponent = editor.Editor.activeEditorModel.getComponentById(originalObj, id);
                                    if (originalComponent) {
                                        originalComponent.extras = {};
                                    }
                                }
                            }
                            this.dispatchEditorModelEvent(editor.EditorModelEvent.UPDATE_GAMEOBJECTS_HIREARCHY);
                        }
                        if (applyData.modifyGameObjectPropertyList && applyData.modifyGameObjectPropertyList.length > 0) {
                            for (var _i = 0, _a = applyData.modifyGameObjectPropertyList; _i < _a.length; _i++) {
                                var obj = _a[_i];
                                this.modifyPrefabGameObjectPropertyValues(linkedId, tempPrefabObject, obj.preValueCopylist);
                            }
                        }
                        if (applyData.modifyComponentPropertyList && applyData.modifyComponentPropertyList.length > 0) {
                            for (var _b = 0, _c = applyData.modifyComponentPropertyList; _b < _c.length; _b++) {
                                var obj = _c[_b];
                                this.modifyPrefabComponentPropertyValues(linkedId, obj.componentId, tempPrefabObject, obj.preValueCopylist);
                            }
                        }
                    }
                    //reset prefab serrializedata,save prefab
                    // (this.stateData.prefab as any)._raw = this.stateData.cachePrefabSerializedData;
                    var prefabJson = this.stateData.cachePrefabSerializedData;
                    this.stateData.prefab._raw = prefabJson;
                    this.dispatchEditorModelEvent(editor.EditorModelEvent.SAVE_ASSET, { name: this.stateData.prefab.name, raw: prefabJson });
                    tempPrefabObject.destroy();
                    tempPrefabObject = null;
                    return true;
                }
                return false;
            };
            ApplyPrefabInstanceState.prototype.getAllUUidFromGameObject = function (gameObj, uuids) {
                if (uuids === void 0) { uuids = null; }
                if (gameObj) {
                    uuids = uuids || [];
                    uuids.push(gameObj.uuid);
                    for (var _i = 0, _a = gameObj.components; _i < _a.length; _i++) {
                        var com = _a[_i];
                        uuids.push(com.uuid);
                    }
                    for (var index = 0; index < gameObj.transform.children.length; index++) {
                        var element = gameObj.transform.children[index];
                        var obj = element.gameObject;
                        this.getAllUUidFromGameObject(obj, uuids);
                    }
                }
                return uuids;
            };
            ApplyPrefabInstanceState.prototype.setLinkedId = function (gameObj, ids) {
                if (gameObj) {
                    var linkedId = ids.shift();
                    if (linkedId === undefined) {
                        console.error("linkedId error");
                    }
                    gameObj.extras.linkedID = linkedId;
                    for (var _i = 0, _a = gameObj.components; _i < _a.length; _i++) {
                        var com = _a[_i];
                        linkedId = ids.shift();
                        if (linkedId === undefined) {
                            console.error("linkedId error");
                        }
                        com.extras.linkedID = linkedId;
                    }
                    for (var index = 0; index < gameObj.transform.children.length; index++) {
                        var element = gameObj.transform.children[index];
                        var obj = element.gameObject;
                        if (obj.hideFlags === 3 /* HideAndDontSave */) {
                            continue;
                        }
                        this.setLinkedId(obj, ids);
                    }
                }
            };
            ApplyPrefabInstanceState.prototype.clearLinkedId = function (gameObj) {
                if (gameObj) {
                    gameObj.extras = {};
                    for (var index = 0; index < gameObj.components.length; index++) {
                        var element = gameObj.components[index];
                        element.extras = {};
                    }
                    for (var index = 0; index < gameObj.transform.children.length; index++) {
                        var element = gameObj.transform.children[index];
                        var obj = element.gameObject;
                        this.clearLinkedId(obj);
                    }
                }
            };
            ApplyPrefabInstanceState.prototype.dispathPropertyEvent = function (modifyObj, propName, newValue) {
                this.dispatchEditorModelEvent(editor.EditorModelEvent.CHANGE_PROPERTY, { target: modifyObj, propName: propName, propValue: newValue });
            };
            ApplyPrefabInstanceState.prototype.modifyPrefabGameObjectPropertyValues = function (linkedId, tempObj, valueList) {
                var _this = this;
                var prefabObj = this.getGameObjectByLinkedId(tempObj, linkedId);
                var objects = this.getGameObjectsByLinkedId(linkedId, this.stateData.applyPrefabRootId);
                valueList.forEach(function (propertyValue) {
                    var propName = propertyValue.propName, copyValue = propertyValue.copyValue, valueEditType = propertyValue.valueEditType;
                    var newValue = _this.editorModel.deserializeProperty(copyValue, valueEditType);
                    objects.forEach(function (object) {
                        if (paper.equal(object[propName], prefabObj[propName])) {
                            _this.editorModel.setTargetProperty(propName, object, newValue, valueEditType);
                            _this.dispathPropertyEvent(object, propName, newValue);
                        }
                    });
                    _this.editorModel.setTargetProperty(propName, prefabObj, newValue, valueEditType);
                });
                this.dispatchEditorModelEvent(editor.EditorModelEvent.UPDATE_GAMEOBJECTS_HIREARCHY);
            };
            ApplyPrefabInstanceState.prototype.modifyPrefabComponentPropertyValues = function (linkedId, componentUUid, tempObj, valueList) {
                var _this = this;
                var prefabObj = this.getGameObjectByLinkedId(tempObj, linkedId);
                var objects = this.getGameObjectsByLinkedId(linkedId, this.stateData.applyPrefabRootId);
                var _loop_1 = function (k) {
                    var prefabComp = prefabObj.components[k];
                    if (prefabComp.uuid === componentUUid) {
                        valueList.forEach(function (propertyValue) {
                            var propName = propertyValue.propName, copyValue = propertyValue.copyValue, valueEditType = propertyValue.valueEditType;
                            var newValue = _this.editorModel.deserializeProperty(copyValue, valueEditType);
                            objects.forEach(function (object) {
                                var objectComp = _this.editorModel.getComponentByAssetId(object, prefabComp.extras.linkedID);
                                if (objectComp !== null) {
                                    if (paper.equal(objectComp[propName], prefabComp[propName])) {
                                        _this.editorModel.setTargetProperty(propName, objectComp, newValue, valueEditType);
                                        _this.dispathPropertyEvent(objectComp, propName, newValue);
                                    }
                                }
                            });
                            _this.editorModel.setTargetProperty(propName, prefabComp, newValue, valueEditType);
                        });
                    }
                };
                for (var k = 0; k < prefabObj.components.length; k++) {
                    _loop_1(k);
                }
            };
            ApplyPrefabInstanceState.prototype.setGameObjectPrefabRootId = function (gameObj, rootID) {
                if (gameObj.extras.prefab === undefined) {
                    gameObj.extras.rootID = rootID;
                }
                for (var index = 0; index < gameObj.transform.children.length; index++) {
                    var element = gameObj.transform.children[index];
                    var obj = element.gameObject;
                    this.setGameObjectPrefabRootId(obj, rootID);
                }
            };
            ApplyPrefabInstanceState.prototype.getGameObjectsByLinkedId = function (linkedId, filterApplyRootId) {
                var objects = this.editorModel.scene.gameObjects;
                var result = [];
                for (var _i = 0, objects_1 = objects; _i < objects_1.length; _i++) {
                    var obj = objects_1[_i];
                    if ((obj.extras && obj.extras.linkedID && obj.extras.linkedID === linkedId) && (obj.extras.prefab || (obj.extras.rootID && obj.extras.rootID !== filterApplyRootId)) && obj.uuid !== filterApplyRootId) {
                        result.push(obj);
                    }
                }
                return result;
            };
            ApplyPrefabInstanceState.prototype.getGameObjectByLinkedId = function (gameObj, linkedID) {
                if (!gameObj) {
                    return null;
                }
                var result;
                if (gameObj.extras.linkedID === linkedID) {
                    result = gameObj;
                    return gameObj;
                }
                for (var index = 0; index < gameObj.transform.children.length; index++) {
                    var element = gameObj.transform.children[index];
                    var obj = element.gameObject;
                    result = this.getGameObjectByLinkedId(obj, linkedID);
                    if (result) {
                        break;
                    }
                }
                return result;
            };
            ApplyPrefabInstanceState.prototype.getGameObjectByUUid = function (gameObj, uuid) {
                if (!gameObj) {
                    return null;
                }
                var result;
                if (gameObj.uuid === uuid) {
                    result = gameObj;
                    return gameObj;
                }
                for (var index = 0; index < gameObj.transform.children.length; index++) {
                    var element = gameObj.transform.children[index];
                    var obj = element.gameObject;
                    result = this.getGameObjectByUUid(obj, uuid);
                    if (result) {
                        break;
                    }
                }
                return result;
            };
            ApplyPrefabInstanceState.prototype.redo = function () {
                if (_super.prototype.redo.call(this)) {
                    var tempPrefabObject = this.stateData.prefab.createInstance(paper.Application.sceneManager.globalScene, true);
                    var tempGameObjects = editor.Editor.activeEditorModel.getAllGameObjectsFromPrefabInstance(tempPrefabObject);
                    var applyGameObject = editor.Editor.activeEditorModel.getGameObjectByUUid(this.stateData.applyPrefabRootId);
                    for (var _i = 0, _a = tempGameObjects; _i < _a.length; _i++) {
                        var gameObj = _a[_i];
                        if (!(this.stateData.applyData[gameObj.extras.linkedID])) {
                            continue;
                        }
                        var applyData = this.stateData.applyData[gameObj.extras.linkedID];
                        if (applyData.addGameObjects && applyData.addGameObjects.length > 0) {
                            for (var index = 0; index < applyData.addGameObjects.length; index++) {
                                var obj = applyData.addGameObjects[index];
                                var ids = [];
                                var newObj = void 0;
                                if (this.firstRedo) {
                                    newObj = new paper.Deserializer().deserialize(obj.serializeData, false, false, paper.Application.sceneManager.globalScene);
                                    newObj.parent = gameObj;
                                    ids = this.getAllUUidFromGameObject(newObj);
                                    obj.cacheSerializeData = Object.create(null);
                                    obj.cacheSerializeData[gameObj.uuid] = [];
                                    obj.cacheSerializeData[gameObj.uuid][index] = paper.serialize(newObj);
                                }
                                else {
                                    var cacheData = obj.cacheSerializeData[gameObj.uuid][index];
                                    newObj = new paper.Deserializer().deserialize(cacheData, true, false, paper.Application.sceneManager.globalScene);
                                    newObj.parent = gameObj;
                                    ids = this.getAllUUidFromGameObject(newObj);
                                }
                                var linkedId = gameObj.extras.linkedID;
                                var instanceGameObjects = this.getGameObjectsByLinkedId(linkedId, this.stateData.applyPrefabRootId);
                                for (var _b = 0, instanceGameObjects_1 = instanceGameObjects; _b < instanceGameObjects_1.length; _b++) {
                                    var instanceGameObject = instanceGameObjects_1[_b];
                                    var addObj = void 0;
                                    if (this.firstRedo) {
                                        addObj = new paper.Deserializer().deserialize(obj.serializeData, false, false, this.editorModel.scene);
                                        addObj.parent = instanceGameObject;
                                        var rootId = instanceGameObject.extras.prefab ? instanceGameObject.uuid : instanceGameObject.extras.rootID;
                                        this.setGameObjectPrefabRootId(addObj, rootId);
                                        this.setLinkedId(addObj, ids.concat());
                                        obj.cacheSerializeData[instanceGameObject.uuid] = [];
                                        obj.cacheSerializeData[instanceGameObject.uuid][index] = this.clearExtrasFromSerilizeData(paper.serialize(addObj));
                                    }
                                    else {
                                        var cacheData = obj.cacheSerializeData[instanceGameObject.uuid][index];
                                        addObj = new paper.Deserializer().deserialize(cacheData, true, false, this.editorModel.scene);
                                        addObj.parent = instanceGameObject;
                                        var rootId = instanceGameObject.extras.prefab ? instanceGameObject.uuid : instanceGameObject.extras.rootID;
                                        this.setGameObjectPrefabRootId(addObj, rootId);
                                        this.setLinkedId(addObj, ids.concat());
                                    }
                                    if (addObj) {
                                        this.stateData.cacheGameObjetsIds.push(addObj.uuid);
                                    }
                                }
                                var originalGameObj = this.getGameObjectByUUid(applyGameObject, obj.id);
                                if (originalGameObj) {
                                    this.setGameObjectPrefabRootId(originalGameObj, this.stateData.applyPrefabRootId);
                                    this.setLinkedId(originalGameObj, ids.concat());
                                }
                            }
                            this.dispatchEditorModelEvent(editor.EditorModelEvent.ADD_GAMEOBJECTS);
                        }
                        if (applyData.addComponents && applyData.addComponents.length > 0) {
                            for (var _c = 0, _d = applyData.addComponents; _c < _d.length; _c++) {
                                var obj = _d[_c];
                                var newComponent = void 0;
                                if (this.firstRedo) {
                                    newComponent = new paper.Deserializer().deserialize(obj.serializeData, false, false, gameObj);
                                    obj.cacheSerializeData = Object.create(null);
                                    obj.cacheSerializeData[gameObj.uuid] = paper.serialize(newComponent);
                                }
                                else {
                                    var cacheData = obj.cacheSerializeData[gameObj.uuid];
                                    newComponent = new paper.Deserializer().deserialize(cacheData, true, false, gameObj);
                                }
                                var linkedId = gameObj.extras.linkedID;
                                var instanceGameObjects = this.getGameObjectsByLinkedId(linkedId, this.stateData.applyPrefabRootId);
                                for (var _e = 0, instanceGameObjects_2 = instanceGameObjects; _e < instanceGameObjects_2.length; _e++) {
                                    var instanceGameObject = instanceGameObjects_2[_e];
                                    var addComponent = void 0;
                                    if (this.firstRedo) {
                                        addComponent = new paper.Deserializer().deserialize(obj.serializeData, false, false, instanceGameObject);
                                        addComponent.extras.linkedID = newComponent.uuid;
                                        obj.cacheSerializeData[instanceGameObject.uuid] = this.clearExtrasFromSerilizeData(paper.serialize(addComponent));
                                    }
                                    else {
                                        var cacheData = obj.cacheSerializeData[instanceGameObject.uuid];
                                        addComponent = new paper.Deserializer().deserialize(cacheData, true, false, instanceGameObject);
                                        addComponent.extras.linkedID = newComponent.uuid;
                                    }
                                    this.stateData.cacheComponentsIds[instanceGameObject.uuid] = this.stateData.cacheComponentsIds[instanceGameObject.uuid] || [];
                                    if (addComponent) {
                                        this.stateData.cacheComponentsIds[instanceGameObject.uuid].push(addComponent.uuid);
                                    }
                                }
                                var originalGameObj = this.getGameObjectByUUid(applyGameObject, obj.gameObjId);
                                if (originalGameObj) {
                                    var originalComponent = editor.Editor.activeEditorModel.getComponentById(originalGameObj, obj.id);
                                    originalComponent.extras.linkedID = newComponent.uuid;
                                }
                            }
                            this.dispatchEditorModelEvent(editor.EditorModelEvent.ADD_COMPONENT);
                        }
                        if (applyData.modifyGameObjectPropertyList && applyData.modifyGameObjectPropertyList.length > 0) {
                            for (var _f = 0, _g = applyData.modifyGameObjectPropertyList; _f < _g.length; _f++) {
                                var obj = _g[_f];
                                this.modifyPrefabGameObjectPropertyValues(gameObj.extras.linkedID, tempPrefabObject, obj.newValueList);
                            }
                        }
                        if (applyData.modifyComponentPropertyList && applyData.modifyComponentPropertyList.length > 0) {
                            for (var _h = 0, _j = applyData.modifyComponentPropertyList; _h < _j.length; _h++) {
                                var obj = _j[_h];
                                this.modifyPrefabComponentPropertyValues(gameObj.extras.linkedID, obj.componentId, tempPrefabObject, obj.newValueList);
                            }
                        }
                    }
                    this.clearGameObjectExtrasInfo(tempPrefabObject);
                    // (this.stateData.prefab as any)._raw = this.clearExtrasFromSerilizeData(paper.serialize(tempPrefabObject));
                    var prefabJson = this.clearExtrasFromSerilizeData(paper.serialize(tempPrefabObject));
                    this.stateData.prefab._raw = prefabJson;
                    this.dispatchEditorModelEvent(editor.EditorModelEvent.SAVE_ASSET, { name: this.stateData.prefab.name, raw: prefabJson });
                    tempPrefabObject.destroy();
                    this.firstRedo = false;
                    return true;
                }
                return false;
            };
            ApplyPrefabInstanceState.prototype.clearGameObjectExtrasInfo = function (gameObj) {
                if (gameObj) {
                    delete gameObj.extras;
                    for (var _i = 0, _a = gameObj.components; _i < _a.length; _i++) {
                        var comp = _a[_i];
                        delete comp.extras;
                    }
                    for (var index = 0; index < gameObj.transform.children.length; index++) {
                        var element = gameObj.transform.children[index];
                        var obj = element.gameObject;
                        this.clearGameObjectExtrasInfo(obj);
                    }
                }
            };
            ApplyPrefabInstanceState.prototype.clearExtrasFromSerilizeData = function (data) {
                var objects = data.objects;
                var components = data.components;
                for (var _i = 0, _a = objects; _i < _a.length; _i++) {
                    var obj = _a[_i];
                    delete obj["extras"];
                }
                for (var _b = 0, _c = components; _b < _c.length; _b++) {
                    var comp = _c[_b];
                    delete comp["extras"];
                }
                return data;
            };
            return ApplyPrefabInstanceState;
        }(editor.BaseState));
        editor.ApplyPrefabInstanceState = ApplyPrefabInstanceState;
        __reflect(ApplyPrefabInstanceState.prototype, "paper.editor.ApplyPrefabInstanceState");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        /**
         * 预置体结构状态
         * @author 杨宁
         */
        var BreakPrefabStructState = (function (_super) {
            __extends(BreakPrefabStructState, _super);
            function BreakPrefabStructState() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.prefabInfos = [];
                return _this;
            }
            BreakPrefabStructState.create = function (prefabInstanceList) {
                var _this = this;
                var instance = new BreakPrefabStructState();
                instance.prefabInfos = [];
                prefabInstanceList.forEach(function (obj) {
                    for (var _i = 0, _a = instance.prefabInfos; _i < _a.length; _i++) {
                        var info = _a[_i];
                        if (info.uuid === obj.uuid)
                            return;
                    }
                    instance.prefabInfos = instance.prefabInfos.concat(_this.makePrefabInfo(obj));
                });
                return instance;
            };
            BreakPrefabStructState.makePrefabInfo = function (gameOjbect) {
                var isPrefabRoot = function (gameObj) {
                    if (gameObj.extras && gameObj.extras.prefab) {
                        return true;
                    }
                    return false;
                };
                var isPrefabChild = function (gameObj) {
                    if (gameObj.extras && gameObj.extras.rootID) {
                        return true;
                    }
                    return false;
                };
                var makeInfo = function (target, result) {
                    if (result === void 0) { result = []; }
                    result.push({
                        uuid: target.uuid,
                        linkid: target.extras.linkedID,
                        rootid: target.extras.rootID,
                        prefab: target.extras.prefab ? target.extras.prefab.name : undefined,
                        components: (function () {
                            var list = [];
                            for (var _i = 0, _a = target.components; _i < _a.length; _i++) {
                                var comp = _a[_i];
                                if (comp.extras && comp.extras.linkedID) {
                                    list.push({ uuid: comp.uuid, linkid: comp.extras.linkedID });
                                }
                            }
                            return list;
                        })()
                    });
                    target.transform.children.forEach(function (transform) {
                        var obj = transform.gameObject;
                        if (isPrefabChild(obj) && !isPrefabRoot(obj)) {
                            makeInfo(obj, result);
                        }
                    });
                };
                var target = gameOjbect;
                var infos = [];
                while (target) {
                    if (isPrefabRoot(target)) {
                        makeInfo(target, infos);
                        break;
                    }
                    if (target.transform.parent)
                        target = target.transform.parent.gameObject;
                    else
                        break;
                }
                return infos;
            };
            BreakPrefabStructState.prototype.redo = function () {
                var _this = this;
                var ids = this.prefabInfos.map(function (prefabInfos) { return prefabInfos.uuid; });
                var objs = this.editorModel.getGameObjectsByUUids(ids);
                objs.forEach(function (obj) {
                    obj.extras.linkedID = undefined;
                    obj.extras.prefab = undefined;
                    obj.extras.rootID = undefined;
                    for (var _i = 0, _a = obj.components; _i < _a.length; _i++) {
                        var comp = _a[_i];
                        if (comp.extras && comp.extras.linkedID) {
                            comp.extras.linkedID = undefined;
                        }
                    }
                    _this.dispatchEditorModelEvent(editor.EditorModelEvent.CHANGE_PROPERTY, { target: obj, propName: 'prefab', propValue: null });
                });
                return true;
            };
            BreakPrefabStructState.prototype.undo = function () {
                var all = this.editorModel.scene.gameObjects;
                for (var i = 0; i < all.length; i++) {
                    var obj = all[i];
                    b: for (var k = 0; k < this.prefabInfos.length; k++) {
                        var info = this.prefabInfos[k];
                        if (obj.uuid === info.uuid) {
                            obj.extras.linkedID = info.linkid;
                            obj.extras.prefab = info.prefab ? paper.Asset.find(info.prefab) : undefined;
                            obj.extras.rootID = info.rootid;
                            for (var _i = 0, _a = obj.components; _i < _a.length; _i++) {
                                var comp = _a[_i];
                                c: for (var _b = 0, _c = info.components; _b < _c.length; _b++) {
                                    var compInfo = _c[_b];
                                    if (comp.uuid === compInfo.uuid) {
                                        comp.extras.linkedID = compInfo.linkid;
                                        break c;
                                    }
                                }
                            }
                            this.dispatchEditorModelEvent(editor.EditorModelEvent.CHANGE_PROPERTY, { target: obj, propName: 'prefab', propValue: obj.extras.prefab });
                            break b;
                        }
                    }
                }
                return true;
            };
            BreakPrefabStructState.prototype.serialize = function () {
                return this.prefabInfos;
            };
            BreakPrefabStructState.prototype.deserialize = function (data) {
                this.prefabInfos = data;
            };
            return BreakPrefabStructState;
        }(editor.BaseState));
        editor.BreakPrefabStructState = BreakPrefabStructState;
        __reflect(BreakPrefabStructState.prototype, "paper.editor.BreakPrefabStructState");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        //创建游戏对象
        var CreateGameObjectState = (function (_super) {
            __extends(CreateGameObjectState, _super);
            function CreateGameObjectState() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.isFirst = true;
                return _this;
            }
            CreateGameObjectState.toString = function () {
                return "[class common.AddGameObjectState]";
            };
            CreateGameObjectState.create = function (parentList, createType, mesh) {
                var infos = parentList.map(function (obj) { return { parentUUID: obj.uuid, serializeData: null }; });
                var state = new CreateGameObjectState();
                state.infos = infos;
                state.createType = createType;
                state.mesh = mesh;
                return state;
            };
            CreateGameObjectState.prototype.undo = function () {
                if (_super.prototype.undo.call(this)) {
                    var objs = this.editorModel.getGameObjectsByUUids(this.addList);
                    for (var index = 0; index < objs.length; index++) {
                        var element = objs[index];
                        element.destroy();
                    }
                    this.dispatchEditorModelEvent(editor.EditorModelEvent.DELETE_GAMEOBJECTS, this.addList);
                    return true;
                }
                return false;
            };
            CreateGameObjectState.prototype.redo = function () {
                if (_super.prototype.redo.call(this)) {
                    this.addList = [];
                    //一条信息都没有则添加到场景根
                    if (this.infos.length === 0) {
                        this.infos.push({ parentUUID: null, serializeData: null });
                    }
                    for (var i = 0; i < this.infos.length; i++) {
                        var obj = void 0;
                        if (this.isFirst) {
                            obj = this.createGameObjectByType(this.createType);
                            this.infos[i].serializeData = paper.serialize(obj);
                        }
                        else {
                            obj = new paper.Deserializer().deserialize(this.infos[i].serializeData, true, false, this.editorModel.scene);
                        }
                        var parent_1 = this.editorModel.getGameObjectByUUid(this.infos[i].parentUUID);
                        if (parent_1)
                            obj.transform.parent = parent_1.transform;
                        this.addList.push(obj.uuid);
                    }
                    this.dispatchEditorModelEvent(editor.EditorModelEvent.ADD_GAMEOBJECTS, this.addList);
                    this.isFirst = false;
                    return true;
                }
                return false;
            };
            CreateGameObjectState.prototype.createGameObjectByType = function (createType) {
                var obj = new paper.GameObject();
                var meshFilter;
                obj.name = createType.toLowerCase();
                if (this.mesh) {
                    meshFilter = obj.addComponent(egret3d.MeshFilter);
                    meshFilter.mesh = this.mesh;
                    obj.addComponent(egret3d.MeshRenderer);
                }
                return obj;
            };
            return CreateGameObjectState;
        }(editor.BaseState));
        editor.CreateGameObjectState = CreateGameObjectState;
        __reflect(CreateGameObjectState.prototype, "paper.editor.CreateGameObjectState");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        var CreatePrefabState = (function (_super) {
            __extends(CreatePrefabState, _super);
            function CreatePrefabState() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            CreatePrefabState.toString = function () {
                return "[class common.CreatePrefabState]";
            };
            CreatePrefabState.create = function (prefab, parent) {
                var state = new CreatePrefabState();
                var parentUUID = parent ? parent.uuid : undefined;
                var data = {
                    prefab: prefab,
                    parentUUID: parentUUID
                };
                state.data = data;
                return state;
            };
            Object.defineProperty(CreatePrefabState.prototype, "stateData", {
                get: function () {
                    return this.data;
                },
                enumerable: true,
                configurable: true
            });
            CreatePrefabState.prototype.undo = function () {
                if (_super.prototype.undo.call(this)) {
                    var deleteUUid = this.stateData.cachePrefabUUid;
                    if (deleteUUid) {
                        var gameObj = this.editorModel.getGameObjectByUUid(deleteUUid);
                        if (gameObj) {
                            gameObj.destroy();
                            this.dispatchEditorModelEvent(editor.EditorModelEvent.DELETE_GAMEOBJECTS, [deleteUUid]);
                        }
                    }
                    return true;
                }
                return false;
            };
            CreatePrefabState.prototype.redo = function () {
                if (_super.prototype.redo.call(this)) {
                    var prefab = this.stateData.prefab;
                    if (prefab) {
                        var instance = this.stateData.prefab.createInstance(this.editorModel.scene);
                        this.stateData.cachePrefabUUid = instance.uuid;
                        var parent_2 = this.editorModel.getGameObjectByUUid(this.stateData.parentUUID);
                        if (parent_2) {
                            instance.transform.parent = parent_2.transform;
                        }
                        this.dispatchEditorModelEvent(editor.EditorModelEvent.ADD_GAMEOBJECTS);
                    }
                    return true;
                }
                return false;
            };
            return CreatePrefabState;
        }(editor.BaseState));
        editor.CreatePrefabState = CreatePrefabState;
        __reflect(CreatePrefabState.prototype, "paper.editor.CreatePrefabState");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        //删除游戏对象
        var DeleteGameObjectsState = (function (_super) {
            __extends(DeleteGameObjectsState, _super);
            function DeleteGameObjectsState() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            DeleteGameObjectsState.toString = function () {
                return "[class common.deleteGameObjectsState]";
            };
            DeleteGameObjectsState.create = function (gameObjects, editorModel) {
                gameObjects = gameObjects.concat();
                //筛选
                editorModel.filtTopHierarchyGameObjects(gameObjects);
                //排序
                gameObjects = editorModel.sortGameObjectsForHierarchy(gameObjects);
                var infos = [];
                for (var i = 0; i < gameObjects.length; i++) {
                    var obj = gameObjects[i];
                    var oldParentUUID = void 0;
                    var oldIndex = void 0;
                    var serializeData = paper.serialize(obj);
                    if (obj.transform.parent) {
                        oldParentUUID = obj.transform.parent.gameObject.uuid;
                        oldIndex = obj.transform.parent.children.indexOf(obj.transform);
                    }
                    else {
                        oldParentUUID = undefined;
                        oldIndex = editorModel.scene.gameObjects.indexOf(obj);
                    }
                    infos.push({ UUID: obj.uuid, oldParentUUID: oldParentUUID, oldIndex: oldIndex, serializeData: serializeData });
                }
                var state = new DeleteGameObjectsState();
                state.deleteInfo = infos;
                return state;
            };
            DeleteGameObjectsState.prototype.undo = function () {
                if (_super.prototype.undo.call(this)) {
                    for (var i = 0; i < this.deleteInfo.length; i++) {
                        var info = this.deleteInfo[i];
                        var obj = new paper.Deserializer().deserialize(info.serializeData, true, false, this.editorModel.scene);
                        var oldParentObj = this.editorModel.getGameObjectByUUid(info.oldParentUUID);
                        if (oldParentObj) {
                            var oldTargetTransform = oldParentObj.transform.children[info.oldIndex];
                            if (oldTargetTransform) {
                                this.editorModel.setGameObjectsHierarchy([obj], oldTargetTransform.gameObject, 'top');
                            }
                            else {
                                this.editorModel.setGameObjectsHierarchy([obj], oldParentObj, 'inner');
                            }
                        }
                        else {
                            obj.transform.parent = null;
                            var all = this.editorModel.scene.gameObjects;
                            var currentIndex = all.indexOf(obj);
                            all.splice(currentIndex, 1);
                            all.splice(info.oldIndex, 0, obj);
                        }
                    }
                    this.dispatchEditorModelEvent(editor.EditorModelEvent.ADD_GAMEOBJECTS, this.deleteInfo.map(function (info) { return info.UUID; }));
                    return true;
                }
                return false;
            };
            DeleteGameObjectsState.prototype.redo = function () {
                if (_super.prototype.redo.call(this)) {
                    var ids = this.deleteInfo.map(function (info) { return info.UUID; });
                    var objs = this.editorModel.getGameObjectsByUUids(ids);
                    for (var index = 0; index < objs.length; index++) {
                        var element = objs[index];
                        element.destroy();
                    }
                    this.dispatchEditorModelEvent(editor.EditorModelEvent.DELETE_GAMEOBJECTS, ids);
                    return true;
                }
                return false;
            };
            DeleteGameObjectsState.prototype.serialize = function () {
                return this.deleteInfo;
            };
            DeleteGameObjectsState.prototype.deserialize = function (data) {
                this.deleteInfo = data;
            };
            return DeleteGameObjectsState;
        }(editor.BaseState));
        editor.DeleteGameObjectsState = DeleteGameObjectsState;
        __reflect(DeleteGameObjectsState.prototype, "paper.editor.DeleteGameObjectsState");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        //克隆游戏对象
        var DuplicateGameObjectsState = (function (_super) {
            __extends(DuplicateGameObjectsState, _super);
            function DuplicateGameObjectsState() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.firstDo = true;
                return _this;
            }
            DuplicateGameObjectsState.toString = function () {
                return "[class common.DuplicateGameObjectsState]";
            };
            DuplicateGameObjectsState.create = function (objs, editorModel) {
                //过滤
                editorModel.filtTopHierarchyGameObjects(objs);
                //排序
                objs = editorModel.sortGameObjectsForHierarchy(objs);
                var duplicateInfo = [];
                for (var i = 0; i < objs.length; i++) {
                    var obj = objs[i];
                    var UUID = obj.uuid;
                    var parentUUID = obj.transform.parent ? obj.transform.parent.gameObject.uuid : null;
                    var serializeData = paper.serialize(obj);
                    duplicateInfo.push({ UUID: UUID, parentUUID: parentUUID, serializeData: serializeData });
                }
                var state = new DuplicateGameObjectsState();
                state.duplicateInfo = duplicateInfo;
                return state;
            };
            DuplicateGameObjectsState.prototype.undo = function () {
                if (_super.prototype.undo.call(this)) {
                    var objs = this.editorModel.getGameObjectsByUUids(this.addList);
                    for (var index = 0; index < objs.length; index++) {
                        var element = objs[index];
                        element.destroy();
                    }
                    this.dispatchEditorModelEvent(editor.EditorModelEvent.DELETE_GAMEOBJECTS, this.addList);
                    return true;
                }
                return false;
            };
            DuplicateGameObjectsState.prototype.redo = function () {
                if (_super.prototype.redo.call(this)) {
                    this.addList = [];
                    for (var i = 0; i < this.duplicateInfo.length; i++) {
                        var info = this.duplicateInfo[i];
                        var obj = new paper.Deserializer().deserialize(info.serializeData, !this.firstDo, false, this.editorModel.scene);
                        var parent_3 = this.editorModel.getGameObjectByUUid(info.parentUUID);
                        if (parent_3) {
                            obj.transform.parent = parent_3.transform;
                        }
                        //清理预置体信息
                        this.clearPrefabInfo(obj);
                        this.addList.push(obj.uuid);
                        if (this.firstDo) {
                            info.serializeData = paper.serialize(obj);
                        }
                    }
                    this.dispatchEditorModelEvent(editor.EditorModelEvent.ADD_GAMEOBJECTS, this.addList);
                    this.firstDo = false;
                    return true;
                }
                return false;
            };
            DuplicateGameObjectsState.prototype.clearPrefabInfo = function (obj) {
                if (this.editorModel.isPrefabChild(obj)) {
                    obj.extras.linkedID = undefined;
                    obj.extras.prefab = undefined;
                    obj.extras.rootID = undefined;
                    for (var i = 0; i < obj.transform.children.length; i++) {
                        this.clearPrefabInfo(obj.transform.children[i].gameObject);
                    }
                }
            };
            DuplicateGameObjectsState.prototype.serialize = function () {
                return { duplicateInfo: this.duplicateInfo, addList: this.addList };
            };
            DuplicateGameObjectsState.prototype.deserialize = function (data) {
                this.duplicateInfo = data.duplicateInfo;
                this.addList = data.addList;
            };
            return DuplicateGameObjectsState;
        }(editor.BaseState));
        editor.DuplicateGameObjectsState = DuplicateGameObjectsState;
        __reflect(DuplicateGameObjectsState.prototype, "paper.editor.DuplicateGameObjectsState");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        /**
         * 游戏对象层级
         * @author 杨宁
         */
        var GameObjectHierarchyState = (function (_super) {
            __extends(GameObjectHierarchyState, _super);
            function GameObjectHierarchyState() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.gameObjectsInfo = [];
                return _this;
            }
            GameObjectHierarchyState.create = function (gameObjects, targetGameObj, dir, editorModel) {
                //筛选
                gameObjects = gameObjects.concat();
                editorModel.filtTopHierarchyGameObjects(gameObjects);
                //必须进行层级排序
                var objs = editorModel.sortGameObjectsForHierarchy(gameObjects);
                //整理对象信息
                var objInfos = [];
                for (var i = 0; i < objs.length; i++) {
                    var obj = objs[i];
                    var oldTargetUUID = void 0;
                    var oldDir = void 0;
                    if (obj.transform.parent) {
                        var index = obj.transform.parent.children.indexOf(obj.transform);
                        if (++index < obj.transform.parent.children.length) {
                            oldTargetUUID = obj.transform.parent.children[index].gameObject.uuid;
                            oldDir = 'top';
                        }
                        else {
                            oldTargetUUID = obj.transform.parent.gameObject.uuid;
                            oldDir = 'inner';
                        }
                    }
                    else {
                        var all = editorModel.scene.gameObjects;
                        var index = all.indexOf(obj);
                        if (++index < all.length) {
                            oldTargetUUID = all[index].uuid;
                            oldDir = 'top';
                        }
                        else {
                            oldTargetUUID = 'scene'; //特殊标记，用来标记最外层最后一个
                            oldDir = 'inner';
                        }
                    }
                    objInfos.push({ UUID: obj.uuid, oldTargetUUID: oldTargetUUID, oldDir: oldDir });
                }
                var instance = new GameObjectHierarchyState();
                instance.gameObjectsInfo = objInfos;
                instance.targetDir = dir;
                instance.targetObject = targetGameObj.uuid;
                return instance;
            };
            GameObjectHierarchyState.prototype.undo = function () {
                if (_super.prototype.undo.call(this)) {
                    var tmpList = this.gameObjectsInfo.concat();
                    tmpList.reverse();
                    for (var index = 0; index < tmpList.length; index++) {
                        var info = tmpList[index];
                        var obj = this.editorModel.getGameObjectByUUid(info.UUID);
                        var oldTarget = this.editorModel.getGameObjectByUUid(info.oldTargetUUID);
                        var oldDir = info.oldDir;
                        if (info.oldTargetUUID === 'scene') {
                            var all = this.editorModel.scene.gameObjects;
                            oldTarget = all[all.length - 1];
                            oldDir = 'bottom';
                        }
                        this.editorModel.setGameObjectsHierarchy([obj], oldTarget, oldDir);
                    }
                    this.dispatchEditorModelEvent(editor.EditorModelEvent.UPDATE_GAMEOBJECTS_HIREARCHY);
                    return true;
                }
                return false;
            };
            GameObjectHierarchyState.prototype.redo = function () {
                if (_super.prototype.redo.call(this)) {
                    var gameObjectUUids = this.gameObjectsInfo.map(function (v) { return v.UUID; });
                    var gameObjs = this.editorModel.getGameObjectsByUUids(gameObjectUUids);
                    var targetGameObj = this.editorModel.getGameObjectByUUid(this.targetObject);
                    gameObjs = this.editorModel.sortGameObjectsForHierarchy(gameObjs);
                    this.editorModel.setGameObjectsHierarchy(gameObjs, targetGameObj, this.targetDir);
                    this.dispatchEditorModelEvent(editor.EditorModelEvent.UPDATE_GAMEOBJECTS_HIREARCHY);
                    return true;
                }
                return false;
            };
            return GameObjectHierarchyState;
        }(editor.BaseState));
        editor.GameObjectHierarchyState = GameObjectHierarchyState;
        __reflect(GameObjectHierarchyState.prototype, "paper.editor.GameObjectHierarchyState");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        //修改组件属性属性
        var ModifyComponentPropertyState = (function (_super) {
            __extends(ModifyComponentPropertyState, _super);
            function ModifyComponentPropertyState() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            ModifyComponentPropertyState.toString = function () {
                return "[class common.ModifyComponentPropertyState]";
            };
            ModifyComponentPropertyState.create = function (gameObjUUid, componentUUid, newValueList, preValueCopylist) {
                var state = new ModifyComponentPropertyState();
                var data = {
                    gameObjUUid: gameObjUUid,
                    componentUUid: componentUUid,
                    newValueList: newValueList,
                    preValueCopylist: preValueCopylist,
                };
                state.data = data;
                return state;
            };
            Object.defineProperty(ModifyComponentPropertyState.prototype, "stateData", {
                get: function () {
                    return this.data;
                },
                enumerable: true,
                configurable: true
            });
            ModifyComponentPropertyState.prototype.undo = function () {
                if (_super.prototype.undo.call(this)) {
                    this.modifyProperty(this.stateData.preValueCopylist);
                    return true;
                }
                return false;
            };
            ModifyComponentPropertyState.prototype.modifyProperty = function (valueList) {
                var _this = this;
                var gameObjectUUid = this.stateData.gameObjUUid;
                var componentUUid = this.stateData.componentUUid;
                var gameObj = this.editorModel.getGameObjectByUUid(gameObjectUUid);
                var modifyObj;
                if (gameObj) {
                    modifyObj = this.editorModel.getComponentById(gameObj, componentUUid);
                    if (modifyObj) {
                        valueList.forEach(function (propertyValue) { return __awaiter(_this, void 0, void 0, function () {
                            var propName, copyValue, valueEditType, newValue;
                            return __generator(this, function (_a) {
                                propName = propertyValue.propName, copyValue = propertyValue.copyValue, valueEditType = propertyValue.valueEditType;
                                newValue = this.editorModel.deserializeProperty(copyValue, valueEditType);
                                this.editorModel.setTargetProperty(propName, modifyObj, newValue, valueEditType);
                                this.dispatchEditorModelEvent(editor.EditorModelEvent.CHANGE_PROPERTY, { target: modifyObj, propName: propName, propValue: newValue });
                                return [2 /*return*/];
                            });
                        }); });
                    }
                }
            };
            ModifyComponentPropertyState.prototype.redo = function () {
                if (_super.prototype.redo.call(this)) {
                    this.modifyProperty(this.stateData.newValueList);
                    return true;
                }
                return false;
            };
            return ModifyComponentPropertyState;
        }(editor.BaseState));
        editor.ModifyComponentPropertyState = ModifyComponentPropertyState;
        __reflect(ModifyComponentPropertyState.prototype, "paper.editor.ModifyComponentPropertyState");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        var ModifyGameObjectPropertyState = (function (_super) {
            __extends(ModifyGameObjectPropertyState, _super);
            function ModifyGameObjectPropertyState() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            ModifyGameObjectPropertyState.create = function (gameObjectUUid, newValueList, preValueCopylist) {
                var state = new ModifyGameObjectPropertyState();
                var data = {
                    gameObjectUUid: gameObjectUUid,
                    newValueList: newValueList,
                    preValueCopylist: preValueCopylist,
                };
                state.data = data;
                return state;
            };
            Object.defineProperty(ModifyGameObjectPropertyState.prototype, "stateData", {
                get: function () {
                    return this.data;
                },
                enumerable: true,
                configurable: true
            });
            ModifyGameObjectPropertyState.prototype.undo = function () {
                if (_super.prototype.undo.call(this)) {
                    this.modifyProperty(this.stateData.preValueCopylist);
                    return true;
                }
                return false;
            };
            ModifyGameObjectPropertyState.prototype.modifyProperty = function (valueList) {
                var _this = this;
                var uuid = this.stateData.gameObjectUUid;
                var modifyObj = this.editorModel.getGameObjectByUUid(uuid);
                if (modifyObj !== null) {
                    valueList.forEach(function (propertyValue) { return __awaiter(_this, void 0, void 0, function () {
                        var propName, copyValue, valueEditType, newValue;
                        return __generator(this, function (_a) {
                            propName = propertyValue.propName, copyValue = propertyValue.copyValue, valueEditType = propertyValue.valueEditType;
                            newValue = this.editorModel.deserializeProperty(copyValue, valueEditType);
                            this.editorModel.setTargetProperty(propName, modifyObj, newValue, valueEditType);
                            this.dispatchEditorModelEvent(editor.EditorModelEvent.CHANGE_PROPERTY, { target: modifyObj, propName: propName, propValue: newValue });
                            return [2 /*return*/];
                        });
                    }); });
                }
            };
            ModifyGameObjectPropertyState.prototype.redo = function () {
                if (_super.prototype.redo.call(this)) {
                    this.modifyProperty(this.stateData.newValueList);
                    return true;
                }
                return false;
            };
            return ModifyGameObjectPropertyState;
        }(editor.BaseState));
        editor.ModifyGameObjectPropertyState = ModifyGameObjectPropertyState;
        __reflect(ModifyGameObjectPropertyState.prototype, "paper.editor.ModifyGameObjectPropertyState");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        //粘贴游戏对象
        var PasteGameObjectsState = (function (_super) {
            __extends(PasteGameObjectsState, _super);
            function PasteGameObjectsState() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            PasteGameObjectsState.toString = function () {
                return "[class common.PasteGameObjectsState]";
            };
            PasteGameObjectsState.create = function (serializeData, parent) {
                var state = new PasteGameObjectsState();
                var parentUUID = parent ? parent.uuid : null;
                state.pasteInfo = { parentUUID: parentUUID, serializeData: serializeData };
                return state;
            };
            PasteGameObjectsState.prototype.undo = function () {
                if (_super.prototype.undo.call(this)) {
                    var objs = this.editorModel.getGameObjectsByUUids(this.addList);
                    for (var index = 0; index < objs.length; index++) {
                        var element = objs[index];
                        element.destroy();
                    }
                    this.dispatchEditorModelEvent(editor.EditorModelEvent.DELETE_GAMEOBJECTS, this.addList);
                    return true;
                }
                return false;
            };
            PasteGameObjectsState.prototype.redo = function () {
                if (_super.prototype.redo.call(this)) {
                    this.addList = [];
                    var parent_4 = this.editorModel.getGameObjectByUUid(this.pasteInfo.parentUUID);
                    var serializeDataList = this.cacheSerializeData ? this.cacheSerializeData : this.pasteInfo.serializeData;
                    var keepUID = this.cacheSerializeData ? true : false;
                    for (var i = 0; i < serializeDataList.length; i++) {
                        var info = serializeDataList[i];
                        var obj = new paper.Deserializer().deserialize(info, keepUID, false, this.editorModel.scene);
                        if (obj && parent_4) {
                            obj.transform.parent = parent_4.transform;
                        }
                        //清理预置体信息
                        this.clearPrefabInfo(obj);
                        this.addList.push(obj.uuid);
                        if (serializeDataList === this.pasteInfo.serializeData) {
                            if (!this.cacheSerializeData)
                                this.cacheSerializeData = [];
                            this.cacheSerializeData.push(paper.serialize(obj));
                        }
                    }
                    this.dispatchEditorModelEvent(editor.EditorModelEvent.ADD_GAMEOBJECTS, this.addList);
                    return true;
                }
                return false;
            };
            PasteGameObjectsState.prototype.clearPrefabInfo = function (obj) {
                if (this.editorModel.isPrefabChild(obj)) {
                    obj.extras.linkedID = undefined;
                    obj.extras.prefab = undefined;
                    obj.extras.rootID = undefined;
                    for (var i = 0; i < obj.transform.children.length; i++) {
                        this.clearPrefabInfo(obj.transform.children[i].gameObject);
                    }
                }
            };
            PasteGameObjectsState.prototype.serialize = function () {
                return { pasteInfo: this.pasteInfo, addList: this.addList };
            };
            PasteGameObjectsState.prototype.deserialize = function (data) {
                this.addList = data.addList;
                this.pasteInfo = data.pasteInfo;
            };
            return PasteGameObjectsState;
        }(editor.BaseState));
        editor.PasteGameObjectsState = PasteGameObjectsState;
        __reflect(PasteGameObjectsState.prototype, "paper.editor.PasteGameObjectsState");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        //移除组件
        var RemoveComponentState = (function (_super) {
            __extends(RemoveComponentState, _super);
            function RemoveComponentState() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            RemoveComponentState.toString = function () {
                return "[class common.RemoveComponentState]";
            };
            RemoveComponentState.create = function (gameObjectUUid, componentUUid, cacheSerializeData) {
                var state = new RemoveComponentState();
                var data = {
                    gameObjectUUid: gameObjectUUid,
                    componentUUid: componentUUid,
                    cacheSerializeData: cacheSerializeData
                };
                state.data = data;
                return state;
            };
            Object.defineProperty(RemoveComponentState.prototype, "stateData", {
                get: function () {
                    return this.data;
                },
                enumerable: true,
                configurable: true
            });
            RemoveComponentState.prototype.undo = function () {
                if (_super.prototype.undo.call(this)) {
                    var gameObject = this.editorModel.getGameObjectByUUid(this.stateData.gameObjectUUid);
                    if (gameObject) {
                        new paper.Deserializer().deserialize(this.stateData.cacheSerializeData, true, false, gameObject);
                        this.dispatchEditorModelEvent(editor.EditorModelEvent.ADD_COMPONENT);
                    }
                    return true;
                }
                return false;
            };
            RemoveComponentState.prototype.redo = function () {
                if (_super.prototype.redo.call(this)) {
                    var gameObjectUUid = this.stateData.gameObjectUUid;
                    var componentUUid = this.stateData.componentUUid;
                    var obj = this.editorModel.getGameObjectByUUid(gameObjectUUid);
                    if (obj) {
                        var component = this.editorModel.getComponentById(obj, componentUUid);
                        if (component) {
                            obj.removeComponent(component);
                            this.dispatchEditorModelEvent(editor.EditorModelEvent.REMOVE_COMPONENT);
                        }
                    }
                    return true;
                }
                return false;
            };
            return RemoveComponentState;
        }(editor.BaseState));
        editor.RemoveComponentState = RemoveComponentState;
        __reflect(RemoveComponentState.prototype, "paper.editor.RemoveComponentState");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        var RevertPrefabInstanceState = (function (_super) {
            __extends(RevertPrefabInstanceState, _super);
            function RevertPrefabInstanceState() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            RevertPrefabInstanceState.toString = function () {
                return "[class common.RevertPrefabInstanceState]";
            };
            RevertPrefabInstanceState.create = function (revertData, revertPrefabRootId) {
                var state = new RevertPrefabInstanceState();
                var data = { revertData: revertData, revertPrefabRootId: revertPrefabRootId };
                state.data = data;
                return state;
            };
            Object.defineProperty(RevertPrefabInstanceState.prototype, "stateData", {
                get: function () {
                    return this.data;
                },
                enumerable: true,
                configurable: true
            });
            RevertPrefabInstanceState.prototype.undo = function () {
                if (_super.prototype.undo.call(this)) {
                    var revertRoot = editor.Editor.activeEditorModel.getGameObjectByUUid(this.stateData.revertPrefabRootId);
                    var gameObjects = editor.Editor.activeEditorModel.getAllGameObjectsFromPrefabInstance(revertRoot);
                    for (var _i = 0, gameObjects_2 = gameObjects; _i < gameObjects_2.length; _i++) {
                        var gameObj = gameObjects_2[_i];
                        if (!(this.stateData.revertData[gameObj.extras.linkedID])) {
                            continue;
                        }
                        var revertData = this.stateData.revertData[gameObj.extras.linkedID];
                        if (revertData.revertGameObjects && revertData.revertGameObjects.length > 0) {
                            for (var _a = 0, _b = revertData.revertGameObjects; _a < _b.length; _a++) {
                                var obj = _b[_a];
                                var serializeData = obj.serializeData;
                                var newObj = new paper.Deserializer().deserialize(serializeData, true, false, this.editorModel.scene);
                                newObj.parent = gameObj;
                            }
                            this.dispatchEditorModelEvent(editor.EditorModelEvent.ADD_GAMEOBJECTS);
                        }
                        if (revertData.revertComponents && revertData.revertComponents.length > 0) {
                            for (var _c = 0, _d = revertData.revertComponents; _c < _d.length; _c++) {
                                var com = _d[_c];
                                var serializeData = com.serializeData;
                                new paper.Deserializer().deserialize(serializeData, true, false, gameObj);
                            }
                            this.dispatchEditorModelEvent(editor.EditorModelEvent.ADD_COMPONENT);
                        }
                        if (revertData.modifyGameObjectPropertyList && revertData.modifyGameObjectPropertyList.length > 0) {
                            for (var _e = 0, _f = revertData.modifyGameObjectPropertyList; _e < _f.length; _e++) {
                                var obj = _f[_e];
                                var preValueCopylist = obj.newValueList;
                                this.modifyPrefabGameObjectPropertyValues(gameObj, preValueCopylist);
                            }
                        }
                        if (revertData.modifyComponentPropertyList && revertData.modifyComponentPropertyList.length > 0) {
                            for (var _g = 0, _h = revertData.modifyComponentPropertyList; _g < _h.length; _g++) {
                                var obj = _h[_g];
                                var componentId = obj.componentId, preValueCopylist = obj.preValueCopylist;
                                this.modifyPrefabComponentPropertyValues(gameObj, componentId, preValueCopylist);
                            }
                        }
                    }
                    return true;
                }
                return false;
            };
            RevertPrefabInstanceState.prototype.dispathPropertyEvent = function (modifyObj, propName, newValue) {
                this.dispatchEditorModelEvent(editor.EditorModelEvent.CHANGE_PROPERTY, { target: modifyObj, propName: propName, propValue: newValue });
            };
            RevertPrefabInstanceState.prototype.modifyPrefabGameObjectPropertyValues = function (gameObj, valueList) {
                var _this = this;
                valueList.forEach(function (propertyValue) { return __awaiter(_this, void 0, void 0, function () {
                    var propName, copyValue, valueEditType, newValue;
                    return __generator(this, function (_a) {
                        propName = propertyValue.propName, copyValue = propertyValue.copyValue, valueEditType = propertyValue.valueEditType;
                        newValue = this.editorModel.deserializeProperty(copyValue, valueEditType);
                        this.editorModel.setTargetProperty(propName, gameObj, newValue, valueEditType);
                        this.dispathPropertyEvent(gameObj, propName, newValue);
                        return [2 /*return*/];
                    });
                }); });
            };
            RevertPrefabInstanceState.prototype.modifyPrefabComponentPropertyValues = function (gameObj, componentUUid, valueList) {
                var _this = this;
                var _loop_2 = function (k) {
                    var prefabComp = gameObj.components[k];
                    if (prefabComp.uuid === componentUUid) {
                        valueList.forEach(function (propertyValue) { return __awaiter(_this, void 0, void 0, function () {
                            var propName, copyValue, valueEditType, newValue;
                            return __generator(this, function (_a) {
                                propName = propertyValue.propName, copyValue = propertyValue.copyValue, valueEditType = propertyValue.valueEditType;
                                newValue = this.editorModel.deserializeProperty(copyValue, valueEditType);
                                this.editorModel.setTargetProperty(propName, prefabComp, newValue, valueEditType);
                                this.dispathPropertyEvent(prefabComp, propName, newValue);
                                return [2 /*return*/];
                            });
                        }); });
                    }
                };
                for (var k = 0; k < gameObj.components.length; k++) {
                    _loop_2(k);
                }
            };
            RevertPrefabInstanceState.prototype.redo = function () {
                if (_super.prototype.redo.call(this)) {
                    var revertRoot = editor.Editor.activeEditorModel.getGameObjectByUUid(this.stateData.revertPrefabRootId);
                    var gameObjects = editor.Editor.activeEditorModel.getAllGameObjectsFromPrefabInstance(revertRoot);
                    var removeGameObjIds_1 = [];
                    var _loop_3 = function (gameObj) {
                        if (!(this_1.stateData.revertData[gameObj.extras.linkedID])) {
                            return "continue";
                        }
                        var revertData = this_1.stateData.revertData[gameObj.extras.linkedID];
                        if (revertData.revertGameObjects && revertData.revertGameObjects.length > 0) {
                            revertData.revertGameObjects.forEach(function (element) {
                                removeGameObjIds_1.push(element.id);
                            });
                        }
                        if (revertData.revertComponents && revertData.revertComponents.length > 0) {
                            var revertComponentIds_1 = [];
                            revertData.revertComponents.forEach(function (element) {
                                revertComponentIds_1.push(element.id);
                            });
                            var components = gameObj.components;
                            for (var index = components.length - 1; index >= 0; index--) {
                                var element = components[index];
                                if (revertComponentIds_1.indexOf(element.uuid) >= 0) {
                                    gameObj.removeComponent(element.constructor);
                                }
                            }
                            this_1.dispatchEditorModelEvent(editor.EditorModelEvent.REMOVE_COMPONENT);
                        }
                        if (revertData.modifyGameObjectPropertyList && revertData.modifyGameObjectPropertyList.length > 0) {
                            for (var _i = 0, _a = revertData.modifyGameObjectPropertyList; _i < _a.length; _i++) {
                                var obj = _a[_i];
                                var newValueList = obj.newValueList;
                                this_1.modifyPrefabGameObjectPropertyValues(gameObj, newValueList);
                            }
                        }
                        if (revertData.modifyComponentPropertyList && revertData.modifyComponentPropertyList.length > 0) {
                            for (var _b = 0, _c = revertData.modifyComponentPropertyList; _b < _c.length; _b++) {
                                var obj = _c[_b];
                                var componentId = obj.componentId, newValueList = obj.newValueList;
                                this_1.modifyPrefabComponentPropertyValues(gameObj, componentId, newValueList);
                            }
                        }
                    };
                    var this_1 = this;
                    for (var _i = 0, gameObjects_3 = gameObjects; _i < gameObjects_3.length; _i++) {
                        var gameObj = gameObjects_3[_i];
                        _loop_3(gameObj);
                    }
                    var gameObjs = editor.Editor.activeEditorModel.getGameObjectsByUUids(removeGameObjIds_1);
                    gameObjs.forEach(function (element) { return element.destroy(); });
                    this.dispatchEditorModelEvent(editor.EditorModelEvent.DELETE_GAMEOBJECTS, removeGameObjIds_1);
                    return true;
                }
                return false;
            };
            return RevertPrefabInstanceState;
        }(editor.BaseState));
        editor.RevertPrefabInstanceState = RevertPrefabInstanceState;
        __reflect(RevertPrefabInstanceState.prototype, "paper.editor.RevertPrefabInstanceState");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
var paper;
(function (paper) {
    var editor;
    (function (editor) {
        /**
         * TODO GUI NEW SAVE LOAD
         * @internal
         */
        var GUISystem = (function (_super) {
            __extends(GUISystem, _super);
            function GUISystem() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this._interests = [
                    [{ componentClass: egret3d.Transform }]
                ];
                _this._disposeCollecter = paper.GameObject.globalGameObject.getOrAddComponent(paper.DisposeCollecter);
                _this._modelComponent = paper.GameObject.globalGameObject.getOrAddComponent(editor.ModelComponent);
                _this._guiComponent = paper.GameObject.globalGameObject.getOrAddComponent(editor.GUIComponent);
                _this._bufferedGameObjects = [];
                _this._hierarchyFolders = {};
                _this._inspectorFolders = {};
                _this._selectFolder = null;
                _this._onSceneSelected = function (_c, value) {
                    _this._selectSceneOrGameObject(value);
                };
                _this._onSceneUnselected = function (_c, value) {
                    _this._selectSceneOrGameObject(null);
                };
                _this._onGameObjectSelectedChange = function (_c, value) {
                    _this._selectSceneOrGameObject(_this._modelComponent.selectedGameObject);
                };
                _this._sceneOrGameObjectGUIClickHandler = function (gui) {
                    _this._modelComponent.select(gui.instance, true);
                };
                _this._componentOrPropertyGUIClickHandler = function (gui) {
                    window["psc"] = gui.instance;
                };
                _this._saveSceneOrGameObject = function () {
                    if (_this._modelComponent.selectedScene) {
                        var json = JSON.stringify(paper.serialize(_this._modelComponent.selectedScene));
                        console.info(json);
                    }
                    else {
                        var json = JSON.stringify(paper.serialize(_this._modelComponent.selectedGameObject));
                        console.info(json);
                    }
                };
                _this._createGameObject = function () {
                    if (_this._modelComponent.selectedScene) {
                        var gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, "NoName" /* NoName */, "" /* Untagged */, _this._modelComponent.selectedScene);
                        _this._modelComponent.select(gameObject, true);
                    }
                    else {
                        var gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CUBE, "NoName" /* NoName */, "" /* Untagged */, _this._modelComponent.selectedGameObject.scene);
                        gameObject.transform.parent = _this._modelComponent.selectedGameObject.transform;
                        _this._modelComponent.select(gameObject, true);
                    }
                };
                _this._destroySceneOrGameObject = function () {
                    var selectedSceneOrGameObject = _this._guiComponent.inspector.instance;
                    if (selectedSceneOrGameObject) {
                        (selectedSceneOrGameObject).destroy();
                    }
                };
                return _this;
            }
            GUISystem.prototype._openFolder = function (folder) {
                if (!folder.parent || folder.parent === this._guiComponent.hierarchy) {
                    return;
                }
                folder.parent.open();
                this._openFolder(folder.parent);
            };
            GUISystem.prototype._getAssets = function (type) {
                var result = [{ label: "None", value: null }];
                if (RES.host.resourceConfig.config) {
                    var resFSDatas = RES.host.resourceConfig.config.fileSystem.fsData;
                    for (var k in resFSDatas) {
                        var data = resFSDatas[k];
                        if (data.type === type) {
                            result.push({ label: k, value: data });
                        }
                    }
                }
                return result;
            };
            GUISystem.prototype._selectSceneOrGameObject = function (sceneOrGameObject) {
                var _this = this;
                // Unselect prev folder.
                if (this._selectFolder) {
                    this._selectFolder.selected = false;
                    this._selectFolder = null;
                }
                var inspector = this._guiComponent.inspector;
                inspector.instance = sceneOrGameObject;
                for (var k in this._inspectorFolders) {
                    delete this._inspectorFolders[k];
                }
                if (inspector.__controllers) {
                    for (var _i = 0, _a = inspector.__controllers.concat(); _i < _a.length; _i++) {
                        var controller = _a[_i];
                        inspector.remove(controller);
                    }
                }
                if (inspector.__folders) {
                    for (var k in inspector.__folders) {
                        try {
                            inspector.removeFolder(inspector.__folders[k]);
                        }
                        catch (e) {
                        }
                    }
                }
                var options = {
                    scenes: "None",
                    prefabs: "None",
                };
                inspector.add(options, "scenes", this._getAssets("Scene")).onChange(function (v) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!v) {
                                    return [2 /*return*/];
                                }
                                return [4 /*yield*/, RES.getResAsync(v.url)];
                            case 1:
                                _a.sent();
                                paper.Scene.activeScene.destroy();
                                this._modelComponent.select(paper.Scene.create(v.url));
                                return [2 /*return*/];
                        }
                    });
                }); });
                inspector.add(options, "prefabs", this._getAssets("Prefab")).onChange(function (v) { return __awaiter(_this, void 0, void 0, function () {
                    var gameObject, parent_5;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!v) {
                                    return [2 /*return*/];
                                }
                                return [4 /*yield*/, RES.getResAsync(v.url)];
                            case 1:
                                _a.sent();
                                gameObject = null;
                                if (this._modelComponent.selectedGameObject) {
                                    parent_5 = this._modelComponent.selectedGameObject;
                                    gameObject = paper.Prefab.create(v.url, parent_5.scene);
                                    gameObject.parent = parent_5;
                                }
                                else {
                                    gameObject = paper.Prefab.create(v.url, this._modelComponent.selectedScene || paper.Scene.activeScene);
                                }
                                this._modelComponent.select(gameObject);
                                return [2 /*return*/];
                        }
                    });
                }); });
                if (sceneOrGameObject) {
                    inspector.add(this, "_destroySceneOrGameObject", "destroy");
                    inspector.add(this, "_saveSceneOrGameObject", "save");
                    this._addToInspector(inspector);
                    if (sceneOrGameObject instanceof paper.Scene) {
                    }
                    else {
                        for (var _b = 0, _d = sceneOrGameObject.components; _b < _d.length; _b++) {
                            var component = _d[_b];
                            var folder = inspector.addFolder(component.uuid, egret.getQualifiedClassName(component));
                            folder.instance = component;
                            folder.open();
                            this._inspectorFolders[component.uuid] = folder;
                            this._addToInspector(folder);
                        }
                    }
                }
            };
            GUISystem.prototype._addToHierarchy = function (gameObject) {
                if (gameObject.uuid in this._hierarchyFolders ||
                    gameObject.tag === "EditorOnly" /* EditorOnly */ ||
                    gameObject.hideFlags === 2 /* Hide */ ||
                    gameObject.hideFlags === 3 /* HideAndDontSave */) {
                    return true;
                }
                var parentFolder = this._hierarchyFolders[gameObject.transform.parent ? gameObject.transform.parent.gameObject.uuid : gameObject.scene.uuid];
                if (!parentFolder) {
                    if (gameObject.transform.parent) {
                        // throw new Error(); // Never.
                        return false;
                    }
                    parentFolder = this._guiComponent.hierarchy.addFolder(gameObject.scene.uuid, gameObject.scene.name + " <Scene>");
                    parentFolder.instance = gameObject.scene;
                    parentFolder.onClick = this._sceneOrGameObjectGUIClickHandler;
                    this._hierarchyFolders[gameObject.scene.uuid] = parentFolder;
                }
                var folder = parentFolder.addFolder(gameObject.uuid, gameObject.name);
                folder.instance = gameObject;
                folder.onClick = this._sceneOrGameObjectGUIClickHandler;
                this._hierarchyFolders[gameObject.uuid] = folder;
                return true;
            };
            GUISystem.prototype._propertyHasGetterSetter = function (target, propName) {
                var prototype = Object.getPrototypeOf(target);
                var descriptror;
                while (prototype) {
                    descriptror = Object.getOwnPropertyDescriptor(prototype, propName);
                    if (descriptror && descriptror.get && descriptror.set) {
                        return true;
                    }
                    prototype = Object.getPrototypeOf(prototype);
                }
                return false;
            };
            GUISystem.prototype._addToInspector = function (gui) {
                var infos = editor.getEditInfo(gui.instance);
                var guiControllerA;
                var guiControllerB;
                var guiControllerC;
                var guiControllerD;
                if (gui !== this._guiComponent.inspector) {
                    gui.onClick = this._componentOrPropertyGUIClickHandler;
                }
                var _loop_4 = function (info) {
                    switch (info.editType) {
                        case "UINT" /* UINT */:
                            guiControllerA = gui.add(gui.instance, info.name).min(0).step(1).listen();
                            if (info.option) {
                                if (info.option.minimum !== undefined) {
                                    guiControllerA.min(info.option.minimum);
                                }
                                if (info.option.maximum !== undefined) {
                                    guiControllerA.max(info.option.maximum);
                                }
                                if (info.option.step !== undefined) {
                                    guiControllerA.step(info.option.step);
                                }
                            }
                            break;
                        case "INT" /* INT */:
                            guiControllerA = gui.add(gui.instance, info.name).step(1).listen();
                            if (info.option) {
                                if (info.option.minimum !== undefined) {
                                    guiControllerA.min(info.option.minimum);
                                }
                                if (info.option.maximum !== undefined) {
                                    guiControllerA.max(info.option.maximum);
                                }
                                if (info.option.step !== undefined) {
                                    guiControllerA.step(info.option.step);
                                }
                            }
                            break;
                        case "FLOAT" /* FLOAT */:
                            guiControllerA = gui.add(gui.instance, info.name).step(0.1).listen();
                            if (info.option) {
                                if (info.option.minimum !== undefined) {
                                    guiControllerA.min(info.option.minimum);
                                }
                                if (info.option.maximum !== undefined) {
                                    guiControllerA.max(info.option.maximum);
                                }
                                if (info.option.step !== undefined) {
                                    guiControllerA.step(info.option.step);
                                }
                            }
                            break;
                        case "CHECKBOX" /* CHECKBOX */:
                        case "TEXT" /* TEXT */:
                            gui.add(gui.instance, info.name).listen();
                            break;
                        case "LIST" /* LIST */:
                            gui.add(gui.instance, info.name, info.option.listItems).listen();
                            break;
                        case "VECTOR2" /* VECTOR2 */: {
                            guiControllerA = gui.add(gui.instance[info.name], "x", info.name + ": x").step(0.1).listen();
                            guiControllerB = gui.add(gui.instance[info.name], "y", info.name + ": y").step(0.1).listen();
                            if (this_2._propertyHasGetterSetter(gui.instance, info.name)) {
                                var onChange = function () {
                                    gui.instance[info.name] = gui.instance[info.name];
                                };
                                guiControllerA.onChange(onChange);
                                guiControllerB.onChange(onChange);
                            }
                            if (info.option) {
                                if (info.option.minimum !== undefined) {
                                    guiControllerA.min(info.option.minimum);
                                    guiControllerB.min(info.option.minimum);
                                }
                                if (info.option.maximum !== undefined) {
                                    guiControllerA.max(info.option.maximum);
                                    guiControllerB.max(info.option.maximum);
                                }
                                if (info.option.step !== undefined) {
                                    guiControllerA.step(info.option.step);
                                    guiControllerB.step(info.option.step);
                                }
                            }
                            break;
                        }
                        case "SIZE" /* SIZE */: {
                            guiControllerA = gui.add(gui.instance[info.name], "w", info.name + ": w").step(0.1).listen();
                            guiControllerB = gui.add(gui.instance[info.name], "h", info.name + ": h").step(0.1).listen();
                            if (this_2._propertyHasGetterSetter(gui.instance, info.name)) {
                                var onChange = function () {
                                    gui.instance[info.name] = gui.instance[info.name];
                                };
                                guiControllerA.onChange(onChange);
                                guiControllerB.onChange(onChange);
                            }
                            if (info.option) {
                                if (info.option.minimum !== undefined) {
                                    guiControllerA.min(info.option.minimum);
                                    guiControllerB.min(info.option.minimum);
                                }
                                if (info.option.maximum !== undefined) {
                                    guiControllerA.max(info.option.maximum);
                                    guiControllerB.max(info.option.maximum);
                                }
                                if (info.option.step !== undefined) {
                                    guiControllerA.step(info.option.step);
                                    guiControllerB.step(info.option.step);
                                }
                            }
                            break;
                        }
                        case "VECTOR3" /* VECTOR3 */: {
                            guiControllerA = gui.add(gui.instance[info.name], "x", info.name + ": x").step(0.1).listen();
                            guiControllerB = gui.add(gui.instance[info.name], "y", info.name + ": y").step(0.1).listen();
                            guiControllerC = gui.add(gui.instance[info.name], "z", info.name + ": z").step(0.1).listen();
                            if (this_2._propertyHasGetterSetter(gui.instance, info.name)) {
                                var onChange = function () {
                                    gui.instance[info.name] = gui.instance[info.name];
                                };
                                guiControllerA.onChange(onChange);
                                guiControllerB.onChange(onChange);
                                guiControllerC.onChange(onChange);
                            }
                            if (info.option) {
                                if (info.option.minimum !== undefined) {
                                    guiControllerA.min(info.option.minimum);
                                    guiControllerB.min(info.option.minimum);
                                    guiControllerC.min(info.option.minimum);
                                }
                                if (info.option.maximum !== undefined) {
                                    guiControllerA.max(info.option.maximum);
                                    guiControllerB.max(info.option.maximum);
                                    guiControllerC.max(info.option.maximum);
                                }
                                if (info.option.step !== undefined) {
                                    guiControllerA.step(info.option.step);
                                    guiControllerB.step(info.option.step);
                                    guiControllerC.step(info.option.step);
                                }
                            }
                            break;
                        }
                        case "VECTOR4" /* VECTOR4 */:
                        case "QUATERNION" /* QUATERNION */:
                            break;
                        case "COLOR" /* COLOR */: {
                            guiControllerA = gui.addColor(gui.instance, info.name).listen();
                            if (this_2._propertyHasGetterSetter(gui.instance, info.name)) {
                                var onChange = function () {
                                    gui.instance[info.name] = gui.instance[info.name];
                                };
                                guiControllerA.onChange(onChange);
                            }
                            break;
                        }
                        case "RECT" /* RECT */: {
                            guiControllerA = gui.add(gui.instance[info.name], "x", info.name + ": x").step(0.1).listen();
                            guiControllerB = gui.add(gui.instance[info.name], "y", info.name + ": y").step(0.1).listen();
                            guiControllerC = gui.add(gui.instance[info.name], "w", info.name + ": w").step(0.1).listen();
                            guiControllerD = gui.add(gui.instance[info.name], "h", info.name + ": h").step(0.1).listen();
                            if (this_2._propertyHasGetterSetter(gui.instance, info.name)) {
                                var onChange = function () {
                                    gui.instance[info.name] = gui.instance[info.name];
                                };
                                guiControllerA.onChange(onChange);
                                guiControllerB.onChange(onChange);
                                guiControllerC.onChange(onChange);
                                guiControllerD.onChange(onChange);
                            }
                            if (info.option) {
                                if (info.option.minimum !== undefined) {
                                    guiControllerA.min(info.option.minimum);
                                    guiControllerB.min(info.option.minimum);
                                    guiControllerC.min(info.option.minimum);
                                    guiControllerD.min(info.option.minimum);
                                }
                                if (info.option.maximum !== undefined) {
                                    guiControllerA.max(info.option.maximum);
                                    guiControllerB.max(info.option.maximum);
                                    guiControllerC.max(info.option.maximum);
                                    guiControllerD.min(info.option.maximum);
                                }
                                if (info.option.step !== undefined) {
                                    guiControllerA.step(info.option.step);
                                    guiControllerB.step(info.option.step);
                                    guiControllerC.step(info.option.step);
                                    guiControllerD.step(info.option.step);
                                }
                            }
                            break;
                        }
                        case "GAMEOBJECT" /* GAMEOBJECT */:
                            break;
                        case "BUTTON" /* BUTTON */:
                            guiControllerA = gui.add(gui.instance, info.name);
                            break;
                        case "NESTED" /* NESTED */: {
                            var folder = gui.addFolder(info.name);
                            folder.instance = gui.instance[info.name];
                            this_2._addToInspector(folder);
                            break;
                        }
                    }
                };
                var this_2 = this;
                for (var _i = 0, infos_1 = infos; _i < infos_1.length; _i++) {
                    var info = infos_1[_i];
                    _loop_4(info);
                }
            };
            GUISystem.prototype.onAwake = function () {
                var sceneOptions = {
                    debug: false,
                    resources: function () {
                        // if (this._modelComponent.selectedScene) {
                        //     const sceneJSON = JSON.stringify(serialize(this._modelComponent.selectedScene));
                        //     console.info(sceneJSON);
                        // }
                        // else if (this._modelComponent.selectedGameObjects.length > 0) {
                        // }
                    },
                };
                this._guiComponent.hierarchy.add(sceneOptions, "debug").onChange(function (v) {
                    var sceneSystem = paper.Application.systemManager.getOrRegisterSystem(editor.SceneSystem, 6000 /* LaterUpdate */);
                    if (v) {
                        paper.Application.playerMode = 1 /* DebugPlayer */;
                        sceneSystem.enabled = true;
                    }
                    else {
                        paper.Application.playerMode = 0 /* Player */;
                        sceneSystem.enabled = false;
                    }
                });
            };
            GUISystem.prototype.onEnable = function () {
                editor.ModelComponent.onSceneSelected.add(this._onSceneSelected, this);
                editor.ModelComponent.onSceneUnselected.add(this._onSceneUnselected, this);
                editor.ModelComponent.onGameObjectSelectChanged.add(this._onGameObjectSelectedChange, this);
                this._bufferedGameObjects.push(paper.GameObject.globalGameObject);
                for (var _i = 0, _a = this._groups[0].gameObjects; _i < _a.length; _i++) {
                    var gameObject = _a[_i];
                    this._bufferedGameObjects.push(gameObject);
                }
                this._modelComponent.select(paper.Scene.activeScene);
            };
            GUISystem.prototype.onDisable = function () {
                editor.ModelComponent.onSceneSelected.remove(this._onSceneSelected, this);
                editor.ModelComponent.onSceneUnselected.remove(this._onSceneUnselected, this);
                editor.ModelComponent.onGameObjectSelectChanged.remove(this._onGameObjectSelectedChange, this);
                for (var k in this._hierarchyFolders) {
                    var folder = this._hierarchyFolders[k];
                    delete this._hierarchyFolders[k];
                    if (folder && folder.parent) {
                        try {
                            folder.parent.removeFolder(folder);
                        }
                        catch (e) {
                        }
                    }
                }
                for (var k in this._inspectorFolders) {
                    delete this._inspectorFolders[k];
                }
                this._bufferedGameObjects.length = 0;
                this._selectFolder = null;
            };
            GUISystem.prototype.onAddGameObject = function (gameObject, _group) {
                this._bufferedGameObjects.push(gameObject);
            };
            GUISystem.prototype.onRemoveGameObject = function (gameObject, _group) {
                var index = this._bufferedGameObjects.indexOf(gameObject);
                if (index >= 0) {
                    this._bufferedGameObjects[index] = null;
                }
            };
            GUISystem.prototype.onUpdate = function () {
                var isHierarchyShowed = !this._guiComponent.hierarchy.closed && this._guiComponent.hierarchy.domElement.style.display !== "none";
                var isInspectorShowed = !this._guiComponent.inspector.closed && this._guiComponent.inspector.domElement.style.display !== "none";
                {
                    for (var _i = 0, _a = this._disposeCollecter.scenes; _i < _a.length; _i++) {
                        var scene = _a[_i];
                        var folder = this._hierarchyFolders[scene.uuid];
                        delete this._hierarchyFolders[scene.uuid];
                        if (folder && folder.parent) {
                            try {
                                folder.parent.removeFolder(folder);
                            }
                            catch (e) {
                            }
                        }
                    }
                    for (var _b = 0, _d = this._disposeCollecter.gameObjects; _b < _d.length; _b++) {
                        var gameObject = _d[_b];
                        var folder = this._hierarchyFolders[gameObject.uuid];
                        delete this._hierarchyFolders[gameObject.uuid];
                        if (folder && folder.parent) {
                            try {
                                folder.parent.removeFolder(folder);
                            }
                            catch (e) {
                            }
                        }
                    }
                    for (var _e = 0, _f = this._disposeCollecter.components; _e < _f.length; _e++) {
                        var component = _f[_e];
                        var folder = this._inspectorFolders[component.uuid];
                        delete this._inspectorFolders[component.uuid];
                        if (folder && folder.parent) {
                            try {
                                folder.parent.removeFolder(folder);
                            }
                            catch (e) {
                            }
                        }
                    }
                    for (var _g = 0, _h = this._disposeCollecter.parentChangedGameObjects; _g < _h.length; _g++) {
                        var gameObject = _h[_g];
                        var folder = this._hierarchyFolders[gameObject.uuid];
                        if (folder) {
                            delete this._hierarchyFolders[gameObject.uuid];
                            if (folder && folder.parent) {
                                try {
                                    folder.parent.removeFolder(folder);
                                }
                                catch (e) {
                                }
                            }
                            this._bufferedGameObjects.push(gameObject);
                        }
                        else if (this._bufferedGameObjects.indexOf(gameObject) < 0) {
                            this._bufferedGameObjects.push(gameObject);
                        }
                    }
                }
                if (isHierarchyShowed) {
                    // Add folder.
                    var i = 0;
                    while (this._bufferedGameObjects.length > 0 && i++ < 5) {
                        var gameObject = this._bufferedGameObjects.shift();
                        if (gameObject) {
                            if (!this._addToHierarchy(gameObject)) {
                                this._bufferedGameObjects.push(gameObject);
                            }
                        }
                    }
                    if (!this._selectFolder) {
                        var sceneOrGameObject = this._modelComponent.selectedScene || this._modelComponent.selectedGameObject;
                        if (sceneOrGameObject && sceneOrGameObject.uuid in this._hierarchyFolders) {
                            this._selectFolder = this._hierarchyFolders[sceneOrGameObject.uuid];
                            this._selectFolder.selected = true;
                            this._openFolder(this._selectFolder);
                        }
                    }
                }
                if (isInspectorShowed) {
                    this._guiComponent.inspector.updateDisplay();
                    var inspectorFolders = this._guiComponent.inspector.__folders;
                    if (inspectorFolders) {
                        for (var k in inspectorFolders) {
                            inspectorFolders[k].updateDisplay();
                        }
                    }
                }
            };
            return GUISystem;
        }(paper.BaseSystem));
        editor.GUISystem = GUISystem;
        __reflect(GUISystem.prototype, "paper.editor.GUISystem");
    })(editor = paper.editor || (paper.editor = {}));
})(paper || (paper = {}));
