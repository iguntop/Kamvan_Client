// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"C:/Users/TOP/AppData/Roaming/npm/node_modules/parcel-bundler/node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"node_modules/jquery/dist/jquery.js":[function(require,module,exports) {
var global = arguments[3];
var process = require("process");
var define;
/*!
 * jQuery JavaScript Library v3.5.0
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2020-04-10T15:07Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var flat = arr.flat ? function( array ) {
	return arr.flat.call( array );
} : function( array ) {
	return arr.concat.apply( [], array );
};


var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};

var isFunction = function isFunction( obj ) {

      // Support: Chrome <=57, Firefox <=52
      // In some browsers, typeof returns "function" for HTML <object> elements
      // (i.e., `typeof document.createElement( "object" ) === "function"`).
      // We don't want to classify *any* DOM node as a function.
      return typeof obj === "function" && typeof obj.nodeType !== "number";
  };


var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};


var document = window.document;



	var preservedScriptAttributes = {
		type: true,
		src: true,
		nonce: true,
		noModule: true
	};

	function DOMEval( code, node, doc ) {
		doc = doc || document;

		var i, val,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {

				// Support: Firefox 64+, Edge 18+
				// Some browsers don't support the "nonce" property on scripts.
				// On the other hand, just using `getAttribute` is not enough as
				// the `nonce` attribute is reset to an empty string whenever it
				// becomes browsing-context connected.
				// See https://github.com/whatwg/html/issues/2369
				// See https://html.spec.whatwg.org/#nonce-attributes
				// The `node.getAttribute` check was added for the sake of
				// `jQuery.globalEval` so that it can fake a nonce-containing node
				// via an object.
				val = node[ i ] || node.getAttribute && node.getAttribute( i );
				if ( val ) {
					script.setAttribute( i, val );
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}


function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.5.0",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	even: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return ( i + 1 ) % 2;
		} ) );
	},

	odd: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return i % 2;
		} ) );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				copy = options[ name ];

				// Prevent Object.prototype pollution
				// Prevent never-ending loop
				if ( name === "__proto__" || target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {
					src = target[ name ];

					// Ensure proper type for the source value
					if ( copyIsArray && !Array.isArray( src ) ) {
						clone = [];
					} else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
						clone = {};
					} else {
						clone = src;
					}
					copyIsArray = false;

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a provided context; falls back to the global one
	// if not specified.
	globalEval: function( code, options, doc ) {
		DOMEval( code, { nonce: options && options.nonce }, doc );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return flat( ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( _i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.5
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://js.foundation/
 *
 * Date: 2020-03-14
 */
( function( window ) {
var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	nonnativeSelectorCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ( {} ).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	pushNative = arr.push,
	push = arr.push,
	slice = arr.slice,

	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[ i ] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|" +
		"ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
	identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
		"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +

		// "Attribute values must be CSS identifiers [capture 5]
		// or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
		whitespace + "*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +

		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" +
		whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace +
		"*" ),
	rdescend = new RegExp( whitespace + "|>" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
			whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
			whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),

		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace +
			"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
			"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rhtml = /HTML$/i,
	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g" ),
	funescape = function( escape, nonHex ) {
		var high = "0x" + escape.slice( 1 ) - 0x10000;

		return nonHex ?

			// Strip the backslash prefix from a non-hex escape sequence
			nonHex :

			// Replace a hexadecimal escape sequence with the encoded Unicode code point
			// Support: IE <=11+
			// For values outside the Basic Multilingual Plane (BMP), manually construct a
			// surrogate pair
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" +
				ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	inDisabledFieldset = addCombinator(
		function( elem ) {
			return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		( arr = slice.call( preferredDoc.childNodes ) ),
		preferredDoc.childNodes
	);

	// Support: Android<4.0
	// Detect silently failing push.apply
	// eslint-disable-next-line no-unused-expressions
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			pushNative.apply( target, slice.call( els ) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;

			// Can't trust NodeList.length
			while ( ( target[ j++ ] = els[ i++ ] ) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {
		setDocument( context );
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && ( match = rquickExpr.exec( selector ) ) ) {

				// ID selector
				if ( ( m = match[ 1 ] ) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( ( elem = context.getElementById( m ) ) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && ( elem = newContext.getElementById( m ) ) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[ 2 ] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( ( m = match[ 3 ] ) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!nonnativeSelectorCache[ selector + " " ] &&
				( !rbuggyQSA || !rbuggyQSA.test( selector ) ) &&

				// Support: IE 8 only
				// Exclude object elements
				( nodeType !== 1 || context.nodeName.toLowerCase() !== "object" ) ) {

				newSelector = selector;
				newContext = context;

				// qSA considers elements outside a scoping root when evaluating child or
				// descendant combinators, which is not what we want.
				// In such cases, we work around the behavior by prefixing every selector in the
				// list with an ID selector referencing the scope context.
				// The technique has to be used as well when a leading combinator is used
				// as such selectors are not recognized by querySelectorAll.
				// Thanks to Andrew Dupont for this technique.
				if ( nodeType === 1 &&
					( rdescend.test( selector ) || rcombinators.test( selector ) ) ) {

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;

					// We can use :scope instead of the ID hack if the browser
					// supports it & if we're not changing the context.
					if ( newContext !== context || !support.scope ) {

						// Capture the context ID, setting it first if necessary
						if ( ( nid = context.getAttribute( "id" ) ) ) {
							nid = nid.replace( rcssescape, fcssescape );
						} else {
							context.setAttribute( "id", ( nid = expando ) );
						}
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[ i ] = ( nid ? "#" + nid : ":scope" ) + " " +
							toSelector( groups[ i ] );
					}
					newSelector = groups.join( "," );
				}

				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch ( qsaError ) {
					nonnativeSelectorCache( selector, true );
				} finally {
					if ( nid === expando ) {
						context.removeAttribute( "id" );
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {

		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {

			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return ( cache[ key + " " ] = value );
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement( "fieldset" );

	try {
		return !!fn( el );
	} catch ( e ) {
		return false;
	} finally {

		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}

		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split( "|" ),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[ i ] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( ( cur = cur.nextSibling ) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return ( name === "input" || name === "button" ) && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
					inDisabledFieldset( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction( function( argument ) {
		argument = +argument;
		return markFunction( function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ ( j = matchIndexes[ i ] ) ] ) {
					seed[ j ] = !( matches[ j ] = seed[ j ] );
				}
			}
		} );
	} );
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	var namespace = elem.namespaceURI,
		docElem = ( elem.ownerDocument || elem ).documentElement;

	// Support: IE <=8
	// Assume HTML when documentElement doesn't yet exist, such as inside loading iframes
	// https://bugs.jquery.com/ticket/4833
	return !rhtml.test( namespace || docElem && docElem.nodeName || "HTML" );
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( doc == document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9 - 11+, Edge 12 - 18+
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( preferredDoc != document &&
		( subWindow = document.defaultView ) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	// Support: IE 8 - 11+, Edge 12 - 18+, Chrome <=16 - 25 only, Firefox <=3.6 - 31 only,
	// Safari 4 - 5 only, Opera <=11.6 - 12.x only
	// IE/Edge & older browsers don't support the :scope pseudo-class.
	// Support: Safari 6.0 only
	// Safari 6.0 supports :scope but it's an alias of :root there.
	support.scope = assert( function( el ) {
		docElem.appendChild( el ).appendChild( document.createElement( "div" ) );
		return typeof el.querySelectorAll !== "undefined" &&
			!el.querySelectorAll( ":scope fieldset div" ).length;
	} );

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert( function( el ) {
		el.className = "i";
		return !el.getAttribute( "className" );
	} );

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert( function( el ) {
		el.appendChild( document.createComment( "" ) );
		return !el.getElementsByTagName( "*" ).length;
	} );

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert( function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	} );

	// ID filter and find
	if ( support.getById ) {
		Expr.filter[ "ID" ] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute( "id" ) === attrId;
			};
		};
		Expr.find[ "ID" ] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter[ "ID" ] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode( "id" );
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find[ "ID" ] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode( "id" );
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( ( elem = elems[ i++ ] ) ) {
						node = elem.getAttributeNode( "id" );
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find[ "TAG" ] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,

				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( ( elem = results[ i++ ] ) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find[ "CLASS" ] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( ( support.qsa = rnative.test( document.querySelectorAll ) ) ) {

		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert( function( el ) {

			var input;

			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll( "[msallowcapture^='']" ).length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll( "[selected]" ).length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push( "~=" );
			}

			// Support: IE 11+, Edge 15 - 18+
			// IE 11/Edge don't find elements on a `[name='']` query in some cases.
			// Adding a temporary attribute to the document before the selection works
			// around the issue.
			// Interestingly, IE 10 & older don't seem to have the issue.
			input = document.createElement( "input" );
			input.setAttribute( "name", "" );
			el.appendChild( input );
			if ( !el.querySelectorAll( "[name='']" ).length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*name" + whitespace + "*=" +
					whitespace + "*(?:''|\"\")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll( ":checked" ).length ) {
				rbuggyQSA.push( ":checked" );
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push( ".#.+[+~]" );
			}

			// Support: Firefox <=3.6 - 5 only
			// Old Firefox doesn't throw on a badly-escaped identifier.
			el.querySelectorAll( "\\\f" );
			rbuggyQSA.push( "[\\r\\n\\f]" );
		} );

		assert( function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement( "input" );
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll( "[name=d]" ).length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll( ":enabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll( ":disabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: Opera 10 - 11 only
			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll( "*,:x" );
			rbuggyQSA.push( ",.*:" );
		} );
	}

	if ( ( support.matchesSelector = rnative.test( ( matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector ) ) ) ) {

		assert( function( el ) {

			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		} );
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join( "|" ) );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			) );
		} :
		function( a, b ) {
			if ( b ) {
				while ( ( b = b.parentNode ) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		compare = ( a.ownerDocument || a ) == ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			( !support.sortDetached && b.compareDocumentPosition( a ) === compare ) ) {

			// Choose the first element that is related to our preferred document
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( a == document || a.ownerDocument == preferredDoc &&
				contains( preferredDoc, a ) ) {
				return -1;
			}

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( b == document || b.ownerDocument == preferredDoc &&
				contains( preferredDoc, b ) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			return a == document ? -1 :
				b == document ? 1 :
				/* eslint-enable eqeqeq */
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( ( cur = cur.parentNode ) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( ( cur = cur.parentNode ) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[ i ] === bp[ i ] ) {
			i++;
		}

		return i ?

			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[ i ], bp[ i ] ) :

			// Otherwise nodes in our document sort first
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			ap[ i ] == preferredDoc ? -1 :
			bp[ i ] == preferredDoc ? 1 :
			/* eslint-enable eqeqeq */
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	setDocument( elem );

	if ( support.matchesSelector && documentIsHTML &&
		!nonnativeSelectorCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||

				// As well, disconnected nodes are said to be in a document
				// fragment in IE 9
				elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch ( e ) {
			nonnativeSelectorCache( expr, true );
		}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( context.ownerDocument || context ) != document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( elem.ownerDocument || elem ) != document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],

		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			( val = elem.getAttributeNode( name ) ) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return ( sel + "" ).replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( ( elem = results[ i++ ] ) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {

		// If no nodeType, this is expected to be an array
		while ( ( node = elem[ i++ ] ) ) {

			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {

		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {

			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}

	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[ 1 ] = match[ 1 ].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[ 3 ] = ( match[ 3 ] || match[ 4 ] ||
				match[ 5 ] || "" ).replace( runescape, funescape );

			if ( match[ 2 ] === "~=" ) {
				match[ 3 ] = " " + match[ 3 ] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {

			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[ 1 ] = match[ 1 ].toLowerCase();

			if ( match[ 1 ].slice( 0, 3 ) === "nth" ) {

				// nth-* requires argument
				if ( !match[ 3 ] ) {
					Sizzle.error( match[ 0 ] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[ 4 ] = +( match[ 4 ] ?
					match[ 5 ] + ( match[ 6 ] || 1 ) :
					2 * ( match[ 3 ] === "even" || match[ 3 ] === "odd" ) );
				match[ 5 ] = +( ( match[ 7 ] + match[ 8 ] ) || match[ 3 ] === "odd" );

				// other types prohibit arguments
			} else if ( match[ 3 ] ) {
				Sizzle.error( match[ 0 ] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[ 6 ] && match[ 2 ];

			if ( matchExpr[ "CHILD" ].test( match[ 0 ] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[ 3 ] ) {
				match[ 2 ] = match[ 4 ] || match[ 5 ] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&

				// Get excess from tokenize (recursively)
				( excess = tokenize( unquoted, true ) ) &&

				// advance to the next closing parenthesis
				( excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length ) ) {

				// excess is a negative index
				match[ 0 ] = match[ 0 ].slice( 0, excess );
				match[ 2 ] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() {
					return true;
				} :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				( pattern = new RegExp( "(^|" + whitespace +
					")" + className + "(" + whitespace + "|$)" ) ) && classCache(
						className, function( elem ) {
							return pattern.test(
								typeof elem.className === "string" && elem.className ||
								typeof elem.getAttribute !== "undefined" &&
									elem.getAttribute( "class" ) ||
								""
							);
				} );
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				/* eslint-disable max-len */

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
				/* eslint-enable max-len */

			};
		},

		"CHILD": function( type, what, _argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, _context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( ( node = node[ dir ] ) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}

								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || ( node[ expando ] = {} );

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								( outerCache[ node.uniqueID ] = {} );

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( ( node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								( diff = nodeIndex = 0 ) || start.pop() ) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {

							// Use previously-cached element index if available
							if ( useCache ) {

								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || ( node[ expando ] = {} );

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									( outerCache[ node.uniqueID ] = {} );

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {

								// Use the same loop as above to seek `elem` from the start
								while ( ( node = ++nodeIndex && node && node[ dir ] ||
									( diff = nodeIndex = 0 ) || start.pop() ) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] ||
												( node[ expando ] = {} );

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												( outerCache[ node.uniqueID ] = {} );

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {

			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction( function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[ i ] );
							seed[ idx ] = !( matches[ idx ] = matched[ i ] );
						}
					} ) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {

		// Potentially complex pseudos
		"not": markFunction( function( selector ) {

			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction( function( seed, matches, _context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( ( elem = unmatched[ i ] ) ) {
							seed[ i ] = !( matches[ i ] = elem );
						}
					}
				} ) :
				function( elem, _context, xml ) {
					input[ 0 ] = elem;
					matcher( input, null, xml, results );

					// Don't keep the element (issue #299)
					input[ 0 ] = null;
					return !results.pop();
				};
		} ),

		"has": markFunction( function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		} ),

		"contains": markFunction( function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || getText( elem ) ).indexOf( text ) > -1;
			};
		} ),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {

			// lang value must be a valid identifier
			if ( !ridentifier.test( lang || "" ) ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( ( elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute( "xml:lang" ) || elem.getAttribute( "lang" ) ) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( ( elem = elem.parentNode ) && elem.nodeType === 1 );
				return false;
			};
		} ),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement &&
				( !document.hasFocus || document.hasFocus() ) &&
				!!( elem.type || elem.href || ~elem.tabIndex );
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {

			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return ( nodeName === "input" && !!elem.checked ) ||
				( nodeName === "option" && !!elem.selected );
		},

		"selected": function( elem ) {

			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				// eslint-disable-next-line no-unused-expressions
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {

			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos[ "empty" ]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( ( attr = elem.getAttribute( "type" ) ) == null ||
					attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo( function() {
			return [ 0 ];
		} ),

		"last": createPositionalPseudo( function( _matchIndexes, length ) {
			return [ length - 1 ];
		} ),

		"eq": createPositionalPseudo( function( _matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		} ),

		"even": createPositionalPseudo( function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"odd": createPositionalPseudo( function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"lt": createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ?
				argument + length :
				argument > length ?
					length :
					argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"gt": createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} )
	}
};

Expr.pseudos[ "nth" ] = Expr.pseudos[ "eq" ];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || ( match = rcomma.exec( soFar ) ) ) {
			if ( match ) {

				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[ 0 ].length ) || soFar;
			}
			groups.push( ( tokens = [] ) );
		}

		matched = false;

		// Combinators
		if ( ( match = rcombinators.exec( soFar ) ) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,

				// Cast descendant combinators to space
				type: match[ 0 ].replace( rtrim, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( ( match = matchExpr[ type ].exec( soFar ) ) && ( !preFilters[ type ] ||
				( match = preFilters[ type ]( match ) ) ) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :

			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[ i ].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?

		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( ( elem = elem[ dir ] ) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || ( elem[ expando ] = {} );

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] ||
							( outerCache[ elem.uniqueID ] = {} );

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( ( oldCache = uniqueCache[ key ] ) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return ( newCache[ 2 ] = oldCache[ 2 ] );
						} else {

							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( ( newCache[ 2 ] = matcher( elem, context, xml ) ) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[ i ]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[ 0 ];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[ i ], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( ( elem = unmatched[ i ] ) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction( function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts(
				selector || "*",
				context.nodeType ? [ context ] : context,
				[]
			),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?

				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( ( elem = temp[ i ] ) ) {
					matcherOut[ postMap[ i ] ] = !( matcherIn[ postMap[ i ] ] = elem );
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {

					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( ( elem = matcherOut[ i ] ) ) {

							// Restore matcherIn since elem is not yet a final match
							temp.push( ( matcherIn[ i ] = elem ) );
						}
					}
					postFinder( null, ( matcherOut = [] ), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( ( elem = matcherOut[ i ] ) &&
						( temp = postFinder ? indexOf( seed, elem ) : preMap[ i ] ) > -1 ) {

						seed[ temp ] = !( results[ temp ] = elem );
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	} );
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[ 0 ].type ],
		implicitRelative = leadingRelative || Expr.relative[ " " ],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				( checkContext = context ).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );

			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( ( matcher = Expr.relative[ tokens[ i ].type ] ) ) {
			matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
		} else {
			matcher = Expr.filter[ tokens[ i ].type ].apply( null, tokens[ i ].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {

				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[ j ].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(

					// If the preceding token was a descendant combinator, insert an implicit any-element `*`
					tokens
						.slice( 0, i - 1 )
						.concat( { value: tokens[ i - 2 ].type === " " ? "*" : "" } )
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( ( tokens = tokens.slice( j ) ) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,

				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find[ "TAG" ]( "*", outermost ),

				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = ( dirruns += contextBackup == null ? 1 : Math.random() || 0.1 ),
				len = elems.length;

			if ( outermost ) {

				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				outermostContext = context == document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && ( elem = elems[ i ] ) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;

					// Support: IE 11+, Edge 17 - 18+
					// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
					// two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					if ( !context && elem.ownerDocument != document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( ( matcher = elementMatchers[ j++ ] ) ) {
						if ( matcher( elem, context || document, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {

					// They will have gone through all possible matchers
					if ( ( elem = !matcher && elem ) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( ( matcher = setMatchers[ j++ ] ) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {

					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !( unmatched[ i ] || setMatched[ i ] ) ) {
								setMatched[ i ] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {

		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[ i ] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache(
			selector,
			matcherFromGroupMatchers( elementMatchers, setMatchers )
		);

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( ( selector = compiled.selector || selector ) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[ 0 ] = match[ 0 ].slice( 0 );
		if ( tokens.length > 2 && ( token = tokens[ 0 ] ).type === "ID" &&
			context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[ 1 ].type ] ) {

			context = ( Expr.find[ "ID" ]( token.matches[ 0 ]
				.replace( runescape, funescape ), context ) || [] )[ 0 ];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr[ "needsContext" ].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[ i ];

			// Abort if we hit a combinator
			if ( Expr.relative[ ( type = token.type ) ] ) {
				break;
			}
			if ( ( find = Expr.find[ type ] ) ) {

				// Search, expanding context for leading sibling combinators
				if ( ( seed = find(
					token.matches[ 0 ].replace( runescape, funescape ),
					rsibling.test( tokens[ 0 ].type ) && testContext( context.parentNode ) ||
						context
				) ) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split( "" ).sort( sortOrder ).join( "" ) === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert( function( el ) {

	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement( "fieldset" ) ) & 1;
} );

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert( function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute( "href" ) === "#";
} ) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	} );
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert( function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
} ) ) {
	addHandle( "value", function( elem, _name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	} );
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert( function( el ) {
	return el.getAttribute( "disabled" ) == null;
} ) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
				( val = elem.getAttributeNode( name ) ) && val.specified ?
					val.value :
					null;
		}
	} );
}

return Sizzle;

} )( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Filtered directly for both simple and complex selectors
	return jQuery.filter( qualifier, elements, not );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, _i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, _i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, _i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		if ( elem.contentDocument != null &&

			// Support: IE 11+
			// <object> elements with no `data` attribute has an object
			// `contentDocument` with a `null` prototype.
			getProto( elem.contentDocument ) ) {

			return elem.contentDocument;
		}

		// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
		// Treat the template element as a regular one in browsers that
		// don't support it.
		if ( nodeName( elem, "template" ) ) {
			elem = elem.content || elem;
		}

		return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( _i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( toType( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, _key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};


// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase( _all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (#9572)
function camelCase( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = Object.create( null );

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( camelCase );
			} else {
				key = camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var documentElement = document.documentElement;



	var isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem );
		},
		composed = { composed: true };

	// Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
	// Check attachment across shadow DOM boundaries when possible (gh-3504)
	// Support: iOS 10.0-10.2 only
	// Early iOS 10 versions support `attachShadow` but not `getRootNode`,
	// leading to errors. We need to check for `getRootNode`.
	if ( documentElement.getRootNode ) {
		isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem ) ||
				elem.getRootNode( composed ) === elem.ownerDocument;
		};
	}
var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			isAttached( elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = elem.nodeType &&
			( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Support: Firefox <=54
		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
		initial = initial / 2;

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		while ( maxIterations-- ) {

			// Evaluate and update our best guess (doubling guesses that zero out).
			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
			jQuery.style( elem, prop, initialInUnit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;

		}

		initialInUnit = initialInUnit * 2;
		jQuery.style( elem, prop, initialInUnit + unit );

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );

var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// Support: IE <=9 only
	// IE <=9 replaces <option> tags with their contents when inserted outside of
	// the select element.
	div.innerHTML = "<option></option>";
	support.option = !!div.lastChild;
} )();


// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: IE <=9 only
if ( !support.option ) {
	wrapMap.optgroup = wrapMap.option = [ 1, "<select multiple='multiple'>", "</select>" ];
}


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, attached, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		attached = isAttached( elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( attached ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 - 11+
// focus() and blur() are asynchronous, except when they are no-op.
// So expect focus to be synchronous when the element is already active,
// and blur to be synchronous when the element is not already active.
// (focus and blur are always synchronous in other supported browsers,
// this just defines when we can count on it).
function expectSync( elem, type ) {
	return ( elem === safeActiveElement() ) === ( type === "focus" );
}

// Support: IE <=9 only
// Accessing document.activeElement can throw unexpectedly
// https://bugs.jquery.com/ticket/13393
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Only attach events to objects that accept data
		if ( !acceptData( elem ) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = Object.create( null );
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),

			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( nativeEvent ),

			handlers = (
					dataPriv.get( this, "events" ) || Object.create( null )
				)[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// If the event is namespaced, then each handler is only invoked if it is
				// specially universal or its namespaces are a superset of the event's.
				if ( !event.rnamespace || handleObj.namespace === false ||
					event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {

			// Utilize native event to ensure correct state for checkable inputs
			setup: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Claim the first handler
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					// dataPriv.set( el, "click", ... )
					leverageNative( el, "click", returnTrue );
				}

				// Return false to allow normal processing in the caller
				return false;
			},
			trigger: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Force setup before triggering a click
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					leverageNative( el, "click" );
				}

				// Return non-false to allow normal event-path propagation
				return true;
			},

			// For cross-browser consistency, suppress native .click() on links
			// Also prevent it if we're currently inside a leveraged native-event stack
			_default: function( event ) {
				var target = event.target;
				return rcheckableType.test( target.type ) &&
					target.click && nodeName( target, "input" ) &&
					dataPriv.get( target, "click" ) ||
					nodeName( target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

// Ensure the presence of an event listener that handles manually-triggered
// synthetic events by interrupting progress until reinvoked in response to
// *native* events that it fires directly, ensuring that state changes have
// already occurred before other listeners are invoked.
function leverageNative( el, type, expectSync ) {

	// Missing expectSync indicates a trigger call, which must force setup through jQuery.event.add
	if ( !expectSync ) {
		if ( dataPriv.get( el, type ) === undefined ) {
			jQuery.event.add( el, type, returnTrue );
		}
		return;
	}

	// Register the controller as a special universal handler for all event namespaces
	dataPriv.set( el, type, false );
	jQuery.event.add( el, type, {
		namespace: false,
		handler: function( event ) {
			var notAsync, result,
				saved = dataPriv.get( this, type );

			if ( ( event.isTrigger & 1 ) && this[ type ] ) {

				// Interrupt processing of the outer synthetic .trigger()ed event
				// Saved data should be false in such cases, but might be a leftover capture object
				// from an async native handler (gh-4350)
				if ( !saved.length ) {

					// Store arguments for use when handling the inner native event
					// There will always be at least one argument (an event object), so this array
					// will not be confused with a leftover capture object.
					saved = slice.call( arguments );
					dataPriv.set( this, type, saved );

					// Trigger the native event and capture its result
					// Support: IE <=9 - 11+
					// focus() and blur() are asynchronous
					notAsync = expectSync( this, type );
					this[ type ]();
					result = dataPriv.get( this, type );
					if ( saved !== result || notAsync ) {
						dataPriv.set( this, type, false );
					} else {
						result = {};
					}
					if ( saved !== result ) {

						// Cancel the outer synthetic event
						event.stopImmediatePropagation();
						event.preventDefault();
						return result.value;
					}

				// If this is an inner synthetic event for an event with a bubbling surrogate
				// (focus or blur), assume that the surrogate already propagated from triggering the
				// native event and prevent that from happening again here.
				// This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
				// bubbling surrogate propagates *after* the non-bubbling base), but that seems
				// less bad than duplication.
				} else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
					event.stopPropagation();
				}

			// If this is a native event triggered above, everything is now in order
			// Fire an inner synthetic event with the original arguments
			} else if ( saved.length ) {

				// ...and capture the result
				dataPriv.set( this, type, {
					value: jQuery.event.trigger(

						// Support: IE <=9 - 11+
						// Extend with the prototype to reset the above stopImmediatePropagation()
						jQuery.extend( saved[ 0 ], jQuery.Event.prototype ),
						saved.slice( 1 ),
						this
					)
				} );

				// Abort handling of the native event
				event.stopImmediatePropagation();
			}
		}
	} );
}

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	code: true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {
	jQuery.event.special[ type ] = {

		// Utilize native event if possible so blur/focus sequence is correct
		setup: function() {

			// Claim the first handler
			// dataPriv.set( this, "focus", ... )
			// dataPriv.set( this, "blur", ... )
			leverageNative( this, type, expectSync );

			// Return false to allow normal processing in the caller
			return false;
		},
		trigger: function() {

			// Force setup before trigger
			leverageNative( this, type );

			// Return non-false to allow normal event-path propagation
			return true;
		},

		delegateType: delegateType
	};
} );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.get( src );
		events = pdataOld.events;

		if ( events ) {
			dataPriv.remove( dest, "handle events" );

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = flat( args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		valueIsFunction = isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( valueIsFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( valueIsFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl && !node.noModule ) {
								jQuery._evalUrl( node.src, {
									nonce: node.nonce || node.getAttribute( "nonce" )
								}, doc );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && isAttached( node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html;
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = isAttached( elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var swap = function( elem, options, callback ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.call( elem );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentElement.appendChild( container ).appendChild( div );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		// Support: Chrome <=64
		// Don't get tricked when zoom affects offsetWidth (gh-4029)
		div.style.position = "absolute";
		scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	function roundPixelMeasures( measure ) {
		return Math.round( parseFloat( measure ) );
	}

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableTrDimensionsVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery.extend( support, {
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function() {
			computeStyleTests();
			return pixelBoxStylesVal;
		},
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		},
		scrollboxSize: function() {
			computeStyleTests();
			return scrollboxSizeVal;
		},

		// Support: IE 9 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Behavior in IE 9 is more subtle than in newer versions & it passes
		// some versions of this test; make sure not to make it pass there!
		reliableTrDimensions: function() {
			var table, tr, trChild, trStyle;
			if ( reliableTrDimensionsVal == null ) {
				table = document.createElement( "table" );
				tr = document.createElement( "tr" );
				trChild = document.createElement( "div" );

				table.style.cssText = "position:absolute;left:-11111px";
				tr.style.height = "1px";
				trChild.style.height = "9px";

				documentElement
					.appendChild( table )
					.appendChild( tr )
					.appendChild( trChild );

				trStyle = window.getComputedStyle( tr );
				reliableTrDimensionsVal = parseInt( trStyle.height ) > 3;

				documentElement.removeChild( table );
			}
			return reliableTrDimensionsVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !isAttached( elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style,
	vendorProps = {};

// Return a vendor-prefixed property or undefined
function vendorPropName( name ) {

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a potentially-mapped jQuery.cssProps or vendor prefixed property
function finalPropName( name ) {
	var final = jQuery.cssProps[ name ] || vendorProps[ name ];

	if ( final ) {
		return final;
	}
	if ( name in emptyStyle ) {
		return name;
	}
	return vendorProps[ name ] = vendorPropName( name ) || name;
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	};

function setPositiveNumber( _elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0;

	// Adjustment may not be necessary
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin
		if ( box === "margin" ) {
			delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
		if ( !isBorderBox ) {

			// Add padding
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// But still keep track of it otherwise
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// If we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// For "content", subtract padding
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// For "content" or "padding", subtract border
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// Account for positive content-box scroll gutter when requested by providing computedVal
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
		// Assuming integer scroll gutter, subtract the rest and round down
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5

		// If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
		// Use an explicit zero to avoid NaN (gh-3964)
		) ) || 0;
	}

	return delta;
}

function getWidthOrHeight( elem, dimension, extra ) {

	// Start with computed style
	var styles = getStyles( elem ),

		// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
		// Fake content-box until we know it's needed to know the true value.
		boxSizingNeeded = !support.boxSizingReliable() || extra,
		isBorderBox = boxSizingNeeded &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox,

		val = curCSS( elem, dimension, styles ),
		offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );

	// Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}


	// Support: IE 9 - 11 only
	// Use offsetWidth/offsetHeight for when box sizing is unreliable.
	// In those cases, the computed value can be trusted to be border-box.
	if ( ( !support.boxSizingReliable() && isBorderBox ||

		// Support: IE 10 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Interestingly, in some cases IE 9 doesn't suffer from this issue.
		!support.reliableTrDimensions() && nodeName( elem, "tr" ) ||

		// Fall back to offsetWidth/offsetHeight when value is "auto"
		// This happens for inline elements with no explicit setting (gh-3571)
		val === "auto" ||

		// Support: Android <=4.1 - 4.3 only
		// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) &&

		// Make sure the element is visible & connected
		elem.getClientRects().length ) {

		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

		// Where available, offsetWidth/offsetHeight approximate border box dimensions.
		// Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
		// retrieved value as a content box dimension.
		valueIsBorderBox = offsetProp in elem;
		if ( valueIsBorderBox ) {
			val = elem[ offsetProp ];
		}
	}

	// Normalize "" and auto
	val = parseFloat( val ) || 0;

	// Adjust for the element's box model
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// Provide the current computed size to request scroll gutter calculation (gh-3589)
			val
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"gridArea": true,
		"gridColumn": true,
		"gridColumnEnd": true,
		"gridColumnStart": true,
		"gridRow": true,
		"gridRowEnd": true,
		"gridRowStart": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			// The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
			// "px" to a few hardcoded values.
			if ( type === "number" && !isCustomProp ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( _i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, dimension, extra );
						} ) :
						getWidthOrHeight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),

				// Only read styles.position if the test has a chance to fail
				// to avoid forcing a reflow.
				scrollboxSizeBuggy = !support.scrollboxSize() &&
					styles.position === "absolute",

				// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
				boxSizingNeeded = scrollboxSizeBuggy || extra,
				isBorderBox = boxSizingNeeded &&
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra ?
					boxModelAdjustment(
						elem,
						dimension,
						extra,
						isBorderBox,
						styles
					) :
					0;

			// Account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			if ( isBorderBox && scrollboxSizeBuggy ) {
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 && (
					jQuery.cssHooks[ tween.prop ] ||
					tween.elem.style[ finalPropName( tween.prop ) ] != null ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = Date.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 15
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY and Edge just mirrors
		// the overflowX value there.
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( _i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = Date.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( _i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isValidValue = type === "string" || Array.isArray( value );

		if ( typeof stateVal === "boolean" && isValidValue ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( isValidValue ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = classesToArray( value );

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueIsFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		valueIsFunction = isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( valueIsFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


support.focusin = "onfocusin" in window;


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	stopPropagationCallback = function( e ) {
		e.stopPropagation();
	};

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = lastElement = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
			lastElement = cur;
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = (
					dataPriv.get( cur, "events" ) || Object.create( null )
				)[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;

					if ( event.isPropagationStopped() ) {
						lastElement.addEventListener( type, stopPropagationCallback );
					}

					elem[ type ]();

					if ( event.isPropagationStopped() ) {
						lastElement.removeEventListener( type, stopPropagationCallback );
					}

					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {

				// Handle: regular nodes (via `this.ownerDocument`), window
				// (via `this.document`) & document (via `this`).
				var doc = this.ownerDocument || this.document || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this.document || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = { guid: Date.now() };

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && toType( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	if ( a == null ) {
		return "";
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( _i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() + " " ] =
									( responseHeaders[ match[ 1 ].toLowerCase() + " " ] || [] )
										.concat( match[ 2 ] );
							}
						}
						match = responseHeaders[ key.toLowerCase() + " " ];
					}
					return match == null ? null : match.join( ", " );
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 15
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available and should be processed, append data to url
			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce.guid++ ) +
					uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Use a noop converter for missing script
			if ( !isSuccess && jQuery.inArray( "script", s.dataTypes ) > -1 ) {
				s.converters[ "text script" ] = function() {};
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( _i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );

jQuery.ajaxPrefilter( function( s ) {
	var i;
	for ( i in s.headers ) {
		if ( i.toLowerCase() === "content-type" ) {
			s.contentType = s.headers[ i ] || "";
		}
	}
} );


jQuery._evalUrl = function( url, options, doc ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,

		// Only evaluate the response if it is successful (gh-4126)
		// dataFilter is not invoked for failure responses, so using it instead
		// of the default converter is kludgy but it works.
		converters: {
			"text script": function() {}
		},
		dataFilter: function( response ) {
			jQuery.globalEval( response, options, doc );
		}
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var htmlIsFunction = isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.ontimeout =
									xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain or forced-by-attrs requests
	if ( s.crossDomain || s.scriptAttrs ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" )
					.attr( s.scriptAttrs || {} )
					.prop( { charset: s.scriptCharset, src: s.url } )
					.on( "load error", callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					} );

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce.guid++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			if ( typeof props.top === "number" ) {
				props.top += "px";
			}
			if ( typeof props.left === "number" ) {
				props.left += "px";
			}
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume position:fixed implies availability of getBoundingClientRect
			offset = elem.getBoundingClientRect();

		} else {
			offset = this.offset();

			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// Incorporate borders into its offset, since they are outside its content origin
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( _i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( _i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );

jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( _i, name ) {

		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	} );




// Support: Android <=4.0 only
// Make sure we trim BOM and NBSP
var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	return proxy;
};

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;

jQuery.now = Date.now;

jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jQuery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN( obj - parseFloat( obj ) );
};

jQuery.trim = function( text ) {
	return text == null ?
		"" :
		( text + "" ).replace( rtrim, "" );
};



// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( typeof noGlobal === "undefined" ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );

},{"process":"C:/Users/TOP/AppData/Roaming/npm/node_modules/parcel-bundler/node_modules/process/browser.js"}],"node_modules/moment/src/lib/utils/hooks.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hooks = hooks;
exports.setHookCallback = setHookCallback;
var hookCallback;

function hooks() {
  return hookCallback.apply(null, arguments);
} // This is done to register the method called with moment()
// without creating circular dependencies.


function setHookCallback(callback) {
  hookCallback = callback;
}
},{}],"node_modules/moment/src/lib/utils/is-array.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isArray;

function isArray(input) {
  return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
}
},{}],"node_modules/moment/src/lib/utils/is-object.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isObject;

function isObject(input) {
  // IE8 will treat undefined and null as object if it wasn't for
  // input != null
  return input != null && Object.prototype.toString.call(input) === '[object Object]';
}
},{}],"node_modules/moment/src/lib/utils/has-own-prop.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = hasOwnProp;

function hasOwnProp(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b);
}
},{}],"node_modules/moment/src/lib/utils/is-object-empty.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isObjectEmpty;

var _hasOwnProp = _interopRequireDefault(require("./has-own-prop"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isObjectEmpty(obj) {
  if (Object.getOwnPropertyNames) {
    return Object.getOwnPropertyNames(obj).length === 0;
  } else {
    var k;

    for (k in obj) {
      if ((0, _hasOwnProp.default)(obj, k)) {
        return false;
      }
    }

    return true;
  }
}
},{"./has-own-prop":"node_modules/moment/src/lib/utils/has-own-prop.js"}],"node_modules/moment/src/lib/utils/is-undefined.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isUndefined;

function isUndefined(input) {
  return input === void 0;
}
},{}],"node_modules/moment/src/lib/utils/is-number.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isNumber;

function isNumber(input) {
  return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
}
},{}],"node_modules/moment/src/lib/utils/is-date.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isDate;

function isDate(input) {
  return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
}
},{}],"node_modules/moment/src/lib/utils/map.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = map;

function map(arr, fn) {
  var res = [],
      i;

  for (i = 0; i < arr.length; ++i) {
    res.push(fn(arr[i], i));
  }

  return res;
}
},{}],"node_modules/moment/src/lib/utils/extend.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extend;

var _hasOwnProp = _interopRequireDefault(require("./has-own-prop"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function extend(a, b) {
  for (var i in b) {
    if ((0, _hasOwnProp.default)(b, i)) {
      a[i] = b[i];
    }
  }

  if ((0, _hasOwnProp.default)(b, 'toString')) {
    a.toString = b.toString;
  }

  if ((0, _hasOwnProp.default)(b, 'valueOf')) {
    a.valueOf = b.valueOf;
  }

  return a;
}
},{"./has-own-prop":"node_modules/moment/src/lib/utils/has-own-prop.js"}],"node_modules/moment/src/lib/create/utc.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUTC = createUTC;

var _fromAnything = require("./from-anything");

function createUTC(input, format, locale, strict) {
  return (0, _fromAnything.createLocalOrUTC)(input, format, locale, strict, true).utc();
}
},{"./from-anything":"node_modules/moment/src/lib/create/from-anything.js"}],"node_modules/moment/src/lib/create/parsing-flags.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getParsingFlags;

function defaultParsingFlags() {
  // We need to deep clone this object.
  return {
    empty: false,
    unusedTokens: [],
    unusedInput: [],
    overflow: -2,
    charsLeftOver: 0,
    nullInput: false,
    invalidEra: null,
    invalidMonth: null,
    invalidFormat: false,
    userInvalidated: false,
    iso: false,
    parsedDateParts: [],
    era: null,
    meridiem: null,
    rfc2822: false,
    weekdayMismatch: false
  };
}

function getParsingFlags(m) {
  if (m._pf == null) {
    m._pf = defaultParsingFlags();
  }

  return m._pf;
}
},{}],"node_modules/moment/src/lib/utils/some.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var some;
exports.default = some;

if (Array.prototype.some) {
  exports.default = some = Array.prototype.some;
} else {
  exports.default = some = function (fun) {
    var t = Object(this),
        len = t.length >>> 0,
        i;

    for (i = 0; i < len; i++) {
      if (i in t && fun.call(this, t[i], i, t)) {
        return true;
      }
    }

    return false;
  };
}
},{}],"node_modules/moment/src/lib/create/valid.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValid = isValid;
exports.createInvalid = createInvalid;

var _extend = _interopRequireDefault(require("../utils/extend"));

var _utc = require("./utc");

var _parsingFlags = _interopRequireDefault(require("../create/parsing-flags"));

var _some = _interopRequireDefault(require("../utils/some"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isValid(m) {
  if (m._isValid == null) {
    var flags = (0, _parsingFlags.default)(m),
        parsedParts = _some.default.call(flags.parsedDateParts, function (i) {
      return i != null;
    }),
        isNowValid = !isNaN(m._d.getTime()) && flags.overflow < 0 && !flags.empty && !flags.invalidEra && !flags.invalidMonth && !flags.invalidWeekday && !flags.weekdayMismatch && !flags.nullInput && !flags.invalidFormat && !flags.userInvalidated && (!flags.meridiem || flags.meridiem && parsedParts);

    if (m._strict) {
      isNowValid = isNowValid && flags.charsLeftOver === 0 && flags.unusedTokens.length === 0 && flags.bigHour === undefined;
    }

    if (Object.isFrozen == null || !Object.isFrozen(m)) {
      m._isValid = isNowValid;
    } else {
      return isNowValid;
    }
  }

  return m._isValid;
}

function createInvalid(flags) {
  var m = (0, _utc.createUTC)(NaN);

  if (flags != null) {
    (0, _extend.default)((0, _parsingFlags.default)(m), flags);
  } else {
    (0, _parsingFlags.default)(m).userInvalidated = true;
  }

  return m;
}
},{"../utils/extend":"node_modules/moment/src/lib/utils/extend.js","./utc":"node_modules/moment/src/lib/create/utc.js","../create/parsing-flags":"node_modules/moment/src/lib/create/parsing-flags.js","../utils/some":"node_modules/moment/src/lib/utils/some.js"}],"node_modules/moment/src/lib/moment/constructor.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copyConfig = copyConfig;
exports.Moment = Moment;
exports.isMoment = isMoment;

var _hooks = require("../utils/hooks");

var _isUndefined = _interopRequireDefault(require("../utils/is-undefined"));

var _parsingFlags = _interopRequireDefault(require("../create/parsing-flags"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Plugins that add properties should also add the key here (null value),
// so we can properly clone ourselves.
var momentProperties = _hooks.hooks.momentProperties = [],
    updateInProgress = false;

function copyConfig(to, from) {
  var i, prop, val;

  if (!(0, _isUndefined.default)(from._isAMomentObject)) {
    to._isAMomentObject = from._isAMomentObject;
  }

  if (!(0, _isUndefined.default)(from._i)) {
    to._i = from._i;
  }

  if (!(0, _isUndefined.default)(from._f)) {
    to._f = from._f;
  }

  if (!(0, _isUndefined.default)(from._l)) {
    to._l = from._l;
  }

  if (!(0, _isUndefined.default)(from._strict)) {
    to._strict = from._strict;
  }

  if (!(0, _isUndefined.default)(from._tzm)) {
    to._tzm = from._tzm;
  }

  if (!(0, _isUndefined.default)(from._isUTC)) {
    to._isUTC = from._isUTC;
  }

  if (!(0, _isUndefined.default)(from._offset)) {
    to._offset = from._offset;
  }

  if (!(0, _isUndefined.default)(from._pf)) {
    to._pf = (0, _parsingFlags.default)(from);
  }

  if (!(0, _isUndefined.default)(from._locale)) {
    to._locale = from._locale;
  }

  if (momentProperties.length > 0) {
    for (i = 0; i < momentProperties.length; i++) {
      prop = momentProperties[i];
      val = from[prop];

      if (!(0, _isUndefined.default)(val)) {
        to[prop] = val;
      }
    }
  }

  return to;
} // Moment prototype object


function Moment(config) {
  copyConfig(this, config);
  this._d = new Date(config._d != null ? config._d.getTime() : NaN);

  if (!this.isValid()) {
    this._d = new Date(NaN);
  } // Prevent infinite loop in case updateOffset creates new moment
  // objects.


  if (updateInProgress === false) {
    updateInProgress = true;

    _hooks.hooks.updateOffset(this);

    updateInProgress = false;
  }
}

function isMoment(obj) {
  return obj instanceof Moment || obj != null && obj._isAMomentObject != null;
}
},{"../utils/hooks":"node_modules/moment/src/lib/utils/hooks.js","../utils/is-undefined":"node_modules/moment/src/lib/utils/is-undefined.js","../create/parsing-flags":"node_modules/moment/src/lib/create/parsing-flags.js"}],"node_modules/moment/src/lib/utils/deprecate.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deprecate = deprecate;
exports.deprecateSimple = deprecateSimple;

var _extend = _interopRequireDefault(require("./extend"));

var _hooks = require("./hooks");

var _hasOwnProp = _interopRequireDefault(require("./has-own-prop"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function warn(msg) {
  if (_hooks.hooks.suppressDeprecationWarnings === false && typeof console !== 'undefined' && console.warn) {
    console.warn('Deprecation warning: ' + msg);
  }
}

function deprecate(msg, fn) {
  var firstTime = true;
  return (0, _extend.default)(function () {
    if (_hooks.hooks.deprecationHandler != null) {
      _hooks.hooks.deprecationHandler(null, msg);
    }

    if (firstTime) {
      var args = [],
          arg,
          i,
          key;

      for (i = 0; i < arguments.length; i++) {
        arg = '';

        if (typeof arguments[i] === 'object') {
          arg += '\n[' + i + '] ';

          for (key in arguments[0]) {
            if ((0, _hasOwnProp.default)(arguments[0], key)) {
              arg += key + ': ' + arguments[0][key] + ', ';
            }
          }

          arg = arg.slice(0, -2); // Remove trailing comma and space
        } else {
          arg = arguments[i];
        }

        args.push(arg);
      }

      warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + new Error().stack);
      firstTime = false;
    }

    return fn.apply(this, arguments);
  }, fn);
}

var deprecations = {};

function deprecateSimple(name, msg) {
  if (_hooks.hooks.deprecationHandler != null) {
    _hooks.hooks.deprecationHandler(name, msg);
  }

  if (!deprecations[name]) {
    warn(msg);
    deprecations[name] = true;
  }
}

_hooks.hooks.suppressDeprecationWarnings = false;
_hooks.hooks.deprecationHandler = null;
},{"./extend":"node_modules/moment/src/lib/utils/extend.js","./hooks":"node_modules/moment/src/lib/utils/hooks.js","./has-own-prop":"node_modules/moment/src/lib/utils/has-own-prop.js"}],"node_modules/moment/src/lib/utils/is-function.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isFunction;

function isFunction(input) {
  return typeof Function !== 'undefined' && input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
}
},{}],"node_modules/moment/src/lib/locale/set.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.set = set;
exports.mergeConfigs = mergeConfigs;

var _isFunction = _interopRequireDefault(require("../utils/is-function"));

var _extend = _interopRequireDefault(require("../utils/extend"));

var _isObject = _interopRequireDefault(require("../utils/is-object"));

var _hasOwnProp = _interopRequireDefault(require("../utils/has-own-prop"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function set(config) {
  var prop, i;

  for (i in config) {
    if ((0, _hasOwnProp.default)(config, i)) {
      prop = config[i];

      if ((0, _isFunction.default)(prop)) {
        this[i] = prop;
      } else {
        this['_' + i] = prop;
      }
    }
  }

  this._config = config; // Lenient ordinal parsing accepts just a number in addition to
  // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
  // TODO: Remove "ordinalParse" fallback in next major release.

  this._dayOfMonthOrdinalParseLenient = new RegExp((this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + '|' + /\d{1,2}/.source);
}

function mergeConfigs(parentConfig, childConfig) {
  var res = (0, _extend.default)({}, parentConfig),
      prop;

  for (prop in childConfig) {
    if ((0, _hasOwnProp.default)(childConfig, prop)) {
      if ((0, _isObject.default)(parentConfig[prop]) && (0, _isObject.default)(childConfig[prop])) {
        res[prop] = {};
        (0, _extend.default)(res[prop], parentConfig[prop]);
        (0, _extend.default)(res[prop], childConfig[prop]);
      } else if (childConfig[prop] != null) {
        res[prop] = childConfig[prop];
      } else {
        delete res[prop];
      }
    }
  }

  for (prop in parentConfig) {
    if ((0, _hasOwnProp.default)(parentConfig, prop) && !(0, _hasOwnProp.default)(childConfig, prop) && (0, _isObject.default)(parentConfig[prop])) {
      // make sure changes to properties don't modify parent config
      res[prop] = (0, _extend.default)({}, res[prop]);
    }
  }

  return res;
}
},{"../utils/is-function":"node_modules/moment/src/lib/utils/is-function.js","../utils/extend":"node_modules/moment/src/lib/utils/extend.js","../utils/is-object":"node_modules/moment/src/lib/utils/is-object.js","../utils/has-own-prop":"node_modules/moment/src/lib/utils/has-own-prop.js"}],"node_modules/moment/src/lib/locale/constructor.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Locale = Locale;

function Locale(config) {
  if (config != null) {
    this.set(config);
  }
}
},{}],"node_modules/moment/src/lib/utils/keys.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _hasOwnProp = _interopRequireDefault(require("./has-own-prop"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var keys;
exports.default = keys;

if (Object.keys) {
  exports.default = keys = Object.keys;
} else {
  exports.default = keys = function (obj) {
    var i,
        res = [];

    for (i in obj) {
      if ((0, _hasOwnProp.default)(obj, i)) {
        res.push(i);
      }
    }

    return res;
  };
}
},{"./has-own-prop":"node_modules/moment/src/lib/utils/has-own-prop.js"}],"node_modules/moment/src/lib/locale/calendar.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calendar = calendar;
exports.defaultCalendar = void 0;

var _isFunction = _interopRequireDefault(require("../utils/is-function"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultCalendar = {
  sameDay: '[Today at] LT',
  nextDay: '[Tomorrow at] LT',
  nextWeek: 'dddd [at] LT',
  lastDay: '[Yesterday at] LT',
  lastWeek: '[Last] dddd [at] LT',
  sameElse: 'L'
};
exports.defaultCalendar = defaultCalendar;

function calendar(key, mom, now) {
  var output = this._calendar[key] || this._calendar['sameElse'];
  return (0, _isFunction.default)(output) ? output.call(mom, now) : output;
}
},{"../utils/is-function":"node_modules/moment/src/lib/utils/is-function.js"}],"node_modules/moment/src/lib/utils/zero-fill.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = zeroFill;

function zeroFill(number, targetLength, forceSign) {
  var absNumber = '' + Math.abs(number),
      zerosToFill = targetLength - absNumber.length,
      sign = number >= 0;
  return (sign ? forceSign ? '+' : '' : '-') + Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
}
},{}],"node_modules/moment/src/lib/format/format.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addFormatToken = addFormatToken;
exports.formatMoment = formatMoment;
exports.expandFormat = expandFormat;
exports.formatTokenFunctions = exports.formattingTokens = void 0;

var _zeroFill = _interopRequireDefault(require("../utils/zero-fill"));

var _isFunction = _interopRequireDefault(require("../utils/is-function"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
    localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
    formatFunctions = {},
    formatTokenFunctions = {};
exports.formatTokenFunctions = formatTokenFunctions;
exports.formattingTokens = formattingTokens;

// token:    'M'
// padded:   ['MM', 2]
// ordinal:  'Mo'
// callback: function () { this.month() + 1 }
function addFormatToken(token, padded, ordinal, callback) {
  var func = callback;

  if (typeof callback === 'string') {
    func = function () {
      return this[callback]();
    };
  }

  if (token) {
    formatTokenFunctions[token] = func;
  }

  if (padded) {
    formatTokenFunctions[padded[0]] = function () {
      return (0, _zeroFill.default)(func.apply(this, arguments), padded[1], padded[2]);
    };
  }

  if (ordinal) {
    formatTokenFunctions[ordinal] = function () {
      return this.localeData().ordinal(func.apply(this, arguments), token);
    };
  }
}

function removeFormattingTokens(input) {
  if (input.match(/\[[\s\S]/)) {
    return input.replace(/^\[|\]$/g, '');
  }

  return input.replace(/\\/g, '');
}

function makeFormatFunction(format) {
  var array = format.match(formattingTokens),
      i,
      length;

  for (i = 0, length = array.length; i < length; i++) {
    if (formatTokenFunctions[array[i]]) {
      array[i] = formatTokenFunctions[array[i]];
    } else {
      array[i] = removeFormattingTokens(array[i]);
    }
  }

  return function (mom) {
    var output = '',
        i;

    for (i = 0; i < length; i++) {
      output += (0, _isFunction.default)(array[i]) ? array[i].call(mom, format) : array[i];
    }

    return output;
  };
} // format date using native date object


function formatMoment(m, format) {
  if (!m.isValid()) {
    return m.localeData().invalidDate();
  }

  format = expandFormat(format, m.localeData());
  formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);
  return formatFunctions[format](m);
}

function expandFormat(format, locale) {
  var i = 5;

  function replaceLongDateFormatTokens(input) {
    return locale.longDateFormat(input) || input;
  }

  localFormattingTokens.lastIndex = 0;

  while (i >= 0 && localFormattingTokens.test(format)) {
    format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
    localFormattingTokens.lastIndex = 0;
    i -= 1;
  }

  return format;
}
},{"../utils/zero-fill":"node_modules/moment/src/lib/utils/zero-fill.js","../utils/is-function":"node_modules/moment/src/lib/utils/is-function.js"}],"node_modules/moment/src/lib/locale/formats.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.longDateFormat = longDateFormat;
exports.defaultLongDateFormat = void 0;

var _format = require("../format/format");

var defaultLongDateFormat = {
  LTS: 'h:mm:ss A',
  LT: 'h:mm A',
  L: 'MM/DD/YYYY',
  LL: 'MMMM D, YYYY',
  LLL: 'MMMM D, YYYY h:mm A',
  LLLL: 'dddd, MMMM D, YYYY h:mm A'
};
exports.defaultLongDateFormat = defaultLongDateFormat;

function longDateFormat(key) {
  var format = this._longDateFormat[key],
      formatUpper = this._longDateFormat[key.toUpperCase()];

  if (format || !formatUpper) {
    return format;
  }

  this._longDateFormat[key] = formatUpper.match(_format.formattingTokens).map(function (tok) {
    if (tok === 'MMMM' || tok === 'MM' || tok === 'DD' || tok === 'dddd') {
      return tok.slice(1);
    }

    return tok;
  }).join('');
  return this._longDateFormat[key];
}
},{"../format/format":"node_modules/moment/src/lib/format/format.js"}],"node_modules/moment/src/lib/locale/invalid.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.invalidDate = invalidDate;
exports.defaultInvalidDate = void 0;
var defaultInvalidDate = 'Invalid date';
exports.defaultInvalidDate = defaultInvalidDate;

function invalidDate() {
  return this._invalidDate;
}
},{}],"node_modules/moment/src/lib/locale/ordinal.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ordinal = ordinal;
exports.defaultDayOfMonthOrdinalParse = exports.defaultOrdinal = void 0;
var defaultOrdinal = '%d',
    defaultDayOfMonthOrdinalParse = /\d{1,2}/;
exports.defaultDayOfMonthOrdinalParse = defaultDayOfMonthOrdinalParse;
exports.defaultOrdinal = defaultOrdinal;

function ordinal(number) {
  return this._ordinal.replace('%d', number);
}
},{}],"node_modules/moment/src/lib/locale/relative.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.relativeTime = relativeTime;
exports.pastFuture = pastFuture;
exports.defaultRelativeTime = void 0;

var _isFunction = _interopRequireDefault(require("../utils/is-function"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultRelativeTime = {
  future: 'in %s',
  past: '%s ago',
  s: 'a few seconds',
  ss: '%d seconds',
  m: 'a minute',
  mm: '%d minutes',
  h: 'an hour',
  hh: '%d hours',
  d: 'a day',
  dd: '%d days',
  w: 'a week',
  ww: '%d weeks',
  M: 'a month',
  MM: '%d months',
  y: 'a year',
  yy: '%d years'
};
exports.defaultRelativeTime = defaultRelativeTime;

function relativeTime(number, withoutSuffix, string, isFuture) {
  var output = this._relativeTime[string];
  return (0, _isFunction.default)(output) ? output(number, withoutSuffix, string, isFuture) : output.replace(/%d/i, number);
}

function pastFuture(diff, output) {
  var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
  return (0, _isFunction.default)(format) ? format(output) : format.replace(/%s/i, output);
}
},{"../utils/is-function":"node_modules/moment/src/lib/utils/is-function.js"}],"node_modules/moment/src/lib/units/aliases.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addUnitAlias = addUnitAlias;
exports.normalizeUnits = normalizeUnits;
exports.normalizeObjectUnits = normalizeObjectUnits;

var _hasOwnProp = _interopRequireDefault(require("../utils/has-own-prop"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var aliases = {};

function addUnitAlias(unit, shorthand) {
  var lowerCase = unit.toLowerCase();
  aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
}

function normalizeUnits(units) {
  return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
}

function normalizeObjectUnits(inputObject) {
  var normalizedInput = {},
      normalizedProp,
      prop;

  for (prop in inputObject) {
    if ((0, _hasOwnProp.default)(inputObject, prop)) {
      normalizedProp = normalizeUnits(prop);

      if (normalizedProp) {
        normalizedInput[normalizedProp] = inputObject[prop];
      }
    }
  }

  return normalizedInput;
}
},{"../utils/has-own-prop":"node_modules/moment/src/lib/utils/has-own-prop.js"}],"node_modules/moment/src/lib/units/priorities.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addUnitPriority = addUnitPriority;
exports.getPrioritizedUnits = getPrioritizedUnits;

var _hasOwnProp = _interopRequireDefault(require("../utils/has-own-prop"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var priorities = {};

function addUnitPriority(unit, priority) {
  priorities[unit] = priority;
}

function getPrioritizedUnits(unitsObj) {
  var units = [],
      u;

  for (u in unitsObj) {
    if ((0, _hasOwnProp.default)(unitsObj, u)) {
      units.push({
        unit: u,
        priority: priorities[u]
      });
    }
  }

  units.sort(function (a, b) {
    return a.priority - b.priority;
  });
  return units;
}
},{"../utils/has-own-prop":"node_modules/moment/src/lib/utils/has-own-prop.js"}],"node_modules/moment/src/lib/utils/is-leap-year.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isLeapYear = isLeapYear;

function isLeapYear(year) {
  return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
}
},{}],"node_modules/moment/src/lib/utils/abs-floor.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = absFloor;

function absFloor(number) {
  if (number < 0) {
    // -0 -> 0
    return Math.ceil(number) || 0;
  } else {
    return Math.floor(number);
  }
}
},{}],"node_modules/moment/src/lib/utils/to-int.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toInt;

var _absFloor = _interopRequireDefault(require("./abs-floor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function toInt(argumentForCoercion) {
  var coercedNumber = +argumentForCoercion,
      value = 0;

  if (coercedNumber !== 0 && isFinite(coercedNumber)) {
    value = (0, _absFloor.default)(coercedNumber);
  }

  return value;
}
},{"./abs-floor":"node_modules/moment/src/lib/utils/abs-floor.js"}],"node_modules/moment/src/lib/moment/get-set.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeGetSet = makeGetSet;
exports.get = get;
exports.set = set;
exports.stringGet = stringGet;
exports.stringSet = stringSet;

var _aliases = require("../units/aliases");

var _priorities = require("../units/priorities");

var _hooks = require("../utils/hooks");

var _isFunction = _interopRequireDefault(require("../utils/is-function"));

var _month = require("../units/month");

var _isLeapYear = require("../utils/is-leap-year");

var _toInt = _interopRequireDefault(require("../utils/to-int"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeGetSet(unit, keepTime) {
  return function (value) {
    if (value != null) {
      set(this, unit, value);

      _hooks.hooks.updateOffset(this, keepTime);

      return this;
    } else {
      return get(this, unit);
    }
  };
}

function get(mom, unit) {
  return mom.isValid() ? mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
}

function set(mom, unit, value) {
  if (mom.isValid() && !isNaN(value)) {
    if (unit === 'FullYear' && (0, _isLeapYear.isLeapYear)(mom.year()) && mom.month() === 1 && mom.date() === 29) {
      value = (0, _toInt.default)(value);

      mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value, mom.month(), (0, _month.daysInMonth)(value, mom.month()));
    } else {
      mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
    }
  }
} // MOMENTS


function stringGet(units) {
  units = (0, _aliases.normalizeUnits)(units);

  if ((0, _isFunction.default)(this[units])) {
    return this[units]();
  }

  return this;
}

function stringSet(units, value) {
  if (typeof units === 'object') {
    units = (0, _aliases.normalizeObjectUnits)(units);
    var prioritized = (0, _priorities.getPrioritizedUnits)(units),
        i;

    for (i = 0; i < prioritized.length; i++) {
      this[prioritized[i].unit](units[prioritized[i].unit]);
    }
  } else {
    units = (0, _aliases.normalizeUnits)(units);

    if ((0, _isFunction.default)(this[units])) {
      return this[units](value);
    }
  }

  return this;
}
},{"../units/aliases":"node_modules/moment/src/lib/units/aliases.js","../units/priorities":"node_modules/moment/src/lib/units/priorities.js","../utils/hooks":"node_modules/moment/src/lib/utils/hooks.js","../utils/is-function":"node_modules/moment/src/lib/utils/is-function.js","../units/month":"node_modules/moment/src/lib/units/month.js","../utils/is-leap-year":"node_modules/moment/src/lib/utils/is-leap-year.js","../utils/to-int":"node_modules/moment/src/lib/utils/to-int.js"}],"node_modules/moment/src/lib/parse/regex.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addRegexToken = addRegexToken;
exports.getParseRegexForToken = getParseRegexForToken;
exports.regexEscape = regexEscape;
exports.matchWord = exports.matchTimestamp = exports.matchShortOffset = exports.matchOffset = exports.matchSigned = exports.matchUnsigned = exports.match1to6 = exports.match1to4 = exports.match1to3 = exports.match5to6 = exports.match3to4 = exports.match1to2 = exports.match6 = exports.match4 = exports.match3 = exports.match2 = exports.match1 = void 0;

var _hasOwnProp = _interopRequireDefault(require("../utils/has-own-prop"));

var _isFunction = _interopRequireDefault(require("../utils/is-function"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var match1 = /\d/,
    //       0 - 9
match2 = /\d\d/,
    //      00 - 99
match3 = /\d{3}/,
    //     000 - 999
match4 = /\d{4}/,
    //    0000 - 9999
match6 = /[+-]?\d{6}/,
    // -999999 - 999999
match1to2 = /\d\d?/,
    //       0 - 99
match3to4 = /\d\d\d\d?/,
    //     999 - 9999
match5to6 = /\d\d\d\d\d\d?/,
    //   99999 - 999999
match1to3 = /\d{1,3}/,
    //       0 - 999
match1to4 = /\d{1,4}/,
    //       0 - 9999
match1to6 = /[+-]?\d{1,6}/,
    // -999999 - 999999
matchUnsigned = /\d+/,
    //       0 - inf
matchSigned = /[+-]?\d+/,
    //    -inf - inf
matchOffset = /Z|[+-]\d\d:?\d\d/gi,
    // +00:00 -00:00 +0000 -0000 or Z
matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi,
    // +00 -00 +00:00 -00:00 +0000 -0000 or Z
matchTimestamp = /[+-]?\d+(\.\d{1,3})?/,
    // 123456789 123456789.123
// any word (or two) characters or numbers including two/three word month in arabic.
// includes scottish gaelic two word and hyphenated months
matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i,
    regexes;
exports.matchWord = matchWord;
exports.matchTimestamp = matchTimestamp;
exports.matchShortOffset = matchShortOffset;
exports.matchOffset = matchOffset;
exports.matchSigned = matchSigned;
exports.matchUnsigned = matchUnsigned;
exports.match1to6 = match1to6;
exports.match1to4 = match1to4;
exports.match1to3 = match1to3;
exports.match5to6 = match5to6;
exports.match3to4 = match3to4;
exports.match1to2 = match1to2;
exports.match6 = match6;
exports.match4 = match4;
exports.match3 = match3;
exports.match2 = match2;
exports.match1 = match1;
regexes = {};

function addRegexToken(token, regex, strictRegex) {
  regexes[token] = (0, _isFunction.default)(regex) ? regex : function (isStrict, localeData) {
    return isStrict && strictRegex ? strictRegex : regex;
  };
}

function getParseRegexForToken(token, config) {
  if (!(0, _hasOwnProp.default)(regexes, token)) {
    return new RegExp(unescapeFormat(token));
  }

  return regexes[token](config._strict, config._locale);
} // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript


function unescapeFormat(s) {
  return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
    return p1 || p2 || p3 || p4;
  }));
}

function regexEscape(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
},{"../utils/has-own-prop":"node_modules/moment/src/lib/utils/has-own-prop.js","../utils/is-function":"node_modules/moment/src/lib/utils/is-function.js"}],"node_modules/moment/src/lib/parse/token.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addParseToken = addParseToken;
exports.addWeekParseToken = addWeekParseToken;
exports.addTimeToArrayFromToken = addTimeToArrayFromToken;

var _hasOwnProp = _interopRequireDefault(require("../utils/has-own-prop"));

var _isNumber = _interopRequireDefault(require("../utils/is-number"));

var _toInt = _interopRequireDefault(require("../utils/to-int"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tokens = {};

function addParseToken(token, callback) {
  var i,
      func = callback;

  if (typeof token === 'string') {
    token = [token];
  }

  if ((0, _isNumber.default)(callback)) {
    func = function (input, array) {
      array[callback] = (0, _toInt.default)(input);
    };
  }

  for (i = 0; i < token.length; i++) {
    tokens[token[i]] = func;
  }
}

function addWeekParseToken(token, callback) {
  addParseToken(token, function (input, array, config, token) {
    config._w = config._w || {};
    callback(input, config._w, config, token);
  });
}

function addTimeToArrayFromToken(token, input, config) {
  if (input != null && (0, _hasOwnProp.default)(tokens, token)) {
    tokens[token](input, config._a, config, token);
  }
}
},{"../utils/has-own-prop":"node_modules/moment/src/lib/utils/has-own-prop.js","../utils/is-number":"node_modules/moment/src/lib/utils/is-number.js","../utils/to-int":"node_modules/moment/src/lib/utils/to-int.js"}],"node_modules/moment/src/lib/units/constants.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WEEKDAY = exports.WEEK = exports.MILLISECOND = exports.SECOND = exports.MINUTE = exports.HOUR = exports.DATE = exports.MONTH = exports.YEAR = void 0;
var YEAR = 0,
    MONTH = 1,
    DATE = 2,
    HOUR = 3,
    MINUTE = 4,
    SECOND = 5,
    MILLISECOND = 6,
    WEEK = 7,
    WEEKDAY = 8;
exports.WEEKDAY = WEEKDAY;
exports.WEEK = WEEK;
exports.MILLISECOND = MILLISECOND;
exports.SECOND = SECOND;
exports.MINUTE = MINUTE;
exports.HOUR = HOUR;
exports.DATE = DATE;
exports.MONTH = MONTH;
exports.YEAR = YEAR;
},{}],"node_modules/moment/src/lib/utils/mod.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mod;

