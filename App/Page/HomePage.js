import React, { Component } from "react";
import { View, Text, StyleSheet, ActivityIndicator, AsyncStorage } from "react-native";
import { Icon } from "react-native-elements";
import { StackNavigator } from 'react-navigation';
import SegmentedControlTab from 'react-native-segmented-control-tab'
import HomePageComponents from '../components/HomePageComponents.js';

export default class HomePage extends React.Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};

    return {
      title: "Equations",
      headerRight: (
        <Icon
          name='playlist-add'
          onPress={() =>  navigation.navigate('AddEquation', {name: 'from parent', updateEquations: params.updateEquations} ) }
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
      )
    }
  };

  componentWillMount() {
    this.props.navigation.setParams({ updateEquations: this._updateEquations });
  }

  _updateEquations = () => {
    this.setEquations()
  }

  constructor(props) {
    super(props);

    this.state={
      equations: [],
      order: null,
      favoriteOrder: [],
      filterOrder: null,
      isSearching: false,
      isLoading: false,
      text: ''
    }

    this.selectedIndex = 0

    // Set the equations based on the JSON, edited and added equations.
    this.setEquations();
    this.setFavoriteEquations();
    this.setFavoriteEquations = this.setFavoriteEquations.bind(this)

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

    await this.setState({
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
          this.updateOrderAsyncStorage(order)
        }
      } else {
        order = Object.keys(this.state.equations) // Array of keys, defaults
        this.updateOrderAsyncStorage(order)
      }
    } catch (error) {
      order = Object.keys(this.state.equations) // Array of keys, defaults
      this.updateOrderAsyncStorage(order)
    }

    this.setState({
      order: order,
      filterOrder: order
    })

  }

  async updateOrderAsyncStorage(order) {
    try {
      await AsyncStorage.setItem('@MySuperStore:equationOrder', JSON.stringify(order));
    } catch (error) {
      console.log("Fail to store equation order!")
    }
  }

  async setFavoriteEquations() {
    var favoriteEquations = []
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

    await this.setState({
      favoriteOrder: favoriteEquations
    })

    if (this.selectedIndex == 1) {
      this.SearchFilterFunction(this.state.text)
    }
  }

  test(text) {
    SearchFilterFunction(text)
  }

  SearchFilterFunction(text) {
    const equations = this.state.equations
    var order = this.state.order

    if(this.selectedIndex == 1) {
      order = this.state.favoriteOrder
    }

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

  handleIndexChange = (index) => {
    var order = this.state.order
    if (index == 1) {
      order = this.state.favoriteOrder
    }

    this.selectedIndex = index
    this.SearchFilterFunction(this.state.text)
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
        <SegmentedControlTab
            tabsContainerStyle={styles.tabsContainerStyle}
            tabStyle={styles.tabStyle}
            tabTextStyle={styles.tabTextStyle}
            activeTabStyle={styles.activeTabStyle}
            activeTabTextStyle={styles.activeTabTextStyle}
            values={['All', 'Favorite']}
            selectedIndex={this.selectedIndex}
            onTabPress={this.handleIndexChange}
            />

        {this.c.searchInput(this.state, this.SearchFilterFunction.bind(this))}
        {this.c.equationSortList(this.state, this.onRowMoved.bind(this), this.onItemPress.bind(this))}
      </View>
    );
  }

  onItemPress(equation) {
    this.props.navigation.navigate('Detail', {title: equation.name, equation, updateFavorite: this.setFavoriteEquations});
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
    this.updateOrderAsyncStorage(order)
  }

}

const styles = StyleSheet.create({
  tabsContainerStyle: {
    paddingBottom: 4
  },

  tabStyle: {
    borderColor: '#0C3F7D'
  },
  tabTextStyle: {
    color: '#0C3F7D',
    fontWeight: 'bold'
  },
  activeTabStyle: {
    backgroundColor: '#0C3F7D'
  },
  activeTabTextStyle: {
    fontWeight: 'bold'
  },

  MainContainer : {
     justifyContent: 'center',
     flex:1,
   },

  StateLoading:{
   flex: 1,
   paddingTop: 20
  },

});
