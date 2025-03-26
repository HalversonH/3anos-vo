import { webpack } from 'next/dist/compiled/webpack/webpack';
import type { CustomRoutes } from '../lib/load-custom-routes.js';
import type { CompilerNameValues } from '../shared/lib/constants';
import type { NextConfigComplete } from '../server/config-shared';
import type { Span } from '../trace';
import type { MiddlewareMatcher } from './analysis/get-page-static-info';
import { type JsConfig, type ResolvedBaseUrl } from './load-jsconfig';
export declare const babelIncludeRegexes: RegExp[];
export declare function attachReactRefresh(webpackConfig: webpack.Configuration, targetLoader: webpack.RuleSetUseItem): void;
export declare const NODE_RESOLVE_OPTIONS: {
    dependencyType: string;
    modules: string[];
    fallback: boolean;
    exportsFields: string[];
    importsFields: string[];
    conditionNames: string[];
    descriptionFiles: string[];
    extensions: string[];
    enforceExtensions: boolean;
    symlinks: boolean;
    mainFields: string[];
    mainFiles: string[];
    roots: never[];
    fullySpecified: boolean;
    preferRelative: boolean;
    preferAbsolute: boolean;
    restrictions: never[];
};
export declare const NODE_BASE_RESOLVE_OPTIONS: {
    alias: boolean;
    dependencyType: string;
    modules: string[];
    fallback: boolean;
    exportsFields: string[];
    importsFields: string[];
    conditionNames: string[];
    descriptionFiles: string[];
    extensions: string[];
    enforceExtensions: boolean;
    symlinks: boolean;
    mainFields: string[];
    mainFiles: string[];
    roots: never[];
    fullySpecified: boolean;
    preferRelative: boolean;
    preferAbsolute: boolean;
    restrictions: never[];
};
export declare const NODE_ESM_RESOLVE_OPTIONS: {
    alias: boolean;
    dependencyType: string;
    conditionNames: string[];
    fullySpecified: boolean;
    modules: string[];
    fallback: boolean;
    exportsFields: string[];
    importsFields: string[];
    descriptionFiles: string[];
    extensions: string[];
    enforceExtensions: boolean;
    symlinks: boolean;
    mainFields: string[];
    mainFiles: string[];
    roots: never[];
    preferRelative: boolean;
    preferAbsolute: boolean;
    restrictions: never[];
};
export declare const NODE_BASE_ESM_RESOLVE_OPTIONS: {
    alias: boolean;
    dependencyType: string;
    conditionNames: string[];
    fullySpecified: boolean;
    modules: string[];
    fallback: boolean;
    exportsFields: string[];
    importsFields: string[];
    descriptionFiles: string[];
    extensions: string[];
    enforceExtensions: boolean;
    symlinks: boolean;
    mainFields: string[];
    mainFiles: string[];
    roots: never[];
    preferRelative: boolean;
    preferAbsolute: boolean;
    restrictions: never[];
};
export declare const nextImageLoaderRegex: RegExp;
export declare function loadProjectInfo({ dir, config, dev, }: {
    dir: string;
    config: NextConfigComplete;
    dev: boolean;
}): Promise<{
    jsConfig: JsConfig;
    jsConfigPath?: string;
    resolvedBaseUrl: ResolvedBaseUrl;
    supportedBrowsers: string[] | undefined;
}>;
export declare function hasExternalOtelApiPackage(): boolean;
export default function getBaseWebpackConfig(dir: string, { buildId, encryptionKey, config, compilerType, dev, entrypoints, isDevFallback, pagesDir, reactProductionProfiling, rewrites, originalRewrites, originalRedirects, runWebpackSpan, appDir, middlewareMatchers, noMangling, jsConfig, jsConfigPath, resolvedBaseUrl, supportedBrowsers, clientRouterFilters, fetchCacheKeyPrefix, edgePreviewProps, }: {
    buildId: string;
    encryptionKey: string;
    config: NextConfigComplete;
    compilerType: CompilerNameValues;
    dev?: boolean;
    entrypoints: webpack.EntryObject;
    isDevFallback?: boolean;
    pagesDir: string | undefined;
    reactProductionProfiling?: boolean;
    rewrites: CustomRoutes['rewrites'];
    originalRewrites: CustomRoutes['rewrites'] | undefined;
    originalRedirects: CustomRoutes['redirects'] | undefined;
    runWebpackSpan: Span;
    appDir: string | undefined;
    middlewareMatchers?: MiddlewareMatcher[];
    noMangling?: boolean;
    jsConfig: any;
    jsConfigPath?: string;
    resolvedBaseUrl: ResolvedBaseUrl;
    supportedBrowsers: string[] | undefined;
    edgePreviewProps?: Record<string, string>;
    clientRouterFilters?: {
        staticFilter: ReturnType<import('../shared/lib/bloom-filter').BloomFilter['export']>;
        dynamicFilter: ReturnType<import('../shared/lib/bloom-filter').BloomFilter['export']>;
    };
    fetchCacheKeyPrefix?: string;
}): Promise<webpack.Configuration>;
