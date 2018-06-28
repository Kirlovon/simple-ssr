/**
 *  Main library code 
 */

'use strict';

/** Dependencies */
const puppeteer = require('puppeteer');
const infoLogging = require('./infoLogging');
const cacheManager = require('./cacheManager');
const dataVerification = require('./dataVerification');

/** Logging setup */
const info = infoLogging.info;
const warn = infoLogging.warning;
const err = infoLogging.error;

class main {

	constructor() {
		this.logs = true;
		this.browser = undefined;
	}

	/**
	 * Start Puppeteer and prepare SSR for work.
	 * 
	 * @async
	 * @method start()
	 * @param {object} [config] Config for puppeteer.launch()
	 * @returns {Promise} 
	 */
	async start(config) {

		// Verify config correctness 
		config = dataVerification.puppeteerConfig(config, this.logs);

		try {

			// Check if browser is already launched
			if (this.browser != undefined) {
				if (this.logs) warn(`Puppeteer has already been launched!`);
				await this.stop(); // Close browser
			}

			if (this.logs) warn(`Puppeteer started!`);
			this.browser = await puppeteer.launch(config);

		} catch (error) {
			if (this.logs) err(`Error starting Puppeteer!`, error);
			throw error;
		}
	}

	/**
	 * Render specified URL.
	 * 
	 * @async
	 * @method render()
	 * @param {string} url Render page URL
	 * @param {{timeout: number, domTarget: string, waitUntil: string|Array<string>, cache: boolean, cacheTime: number}} [config] Rendering config
	 * @returns {Promise}
	 */
	async render(url, config) {

		// Verify url correctness 
		url = dataVerification.renderURL(url, this.logs);

		// Verify config correctness 
		config = dataVerification.renderConfig(config, this.logs);

		try {

			// If link not specified
			if (url != undefined) {
				throw 'You must specify URL for rendering!';
			}

			// If cache enabled
			if (config.cache == true) {

				// Delete outdated cache
				this.cache.clean();

				// Return, if cache finded
				let cached = this.cache.get(url);
				if (cached != null) {
					if (this.logs) info(`Successfully loaded from cache "${url}"`);
					return {
						html: cached.html,
						cached: true,
						timeout: cached.timeout
					};
				}
			}

			// Rendering start time
			let renderingTimeBEGIN = Date.now();

			// Open new page
			let page = await (this.browser).newPage();

			// Open necessary url
			await page.goto(url, {
				timeout: config.timeout,
				waitUntil: config.waitUntil
			});

			// Wait for selector from domTarget parameter
			if (config.domTarget != undefined) {
				await page.waitForSelector(config.domTarget, {
					timeout: config.timeout
				});
			}

			// Get content and close page
			let renderedHTML = await page.content();
			await page.close();

			// Get rendering finish time 
			let renderingTimeEND = Date.now();

			// Save cache
			if (config.cache) {
				this.cache.add(url, renderedHTML, config.cacheTime);
				if (this.logs) info(`Successfully rendered and cached "${url}" ( ${renderingTimeEND - renderingTimeBEGIN} ms )`);
			} else if (this.logs) {
				info(`Successfully rendered "${url}" ( ${renderingTimeEND - renderingTimeBEGIN} ms )`);
			}

			return {
				html: renderedHTML,
				cached: false
			};

		} catch (error) {
			if (this.logs) err(`Error rendering "${url}"`, error);
			throw error;
		}
	}

	/**
	 * Stop Puppeteer.
	 * 
	 * @async
	 * @method stop()
	 * @returns {Promise}
	 */
	async stop() {

		try {

			if (this.browser == undefined && this.logs == true) {
				warn(`Pupppeteer is not running!`);
			} else if (this.logs) {
				info(`Puppeteer closed!`);
			}

			await (this.browser).close();
			this.browser = undefined;

		} catch (error) {
			if (this.logs) err(`Error closing Puppeteer!`, error);
			throw error;
		}
	}

	/**
	 * Allows you to manually work with the cache
	 */
	get cache() {
		return {

			/**
			 * Cache new data.
			 * 
			 * @method cache.add()
			 * @param {string} url Link of the rendered page
			 * @param {object} data HTML of the rendered page
			 * @param {number} time Time in milliseconds before the cache becomes outdated. Set 0 to create eternal cache
			 */
			add(url, data, time) {
				cacheManager.saveCache(url, data, time);
			},

			/**
			 * Get all cached data.
			 *
			 * @method cache.get()
			 */
			getAll() {
				return cacheManager.cacheContent;
			},


			/**
			 * Get cached data.
			 *
			 * @method cache.get()
			 * @param {string} url Link to cached site
			 * @returns {{html:string, timeout:number}} Data from memory
			 */
			get(url) {
				return cacheManager.getCache(url);
			},

			/**
			 * Delete from memory outdated cache.
			 *
			 * @method cache.clean()
			 */
			clean() {
				cacheManager.cleanCache();
			},

			/**
			 * Delete all data from memory.
			 *
			 * @method cache.reset()
			 */
			reset() {
				cacheManager.resetCache();
			}

		};
	}


}

module.exports = new main();