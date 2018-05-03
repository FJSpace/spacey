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
      equationTitle: '',
      equationDescription: '',
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
    const parsedEquation = this.parseJSON(equationString);
    const equationObject = {
      name: this.state.equationTitle,
      description: this.state.equationDescription,
      equation: parsedEquation["equation"],
      parameters: parsedEquation["parameters"],
      expressions: parsedEquation["expressions"]
    };
    this.setState({equation: equationObject});
  }

  render() {
    return (
      <View>
        <Text style = {styles.title}>Add Equation</Text>
        <TextInput
          placeholder = 'Equation name'
          style = {styles.input}
          onChangeText = {(text) => this.setState({equationTitle: text})}>
        </TextInput>
        <TextInput
          placeholder = 'Equation description'
          style = {styles.input}
          onChangeText = {(text) => this.setState({equationDescription: text})}>
        </TextInput>
        <TextInput
          placeholder = 'Ex: K=m*v'
          style = {styles.input}
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

  const styles = StyleSheet.create({
    input:
    {
      backgroundColor:'#d3d6d4',
      color:'#2d85dd',
      height: 40,
      padding: 10,
      marginTop: 5,
      marginBottom: 5,
      marginLeft: 10,
      marginRight: 10
    },
    title:
    {
      color: '#0C3F7D',
      textAlign: 'center',
      fontSize: 30,
      marginTop: 20,
      marginBottom: 20
    }
  });
