import React, { useState } from 'react';
import { Button, Image, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as configData from '../config.json';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyButton from './MyButton';
import { useNavigation } from '@react-navigation/native';

const ProfileView = () => {
    const navigation = useNavigation();

  return (
    <View>
        <MyButton title="View Wishlist" navigation={navigation} page="ProfileWishlist"/>
        <MyButton title="Change Image" navigation={navigation} page='ChangeImage'/>
    </View>
  );
};

export default ProfileView;
