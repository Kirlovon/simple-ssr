'use strict';

const puppeteer = require('puppeteer');

/**
 * Simple-SSR 🚩
 * Universal server-side rendering implementation for Node.js
 */
class SimpleSSR {

	constructor() {

		/**
		 * Puppeteer instance
		 */
		this.browser = undefined;

		/**
		 * Enable requests filtering ( Default: true )
		 */
		this.filterRequests = true;

		/**
		 * List of useless for DOM rendering resources
		 */
		this.blockedRequests = ['stylesheet', 'image', 'media', 'font', 'manifest'];
	}

	/**
	 * Start SimpleSSR
	 * @param {puppeteer.LaunchOptions} [config={ headless: true, timeout: 10000 }] Config for Puppeteer instance.
	 */
	async start(config = { headless: true, timeout: 10000 }) {
		if (typeof config !== 'object') throw new TypeError('Config must be an object');
		if (typeof config.headless !== 'boolean') config.headless = true;
		if (typeof config.timeout !== 'number') config.timeout = 10000;

		// Check if browser is already launched
		if (typeof this.browser !== 'undefined') {
			throw new SimpleSSRError('Puppeteer has already been launched before');
		}

		try {
			this.browser = await puppeteer.launch(config);
		} catch (error) {
			throw new SimpleSSRError('Error launching Puppeteer', error);
		}
	}

	/**
	 * Render page from specified URL.
	 * @param {string} url Page URL.
	 * @param {{ timeout: number, domTarget: string|string[]|null, waitUntil: string }} [config={ timeout: 10000, domTarget: null, waitUntil: 'networkidle0' }] Rendering config.
	 * @returns Rendering result.
	 */
	async render(url, config = { timeout: 10000, domTarget: null, waitUntil: 'networkidle0' }) {
		if (typeof url !== 'string') throw new TypeError('URL must be a string');
		if (typeof config !== 'object') throw new TypeError('Config must be an object');

		if (typeof config.timeout !== 'number') config.timeout = 10000;
		if (typeof config.domTarget !== 'string' && !Array.isArray(config.domTarget)) config.domTarget = null;
		if (typeof config.waitUntil !== 'string') config.waitUntil = 'networkidle0';

		// Launch puppeteer, if it is not launched yet
		if (typeof this.browser === 'undefined') await this.start({ headless: true, timeout: config.timeout });

		// Rendering start time
		const renderingStart = Date.now();

		// Open new page
		try {
			var page = await this.browser.newPage();
			if (this.filterRequests) await page.setRequestInterception(true);
		} catch (error) {
			throw new SimpleSSRError('Error opening new page', error);
		}

		// Block all useless requests
		if (this.filterRequests) page.on('request', request => {
			const resourceType = request.resourceType();

			if (this.blockedRequests.includes(resourceType)) {
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
			throw new SimpleSSRError(`Error opening "${url}"`, error);
		}

		// Wait for selectors
		if (typeof config.domTarget === 'string') {

			try {
				await page.waitForSelector(config.domTarget, {
					timeout: config.timeout
				});
			} catch (error) {
				await page.close();
				throw new SimpleSSRError(`Timeout waiting selector "${config.domTarget}"`, error);
			}

		} else if (Array.isArray(config.domTarget)) {
			for (const target of config.domTarget) {

				if (typeof target !== 'string') throw new TypeError('DOM target must be a string or array of strings');

				try {
					await page.waitForSelector(target, {
						timeout: config.timeout
					});
				} catch (error) {
					await page.close();
					throw new SimpleSSRError(`Timeout waiting selector "${target}"`, error);
				}

			}
		}

		// Finish rendering
		try {
			var html = await page.content();
		} catch (error) {
			await page.close();
			throw new SimpleSSRError(`Error getting content from "${url}"`, error);
		}

		// Close rendered page
		await page.close();

		// Calculate rendering time
		const time = Date.now() - renderingStart;

		return { url, time, html };
	}

	/** 
	 * Stop SimpleSSR
	 */
	async stop() {
		try {
			await this.browser.close();
			this.browser = undefined;
		} catch (error) {
			throw new SimpleSSRError('Error closing Puppeteer', error);
		}
	}
}

/**
 * Custom error.
 */
class SimpleSSRError extends Error {
	constructor(message, cause) {
		super(message);

		Error.captureStackTrace(this, this.constructor);

		this.name = 'SimpleSSRError';
		this.message = message;
		if (typeof cause !== 'undefined') this.cause = cause;
	}
}

const SimpleSSRInstance = new SimpleSSR();
module.exports = SimpleSSRInstance;