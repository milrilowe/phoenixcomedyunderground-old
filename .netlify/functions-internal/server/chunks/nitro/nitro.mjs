import nodeCrypto, { createHash } from 'node:crypto';
import http from 'node:http';
import https from 'node:https';
import { EventEmitter } from 'node:events';
import { Buffer as Buffer$1 } from 'node:buffer';
import invariant from 'vinxi/lib/invariant';
import { virtualId, handlerModule, join } from 'vinxi/lib/path';
import { pathToFileURL } from 'node:url';
import { AsyncLocalStorage } from 'node:async_hooks';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { RouterProvider, createRootRoute, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, redirect, Link, useRouter, useMatch, rootRouteId, ErrorComponent, createRouter as createRouter$2 } from '@tanstack/react-router';
import { z } from 'zod';
import * as H$1 from 'react';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { clsx } from 'clsx';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';
import { useForm, FormProvider, Controller, useFormContext, useFormState } from 'react-hook-form';
import * as Gt from '@radix-ui/react-label';
import { Toaster, toast } from 'sonner';
import { Mic2, Tickets, Loader2, Menu, XIcon } from 'lucide-react';
import * as C$1 from '@radix-ui/react-dialog';
import * as ee$1 from '@radix-ui/react-navigation-menu';
import { PassThrough, Readable } from 'node:stream';
import ce$1 from 'react-dom/server';
import { ReadableStream as ReadableStream$1 } from 'node:stream/web';
import { promises, existsSync } from 'node:fs';
import { resolve, dirname, join as join$1 } from 'node:path';

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  const _value = value.trim();
  if (
    // eslint-disable-next-line unicorn/prefer-at
    value[0] === '"' && value.endsWith('"') && !value.includes("\\")
  ) {
    return _value.slice(1, -1);
  }
  if (_value.length <= 9) {
    const _lval = _value.toLowerCase();
    if (_lval === "true") {
      return true;
    }
    if (_lval === "false") {
      return false;
    }
    if (_lval === "undefined") {
      return void 0;
    }
    if (_lval === "null") {
      return null;
    }
    if (_lval === "nan") {
      return Number.NaN;
    }
    if (_lval === "infinity") {
      return Number.POSITIVE_INFINITY;
    }
    if (_lval === "-infinity") {
      return Number.NEGATIVE_INFINITY;
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function decode$1(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodeQueryKey(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = {};
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map((_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/");
  }
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/") ? input : input + "/";
  }
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    return input;
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const trimmed = input.slice(_base.length);
  return trimmed[0] === "/" ? trimmed : "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function getQuery(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return defaultProto ? parseURL(defaultProto + input) : parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

function parse(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = {};
  const opt = {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

const fieldContentRegExp = /^[\u0009\u0020-\u007E\u0080-\u00FF]+$/;
function serialize$1(name, value, options) {
  const opt = options || {};
  const enc = opt.encode || encodeURIComponent;
  if (typeof enc !== "function") {
    throw new TypeError("option encode is invalid");
  }
  if (!fieldContentRegExp.test(name)) {
    throw new TypeError("argument name is invalid");
  }
  const encodedValue = enc(value);
  if (encodedValue && !fieldContentRegExp.test(encodedValue)) {
    throw new TypeError("argument val is invalid");
  }
  let str = name + "=" + encodedValue;
  if (void 0 !== opt.maxAge && opt.maxAge !== null) {
    const maxAge = opt.maxAge - 0;
    if (Number.isNaN(maxAge) || !Number.isFinite(maxAge)) {
      throw new TypeError("option maxAge is invalid");
    }
    str += "; Max-Age=" + Math.floor(maxAge);
  }
  if (opt.domain) {
    if (!fieldContentRegExp.test(opt.domain)) {
      throw new TypeError("option domain is invalid");
    }
    str += "; Domain=" + opt.domain;
  }
  if (opt.path) {
    if (!fieldContentRegExp.test(opt.path)) {
      throw new TypeError("option path is invalid");
    }
    str += "; Path=" + opt.path;
  }
  if (opt.expires) {
    if (!isDate(opt.expires) || Number.isNaN(opt.expires.valueOf())) {
      throw new TypeError("option expires is invalid");
    }
    str += "; Expires=" + opt.expires.toUTCString();
  }
  if (opt.httpOnly) {
    str += "; HttpOnly";
  }
  if (opt.secure) {
    str += "; Secure";
  }
  if (opt.priority) {
    const priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
    switch (priority) {
      case "low": {
        str += "; Priority=Low";
        break;
      }
      case "medium": {
        str += "; Priority=Medium";
        break;
      }
      case "high": {
        str += "; Priority=High";
        break;
      }
      default: {
        throw new TypeError("option priority is invalid");
      }
    }
  }
  if (opt.sameSite) {
    const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
    switch (sameSite) {
      case true: {
        str += "; SameSite=Strict";
        break;
      }
      case "lax": {
        str += "; SameSite=Lax";
        break;
      }
      case "strict": {
        str += "; SameSite=Strict";
        break;
      }
      case "none": {
        str += "; SameSite=None";
        break;
      }
      default: {
        throw new TypeError("option sameSite is invalid");
      }
    }
  }
  if (opt.partitioned) {
    str += "; Partitioned";
  }
  return str;
}
function isDate(val) {
  return Object.prototype.toString.call(val) === "[object Date]" || val instanceof Date;
}

function parseSetCookie(setCookieValue, options) {
  const parts = (setCookieValue || "").split(";").filter((str) => typeof str === "string" && !!str.trim());
  const nameValuePairStr = parts.shift() || "";
  const parsed = _parseNameValuePair(nameValuePairStr);
  const name = parsed.name;
  let value = parsed.value;
  try {
    value = options?.decode === false ? value : (options?.decode || decodeURIComponent)(value);
  } catch {
  }
  const cookie = {
    name,
    value
  };
  for (const part of parts) {
    const sides = part.split("=");
    const partKey = (sides.shift() || "").trimStart().toLowerCase();
    const partValue = sides.join("=");
    switch (partKey) {
      case "expires": {
        cookie.expires = new Date(partValue);
        break;
      }
      case "max-age": {
        cookie.maxAge = Number.parseInt(partValue, 10);
        break;
      }
      case "secure": {
        cookie.secure = true;
        break;
      }
      case "httponly": {
        cookie.httpOnly = true;
        break;
      }
      case "samesite": {
        cookie.sameSite = partValue;
        break;
      }
      default: {
        cookie[partKey] = partValue;
      }
    }
  }
  return cookie;
}
function _parseNameValuePair(nameValuePairStr) {
  let name = "";
  let value = "";
  const nameValueArr = nameValuePairStr.split("=");
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift();
    value = nameValueArr.join("=");
  } else {
    value = nameValuePairStr;
  }
  return { name, value };
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};

function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === void 0) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i;
        node = node.placeholderChildren.find((c) => c.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}

function toRouteMatcher(router) {
  const table = _routerNodeToTable("", router.ctx.rootNode);
  return _createMatcher(table, router.ctx.options.strictTrailingSlash);
}
function _createMatcher(table, strictTrailingSlash) {
  return {
    ctx: { table },
    matchAll: (path) => _matchRoutes(path, table, strictTrailingSlash)
  };
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  };
}
function _matchRoutes(path, table, strictTrailingSlash) {
  if (strictTrailingSlash !== true && path.endsWith("/")) {
    path = path.slice(0, -1) || "/";
  }
  const matches = [];
  for (const [key, value] of _sortRoutesMap(table.wildcard)) {
    if (path === key || path.startsWith(key + "/")) {
      matches.push(value);
    }
  }
  for (const [key, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key + "/")) {
      const subPath = "/" + path.slice(key.length).split("/").splice(2).join("/");
      matches.push(..._matchRoutes(subPath, value));
    }
  }
  const staticMatch = table.static.get(path);
  if (staticMatch) {
    matches.push(staticMatch);
  }
  return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable();
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
        if (node.data) {
          table.static.set(path, node.data);
        }
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace("/**", ""), node.data);
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable("", node);
        if (node.data) {
          subTable.static.set("/", node.data);
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
        return;
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace("//", "/"), child);
    }
  }
  _addNode(initialPath, initialNode);
  return table;
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});

const subtle = nodeCrypto.webcrypto?.subtle || {};
const randomUUID = () => {
  return nodeCrypto.randomUUID();
};
const getRandomValues = (array) => {
  return nodeCrypto.webcrypto.getRandomValues(array);
};
const _crypto = {
  randomUUID,
  getRandomValues,
  subtle
};

// src/utils.ts
var alphabetByEncoding = {};
var alphabetByValue = Array.from({ length: 64 });
for (let i = 0, start = "A".charCodeAt(0), limit = "Z".charCodeAt(0); i + start <= limit; i++) {
  const char = String.fromCharCode(i + start);
  alphabetByEncoding[char] = i;
  alphabetByValue[i] = char;
}
for (let i = 0, start = "a".charCodeAt(0), limit = "z".charCodeAt(0); i + start <= limit; i++) {
  const char = String.fromCharCode(i + start);
  const index = i + 26;
  alphabetByEncoding[char] = index;
  alphabetByValue[index] = char;
}
for (let i = 0; i < 10; i++) {
  alphabetByEncoding[i.toString(10)] = i + 52;
  const char = i.toString(10);
  const index = i + 52;
  alphabetByEncoding[char] = index;
  alphabetByValue[index] = char;
}
alphabetByEncoding["-"] = 62;
alphabetByValue[62] = "-";
alphabetByEncoding["_"] = 63;
alphabetByValue[63] = "_";
var bitsPerLetter = 6;
var bitsPerByte = 8;
var maxLetterValue = 63;
var stringToBuffer = (value) => {
  return new TextEncoder().encode(value);
};
var bufferToString = (value) => {
  return new TextDecoder().decode(value);
};
var base64urlDecode = (_input) => {
  const input = _input + "=".repeat((4 - _input.length % 4) % 4);
  let totalByteLength = input.length / 4 * 3;
  if (input.endsWith("==")) {
    totalByteLength -= 2;
  } else if (input.endsWith("=")) {
    totalByteLength--;
  }
  const out = new ArrayBuffer(totalByteLength);
  const dataView = new DataView(out);
  for (let i = 0; i < input.length; i += 4) {
    let bits = 0;
    let bitLength = 0;
    for (let j = i, limit = i + 3; j <= limit; j++) {
      if (input[j] === "=") {
        bits >>= bitsPerLetter;
      } else {
        if (!(input[j] in alphabetByEncoding)) {
          throw new TypeError(`Invalid character ${input[j]} in base64 string.`);
        }
        bits |= alphabetByEncoding[input[j]] << (limit - j) * bitsPerLetter;
        bitLength += bitsPerLetter;
      }
    }
    const chunkOffset = i / 4 * 3;
    bits >>= bitLength % bitsPerByte;
    const byteLength = Math.floor(bitLength / bitsPerByte);
    for (let k = 0; k < byteLength; k++) {
      const offset = (byteLength - k - 1) * bitsPerByte;
      dataView.setUint8(chunkOffset + k, (bits & 255 << offset) >> offset);
    }
  }
  return new Uint8Array(out);
};
var base64urlEncode = (_input) => {
  const input = typeof _input === "string" ? stringToBuffer(_input) : _input;
  let str = "";
  for (let i = 0; i < input.length; i += 3) {
    let bits = 0;
    let bitLength = 0;
    for (let j = i, limit = Math.min(i + 3, input.length); j < limit; j++) {
      bits |= input[j] << (limit - j - 1) * bitsPerByte;
      bitLength += bitsPerByte;
    }
    const bitClusterCount = Math.ceil(bitLength / bitsPerLetter);
    bits <<= bitClusterCount * bitsPerLetter - bitLength;
    for (let k = 1; k <= bitClusterCount; k++) {
      const offset = (bitClusterCount - k) * bitsPerLetter;
      str += alphabetByValue[(bits & maxLetterValue << offset) >> offset];
    }
  }
  return str;
};

// src/index.ts
var defaults = {
  encryption: { saltBits: 256, algorithm: "aes-256-cbc", iterations: 1, minPasswordlength: 32 },
  integrity: { saltBits: 256, algorithm: "sha256", iterations: 1, minPasswordlength: 32 },
  ttl: 0,
  timestampSkewSec: 60,
  localtimeOffsetMsec: 0
};
var clone = (options) => ({
  ...options,
  encryption: { ...options.encryption },
  integrity: { ...options.integrity }
});
var algorithms = {
  "aes-128-ctr": { keyBits: 128, ivBits: 128, name: "AES-CTR" },
  "aes-256-cbc": { keyBits: 256, ivBits: 128, name: "AES-CBC" },
  sha256: { keyBits: 256, name: "SHA-256" }
};
var macPrefix = "Fe26.2";
var randomBytes = (_crypto, size) => {
  const bytes = new Uint8Array(size);
  _crypto.getRandomValues(bytes);
  return bytes;
};
var randomBits = (_crypto, bits) => {
  if (bits < 1)
    throw new Error("Invalid random bits count");
  const bytes = Math.ceil(bits / 8);
  return randomBytes(_crypto, bytes);
};
var pbkdf2 = async (_crypto, password, salt, iterations, keyLength, hash) => {
  const passwordBuffer = stringToBuffer(password);
  const importedKey = await _crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const saltBuffer = stringToBuffer(salt);
  const params = { name: "PBKDF2", hash, salt: saltBuffer, iterations };
  const derivation = await _crypto.subtle.deriveBits(params, importedKey, keyLength * 8);
  return derivation;
};
var generateKey = async (_crypto, password, options) => {
  var _a;
  if (!(password == null ? void 0 : password.length))
    throw new Error("Empty password");
  if (options == null || typeof options !== "object")
    throw new Error("Bad options");
  if (!(options.algorithm in algorithms))
    throw new Error(`Unknown algorithm: ${options.algorithm}`);
  const algorithm = algorithms[options.algorithm];
  const result = {};
  const hmac = (_a = options.hmac) != null ? _a : false;
  const id = hmac ? { name: "HMAC", hash: algorithm.name } : { name: algorithm.name };
  const usage = hmac ? ["sign", "verify"] : ["encrypt", "decrypt"];
  if (typeof password === "string") {
    if (password.length < options.minPasswordlength)
      throw new Error(
        `Password string too short (min ${options.minPasswordlength} characters required)`
      );
    let { salt = "" } = options;
    if (!salt) {
      const { saltBits = 0 } = options;
      if (!saltBits)
        throw new Error("Missing salt and saltBits options");
      const randomSalt = randomBits(_crypto, saltBits);
      salt = [...new Uint8Array(randomSalt)].map((x) => x.toString(16).padStart(2, "0")).join("");
    }
    const derivedKey = await pbkdf2(
      _crypto,
      password,
      salt,
      options.iterations,
      algorithm.keyBits / 8,
      "SHA-1"
    );
    const importedEncryptionKey = await _crypto.subtle.importKey(
      "raw",
      derivedKey,
      id,
      false,
      usage
    );
    result.key = importedEncryptionKey;
    result.salt = salt;
  } else {
    if (password.length < algorithm.keyBits / 8)
      throw new Error("Key buffer (password) too small");
    result.key = await _crypto.subtle.importKey("raw", password, id, false, usage);
    result.salt = "";
  }
  if (options.iv)
    result.iv = options.iv;
  else if ("ivBits" in algorithm)
    result.iv = randomBits(_crypto, algorithm.ivBits);
  return result;
};
var getEncryptParams = (algorithm, key, data) => {
  return [
    algorithm === "aes-128-ctr" ? { name: "AES-CTR", counter: key.iv, length: 128 } : { name: "AES-CBC", iv: key.iv },
    key.key,
    typeof data === "string" ? stringToBuffer(data) : data
  ];
};
var encrypt = async (_crypto, password, options, data) => {
  const key = await generateKey(_crypto, password, options);
  const encrypted = await _crypto.subtle.encrypt(...getEncryptParams(options.algorithm, key, data));
  return { encrypted: new Uint8Array(encrypted), key };
};
var decrypt = async (_crypto, password, options, data) => {
  const key = await generateKey(_crypto, password, options);
  const decrypted = await _crypto.subtle.decrypt(...getEncryptParams(options.algorithm, key, data));
  return bufferToString(new Uint8Array(decrypted));
};
var hmacWithPassword = async (_crypto, password, options, data) => {
  const key = await generateKey(_crypto, password, { ...options, hmac: true });
  const textBuffer = stringToBuffer(data);
  const signed = await _crypto.subtle.sign({ name: "HMAC" }, key.key, textBuffer);
  const digest = base64urlEncode(new Uint8Array(signed));
  return { digest, salt: key.salt };
};
var normalizePassword = (password) => {
  if (typeof password === "string" || password instanceof Uint8Array)
    return { encryption: password, integrity: password };
  if ("secret" in password)
    return { id: password.id, encryption: password.secret, integrity: password.secret };
  return { id: password.id, encryption: password.encryption, integrity: password.integrity };
};
var seal = async (_crypto, object, password, options) => {
  if (!password)
    throw new Error("Empty password");
  const opts = clone(options);
  const now = Date.now() + (opts.localtimeOffsetMsec || 0);
  const objectString = JSON.stringify(object);
  const pass = normalizePassword(password);
  const { id = "", encryption, integrity } = pass;
  if (id && !/^\w+$/.test(id))
    throw new Error("Invalid password id");
  const { encrypted, key } = await encrypt(_crypto, encryption, opts.encryption, objectString);
  const encryptedB64 = base64urlEncode(new Uint8Array(encrypted));
  const iv = base64urlEncode(key.iv);
  const expiration = opts.ttl ? now + opts.ttl : "";
  const macBaseString = `${macPrefix}*${id}*${key.salt}*${iv}*${encryptedB64}*${expiration}`;
  const mac = await hmacWithPassword(_crypto, integrity, opts.integrity, macBaseString);
  const sealed = `${macBaseString}*${mac.salt}*${mac.digest}`;
  return sealed;
};
var fixedTimeComparison = (a, b) => {
  let mismatch = a.length === b.length ? 0 : 1;
  if (mismatch)
    b = a;
  for (let i = 0; i < a.length; i += 1)
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
};
var unseal = async (_crypto, sealed, password, options) => {
  if (!password)
    throw new Error("Empty password");
  const opts = clone(options);
  const now = Date.now() + (opts.localtimeOffsetMsec || 0);
  const parts = sealed.split("*");
  if (parts.length !== 8)
    throw new Error("Incorrect number of sealed components");
  const prefix = parts[0];
  let passwordId = parts[1];
  const encryptionSalt = parts[2];
  const encryptionIv = parts[3];
  const encryptedB64 = parts[4];
  const expiration = parts[5];
  const hmacSalt = parts[6];
  const hmac = parts[7];
  const macBaseString = `${prefix}*${passwordId}*${encryptionSalt}*${encryptionIv}*${encryptedB64}*${expiration}`;
  if (macPrefix !== prefix)
    throw new Error("Wrong mac prefix");
  if (expiration) {
    if (!/^\d+$/.test(expiration))
      throw new Error("Invalid expiration");
    const exp = Number.parseInt(expiration, 10);
    if (exp <= now - opts.timestampSkewSec * 1e3)
      throw new Error("Expired seal");
  }
  let pass = "";
  passwordId = passwordId || "default";
  if (typeof password === "string" || password instanceof Uint8Array)
    pass = password;
  else if (passwordId in password) {
    pass = password[passwordId];
  } else {
    throw new Error(`Cannot find password: ${passwordId}`);
  }
  pass = normalizePassword(pass);
  const macOptions = opts.integrity;
  macOptions.salt = hmacSalt;
  const mac = await hmacWithPassword(_crypto, pass.integrity, macOptions, macBaseString);
  if (!fixedTimeComparison(mac.digest, hmac))
    throw new Error("Bad hmac value");
  const encrypted = base64urlDecode(encryptedB64);
  const decryptOptions = opts.encryption;
  decryptOptions.salt = encryptionSalt;
  decryptOptions.iv = base64urlDecode(encryptionIv);
  const decrypted = await decrypt(_crypto, pass.encryption, decryptOptions, encrypted);
  if (decrypted)
    return JSON.parse(decrypted);
  return null;
};

