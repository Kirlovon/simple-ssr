/** 
 * Beautiful logging
 */

'use strict';
const chalk = require('chalk');

module.exports = class {
	
	/**
	 * Standard information logging
	 * @param {string} message - Message for logging
	 */
	static info(message) {
		if (message) {
			console.info(
				'[Simple-SSR] ' + chalk.green(message)
			);
		}
	}

	/**
	 * Warnings logging
	 * @param {string} message - Message for logging
	 */
	static warn(message) {
		if (message) {
			console.warn(
				'[Simple-SSR] ' + chalk.yellow(message)
			);
		}
	}

	/**
	 * Errors logging
	 * @param {string} message - Message for logging
	 * @param {string} [error] - Error from try / catch
	 */
	static error(message, error) {
		if (error) console.error(error);
		if (message) {
			console.error(
				'[Simple-SSR] ' + chalk.red(message)
			);
		}

	}

};