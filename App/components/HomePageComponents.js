import React, { Component } from "react";
import { View, StyleSheet, TextInput} from "react-native";
import { List, ListItem, SearchBar } from "react-native-elements";
import SortableListView from 'react-native-sortable-listview';
import Ripple from 'react-native-material-ripple';


export default class HomePageComponents {

  searchInput(state, onChangeFunction, styles) {
    return (
      <TextInput
         style={styles.TextInputStyleClass}
         onChangeText={(text) => onChangeFunction(text)}
         value={state.text}
         underlineColorAndroid='transparent'
         placeholder="Search Here"
      />
    )
  }

  equationSortList(state, onRowMoved, onItemPress, styles) {
    return (
      <SortableListView
        style={{ flex: 1 }}
        data={state.equations}
        order={state.filterOrder}
        disableSorting= {!state.isOrder}
        onRowMoved={e => {
          onRowMoved(e)
        }}
        renderRow={ item  => (
            this.equationListItem(item, onItemPress, styles)
          )}
      />
    )
  }

  equationListItem(item, pressfunction, styles) {
    return (
      <Ripple onPress={()=> { pressfunction(item) }} rippleDuration={200} rippleSize={250}>
        <ListItem
          title = {item.name}
          titleStyle = {styles.listTitle}
          subtitle = {item.equation}
          subtitleStyle = {styles.listSubTitle}
          containerStyle={styles.listItemContainer}
          rightIcon={{ name: 'chevron-right' }}
        />
      </Ripple>
    )
  }

}
