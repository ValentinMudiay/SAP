module.exports = {
    /**
     * Converts a one dimensional Javascript object to query string format.
     * 
     * @param {object} json Object to be converted.
     * @returns {string} a query string that can be appended to a URL.
     */
    jsonToQueryStr: (json) => {
        let str = "";

        Object.keys(json).forEach((key, i, arr) => {
            str += `${key}=${json[key]}`;
            str += i !== arr.length-1 ? "&" : "";
        });

        return str;
    },
}