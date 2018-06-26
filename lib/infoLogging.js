/** 
 * Beautiful logging
 */

'use strict';

/** Dependencies */
const chalk = require('chalk');

module.exports = class {
	
	/**
	 * Standard information logging.
	 * 
	 * @static
	 * @method info
	 * @param {string} message Message for logging
	 */
	static info(message) {
		if (message != undefined) {
			console.info(
				'[Simple-SSR] ' + chalk.green(message)
			);
		}
	}

	/**
	 * Warnings logging.
	 * 
	 * @static
	 * @method warning
	 * @param {string} message Message for logging
	 */
	static warning(message) {
		if (message != undefined) {
			console.warn(
				'[Simple-SSR] ' + chalk.yellow(message)
			);
		}
	}

	/**
	 * Errors logging.
	 * 
	 * @static
	 * @method error
	 * @param {string} message Message for logging
	 * @param {string} [error] Error from try / catch
	 */
	static error(message, error) {
		if (error != undefined) console.error(error);
		if (message != undefined) {
			console.error(
				'[Simple-SSR] ' + chalk.red(message)
			);
		}

	}

};