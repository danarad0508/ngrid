import path from 'path';

export default async () => {
  const styleLoader = await import('style-loader');
  const cssLoader = await import('css-loader');
  const sassLoader = await import('sass-loader');

  return {
    entry: path.resolve(__dirname, '../../libs/ngrid/theming/prebuilt/index.scss'),
    output: {
      path: path.resolve(__dirname, '../../dist/@pebula/ngrid/themes'),
      filename: 'styles.js',
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            styleLoader.default,
            cssLoader.default,
            sassLoader.default,
          ],
        },
      ],
    },
  };
};