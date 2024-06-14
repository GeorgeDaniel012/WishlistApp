import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, Button, Alert, Dimensions, Modal, TouchableWithoutFeedback, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import CheckBox from 'expo-checkbox';
import configData from "../config.json";
import WishlistResults from "./WishlistResults";
import { useNavigation } from '@react-navigation/native';

const windowHeight = Dimensions.get('window').height;

const Profile = ({ route }) => {
    const [userId, setUserId] = useState(1);
    const [searchResults, setSearchResults] = useState([]);
    const [modifiedResults, setModifiedResults] = useState([]);
    const [sortOption, setSortOption] = useState('time added');
    const [statusFilter, setStatusFilter] = useState([]);
    const [typeFilter, setTypeFilter] = useState([]);
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const loadWishlist = () => {
      // Send the search query to the backend

      const url = configData.connection+"/wishlist/"+userId;
      //fetch(configData.connection+"/wishlist/"+userId, {
      // const url = configData.connection+"/wishlist/"+userId+'/sortFilter?sortOption='+sortOption+'&statusFilter='+
      //   statusFilter.join(',')+'&typeFilter='+typeFilter.join(',');

      // console.log(statusFilter);

      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(responseItems => responseItems.json())
        .then(data => {setSearchResults(data); setModifiedResults(data);})
        //.then(applySortFilter())
        .then(() => setIsLoading(false))
        .catch(error => {
            console.error('Error:', error);
            Alert.alert('Error', 'Failed to fetch wishlist items');
        });
    };

    const applySortFilter = () => {
      const sortedFilteredResults = searchResults
        .filter(result => statusFilter.length == 0 || statusFilter.includes(result.status))
        .filter(result => typeFilter.length == 0 || typeFilter.includes(result.typeOfMedia))
        .sort((a, b) => {
          if(sortOption === 'type'){
            //return a.typeOfMedia - b.typeOfMedia;
            return a.typeOfMedia.localeCompare(b.typeOfMedia)
          } else if(sortOption === 'status'){
            return a.statusId - b.statusId;
          } else {
            return a.wishlistId - b.wishlistId;
          }
        });
      //console.log(sortedFilteredResults);
      setModifiedResults(sortedFilteredResults);
    }

    const navigation = useNavigation();

    useEffect(() => {
      loadWishlist();
      // if (route.params?.settingsVisible !== undefined) {
      //   setSettingsVisible(route.params.settingsVisible);
      // }
      // navigation.setOptions({
      //   headerRight: () => {
      //     <Button onPress={() => console.log(aaaa)} title="Settings"/>
      //   }
      // })
    }, []);

    useEffect(() => {
      //console.log(modifiedResults);
      applySortFilter();
    }, [sortOption, statusFilter, typeFilter]);

    const handleSort = (sortOpt) => {
      if(sortOpt != sortOption){
        //setIsLoading(true);
      }
      setSortOption(sortOpt);
    }

    const sortBy = [
      {
        "id": 1,
        "sortBy": "time added"
      },
      {
        "id": 2,
        "sortBy": "type"
      },
      {
        "id": 3,
        "sortBy": "status"
      }
    ]

    const statusFilterBy = [
      {
        "id": 1,
        "filterName": "planning"
      },
      {
        "id": 2,
        "filterName": "watching"
      },
      {
        "id": 3,
        "filterName": "playing"
      },
      {
        "id": 4,
        "filterName": "completed"
      },
      {
        "id": 5,
        "filterName": "dropped"
      },
    ]

    const typeFilterBy = [
      {
        "id": 1,
        "filterName": "game"
      },
      {
        "id": 2,
        "filterName": "movie"
      },
      {
        "id": 3,
        "filterName": "tv"
      },
    ]
  
    return (
      <SafeAreaView style={styles.container_main}>
        <View style={styles.header}>
          <Text style={{fontSize: 18}}>Your wishlist contains:</Text>
          <Button 
            onPress={() => setSettingsVisible(true)}
            title="Settings"
          />
        </View>

        <Modal
            animationType="fade"
            transparent={true}
            visible={settingsVisible}
            onRequestClose={() => {
              setSettingsVisible(false);
              console.log("applied stuff");
              //applySortFilter();
            }}
        >
            <TouchableWithoutFeedback onPress={() => setSettingsVisible(false)}>
                <View style={styles.modalContainer}>
                    <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                    <View style={styles.modalContent}>
                      <Text style={styles.modalText}>Sort by:</Text>
                      <FlatList
                          data={sortBy}
                          keyExtractor={(item) => item.id}
                          renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => handleSort(item.sortBy)}>
                                <Text style={styles.modalItem}>{item.sortBy} {sortOption === item.sortBy && '✔️'}</Text>
                            </TouchableOpacity>
                          )}
                      />
                      <Text style={styles.modalText}>Filter by:</Text>
                      {/* Filtering by status */}
                      <Text style={styles.modalItem}>Status:</Text>
                      <FlatList
                          data={statusFilterBy}
                          keyExtractor={(item) => item.id}
                          renderItem={({ item }) => (
                            <View style={{flex: 1, flexDirection: 'row', gap: 5, justifyContent: 'center', alignItems: 'center'}}>
                              <CheckBox
                                value={statusFilter.includes(item.filterName)}
                                onValueChange={() => {
                                  const updatedFilter = statusFilter.includes(item.filterName)
                                    ? statusFilter.filter(status => status !== item.filterName)
                                    : [...statusFilter, item.filterName];
                                  console.log(updatedFilter);
                                  setStatusFilter(updatedFilter);
                                }}
                              />
                              <Text style={styles.modalItem}>{item.filterName}</Text>
                            </View>
                          )}
                      />
                      {/* Filtering by type */}
                      <Text style={styles.modalItem}>Type of media:</Text>
                      <FlatList
                          data={typeFilterBy}
                          keyExtractor={(item) => item.id}
                          renderItem={({ item }) => (
                            <View style={{flex: 1, flexDirection: 'row', gap: 5, justifyContent: 'center', alignItems: 'center'}}>
                              <CheckBox
                                value={typeFilter.includes(item.filterName)}
                                onValueChange={() => {
                                  const updatedFilter = typeFilter.includes(item.filterName)
                                    ? typeFilter.filter(status => status !== item.filterName)
                                    : [...typeFilter, item.filterName];
                                    setTypeFilter(updatedFilter);
                                }}
                              />
                              <Text style={styles.modalItem}>{item.filterName}</Text>
                            </View>
                          )}
                      />
                    </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
        
        <View style={styles.container}>
          <View style={styles.header}>
          </View>
          <View style={styles.results}>
            {isLoading ?
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
              : <WishlistResults data={modifiedResults}></WishlistResults>
            }
            {/* {searchResults.length != 0
                //? <WishlistResults data={searchResults} loadWishlist={loadWishlist}></WishlistResults>
                ? <WishlistResults data={searchResults}></WishlistResults>
                : null
              } */}
          </View>
          <View style={styles.content}>
            {/* Other content goes here */}
          </View>
        </View>
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
      //flex: 1
      paddingTop: '4%',
      paddingBottom: 0,
      margin: 0,
      alignContent: 'space-around',
      flexDirection: 'row',
      //justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 110,
    },
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
        height: Dimensions.get('window').height*0.81,
        width: Dimensions.get('window').width*0.93
      },
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalItem: {
        padding: 5,
        fontSize: 18,
        textAlign: 'center',   
    },
    modalText: {
        fontSize: 20,
        textAlign: 'center',
        padding: 10
    },
    modalClose: {
        padding: 10
    },
    radioButton: {
      flexDirection: 'row',
      alignItems: 'center',
      //marginBottom: 10,
      fontSize: 18,
    },
});

export default Profile;