function o(n){throw new Error(`${n} is not implemented yet!`)}let i$1 = class i extends EventEmitter{__unenv__={};readableEncoding=null;readableEnded=true;readableFlowing=false;readableHighWaterMark=0;readableLength=0;readableObjectMode=false;readableAborted=false;readableDidRead=false;closed=false;errored=null;readable=false;destroyed=false;static from(e,t){return new i(t)}constructor(e){super();}_read(e){}read(e){}setEncoding(e){return this}pause(){return this}resume(){return this}isPaused(){return  true}unpipe(e){return this}unshift(e,t){}wrap(e){return this}push(e,t){return  false}_destroy(e,t){this.removeAllListeners();}destroy(e){return this.destroyed=true,this._destroy(e),this}pipe(e,t){return {}}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return this.destroy(),Promise.resolve()}async*[Symbol.asyncIterator](){throw o("Readable.asyncIterator")}iterator(e){throw o("Readable.iterator")}map(e,t){throw o("Readable.map")}filter(e,t){throw o("Readable.filter")}forEach(e,t){throw o("Readable.forEach")}reduce(e,t,r){throw o("Readable.reduce")}find(e,t){throw o("Readable.find")}findIndex(e,t){throw o("Readable.findIndex")}some(e,t){throw o("Readable.some")}toArray(e){throw o("Readable.toArray")}every(e,t){throw o("Readable.every")}flatMap(e,t){throw o("Readable.flatMap")}drop(e,t){throw o("Readable.drop")}take(e,t){throw o("Readable.take")}asIndexedPairs(e){throw o("Readable.asIndexedPairs")}};let l$1 = class l extends EventEmitter{__unenv__={};writable=true;writableEnded=false;writableFinished=false;writableHighWaterMark=0;writableLength=0;writableObjectMode=false;writableCorked=0;closed=false;errored=null;writableNeedDrain=false;destroyed=false;_data;_encoding="utf8";constructor(e){super();}pipe(e,t){return {}}_write(e,t,r){if(this.writableEnded){r&&r();return}if(this._data===void 0)this._data=e;else {const s=typeof this._data=="string"?Buffer$1.from(this._data,this._encoding||t||"utf8"):this._data,a=typeof e=="string"?Buffer$1.from(e,t||this._encoding||"utf8"):e;this._data=Buffer$1.concat([s,a]);}this._encoding=t,r&&r();}_writev(e,t){}_destroy(e,t){}_final(e){}write(e,t,r){const s=typeof t=="string"?this._encoding:"utf8",a=typeof t=="function"?t:typeof r=="function"?r:void 0;return this._write(e,s,a),true}setDefaultEncoding(e){return this}end(e,t,r){const s=typeof e=="function"?e:typeof t=="function"?t:typeof r=="function"?r:void 0;if(this.writableEnded)return s&&s(),this;const a=e===s?void 0:e;if(a){const u=t===s?void 0:t;this.write(a,u,s);}return this.writableEnded=true,this.writableFinished=true,this.emit("close"),this.emit("finish"),this}cork(){}uncork(){}destroy(e){return this.destroyed=true,delete this._data,this.removeAllListeners(),this}compose(e,t){throw new Error("Method not implemented.")}};const c=class{allowHalfOpen=true;_destroy;constructor(e=new i$1,t=new l$1){Object.assign(this,e),Object.assign(this,t),this._destroy=g(e._destroy,t._destroy);}};function _(){return Object.assign(c.prototype,i$1.prototype),Object.assign(c.prototype,l$1.prototype),c}function g(...n){return function(...e){for(const t of n)t(...e);}}const m=_();class A extends m{__unenv__={};bufferSize=0;bytesRead=0;bytesWritten=0;connecting=false;destroyed=false;pending=false;localAddress="";localPort=0;remoteAddress="";remoteFamily="";remotePort=0;autoSelectFamilyAttemptedAddresses=[];readyState="readOnly";constructor(e){super();}write(e,t,r){return  false}connect(e,t,r){return this}end(e,t,r){return this}setEncoding(e){return this}pause(){return this}resume(){return this}setTimeout(e,t){return this}setNoDelay(e){return this}setKeepAlive(e,t){return this}address(){return {}}unref(){return this}ref(){return this}destroySoon(){this.destroy();}resetAndDestroy(){const e=new Error("ERR_SOCKET_CLOSED");return e.code="ERR_SOCKET_CLOSED",this.destroy(e),this}}let y$1 = class y extends i$1{aborted=false;httpVersion="1.1";httpVersionMajor=1;httpVersionMinor=1;complete=true;connection;socket;headers={};trailers={};method="GET";url="/";statusCode=200;statusMessage="";closed=false;errored=null;readable=false;constructor(e){super(),this.socket=this.connection=e||new A;}get rawHeaders(){const e=this.headers,t=[];for(const r in e)if(Array.isArray(e[r]))for(const s of e[r])t.push(r,s);else t.push(r,e[r]);return t}get rawTrailers(){return []}setTimeout(e,t){return this}get headersDistinct(){return p(this.headers)}get trailersDistinct(){return p(this.trailers)}};function p(n){const e={};for(const[t,r]of Object.entries(n))t&&(e[t]=(Array.isArray(r)?r:[r]).filter(Boolean));return e}let w$1 = class w extends l$1{statusCode=200;statusMessage="";upgrading=false;chunkedEncoding=false;shouldKeepAlive=false;useChunkedEncodingByDefault=false;sendDate=false;finished=false;headersSent=false;strictContentLength=false;connection=null;socket=null;req;_headers={};constructor(e){super(),this.req=e;}assignSocket(e){e._httpMessage=this,this.socket=e,this.connection=e,this.emit("socket",e),this._flush();}_flush(){this.flushHeaders();}detachSocket(e){}writeContinue(e){}writeHead(e,t,r){e&&(this.statusCode=e),typeof t=="string"&&(this.statusMessage=t,t=void 0);const s=r||t;if(s&&!Array.isArray(s))for(const a in s)this.setHeader(a,s[a]);return this.headersSent=true,this}writeProcessing(){}setTimeout(e,t){return this}appendHeader(e,t){e=e.toLowerCase();const r=this._headers[e],s=[...Array.isArray(r)?r:[r],...Array.isArray(t)?t:[t]].filter(Boolean);return this._headers[e]=s.length>1?s:s[0],this}setHeader(e,t){return this._headers[e.toLowerCase()]=t,this}setHeaders(e){for(const[t,r]of Object.entries(e))this.setHeader(t,r);return this}getHeader(e){return this._headers[e.toLowerCase()]}getHeaders(){return this._headers}getHeaderNames(){return Object.keys(this._headers)}hasHeader(e){return e.toLowerCase()in this._headers}removeHeader(e){delete this._headers[e.toLowerCase()];}addTrailers(e){}flushHeaders(){}writeEarlyHints(e,t){typeof t=="function"&&t();}};const E$1=(()=>{const n=function(){};return n.prototype=Object.create(null),n})();function R$1(n={}){const e=new E$1,t=Array.isArray(n)||H(n)?n:Object.entries(n);for(const[r,s]of t)if(s){if(e[r]===void 0){e[r]=s;continue}e[r]=[...Array.isArray(e[r])?e[r]:[e[r]],...Array.isArray(s)?s:[s]];}return e}function H(n){return typeof n?.entries=="function"}function S(n={}){if(n instanceof Headers)return n;const e=new Headers;for(const[t,r]of Object.entries(n))if(r!==void 0){if(Array.isArray(r)){for(const s of r)e.append(t,String(s));continue}e.set(t,String(r));}return e}const C=new Set([101,204,205,304]);async function b$2(n,e){const t=new y$1,r=new w$1(t);t.url=e.url?.toString()||"/";let s;if(!t.url.startsWith("/")){const d=new URL(t.url);s=d.host,t.url=d.pathname+d.search+d.hash;}t.method=e.method||"GET",t.headers=R$1(e.headers||{}),t.headers.host||(t.headers.host=e.host||s||"localhost"),t.connection.encrypted=t.connection.encrypted||e.protocol==="https",t.body=e.body||null,t.__unenv__=e.context,await n(t,r);let a=r._data;(C.has(r.statusCode)||t.method.toUpperCase()==="HEAD")&&(a=null,delete r._headers["content-length"]);const u={status:r.statusCode,statusText:r.statusMessage,headers:r._headers,body:a};return t.destroy(),r.destroy(),u}async function O$2(n,e,t={}){try{const r=await b$2(n,{url:e,...t});return new Response(r.body,{status:r.status,statusText:r.statusText,headers:S(r.headers)})}catch(r){return new Response(r.toString(),{status:Number.parseInt(r.statusCode||r.code)||500,statusText:r.statusText})}}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

