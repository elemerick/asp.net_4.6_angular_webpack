const path = require(`path`);
const webpack = require(`webpack`);
const ExtractTextPlugin = require(`extract-text-webpack-plugin`);
const HtmlWebpackPlugin = require(`html-webpack-plugin`);
const CopyWebpackPlugin = require(`copy-webpack-plugin`);

const NODE_ENV = process.env.NODE_ENV || `development`;

module.exports = {
  entry: {
    app: `./main.ts`,
    polyfills: `./polyfills.ts`
  },
  resolve: {
    modules: [path.resolve(__dirname, `src`), `node_modules`],
    extensions: [`.ts`, `.js`, `.css`, `.html`]
  },
  context: path.join(__dirname, `src`),
  output: {
    path: path.join(__dirname, `client`),
    publicPath: `/`,
    filename: `[name]-[chunkhash].js`,
    library: `[name]`,
    chunkFilename: `[name]-[chunkhash].chunk.js`,
    crossOriginLoading: `anonymous`
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [`awesome-typescript-loader`, `angular2-template-loader`, `angular-router-loader?loader='system'`],
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      {
        test: /\.html$/,
        use: `raw-loader`
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/,
        use: `file-loader?name=images/[name]-[hash].[ext]`
      },
      {
        test: /\.(woff|woff2|ttf|eot)$/,
        use: `file-loader?name=fonts/[name]-[hash].[ext]`
      },
      {
        // css - The pattern matches application-wide styles
        // It moves every require("style.css") in entry chunks into a separate css output file.
        test: /\.css$/,
        exclude: path.join(__dirname, `src`, `app`),
        loader: ExtractTextPlugin.extract({fallbackLoader: `style-loader`, loader: `css-loader?sourceMap-loader`}) // postcss-loader
      },
      {
        // the second handles component-scoped styles (the ones specified in a component`s styleUrls metadata property)
        test: /\.css$/,
        include: path.join(__dirname, `src`, `app`),
        use: `raw-loader` // loads them as strings via the raw loader — which is what Angular expects to do with styles specified in a styleUrls metadata property.
        // use: [`exports-loader?module.exports.toString()`, `css-loader?sourceMap-loader`,`postcss-loader`]
      }
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.NoEmitOnErrorsPlugin(), // stops the build if there is any error, and no files in output
    new webpack.ContextReplacementPlugin( // Workaround for angular/angular#11580
      /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/, // The (\\|\/) piece accounts for path separators in *nix and Windows
      path.join(__dirname, `src`)
    ),
    new webpack.DefinePlugin({ // use to define environment variables that we can reference within our application.
      'process.env': {
        'NODE_ENV': JSON.stringify(NODE_ENV)
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: `node-static`,
      filename: `node-static.js`,
      minChunks(module, count) {
        const context = module.context;
        return context && context.indexOf(`node_modules`) >= 0;
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({name: `manifest`}), // extract the webpack runtime, which contains references to all bundles and chunks anywhere in the build, into a separate bundle
    // ***********************************async chunks*************************
    // catch all - anything used in more than one place
    new webpack.optimize.CommonsChunkPlugin({
      filename: `node-async.js`,
      async: `node-async`,
      minChunks(module, count) {
        return count >= 2;
      },
    }),
    new ExtractTextPlugin({filename: `css/[name].[hash].css`, allChunks: true}), // extracts embedded css as external files, adding cache-busting hash to the filename.
    new HtmlWebpackPlugin({
      template: `index.html` // Webpack inject scripts and links into index.html
    }),
    new CopyWebpackPlugin([ // Copy files and directories in webpack.
      {from: `./images`, to: `images`}
    ]),
  ],
  watch: true,
  watchOptions: {
    aggregateTimeout: 2000 // timeout before rebuild in watch mode
  },
  devtool: `source-map`
};