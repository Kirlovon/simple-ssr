/**
 * Simple-SSR
 * 
 * @module simple-ssr
 * @author Kirlovon
 * @license MIT
 * @version 0.5.0
 */

'use strict';

/** Main dependency */
const main = require('./lib/main');

module.exports = class {

	/**
	 * Start Puppeteer and prepare SSR for work.
	 * @static
	 * @method start()
	 * @param {object} [config] Config for puppeteer.launch()
	 * @returns {Promise}
	 */
	static start(config) {
		return main.start(config);
	}

	/**
	 * Render specified URL.
	 * @static
	 * @method render()
	 * @param {string} url Render page URL
	 * @param {{timeout: number, domTarget: string, waitUntil: string|Array<string>, cache: boolean, cacheTime: number}} [config] Rendering config
	 * @returns {Promise}
	 */
	static render(url, config) {
		return main.render(url, config);
	}

	/**
	 * Stop Puppeteer.
	 * @static
	 * @method stop()
	 * @returns {Promise}
	 */
	static stop() {
		return main.stop();
	}

	/**
	 * Allows to manually work with cache.
	 * @static
	 * @returns {object} Methods for working with the cache
	 */
	static get cache() {
		return {

			/**
			 * Cache new data.
			 * @method cache.add()
			 * @param {string} url Link of the rendered page
			 * @param {object} data HTML of the rendered page
			 * @param {number} time Time in milliseconds before the cache becomes outdated. Set 0 to create eternal cache
			 */
			add(url, data, time) {
				main.manuallyAddCache(url, data, time);
			},

			/**
			 * Get cached data.
			 * @method cache.get()
			 * @param {string} url Link to cached site
			 * @returns {{html:string, timeout:number}} Data from memory
			 */
			get(url) {
				return main.manuallyGetCache(url);
			},

			/**
			 * Get all cached data.
			 * @method cache.getAll()
			 * @returns {Map} Map array with all cached data
			 */
			getAll() {
				return main.getAll();
			},

			/**
			 * Delete from memory outdated cache.
			 * @method cache.clean()
			 */
			clean() {
				main.manuallyCleanCache();
			},

			/**
			 * Delete all cache.
			 * @method cache.reset()
			 */
			reset() {
				main.manuallyResetCache();
			}

		};
	}

	/**
	 * Other capabilities.
	 * @static
	 * @returns {object} Methods to work with library
	 */
	static get other() {
		return {

			/**
			 * Allows to change logs state.
			 * @param {boolean} state Enable or Disable default logs
			 */
			set logs(state) {
				main.logsState(state);
			},

			/**
			 * Allows to get logs state.
			 * @returns {boolean} Logs state
			 */
			get logs() {
				return main.logsState;
			},

			/**
			 * Allows to access puppeteer browser.
			 * @returns Puppeteer browser
			 */
			get browser() {
				return main.puppeteerBrowser;
			}

		};
	}

};