/* eslint-disable */

const dataVerification = require('../lib/dataVerification');

///////////////////////////////////////////////////////////////////////////////////////////////////

test('puppeteerConfig verifier got invalid data type', done => {
	let data = dataVerification.puppeteerConfig(12345);
	expect(data).toEqual({
		headless: true,
		timeout: 16000,
		ignoreHTTPSErrors: true,
	});
	done();
});

///////////////////////////////////////////////////////////////////////////////////////////////////

test('puppeteerConfig verifier got valid data type', done => {
	let data = dataVerification.puppeteerConfig({
		headless: false,
		timeout: 1000,
		ignoreHTTPSErrors: false,
	});
	expect(data).toEqual({
		headless: false,
		timeout: 1000,
		ignoreHTTPSErrors: false,
	});
	done();
});

///////////////////////////////////////////////////////////////////////////////////////////////////

test('puppeteerConfig verifier not received data', done => {
	let data = dataVerification.puppeteerConfig();
	expect(data).toEqual({
		headless: true,
		timeout: 16000,
		ignoreHTTPSErrors: true,
	});
	done();
});

///////////////////////////////////////////////////////////////////////////////////////////////////

test('renderURL verifier got invalid data type', done => {
	let data = dataVerification.renderURL(12345);
	expect(data).toBe(undefined);
	done();
});

///////////////////////////////////////////////////////////////////////////////////////////////////

test('renderURL verifier got valid data type', done => {
	let data = dataVerification.renderURL("https://github.com/");
	expect(data).toBe("https://github.com/");
	done();
});

///////////////////////////////////////////////////////////////////////////////////////////////////

test('renderURL verifier not received data', done => {
	let data = dataVerification.renderURL();
	expect(data).toBe(undefined);
	done();
});

///////////////////////////////////////////////////////////////////////////////////////////////////

test('renderConfig verifier got invalid data type', done => {
	let data = dataVerification.renderConfig(12345);
	expect(data).toEqual({
		timeout: 16000,
		domTarget: undefined,
		waitUntil: 'networkidle0',
		cache: false,
		cacheTime: 30000
	});
	done();
});

///////////////////////////////////////////////////////////////////////////////////////////////////

test('renderConfig verifier got valid data type', done => {
	let data = dataVerification.renderConfig({
		timeout: 12000,
		domTarget: '#main',
		waitUntil: ['domcontentloaded', 'networkidle2'],
		cache: true,
		cacheTime: 6000
	});
	expect(data).toEqual({
		timeout: 12000,
		domTarget: '#main',
		waitUntil: ['domcontentloaded', 'networkidle2'],
		cache: true,
		cacheTime: 6000
	});
	done();
});

///////////////////////////////////////////////////////////////////////////////////////////////////

test('renderConfig verifier got not received data', done => {
	let data = dataVerification.renderConfig();
	expect(data).toEqual({
		timeout: 16000,
		domTarget: undefined,
		waitUntil: 'networkidle0',
		cache: false,
		cacheTime: 30000
	});
	done();
});

///////////////////////////////////////////////////////////////////////////////////////////////////
