import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, Button, Alert, Dimensions } from 'react-native';
import configData from "../config.json";
import WishlistResults from "./WishlistResults";

const windowHeight = Dimensions.get('window').height;

const Profile = () => {
    const [userId, setUserId] = useState(1);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
      // Send the search query to the backend

      // FOR TESTING TMDB API
      console.log(configData.connection+"/wishlist/"+userId);
      fetch(configData.connection+"/wishlist/"+userId, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(responseItems => responseItems.json())
        .then(data => setSearchResults(data))
        .catch(error => {
            console.error('Error:', error);
            Alert.alert('Error', 'Failed to fetch wishlist items');
        });
    }, []);
  
    return (
      <SafeAreaView style={styles.container_main}>
        <View style={styles.container}>
          <View style={styles.header}>
          </View>
          <View style={styles.results}>
            {searchResults.length != 0
                ? <WishlistResults data={searchResults}></WishlistResults>
                : null
              }
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
        flexGrow: 1,
        alignItems: 'center',
        padding: '5%',
        //paddingTop: windowHeight * 0.06, // Add padding to create space at the top
        //backgroundColor: 'pink'
      },
      // header: {
      //   height: 50,
      //   backgroundColor: 'lightblue',
      //   justifyContent: 'center',
      //   alignItems: 'center',
      //   width: '100%',
      //   marginBottom: 20, // Margin between header and content
      // },
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
        backgroundColor:  '#ADD8E6',
        height: Dimensions.get('window').height
      },
      // results: {
      //   flex: 1,
      //   width: '100%',
      //   height: Dimensions.get('window').height*20,
      //   flexGrow: 1,
      //   backgroundColor: 'red',
      //   overflow: 'scroll',
      //   margin: 0,
      //   paddingBottom: '100%'
      // }
      results: {
        //height: 'auto'
        height: Dimensions.get('window').height*0.9,
        width: Dimensions.get('window').width*0.85
      }
});

export default Profile;