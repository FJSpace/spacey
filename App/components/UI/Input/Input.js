import React from 'react';
import { TextInput, Text, View } from 'react-native';

 const input = (props) => {

    return(
      <View>
        <Text>{props.label}</Text>
        <TextInput
          style = {props.style}
          onChange = {props.changed}
          value = {props.value}
        />
      </View>
        );

 }

 export default input;
