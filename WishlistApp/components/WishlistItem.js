import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, FlatList, Button } from 'react-native';
import configData from '../config.json';
import { useNavigation } from '@react-navigation/native';

const WishlistItem = (props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(props.object.status);

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
        })

        console.log(`Status changed to: ${newStatus}`);
        setCurrentStatus(newStatus);
        //props.loadWishlist();
        // You can add more logic here to handle the status change, e.g., API call
        setModalVisible(false);
    };

    const navigation = useNavigation();

    const viewMedia = () => {
        navigation.navigate('MediaPage', { mediaId: props.object.id, typeOfMedia: props.object.typeOfMedia });
    };

    return (
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
                    source={{ uri: props.object.imageUrl }} // Use online URL
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
                        <FlatList
                            data={statuses}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => changeStatus(item)}>
                                    <Text style={styles.modalItem}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <Button title="Close" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </TouchableOpacity>
    );
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
        width: 80, // Adjust image width
        height: 80, // Adjust image height
        borderRadius: 40 // Makes it circular
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
        padding: 10,
        fontSize: 18,
        textAlign: 'center',
    }
});

export default WishlistItem;
