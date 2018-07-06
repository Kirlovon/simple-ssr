/**
 *  Cache data manager
 */

'use strict';

class cacheManager {

	constructor() {
		this.cacheContent = new Map();
	}

	/**
	 * Get cached data.
	 * @param {string} url Link to cached site
	 * @returns {{html:string, timeout:number}} Data from memory
	 */
	getCache(url) {
		if ((this.cacheContent).has(url)) {
			let cached = (this.cacheContent).get(url);
			return {
				html: cached.html,
				timeout: cached.timeout,
			};
		} else {
			return null;
		}
	}

	/**
	 * Cache new data.
	 * @param {string} url Link of the rendered page
	 * @param {string} data HTML of the rendered page
	 * @param {number} time Time in milliseconds before the cache becomes outdated. Set 0 to create eternal cache
	 */
	saveCache(url, data, time) {
		if ((this.cacheContent).has(url) == false) {

			let timeoutValue;

			if (time == 0) { // Create eternal cache
				timeoutValue = null;
			} else {
				timeoutValue = Date.now() + time;
			}

			(this.cacheContent).set(url, {
				html: data,
				timeout: timeoutValue
			});
		}
	}

	/**
	 * Delete from memory outdated cache.
	 */
	cleanCache() {
		let now = Date.now();
		if ((this.cacheContent).length != 0) {
			(this.cacheContent).forEach((value, key) => {
				if (value.timeout <= now && value.timeout != null) {
					(this.cacheContent).delete(key);
				}
			});
		}
	}

	/**
	 * Delete all data from memory.
	 */
	resetCache() {
		this.cacheContent = new Map();
	}

}

// Export
module.exports = new cacheManager();