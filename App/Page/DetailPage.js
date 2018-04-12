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

    var parameters = [];
    for(let i = 0; i < this.equation.parameters.length; i++){
      parameters.push(
        <View style = {{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 10,
          paddingBottom: 10
        }} key={i}>
          <Text style={{
            flex: 1,
            fontSize: 20,
            marginLeft: '5%'
          }}>{this.equation.parameters[i]}</Text>
          <TextInput
            style={{
              height: 40,
              borderColor: 'gray',
              borderWidth: 1,
              flex: 3,
              marginRight: '20%'
            }}
            onChangeText={(text) => this.onParametersInput(i, text)}
            value={this.state.parameterArray[i]}
          />
        </View>)
    }

    return (
      <View>
        <Text style = {{
          marginLeft: '5%',
          fontSize: 20,
          paddingTop: 30,
          paddingBottom: 10
        }}>{this.equation.description}</Text>
        <Text style = {{
          fontSize: 16,
          fontWeight: 'bold',
          marginLeft: '5%'
        }}>{this.equation.equation}</Text>

        <View style={{
          paddingVertical: 16,
          paddingHorizontal: 8,
        }}>
          {parameters}
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
