import React, { Component } from "react";
import { View, Text, TextInput, Button, StyleSheet} from "react-native";

export default class DetailPage extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.title}`,
  });

  constructor(props) {
    super(props);

    this.equation = props.navigation.state.params.equation;

    this.state={
      parameterArray: this.equation.parameters.map(a => a.value),
      parametersValidation: Array(this.equation.parameters.length).fill(""),
      calculateResult: "Input values to calculate!"
    }
  }

  render() {

    let payments = [];
    for(let i = 0; i < this.equation.parameters.length; i++){
      payments.push(
        <View key={i}>
          <Text style = {styles.parameter}>{this.equation.parameters[i].var}</Text>
          <TextInput
            style={ [
              styles.parameterValue,
              {borderColor: (!this.state.parametersValidation[i] ? 'gray' : 'red')}
            ]}
            onChangeText={(text) => this.onParametersInput(i, text)}
            value={this.state.parameterArray[i]}
            keyboardType={'numeric'}
          />
          {!!this.state.parametersValidation[i] && (
            <Text style={styles.validationTxtBox}>{this.state.parametersValidation[i]}</Text>
          )}
        </View>)
    }

    return (
      <View>
        <Text style = {styles.equationTitle}>{this.equation.name}</Text>
        <Text style = {styles.equationDescription}>{this.equation.description}</Text>
        <Text style = {styles.equationText}>{this.equation.equation}</Text>

        <View style={styles.equationParameters}>
          {payments}
        </View>

        <Text style = {styles.equationDescription}>{this.state.calculateResult}</Text>

        <Button
          onPress={ () => this.onCalculatePress()}
          title="Calculate"
        />
      </View>
    )
  }

  onParametersInput(index, text) {
    const parameterArray = this.state.parameterArray
    const parametersValidation = this.state.parametersValidation
    parameterArray[index] = text

    if (parameterArray[index] === "") { // Empty
      parametersValidation[index] = "Required field."
    } else if (!this.isNumeric(parameterArray[index])) { // Number check.
      parametersValidation[index] = "Only numbers."
    } else {
      parametersValidation[index] = ""
    }

    this.setState({
      parameterArray,
      parametersValidation
    })
  }


  onCalculatePress() {

    // Check for empty inputs.
    if(this.checkEmptyInputs()) {
      console.log("Empty Inputs!")
      this.updateCalculateReulsts("Values in the input(s) is required.")

      return
    }

    // Check if the all the parameter validations are OK
    if(this.state.parametersValidation.join('')) {
       console.log("Validation not OK!")
       this.updateCalculateReulsts("Put it correct inputs.")

       return
    }

    let calculateResult = ""

    // Loop through the parameters and add expression in between.
    for(let i = 0; i < this.state.parameterArray.length; i++){
      if(this.state.parameterArray.length == 1) { // One parameter
        calculateResult += this.state.parameterArray[i] + this.equation.expressions[i]
      } else if (i == this.state.parameterArray.length-1) { // Check if the last parameter, then don't add an expression
        calculateResult += this.state.parameterArray[i]
      } else {
        calculateResult += this.state.parameterArray[i] + this.equation.expressions[i]
      }
    }

    this.updateCalculateReulsts(eval(calculateResult))
  }

  updateCalculateReulsts(calculateResult) {
    this.setState({
      calculateResult
    })
  }

  // Loop through the inputs, if it finds some empty Strings, return true.
  // Also add parametersValidation text to that parameter.
  checkEmptyInputs() {

    let bool = false
    const parametersValidation = this.state.parametersValidation
    for(let i = 0; i < this.state.parameterArray.length; i++){
      if (this.state.parameterArray[i] === "") {
        parametersValidation[i] = "Required field."
        bool = true
      }
    }

    this.setState({
      parametersValidation
    })

    return bool
  }

  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

}

const styles = StyleSheet.create({
  parameterValue:
  {
    height: 40,
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 5
  },
  validationTxtBox:
  {
    color: 'red',
  },
  equationParameters:
  {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  equationTitle:
  {
    fontSize: 30,
    fontFamily: 'Avenir Next',
    textAlign: 'center',
    paddingTop: 20
  },
  equationDescription:
  {
    fontSize: 15,
    fontFamily: 'Avenir Next',
    textAlign: 'center',
    paddingLeft: 20,
    paddingRight: 20
  },
  equationText:
  {
    fontFamily: 'AvenirNext-Italic',
    fontSize: 20,
    paddingTop: 20,
    textAlign: 'center'
  },
  parameter:
  {
    fontFamily: 'Avenir Next',
    fontSize: 18,
    paddingBottom: 5,
    paddingTop: 20,
    paddingLeft: 10
  }
});
