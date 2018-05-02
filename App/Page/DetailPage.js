import React, { Component } from "react";
import { View, Text, TextInput, Button, StyleSheet} from "react-native";
import {Kaede} from 'react-native-textinput-effects';
import Icon from 'react-native-vector-icons/FontAwesome';
import AwesomeButton from 'react-native-really-awesome-button';


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
      calculateResult: ""
    }
  }

  render() {

    let payments = [];
    for(let i = 0; i < this.equation.parameters.length; i++){
      payments.push(
        <View key={i}>
          <Kaede label={this.equation.parameters[i].var}
            value={this.state.parameterArray[i]}
            keyboardType={'numeric'}
            onChangeText={(text)=>this.onParametersInput(i,text)}
            style={styles.input}
            labelStyle={styles.label}
            inputStyle={styles.istyle}/>
          {!!this.state.parametersValidation[i] && (
            <Text style={styles.validationTxtBox}>{this.state.parametersValidation[i]}</Text>
          )}
        </View>)
    }

    return (
      <View style={styles.equationPa}>
        <Text style={styles.textDesc}>{this.equation.description}</Text>

        <View style={styles.equationParameters}>
          {payments}
        </View>

        <Text style={styles.text}>Fill in values & calculate!</Text>

        <View style={styles.res}>
          <Text>{this.equation.equation} = </Text>
          <Text>{this.state.calculateResult}</Text>
        </View>
        <AwesomeButton
          onPress={ () => this.onCalculatePress()}
          style={styles.aweBut}>
          <Icon name='calculator' color='#E73137' size={27} style={{margin: '8%'}}/>
          <Text style={styles.butText}>Calculate</Text>
        </AwesomeButton>
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
  textDesc:
  {
    paddingHorizontal: 8,
    fontSize: 18,
    fontWeight: "400",
    marginTop: '3%'
  },
  validationTxtBox:
  {
    color: 'red',
  },
  equationParameters:
  {
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginTop: '3%'
  },
  input:
  {
    marginTop: 3
  },
  label:
  {
    color: '#0C3F7D',
    backgroundColor: '#B7B9B8'
  },
  istyle:
  {
    backgroundColor:'#d3d6d4',
    color:'#2d85dd'
  },
  equationPa:
  {
    flex: 1,
    flexDirection: 'column'
  },
  aweBut:
  {
    alignSelf: 'center',
    backgroundColor: '#B7B9B8',
    marginBottom: 3
  },
  butText:
  {
    fontSize: 20,
    color: '#0C3F7D',
    margin: '8%'
  },
  res:
  {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 8
  },
  text:
  {
    paddingHorizontal: 8,
    marginTop: '3%'
  }
});
