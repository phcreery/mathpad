// const nerdamer = require('./nerdamer/all');

const nerdamer = require('nerdamer/all') // cannot be const, nerdamer object is updated below

function interpretSpecialCommands(str) {
  // remove \operatorname{sum}(2,4) and return sum(2,4)
  // is \ needed before sum?
  var operatorsRegex = /\\operatorname\{*([^}]+?)\}/gi
  var strippedvalue = str.replace(operatorsRegex, '\\$1')
  console.log('stripped', strippedvalue)

  // \left|\right| to abs()
  var absRegex = /\\left\|/gi
  strippedvalue = strippedvalue.replace(absRegex, 'abs(')
  console.log('stripped', strippedvalue)

  absRegex = /\\right\|/gi
  strippedvalue = strippedvalue.replace(absRegex, ')')
  console.log('stripped', strippedvalue)

  // add spaces to multiplication (monkeypatch)
  strippedvalue = strippedvalue.replace('\\cdot', ' \\cdot ')
  strippedvalue = strippedvalue.replace('\\times', ' \\times ')

  return strippedvalue
}

//perform preparations before parsing. Extract variables and declarations
function prepareExpression(str) {
  str = interpretSpecialCommands(str)
  var expression = str
  var scope = {}
  return [expression, scope]
}

// module.exports = {
export function flush() {
  nerdamer.flush()
}

export function calculate(inLaTeX, options) {
  // modified for LaTeX input
  // var txt = getText()
  var expressionAndScope = prepareExpression(inLaTeX)
  var expression = expressionAndScope[0]
  var scope = expressionAndScope[1]
  // var functionRegex = /^([a-z_][a-z\d_]*)\(([a-z_,\s]*)\):=(.+)$/gi //does not validate the expression
  var functionRegex = /^([a-z_][a-z\d_]*)\(([a-z_,\s]*)\)\s*(?::=|\\coloneq)\s*(.+)$/gi //does not validate the expression
  var functionDeclaration = functionRegex.exec(expression)
  console.log(JSON.stringify(expression), ' is function?', functionDeclaration)
  var evaluated
  var text
  var LaTeX

  //it might be a function declaration. If it is the scope object gets ignored
  if (functionDeclaration) {
    console.log('Got a function!')
    //Remember: The match comes back as [str, fnName, params, fnBody]
    //the function name should be the first group of the match
    var fnName = functionDeclaration[1]
    //the parameters are the second group according to this regex but comes with commas
    //hence the splitting by ,
    var params = functionDeclaration[2].split(',')
    //the third group is just the body and now we have all three parts nerdamer needs to create the function
    var fnBody = nerdamer.convertFromLaTeX(functionDeclaration[3]).toString()

    //we never checked if this is in proper format for nerdamer so we'll just try and if nerdamer complains we'll let the person know
    try {
      console.log('Name,Params,Body(convertFromLaTeX)', fnName, params, fnBody)
      evaluated = nerdamer.setFunction(fnName, params, fnBody)

      //generate the latex
      LaTeX =
        fnName + //parse the function name with nerdamer so we can get back some nice LaTeX
        '(' + //do the same for the parameters
        params
          .map(function(x) {
            return nerdamer(x).toTeX()
          })
          .join(',') +
        '):=' +
        nerdamer(fnBody).toTeX()

      // return evaluated
      // return undefined
      // console.log()
      return { text: undefined, LaTeX: undefined }
    } catch (e) {
      console.log('Error: Could not set function.</br>' + e.toString())
      return { text: 'error', LaTeX: 'error', error: 'Error: Could not set function.', body: e.toString() }
    }
  } else {
    var variableDeclaration = /^([a-z_][a-z\d_]*):(.+)$/gi.exec(expression)
    if (variableDeclaration) {
      console.log('Got a variable declaration!')
      try {
        var varName = variableDeclaration[1]
        var varValue = nerdamer.convertFromLaTeX(variableDeclaration[2]).toString()
        //set the value
        evaluated = nerdamer.setVar(varName, varValue)

        console.log('setting', varName, 'to(convertFromLaTeX)', varValue)
        LaTeX = varName + ':' + nerdamer(varValue).toTeX()
        text = nerdamer(varValue, scope).toString()
        // return [text, LaTeX]
        // return undefined
        return { text, LaTeX }
      } catch (e) {
        console.log('Something went wrong. Nerdamer could not parse expression!</br>' + e.toString())
        return { text: 'error', LaTeX: 'error', error: 'Something went wrong. Nerdamer could not parse expression!', body: e.toString() }
      }
    } else {
      try {
        //store the user expression so modifications don't get added
        // var user_expression = expression;
        // Extract solve
        // var expr_w_solve = user_expression.match(/solve\((.+),\s*\w\)/);
        // if(expr_w_solve) {
        //   user_expression = nerdamer.convertFromLaTeX(expr_w_solve[1]).toString()
        // } else {
        //   user_expression = nerdamer.convertFromLaTeX(user_expression).toString()
        // }
        console.log('looking at', expression)
        expression = nerdamer.convertFromLaTeX(expression).toString()
        console.log('expression(convertFromLaTeX)', expression, scope)
        evaluated = nerdamer(expression, scope)
        evaluated = evaluated.evaluate()
        text = evaluated.text(options.numberformat == 'decimals' ? 'decimals' : undefined, options.decimals)
        // LaTeX = evaluated.toTeX(options.numberformat == 'decimals' ? 'decimals' : undefined, options.decimals)
        LaTeX = nerdamer(text).toTeX(options.numberformat == 'decimals' ? 'decimals' : undefined)
        return { text, LaTeX }
        // return undefined
      } catch (e) {
        console.log(e.stack)
        console.log('Something went wrong. Nerdamer could not parse expression!</br>' + e.toString())
        return { text: 'error', LaTeX: 'error', error: 'Something went wrong. Nerdamer could not parse expression!', body: e.toString() }
      }
    }
  }

  // return undefined
}
