import React, { Component } from "react";
import AsyncStorage from "react-native";

export default class CalculateEquations extends React.Component {

Calculate(equationParams, equation) 
{
    let calculateResult = equation.equation.split("=")[1];

    for(let i = 0; i < equationParams.length; i++){
        calculateResult = calculateResult.replace(equation.parameters[i].var, equationParams[i]);
    };
    return eval(calculateResult);
  }

  updateDefaultValues(equation, defaultValues) 
  {
      for(i = 0; i < equation.parameters.length; i++ )
      {
          equation.parameters[i].val = defaultValues[i];
      }
      // Update the default values for the equation in the asyncstorage
      try {
          AsyncStorage.setItem(string.concat('@MySuperStore:',equation.id), JSON.stringify(equation));
        } catch (error) {
          console.log("Fail to store equation order!")
        }
        
     return
  }
}