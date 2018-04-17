import React from 'react';
import { View, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';
import HomePage from './Page/HomePage.js'
import DetailPage from './Page/DetailPage.js'


const RootStack = StackNavigator({
  Home: { screen: HomePage },
  Detail: { screen: DetailPage },
});

export default class App extends React.Component {

  render() {
    return <RootStack />;
  }

}
