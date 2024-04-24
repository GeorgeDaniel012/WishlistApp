import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Alert, SafeAreaView, Dimensions} from 'react-native';

const MyButton = ({navigation, route}) => {
  const handlePress = () => {
    //Alert.alert('Button pressed!');
    navigation.navigate('Search');
  };

  const { width, height } = Dimensions.get('window');
  const font_size=width*0.05;
  const content = (
    <View style = {styles.container}>
      <TouchableOpacity style={[styles.buttonContainer, {backgroundColor: route.params.color}]} onPress={handlePress}>
        <View style={[styles.button]}>
          <Text style={[styles.text, {fontSize: font_size}, {color:'rgb(0,0,0)'}]}>{route.params.text}</Text>
        </View> 
      </TouchableOpacity>
    </View>
  )

  return content;
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 16,
    paddingRight: 16,
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:  '#ADD8E6'
  },
  buttonContainer: {
    width: '50%',
    //justifyContent: 'center', // center horizontally
    alignItems: 'center', // center vertically
    marginTop: '10%',
    //marginBottom: 'auto',
  },
  button:{
    borderRadius: 20,
    alignItems: 'center',
    width: '100%' // button takes full width of the container
  },
  text: {
    textAlign: 'center',
    margin: 10
  }
})

export default MyButton;
