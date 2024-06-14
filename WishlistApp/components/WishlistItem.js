import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, FlatList, Button, Dimensions, Alert, TouchableWithoutFeedback } from 'react-native';
import configData from '../config.json';
import { StackActions, CommonActions, useNavigation } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const scaleFontSize = (size) => {
    const baseWidth = 375; // iPhone 8 screen width (for some reason)
    return size * (screenWidth / baseWidth);
};

const WishlistItem = (props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(props.object.status);
    console.log("name:", props.object.name, "status:", currentStatus);
    const [exists, setExists] = useState(true);

    const statuses = [
        {
            "id": 1,
            "statusName": "planning",
            "color": "#FDDA0D",
        },
        {
            "id": 2,
            "statusName": props.object.typeOfMedia === "game" ? "playing" : "watching",
            "color": "#6495ED",
        },
        {
            "id": 3,
            "statusName": "dropped",
            "color": "#D22B2B",
        },
        {
            "id": 4,
            "statusName": "completed",
            "color": "#50C878",
        }
    ];
    
    const changeStatus = (newStatus) => {
        fetch(configData.connection + "/wishlist/", {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: props.object.wishlistId,
                status: newStatus
            }),
        }).then(handleRefresh)
        .catch(error => {
            console.error('Error:', error);
            Alert.alert('Error', 'Failed to change status');
        });

        console.log(`Status changed to: ${newStatus}`);
        setCurrentStatus(newStatus);
        setModalVisible(false);
    };

    const deleteItem = () => {
        fetch(configData.connection + "/wishlist/" + props.object.wishlistId, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
        }).catch(error => {
            console.error('Error:', error);
            Alert.alert('Error', 'Failed to remove item from wishlist');
        });

        console.log(`Item ${props.object.wishlistId} deleted`);
        setExists(false);
        setModalVisible(false);
    };

    const navigation = useNavigation();

    
    const handleRefresh = () => {
        // navigation.dispatch(
        //   CommonActions.reset({
        //     index: 0,
        //     routes: [{ name: 'Profile'}],
        //   })
        // );
        navigation.dispatch(
            StackActions.replace('Wishlist')
        );
        
        navigation.navigate('Profile');
    };

    const viewMedia = () => {
        navigation.navigate('MediaPage', { mediaId: props.object.id, typeOfMedia: props.object.typeOfMedia });
    };

    return exists ? (
        <View style={styles.mainContainer}>
            <View style={styles.result}>
                <TouchableOpacity style={styles.contentContainer} onPress={viewMedia}>
                    <View style={styles.textContainer}>
                        <Text>{props.object.name}</Text>
                        <Text>Id: {props.object.id}</Text>
                        <Text>Media Type: {props.object.typeOfMedia}</Text>
                        <Text>Status: {props.object.status}</Text>
                    </View>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: props.object.imageUrl }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    </View>
                </TouchableOpacity>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                        <View style={styles.modalContainer}>
                            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                                <View style={styles.modalContent}>
                                    <Text style={styles.modalText}>Options:</Text>
                                    <TouchableOpacity onPress={deleteItem}>
                                        <Text style={styles.modalItem}>Delete Item</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.modalText}>Change Status:</Text>
                                    <FlatList
                                        data={statuses}
                                        keyExtractor={(item) => item.id}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity onPress={() => changeStatus(item.statusName)}>
                                                <Text style={[styles.modalItem, {color: item.color}]}>{item.statusName}</Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                    {/* <Button title="Close" style={styles.modalClose} onPress={() => setModalVisible(false)} /> */}
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>

            <TouchableOpacity style={styles.optionsButtonContainer} onPress={() => setModalVisible(true)}>
                <Text style={styles.optionsButton}> ⋮</Text>
            </TouchableOpacity>
        </View>
    ) : null;
};

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Ensures the button is to the far right
        alignItems: 'center',
        marginBottom: 5,
        marginTop: 5,
    },
    result: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderStyle: 'solid',
        borderRadius: 8,
        borderWidth: 3,
        borderColor: 'black',
        backgroundColor: 'white',
        padding: 5,
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        paddingRight: 5,
    },
    imageContainer: {
        flex: 1,
        position: 'relative'
    },
    image: {
        width: '100%',
        height: screenHeight * 0.17,
        maxHeight: '100%',
        borderRadius: 8
    },
    optionsButtonContainer: {
        marginLeft: 0,
        //backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 8,
    },
    optionsButton: {
        fontSize: scaleFontSize(37),
        color: 'black'
        //color: 'white',
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
    // overlay: {
    //     ...StyleSheet.absoluteFillObject,
    //     backgroundColor: 'rgba(0,0,0,0.5)', // the background color, made it semi-transparent
    //     padding: screenWidth * 0.04,
    //     justifyContent: 'flex-end',
    // },
});

export default WishlistItem;
