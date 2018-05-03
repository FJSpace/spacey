import React, { Component } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, TextInput, StyleSheet } from "react-native";
import { Kaede } from 'react-native-textinput-effects';
import Icon from 'react-native-vector-icons/FontAwesome';
import AwesomeButton from 'react-native-really-awesome-button';
import { Button } from 'react-native-elements';


export default class DetailPageComponents {


  equationDisplay(state, equation, onParametersInput, onCalculatePress, updateDefaultValues, styles) {
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

        <Text style={styles.text}>Fill in values & calculate!</Text>

        <View style={styles.res}>
          <Text style={styles.formu}>{equation.equation} = </Text>
          <Text style={styles.out}>{state.calculateResult}</Text>
        </View>
        <AwesomeButton
          onPress={() => onCalculatePress()}
          style={styles.aweBut}>
          <Icon name='calculator' color='#E73137' size={27} style={{ margin: '8%' }} />
          <Text style={styles.butText}>Calculate</Text>
        </AwesomeButton>
        <AwesomeButton
        onPress={() => updateDefaultValues()}
          style={styles.aweBut}>
          <Text style={styles.butText}>Update default values</Text>
        </AwesomeButton>
      </View></ScrollView>)
  }
}
