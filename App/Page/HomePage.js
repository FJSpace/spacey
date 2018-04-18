import React, { Component } from "react";
import { View, Text, FlatList, ActivityIndicator, Dimensions, TouchableHighlight, StyleSheet } from "react-native";
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
      <View style={styles.seperator} />
    );
  };

  render() {

    return (
      <View>
        <List containerStyle={styles.ListContainer}>
          <FlatList
            data={this.equations}
            renderItem={({ item }) => (
              // <TouchableHighlight
              //   style = {{color: 'red'}}>
                <ListItem
                  title = {item.name}
                  titleStyle = {styles.listTitle}
                  subtitle = {item.equation}
                  subtitleStyle = {styles.listSubTitle}
                  containerStyle={styles.lsitItemContainer}
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
  lsitItemContainer:
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
