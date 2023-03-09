import React, {Component} from 'react';
import {Text, View, FlatList, Button} from 'react-native';
import { Api } from '../api/api';

type ShoppinList = {
  id: string,
  title: string
}

type ListsListProps = {
  lists?: ShoppinList[]
  onAddPress?: () => {}
}

type ListsListState = {
  lists: ShoppinList[]
}

export class ListsList extends React.Component<ListsListProps, ListsListState> {
  state = {
    lists: []
  }
  
  componentDidMount(): void {
    const apiClient = new Api({
      baseUrl: "http://192.168.0.19:8080"
    })    
    apiClient.lists.listLists().then(response => {
      console.log(response.data)

      this.setState({
        lists: response.data
      })
    })
  }

  render() {
    return (<View >
    <Button title='Add one' onPress={() => {this.props.onAddPress && this.props.onAddPress()}} />

    <FlatList
      data={this.state.lists}
      renderItem={({item}) => <Item title={item.title} />}
      keyExtractor={item => item.id}
    />
  </View>)
  }
}

const Item = (props: {title: string}) => (
  <View style={styles.item}>
    <Text style={styles.title}>{props.title}</Text>
  </View>
);

const styles = {
  item: {

  },
  title: {

  }
}