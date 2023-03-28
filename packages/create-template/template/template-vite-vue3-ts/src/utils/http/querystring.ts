const has = Object.prototype.hasOwnProperty;
const undef: any = undefined;

/**
 * Decode a URI encoded string.
 *
 * @param {String} input The URI encoded string.
 * @returns {String|Null} The decoded string.
 */
export function decode(input: string): string {
  try {
    return decodeURIComponent(input.replace(/\+/g, " "));
  } catch (e) {
    return "";
  }
}

/**
 * Attempts to encode a given input.
 *
 * @param {String} input The string that needs to be encoded.
 * @returns {String|Null} The encoded string.
 */
export function encode(input: string): string {
  try {
    return encodeURIComponent(input);
  } catch (e) {
    return "";
  }
}

/**
 * Simple query string parser.
 *
 * @param {String} query The query string that needs to be parsed.
 * @returns {Object}
 */
export function parse(query: string): Common.AnyStringObj {
  const parser = /([^=?&]+)=?([^&]*)/g;
  const result: Common.AnyStringObj = {};
  let part;

  while ((part = parser.exec(query))) {
    const key = decode(part[1]);
    const value = decode(part[2]);
    if (key === null || value === null || key in result) continue;
    result[key] = value;
  }

  return result;
}

/**
 * Transform a query string to an object.
 *
 * @param {Object} obj Object that should be transformed.
 * @param {String} prefix Optional prefix.
 * @returns {String}
 */
export function stringify(obj: Common.AnyStringObj, prefix?: string): string {
  prefix = prefix || "";

  const pairs = [];
  let value: any, key: string;

  // Optionally prefix with a '?' if needed
  if (typeof prefix !== "string") prefix = "?";

  for (key in obj) {
    if (has.call(obj, key)) {
      value = obj[key];
      // Edge cases where we actually want to encode the value to an empty
      // string instead of the stringified value.
      if (!value && (value === null || value === undef || isNaN(value))) {
        value = "";
      }
      key = encodeURIComponent(key);
      value = encodeURIComponent(value);
      // If we failed to encode the strings, we should bail out as we don't
      // want to add invalid strings to the query.
      if (key === null || value === null) continue;
      pairs.push(key + "=" + value);
    }
  }

  return pairs.length ? prefix + pairs.join("&") : "";
}

/**
 * 路径参数对象
 */
interface UrlParams {
  query: Common.AnyStringObj;
  path: string;
  hash?: string;
}

/**
 * 分解路径参数 以 '?' 为标志
 */
function parseQuestionMark(block: string): string {
  let paramStr = "";
  if (block.includes("?")) {
    const questionSplit = block.split("?");
    for (let i = questionSplit.length - 1; i >= 0; i--) {
      const item = questionSplit[i];
      if (item.includes("=")) {
        paramStr = item.replaceAll("/", "");
      }
    }
  }
  return paramStr;
}

/**
 * 获取路径参数
 */
export function parseUrl(sourceUrl: string): UrlParams {
  const paramsGroup: string[] = [];
  let query: Common.AnyStringObj = {};
  let hash = "";
  // 获取标志的位置
  const indexHash = sourceUrl.indexOf("#");
  // 如果存在 #，先根据 # 分解字符串
  if (indexHash > -1) {
    const hashSplit = sourceUrl.split("#");
    for (let i = hashSplit.length - 1; i >= 0; i--) {
      const item = hashSplit[i];
      const paramStr = parseQuestionMark(item);
      if (paramStr) {
        paramsGroup.push(paramStr);
      }
      if (i === 1) {
        hash = item; // # 后面内容判断为哈希值
      }
    }
  } else {
    // 根据 ? 分解字符串
    const paramStr = parseQuestionMark(sourceUrl);
    if (paramStr) {
      paramsGroup.push(paramStr);
    }
  }
  if (paramsGroup.length > 0) {
    query = parse(paramsGroup.join("&"));
  }
  // 截取掉第一个 ?|# 后面的内容
  const path = sourceUrl.replaceAll(/(#.*|\?.*)/g, "");
  return { query, path, hash };
}

// Expose the module.
export default {
  parseUrl,
  stringify,
  parse,
  encode,
  decode
};
