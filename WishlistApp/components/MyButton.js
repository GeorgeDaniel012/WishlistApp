import React from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Button, Alert, SafeAreaView, Dimensions} from 'react-native';

const MyButton = ({navigation, route, page, title=page, color=""}) => {
  const handlePress = () => {
    //Alert.alert('Button pressed!');
    //navigation.navigate('Search');
    navigation.navigate(page);
  };

  const { width, height } = Dimensions.get('window');
  const font_size=width*0.05;
  const content =
  // (
  //   <View style = {styles.container}>
  //     <TouchableOpacity style={[styles.buttonContainer, {backgroundColor: route.params.color}]} onPress={handlePress}>
  //       <View style={[styles.button]}>
  //         <Text style={[styles.text, {fontSize: font_size}, {color:'rgb(0,0,0)'}]}>{route.params.text}</Text>
  //       </View> 
  //     </TouchableOpacity>
  //   </View>
  // )
  (
    <View>
    {/* <View style = {styles.container}> */}
      {/* <TouchableOpacity style={[styles.buttonContainer, {backgroundColor: route.params.color}]} onPress={handlePress}>
        <View style={[styles.button]}>
          <Text style={[styles.text, {fontSize: font_size}, {color:'rgb(0,0,0)'}]}>{route.params.text}</Text>
        </View> 
      </TouchableOpacity> */}
      <Button color={color} title={title} onPress={handlePress} style = {styles.button}/>
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
    backgroundColor:  '#ADD8E6'
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
    width: '100%' // button takes full width of the container
  },
  text: {
    textAlign: 'center',
    margin: 10
  }
})

export default MyButton;
