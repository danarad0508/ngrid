import { AngularWebpackPlugin } from '@ngtools/webpack';
import { PebulaDynamicDictionaryWebpackPlugin } from '@pebula-internal/webpack-dynamic-dictionary';
import { MarkdownAppSearchWebpackPlugin } from '@pebula-internal/webpack-markdown-app-search';
import { MarkdownCodeExamplesWebpackPlugin } from '@pebula-internal/webpack-markdown-code-examples';
// import { MarkdownPagesWebpackPlugin } from '@pebula-internal/webpack-markdown-pages';
import { PebulaNoCleanIfAnyWebpackPlugin } from '@pebula-internal/webpack-no-clean-if-any';
import { SsrAndSeoWebpackPlugin } from '@pebula-internal/webpack-ssr-and-seo';
import * as Path from 'path-browserify';
import * as simplegit from 'simple-git/promise';
import { Compiler, ContextReplacementPlugin, DefinePlugin, IgnorePlugin, ProvidePlugin, WebpackOptionsNormalized, optimize } from 'webpack';
// import * as remarkPlugins from './remark';
import * as nodeExternals from 'webpack-node-externals';
import * as NodePolyfillPlugin from 'node-polyfill-webpack-plugin';
// const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// import * as webpack from 'webpack';

const appRoot = Path.resolve(__dirname, "..");
export const NGRID_CONTENT_MAPPING_FILE = 'ngrid-content-mapping.json';
// const remarkSlug = require('remark-slug')
// const remarkAutolinkHeadings = require('@rigor789/remark-autolink-headings');
// const remarkAttr = require('remark-attr')
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
// const angular = require('@angular/core/package.json');
// const cdk = require('@angular/cdk/package.json');
// const ngrid = require('../../../libs/ngrid/package.json');

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
    // ANGULAR_VERSION: JSON.stringify(angular.version),
    // CDK_VERSION: JSON.stringify(cdk.version),
    // NGRID_VERSION: JSON.stringify(ngrid.version),
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

const webpackConfig: WebpackOptionsNormalized = {
  entry: {
    main: {
      import: ['apps/ngrid-docs-app/src/main.ts'],
    }
  },
  output: {
    path: Path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js'
  },
  module: {
    defaultRules: [],
    generator: {},
    parser: {},
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        type: 'json'
      },
      // {
      //   test: /\.css$/,
      //   use: ['style-loader', 'css-loader'],
      // },
      {
        test: [/\.html$/],
        use: ["html-loader"],
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
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env']
            }
        }
      }
    ]
  },
  plugins: [
    new NodePolyfillPlugin(),
    new ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],

    }),
    // new optimize.ModuleConcatenationPlugin(),
    //new BundleAnalyzerPlugin(),
    new AngularWebpackPlugin(),
    new PebulaDynamicDictionaryWebpackPlugin(NGRID_CONTENT_MAPPING_FILE),
    new MarkdownAppSearchWebpackPlugin({}),
    new MarkdownCodeExamplesWebpackPlugin({
      context: appRoot,
      docsPath: './content/**/*.ts',
    }),
    // new MarkdownPagesWebpackPlugin({
    //   context: appRoot,
    //   docsPath: '**/*.md',
    //   docsRoot: './content',
    //   outputAssetPathRoot: 'md-content',
    //   remarkPlugins: [
    //     remarkSlug,
    //     remarkAutolinkHeadings,
    //     [remarkAttr, { scope: 'permissive' }],
    //     remarkPlugins.gatsbyRemarkPrismJs(),
    //     [remarkPlugins.customBlockquotes, customBlockquotesOptions],
    //   ],
    // }),
    new PebulaNoCleanIfAnyWebpackPlugin(),
    new SsrAndSeoWebpackPlugin({
      ssrPagesFilename: 'ssr-pages.json',
      sitemap: {
        basePath: 'https://shlomiassaf.github.io/ngrid',
        fileName: 'sitemap.xml'
      }
    }),
    new AsyncDefinePlugin(fn),
    new IgnorePlugin({
      resourceRegExp: /^child_process$/
    }),
    new IgnorePlugin({
      resourceRegExp: /^\.\/swc\.[a-z0-9-]+\.node$/,
      contextRegExp: /@swc\/core/
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
    new ContextReplacementPlugin(
      /@swc\/core/,
      (data) => {
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
      (context) => {
        if (/lib\/loadLoader/.test(context.request)) {
          context.request = './fixedLoader';
        }
      }
    ),
    new ContextReplacementPlugin(
      /jest-worker/,
      (context) => {
        if (/BaseWorkerPool/.test(context.request)) {
          context.request = './fixedBaseWorkerPool';
        }
      }
    ),
    new ContextReplacementPlugin(
      /typescript/,
      (context) => {
        if (/lib\/typescript/.test(context.request)) {
          context.request = './fixedTypescript';
        }
      }
    ),
    new ContextReplacementPlugin(
      /terser-webpack-plugin\/node_modules\/jest-worker/,
      (context) => {
        if (/BaseWorkerPool/.test(context.request)) {
          context.request = './fixedBaseWorkerPool';
        }
      }
    ),
  ],
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: {
      'node:assert': 'assert',
      'node:buffer': 'buffer',
      'node:path': 'path-browserify',
      'node:vm': 'vm-browserify',
      // Add other node: aliases as needed
    },
    fallback: {
      "assert": require.resolve("assert/"),
      "buffer": require.resolve("buffer/"),
      "path": require.resolve("path-browserify"),
      "vm": require.resolve("vm-browserify"),
      "stream": false, //require.resolve("stream-browserify"),
      "crypto": false, //require.resolve("crypto-browserify"),
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
      //--=---
      "module": false,
      "worker_threads": false,
      "perf_hooks": false,
      "inspector": false,
      "pnpapi": false
    },
  },
  cache: {
    type: "filesystem",
    buildDependencies: {
      config: [__filename]
    }
  },
  experiments: {},
  externals: [nodeExternals()],
  externalsPresets: {},
  infrastructureLogging: {},
  node: {},
  optimization: {},
  performance: {},
  resolveLoader: {
    modules: ["node_modules", "libs-internal"]
  },
  snapshot: {},
  stats: {},
  watchOptions: {}
}

const updatedWebpackConfig = updateWebpackConfig(webpackConfig);

module.exports = updatedWebpackConfig;

