const fs = require('fs');
const path = require('path');

module.exports = dependecies => {
    const controllers = {};

    fs.readdirSync(__dirname)
        .filter(file => file.includes('-controller'))
        .forEach(file => {
            const controllerModule = require(path.join(__dirname, file))(dependecies);
            const moduleName = `${file.substring(0, file.indexOf('-controller'))}Controller`;
            controllers[moduleName] = controllerModule;
        });

    return controllers;
};
