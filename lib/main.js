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

/** Main class */
class simpleSSR {

	constructor() {
		this.logs = true; // Enable or Disable logs
		this.safe = true; // Safe mode for preventing errors and simplifying error messages
		this.browser = undefined; // Chromium browser from pupeteer.launch()
		this.cacheManager = new cacheManager(); // To manually work with the cache
		this.blockedRequests = ['stylesheet', 'image', 'media', 'font', 'manifest']; // List of data types that are useless for rendering
	}

	///////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Start SimpleSSR and prepare SSR for work.
	 * @param {object} [config] Config for puppeteer.launch()
	 * @returns {Promise} 
	 */
	async start(config) {

		// Verify config correctness 
		if (this.safe) config = dataVerification.puppeteerConfig(config, this.logs);

		try {

			// Check if browser is already launched
			if (this.browser != undefined) {
				throw new Error('SimpleSSR has already been launched before!');
			}

			this.browser = await puppeteer.launch(config);
			if (this.logs) info(`SimpleSSR started!`);

		} catch (error) {
			if (this.logs) err(`Error starting SimpleSSR!`);
			throw error;
		}
	}

	///////////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * Render specified URL.
	 * @param {string} url URL to render
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
				await this.start(); // Start SimpleSSR
				if (this.logs) warn(`Recommended to start SimpleSSR manually!`);
			}

			// If cache enabled
			if (config.cache) {

				// Delete outdated cache
				(this.cacheManager).cleanCache();

				// Return, if cache found
				let cachedData = (this.cacheManager).getCache(url);
				if (cachedData != null) {
					if (this.logs) info(`Successfully loaded from cache "${url}"`);
					return {
						html: cachedData,
						cached: true,
						renderingTime: 0,
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
				if (this.safe) {
					await page.close();
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
				if (this.safe) {
					await page.close();
					throw new Error(`Timeout waiting "${config.domTarget}" in "${url}"!`);
				} else {
					throw error;
				}
			}

			// Finish rendering
			try {
				var renderedHTML = await page.content();
			} catch (error) {
				if (this.safe) {
					await page.close();
					throw new Error(`Error getting content from "${url}"!`);
				} else {
					throw error;
				}
			}

			await page.close(); // Close rendered page

			// Calculate rendering time
			let renderingTime = Date.now() - renderingTimeBEGIN;

			// Save cache
			if (config.cache) {
				(this.cacheManager).saveCache(url, renderedHTML, config.cacheTime);
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
	 * Stop SimpleSSR.
	 * @returns {Promise}
	 */
	async stop() {
		try {

			// Check if browser is not launched yet
			if (this.browser == undefined && this.logs) {
				warn(`SimpleSSR has not been launched yet!`);
			}

			// Close browser
			if (this.browser != undefined) {
				await (this.browser).close();
				this.browser = undefined;
			}
			
			// Delete all cache
			(this.cacheManager).resetCache();

			if (this.logs) info(`SimpleSSR stopped!`);

		} catch (error) {
			if (this.logs) err(`Error stopping SimpleSSR!`);
			throw error;
		}
	}

	///////////////////////////////////////////////////////////////////////////////////////////////

}

// Export
module.exports = new simpleSSR();