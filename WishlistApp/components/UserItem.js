import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import configData from '../config.json';
import { useNavigation } from '@react-navigation/native';
import { Buffer } from 'buffer';
import axios from 'axios';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const scaleFontSize = (size) => {
    const baseWidth = 375; // iPhone 8 screen width (for some reason)
    return size * (screenWidth / baseWidth);
};

const UserItem = (props) => {
    const [imageData, setImageData] = useState(null);

    const navigation = useNavigation();

    const fetchProfilePicture = async (userId) => {
        let returnVal = null;
        try {
            const profileResponse = await axios.get(configData.connection + '/userprofile/user/' + userId);

            const imageUrl = profileResponse.data.imageName;
            if (imageUrl !== null) {
              const filename = imageUrl.split('/').pop();
              const imageResponse = await axios.get(configData.connection + '/userprofile/' + filename, {
                responseType: 'arraybuffer',
              });
              const base64Image = Buffer.from(imageResponse.data, 'binary').toString('base64');
              setImageData(`data:image/jpeg;base64,${base64Image}`);
              //returnVal = `data:image/jpeg;base64,${base64Image}`;
              //return returnVal;
            }
        } catch (error) {
            console.error('Failed to fetch profile picture', error);
        }
    }

    useEffect(() => {
        fetchProfilePicture(props.object.userId);
    }, []);

    const viewProfile = () => {
        navigation.navigate('ProfileViewOther', { userId: props.object.userId });
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.result}>
                <TouchableOpacity style={styles.contentContainer} onPress={viewProfile}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={imageData !== null 
                                ? { uri: imageData } 
                                : { uri: 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg' }
                            }
                            //source={{ uri: fetchProfilePicture(props.object.userId) }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.displayName}>{props.object.displayName}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    displayName: {
        fontSize: scaleFontSize(28),
        textAlign: 'center',
        fontWeight: 'bold',
    },
    imageContainer: {
        flex: 1,
        position: 'relative',
    },
    image: {
        width: screenHeight * 0.185,
        height: screenHeight * 0.185,
        maxHeight: '100%',
        borderRadius: 100,
    },
});

export default UserItem;
