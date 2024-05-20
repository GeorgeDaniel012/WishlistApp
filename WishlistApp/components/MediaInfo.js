import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Image, ActivityIndicator, Button } from 'react-native';
import configData from '../config.json';

const MediaInfo = (props) => {
    const { route } = props;
    const { mediaId, typeOfMedia } = route.params;

    const [mediaInfo, setMediaInfo] = useState();
    const [isLoading, setIsLoading] = useState(true); // Add isLoading state

    useEffect(() => {
        if(typeOfMedia == "game"){
            fetch(configData.connection+"/igdbapi/id/"+encodeURIComponent(mediaId), {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                setMediaInfo(data);
                setIsLoading(false); // Set isLoading to false when fetch is completed
                console.log(data);
            })
            .catch(error => {
                console.error('Error:', error);
                Alert.alert('Error', 'Failed to fetch info for game');
            });
        } else if(typeOfMedia == "tv" || typeOfMedia == "movie") {
            fetch(configData.connection+"/tmdbapi/id/"+typeOfMedia+'/'+encodeURIComponent(mediaId), {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                setMediaInfo(data);
                setIsLoading(false); // Set isLoading to false when fetch is completed
                console.log(data);
            })
            .catch(error => {
                console.error('Error:', error);
                Alert.alert('Error', 'Failed to fetch info for game');
            });
        }
    }, []);

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
                console.log('Item added to wishlist successfully');
                // You can do something after the item is added, like showing a message
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

    if (typeOfMedia == "game") {
        return (
            <>
                <Image
                    source={{ uri: mediaInfo.imageUrl }} // Use online URL
                    style={{ width: 200, height: 200 }} // Define width and height
                    resizeMode="cover"
                />
                <Text>{mediaInfo.name}</Text>
                <Text>{mediaInfo.summary}</Text>
                <Button onPress={addToWishlist} title="Add to Wishlist"></Button>
            </>
        );
    } else if(typeOfMedia == "tv" || typeOfMedia == "movie") {
        return (
            <>
                <Image
                    source={{ uri: 'http://image.tmdb.org/t/p/original/' + mediaInfo.poster_path }} // Use online URL
                    style={{ width: 200, height: 200 }} // Define width and height
                    resizeMode="cover"
                />
                <Text>{mediaInfo.name}</Text>
                <Text>{mediaInfo.overview}</Text>
                <Button onPress={addToWishlist} title="Add to Wishlist"></Button>
            </>
        );
    }

}

export default MediaInfo;
