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
const err = infoLogging.error;

class simpleSSR {

	constructor() {
		this.logs = true;
		this.browser = undefined;
		this.cacheManager = cacheManager; // To manually work with the cache
	}

	///////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * Start Puppeteer and prepare SSR for work.
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
				throw `Puppeteer has already been launched!`;
			}

			if (this.logs) info(`Puppeteer started!`);
			this.browser = await puppeteer.launch(config);

		} catch (error) {
			if (this.logs) err(`Error starting Puppeteer!`);
			throw new Error(error);
		}
	}

	///////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Render specified URL.
	 * @async
	 * @method render()
	 * @param {string} url Render page URL
	 * @param {{timeout: number, domTarget: string, waitUntil: string|Array<string>, cache: boolean, cacheTime: number}} [config] Rendering config
	 * @returns {Promise}
	 */
	async render(url, config) {

		// Verify url and config correctness 
		url = dataVerification.renderURL(url);
		config = dataVerification.renderConfig(config, this.logs);

		try {

			// If link not specified
			if (url == undefined) {
				throw 'URL for rendering is not specified!';
			}

			// If Puppeteer not started
			if (this.browser == undefined) {
				throw 'Puppeteer is not started!';
			}

			// If cache enabled
			if (config.cache == true) {

				// Delete outdated cache
				cacheManager.cleanCache();

				// Return, if cache found
				let cached = cacheManager.getCache(url);
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
				cacheManager.saveCache(url, renderedHTML, config.cacheTime);
				if (this.logs) info(`Successfully rendered and cached "${url}" ( ${renderingTimeEND - renderingTimeBEGIN} ms )`);
			} else if (this.logs) {
				info(`Successfully rendered "${url}" ( ${renderingTimeEND - renderingTimeBEGIN} ms )`);
			}

			return {
				html: renderedHTML,
				cached: false
			};

		} catch (error) {
			if (this.logs) err(`Error rendering "${url}"`);
			throw new Error(error);
		}
	}

	///////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Stop Puppeteer.
	 * @async
	 * @method stop()
	 * @returns {Promise}
	 */
	async stop() {
		try {

			// Check if Puppeteer is not launched yet
			if (this.browser == undefined) {
				throw `Pupppeteer has not been launched yet!`;
			}

			await (this.browser).close();
			this.browser = undefined;
			if (this.logs) info(`Puppeteer closed!`);

		} catch (error) {
			if (this.logs) err(`Error closing Puppeteer!`);
			throw new Error(error);
		}
	}

	///////////////////////////////////////////////////////////////////////////////////////////////

}

// Export
module.exports = new simpleSSR();