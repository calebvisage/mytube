// IMPORT ///////////////////////////////////////////////////////////////////////////////////////////////////////

// Core
import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Animated, Easing, AppState, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

// Packages
import { Client, Message } from 'react-native-paho-mqtt';
import { WebView } from 'react-native-webview';
import * as WebBrowser from 'expo-web-browser';
import * as FileSystem from 'expo-file-system';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import ytdl from "react-native-ytdl"

// import Icon from "react-native-vector-icons/Feather";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import * as FileSystem from 'expo-file-system';

// IMPORT ///////////////////////////////////////////////////////////////////////////////////////////////////////


class App extends Component {

  constructor(props) {
    super(props);

    const myStorage = {
      setItem: (key, item) => {
        myStorage[key] = item;
      },
      getItem: (key) => myStorage[key],
      removeItem: (key) => {
        delete myStorage[key];
      },
    };
    const client = new Client({ uri: 'ws://165.255.250.172:9001/', clientId: 'clientId', storage: myStorage});
    this.client = client;

    this.state = {
      youtubeURL: '',
      mqttclient: 'ws://165.255.250.172:9001/',
      // serverUrl: 'https://smart-automation.co.za/',
      mqttTopicAudio: 'utube/nullsploit/audio',
      mqttTopicVideo: 'utube/username/video',
      mqttState: false,
      nickname: '',
      downloadFormat: 'audio',
      btnDownload: false,
      downloadLocation: 'server',
      topic: 'utube/',
      webviewVisible: false,
  }
}

  
  componentDidMount = () => {
    this.initMqtt();
  }


  componentWillUnmount = async () => {
    this.client.disconnect();
    this.styles = styles;
  }


  attemptReconnect = () => {
    if(!this.client.isConnected()) {
      console.log("ATTEMPTING RECONNECT...");

      setTimeout(() => {
        this.client.connect({userName: 'nullsploit', password: 'hacked'})
        .then(() => {
          // Once a connection has been made, make a subscription and send a message.
          this.setMqttState(this.client.isConnected());
          // console.log('onConnect');
          console.log('MQTT Connected');
          return this.client.subscribe(this.state.topic);
        })
        .catch((responseObject) => {
          if (responseObject.errorCode !== 0) {
            console.log('onConnectionLost:' + responseObject.errorMessage);
          }
        });
      },1000)

    }
  }


  initMqtt = () => {

    this.client.on('connectionLost', (responseObject) => {
      if (responseObject.errorCode !== 0) {
        console.log(responseObject.errorMessage);
        this.setMqttState(this.client.isConnected());
        this.attemptReconnect();
      }
    });


    this.client.on('messageReceived', (message) => {
      console.log(message.destinationName+": "+message.payloadString);
    });


     
    this.client.connect({userName: 'admin', password: 'hacked'})
      .then(() => {
        this.setMqttState(this.client.isConnected());
        console.log('MQTT Connected');
        return this.client.subscribe(this.state.topic);
      })
      .catch((responseObject) => {
        if (responseObject.errorCode !== 0) {
          console.log('onConnectionLost:' + responseObject.errorMessage);
        }
      });
  }


  setMqttState = (newState) => {
    this.setState({mqttState: newState});
  }


  sendMqtt = (topic, payload) => {
    var message = new Message(payload);
    message.destinationName = topic;
    this.client.send(message);
    console.log(message)
  }


  // renderPreview = () => {
  //   <View>
      
  //   </View>
  // }

