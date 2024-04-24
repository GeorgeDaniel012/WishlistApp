import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, Button, Alert, Dimensions } from 'react-native';

const Result = (props) => {
    return(
        <View style={styles.result}>
            <Text>Name: {props.object.name}</Text>
            <Text>Id: {props.object.id}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    result: {
        borderStyle: 'solid',
        borderRadius: 2,
        borderWidth: 3,
        borderColor: 'black',
        backgroundColor: 'white',
        marginBottom: 5,
        marginTop: 5,
        padding: 5
    }
})

export default Result;