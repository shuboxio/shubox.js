export function mergeObject(...target: object[]) {
  var builtHash = {};

  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];

    for (var key in arg) {
      if (arg.hasOwnProperty(key)) {
        builtHash[key] = arg[key];
      }
    }
  }

  return builtHash;
}
