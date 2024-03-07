module.exports = {
    overrides: [
        {
            files: ['*.jsx', '*.js']
        }
    ],

    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',

        // https://www.npmjs.com/package/eslint-config-airbnb-base
        'airbnb-base',

        // https://github.com/import-js/eslint-plugin-import
        'plugin:import/recommended'
    ],

    settings: {
        react: {
            version: 'detect'
        }
    },

    env: {
        es2022: true,
        browser: true
    },

    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },

    rules: {
        // base
        'arrow-parens': ['warn', 'as-needed'],
        'comma-dangle': ['error', 'never'],
        'no-console': 'off',
        'no-multiple-empty-lines': ['error', {max: 2, maxEOF: 0, maxBOF: 0}],
        'no-plusplus': 'off',
        'no-shadow': ['error', {builtinGlobals: false, hoist: 'all', allow: ['error']}],
        'no-unused-expressions': ['error', {allowShortCircuit: true}],
        'no-use-before-define': 'off',
        'object-curly-spacing': ['error', 'never'],
        'space-before-function-paren': ['error', {anonymous: 'always', named: 'always'}],
        'space-in-parens': 'off',
        'spaced-comment': 'off',
        'class-methods-use-this': 'off',
        indent: ['error', 4, {SwitchCase: 1}],
        'default-case': 'off',
        'max-len': ['warn', {code: 150}],
        'no-multi-assign': 'off',
        'no-return-assign': ['error', 'except-parens'],
        'import/no-cycle': 'off',
        'no-restricted-exports': 'off',
        'no-unused-vars': 'error',
        'object-curly-newline': [
            'error',
            {
                ObjectExpression: {
                    minProperties: 6,
                    multiline: true,
                    consistent: true
                },
                ObjectPattern: {
                    minProperties: 6,
                    multiline: true,
                    consistent: true
                },
                ImportDeclaration: {
                    minProperties: 6,
                    multiline: true,
                    consistent: true
                },
                ExportDeclaration: {
                    minProperties: 6,
                    multiline: true,
                    consistent: true
                }
            }
        ],

        quotes: [
            'error',
            'single',
            {
                allowTemplateLiterals: true
            }
        ],

        'jsx-quotes': ['error', 'prefer-double'],

        // plugins
        'import/extensions': ['warn', 'ignorePackages'],
        'import/no-extraneous-dependencies': 'off',
        'import/prefer-default-export': 'off',
        'import/no-anonymous-default-export': 'off',
        'import/no-relative-packages': 'off',
        'import/order': 'off',
        // https://github.com/import-js/eslint-plugin-import/issues/1868
        'import/no-unresolved': [2, {ignore: ['^@jooby-dev/jooby-codec']}],
        'react/jsx-tag-spacing': ['error', {beforeSelfClosing: 'never'}],

        'no-param-reassign': 'off',
        'guard-for-in': 'off',
        'no-await-in-loop': 'off',
        'no-continue': 'off',
        'no-bitwise': 'off'
    }
};
