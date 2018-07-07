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

test('Try to render without url', done => {

	simpleSSR.logs = false;

	simpleSSR.start().then(() => {
		simpleSSR.render().then(() => {
			done.fail('No URL error!');
		}).catch(error => {

			expect(error.message).toBe('URL for rendering is not specified!');

			simpleSSR.stop().then(() => {
				done();
			});
			
		});
	});

}, 60000);

///////////////////////////////////////////////////////////////////////////////////////////////////

test('Try to render without starting Puppeteer', done => {

	simpleSSR.logs = false;

	simpleSSR.render('http://example.com/').then(() => {
		done.fail('No Puppeteer error!');
	}).catch(error => {

		expect(error.message).toBe('Puppeteer is not started!');
		done();

	});

}, 60000);

///////////////////////////////////////////////////////////////////////////////////////////////////