const BROWSERS = [
  'last 2 Chrome versions',
  'last 2 ChromeAndroid versions',
  'last 2 Firefox versions',
  'last 2 Safari versions',
  'last 2 ios versions',
  'last 2 edge versions',
  'last 2 ie versions',
  'last 2 Opera versions'
]

const plugins = [
  // class { handleClick = () => { } }
  require.resolve('@babel/plugin-proposal-class-properties'),
  // The following two plugins use Object.assign directly, instead of Babel's
  // extends helper. Note that this assumes `Object.assign` is available.
  // { ...todo, completed: true }
  [
    require.resolve('@babel/plugin-proposal-object-rest-spread'),
    {
      useBuiltIns: true
    }
  ],
  // Transforms JSX
  [
    require.resolve('@babel/plugin-transform-react-jsx'),
    {
      useBuiltIns: true
    }
  ],
  // Polyfills the runtime needed for async/await and generators
  [
    require.resolve('@babel/plugin-transform-runtime'),
    {
      helpers: false,
      polyfill: false,
      regenerator: true
    }
  ]
]

var env = process.env.BABEL_ENV || process.env.NODE_ENV
if (env !== 'development' && env !== 'test' && env !== 'production') {
  throw new Error(
    'Using `babel-preset-react-app` requires that you specify `NODE_ENV` or ' +
    '`BABEL_ENV` environment variables. Valid values are "development", ' +
    '"test", and "production". Instead, received: ' +
    JSON.stringify(env) +
    '.'
  )
}

if (env === 'development' || env === 'test') {
  // The following two plugins are currently necessary to make React warnings
  // include more valuable information. They are included here because they are
  // currently not enabled in babel-preset-react. See the below threads for more info:
  // https://github.com/babel/babel/issues/4702
  // https://github.com/babel/babel/pull/3540#issuecomment-228673661
  // https://github.com/facebookincubator/create-react-app/issues/989
  plugins.push.apply(plugins, [
    // Adds component stack to warning messages
    require.resolve('@babel/plugin-transform-react-jsx-source'),
    // Adds __self attribute to JSX which React will use for some warnings
    require.resolve('@babel/plugin-transform-react-jsx-self')
  ])
}

if (env === 'test') {
  module.exports = function (api, opts) {
    return {
      presets: [
      // ES features necessary for user's Node version
        [
          require('@babel/preset-env').default,
          {
            targets: {
              node: 'current'
            }
          }
        ],
      // JSX, Flow
        require.resolve('@babel/preset-react')
      ],
      plugins: plugins.concat([
      // Compiles import() to a deferred require()
        require.resolve('babel-plugin-dynamic-import-node-babel-7')
      ])
    }
  }
} else {
  module.exports = function (api, opts) {
    return {
      presets: [
      // Latest stable ECMAScript features
        [
          require.resolve('@babel/preset-env'),
          {
            targets: {
              browsers: BROWSERS
            },
          // Disable polyfill transforms
            useBuiltIns: false,
          // Do not transform modules to CJS
            modules: false
          }
        ],
      // JSX, Flow
        require.resolve('@babel/preset-react')
      ],
      plugins: plugins.concat([
      // function* () { yield 42; yield 43; }
        [
          require.resolve('@babel/plugin-transform-regenerator'),
          {
          // Async functions are converted to generators by babel-preset-env
            async: false
          }
        ],
      // Adds syntax support for import()
        require.resolve('@babel/plugin-syntax-dynamic-import')
      ])

    }
  }

  if (env === 'production') {
    plugins.push.apply(plugins, [
      require.resolve('@babel/plugin-transform-react-constant-elements')
    ])
  }
}
