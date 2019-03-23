const cloneOnly = (obj, properties) => {
    const newObj = {};

    properties.forEach(property => {
        newObj[property] = obj[property];
    });

    return newObj;
};

module.exports = cloneOnly;
