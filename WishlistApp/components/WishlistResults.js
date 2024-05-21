import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput, Button, Alert, Dimensions, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WishlistItem from './WishlistItem';

const WishlistResults = (props) => {
    const resultComponents = [];
    for (let obj of props.data) {
        resultComponents.push(<Text key={String(obj.id)}>aaa</Text>);
    }

    return(
        //<ScrollView style = {styles.scrollView}>
        <ScrollView 
            style={styles.scrollView}
        >
            {/* <Text>{props.data.length}</Text> */}
            {/* <FlatList 
                style={styles.scrollView}
                data={props.data} // Pass the array as data prop
                keyExtractor={(item) => item.id} // Key extractor function
                renderItem={({ item }) => {
                    console.log(item);
                    return(
                    <Result object={item} key={item.id}/>
                );}}
            /> */}
            {
                props.data.map((obj, index) => (
                    <WishlistItem object={obj} key={index}/>
                ))
            }
            {/* <Result object={props.data[0]}/> */}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: 'transparent',
        flex: 1,
        width: '100%',
        height: 'auto',
        flexGrow: 1,
        
    },
    // container: {
    //     flex: 1,
    //     flexDirection: 'row-reverse'
    // }
})

export default WishlistResults;