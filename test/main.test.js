/* eslint-disable */

const simpleSSR = require('../index');

///////////////////////////////////////////////////////////////////////////////////////////////////

test('Try to render "example.com"', done => {
	
	simpleSSR.other.setLogs(false);

	simpleSSR.start().then(() => {
		simpleSSR.render('http://example.com/').then((data) => {

			expect(data.html).toContain('Example Domain');

			simpleSSR.stop().then(() => {
				done();
			});

		});
	});

});

///////////////////////////////////////////////////////////////////////////////////////////////////

test('Try to render "example.com" and cache it', done => {

	simpleSSR.other.setLogs(false);

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

});

///////////////////////////////////////////////////////////////////////////////////////////////////