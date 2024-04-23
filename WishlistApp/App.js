import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet , Button, Alert, SafeAreaView, Dimensions} from 'react-native';
import MyButton from './components/MyButton';
import configData from "./config.json";
import MyComponent from './components/MyComponent';

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handlePress = () => {
    Alert.alert('Button pressed!');
  };

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
    <View style={style.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>Error: {error.message}</Text>
      ) : (
        <SafeAreaView style={style.container}>
            <MyComponent />
        </SafeAreaView>

      )}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    //height: windowHeight * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:  '#ADD8E6'
  },

});

export default App;
