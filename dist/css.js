'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _cssVendor = require('css-vendor');

var _sheet = require('./sheet');

var _sheet2 = _interopRequireDefault(_sheet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var REG = /^([wmp][trblxy]?|flex|wrap|column|auto|align|justify|order)$/;
var cache = {};

var css = function css(config) {
  return function (props) {
    var next = {};
    var classNames = [];

    var breaks = [null].concat(_toConsumableArray(config.breakpoints));
    var sx = stylers(config);

    for (var key in props) {
      var val = props[key];
      if (!REG.test(key)) {
        next[key] = val;
        continue;
      }
      var cx = createRule(breaks, sx)(key, val);
      cx.forEach(function (cn) {
        return classNames.push(cn);
      });
    }

    next.className = join.apply(undefined, [next.className].concat(classNames));

    return next;
  };
};

css.reset = function () {
  Object.keys(cache).forEach(function (key) {
    delete cache[key];
  });
  while (_sheet2.default.cssRules.length) {
    _sheet2.default.deleteRule(0);
  }
};

var createRule = function createRule(breaks, sx) {
  return function (key, val) {
    var classNames = [];
    var id = '_Rfx' + _sheet2.default.cssRules.length.toString(36);
    var k = key.charAt(0);
    var style = sx[key] || sx[k];

    var rules = toArr(val).map(function (v, i) {
      var bp = breaks[i];
      var decs = style(key, v);
      var cn = id + '_' + (bp || '');
      var body = '.' + cn + '{' + decs + '}';
      var rule = media(bp, body);

      var _key = decs + (bp || '');

      if (cache[_key]) {
        classNames.push(cache[_key]);
        return null;
      } else {
        classNames.push(cn);
        cache[_key] = cn;
        return rule;
      }
    }).filter(function (r) {
      return r !== null;
    });

    _sheet2.default.insert(rules);

    return classNames;
  };
};

var toArr = function toArr(n) {
  return Array.isArray(n) ? n : [n];
};
var num = function num(n) {
  return typeof n === 'number' && !isNaN(n);
};

var join = function join() {
  for (var _len = arguments.length, args = Array(_len), _key2 = 0; _key2 < _len; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return args.filter(function (a) {
    return !!a;
  }).join(' ');
};

var dec = function dec(args) {
  var key = (0, _cssVendor.supportedProperty)(args[0]) || args[0];
  var val = (0, _cssVendor.supportedValue)(key, args[1]) || args[1];
  return key + ':' + val;
};
var rule = function rule(args) {
  return args.join(';');
};
var media = function media(bp, body) {
  return bp ? '@media screen and (min-width:' + bp + 'em){' + body + '}' : body;
};

var width = function width(key, n) {
  return dec(['width', !num(n) || n > 1 ? px(n) : n * 100 + '%']);
};
var px = function px(n) {
  return num(n) ? n + 'px' : n;
};

var space = function space(scale) {
  return function (key, n) {
    var _key$split = key.split(''),
        _key$split2 = _slicedToArray(_key$split, 2),
        a = _key$split2[0],
        b = _key$split2[1];

    var prop = a === 'm' ? 'margin' : 'padding';
    var dirs = directions[b] || [''];
    var neg = n < 0 ? -1 : 1;
    var val = !num(n) ? n : px((scale[Math.abs(n)] || Math.abs(n)) * neg);
    return rule(dirs.map(function (d) {
      return dec([prop + d, val]);
    }));
  };
};

var directions = {
  t: ['-top'],
  r: ['-right'],
  b: ['-bottom'],
  l: ['-left'],
  x: ['-left', '-right'],
  y: ['-top', '-bottom']
};

var flex = function flex(key, n) {
  return dec(['display', n ? 'flex' : 'block']);
};
var wrap = function wrap(key, n) {
  return dec(['flex-wrap', n ? 'wrap' : 'nowrap']);
};
var auto = function auto(key, n) {
  return dec(['flex', '1 1 auto']);
};
var column = function column(key, n) {
  return dec(['flex-direction', n ? 'column' : 'row']);
};
var align = function align(key, n) {
  return dec(['align-items', n]);
};
var justify = function justify(key, n) {
  return dec(['justify-content', n]);
};
var order = function order(key, n) {
  return dec(['order', n]);
};

var stylers = function stylers(config) {
  return {
    w: width,
    m: space(config.space),
    p: space(config.space),
    flex: flex,
    wrap: wrap,
    auto: auto,
    column: column,
    align: align,
    justify: justify,
    order: order
  };
};

exports.default = css;