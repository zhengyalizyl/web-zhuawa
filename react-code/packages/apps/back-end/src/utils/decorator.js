

export const RequestMethod = {
  GET: "get",
  POST: "post",
  PUT: "put",
  DELETE: 'delete'
};

export const controllers = [];


export function Controller(prefix = "") {
  return function(target) {
     console.log(prefix,target,'-----Controller')
      target.prefix = prefix;
  }
}

export function RequestMapping(method = "", url = "") {
  return function(target, name) {
    console.log(target,name)
      let path = url  || `/${name}`;

      const item = {
          path,
          method,
          handler: target[name],
          constructor: target.constructor,
      };

      controllers.push(item);
  }
}
