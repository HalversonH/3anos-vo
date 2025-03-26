"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    resolveImages: null,
    resolveOpenGraph: null,
    resolveTwitter: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    resolveImages: function() {
        return resolveImages;
    },
    resolveOpenGraph: function() {
        return resolveOpenGraph;
    },
    resolveTwitter: function() {
        return resolveTwitter;
    }
});
const _utils = require("../generate/utils");
const _resolveurl = require("./resolve-url");
const _resolvetitle = require("./resolve-title");
const _url = require("../../url");
const _log = require("../../../build/output/log");
const OgTypeFields = {
    article: [
        'authors',
        'tags'
    ],
    song: [
        'albums',
        'musicians'
    ],
    playlist: [
        'albums',
        'musicians'
    ],
    radio: [
        'creators'
    ],
    video: [
        'actors',
        'directors',
        'writers',
        'tags'
    ],
    basic: [
        'emails',
        'phoneNumbers',
        'faxNumbers',
        'alternateLocale',
        'audio',
        'videos'
    ]
};
function resolveAndValidateImage(item, metadataBase, isStaticMetadataRouteFile) {
    if (!item) return undefined;
    const isItemUrl = (0, _resolveurl.isStringOrURL)(item);
    const inputUrl = isItemUrl ? item : item.url;
    if (!inputUrl) return undefined;
    // process.env.VERCEL is set to "1" when System Environment Variables are
    // exposed. When exposed, validation is not necessary since we are falling back to
    // process.env.VERCEL_PROJECT_PRODUCTION_URL, process.env.VERCEL_BRANCH_URL, or
    // process.env.VERCEL_URL for the `metadataBase`. process.env.VERCEL is undefined
    // when System Environment Variables are not exposed. When not exposed, we cannot
    // detect in the build environment if the deployment is a Vercel deployment or not.
    //
    // x-ref: https://vercel.com/docs/projects/environment-variables/system-environment-variables#system-environment-variables
    const isUsingVercelSystemEnvironmentVariables = Boolean(process.env.VERCEL);
    const isRelativeUrl = typeof inputUrl === 'string' && !(0, _url.isFullStringUrl)(inputUrl);
    // When no explicit metadataBase is specified by the user, we'll override it with the fallback metadata
    // under the following conditions:
    // - The provided URL is relative (ie ./og-image).
    // - The image is statically generated by Next.js (such as the special `opengraph-image` route)
    // In both cases, we want to ensure that across all environments, the ogImage is a fully qualified URL.
    // In the `opengraph-image` case, since the user isn't explicitly passing a relative path, this ensures
    // the ogImage will be properly discovered across different environments without the user needing to
    // have a bunch of `process.env` checks when defining their `metadataBase`.
    if (isRelativeUrl && (!metadataBase || isStaticMetadataRouteFile)) {
        const fallbackMetadataBase = (0, _resolveurl.getSocialImageMetadataBaseFallback)(metadataBase);
        // When not using Vercel environment variables for URL injection, we aren't able to determine
        // a fallback value for `metadataBase`. For self-hosted setups, we want to warn
        // about this since the only fallback we'll be able to generate is `localhost`.
        // In development, we'll only warn for relative metadata that isn't part of the static
        // metadata conventions (eg `opengraph-image`), as otherwise it's currently very noisy
        // for common cases. Eventually we should remove this warning all together in favor of
        // devtools.
        const shouldWarn = !isUsingVercelSystemEnvironmentVariables && !metadataBase && (process.env.NODE_ENV === 'production' || !isStaticMetadataRouteFile);
        if (shouldWarn) {
            (0, _log.warnOnce)(`metadataBase property in metadata export is not set for resolving social open graph or twitter images, using "${fallbackMetadataBase.origin}". See https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase`);
        }
        metadataBase = fallbackMetadataBase;
    }
    return isItemUrl ? {
        url: (0, _resolveurl.resolveUrl)(inputUrl, metadataBase)
    } : {
        ...item,
        // Update image descriptor url
        url: (0, _resolveurl.resolveUrl)(inputUrl, metadataBase)
    };
}
function resolveImages(images, metadataBase, isStaticMetadataRouteFile) {
    const resolvedImages = (0, _utils.resolveAsArrayOrUndefined)(images);
    if (!resolvedImages) return resolvedImages;
    const nonNullableImages = [];
    for (const item of resolvedImages){
        const resolvedItem = resolveAndValidateImage(item, metadataBase, isStaticMetadataRouteFile);
        if (!resolvedItem) continue;
        nonNullableImages.push(resolvedItem);
    }
    return nonNullableImages;
}
const ogTypeToFields = {
    article: OgTypeFields.article,
    book: OgTypeFields.article,
    'music.song': OgTypeFields.song,
    'music.album': OgTypeFields.song,
    'music.playlist': OgTypeFields.playlist,
    'music.radio_station': OgTypeFields.radio,
    'video.movie': OgTypeFields.video,
    'video.episode': OgTypeFields.video
};
function getFieldsByOgType(ogType) {
    if (!ogType || !(ogType in ogTypeToFields)) return OgTypeFields.basic;
    return ogTypeToFields[ogType].concat(OgTypeFields.basic);
}
const resolveOpenGraph = (openGraph, metadataBase, metadataContext, titleTemplate)=>{
    if (!openGraph) return null;
    function resolveProps(target, og) {
        const ogType = og && 'type' in og ? og.type : undefined;
        const keys = getFieldsByOgType(ogType);
        for (const k of keys){
            const key = k;
            if (key in og && key !== 'url') {
                const value = og[key];
                target[key] = value ? (0, _utils.resolveArray)(value) : null;
            }
        }
        target.images = resolveImages(og.images, metadataBase, metadataContext.isStaticMetadataRouteFile);
    }
    const resolved = {
        ...openGraph,
        title: (0, _resolvetitle.resolveTitle)(openGraph.title, titleTemplate)
    };
    resolveProps(resolved, openGraph);
    resolved.url = openGraph.url ? (0, _resolveurl.resolveAbsoluteUrlWithPathname)(openGraph.url, metadataBase, metadataContext) : null;
    return resolved;
};
const TwitterBasicInfoKeys = [
    'site',
    'siteId',
    'creator',
    'creatorId',
    'description'
];
const resolveTwitter = (twitter, metadataBase, metadataContext, titleTemplate)=>{
    var _resolved_images;
    if (!twitter) return null;
    let card = 'card' in twitter ? twitter.card : undefined;
    const resolved = {
        ...twitter,
        title: (0, _resolvetitle.resolveTitle)(twitter.title, titleTemplate)
    };
    for (const infoKey of TwitterBasicInfoKeys){
        resolved[infoKey] = twitter[infoKey] || null;
    }
    resolved.images = resolveImages(twitter.images, metadataBase, metadataContext.isStaticMetadataRouteFile);
    card = card || (((_resolved_images = resolved.images) == null ? void 0 : _resolved_images.length) ? 'summary_large_image' : 'summary');
    resolved.card = card;
    if ('card' in resolved) {
        switch(resolved.card){
            case 'player':
                {
                    resolved.players = (0, _utils.resolveAsArrayOrUndefined)(resolved.players) || [];
                    break;
                }
            case 'app':
                {
                    resolved.app = resolved.app || {};
                    break;
                }
            default:
                break;
        }
    }
    return resolved;
};

//# sourceMappingURL=resolve-opengraph.js.map