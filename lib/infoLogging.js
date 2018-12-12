/** 
 *	Beautiful logging
 */

'use strict';

/** Dependencies */
const chalk = require('chalk');

module.exports = class {

	/**
	 * Standard information logging.
	 * @param {string} message Message for logging
	 */
	static info(message) {
		if (typeof message !== 'undefined') {
			console.info(
				chalk.green('[Simple-SSR] ' + message)
			);
		}
	}

	/**
	 * Warnings logging.
	 * @param {string} message Message for logging
	 */
	static warning(message) {
		if (typeof message !== 'undefined') {
			console.warn(
				chalk.yellow('[Simple-SSR] ' + message)
			);
		}
	}

	/**
	 * Errors logging.
	 * @param {string} message Message for logging
	 */
	static error(message) {
		if (typeof message !== 'undefined') {
			console.error(
				chalk.red('[Simple-SSR] ' + message)
			);
		}

	}

};