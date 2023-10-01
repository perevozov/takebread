/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  TextInput,
  DeviceEventEmitter,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Events } from './Events'
import { AddListScreen } from './screens/AddList'
import { AddItemScreen } from './screens/AddItem';
import { ViewListScreen } from './screens/ViewList'
import { HomeScreen } from './screens/Home';


import { Api, ListArray } from './api/api'
import { ListItem } from './components/ListItem';
import { config } from './config';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

export interface NavigationParams {
  navigation: any,
  route: any
}

export const apiClient = new Api({
  baseUrl: config.apiEndpoint
})

function App_(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  let [t, setT] = useState("")

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const onButtonPress = () => {
  }
  return (
    <SafeAreaView style={backgroundStyle}>
      <View>
        <Button title='asdq' onPress={onButtonPress} />
        <Text>
          {t}
        </Text>
        <ListItem name="asd" />
      </View>
    </SafeAreaView>
  );
}

const Stack = createNativeStackNavigator();

const AuthContext = React.createContext({
  isSignedIn: false,
  setSignedIn: (signedId: boolean, token: string) => { }
});


class App extends React.Component {

  state = {
    isSignedIn: false
  }

  setSignedIn = (signedIn: boolean, token: string) => {
    apiClient.setSecurityData({ token: token })

    this.setState({
      isSignedIn: true,
      token: token,
    })
  }

  componentDidMount(): void {
    this.setState({
      isSignedIn: false
    })
  }

  render() {
    return (
      <AuthContext.Provider value={{ isSignedIn: this.state.isSignedIn, setSignedIn: this.setSignedIn }}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Home'>
            {this.state.isSignedIn ? (
              <>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="AddList" component={AddListScreen} />
                <Stack.Screen
                  name="ViewList"
                  component={ViewListScreen}
                  options={({ route }: { route: any }) => ({ title: route.params.title })}
                />
                <Stack.Screen
                  name="AddItem"
                  component={AddItemScreen}
                />
                {/* <Stack.Screen name="Settings" component={SettingsScreen} /> */}
              </>
            ) : (
              <>
                <Stack.Screen name="Sign In" component={SignInScreen} />
                {/* <Stack.Screen name="SignUp" component={SignUpScreen} /> */}
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>

    );
  }
};

function SignInScreen() {

  const { isSignedIn, setSignedIn } = React.useContext(AuthContext);


  return (
    <View>
      <Button
        title="Sign in"
        onPress={() => {
          apiClient.login.login({ email: "demo@takebread.xyz", password: "demo1234" }).then(r => {
            console.log(r.data)
            setSignedIn(true, "123")
          }).catch(e => {
            console.error(e)
          })
        }}
      />
    </View>
  )
}

const ProfileScreen = ({ navigation, route }: NavigationParams) => {
  return <Text>This is {route.params.name}'s profile</Text>;
};

const About = () => {
  return <Text>About App</Text>
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
