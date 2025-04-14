import { AngularWebpackPlugin } from '@ngtools/webpack';
import { PebulaDynamicDictionaryWebpackPlugin } from '@pebula-internal/webpack-dynamic-dictionary';
import { MarkdownAppSearchWebpackPlugin } from '@pebula-internal/webpack-markdown-app-search';
import { MarkdownCodeExamplesWebpackPlugin } from '@pebula-internal/webpack-markdown-code-examples';
import { MarkdownPagesWebpackPlugin } from '@pebula-internal/webpack-markdown-pages';
import { PebulaNoCleanIfAnyWebpackPlugin } from '@pebula-internal/webpack-no-clean-if-any';
import { SsrAndSeoWebpackPlugin } from '@pebula-internal/webpack-ssr-and-seo';
import * as Path from 'path-browserify';
import simplegit from 'simple-git/promise';
import { Compiler, Configuration, ContextReplacementPlugin, DefinePlugin, HotModuleReplacementPlugin, IgnorePlugin, NormalModuleReplacementPlugin, ProvidePlugin, WebpackOptionsNormalized, optimize } from 'webpack';
import { NGRID_CONTENT_MAPPING_FILE } from '../src/constants';
import * as remarkPlugins from './remark';
// const unified = require('unified');
const remarkParse = require('remark-parse');
// const remarkHtml = require('remark-html');
const remarkSlug = require('remark-slug');
const remarkAutolinkHeadings = require('@rigor789/remark-autolink-headings');


// import * as nodeExternals from 'webpack-node-externals';
// import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
// const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

// import * as webpack from 'webpack';
// import { composePlugins, NxWebpackPlugin, withNx } from '@nx/webpack';

const appRoot = Path.resolve(__dirname, "..");
// export const NGRID_CONTENT_MAPPING_FILE = 'ngrid-content-mapping.json';
// import remarkSlug from 'remark-slug';
// import remarkAutolinkHeadings from '@rigor789/remark-autolink-headings';
// import remarkAttr from 'remark-attr';
const remarkAttr = require('remark-attr');
const customBlockquotesOptions = {
  mapping: {
    'i>': 'info',
    'I>': 'info icon',
    'w>': 'warn',
    'W>': 'warn icon',
    'e>': 'error',
    'E>': 'error icon',
  }
};
const angular = require('@angular/core/package.json');
const cdk = require('@angular/cdk/package.json');
const ngrid = require('../../../libs/ngrid/package.json');
// console.log('remarkSlug:', remarkSlug);
// console.log('remarkAutolinkHeadings:', remarkAutolinkHeadings);

const fn = async () => {
  const format = {
    short_hash: '%h',
    hash: '%H',
    date: '%ai',
    message: '%s',
    refs: '%D',
    body: '%b',
    author_name: '%aN',
    author_email: '%ae'
  };
  const gitInfo = await simplegit().log({ n: "1", format });
  return {
    NGRID_CONTENT_MAPPING_FILE: JSON.stringify(NGRID_CONTENT_MAPPING_FILE),
    ANGULAR_VERSION: JSON.stringify(angular.version),
    CDK_VERSION: JSON.stringify(cdk.version),
    NGRID_VERSION: JSON.stringify(ngrid.version),
    BUILD_VERSION: JSON.stringify(gitInfo.latest.short_hash),
  };
};

export class AsyncDefinePlugin {
  constructor(private asyncDef: () => Promise<any>) { }

  apply(compiler: Compiler) {
    let executeDefinePlugin = async () => {
      const definitions = await this.asyncDef();
      const definePlugin = new DefinePlugin(definitions);
      definePlugin.apply(compiler);
    };

    compiler.hooks.run.tapPromise('AsyncDefinePlugin', executeDefinePlugin);

    compiler.hooks.watchRun.tapPromise('AsyncDefinePlugin', async () => {
      if (executeDefinePlugin) {
        await executeDefinePlugin();
        executeDefinePlugin = undefined;
      }
    });
  }
}
function updateWebpackConfig(webpackConfig: WebpackOptionsNormalized): WebpackOptionsNormalized {
  return webpackConfig;
}

// function updateWebpackConfig2(webpackConfig: Configuration): Configuration {
//   return webpackConfig;
// }

