import React, { Component } from "react";
import { View, Text } from "react-native";
import Equation from '../Model/Equation.js';

export default class DetailPage extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.title}`,
  });

  constructor(props) {
    super(props);

    this.equation = props.navigation.state.params.equation
    console.log(this.equation)
  }

  render() {
    return (
      <View>
        <Text>{this.equation.name}</Text>
        <Text>{this.equation.description}</Text>
        <Text>{this.equation.equation}</Text>
      </View>
    )
  }

}
