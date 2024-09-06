export const NoFlags = /* */ 0b00000000000000000000;
export const Placement = /* */ 0b0000000000000000000010;//2
export const Update = /* */ 0b0000000000000000000100;//4
export const Deletion = /* */ 0b0000000000000000001000;//8

export function isStr(s) {
  return typeof s === "string";
}
export function isStringOrNumber(s) {
  return typeof s === "string" || typeof s === "number";
}
export function isFn(fn) {
  return typeof fn === "function";
}
export function isArray(arr) {
  return Array.isArray(arr);
}

export function isUndefined(s) {
  return s === undefined;
}

export function updateNode(node, prevVal, nextVal) {
  Object.keys(prevVal).forEach((k) => {
    if (k === 'children') {
      if (isStringOrNumber(nextVal[k])) {
        nextVal.textContent = '';
      }
    } else if (k.slice(0, 2) == 'on') {
      const eventName = k.slice(2).toLocaleLowerCase();
      node.removeEventListener(eventName,prevVal[k]);
    }else {
      if (!(k in nextVal)) {
        node[k] = '';
      }
    }
  })

  Object.keys(nextVal).forEach((k) => {
    if (k === 'children') {
      if (isStringOrNumber(nextVal[k])) {
        nextVal.textContent = nextVal[k];
      }


    } else if (k.slice(0, 2) == 'on') {
      const eventName = k.slice(2).toLocaleLowerCase();
      node.addEventListener(eventName, nextVal[k]);
    } else {
      node[k] = nextVal[k];
    }
  })
}