function mod(n, x) {
  return (n % x + x) % x;
}
},{}],"node_modules/moment/src/lib/utils/index-of.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var indexOf;
exports.default = indexOf;

if (Array.prototype.indexOf) {
  exports.default = indexOf = Array.prototype.indexOf;
} else {
  exports.default = indexOf = function (o) {
    // I know
    var i;

    for (i = 0; i < this.length; ++i) {
      if (this[i] === o) {
        return i;
      }
    }

    return -1;
  };
}
},{}],"node_modules/moment/src/lib/units/month.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.daysInMonth = daysInMonth;
exports.localeMonths = localeMonths;
exports.localeMonthsShort = localeMonthsShort;
exports.localeMonthsParse = localeMonthsParse;
exports.setMonth = setMonth;
exports.getSetMonth = getSetMonth;
exports.getDaysInMonth = getDaysInMonth;
exports.monthsShortRegex = monthsShortRegex;
exports.monthsRegex = monthsRegex;
exports.defaultLocaleMonthsShort = exports.defaultLocaleMonths = void 0;

var _getSet = require("../moment/get-set");

var _hasOwnProp = _interopRequireDefault(require("../utils/has-own-prop"));

var _format = require("../format/format");

var _aliases = require("./aliases");

var _priorities = require("./priorities");

var _regex = require("../parse/regex");

var _token = require("../parse/token");

var _hooks = require("../utils/hooks");

var _constants = require("./constants");

var _toInt = _interopRequireDefault(require("../utils/to-int"));

var _isArray = _interopRequireDefault(require("../utils/is-array"));

var _isNumber = _interopRequireDefault(require("../utils/is-number"));

var _mod = _interopRequireDefault(require("../utils/mod"));

var _indexOf = _interopRequireDefault(require("../utils/index-of"));

var _utc = require("../create/utc");

var _parsingFlags = _interopRequireDefault(require("../create/parsing-flags"));

var _isLeapYear = require("../utils/is-leap-year");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function daysInMonth(year, month) {
  if (isNaN(year) || isNaN(month)) {
    return NaN;
  }

  var modMonth = (0, _mod.default)(month, 12);
  year += (month - modMonth) / 12;
  return modMonth === 1 ? (0, _isLeapYear.isLeapYear)(year) ? 29 : 28 : 31 - modMonth % 7 % 2;
} // FORMATTING


(0, _format.addFormatToken)('M', ['MM', 2], 'Mo', function () {
  return this.month() + 1;
});
(0, _format.addFormatToken)('MMM', 0, 0, function (format) {
  return this.localeData().monthsShort(this, format);
});
(0, _format.addFormatToken)('MMMM', 0, 0, function (format) {
  return this.localeData().months(this, format);
}); // ALIASES

(0, _aliases.addUnitAlias)('month', 'M'); // PRIORITY

(0, _priorities.addUnitPriority)('month', 8); // PARSING

(0, _regex.addRegexToken)('M', _regex.match1to2);
(0, _regex.addRegexToken)('MM', _regex.match1to2, _regex.match2);
(0, _regex.addRegexToken)('MMM', function (isStrict, locale) {
  return locale.monthsShortRegex(isStrict);
});
(0, _regex.addRegexToken)('MMMM', function (isStrict, locale) {
  return locale.monthsRegex(isStrict);
});
(0, _token.addParseToken)(['M', 'MM'], function (input, array) {
  array[_constants.MONTH] = (0, _toInt.default)(input) - 1;
});
(0, _token.addParseToken)(['MMM', 'MMMM'], function (input, array, config, token) {
  var month = config._locale.monthsParse(input, token, config._strict); // if we didn't find a month name, mark the date as invalid.


  if (month != null) {
    array[_constants.MONTH] = month;
  } else {
    (0, _parsingFlags.default)(config).invalidMonth = input;
  }
}); // LOCALES

var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_'),
    defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_'),
    MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
    defaultMonthsShortRegex = _regex.matchWord,
    defaultMonthsRegex = _regex.matchWord;
exports.defaultLocaleMonthsShort = defaultLocaleMonthsShort;
exports.defaultLocaleMonths = defaultLocaleMonths;

function localeMonths(m, format) {
  if (!m) {
    return (0, _isArray.default)(this._months) ? this._months : this._months['standalone'];
  }

  return (0, _isArray.default)(this._months) ? this._months[m.month()] : this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
}

function localeMonthsShort(m, format) {
  if (!m) {
    return (0, _isArray.default)(this._monthsShort) ? this._monthsShort : this._monthsShort['standalone'];
  }

  return (0, _isArray.default)(this._monthsShort) ? this._monthsShort[m.month()] : this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
}

function handleStrictParse(monthName, format, strict) {
  var i,
      ii,
      mom,
      llc = monthName.toLocaleLowerCase();

  if (!this._monthsParse) {
    // this is not used
    this._monthsParse = [];
    this._longMonthsParse = [];
    this._shortMonthsParse = [];

    for (i = 0; i < 12; ++i) {
      mom = (0, _utc.createUTC)([2000, i]);
      this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
      this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
    }
  }

  if (strict) {
    if (format === 'MMM') {
      ii = _indexOf.default.call(this._shortMonthsParse, llc);
      return ii !== -1 ? ii : null;
    } else {
      ii = _indexOf.default.call(this._longMonthsParse, llc);
      return ii !== -1 ? ii : null;
    }
  } else {
    if (format === 'MMM') {
      ii = _indexOf.default.call(this._shortMonthsParse, llc);

      if (ii !== -1) {
        return ii;
      }

      ii = _indexOf.default.call(this._longMonthsParse, llc);
      return ii !== -1 ? ii : null;
    } else {
      ii = _indexOf.default.call(this._longMonthsParse, llc);

      if (ii !== -1) {
        return ii;
      }

      ii = _indexOf.default.call(this._shortMonthsParse, llc);
      return ii !== -1 ? ii : null;
    }
  }
}

function localeMonthsParse(monthName, format, strict) {
  var i, mom, regex;

  if (this._monthsParseExact) {
    return handleStrictParse.call(this, monthName, format, strict);
  }

  if (!this._monthsParse) {
    this._monthsParse = [];
    this._longMonthsParse = [];
    this._shortMonthsParse = [];
  } // TODO: add sorting
  // Sorting makes sure if one month (or abbr) is a prefix of another
  // see sorting in computeMonthsParse


  for (i = 0; i < 12; i++) {
    // make the regex if we don't have it already
    mom = (0, _utc.createUTC)([2000, i]);

    if (strict && !this._longMonthsParse[i]) {
      this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
      this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
    }

    if (!strict && !this._monthsParse[i]) {
      regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
      this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
    } // test the regex


    if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
      return i;
    } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
      return i;
    } else if (!strict && this._monthsParse[i].test(monthName)) {
      return i;
    }
  }
} // MOMENTS


function setMonth(mom, value) {
  var dayOfMonth;

  if (!mom.isValid()) {
    // No op
    return mom;
  }

  if (typeof value === 'string') {
    if (/^\d+$/.test(value)) {
      value = (0, _toInt.default)(value);
    } else {
      value = mom.localeData().monthsParse(value); // TODO: Another silent failure?

      if (!(0, _isNumber.default)(value)) {
        return mom;
      }
    }
  }

  dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));

  mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);

  return mom;
}

function getSetMonth(value) {
  if (value != null) {
    setMonth(this, value);

    _hooks.hooks.updateOffset(this, true);

    return this;
  } else {
    return (0, _getSet.get)(this, 'Month');
  }
}

function getDaysInMonth() {
  return daysInMonth(this.year(), this.month());
}

function monthsShortRegex(isStrict) {
  if (this._monthsParseExact) {
    if (!(0, _hasOwnProp.default)(this, '_monthsRegex')) {
      computeMonthsParse.call(this);
    }

    if (isStrict) {
      return this._monthsShortStrictRegex;
    } else {
      return this._monthsShortRegex;
    }
  } else {
    if (!(0, _hasOwnProp.default)(this, '_monthsShortRegex')) {
      this._monthsShortRegex = defaultMonthsShortRegex;
    }

    return this._monthsShortStrictRegex && isStrict ? this._monthsShortStrictRegex : this._monthsShortRegex;
  }
}

function monthsRegex(isStrict) {
  if (this._monthsParseExact) {
    if (!(0, _hasOwnProp.default)(this, '_monthsRegex')) {
      computeMonthsParse.call(this);
    }

    if (isStrict) {
      return this._monthsStrictRegex;
    } else {
      return this._monthsRegex;
    }
  } else {
    if (!(0, _hasOwnProp.default)(this, '_monthsRegex')) {
      this._monthsRegex = defaultMonthsRegex;
    }

    return this._monthsStrictRegex && isStrict ? this._monthsStrictRegex : this._monthsRegex;
  }
}

function computeMonthsParse() {
  function cmpLenRev(a, b) {
    return b.length - a.length;
  }

  var shortPieces = [],
      longPieces = [],
      mixedPieces = [],
      i,
      mom;

  for (i = 0; i < 12; i++) {
    // make the regex if we don't have it already
    mom = (0, _utc.createUTC)([2000, i]);
    shortPieces.push(this.monthsShort(mom, ''));
    longPieces.push(this.months(mom, ''));
    mixedPieces.push(this.months(mom, ''));
    mixedPieces.push(this.monthsShort(mom, ''));
  } // Sorting makes sure if one month (or abbr) is a prefix of another it
  // will match the longer piece.


  shortPieces.sort(cmpLenRev);
  longPieces.sort(cmpLenRev);
  mixedPieces.sort(cmpLenRev);

  for (i = 0; i < 12; i++) {
    shortPieces[i] = (0, _regex.regexEscape)(shortPieces[i]);
    longPieces[i] = (0, _regex.regexEscape)(longPieces[i]);
  }

  for (i = 0; i < 24; i++) {
    mixedPieces[i] = (0, _regex.regexEscape)(mixedPieces[i]);
  }

  this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
  this._monthsShortRegex = this._monthsRegex;
  this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
  this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
}
},{"../moment/get-set":"node_modules/moment/src/lib/moment/get-set.js","../utils/has-own-prop":"node_modules/moment/src/lib/utils/has-own-prop.js","../format/format":"node_modules/moment/src/lib/format/format.js","./aliases":"node_modules/moment/src/lib/units/aliases.js","./priorities":"node_modules/moment/src/lib/units/priorities.js","../parse/regex":"node_modules/moment/src/lib/parse/regex.js","../parse/token":"node_modules/moment/src/lib/parse/token.js","../utils/hooks":"node_modules/moment/src/lib/utils/hooks.js","./constants":"node_modules/moment/src/lib/units/constants.js","../utils/to-int":"node_modules/moment/src/lib/utils/to-int.js","../utils/is-array":"node_modules/moment/src/lib/utils/is-array.js","../utils/is-number":"node_modules/moment/src/lib/utils/is-number.js","../utils/mod":"node_modules/moment/src/lib/utils/mod.js","../utils/index-of":"node_modules/moment/src/lib/utils/index-of.js","../create/utc":"node_modules/moment/src/lib/create/utc.js","../create/parsing-flags":"node_modules/moment/src/lib/create/parsing-flags.js","../utils/is-leap-year":"node_modules/moment/src/lib/utils/is-leap-year.js"}],"node_modules/moment/src/lib/units/year.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.daysInYear = daysInYear;
exports.getIsLeapYear = getIsLeapYear;
Object.defineProperty(exports, "isLeapYear", {
  enumerable: true,
  get: function () {
    return _isLeapYear.isLeapYear;
  }
});
exports.getSetYear = void 0;