class H3Error extends Error {
  static __h3_error__ = true;
  statusCode = 500;
  fatal = false;
  unhandled = false;
  statusMessage;
  data;
  cause;
  constructor(message, opts = {}) {
    super(message, opts);
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== undefined) {
      obj.data = this.data;
    }
    return obj;
  }
}
function createError$1(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== undefined) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== undefined) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError$1(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, undefined, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError$1({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
const getHeaders = getRequestHeaders;
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const xForwardedHost = event.node.req.headers["x-forwarded-host"];
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}
function toWebRequest(event) {
  return event.web?.request || new Request(getRequestURL(event), {
    // @ts-ignore Undici option
    duplex: "half",
    method: event.method,
    headers: event.headers,
    body: getRequestWebStream(event)
  });
}

const RawBodySymbol = Symbol.for("h3RawBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !String(event.node.req.headers["transfer-encoding"] ?? "").split(",").map((e) => e.trim()).filter(Boolean).includes("chunked")) {
    return Promise.resolve(undefined);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== undefined) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= opts.modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}

function getDistinctCookieKey(name, opts) {
  return [
    name,
    opts.domain || "",
    opts.path || "/",
    Boolean(opts.secure),
    Boolean(opts.httpOnly),
    Boolean(opts.sameSite)
  ].join(";");
}
function setCookie(event, name, value, serializeOptions = {}) {
  if (!serializeOptions.path) {
    serializeOptions = { path: "/", ...serializeOptions };
  }
  const newCookie = serialize$1(name, value, serializeOptions);
  const currentCookies = splitCookiesString(
    event.node.res.getHeader("set-cookie")
  );
  if (currentCookies.length === 0) {
    event.node.res.setHeader("set-cookie", newCookie);
    return;
  }
  const newCookieKey = getDistinctCookieKey(name, serializeOptions);
  event.node.res.removeHeader("set-cookie");
  for (const cookie of currentCookies) {
    const parsed = parseSetCookie(cookie);
    const key = getDistinctCookieKey(parsed.name, parsed);
    if (key === newCookieKey) {
      continue;
    }
    event.node.res.appendHeader("set-cookie", cookie);
  }
  event.node.res.appendHeader("set-cookie", newCookie);
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function getResponseStatus(event) {
  return event.node.res.statusCode;
}
function defaultContentType(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeaders(event) {
  return event.node.res.getHeaders();
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    );
  }
}
const setHeaders = setResponseHeaders;
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "accept-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host",
  "accept"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event);
      duplex = "half";
    } else {
      body = await readRawBody(event, false).catch(() => undefined);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders$1(
    getProxyRequestHeaders(event, { host: target.startsWith("/") }),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  let response;
  try {
    response = await _getFetch(opts.fetch)(target, {
      headers: opts.headers,
      ignoreResponseError: true,
      // make $ofetch.raw transparent
      ...opts.fetchOptions
    });
  } catch (error) {
    throw createError$1({
      status: 502,
      statusMessage: "Bad Gateway",
      cause: error
    });
  }
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== undefined) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event, opts) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name) || name === "host" && opts?.host) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event, {
        host: typeof req === "string" && req.startsWith("/")
      }),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders$1(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    for (const [key, value] of Object.entries(input)) {
      if (value !== undefined) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

const getSessionPromise = Symbol("getSession");
const DEFAULT_NAME = "h3";
const DEFAULT_COOKIE = {
  path: "/",
  secure: true,
  httpOnly: true
};
async function useSession(event, config) {
  const sessionName = config.name || DEFAULT_NAME;
  await getSession(event, config);
  const sessionManager = {
    get id() {
      return event.context.sessions?.[sessionName]?.id;
    },
    get data() {
      return event.context.sessions?.[sessionName]?.data || {};
    },
    update: async (update) => {
      if (!isEvent(event)) {
        throw new Error("[h3] Cannot update read-only session.");
      }
      await updateSession(event, config, update);
      return sessionManager;
    },
    clear: () => {
      if (!isEvent(event)) {
        throw new Error("[h3] Cannot clear read-only session.");
      }
      clearSession(event, config);
      return Promise.resolve(sessionManager);
    }
  };
  return sessionManager;
}
async function getSession(event, config) {
  const sessionName = config.name || DEFAULT_NAME;
  if (!event.context.sessions) {
    event.context.sessions = /* @__PURE__ */ Object.create(null);
  }
  const existingSession = event.context.sessions[sessionName];
  if (existingSession) {
    return existingSession[getSessionPromise] || existingSession;
  }
  const session = {
    id: "",
    createdAt: 0,
    data: /* @__PURE__ */ Object.create(null)
  };
  event.context.sessions[sessionName] = session;
  let sealedSession;
  if (config.sessionHeader !== false) {
    const headerName = typeof config.sessionHeader === "string" ? config.sessionHeader.toLowerCase() : `x-${sessionName.toLowerCase()}-session`;
    const headerValue = _getReqHeader(event, headerName);
    if (typeof headerValue === "string") {
      sealedSession = headerValue;
    }
  }
  if (!sealedSession) {
    const cookieHeader = _getReqHeader(event, "cookie");
    if (cookieHeader) {
      sealedSession = parse(cookieHeader + "")[sessionName];
    }
  }
  if (sealedSession) {
    const promise = unsealSession(event, config, sealedSession).catch(() => {
    }).then((unsealed) => {
      Object.assign(session, unsealed);
      delete event.context.sessions[sessionName][getSessionPromise];
      return session;
    });
    event.context.sessions[sessionName][getSessionPromise] = promise;
    await promise;
  }
  if (!session.id) {
    if (!isEvent(event)) {
      throw new Error(
        "Cannot initialize a new session. Make sure using `useSession(event)` in main handler."
      );
    }
    session.id = config.generateId?.() ?? (config.crypto || _crypto).randomUUID();
    session.createdAt = Date.now();
    await updateSession(event, config);
  }
  return session;
}
function _getReqHeader(event, name) {
  if (event.node) {
    return event.node?.req.headers[name];
  }
  if (event.request) {
    return event.request.headers?.get(name);
  }
  if (event.headers) {
    return event.headers.get(name);
  }
}
async function updateSession(event, config, update) {
  const sessionName = config.name || DEFAULT_NAME;
  const session = event.context.sessions?.[sessionName] || await getSession(event, config);
  if (typeof update === "function") {
    update = update(session.data);
  }
  if (update) {
    Object.assign(session.data, update);
  }
  if (config.cookie !== false) {
    const sealed = await sealSession(event, config);
    setCookie(event, sessionName, sealed, {
      ...DEFAULT_COOKIE,
      expires: config.maxAge ? new Date(session.createdAt + config.maxAge * 1e3) : undefined,
      ...config.cookie
    });
  }
  return session;
}
async function sealSession(event, config) {
  const sessionName = config.name || DEFAULT_NAME;
  const session = event.context.sessions?.[sessionName] || await getSession(event, config);
  const sealed = await seal(config.crypto || _crypto, session, config.password, {
    ...defaults,
    ttl: config.maxAge ? config.maxAge * 1e3 : 0,
    ...config.seal
  });
  return sealed;
}
async function unsealSession(_event, config, sealed) {
  const unsealed = await unseal(
    config.crypto || _crypto,
    sealed,
    config.password,
    {
      ...defaults,
      ttl: config.maxAge ? config.maxAge * 1e3 : 0,
      ...config.seal
    }
  );
  if (config.maxAge) {
    const age = Date.now() - (unsealed.createdAt || Number.NEGATIVE_INFINITY);
    if (age > config.maxAge * 1e3) {
      throw new Error("Session expired!");
    }
  }
  return unsealed;
}
function clearSession(event, config) {
  const sessionName = config.name || DEFAULT_NAME;
  if (event.context.sessions?.[sessionName]) {
    delete event.context.sessions[sessionName];
  }
  setCookie(event, sessionName, "", {
    ...DEFAULT_COOKIE,
    ...config.cookie
  });
  return Promise.resolve();
}

class H3Event {
  "__is_event__" = true;
  // Context
  node;
  // Node
  web;
  // Web
  context = {};
  // Shared
  // Request
  _method;
  _path;
  _headers;
  _requestBody;
  // Response
  _handled = false;
  // Hooks
  _onBeforeResponseCalled;
  _onAfterResponseCalled;
  constructor(req, res) {
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function isEvent(input) {
  return hasProp(input, "__is_event__");
}
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : undefined;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  if (!isEventHandler(input)) {
    console.warn(
      "[h3] Implicit event handler conversion is deprecated. Use `eventHandler()` or `fromNodeMiddleware()` to define event handlers.",
      _route && _route !== "/" ? `
     Route: ${_route}` : "",
      `
     Handler: ${input}`
    );
  }
  return input;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler2 = r.default || r;
        if (typeof handler2 !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler2
          );
        }
        _resolved = { handler: toEventHandler(r.default || r) };
        return _resolved;
      });
    }
    return _promise;
  };
  const handler = eventHandler((event) => {
    if (_resolved) {
      return _resolved.handler(event);
    }
    return resolveHandler().then((r) => r.handler(event));
  });
  handler.__resolve__ = resolveHandler;
  return handler;
}
const lazyEventHandler = defineLazyEventHandler;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const resolve = createResolver(stack);
  handler.__resolve__ = resolve;
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
  const app = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket();
    }
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(normalizeLayer({ ...arg2, handler: arg1 }));
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : undefined;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _reqPath = event._path || event.node.req.url || "/";
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _layerPath;
      const val = await layer.handler(event);
      const _body = val === undefined ? undefined : await val;
      if (_body !== undefined) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true;
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, undefined);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError$1({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true;
      await options.onAfterResponse(event, undefined);
    }
  });
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath;
    for (const layer of stack) {
      if (layer.route === "/" && !layer.handler.__resolve__) {
        continue;
      }
      if (!path.startsWith(layer.route)) {
        continue;
      }
      _layerPath = path.slice(layer.route.length) || "/";
      if (layer.match && !layer.match(_layerPath, undefined)) {
        continue;
      }
      let res = { route: layer.route, handler: layer.handler };
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath);
        if (!_res) {
          continue;
        }
        res = {
          ...res,
          ..._res,
          route: joinURL(res.route || "/", _res.route || "/")
        };
      }
      return res;
    }
  };
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, undefined, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError$1(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, undefined, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError$1({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}
function cachedFn(fn) {
  let cache;
  return () => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || "/";
      const { pathname } = typeof url === "string" ? parseURL(url) : url;
      const resolved = await evResolver(pathname);
      return resolved?.handler?.__websocket__ || {};
    }
  };
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = createRouter$1({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler, undefined, path);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  const matchHandler = (path = "/", method = "get") => {
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      return {
        error: createError$1({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${path || "/"}.`
        })
      };
    }
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      return {
        error: createError$1({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      };
    }
    return { matched, handler };
  };
  const isPreemptive = opts.preemptive || opts.preemtive;
  router.handler = eventHandler((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    );
    if ("error" in match) {
      if (isPreemptive) {
        throw match.error;
      } else {
        return;
      }
    }
    event.context.matchedRoute = match.matched;
    const params = match.matched.params || {};
    event.context.params = params;
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === undefined && isPreemptive) {
        return null;
      }
      return res;
    });
  });
  router.handler.__resolve__ = async (path) => {
    path = withLeadingSlash(path);
    const match = matchHandler(path);
    if ("error" in match) {
      return;
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    };
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path);
      if (!_res) {
        return;
      }
      res = { ...res, ..._res };
    }
    return res;
  };
  return router;
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError$1(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      setResponseStatus(event, error.statusCode, error.statusMessage);
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      if (app.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app.options.onBeforeResponse(event, { body: error });
      }
      await sendError(event, error, !!app.options.debug);
      if (app.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app.options.onAfterResponse(event, { body: error });
      }
    }
  };
  return toNodeHandle;
}

function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
const defaultTask = { run: (function_) => function_() };
const _createTask = () => defaultTask;
const createTask = typeof console.createTask !== "undefined" ? console.createTask : _createTask;
function serialTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return hooks.reduce(
    (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve()
  );
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0);
  }
}

class Hookable {
  constructor() {
    this._hooks = {};
    this._before = void 0;
    this._after = void 0;
    this._deprecatedMessages = void 0;
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let dep;
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name];
      name = dep.to;
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message;
      if (!message) {
        message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set();
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message);
        this._deprecatedMessages.add(message);
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, "name", {
          get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
          configurable: true
        });
      } catch {
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(function_);
    return () => {
      if (function_) {
        this.removeHook(name, function_);
        function_ = void 0;
      }
    };
  }
  hookOnce(name, function_) {
    let _unreg;
    let _function = (...arguments_) => {
      if (typeof _unreg === "function") {
        _unreg();
      }
      _unreg = void 0;
      _function = void 0;
      return function_(...arguments_);
    };
    _unreg = this.hook(name, _function);
    return _unreg;
  }
  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
    const _hooks = this._hooks[name] || [];
    delete this._hooks[name];
    for (const hook of _hooks) {
      this.hook(name, hook);
    }
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name]);
    }
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map(
      (key) => this.hook(key, hooks[key])
    );
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg();
      }
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key];
    }
  }
  callHook(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(serialTaskCaller, name, ...arguments_);
  }
  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(parallelTaskCaller, name, ...arguments_);
  }
  callHookWith(caller, name, ...arguments_) {
    const event = this._before || this._after ? { name, args: arguments_, context: {} } : void 0;
    if (this._before) {
      callEachWith(this._before, event);
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_
    );
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event);
        }
      });
    }
    if (this._after && event) {
      callEachWith(this._after, event);
    }
    return result;
  }
  beforeEach(function_) {
    this._before = this._before || [];
    this._before.push(function_);
    return () => {
      if (this._before !== void 0) {
        const index = this._before.indexOf(function_);
        if (index !== -1) {
          this._before.splice(index, 1);
        }
      }
    };
  }
  afterEach(function_) {
    this._after = this._after || [];
    this._after.push(function_);
    return () => {
      if (this._after !== void 0) {
        const index = this._after.indexOf(function_);
        if (index !== -1) {
          this._after.splice(index, 1);
        }
      }
    };
  }
}
function createHooks() {
  return new Hookable();
}

const s$1=globalThis.Headers,i=globalThis.AbortController,l=globalThis.fetch||(()=>{throw new Error("[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!")});

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        context.options.body = typeof context.options.body === "string" ? context.options.body : JSON.stringify(context.options.body);
        context.options.headers = new Headers(context.options.headers || {});
        if (!context.options.headers.has("content-type")) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return l;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new http.Agent(agentOptions);
  const httpsAgent = new https.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return l(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch$1 = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers$1 = globalThis.Headers || s$1;
const AbortController$1 = globalThis.AbortController || i;
createFetch({ fetch: fetch$1, Headers: Headers$1, AbortController: AbortController$1 });

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$0 = defineNitroErrorHandler(
  function defaultNitroErrorHandler(error, event) {
    const res = defaultHandler(error, event);
    setResponseHeaders(event, res.headers);
    setResponseStatus(event, res.status, res.statusText);
    return send(event, JSON.stringify(res.body, null, 2));
  }
);
function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    console.error(`[request error] ${tags} [${event.method}] ${url}
`, error);
  }
  const headers = {
    "content-type": "application/json",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'none'; frame-ancestors 'none';"
  };
  setResponseStatus(event, statusCode, statusMessage);
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = {
    error: true,
    url: url.href,
    statusCode,
    statusMessage,
    message: isSensitive ? "Server Error" : error.message,
    data: isSensitive ? void 0 : error.data
  };
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}

const errorHandlers = [errorHandler$0];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const appConfig$1 = {"name":"vinxi","routers":[{"name":"public","type":"static","dir":"./public","base":"/","root":"/home/miles/dev/phoenixcomedyunderground","order":0,"outDir":"/home/miles/dev/phoenixcomedyunderground/.vinxi/build/public"},{"name":"client","type":"client","target":"browser","handler":"app/client.tsx","base":"/_build","build":{"sourcemap":true},"root":"/home/miles/dev/phoenixcomedyunderground","outDir":"/home/miles/dev/phoenixcomedyunderground/.vinxi/build/client","order":1},{"name":"ssr","type":"http","target":"server","handler":"app/ssr.tsx","link":{"client":"client"},"root":"/home/miles/dev/phoenixcomedyunderground","base":"/","outDir":"/home/miles/dev/phoenixcomedyunderground/.vinxi/build/ssr","order":2},{"name":"server","type":"http","target":"server","base":"/_server","handler":"node_modules/.pnpm/@tanstack+start-server-functions-handler@1.114.19/node_modules/@tanstack/start-server-functions-handler/dist/esm/index.js","root":"/home/miles/dev/phoenixcomedyunderground","outDir":"/home/miles/dev/phoenixcomedyunderground/.vinxi/build/server","order":3}],"server":{"preset":"netlify","experimental":{"asyncContext":true}},"root":"/home/miles/dev/phoenixcomedyunderground"};
				const buildManifest = {"client":{"/home/miles/dev/phoenixcomedyunderground/app/styles/globals.css":{"file":"assets/globals-R6Jed5kc.css","src":"/home/miles/dev/phoenixcomedyunderground/app/styles/globals.css"},"__vite-browser-external":{"file":"assets/__vite-browser-external-BIHI7g3E.js","name":"__vite-browser-external","src":"__vite-browser-external","isDynamicEntry":true},"_auth-DjyS7IwP.js":{"file":"assets/auth-DjyS7IwP.js","name":"auth","imports":["_client-BmhiFDeO.js"]},"_client-BmhiFDeO.js":{"file":"assets/client-BmhiFDeO.js","name":"client","dynamicImports":["__vite-browser-external","__vite-browser-external","__vite-browser-external","__vite-browser-external","app/routes/login.tsx?tsr-split=component","app/routes/_appLayout.tsx?tsr-split=component","app/routes/_appLayout/index.tsx?tsr-split=component","app/routes/_appLayout/count.tsx?tsr-split=component","app/routes/_appLayout/contact.tsx?tsr-split=component","app/routes/_appLayout/calendar.tsx?tsr-split=component","app/routes/_auth/_dashboardLayout/route.tsx?tsr-split=notFoundComponent","app/routes/_auth/_dashboardLayout/route.tsx?tsr-split=component","app/routes/_auth/_dashboardLayout/dashboard/index.tsx?tsr-split=component"],"assets":["assets/globals-R6Jed5kc.css"]},"_format-DslhuGl8.js":{"file":"assets/format-DslhuGl8.js","name":"format","imports":["_client-BmhiFDeO.js"]},"_mail-xcrE3xLb.js":{"file":"assets/mail-xcrE3xLb.js","name":"mail","imports":["_client-BmhiFDeO.js"]},"_shows-D2QbpRUQ.js":{"file":"assets/shows-D2QbpRUQ.js","name":"shows","imports":["_client-BmhiFDeO.js"]},"app/routes/_appLayout.tsx?tsr-split=component":{"file":"assets/_appLayout-BPDmQTGd.js","name":"_appLayout","src":"app/routes/_appLayout.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-BmhiFDeO.js"]},"app/routes/_appLayout/calendar.tsx?tsr-split=component":{"file":"assets/calendar-CoKk17yr.js","name":"calendar","src":"app/routes/_appLayout/calendar.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-BmhiFDeO.js","_shows-D2QbpRUQ.js","_format-DslhuGl8.js","_auth-DjyS7IwP.js"]},"app/routes/_appLayout/contact.tsx?tsr-split=component":{"file":"assets/contact-Dl424PWO.js","name":"contact","src":"app/routes/_appLayout/contact.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-BmhiFDeO.js","_shows-D2QbpRUQ.js","_mail-xcrE3xLb.js","_auth-DjyS7IwP.js"]},"app/routes/_appLayout/count.tsx?tsr-split=component":{"file":"assets/count-BZr5ADhr.js","name":"count","src":"app/routes/_appLayout/count.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-BmhiFDeO.js"]},"app/routes/_appLayout/index.tsx?tsr-split=component":{"file":"assets/index-CiNoNZJu.js","name":"index","src":"app/routes/_appLayout/index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-BmhiFDeO.js","_shows-D2QbpRUQ.js","_auth-DjyS7IwP.js"]},"app/routes/_auth/_dashboardLayout/dashboard/index.tsx?tsr-split=component":{"file":"assets/index-Bm4NJUQb.js","name":"index","src":"app/routes/_auth/_dashboardLayout/dashboard/index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-BmhiFDeO.js","_shows-D2QbpRUQ.js","_mail-xcrE3xLb.js","_format-DslhuGl8.js","_auth-DjyS7IwP.js"]},"app/routes/_auth/_dashboardLayout/route.tsx?tsr-split=component":{"file":"assets/route-DnImC-NG.js","name":"route","src":"app/routes/_auth/_dashboardLayout/route.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-BmhiFDeO.js"]},"app/routes/_auth/_dashboardLayout/route.tsx?tsr-split=notFoundComponent":{"file":"assets/route-CqRF197y.js","name":"route","src":"app/routes/_auth/_dashboardLayout/route.tsx?tsr-split=notFoundComponent","isDynamicEntry":true,"imports":["_client-BmhiFDeO.js"]},"app/routes/login.tsx?tsr-split=component":{"file":"assets/login-F9aJWoKR.js","name":"login","src":"app/routes/login.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_client-BmhiFDeO.js","_auth-DjyS7IwP.js","_mail-xcrE3xLb.js"]},"virtual:$vinxi/handler/client":{"file":"assets/client-Cd_m-fS0.js","name":"client","src":"virtual:$vinxi/handler/client","isEntry":true,"imports":["_client-BmhiFDeO.js"]}},"ssr":{"/home/miles/dev/phoenixcomedyunderground/app/styles/globals.css":{"file":"assets/globals-R6Jed5kc.css","src":"/home/miles/dev/phoenixcomedyunderground/app/styles/globals.css"},"_badge-Pxp0I6FJ.js":{"file":"assets/badge-Pxp0I6FJ.js","name":"badge","imports":["_ssr-9CPeZ4u_.js"]},"_ssr-9CPeZ4u_.js":{"file":"assets/ssr-9CPeZ4u_.js","name":"ssr","dynamicImports":["app/routes/login.tsx?tsr-split=component","app/routes/_appLayout.tsx?tsr-split=component","app/routes/_appLayout/index.tsx?tsr-split=component","app/routes/_appLayout/count.tsx?tsr-split=component","app/routes/_appLayout/contact.tsx?tsr-split=component","app/routes/_appLayout/calendar.tsx?tsr-split=component","app/routes/_auth/_dashboardLayout/route.tsx?tsr-split=notFoundComponent","app/routes/_auth/_dashboardLayout/route.tsx?tsr-split=component","app/routes/_auth/_dashboardLayout/dashboard/index.tsx?tsr-split=component"],"assets":["assets/globals-R6Jed5kc.css"]},"app/routes/_appLayout.tsx?tsr-split=component":{"file":"assets/_appLayout-DNKpv9Vr.js","name":"_appLayout","src":"app/routes/_appLayout.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_ssr-9CPeZ4u_.js"]},"app/routes/_appLayout/calendar.tsx?tsr-split=component":{"file":"assets/calendar-B0zx9gns.js","name":"calendar","src":"app/routes/_appLayout/calendar.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_ssr-9CPeZ4u_.js","_badge-Pxp0I6FJ.js"]},"app/routes/_appLayout/contact.tsx?tsr-split=component":{"file":"assets/contact-k9-X1edH.js","name":"contact","src":"app/routes/_appLayout/contact.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_ssr-9CPeZ4u_.js","_badge-Pxp0I6FJ.js"]},"app/routes/_appLayout/count.tsx?tsr-split=component":{"file":"assets/count-FezZJ3e8.js","name":"count","src":"app/routes/_appLayout/count.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_ssr-9CPeZ4u_.js"]},"app/routes/_appLayout/index.tsx?tsr-split=component":{"file":"assets/index-B6A_CsGm.js","name":"index","src":"app/routes/_appLayout/index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_ssr-9CPeZ4u_.js","_badge-Pxp0I6FJ.js"]},"app/routes/_auth/_dashboardLayout/dashboard/index.tsx?tsr-split=component":{"file":"assets/index-0FDrAID3.js","name":"index","src":"app/routes/_auth/_dashboardLayout/dashboard/index.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_ssr-9CPeZ4u_.js","_badge-Pxp0I6FJ.js"]},"app/routes/_auth/_dashboardLayout/route.tsx?tsr-split=component":{"file":"assets/route-D9Ftr4P5.js","name":"route","src":"app/routes/_auth/_dashboardLayout/route.tsx?tsr-split=component","isDynamicEntry":true},"app/routes/_auth/_dashboardLayout/route.tsx?tsr-split=notFoundComponent":{"file":"assets/route-CQfTNkRn.js","name":"route","src":"app/routes/_auth/_dashboardLayout/route.tsx?tsr-split=notFoundComponent","isDynamicEntry":true,"imports":["_ssr-9CPeZ4u_.js"]},"app/routes/login.tsx?tsr-split=component":{"file":"assets/login-CmTiAKNH.js","name":"login","src":"app/routes/login.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_ssr-9CPeZ4u_.js"]},"virtual:$vinxi/handler/ssr":{"file":"ssr.js","name":"ssr","src":"virtual:$vinxi/handler/ssr","isEntry":true,"imports":["_ssr-9CPeZ4u_.js"]}},"server":{"_db-CI39mWbQ.js":{"file":"assets/db-CI39mWbQ.js","name":"db"},"_index-Dgdn61fk.js":{"file":"assets/index-Dgdn61fk.js","name":"index","imports":["_server-DqGM2QXz.js"]},"_server-DqGM2QXz.js":{"file":"assets/server-DqGM2QXz.js","name":"server","dynamicImports":["app/routes/_appLayout/count.tsx?tsr-directive-use-server=","app/lib/actions/auth.ts?tsr-directive-use-server=","app/lib/actions/auth.ts?tsr-directive-use-server=","app/lib/actions/auth.ts?tsr-directive-use-server=","app/lib/actions/auth.ts?tsr-directive-use-server=","app/routes/_appLayout/count.tsx?tsr-split=component&tsr-directive-use-server=","app/lib/actions/subscribers.ts?tsr-directive-use-server=","app/lib/actions/subscribers.ts?tsr-directive-use-server=","app/lib/actions/subscribers.ts?tsr-directive-use-server=","app/lib/actions/subscribers.ts?tsr-directive-use-server=","app/lib/actions/messages.ts?tsr-directive-use-server=","app/lib/actions/messages.ts?tsr-directive-use-server=","app/lib/actions/messages.ts?tsr-directive-use-server=","app/lib/actions/messages.ts?tsr-directive-use-server=","app/lib/actions/messages.ts?tsr-directive-use-server=","app/lib/actions/shows.ts?tsr-directive-use-server=","app/lib/actions/shows.ts?tsr-directive-use-server=","app/lib/actions/shows.ts?tsr-directive-use-server=","app/lib/actions/shows.ts?tsr-directive-use-server=","app/lib/actions/shows.ts?tsr-directive-use-server=","app/lib/actions/shows.ts?tsr-directive-use-server=","app/lib/actions/shows.ts?tsr-directive-use-server=","app/lib/actions/shows.ts?tsr-directive-use-server=","app/lib/actions/shows.ts?tsr-directive-use-server=","app/lib/actions/shows.ts?tsr-directive-use-server=","app/lib/actions/shows.ts?tsr-directive-use-server=","app/lib/actions/shows.ts?tsr-directive-use-server=","app/lib/actions/shows.ts?tsr-directive-use-server="]},"app/lib/actions/auth.ts?tsr-directive-use-server=":{"file":"assets/auth-C7epj-Rz.js","name":"auth","src":"app/lib/actions/auth.ts?tsr-directive-use-server=","isDynamicEntry":true,"imports":["_db-CI39mWbQ.js","_server-DqGM2QXz.js","_index-Dgdn61fk.js"]},"app/lib/actions/messages.ts?tsr-directive-use-server=":{"file":"assets/messages-BIgFLbJ2.js","name":"messages","src":"app/lib/actions/messages.ts?tsr-directive-use-server=","isDynamicEntry":true,"imports":["_db-CI39mWbQ.js","_index-Dgdn61fk.js","_server-DqGM2QXz.js"]},"app/lib/actions/shows.ts?tsr-directive-use-server=":{"file":"assets/shows-D9Pq4lVZ.js","name":"shows","src":"app/lib/actions/shows.ts?tsr-directive-use-server=","isDynamicEntry":true,"imports":["_db-CI39mWbQ.js","_index-Dgdn61fk.js","_server-DqGM2QXz.js"]},"app/lib/actions/subscribers.ts?tsr-directive-use-server=":{"file":"assets/subscribers-BJjaDedf.js","name":"subscribers","src":"app/lib/actions/subscribers.ts?tsr-directive-use-server=","isDynamicEntry":true,"imports":["_db-CI39mWbQ.js","_index-Dgdn61fk.js","_server-DqGM2QXz.js"]},"app/routes/_appLayout/count.tsx?tsr-directive-use-server=":{"file":"assets/count-CnTyFnEe.js","name":"count","src":"app/routes/_appLayout/count.tsx?tsr-directive-use-server=","isDynamicEntry":true,"imports":["_index-Dgdn61fk.js","_server-DqGM2QXz.js"],"dynamicImports":["app/routes/_appLayout/count.tsx?tsr-split=component"]},"app/routes/_appLayout/count.tsx?tsr-split=component":{"file":"assets/count-B6-mIa2Y.js","name":"count","src":"app/routes/_appLayout/count.tsx?tsr-split=component","isDynamicEntry":true,"imports":["_index-Dgdn61fk.js","_server-DqGM2QXz.js"]},"app/routes/_appLayout/count.tsx?tsr-split=component&tsr-directive-use-server=":{"file":"assets/count-jYHOqfQe.js","name":"count","src":"app/routes/_appLayout/count.tsx?tsr-split=component&tsr-directive-use-server=","isDynamicEntry":true,"imports":["_index-Dgdn61fk.js","_server-DqGM2QXz.js"]},"virtual:$vinxi/handler/server":{"file":"server.js","name":"server","src":"virtual:$vinxi/handler/server","isEntry":true,"imports":["_server-DqGM2QXz.js"]}}};

				const routeManifest = {};

        function createProdApp(appConfig) {
          return {
            config: { ...appConfig, buildManifest, routeManifest },
            getRouter(name) {
              return appConfig.routers.find(router => router.name === name)
            }
          }
        }

        function plugin$2(app) {
          const prodApp = createProdApp(appConfig$1);
          globalThis.app = prodApp;
        }

function plugin$1(app) {
	globalThis.$handle = (event) => app.h3App.handler(event);
}

/**
 * Traverses the module graph and collects assets for a given chunk
 *
 * @param {any} manifest Client manifest
 * @param {string} id Chunk id
 * @param {Map<string, string[]>} assetMap Cache of assets
 * @param {string[]} stack Stack of chunk ids to prevent circular dependencies
 * @returns Array of asset URLs
 */
function findAssetsInViteManifest(manifest, id, assetMap = new Map(), stack = []) {
	if (stack.includes(id)) {
		return [];
	}

	const cached = assetMap.get(id);
	if (cached) {
		return cached;
	}
	const chunk = manifest[id];
	if (!chunk) {
		return [];
	}

	const assets = [
		...(chunk.assets?.filter(Boolean) || []),
		...(chunk.css?.filter(Boolean) || [])
	];
	if (chunk.imports) {
		stack.push(id);
		for (let i = 0, l = chunk.imports.length; i < l; i++) {
			assets.push(...findAssetsInViteManifest(manifest, chunk.imports[i], assetMap, stack));
		}
		stack.pop();
	}
	assets.push(chunk.file);
	const all = Array.from(new Set(assets));
	assetMap.set(id, all);

	return all;
}

/** @typedef {import("../app.js").App & { config: { buildManifest: { [key:string]: any } }}} ProdApp */

function createHtmlTagsForAssets(router, app, assets) {
	return assets
		.filter(
			(asset) =>
				asset.endsWith(".css") ||
				asset.endsWith(".js") ||
				asset.endsWith(".mjs"),
		)
		.map((asset) => ({
			tag: "link",
			attrs: {
				href: joinURL(app.config.server.baseURL ?? "/", router.base, asset),
				key: join(app.config.server.baseURL ?? "", router.base, asset),
				...(asset.endsWith(".css")
					? { rel: "stylesheet", fetchPriority: "high" }
					: { rel: "modulepreload" }),
			},
		}));
}

/**
 *
 * @param {ProdApp} app
 * @returns
 */
function createProdManifest(app) {
	const manifest = new Proxy(
		{},
		{
			get(target, routerName) {
				invariant(typeof routerName === "string", "Bundler name expected");
				const router = app.getRouter(routerName);
				const bundlerManifest = app.config.buildManifest[routerName];

				invariant(
					router.type !== "static",
					"manifest not available for static router",
				);
				return {
					handler: router.handler,
					async assets() {
						/** @type {{ [key: string]: string[] }} */
						let assets = {};
						assets[router.handler] = await this.inputs[router.handler].assets();
						for (const route of (await router.internals.routes?.getRoutes()) ??
							[]) {
							assets[route.filePath] = await this.inputs[
								route.filePath
							].assets();
						}
						return assets;
					},
					async routes() {
						return (await router.internals.routes?.getRoutes()) ?? [];
					},
					async json() {
						/** @type {{ [key: string]: { output: string; assets: string[]} }} */
						let json = {};
						for (const input of Object.keys(this.inputs)) {
							json[input] = {
								output: this.inputs[input].output.path,
								assets: await this.inputs[input].assets(),
							};
						}
						return json;
					},
					chunks: new Proxy(
						{},
						{
							get(target, chunk) {
								invariant(typeof chunk === "string", "Chunk expected");
								const chunkPath = join(
									router.outDir,
									router.base,
									chunk + ".mjs",
								);
								return {
									import() {
										if (globalThis.$$chunks[chunk + ".mjs"]) {
											return globalThis.$$chunks[chunk + ".mjs"];
										}
										return import(
											/* @vite-ignore */ pathToFileURL(chunkPath).href
										);
									},
									output: {
										path: chunkPath,
									},
								};
							},
						},
					),
					inputs: new Proxy(
						{},
						{
							ownKeys(target) {
								const keys = Object.keys(bundlerManifest)
									.filter((id) => bundlerManifest[id].isEntry)
									.map((id) => id);
								return keys;
							},
							getOwnPropertyDescriptor(k) {
								return {
									enumerable: true,
									configurable: true,
								};
							},
							get(target, input) {
								invariant(typeof input === "string", "Input expected");
								if (router.target === "server") {
									const id =
										input === router.handler
											? virtualId(handlerModule(router))
											: input;
									return {
										assets() {
											return createHtmlTagsForAssets(
												router,
												app,
												findAssetsInViteManifest(bundlerManifest, id),
											);
										},
										output: {
											path: join(
												router.outDir,
												router.base,
												bundlerManifest[id].file,
											),
										},
									};
								} else if (router.target === "browser") {
									const id =
										input === router.handler && !input.endsWith(".html")
											? virtualId(handlerModule(router))
											: input;
									return {
										import() {
											return import(
												/* @vite-ignore */ joinURL(
													app.config.server.baseURL ?? "",
													router.base,
													bundlerManifest[id].file,
												)
											);
										},
										assets() {
											return createHtmlTagsForAssets(
												router,
												app,
												findAssetsInViteManifest(bundlerManifest, id),
											);
										},
										output: {
											path: joinURL(
												app.config.server.baseURL ?? "",
												router.base,
												bundlerManifest[id].file,
											),
										},
									};
								}
							},
						},
					),
				};
			},
		},
	);

	return manifest;
}

function plugin() {
	globalThis.MANIFEST =
		createProdManifest(globalThis.app)
			;
}

const chunks = {};
			 



			 function app() {
				 globalThis.$$chunks = chunks;
			 }

const plugins = [
  plugin$2,
plugin$1,
plugin,
app
];

function w(e) {
  if (!E(e)) return false;
  const r = e.constructor;
  if (typeof r > "u") return true;
  const t = r.prototype;
  return !(!E(t) || !t.hasOwnProperty("isPrototypeOf"));
}
function E(e) {
  return Object.prototype.toString.call(e) === "[object Object]";
}
function T$1(e) {
  return !!(e == null ? void 0 : e.isRedirect);
}
function O$1(e) {
  return !!(e == null ? void 0 : e.isNotFound);
}
var V = "Invariant failed";
function G(e, r) {
  if (!e) throw new Error(V);
}
const u = { stringify: (e) => JSON.stringify(e, function(t, n) {
  const o = this[t], i = v.find((s) => s.stringifyCondition(o));
  return i ? i.stringify(o) : n;
}), parse: (e) => JSON.parse(e, function(t, n) {
  const o = this[t];
  if (w(o)) {
    const i = v.find((s) => s.parseCondition(o));
    if (i) return i.parse(o);
  }
  return n;
}), encode: (e) => {
  if (Array.isArray(e)) return e.map((t) => u.encode(t));
  if (w(e)) return Object.fromEntries(Object.entries(e).map(([t, n]) => [t, u.encode(n)]));
  const r = v.find((t) => t.stringifyCondition(e));
  return r ? r.stringify(e) : e;
}, decode: (e) => {
  if (w(e)) {
    const r = v.find((t) => t.parseCondition(e));
    if (r) return r.parse(e);
  }
  return Array.isArray(e) ? e.map((r) => u.decode(r)) : w(e) ? Object.fromEntries(Object.entries(e).map(([r, t]) => [r, u.decode(t)])) : e;
} }, d = (e, r, t, n) => ({ key: e, stringifyCondition: r, stringify: (o) => ({ [`$${e}`]: t(o) }), parseCondition: (o) => Object.hasOwn(o, `$${e}`), parse: (o) => n(o[`$${e}`]) }), v = [d("undefined", (e) => e === void 0, () => 0, () => {
}), d("date", (e) => e instanceof Date, (e) => e.toISOString(), (e) => new Date(e)), d("error", (e) => e instanceof Error, (e) => ({ ...e, message: e.message, stack: void 0, cause: e.cause }), (e) => Object.assign(new Error(e.message), e)), d("formData", (e) => e instanceof FormData, (e) => {
  const r = {};
  return e.forEach((t, n) => {
    const o = r[n];
    o !== void 0 ? Array.isArray(o) ? o.push(t) : r[n] = [o, t] : r[n] = t;
  }), r;
}, (e) => {
  const r = new FormData();
  return Object.entries(e).forEach(([t, n]) => {
    Array.isArray(n) ? n.forEach((o) => r.append(t, o)) : r.append(t, n);
  }), r;
}), d("bigint", (e) => typeof e == "bigint", (e) => e.toString(), (e) => BigInt(e))];
function Q$1(e = {}) {
  let r, t = false;
  const n = (s) => {
    if (r && r !== s) throw new Error("Context conflict");
  };
  let o;
  if (e.asyncContext) {
    const s = e.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    s ? o = new s() : console.warn("[unctx] `AsyncLocalStorage` is not provided.");
  }
  const i = () => {
    if (o) {
      const s = o.getStore();
      if (s !== void 0) return s;
    }
    return r;
  };
  return { use: () => {
    const s = i();
    if (s === void 0) throw new Error("Context is not available");
    return s;
  }, tryUse: () => i(), set: (s, c) => {
    c || n(s), r = s, t = true;
  }, unset: () => {
    r = void 0, t = false;
  }, call: (s, c) => {
    n(s), r = s;
    try {
      return o ? o.run(s, c) : c();
    } finally {
      t || (r = void 0);
    }
  }, async callAsync(s, c) {
    r = s;
    const h = () => {
      r = s;
    }, _ = () => r === s ? h : void 0;
    P.add(_);
    try {
      const p = o ? o.run(s, c) : c();
      return t || (r = void 0), await p;
    } finally {
      P.delete(_);
    }
  } };
}
function X$1(e = {}) {
  const r = {};
  return { get(t, n = {}) {
    return r[t] || (r[t] = Q$1({ ...e, ...n })), r[t];
  } };
}
const y = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof global < "u" ? global : {}, M = "__unctx__", Y$1 = y[M] || (y[M] = X$1()), Z$1 = (e, r = {}) => Y$1.get(e, r), L = "__unctx_async_handlers__", P = y[L] || (y[L] = /* @__PURE__ */ new Set());
function k$1(e) {
  let r;
  const t = j(e), n = { duplex: "half", method: e.method, headers: e.headers };
  return e.node.req.body instanceof ArrayBuffer ? new Request(t, { ...n, body: e.node.req.body }) : new Request(t, { ...n, get body() {
    return r || (r = oe(e), r);
  } });
}
function ee(e) {
  var _a;
  return (_a = e.web) != null ? _a : e.web = { request: k$1(e), url: j(e) }, e.web.request;
}
function re() {
  return D$1();
}
const $ = Symbol("$HTTPEvent");
function te$1(e) {
  return typeof e == "object" && (e instanceof H3Event || (e == null ? void 0 : e[$]) instanceof H3Event || (e == null ? void 0 : e.__is_event__) === true);
}
function F$1(e) {
  return function(...r) {
    var t;
    const n = r[0];
    if (te$1(n)) r[0] = n instanceof H3Event || n.__is_event__ ? n : n[$];
    else {
      if (!((t = globalThis.app.config.server.experimental) != null && t.asyncContext)) throw new Error("AsyncLocalStorage was not enabled. Use the `server.experimental.asyncContext: true` option in your app configuration to enable it. Or, pass the instance of HTTPEvent that you have as the first argument to the function.");
      r.unshift(re());
    }
    return e(...r);
  };
}
const j = F$1(getRequestURL), ne = F$1(getResponseStatus), pe = F$1(useSession), oe = F$1(getRequestWebStream);
function se() {
  var e;
  return Z$1("nitro-app", { asyncContext: !!((e = globalThis.app.config.server.experimental) != null && e.asyncContext), AsyncLocalStorage: AsyncLocalStorage });
}
function D$1() {
  const e = se().use().event;
  if (!e) throw new Error("No HTTPEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.");
  return e;
}
const ae = { "app_routes_appLayout_count_tsx--getCount_createServerFn_handler": { functionName: "getCount_createServerFn_handler", importer: () => import('../build/count-CnTyFnEe.mjs') }, "app_lib_actions_auth_ts--login_createServerFn_handler": { functionName: "login_createServerFn_handler", importer: () => import('../build/auth-C7epj-Rz.mjs') }, "app_lib_actions_auth_ts--register_createServerFn_handler": { functionName: "register_createServerFn_handler", importer: () => import('../build/auth-C7epj-Rz.mjs') }, "app_lib_actions_auth_ts--logout_createServerFn_handler": { functionName: "logout_createServerFn_handler", importer: () => import('../build/auth-C7epj-Rz.mjs') }, "app_lib_actions_auth_ts--getCurrentUser_createServerFn_handler": { functionName: "getCurrentUser_createServerFn_handler", importer: () => import('../build/auth-C7epj-Rz.mjs') }, "app_routes_appLayout_count_tsx--updateCount_createServerFn_handler": { functionName: "updateCount_createServerFn_handler", importer: () => import('../build/count-jYHOqfQe.mjs') }, "app_lib_actions_subscribers_ts--fetchSubscribers_createServerFn_handler": { functionName: "fetchSubscribers_createServerFn_handler", importer: () => import('../build/subscribers-BJjaDedf.mjs') }, "app_lib_actions_subscribers_ts--subscribe_createServerFn_handler": { functionName: "subscribe_createServerFn_handler", importer: () => import('../build/subscribers-BJjaDedf.mjs') }, "app_lib_actions_subscribers_ts--unsubscribe_createServerFn_handler": { functionName: "unsubscribe_createServerFn_handler", importer: () => import('../build/subscribers-BJjaDedf.mjs') }, "app_lib_actions_subscribers_ts--deleteSubscriber_createServerFn_handler": { functionName: "deleteSubscriber_createServerFn_handler", importer: () => import('../build/subscribers-BJjaDedf.mjs') }, "app_lib_actions_messages_ts--sendMessage_createServerFn_handler": { functionName: "sendMessage_createServerFn_handler", importer: () => import('../build/messages-BIgFLbJ2.mjs') }, "app_lib_actions_messages_ts--getMessages_createServerFn_handler": { functionName: "getMessages_createServerFn_handler", importer: () => import('../build/messages-BIgFLbJ2.mjs') }, "app_lib_actions_messages_ts--getMessage_createServerFn_handler": { functionName: "getMessage_createServerFn_handler", importer: () => import('../build/messages-BIgFLbJ2.mjs') }, "app_lib_actions_messages_ts--markMessageAsRead_createServerFn_handler": { functionName: "markMessageAsRead_createServerFn_handler", importer: () => import('../build/messages-BIgFLbJ2.mjs') }, "app_lib_actions_messages_ts--deleteMessage_createServerFn_handler": { functionName: "deleteMessage_createServerFn_handler", importer: () => import('../build/messages-BIgFLbJ2.mjs') }, "app_lib_actions_shows_ts--fetchShows_createServerFn_handler": { functionName: "fetchShows_createServerFn_handler", importer: () => import('../build/shows-D9Pq4lVZ.mjs') }, "app_lib_actions_shows_ts--fetchAllShowsAdmin_createServerFn_handler": { functionName: "fetchAllShowsAdmin_createServerFn_handler", importer: () => import('../build/shows-D9Pq4lVZ.mjs') }, "app_lib_actions_shows_ts--fetchUpcomingShows_createServerFn_handler": { functionName: "fetchUpcomingShows_createServerFn_handler", importer: () => import('../build/shows-D9Pq4lVZ.mjs') }, "app_lib_actions_shows_ts--fetchFeaturedShows_createServerFn_handler": { functionName: "fetchFeaturedShows_createServerFn_handler", importer: () => import('../build/shows-D9Pq4lVZ.mjs') }, "app_lib_actions_shows_ts--fetchPastShows_createServerFn_handler": { functionName: "fetchPastShows_createServerFn_handler", importer: () => import('../build/shows-D9Pq4lVZ.mjs') }, "app_lib_actions_shows_ts--fetchShow_createServerFn_handler": { functionName: "fetchShow_createServerFn_handler", importer: () => import('../build/shows-D9Pq4lVZ.mjs') }, "app_lib_actions_shows_ts--createShow_createServerFn_handler": { functionName: "createShow_createServerFn_handler", importer: () => import('../build/shows-D9Pq4lVZ.mjs') }, "app_lib_actions_shows_ts--updateShow_createServerFn_handler": { functionName: "updateShow_createServerFn_handler", importer: () => import('../build/shows-D9Pq4lVZ.mjs') }, "app_lib_actions_shows_ts--deleteShow_createServerFn_handler": { functionName: "deleteShow_createServerFn_handler", importer: () => import('../build/shows-D9Pq4lVZ.mjs') }, "app_lib_actions_shows_ts--updateShowStatus_createServerFn_handler": { functionName: "updateShowStatus_createServerFn_handler", importer: () => import('../build/shows-D9Pq4lVZ.mjs') }, "app_lib_actions_shows_ts--toggleShowFeatured_createServerFn_handler": { functionName: "toggleShowFeatured_createServerFn_handler", importer: () => import('../build/shows-D9Pq4lVZ.mjs') }, "app_lib_actions_shows_ts--toggleShowPublished_createServerFn_handler": { functionName: "toggleShowPublished_createServerFn_handler", importer: () => import('../build/shows-D9Pq4lVZ.mjs') }, "app_lib_actions_shows_ts--updateShowSoldTickets_createServerFn_handler": { functionName: "updateShowSoldTickets_createServerFn_handler", importer: () => import('../build/shows-D9Pq4lVZ.mjs') } }, fe$1 = eventHandler(ie), b$1 = ae;
async function ie(e) {
  const r = ee(e);
  return await _e$1({ request: r, event: e });
}
function ce(e) {
  return e.replace(/^\/|\/$/g, "");
}
async function _e$1({ request: e, event: r }) {
  const t = new AbortController(), n = t.signal, o = () => t.abort();
  r.node.req.on("close", o);
  const i = e.method, s = new URL(e.url, "http://localhost:3000"), c = new RegExp(`${ce("/_server")}/([^/?#]+)`), h = s.pathname.match(c), _ = h ? h[1] : null, p = Object.fromEntries(s.searchParams.entries()), N = "createServerFn" in p, H = "raw" in p;
  if (typeof _ != "string") throw new Error("Invalid server action param for serverFnId: " + _);
  const C = b$1[_];
  if (!C) throw console.log("serverFnManifest", b$1), new Error("Server function info not found for " + _);
  let m;
  if (m = await C.importer(), !m) throw console.log("serverFnManifest", b$1), new Error("Server function module not resolved for " + _);
  const f = m[C.functionName];
  if (!f) throw console.log("serverFnManifest", b$1), console.log("fnModule", m), new Error(`Server function module export not resolved for serverFn ID: ${_}`);
  const I = ["multipart/form-data", "application/x-www-form-urlencoded"], S = await (async () => {
    try {
      let a = await (async () => {
        if (e.headers.get("Content-Type") && I.some((l) => {
          var A;
          return (A = e.headers.get("Content-Type")) == null ? void 0 : A.includes(l);
        })) return G(i.toLowerCase() !== "get", "GET requests with FormData payloads are not supported"), await f(await e.formData(), n);
        if (i.toLowerCase() === "get") {
          let l = p;
          return N && (l = p.payload), l = l && u.parse(l), await f(l, n);
        }
        const g = await e.text(), R = u.parse(g);
        return N ? await f(R, n) : await f(...R, n);
      })();
      return a.result instanceof Response ? a.result : !N && (a = a.result, a instanceof Response) ? a : T$1(a) || O$1(a) ? q$1(a) : new Response(a !== void 0 ? u.stringify(a) : void 0, { status: ne(D$1()), headers: { "Content-Type": "application/json" } });
    } catch (a) {
      return a instanceof Response ? a : T$1(a) || O$1(a) ? q$1(a) : (console.info(), console.info("Server Fn Error!"), console.info(), console.error(a), console.info(), new Response(u.stringify(a), { status: 500, headers: { "Content-Type": "application/json" } }));
    }
  })();
  if (r.node.req.removeListener("close", o), H) return S;
  if (S.headers.get("Content-Type") === "application/json") {
    const g = await S.clone().text();
    g && JSON.stringify(JSON.parse(g));
  }
  return S;
}
function q$1(e) {
  const { headers: r, ...t } = e;
  return new Response(JSON.stringify(t), { status: 200, headers: { "Content-Type": "application/json", ...r || {} } });
}

function Fe(e) {
  return jsx(RouterProvider, { router: e.router });
}
var nr = " daum[ /]| deusu/| yadirectfetcher|(?:^|[^g])news(?!sapphire)|(?<! (?:channel/|google/))google(?!(app|/google| pixel))|(?<! cu)bots?(?:\\b|_)|(?<!(?:lib))http|(?<![hg]m)score|@[a-z][\\w-]+\\.|\\(\\)|\\.com\\b|\\btime/|\\||^<|^[\\w \\.\\-\\(?:\\):%]+(?:/v?\\d+(?:\\.\\d+)?(?:\\.\\d{1,10})*?)?(?:,|$)|^[^ ]{50,}$|^\\d+\\b|^\\w*search\\b|^\\w+/[\\w\\(\\)]*$|^active|^ad muncher|^amaya|^avsdevicesdk/|^biglotron|^bot|^bw/|^clamav[ /]|^client/|^cobweb/|^custom|^ddg[_-]android|^discourse|^dispatch/\\d|^downcast/|^duckduckgo|^email|^facebook|^getright/|^gozilla/|^hobbit|^hotzonu|^hwcdn/|^igetter/|^jeode/|^jetty/|^jigsaw|^microsoft bits|^movabletype|^mozilla/5\\.0\\s[a-z\\.-]+$|^mozilla/\\d\\.\\d \\(compatible;?\\)$|^mozilla/\\d\\.\\d \\w*$|^navermailapp|^netsurf|^offline|^openai/|^owler|^php|^postman|^python|^rank|^read|^reed|^rest|^rss|^snapchat|^space bison|^svn|^swcd |^taringa|^thumbor/|^track|^w3c|^webbandit/|^webcopier|^wget|^whatsapp|^wordpress|^xenu link sleuth|^yahoo|^yandex|^zdm/\\d|^zoom marketplace/|^{{.*}}$|adscanner/|analyzer|archive|ask jeeves/teoma|audit|bit\\.ly/|bluecoat drtr|browsex|burpcollaborator|capture|catch|check\\b|checker|chrome-lighthouse|chromeframe|classifier|cloudflare|convertify|cookiehubscan|crawl|cypress/|dareboost|datanyze|dejaclick|detect|dmbrowser|download|evc-batch/|exaleadcloudview|feed|firephp|functionize|gomezagent|headless|httrack|hubspot marketing grader|hydra|ibisbrowser|images|infrawatch|insight|inspect|iplabel|ips-agent|java(?!;)|jsjcw_scanner|library|linkcheck|mail\\.ru/|manager|measure|neustar wpm|node|nutch|offbyone|optimize|pageburst|pagespeed|parser|perl|phantomjs|pingdom|powermarks|preview|proxy|ptst[ /]\\d|reputation|resolver|retriever|rexx;|rigor|rss\\b|scanner\\.|scrape|server|sogou|sparkler/|speedcurve|spider|splash|statuscake|supercleaner|synapse|synthetic|tools|torrent|trace|transcoder|url|validator|virtuoso|wappalyzer|webglance|webkit2png|whatcms/|zgrab", ar = /bot|crawl|http|lighthouse|scan|search|spider/i, X;
function or() {
  if (X instanceof RegExp) return X;
  try {
    X = new RegExp(nr, "i");
  } catch {
    X = ar;
  }
  return X;
}
function ke(e) {
  return !!e && or().test(e);
}
function sr(e) {
  return e instanceof Error ? { name: e.name, message: e.message } : { data: e };
}
const O = Symbol.for("TSR_DEFERRED_PROMISE");
function ir(e, r) {
  const t = e;
  return t[O] || (t[O] = { status: "pending" }, t.then((n) => {
    t[O].status = "success", t[O].data = n;
  }).catch((n) => {
    t[O].status = "error", t[O].error = { data: sr(n), __isServerError: true };
  })), t;
}
function cr(e, r) {
  return r.reduce((t, n) => (t[n] = e[n], t), {});
}
function D(e) {
  if (!je(e)) return false;
  const r = e.constructor;
  if (typeof r > "u") return true;
  const t = r.prototype;
  return !(!je(t) || !t.hasOwnProperty("isPrototypeOf"));
}
function je(e) {
  return Object.prototype.toString.call(e) === "[object Object]";
}
function lr(e) {
  return Array.isArray(e) && e.length === Object.keys(e).length;
}
function dr(e) {
  let r, t;
  const n = new Promise((a, s) => {
    r = a, t = s;
  });
  return n.status = "pending", n.resolve = (a) => {
    n.status = "resolved", n.value = a, r(a);
  }, n.reject = (a) => {
    n.status = "rejected", t(a);
  }, n;
}
function ur(e, r) {
  let t, n, a, s = "";
  for (t in e) if ((a = e[t]) !== void 0) if (Array.isArray(a)) for (n = 0; n < a.length; n++) s && (s += "&"), s += encodeURIComponent(t) + "=" + encodeURIComponent(a[n]);
  else s && (s += "&"), s += encodeURIComponent(t) + "=" + encodeURIComponent(a);
  return "" + s;
}
function Je(e) {
  return !!(e == null ? void 0 : e.isRedirect);
}
function We(e) {
  return !!(e == null ? void 0 : e.isNotFound);
}
function fr(e, r) {
  return qe(e, r);
}
function pr(e, r) {
  return Readable.fromWeb(qe(e, Readable.toWeb(r)));
}
const mr = /(<body)/, hr = /(<\/body>)/, gr = /(<\/html>)/, br = /(<head.*?>)/, yr = /(<\/[a-zA-Z][\w:.-]*?>)/g, vr = new TextDecoder();
function _r() {
  let e;
  const r = new TextEncoder(), n = { stream: new ReadableStream$1({ start(a) {
    e = a;
  } }), write: (a) => {
    e.enqueue(r.encode(a));
  }, end: (a) => {
    a && e.enqueue(r.encode(a)), e.close(), n.destroyed = true;
  }, destroy: (a) => {
    e.error(a);
  }, destroyed: false };
  return n;
}
async function xr(e, r) {
  var t, n, a;
  try {
    const s = e.getReader();
    let o;
    for (; !(o = await s.read()).done; ) (t = r.onData) == null || t.call(r, o);
    (n = r.onEnd) == null || n.call(r);
  } catch (s) {
    (a = r.onError) == null || a.call(r, s);
  }
}
function qe(e, r) {
  const t = _r();
  let n = true, a = "", s = "", o = false, c = false, l = "", f = "";
  function m() {
    const g = a;
    return a = "", g;
  }
  function y(g) {
    return g instanceof Uint8Array ? vr.decode(g) : String(g);
  }
  const p = dr();
  let N = 0;
  e.serverSsr.injectedHtml.forEach((g) => {
    M(g);
  });
  const V = e.subscribe("onInjectedHtml", (g) => {
    M(g.promise);
  });
  function M(g) {
    N++, g.then((B) => {
      o ? t.write(B) : a += B;
    }).catch(p.reject).finally(() => {
      N--, !n && N === 0 && (V(), p.resolve());
    });
  }
  return p.then(() => {
    const g = f + m() + s;
    t.end(g);
  }).catch((g) => {
    console.error("Error reading routerStream:", g), t.destroy(g);
  }), xr(r, { onData: (g) => {
    const B = y(g.value);
    let x = l + B;
    const K = x.match(hr), re = x.match(gr);
    if (o || x.match(mr) && (o = true), !c) {
      const v = x.match(br);
      if (v) {
        c = true;
        const d = v.index, u = v[0], w = x.slice(d + u.length);
        t.write(x.slice(0, d) + u + m()), x = w;
      }
    }
    if (!o) {
      t.write(x), l = "";
      return;
    }
    if (K && re && K.index < re.index) {
      const v = K.index;
      s = x.slice(v), t.write(x.slice(0, v) + m()), l = "";
      return;
    }
    let G, U = 0;
    for (; (G = yr.exec(x)) !== null; ) U = G.index + G[0].length;
    if (U > 0) {
      const v = x.slice(0, U) + m() + f;
      t.write(v), l = x.slice(U);
    } else l = x, f += m();
  }, onEnd: () => {
    n = false, N === 0 && p.resolve();
  }, onError: (g) => {
    console.error("Error reading appStream:", g), t.destroy(g);
  } }), t.stream;
}
const Z = "__TSR_index";
function wr(e) {
  let r = e.getLocation();
  const t = /* @__PURE__ */ new Set(), n = (o) => {
    r = e.getLocation(), t.forEach((c) => c({ location: r, action: o }));
  }, a = (o) => {
    var _a2;
    ((_a2 = e.notifyOnIndexChange) != null ? _a2 : true) ? n(o) : r = e.getLocation();
  }, s = async ({ task: o, navigateOpts: c, ...l }) => {
    var _a2, _b;
    var f, m;
    if ((_a2 = c == null ? void 0 : c.ignoreBlocker) != null ? _a2 : false) {
      o();
      return;
    }
    const p = (_b = (f = e.getBlockers) == null ? void 0 : f.call(e)) != null ? _b : [], N = l.type === "PUSH" || l.type === "REPLACE";
    if (typeof document < "u" && p.length && N) for (const V of p) {
      const M = Ve(l.path, l.state);
      if (await V.blockerFn({ currentLocation: r, nextLocation: M, action: l.type })) {
        (m = e.onBlocked) == null || m.call(e);
        return;
      }
    }
    o();
  };
  return { get location() {
    return r;
  }, get length() {
    return e.getLength();
  }, subscribers: t, subscribe: (o) => (t.add(o), () => {
    t.delete(o);
  }), push: (o, c, l) => {
    const f = r.state[Z];
    c = ye(f + 1, c), s({ task: () => {
      e.pushState(o, c), n({ type: "PUSH" });
    }, navigateOpts: l, type: "PUSH", path: o, state: c });
  }, replace: (o, c, l) => {
    const f = r.state[Z];
    c = ye(f, c), s({ task: () => {
      e.replaceState(o, c), n({ type: "REPLACE" });
    }, navigateOpts: l, type: "REPLACE", path: o, state: c });
  }, go: (o, c) => {
    s({ task: () => {
      e.go(o), a({ type: "GO", index: o });
    }, navigateOpts: c, type: "GO" });
  }, back: (o) => {
    s({ task: () => {
      var _a2;
      e.back((_a2 = o == null ? void 0 : o.ignoreBlocker) != null ? _a2 : false), a({ type: "BACK" });
    }, navigateOpts: o, type: "BACK" });
  }, forward: (o) => {
    s({ task: () => {
      var _a2;
      e.forward((_a2 = o == null ? void 0 : o.ignoreBlocker) != null ? _a2 : false), a({ type: "FORWARD" });
    }, navigateOpts: o, type: "FORWARD" });
  }, canGoBack: () => r.state[Z] !== 0, createHref: (o) => e.createHref(o), block: (o) => {
    var _a2;
    var c;
    if (!e.setBlockers) return () => {
    };
    const l = (_a2 = (c = e.getBlockers) == null ? void 0 : c.call(e)) != null ? _a2 : [];
    return e.setBlockers([...l, o]), () => {
      var _a3;
      var f, m;
      const y = (_a3 = (f = e.getBlockers) == null ? void 0 : f.call(e)) != null ? _a3 : [];
      (m = e.setBlockers) == null || m.call(e, y.filter((p) => p !== o));
    };
  }, flush: () => {
    var o;
    return (o = e.flush) == null ? void 0 : o.call(e);
  }, destroy: () => {
    var o;
    return (o = e.destroy) == null ? void 0 : o.call(e);
  }, notify: n };
}
function ye(e, r) {
  return r || (r = {}), { ...r, key: Ke(), [Z]: e };
}
function Sr(e = { initialEntries: ["/"] }) {
  const r = e.initialEntries;
  let t = e.initialIndex ? Math.min(Math.max(e.initialIndex, 0), r.length - 1) : r.length - 1;
  const n = r.map((s, o) => ye(o, void 0));
  return wr({ getLocation: () => Ve(r[t], n[t]), getLength: () => r.length, pushState: (s, o) => {
    t < r.length - 1 && (r.splice(t + 1), n.splice(t + 1)), n.push(o), r.push(s), t = Math.max(r.length - 1, 0);
  }, replaceState: (s, o) => {
    n[t] = o, r[t] = s;
  }, back: () => {
    t = Math.max(t - 1, 0);
  }, forward: () => {
    t = Math.min(t + 1, r.length - 1);
  }, go: (s) => {
    t = Math.min(Math.max(t + s, 0), r.length - 1);
  }, createHref: (s) => s });
}
function Ve(e, r) {
  const t = e.indexOf("#"), n = e.indexOf("?");
  return { href: e, pathname: e.substring(0, t > 0 ? n > 0 ? Math.min(t, n) : t : n > 0 ? n : e.length), hash: t > -1 ? e.substring(t) : "", search: n > -1 ? e.slice(n, t === -1 ? void 0 : t) : "", state: r || { [Z]: 0, key: Ke() } };
}
function Ke() {
  return (Math.random() + 1).toString(36).substring(7);
}
function Ge(e) {
  if (Array.isArray(e)) return e.flatMap((m) => Ge(m));
  if (typeof e != "string") return [];
  const r = [];
  let t = 0, n, a, s, o, c;
  const l = () => {
    for (; t < e.length && /\s/.test(e.charAt(t)); ) t += 1;
    return t < e.length;
  }, f = () => (a = e.charAt(t), a !== "=" && a !== ";" && a !== ",");
  for (; t < e.length; ) {
    for (n = t, c = false; l(); ) if (a = e.charAt(t), a === ",") {
      for (s = t, t += 1, l(), o = t; t < e.length && f(); ) t += 1;
      t < e.length && e.charAt(t) === "=" ? (c = true, t = o, r.push(e.slice(n, s)), n = t) : t = s + 1;
    } else t += 1;
    (!c || t >= e.length) && r.push(e.slice(n, e.length));
  }
  return r;
}
function Rr(e) {
  return e instanceof Headers ? new Headers(e) : Array.isArray(e) ? new Headers(e) : typeof e == "object" ? new Headers(e) : new Headers();
}
function Q(...e) {
  return e.reduce((r, t) => {
    const n = Rr(t);
    for (const [a, s] of n.entries()) a === "set-cookie" ? Ge(s).forEach((c) => r.append("set-cookie", c)) : r.set(a, s);
    return r;
  }, new Headers());
}
const R = { stringify: (e) => JSON.stringify(e, function(t, n) {
  const a = this[t], s = le.find((o) => o.stringifyCondition(a));
  return s ? s.stringify(a) : n;
}), parse: (e) => JSON.parse(e, function(t, n) {
  const a = this[t];
  if (D(a)) {
    const s = le.find((o) => o.parseCondition(a));
    if (s) return s.parse(a);
  }
  return n;
}), encode: (e) => {
  if (Array.isArray(e)) return e.map((t) => R.encode(t));
  if (D(e)) return Object.fromEntries(Object.entries(e).map(([t, n]) => [t, R.encode(n)]));
  const r = le.find((t) => t.stringifyCondition(e));
  return r ? r.stringify(e) : e;
}, decode: (e) => {
  if (D(e)) {
    const r = le.find((t) => t.parseCondition(e));
    if (r) return r.parse(e);
  }
  return Array.isArray(e) ? e.map((r) => R.decode(r)) : D(e) ? Object.fromEntries(Object.entries(e).map(([r, t]) => [r, R.decode(t)])) : e;
} }, Y = (e, r, t, n) => ({ key: e, stringifyCondition: r, stringify: (a) => ({ [`$${e}`]: t(a) }), parseCondition: (a) => Object.hasOwn(a, `$${e}`), parse: (a) => n(a[`$${e}`]) }), le = [Y("undefined", (e) => e === void 0, () => 0, () => {
}), Y("date", (e) => e instanceof Date, (e) => e.toISOString(), (e) => new Date(e)), Y("error", (e) => e instanceof Error, (e) => ({ ...e, message: e.message, stack: void 0, cause: e.cause }), (e) => Object.assign(new Error(e.message), e)), Y("formData", (e) => e instanceof FormData, (e) => {
  const r = {};
  return e.forEach((t, n) => {
    const a = r[n];
    a !== void 0 ? Array.isArray(a) ? a.push(t) : r[n] = [a, t] : r[n] = t;
  }), r;
}, (e) => {
  const r = new FormData();
  return Object.entries(e).forEach(([t, n]) => {
    Array.isArray(n) ? n.forEach((a) => r.append(t, a)) : r.append(t, n);
  }), r;
}), Y("bigint", (e) => typeof e == "bigint", (e) => e.toString(), (e) => BigInt(e))];
var Cr = "Invariant failed";
function we(e, r) {
  if (!e) throw new Error(Cr);
}
const Nr = [];
function F(e, r) {
  const t = r || e || {};
  return typeof t.method > "u" && (t.method = "GET"), { options: t, middleware: (n) => F(void 0, Object.assign(t, { middleware: n })), validator: (n) => F(void 0, Object.assign(t, { validator: n })), type: (n) => F(void 0, Object.assign(t, { type: n })), handler: (...n) => {
    const [a, s] = n;
    Object.assign(t, { ...a, extractedFn: a, serverFn: s });
    const o = [...t.middleware || [], Lr(t)];
    return Object.assign(async (c) => Ee(o, "client", { ...a, ...t, data: c == null ? void 0 : c.data, headers: c == null ? void 0 : c.headers, signal: c == null ? void 0 : c.signal, context: {} }).then((l) => {
      if (t.response === "full") return l;
      if (l.error) throw l.error;
      return l.result;
    }), { ...a, __executeServer: async (c, l) => {
      const f = c instanceof FormData ? kr(c) : c;
      f.type = typeof t.type == "function" ? t.type(f) : t.type;
      const m = { ...a, ...f, signal: l }, y = () => Ee(o, "server", m).then((p) => ({ result: p.result, error: p.error, context: p.sendContext }));
      if (m.type === "static") {
        let p;
        if ((k == null ? void 0 : k.getItem) && (p = await k.getItem(m)), p || (p = await y().then((N) => ({ ctx: N, error: null })).catch((N) => ({ ctx: void 0, error: N })), (k == null ? void 0 : k.setItem) && await k.setItem(m, p)), we(p), p.error) throw p.error;
        return p.ctx;
      }
      return y();
    } });
  } };
}
async function Ee(e, r, t) {
  const n = jr([...Nr, ...e]), a = async (s) => {
    const o = n.shift();
    if (!o) return s;
    o.options.validator && (r !== "client" || o.options.validateClient) && (s.data = await Pr(o.options.validator, s.data));
    const c = r === "client" ? o.options.client : o.options.server;
    return c ? Er(c, s, async (l) => a(l).catch((f) => {
      if (Je(f) || We(f)) return { ...l, error: f };
      throw f;
    })) : a(s);
  };
  return a({ ...t, headers: t.headers || {}, sendContext: t.sendContext || {}, context: t.context || {} });
}
let k;
function Fr(e) {
  const r = k;
  return k = typeof e == "function" ? e() : e, () => {
    k = r;
  };
}
Fr(() => {
  const e = (n, a) => `/__tsr/staticServerFnCache/${n.functionId}__${a}.json`, r = (n) => JSON.stringify(n != null ? n : "", (o, c) => c && typeof c == "object" && !Array.isArray(c) ? Object.keys(c).sort().reduce((l, f) => (l[f] = c[f], l), {}) : c).replace(/[/\\?%*:|"<>]/g, "-").replace(/\s+/g, "_"), t = typeof document < "u" ? /* @__PURE__ */ new Map() : null;
  return { getItem: async (n) => {
    if (typeof document > "u") {
      const a = r(n.data), s = e(n, a), o = "/home/miles/dev/phoenixcomedyunderground/dist", { promises: c } = await import('node:fs'), f = (await import('node:path')).join(o, s), [m, y] = await c.readFile(f, "utf-8").then((p) => [R.parse(p), null]).catch((p) => [null, p]);
      if (y && y.code !== "ENOENT") throw y;
      return m;
    }
  }, setItem: async (n, a) => {
    const { promises: s } = await import('node:fs'), o = await import('node:path'), c = r(n.data), l = e(n, c), m = o.join("/home/miles/dev/phoenixcomedyunderground/dist", l);
    await s.mkdir(o.dirname(m), { recursive: true }), await s.writeFile(m, R.stringify(a));
  }, fetchItem: async (n) => {
    const a = r(n.data), s = e(n, a);
    let o = t == null ? void 0 : t.get(s);
    return o || (o = await fetch(s, { method: "GET" }).then((c) => c.text()).then((c) => R.parse(c)), t == null ? void 0 : t.set(s, o)), o;
  } };
});
function kr(e) {
  const r = e.get("__TSR_CONTEXT");
  if (e.delete("__TSR_CONTEXT"), typeof r != "string") return { context: {}, data: e };
  try {
    return { context: R.parse(r), data: e };
  } catch {
    return { data: e };
  }
}
function jr(e) {
  const r = /* @__PURE__ */ new Set(), t = [], n = (a) => {
    a.forEach((s) => {
      s.options.middleware && n(s.options.middleware), r.has(s) || (r.add(s), t.push(s));
    });
  };
  return n(e), t;
}
const Er = async (e, r, t) => e({ ...r, next: async (n = {}) => {
  var _a2, _b;
  return t({ ...r, ...n, context: { ...r.context, ...n.context }, sendContext: { ...r.sendContext, ...(_a2 = n.sendContext) != null ? _a2 : {} }, headers: Q(r.headers, n.headers), result: n.result !== void 0 ? n.result : r.response === "raw" ? n : r.result, error: (_b = n.error) != null ? _b : r.error });
} });
function Pr(e, r) {
  if (e == null) return {};
  if ("~standard" in e) {
    const t = e["~standard"].validate(r);
    if (t instanceof Promise) throw new Error("Async validation not supported");
    if (t.issues) throw new Error(JSON.stringify(t.issues, void 0, 2));
    return t.value;
  }
  if ("parse" in e) return e.parse(r);
  if (typeof e == "function") return e(r);
  throw new Error("Invalid validator type!");
}
function Lr(e) {
  return { _types: void 0, options: { validator: e.validator, validateClient: e.validateClient, client: async ({ next: r, sendContext: t, ...n }) => {
    var a;
    const s = { ...n, context: t, type: typeof n.type == "function" ? n.type(n) : n.type };
    if (n.type === "static" && typeof document < "u") {
      we(k);
      const c = await k.fetchItem(s);
      if (c) {
        if (c.error) throw c.error;
        return r(c.ctx);
      }
      `${s.functionId}${JSON.stringify(s.data)}`;
    }
    const o = await ((a = e.extractedFn) == null ? void 0 : a.call(e, s));
    return r(o);
  }, server: async ({ next: r, ...t }) => {
    var n;
    const a = await ((n = e.serverFn) == null ? void 0 : n.call(e, t));
    return r({ ...t, result: a });
  } } };
}
function Tr(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var ge, Pe;
function zr() {
  if (Pe) return ge;
  Pe = 1;
  const e = {}, r = e.hasOwnProperty, t = (d, u) => {
    for (const w in d) r.call(d, w) && u(w, d[w]);
  }, n = (d, u) => (u && t(u, (w, z) => {
    d[w] = z;
  }), d), a = (d, u) => {
    const w = d.length;
    let z = -1;
    for (; ++z < w; ) u(d[z]);
  }, s = (d) => "\\u" + ("0000" + d).slice(-4), o = (d, u) => {
    let w = d.toString(16);
    return u ? w : w.toUpperCase();
  }, c = e.toString, l = Array.isArray, f = (d) => typeof Buffer == "function" && Buffer.isBuffer(d), m = (d) => c.call(d) == "[object Object]", y = (d) => typeof d == "string" || c.call(d) == "[object String]", p = (d) => typeof d == "number" || c.call(d) == "[object Number]", N = (d) => typeof d == "bigint", V = (d) => typeof d == "function", M = (d) => c.call(d) == "[object Map]", g = (d) => c.call(d) == "[object Set]", B = { "\\": "\\\\", "\b": "\\b", "\f": "\\f", "\n": "\\n", "\r": "\\r", "	": "\\t" }, x = /[\\\b\f\n\r\t]/, K = /[0-9]/, re = /[\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/, G = /([\uD800-\uDBFF][\uDC00-\uDFFF])|([\uD800-\uDFFF])|(['"`])|[^]/g, U = /([\uD800-\uDBFF][\uDC00-\uDFFF])|([\uD800-\uDFFF])|(['"`])|[^ !#-&\(-\[\]-_a-~]/g, v = (d, u) => {
    const w = () => {
      pe = ae, ++u.indentLevel, ae = u.indent.repeat(u.indentLevel);
    }, z = { escapeEverything: false, minimal: false, isScriptContext: false, quotes: "single", wrap: false, es6: false, json: false, compact: true, lowercaseHex: false, numbers: "decimal", indent: "	", indentLevel: 0, __inline1__: false, __inline2__: false }, A = u && u.json;
    A && (z.quotes = "double", z.wrap = true), u = n(z, u), u.quotes != "single" && u.quotes != "double" && u.quotes != "backtick" && (u.quotes = "single");
    const ne = u.quotes == "double" ? '"' : u.quotes == "backtick" ? "`" : "'", I = u.compact, J = u.lowercaseHex;
    let ae = u.indent.repeat(u.indentLevel), pe = "";
    const gt = u.__inline1__, oe = u.__inline2__, W = I ? "" : `
`;
    let S, se = true;
    const bt = u.numbers == "binary", yt = u.numbers == "octal", vt = u.numbers == "decimal", _t = u.numbers == "hexadecimal";
    if (A && d && V(d.toJSON) && (d = d.toJSON()), !y(d)) {
      if (M(d)) return d.size == 0 ? "new Map()" : (I || (u.__inline1__ = true, u.__inline2__ = false), "new Map(" + v(Array.from(d), u) + ")");
      if (g(d)) return d.size == 0 ? "new Set()" : "new Set(" + v(Array.from(d), u) + ")";
      if (f(d)) return d.length == 0 ? "Buffer.from([])" : "Buffer.from(" + v(Array.from(d), u) + ")";
      if (l(d)) return S = [], u.wrap = true, gt && (u.__inline1__ = false, u.__inline2__ = true), oe || w(), a(d, (_) => {
        se = false, oe && (u.__inline2__ = false), S.push((I || oe ? "" : ae) + v(_, u));
      }), se ? "[]" : oe ? "[" + S.join(", ") + "]" : "[" + W + S.join("," + W) + W + (I ? "" : pe) + "]";
      if (p(d) || N(d)) {
        if (A) return JSON.stringify(Number(d));
        let _;
        if (vt) _ = String(d);
        else if (_t) {
          let j = d.toString(16);
          J || (j = j.toUpperCase()), _ = "0x" + j;
        } else bt ? _ = "0b" + d.toString(2) : yt && (_ = "0o" + d.toString(8));
        return N(d) ? _ + "n" : _;
      } else return N(d) ? A ? JSON.stringify(Number(d)) : d + "n" : m(d) ? (S = [], u.wrap = true, w(), t(d, (_, j) => {
        se = false, S.push((I ? "" : ae) + v(_, u) + ":" + (I ? "" : " ") + v(j, u));
      }), se ? "{}" : "{" + W + S.join("," + W) + W + (I ? "" : pe) + "}") : A ? JSON.stringify(d) || "null" : String(d);
    }
    const xt = u.escapeEverything ? G : U;
    return S = d.replace(xt, (_, j, Se, ie, wt, St) => {
      if (j) {
        if (u.minimal) return j;
        const Re = j.charCodeAt(0), Ce = j.charCodeAt(1);
        if (u.es6) {
          const Rt = (Re - 55296) * 1024 + Ce - 56320 + 65536;
          return "\\u{" + o(Rt, J) + "}";
        }
        return s(o(Re, J)) + s(o(Ce, J));
      }
      if (Se) return s(o(Se.charCodeAt(0), J));
      if (_ == "\0" && !A && !K.test(St.charAt(wt + 1))) return "\\0";
      if (ie) return ie == ne || u.escapeEverything ? "\\" + ie : ie;
      if (x.test(_)) return B[_];
      if (u.minimal && !re.test(_)) return _;
      const me = o(_.charCodeAt(0), J);
      return A || me.length > 2 ? s(me) : "\\x" + ("00" + me).slice(-2);
    }), ne == "`" && (S = S.replace(/\$\{/g, "\\${")), u.isScriptContext && (S = S.replace(/<\/(script|style)/gi, "<\\/$1").replace(/<!--/g, A ? "\\u003C!--" : "\\x3C!--")), u.wrap && (S = ne + S + ne), S;
  };
  return v.version = "3.0.2", ge = v, ge;
}
var Ar = zr();
const q = Tr(Ar), $r = `const __TSR_SSR__={matches:[],streamedValues:{},initMatch:o=>(__TSR_SSR__.matches.push(o),o.extracted?.forEach(l=>{if(l.type==="stream"){let r;l.value=new ReadableStream({start(e){r={enqueue:t=>{try{e.enqueue(t)}catch{}},close:()=>{try{e.close()}catch{}}}}}),l.value.controller=r}else{let r,e;l.value=new Promise((t,a)=>{e=a,r=t}),l.value.reject=e,l.value.resolve=r}}),!0),resolvePromise:({matchId:o,id:l,promiseState:r})=>{const e=__TSR_SSR__.matches.find(t=>t.id===o);if(e){const t=e.extracted?.[l];if(t&&t.type==="promise"&&t.value&&r.status==="success")return t.value.resolve(r.data),!0}return!1},injectChunk:({matchId:o,id:l,chunk:r})=>{const e=__TSR_SSR__.matches.find(t=>t.id===o);if(e){const t=e.extracted?.[l];if(t&&t.type==="stream"&&t.value?.controller)return t.value.controller.enqueue(new TextEncoder().encode(r.toString())),!0}return!1},closeStream:({matchId:o,id:l})=>{const r=__TSR_SSR__.matches.find(e=>e.id===o);if(r){const e=r.extracted?.[l];if(e&&e.type==="stream"&&e.value?.controller)return e.value.controller.close(),!0}return!1},cleanScripts:()=>{document.querySelectorAll(".tsr-once").forEach(o=>{o.remove()})}};window.__TSR_SSR__=__TSR_SSR__;
`;
function Ir(e, r) {
  e.ssr = { manifest: r, serializer: R }, e.serverSsr = { injectedHtml: [], streamedKeys: /* @__PURE__ */ new Set(), injectHtml: (t) => {
    const n = Promise.resolve().then(t);
    return e.serverSsr.injectedHtml.push(n), e.emit({ type: "onInjectedHtml", promise: n }), n.then(() => {
    });
  }, injectScript: (t, n) => e.serverSsr.injectHtml(async () => `<script class='tsr-once'>${await t()}; if (typeof __TSR_SSR__ !== 'undefined') __TSR_SSR__.cleanScripts()<\/script>`), streamValue: (t, n) => {
    e.serverSsr.streamedKeys.has(t), e.serverSsr.streamedKeys.add(t), e.serverSsr.injectScript(() => `__TSR_SSR__.streamedValues['${t}'] = { value: ${q(e.ssr.serializer.stringify(n), { isScriptContext: true, wrap: true, json: true })}}`);
  }, onMatchSettled: Hr }, e.serverSsr.injectScript(() => $r, { logScript: false });
}
function Or(e) {
  var r, t;
  const n = { manifest: e.ssr.manifest, dehydratedData: (t = (r = e.options).dehydrate) == null ? void 0 : t.call(r) };
  e.serverSsr.injectScript(() => `__TSR_SSR__.dehydrated = ${q(e.ssr.serializer.stringify(n), { isScriptContext: true, wrap: true, json: true })}`);
}
function Dr(e, r) {
  const t = [];
  return { replaced: _e(e, (a, s) => {
    if (a instanceof ReadableStream) {
      const [o, c] = a.tee(), l = { type: "stream", path: s, id: t.length, matchIndex: r.match.index, stream: c };
      return t.push(l), o;
    } else if (a instanceof Promise) {
      const o = ir(a), c = { type: "promise", path: s, id: t.length, matchIndex: r.match.index, promise: o };
      t.push(c);
    }
    return a;
  }), extracted: t };
}
function Hr(e) {
  const { router: r, match: t } = e;
  let n, a;
  if (t.loaderData !== void 0) {
    const l = Dr(t.loaderData, { match: t });
    t.loaderData = l.replaced, n = l.extracted, a = n.reduce((f, m) => ve(f, ["temp", ...m.path], void 0), { temp: l.replaced }).temp;
  }
  const s = `__TSR_SSR__.initMatch(${q({ id: t.id, __beforeLoadContext: r.ssr.serializer.stringify(t.__beforeLoadContext), loaderData: r.ssr.serializer.stringify(a), error: r.ssr.serializer.stringify(t.error), extracted: n == null ? void 0 : n.map((l) => cr(l, ["type", "path"])), updatedAt: t.updatedAt, status: t.status }, { isScriptContext: true, wrap: true, json: true })})`;
  r.serverSsr.injectScript(() => s), n && n.forEach((l) => l.type === "promise" ? o(l) : c(l));
  function o(l) {
    r.serverSsr.injectScript(async () => (await l.promise, `__TSR_SSR__.resolvePromise(${q({ matchId: t.id, id: l.id, promiseState: l.promise[O] }, { isScriptContext: true, wrap: true, json: true })})`));
  }
  function c(l) {
    r.serverSsr.injectHtml(async () => {
      try {
        const f = l.stream.getReader();
        let m = null;
        for (; !(m = await f.read()).done; ) if (m.value) {
          const y = `__TSR_SSR__.injectChunk(${q({ matchId: t.id, id: l.id, chunk: m.value }, { isScriptContext: true, wrap: true, json: true })})`;
          r.serverSsr.injectScript(() => y);
        }
        r.serverSsr.injectScript(() => `__TSR_SSR__.closeStream(${q({ matchId: t.id, id: l.id }, { isScriptContext: true, wrap: true, json: true })})`);
      } catch (f) {
        console.error("stream read error", f);
      }
      return "";
    });
  }
}
function ve(e, r, t) {
  if (r.length === 0) return t;
  const [n, ...a] = r;
  return Array.isArray(e) ? e.map((s, o) => o === Number(n) ? ve(s, a, t) : s) : D(e) ? { ...e, [n]: ve(e[n], a, t) } : e;
}
function _e(e, r, t = []) {
  if (lr(e)) return e.map((a, s) => _e(a, r, [...t, `${s}`]));
  if (D(e)) {
    const a = {};
    for (const s in e) a[s] = _e(e[s], r, [...t, s]);
    return a;
  }
  const n = r(e, t);
  return n !== e ? n : e;
}
function Mr({ createRouter: e, getRouterManifest: r }) {
  return (t) => eventHandler(async (n) => {
    const a = toWebRequest(n), s = new URL(a.url), o = s.href.replace(s.origin, ""), c = Sr({ initialEntries: [o] }), l = e();
    Ir(l, await (r == null ? void 0 : r())), l.update({ history: c }), await l.load(), Or(l);
    const f = Br({ event: n, router: l });
    return await t({ request: a, router: l, responseHeaders: f });
  });
}
function Br(e) {
  let r = Q(getResponseHeaders(e.event), e.event.___ssrRpcResponseHeaders, { "Content-Type": "text/html; charset=UTF-8" }, ...e.router.state.matches.map((n) => n.headers));
  const { redirect: t } = e.router.state;
  return t && (r = Q(r, t.headers, { Location: t.href })), r;
}
function Ur(e = {}) {
  let r, t = false;
  const n = (o) => {
    if (r && r !== o) throw new Error("Context conflict");
  };
  let a;
  if (e.asyncContext) {
    const o = e.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    o ? a = new o() : console.warn("[unctx] `AsyncLocalStorage` is not provided.");
  }
  const s = () => {
    if (a) {
      const o = a.getStore();
      if (o !== void 0) return o;
    }
    return r;
  };
  return { use: () => {
    const o = s();
    if (o === void 0) throw new Error("Context is not available");
    return o;
  }, tryUse: () => s(), set: (o, c) => {
    c || n(o), r = o, t = true;
  }, unset: () => {
    r = void 0, t = false;
  }, call: (o, c) => {
    n(o), r = o;
    try {
      return a ? a.run(o, c) : c();
    } finally {
      t || (r = void 0);
    }
  }, async callAsync(o, c) {
    r = o;
    const l = () => {
      r = o;
    }, f = () => r === o ? l : void 0;
    ze.add(f);
    try {
      const m = a ? a.run(o, c) : c();
      return t || (r = void 0), await m;
    } finally {
      ze.delete(f);
    }
  } };
}
function Jr(e = {}) {
  const r = {};
  return { get(t, n = {}) {
    return r[t] || (r[t] = Ur({ ...e, ...n })), r[t];
  } };
}
const de = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof global < "u" ? global : {}, Le = "__unctx__", Wr = de[Le] || (de[Le] = Jr()), qr = (e, r = {}) => Wr.get(e, r), Te = "__unctx_async_handlers__", ze = de[Te] || (de[Te] = /* @__PURE__ */ new Set());
function Vr() {
  return Ye();
}
const Xe = Symbol("$HTTPEvent");
function Kr(e) {
  return typeof e == "object" && (e instanceof H3Event || (e == null ? void 0 : e[Xe]) instanceof H3Event || (e == null ? void 0 : e.__is_event__) === true);
}
function Gr(e) {
  return function(...r) {
    var t;
    const n = r[0];
    if (Kr(n)) r[0] = n instanceof H3Event || n.__is_event__ ? n : n[Xe];
    else {
      if (!((t = globalThis.app.config.server.experimental) != null && t.asyncContext)) throw new Error("AsyncLocalStorage was not enabled. Use the `server.experimental.asyncContext: true` option in your app configuration to enable it. Or, pass the instance of HTTPEvent that you have as the first argument to the function.");
      r.unshift(Vr());
    }
    return e(...r);
  };
}
const Xr = Gr(getHeaders);
function Yr() {
  var e;
  return qr("nitro-app", { asyncContext: !!((e = globalThis.app.config.server.experimental) != null && e.asyncContext), AsyncLocalStorage: AsyncLocalStorage });
}
function Ye() {
  const e = Yr().use().event;
  if (!e) throw new Error("No HTTPEvent found in AsyncLocalStorage. Make sure you are using the function within the server runtime.");
  return e;
}
const Zr = async ({ request: e, router: r, responseHeaders: t }) => {
  if (typeof ce$1.renderToReadableStream == "function") {
    const n = await ce$1.renderToReadableStream(jsx(Fe, { router: r }), { signal: e.signal });
    ke(e.headers.get("User-Agent")) && await n.allReady;
    const a = fr(r, n);
    return new Response(a, { status: r.state.statusCode, headers: t });
  }
  if (typeof ce$1.renderToPipeableStream == "function") {
    const n = new PassThrough();
    try {
      const s = ce$1.renderToPipeableStream(jsx(Fe, { router: r }), { ...ke(e.headers.get("User-Agent")) ? { onAllReady() {
        s.pipe(n);
      } } : { onShellReady() {
        s.pipe(n);
      } }, onError: (o, c) => {
        console.error("Error in renderToPipeableStream:", o, c);
      } });
    } catch (s) {
      console.error("Error in renderToPipeableStream:", s);
    }
    const a = pr(r, n);
    return new Response(a, { status: r.state.statusCode, headers: t });
  }
  throw new Error("No renderToReadableStream or renderToPipeableStream found in react-dom/server. Ensure you are using a version of react-dom that supports streaming.");
}, Qr = () => ({ routes: { __root__: { filePath: "__root.tsx", children: ["/_appLayout", "/_auth", "/login"], preloads: ["/_build/assets/client-Cd_m-fS0.js", "/_build/assets/client-BmhiFDeO.js"] }, "/_appLayout": { filePath: "_appLayout.tsx", children: ["/_appLayout/calendar", "/_appLayout/contact", "/_appLayout/count", "/_appLayout/"] }, "/_auth": { filePath: "_auth.tsx", children: ["/_auth/_dashboardLayout"] }, "/login": { filePath: "login.tsx" }, "/_auth/_dashboardLayout": { filePath: "_auth/_dashboardLayout/route.tsx", parent: "/_auth", children: ["/_auth/_dashboardLayout/dashboard/"] }, "/_appLayout/calendar": { filePath: "_appLayout/calendar.tsx", parent: "/_appLayout" }, "/_appLayout/contact": { filePath: "_appLayout/contact.tsx", parent: "/_appLayout" }, "/_appLayout/count": { filePath: "_appLayout/count.tsx", parent: "/_appLayout" }, "/_appLayout/": { filePath: "_appLayout/index.tsx", parent: "/_appLayout" }, "/_auth/_dashboardLayout/dashboard/": { filePath: "_auth/_dashboardLayout/dashboard/index.tsx", parent: "/_auth/_dashboardLayout" } } });
function en(e) {
  return globalThis.MANIFEST[e];
}
function tn() {
  var _a2;
  const e = Qr(), r = e.routes.__root__ = e.routes.__root__ || {};
  r.assets = r.assets || [];
  let t = "";
  const n = en("client"), a = (_a2 = n.inputs[n.handler]) == null ? void 0 : _a2.output.path;
  return a || we(a), r.assets.push({ tag: "script", attrs: { type: "module", suppressHydrationWarning: true, async: true }, children: `${t}import("${a}")` }), e;
}
function rn() {
  const e = tn();
  return { ...e, routes: Object.fromEntries(Object.entries(e.routes).map(([r, t]) => {
    const { preloads: n, assets: a } = t;
    return [r, { preloads: n, assets: a }];
  })) };
}
const nn = "/_build/assets/globals-R6Jed5kc.css";
async function an(e, r, t) {
  var n;
  const a = r[0];
  if (D(a) && a.method) {
    const c = a, l = c.data instanceof FormData ? "formData" : "payload", f = new Headers({ ...l === "payload" ? { "content-type": "application/json", accept: "application/json" } : {}, ...c.headers instanceof Headers ? Object.fromEntries(c.headers.entries()) : c.headers });
    if (c.method === "GET") {
      const p = ur({ payload: R.stringify({ data: c.data, context: c.context }) });
      p && (e.includes("?") ? e += `&${p}` : e += `?${p}`);
    }
    e.includes("?") ? e += "&createServerFn" : e += "?createServerFn", c.response === "raw" && (e += "&raw");
    const m = await t(e, { method: c.method, headers: f, signal: c.signal, ...on(c) }), y = await Ae(m);
    if ((n = y.headers.get("content-type")) != null && n.includes("application/json")) {
      const p = R.decode(await y.json());
      if (Je(p) || We(p) || p instanceof Error) throw p;
      return p;
    }
    return y;
  }
  const s = await Ae(await t(e, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(r) })), o = s.headers.get("content-type");
  return o && o.includes("application/json") ? R.decode(await s.json()) : s.text();
}
function on(e) {
  var _a2;
  return e.method === "POST" ? e.data instanceof FormData ? (e.data.set("__TSR_CONTEXT", R.stringify(e.context)), { body: e.data }) : { body: R.stringify({ data: (_a2 = e.data) != null ? _a2 : null, context: e.context }) } : {};
}
async function Ae(e) {
  if (!e.ok) {
    const r = e.headers.get("content-type");
    throw r && r.includes("application/json") ? R.decode(await e.json()) : new Error(await e.text());
  }
  return e;
}
function sn(e) {
  return e.replace(/^\/|\/$/g, "");
}
const T = (e, r) => {
  const t = `/${sn(r)}/${e}`;
  return Object.assign((...a) => an(t, a, async (s, o) => {
    o.headers = Q(Xr(), o.headers);
    const c = await $fetch.native(s, o), l = Ye(), f = Q(c.headers, l.___ssrRpcResponseHeaders);
    return l.___ssrRpcResponseHeaders = f, c;
  }), { url: t, functionId: e });
}, cn = z.object({ email: z.string().email("Please enter a valid email"), password: z.string().min(6, "Password must be at least 6 characters") }), ln = z.object({ email: z.string().email("Please enter a valid email"), password: z.string().min(6, "Password must be at least 6 characters"), name: z.string().min(2, "Name must be at least 2 characters") }), dn = T("app_lib_actions_auth_ts--login_createServerFn_handler", "/_server"), Da = F({ method: "POST" }).validator((e) => cn.parse(e)).handler(dn), un = T("app_lib_actions_auth_ts--register_createServerFn_handler", "/_server");
F({ method: "POST" }).validator((e) => ln.parse(e)).handler(un);
const fn = T("app_lib_actions_auth_ts--logout_createServerFn_handler", "/_server");
F({ method: "POST" }).handler(fn);
const pn = T("app_lib_actions_auth_ts--getCurrentUser_createServerFn_handler", "/_server"), mn = F({ method: "GET" }).handler(pn);
function Ze({ error: e }) {
  const r = useRouter(), t = useMatch({ strict: false, select: (n) => n.id === rootRouteId });
  return console.error("DefaultCatchBoundary Error:", e), jsxs("div", { className: "min-w-0 flex-1 p-4 flex flex-col items-center justify-center gap-6", children: [jsx(ErrorComponent, { error: e }), jsxs("div", { className: "flex gap-2 items-center flex-wrap", children: [jsx("button", { onClick: () => {
    r.invalidate();
  }, className: "px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold", children: "Try Again" }), t ? jsx(Link, { to: "/", className: "px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold", children: "Home" }) : jsx(Link, { to: "/", className: "px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold", onClick: (n) => {
    n.preventDefault(), window.history.back();
  }, children: "Go Back" })] })] });
}
function b(...e) {
  return twMerge(clsx(e));
}
function hn({ ...e }) {
  return jsx(C$1.Root, { "data-slot": "dialog", ...e });
}
function gn({ ...e }) {
  return jsx(C$1.Trigger, { "data-slot": "dialog-trigger", ...e });
}
function bn({ ...e }) {
  return jsx(C$1.Portal, { "data-slot": "dialog-portal", ...e });
}
function yn({ ...e }) {
  return jsx(C$1.Close, { "data-slot": "dialog-close", ...e });
}
function vn({ className: e, ...r }) {
  return jsx(C$1.Overlay, { "data-slot": "dialog-overlay", className: b("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50", e), ...r });
}
function _n({ className: e, children: r, ...t }) {
  return jsxs(bn, { "data-slot": "dialog-portal", children: [jsx(vn, {}), jsxs(C$1.Content, { "data-slot": "dialog-content", className: b("bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg", e), ...t, children: [r, jsxs(C$1.Close, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", children: [jsx(XIcon, {}), jsx("span", { className: "sr-only", children: "Close" })] })] })] });
}
function xn({ className: e, ...r }) {
  return jsx("div", { "data-slot": "dialog-header", className: b("flex flex-col gap-2 text-center sm:text-left", e), ...r });
}
function wn({ className: e, ...r }) {
  return jsx(C$1.Title, { "data-slot": "dialog-title", className: b("text-lg leading-none font-semibold", e), ...r });
}
function Sn({ className: e, ...r }) {
  return jsx(C$1.Description, { "data-slot": "dialog-description", className: b("text-muted-foreground text-sm", e), ...r });
}
const Rn = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer", { variants: { variant: { default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90", destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60", outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50", secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80", ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50", link: "text-primary underline-offset-4 hover:underline" }, size: { default: "h-9 px-4 py-2 has-[>svg]:px-3", sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5", lg: "h-10 rounded-md px-6 has-[>svg]:px-4", icon: "size-9" } }, defaultVariants: { variant: "default", size: "default" } });
function xe({ className: e, variant: r, size: t, asChild: n = false, ...a }) {
  return jsx(n ? Slot : "button", { "data-slot": "button", className: b(Rn({ variant: r, size: t, className: e })), ...a });
}
function Cn({ className: e, ...r }) {
  return jsx(Gt.Root, { "data-slot": "label", className: b("flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50", e), ...r });
}
const Nn = FormProvider, Qe = H$1.createContext({}), Fn = ({ ...e }) => jsx(Qe.Provider, { value: { name: e.name }, children: jsx(Controller, { ...e }) }), ue = () => {
  const e = H$1.useContext(Qe), r = H$1.useContext(et), { getFieldState: t } = useFormContext(), n = useFormState({ name: e.name }), a = t(e.name, n);
  if (!e) throw new Error("useFormField should be used within <FormField>");
  const { id: s } = r;
  return { id: s, name: e.name, formItemId: `${s}-form-item`, formDescriptionId: `${s}-form-item-description`, formMessageId: `${s}-form-item-message`, ...a };
}, et = H$1.createContext({});
function kn({ className: e, ...r }) {
  const t = H$1.useId();
  return jsx(et.Provider, { value: { id: t }, children: jsx("div", { "data-slot": "form-item", className: b("grid gap-2", e), ...r }) });
}
function Ha({ className: e, ...r }) {
  const { error: t, formItemId: n } = ue();
  return jsx(Cn, { "data-slot": "form-label", "data-error": !!t, className: b("data-[error=true]:text-destructive", e), htmlFor: n, ...r });
}
function jn({ ...e }) {
  const { error: r, formItemId: t, formDescriptionId: n, formMessageId: a } = ue();
  return jsx(Slot, { "data-slot": "form-control", id: t, "aria-describedby": r ? `${n} ${a}` : `${n}`, "aria-invalid": !!r, ...e });
}
function Ma({ className: e, ...r }) {
  const { formDescriptionId: t } = ue();
  return jsx("p", { "data-slot": "form-description", id: t, className: b("text-muted-foreground text-sm", e), ...r });
}
function En({ className: e, ...r }) {
  var _a2;
  const { error: t, formMessageId: n } = ue(), a = t ? String((_a2 = t == null ? void 0 : t.message) != null ? _a2 : "") : r.children;
  return a ? jsx("p", { "data-slot": "form-message", id: n, className: b("text-destructive text-sm", e), ...r, children: a }) : null;
}
function $e({ className: e, type: r, ...t }) {
  return jsx("input", { type: r, "data-slot": "input", className: b("file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", e), ...t });
}
const tt = z.string().email("Please provide a valid email address"), rt = z.object({ email: tt }), Pn = z.number().int().positive("ID must be a positive integer"), Ln = T("app_lib_actions_subscribers_ts--fetchSubscribers_createServerFn_handler", "/_server"), Ba = F({ method: "GET" }).handler(Ln), Tn = T("app_lib_actions_subscribers_ts--subscribe_createServerFn_handler", "/_server"), zn = F({ method: "POST" }).validator((e) => rt.parse(e)).handler(Tn), An = T("app_lib_actions_subscribers_ts--unsubscribe_createServerFn_handler", "/_server");
F({ method: "POST" }).validator((e) => tt.parse(e)).handler(An);
const $n = T("app_lib_actions_subscribers_ts--deleteSubscriber_createServerFn_handler", "/_server"), Ua = F({ method: "POST" }).validator((e) => Pn.parse(e)).handler($n);
function nt() {
  const e = H$1.useRef(null), [r, t] = H$1.useTransition(), n = useForm({ resolver: zodResolver(rt), defaultValues: { email: "" } });
  async function a(s) {
    t(async () => {
      var _a2;
      try {
        (await zn({ data: s })).alreadySubscribed ? toast.info("You are already subscribed to our mailing list!") : toast.success("Successfully subscribed to our mailing list!"), n.reset(), (_a2 = e.current) == null ? void 0 : _a2.click();
      } catch (o) {
        toast.error(`Subscription failed: ${o instanceof Error ? o.message : "Unknown error"}`);
      }
    });
  }
  return jsxs(hn, { children: [jsx(gn, { asChild: true, children: jsx(xe, { className: "border-zinc-800 bg-yellow-500 text-zinc-950 hover:bg-yellow-400 transition-colors w-full sm:w-auto", children: "Join Mailing List" }) }), jsxs(_n, { className: `sm:max-w-[400px] bg-zinc-950 border-zinc-800 
                   [&>button]:text-zinc-400`, onOpenAutoFocus: (s) => s.preventDefault(), children: [jsxs(xn, { children: [jsx(wn, { className: "text-xl font-semibold tracking-tight text-zinc-50", children: "Stay Updated" }), jsx(Sn, { className: "text-zinc-400", children: "Subscribe to get notified about new shows and special events." })] }), jsx(Nn, { ...n, children: jsxs("form", { onSubmit: n.handleSubmit(a), className: "space-y-4", children: [jsx($e, { type: "text", className: "absolute -left-[9999px]", tabIndex: -1, autoComplete: "off" }), jsx(Fn, { control: n.control, name: "email", render: ({ field: s }) => jsxs(kn, { children: [jsx(jn, { children: jsx($e, { type: "email", placeholder: "your@email.com", autoFocus: false, className: `bg-zinc-900 border-zinc-800 text-zinc-50 
                                                placeholder:text-zinc-600 focus-visible:ring-zinc-700`, ...s }) }), jsx(En, { className: "text-red-500" })] }) }), jsx("div", { className: "flex gap-3", children: jsxs(xe, { type: "submit", disabled: r, className: `w-full bg-yellow-500 text-zinc-950 
                                    hover:bg-yellow-400 transition-colors 
                                    disabled:bg-yellow-500/70`, children: [r && jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Subscribe"] }) })] }) }), jsx(yn, { ref: e, className: "hidden" })] })] });
}
function at() {
  return jsxs("div", { className: "flex flex-col items-center justify-center text-white p-4 max-h-[calc(100vh - 65px)]", children: [jsxs("div", { className: "text-center mb-8", children: [jsx("h2", { className: "text-8xl font-bold text-yellow-400 mb-4", children: "404" }), jsx("h3", { className: "text-2xl mb-6", children: "This joke fell flat." }), jsx("p", { className: "max-w-md mb-8 text-gray-400", children: "The page you're looking for seems to have left the stage. Maybe it's grabbing a drink at the bar?" })] }), jsxs("div", { className: "flex flex-wrap justify-center gap-6 mb-12", children: [jsxs("div", { className: "flex flex-col items-center p-4 border border-gray-800 rounded-lg bg-gray-900 w-32", children: [jsx(Mic2, { className: "h-8 w-8 text-yellow-400 mb-2" }), jsx("span", { className: "text-sm text-gray-400 text-center", children: "Missing Punchline" })] }), jsxs("div", { className: "flex flex-col items-center p-4 border border-gray-800 rounded-lg bg-gray-900 w-32 justify-around", children: [jsx(Tickets, { className: "h-8 w-8 text-yellow-400 mb-2" }), jsx("span", { className: "text-sm text-gray-400 text-center", children: "Wrong Venue" })] })] }), jsxs("div", { className: "flex flex-wrap gap-4 justify-center", children: [jsx(Link, { to: "/", className: "border-zinc-800 bg-yellow-500 text-zinc-950 hover:bg-yellow-400 transition-colors text-sm font-medium transition-all flex items-center rounded-md p-2 px-4", children: "Back to Home" }), jsx(Link, { to: "/calendar", className: "text-sm font-medium transition-all bg-white text-black hover:bg-neutral-200 transition-colors flex items-center rounded-md p-2 px-4", children: "View Upcoming Shows" })] })] });
}
const fe = createRootRoute({ head: () => ({ meta: [{ charSet: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }, { title: "Phoenix Comedy Underground" }], links: [{ rel: "stylesheet", href: nn }, { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" }, { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" }, { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" }, { rel: "manifest", href: "/site.webmanifest" }] }), beforeLoad: async () => ({ user: await mn() }), errorComponent: (e) => jsx(ot, { children: jsx(Ze, { ...e }) }), notFoundComponent: () => jsx(at, {}), component: In });
function In() {
  return jsx(ot, { children: jsx(Outlet, {}) });
}
function ot({ children: e }) {
  return jsxs("html", { children: [jsx("head", { children: jsx(HeadContent, {}) }), jsxs("body", { children: [e, jsx(Scripts, {})] })] });
}
const On = () => import('../build/login-CmTiAKNH.mjs'), st = createFileRoute("/login")({ beforeLoad: ({ context: e }) => {
  if (e.user) throw redirect({ to: "/dashboard" });
}, component: lazyRouteComponent(On, "component", () => st.ssr) }), Dn = createFileRoute("/_auth")({ beforeLoad: ({ context: e }) => {
  if (!e.user) throw redirect({ to: "/login" });
} }), Hn = () => import('../build/_appLayout-DNKpv9Vr.mjs'), it = createFileRoute("/_appLayout")({ component: lazyRouteComponent(Hn, "component", () => it.ssr) }), Mn = () => import('../build/index-B6A_CsGm.mjs'), ct = createFileRoute("/_appLayout/")({ component: lazyRouteComponent(Mn, "component", () => ct.ssr) }), Bn = () => import('../build/count-FezZJ3e8.mjs'), Un = T("app_routes_appLayout_count_tsx--getCount_createServerFn_handler", "/_server"), Jn = F({ method: "GET" }).handler(Un), lt = createFileRoute("/_appLayout/count")({ component: lazyRouteComponent(Bn, "component", () => lt.ssr), loader: async () => await Jn() }), Wn = () => import('../build/contact-k9-X1edH.mjs'), dt = createFileRoute("/_appLayout/contact")({ component: lazyRouteComponent(Wn, "component", () => dt.ssr) }), qn = () => import('../build/calendar-B0zx9gns.mjs'), ut = createFileRoute("/_appLayout/calendar")({ component: lazyRouteComponent(qn, "component", () => ut.ssr) }), Vn = () => import('../build/route-CQfTNkRn.mjs'), Kn = () => import('../build/route-D9Ftr4P5.mjs'), ft = createFileRoute("/_auth/_dashboardLayout")({ component: lazyRouteComponent(Kn, "component", () => ft.ssr), notFoundComponent: lazyRouteComponent(Vn, "notFoundComponent") }), Gn = () => import('../build/index-0FDrAID3.mjs'), pt = createFileRoute("/_auth/_dashboardLayout/dashboard/")({ component: lazyRouteComponent(Gn, "component", () => pt.ssr) }), Xn = st.update({ id: "/login", path: "/login", getParentRoute: () => fe }), mt = Dn.update({ id: "/_auth", getParentRoute: () => fe }), te = it.update({ id: "/_appLayout", getParentRoute: () => fe }), Yn = ct.update({ id: "/", path: "/", getParentRoute: () => te }), Zn = lt.update({ id: "/count", path: "/count", getParentRoute: () => te }), Qn = dt.update({ id: "/contact", path: "/contact", getParentRoute: () => te }), ea = ut.update({ id: "/calendar", path: "/calendar", getParentRoute: () => te }), ht = ft.update({ id: "/_dashboardLayout", getParentRoute: () => mt }), ta = pt.update({ id: "/dashboard/", path: "/dashboard/", getParentRoute: () => ht }), ra = { AppLayoutCalendarRoute: ea, AppLayoutContactRoute: Qn, AppLayoutCountRoute: Zn, AppLayoutIndexRoute: Yn }, na = te._addFileChildren(ra), aa = { AuthDashboardLayoutDashboardIndexRoute: ta }, oa = ht._addFileChildren(aa), sa = { AuthDashboardLayoutRouteRoute: oa }, ia = mt._addFileChildren(sa), ca = { AppLayoutRoute: na, AuthRoute: ia, LoginRoute: Xn }, la = fe._addFileChildren(ca)._addFileTypes();
function da({ className: e, children: r, viewport: t = true, ...n }) {
  return jsxs(ee$1.Root, { "data-slot": "navigation-menu", "data-viewport": t, className: b("group/navigation-menu relative flex max-w-max flex-1 items-center justify-center", e), ...n, children: [r, t && jsx(fa, {})] });
}
function ua({ className: e, ...r }) {
  return jsx(ee$1.List, { "data-slot": "navigation-menu-list", className: b("group flex flex-1 list-none items-center justify-center gap-1", e), ...r });
}
function Ie({ className: e, ...r }) {
  return jsx(ee$1.Item, { "data-slot": "navigation-menu-item", className: b("relative", e), ...r });
}
cva("group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1");
function fa({ className: e, ...r }) {
  return jsx("div", { className: b("absolute top-full left-0 isolate z-50 flex justify-center"), children: jsx(ee$1.Viewport, { "data-slot": "navigation-menu-viewport", className: b("origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow md:w-[var(--radix-navigation-menu-viewport-width)]", e), ...r }) });
}
function Oe({ className: e, ...r }) {
  return jsx(ee$1.Link, { "data-slot": "navigation-menu-link", className: b("data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 [&_svg:not([class*='text-'])]:text-muted-foreground flex flex-col gap-1 rounded-sm p-2 text-sm transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4", e), ...r });
}
function pa({ ...e }) {
  return jsx(C$1.Root, { "data-slot": "sheet", ...e });
}
function ma({ ...e }) {
  return jsx(C$1.Trigger, { "data-slot": "sheet-trigger", ...e });
}
function ha({ ...e }) {
  return jsx(C$1.Portal, { "data-slot": "sheet-portal", ...e });
}
function ga({ className: e, ...r }) {
  return jsx(C$1.Overlay, { "data-slot": "sheet-overlay", className: b("data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50", e), ...r });
}
function ba({ className: e, children: r, side: t = "right", ...n }) {
  return jsxs(ha, { children: [jsx(ga, {}), jsxs(C$1.Content, { "data-slot": "sheet-content", className: b("bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500", t === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm", t === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm", t === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b", t === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t", e), ...n, children: [r, jsxs(C$1.Close, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none", children: [jsx(XIcon, { className: "size-4" }), jsx("span", { className: "sr-only", children: "Close" })] })] })] });
}
function ya() {
  const [e, r] = useState(false), t = () => {
    r(false);
  };
  return jsxs(pa, { open: e, onOpenChange: r, children: [jsx(ma, { asChild: true, children: jsx(xe, { variant: "ghost", className: "md:hidden text-zinc-400 w-12 h-12 rounded-md hover:bg-zinc-800/50", children: jsx(Menu, { className: "h-6 w-6" }) }) }), jsx(ba, { side: "right", className: "w-[300px] bg-zinc-950 border-zinc-800 p-0", children: jsxs("div", { className: "flex flex-col h-full", children: [jsx("div", { className: "p-6 border-b border-zinc-800", children: jsx("h2", { className: "text-xl font-semibold text-zinc-100", children: "Menu" }) }), jsx("div", { className: "flex-1 py-6", children: jsxs("nav", { className: "space-y-1", children: [jsx(Link, { to: "/", className: "flex items-center px-6 py-4 text-base font-medium text-zinc-100 hover:bg-zinc-900 transition-colors", onClick: t, children: jsx("span", { children: "Home" }) }), jsx("div", { className: "h-px bg-zinc-800/60 mx-6 my-2" }), jsx(Link, { to: "/calendar", className: "flex items-center px-6 py-4 text-base font-medium text-zinc-100 hover:bg-zinc-900 transition-colors", onClick: t, children: jsx("span", { children: "Events" }) }), jsx("div", { className: "h-px bg-zinc-800/60 mx-6 my-2" }), jsx(Link, { to: "/contact", className: "flex items-center px-6 py-4 text-base font-medium text-zinc-100 hover:bg-zinc-900 transition-colors", onClick: t, children: jsx("span", { children: "Contact" }) })] }) }), jsxs("div", { className: "border-t border-zinc-800 p-6", children: [jsx("div", { className: "mb-3 text-sm text-zinc-400", children: "Stay updated on upcoming shows" }), jsx(nt, {})] })] }) })] });
}
function va({ children: e }) {
  return jsxs(Fragment, { children: [jsx("nav", { className: "sticky top-0 z-50 border-b border-zinc-800 bg-background backdrop-blur-sm", children: jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: jsxs("div", { className: "flex items-center justify-between h-16", children: [jsx(Link, { to: "/", className: "flex items-center h-full", children: jsx("img", { src: "/logo-transparent.svg", alt: "Phoenix Comedy Underground", className: "h-full" }) }), jsx("div", { className: "hidden md:block", children: jsx(da, { children: jsxs(ua, { className: "flex space-x-8", children: [jsx(Ie, { children: jsx(Oe, { href: "/calendar", className: "text-zinc-300 hover:text-zinc-100 transition-colors", children: "Calendar" }) }), jsx(Ie, { children: jsx(Oe, { href: "/contact", className: "text-zinc-300 hover:text-zinc-100 transition-colors", children: "Contact" }) }), jsx(nt, {})] }) }) }), jsx(ya, {})] }) }) }), jsxs("div", { className: "p-6", children: [e || jsx(Outlet, {}), jsx(Toaster, { position: "bottom-right" })] })] });
}
function _a() {
  return createRouter$2({ routeTree: la, defaultPreload: "intent", defaultErrorComponent: Ze, defaultNotFoundComponent: () => jsx(va, { children: jsx(at, {}) }), scrollRestoration: true });
}
const Ja = Mr({ createRouter: _a, getRouterManifest: rn })(Zr);

const handlers = [
  { route: '/_server', handler: fe$1, lazy: false, middleware: true, method: undefined },
  { route: '/', handler: Ja, lazy: false, middleware: true, method: undefined }
];

function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}

const storageKeyProperties = [
  "has",
  "hasItem",
  "get",
  "getItem",
  "getItemRaw",
  "set",
  "setItem",
  "setItemRaw",
  "del",
  "remove",
  "removeItem",
  "getMeta",
  "setMeta",
  "removeMeta",
  "getKeys",
  "clear",
  "mount",
  "unmount"
];
function prefixStorage(storage, base) {
  base = normalizeBaseKey(base);
  if (!base) {
    return storage;
  }
  const nsStorage = { ...storage };
  for (const property of storageKeyProperties) {
    nsStorage[property] = (key = "", ...args) => (
      // @ts-ignore
      storage[property](base + key, ...args)
    );
  }
  nsStorage.getKeys = (key = "", ...arguments_) => storage.getKeys(base + key, ...arguments_).then((keys) => keys.map((key2) => key2.slice(base.length)));
  return nsStorage;
}
function normalizeKey$1(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey$1(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey$1(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}

function defineDriver$1(factory) {
  return factory;
}

const DRIVER_NAME$1 = "memory";
const memory = defineDriver$1(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME$1,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey$1(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey$1(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey$1(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey$1(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey$1(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

const _assets = {

};

const normalizeKey = function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
};

const assets = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

function defineDriver(factory) {
  return factory;
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError);
  }
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`
    );
  }
  return createError(driver, `Missing required option \`${name}\`.`);
}

function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
async function writeFile(path, data, encoding) {
  await ensuredir(dirname(path));
  return promises.writeFile(path, data, encoding);
}
function readFile(path, encoding) {
  return promises.readFile(path, encoding).catch(ignoreNotfound);
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
  return promises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then((r) => r || []);
}
async function ensuredir(dir) {
  if (existsSync(dir)) {
    return;
  }
  await ensuredir(dirname(dir)).catch(ignoreExists);
  await promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore, maxDepth) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir(dir);
  const files = [];
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve(dir, entry.name);
      if (entry.isDirectory()) {
        if (maxDepth === void 0 || maxDepth > 0) {
          const dirFiles = await readdirRecursive(
            entryPath,
            ignore,
            maxDepth === void 0 ? void 0 : maxDepth - 1
          );
          files.push(...dirFiles.map((f) => entry.name + "/" + f));
        }
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name);
        }
      }
    })
  );
  return files;
}
async function rmRecursive(dir) {
  const entries = await readdir(dir);
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve(dir, entry.name);
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => promises.rmdir(entryPath));
      } else {
        return promises.unlink(entryPath);
      }
    })
  );
}

const PATH_TRAVERSE_RE = /\.\.:|\.\.$/;
const DRIVER_NAME = "fs-lite";
const unstorage_47drivers_47fs_45lite = defineDriver((opts = {}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME, "base");
  }
  opts.base = resolve(opts.base);
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join$1(opts.base, key.replace(/:/g, "/"));
    return resolved;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    flags: {
      maxDepth: true
    },
    hasItem(key) {
      return existsSync(r(key));
    },
    getItem(key) {
      return readFile(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value);
    },
    removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return unlink(r(key));
    },
    getKeys(_base, topts) {
      return readdirRecursive(r("."), opts.ignore, topts?.maxDepth);
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await rmRecursive(r("."));
    }
  };
});

const storage = createStorage({});

storage.mount('/assets', assets);

storage.mount('data', unstorage_47drivers_47fs_45lite({"driver":"fsLite","base":"./.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const e=globalThis.process?.getBuiltinModule?.("crypto")?.hash,r="sha256",s="base64url";function digest(t){if(e)return e(r,t,s);const o=createHash(r).update(t);return globalThis.process?.versions?.webcontainer?o.digest().toString(s):o.digest(s)}

function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
class Hasher {
  buff = "";
  #context = /* @__PURE__ */ new Map();
  write(str) {
    this.buff += str;
  }
  dispatch(value) {
    const type = value === null ? "null" : typeof value;
    return this[type](value);
  }
  object(object) {
    if (object && typeof object.toJSON === "function") {
      return this.object(object.toJSON());
    }
    const objString = Object.prototype.toString.call(object);
    let objType = "";
    const objectLength = objString.length;
    objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
    objType = objType.toLowerCase();
    let objectNumber = null;
    if ((objectNumber = this.#context.get(object)) === void 0) {
      this.#context.set(object, this.#context.size);
    } else {
      return this.dispatch("[CIRCULAR:" + objectNumber + "]");
    }
    if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
      this.write("buffer:");
      return this.write(object.toString("utf8"));
    }
    if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
      if (this[objType]) {
        this[objType](object);
      } else {
        this.unknown(object, objType);
      }
    } else {
      const keys = Object.keys(object).sort();
      const extraKeys = [];
      this.write("object:" + (keys.length + extraKeys.length) + ":");
      const dispatchForKey = (key) => {
        this.dispatch(key);
        this.write(":");
        this.dispatch(object[key]);
        this.write(",");
      };
      for (const key of keys) {
        dispatchForKey(key);
      }
      for (const key of extraKeys) {
        dispatchForKey(key);
      }
    }
  }
  array(arr, unordered) {
    unordered = unordered === void 0 ? false : unordered;
    this.write("array:" + arr.length + ":");
    if (!unordered || arr.length <= 1) {
      for (const entry of arr) {
        this.dispatch(entry);
      }
      return;
    }
    const contextAdditions = /* @__PURE__ */ new Map();
    const entries = arr.map((entry) => {
      const hasher = new Hasher();
      hasher.dispatch(entry);
      for (const [key, value] of hasher.#context) {
        contextAdditions.set(key, value);
      }
      return hasher.toString();
    });
    this.#context = contextAdditions;
    entries.sort();
    return this.array(entries, false);
  }
  date(date) {
    return this.write("date:" + date.toJSON());
  }
  symbol(sym) {
    return this.write("symbol:" + sym.toString());
  }
  unknown(value, type) {
    this.write(type);
    if (!value) {
      return;
    }
    this.write(":");
    if (value && typeof value.entries === "function") {
      return this.array(
        [...value.entries()],
        true
        /* ordered */
      );
    }
  }
  error(err) {
    return this.write("error:" + err.toString());
  }
  boolean(bool) {
    return this.write("bool:" + bool);
  }
  string(string) {
    this.write("string:" + string.length + ":");
    this.write(string);
  }
  function(fn) {
    this.write("fn:");
    if (isNativeFunction(fn)) {
      this.dispatch("[native]");
    } else {
      this.dispatch(fn.toString());
    }
  }
  number(number) {
    return this.write("number:" + number);
  }
  null() {
    return this.write("Null");
  }
  undefined() {
    return this.write("Undefined");
  }
  regexp(regex) {
    return this.write("regex:" + regex.toString());
  }
  arraybuffer(arr) {
    this.write("arraybuffer:");
    return this.dispatch(new Uint8Array(arr));
  }
  url(url) {
    return this.write("url:" + url.toString());
  }
  map(map) {
    this.write("map:");
    const arr = [...map];
    return this.array(arr, false);
  }
  set(set) {
    this.write("set:");
    const arr = [...set];
    return this.array(arr, false);
  }
  bigint(number) {
    return this.write("bigint:" + number.toString());
  }
}
for (const type of [
  "uint8array",
  "uint8clampedarray",
  "unt8array",
  "uint16array",
  "unt16array",
  "uint32array",
  "unt32array",
  "float32array",
  "float64array"
]) {
  Hasher.prototype[type] = function(arr) {
    this.write(type + ":");
    return this.array([...arr], false);
  };
}
const nativeFunc = "[native code] }";
const nativeFuncLength = nativeFunc.length;
function isNativeFunction(f) {
  if (typeof f !== "function") {
    return false;
  }
  return Function.prototype.toString.call(f).slice(-nativeFuncLength) === nativeFunc;
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			tmp = new x.constructor();
			for (k in x) {
				if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
					tmp[k] = klona(x[k]);
				}
			}
		} else {
			tmp = {}; // null
			for (k in x) {
				if (k === '__proto__') {
					Object.defineProperty(tmp, k, {
						value: klona(x[k]),
						configurable: true,
						enumerable: true,
						writable: true,
					});
				} else {
					tmp[k] = klona(x[k]);
				}
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
		return tmp;
	}

	if (str === '[object Date]') {
		return new Date(+x);
	}

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	if (str === '[object DataView]') {
		return new x.constructor( klona(x.buffer) );
	}

	if (str === '[object ArrayBuffer]') {
		return x.slice(0);
	}

	// ArrayBuffer.isView(x)
	// ~> `new` bcuz `Buffer.slice` => ref
	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x);
	}

	return x;
}

const inlineAppConfig = {};



const appConfig = defuFn(inlineAppConfig);

const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char)) {
    return void 0;
  }
  return char !== char.toLowerCase();
}
function splitByCase(str, separators) {
  const splitters = STR_SPLITTERS;
  const parts = [];
  if (!str || typeof str !== "string") {
    return parts;
  }
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = splitters.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = void 0;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function kebabCase(str, joiner) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => p.toLowerCase()).join(joiner) : "";
}
function snakeCase(str) {
  return kebabCase(str || "", "_");
}

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/"
  },
  "nitro": {
    "routeRules": {}
  }
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  {
    return _sharedRuntimeConfig;
  }
}
_deepFreeze(klona(appConfig));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

function createContext(opts = {}) {
  let currentInstance;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  let als;
  if (opts.asyncContext) {
    const _AsyncLocalStorage = opts.AsyncLocalStorage || globalThis.AsyncLocalStorage;
    if (_AsyncLocalStorage) {
      als = new _AsyncLocalStorage();
    } else {
      console.warn("[unctx] `AsyncLocalStorage` is not provided.");
    }
  }
  const _getCurrentInstance = () => {
    if (als) {
      const instance = als.getStore();
      if (instance !== void 0) {
        return instance;
      }
    }
    return currentInstance;
  };
  return {
    use: () => {
      const _instance = _getCurrentInstance();
      if (_instance === void 0) {
        throw new Error("Context is not available");
      }
      return _instance;
    },
    tryUse: () => {
      return _getCurrentInstance();
    },
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = void 0;
      isSingleton = false;
    },
    call: (instance, callback) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return als ? als.run(instance, callback) : callback();
      } finally {
        if (!isSingleton) {
          currentInstance = void 0;
        }
      }
    },
    async callAsync(instance, callback) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = als ? als.run(instance, callback) : callback();
        if (!isSingleton) {
          currentInstance = void 0;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace(defaultOpts = {}) {
  const contexts = {};
  return {
    get(key, opts = {}) {
      if (!contexts[key]) {
        contexts[key] = createContext({ ...defaultOpts, ...opts });
      }
      return contexts[key];
    }
  };
}
const _globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis[globalKey] || (_globalThis[globalKey] = createNamespace());
const getContext = (key, opts = {}) => defaultNamespace.get(key, opts);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis[asyncHandlersKey] || (_globalThis[asyncHandlersKey] = /* @__PURE__ */ new Set());

const nitroAsyncContext = getContext("nitro-app", {
  asyncContext: true,
  AsyncLocalStorage: AsyncLocalStorage 
});

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter$1({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(false),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const envContext = event.node.req?.__unenv__;
      if (envContext) {
        Object.assign(event.context, envContext);
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (envContext?.waitUntil) {
          envContext.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => b$2(nodeHandler, aRequest);
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return O$2(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  {
    const _handler = h3App.handler;
    h3App.handler = (event) => {
      const ctx = { event };
      return nitroAsyncContext.callAsync(ctx, () => _handler(event));
    };
  }
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

const nitroApp = useNitroApp();
const handler = async (req) => {
  const url = new URL(req.url);
  const relativeUrl = `${url.pathname}${url.search}`;
  const r = await nitroApp.localCall({
    url: relativeUrl,
    headers: req.headers,
    method: req.method,
    body: req.body
  });
  const headers = normalizeResponseHeaders({
    ...getCacheHeaders(url.pathname),
    ...r.headers
  });
  return new Response(r.body, {
    status: r.status,
    headers
  });
};
const ONE_YEAR_IN_SECONDS = 365 * 24 * 60 * 60;
function normalizeResponseHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of Object.entries(headers)) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else if (header !== void 0) {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}
function getCacheHeaders(url) {
  const { isr } = getRouteRulesForPath(url);
  if (isr) {
    const maxAge = typeof isr === "number" ? isr : ONE_YEAR_IN_SECONDS;
    const revalidateDirective = typeof isr === "number" ? `stale-while-revalidate=${ONE_YEAR_IN_SECONDS}` : "must-revalidate";
    return {
      "Cache-Control": "public, max-age=0, must-revalidate",
      "Netlify-CDN-Cache-Control": `public, max-age=${maxAge}, ${revalidateDirective}, durable`
    };
  }
  return {};
}

export { $e as $, Ba as B, Da as D, En as E, Fn as F, G, Ha as H, Ma as M, Nn as N, O$1 as O, T$1 as T, Ua as U, F as a, T as b, cn as c, at as d, b as e, handler as h, jn as j, kn as k, lt as l, nt as n, pe as p, rt as r, u, va as v, xe as x, zn as z };
//# sourceMappingURL=nitro.mjs.map
