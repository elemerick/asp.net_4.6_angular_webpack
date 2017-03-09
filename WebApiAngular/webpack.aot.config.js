const path = require(`path`);
const webpack = require(`webpack`);
const ExtractTextPlugin = require(`extract-text-webpack-plugin`);
const HtmlWebpackPlugin = require(`html-webpack-plugin`);
const CopyWebpackPlugin = require(`copy-webpack-plugin`);
const ngtools = require(`@ngtools/webpack`);
const aotLoader = require('@ultimate/aot-loader');

const NODE_ENV = process.env.NODE_ENV || `development`;

module.exports = {
  entry: {
    app: `./main.ts`,
    polyfills: `./polyfills.ts`,
    styles: `./css/styles.css`
  },
  context: path.join(__dirname, `src`), // make ./src folder as root for building process
  resolve: {
    modules: [path.resolve(__dirname, `src`), `node_modules`],
    extensions: [`.ts`, `.js`, `.css`, `.html`]
  },
  output: {
    path: path.join(__dirname, `client`),
    publicPath: `/`,
    filename: `[name]-[chunkhash].js`,
    library: `[name]`,
    chunkFilename: `[name]-[chunkhash].chunk.js`
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        //use: `@ngtools/webpack`,
        use: ['@ultimate/aot-loader'],
        exclude: [/\.(spec|e2e)\.ts$/]
      },
      {
        test: /\.html$/,
        use: `raw-loader` // html - for component templates
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/,
        use: `file-loader?name=images/[name].[ext]`
      },
      {
        test: /\.(woff|woff2|ttf|eot)$/,
        use: `file-loader?name=fonts/[name].[ext]`
      },
      {
        // css - The pattern matches application-wide styles, not Angular ones
        test: /\.css$/,
        exclude: path.join(__dirname, `src`, `app`),
        use: ExtractTextPlugin.extract({ fallback: `style-loader`, use: [`css-loader?sourceMap`]}) // postcss-loader
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
        NODE_ENV: JSON.stringify(NODE_ENV)
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: [`app`, `polyfills`] // we need this line, because polyfills have to go first before angular chunck
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: `node-static`,
      minChunks(module, count) {
        const context = module.context;
        return context && context.indexOf(`node_modules`) >= 0;
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({name: `manifest`}), // extract the webpack runtime, which contains references to all bundles and chunks anywhere in the build, into a separate bundle
    // ***********************************async chunks*************************
    // catch all - anything used in more than one place
    new webpack.optimize.CommonsChunkPlugin({
      name: `node-async`,
      async: `node-async`,
      minChunks(module, count) {
        return count >= 2;
      },
    }),
    new ExtractTextPlugin(
      { filename: `css/[name].[hash].css`, allChunks: true } // extracts embedded css as external files, adding cache-busting hash to the filename.
    ),
    new HtmlWebpackPlugin({
      template: `index.html` // Webpack inject scripts and links into index.html
    }),
    new CopyWebpackPlugin([ // Copy files and directories in webpack.
      { from: `./images`, to: `images` }
    ]),
    // new ngtools.AotPlugin({
    //   mainPath: `main.ts`,
    //   tsConfigPath: `./tsconfig.json`,
    //   skipCodeGeneration: true,
    //   exclude: [
    //     `./src/**/*.spec.ts`,
    //     `./src/test.ts`
    //   ],
    // })
    new aotLoader.AotPlugin({
      tsConfig: `./tsconfig.json`,
      entryModule: `./src/app/app.module#AppModule`
    })
  ],
  devtool: `source-map` // `inline-source-map` // `hidden-source-map`
};
