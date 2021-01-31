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

    /**
     * Generates a string of random alpha-numeric characters.
     * 
     * @param {number} length The number of characters desired in the returned value.
     * @returns string of random alpha-numeric characters
     */
    getRandomString: (length) => {
        var str   = '';
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < length; i++) {
            str += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return str;
    },

    getFormattedDateStr: (dateTimeStr) => {
        let date = new Date(dateTimeStr);

        if(date == "Invalid Date") {
            date = new Date();
        }
        
        const mm = String(date.getMonth() + 1).padStart(2, 0);
        const dd = String(date.getDate()).padStart(2, 0);
        const yyyy = date.getFullYear();
        
        return `${mm}/${dd}/${yyyy}`;
    },
}