  renderFormatButtons = () => {
    return (
      <View style={styles.btnDownloadRow}>
      <TouchableOpacity onPress={() => this.setDownloadMode('video')} style={[this.state.downloadFormat === 'video' ? {backgroundColor: '#c91c0e'} : {borderColor: '#aaa', borderWidth: 1}, styles.btnFormat]}>
        <Text style={this.state.downloadFormat === 'video' ? {color: '#fff'} : {color: '#aaa'}}>Video</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => this.setDownloadMode('audio')} style={[this.state.downloadFormat === 'audio' ? {backgroundColor: '#c91c0e'} : {borderColor: '#aaa', borderWidth: 1}, styles.btnFormat]}>
        <Text style={this.state.downloadFormat === 'audio' ? {color: '#fff'} : {color: '#aaa'}}>Audio</Text>
      </TouchableOpacity>
      </View>
    )
  }

  renderLocationButtons = () => {
    return (
      <View style={styles.btnDownloadRow}>
      <TouchableOpacity onPress={() => this.setDownloadLocation('server')} style={[this.state.downloadLocation === 'server' ? {backgroundColor: '#c91c0e'} : {borderColor: '#aaa', borderWidth: 1}, styles.btnFormat]}>
        <Text style={this.state.downloadLocation === 'server' ? {color: '#fff'} : {color: '#aaa'}}>Server</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => this.setDownloadLocation('local')} style={[this.state.downloadLocation === 'local' ? {backgroundColor: '#c91c0e'} : {borderColor: '#aaa', borderWidth: 1}, styles.btnFormat]}>
        <Text style={this.state.downloadLocation === 'local' ? {color: '#fff'} : {color: '#aaa'}}>Local</Text>
      </TouchableOpacity>
      </View>
    )
  }


  // doLocalDownload = async (urls) => {
  //   const callback = downloadProgress => {
  //     const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
  //     this.setState({
  //       downloadProgress: progress,
  //     });
  //   };
    
  //   let downloadResumable = FileSystem.createDownloadResumable(
  //     urls,
  //     FileSystem.documentDirectory + 'small.mp4',
  //     {},
  //     callback
  //   );
    
  //   try {
  //     const { uri } = await downloadResumable.downloadAsync();
  //     console.log('Finished downloading to ', uri);
  //   } catch (e) {
  //     console.error(e);
  //   }
    
  //   try {
  //     await downloadResumable.pauseAsync();
  //     console.log('Paused download operation, saving for future retrieval');
  //     AsyncStorage.setItem('pausedDownload', JSON.stringify(downloadResumable.savable()));
  //   } catch (e) {
  //     console.error(e);
  //   }
    
  //   try {
  //     const { uri } = await downloadResumable.resumeAsync();
  //     console.log('Finished downloading to ', uri);
  //   } catch (e) {
  //     console.error(e);
  //   }
    
  //   //To resume a download across app restarts, assuming the the DownloadResumable.savable() object was stored:
  //   const downloadSnapshotJson = await AsyncStorage.getItem('pausedDownload');
  //   const downloadSnapshot = JSON.parse(downloadSnapshotJson);
  //   const downloadResumable = new FileSystem.DownloadResumable(
  //     downloadSnapshot.url,
  //     downloadSnapshot.fileUri,
  //     downloadSnapshot.options,
  //     callback,
  //     downloadSnapshot.resumeData
  //   );
    
  //   try {
  //     const { uri } = await downloadResumable.resumeAsync();
  //     console.log('Finished downloading to ', uri);
  //   } catch (e) {
  //     console.error(e);
  //   }
    
  // }

  // renderWebView = () => {
  //   if (this.state.webviewVisible === true) {
  //     return (
  //       <WebView 
  //         style={{flex: 1, height: '100%', width: '100%'}}
  //         source={{ uri: 'https://www.google.com' }}
  //       />
  //     );
  //   }
  // }
  
  doLocalDownload = async (urls) => {
    // const url = JSON.stringify(urls);
    let obj = urls;
    let newURL = obj[0];
    let thisURL = newURL.url;
    console.log(thisURL);
    let result = await WebBrowser.openBrowserAsync(thisURL);
    setResult(result);
    // this.setState({webviewVisible: true})
  }

  doDownload = async () => {
    if (this.state.downloadLocation === 'server') {
      let topic = this.state.topic+'starsailor'+this.state.downloadFormat;
      let payload = this.state.youtubeURL;
      this.sendMqtt(topic, payload);
      console.log(topic+payload);
    }
    else {
      console.log('downloading locally...');
      let youtubeURL = this.state.youtubeURL;
      let urls = await ytdl(youtubeURL, { quality: 'highestaudio' });
      this.doLocalDownload(urls);
    }
  }


  renderDownloadButton = () => {
    if (this.state.downloadFormat && this.state.youtubeURL) {
      return (
        <View>
          <TouchableOpacity style={{borderRadius: 4, backgroundColor: '#c91c0e', margin: 32, paddingHorizontal: 64, paddingVertical: 8}}>
            <Text onPress={() => this.doDownload()} style={{color: '#eee', textAlign: 'center'}}>Download</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  setDownloadMode = (mode) => {
    this.setState({downloadFormat: mode});
  }

  setDownloadLocation = (location) => {
    this.setState({downloadLocation: location});
  }

  setURL = (url) => {
    this.setState({youtubeURL: url})
  }

  setUsername = (username) => {
    this.setState({userName: username})
  }

  mqttIndicator() {
    if(this.state.mqttState) {
      return(
          <MaterialCommunityIcons style={styles.mqttIndicatorGreen} name='compare-vertical' />
      );
    }
    else{
      return(
          <MaterialCommunityIcons style={styles.mqttIndicatorRed} name='compare-vertical' />
      );
    }
  }


  renderContent = () => {
    if (this.state.webviewVisible === true) {
      return (
        <WebView 
          style={{height: '100%', width: '100%', overflow:'hidden'}}
          source={{ uri: 'https://www.google.com' }}
        />
      );
    }
    else {
      return (
        <View>
            <StatusBar translucent style={'light'} backgroundColor={'#143143'} color={'#fff'} animated={true}/> 
            <SafeAreaView>

              {/* Download Webview */}
              {/* {this.renderWebView()} */}

              {/* Topbar */}
              <View style={[this.state.mqttState ? {borderColor: '#0ec97b'} : {borderColor: '#c91c0e'}, styles.topbar]}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <TouchableOpacity>
                    <SimpleLineIcons name={'menu'} style={{color: '#ddd', marginRight: 16, fontSize: 16}}/>
                  </TouchableOpacity>
                  <Text style={styles.txtBrand}><Text style={{color: '#c91c0e'}}>Utube</Text> Downloader</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.txtTopbarUsername}>username</Text>
                  <FontAwesome name={'user-circle'} style={styles.iconTopbarUser}/>
                </View>
              </View>

              {/* Body */}
              <View style={styles.container}>
                {/* {this.renderPreview()} */}
                <View style={{marginHorizontal: 24, marginVertical: 16}}>
                  <Text style={{color: '#ddd', marginVertical: 8}}>Username</Text>
                  <TextInput value={this.state.userName} onChangeText={username => this.setUsername(username)} autoCapitalize='none' selectionColor={'red'} style={{borderWidth: 1, borderRadius: 32, borderColor: '#c91c0e', color: '#ddd', paddingHorizontal: 16, paddingVertical: 4}} />
                </View>
                <View style={{marginHorizontal: 24, marginVertical: 16}}>
                  <Text style={{color: '#ddd', marginVertical: 8}}>Enter URL</Text>
                  <TextInput value={this.state.youtubeURL} onChangeText={url => this.setURL(url)} autoCapitalize='none' selectionColor={'red'} style={{borderWidth: 1, borderRadius: 32, borderColor: '#c91c0e', color: '#ddd', paddingHorizontal: 16, paddingVertical: 4}} />
                </View>
                {this.renderFormatButtons()}
                {this.renderLocationButtons()}
                {this.renderDownloadButton()}
              </View>
              
            </SafeAreaView>
          </View>
      )
    }
  }


  // RENDER ////////////////////////////////////////////////////////////////////////////////////////////////////////

  render() {
      return(
        <View>
          {this.renderContent()}
        </View>
      );
    }  
}

// RENDER ////////////////////////////////////////////////////////////////////////////////////////////////////////




// STYLESHEET ////////////////////////////////////////////////////////////////////////////////////////////////////

  const styles = StyleSheet.create({
    container: {
      // flex: 1,
      // justifyContent: 'center',
      backgroundColor: '#132132',
      height: '100%',
    },
    topbar: {
      // alignContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#143143',
      borderBottomWidth: 1,
      elevation: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      paddingVertical: 12,
      shadowColor: '#000',
      shadowOpacity: 1,
      shadowRadius: 1,
      width: '100%'
    },
    txtTopbarUsername: {
      color: '#ddd',
      marginRight: 8
    },
    iconTopbarUser: {
      color: '#ddd',
      fontSize: 24
    },
    btnFormat: {
      paddingHorizontal: 24, 
      paddingVertical: 8, 
      // backgroundColor: '#c91c0e', 
      borderRadius: 24
    },
    btnDownloadRow: {
      borderRadius: 24,
      // borderWidth: 1,
      // borderColor: '#666',
      justifyContent: 'space-around',
      flexDirection: 'row',
      margin: 16,
    },
    txtBrand: {
      color: '#ddd',
      fontSize: 16,
      fontWeight: 'bold'
    },
    mqttIndicatorGreen: {
      color: '#1fff5f', 
      fontSize: 24,
      marginRight: 8, 
      textShadowColor: 'rgba(31,255,95,0.88)', 
      textShadowOffset: {width: 0, height: 0}, 
      textShadowRadius: 5
    },
    mqttIndicatorRed: {
      color: '#c91c0e', 
      fontSize: 24,
      marginRight: 8, 
      textShadowColor: '#c91c0e', 
      textShadowOffset: {width: 0, height: 0}, 
      textShadowRadius: 5
    },
  });

// STYLESHEET ////////////////////////////////////////////////////////////////////////////////////////////////////


export default App;