var _getSet = require("../moment/get-set");

var _format = require("../format/format");

var _aliases = require("./aliases");

var _priorities = require("./priorities");

var _regex = require("../parse/regex");

var _token = require("../parse/token");

var _isLeapYear = require("../utils/is-leap-year");

var _hooks = require("../utils/hooks");

var _constants = require("./constants");

var _toInt = _interopRequireDefault(require("../utils/to-int"));

var _zeroFill = _interopRequireDefault(require("../utils/zero-fill"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// FORMATTING
(0, _format.addFormatToken)('Y', 0, 0, function () {
  var y = this.year();
  return y <= 9999 ? (0, _zeroFill.default)(y, 4) : '+' + y;
});
(0, _format.addFormatToken)(0, ['YY', 2], 0, function () {
  return this.year() % 100;
});
(0, _format.addFormatToken)(0, ['YYYY', 4], 0, 'year');
(0, _format.addFormatToken)(0, ['YYYYY', 5], 0, 'year');
(0, _format.addFormatToken)(0, ['YYYYYY', 6, true], 0, 'year'); // ALIASES

(0, _aliases.addUnitAlias)('year', 'y'); // PRIORITIES

(0, _priorities.addUnitPriority)('year', 1); // PARSING

(0, _regex.addRegexToken)('Y', _regex.matchSigned);
(0, _regex.addRegexToken)('YY', _regex.match1to2, _regex.match2);
(0, _regex.addRegexToken)('YYYY', _regex.match1to4, _regex.match4);
(0, _regex.addRegexToken)('YYYYY', _regex.match1to6, _regex.match6);
(0, _regex.addRegexToken)('YYYYYY', _regex.match1to6, _regex.match6);
(0, _token.addParseToken)(['YYYYY', 'YYYYYY'], _constants.YEAR);
(0, _token.addParseToken)('YYYY', function (input, array) {
  array[_constants.YEAR] = input.length === 2 ? _hooks.hooks.parseTwoDigitYear(input) : (0, _toInt.default)(input);
});
(0, _token.addParseToken)('YY', function (input, array) {
  array[_constants.YEAR] = _hooks.hooks.parseTwoDigitYear(input);
});
(0, _token.addParseToken)('Y', function (input, array) {
  array[_constants.YEAR] = parseInt(input, 10);
}); // HELPERS

function daysInYear(year) {
  return (0, _isLeapYear.isLeapYear)(year) ? 366 : 365;
}

// HOOKS
_hooks.hooks.parseTwoDigitYear = function (input) {
  return (0, _toInt.default)(input) + ((0, _toInt.default)(input) > 68 ? 1900 : 2000);
}; // MOMENTS


var getSetYear = (0, _getSet.makeGetSet)('FullYear', true);
exports.getSetYear = getSetYear;

function getIsLeapYear() {
  return (0, _isLeapYear.isLeapYear)(this.year());
}
},{"../moment/get-set":"node_modules/moment/src/lib/moment/get-set.js","../format/format":"node_modules/moment/src/lib/format/format.js","./aliases":"node_modules/moment/src/lib/units/aliases.js","./priorities":"node_modules/moment/src/lib/units/priorities.js","../parse/regex":"node_modules/moment/src/lib/parse/regex.js","../parse/token":"node_modules/moment/src/lib/parse/token.js","../utils/is-leap-year":"node_modules/moment/src/lib/utils/is-leap-year.js","../utils/hooks":"node_modules/moment/src/lib/utils/hooks.js","./constants":"node_modules/moment/src/lib/units/constants.js","../utils/to-int":"node_modules/moment/src/lib/utils/to-int.js","../utils/zero-fill":"node_modules/moment/src/lib/utils/zero-fill.js"}],"node_modules/moment/src/lib/create/date-from-array.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDate = createDate;
exports.createUTCDate = createUTCDate;

function createDate(y, m, d, h, M, s, ms) {
  // can't just apply() to create a date:
  // https://stackoverflow.com/q/181348
  var date; // the date constructor remaps years 0-99 to 1900-1999

  if (y < 100 && y >= 0) {
    // preserve leap years using a full 400 year cycle, then reset
    date = new Date(y + 400, m, d, h, M, s, ms);

    if (isFinite(date.getFullYear())) {
      date.setFullYear(y);
    }
  } else {
    date = new Date(y, m, d, h, M, s, ms);
  }

  return date;
}

function createUTCDate(y) {
  var date, args; // the Date.UTC function remaps years 0-99 to 1900-1999

  if (y < 100 && y >= 0) {
    args = Array.prototype.slice.call(arguments); // preserve leap years using a full 400 year cycle, then reset

    args[0] = y + 400;
    date = new Date(Date.UTC.apply(null, args));

    if (isFinite(date.getUTCFullYear())) {
      date.setUTCFullYear(y);
    }
  } else {
    date = new Date(Date.UTC.apply(null, arguments));
  }

  return date;
}
},{}],"node_modules/moment/src/lib/units/week-calendar-utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dayOfYearFromWeeks = dayOfYearFromWeeks;
exports.weekOfYear = weekOfYear;
exports.weeksInYear = weeksInYear;

var _year = require("./year");

var _dateFromArray = require("../create/date-from-array");

// start-of-first-week - start-of-year
function firstWeekOffset(year, dow, doy) {
  var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
  fwd = 7 + dow - doy,
      // first-week day local weekday -- which local weekday is fwd
  fwdlw = (7 + (0, _dateFromArray.createUTCDate)(year, 0, fwd).getUTCDay() - dow) % 7;
  return -fwdlw + fwd - 1;
} // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday


function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
  var localWeekday = (7 + weekday - dow) % 7,
      weekOffset = firstWeekOffset(year, dow, doy),
      dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
      resYear,
      resDayOfYear;

  if (dayOfYear <= 0) {
    resYear = year - 1;
    resDayOfYear = (0, _year.daysInYear)(resYear) + dayOfYear;
  } else if (dayOfYear > (0, _year.daysInYear)(year)) {
    resYear = year + 1;
    resDayOfYear = dayOfYear - (0, _year.daysInYear)(year);
  } else {
    resYear = year;
    resDayOfYear = dayOfYear;
  }

  return {
    year: resYear,
    dayOfYear: resDayOfYear
  };
}

function weekOfYear(mom, dow, doy) {
  var weekOffset = firstWeekOffset(mom.year(), dow, doy),
      week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
      resWeek,
      resYear;

  if (week < 1) {
    resYear = mom.year() - 1;
    resWeek = week + weeksInYear(resYear, dow, doy);
  } else if (week > weeksInYear(mom.year(), dow, doy)) {
    resWeek = week - weeksInYear(mom.year(), dow, doy);
    resYear = mom.year() + 1;
  } else {
    resYear = mom.year();
    resWeek = week;
  }

  return {
    week: resWeek,
    year: resYear
  };
}

function weeksInYear(year, dow, doy) {
  var weekOffset = firstWeekOffset(year, dow, doy),
      weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
  return ((0, _year.daysInYear)(year) - weekOffset + weekOffsetNext) / 7;
}
},{"./year":"node_modules/moment/src/lib/units/year.js","../create/date-from-array":"node_modules/moment/src/lib/create/date-from-array.js"}],"node_modules/moment/src/lib/units/week.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.localeWeek = localeWeek;
exports.localeFirstDayOfWeek = localeFirstDayOfWeek;
exports.localeFirstDayOfYear = localeFirstDayOfYear;
exports.getSetWeek = getSetWeek;
exports.getSetISOWeek = getSetISOWeek;
exports.defaultLocaleWeek = void 0;

var _format = require("../format/format");

var _aliases = require("./aliases");

var _priorities = require("./priorities");

var _regex = require("../parse/regex");

var _token = require("../parse/token");

var _toInt = _interopRequireDefault(require("../utils/to-int"));

var _weekCalendarUtils = require("./week-calendar-utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// FORMATTING
(0, _format.addFormatToken)('w', ['ww', 2], 'wo', 'week');
(0, _format.addFormatToken)('W', ['WW', 2], 'Wo', 'isoWeek'); // ALIASES

(0, _aliases.addUnitAlias)('week', 'w');
(0, _aliases.addUnitAlias)('isoWeek', 'W'); // PRIORITIES

(0, _priorities.addUnitPriority)('week', 5);
(0, _priorities.addUnitPriority)('isoWeek', 5); // PARSING

(0, _regex.addRegexToken)('w', _regex.match1to2);
(0, _regex.addRegexToken)('ww', _regex.match1to2, _regex.match2);
(0, _regex.addRegexToken)('W', _regex.match1to2);
(0, _regex.addRegexToken)('WW', _regex.match1to2, _regex.match2);
(0, _token.addWeekParseToken)(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
  week[token.substr(0, 1)] = (0, _toInt.default)(input);
}); // HELPERS
// LOCALES

function localeWeek(mom) {
  return (0, _weekCalendarUtils.weekOfYear)(mom, this._week.dow, this._week.doy).week;
}

var defaultLocaleWeek = {
  dow: 0,
  // Sunday is the first day of the week.
  doy: 6 // The week that contains Jan 6th is the first week of the year.

};
exports.defaultLocaleWeek = defaultLocaleWeek;

function localeFirstDayOfWeek() {
  return this._week.dow;
}

function localeFirstDayOfYear() {
  return this._week.doy;
} // MOMENTS


function getSetWeek(input) {
  var week = this.localeData().week(this);
  return input == null ? week : this.add((input - week) * 7, 'd');
}

function getSetISOWeek(input) {
  var week = (0, _weekCalendarUtils.weekOfYear)(this, 1, 4).week;
  return input == null ? week : this.add((input - week) * 7, 'd');
}
},{"../format/format":"node_modules/moment/src/lib/format/format.js","./aliases":"node_modules/moment/src/lib/units/aliases.js","./priorities":"node_modules/moment/src/lib/units/priorities.js","../parse/regex":"node_modules/moment/src/lib/parse/regex.js","../parse/token":"node_modules/moment/src/lib/parse/token.js","../utils/to-int":"node_modules/moment/src/lib/utils/to-int.js","./week-calendar-utils":"node_modules/moment/src/lib/units/week-calendar-utils.js"}],"node_modules/moment/src/lib/units/day-of-week.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.localeWeekdays = localeWeekdays;
exports.localeWeekdaysShort = localeWeekdaysShort;
exports.localeWeekdaysMin = localeWeekdaysMin;
exports.localeWeekdaysParse = localeWeekdaysParse;
exports.getSetDayOfWeek = getSetDayOfWeek;
exports.getSetLocaleDayOfWeek = getSetLocaleDayOfWeek;
exports.getSetISODayOfWeek = getSetISODayOfWeek;
exports.weekdaysRegex = weekdaysRegex;
exports.weekdaysShortRegex = weekdaysShortRegex;
exports.weekdaysMinRegex = weekdaysMinRegex;
exports.defaultLocaleWeekdaysMin = exports.defaultLocaleWeekdaysShort = exports.defaultLocaleWeekdays = void 0;

var _format = require("../format/format");

var _aliases = require("./aliases");

var _priorities = require("./priorities");

var _regex = require("../parse/regex");

var _token = require("../parse/token");

var _toInt = _interopRequireDefault(require("../utils/to-int"));

var _isArray = _interopRequireDefault(require("../utils/is-array"));

var _indexOf = _interopRequireDefault(require("../utils/index-of"));

var _hasOwnProp = _interopRequireDefault(require("../utils/has-own-prop"));

var _utc = require("../create/utc");

var _parsingFlags = _interopRequireDefault(require("../create/parsing-flags"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// FORMATTING
(0, _format.addFormatToken)('d', 0, 'do', 'day');
(0, _format.addFormatToken)('dd', 0, 0, function (format) {
  return this.localeData().weekdaysMin(this, format);
});
(0, _format.addFormatToken)('ddd', 0, 0, function (format) {
  return this.localeData().weekdaysShort(this, format);
});
(0, _format.addFormatToken)('dddd', 0, 0, function (format) {
  return this.localeData().weekdays(this, format);
});
(0, _format.addFormatToken)('e', 0, 0, 'weekday');
(0, _format.addFormatToken)('E', 0, 0, 'isoWeekday'); // ALIASES

(0, _aliases.addUnitAlias)('day', 'd');
(0, _aliases.addUnitAlias)('weekday', 'e');
(0, _aliases.addUnitAlias)('isoWeekday', 'E'); // PRIORITY

(0, _priorities.addUnitPriority)('day', 11);
(0, _priorities.addUnitPriority)('weekday', 11);
(0, _priorities.addUnitPriority)('isoWeekday', 11); // PARSING

(0, _regex.addRegexToken)('d', _regex.match1to2);
(0, _regex.addRegexToken)('e', _regex.match1to2);
(0, _regex.addRegexToken)('E', _regex.match1to2);
(0, _regex.addRegexToken)('dd', function (isStrict, locale) {
  return locale.weekdaysMinRegex(isStrict);
});
(0, _regex.addRegexToken)('ddd', function (isStrict, locale) {
  return locale.weekdaysShortRegex(isStrict);
});
(0, _regex.addRegexToken)('dddd', function (isStrict, locale) {
  return locale.weekdaysRegex(isStrict);
});
(0, _token.addWeekParseToken)(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
  var weekday = config._locale.weekdaysParse(input, token, config._strict); // if we didn't get a weekday name, mark the date as invalid


  if (weekday != null) {
    week.d = weekday;
  } else {
    (0, _parsingFlags.default)(config).invalidWeekday = input;
  }
});
(0, _token.addWeekParseToken)(['d', 'e', 'E'], function (input, week, config, token) {
  week[token] = (0, _toInt.default)(input);
}); // HELPERS

function parseWeekday(input, locale) {
  if (typeof input !== 'string') {
    return input;
  }

  if (!isNaN(input)) {
    return parseInt(input, 10);
  }

  input = locale.weekdaysParse(input);

  if (typeof input === 'number') {
    return input;
  }

  return null;
}

function parseIsoWeekday(input, locale) {
  if (typeof input === 'string') {
    return locale.weekdaysParse(input) % 7 || 7;
  }

  return isNaN(input) ? null : input;
} // LOCALES


function shiftWeekdays(ws, n) {
  return ws.slice(n, 7).concat(ws.slice(0, n));
}

var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
    defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_'),
    defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_'),
    defaultWeekdaysRegex = _regex.matchWord,
    defaultWeekdaysShortRegex = _regex.matchWord,
    defaultWeekdaysMinRegex = _regex.matchWord;
exports.defaultLocaleWeekdaysMin = defaultLocaleWeekdaysMin;
exports.defaultLocaleWeekdaysShort = defaultLocaleWeekdaysShort;
exports.defaultLocaleWeekdays = defaultLocaleWeekdays;

function localeWeekdays(m, format) {
  var weekdays = (0, _isArray.default)(this._weekdays) ? this._weekdays : this._weekdays[m && m !== true && this._weekdays.isFormat.test(format) ? 'format' : 'standalone'];
  return m === true ? shiftWeekdays(weekdays, this._week.dow) : m ? weekdays[m.day()] : weekdays;
}

function localeWeekdaysShort(m) {
  return m === true ? shiftWeekdays(this._weekdaysShort, this._week.dow) : m ? this._weekdaysShort[m.day()] : this._weekdaysShort;
}

function localeWeekdaysMin(m) {
  return m === true ? shiftWeekdays(this._weekdaysMin, this._week.dow) : m ? this._weekdaysMin[m.day()] : this._weekdaysMin;
}

function handleStrictParse(weekdayName, format, strict) {
  var i,
      ii,
      mom,
      llc = weekdayName.toLocaleLowerCase();

  if (!this._weekdaysParse) {
    this._weekdaysParse = [];
    this._shortWeekdaysParse = [];
    this._minWeekdaysParse = [];

    for (i = 0; i < 7; ++i) {
      mom = (0, _utc.createUTC)([2000, 1]).day(i);
      this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
      this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
      this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
    }
  }

  if (strict) {
    if (format === 'dddd') {
      ii = _indexOf.default.call(this._weekdaysParse, llc);
      return ii !== -1 ? ii : null;
    } else if (format === 'ddd') {
      ii = _indexOf.default.call(this._shortWeekdaysParse, llc);
      return ii !== -1 ? ii : null;
    } else {
      ii = _indexOf.default.call(this._minWeekdaysParse, llc);
      return ii !== -1 ? ii : null;
    }
  } else {
    if (format === 'dddd') {
      ii = _indexOf.default.call(this._weekdaysParse, llc);

      if (ii !== -1) {
        return ii;
      }

      ii = _indexOf.default.call(this._shortWeekdaysParse, llc);

      if (ii !== -1) {
        return ii;
      }

      ii = _indexOf.default.call(this._minWeekdaysParse, llc);
      return ii !== -1 ? ii : null;
    } else if (format === 'ddd') {
      ii = _indexOf.default.call(this._shortWeekdaysParse, llc);

      if (ii !== -1) {
        return ii;
      }

      ii = _indexOf.default.call(this._weekdaysParse, llc);

      if (ii !== -1) {
        return ii;
      }

      ii = _indexOf.default.call(this._minWeekdaysParse, llc);
      return ii !== -1 ? ii : null;
    } else {
      ii = _indexOf.default.call(this._minWeekdaysParse, llc);

      if (ii !== -1) {
        return ii;
      }

      ii = _indexOf.default.call(this._weekdaysParse, llc);

      if (ii !== -1) {
        return ii;
      }

      ii = _indexOf.default.call(this._shortWeekdaysParse, llc);
      return ii !== -1 ? ii : null;
    }
  }
}

function localeWeekdaysParse(weekdayName, format, strict) {
  var i, mom, regex;

  if (this._weekdaysParseExact) {
    return handleStrictParse.call(this, weekdayName, format, strict);
  }

  if (!this._weekdaysParse) {
    this._weekdaysParse = [];
    this._minWeekdaysParse = [];
    this._shortWeekdaysParse = [];
    this._fullWeekdaysParse = [];
  }

  for (i = 0; i < 7; i++) {
    // make the regex if we don't have it already
    mom = (0, _utc.createUTC)([2000, 1]).day(i);

    if (strict && !this._fullWeekdaysParse[i]) {
      this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\\.?') + '$', 'i');
      this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$', 'i');
      this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$', 'i');
    }

    if (!this._weekdaysParse[i]) {
      regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
      this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
    } // test the regex


    if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
      return i;
    } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
      return i;
    } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
      return i;
    } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
      return i;
    }
  }
} // MOMENTS


function getSetDayOfWeek(input) {
  if (!this.isValid()) {
    return input != null ? this : NaN;
  }

  var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();

  if (input != null) {
    input = parseWeekday(input, this.localeData());
    return this.add(input - day, 'd');
  } else {
    return day;
  }
}

function getSetLocaleDayOfWeek(input) {
  if (!this.isValid()) {
    return input != null ? this : NaN;
  }

  var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
  return input == null ? weekday : this.add(input - weekday, 'd');
}

function getSetISODayOfWeek(input) {
  if (!this.isValid()) {
    return input != null ? this : NaN;
  } // behaves the same as moment#day except
  // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
  // as a setter, sunday should belong to the previous week.


  if (input != null) {
    var weekday = parseIsoWeekday(input, this.localeData());
    return this.day(this.day() % 7 ? weekday : weekday - 7);
  } else {
    return this.day() || 7;
  }
}

function weekdaysRegex(isStrict) {
  if (this._weekdaysParseExact) {
    if (!(0, _hasOwnProp.default)(this, '_weekdaysRegex')) {
      computeWeekdaysParse.call(this);
    }

    if (isStrict) {
      return this._weekdaysStrictRegex;
    } else {
      return this._weekdaysRegex;
    }
  } else {
    if (!(0, _hasOwnProp.default)(this, '_weekdaysRegex')) {
      this._weekdaysRegex = defaultWeekdaysRegex;
    }

    return this._weekdaysStrictRegex && isStrict ? this._weekdaysStrictRegex : this._weekdaysRegex;
  }
}

function weekdaysShortRegex(isStrict) {
  if (this._weekdaysParseExact) {
    if (!(0, _hasOwnProp.default)(this, '_weekdaysRegex')) {
      computeWeekdaysParse.call(this);
    }

    if (isStrict) {
      return this._weekdaysShortStrictRegex;
    } else {
      return this._weekdaysShortRegex;
    }
  } else {
    if (!(0, _hasOwnProp.default)(this, '_weekdaysShortRegex')) {
      this._weekdaysShortRegex = defaultWeekdaysShortRegex;
    }

    return this._weekdaysShortStrictRegex && isStrict ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
  }
}

function weekdaysMinRegex(isStrict) {
  if (this._weekdaysParseExact) {
    if (!(0, _hasOwnProp.default)(this, '_weekdaysRegex')) {
      computeWeekdaysParse.call(this);
    }

    if (isStrict) {
      return this._weekdaysMinStrictRegex;
    } else {
      return this._weekdaysMinRegex;
    }
  } else {
    if (!(0, _hasOwnProp.default)(this, '_weekdaysMinRegex')) {
      this._weekdaysMinRegex = defaultWeekdaysMinRegex;
    }

    return this._weekdaysMinStrictRegex && isStrict ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
  }
}

function computeWeekdaysParse() {
  function cmpLenRev(a, b) {
    return b.length - a.length;
  }

  var minPieces = [],
      shortPieces = [],
      longPieces = [],
      mixedPieces = [],
      i,
      mom,
      minp,
      shortp,
      longp;

  for (i = 0; i < 7; i++) {
    // make the regex if we don't have it already
    mom = (0, _utc.createUTC)([2000, 1]).day(i);
    minp = (0, _regex.regexEscape)(this.weekdaysMin(mom, ''));
    shortp = (0, _regex.regexEscape)(this.weekdaysShort(mom, ''));
    longp = (0, _regex.regexEscape)(this.weekdays(mom, ''));
    minPieces.push(minp);
    shortPieces.push(shortp);
    longPieces.push(longp);
    mixedPieces.push(minp);
    mixedPieces.push(shortp);
    mixedPieces.push(longp);
  } // Sorting makes sure if one weekday (or abbr) is a prefix of another it
  // will match the longer piece.


  minPieces.sort(cmpLenRev);
  shortPieces.sort(cmpLenRev);
  longPieces.sort(cmpLenRev);
  mixedPieces.sort(cmpLenRev);
  this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
  this._weekdaysShortRegex = this._weekdaysRegex;
  this._weekdaysMinRegex = this._weekdaysRegex;
  this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
  this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
  this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
}
},{"../format/format":"node_modules/moment/src/lib/format/format.js","./aliases":"node_modules/moment/src/lib/units/aliases.js","./priorities":"node_modules/moment/src/lib/units/priorities.js","../parse/regex":"node_modules/moment/src/lib/parse/regex.js","../parse/token":"node_modules/moment/src/lib/parse/token.js","../utils/to-int":"node_modules/moment/src/lib/utils/to-int.js","../utils/is-array":"node_modules/moment/src/lib/utils/is-array.js","../utils/index-of":"node_modules/moment/src/lib/utils/index-of.js","../utils/has-own-prop":"node_modules/moment/src/lib/utils/has-own-prop.js","../create/utc":"node_modules/moment/src/lib/create/utc.js","../create/parsing-flags":"node_modules/moment/src/lib/create/parsing-flags.js"}],"node_modules/moment/src/lib/units/hour.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.localeIsPM = localeIsPM;
exports.localeMeridiem = localeMeridiem;
exports.getSetHour = exports.defaultLocaleMeridiemParse = void 0;

var _getSet = require("../moment/get-set");

var _format = require("../format/format");

var _aliases = require("./aliases");

var _priorities = require("./priorities");

var _regex = require("../parse/regex");

var _token = require("../parse/token");

var _constants = require("./constants");

var _toInt = _interopRequireDefault(require("../utils/to-int"));

var _zeroFill = _interopRequireDefault(require("../utils/zero-fill"));

var _parsingFlags = _interopRequireDefault(require("../create/parsing-flags"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// FORMATTING
function hFormat() {
  return this.hours() % 12 || 12;
}

function kFormat() {
  return this.hours() || 24;
}

(0, _format.addFormatToken)('H', ['HH', 2], 0, 'hour');
(0, _format.addFormatToken)('h', ['hh', 2], 0, hFormat);
(0, _format.addFormatToken)('k', ['kk', 2], 0, kFormat);
(0, _format.addFormatToken)('hmm', 0, 0, function () {
  return '' + hFormat.apply(this) + (0, _zeroFill.default)(this.minutes(), 2);
});
(0, _format.addFormatToken)('hmmss', 0, 0, function () {
  return '' + hFormat.apply(this) + (0, _zeroFill.default)(this.minutes(), 2) + (0, _zeroFill.default)(this.seconds(), 2);
});
(0, _format.addFormatToken)('Hmm', 0, 0, function () {
  return '' + this.hours() + (0, _zeroFill.default)(this.minutes(), 2);
});
(0, _format.addFormatToken)('Hmmss', 0, 0, function () {
  return '' + this.hours() + (0, _zeroFill.default)(this.minutes(), 2) + (0, _zeroFill.default)(this.seconds(), 2);
});

function meridiem(token, lowercase) {
  (0, _format.addFormatToken)(token, 0, 0, function () {
    return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
  });
}

meridiem('a', true);
meridiem('A', false); // ALIASES

(0, _aliases.addUnitAlias)('hour', 'h'); // PRIORITY

(0, _priorities.addUnitPriority)('hour', 13); // PARSING

function matchMeridiem(isStrict, locale) {
  return locale._meridiemParse;
}

(0, _regex.addRegexToken)('a', matchMeridiem);
(0, _regex.addRegexToken)('A', matchMeridiem);
(0, _regex.addRegexToken)('H', _regex.match1to2);
(0, _regex.addRegexToken)('h', _regex.match1to2);
(0, _regex.addRegexToken)('k', _regex.match1to2);
(0, _regex.addRegexToken)('HH', _regex.match1to2, _regex.match2);
(0, _regex.addRegexToken)('hh', _regex.match1to2, _regex.match2);
(0, _regex.addRegexToken)('kk', _regex.match1to2, _regex.match2);
(0, _regex.addRegexToken)('hmm', _regex.match3to4);
(0, _regex.addRegexToken)('hmmss', _regex.match5to6);
(0, _regex.addRegexToken)('Hmm', _regex.match3to4);
(0, _regex.addRegexToken)('Hmmss', _regex.match5to6);
(0, _token.addParseToken)(['H', 'HH'], _constants.HOUR);
(0, _token.addParseToken)(['k', 'kk'], function (input, array, config) {
  var kInput = (0, _toInt.default)(input);
  array[_constants.HOUR] = kInput === 24 ? 0 : kInput;
});
(0, _token.addParseToken)(['a', 'A'], function (input, array, config) {
  config._isPm = config._locale.isPM(input);
  config._meridiem = input;
});
(0, _token.addParseToken)(['h', 'hh'], function (input, array, config) {
  array[_constants.HOUR] = (0, _toInt.default)(input);
  (0, _parsingFlags.default)(config).bigHour = true;
});
(0, _token.addParseToken)('hmm', function (input, array, config) {
  var pos = input.length - 2;
  array[_constants.HOUR] = (0, _toInt.default)(input.substr(0, pos));
  array[_constants.MINUTE] = (0, _toInt.default)(input.substr(pos));
  (0, _parsingFlags.default)(config).bigHour = true;
});
(0, _token.addParseToken)('hmmss', function (input, array, config) {
  var pos1 = input.length - 4,
      pos2 = input.length - 2;
  array[_constants.HOUR] = (0, _toInt.default)(input.substr(0, pos1));
  array[_constants.MINUTE] = (0, _toInt.default)(input.substr(pos1, 2));
  array[_constants.SECOND] = (0, _toInt.default)(input.substr(pos2));
  (0, _parsingFlags.default)(config).bigHour = true;
});
(0, _token.addParseToken)('Hmm', function (input, array, config) {
  var pos = input.length - 2;
  array[_constants.HOUR] = (0, _toInt.default)(input.substr(0, pos));
  array[_constants.MINUTE] = (0, _toInt.default)(input.substr(pos));
});
(0, _token.addParseToken)('Hmmss', function (input, array, config) {
  var pos1 = input.length - 4,
      pos2 = input.length - 2;
  array[_constants.HOUR] = (0, _toInt.default)(input.substr(0, pos1));
  array[_constants.MINUTE] = (0, _toInt.default)(input.substr(pos1, 2));
  array[_constants.SECOND] = (0, _toInt.default)(input.substr(pos2));
}); // LOCALES

function localeIsPM(input) {
  // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
  // Using charAt should be more compatible.
  return (input + '').toLowerCase().charAt(0) === 'p';
}

var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i,
    // Setting the hour should keep the time, because the user explicitly
// specified which hour they want. So trying to maintain the same hour (in
// a new timezone) makes sense. Adding/subtracting hours does not follow
// this rule.
getSetHour = (0, _getSet.makeGetSet)('Hours', true);
exports.getSetHour = getSetHour;
exports.defaultLocaleMeridiemParse = defaultLocaleMeridiemParse;

function localeMeridiem(hours, minutes, isLower) {
  if (hours > 11) {
    return isLower ? 'pm' : 'PM';
  } else {
    return isLower ? 'am' : 'AM';
  }
}
},{"../moment/get-set":"node_modules/moment/src/lib/moment/get-set.js","../format/format":"node_modules/moment/src/lib/format/format.js","./aliases":"node_modules/moment/src/lib/units/aliases.js","./priorities":"node_modules/moment/src/lib/units/priorities.js","../parse/regex":"node_modules/moment/src/lib/parse/regex.js","../parse/token":"node_modules/moment/src/lib/parse/token.js","./constants":"node_modules/moment/src/lib/units/constants.js","../utils/to-int":"node_modules/moment/src/lib/utils/to-int.js","../utils/zero-fill":"node_modules/moment/src/lib/utils/zero-fill.js","../create/parsing-flags":"node_modules/moment/src/lib/create/parsing-flags.js"}],"node_modules/moment/src/lib/locale/base-config.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.baseConfig = void 0;

var _calendar = require("./calendar");

var _formats = require("./formats");

var _invalid = require("./invalid");

var _ordinal = require("./ordinal");

var _relative = require("./relative");

var _month = require("../units/month");

var _week = require("../units/week");

var _dayOfWeek = require("../units/day-of-week");

var _hour = require("../units/hour");

// months
// week
// weekdays
// meridiem
var baseConfig = {
  calendar: _calendar.defaultCalendar,
  longDateFormat: _formats.defaultLongDateFormat,
  invalidDate: _invalid.defaultInvalidDate,
  ordinal: _ordinal.defaultOrdinal,
  dayOfMonthOrdinalParse: _ordinal.defaultDayOfMonthOrdinalParse,
  relativeTime: _relative.defaultRelativeTime,
  months: _month.defaultLocaleMonths,
  monthsShort: _month.defaultLocaleMonthsShort,
  week: _week.defaultLocaleWeek,
  weekdays: _dayOfWeek.defaultLocaleWeekdays,
  weekdaysMin: _dayOfWeek.defaultLocaleWeekdaysMin,
  weekdaysShort: _dayOfWeek.defaultLocaleWeekdaysShort,
  meridiemParse: _hour.defaultLocaleMeridiemParse
};
exports.baseConfig = baseConfig;
},{"./calendar":"node_modules/moment/src/lib/locale/calendar.js","./formats":"node_modules/moment/src/lib/locale/formats.js","./invalid":"node_modules/moment/src/lib/locale/invalid.js","./ordinal":"node_modules/moment/src/lib/locale/ordinal.js","./relative":"node_modules/moment/src/lib/locale/relative.js","../units/month":"node_modules/moment/src/lib/units/month.js","../units/week":"node_modules/moment/src/lib/units/week.js","../units/day-of-week":"node_modules/moment/src/lib/units/day-of-week.js","../units/hour":"node_modules/moment/src/lib/units/hour.js"}],"node_modules/moment/src/lib/locale/locales.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSetGlobalLocale = getSetGlobalLocale;
exports.defineLocale = defineLocale;
exports.updateLocale = updateLocale;
exports.getLocale = getLocale;
exports.listLocales = listLocales;

var _isArray = _interopRequireDefault(require("../utils/is-array"));

var _isUndefined = _interopRequireDefault(require("../utils/is-undefined"));

var _deprecate = require("../utils/deprecate");

var _set = require("./set");

var _constructor = require("./constructor");

var _keys = _interopRequireDefault(require("../utils/keys"));

var _baseConfig = require("./base-config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// internal storage for locale config files
var locales = {},
    localeFamilies = {},
    globalLocale;

function commonPrefix(arr1, arr2) {
  var i,
      minl = Math.min(arr1.length, arr2.length);

  for (i = 0; i < minl; i += 1) {
    if (arr1[i] !== arr2[i]) {
      return i;
    }
  }

  return minl;
}

function normalizeLocale(key) {
  return key ? key.toLowerCase().replace('_', '-') : key;
} // pick the locale from the array
// try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
// substring from most specific to least, but move to the next array item if it's a more specific variant than the current root


function chooseLocale(names) {
  var i = 0,
      j,
      next,
      locale,
      split;

  while (i < names.length) {
    split = normalizeLocale(names[i]).split('-');
    j = split.length;
    next = normalizeLocale(names[i + 1]);
    next = next ? next.split('-') : null;

    while (j > 0) {
      locale = loadLocale(split.slice(0, j).join('-'));

      if (locale) {
        return locale;
      }

      if (next && next.length >= j && commonPrefix(split, next) >= j - 1) {
        //the next array item is better than a shallower substring of this one
        break;
      }

      j--;
    }

    i++;
  }

  return globalLocale;
}

function loadLocale(name) {
  var oldLocale = null,
      aliasedRequire; // TODO: Find a better way to register and load all the locales in Node

  if (locales[name] === undefined && typeof module !== 'undefined' && module && module.exports) {
    try {
      oldLocale = globalLocale._abbr;
      aliasedRequire = require;
      aliasedRequire('./locale/' + name);
      getSetGlobalLocale(oldLocale);
    } catch (e) {
      // mark as not found to avoid repeating expensive file require call causing high CPU
      // when trying to find en-US, en_US, en-us for every format call
      locales[name] = null; // null means not found
    }
  }

  return locales[name];
} // This function will load locale and then set the global locale.  If
// no arguments are passed in, it will simply return the current global
// locale key.


function getSetGlobalLocale(key, values) {
  var data;

  if (key) {
    if ((0, _isUndefined.default)(values)) {
      data = getLocale(key);
    } else {
      data = defineLocale(key, values);
    }

    if (data) {
      // moment.duration._locale = moment._locale = data;
      globalLocale = data;
    } else {
      if (typeof console !== 'undefined' && console.warn) {
        //warn user if arguments are passed but the locale could not be set
        console.warn('Locale ' + key + ' not found. Did you forget to load it?');
      }
    }
  }

  return globalLocale._abbr;
}

function defineLocale(name, config) {
  if (config !== null) {
    var locale,
        parentConfig = _baseConfig.baseConfig;
    config.abbr = name;

    if (locales[name] != null) {
      (0, _deprecate.deprecateSimple)('defineLocaleOverride', 'use moment.updateLocale(localeName, config) to change ' + 'an existing locale. moment.defineLocale(localeName, ' + 'config) should only be used for creating a new locale ' + 'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
      parentConfig = locales[name]._config;
    } else if (config.parentLocale != null) {
      if (locales[config.parentLocale] != null) {
        parentConfig = locales[config.parentLocale]._config;
      } else {
        locale = loadLocale(config.parentLocale);

        if (locale != null) {
          parentConfig = locale._config;
        } else {
          if (!localeFamilies[config.parentLocale]) {
            localeFamilies[config.parentLocale] = [];
          }

          localeFamilies[config.parentLocale].push({
            name: name,
            config: config
          });
          return null;
        }
      }
    }

    locales[name] = new _constructor.Locale((0, _set.mergeConfigs)(parentConfig, config));

    if (localeFamilies[name]) {
      localeFamilies[name].forEach(function (x) {
        defineLocale(x.name, x.config);
      });
    } // backwards compat for now: also set the locale
    // make sure we set the locale AFTER all child locales have been
    // created, so we won't end up with the child locale set.


    getSetGlobalLocale(name);
    return locales[name];
  } else {
    // useful for testing
    delete locales[name];
    return null;
  }
}

function updateLocale(name, config) {
  if (config != null) {
    var locale,
        tmpLocale,
        parentConfig = _baseConfig.baseConfig;

    if (locales[name] != null && locales[name].parentLocale != null) {
      // Update existing child locale in-place to avoid memory-leaks
      locales[name].set((0, _set.mergeConfigs)(locales[name]._config, config));
    } else {
      // MERGE
      tmpLocale = loadLocale(name);

      if (tmpLocale != null) {
        parentConfig = tmpLocale._config;
      }

      config = (0, _set.mergeConfigs)(parentConfig, config);

      if (tmpLocale == null) {
        // updateLocale is called for creating a new locale
        // Set abbr so it will have a name (getters return
        // undefined otherwise).
        config.abbr = name;
      }

      locale = new _constructor.Locale(config);
      locale.parentLocale = locales[name];
      locales[name] = locale;
    } // backwards compat for now: also set the locale


    getSetGlobalLocale(name);
  } else {
    // pass null for config to unupdate, useful for tests
    if (locales[name] != null) {
      if (locales[name].parentLocale != null) {
        locales[name] = locales[name].parentLocale;

        if (name === getSetGlobalLocale()) {
          getSetGlobalLocale(name);
        }
      } else if (locales[name] != null) {
        delete locales[name];
      }
    }
  }

  return locales[name];
} // returns locale data


function getLocale(key) {
  var locale;

  if (key && key._locale && key._locale._abbr) {
    key = key._locale._abbr;
  }

  if (!key) {
    return globalLocale;
  }

  if (!(0, _isArray.default)(key)) {
    //short-circuit everything else
    locale = loadLocale(key);

    if (locale) {
      return locale;
    }

    key = [key];
  }

  return chooseLocale(key);
}

function listLocales() {
  return (0, _keys.default)(locales);
}
},{"../utils/is-array":"node_modules/moment/src/lib/utils/is-array.js","../utils/is-undefined":"node_modules/moment/src/lib/utils/is-undefined.js","../utils/deprecate":"node_modules/moment/src/lib/utils/deprecate.js","./set":"node_modules/moment/src/lib/locale/set.js","./constructor":"node_modules/moment/src/lib/locale/constructor.js","../utils/keys":"node_modules/moment/src/lib/utils/keys.js","./base-config":"node_modules/moment/src/lib/locale/base-config.js"}],"node_modules/moment/src/lib/create/check-overflow.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = checkOverflow;

var _month = require("../units/month");

var _constants = require("../units/constants");

