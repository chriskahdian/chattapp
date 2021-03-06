/**
 * @description handles logic for extra chat features
 */

/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable no-alert */
/* eslint-disable no-console */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const firebase = require('firebase');
require('firebase/firestore');

export default class CustomActions extends Component {

    /**
     * accesses user's images, allows user to choose which to send as message
     * @async
     */
    pickPhoto = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        console.log('camera roll status: ' + status);

        if (status === 'granted') {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'Images',
            }).catch((error) => console.log(error));

            if (!result.cancelled) {
                const imageUrl = await this.uploadImageFetch(result.uri);
                console.log('imageUrl: ' + imageUrl);
                this.props.onSend({ image: imageUrl });
            }
        } else {
            window.alert('Camera Roll Access Denied');
        }
    }

    /**
     * accesses user's camer, allows user to take a picture to send as a message
     * @async
     */
    takePhoto = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);

        console.log('camera status: ' + status);

        if (status === 'granted') {
            let result = await ImagePicker.launchCameraAsync().catch((error) => console.log(error));

            if (!result.cancelled) {
                const imageUrl = await this.uploadImageFetch(result.uri);
                this.props.onSend({ image: imageUrl });
            }
        } else {
            window.alert('Camera Access Denied');
        }
    }

    /**
     * accesses user's GPS location, allows user to send location as a message
     * @async
     */
    getLocation = async () => {
        try {
            const { status } = await Permissions.askAsync(Permissions.LOCATION);
            if (status === 'granted') {
                const result = await Location.getCurrentPositionAsync({}).catch((error) =>
                    console.log(error),
                );
                const longitude = JSON.stringify(result.coords.longitude);
                const latitude = JSON.stringify(result.coords.latitude);
                if (result) {
                    this.props.onSend({
                        location: {
                            longitude: result.coords.longitude,
                            latitude: result.coords.latitude,
                        },
                    });
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    //this version of getLocation doesn't work, not sure why
    // getLocation = async () => {
    //     const { status } = await Permissions.askAsync(Permissions.LOCATION);

    //     if (status === 'granted') {
    //         let result = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });

    //         const longitude = JSON.stringify(result.coords.longitude);
    //         const latitude = JSON.stringify(result.coords.latitude);

    //         if (result) {
    //             this.props.onSend({
    //                 location: {
    //                     longitude,
    //                     latitude,
    //                 }
    //             });
    //         }

    //     } else {
    //         window.alert('Location Access Denied');
    //     }
    // }

    /**
     * uploads message pictures to firebase
     * @param {*} uri 
     * @async
     */
    uploadImageFetch = async (uri) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });

        const imageNameBefore = uri.split('/');
        const imageName = imageNameBefore[imageNameBefore.length - 1];

        const ref = firebase.storage().ref().child(`images/${imageName}`);

        const snapshot = await ref.put(blob);

        blob.close();

        return await snapshot.ref.getDownloadURL(); // Returns the URL for the specific image from firestore storage
    };

    /**
     * defines names of extra chat features in menu for user
     */
    onActionPress = () => {
        const options = ['Choose photo from Library', 'Take Picture', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;

        this.context.actionSheet().showActionSheetWithOptions(
            {
                options, cancelButtonIndex,
            },

            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        console.log('user wants to pick an image');
                        return this.pickPhoto();
                    case 1:
                        console.log('user wants to take a photo');
                        return this.takePhoto();
                    case 2:
                        console.log('user wants to get their location');
                        return this.getLocation();
                }
            },
        );
    };

    render() {
        return (
            <TouchableOpacity
                accessible={true}
                accessibilityLabel="More options"
                accessibilityHint="Send/take picture/location"
                style={[styles.container]}
                onPress={this.onActionPress}
            >
                <View style={[styles.wrapper, this.props.wrapperStyle]}>
                    <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
});

CustomActions.contextTypes = {
    actionSheet: PropTypes.func,
};















// 2021-03-19-1732 WORKING BEFORE CONTINUING LINTING

// /* eslint-disable linebreak-style */
// /* eslint-disable max-len */
// /* eslint-disable no-alert */
// /* eslint-disable no-console */
// /* eslint-disable indent */
// /* eslint-disable linebreak-style */
// import React, { Component } from 'react';
// import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
// import PropTypes from 'prop-types';
// import * as Permissions from 'expo-permissions';
// import * as ImagePicker from 'expo-image-picker';
// import * as Location from 'expo-location';

// const firebase = require('firebase');
// require('firebase/firestore');


// export default class CustomActions extends Component {

//     pickPhoto = async () => {
//         const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

//         console.log('camera roll status: ' + status);

//         if (status === 'granted') {
//             let result = await ImagePicker.launchImageLibraryAsync({
//                 mediaTypes: 'Images',
//             }).catch((error) => console.log(error));

