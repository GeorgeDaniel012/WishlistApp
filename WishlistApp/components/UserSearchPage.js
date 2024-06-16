import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, Button, Alert, Dimensions, ScrollView } from 'react-native';
import configData from "../config.json";
import SearchResults from "./SearchResults";
import UserItem from './UserItem';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const scaleFontSize = (size) => {
    const baseWidth = 375;
    return size * (screenWidth / baseWidth);
};

const UserSearchPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const textInputRef = useRef(null);

    const handleSearch = () => {
        // Make the TextInput lose focus
        textInputRef.current.blur();

        setSearchResults([]);

        fetch(configData.connection+"/userprofile/search/"+encodeURIComponent(searchQuery), {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {setSearchResults(data); setHasSearched(true);})
        .catch(error => {
            console.error('Error:', error);
            Alert.alert('Error', 'Failed to fetch search results for users');
            setHasSearched(true);
        });
    };
  
    return (
      <SafeAreaView style={styles.container_main}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.searchContainer}>
              <TextInput
                ref = {textInputRef}
                autoFocus = {true}
                style={styles.input}
                placeholder="Enter your search query"
                onChangeText={text => setSearchQuery(text)}
                value={searchQuery}
              />
              <Button title="Search" onPress={() => {searchQuery != "" ? handleSearch() : null}} />
            </View>
          </View>
          <View style={styles.results}>
            <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            >
                {
                    searchResults.length === 0
                    ? <Text style={{fontSize: scaleFontSize(18)}}>No results.</Text>
                    : (
                        searchResults.map((obj, index) => (
                            <UserItem object={obj} key={index}/>
                        ))
                    )
                }
            </ScrollView>
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
        backgroundColor:  '#ADD8E6',
        height: Dimensions.get('window').height
      },
      noResults: {
        verticalAlign: 'top',
        alignItems: 'top',
        flexDirection: 'row',
        //backgroundColor: 'black'
        //marginBottom: Dimensions.get('window').height*0.33
      },
      results: {
        //height: 'auto'
        height: Dimensions.get('window').height*0.8,
        width: Dimensions.get('window').width*0.85,
        //backgroundColor: 'black'
      }
});

export default UserSearchPage;
