import React from 'react';
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Start from './components/Start';
import Chat from './components/Chat';
// import react native gesture handler
import 'react-native-gesture-handler';

// Create the navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// before fixing "stateless component must be a pure function":
// export default class App extends React.Component {
//   render() {
//     return (
//       <NavigationContainer>
//         <Stack.Navigator initialRouteName="Start">
//           <Stack.Screen name="Start" component={Start} />
//           <Stack.Screen name="Chat" component={Chat} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     );
//   }
// }
