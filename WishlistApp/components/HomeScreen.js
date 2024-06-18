import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TextInput, Button, Alert, LogBox } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "@firebase/auth";
import { initializeApp } from "@firebase/app";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig, connection } from "../config.json";
import { useNavigation } from '@react-navigation/native';
import MyButton from './MyButton';

LogBox.ignoreLogs([
  /You are initializing Firebase Auth for React Native without providing AsyncStorage\./
]);
LogBox.ignoreAllLogs();
//LogBox.ignoreLogs(['Warning: ...']);

console.disableYellowBox = true;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const scaleFontSize = (size) => {
    const baseWidth = 375;
    return size * (screenWidth / baseWidth);
};

const firebaseApp = initializeApp(firebaseConfig);

const AuthScreen = ({ email, setEmail, password, setPassword, isLogin, setIsLogin, handleAuthentication }) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title={isLogin ? 'Sign In' : 'Sign Up'} onPress={handleAuthentication} color="#3498db" />
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
        </Text>
      </View>
    </View>
  );
}

const AuthenticatedScreen = ({ user, handleAuthentication }) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.emailText}>{user.email}</Text>
      <Button title="Logout" onPress={handleAuthentication} color="#e74c3c" />
    </View>
  );
};

const HomeScreen = ({ route }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null); // Track user authentication state
  const [isLogin, setIsLogin] = useState(true);

  const auth = getAuth(firebaseApp);

  // useEffect(() => {
  //   const initializeUser = async () => {
  //     const storedUser = await retrieveUser();
  //     if (storedUser) {
  //       setUser(storedUser);
  //     }

  //     const unsubscribe = onAuthStateChanged(auth, (user) => {
  //       if (user) {
  //         setUser(user);
  //         storeUser(user); // Store user in AsyncStorage
  //       } else {
  //         setUser(null);
  //         clearUser(); // Clear user from AsyncStorage
  //       }
  //     });

  //     return () => unsubscribe();
  //   };

  //   initializeUser();
  // }, [auth]);

  const navigation = useNavigation();

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const storedUser = await retrieveUser();
        if (storedUser) {
          setUser(storedUser);
        }
  
        const currentUser = auth.currentUser;
        if (currentUser) {
          setUser(currentUser);
          storeUser(currentUser); // Store user in AsyncStorage
        }
      } catch (error) {
        console.error('Error initializing user:', error);
      }
    };
  
    initializeUser();
  
    // Cleanup function if needed (depends on your use case)
    // Since we're not subscribing here, no need to return anything
  
  }, []);

  useEffect(() => {
    async function f() {
      console.log(await AsyncStorage.getItem('@user'));
    }
    f();
  }, []);

  const storeUser = async (user) => {
    try {
      await AsyncStorage.setItem('@user', JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user:', error);
    }
  };

  const retrieveUser = async () => {
    try {
      const userString = await AsyncStorage.getItem('@user');
      if (userString !== null) {
        return JSON.parse(userString);
      }
      return null;
    } catch (error) {
      console.error('Error retrieving user:', error);
      return null;
    }
  };

  const clearUser = async () => {
    try {
      await AsyncStorage.removeItem('@user');
    } catch (error) {
      console.error('Error clearing user:', error);
    }
  };

  const handleAuthentication = async () => {
    try {
      if (user) {
        // If user is already authenticated, log out
        await signOut(auth);
        clearUser(); // Clear user from AsyncStorage
        setUser(null); // Clear user from local state
      } else {
        // Sign in or sign up
        if (isLogin) {
          // Sign in
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          setUser(userCredential.user);
          storeUser(userCredential.user); // Store user in AsyncStorage
          console.log('User signed in successfully!');
        } else {
          // Sign up
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);

          const uid = userCredential.user.uid;

          //console.log(typeof userCredential.user)

          const response = await fetch(connection + '/userprofile/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: uid
            }),
          });

          setUser(userCredential.user);
          storeUser(userCredential.user); // Store user in AsyncStorage
          console.log('User created successfully!');
        }
      }
    } catch (error) {
      //console.error('Authentication error:', error.message);
      console.log(error.message)
      if(error.message === "Firebase: Error (auth/invalid-credential)."){
        Alert.alert("Failed", "Invalid credentials.");
      }
      if(error.message === "Firebase: Error (auth/invalid-email)."){
        Alert.alert("Failed", "Invalid email.");
      }
      if(error.message ===
        "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests)."){
        Alert.alert("Failed", "Contul ti-a fost blocat. Apeleaza-l pe George.");
      }
      if(error.message === "Firebase: Error (auth/email-already-in-use)."){
        Alert.alert("Failed", "Email already in use.");
      }
      if(error.message === "Firebase: Password should be at least 6 characters (auth/weak-password)."){
        Alert.alert("Failed", "Password should be at least 6 characters long.")
      }
    }
};
  

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>WishlistApp</Text>
        <ScrollView contentContainerStyle={styles.container}>
          {user ? (
            // Show user's email if user is authenticated
            <AuthenticatedScreen user={user} handleAuthentication={handleAuthentication} />
          ) : (
            // Show sign-in or sign-up form if user is not authenticated
            <AuthScreen
              email={email}
              setEmail={setEmail}z
              password={password}
              setPassword={setPassword}
              isLogin={isLogin}
              setIsLogin={setIsLogin}
              handleAuthentication={handleAuthentication}
            />
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'lightblue',
    width: "100%"
  },
  authContainer: {
    width: 0.8*screenWidth,
    //minWidth: 300,
    //maxWidth: 400,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
    marginBottom: 0.2*screenHeight
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  toggleText: {
    color: '#3498db',
    textAlign: 'center',
  },
  bottomContainer: {
    marginTop: 20,
  },
  emailText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
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
