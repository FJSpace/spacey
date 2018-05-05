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
  });

  constructor(props) {
    super(props);

    var customData = require('../Model/Equations.json')
    const equations = customData["Equations"]

    this.state={
      equations: equations,
      order: null,
      filterOrder: null,
      isSearching: false,
      isLoading: false,
      text: '',
    }

    this.getStorage();
    // The order is stored in index.
    this.setOrder()

    this.c = new HomePageComponents()
  }

  async getStorage() {
    var addedEq = [];
    var newEq = {};
    var allEq = this.state.equations;
    
    for(let i = 0; i < allEq.length; i++){
      try{
        const edited = await AsyncStorage.getItem('@MySuperStore:'+i);
        if (edited != null){
          allEq[i] = JSON.parse(edited);
        } else {
          allEq[i] = this.state.equations[i];
        }
      }catch (error) {
        allEq[i] = this.state.equations[i];
      }
    }
    
    var size = this.state.equations.length;
    try{
      const added = await AsyncStorage.getItem('@MySuperStore:added');
      if (added != null){
        addedEq = JSON.parse(added);
      }
    } catch(error) {
      console.log('Something whent wrong when trying to find added equations');
    }
    for(let i = 0; i < addedEq.length; i++){
      newEq = addedEq[i];
      if(newEq.id == null){
        newEq.id = size + i;
        allEq.push(newEq);
        try {
          await AsyncStorage.setItem('@MySuperStore:'+newEq.id, JSON.stringify(newEq));
        } catch (error) {
          console.log("Fail to store new equation!")
          alert("error")
        }
      }
    }
    this.setState({
      equations: allEq
    })
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
