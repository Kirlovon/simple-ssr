/* eslint-disable */

const simpleSSR = require('../lib/main');

///////////////////////////////////////////////////////////////////////////////////////////////////

test('Try to render "example.com"', done => {

	simpleSSR.logs = false;

	simpleSSR.start().then(() => {
		simpleSSR.render('http://example.com/').then((data) => {

			expect(data.html).toContain('Example Domain');

			simpleSSR.stop().then(() => {
				done();
			});

		});
	});

}, 60000);

///////////////////////////////////////////////////////////////////////////////////////////////////

test('Try to render "example.com" and cache it', done => {

	simpleSSR.logs = false;

	simpleSSR.start().then(() => {
		simpleSSR.render('http://example.com/', {
			cache: true,
			cacheTime: 0
		}).then((data) => {

			expect(data.html).toContain('Example Domain');
			expect(data.cached).toEqual(false);

			setTimeout(() => {

				simpleSSR.render('http://example.com/', {
					cache: true,
					cacheTime: 0
				}).then((data) => {

					expect(data.html).toContain('Example Domain');
					expect(data.cached).toEqual(true);

					simpleSSR.stop().then(() => {
						done();
					});

				});

			}, 100);

		});
	});

}, 60000);

///////////////////////////////////////////////////////////////////////////////////////////////////