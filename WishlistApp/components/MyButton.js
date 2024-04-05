import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const MyButton = props => {
  const content = (
    <View style={[styles.button, {backgroundColor: props.color}]}>
      <Text style={styles.text}>{props.text}</Text>
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
    width: 200,
    borderRadius: 20,
    alignItems: 'center'
  },
  text: {
    fontSize: 32,
    textAlign: 'center',
    margin: 10
  }
})
export default MyButton;
