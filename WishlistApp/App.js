import React, { useEffect, useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { View, Text, StyleSheet , Button, Alert, SafeAreaView, Dimensions} from 'react-native';
import MyButton from './components/MyButton';
import configData from "./config.json";
import SearchPage from './components/SearchPage';
import HomeScreen from './components/HomeScreen';
import Profile from './components/Profile';
import MediaPage from './components/MediaPage';
import GoToProfileButton from './components/GoToProfileButton';

const Stack = createNativeStackNavigator();

const App = () => {
  // const handlePress = () => {
  //   //Alert.alert('Button pressed!');
  //   navigation.navigate('Search');
  // };

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    connection = configData.connection;
    fetch(connection)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.text(); 
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  return (
    // <View style={style.container}>
    //   {loading ? (
    //     <Text>Loading...</Text>
    //   ) : error ? (
    //     <Text>Error: {error.message}</Text>
    //   ) : (
    //     <SafeAreaView style={style.container}>
    //         <MyComponent />
    //     </SafeAreaView>

    //   )}
    // </View>
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName='Wishlist'
        screenOptions={{
          headerStyle: {
            backgroundColor: 'rgba(0, 75, 128, 50)', // Change this to the color you want
          },
          headerTintColor: 'rgb(255,255,255)', // Change the text color of the header
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          //headerShown: false
        }}
        >
        <Stack.Screen
          name = "Wishlist"
          component = {HomeScreen}
          // options = {{
          //   onPress: handlePress(),
          //   color: 'rgb(128,128,128)'
          // }}
          // onPress = {handlePress()}
          // color = 'rgb(128,128,128)'
          // initialParams={{
          //   color: 'rgb(128,128,128)',
          //   text: 'Search' }}
          options={({ navigation }) => ({
            title: '',
            headerLeft: () => <GoToProfileButton navigation={navigation} page='Profile'/>,
            headerRight: () => <MyButton navigation={navigation} page='Search'/>,
          })}
          style = {styles.button}
        />
        <Stack.Screen
          name = "Search"
          component = {SearchPage}
        />
        <Stack.Screen
          name = "Profile"
          component = {Profile}
        />
        <Stack.Screen
          name = "MediaPage"
          component = {MediaPage}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //height: windowHeight * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:  '#ADD8E6'
  },
  button: {
    //width: '50%',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  }
});

export default App;
