import React, { Component } from "react";
import { View, Text, ActivityIndicator, Dimensions, TouchableHighlight, StyleSheet, AsyncStorage, Button, TextInput} from "react-native";
import { List, ListItem, SearchBar } from "react-native-elements";
import { StackNavigator } from 'react-navigation';
import SortableListView from 'react-native-sortable-listview'

var height = Dimensions.get('window').height;

export default class HomePage extends React.Component {

  // To use local variables and functions, navigation.state has to be used.
  static navigationOptions = ({ navigation }) => {
      const { params = {} } = navigation.state;

      return {
        title: "Equations",
        headerRight: <Button disabled={params.isSearching || false} title={params.buttonTitle || "Order"} onPress={() => params.editOrder()} color="#E73137" />
      };
  };

  // Set a parameter in navigation as a function to be used in the header button.
  componentWillMount() {
	if(this.props.navigation)  
		this.props.navigation.setParams({ editOrder: this._editOrder });
  }

  // This is neccaccary for the button in the header to be able to use the state variable.
  _editOrder = () => {

    // Set the button in the header.
    if(!this.state.isOrder) {
      this.props.navigation.setParams({ buttonTitle: "Done" });
    } else {
      this.props.navigation.setParams({ buttonTitle: null });
    }

    this.setState({ isOrder: !this.state.isOrder})
  }

  constructor(props) {

    super(props);

    var customData = require('../Model/Equations.json')
    const equations = customData["Equations"]

    this.state={
      equations: equations,
      order: null,
      filterOrder: null,
      isOrder: false,
      isSearching: false,
      isLoading: false,
      text: '',
    }

    // The order is stored in index.
    this.setOrder()
  }

  // Fetch the order from the locale storage. If there is none there, use standard.
  async setOrder() {
    var order = []
    try {
      const value = await AsyncStorage.getItem('@MySuperStore:equationOrder');
      if (value !== null){
        order = JSON.parse(value)

        // Reset to default order if the equations are changed.
        if(order.length != Object.keys(this.state.equations).length) {
          order = Object.keys(this.state.equations)
        }

      }
    } catch (error) {
      order = Object.keys(this.state.equations) // Array of keys, defaults
    }

    this.setState({
      order: order,
      filterOrder: order
    })
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
      this.props.navigation.setParams({ isSearching: true});
      this.props.navigation.setParams({ buttonTitle: null });
      this.setState({
        isSearching: true,
        isOrder: false
      })
    } else {
      this.props.navigation.setParams({ isSearching: false});
      this.setState({
        isSearching: false
      })
    }
}

  // Not used atm.
  ListViewItemSeparator = () => {
    return (
      <View
        style={{
          height: .5,
          width: "100%",
          backgroundColor: "#000",
        }}
      />
    );
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

        <TextInput
           style={styles.TextInputStyleClass}
           onChangeText={(text) => this.SearchFilterFunction(text)}
           value={this.state.text}
           underlineColorAndroid='transparent'
           placeholder="Search Here"
        />

        <SortableListView
          style={{ flex: 1 }}
          data={this.state.equations}
          order={this.state.filterOrder}
          disableSorting= {!this.state.isOrder}
          onRowMoved={e => {
            this.onRowMoved(e)
          }}
          renderRow={ item  => (
              <ListItem
                title = {item.name}
                titleStyle = {styles.listTitle}
                subtitle = {item.equation}
                subtitleStyle = {styles.listSubTitle}
                containerStyle={styles.listItemContainer}
                rightIcon={{ name: 'chevron-right' }}
                onPress={()=> { this.onPress(item) }}
              />
            )}
        />

      </View>
    );
  }

  onPress(equation) {
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

  listItemContainer: {
    borderBottomWidth: 0
  },

  listTitle: {
    fontSize: 30,
    paddingTop: 10,
    paddingBottom: 10
  },

  TextInputStyleClass :{
   textAlign: 'center',
   height: 40,
   borderWidth: 1,
   borderColor: '#009688',
   borderRadius: 7 ,
   backgroundColor : "#FFFFFF"
  },

  StateLoading:{
    flex: 1,
    paddingTop: 20
  }

});
