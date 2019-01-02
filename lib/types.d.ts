/** TypeScript types */

declare class simpleSSR {

	/** Enable or Disable logs */
	logs: boolean;

	/** Safe mode for preventing errors and simplifying error messages */
	safe: boolean;

	/** Chromium browser from pupeteer.launch() */
	browser: any;

	/** To manually work with the cache */
	cacheManager: any;

	/** List of data types that are useless for rendering */
	blockedRequest: string[];

	/** Start SimpleSSR and prepare SSR for work */
	start(config?: object): Promise<void>;

	/** Render specified URL */
	render(url: string, config?: renderConfig): Promise<renderingResult>;

	/** Stop SimpleSSR */
	stop(): Promise<void>;
}

declare interface renderConfig {
	timeout?: number;
	domTarget?: string;
	waitUntil?: string | Array<string>;
	cache?: boolean;
	cacheTime?: number;
}

declare interface renderingResult {
	html: string;
	cache: boolean;
	renderingTime: number;
}

declare const instance: simpleSSR;
export default instance;