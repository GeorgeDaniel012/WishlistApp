import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';

const MyButton = props => {

  const { width, height } = Dimensions.get('window');
  const font_size=width*0.05;
  const content = (
    <View style={[styles.button, {backgroundColor: props.color}]}>
      <Text style={[styles.text, {fontSize: font_size}, {color:'rgb(0,0,0)'}]}>{props.text}</Text>
    </View> 
  )

  //return (
   // <View>
    //  <Button title="Press Me" onPress={handlePress} style={styles.title}/>
    //</View>
  //);
  return <TouchableOpacity onPress={props.onPress}>{content}</TouchableOpacity>
};

const styles = StyleSheet.create({
  button:{
    padding: 16,
    width: '100%',
    borderRadius: 20,
    alignItems: 'center'
  },
  text: {
    textAlign: 'center',
    margin: 10
  }
})
export default MyButton;
