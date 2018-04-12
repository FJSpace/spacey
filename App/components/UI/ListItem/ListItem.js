import React from 'react';
import { View, Text } from 'react-native';

 const listItem = (props) => {

    return(
      <View style = {props.containerStyle} onPress = {props.pressed}>
        <Text style = {{fontSize: 24}}>{props.name}</Text>
        <Text style = {{fontSize: 16}}>{props.subtitle}</Text>
      </View>
    );

 }

 export default listItem;
