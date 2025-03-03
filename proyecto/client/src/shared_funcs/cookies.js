
/** This function sets or creates a cookie
 *  @param {string} name name of the cookie to fetch
 *  @param {string} value value to set cookie as
 *  @param {string} path path of the cookie
 *  @param {{}} [options={}] options of the cookie (eg. { expires: new Date() +1 })
 * 
 *  Function taken from first answer of: https://stackoverflow.com/questions/72368183/javascript-login-with-cookies
 */
function setCookie(name, value, path, options = {}) {
    options = {
        path: path,
        ...options
    };
    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value)
    for (let optionKey in options) {
        updatedCookie += "; " + optionKey
        let optionValue = options[optionKey]
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue
        }
    }
    document.cookie = updatedCookie;
}

/** This function gets a cookie by it's name
 *  @param {string} name name of the cookie to fetch
 * 
 *  Function taken from first answer of: https://stackoverflow.com/questions/72368183/javascript-login-with-cookies
 */
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ))
    return matches ? decodeURIComponent(matches[1]) : undefined
}

/** This function refreshes a cookie with the same value but adds extra time to it.
 * *MUST* pass path to cookie
 * @param {string} name name of the cookie to update
 * @param {string} path path of the cookie to update
 * @param {number} extraDuration time in minutes to extend the cookie
 */
function updateCookie(name, path, extraDuration) {
    var cookie = getCookie(name);
    var currDate = new Date();
    currDate.setMinutes(currDate.getMinutes()+extraDuration);
    setCookie(name, cookie, path, { expires: currDate });
}

/** This function gets the "user" cookie already parsed into a json, or undefined if not found
 */
function getUser() {
    var cookie = getCookie('user');
    if (cookie && cookie !== "undefined")
        return JSON.parse(cookie);
    return undefined;
}

export { setCookie, getCookie, updateCookie, getUser }