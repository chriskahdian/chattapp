import React from 'react';
import { View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
    }
    const firebaseConfig = {
      apiKey: "AIzaSyBZ6eS7PHX10wtY3BjOIFAgxQr_V8pn9-w",
      authDomain: "test-bbeef.firebaseapp.com",
      projectId: "test-bbeef",
      storageBucket: "test-bbeef.appspot.com",
      messagingSenderId: "633550727322",
      appId: "1:633550727322:web:303a9ca8441e1c80805723",
      measurementId: "G-K2F3ZS2MKN"
    }
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }

  componentDidMount() {
    let name = this.props.route.params.name;
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
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: name + ' has entered this chat',
          createdAt: new Date(),
          system: true,
        },
      ],
    })
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
        // image: data.image || null,
        // location: data.location || null,
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
        // this.saveMessages();
      });
  }

  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
      // image: message.image || null,
      // location: message.location || null,
    });
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          }
        }}
      />
    )
  }

  render() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    let color = this.props.route.params.color;
    return (

      <View style={{ flex: 1, backgroundColor: color }}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          // user={{ _id: 1, }}
          // TREVOR'S:
          user={this.state.user}
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
        }
      </View>

    )
  }
}










// import React from 'react';
// import { View, Text, Platform, KeyboardAvoidingView} from 'react-native';
// import { GiftedChat, Bubble } from 'react-native-gifted-chat';
// const firebase = require('firebase');
// require('firebase/firestore');

// export default class Chat extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       messages: [],
//     }
//   }

//   componentDidMount() {
//     let name = this.props.route.params.name;
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
//           text: name+' has entered this chat',
//           createdAt: new Date(),
//           system: true,
//         },
//       ],
//     })
//   }

//   onSend(messages = []) {
//     this.setState(previousState => ({
//       messages: GiftedChat.append(previousState.messages, messages),
//     }))
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
//         let name = this.props.route.params.name;
//         this.props.navigation.setOptions({ title: name });
//         let color = this.props.route.params.color;
//     return (

//       <View style={{ flex:1, backgroundColor: color }}>
//         <GiftedChat
//           renderBubble={this.renderBubble.bind(this)}
//           messages={this.state.messages}
//           onSend={messages => this.onSend(messages)}
//           user={{
//             _id: 1,
//           }}
//         />
//         { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
//         }
//       </View>

//     )
//   }
// }