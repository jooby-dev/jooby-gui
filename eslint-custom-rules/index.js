const spaceInFunctionParens = require('./rules/space-in-function-parens.js');
const spaceInControlParens = require('./rules/space-in-control-parens.js');


module.exports = {
    rules: {
        'space-in-function-parens': spaceInFunctionParens,
        'space-in-control-parens': spaceInControlParens
    }
};