var _parsingFlags = _interopRequireDefault(require("../create/parsing-flags"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function checkOverflow(m) {
  var overflow,
      a = m._a;

  if (a && (0, _parsingFlags.default)(m).overflow === -2) {
    overflow = a[_constants.MONTH] < 0 || a[_constants.MONTH] > 11 ? _constants.MONTH : a[_constants.DATE] < 1 || a[_constants.DATE] > (0, _month.daysInMonth)(a[_constants.YEAR], a[_constants.MONTH]) ? _constants.DATE : a[_constants.HOUR] < 0 || a[_constants.HOUR] > 24 || a[_constants.HOUR] === 24 && (a[_constants.MINUTE] !== 0 || a[_constants.SECOND] !== 0 || a[_constants.MILLISECOND] !== 0) ? _constants.HOUR : a[_constants.MINUTE] < 0 || a[_constants.MINUTE] > 59 ? _constants.MINUTE : a[_constants.SECOND] < 0 || a[_constants.SECOND] > 59 ? _constants.SECOND : a[_constants.MILLISECOND] < 0 || a[_constants.MILLISECOND] > 999 ? _constants.MILLISECOND : -1;

    if ((0, _parsingFlags.default)(m)._overflowDayOfYear && (overflow < _constants.YEAR || overflow > _constants.DATE)) {
      overflow = _constants.DATE;
    }

    if ((0, _parsingFlags.default)(m)._overflowWeeks && overflow === -1) {
      overflow = _constants.WEEK;
    }

    if ((0, _parsingFlags.default)(m)._overflowWeekday && overflow === -1) {
      overflow = _constants.WEEKDAY;
    }

    (0, _parsingFlags.default)(m).overflow = overflow;
  }

  return m;
}
},{"../units/month":"node_modules/moment/src/lib/units/month.js","../units/constants":"node_modules/moment/src/lib/units/constants.js","../create/parsing-flags":"node_modules/moment/src/lib/create/parsing-flags.js"}],"node_modules/moment/src/lib/create/from-string.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configFromISO = configFromISO;
exports.configFromRFC2822 = configFromRFC2822;
exports.configFromString = configFromString;

var _fromStringAndFormat = require("./from-string-and-format");

var _dateFromArray = require("./date-from-array");

var _hooks = require("../utils/hooks");

var _deprecate = require("../utils/deprecate");

var _parsingFlags = _interopRequireDefault(require("./parsing-flags"));

var _month = require("../units/month");

var _dayOfWeek = require("../units/day-of-week");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// iso 8601 regex
// 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
    basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
    tzRegex = /Z|[+-]\d\d(?::?\d\d)?/,
    isoDates = [['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/], ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/], ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/], ['GGGG-[W]WW', /\d{4}-W\d\d/, false], ['YYYY-DDD', /\d{4}-\d{3}/], ['YYYY-MM', /\d{4}-\d\d/, false], ['YYYYYYMMDD', /[+-]\d{10}/], ['YYYYMMDD', /\d{8}/], ['GGGG[W]WWE', /\d{4}W\d{3}/], ['GGGG[W]WW', /\d{4}W\d{2}/, false], ['YYYYDDD', /\d{7}/], ['YYYYMM', /\d{6}/, false], ['YYYY', /\d{4}/, false]],
    // iso time formats and regexes
isoTimes = [['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/], ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/], ['HH:mm:ss', /\d\d:\d\d:\d\d/], ['HH:mm', /\d\d:\d\d/], ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/], ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/], ['HHmmss', /\d\d\d\d\d\d/], ['HHmm', /\d\d\d\d/], ['HH', /\d\d/]],
    aspNetJsonRegex = /^\/?Date\((-?\d+)/i,
    // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,
    obsOffsets = {
  UT: 0,
  GMT: 0,
  EDT: -4 * 60,
  EST: -5 * 60,
  CDT: -5 * 60,
  CST: -6 * 60,
  MDT: -6 * 60,
  MST: -7 * 60,
  PDT: -7 * 60,
  PST: -8 * 60
}; // date from iso format

function configFromISO(config) {
  var i,
      l,
      string = config._i,
      match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
      allowTime,
      dateFormat,
      timeFormat,
      tzFormat;

  if (match) {
    (0, _parsingFlags.default)(config).iso = true;

    for (i = 0, l = isoDates.length; i < l; i++) {
      if (isoDates[i][1].exec(match[1])) {
        dateFormat = isoDates[i][0];
        allowTime = isoDates[i][2] !== false;
        break;
      }
    }

    if (dateFormat == null) {
      config._isValid = false;
      return;
    }

    if (match[3]) {
      for (i = 0, l = isoTimes.length; i < l; i++) {
        if (isoTimes[i][1].exec(match[3])) {
          // match[2] should be 'T' or space
          timeFormat = (match[2] || ' ') + isoTimes[i][0];
          break;
        }
      }

      if (timeFormat == null) {
        config._isValid = false;
        return;
      }
    }

    if (!allowTime && timeFormat != null) {
      config._isValid = false;
      return;
    }

    if (match[4]) {
      if (tzRegex.exec(match[4])) {
        tzFormat = 'Z';
      } else {
        config._isValid = false;
        return;
      }
    }

    config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
    (0, _fromStringAndFormat.configFromStringAndFormat)(config);
  } else {
    config._isValid = false;
  }
}

function extractFromRFC2822Strings(yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
  var result = [untruncateYear(yearStr), _month.defaultLocaleMonthsShort.indexOf(monthStr), parseInt(dayStr, 10), parseInt(hourStr, 10), parseInt(minuteStr, 10)];

  if (secondStr) {
    result.push(parseInt(secondStr, 10));
  }

  return result;
}

function untruncateYear(yearStr) {
  var year = parseInt(yearStr, 10);

  if (year <= 49) {
    return 2000 + year;
  } else if (year <= 999) {
    return 1900 + year;
  }

  return year;
}

function preprocessRFC2822(s) {
  // Remove comments and folding whitespace and replace multiple-spaces with a single space
  return s.replace(/\([^)]*\)|[\n\t]/g, ' ').replace(/(\s\s+)/g, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function checkWeekday(weekdayStr, parsedInput, config) {
  if (weekdayStr) {
    // TODO: Replace the vanilla JS Date object with an independent day-of-week check.
    var weekdayProvided = _dayOfWeek.defaultLocaleWeekdaysShort.indexOf(weekdayStr),
        weekdayActual = new Date(parsedInput[0], parsedInput[1], parsedInput[2]).getDay();

    if (weekdayProvided !== weekdayActual) {
      (0, _parsingFlags.default)(config).weekdayMismatch = true;
      config._isValid = false;
      return false;
    }
  }

  return true;
}

function calculateOffset(obsOffset, militaryOffset, numOffset) {
  if (obsOffset) {
    return obsOffsets[obsOffset];
  } else if (militaryOffset) {
    // the only allowed military tz is Z
    return 0;
  } else {
    var hm = parseInt(numOffset, 10),
        m = hm % 100,
        h = (hm - m) / 100;
    return h * 60 + m;
  }
} // date and time from ref 2822 format


function configFromRFC2822(config) {
  var match = rfc2822.exec(preprocessRFC2822(config._i)),
      parsedArray;

  if (match) {
    parsedArray = extractFromRFC2822Strings(match[4], match[3], match[2], match[5], match[6], match[7]);

    if (!checkWeekday(match[1], parsedArray, config)) {
      return;
    }

    config._a = parsedArray;
    config._tzm = calculateOffset(match[8], match[9], match[10]);
    config._d = _dateFromArray.createUTCDate.apply(null, config._a);

    config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

    (0, _parsingFlags.default)(config).rfc2822 = true;
  } else {
    config._isValid = false;
  }
} // date from 1) ASP.NET, 2) ISO, 3) RFC 2822 formats, or 4) optional fallback if parsing isn't strict


function configFromString(config) {
  var matched = aspNetJsonRegex.exec(config._i);

  if (matched !== null) {
    config._d = new Date(+matched[1]);
    return;
  }

  configFromISO(config);

  if (config._isValid === false) {
    delete config._isValid;
  } else {
    return;
  }

  configFromRFC2822(config);

  if (config._isValid === false) {
    delete config._isValid;
  } else {
    return;
  }

  if (config._strict) {
    config._isValid = false;
  } else {
    // Final attempt, use Input Fallback
    _hooks.hooks.createFromInputFallback(config);
  }
}

_hooks.hooks.createFromInputFallback = (0, _deprecate.deprecate)('value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' + 'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' + 'discouraged and will be removed in an upcoming major release. Please refer to ' + 'http://momentjs.com/guides/#/warnings/js-date/ for more info.', function (config) {
  config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
});
},{"./from-string-and-format":"node_modules/moment/src/lib/create/from-string-and-format.js","./date-from-array":"node_modules/moment/src/lib/create/date-from-array.js","../utils/hooks":"node_modules/moment/src/lib/utils/hooks.js","../utils/deprecate":"node_modules/moment/src/lib/utils/deprecate.js","./parsing-flags":"node_modules/moment/src/lib/create/parsing-flags.js","../units/month":"node_modules/moment/src/lib/units/month.js","../units/day-of-week":"node_modules/moment/src/lib/units/day-of-week.js"}],"node_modules/moment/src/lib/utils/defaults.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = defaults;

// Pick the first defined of two or three arguments.
function defaults(a, b, c) {
  if (a != null) {
    return a;
  }

  if (b != null) {
    return b;
  }

  return c;
}
},{}],"node_modules/moment/src/lib/create/from-array.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configFromArray = configFromArray;

var _hooks = require("../utils/hooks");

var _dateFromArray = require("./date-from-array");

var _year = require("../units/year");

var _weekCalendarUtils = require("../units/week-calendar-utils");

var _constants = require("../units/constants");

var _local = require("./local");

var _defaults = _interopRequireDefault(require("../utils/defaults"));

var _parsingFlags = _interopRequireDefault(require("./parsing-flags"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function currentDateArray(config) {
  // hooks is actually the exported moment object
  var nowValue = new Date(_hooks.hooks.now());

  if (config._useUTC) {
    return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
  }

  return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
} // convert an array to a date.
// the array should mirror the parameters below
// note: all values past the year are optional and will default to the lowest possible value.
// [year, month, day , hour, minute, second, millisecond]


function configFromArray(config) {
  var i,
      date,
      input = [],
      currentDate,
      expectedWeekday,
      yearToUse;

  if (config._d) {
    return;
  }

  currentDate = currentDateArray(config); //compute day of the year from weeks and weekdays

  if (config._w && config._a[_constants.DATE] == null && config._a[_constants.MONTH] == null) {
    dayOfYearFromWeekInfo(config);
  } //if the day of the year is set, figure out what it is


  if (config._dayOfYear != null) {
    yearToUse = (0, _defaults.default)(config._a[_constants.YEAR], currentDate[_constants.YEAR]);

    if (config._dayOfYear > (0, _year.daysInYear)(yearToUse) || config._dayOfYear === 0) {
      (0, _parsingFlags.default)(config)._overflowDayOfYear = true;
    }

    date = (0, _dateFromArray.createUTCDate)(yearToUse, 0, config._dayOfYear);
    config._a[_constants.MONTH] = date.getUTCMonth();
    config._a[_constants.DATE] = date.getUTCDate();
  } // Default to current date.
  // * if no year, month, day of month are given, default to today
  // * if day of month is given, default month and year
  // * if month is given, default only year
  // * if year is given, don't default anything


  for (i = 0; i < 3 && config._a[i] == null; ++i) {
    config._a[i] = input[i] = currentDate[i];
  } // Zero out whatever was not defaulted, including time


  for (; i < 7; i++) {
    config._a[i] = input[i] = config._a[i] == null ? i === 2 ? 1 : 0 : config._a[i];
  } // Check for 24:00:00.000


  if (config._a[_constants.HOUR] === 24 && config._a[_constants.MINUTE] === 0 && config._a[_constants.SECOND] === 0 && config._a[_constants.MILLISECOND] === 0) {
    config._nextDay = true;
    config._a[_constants.HOUR] = 0;
  }

  config._d = (config._useUTC ? _dateFromArray.createUTCDate : _dateFromArray.createDate).apply(null, input);
  expectedWeekday = config._useUTC ? config._d.getUTCDay() : config._d.getDay(); // Apply timezone offset from input. The actual utcOffset can be changed
  // with parseZone.

  if (config._tzm != null) {
    config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
  }

  if (config._nextDay) {
    config._a[_constants.HOUR] = 24;
  } // check for mismatching day of week


  if (config._w && typeof config._w.d !== 'undefined' && config._w.d !== expectedWeekday) {
    (0, _parsingFlags.default)(config).weekdayMismatch = true;
  }
}

function dayOfYearFromWeekInfo(config) {
  var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow, curWeek;
  w = config._w;

  if (w.GG != null || w.W != null || w.E != null) {
    dow = 1;
    doy = 4; // TODO: We need to take the current isoWeekYear, but that depends on
    // how we interpret now (local, utc, fixed offset). So create
    // a now version of current config (take local/utc/offset flags, and
    // create now).

    weekYear = (0, _defaults.default)(w.GG, config._a[_constants.YEAR], (0, _weekCalendarUtils.weekOfYear)((0, _local.createLocal)(), 1, 4).year);
    week = (0, _defaults.default)(w.W, 1);
    weekday = (0, _defaults.default)(w.E, 1);

    if (weekday < 1 || weekday > 7) {
      weekdayOverflow = true;
    }
  } else {
    dow = config._locale._week.dow;
    doy = config._locale._week.doy;
    curWeek = (0, _weekCalendarUtils.weekOfYear)((0, _local.createLocal)(), dow, doy);
    weekYear = (0, _defaults.default)(w.gg, config._a[_constants.YEAR], curWeek.year); // Default to current week.

    week = (0, _defaults.default)(w.w, curWeek.week);

    if (w.d != null) {
      // weekday -- low day numbers are considered next week
      weekday = w.d;

      if (weekday < 0 || weekday > 6) {
        weekdayOverflow = true;
      }
    } else if (w.e != null) {
      // local weekday -- counting starts from beginning of week
      weekday = w.e + dow;

      if (w.e < 0 || w.e > 6) {
        weekdayOverflow = true;
      }
    } else {
      // default to beginning of week
      weekday = dow;
    }
  }

  if (week < 1 || week > (0, _weekCalendarUtils.weeksInYear)(weekYear, dow, doy)) {
    (0, _parsingFlags.default)(config)._overflowWeeks = true;
  } else if (weekdayOverflow != null) {
    (0, _parsingFlags.default)(config)._overflowWeekday = true;
  } else {
    temp = (0, _weekCalendarUtils.dayOfYearFromWeeks)(weekYear, week, weekday, dow, doy);
    config._a[_constants.YEAR] = temp.year;
    config._dayOfYear = temp.dayOfYear;
  }
}
},{"../utils/hooks":"node_modules/moment/src/lib/utils/hooks.js","./date-from-array":"node_modules/moment/src/lib/create/date-from-array.js","../units/year":"node_modules/moment/src/lib/units/year.js","../units/week-calendar-utils":"node_modules/moment/src/lib/units/week-calendar-utils.js","../units/constants":"node_modules/moment/src/lib/units/constants.js","./local":"node_modules/moment/src/lib/create/local.js","../utils/defaults":"node_modules/moment/src/lib/utils/defaults.js","./parsing-flags":"node_modules/moment/src/lib/create/parsing-flags.js"}],"node_modules/moment/src/lib/create/from-string-and-format.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configFromStringAndFormat = configFromStringAndFormat;

var _fromString = require("./from-string");

var _fromArray = require("./from-array");

var _regex = require("../parse/regex");

var _token = require("../parse/token");

var _format = require("../format/format");

var _checkOverflow = _interopRequireDefault(require("./check-overflow"));

var _constants = require("../units/constants");

var _hooks = require("../utils/hooks");

var _parsingFlags = _interopRequireDefault(require("./parsing-flags"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// constant that refers to the ISO standard
_hooks.hooks.ISO_8601 = function () {}; // constant that refers to the RFC 2822 form


_hooks.hooks.RFC_2822 = function () {}; // date from string and format string


function configFromStringAndFormat(config) {
  // TODO: Move this to another part of the creation flow to prevent circular deps
  if (config._f === _hooks.hooks.ISO_8601) {
    (0, _fromString.configFromISO)(config);
    return;
  }

  if (config._f === _hooks.hooks.RFC_2822) {
    (0, _fromString.configFromRFC2822)(config);
    return;
  }

  config._a = [];
  (0, _parsingFlags.default)(config).empty = true; // This array is used to make a Date, either with `new Date` or `Date.UTC`

  var string = '' + config._i,
      i,
      parsedInput,
      tokens,
      token,
      skipped,
      stringLength = string.length,
      totalParsedInputLength = 0,
      era;
  tokens = (0, _format.expandFormat)(config._f, config._locale).match(_format.formattingTokens) || [];

  for (i = 0; i < tokens.length; i++) {
    token = tokens[i];
    parsedInput = (string.match((0, _regex.getParseRegexForToken)(token, config)) || [])[0]; // console.log('token', token, 'parsedInput', parsedInput,
    //         'regex', getParseRegexForToken(token, config));

    if (parsedInput) {
      skipped = string.substr(0, string.indexOf(parsedInput));

      if (skipped.length > 0) {
        (0, _parsingFlags.default)(config).unusedInput.push(skipped);
      }

      string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
      totalParsedInputLength += parsedInput.length;
    } // don't parse if it's not a known token


    if (_format.formatTokenFunctions[token]) {
      if (parsedInput) {
        (0, _parsingFlags.default)(config).empty = false;
      } else {
        (0, _parsingFlags.default)(config).unusedTokens.push(token);
      }

      (0, _token.addTimeToArrayFromToken)(token, parsedInput, config);
    } else if (config._strict && !parsedInput) {
      (0, _parsingFlags.default)(config).unusedTokens.push(token);
    }
  } // add remaining unparsed input length to the string


  (0, _parsingFlags.default)(config).charsLeftOver = stringLength - totalParsedInputLength;

  if (string.length > 0) {
    (0, _parsingFlags.default)(config).unusedInput.push(string);
  } // clear _12h flag if hour is <= 12


  if (config._a[_constants.HOUR] <= 12 && (0, _parsingFlags.default)(config).bigHour === true && config._a[_constants.HOUR] > 0) {
    (0, _parsingFlags.default)(config).bigHour = undefined;
  }

  (0, _parsingFlags.default)(config).parsedDateParts = config._a.slice(0);
  (0, _parsingFlags.default)(config).meridiem = config._meridiem; // handle meridiem

  config._a[_constants.HOUR] = meridiemFixWrap(config._locale, config._a[_constants.HOUR], config._meridiem); // handle era

  era = (0, _parsingFlags.default)(config).era;

  if (era !== null) {
    config._a[_constants.YEAR] = config._locale.erasConvertYear(era, config._a[_constants.YEAR]);
  }

  (0, _fromArray.configFromArray)(config);
  (0, _checkOverflow.default)(config);
}

function meridiemFixWrap(locale, hour, meridiem) {
  var isPm;

  if (meridiem == null) {
    // nothing to do
    return hour;
  }

  if (locale.meridiemHour != null) {
    return locale.meridiemHour(hour, meridiem);
  } else if (locale.isPM != null) {
    // Fallback
    isPm = locale.isPM(meridiem);

    if (isPm && hour < 12) {
      hour += 12;
    }

    if (!isPm && hour === 12) {
      hour = 0;
    }

    return hour;
  } else {
    // this is not supposed to happen
    return hour;
  }
}
},{"./from-string":"node_modules/moment/src/lib/create/from-string.js","./from-array":"node_modules/moment/src/lib/create/from-array.js","../parse/regex":"node_modules/moment/src/lib/parse/regex.js","../parse/token":"node_modules/moment/src/lib/parse/token.js","../format/format":"node_modules/moment/src/lib/format/format.js","./check-overflow":"node_modules/moment/src/lib/create/check-overflow.js","../units/constants":"node_modules/moment/src/lib/units/constants.js","../utils/hooks":"node_modules/moment/src/lib/utils/hooks.js","./parsing-flags":"node_modules/moment/src/lib/create/parsing-flags.js"}],"node_modules/moment/src/lib/create/from-string-and-array.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configFromStringAndArray = configFromStringAndArray;

var _constructor = require("../moment/constructor");

var _fromStringAndFormat = require("./from-string-and-format");

var _parsingFlags = _interopRequireDefault(require("./parsing-flags"));

var _valid = require("./valid");

var _extend = _interopRequireDefault(require("../utils/extend"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// date from string and array of format strings
function configFromStringAndArray(config) {
  var tempConfig,
      bestMoment,
      scoreToBeat,
      i,
      currentScore,
      validFormatFound,
      bestFormatIsValid = false;

  if (config._f.length === 0) {
    (0, _parsingFlags.default)(config).invalidFormat = true;
    config._d = new Date(NaN);
    return;
  }

  for (i = 0; i < config._f.length; i++) {
    currentScore = 0;
    validFormatFound = false;
    tempConfig = (0, _constructor.copyConfig)({}, config);

    if (config._useUTC != null) {
      tempConfig._useUTC = config._useUTC;
    }

    tempConfig._f = config._f[i];
    (0, _fromStringAndFormat.configFromStringAndFormat)(tempConfig);

    if ((0, _valid.isValid)(tempConfig)) {
      validFormatFound = true;
    } // if there is any input that was not parsed add a penalty for that format


    currentScore += (0, _parsingFlags.default)(tempConfig).charsLeftOver; //or tokens

    currentScore += (0, _parsingFlags.default)(tempConfig).unusedTokens.length * 10;
    (0, _parsingFlags.default)(tempConfig).score = currentScore;

    if (!bestFormatIsValid) {
      if (scoreToBeat == null || currentScore < scoreToBeat || validFormatFound) {
        scoreToBeat = currentScore;
        bestMoment = tempConfig;

        if (validFormatFound) {
          bestFormatIsValid = true;
        }
      }
    } else {
      if (currentScore < scoreToBeat) {
        scoreToBeat = currentScore;
        bestMoment = tempConfig;
      }
    }
  }

  (0, _extend.default)(config, bestMoment || tempConfig);
}
},{"../moment/constructor":"node_modules/moment/src/lib/moment/constructor.js","./from-string-and-format":"node_modules/moment/src/lib/create/from-string-and-format.js","./parsing-flags":"node_modules/moment/src/lib/create/parsing-flags.js","./valid":"node_modules/moment/src/lib/create/valid.js","../utils/extend":"node_modules/moment/src/lib/utils/extend.js"}],"node_modules/moment/src/lib/create/from-object.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configFromObject = configFromObject;

var _aliases = require("../units/aliases");

var _fromArray = require("./from-array");

var _map = _interopRequireDefault(require("../utils/map"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configFromObject(config) {
  if (config._d) {
    return;
  }

  var i = (0, _aliases.normalizeObjectUnits)(config._i),
      dayOrDate = i.day === undefined ? i.date : i.day;
  config._a = (0, _map.default)([i.year, i.month, dayOrDate, i.hour, i.minute, i.second, i.millisecond], function (obj) {
    return obj && parseInt(obj, 10);
  });
  (0, _fromArray.configFromArray)(config);
}
},{"../units/aliases":"node_modules/moment/src/lib/units/aliases.js","./from-array":"node_modules/moment/src/lib/create/from-array.js","../utils/map":"node_modules/moment/src/lib/utils/map.js"}],"node_modules/moment/src/lib/create/from-anything.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prepareConfig = prepareConfig;
exports.createLocalOrUTC = createLocalOrUTC;

var _isArray = _interopRequireDefault(require("../utils/is-array"));

var _isObject = _interopRequireDefault(require("../utils/is-object"));

var _isObjectEmpty = _interopRequireDefault(require("../utils/is-object-empty"));

var _isUndefined = _interopRequireDefault(require("../utils/is-undefined"));

var _isNumber = _interopRequireDefault(require("../utils/is-number"));

var _isDate = _interopRequireDefault(require("../utils/is-date"));

var _map = _interopRequireDefault(require("../utils/map"));

var _valid = require("./valid");

var _constructor = require("../moment/constructor");

var _locales = require("../locale/locales");

var _hooks = require("../utils/hooks");

var _checkOverflow = _interopRequireDefault(require("./check-overflow"));

var _fromStringAndArray = require("./from-string-and-array");

var _fromStringAndFormat = require("./from-string-and-format");

var _fromString = require("./from-string");

var _fromArray = require("./from-array");

var _fromObject = require("./from-object");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createFromConfig(config) {
  var res = new _constructor.Moment((0, _checkOverflow.default)(prepareConfig(config)));

  if (res._nextDay) {
    // Adding is smart enough around DST
    res.add(1, 'd');
    res._nextDay = undefined;
  }

  return res;
}

function prepareConfig(config) {
  var input = config._i,
      format = config._f;
  config._locale = config._locale || (0, _locales.getLocale)(config._l);

  if (input === null || format === undefined && input === '') {
    return (0, _valid.createInvalid)({
      nullInput: true
    });
  }

  if (typeof input === 'string') {
    config._i = input = config._locale.preparse(input);
  }

  if ((0, _constructor.isMoment)(input)) {
    return new _constructor.Moment((0, _checkOverflow.default)(input));
  } else if ((0, _isDate.default)(input)) {
    config._d = input;
  } else if ((0, _isArray.default)(format)) {
    (0, _fromStringAndArray.configFromStringAndArray)(config);
  } else if (format) {
    (0, _fromStringAndFormat.configFromStringAndFormat)(config);
  } else {
    configFromInput(config);
  }

  if (!(0, _valid.isValid)(config)) {
    config._d = null;
  }

  return config;
}

function configFromInput(config) {
  var input = config._i;

  if ((0, _isUndefined.default)(input)) {
    config._d = new Date(_hooks.hooks.now());
  } else if ((0, _isDate.default)(input)) {
    config._d = new Date(input.valueOf());
  } else if (typeof input === 'string') {
    (0, _fromString.configFromString)(config);
  } else if ((0, _isArray.default)(input)) {
    config._a = (0, _map.default)(input.slice(0), function (obj) {
      return parseInt(obj, 10);
    });
    (0, _fromArray.configFromArray)(config);
  } else if ((0, _isObject.default)(input)) {
    (0, _fromObject.configFromObject)(config);
  } else if ((0, _isNumber.default)(input)) {
    // from milliseconds
    config._d = new Date(input);
  } else {
    _hooks.hooks.createFromInputFallback(config);
  }
}

function createLocalOrUTC(input, format, locale, strict, isUTC) {
  var c = {};

  if (format === true || format === false) {
    strict = format;
    format = undefined;
  }

  if (locale === true || locale === false) {
    strict = locale;
    locale = undefined;
  }

  if ((0, _isObject.default)(input) && (0, _isObjectEmpty.default)(input) || (0, _isArray.default)(input) && input.length === 0) {
    input = undefined;
  } // object construction must be done this way.
  // https://github.com/moment/moment/issues/1423


  c._isAMomentObject = true;
  c._useUTC = c._isUTC = isUTC;
  c._l = locale;
  c._i = input;
  c._f = format;
  c._strict = strict;
  return createFromConfig(c);
}
},{"../utils/is-array":"node_modules/moment/src/lib/utils/is-array.js","../utils/is-object":"node_modules/moment/src/lib/utils/is-object.js","../utils/is-object-empty":"node_modules/moment/src/lib/utils/is-object-empty.js","../utils/is-undefined":"node_modules/moment/src/lib/utils/is-undefined.js","../utils/is-number":"node_modules/moment/src/lib/utils/is-number.js","../utils/is-date":"node_modules/moment/src/lib/utils/is-date.js","../utils/map":"node_modules/moment/src/lib/utils/map.js","./valid":"node_modules/moment/src/lib/create/valid.js","../moment/constructor":"node_modules/moment/src/lib/moment/constructor.js","../locale/locales":"node_modules/moment/src/lib/locale/locales.js","../utils/hooks":"node_modules/moment/src/lib/utils/hooks.js","./check-overflow":"node_modules/moment/src/lib/create/check-overflow.js","./from-string-and-array":"node_modules/moment/src/lib/create/from-string-and-array.js","./from-string-and-format":"node_modules/moment/src/lib/create/from-string-and-format.js","./from-string":"node_modules/moment/src/lib/create/from-string.js","./from-array":"node_modules/moment/src/lib/create/from-array.js","./from-object":"node_modules/moment/src/lib/create/from-object.js"}],"node_modules/moment/src/lib/create/local.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLocal = createLocal;

var _fromAnything = require("./from-anything");

function createLocal(input, format, locale, strict) {
  return (0, _fromAnything.createLocalOrUTC)(input, format, locale, strict, false);
}
},{"./from-anything":"node_modules/moment/src/lib/create/from-anything.js"}],"node_modules/moment/src/lib/moment/min-max.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.min = min;
exports.max = max;
exports.prototypeMax = exports.prototypeMin = void 0;

var _deprecate = require("../utils/deprecate");

var _isArray = _interopRequireDefault(require("../utils/is-array"));

var _local = require("../create/local");

var _valid = require("../create/valid");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prototypeMin = (0, _deprecate.deprecate)('moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/', function () {
  var other = _local.createLocal.apply(null, arguments);

  if (this.isValid() && other.isValid()) {
    return other < this ? this : other;
  } else {
    return (0, _valid.createInvalid)();
  }
}),
    prototypeMax = (0, _deprecate.deprecate)('moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/', function () {
  var other = _local.createLocal.apply(null, arguments);

  if (this.isValid() && other.isValid()) {
    return other > this ? this : other;
  } else {
    return (0, _valid.createInvalid)();
  }
}); // Pick a moment m from moments so that m[fn](other) is true for all
// other. This relies on the function fn to be transitive.
//
// moments should either be an array of moment objects or an array, whose
// first element is an array of moment objects.

exports.prototypeMax = prototypeMax;
exports.prototypeMin = prototypeMin;

function pickBy(fn, moments) {
  var res, i;

  if (moments.length === 1 && (0, _isArray.default)(moments[0])) {
    moments = moments[0];
  }

  if (!moments.length) {
    return (0, _local.createLocal)();
  }

  res = moments[0];

  for (i = 1; i < moments.length; ++i) {
    if (!moments[i].isValid() || moments[i][fn](res)) {
      res = moments[i];
    }
  }

  return res;
} // TODO: Use [].sort instead?


function min() {
  var args = [].slice.call(arguments, 0);
  return pickBy('isBefore', args);
}

function max() {
  var args = [].slice.call(arguments, 0);
  return pickBy('isAfter', args);
}
},{"../utils/deprecate":"node_modules/moment/src/lib/utils/deprecate.js","../utils/is-array":"node_modules/moment/src/lib/utils/is-array.js","../create/local":"node_modules/moment/src/lib/create/local.js","../create/valid":"node_modules/moment/src/lib/create/valid.js"}],"node_modules/moment/src/lib/moment/now.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.now = void 0;

var now = function () {
  return Date.now ? Date.now() : +new Date();
};

exports.now = now;
},{}],"node_modules/moment/src/lib/duration/valid.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isDurationValid;
exports.isValid = isValid;
exports.createInvalid = createInvalid;

var _hasOwnProp = _interopRequireDefault(require("../utils/has-own-prop"));

var _toInt = _interopRequireDefault(require("../utils/to-int"));

var _indexOf = _interopRequireDefault(require("../utils/index-of"));

var _create = require("./create");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ordering = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];

function isDurationValid(m) {
  var key,
      unitHasDecimal = false,
      i;

  for (key in m) {
    if ((0, _hasOwnProp.default)(m, key) && !(_indexOf.default.call(ordering, key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
      return false;
    }
  }

  for (i = 0; i < ordering.length; ++i) {
    if (m[ordering[i]]) {
      if (unitHasDecimal) {
        return false; // only allow non-integers for smallest unit
      }

      if (parseFloat(m[ordering[i]]) !== (0, _toInt.default)(m[ordering[i]])) {
        unitHasDecimal = true;
      }
    }
  }

  return true;
}

function isValid() {
  return this._isValid;
}

function createInvalid() {
  return (0, _create.createDuration)(NaN);
}
},{"../utils/has-own-prop":"node_modules/moment/src/lib/utils/has-own-prop.js","../utils/to-int":"node_modules/moment/src/lib/utils/to-int.js","../utils/index-of":"node_modules/moment/src/lib/utils/index-of.js","./create":"node_modules/moment/src/lib/duration/create.js"}],"node_modules/moment/src/lib/duration/constructor.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Duration = Duration;
exports.isDuration = isDuration;

var _aliases = require("../units/aliases");

var _locales = require("../locale/locales");

var _valid = _interopRequireDefault(require("./valid.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Duration(duration) {
  var normalizedInput = (0, _aliases.normalizeObjectUnits)(duration),
      years = normalizedInput.year || 0,
      quarters = normalizedInput.quarter || 0,
      months = normalizedInput.month || 0,
      weeks = normalizedInput.week || normalizedInput.isoWeek || 0,
      days = normalizedInput.day || 0,
      hours = normalizedInput.hour || 0,
      minutes = normalizedInput.minute || 0,
      seconds = normalizedInput.second || 0,
      milliseconds = normalizedInput.millisecond || 0;
  this._isValid = (0, _valid.default)(normalizedInput); // representation for dateAddRemove

  this._milliseconds = +milliseconds + seconds * 1e3 + // 1000
  minutes * 6e4 + // 1000 * 60
  hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
  // Because of dateAddRemove treats 24 hours as different from a
  // day when working around DST, we need to store them separately

  this._days = +days + weeks * 7; // It is impossible to translate months into days without knowing
  // which months you are are talking about, so we have to store
  // it separately.

  this._months = +months + quarters * 3 + years * 12;
  this._data = {};
  this._locale = (0, _locales.getLocale)();

  this._bubble();
}

function isDuration(obj) {
  return obj instanceof Duration;
}
},{"../units/aliases":"node_modules/moment/src/lib/units/aliases.js","../locale/locales":"node_modules/moment/src/lib/locale/locales.js","./valid.js":"node_modules/moment/src/lib/duration/valid.js"}],"node_modules/moment/src/lib/utils/abs-round.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = absRound;

function absRound(number) {
  if (number < 0) {
    return Math.round(-1 * number) * -1;
  } else {
    return Math.round(number);
  }
}
},{}],"node_modules/moment/src/lib/utils/compare-arrays.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = compareArrays;

var _toInt = _interopRequireDefault(require("./to-int"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// compare two arrays, return the number of differences
function compareArrays(array1, array2, dontConvert) {
  var len = Math.min(array1.length, array2.length),
      lengthDiff = Math.abs(array1.length - array2.length),
      diffs = 0,
      i;

  for (i = 0; i < len; i++) {
    if (dontConvert && array1[i] !== array2[i] || !dontConvert && (0, _toInt.default)(array1[i]) !== (0, _toInt.default)(array2[i])) {
      diffs++;
    }
  }

  return diffs + lengthDiff;
}
},{"./to-int":"node_modules/moment/src/lib/utils/to-int.js"}],"node_modules/moment/src/lib/units/offset.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cloneWithOffset = cloneWithOffset;
exports.getSetOffset = getSetOffset;
exports.getSetZone = getSetZone;
exports.setOffsetToUTC = setOffsetToUTC;
exports.setOffsetToLocal = setOffsetToLocal;
exports.setOffsetToParsedOffset = setOffsetToParsedOffset;
exports.hasAlignedHourOffset = hasAlignedHourOffset;
exports.isDaylightSavingTime = isDaylightSavingTime;
exports.isDaylightSavingTimeShifted = isDaylightSavingTimeShifted;
exports.isLocal = isLocal;
exports.isUtcOffset = isUtcOffset;
exports.isUtc = isUtc;

var _zeroFill = _interopRequireDefault(require("../utils/zero-fill"));

var _create = require("../duration/create");

var _addSubtract = require("../moment/add-subtract");

var _constructor = require("../moment/constructor");

var _format = require("../format/format");

var _regex = require("../parse/regex");

var _token = require("../parse/token");

var _local = require("../create/local");

var _fromAnything = require("../create/from-anything");

var _utc = require("../create/utc");

var _isDate = _interopRequireDefault(require("../utils/is-date"));

var _toInt = _interopRequireDefault(require("../utils/to-int"));

var _isUndefined = _interopRequireDefault(require("../utils/is-undefined"));

var _compareArrays = _interopRequireDefault(require("../utils/compare-arrays"));

var _hooks = require("../utils/hooks");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// FORMATTING
function offset(token, separator) {
  (0, _format.addFormatToken)(token, 0, 0, function () {
    var offset = this.utcOffset(),
        sign = '+';

    if (offset < 0) {
      offset = -offset;
      sign = '-';
    }

    return sign + (0, _zeroFill.default)(~~(offset / 60), 2) + separator + (0, _zeroFill.default)(~~offset % 60, 2);
  });
}

offset('Z', ':');
offset('ZZ', ''); // PARSING

(0, _regex.addRegexToken)('Z', _regex.matchShortOffset);
(0, _regex.addRegexToken)('ZZ', _regex.matchShortOffset);
(0, _token.addParseToken)(['Z', 'ZZ'], function (input, array, config) {
  config._useUTC = true;
  config._tzm = offsetFromString(_regex.matchShortOffset, input);
}); // HELPERS
// timezone chunker
// '+10:00' > ['10',  '00']
// '-1530'  > ['-15', '30']

var chunkOffset = /([\+\-]|\d\d)/gi;

function offsetFromString(matcher, string) {
  var matches = (string || '').match(matcher),
      chunk,
      parts,
      minutes;

  if (matches === null) {
    return null;
  }

  chunk = matches[matches.length - 1] || [];
  parts = (chunk + '').match(chunkOffset) || ['-', 0, 0];
  minutes = +(parts[1] * 60) + (0, _toInt.default)(parts[2]);
  return minutes === 0 ? 0 : parts[0] === '+' ? minutes : -minutes;
} // Return a moment from input, that is local/utc/zone equivalent to model.


function cloneWithOffset(input, model) {
  var res, diff;

  if (model._isUTC) {
    res = model.clone();
    diff = ((0, _constructor.isMoment)(input) || (0, _isDate.default)(input) ? input.valueOf() : (0, _local.createLocal)(input).valueOf()) - res.valueOf(); // Use low-level api, because this fn is low-level api.

    res._d.setTime(res._d.valueOf() + diff);

    _hooks.hooks.updateOffset(res, false);

    return res;
  } else {
    return (0, _local.createLocal)(input).local();
  }
}

function getDateOffset(m) {
  // On Firefox.24 Date#getTimezoneOffset returns a floating point.
  // https://github.com/moment/moment/pull/1871
  return -Math.round(m._d.getTimezoneOffset());
} // HOOKS
// This function will be called whenever a moment is mutated.
// It is intended to keep the offset in sync with the timezone.


_hooks.hooks.updateOffset = function () {}; // MOMENTS
// keepLocalTime = true means only change the timezone, without
// affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
// 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
// +0200, so we adjust the time as needed, to be valid.
//
// Keeping the time actually adds/subtracts (one hour)
// from the actual represented time. That is why we call updateOffset
// a second time. In case it wants us to change the offset again
// _changeInProgress == true case, then we have to adjust, because
// there is no such time in the given timezone.


