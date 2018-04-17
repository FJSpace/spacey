import React, { Component } from "react";
import { View, Text, FlatList, ActivityIndicator, Dimensions, TouchableHighlight } from "react-native";
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
              // <TouchableHighlight
              //   style = {{color: 'red'}}>
                <ListItem
                  title = {item.name}
                  titleStyle = {{
                    fontSize: 30,
                    paddingTop: 10,
                    paddingBottom: 10
                  }}
                  subtitle = {item.equation}
                  subtitleStyle = {{
                    fontSize: 24
                  }}
                  containerStyle={{ borderBottomWidth: 0 }}
                  onPress={()=> { this.onPress(item) }}
                />
                // </TouchableHighlight>
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
