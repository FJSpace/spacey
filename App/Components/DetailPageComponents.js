import React, { Component } from "react";
import { View, Text, TextInput, Button, StyleSheet} from "react-native";
import { List, ListItem } from "react-native-elements";


export default class DetailPageComponents {


equationDisplay(state,equation, onParametersInput, onCalculatePress, styles)
{
  let equationParams = [];
  //let params = [];
  for(let i = 0; i < equation.parameters.length; i++){
    equationParams.push(
      <View key={i}>
        <Text>{equation.parameters[i].var}</Text>
        <TextInput
          style={styles.equation}
          onChangeText={(text) => onParametersInput(i, text)}
          value={state.parameterArray[i]}
          keyboardType={'numeric'}
        />
        {!!state.parametersValidation[i] && (
          <Text style={styles.validationTxtBox}>{state.parametersValidation[i]}</Text>
        )}
      </View>)
  }
  return(
    <View>
       <Text>{equation.name}</Text>
       <Text>{equation.description}</Text>
       <Text>{equation.equation}</Text>

       <View style={styles.equationParameters}>
         {equationParams}
       </View>

       <Text>{state.calculateResult}</Text>

       <Button
         onPress={ () => onCalculatePress()}
         title="Calculate"
       />
     </View>)
  }
}
