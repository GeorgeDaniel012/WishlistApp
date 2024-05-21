import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, FlatList, Button } from 'react-native';
import configData from '../config.json';
import { useNavigation } from '@react-navigation/native';

const WishlistItem = (props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(props.object.status);
    const [exists, setExists] = useState(true);

    const statuses = ["planning", "watching/playing", "dropped", "completed"];
    
    const changeStatus = (newStatus) => {
        // Function to change the status of the item
        fetch(configData.connection + "/wishlist/", {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: props.object.wishlistId,
                status: newStatus
            }),
        }).catch(error => {
            console.error('Error:', error);
            Alert.alert('Error', 'Failed to change status');
        })

        console.log(`Status changed to: ${newStatus}`);
        setCurrentStatus(newStatus);
        //props.loadWishlist();
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
        })

        console.log(`Item ${props.object.wishlistId} deleted`);
        setExists(false);
        setModalVisible(false);
    }

    const navigation = useNavigation();

    const viewMedia = () => {
        navigation.navigate('MediaPage', { mediaId: props.object.id, typeOfMedia: props.object.typeOfMedia });
    };

    return exists ? (
        <TouchableOpacity style={styles.result} onPress={viewMedia}>
            <View style={styles.textContainer}>
                <Text>Name: {props.object.name}</Text>
                <Text>Id: {props.object.id}</Text>
                <Text>Media Type: {props.object.typeOfMedia}</Text>
                <Text>Status: {currentStatus}</Text>
                {/* <Text>Wishlist id: {props.object.wishlistId} </Text> */}
            </View>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: props.object.imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={styles.optionsButton}> ⋮ </Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Options:</Text>
                        <TouchableOpacity onPress={deleteItem}>
                            <Text style={styles.modalItem}>Delete Item</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalText}>Change Status:</Text>
                        <FlatList
                            data={statuses}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => changeStatus(item)}>
                                    <Text style={styles.modalItem}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <Button title="Close" style={styles.modalClose} onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </TouchableOpacity>
    ) : <></>;
};

const styles = StyleSheet.create({
    result: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderStyle: 'solid',
        borderRadius: 15,
        borderWidth: 3,
        borderColor: 'black',
        backgroundColor: 'white',
        marginBottom: 5,
        marginTop: 5,
        padding: 5
    },
    textContainer: {
        flex: 1
    },
    imageContainer: {
        marginLeft: 10
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 40
    },
    optionsButton: {
        fontSize: 36,
        fontWeight: 'bold',
        paddingHorizontal: 10
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
    }
});

export default WishlistItem;
