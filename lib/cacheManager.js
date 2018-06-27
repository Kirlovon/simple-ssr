/**
 *  Cache data manager
 */

'use strict';

module.exports = class {

	constructor() {
		this.cacheContent = new Map();
	}

	/**
	 * Get cached data.
	 *
	 * @static
	 * @method getCache
	 * @param {string} url Link to cached site
	 * @returns {{html:string, timeout:number}} Data from memory
	 */
	static getCache(url) {
		if ((this.cacheContent).has(url)) {
			let cachedData = (this.cacheContent).get(url);
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