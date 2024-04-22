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
    const configData = fs.readFileSync('config.json');
    const config = JSON.parse(configData);
    connection = config.connection;
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
        <View style={style.container}>
          <Text>{data}</Text>
          <MyButton text='Button test' color='red' onPress = {handlePress}/>
        </View>

      )}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
