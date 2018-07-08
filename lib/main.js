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

class simpleSSR {

	constructor() {
		this.logs = true; // Enable or Disable logs
		this.safe = true; // Safe mode for preventing errors and simplifying error messages
		this.browser = undefined; // Chromium browser from pupeteer.launch()
		this.cacheManager = cacheManager; // To manually work with the cache
		this.blockedRequests = ['stylesheet', 'image', 'media', 'font', 'manifest']; // List of data types that are useless for rendering
	}

	///////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * Start browser and prepare SSR for work.
	 * @param {object} [config] Config for puppeteer.launch()
	 * @returns {Promise} 
	 */
	async start(config) {

		// Verify config correctness 
		if (this.safe) config = dataVerification.puppeteerConfig(config, this.logs);

		try {

			// Check if browser is already launched
			if (this.browser != undefined) {
				throw new Error('Browser has already been launched before!');
			}

			this.browser = await puppeteer.launch(config);
			if (this.logs) info(`Browser started!`);

		} catch (error) {
			if (this.logs) err(`Error starting browser!`);
			throw error;
		}
	}

	///////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Render specified URL.
	 * @param {string} url Render page URL
	 * @param {{timeout: number, domTarget: string, waitUntil: string|Array<string>, cache: boolean, cacheTime: number}} [config] Rendering config
	 * @returns {Promise}
	 */
	async render(url, config) {

		// Verify url and config correctness 
		if (this.safe) {
			url = dataVerification.renderURL(url, this.logs);
			config = dataVerification.renderConfig(config, this.logs);
		}

		try {

			// If link not specified
			if (url == undefined && this.safe) {
				throw new Error('URL for rendering is not specified!');
			}

			// If browser not started
			if (this.browser == undefined && this.safe) {
				await this.start(); // Start browser
				if (this.logs) warn(`Recommended to start browser manually!`);
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
						renderingTime: 0,
						cacheTimeout: cached.timeout
					};
				}
			}

			// Rendering start time
			let renderingTimeBEGIN = Date.now();

			// Open new page
			try {
				var page = await (this.browser).newPage();
				await page.setRequestInterception(true);
			} catch (error) {
				if (this.safe) {
					throw new Error('Error opening new tab!');
				} else {
					throw error;
				}
			}

			// Block all useless requests
			page.on('request', request => {
				if (this.blockedRequests.includes(request.resourceType())) {
					request.abort();
				} else {
					request.continue();
				}
			});

			// Open necessary url
			try {
				await page.goto(url, {
					timeout: config.timeout,
					waitUntil: config.waitUntil
				});
			} catch (error) {
				await page.close();
				if (this.safe) {
					throw new Error(`Timed out opening "${url}"!`);
				} else {
					throw error;
				}
			}

			// Wait for selector from domTarget parameter
			try {
				if (config.domTarget != undefined) {
					await page.waitForSelector(config.domTarget, {
						timeout: config.timeout
					});
				}
			} catch (error) {
				await page.close();
				if (this.safe) {
					throw new Error(`Timeout waiting "${config.domTarget}" in "${url}"!`);
				} else {
					throw error;
				}
			}

			// Finish rendering
			try {
				var renderedHTML = await page.content();
			} catch (error) {
				await page.close();
				if (this.safe) {
					throw new Error(`Error getting content from "${url}"!`);
				} else {
					throw error;
				}
			}

			await page.close(); // Close rendered page

			// Rendering finish time 
			let renderingTimeEND = Date.now();

			// Calculate rendering time
			let renderingTime = renderingTimeEND - renderingTimeBEGIN;

			// Save cache
			if (config.cache) {
				cacheManager.saveCache(url, renderedHTML, config.cacheTime);
				if (this.logs) info(`Successfully rendered and cached "${url}" ( ${renderingTime} ms )`);
			} else if (this.logs) {
				info(`Successfully rendered "${url}" ( ${renderingTime} ms )`);
			}

			return {
				html: renderedHTML,
				cached: false,
				renderingTime: renderingTime
			};

		} catch (error) {
			if (this.logs) err(`Error rendering "${url}"`);
			throw error;
		}
	}

	///////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Stop browser.
	 * @returns {Promise}
	 */
	async stop() {
		try {

			// Check if browser is not launched yet
			if (this.browser == undefined && this.safe) {
				throw new Error('Pupppeteer has not been launched yet!');
			}

			await (this.browser).close();
			this.browser = undefined;
			if (this.logs) info(`Browser closed!`);

		} catch (error) {
			if (this.logs) err(`Error closing browser!`);
			throw error;
		}
	}

	///////////////////////////////////////////////////////////////////////////////////////////////

}

// Export
module.exports = new simpleSSR();