function getSetOffset(input, keepLocalTime, keepMinutes) {
  var offset = this._offset || 0,
      localAdjust;

  if (!this.isValid()) {
    return input != null ? this : NaN;
  }

  if (input != null) {
    if (typeof input === 'string') {
      input = offsetFromString(_regex.matchShortOffset, input);

      if (input === null) {
        return this;
      }
    } else if (Math.abs(input) < 16 && !keepMinutes) {
      input = input * 60;
    }

    if (!this._isUTC && keepLocalTime) {
      localAdjust = getDateOffset(this);
    }

    this._offset = input;
    this._isUTC = true;

    if (localAdjust != null) {
      this.add(localAdjust, 'm');
    }

    if (offset !== input) {
      if (!keepLocalTime || this._changeInProgress) {
        (0, _addSubtract.addSubtract)(this, (0, _create.createDuration)(input - offset, 'm'), 1, false);
      } else if (!this._changeInProgress) {
        this._changeInProgress = true;

        _hooks.hooks.updateOffset(this, true);

        this._changeInProgress = null;
      }
    }

    return this;
  } else {
    return this._isUTC ? offset : getDateOffset(this);
  }
}

function getSetZone(input, keepLocalTime) {
  if (input != null) {
    if (typeof input !== 'string') {
      input = -input;
    }

    this.utcOffset(input, keepLocalTime);
    return this;
  } else {
    return -this.utcOffset();
  }
}

function setOffsetToUTC(keepLocalTime) {
  return this.utcOffset(0, keepLocalTime);
}

function setOffsetToLocal(keepLocalTime) {
  if (this._isUTC) {
    this.utcOffset(0, keepLocalTime);
    this._isUTC = false;

    if (keepLocalTime) {
      this.subtract(getDateOffset(this), 'm');
    }
  }

  return this;
}

function setOffsetToParsedOffset() {
  if (this._tzm != null) {
    this.utcOffset(this._tzm, false, true);
  } else if (typeof this._i === 'string') {
    var tZone = offsetFromString(_regex.matchOffset, this._i);

    if (tZone != null) {
      this.utcOffset(tZone);
    } else {
      this.utcOffset(0, true);
    }
  }

  return this;
}

function hasAlignedHourOffset(input) {
  if (!this.isValid()) {
    return false;
  }

  input = input ? (0, _local.createLocal)(input).utcOffset() : 0;
  return (this.utcOffset() - input) % 60 === 0;
}

function isDaylightSavingTime() {
  return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
}

function isDaylightSavingTimeShifted() {
  if (!(0, _isUndefined.default)(this._isDSTShifted)) {
    return this._isDSTShifted;
  }

  var c = {},
      other;
  (0, _constructor.copyConfig)(c, this);
  c = (0, _fromAnything.prepareConfig)(c);

  if (c._a) {
    other = c._isUTC ? (0, _utc.createUTC)(c._a) : (0, _local.createLocal)(c._a);
    this._isDSTShifted = this.isValid() && (0, _compareArrays.default)(c._a, other.toArray()) > 0;
  } else {
    this._isDSTShifted = false;
  }

  return this._isDSTShifted;
}

function isLocal() {
  return this.isValid() ? !this._isUTC : false;
}

function isUtcOffset() {
  return this.isValid() ? this._isUTC : false;
}

function isUtc() {
  return this.isValid() ? this._isUTC && this._offset === 0 : false;
}
},{"../utils/zero-fill":"node_modules/moment/src/lib/utils/zero-fill.js","../duration/create":"node_modules/moment/src/lib/duration/create.js","../moment/add-subtract":"node_modules/moment/src/lib/moment/add-subtract.js","../moment/constructor":"node_modules/moment/src/lib/moment/constructor.js","../format/format":"node_modules/moment/src/lib/format/format.js","../parse/regex":"node_modules/moment/src/lib/parse/regex.js","../parse/token":"node_modules/moment/src/lib/parse/token.js","../create/local":"node_modules/moment/src/lib/create/local.js","../create/from-anything":"node_modules/moment/src/lib/create/from-anything.js","../create/utc":"node_modules/moment/src/lib/create/utc.js","../utils/is-date":"node_modules/moment/src/lib/utils/is-date.js","../utils/to-int":"node_modules/moment/src/lib/utils/to-int.js","../utils/is-undefined":"node_modules/moment/src/lib/utils/is-undefined.js","../utils/compare-arrays":"node_modules/moment/src/lib/utils/compare-arrays.js","../utils/hooks":"node_modules/moment/src/lib/utils/hooks.js"}],"node_modules/moment/src/lib/duration/create.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDuration = createDuration;

var _constructor = require("./constructor");

var _isNumber = _interopRequireDefault(require("../utils/is-number"));

var _toInt = _interopRequireDefault(require("../utils/to-int"));

var _absRound = _interopRequireDefault(require("../utils/abs-round"));

var _hasOwnProp = _interopRequireDefault(require("../utils/has-own-prop"));

var _constants = require("../units/constants");

var _offset = require("../units/offset");

var _local = require("../create/local");

var _valid = require("./valid");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ASP.NET json date format regex
var aspNetRegex = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/,
    // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
// somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
// and further modified to allow for strings containing both week and day
isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

function createDuration(input, key) {
  var duration = input,
      // matching against regexp is expensive, do it on demand
  match = null,
      sign,
      ret,
      diffRes;

  if ((0, _constructor.isDuration)(input)) {
    duration = {
      ms: input._milliseconds,
      d: input._days,
      M: input._months
    };
  } else if ((0, _isNumber.default)(input) || !isNaN(+input)) {
    duration = {};

    if (key) {
      duration[key] = +input;
    } else {
      duration.milliseconds = +input;
    }
  } else if (match = aspNetRegex.exec(input)) {
    sign = match[1] === '-' ? -1 : 1;
    duration = {
      y: 0,
      d: (0, _toInt.default)(match[_constants.DATE]) * sign,
      h: (0, _toInt.default)(match[_constants.HOUR]) * sign,
      m: (0, _toInt.default)(match[_constants.MINUTE]) * sign,
      s: (0, _toInt.default)(match[_constants.SECOND]) * sign,
      ms: (0, _toInt.default)((0, _absRound.default)(match[_constants.MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match

    };
  } else if (match = isoRegex.exec(input)) {
    sign = match[1] === '-' ? -1 : 1;
    duration = {
      y: parseIso(match[2], sign),
      M: parseIso(match[3], sign),
      w: parseIso(match[4], sign),
      d: parseIso(match[5], sign),
      h: parseIso(match[6], sign),
      m: parseIso(match[7], sign),
      s: parseIso(match[8], sign)
    };
  } else if (duration == null) {
    // checks for null or undefined
    duration = {};
  } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
    diffRes = momentsDifference((0, _local.createLocal)(duration.from), (0, _local.createLocal)(duration.to));
    duration = {};
    duration.ms = diffRes.milliseconds;
    duration.M = diffRes.months;
  }

  ret = new _constructor.Duration(duration);

  if ((0, _constructor.isDuration)(input) && (0, _hasOwnProp.default)(input, '_locale')) {
    ret._locale = input._locale;
  }

  if ((0, _constructor.isDuration)(input) && (0, _hasOwnProp.default)(input, '_isValid')) {
    ret._isValid = input._isValid;
  }

  return ret;
}

createDuration.fn = _constructor.Duration.prototype;
createDuration.invalid = _valid.createInvalid;

function parseIso(inp, sign) {
  // We'd normally use ~~inp for this, but unfortunately it also
  // converts floats to ints.
  // inp may be undefined, so careful calling replace on it.
  var res = inp && parseFloat(inp.replace(',', '.')); // apply sign while we're at it

  return (isNaN(res) ? 0 : res) * sign;
}

function positiveMomentsDifference(base, other) {
  var res = {};
  res.months = other.month() - base.month() + (other.year() - base.year()) * 12;

  if (base.clone().add(res.months, 'M').isAfter(other)) {
    --res.months;
  }

  res.milliseconds = +other - +base.clone().add(res.months, 'M');
  return res;
}

function momentsDifference(base, other) {
  var res;

  if (!(base.isValid() && other.isValid())) {
    return {
      milliseconds: 0,
      months: 0
    };
  }

  other = (0, _offset.cloneWithOffset)(other, base);

  if (base.isBefore(other)) {
    res = positiveMomentsDifference(base, other);
  } else {
    res = positiveMomentsDifference(other, base);
    res.milliseconds = -res.milliseconds;
    res.months = -res.months;
  }

  return res;
}
},{"./constructor":"node_modules/moment/src/lib/duration/constructor.js","../utils/is-number":"node_modules/moment/src/lib/utils/is-number.js","../utils/to-int":"node_modules/moment/src/lib/utils/to-int.js","../utils/abs-round":"node_modules/moment/src/lib/utils/abs-round.js","../utils/has-own-prop":"node_modules/moment/src/lib/utils/has-own-prop.js","../units/constants":"node_modules/moment/src/lib/units/constants.js","../units/offset":"node_modules/moment/src/lib/units/offset.js","../create/local":"node_modules/moment/src/lib/create/local.js","./valid":"node_modules/moment/src/lib/duration/valid.js"}],"node_modules/moment/src/lib/moment/add-subtract.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addSubtract = addSubtract;
exports.subtract = exports.add = void 0;

var _getSet = require("./get-set");

var _month = require("../units/month");

var _create = require("../duration/create");

var _deprecate = require("../utils/deprecate");

var _hooks = require("../utils/hooks");

var _absRound = _interopRequireDefault(require("../utils/abs-round"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: remove 'name' arg after deprecation is removed
function createAdder(direction, name) {
  return function (val, period) {
    var dur, tmp; //invert the arguments, but complain about it

    if (period !== null && !isNaN(+period)) {
      (0, _deprecate.deprecateSimple)(name, 'moment().' + name + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' + 'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
      tmp = val;
      val = period;
      period = tmp;
    }

    dur = (0, _create.createDuration)(val, period);
    addSubtract(this, dur, direction);
    return this;
  };
}

function addSubtract(mom, duration, isAdding, updateOffset) {
  var milliseconds = duration._milliseconds,
      days = (0, _absRound.default)(duration._days),
      months = (0, _absRound.default)(duration._months);

  if (!mom.isValid()) {
    // No op
    return;
  }

  updateOffset = updateOffset == null ? true : updateOffset;

  if (months) {
    (0, _month.setMonth)(mom, (0, _getSet.get)(mom, 'Month') + months * isAdding);
  }

  if (days) {
    (0, _getSet.set)(mom, 'Date', (0, _getSet.get)(mom, 'Date') + days * isAdding);
  }

  if (milliseconds) {
    mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
  }

  if (updateOffset) {
    _hooks.hooks.updateOffset(mom, days || months);
  }
}

var add = createAdder(1, 'add'),
    subtract = createAdder(-1, 'subtract');
exports.subtract = subtract;
exports.add = add;
},{"./get-set":"node_modules/moment/src/lib/moment/get-set.js","../units/month":"node_modules/moment/src/lib/units/month.js","../duration/create":"node_modules/moment/src/lib/duration/create.js","../utils/deprecate":"node_modules/moment/src/lib/utils/deprecate.js","../utils/hooks":"node_modules/moment/src/lib/utils/hooks.js","../utils/abs-round":"node_modules/moment/src/lib/utils/abs-round.js"}],"node_modules/moment/src/lib/utils/is-string.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isString;

function isString(input) {
  return typeof input === 'string' || input instanceof String;
}
},{}],"node_modules/moment/src/lib/utils/is-moment-input.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isMomentInput = isMomentInput;
exports.isMomentInputObject = isMomentInputObject;

var _isObjectEmpty = _interopRequireDefault(require("./is-object-empty"));

var _hasOwnProp = _interopRequireDefault(require("./has-own-prop"));

var _isObject = _interopRequireDefault(require("./is-object"));

var _isDate = _interopRequireDefault(require("./is-date"));

var _isNumber = _interopRequireDefault(require("./is-number"));

var _isString = _interopRequireDefault(require("./is-string"));

var _constructor = require("../moment/constructor");

var _isArray = _interopRequireDefault(require("./is-array"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// type MomentInput = Moment | Date | string | number | (number | string)[] | MomentInputObject | void; // null | undefined
function isMomentInput(input) {
  return (0, _constructor.isMoment)(input) || (0, _isDate.default)(input) || (0, _isString.default)(input) || (0, _isNumber.default)(input) || isNumberOrStringArray(input) || isMomentInputObject(input) || input === null || input === undefined;
}

function isMomentInputObject(input) {
  var objectTest = (0, _isObject.default)(input) && !(0, _isObjectEmpty.default)(input),
      propertyTest = false,
      properties = ['years', 'year', 'y', 'months', 'month', 'M', 'days', 'day', 'd', 'dates', 'date', 'D', 'hours', 'hour', 'h', 'minutes', 'minute', 'm', 'seconds', 'second', 's', 'milliseconds', 'millisecond', 'ms'],
      i,
      property;

  for (i = 0; i < properties.length; i += 1) {
    property = properties[i];
    propertyTest = propertyTest || (0, _hasOwnProp.default)(input, property);
  }

  return objectTest && propertyTest;
}

function isNumberOrStringArray(input) {
  var arrayTest = (0, _isArray.default)(input),
      dataTypeTest = false;

  if (arrayTest) {
    dataTypeTest = input.filter(function (item) {
      return !(0, _isNumber.default)(item) && (0, _isString.default)(input);
    }).length === 0;
  }

  return arrayTest && dataTypeTest;
}
},{"./is-object-empty":"node_modules/moment/src/lib/utils/is-object-empty.js","./has-own-prop":"node_modules/moment/src/lib/utils/has-own-prop.js","./is-object":"node_modules/moment/src/lib/utils/is-object.js","./is-date":"node_modules/moment/src/lib/utils/is-date.js","./is-number":"node_modules/moment/src/lib/utils/is-number.js","./is-string":"node_modules/moment/src/lib/utils/is-string.js","../moment/constructor":"node_modules/moment/src/lib/moment/constructor.js","./is-array":"node_modules/moment/src/lib/utils/is-array.js"}],"node_modules/moment/src/lib/utils/is-calendar-spec.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isCalendarSpec;

var _isObjectEmpty = _interopRequireDefault(require("./is-object-empty"));

var _hasOwnProp = _interopRequireDefault(require("./has-own-prop"));

var _isObject = _interopRequireDefault(require("./is-object"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isCalendarSpec(input) {
  var objectTest = (0, _isObject.default)(input) && !(0, _isObjectEmpty.default)(input),
      propertyTest = false,
      properties = ['sameDay', 'nextDay', 'lastDay', 'nextWeek', 'lastWeek', 'sameElse'],
      i,
      property;

  for (i = 0; i < properties.length; i += 1) {
    property = properties[i];
    propertyTest = propertyTest || (0, _hasOwnProp.default)(input, property);
  }

  return objectTest && propertyTest;
}
},{"./is-object-empty":"node_modules/moment/src/lib/utils/is-object-empty.js","./has-own-prop":"node_modules/moment/src/lib/utils/has-own-prop.js","./is-object":"node_modules/moment/src/lib/utils/is-object.js"}],"node_modules/moment/src/lib/moment/calendar.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCalendarFormat = getCalendarFormat;
exports.calendar = calendar;

var _local = require("../create/local");

var _offset = require("../units/offset");

var _isFunction = _interopRequireDefault(require("../utils/is-function"));

var _hooks = require("../utils/hooks");

var _isMomentInput = require("../utils/is-moment-input");

var _isCalendarSpec = _interopRequireDefault(require("../utils/is-calendar-spec"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getCalendarFormat(myMoment, now) {
  var diff = myMoment.diff(now, 'days', true);
  return diff < -6 ? 'sameElse' : diff < -1 ? 'lastWeek' : diff < 0 ? 'lastDay' : diff < 1 ? 'sameDay' : diff < 2 ? 'nextDay' : diff < 7 ? 'nextWeek' : 'sameElse';
}

function calendar(time, formats) {
  // Support for single parameter, formats only overload to the calendar function
  if (arguments.length === 1) {
    if ((0, _isMomentInput.isMomentInput)(arguments[0])) {
      time = arguments[0];
      formats = undefined;
    } else if ((0, _isCalendarSpec.default)(arguments[0])) {
      formats = arguments[0];
      time = undefined;
    }
  } // We want to compare the start of today, vs this.
  // Getting start-of-today depends on whether we're local/utc/offset or not.


  var now = time || (0, _local.createLocal)(),
      sod = (0, _offset.cloneWithOffset)(now, this).startOf('day'),
      format = _hooks.hooks.calendarFormat(this, sod) || 'sameElse',
      output = formats && ((0, _isFunction.default)(formats[format]) ? formats[format].call(this, now) : formats[format]);
  return this.format(output || this.localeData().calendar(format, this, (0, _local.createLocal)(now)));
}
},{"../create/local":"node_modules/moment/src/lib/create/local.js","../units/offset":"node_modules/moment/src/lib/units/offset.js","../utils/is-function":"node_modules/moment/src/lib/utils/is-function.js","../utils/hooks":"node_modules/moment/src/lib/utils/hooks.js","../utils/is-moment-input":"node_modules/moment/src/lib/utils/is-moment-input.js","../utils/is-calendar-spec":"node_modules/moment/src/lib/utils/is-calendar-spec.js"}],"node_modules/moment/src/lib/moment/clone.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clone = clone;

var _constructor = require("./constructor");

function clone() {
  return new _constructor.Moment(this);
}
},{"./constructor":"node_modules/moment/src/lib/moment/constructor.js"}],"node_modules/moment/src/lib/moment/compare.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isAfter = isAfter;
exports.isBefore = isBefore;
exports.isBetween = isBetween;
exports.isSame = isSame;
exports.isSameOrAfter = isSameOrAfter;
exports.isSameOrBefore = isSameOrBefore;

var _constructor = require("./constructor");

var _aliases = require("../units/aliases");

var _local = require("../create/local");

function isAfter(input, units) {
  var localInput = (0, _constructor.isMoment)(input) ? input : (0, _local.createLocal)(input);

  if (!(this.isValid() && localInput.isValid())) {
    return false;
  }

  units = (0, _aliases.normalizeUnits)(units) || 'millisecond';

  if (units === 'millisecond') {
    return this.valueOf() > localInput.valueOf();
  } else {
    return localInput.valueOf() < this.clone().startOf(units).valueOf();
  }
}

function isBefore(input, units) {
  var localInput = (0, _constructor.isMoment)(input) ? input : (0, _local.createLocal)(input);

  if (!(this.isValid() && localInput.isValid())) {
    return false;
  }

  units = (0, _aliases.normalizeUnits)(units) || 'millisecond';

  if (units === 'millisecond') {
    return this.valueOf() < localInput.valueOf();
  } else {
    return this.clone().endOf(units).valueOf() < localInput.valueOf();
  }
}

function isBetween(from, to, units, inclusivity) {
  var localFrom = (0, _constructor.isMoment)(from) ? from : (0, _local.createLocal)(from),
      localTo = (0, _constructor.isMoment)(to) ? to : (0, _local.createLocal)(to);

  if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
    return false;
  }

  inclusivity = inclusivity || '()';
  return (inclusivity[0] === '(' ? this.isAfter(localFrom, units) : !this.isBefore(localFrom, units)) && (inclusivity[1] === ')' ? this.isBefore(localTo, units) : !this.isAfter(localTo, units));
}

function isSame(input, units) {
  var localInput = (0, _constructor.isMoment)(input) ? input : (0, _local.createLocal)(input),
      inputMs;

  if (!(this.isValid() && localInput.isValid())) {
    return false;
  }

  units = (0, _aliases.normalizeUnits)(units) || 'millisecond';

  if (units === 'millisecond') {
    return this.valueOf() === localInput.valueOf();
  } else {
    inputMs = localInput.valueOf();
    return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
  }
}

function isSameOrAfter(input, units) {
  return this.isSame(input, units) || this.isAfter(input, units);
}

function isSameOrBefore(input, units) {
  return this.isSame(input, units) || this.isBefore(input, units);
}
},{"./constructor":"node_modules/moment/src/lib/moment/constructor.js","../units/aliases":"node_modules/moment/src/lib/units/aliases.js","../create/local":"node_modules/moment/src/lib/create/local.js"}],"node_modules/moment/src/lib/moment/diff.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diff = diff;

var _absFloor = _interopRequireDefault(require("../utils/abs-floor"));

var _offset = require("../units/offset");

var _aliases = require("../units/aliases");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function diff(input, units, asFloat) {
  var that, zoneDelta, output;

  if (!this.isValid()) {
    return NaN;
  }

  that = (0, _offset.cloneWithOffset)(input, this);

  if (!that.isValid()) {
    return NaN;
  }

  zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;
  units = (0, _aliases.normalizeUnits)(units);

  switch (units) {
    case 'year':
      output = monthDiff(this, that) / 12;
      break;

    case 'month':
      output = monthDiff(this, that);
      break;

    case 'quarter':
      output = monthDiff(this, that) / 3;
      break;

    case 'second':
      output = (this - that) / 1e3;
      break;
    // 1000

    case 'minute':
      output = (this - that) / 6e4;
      break;
    // 1000 * 60

    case 'hour':
      output = (this - that) / 36e5;
      break;
    // 1000 * 60 * 60

    case 'day':
      output = (this - that - zoneDelta) / 864e5;
      break;
    // 1000 * 60 * 60 * 24, negate dst

    case 'week':
      output = (this - that - zoneDelta) / 6048e5;
      break;
    // 1000 * 60 * 60 * 24 * 7, negate dst

    default:
      output = this - that;
  }

  return asFloat ? output : (0, _absFloor.default)(output);
}

function monthDiff(a, b) {
  if (a.date() < b.date()) {
    // end-of-month calculations work correct when the start month has more
    // days than the end month.
    return -monthDiff(b, a);
  } // difference in months


  var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month()),
      // b is in (anchor - 1 month, anchor + 1 month)
  anchor = a.clone().add(wholeMonthDiff, 'months'),
      anchor2,
      adjust;

  if (b - anchor < 0) {
    anchor2 = a.clone().add(wholeMonthDiff - 1, 'months'); // linear across the month

    adjust = (b - anchor) / (anchor - anchor2);
  } else {
    anchor2 = a.clone().add(wholeMonthDiff + 1, 'months'); // linear across the month

    adjust = (b - anchor) / (anchor2 - anchor);
  } //check for negative zero, return zero if negative zero


  return -(wholeMonthDiff + adjust) || 0;
}
},{"../utils/abs-floor":"node_modules/moment/src/lib/utils/abs-floor.js","../units/offset":"node_modules/moment/src/lib/units/offset.js","../units/aliases":"node_modules/moment/src/lib/units/aliases.js"}],"node_modules/moment/src/lib/moment/format.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toString = toString;
exports.toISOString = toISOString;
exports.inspect = inspect;
exports.format = format;

var _format = require("../format/format");

var _hooks = require("../utils/hooks");

var _isFunction = _interopRequireDefault(require("../utils/is-function"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_hooks.hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
_hooks.hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

function toString() {
  return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
}

function toISOString(keepOffset) {
  if (!this.isValid()) {
    return null;
  }

  var utc = keepOffset !== true,
      m = utc ? this.clone().utc() : this;

  if (m.year() < 0 || m.year() > 9999) {
    return (0, _format.formatMoment)(m, utc ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ');
  }

  if ((0, _isFunction.default)(Date.prototype.toISOString)) {
    // native implementation is ~50x faster, use it when we can
    if (utc) {
      return this.toDate().toISOString();
    } else {
      return new Date(this.valueOf() + this.utcOffset() * 60 * 1000).toISOString().replace('Z', (0, _format.formatMoment)(m, 'Z'));
    }
  }

  return (0, _format.formatMoment)(m, utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ');
}
/**
 * Return a human readable representation of a moment that can
 * also be evaluated to get a new moment which is the same
 *
 * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
 */


function inspect() {
  if (!this.isValid()) {
    return 'moment.invalid(/* ' + this._i + ' */)';
  }

  var func = 'moment',
      zone = '',
      prefix,
      year,
      datetime,
      suffix;

  if (!this.isLocal()) {
    func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
    zone = 'Z';
  }

  prefix = '[' + func + '("]';
  year = 0 <= this.year() && this.year() <= 9999 ? 'YYYY' : 'YYYYYY';
  datetime = '-MM-DD[T]HH:mm:ss.SSS';
  suffix = zone + '[")]';
  return this.format(prefix + year + datetime + suffix);
}

function format(inputString) {
  if (!inputString) {
    inputString = this.isUtc() ? _hooks.hooks.defaultFormatUtc : _hooks.hooks.defaultFormat;
  }

  var output = (0, _format.formatMoment)(this, inputString);
  return this.localeData().postformat(output);
}
},{"../format/format":"node_modules/moment/src/lib/format/format.js","../utils/hooks":"node_modules/moment/src/lib/utils/hooks.js","../utils/is-function":"node_modules/moment/src/lib/utils/is-function.js"}],"node_modules/moment/src/lib/moment/from.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.from = from;
exports.fromNow = fromNow;

var _create = require("../duration/create");

var _local = require("../create/local");

var _constructor = require("../moment/constructor");

function from(time, withoutSuffix) {
  if (this.isValid() && ((0, _constructor.isMoment)(time) && time.isValid() || (0, _local.createLocal)(time).isValid())) {
    return (0, _create.createDuration)({
      to: this,
      from: time
    }).locale(this.locale()).humanize(!withoutSuffix);
  } else {
    return this.localeData().invalidDate();
  }
}

function fromNow(withoutSuffix) {
  return this.from((0, _local.createLocal)(), withoutSuffix);
}
},{"../duration/create":"node_modules/moment/src/lib/duration/create.js","../create/local":"node_modules/moment/src/lib/create/local.js","../moment/constructor":"node_modules/moment/src/lib/moment/constructor.js"}],"node_modules/moment/src/lib/moment/to.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.to = to;
exports.toNow = toNow;

var _create = require("../duration/create");

var _local = require("../create/local");

var _constructor = require("../moment/constructor");

function to(time, withoutSuffix) {
  if (this.isValid() && ((0, _constructor.isMoment)(time) && time.isValid() || (0, _local.createLocal)(time).isValid())) {
    return (0, _create.createDuration)({
      from: this,
      to: time
    }).locale(this.locale()).humanize(!withoutSuffix);
  } else {
    return this.localeData().invalidDate();
  }
}

function toNow(withoutSuffix) {
  return this.to((0, _local.createLocal)(), withoutSuffix);
}
},{"../duration/create":"node_modules/moment/src/lib/duration/create.js","../create/local":"node_modules/moment/src/lib/create/local.js","../moment/constructor":"node_modules/moment/src/lib/moment/constructor.js"}],"node_modules/moment/src/lib/moment/locale.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.locale = locale;
exports.localeData = localeData;
exports.lang = void 0;

var _locales = require("../locale/locales");

var _deprecate = require("../utils/deprecate");

// If passed a locale key, it will set the locale for this
// instance.  Otherwise, it will return the locale configuration
// variables for this instance.
function locale(key) {
  var newLocaleData;

  if (key === undefined) {
    return this._locale._abbr;
  } else {
    newLocaleData = (0, _locales.getLocale)(key);

    if (newLocaleData != null) {
      this._locale = newLocaleData;
    }

    return this;
  }
}

var lang = (0, _deprecate.deprecate)('moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.', function (key) {
  if (key === undefined) {
    return this.localeData();
  } else {
    return this.locale(key);
  }
});
exports.lang = lang;

function localeData() {
  return this._locale;
}
},{"../locale/locales":"node_modules/moment/src/lib/locale/locales.js","../utils/deprecate":"node_modules/moment/src/lib/utils/deprecate.js"}],"node_modules/moment/src/lib/moment/start-end-of.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startOf = startOf;
exports.endOf = endOf;

var _aliases = require("../units/aliases");

var _hooks = require("../utils/hooks");

var MS_PER_SECOND = 1000,
    MS_PER_MINUTE = 60 * MS_PER_SECOND,
    MS_PER_HOUR = 60 * MS_PER_MINUTE,
    MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR; // actual modulo - handles negative numbers (for dates before 1970):

function mod(dividend, divisor) {
  return (dividend % divisor + divisor) % divisor;
}

function localStartOfDate(y, m, d) {
  // the date constructor remaps years 0-99 to 1900-1999
  if (y < 100 && y >= 0) {
    // preserve leap years using a full 400 year cycle, then reset
    return new Date(y + 400, m, d) - MS_PER_400_YEARS;
  } else {
    return new Date(y, m, d).valueOf();
  }
}

function utcStartOfDate(y, m, d) {
  // Date.UTC remaps years 0-99 to 1900-1999
  if (y < 100 && y >= 0) {
    // preserve leap years using a full 400 year cycle, then reset
    return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
  } else {
    return Date.UTC(y, m, d);
  }
}

function startOf(units) {
  var time, startOfDate;
  units = (0, _aliases.normalizeUnits)(units);

  if (units === undefined || units === 'millisecond' || !this.isValid()) {
    return this;
  }

  startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

  switch (units) {
    case 'year':
      time = startOfDate(this.year(), 0, 1);
      break;

    case 'quarter':
      time = startOfDate(this.year(), this.month() - this.month() % 3, 1);
      break;

    case 'month':
      time = startOfDate(this.year(), this.month(), 1);
      break;

    case 'week':
      time = startOfDate(this.year(), this.month(), this.date() - this.weekday());
      break;

    case 'isoWeek':
      time = startOfDate(this.year(), this.month(), this.date() - (this.isoWeekday() - 1));
      break;

    case 'day':
    case 'date':
      time = startOfDate(this.year(), this.month(), this.date());
      break;

    case 'hour':
      time = this._d.valueOf();
      time -= mod(time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE), MS_PER_HOUR);
      break;

    case 'minute':
      time = this._d.valueOf();
      time -= mod(time, MS_PER_MINUTE);
      break;

    case 'second':
      time = this._d.valueOf();
      time -= mod(time, MS_PER_SECOND);
      break;
  }

  this._d.setTime(time);

  _hooks.hooks.updateOffset(this, true);

  return this;
}

function endOf(units) {
  var time, startOfDate;
  units = (0, _aliases.normalizeUnits)(units);

  if (units === undefined || units === 'millisecond' || !this.isValid()) {
    return this;
  }

  startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

  switch (units) {
    case 'year':
      time = startOfDate(this.year() + 1, 0, 1) - 1;
      break;

    case 'quarter':
      time = startOfDate(this.year(), this.month() - this.month() % 3 + 3, 1) - 1;
      break;

    case 'month':
      time = startOfDate(this.year(), this.month() + 1, 1) - 1;
      break;

    case 'week':
      time = startOfDate(this.year(), this.month(), this.date() - this.weekday() + 7) - 1;
      break;

    case 'isoWeek':
      time = startOfDate(this.year(), this.month(), this.date() - (this.isoWeekday() - 1) + 7) - 1;
      break;

    case 'day':
    case 'date':
      time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
      break;

    case 'hour':
      time = this._d.valueOf();
      time += MS_PER_HOUR - mod(time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE), MS_PER_HOUR) - 1;
      break;

    case 'minute':
      time = this._d.valueOf();
      time += MS_PER_MINUTE - mod(time, MS_PER_MINUTE) - 1;
      break;

    case 'second':
      time = this._d.valueOf();
      time += MS_PER_SECOND - mod(time, MS_PER_SECOND) - 1;
      break;
  }

  this._d.setTime(time);

  _hooks.hooks.updateOffset(this, true);

  return this;
}
},{"../units/aliases":"node_modules/moment/src/lib/units/aliases.js","../utils/hooks":"node_modules/moment/src/lib/utils/hooks.js"}],"node_modules/moment/src/lib/moment/to-type.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.valueOf = valueOf;
exports.unix = unix;
exports.toDate = toDate;
exports.toArray = toArray;
exports.toObject = toObject;
exports.toJSON = toJSON;

function valueOf() {
  return this._d.valueOf() - (this._offset || 0) * 60000;
}

function unix() {
  return Math.floor(this.valueOf() / 1000);
}

function toDate() {
  return new Date(this.valueOf());
}

function toArray() {
  var m = this;
  return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
}

function toObject() {
  var m = this;
  return {
    years: m.year(),
    months: m.month(),
    date: m.date(),
    hours: m.hours(),
    minutes: m.minutes(),
    seconds: m.seconds(),
    milliseconds: m.milliseconds()
  };
}

function toJSON() {
  // new Date(NaN).toJSON() === null
  return this.isValid() ? this.toISOString() : null;
}
},{}],"node_modules/moment/src/lib/moment/valid.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValid = isValid;
exports.parsingFlags = parsingFlags;
exports.invalidAt = invalidAt;

var _valid = require("../create/valid");

var _extend = _interopRequireDefault(require("../utils/extend"));

var _parsingFlags = _interopRequireDefault(require("../create/parsing-flags"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isValid() {
  return (0, _valid.isValid)(this);
}

function parsingFlags() {
  return (0, _extend.default)({}, (0, _parsingFlags.default)(this));
}

function invalidAt() {
  return (0, _parsingFlags.default)(this).overflow;
}
},{"../create/valid":"node_modules/moment/src/lib/create/valid.js","../utils/extend":"node_modules/moment/src/lib/utils/extend.js","../create/parsing-flags":"node_modules/moment/src/lib/create/parsing-flags.js"}],"node_modules/moment/src/lib/moment/creation-data.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.creationData = creationData;

function creationData() {
  return {
    input: this._i,
    format: this._f,
    locale: this._locale,
    isUTC: this._isUTC,
    strict: this._strict
  };
}
},{}],"node_modules/moment/src/lib/units/era.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.localeEras = localeEras;
exports.localeErasParse = localeErasParse;
exports.localeErasConvertYear = localeErasConvertYear;
exports.getEraName = getEraName;
exports.getEraNarrow = getEraNarrow;
exports.getEraAbbr = getEraAbbr;
exports.getEraYear = getEraYear;
exports.erasNameRegex = erasNameRegex;
exports.erasAbbrRegex = erasAbbrRegex;
exports.erasNarrowRegex = erasNarrowRegex;

var _format = require("../format/format");

var _regex = require("../parse/regex");

var _token = require("../parse/token");

var _constants = require("./constants");

var _hooks = require("../utils/hooks");

var _locales = require("../locale/locales");

var _parsingFlags = _interopRequireDefault(require("../create/parsing-flags"));

var _hasOwnProp = _interopRequireDefault(require("../utils/has-own-prop"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _format.addFormatToken)('N', 0, 0, 'eraAbbr');
(0, _format.addFormatToken)('NN', 0, 0, 'eraAbbr');
(0, _format.addFormatToken)('NNN', 0, 0, 'eraAbbr');
(0, _format.addFormatToken)('NNNN', 0, 0, 'eraName');
(0, _format.addFormatToken)('NNNNN', 0, 0, 'eraNarrow');
(0, _format.addFormatToken)('y', ['y', 1], 'yo', 'eraYear');
(0, _format.addFormatToken)('y', ['yy', 2], 0, 'eraYear');
(0, _format.addFormatToken)('y', ['yyy', 3], 0, 'eraYear');
(0, _format.addFormatToken)('y', ['yyyy', 4], 0, 'eraYear');
(0, _regex.addRegexToken)('N', matchEraAbbr);
(0, _regex.addRegexToken)('NN', matchEraAbbr);
(0, _regex.addRegexToken)('NNN', matchEraAbbr);
(0, _regex.addRegexToken)('NNNN', matchEraName);
(0, _regex.addRegexToken)('NNNNN', matchEraNarrow);
(0, _token.addParseToken)(['N', 'NN', 'NNN', 'NNNN', 'NNNNN'], function (input, array, config, token) {
  var era = config._locale.erasParse(input, token, config._strict);

  if (era) {
    (0, _parsingFlags.default)(config).era = era;
  } else {
    (0, _parsingFlags.default)(config).invalidEra = input;
  }
});
(0, _regex.addRegexToken)('y', _regex.matchUnsigned);
(0, _regex.addRegexToken)('yy', _regex.matchUnsigned);
(0, _regex.addRegexToken)('yyy', _regex.matchUnsigned);
(0, _regex.addRegexToken)('yyyy', _regex.matchUnsigned);
(0, _regex.addRegexToken)('yo', matchEraYearOrdinal);
(0, _token.addParseToken)(['y', 'yy', 'yyy', 'yyyy'], _constants.YEAR);
(0, _token.addParseToken)(['yo'], function (input, array, config, token) {
  var match;

  if (config._locale._eraYearOrdinalRegex) {
    match = input.match(config._locale._eraYearOrdinalRegex);
  }

  if (config._locale.eraYearOrdinalParse) {
    array[_constants.YEAR] = config._locale.eraYearOrdinalParse(input, match);
  } else {
    array[_constants.YEAR] = parseInt(input, 10);
  }
});

function localeEras(m, format) {
  var i,
      l,
      date,
      eras = this._eras || (0, _locales.getLocale)('en')._eras;

  for (i = 0, l = eras.length; i < l; ++i) {
    switch (typeof eras[i].since) {
      case 'string':
        // truncate time
        date = (0, _hooks.hooks)(eras[i].since).startOf('day');
        eras[i].since = date.valueOf();
        break;
    }

    switch (typeof eras[i].until) {
      case 'undefined':
        eras[i].until = +Infinity;
        break;

      case 'string':
        // truncate time
        date = (0, _hooks.hooks)(eras[i].until).startOf('day').valueOf();
        eras[i].until = date.valueOf();
        break;
    }
  }

  return eras;
}

function localeErasParse(eraName, format, strict) {
  var i,
      l,
      eras = this.eras(),
      name,
      abbr,
      narrow;
  eraName = eraName.toUpperCase();

  for (i = 0, l = eras.length; i < l; ++i) {
    name = eras[i].name.toUpperCase();
    abbr = eras[i].abbr.toUpperCase();
    narrow = eras[i].narrow.toUpperCase();

    if (strict) {
      switch (format) {
        case 'N':
        case 'NN':
        case 'NNN':
          if (abbr === eraName) {
            return eras[i];
          }

          break;

        case 'NNNN':
          if (name === eraName) {
            return eras[i];
          }

          break;

        case 'NNNNN':
          if (narrow === eraName) {
            return eras[i];
          }

          break;
      }
    } else if ([name, abbr, narrow].indexOf(eraName) >= 0) {
      return eras[i];
    }
  }
}

function localeErasConvertYear(era, year) {
  var dir = era.since <= era.until ? +1 : -1;

  if (year === undefined) {
    return (0, _hooks.hooks)(era.since).year();
  } else {
    return (0, _hooks.hooks)(era.since).year() + (year - era.offset) * dir;
  }
}

function getEraName() {
  var i,
      l,
      val,
      eras = this.localeData().eras();

  for (i = 0, l = eras.length; i < l; ++i) {
    // truncate time
    val = this.startOf('day').valueOf();

    if (eras[i].since <= val && val <= eras[i].until) {
      return eras[i].name;
    }

    if (eras[i].until <= val && val <= eras[i].since) {
      return eras[i].name;
    }
  }

  return '';
}

function getEraNarrow() {
  var i,
      l,
      val,
      eras = this.localeData().eras();

  for (i = 0, l = eras.length; i < l; ++i) {
    // truncate time
    val = this.startOf('day').valueOf();

    if (eras[i].since <= val && val <= eras[i].until) {
      return eras[i].narrow;
    }

    if (eras[i].until <= val && val <= eras[i].since) {
      return eras[i].narrow;
    }
  }

  return '';
}

function getEraAbbr() {
  var i,
      l,
      val,
      eras = this.localeData().eras();

  for (i = 0, l = eras.length; i < l; ++i) {
    // truncate time
    val = this.startOf('day').valueOf();

    if (eras[i].since <= val && val <= eras[i].until) {
      return eras[i].abbr;
    }

    if (eras[i].until <= val && val <= eras[i].since) {
      return eras[i].abbr;
    }
  }

  return '';
}

function getEraYear() {
  var i,
      l,
      dir,
      val,
      eras = this.localeData().eras();

  for (i = 0, l = eras.length; i < l; ++i) {
    dir = eras[i].since <= eras[i].until ? +1 : -1; // truncate time

    val = this.startOf('day').valueOf();

    if (eras[i].since <= val && val <= eras[i].until || eras[i].until <= val && val <= eras[i].since) {
      return (this.year() - (0, _hooks.hooks)(eras[i].since).year()) * dir + eras[i].offset;
    }
  }

  return this.year();
}

function erasNameRegex(isStrict) {
  if (!(0, _hasOwnProp.default)(this, '_erasNameRegex')) {
    computeErasParse.call(this);
  }

  return isStrict ? this._erasNameRegex : this._erasRegex;
}

function erasAbbrRegex(isStrict) {
  if (!(0, _hasOwnProp.default)(this, '_erasAbbrRegex')) {
    computeErasParse.call(this);
  }

  return isStrict ? this._erasAbbrRegex : this._erasRegex;
}

function erasNarrowRegex(isStrict) {
  if (!(0, _hasOwnProp.default)(this, '_erasNarrowRegex')) {
    computeErasParse.call(this);
  }

  return isStrict ? this._erasNarrowRegex : this._erasRegex;
}

function matchEraAbbr(isStrict, locale) {
  return locale.erasAbbrRegex(isStrict);
}

function matchEraName(isStrict, locale) {
  return locale.erasNameRegex(isStrict);
}

function matchEraNarrow(isStrict, locale) {
  return locale.erasNarrowRegex(isStrict);
}

function matchEraYearOrdinal(isStrict, locale) {
  return locale._eraYearOrdinalRegex || _regex.matchUnsigned;
}

function computeErasParse() {
  var abbrPieces = [],
      namePieces = [],
      narrowPieces = [],
      mixedPieces = [],
      i,
      l,
      eras = this.eras();

  for (i = 0, l = eras.length; i < l; ++i) {
    namePieces.push((0, _regex.regexEscape)(eras[i].name));
    abbrPieces.push((0, _regex.regexEscape)(eras[i].abbr));
    narrowPieces.push((0, _regex.regexEscape)(eras[i].narrow));
    mixedPieces.push((0, _regex.regexEscape)(eras[i].name));
    mixedPieces.push((0, _regex.regexEscape)(eras[i].abbr));
    mixedPieces.push((0, _regex.regexEscape)(eras[i].narrow));
  }

  this._erasRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
  this._erasNameRegex = new RegExp('^(' + namePieces.join('|') + ')', 'i');
  this._erasAbbrRegex = new RegExp('^(' + abbrPieces.join('|') + ')', 'i');
  this._erasNarrowRegex = new RegExp('^(' + narrowPieces.join('|') + ')', 'i');
}
},{"../format/format":"node_modules/moment/src/lib/format/format.js","../parse/regex":"node_modules/moment/src/lib/parse/regex.js","../parse/token":"node_modules/moment/src/lib/parse/token.js","./constants":"node_modules/moment/src/lib/units/constants.js","../utils/hooks":"node_modules/moment/src/lib/utils/hooks.js","../locale/locales":"node_modules/moment/src/lib/locale/locales.js","../create/parsing-flags":"node_modules/moment/src/lib/create/parsing-flags.js","../utils/has-own-prop":"node_modules/moment/src/lib/utils/has-own-prop.js"}],"node_modules/moment/src/lib/units/week-year.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSetWeekYear = getSetWeekYear;
exports.getSetISOWeekYear = getSetISOWeekYear;
exports.getISOWeeksInYear = getISOWeeksInYear;
exports.getISOWeeksInISOWeekYear = getISOWeeksInISOWeekYear;
exports.getWeeksInYear = getWeeksInYear;
exports.getWeeksInWeekYear = getWeeksInWeekYear;

