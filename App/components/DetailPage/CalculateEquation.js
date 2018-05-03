import React, { Component } from "react";

export default class CalculateEquations extends React.Component {

Calculate(equationParams, equation) 
{
    let calculateResult = equation.equation.split("=")[1];

    for(let i = 0; i < equationParams.length; i++){
        calculateResult = calculateResult.replace(equation.parameters[i].var, equationParams[i]);
    };
    return eval(calculateResult);
  }
}