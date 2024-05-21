import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import configData from '../config.json';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const scaleFontSize = (size) => {
    const baseWidth = 375; // iPhone 8 screen width (for some reason)
    return size * (screenWidth / baseWidth);
};

const Result = (props) => {
    const addToWishlist = async () => {
        try {
            const response = await fetch(configData.connection + '/wishlist/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: 1,
                    typeOfMedia: props.object.typeOfMedia,
                    mediaId: props.object.id
                }),
            });
            if (response.ok) {
                console.log('Item added to wishlist successfully');
            } else {
                console.error('Error adding item to wishlist');
            }
        } catch (error) {
            console.error('Error adding item to wishlist:', error);
        }
    };

    const navigation = useNavigation();

    const viewMedia = () => {
        navigation.navigate('MediaPage', { mediaId: props.object.id, typeOfMedia: props.object.typeOfMedia });
    };

    return (
        <TouchableOpacity onPress={viewMedia}>
            <View style={styles.card}>
                <Image
                    source={{ uri: props.object.imageUrl }}
                    style={styles.cardImage}
                    resizeMode="cover"
                />
                <View style={styles.overlay}>
                    <View style={styles.cardBody}>
                        <Text numberOfLines={2} style={styles.cardTitle}>{props.object.name}</Text>
                        <Text style={styles.cardText}>Id: {props.object.id}</Text>
                        <Text style={styles.cardText}>Media Type: {props.object.typeOfMedia}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: screenWidth * 0.55,
        height: screenHeight * 0.37,
        borderRadius: 8,
        overflow: 'hidden',
        marginRight: screenWidth * 0.02,
        //marginBottom: 16,
        //elevation: 3, // shadow for Android
        //shadowColor: '#000', // shadow for iOS
        //shadowOffset: { width: 0, height: 2 },
        //shadowOpacity: 0.1,
        //shadowRadius: 8,
    },
    cardImage: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)', // the background color, made it semi-transparent
        padding: screenWidth * 0.04,
        justifyContent: 'flex-end',
    },
    cardBody: {
        marginBottom: screenHeight * 0.008,
    },
    cardTitle: {
        fontSize: scaleFontSize(16),
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: screenHeight * 0.01,
    },
    cardText: {
        fontSize: scaleFontSize(14),
        color: '#fff',
    }
});

export default Result;
