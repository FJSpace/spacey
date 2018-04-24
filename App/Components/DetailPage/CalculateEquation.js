import React, { Component } from "react";

export default class CalculateEquations extends React.Component {

Calculate(equationParams, equation) 
{

    let calculateResult = ""

    // Loop through the parameters and add expression in between.
    for(let i = 0; i < equationParams.length; i++){
      if(equationParams.length == 1) { // One parameter
        calculateResult += equationParams[i] + equation.expressions[i]
      } else if (i == equationParams.length-1) { // Check if the last parameter, then don't add an expression
        calculateResult += equationParams[i]
      } else {
        calculateResult += equationParams[i] + equation.expressions[i]
      }
    }
    return calculateResult;
  }
}