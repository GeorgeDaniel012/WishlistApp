import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TextInput, Button, Alert, Dimensions, Modal, TouchableWithoutFeedback, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import CheckBox from 'expo-checkbox';
import configData from "../config.json";
import WishlistResults from "./WishlistResults";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WishlistItemOther from './WishlistItemOther';

// const windowHeight = Dimensions.get('window').height;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const scaleFontSize = (size) => {
    const baseWidth = 375;
    return size * (screenWidth / baseWidth);
};

const ProfileWishlistOther = ( props ) => {
    const [userId, setUserId] = useState(1);
    const [searchResults, setSearchResults] = useState([]);
    const [modifiedResults, setModifiedResults] = useState([]);
    const [sortOption, setSortOption] = useState('time added');
    const [statusFilter, setStatusFilter] = useState([]);
    const [typeFilter, setTypeFilter] = useState([]);
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const loadWishlist = async () => {
      const uid = props.route.params.userId;
      const url = configData.connection+"/wishlist/"+uid;

      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(responseItems => responseItems.json())
        .then(data => {setSearchResults(data); setModifiedResults(data);})
        .then(applySortFilter())
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
          <Text style={{fontSize: scaleFontSize(20), flexGrow:1}}>This wishlist contains:</Text>
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
                                  setStatusFilter(updatedFilter);
                                }}
                              />
                              <Text style={styles.modalItem}>{item.filterName}</Text>
                            </View>
                          )}
                      />
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
              : <ScrollView 
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                >
                    {
                        modifiedResults.length === 0
                        ? <Text style={{fontSize: scaleFontSize(18)}}>No results</Text>
                        : (
                            modifiedResults.map((obj, index) => (
                                <WishlistItemOther object={obj} key={index}/>
                            ))
                        )
                    }
                </ScrollView>
            }
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
      alignItems: 'center',
      flexShrink: 1,
      paddingLeft: screenWidth*0.03,
      paddingRight: screenWidth*0.03,
    },
    container: {
      flex: 1,
      width: '100%',
      justifyContent: 'flex-start',
      flexGrow: 1,
      alignItems: 'center',
      padding: '5%',
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      paddingHorizontal: 10,
      flex: 1,
      marginRight: 10,
    },
    container_main: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:  '#ADD8E6',
      height: Dimensions.get('window').height
    },
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

export default ProfileWishlistOther;
