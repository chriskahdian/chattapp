import React, { Component } from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import '@firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';


const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends Component {

    constructor() {
        super();
        this.state = {
            messages: [],
            user: {
                _id: '',
                name: '',
                avatar: '',
                createdAt: ''
            },
            isConnected: false
        }
        if (!firebase.apps.length) {
            firebase.initializeApp({
              apiKey: "AIzaSyBZ6eS7PHX10wtY3BjOIFAgxQr_V8pn9-w",
              authDomain: "test-bbeef.firebaseapp.com",
              projectId: "test-bbeef",
              storageBucket: "test-bbeef.appspot.com",
              messagingSenderId: "633550727322",
              appId: "1:633550727322:web:303a9ca8441e1c80805723",
              measurementId: "G-K2F3ZS2MKN"
            });
        }
    }

    componentDidMount() {
        const name = this.props.route.params.name;
        this.props.navigation.setOptions({ title: name });
        NetInfo.fetch().then(connection => {
            if (connection.isConnected) {
                console.log('online');
                this.setState({
                    isConnected: true
                });

                this.referenceChatMessages = firebase.firestore().collection("messages");

                this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
                    if (!user) {
                        firebase.auth().signInAnonymously();
                    }
                    this.setState({
                        user: {
                            _id: user.uid,
                            name: name,
                            avatar: "https://placeimg.com/140/140/any",
                            createdAt: new Date()
                        },
                        messages: [],
                    });

                    this.unsubscribe = this.referenceChatMessages
                        .orderBy("createdAt", "desc")
                        .onSnapshot(this.onCollectionUpdate);

                });
                
            } else {
                console.log('offline');
                this.setState({
                    isConnected: false
                });
                this.getMessages();
                window.alert('You are offline and won\'t be able to send messages until you are online');
            }
        });

    }

    async getMessages() {
        let messages = '';
        try {
            messages = await AsyncStorage.getItem('messages') || [];
            this.setState({
                messages: JSON.parse(messages)
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    async saveMessages() {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
        } catch (error) {
            console.log(error.message);
        }
    }

    async deleteMessages() {
        try {
            await AsyncStorage.removeItem('messages');
            this.setState({
                messages: []
            })
        } catch (error) {
            console.log(error.message);
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
        this.authUnsubscribe();
    }

    onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        querySnapshot.forEach((doc) => {
            var data = doc.data();
            messages.push({
                _id: data._id,
                text: data.text,
                createdAt: data.createdAt.toDate(),
                user: {
                    _id: data.user._id,
                    name: data.user.name,
                    avatar: data.user.avatar,
                },
                image: data.image || null,
                location: data.location || null,
            });
        });
        this.setState({
            messages,
        });
    }

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }),
            () => {
                this.addMessage();
                this.saveMessages();
            });
    }

    addMessage() {
        const message = this.state.messages[0];
        this.referenceChatMessages.add({
            _id: message._id,
            text: message.text || '',
            createdAt: message.createdAt,
            user: message.user,
            image: message.image || null,
            location: message.location || null,
        });
        console.log('Message added to firestore');
    }

    renderBubble(props) {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: 'darkgray'
                    }
                }}
            />
        )
    }

    renderInputToolbar(props) {
        if (this.state.isConnected == false) {
        } else {
            return (
                <InputToolbar {...props} />
            );
        }
    }

    renderCustomActions = (props) => {
        return <CustomActions {...props} />;
    };
    
    // EXAMPLE
    renderCustomView(props) {
        const { currentMessage } = props;
        if (currentMessage.location) {
          return (
            <MapView
              style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
              region={{
                latitude: currentMessage.location.latitude,
                longitude: currentMessage.location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            />
          );
        }
        return null;
      }

    // renderCustomView(props) {
    //     const { currentMessage } = props;
    //     if (currentMessage.location) {
    //         return (
    //             <MapView
    //                 style={{
    //                     width: 250,
    //                     height: 200,
    //                     borderRadius: 13,
    //                     margin: 3
    //                 }}
    //                 initialRegion={{
    //                     latitude: currentMessage.location.latitude,
    //                     longitude: currentMessage.location.longitude,
    //                     latitudeDelta: 0.0922,
    //                     longitudeDelta: 0.0421
    //                 }}
    //             />
    //         );
    //     }
    //     return null;
    // }

    render() {
        let color = this.props.route.params.color;

        return (
            <View style={{ flex: 1, backgroundColor: color }}>

                <GiftedChat
                    renderBubble={this.renderBubble.bind(this)}
                    renderInputToolbar={this.renderInputToolbar.bind(this)}
                    renderActions={this.renderCustomActions}
                    renderCustomView={this.renderCustomView}
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={this.state.user}
                />

                { Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' /> : null}

            </View>
        )
    }
}







// import React from 'react';
// import { View, Text, Platform, KeyboardAvoidingView } from 'react-native';
// import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
// import AsyncStorage from '@react-native-community/async-storage';
// import NetInfo from '@react-native-community/netinfo';
// import CustomActions from './CustomActions';
// import MapView from 'react-native-maps';

// const firebase = require('firebase');
// require('firebase/firestore');


// export default class Chat extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       messages: [],
//       user: {
//           _id: '',
//           name: '',
//           avatar: '',
//           createdAt: ''
//       },
//       isConnected: false
//     }
//     const firebaseConfig = {
//       apiKey: "AIzaSyBZ6eS7PHX10wtY3BjOIFAgxQr_V8pn9-w",
//       authDomain: "test-bbeef.firebaseapp.com",
//       projectId: "test-bbeef",
//       storageBucket: "test-bbeef.appspot.com",
//       messagingSenderId: "633550727322",
//       appId: "1:633550727322:web:303a9ca8441e1c80805723",
//       measurementId: "G-K2F3ZS2MKN"
//     }
//     if (!firebase.apps.length) {
//       firebase.initializeApp(firebaseConfig);
//     }
//   }

//   async saveMessages() {
//     try {
//       await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
//     } catch (error) {
//       console.log(error.message);
//     }
//   }

//   async getMessages() {
//     let messages = '';
//     try {
//       messages = await AsyncStorage.getItem('messages') || [];
//       this.setState({
//         messages: JSON.parse(messages)
//       });
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   async deleteMessages() {
//     try {
//       await AsyncStorage.removeItem('messages');
//       this.setState({
//         messages: []
//       })
//     } catch (error) {
//       console.log(error.message);
//     }
//   }

//   componentDidMount() {
//     let name = this.props.route.params.name;
//     NetInfo.fetch().then(connection => {
//       if (connection.isConnected) {
//         console.log('online');
//         this.setState({
//           isConnected: true
//         });
//         this.referenceChatMessages = firebase.firestore().collection("messages");
//         this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
//           if (!user) {
//             firebase.auth().signInAnonymously();
//           }
//           this.setState({
//             user: {
//               _id: user.uid,
//               name: name,
//               avatar: "https://placeimg.com/140/140/any",
//               createdAt: new Date()
//             },
//             messages: [],
//           });
//           this.unsubscribe = this.referenceChatMessages
//             .orderBy("createdAt", "desc")
//             .onSnapshot(this.onCollectionUpdate);
//         });
//       } else {
//         console.log('offline');
//         this.setState({
//           isConnected: false
//         });
//         this.getMessages();
//         window.alert('You are offline and won\'t be able to send messages until you are online');
//       }
//     });
//   }

//   onSend(messages = []) {
//     this.setState(previousState => ({
//       messages: GiftedChat.append(previousState.messages, messages),
//     }),
//       () => {
//         this.addMessage();
//         this.saveMessages();
//       });
//   }

//   renderBubble(props) {
//     return (
//       <Bubble
//         {...props}
//         wrapperStyle={{
//           right: {
//             backgroundColor: '#000'
//           }
//         }}
//       />
//     )
//   }

//   componentWillUnmount() {
//     this.unsubscribe();
//     this.authUnsubscribe();
//   }

//   onCollectionUpdate = (querySnapshot) => {
//     const messages = [];
//     querySnapshot.forEach((doc) => {
//       var data = doc.data();
//       messages.push({
//         _id: data._id,
//         text: data.text,
//         createdAt: data.createdAt.toDate(),
//         user: {
//           _id: data.user._id,
//           name: data.user.name,
//           avatar: data.user.avatar,
//         },
//         image: data.image || null,
//         location: data.location || null,
//       });
//     });
//     this.setState({
//       messages,
//     });
//   }

//   addMessage() {
//     const message = this.state.messages[0];
//     this.referenceChatMessages.add({
//       _id: message._id,
//       text: message.text || '',
//       createdAt: message.createdAt,
//       user: message.user,
//       image: message.image || null,
//       location: message.location || null,
//     });
//   }

//   renderInputToolbar(props) {
//     if (this.state.isConnected == false) {
//     } else {
//       return (
//         <InputToolbar
//           {...props}
//         />
//       );
//     }
//   }

//   renderCustomActions = (props) => {
//     return <CustomActions {...props} />;
//   };

//   renderCustomView(props) {
//     const { currentMessage } = props;
//     if (currentMessage.location) {
//       return (
//         <MapView
//           style={{ width: 300, height: 200 }}
//           region={{
//             // from example:
//             // latitude: currentMessage.coords.latitude,
//             // longitude: currentMessage.coords.longitude,
//             // from text:
//             latitude: this.state.location.coords.latitude,
//             longitude: this.state.location.coords.longitude,
//             // no "coords"
//             // latitude: this.state.location.latitude,
//             // longitude: this.state.location.longitude,
//             latitudeDelta: 0.0922,
//             longitudeDelta: 0.0421,
//           }}
//         />
//       );
//     }
//     return null;
//   }

//   render() {
//     let name = this.props.route.params.name;
//     this.props.navigation.setOptions({ title: name });
//     let color = this.props.route.params.color;
//     return (
//       <View style={{ flex: 1, backgroundColor: color }}>
//         <GiftedChat
//           renderBubble={this.renderBubble.bind(this)}
//           renderInputToolbar={this.renderInputToolbar.bind(this)}
//           renderActions={this.renderCustomActions}
//           renderCustomView={this.renderCustomView}
//           messages={this.state.messages}
//           onSend={messages => this.onSend(messages)}
//           // user={{ _id: 1, }}
//           // TREVOR'S:
//           user={this.state.user}
//         />
//         { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
//         }
//       </View>
//     )
//   }

// }










// import React from 'react';
// import { View, Text, Platform, KeyboardAvoidingView } from 'react-native';
// import { GiftedChat, Bubble } from 'react-native-gifted-chat';
// import AsyncStorage from '@react-native-community/async-storage';
// const firebase = require('firebase');
// require('firebase/firestore');


// export default class Chat extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       messages: [],
//     }
//     const firebaseConfig = {
//       apiKey: "AIzaSyBZ6eS7PHX10wtY3BjOIFAgxQr_V8pn9-w",
//       authDomain: "test-bbeef.firebaseapp.com",
//       projectId: "test-bbeef",
//       storageBucket: "test-bbeef.appspot.com",
//       messagingSenderId: "633550727322",
//       appId: "1:633550727322:web:303a9ca8441e1c80805723",
//       measurementId: "G-K2F3ZS2MKN"
//     }
//     if (!firebase.apps.length) {
//       firebase.initializeApp(firebaseConfig);
//     }
//   }

//   componentDidMount() {
//     let name = this.props.route.params.name;
//     this.referenceChatMessages = firebase.firestore().collection("messages");
//     this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
//       if (!user) {
//         firebase.auth().signInAnonymously();
//       }
//       this.setState({
//         user: {
//           _id: user.uid,
//           name: name,
//           avatar: "https://placeimg.com/140/140/any",
//           createdAt: new Date()
//         },
//         messages: [],
//       });
//       this.unsubscribe = this.referenceChatMessages
//         .orderBy("createdAt", "desc")
//         .onSnapshot(this.onCollectionUpdate);
//     });
//     this.setState({
//       messages: [
//         {
//           _id: 1,
//           text: 'Hello developer',
//           createdAt: new Date(),
//           user: {
//             _id: 2,
//             name: 'React Native',
//             avatar: 'https://placeimg.com/140/140/any',
//           },
//         },
//         {
//           _id: 2,
//           text: name + ' has entered this chat',
//           createdAt: new Date(),
//           system: true,
//         },
//       ],
//     })
//   }

//   componentWillUnmount() {
//     this.unsubscribe();
//     this.authUnsubscribe();
//   }

//   onCollectionUpdate = (querySnapshot) => {
//     const messages = [];
//     querySnapshot.forEach((doc) => {
//       var data = doc.data();
//       messages.push({
//         _id: data._id,
//         text: data.text,
//         createdAt: data.createdAt.toDate(),
//         user: {
//           _id: data.user._id,
//           name: data.user.name,
//           avatar: data.user.avatar,
//         },
//         // image: data.image || null,
//         // location: data.location || null,
//       });
//     });
//     this.setState({
//       messages,
//     });
//   }

//   onSend(messages = []) {
//     this.setState(previousState => ({
//       messages: GiftedChat.append(previousState.messages, messages),
//     }),
//       () => {
//         this.addMessage();
//         // this.saveMessages();
//       });
//   }

//   addMessage() {
//     const message = this.state.messages[0];
//     this.referenceChatMessages.add({
//       _id: message._id,
//       text: message.text || '',
//       createdAt: message.createdAt,
//       user: message.user,
//       // image: message.image || null,
//       // location: message.location || null,
//     });
//   }

//   renderBubble(props) {
//     return (
//       <Bubble
//         {...props}
//         wrapperStyle={{
//           right: {
//             backgroundColor: '#000'
//           }
//         }}
//       />
//     )
//   }

//   render() {
//     let name = this.props.route.params.name;
//     this.props.navigation.setOptions({ title: name });
//     let color = this.props.route.params.color;
//     return (

//       <View style={{ flex: 1, backgroundColor: color }}>
//         <GiftedChat
//           renderBubble={this.renderBubble.bind(this)}
//           messages={this.state.messages}
//           onSend={messages => this.onSend(messages)}
//           // user={{ _id: 1, }}
//           // TREVOR'S:
//           user={this.state.user}
//         />
//         { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
//         }
//       </View>

//     )
//   }
// }