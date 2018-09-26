/**	TypeScript types */

declare class simpleSSR {
	logs: boolean;
	safe: boolean;
	browser: any;
	cacheManager: any;
	blockedRequest: string[];
	start(config?: any): Promise<void>;
	render(url: string, config?: renderConfig): any;
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

declare const s: simpleSSR

export default s