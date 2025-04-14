// import * as Path from 'path';
import * as Path from 'path-browserify';
import * as fs from 'fs';
import matter from 'gray-matter';
import { SyncHook } from 'tapable';
import * as webpack from 'webpack';
const unified = require('unified');
const remarkParse = require('remark-parse');
const remarkHtml = require('remark-html');
const remarkSlug = require('remark-slug');
const remarkAutolinkHeadings = require('@rigor789/remark-autolink-headings');
// import { unified } from 'unified';
// import markdown from 'remark-parse';
// import remarkHtml from 'remark-html';
// import globby from 'globby';
// import remarkSlug from 'remark-slug';
// import remarkAutolinkHeadings from '@rigor789/remark-autolink-headings';
import remarkAttr from 'remark-attr';

// console.log('unified:', unified);
// console.log('markdown:', markdown);
// console.log('remarkHtml:', remarkHtml);
// console.log('remarkSlug:', remarkSlug);
// console.log('remarkAutolinkHeadings:', remarkAutolinkHeadings);
console.log('remarkAttr:', remarkAttr);

// const globby = (await import('globby')).default;

// const globby = await import('globby');
// let globby: typeof import('globby').globby;
// async function loadGlobby() {
//   console.log('globby1');
//   if (!globby) {
//     console.log('globby2');
//     globby = (await import('globby')).globby;
//     console.log('globby3');
//   }
// }
// async function loadGlobby() {
//   console.log('globby1');
//   const globby = await import('globby');
//   console.log('globby2', globby !== undefined);
//   return globby;
// }
// if (!globby) {
//   globby = (await import('globby')).globby;
// }

const { util: { createHash } } = webpack as any;

import { PebulaDynamicDictionaryWebpackPlugin } from '@pebula-internal/webpack-dynamic-dictionary';
import { PebulaNoCleanIfAnyWebpackPlugin } from '@pebula-internal/webpack-no-clean-if-any';
import { ParsedPage, PageNavigationMetadata, PageAttributes } from './models';
import { createPageFileAsset, sortPageAssetNavEntry } from './utils';

declare module '@pebula-internal/webpack-dynamic-dictionary/plugin' {
  interface DynamicExportedObject {
    markdownPages: string;
  }
}

const pluginName = 'markdown-pages-webpack-plugin';
const compilerHooksMap = new WeakMap<webpack.Compiler, MarkdownPagesWebpackPluginCompilerHooks>();

export interface MarkdownPagesWebpackPluginCompilerHooks {
  markdownPageNavigationMetadataReady: SyncHook<{ navMetadata: PageNavigationMetadata, compilation: webpack.Compilation }>;
  markdownPageParsed: SyncHook<{ parsedPage: ParsedPage, compilation: webpack.Compilation }>;
}

export interface MarkdownPagesWebpackPluginOptions {
  context: string;
  docsPath: string | string[];
  docsRoot?: string;
  outputAssetPathRoot?: string;
  remarkPlugins: any[];
}

export class MarkdownPagesWebpackPlugin {

  static getCompilationHooks(compiler: webpack.Compiler): MarkdownPagesWebpackPluginCompilerHooks {
    if (!(compiler instanceof webpack.Compiler)) {
      throw new TypeError(
        "The 'compiler' argument must be an instance of Compiler"
      );
    }
    let hooks = compilerHooksMap.get(compiler);
    if (hooks === undefined) {
      hooks = {
        markdownPageNavigationMetadataReady: new SyncHook(['markdownPageNavigationMetadataReady']),
        markdownPageParsed: new SyncHook(['markdownPageParsed']),
      }
      compilerHooksMap.set(compiler, hooks);
    }
    return hooks;
  }

  startTime = Date.now();
  prevTimestamps = new Map<string, number>();

  private options: MarkdownPagesWebpackPluginOptions;
  private cache = new Map<string, ParsedPage>();
  private urlCache = new Map<string, ParsedPage>();
  private recentChangedFiles = new Set<ParsedPage>();
  private lastNavEntriesAssetPath: string;

  private firstRun = true;
  private compiler: webpack.Compiler & { watchMode?: boolean };
  private watchMode?: boolean;

