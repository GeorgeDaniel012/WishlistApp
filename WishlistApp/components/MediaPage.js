import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, Alert, Image, ActivityIndicator, Button, StyleSheet, Dimensions } from 'react-native';
import configData from '../config.json';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const scaleFontSize = (size) => {
    const baseWidth = 375; // iPhone 8 screen width (for some reason)
    return size * (screenWidth / baseWidth);
};

const MediaPage = (props) => {
    const { route } = props;
    const { mediaId, typeOfMedia } = route.params;

    const [mediaInfo, setMediaInfo] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response;
                if (typeOfMedia === "game") {
                    response = await fetch(configData.connection + "/igdbapi/id/" + encodeURIComponent(mediaId), {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                } else if (typeOfMedia === "tv" || typeOfMedia === "movie") {
                    response = await fetch(configData.connection + "/tmdbapi/id/" + typeOfMedia + '/' + encodeURIComponent(mediaId), {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                }
                const data = await response.json();
                setMediaInfo(data);
                setIsLoading(false); // setting isLoading to false when fetch is completed
                console.log(data);
            } catch (error) {
                console.error('Error:', error);
                Alert.alert('Error', 'Failed to fetch info');
            }
        };

        fetchData();
    }, [mediaId, typeOfMedia]);

    const addToWishlist = async () => {
        try {
            const response = await fetch(configData.connection + '/wishlist/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: 1,
                    typeOfMedia: typeOfMedia,
                    mediaId: mediaId
                }),
            });
            if (response.ok) {
                Alert.alert('Success', `Item added to wishlist successfully`);
                console.log('Item added to wishlist successfully');
                // we should let the user know as well that an item was added
            } else if(response.status === 400){
                console.log('Item is already in the wishlist');
                Alert.alert('Error', 'Item is already in the wishlist');
            } else {
                console.error('Error adding item to wishlist');
            }
        } catch (error) {
            console.error('Error adding item to wishlist:', error);
        }
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View contentContainerStyle={styles.container}>
            {typeOfMedia === "game" && (
                <>
                    {/* <Image
                        source={{ uri: mediaInfo.imageUrl }} // Use online URL
                        style={{ width: 200, height: 200 }} // Define width and height
                        resizeMode="cover"
                    />
                    <Text>{mediaInfo.name}</Text>
                    <Text>{mediaInfo.summary}</Text>
                    <Button onPress={addToWishlist} title="Add to Wishlist"></Button> */}
                    <View>
                        <Image
                            source={{ uri: mediaInfo.imageUrl}}
                            style={styles.image}
                            resizeMode="cover"
                        />
                        <View style={styles.overlay}>
                            <Text style={styles.title}>{mediaInfo.name}</Text>
                            <ScrollView>
                                <Text style={styles.description}>{mediaInfo.summary}</Text>
                            </ScrollView>
                            <View style={styles.buttonContainer}>
                                <Button onPress={addToWishlist} title="Add to Wishlist"/>
                            </View>
                        </View>
                    </View>
                </>
            )}
            {(typeOfMedia === "tv" || typeOfMedia === "movie") && (
                <>
                    {/* <View style={styles.innerContainer}>
                        <Image
                            source={{ uri: 'http://image.tmdb.org/t/p/original/' + mediaInfo.poster_path }} // Use online URL
                            style={styles.image} // Define width and height
                        />
                        <Text>{mediaInfo.name}</Text>
                        <Text>{mediaInfo.overview}</Text>
                        <Button onPress={addToWishlist} title="Add to Wishlist"></Button>
                    </View> */}
                    <View>
                        <Image
                            source={{ uri: 'http://image.tmdb.org/t/p/original/' + mediaInfo.poster_path }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                        <View style={styles.overlay}>
                            <Text style={styles.title}>{mediaInfo.name || mediaInfo.title}</Text>
                            <ScrollView>
                                <Text style={styles.description}>{mediaInfo.overview}</Text>
                            </ScrollView>
                            <View style={styles.buttonContainer}>
                                <Button onPress={addToWishlist} title="Add to Wishlist"/>
                            </View>
                        </View>
                    </View>
            </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: 'light blue',
    },
    image: {
        width: screenWidth,
        height: screenHeight,
    },
    overlay: {
        position: 'absolute',
        bottom: '6%', // careful so the button isn't pushed out of the screen
        //left: 0,
        width: screenWidth,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: screenWidth * 0.05,
        maxHeight: '60%',
    },
    title: {
        fontSize: scaleFontSize(25),
        fontWeight: 'bold',
        color: 'white',
        marginBottom: screenHeight * 0.005,
    },
    description: {
        fontSize: scaleFontSize(16),
        color: 'white',
        marginBottom: screenHeight * 0.01,
    },
    buttonContainer: {
        alignSelf: 'stretch',
        marginTop: screenHeight * 0.01,
    }
});

export default MediaPage;
