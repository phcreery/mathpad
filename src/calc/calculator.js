// require('./nerdamer/nerdamer.core.js')
// require('./nerdamer/Algebra.js')
// require('./nerdamer/Calculus.js')
// require('./nerdamer/Solve.js')
// require('./nerdamer/Extra.js')
const nerdamer = require('./nerdamer/all');

//Get the expression from the user input. The expression will come in the form expression, x=a, y=b, ...
//the problem becomes that the user might input some_function(param1, param2) , x=a, y=b
//doing a split by the comma would yield the undesired result. This method walks the string and looks for an open bracket
//and then a close bracket. If none is found we're golden and it returns the string. If one is found then it looks 
//for a close bracket. Any comma after that has to be the variable declarations

//Note: I cannot use a regex for example diff(cos(x), x). A regex cannot check for matching brackets. Recursively maybe but 
//that's tricky with commas
function extractExpression(str) {
    /*
    var match = variable_regex.exec(str);
    if(match) 
        return [match[1], match[3]];
    return [str, ''];
    */
  
    // var l = str.length,
    //     openBrackets = 0,
    //     retval;
    // for(var i=0; i<l; i++) {
    //     var ch = str.charAt(i);
    //     if(ch === '(' || ch === '[') openBrackets++; //record and open brackets
    //     if(ch === ')' || ch === ']') openBrackets--; //close the bracket
    //     if(ch === ',' && !openBrackets) {
    //         retval = [str.substr(0, i), str.substr(i+1, l)];
    //         return retval;
    //     }
    // }

    return [str, ''];
}


function interpretSpecialCommands(str) {
  // remove \operatorname{sum}(2,4) and return \sum(2,4)
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

  return strippedvalue

}

//perform preparations before parsing. Extract variables and declarations
function prepareExpression(str) {
    //the string will come in the form x+x, x=y, y=z
  str = interpretSpecialCommands(str)
  var extracted = extractExpression(str)
  var expression = extracted[0]
  var scope = {};
  extracted[1].split(',').map(function(x) {
      x = x.trim(); //remove white space at both ends
      var parts = x.split('='),
          varname = parts[0],
          value = parts[1];
      if(nerdamer.validVarName(varname) && typeof value !== 'undefined')
          scope[varname] = parts[1];
  });
  return [expression, scope];
}



module.exports = {
  calculate(inLaTeX, options) { // modified for LaTeX input
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
        console.log("Name,Params,Body(convertFromLaTeX)", fnName, params, fnBody)
        evaluated = nerdamer.setFunction(fnName, params, fnBody);

        //generate the latex
        LaTeX = fnName+ //parse the function name with nerdamer so we can get back some nice LaTeX
                '('+ //do the same for the parameters
                    params.map(function(x) {
                        return nerdamer(x).toTeX();
                    }).join(',')+
                '):='+
                nerdamer(fnBody).toTeX();

        // return evaluated
        // return undefined
        return { text: undefined, LaTeX: undefined }
      }
      catch(e) { 
        console.log('Error: Could not set function.</br>' + e.toString())
        return { text: 'err', LaTeX: 'err'}
      }
    } else {
      var variableDeclaration = /^([a-z_][a-z\d_]*):(.+)$/gi.exec(expression);
      if (variableDeclaration) {
        console.log('Got a variable declaration!')
        try {
          var varName = variableDeclaration[1]
          var varValue = nerdamer.convertFromLaTeX(variableDeclaration[2]).toString()
          //set the value
          evaluated = nerdamer.setVar(varName, varValue);
          
          console.log('setting', varName, 'to(convertFromLaTeX)', varValue)
          LaTeX = varName + ':' + nerdamer(varValue).toTeX();
          text = nerdamer(varValue, scope).toString()
          // return [text, LaTeX]
          // return undefined
          return { text, LaTeX }
        }
        catch(e){
          console.log('Something went wrong. Nerdamer could not parse expression!</br>' + e.toString())
          return { text: 'err', LaTeX: 'err'}
        } 
      }
      else {
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
          console.log("looking at", expression)
          expression = nerdamer.convertFromLaTeX(expression).toString()
          console.log('expression(convertFromLaTeX)', expression, scope)
          evaluated = nerdamer(expression, scope)
          evaluated = evaluated.evaluate()
          text = evaluated.text(options.numberformat == 'decimals' ? 'decimals' : undefined, options.decimals)
          // LaTeX = evaluated.toTeX(options.numberformat == 'decimals' ? 'decimals' : undefined, options.decimals)
          LaTeX = nerdamer(text).toTeX(options.numberformat == 'decimals' ? 'decimals' : undefined)
          return { text, LaTeX }
          // return undefined
        }
        catch(e){
          console.log(e.stack);
          console.log('Something went wrong. Nerdamer could not parse expression!</br>' + e.toString())
          return { text: 'err', LaTeX: 'err'}
        }
      }
    }
    
    // return undefined
  }
}