  // private get remarkCompiler() {
  //   console.log('AAA remarkCompiler1');
  //   if (!this.__remarkCompiler) {
  //     console.log('AAA remarkCompiler2');
  //     const remarkPlugins = Array.isArray(this.options.remarkPlugins)
  //       ? this.options.remarkPlugins
  //           .map(plugin => {
  //             // Handle [plugin, options] arrays
  //             if (Array.isArray(plugin)) {
  //               const [p, opts] = plugin;
  //               if (typeof p !== 'function') {
  //                 console.warn('Invalid plugin in array:', p);
  //                 return null;
  //               }
  //               return [p, opts];
  //             }
  //             // Handle standalone plugins
  //             if (typeof plugin !== 'function') {
  //               console.warn('Invalid plugin detected:', plugin);
  //               return null;
  //             }
  //             return plugin;
  //           })
  //           .filter(Boolean) // Remove null/undefined
  //       : [];
  //     console.log('AAA remarkPlugins after filter:', remarkPlugins);

  //     this.__remarkCompiler = unified()
  //     .use(markdown, () => console.log('AAA markdown applied'))
  //     .use(remarkPlugins)
  //     // .use(remarkHtml, () => console.log('AAA remarkHtml applied'))
  //     .freeze();
  //   }
  //   return this.__remarkCompiler;
  // }  
  get remarkCompiler2() {
    if (!this.__remarkCompiler2) {
      console.log('AAA remarkCompiler2 - 1');
      this.__remarkCompiler2 = unified()
        .use(remarkParse, { gfm: true })
        .use(this.options.remarkPlugins)
        .use(remarkHtml)
        .freeze();
      // console.log('AAA remarkCompiler2 - 2', this.__remarkCompiler2);
    }
    return this.__remarkCompiler2;
  }

  // private async remarkCompiler23() {
  //   console.log('AAA remarkCompiler1');
  //   try {
  //     const { unified } = await import('unified');
  //     console.log('AAA remarkCompiler2');
  //     const remarkParse = await import('remark-parse');
  //     console.log('AAA remarkCompiler3');

  //     const remarkAutolinkHeadings = await import('@rigor789/remark-autolink-headings');
  //     console.log('AAA remarkCompiler4');

  //     const remarkHtml = await import('remark-html');
  //     console.log('AAA remarkCompiler5');

  //     const remarkSlug = await import('remark-slug');
  //     console.log('AAA remarkCompiler6');
  //     console.log('AAA unified:', unified);
  //     console.log('AAA remarkSlug:', remarkSlug);
  //     console.log('AAA remarkParse:', remarkParse);
  //     console.log('AAA remarkHtml:', remarkHtml);
  //     console.log('AAA remarkAutolinkHeadings:', remarkAutolinkHeadings);

  //     if (!this.__remarkCompiler2) {
  //       console.log('AAA remarkCompiler2');
  //       const remarkPlugins = [remarkAutolinkHeadings.default];
  //       console.log('AAA remarkPlugins:', remarkPlugins);

  //       console.log('AAA creating processor');
  //       const processor = unified();
  //       console.log('AAA using remarkParse');
  //       processor.use(remarkParse.default);

  //       remarkPlugins.forEach((plugin, index) => {
  //         console.log(`AAA applying plugin[${index}]:`, plugin);
  //         processor.use(plugin);
  //       });
  //       console.log('AAA using remarkHtml');
  //       processor.use(remarkHtml.default);

  //       console.log('AAA freezing processor');
  //       this.__remarkCompiler2 = processor.freeze();
  //     }
  //   } catch (err) {
  //     console.error('AAA remarkCompiler2 error:', err);
  //     throw err;
  //   }
  //   return this.__remarkCompiler2;
  // }

//   private async remarkCompiler2() {
//   console.log('AAA remarkCompiler1');
//   try {
//     const remarkParse = await import('remark-parse');
//     const { unified } = await import('unified');
//     console.log('AAA unified:', unified);
//     const remarkAutolinkHeadings = await import('@rigor789/remark-autolink-headings');
//     const remarkHtml = await import('remark-html');
//     const remarkSlug = await import('remark-slug');

//     console.log('AAA remarkSlug:', remarkSlug);
//     if (!this.__remarkCompiler2) {
//       console.log('AAA remarkCompiler2');
//       const remarkPlugins = [remarkAutolinkHeadings.default];
//       console.log('AAA remarkPlugins:', remarkPlugins);

//       const processor = unified().use(remarkParse.default);
//       remarkPlugins.forEach((plugin, index) => {
//         console.log(`AAA applying plugin[${index}]:`, plugin);
//         processor.use(plugin);
//       });
//       processor.use(remarkHtml.default);

//       this.__remarkCompiler2 = processor.freeze();
//     }
//     return this.__remarkCompiler2;
//   } catch (err) {
//     console.error('AAA remarkCompiler2 error:', err);
//     throw err;
//   }
// }

  private __remarkCompiler: any;
  private __remarkCompiler2: any;
  private root: string;
  private outputAssetPathRoot: string;

  constructor(options: MarkdownPagesWebpackPluginOptions) {
    this.options = { ...options };
  }

