import { Api } from '../api/api'
import { useState } from 'react';
import { DeviceEventEmitter, View, TextInput, Button } from 'react-native'
import { Events } from '../Events'

import { apiClient, NavigationParams } from '../App';

export const AddItemScreen = ({ navigation, route }: NavigationParams) => {
    let [name, setName] = useState('')

    const onAdd = () => {
        console.log(name, name)
        if (name == '') {
            return
        }
        apiClient.list.addItem(route.params.id, {
            title: name
        }).then((response) => {
            DeviceEventEmitter.emit(Events.onListItemAdd, response.data)
            navigation.goBack()
        })

    }

    const onCancel = () => {
        navigation.goBack()
    }

    return (
        <View>
            <TextInput onChangeText={setName}></TextInput>
            <Button title='Add' onPress={onAdd} />
            <Button title='Cancel' onPress={onCancel} />
        </View>
    )
}