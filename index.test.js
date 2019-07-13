/* eslint-disable */
const assert = require('chai').assert;

describe('SimpleSSR', function () {

	this.timeout(60000);

	it('Try to render "example.com"', async () => {
		try {
			var simpleSSR = require('./index');
			await simpleSSR.start({ timeout: 20000 });

			const data = await simpleSSR.render('http://example.com/');

			assert.include(data.html, 'Example Domain');
			assert.equal(data.url, 'http://example.com/');
			assert.isDefined(data.time);

			await simpleSSR.stop();
		} catch (error) {
			await simpleSSR.stop();
			throw error;
		}
	});

	it('Try to render "example.com" with specified DOM target', async () => {
		try {
			var simpleSSR = require('./index');
			await simpleSSR.start({ timeout: 20000 });

			const data = await simpleSSR.render('http://example.com/', {
				domTarget: ['body', 'h1', 'p']
			});

			assert.include(data.html, 'Example Domain');
			assert.equal(data.url, 'http://example.com/');
			assert.isDefined(data.time);

			await simpleSSR.stop();
		} catch (error) {
			await simpleSSR.stop();
			throw error;
		}
	});

	it('Try to render "example.com" without starting SimpleSSR', async () => {
		try {
			var simpleSSR = require('./index');
			const data = await simpleSSR.render('http://example.com/');

			assert.include(data.html, 'Example Domain');
			assert.equal(data.url, 'http://example.com/');
			assert.isDefined(data.time);

			await simpleSSR.stop();
		} catch (error) {
			await simpleSSR.stop();
			throw error;
		}
	});

});