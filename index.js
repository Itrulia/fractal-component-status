const filterStatuses = require("./filter-statuses");
const defaults = require("./defaults");
const {compose} = require("ramda");
const {yellow, bold, grey} = require("chalk")

const logWarning = compose(
    console.log,
    yellow
);

const logWarningTitle = compose(
    logWarning,
    bold
);

const logSaturated = compose(
    console.log,
    grey
);

module.exports = function componentStatusParser(opts = {}) {
    const config = {
        ...defaults,
        ...opts
    };

    const filter = filterStatuses(config.whitelist, config.blacklist);

    return {
        name: "component-status-parser",
        transform: "components",
        handler(components, state, app) {
            const errors = [];

            const comps = components.map(component => {
                const compStatus = component.getConfig("status") ?
                    component.getConfig("status") :
                    config.defaultStatus;

                const status = config.statuses.find(s => s.id === compStatus);

                if (!status) {
                    errors.push({
                        status: compStatus,
                        component: component.src.stem
                    });
                }

                component.status = status;

                return component;
            });

            if (errors.length) {
                logSaturated("\n\n-------\n");

                logWarningTitle(`There have been ${errors.length} errors filtering your components: \n`);

                errors.forEach(error => logWarning((`'${error.status}' was used in '${error.component}' but never defined in the '@itrulia/fractal-component-status' config!`)));

                logSaturated("\n-------\n");
            }

            return filter(comps);
        }
    }
}