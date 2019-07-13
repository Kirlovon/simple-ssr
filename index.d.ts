import { Browser, LoadEvent, LaunchOptions } from 'puppeteer';

/** TypeScript types */
declare class simpleSSR {

	/** Chromium browser from pupeteer.launch(). */
	browser: Browser;

	/** Enable requests filtering. */
	filterRequests: boolean;

	/** List of data types that are useless for rendering. */
	blockedRequest: string[];

	/** Launch Puppeteer and prepare SSR for work. */
	start(config?: LaunchOptions): Promise<void>;

	/** Render specified URL. */
	render(url: string, config?: renderConfig): Promise<renderResult>;

	/** Stop Puppeteer. */
	stop(): Promise<void>;
}

/** Rendering config. */
declare interface renderConfig {

	/** Rendering timeout. */
	timeout?: number;

	/** DOM targets that will be expected to appear during the rendering process. */
	domTarget?: string | string[];

	/** When to consider navigation succeeded. */
	waitUntil?: LoadEvent;
}

/** Rendering result. */
declare interface renderResult {

	/** Page URL. */
	url: string;

	/** Rendering time. */
	time: number;

	/** Rendered page */
	html: string;
}

declare const instance: simpleSSR;
export default instance;