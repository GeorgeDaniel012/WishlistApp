import React from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Button, Alert, SafeAreaView, Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const scaleFontSize = (size) => {
  const baseWidth = 375; // iPhone 8 screen width (for some reason)
  return size * (screenWidth / baseWidth);
};

const GoToProfileButton = ({navigation, route, page}) => {
  const handlePress = async () => {
    if(!(await AsyncStorage.getItem('@user'))){
      Alert.alert("Failed", "You are not logged in.");
    }
    else {
      navigation.navigate(page);
    }
  };

  const content =
  (
    <View>
      {/* <Button title={page} color='rgba(0,0,0,0)' onPress={handlePress} style = {styles.button}/> */}
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.text}>Profile</Text>
      </TouchableOpacity>
    </View>
  )

  return content;
};

const styles = StyleSheet.create({
  button:{
    //marginTop: '10%',
    width: '100%',
    backgroundColor:  '#0000'
  },
  text: {
    textAlign: 'left',
    fontWeight: 'bold',
    color: 'black',
    fontSize: scaleFontSize(20)
  }
})

export default GoToProfileButton;
