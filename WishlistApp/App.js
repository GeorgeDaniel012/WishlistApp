import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet , Button, Alert} from 'react-native';
import MyButton from './components/MyButton';

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handlePress = () => {
    Alert.alert('Button pressed!');
  };

  useEffect(() => {
    fetch('https://6360-86-123-32-103.ngrok-free.app') //modify ngrok link after regenerating
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
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text>Error: {error.message}</Text>
      ) : (
        <Text>{data}</Text>
      )}
      <MyButton text='Button test' color='red' onPress = {handlePress}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
