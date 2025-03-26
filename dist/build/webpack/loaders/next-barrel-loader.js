/**
 * ## Barrel Optimizations
 *
 * This loader is used to optimize the imports of "barrel" files that have many
 * re-exports. Currently, both Node.js and Webpack have to enter all of these
 * submodules even if we only need a few of them.
 *
 * For example, say a file `foo.js` with the following contents:
 *
 *   export { a } from './a'
 *   export { b } from './b'
 *   export { c } from './c'
 *   ...
 *
 * If the user imports `a` only, this loader will accept the `names` option to
 * be `['a']`. Then, it request the "__barrel_transform__" SWC transform to load
 * `foo.js` and receive the following output:
 *
 *   export const __next_private_export_map__ = '[["a","./a","a"],["b","./b","b"],["c","./c","c"],...]'
 *
 *   format: '["<imported identifier>", "<import path>", "<exported name>"]'
 *   e.g.: import { a as b } from './module-a' => '["b", "./module-a", "a"]'
 *
 * The export map, generated by SWC, is a JSON that represents the exports of
 * that module, their original file, and their original name (since you can do
 * `export { a as b }`).
 *
 * Then, this loader can safely remove all the exports that are not needed and
 * re-export the ones from `names`:
 *
 *   export { a } from './a'
 *
 * That's the basic situation and also the happy path.
 *
 *
 *
 * ## Wildcard Exports
 *
 * For wildcard exports (e.g. `export * from './a'`), it becomes a bit more complicated.
 * Say `foo.js` with the following contents:
 *
 *   export * from './a'
 *   export * from './b'
 *   export * from './c'
 *   ...
 *
 * If the user imports `bar` from it, SWC can never know which files are going to be
 * exporting `bar`. So, we have to keep all the wildcard exports and do the same
 * process recursively. This loader will return the following output:
 *
 *   export * from '__barrel_optimize__?names=bar&wildcard!=!./a'
 *   export * from '__barrel_optimize__?names=bar&wildcard!=!./b'
 *   export * from '__barrel_optimize__?names=bar&wildcard!=!./c'
 *   ...
 *
 * The "!=!" tells Webpack to use the same loader to process './a', './b', and './c'.
 * After the recursive process, the "inner loaders" will either return an empty string
 * or:
 *
 *   export * from './target'
 *
 * Where `target` is the file that exports `bar`.
 *
 *
 *
 * ## Non-Barrel Files
 *
 * If the file is not a barrel, we can't apply any optimizations. That's because
 * we can't easily remove things from the file. For example, say `foo.js` with:
 *
 *   const v = 1
 *   export function b () {
 *     return v
 *   }
 *
 * If the user imports `b` only, we can't remove the `const v = 1` even though
 * the file is side-effect free. In these caes, this loader will simply re-export
 * `foo.js`:
 *
 *   export * from './foo'
 *
 * Besides these cases, this loader also carefully handles the module cache so
 * SWC won't analyze the same file twice, and no instance of the same file will
 * be accidentally created as different instances.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _path = /*#__PURE__*/ _interop_require_default(require("path"));
