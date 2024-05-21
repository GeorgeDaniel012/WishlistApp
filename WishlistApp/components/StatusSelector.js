import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, Alert, Image, ActivityIndicator, Button, StyleSheet, Dimensions } from 'react-native';
import configData from '../config.json';

const StatusSelector = (props) => {
    const { id, status } = props;

    const handlePress = async () => {
        fetch(configData.connection + "/wishlist/", {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                status: status
            }),
        })
    }

    return(
        <Button onPress={handlePress}>{status}</Button>
    )
}

export default StatusSelector;