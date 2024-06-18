import React, { useState, useEffect } from 'react';
import { Text, Button, Image, View, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Alert } from 'react-native';
import * as configData from '../config.json';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyButton from './MyButton';
import { useNavigation } from '@react-navigation/native';
import { Buffer } from 'buffer';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const scaleFontSize = (size) => {
  const baseWidth = 375;
  return size * (screenWidth / baseWidth);
};

const ProfileViewOther = ( props ) => {
    const { route } = props;
    const { userId } = route.params;

    const [imageData, setImageData] = useState(null);
    const [displayName, setDisplayName] = useState(null);
    const [description, setDescription] = useState(null);
    const [isWishlistVisible, setWishlistVisible] = useState(false);

    const viewWishlist = () => {
        if(isWishlistVisible){
          navigation.navigate('ProfileWishlistOther', { userId: userId });
        }
    };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileResponse = await axios.get(configData.connection + '/userprofile/user/' + userId);
        setDisplayName(profileResponse.data.displayName);
        setDescription(profileResponse.data.description);
        setWishlistVisible(profileResponse.data.isWishlistVisible);
        const imageUrl = profileResponse.data.imageName;
        if (imageUrl !== null) {
          const filename = imageUrl.split('/').pop();
          const imageResponse = await axios.get(configData.connection + '/userprofile/' + filename, {
            responseType: 'arraybuffer',
          });
          const base64Image = Buffer.from(imageResponse.data, 'binary').toString('base64');
          setImageData(`data:image/jpeg;base64,${base64Image}`);
        }
      } catch (error) {
        console.error('Failed to fetch profile', error);
      }
    };

    fetchProfile();
  }, []);

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image
        source={imageData !== null ? { uri: imageData } : { uri: 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg' }}
        style={styles.profileImage}
      />
      <Text style={styles.nameText}>{displayName}</Text>
      <ScrollView style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>{description}</Text>
      </ScrollView>
      <View style={styles.buttonContainer}>
        {
          isWishlistVisible ?
          (<TouchableOpacity style={styles.button} onPress={viewWishlist}>
            <Text style={styles.buttonText}>View Wishlist</Text>
          </TouchableOpacity>)
          : <Text style={styles.wishlistNotVisibleText}>Wishlist is not public</Text>
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ADD8E6'
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: 40,
  },
  nameText: {
    fontSize: scaleFontSize(48),
    fontWeight: 'bold',
    marginTop: screenHeight*0.02,
  },
  descriptionContainer: {
    marginVertical: screenHeight*0.02
  },
  descriptionText: {
    fontSize: scaleFontSize(24),
    textAlign: 'center',
    marginHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: 'rgba(0, 75, 128, 50)',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: scaleFontSize(24),
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  wishlistNotVisibleText: {
    fontSize: scaleFontSize(24)
  }
});

export default ProfileViewOther;
