/* eslint-disable */

const cacheManager = require('../lib/cacheManager');
const assert = require('chai').assert;
const cache = cacheManager.cache;

describe('cacheManager', () => {

	beforeEach(done => {
		cache.clear();
		cache.set('something', {
			html: 'HTML',
			timeout: 100000
		});
		done();
	});

	afterEach(done => {
		cache.clear();
		done();
	});

	it('Check saveCache() method', done => {

		cacheManager.saveCache('something2', 'HTML2', 200000);
		let cachedData = cache.get('something2');
		assert.equal(cachedData.html, 'HTML2');

		done();
	}).timeout(5000);

	it('Check getCache() method', done => {

		let cachedData = cacheManager.getCache('something');
		assert.equal(cachedData, 'HTML');

		done();
	}).timeout(5000);

	it('Check deleteCache() method', done => {

		cacheManager.deleteCache('something');
		assert.isEmpty(cache);

		done();
	}).timeout(5000);

	it('Check cleanCache() method', done => {

		cacheManager.cleanCache();
		assert.isEmpty(cache);

		done();
	}).timeout(5000);

	it('Check resetCache() method', done => {

		cacheManager.resetCache();
		assert.isEmpty(cache);

		done();
	}).timeout(5000);

	it('Get nonexistent cache', done => {

		let data = cacheManager.getCache('nonexist');
		assert.isNull(data);

		done();
	}).timeout(5000);

	it('Make a few entries and check them', done => {

		cacheManager.saveCache('something1', 'data1', 10000);
		cacheManager.saveCache('something2', 'data2', 1);
		cacheManager.saveCache('something3', 'data3', 0);

		setTimeout(() => {

			cacheManager.cleanCache();

			var data1 = cacheManager.getCache('something1');
			var data2 = cacheManager.getCache('something2');
			var data3 = cacheManager.getCache('something3');

			assert.equal(data1, 'data1');
			assert.isNull(data2);
			assert.equal(data3, 'data3');

			cacheManager.resetCache();

			data1 = cacheManager.getCache('something1');
			data2 = cacheManager.getCache('something2');
			data3 = cacheManager.getCache('something3');

			assert.isNull(data1);
			assert.isNull(data2);
			assert.isNull(data3);

			done();
		}, 10);
	}).timeout(5000);
});