  apply(compiler: webpack.Compiler & { watchMode?: boolean }): void {
    console.log('AAA apply', this.options);
    const { docsRoot, context } = this.options;
    this.root = context;
    if (docsRoot) {
      if (Path.isAbsolute(docsRoot)) {
        this.root = docsRoot;
      } else {
        this.root = Path.join(this.root, docsRoot);
      }
    }
    this.outputAssetPathRoot = this.options.outputAssetPathRoot || '';

    this.compiler = compiler;

    compiler.hooks.run.tapPromise(pluginName, async () => { await this.run(compiler); });
    compiler.hooks.watchRun.tapPromise(pluginName, async () => { await this.run(compiler); });
    PebulaNoCleanIfAnyWebpackPlugin.getCompilationHooks(this.compiler).keep.tap(
      pluginName,
      asset => this.lastNavEntriesAssetPath === asset || (this.urlCache.has(asset) && !this.recentChangedFiles.has(this.urlCache.get(asset))));


    compiler.hooks.thisCompilation.tap(pluginName, compilation => {
      this.emit(compilation);
      console.log('AAA thisCompilation', this.firstRun, this.watchMode);
      compilation.hooks.fullHash.tap(pluginName, hash => {
        hash.update(this.lastNavEntriesAssetPath);
      });
      console.log('AAA thisCompilation2', this.firstRun, this.watchMode);

      compilation.hooks.afterSeal.tapPromise(pluginName, async () => {
        for (const obj of Array.from(this.cache.values())) {
          compilation.fileDependencies.add(obj.fullPath);
        }
        this.prevTimestamps = compilation.fileSystemInfo.getDeprecatedFileTimestamps();

      });
      console.log('AAA thisCompilation3', this.firstRun, this.watchMode);
    });
  }

