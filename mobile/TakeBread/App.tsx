/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
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


import { Api } from './api/api'
import { ListItem } from './components/ListItem';
import { ListsList } from './screens/ListsList';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

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
  setSignedIn: (signedId: boolean) => {}
});



class App extends React.Component {

  state = {
    isSignedIn: false
  }

  setSignedIn = (signedIn: boolean) => {
    this.setState({
      isSignedIn: true
    })
  }

  componentDidMount(): void {
    this.setState({
      isSignedIn: false
    })
  }

  render() {
    return (
      <AuthContext.Provider value={{isSignedIn: this.state.isSignedIn, setSignedIn: this.setSignedIn}}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Home'>
            {this.state.isSignedIn ? (
              <>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="AddList" component={AddListScreen} />
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

  const {isSignedIn, setSignedIn} = React.useContext(AuthContext);


  return (
    <View>
      <Button
        title="Sign in"
        onPress={() => {
          setSignedIn(true)
        }}
      />
    </View>
  )
}

const HomeScreen = ({navigation, route}) => {
  
  return (
    <View>
      <ListsList onAddPress={() => {
        navigation.navigate('AddList')
      }}/>
    </View>

  );
};

const AddListScreen = ({navigation}) => {
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
    }).then(() => {
      navigation.goBack()
    })
    
  }

  const onCancel = () => {
    navigation.goBack()
  }

  return (
    <View>
      <TextInput onChangeText={setName}></TextInput>
      <Button title='Add' onPress={onAdd}/>
      <Button title='Cancel' onPress={onCancel}/>
    </View>
  )
}

const ProfileScreen = ({ navigation, route }) => {
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
