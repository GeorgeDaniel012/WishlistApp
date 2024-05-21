import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const scaleFontSize = (size) => {
    const baseWidth = 375; // iPhone 8 screen width (for some reason)
    return size * (screenWidth / baseWidth);
};

const HomeScreen = ({ navigation, route }) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>WishlistApp</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightblue',
  },
  textContainer: {
    marginTop: screenHeight * 0.1,
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'rgba(0, 75, 128, 50)',
    fontSize: scaleFontSize(50),
    fontWeight: 'bold',
  },
});

export default HomeScreen;
