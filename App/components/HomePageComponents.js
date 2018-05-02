import React, { Component } from "react";
import { View, StyleSheet, TextInput} from "react-native";
import { List, ListItem, SearchBar } from "react-native-elements";
import SortableListView from 'react-native-sortable-listview';
import Ripple from 'react-native-material-ripple';


export default class HomePageComponents {

  searchInput(state, onChangeFunction) {
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

  equationSortList(state, onRowMoved, onItemPress) {
    return (
      <SortableListView
        style={{ flex: 1 }}
        data={state.equations}
        order={state.filterOrder}
        disableSorting= {state.isSearching}
        onRowMoved={e => {
          onRowMoved(e)
        }}
        renderRow={ item  => (
            this.equationListItem(item, onItemPress)
          )}
      />
    )
  }

  equationListItem(item, pressfunction) {
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

});
