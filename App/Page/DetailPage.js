import React, { Component } from "react";
import { View, Text, TextInput, Button} from "react-native";
import Equation from '../Model/Equation.js';

export default class DetailPage extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.title}`,
  });

  constructor(props) {
    super(props);

    this.equation = props.navigation.state.params.equation

    this.state={
      parameterArray: Array(this.equation.parameters.length).fill(""),
      calculateResult: "Fill in values & calculate!"
    }
  }

  render() {

    var payments = [];
    for(let i = 0; i < this.equation.parameters.length; i++){
      payments.push(
        <View key={i}>
          <Text>{this.equation.parameters[i]}</Text>
          <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) => this.onParametersInput(i, text)}
            value={this.state.parameterArray[i]}
          />
        </View>)
    }

    return (
      <View>
        <Text>{this.equation.name}</Text>
        <Text>{this.equation.description}</Text>
        <Text>{this.equation.equation}</Text>

        <View style={{paddingVertical: 16, paddingHorizontal: 8}}>
          {payments}
        </View>

        <Text>{this.state.calculateResult}</Text>

        <Button
          onPress={ () => this.onCalculatePress()}
          title="Calculate"
        />
      </View>
    )
  }

  onParametersInput(index, text) {
    const parameterArray = this.state.parameterArray
    parameterArray[index] = text
    this.setState({
      parameterArray
    })
  }


  onCalculatePress() {
    var calculateResult = ""

    for(let i = 0; i < this.state.parameterArray.length; i++){

      if(i == this.state.parameterArray.length-1) {
        calculateResult += this.state.parameterArray[i]
      } else {
        calculateResult += this.state.parameterArray[i] + this.equation.expressions[i]
      }

    }

    calculateResult = eval(calculateResult)
    this.setState({
      calculateResult
    })

  }

}
