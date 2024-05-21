import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import configData from '../config.json';
import { useNavigation } from '@react-navigation/native';

const WishlistItem = (props) => {
    // const addToWishlist = async () => {
    //     try {
    //         const response = await fetch(configData.connection + '/wishlist/add', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 userId: 1,
    //                 typeOfMedia: props.object.typeOfMedia,
    //                 mediaId: props.object.id
    //             }),
    //         });
    //         if (response.ok) {
    //             console.log('Item added to wishlist successfully');
    //             // You can do something after the item is added, like showing a message
    //         } else {
    //             console.error('Error adding item to wishlist');
    //         }
    //     } catch (error) {
    //         console.error('Error adding item to wishlist:', error);
    //     }
    // };
    const navigation = useNavigation();

    const viewMedia = () => {
        navigation.navigate('MediaPage', { mediaId: props.object.id, typeOfMedia: props.object.typeOfMedia });
    };

    return (
        <TouchableOpacity onPress={viewMedia}>
            <View style={styles.result}>
                <View style={styles.textContainer}>
                    <Text>Name: {props.object.name}</Text>
                    <Text>Id: {props.object.id}</Text>
                    <Text>Media Type: {props.object.typeOfMedia}</Text>
                </View>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: props.object.imageUrl }} // Use online URL
                        style={styles.image}
                        resizeMode="cover"
                    />
                </View>
            </View>
        </TouchableOpacity>
    );
}

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
    }
});

export default WishlistItem;
