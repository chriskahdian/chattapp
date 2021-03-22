/* eslint-disable linebreak-style */

/**
 * @description start screen; user enters name, chooses chat background
 */

import React from 'react';
import { View, Text, TextInput, Button, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';

const image = require('../assets/Background_Image.png');

export default class Start extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          name: '',
          color: ''
      };
  }
  render() {
    return (
      <ImageBackground source={image} style={styles.image}>

        <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>App Name</Text>

          {/* user enters name */}
          <View>
            <TextInput
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
              placeholder="Your name"
              style={{
                  height: 40,
                  borderColor: 'black',
                  borderWidth: 1,
                  borderRadius: 10,
                  width: 250,
                  padding: 10,
                  margin: 15,
              }}
            />
            
            {/* user chooses chat background */}
            <Text style={styles.text}> Choose a color for your Chat: </Text>
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.box1}
                    onPress={() => { this.setState({ color: 'red' }) }}
                >
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.box2}
                    onPress={() => { this.setState({ color: 'green' }) }}
                >
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.box3}
                    onPress={() => { this.setState({ color: 'blue' }) }}
                >
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.box4}
                    onPress={() => { this.setState({ color: 'yellow' }) }}
                >
                </TouchableOpacity>
            </View>
            <Text style={styles.text}>Your choice: </Text>
            <View style={{
                backgroundColor: this.state.color,
                borderStyle: 'solid',
                borderWidth: 1,
                borderColor: 'gray',
                marginTop: 10,
                marginBottom: 15,
                width: 50,
                height: 50,
                borderRadius: 25
            }}
            >
            </View>
            <Button
              title="Chat"
              onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, color: this.state.color })}
            />
          </View>
        </View>

      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  image: {
      flex: 1
  },
  container: {
      flexDirection: 'row',
      width: 200,
      margin: 10
  },
  box1: {
      flex: 1,
      backgroundColor: 'red',
      height: 50,
      width: 50,
      borderRadius: 25,
  },
  box2: {
      flex: 1,
      backgroundColor: 'green',
      width: 50,
      borderRadius: 25,
  },
  box3: {
      flex: 1,
      backgroundColor: 'blue',
      width: 50,
      borderRadius: 25,
  },
  box4: {
      flex: 1,
      backgroundColor: 'yellow',
      width: 50,
      borderRadius: 25,
  }
});













// 2021-03-19-1732 WORKING BEFORE CONTINUING LINTING

// import React from 'react';
// import { View, Text, TextInput, Button, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';

// const image = require('../assets/Background_Image.png');

// export default class Start extends React.Component {
//   constructor(props) {
//       super(props);
//       this.state = {
//           name: '',
//           color: ''
//       };
//   }
//   render() {
//     return (
//       <ImageBackground source={image} style={styles.image}>

//         <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
//           <Text>App Name</Text>
//           <View>
//             <TextInput
//               onChangeText={(name) => this.setState({ name })}
//               value={this.state.name}
//               placeholder="Your name"
//               style={{
//                   height: 40,
//                   borderColor: 'black',
//                   borderWidth: 1,
//                   borderRadius: 10,
//                   width: 250,
//                   padding: 10,
//                   margin: 15,
//               }}
//             />
            
//             <Text style={styles.text}> Choose a color for your Chat: </Text>
//             <View style={styles.container}>
//                 <TouchableOpacity
//                     style={styles.box1}
//                     onPress={() => { this.setState({ color: 'red' }) }}
//                 >
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                     style={styles.box2}
//                     onPress={() => { this.setState({ color: 'green' }) }}
//                 >
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                     style={styles.box3}
//                     onPress={() => { this.setState({ color: 'blue' }) }}
//                 >
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                     style={styles.box4}
//                     onPress={() => { this.setState({ color: 'yellow' }) }}
//                 >
//                 </TouchableOpacity>
//             </View>
//             <Text style={styles.text}>Your choice: </Text>
//             <View style={{
//                 backgroundColor: this.state.color,
//                 borderStyle: 'solid',
//                 borderWidth: 1,
//                 borderColor: 'gray',
//                 marginTop: 10,
//                 marginBottom: 15,
//                 width: 50,
//                 height: 50,
//                 borderRadius: 25
//             }}
//             >
//             </View>
//             <Button
//               title="Chat"
//               onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, color: this.state.color })}
//             />
//           </View>
//         </View>

//       </ImageBackground>
//     )
//   }
// }

// const styles = StyleSheet.create({
//   image: {
//       flex: 1
//   },
//   container: {
//       flexDirection: 'row',
//       width: 200,
//       margin: 10
//   },
//   box1: {
//       flex: 1,
//       backgroundColor: 'red',
//       height: 50,
//       width: 50,
//       borderRadius: 25,
//   },
//   box2: {
//       flex: 1,
//       backgroundColor: 'green',
//       width: 50,
//       borderRadius: 25,
//   },
//   box3: {
//       flex: 1,
//       backgroundColor: 'blue',
//       width: 50,
//       borderRadius: 25,
//   },
//   box4: {
//       flex: 1,
//       backgroundColor: 'yellow',
//       width: 50,
//       borderRadius: 25,
//   }
// });