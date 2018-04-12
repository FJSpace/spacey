import React, { Component } from "react";
import { View, Text, FlatList, ActivityIndicator, Dimensions } from "react-native";
import { List, ListItem, SearchBar } from "react-native-elements";
import { StackNavigator } from 'react-navigation';

var height = Dimensions.get('window').height;

export default class HomePage extends React.Component {

  static navigationOptions = {
    title: 'Equations',
  };

  constructor(props) {
    super(props);

    var customData = require('../Model/Equations.json')
    this.equations = customData["Equations"]
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#CED0CE",
          marginLeft: "5%"
        }}
      />
    );
  };

  render() {
    return (
      <View>
        <List containerStyle={{ height, marginTop: 0, borderTopWidth: 0, borderBottomWidth: 0 }}>
          <FlatList
            data={this.equations}
            renderItem={({ item }) => (
              <ListItem
                title={`${item.name}`}
                subtitle={item.equation}
                containerStyle={{ borderBottomWidth: 0 }}
                onPress={()=> { this.onPress(item) }}
              />
            )}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={this.renderSeparator}
          />
        </List>
      </View>
    );
  }

  onPress(equation) {
    this.props.navigation.navigate('Detail', {title: equation.name, equation});
  }
}
