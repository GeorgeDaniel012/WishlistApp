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
    const [exists, setExists] = useState(true);
    
    const navigation = useNavigation();

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
            </View>
        </View>
    ) : null;
};

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
});

export default WishlistItem;
