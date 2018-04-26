import React, { Component } from "react";
import { View, StyleSheet, TextInput} from "react-native";
import { List, ListItem, SearchBar } from "react-native-elements";
import SortableListView from 'react-native-sortable-listview';

export default class DetailPageComponents {

    addParameters(state,equation, styles) {

     return
        let payments = [];
        for(let i = 0; i < this.equation.parameters.length; i++){
          payments.push(
            <View key={i}>
              <Text>{this.equation.parameters[i].var}</Text>
              <TextInput
                style={ [
                  styles.equation,
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
            <Text>{this.equation.name}</Text>
            <Text>{this.equation.description}</Text>
            <Text>{this.equation.equation}</Text>
    
            <View style={styles.equationParameters}>
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

}
