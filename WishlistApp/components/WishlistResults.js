import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput, Button, Alert, Dimensions, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WishlistItem from './WishlistItem';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const scaleFontSize = (size) => {
    const baseWidth = 375;
    return size * (screenWidth / baseWidth);
};

const WishlistResults = (props) => {
    const resultComponents = [];
    for (let obj of props.data) {
        resultComponents.push(<Text key={String(obj.id)}>aaa</Text>);
    }

    return(
        //<ScrollView style = {styles.scrollView}>
        <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
        >
            {
                props.data.length === 0
                ? <Text style={{fontSize: scaleFontSize(18)}}>No results</Text>
                : (
                    props.data.map((obj, index) => (
                        //<WishlistItem object={obj} key={index} loadWishlist={props.loadWishlist}/>
                        <WishlistItem object={obj} key={index}/>
                    ))
                )
            }
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
})

export default WishlistResults;