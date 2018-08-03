/* eslint-disable */

const simpleSSR = require('../lib/main');
const assert = require('chai').assert;

describe('main', () => {

	beforeEach(done => {
		simpleSSR.logs = false;
		(async () => {
			await simpleSSR.start();
			done();
		})();
	}, 60000);

	afterEach(done => {
		(async () => {
			await simpleSSR.stop();
			done();
		})();
	}, 60000);

	it('Try to render "example.com"', done => {
		(async () => {
			let data = await simpleSSR.render('http://example.com/');
			assert.include(data.html, 'Example Domain');
			assert.equal(data.cached, false);
			done();
		})();
	}).timeout(60000);

	it('Try to render "example.com and cache it"', done => {
		(async () => {

			await simpleSSR.render('http://example.com/', {
				cache: true,
				cacheTime: 10000,
			});

			let cacheReadingStart = Date.now();
			let data = await simpleSSR.render('http://example.com/', {
				cache: true,
			});
			let cacheReadingTime = Date.now() - cacheReadingStart;

			assert.isBelow(cacheReadingTime, 100, "Cache reading should be fast");
			assert.include(data.html, 'Example Domain');
			done();
		})();
	}).timeout(60000);

	it('Try to render "example.com" without starting SimpleSSR', done => {
		simpleSSR.stop().then(async () => {

			let data = await simpleSSR.render('http://example.com/');
			assert.include(data.html, 'Example Domain');
			done();

		});
	}).timeout(60000);

	it('Try to start SimpleSSR twice', done => {
		simpleSSR.start().then(() => {
			assert.fail('No errors!');
			done();
		}).catch(error => {
			assert.exists(error);
			assert.equal(error.message, "SimpleSSR has already been launched before!");
			done();
		});
	}).timeout(60000);

	it('Try to render without link', done => {
		simpleSSR.render().then(() => {
			assert.fail('No errors!');
			done();
		}).catch(error => {
			assert.exists(error);
			assert.equal(error.message, "URL for rendering is not specified!");
			done();
		});
	}).timeout(60000);

});