import React from 'react';
import { StackNavigator } from 'react-navigation';
import { Image, Text, View } from 'react-native';
import { Asset, AppLoading } from 'expo';
import HomePage from './Page/HomePage.js'
import DetailPage from './Page/DetailPage.js'
import AddEquationPage from './Page/AddEquationPage.js'


const RootStack = StackNavigator({
  Home: { screen: HomePage },
  Detail: { screen: DetailPage },
  AddEquation: { screen: AddEquationPage },
},
{
  initialRouteName: 'Home',
  navigationOptions:{
    headerStyle:{
      backgroundColor: '#B7B9B8'
    },
    headerTintColor: '#0C3F7D'
  }
}
);

export default class App extends React.Component
{
  state = {
    isReady: false,
  };

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._cacheResourcesAsync}
          onFinish={() => this.setState({isReady: true })}
          onError={console.warn}
        />
      );
    }

    return <RootStack />;
  }

  async _cacheResourcesAsync() {
    const images = [
      require('./assets/images/splash.png'),
    ];

    const cacheImages = images.map((image) => {
      return Asset.fromModule(image).downloadAsync();
    });
    return Promise.all(cacheImages)

  }
}