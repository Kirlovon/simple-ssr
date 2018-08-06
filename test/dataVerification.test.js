/* eslint-disable */

const assert = require('chai').assert;
const dataVerification = require('../lib/dataVerification');

describe('dataVerification', () => {

	it('Check default config from puppeteerConfig()', done => {
		var config = dataVerification.puppeteerConfig('something');
		assert.deepEqual(config, {
			headless: true,
			timeout: 16000,
			ignoreHTTPSErrors: true,
		});
		done();
	}).timeout(5000);

	it('Check default config from renderURL()', done => {
		var test1 = dataVerification.renderURL('something');
		var test2 = dataVerification.renderURL(123);
		assert.equal(test1, 'something');
		assert.isUndefined(test2);
		done();
	}).timeout(5000);

	it('Check default config from renderConfig()', done => {
		var config = dataVerification.renderConfig('something');
		assert.deepEqual(config, {
			timeout: 16000,
			domTarget: undefined,
			waitUntil: 'networkidle0',
			cache: false,
			cacheTime: 30000,
		});
		done();
	}).timeout(5000);

	it('Check config corrector from renderConfig()', done => {
		var config = dataVerification.renderConfig({
			timeout: true,
			domTarget: '#main',
			waitUntil: ['networkidle0', 'networkidle2'],
			cache: 'Hi',
			cacheTime: false,
		});
		assert.deepEqual(config, {
			timeout: 16000,
			domTarget: '#main',
			waitUntil: ['networkidle0', 'networkidle2'],
			cache: false,
			cacheTime: 30000,
		});
		done();
	}).timeout(5000);


});