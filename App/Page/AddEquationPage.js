import React, { Component } from "react";
import { View, Text, TextInput, Button, StyleSheet, AsyncStorage} from "react-native";
import { StackNavigator } from 'react-navigation';
import {Hoshi} from 'react-native-textinput-effects';
import AwesomeButton from 'react-native-really-awesome-button';
import Icon1 from 'react-native-vector-icons/FontAwesome';


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

    console.log(this.props.navigation.state.params)
  }

  parseJSON = (equation) => {
    const OPERANDS = /[\+\-\*\/]/;
    var equationObject = {
      equation: equation,
      parameters: [],
      expressions: []
    };
    var params = [];

    const refinedEquation = equation.replace(/\s/g,'');

    if (refinedEquation.includes("=")) { //Looking for equal sign(s)
      var res = refinedEquation.split("=");

      if (res.length > 2) { //If length is greater then 2, then we have more then one equal sign
        errorObject = {
          error: 'yes',
          message: 'Maximum 1 equal sign is allowed!'
        }
        return errorObject;
      } else {
        if ((res[0].match(OPERANDS) != null) && (res[1].match(OPERANDS) != null)) { //Can't handle equations with operands on both sides of the equal sign
          errorObject = {
            error: 'yes',
            message: "Can't have operands on both side of the equal sign!"
          }
          return errorObject;
        } else if (res[1].match(OPERANDS) != null) { //The equation is on the right hand side
          params = this.extractVariables(res[1]);
          if (params.error === 'yes'){
            return params;
          } else {
            equationObject = {
              equation: refinedEquation,
              parameters: params
            }
          }
        } else { //The equation is on the left hand side
          params = this.extractVariables(res[0]);
          if (params.error === 'yes'){
            return params;
          } else {
            equationObject = {
              equation: res[1]+'='+res[0],
              parameters: params
            }
          }
        }
      }
    } else { // No equal sign
      params = this.extractVariables(refinedEquation);
      if (params.error === 'yes'){
        return params;
      } else {
        equationObject = {
          equation: 'X='+refinedEquation,
          parameters: params
        }
      }
    }
    return equationObject;

  }

  extractVariables = (str) => {
    var params = [];
    var newstr = str.replace(/[()]/g, '');
    var vars = newstr.split(/[\+\-\*\/]/);
    if (vars.includes('')){
      var errorObject = {
        error: 'yes',
        message: "Can only have one operand between variables!"
      }
      return errorObject;
    } else {
      for (let i = 0; i < vars.length; i++){
        if (isNaN(vars[i])){ //isNan returns false if it is a number
          params.push({
            var: vars[i],
            value: '0'
          });
        }
      }
    }
    return params;
  }

  submitEquationHandler = () => {
    const equationString = this.state.equationInput;
    const parsedEquation = this.parseJSON(equationString);

    if (parsedEquation.error === 'yes'){
      this.setState({equation: parsedEquation.message});
    } else {
      const equationObject = {
        name: this.state.equationTitle,
        description: this.state.equationDescription,
        equation: parsedEquation["equation"],
        parameters: parsedEquation["parameters"]
      };
      this.setState({equation: equationObject});

      this.storeNewEquation(equationObject)
    }
  }

  render() {
    return (
      <View>
        <Text style = {styles.title}>Add Equation</Text>
        <Hoshi
          label = 'Equation name'
          borderColor = {'#E73137'}
          labelStyle={{color : '#0C3F7D'}}
          //inputStyle={{color : '#B7B9B8'}}
          style={styles.input}
          onChangeText = {(text) => this.setState({equationTitle: text})}>
        </Hoshi>
        <Hoshi
          label = 'Equation description'
          borderColor = {'#E73137'}
          labelStyle={{color : '#0C3F7D'}}
          style={styles.input}
          onChangeText = {(text) => this.setState({equationDescription: text})}>
        </Hoshi>
        <Hoshi
          label = 'Ex: K=m*v'
          borderColor = {'#E73137'}
          labelStyle={{color : '#0C3F7D'}}
          style={styles.input}
          onChangeText = {(text) => this.setState({equationInput: text})}>
        </Hoshi>
        <AwesomeButton
          onPress = {this.submitEquationHandler}
          style={{backgroundColor: '#B7B9B8', margin: '10%', marginLeft: '23%'}}>
          <Icon1 name='cubes' color='#E73137' size={27}/>
        </AwesomeButton>
      </View>
    );
  }

  async storeNewEquation(equationObject) {
    var addedEquations = []
    var order = []

    // Fetch added equations.
    try {
      const value = await AsyncStorage.getItem('@MySuperStore:addedEquations');
      if (value != null){
        addedEquations = JSON.parse(value)
      } else {
        console.log("No added equations.")
      }
    } catch (error) {
      console.log("No added equations.")
    }

    // Fetch Order.
    try {
      const value = await AsyncStorage.getItem('@MySuperStore:equationOrder');
      if (value != null){
        order = JSON.parse(value)
      }
    } catch (error) {
      console.log("Fail to fetch order.")
    }

    // Add new id to the equation depending on the order length.
    // Also update order list.
    equationObject.id = order.length
    addedEquations.push(equationObject)
    order.push(order.length)

    try {
      await AsyncStorage.setItem('@MySuperStore:addedEquations', JSON.stringify(addedEquations));
    } catch (error) {
      console.log("Fail to store added equation!")
    }

    try {
      await AsyncStorage.setItem('@MySuperStore:equationOrder', JSON.stringify(order));
    } catch (error) {
      console.log("Fail to store equation order!")
    }

    this.props.navigation.state.params.updateEquations()
    this.props.navigation.goBack()
  }

 }

const styles = StyleSheet.create({
  input:
  {
    //marginTop: 5,
    //marginBottom: 5,
    marginLeft: 10,
    marginRight: 10
  },
  title:
  {
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    fontSize: 18,
    fontWeight: "500",
  }
});
