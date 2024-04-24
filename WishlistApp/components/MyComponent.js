import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, Button, Alert, Dimensions } from 'react-native';
import configData from "../config.json";

const windowHeight = Dimensions.get('window').height;

const MyComponent = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = () => {
      // Send the search query to the backend
      fetch(configData.connection+"/search", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      })
        .then(response => response.json())
        .then(data => {
          // Handle backend response
          console.log('Search results:', data);
          // You can update state or perform any other action based on the response
        })
        .catch(error => {
          console.error('Error:', error);
          Alert.alert('Error', 'Failed to fetch search results');
        });
    };
  
    return (
      <SafeAreaView style={styles.container_main}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your search query"
                onChangeText={text => setSearchQuery(text)}
                value={searchQuery}
              />
              <Button title="Search" onPress={handleSearch} />
            </View>
          </View>
          <View style={styles.content}>
            {/* Other content goes here */}
          </View>
        </View>
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '5%',
        paddingTop: windowHeight * 0.06, // Add padding to create space at the top
      },
      header: {
        height: 50,
        backgroundColor: 'lightblue',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20, // Margin between header and content
      },
      content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      searchContainer: {
        flexDirection: 'row', // or 'colomn'
        alignItems: 'center',
      },
      input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        flex: 1, // take up remaining space
        marginRight: 10, // margin between input and button
      },
      container_main: {
        flex: 1,
        //height: windowHeight * 0.9,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:  '#ADD8E6'
      },
});

export default MyComponent;
