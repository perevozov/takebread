import { DeviceEventEmitter, View, Text, Button } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react';
import { ListArray } from '../api/api';
import { NavigationParams } from '../App';
import { apiClient } from '../App';
import { Events } from '../Events';
import { ShoppinList } from '../api/types';
import { ListsList } from '../components/ListsList';

type HomeScreenState = {
  lists: ListArray,
  isError: boolean,
  isLoading: boolean,
}

export class HomeScreen extends React.Component<NavigationParams, HomeScreenState> {
  state = {
    lists: [],
    isError: false,
    isLoading: true,
  }

  updateLists(newValue: ListArray) {
    this.setState({
      lists: newValue
    })
  }

  setError(isError: boolean) {
    this.setState({
      isError: isError
    })
  }

  setLoading(isLoading: boolean) {
    this.setState({
      isLoading: isLoading
    })
  }
  componentDidMount(): void {
    DeviceEventEmitter.addListener(Events.onListAdd, (list) => {
      this.setState(oldState => {
        return {
          lists: oldState.lists.concat(list)
        }
      })
    })

    this.refresh()
  }

  refresh() {
    this.setState({
      lists: [],
      isLoading: true,
      isError: false
    }, () => {
      apiClient.lists.listLists().then(response => {
        this.setState({
          lists: response.data,
          isLoading: false,
          isError: false
        })
      }).catch(e => {
        this.setState({
          lists: [],
          isLoading: false,
          isError: true,
        })
      })
    })
  }

  componentWillUnmount(): void {
    DeviceEventEmitter.removeAllListeners(Events.onListAdd)
  }

  onAddPress = () => {
    this.props.navigation.navigate('AddList')
  }

  onItemPress = ({ id, title }: ShoppinList) => {
    this.props.navigation.navigate('ViewList', {
      id: id,
      title: title,
    })
  }

  render() {
    return (
      <View>
        {this.state.isLoading
          ? (
            <Text>Loading data...</Text>
          )
          : this.state.isError ? (
            <Text>Error...</Text>
          ) : (
            <ListsList 
            refreshing={this.state.isLoading}
            lists={this.state.lists} 
            onAddPress={this.onAddPress} 
            onItemPress={this.onItemPress} 
            onRefresh={() => this.refresh()}
            />
          )
        }
      </View>
    );
  };
}