  private emit(compilation: webpack.Compilation) {
    console.log('AAA emit', this.firstRun, this.watchMode);
    this.recentChangedFiles.clear();

    if (!this.firstRun && this.watchMode) {
      for (const obj of Array.from(this.cache.values())) {
        if (obj.forceRender
          || !obj.postRenderMetadata
          || (this.prevTimestamps.get(obj.fullPath) || this.startTime) < (compilation.fileSystemInfo.getDeprecatedFileTimestamps().get(obj.fullPath) || Infinity)) {
          this.recentChangedFiles.add(obj);
        }
      }
    } else {
      this.recentChangedFiles = new Set(this.cache.values());
    }

    if (this.recentChangedFiles.size === 0) {
      return;
    }

    const { hashFunction, hashDigest, hashDigestLength } = compilation.outputOptions;

    const renderPage = (obj: ParsedPage) => {
      if (obj.postRenderMetadata) {
        delete compilation.assets[obj.postRenderMetadata.outputAssetPath];
      }

      let outputAssetPath: string;
      if (!obj.attr.empty) {
        const source = createPageFileAsset(obj);
        const hash = createHash(hashFunction);
        hash.update(source);
        outputAssetPath = this.outputAssetPathRoot + Path.join(Path.dirname(obj.file), `${hash.digest(hashDigest).substring(0, hashDigestLength)}.json`);

        if (!this.urlCache.has(outputAssetPath)) {
          var prev = obj.postRenderMetadata?.outputAssetPath;
          if (!!prev && this.urlCache.has(prev)) {
            this.urlCache.delete(prev);
          }

          this.urlCache.set(outputAssetPath, obj);
          compilation.emitAsset(outputAssetPath, new webpack.sources.RawSource(source));
        }

      }

      obj.postRenderMetadata = {
        navEntry: {
          title: obj.attr.title,
          path: obj.attr.path,
        },
        outputAssetPath,
      };

      const copyKeys: Array<keyof PageAttributes> = ['type', 'subType', 'tooltip', 'searchGroup'];
      copyKeys.forEach(key => {
        if (obj.attr[key]) {
          obj.postRenderMetadata.navEntry[key] = obj.attr[key];
        }
      });

      if (obj.attr.tags) {
        obj.postRenderMetadata.navEntry.tags = obj.attr.tags.split(',').map(t => t.trim());
      }
      if (obj.attr.ordinal >= 0) {
        obj.postRenderMetadata.navEntry.ordinal = obj.attr.ordinal;
      }
      if (!obj.attr.empty) {
        MarkdownPagesWebpackPlugin.getCompilationHooks(this.compiler).markdownPageParsed.call({ parsedPage: obj, compilation })
      }
    };

    const navMetadata: PageNavigationMetadata = {
      entries: {
      },
      entryData: {},
    };
    const children: ParsedPage[] = [];

    for (let obj of Array.from(this.cache.values())) {

      if (this.recentChangedFiles.has(obj)) {
        if (!obj.forceRender && !!obj.postRenderMetadata) {
          obj = this.processFile(obj.file);
        }
        obj.forceRender = false;
        renderPage(obj);

      }

      delete obj.postRenderMetadata.navEntry.children;

      if (!obj.attr.parent) {
        const entryGroupKey = obj.attr.path;
        navMetadata.entries[entryGroupKey] = obj.postRenderMetadata.navEntry;
      } else {
        children.push(obj);
      }
      if (obj.postRenderMetadata.outputAssetPath) {
        navMetadata.entryData[obj.attr.path] = obj.postRenderMetadata.outputAssetPath;
      }

      const now = Date.now();
      compilation.fileSystemInfo.getDeprecatedFileTimestamps().set(obj.fullPath, now);
      this.prevTimestamps.set(obj.fullPath, now);
    }

    let len: number;
    while (children.length !== len) {
      len = children.length;
      for (let i = 0; i < len; i++) {
        const o = children[i];
        if (o) {
          const parent = Array.from(this.cache.values()).find(p => p.attr.path === o.attr.parent);
          if (parent) {
            children.splice(i, 1);
            i--;
            if (!parent.postRenderMetadata.navEntry.children) {
              parent.postRenderMetadata.navEntry.children = [];
            }
            parent.postRenderMetadata.navEntry.children.push(o.postRenderMetadata.navEntry);
          }
        }
      }
    }

    if (children.length) {
      compilation.errors.push(new webpack.WebpackError(`Could not find a parent/child relationship in ${children.map(c => c.file).join(', ')}`));
    }

    this.firstRun = false;

    Object.values(navMetadata.entries).forEach(sortPageAssetNavEntry);

    const navEntriesSource = JSON.stringify(navMetadata);
    const hash = createHash(hashFunction);
    hash.update(navEntriesSource);
    const lastNavEntriesAssetPath = this.lastNavEntriesAssetPath;
    this.lastNavEntriesAssetPath = `${hash.digest(hashDigest).substring(0, hashDigestLength)}.json`;
    if (lastNavEntriesAssetPath === this.lastNavEntriesAssetPath)
      return;

    // compilation.emitAsset(this.lastNavEntriesAssetPath, new webpack.sources.RawSource(navEntriesSource));
    compilation.assets[this.lastNavEntriesAssetPath] = new webpack.sources.RawSource(navEntriesSource);
    MarkdownPagesWebpackPlugin.getCompilationHooks(this.compiler)
      .markdownPageNavigationMetadataReady.call({ navMetadata, compilation });

    console.log('AAA MarkdownPagesWebpackPlugin emit', this.lastNavEntriesAssetPath);
    PebulaDynamicDictionaryWebpackPlugin.find(this.compiler).update('markdownPages', this.lastNavEntriesAssetPath);
    console.log('AAA MarkdownPagesWebpackPlugin emit2');
    
  }

  private async run(compiler: webpack.Compiler & { watchMode?: boolean }) {
    // Store watch mode; assume true if not present (webpack < 4.23.0)
    this.watchMode = compiler.watchMode ?? true;
    console.log('run', this.watchMode);
    // await loadGlobby();
    // const globby = await loadGlobby();
    // const globbyModule = await import('globby');
    // const globby = globbyModule.default;
    const globbyModule = await import('globby');
    const globby = globbyModule.default;
    const paths = await globby(this.options.docsPath, {
      cwd: this.root,
    });
    console.log('Globby paths:', paths?.length);

    for (const p of paths) {
      if (this.firstRun || !this.cache.has(p)) {
        this.processFile(p);
      }
    }
  }

  private processFile(file: string) {
    const fullPath = Path.join(this.root, file);
    // console.log('AAA processFile1 fullPath:', fullPath);
    const source = fs.readFileSync(fullPath, { encoding: 'utf-8' });
    const parsedAttr = matter(source);
    // console.log('AAA processFile2 parsedAttr length:', parsedAttr.content.length);
    // try {
    //   const a = this.remarkCompiler2();//.processSync(parsedAttr.content).contents as string;
    //   console.log('AAA processFile3 a:', a);
    // } catch (error) {
    //   console.log('AAA processFile4 err:', error);
    // }
    const contents = this.remarkCompiler2().processSync(parsedAttr.content).contents as string;

    const parsedPage = {
      file,
      fullPath,
      source,
      contents,
      attr: parsedAttr.data as any,
      forceRender: true,
    };
    this.cache.set(file, parsedPage);
    return parsedPage;
  }
}
