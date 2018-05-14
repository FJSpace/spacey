import React, { Component } from "react";
import { View, Text, StyleSheet, ActivityIndicator, AsyncStorage } from "react-native";
import { Icon } from "react-native-elements";
import { StackNavigator } from 'react-navigation';
import HomePageComponents from '../components/HomePageComponents.js';

export default class HomePage extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: "Equations",
    headerRight: (
      <Icon
        name='playlist-add'
        onPress={() =>  navigation.navigate('AddEquation') }
        color='#0C3F7D'
        iconStyle={{paddingRight: 8}}
      />
    ),
    headerLeft: (
      <Icon
        name='delete-forever'
        onPress={() =>  AsyncStorage.clear() }
        color='#0C3F7D'
        iconStyle={{paddingLeft: 8}}
      />
    ),
  });

  constructor(props) {
    super(props);

    this.state={
      equations: [],
      order: null,
      filterOrder: null,
      isSearching: false,
      isLoading: false,
      text: '',
    }

    // Set the equations based on the JSON, edited and added equations.
    this.setEquations();

    // The order is stored in index.
    //this.setOrder()

    this.c = new HomePageComponents()
  }

  async setEquations() {
    // JSON fetch.
    var customData = require('../Model/Equations.json')
    var equations = customData["Equations"]

    // Fetch added equations.
    try {
      const value = await AsyncStorage.getItem('@MySuperStore:addedEquations');
      if (value != null){
        equations = equations.concat(JSON.parse(value))
      } else {
        console.log("No added equations.")
      }
    } catch (error) {
      console.log("No added equations.")
    }


    for(let i = 0; i < equations.length; i++) {
      try {
        const value = await AsyncStorage.getItem('@MySuperStore:'+equations[i].id);
        if (value != null){
          equations[i] = JSON.parse(value)
        } else {
          //console.log("Id "+i+" hasn't been changed")
        }
      } catch (error) {
        console.log('ERROR: Somthing went wrong when fetching edited equations')
      }
    }

    this.setState({
      equations: equations
    })
    this.setOrder()
  }

  // Fetch the order from the locale storage. If there is none there, use standard.
  async setOrder() {
    var order = []
    try {
      const value = await AsyncStorage.getItem('@MySuperStore:equationOrder');
      if (value != null){
        order = JSON.parse(value)

        // Reset to default order if the equations are changed.
        if(order.length != Object.keys(this.state.equations).length) {
          order = Object.keys(this.state.equations)
        }

      } else {
        order = Object.keys(this.state.equations) // Array of keys, defaults
      }
    } catch (error) {
      order = Object.keys(this.state.equations) // Array of keys, defaults
    }

    this.setState({
      order: order,
      filterOrder: order
    })

  }

  test(text) {
    SearchFilterFunction(text)
  }

  SearchFilterFunction(text){
    const equations = this.state.equations
    const order = this.state.order

    // Filter the search text in the equation.
    var newData = equations.filter(function(item) {
        const itemData = item.name.toUpperCase()
        const textData = text.toUpperCase()
        return itemData.indexOf(textData) > -1
    })

    // Order the filtered equations with the order.
    result = []
    order.forEach(function(key) {
        var found = false;
        newData = newData.filter(function(item) {
            if(!found && item.id == key) {
                result.push(item);
                found = true;
                return false;
            } else
                return true;
        })
    })

    this.setState({
        filterOrder: result.map(a => String(a.id)), // Map to only get the id's
        text: text
    })

    // If searching, then disable filters
    if(text) {
      this.setState({
        isSearching: true,
      })
    } else {
      this.setState({
        isSearching: false
      })
    }
}

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.StateLoading}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.MainContainer}>
        {this.c.searchInput(this.state, this.SearchFilterFunction.bind(this))}
        {this.c.equationSortList(this.state, this.onRowMoved.bind(this), this.onItemPress.bind(this))}
      </View>
    );
  }

  onItemPress(equation) {
    this.props.navigation.navigate('Detail', {title: equation.name, equation});
  }

  async onRowMoved(e) {
    // Order the list
    const order = this.state.order
    order.splice(e.to, 0, order.splice(e.from, 1)[0])
    this.setState({
      order: order,
      filterOrder: order
    })

    // Store the order in local storage when row is moved.
    try {
      await AsyncStorage.setItem('@MySuperStore:equationOrder', JSON.stringify(this.state.order));
    } catch (error) {
      console.log("Fail to store equation order!")
    }
  }

}

const styles = StyleSheet.create({
  MainContainer : {
     justifyContent: 'center',
     flex:1,
     margin: 7,
   },

  StateLoading:{
   flex: 1,
   paddingTop: 20
  },

});
