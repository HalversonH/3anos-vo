import { nonNullable } from '../lib/non-nullable';
async function postProcessHTML(pathname, content, renderOpts, { inAmpMode, hybridAmp }) {
    const postProcessors = [
        process.env.NEXT_RUNTIME !== 'edge' && inAmpMode ? async (html)=>{
            const optimizeAmp = require('./optimize-amp').default;
            html = await optimizeAmp(html, renderOpts.ampOptimizerConfig);
            if (!renderOpts.ampSkipValidation && renderOpts.ampValidator) {
                await renderOpts.ampValidator(html, pathname);
            }
            return html;
        } : null,
        process.env.NEXT_RUNTIME !== 'edge' && renderOpts.optimizeCss ? async (html)=>{
            // eslint-disable-next-line import/no-extraneous-dependencies
            const Critters = require('critters');
            const cssOptimizer = new Critters({
                ssrMode: true,
                reduceInlineStyles: false,
                path: renderOpts.distDir,
                publicPath: `${renderOpts.assetPrefix}/_next/`,
                preload: 'media',
                fonts: false,
                logLevel: process.env.CRITTERS_LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'warn' : 'info'),
                ...renderOpts.optimizeCss
            });
            return await cssOptimizer.process(html);
        } : null,
        inAmpMode || hybridAmp ? (html)=>{
            return html.replace(/&amp;amp=1/g, '&amp=1');
        } : null
    ].filter(nonNullable);
    for (const postProcessor of postProcessors){
        if (postProcessor) {
            content = await postProcessor(content);
        }
    }
    return content;
}
export { postProcessHTML };

//# sourceMappingURL=post-process.js.map