//             if (!result.cancelled) {
//                 const imageUrl = await this.uploadImageFetch(result.uri);
//                 console.log('imageUrl: ' + imageUrl);
//                 this.props.onSend({ image: imageUrl });
//             }

//         } else {
//             window.alert('Camera Roll Access Denied');
//         }

//     }

//     takePhoto = async () => {
//         const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);

//         console.log('camera status: ' + status);

//         if (status === 'granted') {
//             let result = await ImagePicker.launchCameraAsync().catch((error) => console.log(error));

//             if (!result.cancelled) {
//                 const imageUrl = await this.uploadImageFetch(result.uri);
//                 this.props.onSend({ image: imageUrl });
//             }

//         } else {
//             window.alert('Camera Access Denied');
//         }

//     }

//     // EXAMPLE
//     getLocation = async () => {
//         try {
//             const { status } = await Permissions.askAsync(Permissions.LOCATION);
//             if (status === 'granted') {
//                 const result = await Location.getCurrentPositionAsync({}).catch((error) =>
//                     console.log(error),
//                 );
//                 const longitude = JSON.stringify(result.coords.longitude);
//                 const latitude = JSON.stringify(result.coords.latitude);
//                 if (result) {
//                     this.props.onSend({
//                         location: {
//                             longitude: result.coords.longitude,
//                             latitude: result.coords.latitude,
//                         },
//                     });
//                 }
//             }
//         } catch (error) {
//             console.log(error.message);
//         }
//     };

//     // getLocation = async () => {
//     //     const { status } = await Permissions.askAsync(Permissions.LOCATION);

//     //     if (status === 'granted') {
//     //         let result = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });

//     //         const longitude = JSON.stringify(result.coords.longitude);
//     //         const latitude = JSON.stringify(result.coords.latitude);

//     //         if (result) {
//     //             this.props.onSend({
//     //                 location: {
//     //                     longitude,
//     //                     latitude,
//     //                 }
//     //             });
//     //         }

//     //     } else {
//     //         window.alert('Location Access Denied');
//     //     }
//     // }

//     uploadImageFetch = async (uri) => {
//         const blob = await new Promise((resolve, reject) => {
//             const xhr = new XMLHttpRequest();
//             xhr.onload = function () {
//                 resolve(xhr.response);
//             };
//             xhr.onerror = function (e) {
//                 console.log(e);
//                 reject(new TypeError('Network request failed'));
//             };
//             xhr.responseType = 'blob';
//             xhr.open('GET', uri, true);
//             xhr.send(null);
//         });

//         const imageNameBefore = uri.split('/');
//         const imageName = imageNameBefore[imageNameBefore.length - 1];

//         const ref = firebase.storage().ref().child(`images/${imageName}`);

//         const snapshot = await ref.put(blob);

//         blob.close();

//         return await snapshot.ref.getDownloadURL(); // Returns the URL for the specific image from firestore storage
//     };


//     onActionPress = () => {
//         const options = ['Choose photo from Library', 'Take Picture', 'Send Location', 'Cancel'];
//         const cancelButtonIndex = options.length - 1;

//         this.context.actionSheet().showActionSheetWithOptions(
//             {
//                 options, cancelButtonIndex,
//             },

//             async (buttonIndex) => {
//                 switch (buttonIndex) {
//                     case 0:
//                         console.log('user wants to pick an image');
//                         return this.pickPhoto();
//                     case 1:
//                         console.log('user wants to take a photo');
//                         return this.takePhoto();
//                     case 2:
//                         console.log('user wants to get their location');
//                         return this.getLocation();
//                 }
//             },
//         );
//     };


//     render() {
//         return (
//             <TouchableOpacity
//                 accessible={true}
//                 accessibilityLabel="More options"
//                 accessibilityHint="Send/take picture/location"
//                 style={[styles.container]}
//                 onPress={this.onActionPress}
//             >
//                 <View style={[styles.wrapper, this.props.wrapperStyle]}>
//                     <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
//                 </View>
//             </TouchableOpacity>
//         );
//     }
// }

// const styles = StyleSheet.create({
//     container: {
//         width: 26,
//         height: 26,
//         marginLeft: 10,
//         marginBottom: 10,
//     },
//     wrapper: {
//         borderRadius: 13,
//         borderColor: '#b2b2b2',
//         borderWidth: 2,
//         flex: 1,
//     },
//     iconText: {
//         color: '#b2b2b2',
//         fontWeight: 'bold',
//         fontSize: 16,
//         backgroundColor: 'transparent',
//         textAlign: 'center',
//     },
// });

// CustomActions.contextTypes = {
//     actionSheet: PropTypes.func,
// };