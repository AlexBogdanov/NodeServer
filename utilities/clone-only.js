const cloneOnly = (obj, properties) => {
    const newObj = {};

    properties.forEach(property => {
        if (property in obj) {
            newObj[property] = obj[property];
        }
    });

    return newObj;
};

module.exports = cloneOnly;
