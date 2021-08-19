
// Core
import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Animated, Easing, AppState } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

// Packages
import { Client, Message } from 'react-native-paho-mqtt';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import Icon from "react-native-vector-icons/Feather";
// import FontAwesome from "react-native-vector-icons/FontAwesome";
// import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import * as FileSystem from 'expo-file-system';


class Home extends Component {

  constructor(props) {
    super(props);

  }

  componentDidMount = async () => {
  }

  componentWillUnmount = () => {
  }


  render() {
      return(
        <View>
            <Text>Home</Text>
        </View>
      );
    }  
}


export default Home;
