module.exports = {
    meta: {
        type: 'layout',
        docs: {
            description: 'Enforce spaces inside function parentheses.',
            category: 'Stylistic issues',
            recommended: false
        },
        fixable: 'whitespace',
        schema: []
    },

    create ( context ) {
        const checkSpacing = node => {
            if ( node.params.length === 0 ) {
                return;
            }

            if (
                node.type === 'ArrowFunctionExpression'
                && !['VariableDeclarator', 'Property', 'AssignmentExpression'].includes(node.parent.type)
            ) {
                return;
            }

            const sourceCode = context.getSourceCode();
            const openingParen = sourceCode.getTokenBefore(node.params[0]);
            const closingParen = sourceCode.getTokenAfter(node.params[node.params.length - 1]);
            const firstParam = node.params[0];
            const lastParam = node.params[node.params.length - 1];
            const isFirstParamInNewLine = openingParen.loc.end.line < firstParam.loc.start.line;
            const isLastParamInNewLine = closingParen.loc.start.line > lastParam.loc.end.line;
            const isMultiline = firstParam.loc.start.line < lastParam.loc.end.line;
            const nextTokenAfterOpening = sourceCode.getTokenAfter(openingParen);
            const previousTokenBeforeClosing = sourceCode.getTokenBefore(closingParen);
            const startsWithBraceOrBracket = ['{', '['].includes(nextTokenAfterOpening.value);
            const endsWithBraceOrBracket = ['}', ']'].includes(previousTokenBeforeClosing.value);
            const shouldCheckSpaces = (
                !isMultiline
                || (
                    isMultiline
                    && startsWithBraceOrBracket
                    && isFirstParamInNewLine
                    && endsWithBraceOrBracket
                    && isLastParamInNewLine
                )
            );

            if ( !shouldCheckSpaces ) {
                return;
            }

            if ( openingParen.range[1] === nextTokenAfterOpening.range[0] ) {
                context.report({
                    node: openingParen,
                    message: 'Expected a space after \'(\'.',
                    fix ( fixer ) {
                        return fixer.insertTextAfter(openingParen, ' ');
                    }
                });
            }

            if ( previousTokenBeforeClosing.range[1] === closingParen.range[0] ) {
                context.report({
                    node: closingParen,
                    message: 'Expected a space before \')\'.',
                    fix ( fixer ) {
                        return fixer.insertTextBefore(closingParen, ' ');
                    }
                });
            }
        };

        return {
            FunctionDeclaration: checkSpacing,
            FunctionExpression: checkSpacing,
            ArrowFunctionExpression: checkSpacing
        };
    }
};
