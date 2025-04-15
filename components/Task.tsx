// import { TouchableOpacity, useColorScheme, View } from 'react-native'
// import React from 'react'
// import tw from 'twrnc'
// import { ThemedText } from './ThemedText'
// import { Colors } from './../constants/Colors';


// const Task = ({text, state}: taskProps) => {
//   const colorScheme = useColorScheme();
//   const colors = Colors[colorScheme ?? 'light'];
//   const disabled = !state;
//   const rootComponent =
//   <View style={tw`px-4 py-2 rounded-lg flex-row justify-between items-center`}>
//     <View style={tw`flex-row gap-4 items-center`}>
//       <ThemedText style={tw`text-[${disabled ? colors.tint : ''}]`}>{text}</ThemedText>
//     </View>
//   </View>
//   return (rootComponent)
// }

// export default Task
type taskProps = {
  text: string;
  state: boolean;
}

import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

const Task = ({text, state}: taskProps) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const disabled = !state;
  const rootComponent =
  <View style={tw`px-4 py-2 rounded-lg flex-row justify-between items-center bg-[${colors.secondary}]`}>
    <View style={tw`flex-row gap-4 items-center`}>
      <ThemedText style={tw`text-[${disabled ? colors.background : ''}]`}>{text}</ThemedText>
    </View>
  </View>

  return rootComponent;
};

export default Task;
