import React, { Component } from "react";
import { View, Text, TextInput, Button, StyleSheet, AsyncStorage} from "react-native";
import CalculateEquations from "../components/DetailPage/DetailPageFunctionality";
import DetailPageComponents from '../components/DetailPageComponents.js';
import {Icon} from 'react-native-elements';

/*TestComment*/

export default class DetailPage extends React.Component {

  static navigationOptions = ({ navigation }) => ({
      title: `${navigation.state.params.title}`,
  });

  constructor(props) {
    super(props);

    this.equation = props.navigation.state.params.equation;
    this.c = new DetailPageComponents();
    this.state={
      parameterArray: this.equation.parameters.map(a => a.value),
      parametersValidation: Array(this.equation.parameters.length).fill(""),
      calculateResult: "",
      favoriteEquations: [],
      favoriteIcon: 'favorite-border'
    }
    f=null

    this.setFavorite()
  }

  async setFavorite() {
    var favoriteEquations = []
    var favoriteIcon = 'favorite-border'

    // Fetch added equations.
    try {
      const value = await AsyncStorage.getItem('@MySuperStore:favoriteEquations');
      if (value != null){
        favoriteEquations = JSON.parse(value)
      } else {
        console.log("No favorite equations.")
      }
    } catch (error) {
      console.log("No favorite equations.")
    }

    if (favoriteEquations.includes(this.equation.id)) {
      isFavorite = true
      favoriteIcon = 'favorite'
    }

    this.setState({
      favoriteEquations: favoriteEquations,
      favoriteIcon: favoriteIcon
    })
  }

  async addToFavorites(){
    var favoriteEquations = this.state.favoriteEquations

    if (favoriteEquations.includes(this.equation.id)) {
      favoriteEquations.splice(favoriteEquations.indexOf(this.equation.id), 1)
    } else {
      favoriteEquations.push(this.equation.id)
    }

    try {
      await AsyncStorage.setItem('@MySuperStore:favoriteEquations', JSON.stringify(favoriteEquations));
    } catch (error) {
      console.log("Fail to store favorite equation!")
    }

    this.setFavorite()
    this.props.navigation.state.params.updateFavorite()
  }

  render() {
    return(
      <View>
    {this.c.equationDisplay(this.state,this.equation, this.onParametersInput.bind(this),this.onCalculatePress.bind(this), this.updateDefaultValues.bind(this), styles, this.addToFavorites.bind(this) )}
    </View>
    );
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



  updateDefaultValues(){

    var cd = new CalculateEquations();
    cd.updateDefaultValues(this.equation, this.state.parameterArray);
    return
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

    var cd = new CalculateEquations();
    let calculateResult = ""
    calculateResult = cd.Calculate(this.state.parameterArray, this.equation);

    this.updateCalculateReulsts(calculateResult)
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
    fontWeight: "500",
    marginTop: '3%',
    color: 'gray'
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
    color: '#0C3F7D'
  },
  istyle:
  {
    backgroundColor:'#d3d6d4',
    color:'#2d85dd'
  },
  equationPa:
  {
    flexDirection: 'column'
  },
  aweButL:
  {
    alignSelf: 'center',
    backgroundColor: '#0C3F7D',
    marginBottom: 3,
    marginTop: '8%',
    marginLeft: '2%',
    marginRight: '1%',
    flex: 1,
    borderRadius: 200
  },
  aweButR:
  {
    alignSelf: 'center',
    backgroundColor: '#0C3F7D',
    marginBottom: 3,
    marginTop: '8%',
    marginRight: '3%',
    marginLeft: '1%',
    flex: 1,
    borderRadius: 200
  },
  butText1:
  {
    fontSize: 20,
    color: '#0C3F7D',
    margin: '8%',
    marginLeft: '3%'
  },
  butText:
  {
    fontSize: 20,
    color: '#0C3F7D',
    margin: '8%'
  },
  res:
  {
    flexDirection: 'row',
    paddingHorizontal: 8,
    marginTop: '10%'
  },
  text:
  {
    flexDirection: 'row',
    paddingHorizontal: 8,
    marginTop: '3%'
  },
  formu:
  {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0C3F7D'
  },
  out:
  {
    fontSize: 16,
    color: '#E73137'
  }
});