var _format = require("../format/format");

var _aliases = require("./aliases");

var _priorities = require("./priorities");

var _regex = require("../parse/regex");

var _token = require("../parse/token");

var _weekCalendarUtils = require("./week-calendar-utils");

var _toInt = _interopRequireDefault(require("../utils/to-int"));

var _hooks = require("../utils/hooks");

var _dateFromArray = require("../create/date-from-array");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// FORMATTING
(0, _format.addFormatToken)(0, ['gg', 2], 0, function () {
  return this.weekYear() % 100;
});
(0, _format.addFormatToken)(0, ['GG', 2], 0, function () {
  return this.isoWeekYear() % 100;
});

function addWeekYearFormatToken(token, getter) {
  (0, _format.addFormatToken)(0, [token, token.length], 0, getter);
}

addWeekYearFormatToken('gggg', 'weekYear');
addWeekYearFormatToken('ggggg', 'weekYear');
addWeekYearFormatToken('GGGG', 'isoWeekYear');
addWeekYearFormatToken('GGGGG', 'isoWeekYear'); // ALIASES

(0, _aliases.addUnitAlias)('weekYear', 'gg');
(0, _aliases.addUnitAlias)('isoWeekYear', 'GG'); // PRIORITY

(0, _priorities.addUnitPriority)('weekYear', 1);
(0, _priorities.addUnitPriority)('isoWeekYear', 1); // PARSING

(0, _regex.addRegexToken)('G', _regex.matchSigned);
(0, _regex.addRegexToken)('g', _regex.matchSigned);
(0, _regex.addRegexToken)('GG', _regex.match1to2, _regex.match2);
(0, _regex.addRegexToken)('gg', _regex.match1to2, _regex.match2);
(0, _regex.addRegexToken)('GGGG', _regex.match1to4, _regex.match4);
(0, _regex.addRegexToken)('gggg', _regex.match1to4, _regex.match4);
(0, _regex.addRegexToken)('GGGGG', _regex.match1to6, _regex.match6);
(0, _regex.addRegexToken)('ggggg', _regex.match1to6, _regex.match6);
(0, _token.addWeekParseToken)(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
  week[token.substr(0, 2)] = (0, _toInt.default)(input);
});
(0, _token.addWeekParseToken)(['gg', 'GG'], function (input, week, config, token) {
  week[token] = _hooks.hooks.parseTwoDigitYear(input);
}); // MOMENTS

function getSetWeekYear(input) {
  return getSetWeekYearHelper.call(this, input, this.week(), this.weekday(), this.localeData()._week.dow, this.localeData()._week.doy);
}

function getSetISOWeekYear(input) {
  return getSetWeekYearHelper.call(this, input, this.isoWeek(), this.isoWeekday(), 1, 4);
}

function getISOWeeksInYear() {
  return (0, _weekCalendarUtils.weeksInYear)(this.year(), 1, 4);
}

function getISOWeeksInISOWeekYear() {
  return (0, _weekCalendarUtils.weeksInYear)(this.isoWeekYear(), 1, 4);
}

function getWeeksInYear() {
  var weekInfo = this.localeData()._week;

  return (0, _weekCalendarUtils.weeksInYear)(this.year(), weekInfo.dow, weekInfo.doy);
}

function getWeeksInWeekYear() {
  var weekInfo = this.localeData()._week;

  return (0, _weekCalendarUtils.weeksInYear)(this.weekYear(), weekInfo.dow, weekInfo.doy);
}

function getSetWeekYearHelper(input, week, weekday, dow, doy) {
  var weeksTarget;

  if (input == null) {
    return (0, _weekCalendarUtils.weekOfYear)(this, dow, doy).year;
  } else {
    weeksTarget = (0, _weekCalendarUtils.weeksInYear)(input, dow, doy);

    if (week > weeksTarget) {
      week = weeksTarget;
    }

    return setWeekAll.call(this, input, week, weekday, dow, doy);
  }
}

function setWeekAll(weekYear, week, weekday, dow, doy) {
  var dayOfYearData = (0, _weekCalendarUtils.dayOfYearFromWeeks)(weekYear, week, weekday, dow, doy),
      date = (0, _dateFromArray.createUTCDate)(dayOfYearData.year, 0, dayOfYearData.dayOfYear);
  this.year(date.getUTCFullYear());
  this.month(date.getUTCMonth());
  this.date(date.getUTCDate());
  return this;
}
},{"../format/format":"node_modules/moment/src/lib/format/format.js","./aliases":"node_modules/moment/src/lib/units/aliases.js","./priorities":"node_modules/moment/src/lib/units/priorities.js","../parse/regex":"node_modules/moment/src/lib/parse/regex.js","../parse/token":"node_modules/moment/src/lib/parse/token.js","./week-calendar-utils":"node_modules/moment/src/lib/units/week-calendar-utils.js","../utils/to-int":"node_modules/moment/src/lib/utils/to-int.js","../utils/hooks":"node_modules/moment/src/lib/utils/hooks.js","../create/date-from-array":"node_modules/moment/src/lib/create/date-from-array.js"}],"node_modules/moment/src/lib/units/quarter.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSetQuarter = getSetQuarter;

var _format = require("../format/format");

var _aliases = require("./aliases");

var _priorities = require("./priorities");

var _regex = require("../parse/regex");

var _token = require("../parse/token");

var _constants = require("./constants");

var _toInt = _interopRequireDefault(require("../utils/to-int"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// FORMATTING
(0, _format.addFormatToken)('Q', 0, 'Qo', 'quarter'); // ALIASES

(0, _aliases.addUnitAlias)('quarter', 'Q'); // PRIORITY

(0, _priorities.addUnitPriority)('quarter', 7); // PARSING

(0, _regex.addRegexToken)('Q', _regex.match1);
(0, _token.addParseToken)('Q', function (input, array) {
  array[_constants.MONTH] = ((0, _toInt.default)(input) - 1) * 3;
}); // MOMENTS

function getSetQuarter(input) {
  return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
}
},{"../format/format":"node_modules/moment/src/lib/format/format.js","./aliases":"node_modules/moment/src/lib/units/aliases.js","./priorities":"node_modules/moment/src/lib/units/priorities.js","../parse/regex":"node_modules/moment/src/lib/parse/regex.js","../parse/token":"node_modules/moment/src/lib/parse/token.js","./constants":"node_modules/moment/src/lib/units/constants.js","../utils/to-int":"node_modules/moment/src/lib/utils/to-int.js"}],"node_modules/moment/src/lib/units/day-of-month.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSetDayOfMonth = void 0;

var _getSet = require("../moment/get-set");

var _format = require("../format/format");

var _aliases = require("./aliases");

var _priorities = require("./priorities");

var _regex = require("../parse/regex");

var _token = require("../parse/token");

var _constants = require("./constants");

var _toInt = _interopRequireDefault(require("../utils/to-int"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// FORMATTING
(0, _format.addFormatToken)('D', ['DD', 2], 'Do', 'date'); // ALIASES

(0, _aliases.addUnitAlias)('date', 'D'); // PRIORITY

(0, _priorities.addUnitPriority)('date', 9); // PARSING

(0, _regex.addRegexToken)('D', _regex.match1to2);
(0, _regex.addRegexToken)('DD', _regex.match1to2, _regex.match2);
(0, _regex.addRegexToken)('Do', function (isStrict, locale) {
  // TODO: Remove "ordinalParse" fallback in next major release.
  return isStrict ? locale._dayOfMonthOrdinalParse || locale._ordinalParse : locale._dayOfMonthOrdinalParseLenient;
});
(0, _token.addParseToken)(['D', 'DD'], _constants.DATE);
(0, _token.addParseToken)('Do', function (input, array) {
  array[_constants.DATE] = (0, _toInt.default)(input.match(_regex.match1to2)[0]);
}); // MOMENTS

var getSetDayOfMonth = (0, _getSet.makeGetSet)('Date', true);
exports.getSetDayOfMonth = getSetDayOfMonth;
},{"../moment/get-set":"node_modules/moment/src/lib/moment/get-set.js","../format/format":"node_modules/moment/src/lib/format/format.js","./aliases":"node_modules/moment/src/lib/units/aliases.js","./priorities":"node_modules/moment/src/lib/units/priorities.js","../parse/regex":"node_modules/moment/src/lib/parse/regex.js","../parse/token":"node_modules/moment/src/lib/parse/token.js","./constants":"node_modules/moment/src/lib/units/constants.js","../utils/to-int":"node_modules/moment/src/lib/utils/to-int.js"}],"node_modules/moment/src/lib/units/day-of-year.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSetDayOfYear = getSetDayOfYear;

var _format = require("../format/format");

var _aliases = require("./aliases");

var _priorities = require("./priorities");

var _regex = require("../parse/regex");

var _token = require("../parse/token");

var _toInt = _interopRequireDefault(require("../utils/to-int"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// FORMATTING
(0, _format.addFormatToken)('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear'); // ALIASES

(0, _aliases.addUnitAlias)('dayOfYear', 'DDD'); // PRIORITY

(0, _priorities.addUnitPriority)('dayOfYear', 4); // PARSING

(0, _regex.addRegexToken)('DDD', _regex.match1to3);
(0, _regex.addRegexToken)('DDDD', _regex.match3);
(0, _token.addParseToken)(['DDD', 'DDDD'], function (input, array, config) {
  config._dayOfYear = (0, _toInt.default)(input);
}); // HELPERS
// MOMENTS

function getSetDayOfYear(input) {
  var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
  return input == null ? dayOfYear : this.add(input - dayOfYear, 'd');
}
},{"../format/format":"node_modules/moment/src/lib/format/format.js","./aliases":"node_modules/moment/src/lib/units/aliases.js","./priorities":"node_modules/moment/src/lib/units/priorities.js","../parse/regex":"node_modules/moment/src/lib/parse/regex.js","../parse/token":"node_modules/moment/src/lib/parse/token.js","../utils/to-int":"node_modules/moment/src/lib/utils/to-int.js"}],"node_modules/moment/src/lib/units/minute.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSetMinute = void 0;

var _getSet = require("../moment/get-set");

var _format = require("../format/format");

var _aliases = require("./aliases");

var _priorities = require("./priorities");

var _regex = require("../parse/regex");

var _token = require("../parse/token");

var _constants = require("./constants");

// FORMATTING
(0, _format.addFormatToken)('m', ['mm', 2], 0, 'minute'); // ALIASES

(0, _aliases.addUnitAlias)('minute', 'm'); // PRIORITY

(0, _priorities.addUnitPriority)('minute', 14); // PARSING

(0, _regex.addRegexToken)('m', _regex.match1to2);
(0, _regex.addRegexToken)('mm', _regex.match1to2, _regex.match2);
(0, _token.addParseToken)(['m', 'mm'], _constants.MINUTE); // MOMENTS

var getSetMinute = (0, _getSet.makeGetSet)('Minutes', false);
exports.getSetMinute = getSetMinute;
},{"../moment/get-set":"node_modules/moment/src/lib/moment/get-set.js","../format/format":"node_modules/moment/src/lib/format/format.js","./aliases":"node_modules/moment/src/lib/units/aliases.js","./priorities":"node_modules/moment/src/lib/units/priorities.js","../parse/regex":"node_modules/moment/src/lib/parse/regex.js","../parse/token":"node_modules/moment/src/lib/parse/token.js","./constants":"node_modules/moment/src/lib/units/constants.js"}],"node_modules/moment/src/lib/units/second.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSetSecond = void 0;

var _getSet = require("../moment/get-set");

var _format = require("../format/format");

var _aliases = require("./aliases");

var _priorities = require("./priorities");

var _regex = require("../parse/regex");

var _token = require("../parse/token");

var _constants = require("./constants");

// FORMATTING
(0, _format.addFormatToken)('s', ['ss', 2], 0, 'second'); // ALIASES

(0, _aliases.addUnitAlias)('second', 's'); // PRIORITY

(0, _priorities.addUnitPriority)('second', 15); // PARSING

(0, _regex.addRegexToken)('s', _regex.match1to2);
(0, _regex.addRegexToken)('ss', _regex.match1to2, _regex.match2);
(0, _token.addParseToken)(['s', 'ss'], _constants.SECOND); // MOMENTS

var getSetSecond = (0, _getSet.makeGetSet)('Seconds', false);
exports.getSetSecond = getSetSecond;
},{"../moment/get-set":"node_modules/moment/src/lib/moment/get-set.js","../format/format":"node_modules/moment/src/lib/format/format.js","./aliases":"node_modules/moment/src/lib/units/aliases.js","./priorities":"node_modules/moment/src/lib/units/priorities.js","../parse/regex":"node_modules/moment/src/lib/parse/regex.js","../parse/token":"node_modules/moment/src/lib/parse/token.js","./constants":"node_modules/moment/src/lib/units/constants.js"}],"node_modules/moment/src/lib/units/millisecond.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSetMillisecond = void 0;

var _getSet = require("../moment/get-set");

var _format = require("../format/format");

var _aliases = require("./aliases");

var _priorities = require("./priorities");

var _regex = require("../parse/regex");

var _token = require("../parse/token");

var _constants = require("./constants");

var _toInt = _interopRequireDefault(require("../utils/to-int"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// FORMATTING
(0, _format.addFormatToken)('S', 0, 0, function () {
  return ~~(this.millisecond() / 100);
});
(0, _format.addFormatToken)(0, ['SS', 2], 0, function () {
  return ~~(this.millisecond() / 10);
});
(0, _format.addFormatToken)(0, ['SSS', 3], 0, 'millisecond');
(0, _format.addFormatToken)(0, ['SSSS', 4], 0, function () {
  return this.millisecond() * 10;
});
(0, _format.addFormatToken)(0, ['SSSSS', 5], 0, function () {
  return this.millisecond() * 100;
});
(0, _format.addFormatToken)(0, ['SSSSSS', 6], 0, function () {
  return this.millisecond() * 1000;
});
(0, _format.addFormatToken)(0, ['SSSSSSS', 7], 0, function () {
  return this.millisecond() * 10000;
});
(0, _format.addFormatToken)(0, ['SSSSSSSS', 8], 0, function () {
  return this.millisecond() * 100000;
});
(0, _format.addFormatToken)(0, ['SSSSSSSSS', 9], 0, function () {
  return this.millisecond() * 1000000;
}); // ALIASES

(0, _aliases.addUnitAlias)('millisecond', 'ms'); // PRIORITY

(0, _priorities.addUnitPriority)('millisecond', 16); // PARSING

(0, _regex.addRegexToken)('S', _regex.match1to3, _regex.match1);
(0, _regex.addRegexToken)('SS', _regex.match1to3, _regex.match2);
(0, _regex.addRegexToken)('SSS', _regex.match1to3, _regex.match3);
var token, getSetMillisecond;
exports.getSetMillisecond = getSetMillisecond;

for (token = 'SSSS'; token.length <= 9; token += 'S') {
  (0, _regex.addRegexToken)(token, _regex.matchUnsigned);
}

function parseMs(input, array) {
  array[_constants.MILLISECOND] = (0, _toInt.default)(('0.' + input) * 1000);
}

for (token = 'S'; token.length <= 9; token += 'S') {
  (0, _token.addParseToken)(token, parseMs);
}

exports.getSetMillisecond = getSetMillisecond = (0, _getSet.makeGetSet)('Milliseconds', false);
},{"../moment/get-set":"node_modules/moment/src/lib/moment/get-set.js","../format/format":"node_modules/moment/src/lib/format/format.js","./aliases":"node_modules/moment/src/lib/units/aliases.js","./priorities":"node_modules/moment/src/lib/units/priorities.js","../parse/regex":"node_modules/moment/src/lib/parse/regex.js","../parse/token":"node_modules/moment/src/lib/parse/token.js","./constants":"node_modules/moment/src/lib/units/constants.js","../utils/to-int":"node_modules/moment/src/lib/utils/to-int.js"}],"node_modules/moment/src/lib/units/timezone.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getZoneAbbr = getZoneAbbr;
exports.getZoneName = getZoneName;

var _format = require("../format/format");

// FORMATTING
(0, _format.addFormatToken)('z', 0, 0, 'zoneAbbr');
(0, _format.addFormatToken)('zz', 0, 0, 'zoneName'); // MOMENTS

function getZoneAbbr() {
  return this._isUTC ? 'UTC' : '';
}

function getZoneName() {
  return this._isUTC ? 'Coordinated Universal Time' : '';
}
},{"../format/format":"node_modules/moment/src/lib/format/format.js"}],"node_modules/moment/src/lib/moment/prototype.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constructor = require("./constructor");

var _addSubtract = require("./add-subtract");

var _calendar = require("./calendar");

var _clone = require("./clone");

var _compare = require("./compare");

var _diff = require("./diff");

var _format = require("./format");

var _from = require("./from");

var _to = require("./to");

var _getSet = require("./get-set");

var _locale = require("./locale");

var _minMax = require("./min-max");

var _startEndOf = require("./start-end-of");

var _toType = require("./to-type");

var _valid = require("./valid");

var _creationData = require("./creation-data");

var _era = require("../units/era");

var _year = require("../units/year");

var _weekYear = require("../units/week-year");

var _quarter = require("../units/quarter");

var _month = require("../units/month");

var _week = require("../units/week");

var _dayOfMonth = require("../units/day-of-month");

var _dayOfWeek = require("../units/day-of-week");

var _dayOfYear = require("../units/day-of-year");

var _hour = require("../units/hour");

var _minute = require("../units/minute");

var _second = require("../units/second");

var _millisecond = require("../units/millisecond");

var _offset = require("../units/offset");

var _timezone = require("../units/timezone");

var _deprecate = require("../utils/deprecate");

var proto = _constructor.Moment.prototype;
proto.add = _addSubtract.add;
proto.calendar = _calendar.calendar;
proto.clone = _clone.clone;
proto.diff = _diff.diff;
proto.endOf = _startEndOf.endOf;
proto.format = _format.format;
proto.from = _from.from;
proto.fromNow = _from.fromNow;
proto.to = _to.to;
proto.toNow = _to.toNow;
proto.get = _getSet.stringGet;
proto.invalidAt = _valid.invalidAt;
proto.isAfter = _compare.isAfter;
proto.isBefore = _compare.isBefore;
proto.isBetween = _compare.isBetween;
proto.isSame = _compare.isSame;
proto.isSameOrAfter = _compare.isSameOrAfter;
proto.isSameOrBefore = _compare.isSameOrBefore;
proto.isValid = _valid.isValid;
proto.lang = _locale.lang;
proto.locale = _locale.locale;
proto.localeData = _locale.localeData;
proto.max = _minMax.prototypeMax;
proto.min = _minMax.prototypeMin;
proto.parsingFlags = _valid.parsingFlags;
proto.set = _getSet.stringSet;
proto.startOf = _startEndOf.startOf;
proto.subtract = _addSubtract.subtract;
proto.toArray = _toType.toArray;
proto.toObject = _toType.toObject;
proto.toDate = _toType.toDate;
proto.toISOString = _format.toISOString;
proto.inspect = _format.inspect;

if (typeof Symbol !== 'undefined' && Symbol.for != null) {
  proto[Symbol.for('nodejs.util.inspect.custom')] = function () {
    return 'Moment<' + this.format() + '>';
  };
}

proto.toJSON = _toType.toJSON;
proto.toString = _format.toString;
proto.unix = _toType.unix;
proto.valueOf = _toType.valueOf;
proto.creationData = _creationData.creationData; // Era

proto.eraName = _era.getEraName;
proto.eraNarrow = _era.getEraNarrow;
proto.eraAbbr = _era.getEraAbbr;
proto.eraYear = _era.getEraYear; // Year

proto.year = _year.getSetYear;
proto.isLeapYear = _year.getIsLeapYear; // Week Year

proto.weekYear = _weekYear.getSetWeekYear;
proto.isoWeekYear = _weekYear.getSetISOWeekYear; // Quarter

proto.quarter = proto.quarters = _quarter.getSetQuarter; // Month

proto.month = _month.getSetMonth;
proto.daysInMonth = _month.getDaysInMonth; // Week

proto.week = proto.weeks = _week.getSetWeek;
proto.isoWeek = proto.isoWeeks = _week.getSetISOWeek;
proto.weeksInYear = _weekYear.getWeeksInYear;
proto.weeksInWeekYear = _weekYear.getWeeksInWeekYear;
proto.isoWeeksInYear = _weekYear.getISOWeeksInYear;
proto.isoWeeksInISOWeekYear = _weekYear.getISOWeeksInISOWeekYear; // Day

proto.date = _dayOfMonth.getSetDayOfMonth;
proto.day = proto.days = _dayOfWeek.getSetDayOfWeek;
proto.weekday = _dayOfWeek.getSetLocaleDayOfWeek;
proto.isoWeekday = _dayOfWeek.getSetISODayOfWeek;
proto.dayOfYear = _dayOfYear.getSetDayOfYear; // Hour

proto.hour = proto.hours = _hour.getSetHour; // Minute

proto.minute = proto.minutes = _minute.getSetMinute; // Second

proto.second = proto.seconds = _second.getSetSecond; // Millisecond

proto.millisecond = proto.milliseconds = _millisecond.getSetMillisecond; // Offset

proto.utcOffset = _offset.getSetOffset;
proto.utc = _offset.setOffsetToUTC;
proto.local = _offset.setOffsetToLocal;
proto.parseZone = _offset.setOffsetToParsedOffset;
proto.hasAlignedHourOffset = _offset.hasAlignedHourOffset;
proto.isDST = _offset.isDaylightSavingTime;
proto.isLocal = _offset.isLocal;
proto.isUtcOffset = _offset.isUtcOffset;
proto.isUtc = _offset.isUtc;
proto.isUTC = _offset.isUtc; // Timezone

proto.zoneAbbr = _timezone.getZoneAbbr;
proto.zoneName = _timezone.getZoneName; // Deprecations

proto.dates = (0, _deprecate.deprecate)('dates accessor is deprecated. Use date instead.', _dayOfMonth.getSetDayOfMonth);
proto.months = (0, _deprecate.deprecate)('months accessor is deprecated. Use month instead', _month.getSetMonth);
proto.years = (0, _deprecate.deprecate)('years accessor is deprecated. Use year instead', _year.getSetYear);
proto.zone = (0, _deprecate.deprecate)('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', _offset.getSetZone);
proto.isDSTShifted = (0, _deprecate.deprecate)('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', _offset.isDaylightSavingTimeShifted);
var _default = proto;
exports.default = _default;
},{"./constructor":"node_modules/moment/src/lib/moment/constructor.js","./add-subtract":"node_modules/moment/src/lib/moment/add-subtract.js","./calendar":"node_modules/moment/src/lib/moment/calendar.js","./clone":"node_modules/moment/src/lib/moment/clone.js","./compare":"node_modules/moment/src/lib/moment/compare.js","./diff":"node_modules/moment/src/lib/moment/diff.js","./format":"node_modules/moment/src/lib/moment/format.js","./from":"node_modules/moment/src/lib/moment/from.js","./to":"node_modules/moment/src/lib/moment/to.js","./get-set":"node_modules/moment/src/lib/moment/get-set.js","./locale":"node_modules/moment/src/lib/moment/locale.js","./min-max":"node_modules/moment/src/lib/moment/min-max.js","./start-end-of":"node_modules/moment/src/lib/moment/start-end-of.js","./to-type":"node_modules/moment/src/lib/moment/to-type.js","./valid":"node_modules/moment/src/lib/moment/valid.js","./creation-data":"node_modules/moment/src/lib/moment/creation-data.js","../units/era":"node_modules/moment/src/lib/units/era.js","../units/year":"node_modules/moment/src/lib/units/year.js","../units/week-year":"node_modules/moment/src/lib/units/week-year.js","../units/quarter":"node_modules/moment/src/lib/units/quarter.js","../units/month":"node_modules/moment/src/lib/units/month.js","../units/week":"node_modules/moment/src/lib/units/week.js","../units/day-of-month":"node_modules/moment/src/lib/units/day-of-month.js","../units/day-of-week":"node_modules/moment/src/lib/units/day-of-week.js","../units/day-of-year":"node_modules/moment/src/lib/units/day-of-year.js","../units/hour":"node_modules/moment/src/lib/units/hour.js","../units/minute":"node_modules/moment/src/lib/units/minute.js","../units/second":"node_modules/moment/src/lib/units/second.js","../units/millisecond":"node_modules/moment/src/lib/units/millisecond.js","../units/offset":"node_modules/moment/src/lib/units/offset.js","../units/timezone":"node_modules/moment/src/lib/units/timezone.js","../utils/deprecate":"node_modules/moment/src/lib/utils/deprecate.js"}],"node_modules/moment/src/lib/moment/moment.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUnix = createUnix;
exports.createInZone = createInZone;
Object.defineProperty(exports, "createLocal", {
  enumerable: true,
  get: function () {
    return _local.createLocal;
  }
});
Object.defineProperty(exports, "createUTC", {
  enumerable: true,
  get: function () {
    return _utc.createUTC;
  }
});
Object.defineProperty(exports, "createInvalid", {
  enumerable: true,
  get: function () {
    return _valid.createInvalid;
  }
});
Object.defineProperty(exports, "isMoment", {
  enumerable: true,
  get: function () {
    return _constructor.isMoment;
  }
});
Object.defineProperty(exports, "min", {
  enumerable: true,
  get: function () {
    return _minMax.min;
  }
});
Object.defineProperty(exports, "max", {
  enumerable: true,
  get: function () {
    return _minMax.max;
  }
});
Object.defineProperty(exports, "now", {
  enumerable: true,
  get: function () {
    return _now.now;
  }
});
Object.defineProperty(exports, "momentPrototype", {
  enumerable: true,
  get: function () {
    return _prototype.default;
  }
});

var _local = require("../create/local");

var _utc = require("../create/utc");

var _valid = require("../create/valid");

var _constructor = require("./constructor");

var _minMax = require("./min-max");

var _now = require("./now");

var _prototype = _interopRequireDefault(require("./prototype"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createUnix(input) {
  return (0, _local.createLocal)(input * 1000);
}

function createInZone() {
  return _local.createLocal.apply(null, arguments).parseZone();
}
},{"../create/local":"node_modules/moment/src/lib/create/local.js","../create/utc":"node_modules/moment/src/lib/create/utc.js","../create/valid":"node_modules/moment/src/lib/create/valid.js","./constructor":"node_modules/moment/src/lib/moment/constructor.js","./min-max":"node_modules/moment/src/lib/moment/min-max.js","./now":"node_modules/moment/src/lib/moment/now.js","./prototype":"node_modules/moment/src/lib/moment/prototype.js"}],"node_modules/moment/src/lib/locale/pre-post-format.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preParsePostFormat = preParsePostFormat;

function preParsePostFormat(string) {
  return string;
}
},{}],"node_modules/moment/src/lib/locale/prototype.js":[function(require,module,exports) {
"use strict";

var _constructor = require("./constructor");

var _calendar = require("./calendar");

var _formats = require("./formats");

var _invalid = require("./invalid");

var _ordinal = require("./ordinal");

var _prePostFormat = require("./pre-post-format");

var _relative = require("./relative");

var _set = require("./set");

var _era = require("../units/era");

var _month = require("../units/month");

var _week = require("../units/week");

var _dayOfWeek = require("../units/day-of-week");

var _hour = require("../units/hour");

var proto = _constructor.Locale.prototype;
proto.calendar = _calendar.calendar;
proto.longDateFormat = _formats.longDateFormat;
proto.invalidDate = _invalid.invalidDate;
proto.ordinal = _ordinal.ordinal;
proto.preparse = _prePostFormat.preParsePostFormat;
proto.postformat = _prePostFormat.preParsePostFormat;
proto.relativeTime = _relative.relativeTime;
proto.pastFuture = _relative.pastFuture;
proto.set = _set.set; // Eras

proto.eras = _era.localeEras;
proto.erasParse = _era.localeErasParse;
proto.erasConvertYear = _era.localeErasConvertYear;
proto.erasAbbrRegex = _era.erasAbbrRegex;
proto.erasNameRegex = _era.erasNameRegex;
proto.erasNarrowRegex = _era.erasNarrowRegex; // Month

proto.months = _month.localeMonths;
proto.monthsShort = _month.localeMonthsShort;
proto.monthsParse = _month.localeMonthsParse;
proto.monthsRegex = _month.monthsRegex;
proto.monthsShortRegex = _month.monthsShortRegex; // Week

proto.week = _week.localeWeek;
proto.firstDayOfYear = _week.localeFirstDayOfYear;
proto.firstDayOfWeek = _week.localeFirstDayOfWeek; // Day of Week

proto.weekdays = _dayOfWeek.localeWeekdays;
proto.weekdaysMin = _dayOfWeek.localeWeekdaysMin;
proto.weekdaysShort = _dayOfWeek.localeWeekdaysShort;
proto.weekdaysParse = _dayOfWeek.localeWeekdaysParse;
proto.weekdaysRegex = _dayOfWeek.weekdaysRegex;
proto.weekdaysShortRegex = _dayOfWeek.weekdaysShortRegex;
proto.weekdaysMinRegex = _dayOfWeek.weekdaysMinRegex; // Hours

proto.isPM = _hour.localeIsPM;
proto.meridiem = _hour.localeMeridiem;
},{"./constructor":"node_modules/moment/src/lib/locale/constructor.js","./calendar":"node_modules/moment/src/lib/locale/calendar.js","./formats":"node_modules/moment/src/lib/locale/formats.js","./invalid":"node_modules/moment/src/lib/locale/invalid.js","./ordinal":"node_modules/moment/src/lib/locale/ordinal.js","./pre-post-format":"node_modules/moment/src/lib/locale/pre-post-format.js","./relative":"node_modules/moment/src/lib/locale/relative.js","./set":"node_modules/moment/src/lib/locale/set.js","../units/era":"node_modules/moment/src/lib/units/era.js","../units/month":"node_modules/moment/src/lib/units/month.js","../units/week":"node_modules/moment/src/lib/units/week.js","../units/day-of-week":"node_modules/moment/src/lib/units/day-of-week.js","../units/hour":"node_modules/moment/src/lib/units/hour.js"}],"node_modules/moment/src/lib/locale/lists.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listMonths = listMonths;
exports.listMonthsShort = listMonthsShort;
exports.listWeekdays = listWeekdays;
exports.listWeekdaysShort = listWeekdaysShort;
exports.listWeekdaysMin = listWeekdaysMin;

var _isNumber = _interopRequireDefault(require("../utils/is-number"));

var _locales = require("./locales");

var _utc = require("../create/utc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function get(format, index, field, setter) {
  var locale = (0, _locales.getLocale)(),
      utc = (0, _utc.createUTC)().set(setter, index);
  return locale[field](utc, format);
}

function listMonthsImpl(format, index, field) {
  if ((0, _isNumber.default)(format)) {
    index = format;
    format = undefined;
  }

  format = format || '';

  if (index != null) {
    return get(format, index, field, 'month');
  }

  var i,
      out = [];

  for (i = 0; i < 12; i++) {
    out[i] = get(format, i, field, 'month');
  }

  return out;
} // ()
// (5)
// (fmt, 5)
// (fmt)
// (true)
// (true, 5)
// (true, fmt, 5)
// (true, fmt)


function listWeekdaysImpl(localeSorted, format, index, field) {
  if (typeof localeSorted === 'boolean') {
    if ((0, _isNumber.default)(format)) {
      index = format;
      format = undefined;
    }

    format = format || '';
  } else {
    format = localeSorted;
    index = format;
    localeSorted = false;

    if ((0, _isNumber.default)(format)) {
      index = format;
      format = undefined;
    }

    format = format || '';
  }

  var locale = (0, _locales.getLocale)(),
      shift = localeSorted ? locale._week.dow : 0,
      i,
      out = [];

  if (index != null) {
    return get(format, (index + shift) % 7, field, 'day');
  }

  for (i = 0; i < 7; i++) {
    out[i] = get(format, (i + shift) % 7, field, 'day');
  }

  return out;
}

function listMonths(format, index) {
  return listMonthsImpl(format, index, 'months');
}

function listMonthsShort(format, index) {
  return listMonthsImpl(format, index, 'monthsShort');
}

function listWeekdays(localeSorted, format, index) {
  return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
}

function listWeekdaysShort(localeSorted, format, index) {
  return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
}

function listWeekdaysMin(localeSorted, format, index) {
  return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
}
},{"../utils/is-number":"node_modules/moment/src/lib/utils/is-number.js","./locales":"node_modules/moment/src/lib/locale/locales.js","../create/utc":"node_modules/moment/src/lib/create/utc.js"}],"node_modules/moment/src/lib/locale/en.js":[function(require,module,exports) {
"use strict";

require("./prototype");

var _locales = require("./locales");

var _toInt = _interopRequireDefault(require("../utils/to-int"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _locales.getSetGlobalLocale)('en', {
  eras: [{
    since: '0001-01-01',
    until: +Infinity,
    offset: 1,
    name: 'Anno Domini',
    narrow: 'AD',
    abbr: 'AD'
  }, {
    since: '0000-12-31',
    until: -Infinity,
    offset: 1,
    name: 'Before Christ',
    narrow: 'BC',
    abbr: 'BC'
  }],
  dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
  ordinal: function (number) {
    var b = number % 10,
        output = (0, _toInt.default)(number % 100 / 10) === 1 ? 'th' : b === 1 ? 'st' : b === 2 ? 'nd' : b === 3 ? 'rd' : 'th';
    return number + output;
  }
});
},{"./prototype":"node_modules/moment/src/lib/locale/prototype.js","./locales":"node_modules/moment/src/lib/locale/locales.js","../utils/to-int":"node_modules/moment/src/lib/utils/to-int.js"}],"node_modules/moment/src/lib/locale/locale.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "getSetGlobalLocale", {
  enumerable: true,
  get: function () {
    return _locales.getSetGlobalLocale;
  }
});
Object.defineProperty(exports, "defineLocale", {
  enumerable: true,
  get: function () {
    return _locales.defineLocale;
  }
});
Object.defineProperty(exports, "updateLocale", {
  enumerable: true,
  get: function () {
    return _locales.updateLocale;
  }
});
Object.defineProperty(exports, "getLocale", {
  enumerable: true,
  get: function () {
    return _locales.getLocale;
  }
});
Object.defineProperty(exports, "listLocales", {
  enumerable: true,
  get: function () {
    return _locales.listLocales;
  }
});
Object.defineProperty(exports, "listMonths", {
  enumerable: true,
  get: function () {
    return _lists.listMonths;
  }
});
Object.defineProperty(exports, "listMonthsShort", {
  enumerable: true,
  get: function () {
    return _lists.listMonthsShort;
  }
});
Object.defineProperty(exports, "listWeekdays", {
  enumerable: true,
  get: function () {
    return _lists.listWeekdays;
  }
});
Object.defineProperty(exports, "listWeekdaysShort", {
  enumerable: true,
  get: function () {
    return _lists.listWeekdaysShort;
  }
});
Object.defineProperty(exports, "listWeekdaysMin", {
  enumerable: true,
  get: function () {
    return _lists.listWeekdaysMin;
  }
});

require("./prototype");

var _locales = require("./locales");

var _lists = require("./lists");

var _deprecate = require("../utils/deprecate");

var _hooks = require("../utils/hooks");

require("./en");

