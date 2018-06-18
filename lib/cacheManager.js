/**
 *  Cache data manager
 */

'use strict';

/** Dependencies */
const logging = require('./infoLogging');

/** Logging setup */
const info = logging.info;

module.exports = class {

	constructor() {
		this.cacheContent = new Map();
	}

	/**
	 * Get cached data.
	 *
	 * @static
	 * @param {string} url Link to cached site
	 * @returns {object}
	 */
	static getCache(url) {
		if ((this.cacheContent).has(url)) {
			let cachedData = (this.cacheContent).get(url);
			info(`Successfully loaded from cache "${url}"`);
			return {
				html: cachedData,
				timeout: cachedData.timeout,
			};
		}
	}

	/**
	 * Cache new data.
	 *
	 * @static
	 * @method saveCache
	 * @param {string} url Link of the rendered page
	 * @param {string} data HTML of the rendered page
	 * @param {number} time Time in milliseconds before the cache becomes outdated
	 */
	static saveCache(url, data, time) {
		if ((this.cacheContent).has(url) == false) {
			(this.cacheContent).set(url, {
				html: data,
				timeout: Date.now() + time
			});
		}
	}

	/**
	 * Delete from memory outdated cache.
	 *
	 * @static
	 * @method cleanCache
	 */
	static cleanCache() {
		let now = Date.now();
		if ((this.cacheContent).length != 0) {
			(this.cacheContent).forEach((value, key) => {
				if (value.timeout <= now) {
					(this.cacheContent).delete(key);
				}
			});
		}
	}

	/**
	 * Delete all data from memory.
	 *
	 * @static
	 * @method resetCache
	 */
	static resetCache() {
		this.cacheContent = new Map();
	}

};