function convertKeysToCamelCase(obj) {
    const camelCaseObj = {};

    Object.keys(obj).forEach(key => {
      const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      camelCaseObj[camelCaseKey] = obj[key];
    });
  
    return camelCaseObj;
  }

module.exports = convertKeysToCamelCase;