// Side effect imports
_hooks.hooks.lang = (0, _deprecate.deprecate)('moment.lang is deprecated. Use moment.locale instead.', _locales.getSetGlobalLocale);
_hooks.hooks.langData = (0, _deprecate.deprecate)('moment.langData is deprecated. Use moment.localeData instead.', _locales.getLocale);
},{"./prototype":"node_modules/moment/src/lib/locale/prototype.js","./locales":"node_modules/moment/src/lib/locale/locales.js","./lists":"node_modules/moment/src/lib/locale/lists.js","../utils/deprecate":"node_modules/moment/src/lib/utils/deprecate.js","../utils/hooks":"node_modules/moment/src/lib/utils/hooks.js","./en":"node_modules/moment/src/lib/locale/en.js"}],"node_modules/moment/src/lib/duration/abs.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.abs = abs;
var mathAbs = Math.abs;

function abs() {
  var data = this._data;
  this._milliseconds = mathAbs(this._milliseconds);
  this._days = mathAbs(this._days);
  this._months = mathAbs(this._months);
  data.milliseconds = mathAbs(data.milliseconds);
  data.seconds = mathAbs(data.seconds);
  data.minutes = mathAbs(data.minutes);
  data.hours = mathAbs(data.hours);
  data.months = mathAbs(data.months);
  data.years = mathAbs(data.years);
  return this;
}
},{}],"node_modules/moment/src/lib/duration/add-subtract.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = add;
exports.subtract = subtract;

var _create = require("./create");

function addSubtract(duration, input, value, direction) {
  var other = (0, _create.createDuration)(input, value);
  duration._milliseconds += direction * other._milliseconds;
  duration._days += direction * other._days;
  duration._months += direction * other._months;
  return duration._bubble();
} // supports only 2.0-style add(1, 's') or add(duration)


function add(input, value) {
  return addSubtract(this, input, value, 1);
} // supports only 2.0-style subtract(1, 's') or subtract(duration)


function subtract(input, value) {
  return addSubtract(this, input, value, -1);
}
},{"./create":"node_modules/moment/src/lib/duration/create.js"}],"node_modules/moment/src/lib/utils/abs-ceil.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = absCeil;

function absCeil(number) {
  if (number < 0) {
    return Math.floor(number);
  } else {
    return Math.ceil(number);
  }
}
},{}],"node_modules/moment/src/lib/duration/bubble.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bubble = bubble;
exports.daysToMonths = daysToMonths;
exports.monthsToDays = monthsToDays;

var _absFloor = _interopRequireDefault(require("../utils/abs-floor"));

var _absCeil = _interopRequireDefault(require("../utils/abs-ceil"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function bubble() {
  var milliseconds = this._milliseconds,
      days = this._days,
      months = this._months,
      data = this._data,
      seconds,
      minutes,
      hours,
      years,
      monthsFromDays; // if we have a mix of positive and negative values, bubble down first
  // check: https://github.com/moment/moment/issues/2166

  if (!(milliseconds >= 0 && days >= 0 && months >= 0 || milliseconds <= 0 && days <= 0 && months <= 0)) {
    milliseconds += (0, _absCeil.default)(monthsToDays(months) + days) * 864e5;
    days = 0;
    months = 0;
  } // The following code bubbles up values, see the tests for
  // examples of what that means.


  data.milliseconds = milliseconds % 1000;
  seconds = (0, _absFloor.default)(milliseconds / 1000);
  data.seconds = seconds % 60;
  minutes = (0, _absFloor.default)(seconds / 60);
  data.minutes = minutes % 60;
  hours = (0, _absFloor.default)(minutes / 60);
  data.hours = hours % 24;
  days += (0, _absFloor.default)(hours / 24); // convert days to months

  monthsFromDays = (0, _absFloor.default)(daysToMonths(days));
  months += monthsFromDays;
  days -= (0, _absCeil.default)(monthsToDays(monthsFromDays)); // 12 months -> 1 year

  years = (0, _absFloor.default)(months / 12);
  months %= 12;
  data.days = days;
  data.months = months;
  data.years = years;
  return this;
}

function daysToMonths(days) {
  // 400 years have 146097 days (taking into account leap year rules)
  // 400 years have 12 months === 4800
  return days * 4800 / 146097;
}

function monthsToDays(months) {
  // the reverse of daysToMonths
  return months * 146097 / 4800;
}
},{"../utils/abs-floor":"node_modules/moment/src/lib/utils/abs-floor.js","../utils/abs-ceil":"node_modules/moment/src/lib/utils/abs-ceil.js"}],"node_modules/moment/src/lib/duration/as.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.as = as;
exports.valueOf = valueOf;
exports.asYears = exports.asQuarters = exports.asMonths = exports.asWeeks = exports.asDays = exports.asHours = exports.asMinutes = exports.asSeconds = exports.asMilliseconds = void 0;

var _bubble = require("./bubble");

var _aliases = require("../units/aliases");

var _toInt = _interopRequireDefault(require("../utils/to-int"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function as(units) {
  if (!this.isValid()) {
    return NaN;
  }

  var days,
      months,
      milliseconds = this._milliseconds;
  units = (0, _aliases.normalizeUnits)(units);

  if (units === 'month' || units === 'quarter' || units === 'year') {
    days = this._days + milliseconds / 864e5;
    months = this._months + (0, _bubble.daysToMonths)(days);

    switch (units) {
      case 'month':
        return months;

      case 'quarter':
        return months / 3;

      case 'year':
        return months / 12;
    }
  } else {
    // handle milliseconds separately because of floating point math errors (issue #1867)
    days = this._days + Math.round((0, _bubble.monthsToDays)(this._months));

    switch (units) {
      case 'week':
        return days / 7 + milliseconds / 6048e5;

      case 'day':
        return days + milliseconds / 864e5;

      case 'hour':
        return days * 24 + milliseconds / 36e5;

      case 'minute':
        return days * 1440 + milliseconds / 6e4;

      case 'second':
        return days * 86400 + milliseconds / 1000;
      // Math.floor prevents floating point math errors here

      case 'millisecond':
        return Math.floor(days * 864e5) + milliseconds;

      default:
        throw new Error('Unknown unit ' + units);
    }
  }
} // TODO: Use this.as('ms')?


function valueOf() {
  if (!this.isValid()) {
    return NaN;
  }

  return this._milliseconds + this._days * 864e5 + this._months % 12 * 2592e6 + (0, _toInt.default)(this._months / 12) * 31536e6;
}

function makeAs(alias) {
  return function () {
    return this.as(alias);
  };
}

var asMilliseconds = makeAs('ms'),
    asSeconds = makeAs('s'),
    asMinutes = makeAs('m'),
    asHours = makeAs('h'),
    asDays = makeAs('d'),
    asWeeks = makeAs('w'),
    asMonths = makeAs('M'),
    asQuarters = makeAs('Q'),
    asYears = makeAs('y');
exports.asYears = asYears;
exports.asQuarters = asQuarters;
exports.asMonths = asMonths;
exports.asWeeks = asWeeks;
exports.asDays = asDays;
exports.asHours = asHours;
exports.asMinutes = asMinutes;
exports.asSeconds = asSeconds;
exports.asMilliseconds = asMilliseconds;
},{"./bubble":"node_modules/moment/src/lib/duration/bubble.js","../units/aliases":"node_modules/moment/src/lib/units/aliases.js","../utils/to-int":"node_modules/moment/src/lib/utils/to-int.js"}],"node_modules/moment/src/lib/duration/clone.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clone = clone;

var _create = require("./create");

function clone() {
  return (0, _create.createDuration)(this);
}
},{"./create":"node_modules/moment/src/lib/duration/create.js"}],"node_modules/moment/src/lib/duration/get.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.weeks = weeks;
exports.years = exports.months = exports.days = exports.hours = exports.minutes = exports.seconds = exports.milliseconds = void 0;

var _aliases = require("../units/aliases");

var _absFloor = _interopRequireDefault(require("../utils/abs-floor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function get(units) {
  units = (0, _aliases.normalizeUnits)(units);
  return this.isValid() ? this[units + 's']() : NaN;
}

function makeGetter(name) {
  return function () {
    return this.isValid() ? this._data[name] : NaN;
  };
}

var milliseconds = makeGetter('milliseconds'),
    seconds = makeGetter('seconds'),
    minutes = makeGetter('minutes'),
    hours = makeGetter('hours'),
    days = makeGetter('days'),
    months = makeGetter('months'),
    years = makeGetter('years');
exports.years = years;
exports.months = months;
exports.days = days;
exports.hours = hours;
exports.minutes = minutes;
exports.seconds = seconds;
exports.milliseconds = milliseconds;

function weeks() {
  return (0, _absFloor.default)(this.days() / 7);
}
},{"../units/aliases":"node_modules/moment/src/lib/units/aliases.js","../utils/abs-floor":"node_modules/moment/src/lib/utils/abs-floor.js"}],"node_modules/moment/src/lib/duration/humanize.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSetRelativeTimeRounding = getSetRelativeTimeRounding;
exports.getSetRelativeTimeThreshold = getSetRelativeTimeThreshold;
exports.humanize = humanize;

var _create = require("./create");

var round = Math.round,
    thresholds = {
  ss: 44,
  // a few seconds to seconds
  s: 45,
  // seconds to minute
  m: 45,
  // minutes to hour
  h: 22,
  // hours to day
  d: 26,
  // days to month/week
  w: null,
  // weeks to month
  M: 11 // months to year

}; // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize

function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
  return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
}

function relativeTime(posNegDuration, withoutSuffix, thresholds, locale) {
  var duration = (0, _create.createDuration)(posNegDuration).abs(),
      seconds = round(duration.as('s')),
      minutes = round(duration.as('m')),
      hours = round(duration.as('h')),
      days = round(duration.as('d')),
      months = round(duration.as('M')),
      weeks = round(duration.as('w')),
      years = round(duration.as('y')),
      a = seconds <= thresholds.ss && ['s', seconds] || seconds < thresholds.s && ['ss', seconds] || minutes <= 1 && ['m'] || minutes < thresholds.m && ['mm', minutes] || hours <= 1 && ['h'] || hours < thresholds.h && ['hh', hours] || days <= 1 && ['d'] || days < thresholds.d && ['dd', days];

  if (thresholds.w != null) {
    a = a || weeks <= 1 && ['w'] || weeks < thresholds.w && ['ww', weeks];
  }

  a = a || months <= 1 && ['M'] || months < thresholds.M && ['MM', months] || years <= 1 && ['y'] || ['yy', years];
  a[2] = withoutSuffix;
  a[3] = +posNegDuration > 0;
  a[4] = locale;
  return substituteTimeAgo.apply(null, a);
} // This function allows you to set the rounding function for relative time strings


function getSetRelativeTimeRounding(roundingFunction) {
  if (roundingFunction === undefined) {
    return round;
  }

  if (typeof roundingFunction === 'function') {
    round = roundingFunction;
    return true;
  }

  return false;
} // This function allows you to set a threshold for relative time strings


function getSetRelativeTimeThreshold(threshold, limit) {
  if (thresholds[threshold] === undefined) {
    return false;
  }

  if (limit === undefined) {
    return thresholds[threshold];
  }

  thresholds[threshold] = limit;

  if (threshold === 's') {
    thresholds.ss = limit - 1;
  }

  return true;
}

function humanize(argWithSuffix, argThresholds) {
  if (!this.isValid()) {
    return this.localeData().invalidDate();
  }

  var withSuffix = false,
      th = thresholds,
      locale,
      output;

  if (typeof argWithSuffix === 'object') {
    argThresholds = argWithSuffix;
    argWithSuffix = false;
  }

  if (typeof argWithSuffix === 'boolean') {
    withSuffix = argWithSuffix;
  }

  if (typeof argThresholds === 'object') {
    th = Object.assign({}, thresholds, argThresholds);

    if (argThresholds.s != null && argThresholds.ss == null) {
      th.ss = argThresholds.s - 1;
    }
  }

  locale = this.localeData();
  output = relativeTime(this, !withSuffix, th, locale);

  if (withSuffix) {
    output = locale.pastFuture(+this, output);
  }

  return locale.postformat(output);
}
},{"./create":"node_modules/moment/src/lib/duration/create.js"}],"node_modules/moment/src/lib/duration/iso-string.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toISOString = toISOString;

var _absFloor = _interopRequireDefault(require("../utils/abs-floor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var abs = Math.abs;

function sign(x) {
  return (x > 0) - (x < 0) || +x;
}

function toISOString() {
  // for ISO strings we do not use the normal bubbling rules:
  //  * milliseconds bubble up until they become hours
  //  * days do not bubble at all
  //  * months bubble up until they become years
  // This is because there is no context-free conversion between hours and days
  // (think of clock changes)
  // and also not between days and months (28-31 days per month)
  if (!this.isValid()) {
    return this.localeData().invalidDate();
  }

  var seconds = abs(this._milliseconds) / 1000,
      days = abs(this._days),
      months = abs(this._months),
      minutes,
      hours,
      years,
      s,
      total = this.asSeconds(),
      totalSign,
      ymSign,
      daysSign,
      hmsSign;

  if (!total) {
    // this is the same as C#'s (Noda) and python (isodate)...
    // but not other JS (goog.date)
    return 'P0D';
  } // 3600 seconds -> 60 minutes -> 1 hour


  minutes = (0, _absFloor.default)(seconds / 60);
  hours = (0, _absFloor.default)(minutes / 60);
  seconds %= 60;
  minutes %= 60; // 12 months -> 1 year

  years = (0, _absFloor.default)(months / 12);
  months %= 12; // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js

  s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';
  totalSign = total < 0 ? '-' : '';
  ymSign = sign(this._months) !== sign(total) ? '-' : '';
  daysSign = sign(this._days) !== sign(total) ? '-' : '';
  hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';
  return totalSign + 'P' + (years ? ymSign + years + 'Y' : '') + (months ? ymSign + months + 'M' : '') + (days ? daysSign + days + 'D' : '') + (hours || minutes || seconds ? 'T' : '') + (hours ? hmsSign + hours + 'H' : '') + (minutes ? hmsSign + minutes + 'M' : '') + (seconds ? hmsSign + s + 'S' : '');
}
},{"../utils/abs-floor":"node_modules/moment/src/lib/utils/abs-floor.js"}],"node_modules/moment/src/lib/duration/prototype.js":[function(require,module,exports) {
"use strict";

var _constructor = require("./constructor");

var _abs = require("./abs");

var _addSubtract = require("./add-subtract");

var _as = require("./as");

var _bubble = require("./bubble");

var _clone = require("./clone");

var _get = require("./get");

var _humanize = require("./humanize");

var _isoString = require("./iso-string");

var _locale = require("../moment/locale");

var _valid = require("./valid");

var _deprecate = require("../utils/deprecate");

var proto = _constructor.Duration.prototype;
proto.isValid = _valid.isValid;
proto.abs = _abs.abs;
proto.add = _addSubtract.add;
proto.subtract = _addSubtract.subtract;
proto.as = _as.as;
proto.asMilliseconds = _as.asMilliseconds;
proto.asSeconds = _as.asSeconds;
proto.asMinutes = _as.asMinutes;
proto.asHours = _as.asHours;
proto.asDays = _as.asDays;
proto.asWeeks = _as.asWeeks;
proto.asMonths = _as.asMonths;
proto.asQuarters = _as.asQuarters;
proto.asYears = _as.asYears;
proto.valueOf = _as.valueOf;
proto._bubble = _bubble.bubble;
proto.clone = _clone.clone;
proto.get = _get.get;
proto.milliseconds = _get.milliseconds;
proto.seconds = _get.seconds;
proto.minutes = _get.minutes;
proto.hours = _get.hours;
proto.days = _get.days;
proto.weeks = _get.weeks;
proto.months = _get.months;
proto.years = _get.years;
proto.humanize = _humanize.humanize;
proto.toISOString = _isoString.toISOString;
proto.toString = _isoString.toISOString;
proto.toJSON = _isoString.toISOString;
proto.locale = _locale.locale;
proto.localeData = _locale.localeData; // Deprecations

proto.toIsoString = (0, _deprecate.deprecate)('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', _isoString.toISOString);
proto.lang = _locale.lang;
},{"./constructor":"node_modules/moment/src/lib/duration/constructor.js","./abs":"node_modules/moment/src/lib/duration/abs.js","./add-subtract":"node_modules/moment/src/lib/duration/add-subtract.js","./as":"node_modules/moment/src/lib/duration/as.js","./bubble":"node_modules/moment/src/lib/duration/bubble.js","./clone":"node_modules/moment/src/lib/duration/clone.js","./get":"node_modules/moment/src/lib/duration/get.js","./humanize":"node_modules/moment/src/lib/duration/humanize.js","./iso-string":"node_modules/moment/src/lib/duration/iso-string.js","../moment/locale":"node_modules/moment/src/lib/moment/locale.js","./valid":"node_modules/moment/src/lib/duration/valid.js","../utils/deprecate":"node_modules/moment/src/lib/utils/deprecate.js"}],"node_modules/moment/src/lib/duration/duration.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "createDuration", {
  enumerable: true,
  get: function () {
    return _create.createDuration;
  }
});
Object.defineProperty(exports, "isDuration", {
  enumerable: true,
  get: function () {
    return _constructor.isDuration;
  }
});
Object.defineProperty(exports, "getSetRelativeTimeRounding", {
  enumerable: true,
  get: function () {
    return _humanize.getSetRelativeTimeRounding;
  }
});
Object.defineProperty(exports, "getSetRelativeTimeThreshold", {
  enumerable: true,
  get: function () {
    return _humanize.getSetRelativeTimeThreshold;
  }
});

require("./prototype");

var _create = require("./create");

var _constructor = require("./constructor");

var _humanize = require("./humanize");
},{"./prototype":"node_modules/moment/src/lib/duration/prototype.js","./create":"node_modules/moment/src/lib/duration/create.js","./constructor":"node_modules/moment/src/lib/duration/constructor.js","./humanize":"node_modules/moment/src/lib/duration/humanize.js"}],"node_modules/moment/src/lib/units/timestamp.js":[function(require,module,exports) {
"use strict";

var _format = require("../format/format");

var _regex = require("../parse/regex");

var _token = require("../parse/token");

var _toInt = _interopRequireDefault(require("../utils/to-int"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// FORMATTING
(0, _format.addFormatToken)('X', 0, 0, 'unix');
(0, _format.addFormatToken)('x', 0, 0, 'valueOf'); // PARSING

(0, _regex.addRegexToken)('x', _regex.matchSigned);
(0, _regex.addRegexToken)('X', _regex.matchTimestamp);
(0, _token.addParseToken)('X', function (input, array, config) {
  config._d = new Date(parseFloat(input) * 1000);
});
(0, _token.addParseToken)('x', function (input, array, config) {
  config._d = new Date((0, _toInt.default)(input));
});
},{"../format/format":"node_modules/moment/src/lib/format/format.js","../parse/regex":"node_modules/moment/src/lib/parse/regex.js","../parse/token":"node_modules/moment/src/lib/parse/token.js","../utils/to-int":"node_modules/moment/src/lib/utils/to-int.js"}],"node_modules/moment/src/lib/units/units.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "normalizeUnits", {
  enumerable: true,
  get: function () {
    return _aliases.normalizeUnits;
  }
});

require("./day-of-month");

require("./day-of-week");

require("./day-of-year");

require("./hour");

require("./millisecond");

require("./minute");

require("./month");

require("./offset");

require("./quarter");

require("./second");

require("./timestamp");

require("./timezone");

require("./week-year");

require("./week");

require("./year");

var _aliases = require("./aliases");
},{"./day-of-month":"node_modules/moment/src/lib/units/day-of-month.js","./day-of-week":"node_modules/moment/src/lib/units/day-of-week.js","./day-of-year":"node_modules/moment/src/lib/units/day-of-year.js","./hour":"node_modules/moment/src/lib/units/hour.js","./millisecond":"node_modules/moment/src/lib/units/millisecond.js","./minute":"node_modules/moment/src/lib/units/minute.js","./month":"node_modules/moment/src/lib/units/month.js","./offset":"node_modules/moment/src/lib/units/offset.js","./quarter":"node_modules/moment/src/lib/units/quarter.js","./second":"node_modules/moment/src/lib/units/second.js","./timestamp":"node_modules/moment/src/lib/units/timestamp.js","./timezone":"node_modules/moment/src/lib/units/timezone.js","./week-year":"node_modules/moment/src/lib/units/week-year.js","./week":"node_modules/moment/src/lib/units/week.js","./year":"node_modules/moment/src/lib/units/year.js","./aliases":"node_modules/moment/src/lib/units/aliases.js"}],"node_modules/moment/src/moment.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _hooks = require("./lib/utils/hooks");

var _moment = require("./lib/moment/moment");

var _calendar = require("./lib/moment/calendar");

var _locale = require("./lib/locale/locale");

var _duration = require("./lib/duration/duration");

var _units = require("./lib/units/units");

