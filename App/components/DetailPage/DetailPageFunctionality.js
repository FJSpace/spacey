import React, { Component } from "react";
import {AsyncStorage} from "react-native";

export default class CalculateEquations extends React.Component {

  Calculate(equationParams, equation) 
  {
    let calculateResult = equation.equation.split("=")[1];

    for(let i = 0; i < equationParams.length; i++){
        calculateResult = calculateResult.replace(equation.parameters[i].var, equationParams[i]);
    };
    return eval(calculateResult);
  }

  async updateDefaultValues(equation, defaultValues) 
  {
      for(i = 0; i < equation.parameters.length; i++ )
      {
          equation.parameters[i].value = defaultValues[i];
      }
     
      // Update the default values for the equation in the asyncstorage
      
      try {     
        await AsyncStorage.setItem('@MySuperStore:'+equation.id, JSON.stringify(equation));
        alert("Updating New Default Values Succeeded")
        } catch (error) {
          console.log("Fail to store equation order!")
          alert("Updating New Default Values Failed!")
        }
     return
  }
}