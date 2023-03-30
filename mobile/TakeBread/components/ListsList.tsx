import React, {Component} from 'react';
import {Text, View, FlatList, Button, TouchableOpacity, GestureResponderEvent} from 'react-native';
import { ShoppinList } from '../api/types';

type ListsListProps = {
  lists?: ShoppinList[]
  onAddPress?: () => void
  onItemPress?: (item: ShoppinList) => void
}

type ListsListState = {
  lists: ShoppinList[]
}

export class ListsList extends React.Component<ListsListProps, ListsListState> {

  onItemPress (item: ShoppinList) {
    console.log("press", item)
    this.props.onItemPress && this.props.onItemPress(item)
  }

  renderItem = ({item}: {item: ShoppinList}) => {
    return (
      <Item title={item.title} onPress={() => this.onItemPress(item)}/>
    )
  }

  render() {
    return (<View >
    <Button title='Add one' onPress={() => {this.props.onAddPress && this.props.onAddPress()}} />

    <FlatList
      data={this.props.lists}
      renderItem={this.renderItem}
      keyExtractor={item => item.id!}
    />
  </View>)
  }
}

const Item = (props: {title: string, onPress: (e: GestureResponderEvent) => void}) => (
  <TouchableOpacity style={styles.item} onPress={(e) => props.onPress(e)}>
    <Text style={styles.title}>{props.title}</Text>
  </TouchableOpacity>
);

const styles = {
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {

  }
}