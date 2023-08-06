
require('@babel/register')({
  presets: [
    require('@babel/preset-env').default,
    require('@babel/preset-typescript').default,
  ],
  plugins: [
    require('@babel/plugin-transform-modules-commonjs').default,
  ],
  exclude: ['node_modules'],
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
});
