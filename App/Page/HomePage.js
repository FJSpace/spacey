import React, { Component } from "react";
import { View, Text, ActivityIndicator, Dimensions, TouchableHighlight, StyleSheet, AsyncStorage, Button} from "react-native";
import { List, ListItem, SearchBar } from "react-native-elements";
import { StackNavigator } from 'react-navigation';
import SortableListView from 'react-native-sortable-listview'

var height = Dimensions.get('window').height;

export default class HomePage extends React.Component {

  static navigationOptions = ({ navigation }) => {
      const { params = {} } = navigation.state;
      const buttonTitle = "Order"

      return {
        title: "Equations",
        headerRight: <Button title={params.buttonTitle || "Edit Order"} onPress={() => params.editOrder()} />
      };
  };

  _editOrder = () => {

    if(!this.state.isOrder) {
      this.props.navigation.setParams({ buttonTitle: "Done" });
    } else {
      this.props.navigation.setParams({ buttonTitle: null });
    }

    this.setState({ isOrder: !this.state.isOrder})
  }

  componentWillMount() {
    this.props.navigation.setParams({ editOrder: this._editOrder });
  }

  constructor(props) {
    super(props);

    var customData = require('../Model/Equations.json')
    const equations = customData["Equations"]

    this.state={
      equations: equations,
      order: null,
      isOrder: false
    }

    // The order is stored in index.
    this.setOrder()

  }

  // Fetch the order from the locale storage. If there is none there, use standard.
  async setOrder() {
    try {
      const value = await AsyncStorage.getItem('@MySuperStore:equationOrder');
      if (value !== null){
        const order = JSON.parse(value)
        this.setState({order})
      }
    } catch (error) {
      const order = Object.keys(this.state.equations) // Array of keys, defaults
      this.setState({order})
    }
  }

  renderSeparator = () => {
    return (
      <View style={styles.seperator} />
    );
  };

  render() {

    return (
      <SortableListView
        style={{ flex: 1 }}
        data={this.state.equations}
        order={this.state.order}
        disableSorting= {!this.state.isOrder}
        onRowMoved={e => {
          const order = this.state.order
          order.splice(e.to, 0, order.splice(e.from, 1)[0])
          this.setState({order})
          this.onRowMoved()
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
    );
  }

  onPress(equation) {
    this.props.navigation.navigate('Detail', {title: equation.name, equation});
  }

  async onRowMoved() {

      // Store the order in local storage when row is moved.
      try {
        await AsyncStorage.setItem('@MySuperStore:equationOrder', JSON.stringify(this.state.order));
      } catch (error) {
        console.log("Fail to store equation order!")
      }
  }
}


const styles = StyleSheet.create({
  seperator:
    {
      height: 1,
      width: "100%",
      backgroundColor: "#CED0CE",
      marginLeft: "5%"
    },
  ListContainer:
  {
    height,
    marginTop: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0
  },
  listItemContainer:
  {
    borderBottomWidth: 0
  },
  listTitle:
  {
    fontSize: 30,
    paddingTop: 10,
    paddingBottom: 10
  },
  listSubTitle:
  {
    fontSize: 24
  },
});
