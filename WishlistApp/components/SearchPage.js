import React, { useState, useRef } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, Button, Alert, Dimensions } from 'react-native';
import configData from "../config.json";
import SearchResults from "./SearchResults";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SearchPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResultsGames, setSearchResultsGames] = useState([]);
    const [searchResultsMTV, setSearchResultsMTV] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const textInputRef = useRef(null);

    const handleSearch = () => {
      // Make the TextInput lose focus
      textInputRef.current.blur();

      // Send the search query to the backend

      // FOR TESTING TMDB API
      // fetch(configData.connection+"/igdbapi/"+encodeURIComponent(searchQuery), {
      // //fetch(configData.connection+"/tmdbapi/"+encodeURIComponent(searchQuery), {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   //body: JSON.stringify({ query: searchQuery }),
      // })
      //   .then(responseGames => responseGames.json())
      //   .then(dataGames => {
      //     // Handle backend response
      //     //console.log('Search results games:', data_games);
      //     fetch(configData.connection+"/tmdbapi/"+encodeURIComponent(searchQuery), {
      //       method: 'GET',
      //       headers: {
      //         'Content-Type': 'application/json',
      //       },
      //       //body: JSON.stringify({ query: searchQuery }),
      //     })
      //     .then(responseMtv => responseMtv.json())
      //     .then(dataMtv => {
      //       allData = dataGames.concat(dataMtv);
      //       setSearchResults(allData);
      //     })
      //     .catch(error => {
      //       console.error('Error:', error);
      //       Alert.alert('Error', 'Failed to fetch search results for movies and shows');
      //     });
      //     //setSearchResults(data);
      //     // You can update state or perform any other action based on the response
      //   })
      //   .catch(error => {
      //     console.error('Error:', error);
      //     Alert.alert('Error', 'Failed to fetch search results for games');
      //   });

      //here igdb
      fetch(configData.connection+"/igdbapi/"+encodeURIComponent(searchQuery), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
      })
        .then(responseGames => responseGames.json())
        .then(data => {setSearchResultsGames(data); setHasSearched(true);})
        .catch(error => {
          console.error('Error:', error);
          Alert.alert('Error', 'Failed to fetch search results for games');
          setHasSearched(true);
        });
      
      //here tmdb
      fetch(configData.connection+"/tmdbapi/"+encodeURIComponent(searchQuery), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(responseMTV => responseMTV.json())
        .then(data => {setSearchResultsMTV(data); setHasSearched(true);})
        .catch(error => {
          console.error('Error:', error);
          Alert.alert('Error', 'Failed to fetch search results for movies and TV shows');
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
            <>
              {searchResultsMTV.length != 0 ? (
                <>
                  <Text>Movie / TV Show results: </Text>
                  <SearchResults data={searchResultsMTV}/>
                </>
              ) : null}
              {searchResultsGames.length != 0 ? (
                <>
                  <Text>Game results: </Text>
                  <SearchResults data={searchResultsGames}/>
                </>
              ) : (null)}
              {searchResultsMTV.length == 0 && searchResultsGames.length == 0 && hasSearched == true ? (
                <Text>No results.</Text>
              ) : (null)}
            </>
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

export default SearchPage;