const _swc = require("../../swc");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
// This is a in-memory cache for the mapping of barrel exports. This only applies
// to the packages that we optimize. It will never change (e.g. upgrading packages)
// during the lifetime of the server so we can safely cache it.
// There is also no need to collect the cache for the same reason.
const barrelTransformMappingCache = new Map();
async function getBarrelMapping(resourcePath, swcCacheDir, resolve, fs) {
    if (barrelTransformMappingCache.has(resourcePath)) {
        return barrelTransformMappingCache.get(resourcePath);
    }
    // This is a SWC transform specifically for `optimizeBarrelExports`. We don't
    // care about other things but the export map only.
    async function transpileSource(filename, source, isWildcard) {
        const isTypeScript = filename.endsWith('.ts') || filename.endsWith('.tsx');
        return new Promise((res)=>(0, _swc.transform)(source, {
                filename,
                inputSourceMap: undefined,
                sourceFileName: filename,
                optimizeBarrelExports: {
                    wildcard: isWildcard
                },
                jsc: {
                    parser: {
                        syntax: isTypeScript ? 'typescript' : 'ecmascript',
                        [isTypeScript ? 'tsx' : 'jsx']: true
                    },
                    experimental: {
                        cacheRoot: swcCacheDir
                    }
                }
            }).then((output)=>{
                res(output.code);
            }));
    }
    // Avoid circular `export *` dependencies
    const visited = new Set();
    async function getMatches(file, isWildcard, isClientEntry) {
        if (visited.has(file)) {
            return null;
        }
        visited.add(file);
        const source = await new Promise((res, rej)=>{
            fs.readFile(file, (err, data)=>{
                if (err || data === undefined) {
                    rej(err);
                } else {
                    res(data.toString());
                }
            });
        });
        const output = await transpileSource(file, source, isWildcard);
        const matches = output.match(/^([^]*)export (const|var) __next_private_export_map__ = ('[^']+'|"[^"]+")/);
        if (!matches) {
            return null;
        }
        const matchedDirectives = output.match(/^([^]*)export (const|var) __next_private_directive_list__ = '([^']+)'/);
        const directiveList = matchedDirectives ? JSON.parse(matchedDirectives[3]) : [];
        // "use client" in barrel files has to be transferred to the target file.
        isClientEntry = directiveList.includes('use client');
        let exportList = JSON.parse(matches[3].slice(1, -1));
        const wildcardExports = [
            ...output.matchAll(/export \* from "([^"]+)"/g)
        ].map((match)=>match[1]);
        // In the wildcard case, if the value is exported from another file, we
        // redirect to that file (decl[0]). Otherwise, export from the current
        // file itself.
        if (isWildcard) {
            for (const decl of exportList){
                decl[1] = file;
                decl[2] = decl[0];
            }
        }
        // This recursively handles the wildcard exports (e.g. `export * from './a'`)
        if (wildcardExports.length) {
            await Promise.all(wildcardExports.map(async (req)=>{
                const targetPath = await resolve(_path.default.dirname(file), req.replace('__barrel_optimize__?names=__PLACEHOLDER__!=!', ''));
                const targetMatches = await getMatches(targetPath, true, isClientEntry);
                if (targetMatches) {
                    // Merge the export list
                    exportList = exportList.concat(targetMatches.exportList);
                }
            }));
        }
        return {
            exportList,
            wildcardExports,
            isClientEntry
        };
    }
    const res = await getMatches(resourcePath, false, false);
    barrelTransformMappingCache.set(resourcePath, res);
    return res;
}
const NextBarrelLoader = async function() {
    this.async();
    this.cacheable(true);
    const { names, swcCacheDir } = this.getOptions();
    // For barrel optimizations, we always prefer the "module" field over the
    // "main" field because ESM handling is more robust with better tree-shaking.
    const resolve = this.getResolve({
        mainFields: [
            'module',
            'main'
        ]
    });
    const mapping = await getBarrelMapping(this.resourcePath, swcCacheDir, resolve, this.fs);
    // `resolve` adds all sub-paths to the dependency graph. However, we already
    // cached the mapping and we assume them to not change. So, we can safely
    // clear the dependencies here to avoid unnecessary watchers which turned out
    // to be very expensive.
    this.clearDependencies();
    if (!mapping) {
        // This file isn't a barrel and we can't apply any optimizations. Let's re-export everything.
        // Since this loader accepts `names` and the request is keyed with `names`, we can't simply
        // return the original source here. That will create these imports with different names as
        // different modules instances.
        this.callback(null, `export * from ${JSON.stringify(this.resourcePath)}`);
        return;
    }
    const exportList = mapping.exportList;
    const isClientEntry = mapping.isClientEntry;
    const exportMap = new Map();
    for (const [name, filePath, orig] of exportList){
        exportMap.set(name, [
            filePath,
            orig
        ]);
    }
    let output = '';
    let missedNames = [];
    for (const name of names){
        // If the name matches
        if (exportMap.has(name)) {
            const decl = exportMap.get(name);
            if (decl[1] === '*') {
                output += `\nexport * as ${name} from ${JSON.stringify(decl[0])}`;
            } else if (decl[1] === 'default') {
                output += `\nexport { default as ${name} } from ${JSON.stringify(decl[0])}`;
            } else if (decl[1] === name) {
                output += `\nexport { ${name} } from ${JSON.stringify(decl[0])}`;
            } else {
                output += `\nexport { ${decl[1]} as ${name} } from ${JSON.stringify(decl[0])}`;
            }
        } else {
            missedNames.push(name);
        }
    }
    // These are from wildcard exports.
    if (missedNames.length > 0) {
        for (const req of mapping.wildcardExports){
            output += `\nexport * from ${JSON.stringify(req.replace('__PLACEHOLDER__', missedNames.join(',') + '&wildcard'))}`;
        }
    }
    // When it has `"use client"` inherited from its barrel files, we need to
    // prefix it to this target file as well.
    if (isClientEntry) {
        output = `"use client";\n${output}`;
    }
    this.callback(null, output);
};
const _default = NextBarrelLoader;

//# sourceMappingURL=next-barrel-loader.js.map