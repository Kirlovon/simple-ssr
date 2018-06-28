/* eslint-disable */

const cacheManager = require('../lib/cacheManager');

///////////////////////////////////////////////////////////////////////////////////////////////////

test('Try to find not created cache', done => {
	let data = cacheManager.getCache('something');
	expect(data).toEqual(null);
	done();
});

///////////////////////////////////////////////////////////////////////////////////////////////////

test('Make a few entries and check them', done => {
	cacheManager.saveCache('something1', 'data1', 10000);
	cacheManager.saveCache('something2', 'data2', 1);
	cacheManager.saveCache('something3', 'data3', 0);

	setTimeout(() => {

		cacheManager.cleanCache();

		var data1 = cacheManager.getCache('something1');
		var data2 = cacheManager.getCache('something2');
		var data3 = cacheManager.getCache('something3');

		expect(data1.html).toBe('data1');
		expect(data2).toBe(null);
		expect(data3.html).toBe('data3');

		cacheManager.resetCache();

		data1 = cacheManager.getCache('something1');
		data2 = cacheManager.getCache('something2');
		data3 = cacheManager.getCache('something3');

		expect(data1).toBe(null);
		expect(data2).toBe(null);
		expect(data3).toBe(null);

		done();
	}, 10);
});

///////////////////////////////////////////////////////////////////////////////////////////////////