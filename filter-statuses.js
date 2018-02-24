module.exports = (whitelist, blacklist) => {
    return components => {
        if (whitelist && whitelist.length) {
            return components.filter(component => blacklist.includes(component.status));
        }

        if (blacklist && blacklist.length) {
            return components.filter(component => !blacklist.includes(component.status));
        }

        return components;
    }
};