// console.log('AAA Config Loaded');

const customWebpackConfig2: any = (
  config: any,
  context: { options: any; configuration?: string }
) => {
  // console.log('AAA Nx Context:', context); // Debug context
  const env = context.configuration === 'production' ? 'production' : 'development';

  config.target = 'web';

  config.bail = true;
  config.devtool = 'eval';
  config.mode = 'development';

  // Merge entry
  config.entry = {
    main: { import: ['./apps/ngrid-docs-app/src/main.ts'] },
  };

  // Merge output
  config.output = {
    ...config.output,
    path: Path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
  };
  config.devServer = {
    ...config.devServer,
    liveReload: true,
  };

  // Merge module rules
  config.module = config.module || { rules: [], defaultRules: [], generator: {}, parser: {} };
  config.module.rules = [
    ...(config.module.rules || []),
    {
      test: /\.ts$/,
      use: 'ts-loader',
      exclude: /node_modules/
    },
    {
      test: /\.json$/,
      type: 'json'
    },
    {
      test: [/\.html$/],
      use: ['html-loader'],
      resourceQuery: { not: [/\\?ngResource/] },
    },
    {
      test: /\.d\.ts$/,
      use: 'null-loader',
      include: /node_modules\/esbuild/
    },
    {
      test: /\.d\.ts$/,
      loader: 'ignore-loader', // Ensures TypeScript declaration files are ignored
    },
    {
      test: /\.js$/,
      // include: [
      //   Path.resolve(__dirname, '../log.js'), // Adjust path if needed
      //   /node_modules\/webpack\/hot/, // Process webpack/hot/log.js
      // ],
      exclude: [/node_modules\/(?!@angular\/platform-browser)/],
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-transform-modules-commonjs'],
          cacheDirectory: false,
          sourceType: 'unambiguous'
        },
      },
    },
    {
      test: /\.mjs$/,
      type: 'javascript/esm', // Treat .mjs as ESM
      resolve: {
        fullySpecified: false, // Allow flexibility
      },
    }
  ];

  // console.log('AAA __dirname', __dirname);

  // Merge plugins
  config.plugins = config.plugins || [];
  config.plugins.push(
    new NormalModuleReplacementPlugin(
      /webpack-dev-server\/client/,
      Path.resolve(__dirname, 'empty.js')
    ),
    new NormalModuleReplacementPlugin(
      /^node:assert$/,
      require.resolve('assert/')
    ),
    new NormalModuleReplacementPlugin(
      /^node:buffer$/,
      require.resolve('buffer/')
    ),
    new NormalModuleReplacementPlugin(
      /^node:path$/,
      require.resolve('path-browserify')
    ),
    new NormalModuleReplacementPlugin(
      /^node:querystring$/,
      require.resolve('querystring-es3')
    ),
    new NormalModuleReplacementPlugin(
      /^node:vm$/,
      require.resolve('vm-browserify')
      //Path.resolve(__dirname, 'stub-vm.js') // Stub node:vm
    ),
    // new NormalModuleReplacementPlugin(
    //   /locate-path/,
    //   Path.resolve(__dirname, 'stub-locate-path.js') // Use Path.resolve directly
    // ),
    // new NormalModuleReplacementPlugin(
    //   /domino/,
    //   Path.resolve(__dirname, 'stub-domino.js') // Stub domino
    // ),
    // new BundleAnalyzerPlugin(),
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    new DefinePlugin({
      __filename: JSON.stringify(''),
      __dirname: JSON.stringify(''),
    }),
    // new NormalModuleReplacementPlugin(/webpack\/hot/, () => { }),
    // new NodePolyfillPlugin(),
    new ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
      // util: isServer(context) ? 'util' : require.resolve('util/'),
    }),
    // new HotModuleReplacementPlugin(),
    // new optimize.ModuleConcatenationPlugin(),
    //new BundleAnalyzerPlugin(),
    // new AngularWebpackPlugin(/* {
    //   tsconfig: context.options?.tsConfig || Path.resolve(__dirname, 'tsconfig.app.json'), // Use context or fallback
    // } */),
    new AngularWebpackPlugin({
      tsconfig: Path.resolve(__dirname, '../tsconfig.app.json'), // Adjust path
      emitNgModuleScope: false, // Prevent CommonJS scope issues
      jitMode: false, // Use Ivy AOT for ESM output
    }),
    new PebulaDynamicDictionaryWebpackPlugin(NGRID_CONTENT_MAPPING_FILE),
    new MarkdownAppSearchWebpackPlugin({}),
    new MarkdownCodeExamplesWebpackPlugin({
      context: appRoot,
      docsPath: './content/**/*.ts',
    }),
    new MarkdownPagesWebpackPlugin({
      context: appRoot,
      docsPath: '**/*.md',
      docsRoot: './content',
      outputAssetPathRoot: 'md-content',
      remarkPlugins: [
        remarkSlug,
        remarkAutolinkHeadings,
        [remarkAttr, { scope: 'permissive' }],
        remarkPlugins.gatsbyRemarkPrismJs(),
        [remarkPlugins.customBlockquotes, customBlockquotesOptions],
      ],
    }),
    new PebulaNoCleanIfAnyWebpackPlugin(),
    new SsrAndSeoWebpackPlugin({
      ssrPagesFilename: 'ssr-pages.json',
      sitemap: {
        basePath: 'https://shlomiassaf.github.io/ngrid',
        fileName: 'sitemap.xml'
      }
    }),
    new AsyncDefinePlugin(fn),
    // new IgnorePlugin({
    //   resourceRegExp: /webpack\/hot/
    // }),
    new IgnorePlugin({
      resourceRegExp: /^jsdom$/, // Ignore jsdom
    }),
    new IgnorePlugin({
      resourceRegExp: /^child_process$/
    }),
    new IgnorePlugin({
      resourceRegExp: /^\.\/swc\.[a-z0-9-]+\.node$/,
      contextRegExp: /@swc\/core/
    }),
    new IgnorePlugin({
      resourceRegExp: /^@swc\/core-(darwin-arm64|android-arm64|android-arm-eabi|win32-x64-msvc|win32-ia32-msvc|win32-arm64-msvc|darwin-universal|darwin-x64|freebsd-x64|freebsd-arm64|wasm32-wasi|linux-riscv64-musl|linux-riscv64-gnu|linux-s390x-gnu|linux-x64-musl|linux-x64-gnu|linux-arm64-musl|linux-arm64-gnu|linux-arm-gnueabihf)$/
    }),
    new IgnorePlugin({
      resourceRegExp: /^\.\/swc\.linux-s390x-gnu\.node$/,
    }),
    new IgnorePlugin({
      resourceRegExp: /^\.\/swc\.wasi\.cjs$/,
    }),
    // new IgnorePlugin({
    //   resourceRegExp: /^util$/,
    // }),
    new ContextReplacementPlugin(
      /@swc\/core/,
      (data: any) => {
        delete data.dependencies[0].critical;
        return data;
      }
    ),
    new ContextReplacementPlugin(
      /esbuild\/lib/,
      Path.resolve(__dirname, '../../../node_modules/esbuild/lib')
    ),
    new ContextReplacementPlugin(
      /loader-runner/,
      (context: any) => {
        if (/lib\/loadLoader/.test(context.request)) {
          context.request = './fixedLoader';
        }
      }
    ),
    new ContextReplacementPlugin(
      /jest-worker/,
      (context: any) => {
        if (/BaseWorkerPool/.test(context.request)) {
          context.request = './fixedBaseWorkerPool';
        }
      }
    ),
    new ContextReplacementPlugin(
      /typescript/,
      (context: any) => {
        if (/lib\/typescript/.test(context.request)) {
          context.request = './fixedTypescript';
        }
      }
    ),
    new ContextReplacementPlugin(
      /terser-webpack-plugin\/node_modules\/jest-worker/,
      (context: any) => {
        if (/BaseWorkerPool/.test(context.request)) {
          context.request = './fixedBaseWorkerPool';
        }
      }
    )
  );

  if (!isServer) {
    config.plugins.push(
      new NormalModuleReplacementPlugin(
        /find-cache-dir/,
        Path.resolve(__dirname, 'stub-find-cache-dir.js')
      ),
      new NormalModuleReplacementPlugin(
        /pkg-dir/,
        Path.resolve(__dirname, 'stub-pkg-dir.js')
      )
    );
  }
  // console.log('AAA Webpack externals1:', config.externals, context.options);

  // config.externals = {
  //   jsdom: 'commonjs jsdom', // Exclude jsdom from the bundle
  // };

  // const isServer = context.options?.target === 'server' || process.env.NX_TASK_TARGET === 'server';
  config.externals = isServer(context) ? {} : { 'jsdom': 'commonjs jsdom' };

  // config.externals = context.target === 'node' ? {} : { 'jsdom': 'commonjs jsdom' };

  console.log('AAA Webpack externals2:', config.externals);

  // config.externals = [/* {
  //   'jsdom': 'commonjs jsdom', // Treat as server-side only
  // } */];
  // config.externals = [nodeExternals({
  //   allowlist: [
  //     /^@angular\//,
  //     /^rxjs\//,
  //     /^@nguniversal\//,
  //     /^@ng-bootstrap\//,
  //     'rxjs',
  //     // '@ngtools/webpack',
  //     // 'stream-http',
  //     // 'https-browserify',
  //     // 'tty-browserify',
  //     // 'constants-browserify',
  //     // 'querystring-es3',
  //     // 'os-browserify/browser',
  //     // 'browserify-zlib',
  //     // 'util/',
  //     // 'stream-browserify',
  //     'angulartics2',
  //     'zone.js',
  //     'tslib',
  //   ],
  //   // modulesDir: Path.resolve(__dirname, 'node_modules'),

  // })];

  // Merge resolve
  config.resolve = {
    ...config.resolve,
    // preferRelative: true,
    extensions: ['.ts', '.js', '.mjs', '.json'],
    alias: {
      ...config.resolve?.alias,
      'node:assert': 'assert',
      'node:buffer': 'buffer',
      'node:path': 'path-browserify',
      'node:querystring': 'querystring-es3',
      'node:vm': 'vm-browserify',
      'util': require.resolve('util/'),
      //'node:vm': Path.resolve(__dirname, 'stub-vm.js'),
      // 'domino': Path.resolve(__dirname, 'stub-domino.js'),
    },
    fallback: {
      ...config.resolve?.fallback,
      "assert": require.resolve("assert/"),
      "buffer": require.resolve("buffer/"),
      "path": require.resolve("path-browserify"),
      "vm": require.resolve("vm-browserify"),
      //"vm": Path.resolve(__dirname, 'stub-vm.js'),
      "stream": require.resolve("stream-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "util": require.resolve("util/"),
      "os": require.resolve("os-browserify/browser"),
      "zlib": require.resolve("browserify-zlib"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "tty": require.resolve("tty-browserify"),
      "constants": require.resolve("constants-browserify"),
      "querystring": require.resolve("querystring-es3"),
      "child_process": false,
      "fs": false,
      "net": false,
      "tls": false,
      "module": false,
      "worker_threads": false,
      "perf_hooks": false,
      "inspector": false,
      "pnpapi": false
    },
  };

  // Merge additional settings
  config.cache = {
    type: 'filesystem',
    cacheDirectory: Path.resolve(__dirname, '.webpack-cache/cache-location'), // Added cache location
    buildDependencies: {
      config: [__filename],
    },
  };

  // config.externals = process.env.NX_TASK_TARGET === 'serve-ssr' ? [nodeExternals()] : [];
  config.resolveLoader = {
    modules: ['node_modules', 'libs-internal'],
  };

  config.experiments = {
    topLevelAwait: true, // Enable top-level await for dynamic imports
    outputModule: false,  // Enable output as ES module
  };
  // config.output = {
  //  //module: true
  // },
  config.externalsPresets = {};
  config.infrastructureLogging = {};
  config.node = {
    __dirname: false,
    __filename: false,
    global: true, // Keep global object
  };
  config.optimization = {
    ...config.optimization,
    runtimeChunk: false, // Prevents runtime code that might include HMR
    // splitChunks: {
    //   cacheGroups: {
    //     default: false,
    //     vendors: false,
    //   },
    // },
  };
  config.performance = {};
  config.snapshot = {};
  config.stats = {};//'verbose';
  // config.infrastructureLogging = {
  //   level: 'verbose', // Log detailed information
  // };
  config.watchOptions = {};

  // Apply your update function
  return updateWebpackConfig(config);
};

// export default composePlugins(
//   withNx(),
//   customWebpackConfig
// );

// const webpackConfig: WebpackOptionsNormalized = {
//   entry: {
//     main: {
//       import: ['apps/ngrid-docs-app/src/main.ts'],
//     }
//   },
//   output: {
//     path: Path.resolve(__dirname, 'dist'),
//     filename: '[name].[contenthash].js',
//     chunkFilename: '[name].[contenthash].js'
//   },
//   devServer: {
//     hot: false,
//     liveReload: true,
//   },
//   module: {
//     defaultRules: [],
//     generator: {},
//     parser: {},
//     rules: [
//       {
//         test: /\.ts$/,
//         use: 'ts-loader',
//         exclude: /node_modules/
//       },
//       {
//         test: /\.json$/,
//         type: 'json'
//       },
//       // {
//       //   test: /\.css$/,
//       //   use: ['style-loader', 'css-loader'],
//       // },
//       {
//         test: [/\.html$/],
//         use: ["html-loader"],
//         resourceQuery: { not: [/\\?ngResource/] },
//       },
//       {
//         test: /\.d\.ts$/,
//         use: 'null-loader',
//         include: /node_modules\/esbuild/
//       },
//       {
//         test: /\.d\.ts$/,
//         loader: 'ignore-loader', // Ensures TypeScript declaration files are ignored
//       },
//       {
//         test: /\.js$/,
//         exclude: /node_modules/,
//         use: {
//           loader: 'babel-loader',
//           options: {
//             presets: ['@babel/preset-env']
//           }
//         }
//       }
//     ]
//   },
//   plugins: [
//     new NodePolyfillPlugin(),
//     new ProvidePlugin({
//       process: 'process/browser',
//       Buffer: ['buffer', 'Buffer'],

//     }),
//     // new optimize.ModuleConcatenationPlugin(),
//     //new BundleAnalyzerPlugin(),
//     new AngularWebpackPlugin(),
//     new DefinePlugin({
//       'process.env.NODE_ENV': JSON.stringify('production'),
//     }),
//     new PebulaDynamicDictionaryWebpackPlugin(NGRID_CONTENT_MAPPING_FILE),
//     new MarkdownAppSearchWebpackPlugin({}),
//     new MarkdownCodeExamplesWebpackPlugin({
//       context: appRoot,
//       docsPath: './content/**/*.ts',
//     }),
//     // new MarkdownPagesWebpackPlugin({
//     //   context: appRoot,
//     //   docsPath: '**/*.md',
//     //   docsRoot: './content',
//     //   outputAssetPathRoot: 'md-content',
//     //   remarkPlugins: [
//     //     remarkSlug,
//     //     remarkAutolinkHeadings,
//     //     [remarkAttr, { scope: 'permissive' }],
//     //     remarkPlugins.gatsbyRemarkPrismJs(),
//     //     [remarkPlugins.customBlockquotes, customBlockquotesOptions],
//     //   ],
//     // }),
//     new PebulaNoCleanIfAnyWebpackPlugin(),
//     new SsrAndSeoWebpackPlugin({
//       ssrPagesFilename: 'ssr-pages.json',
//       sitemap: {
//         basePath: 'https://shlomiassaf.github.io/ngrid',
//         fileName: 'sitemap.xml'
//       }
//     }),
//     new AsyncDefinePlugin(fn),
//     new IgnorePlugin({
//       resourceRegExp: /^child_process$/
//     }),
//     new IgnorePlugin({
//       resourceRegExp: /^\.\/swc\.[a-z0-9-]+\.node$/,
//       contextRegExp: /@swc\/core/
//     }),
//     new IgnorePlugin({
//       resourceRegExp: /^@swc\/core-(darwin-arm64|android-arm64|android-arm-eabi|win32-x64-msvc|win32-ia32-msvc|win32-arm64-msvc|darwin-universal|darwin-x64|freebsd-x64|freebsd-arm64|wasm32-wasi|linux-riscv64-musl|linux-riscv64-gnu|linux-s390x-gnu|linux-x64-musl|linux-x64-gnu|linux-arm64-musl|linux-arm64-gnu|linux-arm-gnueabihf)$/
//     }),
//     new IgnorePlugin({
//       resourceRegExp: /^\.\/swc\.linux-s390x-gnu\.node$/,
//     }),
//     new IgnorePlugin({
//       resourceRegExp: /^\.\/swc\.wasi\.cjs$/,
//     }),
//     new ContextReplacementPlugin(
//       /@swc\/core/,
//       (data) => {
//         delete data.dependencies[0].critical;
//         return data;
//       }
//     ),
//     new ContextReplacementPlugin(
//       /esbuild\/lib/,
//       Path.resolve(__dirname, '../../../node_modules/esbuild/lib')
//     ),
//     new ContextReplacementPlugin(
//       /loader-runner/,
//       (context: any) => {
//         if (/lib\/loadLoader/.test(context.request)) {
//           context.request = './fixedLoader';
//         }
//       }
//     ),
//     new ContextReplacementPlugin(
//       /jest-worker/,
//       (context: any) => {
//         if (/BaseWorkerPool/.test(context.request)) {
//           context.request = './fixedBaseWorkerPool';
//         }
//       }
//     ),
//     new ContextReplacementPlugin(
//       /typescript/,
//       (context: any) => {
//         if (/lib\/typescript/.test(context.request)) {
//           context.request = './fixedTypescript';
//         }
//       }
//     ),
//     new ContextReplacementPlugin(
//       /terser-webpack-plugin\/node_modules\/jest-worker/,
//       (context: any) => {
//         if (/BaseWorkerPool/.test(context.request)) {
//           context.request = './fixedBaseWorkerPool';
//         }
//       }
//     ),
//   ],
//   resolve: {
//     extensions: ['.ts', '.js', '.json'],
//     alias: {
//       'node:assert': 'assert',
//       'node:buffer': 'buffer',
//       'node:path': 'path-browserify',
//       'node:vm': 'vm-browserify',
//       // Add other node: aliases as needed
//     },
//     fallback: {
//       "assert": require.resolve("assert/"),
//       "buffer": require.resolve("buffer/"),
//       "path": require.resolve("path-browserify"),
//       "vm": require.resolve("vm-browserify"),
//       "stream": false, //require.resolve("stream-browserify"),
//       "crypto": false, //require.resolve("crypto-browserify"),
//       "util": require.resolve("util/"),
//       "os": require.resolve("os-browserify/browser"),
//       "zlib": require.resolve("browserify-zlib"),
//       "http": require.resolve("stream-http"),
//       "https": require.resolve("https-browserify"),
//       "tty": require.resolve("tty-browserify"),
//       "constants": require.resolve("constants-browserify"),
//       "querystring": require.resolve("querystring-es3"),
//       "child_process": false,
//       "fs": false,
//       "net": false,
//       "tls": false,
//       //--=---
//       "module": false,
//       "worker_threads": false,
//       "perf_hooks": false,
//       "inspector": false,
//       "pnpapi": false
//     },
//   },
//   cache: {
//     type: "filesystem",
//     buildDependencies: {
//       config: [__filename]
//     }
//   },
//   experiments: {},
//   externals: [nodeExternals()],
//   externalsPresets: {},
//   infrastructureLogging: {},
//   node: {},
//   optimization: {
//     runtimeChunk: false, // Prevents runtime code that might include HMR
//     splitChunks: {
//       cacheGroups: {
//         default: false,
//         vendors: false,
//       },
//     },
//   },
//   // optimization: {},
//   performance: {},
//   resolveLoader: {
//     modules: ["node_modules", "libs-internal"]
//   },
//   snapshot: {},
//   stats: {},
//   watchOptions: {}
// }

// export default customWebpackConfig;
module.exports = customWebpackConfig2;


function isServer(context: { options: any; configuration?: string }) {
  return context.options?.target === 'server' || process.env.NX_TASK_TARGET === 'server';
}
// const updatedWebpackConfig = updateWebpackConfig(webpackConfig);

// module.exports = (config, context) => {
//   return updateWebpackConfig(config, context);
// }