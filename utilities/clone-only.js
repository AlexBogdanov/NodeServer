const cloneOnly = (obj, properties) => {
    const newObj = {};

    properties.forEach(p => {
        if (p in obj) {
            newObj[p] = obj[p];
        }
    });

    return newObj;
};

const allExcept = (obj, properties) => {
    const newObj = {};

    Object.keys(obj)
        .filter(p => !properties.includes(p))
        .forEach(p => {
            newObj[p] = obj[p];
        });

    return newObj;
}

module.exports = {
    cloneOnly,
    allExcept
};
