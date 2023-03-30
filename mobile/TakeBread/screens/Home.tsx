import { DeviceEventEmitter, View, Text, Button } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react';
import { ListArray } from '../api/api';
import { NavigationParams } from '../App';
import { apiClient } from '../App';
import { Events } from '../Events';
import { ShoppinList } from '../api/types';
import { ListsList } from '../components/ListsList';

export const HomeScreen = ({ navigation, route }: NavigationParams) => {

  let [lists, updateLists] = useState<ListArray>([])
  let [isError, setError] = useState<boolean>(false)
  let [isLoading, setLoading] = useState<boolean>(true)

  useEffect(
    () => {
      apiClient.lists.listLists().then(response => {
        console.log(response.data)
        updateLists(response.data)
        setLoading(false)
        setError(false)
      }).catch(e => {
        setLoading(false)
        setError(true)
      })
    },
    []
  )

  useEffect(
    () => {
      DeviceEventEmitter.addListener(Events.onListAdd, (list) => {
        updateLists((l) => l.concat(list))
      })
      return () => {
        DeviceEventEmitter.removeAllListeners(Events.onListAdd)
      }
    },
    []
  )

  const onAddPress = () => {
    navigation.navigate('AddList')
  }

  const onItemPress = ({ id, title }: ShoppinList) => {
    navigation.navigate('ViewList', {
      id: id,
      title: title,
    })
  }


  return (
    <View>
      {isLoading
        ? (
          <Text>Loading data...</Text>
        )
        : isError ? (
          <Text>Error...</Text>
        ) : (
          <ListsList lists={lists} onAddPress={onAddPress} onItemPress={onItemPress} />
        )
      }
    </View>
  );
};



