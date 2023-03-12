import { Api } from '../api/api'
import { useState } from 'react';
import { DeviceEventEmitter, View, TextInput, Button } from 'react-native'
import { Events } from '../Events'


export const AddListScreen = ({ navigation }) => {
    let [name, setName] = useState('')


    const onAdd = () => {
        console.log(name, name)
        if (name == '') {
            return
        }
        const apiClient = new Api({
            baseUrl: "http://192.168.0.19:8080"
        })
        apiClient.list.createLst({
            title: name
        }).then((response) => {
            console.log('xxx', response.data)
            DeviceEventEmitter.emit(Events.onListAdd, response.data)
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