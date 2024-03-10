module.exports = {
    meta: {
        type: 'layout',
        docs: {
            description: 'Enforce spaces inside parentheses of control statements.',
            category: 'Stylistic issues',
            recommended: false
        },
        fixable: 'whitespace',
        schema: []
    },
    create ( context ) {
        const sourceCode = context.getSourceCode();

        const checkSpacing = node => {
            const getParenTokens = testNode => {
                let target;

                switch ( testNode.type ) {
                    case 'IfStatement':
                    case 'WhileStatement':
                    case 'DoWhileStatement':
                        target = testNode.test;
                        break;

                    case 'ForStatement':
                        target = testNode.init || testNode.test || testNode.update;
                        break;

                    case 'ForInStatement':
                    case 'ForOfStatement':
                        target = testNode.right;
                        break;

                    case 'CatchClause':
                        target = testNode.param ? testNode.param : testNode;
                        break;

                    case 'SwitchStatement':
                        target = testNode.discriminant;
                        break;

                    default:
                        return {};
                }

                return {
                    openingParen: target.type !== 'CatchClause'
                        ? sourceCode.getTokenBefore(target, {filter: token => token.value === '('})
                        : null,
                    closingParen: target.type !== 'CatchClause'
                        ? sourceCode.getTokenAfter(target, {filter: token => token.value === ')'})
                        : null
                };
            };


            const {openingParen, closingParen} = getParenTokens(node);

            if ( openingParen && closingParen ) {
                const afterOpening = sourceCode.getTokenAfter(openingParen);

                if ( afterOpening.start === openingParen.end ) {
                    context.report({
                        node: openingParen,
                        message: 'Expected a space after \'(\'.',
                        fix ( fixer ) {
                            return fixer.insertTextAfter(openingParen, ' ');
                        }
                    });
                }

                const beforeClosing = sourceCode.getTokenBefore(closingParen);

                if ( beforeClosing.end === closingParen.start ) {
                    context.report({
                        node: closingParen,
                        message: 'Expected a space before \')\'.',
                        fix ( fixer ) {
                            return fixer.insertTextBefore(closingParen, ' ');
                        }
                    });
                }
            }
        };

        return {
            IfStatement: checkSpacing,
            ForStatement: checkSpacing,
            WhileStatement: checkSpacing,
            DoWhileStatement: checkSpacing,
            ForInStatement: checkSpacing,
            ForOfStatement: checkSpacing,
            CatchClause: checkSpacing,
            SwitchStatement: checkSpacing
        };
    }

};
