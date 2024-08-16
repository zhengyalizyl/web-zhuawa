(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["@zyl/components"] = {}, global.React));
})(this, (function (exports, React) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  const Card = ({ className, children }) => {
      return (React__default["default"].createElement("div", { className: `bg-white border border-gray-200 m-2 rounded-sm shadow-md ${className}` }, children));
  };

  const Button = ({ children }) => {
      return (React__default["default"].createElement("button", { className: 'w-16 h-8 mx-4 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 ' }, children));
  };

  exports.Button = Button;
  exports.Card = Card;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
