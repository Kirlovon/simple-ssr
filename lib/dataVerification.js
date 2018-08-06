/** 
 *	Data verification
 */

'use strict';

/** Dependencies */
const nodeURL = require("url");
const infoLogging = require('./infoLogging');

/** Logging setup */
const warn = infoLogging.warning;

module.exports = class {

    /**
     * Verify config correctness.
     * @param {object} [config] Config to verify
     * @param {boolean} [logs] Enable or Disable logs
     * @returns {object} Return config in the right format. If config incorrect, return default config
     */
    static puppeteerConfig(config, logs) {

        if (logs && config != undefined && typeof config != 'object') {
            warn(`The Puppeteer config must be specified as a object, not as a ${typeof config}!`);
        }

		// Default config for puppeteer
        if (config == undefined || typeof config != 'object') {
			config = { headless: true, timeout: 16000, ignoreHTTPSErrors: true };
        }

        return config;
    }

    /**
     * Verify URL correctness.
     * @param {string} url URL to verify
     * @param {boolean} [logs] Enable or Disable logs
     * @returns {string} Return URL in the right format. If URL incorrect, return "undefined"
     */
    static renderURL(url, logs) {

        if (logs && url == undefined) {
            warn(`The URL must be specified!`);
        }

        if (logs && url != undefined && typeof url != 'string') {
            warn(`The URL must be specified as a string, not as a ${typeof url}!`);
        }

        // Test URL
        if (logs && typeof url == 'string') {
            var testURL = nodeURL.parse(url);
            if (!testURL.hostname) {
                warn(`There is a possibility that "${url}" is a wrong url! An example of how the URL should look like: "https://github.com/"`);
            }
        }

        if (typeof url != 'string') {
            url = undefined;
        }

        return url;
    }

    /**
     * Verify render config correctness.
     * @param {{timeout: number, domTarget: string, waitUntil: string|Array<string>, cache: boolean, cacheTime: number}} [config] Config to verify
     * @param {boolean} [logs] Enable or Disable logs
     * @returns {object} Return config in the right format. If config incorrect, return default config
     */
    static renderConfig(config, logs) {

        if (logs && config != undefined && typeof config != 'object') {
            warn(`The render configuration must be specified as a object, not as a ${typeof config}!`);
        }

        if (config == undefined || typeof config != 'object') {
            config = {};
        }

        if (config.timeout == undefined || typeof config.timeout != 'number') {
            config.timeout = 16000;
        }

        if (config.domTarget == undefined || typeof config.domTarget != 'string') {
            config.domTarget = undefined;
        }

        if (config.waitUntil == undefined || (typeof config.waitUntil != 'string' && typeof config.waitUntil != 'object')) {
            config.waitUntil = 'networkidle0';
        }

        if (config.cache == undefined || typeof config.cache != 'boolean') {
            config.cache = false;
        }

        if (config.cacheTime == undefined || typeof config.cacheTime != 'number') {
            config.cacheTime = 30000;
        }

        return config;
    }

};