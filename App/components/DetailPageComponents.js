import React, { Component } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, TextInput, StyleSheet } from "react-native";
import { Kaede } from 'react-native-textinput-effects';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import AwesomeButton from 'react-native-really-awesome-button';
import { Button, Icon } from 'react-native-elements';


export default class DetailPageComponents {


  equationDisplay(state, equation, onParametersInput, onCalculatePress, updateDefaultValues, styles, addToFav) {
    let equationParams = [];
    //let params = [];
    for (let i = 0; i < equation.parameters.length; i++) {
      equationParams.push(
        <View key={i}>
          <Kaede label={equation.parameters[i].var}
            style={styles.input}
            onChangeText={(text) => onParametersInput(i, text)}
            value={state.parameterArray[i]}
            keyboardType={'numeric'}
            labelStyle={styles.label}
            inputStyle={styles.istyle} />
          {!!state.parametersValidation[i] && (
            <Text style={styles.validationTxtBox}>{state.parametersValidation[i]}</Text>
          )}
        </View>)
    }
    return (
      <ScrollView>
      <View style={styles.equationPa}>
        <Text style={styles.textDesc}>{equation.description}</Text>

        <View style={styles.equationParameters}>
          {equationParams}
        </View>

        <View style={styles.text}>
          <Text style={{flex:2}}>Fill in values & calculate!</Text>
          <Icon onPress={() => addToFav()} name={state.favoriteIcon} color='#E73137' style={{flex:1}}/>
        </View>

        <View style={styles.res}>
          <Text style={styles.formu}>{equation.equation} = </Text>
          <Text style={styles.out}>{state.calculateResult}</Text>
        </View>
        <View style={{flexDirection:'row', marginTop: '30%'}}>
          <AwesomeButton
            onPress={() => onCalculatePress()}
            style={styles.aweButL}>
            <Icon1 name='calculator' color='#E73137' size={27} style={{ margin: '8%' }} />
            <Text style={styles.butText1}>Calculate</Text>
          </AwesomeButton>
          <AwesomeButton
            onPress={() => updateDefaultValues()}
            style={styles.aweButR}>
            <Text style={styles.butText}>Update default values</Text>
          </AwesomeButton>
        </View>
      </View></ScrollView>)
  }
}
