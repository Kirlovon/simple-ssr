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
	 * @returns {object} Return config in the right format
	 */
	static puppeteerConfig(config, logs) {

		if (config == undefined || typeof config != 'object') {
			config = {
				headless: true,
				timeout: 16000,
				ignoreHTTPSErrors: true,
			};
		}

		if (typeof config != 'object' && logs == true) {
			warn(`The wrong Puppeteer configuration is specified`);
		}

		return config;
	}

};