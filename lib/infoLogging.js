/** 
 * Beautiful logging
 */

'use strict';

/** Dependencies */
const chalk = require('chalk');

module.exports = class {

	/**
	 * Standard information logging.
	 * @method info()
	 * @param {string} message Message for logging
	 */
	static info(message) {
		if (message != undefined) {
			console.info(
				chalk.green('[Simple-SSR] ' + message)
			);
		}
	}

	/**
	 * Warnings logging.
	 * @method warning()
	 * @param {string} message Message for logging
	 */
	static warning(message) {
		if (message != undefined) {
			console.warn(
				chalk.yellow('[Simple-SSR] ' + message)
			);
		}
	}

	/**
	 * Errors logging.
	 * @method error()
	 * @param {string} message Message for logging
	 */
	static error(message) {
		if (message != undefined) {
			console.error(
				chalk.red('[Simple-SSR] ' + message)
			);
		}

	}

};