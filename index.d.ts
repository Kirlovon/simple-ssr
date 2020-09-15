export = SimpleSSRInstance;
declare const SimpleSSRInstance: SimpleSSR;
/**
 * Simple-SSR 🚩
 * Universal server-side rendering implementation for Node.js
 */
declare class SimpleSSR {
    /**
     * Puppeteer instance
     */
    browser: import("puppeteer").Browser;
    /**
     * Enable requests filtering ( Default: true )
     */
    filterRequests: boolean;
    /**
     * List of useless for DOM rendering resources
     */
    blockedRequests: string[];
    /**
     * Start SimpleSSR
     * @param {puppeteer.LaunchOptions} [config={ headless: true, timeout: 10000 }] Config for Puppeteer instance.
     */
    start(config?: import("puppeteer").LaunchOptions): Promise<void>;
    /**
     * Render page from specified URL.
     * @param {string} url Page URL.
     * @param {{ timeout: number, domTarget: string|string[]|null, waitUntil: string }} [config={ timeout: 10000, domTarget: null, waitUntil: 'networkidle0' }] Rendering config.
     * @returns Rendering result.
     */
    render(url: string, config?: {
        timeout: number;
        domTarget: string | string[] | null;
        waitUntil: string;
    }): Promise<{
        url: string;
        time: number;
        html: string;
    }>;
    /**
     * Stop SimpleSSR
     */
    stop(): Promise<void>;
}
