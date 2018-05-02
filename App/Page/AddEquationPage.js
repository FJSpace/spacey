import React, { Component } from "react";
import { View, Text, TextInput, Button, StyleSheet} from "react-native";
import { StackNavigator } from 'react-navigation';

export default class AddEquationPage extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: "Add Equation",
  });

  constructor(props) {
    super(props);
    this.state = {
      equationInput: '',
      equation: {
      }
    };
  }

  parseJSON = (equation) => {
    const OPERANDS = ['+', '-', '*', '/'];
    const equationObject = {
      equation: equation,
      parameters: [],
      expressions: []
    };

    const refinedEquation = equation.replace(/\s/g,'');

    let looper = 0;

    while(true) {
      if (refinedEquation[looper] === "=") {
        break;
      }
      looper++;
    }

    for (let x = looper + 1; x < refinedEquation.length; x++) {
      // if encounter an operand, add to the expression array in the equation object.
      if (OPERANDS.includes(refinedEquation[x])) {
        equationObject.expressions.push(refinedEquation[x]);
      } else {
        // else if encountering a letter, add to parameter array.
        let parameterArray = [];

        // while next character != operand, join characters to one single parameter.
        while (true) {

          if (OPERANDS.includes(refinedEquation[x])) {
            x--;
            break;
          } else if (!refinedEquation[x]) {
            break;
          }

          parameterArray.push(refinedEquation[x]);
          x++;
        }

        equationObject.parameters.push({var: parameterArray.join(''), value: "0"});
      }
    }
    return equationObject;
  }

  submitEquationHandler = () => {
    const equationString = this.state.equationInput;
    const equationObject = this.parseJSON(equationString);
    this.setState({equation: equationObject});
  }

  render() {
    return (
      <View>
        <Text>Add Equation</Text>
        <TextInput
          placeholder = 'Ex: K=m*v'
          style = {{height: 20}}
          onChangeText = {(text) => this.setState({equationInput: text})}>
        </TextInput>
        <Text
          style = {{fontSize: 20, color: 'black'}} >
          {JSON.stringify(this.state.equation)}
        </Text>
        <Button
          onPress = {this.submitEquationHandler}
          title = "Submit"
        />
      </View>
    );
  }

}