var _isDate = _interopRequireDefault(require("./lib/utils/is-date"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//! moment.js
//! version : 2.25.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
_hooks.hooks.version = '2.25.1';
(0, _hooks.setHookCallback)(_moment.createLocal);
_hooks.hooks.fn = _moment.momentPrototype;
_hooks.hooks.min = _moment.min;
_hooks.hooks.max = _moment.max;
_hooks.hooks.now = _moment.now;
_hooks.hooks.utc = _moment.createUTC;
_hooks.hooks.unix = _moment.createUnix;
_hooks.hooks.months = _locale.listMonths;
_hooks.hooks.isDate = _isDate.default;
_hooks.hooks.locale = _locale.getSetGlobalLocale;
_hooks.hooks.invalid = _moment.createInvalid;
_hooks.hooks.duration = _duration.createDuration;
_hooks.hooks.isMoment = _moment.isMoment;
_hooks.hooks.weekdays = _locale.listWeekdays;
_hooks.hooks.parseZone = _moment.createInZone;
_hooks.hooks.localeData = _locale.getLocale;
_hooks.hooks.isDuration = _duration.isDuration;
_hooks.hooks.monthsShort = _locale.listMonthsShort;
_hooks.hooks.weekdaysMin = _locale.listWeekdaysMin;
_hooks.hooks.defineLocale = _locale.defineLocale;
_hooks.hooks.updateLocale = _locale.updateLocale;
_hooks.hooks.locales = _locale.listLocales;
_hooks.hooks.weekdaysShort = _locale.listWeekdaysShort;
_hooks.hooks.normalizeUnits = _units.normalizeUnits;
_hooks.hooks.relativeTimeRounding = _duration.getSetRelativeTimeRounding;
_hooks.hooks.relativeTimeThreshold = _duration.getSetRelativeTimeThreshold;
_hooks.hooks.calendarFormat = _calendar.getCalendarFormat;
_hooks.hooks.prototype = _moment.momentPrototype; // currently HTML5 input type only supports 24-hour formats

_hooks.hooks.HTML5_FMT = {
  DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm',
  // <input type="datetime-local" />
  DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss',
  // <input type="datetime-local" step="1" />
  DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS',
  // <input type="datetime-local" step="0.001" />
  DATE: 'YYYY-MM-DD',
  // <input type="date" />
  TIME: 'HH:mm',
  // <input type="time" />
  TIME_SECONDS: 'HH:mm:ss',
  // <input type="time" step="1" />
  TIME_MS: 'HH:mm:ss.SSS',
  // <input type="time" step="0.001" />
  WEEK: 'GGGG-[W]WW',
  // <input type="week" />
  MONTH: 'YYYY-MM' // <input type="month" />

};
var _default = _hooks.hooks;
exports.default = _default;
},{"./lib/utils/hooks":"node_modules/moment/src/lib/utils/hooks.js","./lib/moment/moment":"node_modules/moment/src/lib/moment/moment.js","./lib/moment/calendar":"node_modules/moment/src/lib/moment/calendar.js","./lib/locale/locale":"node_modules/moment/src/lib/locale/locale.js","./lib/duration/duration":"node_modules/moment/src/lib/duration/duration.js","./lib/units/units":"node_modules/moment/src/lib/units/units.js","./lib/utils/is-date":"node_modules/moment/src/lib/utils/is-date.js"}],"vendor/daterangepicker/daterangepicker.js":[function(require,module,exports) {
var define;
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
* @version: 2.1.25
* @author: Dan Grossman http://www.dangrossman.info/
* @copyright: Copyright (c) 2012-2017 Dan Grossman. All rights reserved.
* @license: Licensed under the MIT license. See http://www.opensource.org/licenses/mit-license.php
* @website: http://www.daterangepicker.com/
*/
// Follow the UMD template https://github.com/umdjs/umd/blob/master/templates/returnExportsGlobal.js
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Make globaly available as well
    define(['moment', 'jquery'], function (moment, jquery) {
      if (!jquery.fn) jquery.fn = {}; // webpack server rendering

      return root.daterangepicker = factory(moment, jquery);
    });
  } else if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object' && module.exports) {
    // Node / Browserify
    //isomorphic issue
    var jQuery = typeof window != 'undefined' ? window.jQuery : undefined;

    if (!jQuery) {
      jQuery = require('jquery');
      if (!jQuery.fn) jQuery.fn = {};
    }

    var moment = typeof window != 'undefined' && typeof window.moment != 'undefined' ? window.moment : require('moment');
    module.exports = factory(moment, jQuery);
  } else {
    // Browser globals
    root.daterangepicker = factory(root.moment, root.jQuery);
  }
})(this, function (moment, $) {
  var DateRangePicker = function DateRangePicker(element, options, cb) {
    //default settings for options
    this.parentEl = 'body';
    this.element = $(element);
    this.startDate = moment().startOf('day');
    this.endDate = moment().endOf('day');
    this.minDate = false;
    this.maxDate = false;
    this.dateLimit = false;
    this.autoApply = false;
    this.singleDatePicker = false;
    this.showDropdowns = false;
    this.showWeekNumbers = false;
    this.showISOWeekNumbers = false;
    this.showCustomRangeLabel = true;
    this.timePicker = false;
    this.timePicker24Hour = false;
    this.timePickerIncrement = 1;
    this.timePickerSeconds = false;
    this.linkedCalendars = true;
    this.autoUpdateInput = true;
    this.alwaysShowCalendars = false;
    this.ranges = {};
    this.opens = 'right';
    if (this.element.hasClass('pull-right')) this.opens = 'left';
    this.drops = 'down';
    if (this.element.hasClass('dropup')) this.drops = 'up';
    this.buttonClasses = 'btn btn-sm';
    this.applyClass = 'btn-success';
    this.cancelClass = 'btn-default';
    this.locale = {
      direction: 'ltr',
      format: moment.localeData().longDateFormat('L'),
      separator: ' - ',
      applyLabel: 'Apply',
      cancelLabel: 'Cancel',
      weekLabel: 'W',
      customRangeLabel: 'Custom Range',
      daysOfWeek: moment.weekdaysMin(),
      monthNames: moment.monthsShort(),
      firstDay: moment.localeData().firstDayOfWeek()
    };

    this.callback = function () {}; //some state information


    this.isShowing = false;
    this.leftCalendar = {};
    this.rightCalendar = {}; //custom options from user

    if (_typeof(options) !== 'object' || options === null) options = {}; //allow setting options with data attributes
    //data-api options will be overwritten with custom javascript options

    options = $.extend(this.element.data(), options); //html template for the picker UI

    if (typeof options.template !== 'string' && !(options.template instanceof $)) options.template = '<div class="daterangepicker dropdown-menu">' + '<div class="calendar left">' + '<div class="daterangepicker_input">' + '<input class="input-mini form-control" type="text" name="daterangepicker_start" value="" />' + '<i class="fa fa-calendar glyphicon glyphicon-calendar"></i>' + '<div class="calendar-time">' + '<div></div>' + '<i class="fa fa-clock-o glyphicon glyphicon-time"></i>' + '</div>' + '</div>' + '<div class="calendar-table"></div>' + '</div>' + '<div class="calendar right">' + '<div class="daterangepicker_input">' + '<input class="input-mini form-control" type="text" name="daterangepicker_end" value="" />' + '<i class="fa fa-calendar glyphicon glyphicon-calendar"></i>' + '<div class="calendar-time">' + '<div></div>' + '<i class="fa fa-clock-o glyphicon glyphicon-time"></i>' + '</div>' + '</div>' + '<div class="calendar-table"></div>' + '</div>' + '<div class="ranges">' + '<div class="range_inputs">' + '<button class="applyBtn" disabled="disabled" type="button"></button> ' + '<button class="cancelBtn" type="button"></button>' + '</div>' + '</div>' + '</div>';
    this.parentEl = options.parentEl && $(options.parentEl).length ? $(options.parentEl) : $(this.parentEl);
    this.container = $(options.template).appendTo(this.parentEl); //
    // handle all the possible options overriding defaults
    //

    if (_typeof(options.locale) === 'object') {
      if (typeof options.locale.direction === 'string') this.locale.direction = options.locale.direction;
      if (typeof options.locale.format === 'string') this.locale.format = options.locale.format;
      if (typeof options.locale.separator === 'string') this.locale.separator = options.locale.separator;
      if (_typeof(options.locale.daysOfWeek) === 'object') this.locale.daysOfWeek = options.locale.daysOfWeek.slice();
      if (_typeof(options.locale.monthNames) === 'object') this.locale.monthNames = options.locale.monthNames.slice();
      if (typeof options.locale.firstDay === 'number') this.locale.firstDay = options.locale.firstDay;
      if (typeof options.locale.applyLabel === 'string') this.locale.applyLabel = options.locale.applyLabel;
      if (typeof options.locale.cancelLabel === 'string') this.locale.cancelLabel = options.locale.cancelLabel;
      if (typeof options.locale.weekLabel === 'string') this.locale.weekLabel = options.locale.weekLabel;

      if (typeof options.locale.customRangeLabel === 'string') {
        //Support unicode chars in the custom range name.
        var elem = document.createElement('textarea');
        elem.innerHTML = options.locale.customRangeLabel;
        var rangeHtml = elem.value;
        this.locale.customRangeLabel = rangeHtml;
      }
    }

    this.container.addClass(this.locale.direction);
    if (typeof options.startDate === 'string') this.startDate = moment(options.startDate, this.locale.format);
    if (typeof options.endDate === 'string') this.endDate = moment(options.endDate, this.locale.format);
    if (typeof options.minDate === 'string') this.minDate = moment(options.minDate, this.locale.format);
    if (typeof options.maxDate === 'string') this.maxDate = moment(options.maxDate, this.locale.format);
    if (_typeof(options.startDate) === 'object') this.startDate = moment(options.startDate);
    if (_typeof(options.endDate) === 'object') this.endDate = moment(options.endDate);
    if (_typeof(options.minDate) === 'object') this.minDate = moment(options.minDate);
    if (_typeof(options.maxDate) === 'object') this.maxDate = moment(options.maxDate); // sanity check for bad options

    if (this.minDate && this.startDate.isBefore(this.minDate)) this.startDate = this.minDate.clone(); // sanity check for bad options

    if (this.maxDate && this.endDate.isAfter(this.maxDate)) this.endDate = this.maxDate.clone();
    if (typeof options.applyClass === 'string') this.applyClass = options.applyClass;
    if (typeof options.cancelClass === 'string') this.cancelClass = options.cancelClass;
    if (_typeof(options.dateLimit) === 'object') this.dateLimit = options.dateLimit;
    if (typeof options.opens === 'string') this.opens = options.opens;
    if (typeof options.drops === 'string') this.drops = options.drops;
    if (typeof options.showWeekNumbers === 'boolean') this.showWeekNumbers = options.showWeekNumbers;
    if (typeof options.showISOWeekNumbers === 'boolean') this.showISOWeekNumbers = options.showISOWeekNumbers;
    if (typeof options.buttonClasses === 'string') this.buttonClasses = options.buttonClasses;
    if (_typeof(options.buttonClasses) === 'object') this.buttonClasses = options.buttonClasses.join(' ');
    if (typeof options.showDropdowns === 'boolean') this.showDropdowns = options.showDropdowns;
    if (typeof options.showCustomRangeLabel === 'boolean') this.showCustomRangeLabel = options.showCustomRangeLabel;

    if (typeof options.singleDatePicker === 'boolean') {
      this.singleDatePicker = options.singleDatePicker;
      if (this.singleDatePicker) this.endDate = this.startDate.clone();
    }

    if (typeof options.timePicker === 'boolean') this.timePicker = options.timePicker;
    if (typeof options.timePickerSeconds === 'boolean') this.timePickerSeconds = options.timePickerSeconds;
    if (typeof options.timePickerIncrement === 'number') this.timePickerIncrement = options.timePickerIncrement;
    if (typeof options.timePicker24Hour === 'boolean') this.timePicker24Hour = options.timePicker24Hour;
    if (typeof options.autoApply === 'boolean') this.autoApply = options.autoApply;
    if (typeof options.autoUpdateInput === 'boolean') this.autoUpdateInput = options.autoUpdateInput;
    if (typeof options.linkedCalendars === 'boolean') this.linkedCalendars = options.linkedCalendars;
    if (typeof options.isInvalidDate === 'function') this.isInvalidDate = options.isInvalidDate;
    if (typeof options.isCustomDate === 'function') this.isCustomDate = options.isCustomDate;
    if (typeof options.alwaysShowCalendars === 'boolean') this.alwaysShowCalendars = options.alwaysShowCalendars; // update day names order to firstDay

    if (this.locale.firstDay != 0) {
      var iterator = this.locale.firstDay;

      while (iterator > 0) {
        this.locale.daysOfWeek.push(this.locale.daysOfWeek.shift());
        iterator--;
      }
    }

    var start, end, range; //if no start/end dates set, check if an input element contains initial values

    if (typeof options.startDate === 'undefined' && typeof options.endDate === 'undefined') {
      if ($(this.element).is('input[type=text]')) {
        var val = $(this.element).val(),
            split = val.split(this.locale.separator);
        start = end = null;

        if (split.length == 2) {
          start = moment(split[0], this.locale.format);
          end = moment(split[1], this.locale.format);
        } else if (this.singleDatePicker && val !== "") {
          start = moment(val, this.locale.format);
          end = moment(val, this.locale.format);
        }

        if (start !== null && end !== null) {
          this.setStartDate(start);
          this.setEndDate(end);
        }
      }
    }

    if (_typeof(options.ranges) === 'object') {
      for (range in options.ranges) {
        if (typeof options.ranges[range][0] === 'string') start = moment(options.ranges[range][0], this.locale.format);else start = moment(options.ranges[range][0]);
        if (typeof options.ranges[range][1] === 'string') end = moment(options.ranges[range][1], this.locale.format);else end = moment(options.ranges[range][1]); // If the start or end date exceed those allowed by the minDate or dateLimit
        // options, shorten the range to the allowable period.

        if (this.minDate && start.isBefore(this.minDate)) start = this.minDate.clone();
        var maxDate = this.maxDate;
        if (this.dateLimit && maxDate && start.clone().add(this.dateLimit).isAfter(maxDate)) maxDate = start.clone().add(this.dateLimit);
        if (maxDate && end.isAfter(maxDate)) end = maxDate.clone(); // If the end of the range is before the minimum or the start of the range is
        // after the maximum, don't display this range option at all.

        if (this.minDate && end.isBefore(this.minDate, this.timepicker ? 'minute' : 'day') || maxDate && start.isAfter(maxDate, this.timepicker ? 'minute' : 'day')) continue; //Support unicode chars in the range names.

        var elem = document.createElement('textarea');
        elem.innerHTML = range;
        var rangeHtml = elem.value;
        this.ranges[rangeHtml] = [start, end];
      }

      var list = '<ul>';

      for (range in this.ranges) {
        list += '<li data-range-key="' + range + '">' + range + '</li>';
      }

      if (this.showCustomRangeLabel) {
        list += '<li data-range-key="' + this.locale.customRangeLabel + '">' + this.locale.customRangeLabel + '</li>';
      }

      list += '</ul>';
      this.container.find('.ranges').prepend(list);
    }

    if (typeof cb === 'function') {
      this.callback = cb;
    }

    if (!this.timePicker) {
      this.startDate = this.startDate.startOf('day');
      this.endDate = this.endDate.endOf('day');
      this.container.find('.calendar-time').hide();
    } //can't be used together for now


    if (this.timePicker && this.autoApply) this.autoApply = false;

    if (this.autoApply && _typeof(options.ranges) !== 'object') {
      this.container.find('.ranges').hide();
    } else if (this.autoApply) {
      this.container.find('.applyBtn, .cancelBtn').addClass('hide');
    }

    if (this.singleDatePicker) {
      this.container.addClass('single');
      this.container.find('.calendar.left').addClass('single');
      this.container.find('.calendar.left').show();
      this.container.find('.calendar.right').hide();
      this.container.find('.daterangepicker_input input, .daterangepicker_input > i').hide();

      if (this.timePicker) {
        this.container.find('.ranges ul').hide();
      } else {
        this.container.find('.ranges').hide();
      }
    }

    if (typeof options.ranges === 'undefined' && !this.singleDatePicker || this.alwaysShowCalendars) {
      this.container.addClass('show-calendar');
    }

    this.container.addClass('opens' + this.opens); //swap the position of the predefined ranges if opens right

    if (typeof options.ranges !== 'undefined' && this.opens == 'right') {
      this.container.find('.ranges').prependTo(this.container.find('.calendar.left').parent());
    } //apply CSS classes and labels to buttons


    this.container.find('.applyBtn, .cancelBtn').addClass(this.buttonClasses);
    if (this.applyClass.length) this.container.find('.applyBtn').addClass(this.applyClass);
    if (this.cancelClass.length) this.container.find('.cancelBtn').addClass(this.cancelClass);
    this.container.find('.applyBtn').html(this.locale.applyLabel);
    this.container.find('.cancelBtn').html(this.locale.cancelLabel); //
    // event listeners
    //

    this.container.find('.calendar').on('click.daterangepicker', '.prev', $.proxy(this.clickPrev, this)).on('click.daterangepicker', '.next', $.proxy(this.clickNext, this)).on('mousedown.daterangepicker', 'td.available', $.proxy(this.clickDate, this)).on('mouseenter.daterangepicker', 'td.available', $.proxy(this.hoverDate, this)).on('mouseleave.daterangepicker', 'td.available', $.proxy(this.updateFormInputs, this)).on('change.daterangepicker', 'select.yearselect', $.proxy(this.monthOrYearChanged, this)).on('change.daterangepicker', 'select.monthselect', $.proxy(this.monthOrYearChanged, this)).on('change.daterangepicker', 'select.hourselect,select.minuteselect,select.secondselect,select.ampmselect', $.proxy(this.timeChanged, this)).on('click.daterangepicker', '.daterangepicker_input input', $.proxy(this.showCalendars, this)).on('focus.daterangepicker', '.daterangepicker_input input', $.proxy(this.formInputsFocused, this)).on('blur.daterangepicker', '.daterangepicker_input input', $.proxy(this.formInputsBlurred, this)).on('change.daterangepicker', '.daterangepicker_input input', $.proxy(this.formInputsChanged, this));
    this.container.find('.ranges').on('click.daterangepicker', 'button.applyBtn', $.proxy(this.clickApply, this)).on('click.daterangepicker', 'button.cancelBtn', $.proxy(this.clickCancel, this)).on('click.daterangepicker', 'li', $.proxy(this.clickRange, this)).on('mouseenter.daterangepicker', 'li', $.proxy(this.hoverRange, this)).on('mouseleave.daterangepicker', 'li', $.proxy(this.updateFormInputs, this));

    if (this.element.is('input') || this.element.is('button')) {
      this.element.on({
        'click.daterangepicker': $.proxy(this.show, this),
        'focus.daterangepicker': $.proxy(this.show, this),
        'keyup.daterangepicker': $.proxy(this.elementChanged, this),
        'keydown.daterangepicker': $.proxy(this.keydown, this)
      });
    } else {
      this.element.on('click.daterangepicker', $.proxy(this.toggle, this));
    } //
    // if attached to a text input, set the initial value
    //


    if (this.element.is('input') && !this.singleDatePicker && this.autoUpdateInput) {
      this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
      this.element.trigger('change');
    } else if (this.element.is('input') && this.autoUpdateInput) {
      this.element.val(this.startDate.format(this.locale.format));
      this.element.trigger('change');
    }
  };

  DateRangePicker.prototype = {
    constructor: DateRangePicker,
    setStartDate: function setStartDate(startDate) {
      if (typeof startDate === 'string') this.startDate = moment(startDate, this.locale.format);
      if (_typeof(startDate) === 'object') this.startDate = moment(startDate);
      if (!this.timePicker) this.startDate = this.startDate.startOf('day');
      if (this.timePicker && this.timePickerIncrement) this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);

      if (this.minDate && this.startDate.isBefore(this.minDate)) {
        this.startDate = this.minDate.clone();
        if (this.timePicker && this.timePickerIncrement) this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
      }

      if (this.maxDate && this.startDate.isAfter(this.maxDate)) {
        this.startDate = this.maxDate.clone();
        if (this.timePicker && this.timePickerIncrement) this.startDate.minute(Math.floor(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
      }

      if (!this.isShowing) this.updateElement();
      this.updateMonthsInView();
    },
    setEndDate: function setEndDate(endDate) {
      if (typeof endDate === 'string') this.endDate = moment(endDate, this.locale.format);
      if (_typeof(endDate) === 'object') this.endDate = moment(endDate);
      if (!this.timePicker) this.endDate = this.endDate.endOf('day');
      if (this.timePicker && this.timePickerIncrement) this.endDate.minute(Math.round(this.endDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
      if (this.endDate.isBefore(this.startDate)) this.endDate = this.startDate.clone();
      if (this.maxDate && this.endDate.isAfter(this.maxDate)) this.endDate = this.maxDate.clone();
      if (this.dateLimit && this.startDate.clone().add(this.dateLimit).isBefore(this.endDate)) this.endDate = this.startDate.clone().add(this.dateLimit);
      this.previousRightTime = this.endDate.clone();
      if (!this.isShowing) this.updateElement();
      this.updateMonthsInView();
    },
    isInvalidDate: function isInvalidDate() {
      return false;
    },
    isCustomDate: function isCustomDate() {
      return false;
    },
    updateView: function updateView() {
      if (this.timePicker) {
        this.renderTimePicker('left');
        this.renderTimePicker('right');

        if (!this.endDate) {
          this.container.find('.right .calendar-time select').attr('disabled', 'disabled').addClass('disabled');
        } else {
          this.container.find('.right .calendar-time select').removeAttr('disabled').removeClass('disabled');
        }
      }

      if (this.endDate) {
        this.container.find('input[name="daterangepicker_end"]').removeClass('active');
        this.container.find('input[name="daterangepicker_start"]').addClass('active');
      } else {
        this.container.find('input[name="daterangepicker_end"]').addClass('active');
        this.container.find('input[name="daterangepicker_start"]').removeClass('active');
      }

      this.updateMonthsInView();
      this.updateCalendars();
      this.updateFormInputs();
    },
    updateMonthsInView: function updateMonthsInView() {
      if (this.endDate) {
        //if both dates are visible already, do nothing
        if (!this.singleDatePicker && this.leftCalendar.month && this.rightCalendar.month && (this.startDate.format('YYYY-MM') == this.leftCalendar.month.format('YYYY-MM') || this.startDate.format('YYYY-MM') == this.rightCalendar.month.format('YYYY-MM')) && (this.endDate.format('YYYY-MM') == this.leftCalendar.month.format('YYYY-MM') || this.endDate.format('YYYY-MM') == this.rightCalendar.month.format('YYYY-MM'))) {
          return;
        }

        this.leftCalendar.month = this.startDate.clone().date(2);

        if (!this.linkedCalendars && (this.endDate.month() != this.startDate.month() || this.endDate.year() != this.startDate.year())) {
          this.rightCalendar.month = this.endDate.clone().date(2);
        } else {
          this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
        }
      } else {
        if (this.leftCalendar.month.format('YYYY-MM') != this.startDate.format('YYYY-MM') && this.rightCalendar.month.format('YYYY-MM') != this.startDate.format('YYYY-MM')) {
          this.leftCalendar.month = this.startDate.clone().date(2);
          this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
        }
      }

      if (this.maxDate && this.linkedCalendars && !this.singleDatePicker && this.rightCalendar.month > this.maxDate) {
        this.rightCalendar.month = this.maxDate.clone().date(2);
        this.leftCalendar.month = this.maxDate.clone().date(2).subtract(1, 'month');
      }
    },
    updateCalendars: function updateCalendars() {
      if (this.timePicker) {
        var hour, minute, second;

        if (this.endDate) {
          hour = parseInt(this.container.find('.left .hourselect').val(), 10);
          minute = parseInt(this.container.find('.left .minuteselect').val(), 10);
          second = this.timePickerSeconds ? parseInt(this.container.find('.left .secondselect').val(), 10) : 0;

          if (!this.timePicker24Hour) {
            var ampm = this.container.find('.left .ampmselect').val();
            if (ampm === 'PM' && hour < 12) hour += 12;
            if (ampm === 'AM' && hour === 12) hour = 0;
          }
        } else {
          hour = parseInt(this.container.find('.right .hourselect').val(), 10);
          minute = parseInt(this.container.find('.right .minuteselect').val(), 10);
          second = this.timePickerSeconds ? parseInt(this.container.find('.right .secondselect').val(), 10) : 0;

          if (!this.timePicker24Hour) {
            var ampm = this.container.find('.right .ampmselect').val();
            if (ampm === 'PM' && hour < 12) hour += 12;
            if (ampm === 'AM' && hour === 12) hour = 0;
          }
        }

        this.leftCalendar.month.hour(hour).minute(minute).second(second);
        this.rightCalendar.month.hour(hour).minute(minute).second(second);
      }

      this.renderCalendar('left');
      this.renderCalendar('right'); //highlight any predefined range matching the current start and end dates

      this.container.find('.ranges li').removeClass('active');
      if (this.endDate == null) return;
      this.calculateChosenLabel();
    },
    renderCalendar: function renderCalendar(side) {
      //
      // Build the matrix of dates that will populate the calendar
      //
      var calendar = side == 'left' ? this.leftCalendar : this.rightCalendar;
      var month = calendar.month.month();
      var year = calendar.month.year();
      var hour = calendar.month.hour();
      var minute = calendar.month.minute();
      var second = calendar.month.second();
      var daysInMonth = moment([year, month]).daysInMonth();
      var firstDay = moment([year, month, 1]);
      var lastDay = moment([year, month, daysInMonth]);
      var lastMonth = moment(firstDay).subtract(1, 'month').month();
      var lastYear = moment(firstDay).subtract(1, 'month').year();
      var daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth();
      var dayOfWeek = firstDay.day(); //initialize a 6 rows x 7 columns array for the calendar

      var calendar = [];
      calendar.firstDay = firstDay;
      calendar.lastDay = lastDay;

      for (var i = 0; i < 6; i++) {
        calendar[i] = [];
      } //populate the calendar with date objects


      var startDay = daysInLastMonth - dayOfWeek + this.locale.firstDay + 1;
      if (startDay > daysInLastMonth) startDay -= 7;
      if (dayOfWeek == this.locale.firstDay) startDay = daysInLastMonth - 6;
      var curDate = moment([lastYear, lastMonth, startDay, 12, minute, second]);
      var col, row;

      for (var i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = moment(curDate).add(24, 'hour')) {
        if (i > 0 && col % 7 === 0) {
          col = 0;
          row++;
        }

        calendar[row][col] = curDate.clone().hour(hour).minute(minute).second(second);
        curDate.hour(12);

        if (this.minDate && calendar[row][col].format('YYYY-MM-DD') == this.minDate.format('YYYY-MM-DD') && calendar[row][col].isBefore(this.minDate) && side == 'left') {
          calendar[row][col] = this.minDate.clone();
        }

        if (this.maxDate && calendar[row][col].format('YYYY-MM-DD') == this.maxDate.format('YYYY-MM-DD') && calendar[row][col].isAfter(this.maxDate) && side == 'right') {
          calendar[row][col] = this.maxDate.clone();
        }
      } //make the calendar object available to hoverDate/clickDate


      if (side == 'left') {
        this.leftCalendar.calendar = calendar;
      } else {
        this.rightCalendar.calendar = calendar;
      } //
      // Display the calendar
      //


      var minDate = side == 'left' ? this.minDate : this.startDate;
      var maxDate = this.maxDate;
      var selected = side == 'left' ? this.startDate : this.endDate;
      var arrow = this.locale.direction == 'ltr' ? {
        left: 'chevron-left',
        right: 'chevron-right'
      } : {
        left: 'chevron-right',
        right: 'chevron-left'
      };
      var html = '<table class="table-condensed">';
      html += '<thead>';
      html += '<tr>'; // add empty cell for week number

      if (this.showWeekNumbers || this.showISOWeekNumbers) html += '<th></th>';

      if ((!minDate || minDate.isBefore(calendar.firstDay)) && (!this.linkedCalendars || side == 'left')) {
        html += '<th class="prev available"><i class="fa fa-' + arrow.left + ' glyphicon glyphicon-' + arrow.left + '"></i></th>';
      } else {
        html += '<th></th>';
      }

      var dateHtml = this.locale.monthNames[calendar[1][1].month()] + calendar[1][1].format(" YYYY");

      if (this.showDropdowns) {
        var currentMonth = calendar[1][1].month();
        var currentYear = calendar[1][1].year();
        var maxYear = maxDate && maxDate.year() || currentYear + 5;
        var minYear = minDate && minDate.year() || currentYear - 50;
        var inMinYear = currentYear == minYear;
        var inMaxYear = currentYear == maxYear;
        var monthHtml = '<select class="monthselect">';

        for (var m = 0; m < 12; m++) {
          if ((!inMinYear || m >= minDate.month()) && (!inMaxYear || m <= maxDate.month())) {
            monthHtml += "<option value='" + m + "'" + (m === currentMonth ? " selected='selected'" : "") + ">" + this.locale.monthNames[m] + "</option>";
          } else {
            monthHtml += "<option value='" + m + "'" + (m === currentMonth ? " selected='selected'" : "") + " disabled='disabled'>" + this.locale.monthNames[m] + "</option>";
          }
        }

        monthHtml += "</select>";
        var yearHtml = '<select class="yearselect">';

        for (var y = minYear; y <= maxYear; y++) {
          yearHtml += '<option value="' + y + '"' + (y === currentYear ? ' selected="selected"' : '') + '>' + y + '</option>';
        }

        yearHtml += '</select>';
        dateHtml = monthHtml + yearHtml;
      }

      html += '<th colspan="5" class="month">' + dateHtml + '</th>';

      if ((!maxDate || maxDate.isAfter(calendar.lastDay)) && (!this.linkedCalendars || side == 'right' || this.singleDatePicker)) {
        html += '<th class="next available"><i class="fa fa-' + arrow.right + ' glyphicon glyphicon-' + arrow.right + '"></i></th>';
      } else {
        html += '<th></th>';
      }

      html += '</tr>';
      html += '<tr>'; // add week number label

      if (this.showWeekNumbers || this.showISOWeekNumbers) html += '<th class="week">' + this.locale.weekLabel + '</th>';
      $.each(this.locale.daysOfWeek, function (index, dayOfWeek) {
        html += '<th>' + dayOfWeek + '</th>';
      });
      html += '</tr>';
      html += '</thead>';
      html += '<tbody>'; //adjust maxDate to reflect the dateLimit setting in order to
      //grey out end dates beyond the dateLimit

      if (this.endDate == null && this.dateLimit) {
        var maxLimit = this.startDate.clone().add(this.dateLimit).endOf('day');

        if (!maxDate || maxLimit.isBefore(maxDate)) {
          maxDate = maxLimit;
        }
      }

      for (var row = 0; row < 6; row++) {
        html += '<tr>'; // add week number

        if (this.showWeekNumbers) html += '<td class="week">' + calendar[row][0].week() + '</td>';else if (this.showISOWeekNumbers) html += '<td class="week">' + calendar[row][0].isoWeek() + '</td>';

        for (var col = 0; col < 7; col++) {
          var classes = []; //highlight today's date

          if (calendar[row][col].isSame(new Date(), "day")) classes.push('today'); //highlight weekends

          if (calendar[row][col].isoWeekday() > 5) classes.push('weekend'); //grey out the dates in other months displayed at beginning and end of this calendar

          if (calendar[row][col].month() != calendar[1][1].month()) classes.push('off'); //don't allow selection of dates before the minimum date

          if (this.minDate && calendar[row][col].isBefore(this.minDate, 'day')) classes.push('off', 'disabled'); //don't allow selection of dates after the maximum date

          if (maxDate && calendar[row][col].isAfter(maxDate, 'day')) classes.push('off', 'disabled'); //don't allow selection of date if a custom function decides it's invalid

          if (this.isInvalidDate(calendar[row][col])) classes.push('off', 'disabled'); //highlight the currently selected start date

          if (calendar[row][col].format('YYYY-MM-DD') == this.startDate.format('YYYY-MM-DD')) classes.push('active', 'start-date'); //highlight the currently selected end date

          if (this.endDate != null && calendar[row][col].format('YYYY-MM-DD') == this.endDate.format('YYYY-MM-DD')) classes.push('active', 'end-date'); //highlight dates in-between the selected dates

          if (this.endDate != null && calendar[row][col] > this.startDate && calendar[row][col] < this.endDate) classes.push('in-range'); //apply custom classes for this date

          var isCustom = this.isCustomDate(calendar[row][col]);

          if (isCustom !== false) {
            if (typeof isCustom === 'string') classes.push(isCustom);else Array.prototype.push.apply(classes, isCustom);
          }

          var cname = '',
              disabled = false;

          for (var i = 0; i < classes.length; i++) {
            cname += classes[i] + ' ';
            if (classes[i] == 'disabled') disabled = true;
          }

          if (!disabled) cname += 'available';
          html += '<td class="' + cname.replace(/^\s+|\s+$/g, '') + '" data-title="' + 'r' + row + 'c' + col + '">' + calendar[row][col].date() + '</td>';
        }

        html += '</tr>';
      }

      html += '</tbody>';
      html += '</table>';
      this.container.find('.calendar.' + side + ' .calendar-table').html(html);
    },
    renderTimePicker: function renderTimePicker(side) {
      // Don't bother updating the time picker if it's currently disabled
      // because an end date hasn't been clicked yet
      if (side == 'right' && !this.endDate) return;
      var html,
          selected,
          minDate,
          maxDate = this.maxDate;
      if (this.dateLimit && (!this.maxDate || this.startDate.clone().add(this.dateLimit).isAfter(this.maxDate))) maxDate = this.startDate.clone().add(this.dateLimit);

      if (side == 'left') {
        selected = this.startDate.clone();
        minDate = this.minDate;
      } else if (side == 'right') {
        selected = this.endDate.clone();
        minDate = this.startDate; //Preserve the time already selected

        var timeSelector = this.container.find('.calendar.right .calendar-time div');

        if (timeSelector.html() != '') {
          selected.hour(timeSelector.find('.hourselect option:selected').val() || selected.hour());
          selected.minute(timeSelector.find('.minuteselect option:selected').val() || selected.minute());
          selected.second(timeSelector.find('.secondselect option:selected').val() || selected.second());

          if (!this.timePicker24Hour) {
            var ampm = timeSelector.find('.ampmselect option:selected').val();
            if (ampm === 'PM' && selected.hour() < 12) selected.hour(selected.hour() + 12);
            if (ampm === 'AM' && selected.hour() === 12) selected.hour(0);
          }
        }

        if (selected.isBefore(this.startDate)) selected = this.startDate.clone();
        if (maxDate && selected.isAfter(maxDate)) selected = maxDate.clone();
      } //
      // hours
      //


      html = '<select class="hourselect">';
      var start = this.timePicker24Hour ? 0 : 1;
      var end = this.timePicker24Hour ? 23 : 12;

      for (var i = start; i <= end; i++) {
        var i_in_24 = i;
        if (!this.timePicker24Hour) i_in_24 = selected.hour() >= 12 ? i == 12 ? 12 : i + 12 : i == 12 ? 0 : i;
        var time = selected.clone().hour(i_in_24);
        var disabled = false;
        if (minDate && time.minute(59).isBefore(minDate)) disabled = true;
        if (maxDate && time.minute(0).isAfter(maxDate)) disabled = true;

        if (i_in_24 == selected.hour() && !disabled) {
          html += '<option value="' + i + '" selected="selected">' + i + '</option>';
        } else if (disabled) {
          html += '<option value="' + i + '" disabled="disabled" class="disabled">' + i + '</option>';
        } else {
          html += '<option value="' + i + '">' + i + '</option>';
        }
      }

      html += '</select> '; //
      // minutes
      //

      html += ': <select class="minuteselect">';

      for (var i = 0; i < 60; i += this.timePickerIncrement) {
        var padded = i < 10 ? '0' + i : i;
        var time = selected.clone().minute(i);
        var disabled = false;
        if (minDate && time.second(59).isBefore(minDate)) disabled = true;
        if (maxDate && time.second(0).isAfter(maxDate)) disabled = true;

        if (selected.minute() == i && !disabled) {
          html += '<option value="' + i + '" selected="selected">' + padded + '</option>';
        } else if (disabled) {
          html += '<option value="' + i + '" disabled="disabled" class="disabled">' + padded + '</option>';
        } else {
          html += '<option value="' + i + '">' + padded + '</option>';
        }
      }

      html += '</select> '; //
      // seconds
      //

      if (this.timePickerSeconds) {
        html += ': <select class="secondselect">';

        for (var i = 0; i < 60; i++) {
          var padded = i < 10 ? '0' + i : i;
          var time = selected.clone().second(i);
          var disabled = false;
          if (minDate && time.isBefore(minDate)) disabled = true;
          if (maxDate && time.isAfter(maxDate)) disabled = true;

          if (selected.second() == i && !disabled) {
            html += '<option value="' + i + '" selected="selected">' + padded + '</option>';
          } else if (disabled) {
            html += '<option value="' + i + '" disabled="disabled" class="disabled">' + padded + '</option>';
          } else {
            html += '<option value="' + i + '">' + padded + '</option>';
          }
        }

        html += '</select> ';
      } //
      // AM/PM
      //


      if (!this.timePicker24Hour) {
        html += '<select class="ampmselect">';
        var am_html = '';
        var pm_html = '';
        if (minDate && selected.clone().hour(12).minute(0).second(0).isBefore(minDate)) am_html = ' disabled="disabled" class="disabled"';
        if (maxDate && selected.clone().hour(0).minute(0).second(0).isAfter(maxDate)) pm_html = ' disabled="disabled" class="disabled"';

        if (selected.hour() >= 12) {
          html += '<option value="AM"' + am_html + '>AM</option><option value="PM" selected="selected"' + pm_html + '>PM</option>';
        } else {
          html += '<option value="AM" selected="selected"' + am_html + '>AM</option><option value="PM"' + pm_html + '>PM</option>';
        }

        html += '</select>';
      }

      this.container.find('.calendar.' + side + ' .calendar-time div').html(html);
    },
    updateFormInputs: function updateFormInputs() {
      //ignore mouse movements while an above-calendar text input has focus
      if (this.container.find('input[name=daterangepicker_start]').is(":focus") || this.container.find('input[name=daterangepicker_end]').is(":focus")) return;
      this.container.find('input[name=daterangepicker_start]').val(this.startDate.format(this.locale.format));
      if (this.endDate) this.container.find('input[name=daterangepicker_end]').val(this.endDate.format(this.locale.format));

      if (this.singleDatePicker || this.endDate && (this.startDate.isBefore(this.endDate) || this.startDate.isSame(this.endDate))) {
        this.container.find('button.applyBtn').removeAttr('disabled');
      } else {
        this.container.find('button.applyBtn').attr('disabled', 'disabled');
      }
    },
    move: function move() {
      var parentOffset = {
        top: 0,
        left: 0
      },
          containerTop;
      var parentRightEdge = $(window).width();

      if (!this.parentEl.is('body')) {
        parentOffset = {
          top: this.parentEl.offset().top - this.parentEl.scrollTop(),
          left: this.parentEl.offset().left - this.parentEl.scrollLeft()
        };
        parentRightEdge = this.parentEl[0].clientWidth + this.parentEl.offset().left;
      }

      if (this.drops == 'up') containerTop = this.element.offset().top - this.container.outerHeight() - parentOffset.top;else containerTop = this.element.offset().top + this.element.outerHeight() - parentOffset.top;
      this.container[this.drops == 'up' ? 'addClass' : 'removeClass']('dropup');

      if (this.opens == 'left') {
        this.container.css({
          top: containerTop,
          right: parentRightEdge - this.element.offset().left - this.element.outerWidth(),
          left: 'auto'
        });

        if (this.container.offset().left < 0) {
          this.container.css({
            right: 'auto',
            left: 9
          });
        }
      } else if (this.opens == 'center') {
        this.container.css({
          top: containerTop,
          left: this.element.offset().left - parentOffset.left + this.element.outerWidth() / 2 - this.container.outerWidth() / 2,
          right: 'auto'
        });

        if (this.container.offset().left < 0) {
          this.container.css({
            right: 'auto',
            left: 9
          });
        }
      } else {
        this.container.css({
          top: containerTop,
          left: this.element.offset().left - parentOffset.left,
          right: 'auto'
        });

        if (this.container.offset().left + this.container.outerWidth() > $(window).width()) {
          this.container.css({
            left: 'auto',
            right: 0
          });
        }
      }
    },
    show: function show(e) {
      if (this.isShowing) return; // Create a click proxy that is private to this instance of datepicker, for unbinding

      this._outsideClickProxy = $.proxy(function (e) {
        this.outsideClick(e);
      }, this); // Bind global datepicker mousedown for hiding and

      $(document).on('mousedown.daterangepicker', this._outsideClickProxy) // also support mobile devices
      .on('touchend.daterangepicker', this._outsideClickProxy) // also explicitly play nice with Bootstrap dropdowns, which stopPropagation when clicking them
      .on('click.daterangepicker', '[data-toggle=dropdown]', this._outsideClickProxy) // and also close when focus changes to outside the picker (eg. tabbing between controls)
      .on('focusin.daterangepicker', this._outsideClickProxy); // Reposition the picker if the window is resized while it's open

      $(window).on('resize.daterangepicker', $.proxy(function (e) {
        this.move(e);
      }, this));
      this.oldStartDate = this.startDate.clone();
      this.oldEndDate = this.endDate.clone();
      this.previousRightTime = this.endDate.clone();
      this.updateView();
      this.container.show();
      this.move();
      this.element.trigger('show.daterangepicker', this);
      this.isShowing = true;
    },
    hide: function hide(e) {
      if (!this.isShowing) return; //incomplete date selection, revert to last values

      if (!this.endDate) {
        this.startDate = this.oldStartDate.clone();
        this.endDate = this.oldEndDate.clone();
      } //if a new date range was selected, invoke the user callback function


      if (!this.startDate.isSame(this.oldStartDate) || !this.endDate.isSame(this.oldEndDate)) this.callback(this.startDate, this.endDate, this.chosenLabel); //if picker is attached to a text input, update it

      this.updateElement();
      $(document).off('.daterangepicker');
      $(window).off('.daterangepicker');
      this.container.hide();
      this.element.trigger('hide.daterangepicker', this);
      this.isShowing = false;
    },
    toggle: function toggle(e) {
      if (this.isShowing) {
        this.hide();
      } else {
        this.show();
      }
    },
    outsideClick: function outsideClick(e) {
      var target = $(e.target); // if the page is clicked anywhere except within the daterangerpicker/button
      // itself then call this.hide()

      if ( // ie modal dialog fix
      e.type == "focusin" || target.closest(this.element).length || target.closest(this.container).length || target.closest('.calendar-table').length) return;
      this.hide();
      this.element.trigger('outsideClick.daterangepicker', this);
    },
    showCalendars: function showCalendars() {
      this.container.addClass('show-calendar');
      this.move();
      this.element.trigger('showCalendar.daterangepicker', this);
    },
    hideCalendars: function hideCalendars() {
      this.container.removeClass('show-calendar');
      this.element.trigger('hideCalendar.daterangepicker', this);
    },
    hoverRange: function hoverRange(e) {
      //ignore mouse movements while an above-calendar text input has focus
      if (this.container.find('input[name=daterangepicker_start]').is(":focus") || this.container.find('input[name=daterangepicker_end]').is(":focus")) return;
      var label = e.target.getAttribute('data-range-key');

      if (label == this.locale.customRangeLabel) {
        this.updateView();
      } else {
        var dates = this.ranges[label];
        this.container.find('input[name=daterangepicker_start]').val(dates[0].format(this.locale.format));
        this.container.find('input[name=daterangepicker_end]').val(dates[1].format(this.locale.format));
      }
    },
    clickRange: function clickRange(e) {
      var label = e.target.getAttribute('data-range-key');
      this.chosenLabel = label;

      if (label == this.locale.customRangeLabel) {
        this.showCalendars();
      } else {
        var dates = this.ranges[label];
        this.startDate = dates[0];
        this.endDate = dates[1];

        if (!this.timePicker) {
          this.startDate.startOf('day');
          this.endDate.endOf('day');
        }

        if (!this.alwaysShowCalendars) this.hideCalendars();
        this.clickApply();
      }
    },
    clickPrev: function clickPrev(e) {
      var cal = $(e.target).parents('.calendar');

      if (cal.hasClass('left')) {
        this.leftCalendar.month.subtract(1, 'month');
        if (this.linkedCalendars) this.rightCalendar.month.subtract(1, 'month');
      } else {
        this.rightCalendar.month.subtract(1, 'month');
      }

      this.updateCalendars();
    },
    clickNext: function clickNext(e) {
      var cal = $(e.target).parents('.calendar');

      if (cal.hasClass('left')) {
        this.leftCalendar.month.add(1, 'month');
      } else {
        this.rightCalendar.month.add(1, 'month');
        if (this.linkedCalendars) this.leftCalendar.month.add(1, 'month');
      }

      this.updateCalendars();
    },
    hoverDate: function hoverDate(e) {
      //ignore mouse movements while an above-calendar text input has focus
      //if (this.container.find('input[name=daterangepicker_start]').is(":focus") || this.container.find('input[name=daterangepicker_end]').is(":focus"))
      //    return;
      //ignore dates that can't be selected
      if (!$(e.target).hasClass('available')) return; //have the text inputs above calendars reflect the date being hovered over

      var title = $(e.target).attr('data-title');
      var row = title.substr(1, 1);
      var col = title.substr(3, 1);
      var cal = $(e.target).parents('.calendar');
      var date = cal.hasClass('left') ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];

      if (this.endDate && !this.container.find('input[name=daterangepicker_start]').is(":focus")) {
        this.container.find('input[name=daterangepicker_start]').val(date.format(this.locale.format));
      } else if (!this.endDate && !this.container.find('input[name=daterangepicker_end]').is(":focus")) {
        this.container.find('input[name=daterangepicker_end]').val(date.format(this.locale.format));
      } //highlight the dates between the start date and the date being hovered as a potential end date


      var leftCalendar = this.leftCalendar;
      var rightCalendar = this.rightCalendar;
      var startDate = this.startDate;

      if (!this.endDate) {
        this.container.find('.calendar tbody td').each(function (index, el) {
          //skip week numbers, only look at dates
          if ($(el).hasClass('week')) return;
          var title = $(el).attr('data-title');
          var row = title.substr(1, 1);
          var col = title.substr(3, 1);
          var cal = $(el).parents('.calendar');
          var dt = cal.hasClass('left') ? leftCalendar.calendar[row][col] : rightCalendar.calendar[row][col];

          if (dt.isAfter(startDate) && dt.isBefore(date) || dt.isSame(date, 'day')) {
            $(el).addClass('in-range');
          } else {
            $(el).removeClass('in-range');
          }
        });
      }
    },
    clickDate: function clickDate(e) {
      if (!$(e.target).hasClass('available')) return;
      var title = $(e.target).attr('data-title');
      var row = title.substr(1, 1);
      var col = title.substr(3, 1);
      var cal = $(e.target).parents('.calendar');
      var date = cal.hasClass('left') ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col]; //
      // this function needs to do a few things:
      // * alternate between selecting a start and end date for the range,
      // * if the time picker is enabled, apply the hour/minute/second from the select boxes to the clicked date
      // * if autoapply is enabled, and an end date was chosen, apply the selection
      // * if single date picker mode, and time picker isn't enabled, apply the selection immediately
      // * if one of the inputs above the calendars was focused, cancel that manual input
      //

      if (this.endDate || date.isBefore(this.startDate, 'day')) {
        //picking start
        if (this.timePicker) {
          var hour = parseInt(this.container.find('.left .hourselect').val(), 10);

          if (!this.timePicker24Hour) {
            var ampm = this.container.find('.left .ampmselect').val();
            if (ampm === 'PM' && hour < 12) hour += 12;
            if (ampm === 'AM' && hour === 12) hour = 0;
          }

          var minute = parseInt(this.container.find('.left .minuteselect').val(), 10);
          var second = this.timePickerSeconds ? parseInt(this.container.find('.left .secondselect').val(), 10) : 0;
          date = date.clone().hour(hour).minute(minute).second(second);
        }

        this.endDate = null;
        this.setStartDate(date.clone());
      } else if (!this.endDate && date.isBefore(this.startDate)) {
        //special case: clicking the same date for start/end,
        //but the time of the end date is before the start date
        this.setEndDate(this.startDate.clone());
      } else {
        // picking end
        if (this.timePicker) {
          var hour = parseInt(this.container.find('.right .hourselect').val(), 10);

          if (!this.timePicker24Hour) {
            var ampm = this.container.find('.right .ampmselect').val();
            if (ampm === 'PM' && hour < 12) hour += 12;
            if (ampm === 'AM' && hour === 12) hour = 0;
          }

          var minute = parseInt(this.container.find('.right .minuteselect').val(), 10);
          var second = this.timePickerSeconds ? parseInt(this.container.find('.right .secondselect').val(), 10) : 0;
          date = date.clone().hour(hour).minute(minute).second(second);
        }

        this.setEndDate(date.clone());

        if (this.autoApply) {
          this.calculateChosenLabel();
          this.clickApply();
        }
      }

      if (this.singleDatePicker) {
        this.setEndDate(this.startDate);
        if (!this.timePicker) this.clickApply();
      }

      this.updateView(); //This is to cancel the blur event handler if the mouse was in one of the inputs

      e.stopPropagation();
    },
    calculateChosenLabel: function calculateChosenLabel() {
      var customRange = true;
      var i = 0;

      for (var range in this.ranges) {
        if (this.timePicker) {
          if (this.startDate.isSame(this.ranges[range][0]) && this.endDate.isSame(this.ranges[range][1])) {
            customRange = false;
            this.chosenLabel = this.container.find('.ranges li:eq(' + i + ')').addClass('active').html();
            break;
          }
        } else {
          //ignore times when comparing dates if time picker is not enabled
          if (this.startDate.format('YYYY-MM-DD') == this.ranges[range][0].format('YYYY-MM-DD') && this.endDate.format('YYYY-MM-DD') == this.ranges[range][1].format('YYYY-MM-DD')) {
            customRange = false;
            this.chosenLabel = this.container.find('.ranges li:eq(' + i + ')').addClass('active').html();
            break;
          }
        }

        i++;
      }

      if (customRange) {
        if (this.showCustomRangeLabel) {
          this.chosenLabel = this.container.find('.ranges li:last').addClass('active').html();
        } else {
          this.chosenLabel = null;
        }

        this.showCalendars();
      }
    },
    clickApply: function clickApply(e) {
      this.hide();
      this.element.trigger('apply.daterangepicker', this);
    },
    clickCancel: function clickCancel(e) {
      this.startDate = this.oldStartDate;
      this.endDate = this.oldEndDate;
      this.hide();
      this.element.trigger('cancel.daterangepicker', this);
    },
    monthOrYearChanged: function monthOrYearChanged(e) {
      var isLeft = $(e.target).closest('.calendar').hasClass('left'),
          leftOrRight = isLeft ? 'left' : 'right',
          cal = this.container.find('.calendar.' + leftOrRight); // Month must be Number for new moment versions

      var month = parseInt(cal.find('.monthselect').val(), 10);
      var year = cal.find('.yearselect').val();

      if (!isLeft) {
        if (year < this.startDate.year() || year == this.startDate.year() && month < this.startDate.month()) {
          month = this.startDate.month();
          year = this.startDate.year();
        }
      }

      if (this.minDate) {
        if (year < this.minDate.year() || year == this.minDate.year() && month < this.minDate.month()) {
          month = this.minDate.month();
          year = this.minDate.year();
        }
      }

      if (this.maxDate) {
        if (year > this.maxDate.year() || year == this.maxDate.year() && month > this.maxDate.month()) {
          month = this.maxDate.month();
          year = this.maxDate.year();
        }
      }

      if (isLeft) {
        this.leftCalendar.month.month(month).year(year);
        if (this.linkedCalendars) this.rightCalendar.month = this.leftCalendar.month.clone().add(1, 'month');
      } else {
        this.rightCalendar.month.month(month).year(year);
        if (this.linkedCalendars) this.leftCalendar.month = this.rightCalendar.month.clone().subtract(1, 'month');
      }

      this.updateCalendars();
    },
    timeChanged: function timeChanged(e) {
      var cal = $(e.target).closest('.calendar'),
          isLeft = cal.hasClass('left');
      var hour = parseInt(cal.find('.hourselect').val(), 10);
      var minute = parseInt(cal.find('.minuteselect').val(), 10);
      var second = this.timePickerSeconds ? parseInt(cal.find('.secondselect').val(), 10) : 0;

      if (!this.timePicker24Hour) {
        var ampm = cal.find('.ampmselect').val();
        if (ampm === 'PM' && hour < 12) hour += 12;
        if (ampm === 'AM' && hour === 12) hour = 0;
      }

      if (isLeft) {
        var start = this.startDate.clone();
        start.hour(hour);
        start.minute(minute);
        start.second(second);
        this.setStartDate(start);

        if (this.singleDatePicker) {
          this.endDate = this.startDate.clone();
        } else if (this.endDate && this.endDate.format('YYYY-MM-DD') == start.format('YYYY-MM-DD') && this.endDate.isBefore(start)) {
          this.setEndDate(start.clone());
        }
      } else if (this.endDate) {
        var end = this.endDate.clone();
        end.hour(hour);
        end.minute(minute);
        end.second(second);
        this.setEndDate(end);
      } //update the calendars so all clickable dates reflect the new time component


      this.updateCalendars(); //update the form inputs above the calendars with the new time

      this.updateFormInputs(); //re-render the time pickers because changing one selection can affect what's enabled in another

      this.renderTimePicker('left');
      this.renderTimePicker('right');
    },
    formInputsChanged: function formInputsChanged(e) {
      var isRight = $(e.target).closest('.calendar').hasClass('right');
      var start = moment(this.container.find('input[name="daterangepicker_start"]').val(), this.locale.format);
      var end = moment(this.container.find('input[name="daterangepicker_end"]').val(), this.locale.format);

      if (start.isValid() && end.isValid()) {
        if (isRight && end.isBefore(start)) start = end.clone();
        this.setStartDate(start);
        this.setEndDate(end);

        if (isRight) {
          this.container.find('input[name="daterangepicker_start"]').val(this.startDate.format(this.locale.format));
        } else {
          this.container.find('input[name="daterangepicker_end"]').val(this.endDate.format(this.locale.format));
        }
      }

      this.updateView();
    },
    formInputsFocused: function formInputsFocused(e) {
      // Highlight the focused input
      this.container.find('input[name="daterangepicker_start"], input[name="daterangepicker_end"]').removeClass('active');
      $(e.target).addClass('active'); // Set the state such that if the user goes back to using a mouse, 
      // the calendars are aware we're selecting the end of the range, not
      // the start. This allows someone to edit the end of a date range without
      // re-selecting the beginning, by clicking on the end date input then
      // using the calendar.

      var isRight = $(e.target).closest('.calendar').hasClass('right');

      if (isRight) {
        this.endDate = null;
        this.setStartDate(this.startDate.clone());
        this.updateView();
      }
    },
    formInputsBlurred: function formInputsBlurred(e) {
      // this function has one purpose right now: if you tab from the first
      // text input to the second in the UI, the endDate is nulled so that
      // you can click another, but if you tab out without clicking anything
      // or changing the input value, the old endDate should be retained
      if (!this.endDate) {
        var val = this.container.find('input[name="daterangepicker_end"]').val();
        var end = moment(val, this.locale.format);

        if (end.isValid()) {
          this.setEndDate(end);
          this.updateView();
        }
      }
    },
    elementChanged: function elementChanged() {
      if (!this.element.is('input')) return;
      if (!this.element.val().length) return;
      if (this.element.val().length < this.locale.format.length) return;
      var dateString = this.element.val().split(this.locale.separator),
          start = null,
          end = null;

      if (dateString.length === 2) {
        start = moment(dateString[0], this.locale.format);
        end = moment(dateString[1], this.locale.format);
      }

      if (this.singleDatePicker || start === null || end === null) {
        start = moment(this.element.val(), this.locale.format);
        end = start;
      }

      if (!start.isValid() || !end.isValid()) return;
      this.setStartDate(start);
      this.setEndDate(end);
      this.updateView();
    },
    keydown: function keydown(e) {
      //hide on tab or enter
      if (e.keyCode === 9 || e.keyCode === 13) {
        this.hide();
      }
    },
    updateElement: function updateElement() {
      if (this.element.is('input') && !this.singleDatePicker && this.autoUpdateInput) {
        this.element.val(this.startDate.format(this.locale.format) + this.locale.separator + this.endDate.format(this.locale.format));
        this.element.trigger('change');
      } else if (this.element.is('input') && this.autoUpdateInput) {
        this.element.val(this.startDate.format(this.locale.format));
        this.element.trigger('change');
      }
    },
    remove: function remove() {
      this.container.remove();
      this.element.off('.daterangepicker');
      this.element.removeData();
    }
  };

  $.fn.daterangepicker = function (options, callback) {
    this.each(function () {
      var el = $(this);
      if (el.data('daterangepicker')) el.data('daterangepicker').remove();
      el.data('daterangepicker', new DateRangePicker(el, options, callback));
    });
    return this;
  };

  return DateRangePicker;
});
},{"jquery":"node_modules/jquery/dist/jquery.js","moment":"node_modules/moment/src/moment.js"}],"C:/Users/TOP/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57702" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["C:/Users/TOP/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","vendor/daterangepicker/daterangepicker.js"], null)
//# sourceMappingURL=/daterangepicker.f671534d.js.map