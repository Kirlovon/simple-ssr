/** 
 * Data verification
 */

'use strict';

/** Dependencies */
const logging = require('./infoLogging');

/** Logging setup */
const warn = logging.warn;

module.exports = class {

	/**
	 * Verify config correctness.
	 * 
	 * @static
	 * @method puppeteerConfig
	 * @param {object} config Config to verify
	 * @param {boolean} logs Enable or Disable logs
	 * @returns {object} Return config in the right format. If config incorrect, return default config
	 */
	static puppeteerConfig(config, logs) {

		if (config == undefined || typeof config != 'object') {
			config = { // Default config for puppeteer
				headless: true,
				timeout: 16000,
				ignoreHTTPSErrors: true,
			};
		}

		if (typeof config != 'object' && logs == true) {
			warn(`The wrong Puppeteer configuration is specified!`);
		}

		return config;
	}

	/**
	 * Verify URL correctness.
	 * 
	 * @static
	 * @method renderURL
	 * @param {string} url URL to verify
	 * @param {boolean} logs Enable or Disable logs
	 * @returns {string} Return URL in the right format. If URL incorrect, return "undefined"
	 */
	static renderURL(url, logs) {

		if (url == undefined || typeof url != 'string') {
			url = undefined;
		}

		if (logs == true) {
			if (url == undefined) {
				warn(`You must specify URL for rendering!`);
			} else if (typeof url != 'string') {
				warn(`You must specify correct URL for rendering!`);
			}
		}

		return url;
	}

	/**
	 * Verify render config correctness.
	 * 
	 * @static
	 * @method renderConfig
	 * @param {object} config Config to verify
	 * @param {boolean} logs Enable or Disable logs
	 * @returns {object} Return config in the right format. If config incorrect, return default config
	 */
	static renderConfig(config, logs) {

		if (config == undefined || typeof config != 'object') {
			config = {};
		}

		if (logs == true && config != undefined && typeof config != 'object') {
			warn(`The wrong render configuration is specified!`);
		}

		if (config.timeout == undefined || typeof config.timeout != 'number') {
			config.timeout = 16000;
		}

		if (config.domTarget == undefined || typeof config.domTarget != 'string') {
			config.domTarget = null;
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