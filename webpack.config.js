const path = require('path');

module.exports = {
  entry: ['./src/index.js'],
  output: {
    path: path.join(__dirname, 'build'), // public (local) or build (production)
    filename: 'bundle.js',
  },
  performance: { hints: false },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
    ],
  },
};
