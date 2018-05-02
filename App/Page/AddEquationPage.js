import React, { Component } from "react";
import { View, Text, TextInput, Button, StyleSheet} from "react-native";
import { StackNavigator } from 'react-navigation';

export default class AddEquationPage extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: "Add Equation",
  });

  parseJSON = (equation) => {
    const OPERANDS = ['+', '-', '*', '/'];
    const equationObject = {
      equation: equation,
      parameters: [],
      expressions: []
    };

    let looper = 0;

    while(true) {
      if (equation[looper] === "=") {
        break;
      }
      looper++;
    }

    for (let x = looper + 1; x < equation.length; x++) {
      // if encounter an operand, add to the expression array in the equation object.
      if (OPERANDS.includes(equation[x])) {
        equationObject.expressions.push(equation[x]);
      } else {
        // else if encountering a letter, add to parameter array.
        let parameterArray = [];

        // while next character != operand, join characters to one single parameter.
        while (true) {

          if (OPERANDS.includes(equation[x])) {
            x--;
            break;
          } else if (!equation[x]) {
            break;
          }

          parameterArray.push(equation[x]);
          x++;
        }

        equationObject.parameters.push({var: parameterArray.join(''), value: "0"});
      }
    }
    return equationObject;
  }

  render() {
    return (
      <View>
      </View>
    );
  }

}
