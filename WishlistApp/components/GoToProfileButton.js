import React from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Button, Alert, SafeAreaView, Dimensions} from 'react-native';

const GoToProfileButton = ({navigation, route, page}) => {
  const handlePress = () => {
    navigation.navigate(page);
  };

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  const content =
  (
    <View>
      <Button title={page} color='rgba(0,0,0,0)' onPress={handlePress} style = {styles.button}/>
    </View>
  )

  return content;
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor:  '#00000'
  },
  buttonContainer: {
    width: '90%',
    //justifyContent: 'center', // center horizontally
    alignItems: 'center', // center vertically
    marginTop: '10%',
    //marginBottom: 'auto',
  },
  button:{
    width: '100%',
    marginTop: '10%',
    borderRadius: 20,
    alignItems: 'center',
    width: '100%', // button takes full width of the container
    backgroundColor:  '#00'
  },
  text: {
    textAlign: 'center',
    margin: 10
  }
})

export default GoToProfileButton;
