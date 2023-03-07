/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { Api } from './api/myApi'

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  let [ t, setT ] = useState("")

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const onButtonPress = () => {
    let apiClient = new Api({
      baseUrl: "http://192.168.0.19:8080"
    })
    
    /* apiClient.item.getItem('asd').then(result => {
      console.log(result)
    }).catch(e => console.error(e.status, e.error)) */
    
    /* fetch("http://192.168.0.19:8080/test", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      body: JSON.stringify({title: "something completely new"}), // body data type must match "Content-Type" header
    }) */

    apiClient.item.createItem({title: "something completely new"})
      .then(response => {
        console.log(response)
      })
      .catch(e => console.error(e))
    setT('ASD')
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <View>
        <Button title='asdq' onPress={onButtonPress}/>
        <Text>
          {t}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
