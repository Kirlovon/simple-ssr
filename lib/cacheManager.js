/**
 *	Cache data manager
 */

'use strict';

class cacheManager {

	constructor() {
		this.cache = new Map();
	}

	/**
	 * Get cached data.
	 * @param {string} url Link to cached site
	 * @returns {{html:string, timeout:number}} Data from memory
	 */
	getCache(url) {

		if (url != undefined && typeof url == 'string' && (this.cache).has(url)) {

			let cached = (this.cache).get(url);
			return cached.html;

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
		
		if (url != undefined && 
			data != undefined && 
			time != undefined && 
			typeof url == 'string' && 
			typeof data == 'string' && 
			typeof time == 'number') {

			let timeoutValue;

			// Delete old cache
			if ((this.cache).has(url)) {
				(this.cache).delete(url);
			}

			// Create eternal cache
			if (time == 0) {
				timeoutValue = null;
			} else {
				timeoutValue = Date.now() + time;
			}

			(this.cache).set(url, {
				html: data,
				timeout: timeoutValue
			});
		}

	}

	/**
	 * Delete cache
	 * @param {string} url Cache to delete
	 */
	deleteCache(url) {
		if (url != undefined && typeof url == 'string' && (this.cache).has(url)) {
			(this.cache).delete(url);
		}
	}

	/**
	 * Delete from memory outdated cache.
	 */
	cleanCache() {
		let now = Date.now();

		if ((this.cache).length != 0) {
			(this.cache).forEach((value, key) => {
				if (value.timeout <= now && value.timeout != null) {
					(this.cache).delete(key);
				}
			});
		}
	}

	/**
	 * Delete all data from memory.
	 */
	resetCache() {
		(this.cache).clear();
	}

}

// Export
module.exports = new cacheManager();