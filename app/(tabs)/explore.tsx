import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Keyboard, KeyboardAvoidingView,
  Platform, TextInput,
  View, ScrollView,
  Alert
} from 'react-native';
import tw from 'twrnc';

import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Feather, FontAwesome, FontAwesome5 } from '@expo/vector-icons';

export default function explore() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [subject, setSubject] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [deadline, setDeadline] = useState<string>('');
  // const homework = [subject, title, deadline];
  const [homeworkItems, setHomeworkItems] = 
  useState<{
    id: string;
    subject: string;
    title: string;
    deadline: string;
    state: boolean;
  }[]>([]);

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Load homeworks when the component mounts
  useEffect(() => {
    loadHomeworks();
  }, []);

  // Save homeworks whenever homeworkItems changes
  useEffect(() => {
    if(!isInitialLoad){saveHomework();}
  }, [homeworkItems]);

  const handleAddHomework = () => {
    if (subject?.trim().length >= 3 && title?.trim().length >= 3 && deadline?.trim().length >= 3) {
      Keyboard.dismiss()
      const newHomework = {
        id: Date.now().toString(),
        subject: subject.trim(),
        title: title.trim(),
        deadline: deadline.trim(),
        state: true
      };

      setHomeworkItems([...homeworkItems, newHomework]);
      setSubject('');
      setTitle('');
      setDeadline('');
    }
    else if (subject?.trim().length > 0 || title?.trim().length > 0 || deadline?.trim().length > 0) {
      Alert.alert('Error', 'sependek dihh gw 💔');
    }
    else {
      Alert.alert('Error', 'dimana tulisannya vro 🥀')
    }
  };

  const resetTextInputs = () => {
    setSubject('');
    setTitle('');
    setDeadline('');
  }

  const handleEdit = () => {
    const updated = homeworkItems.map(item =>
      item.id === editId
        ? {
            ...item,
            subject: subject?.trim() || '',
            title: title?.trim() || '',
            deadline: deadline?.trim() || ''
          }
        : item
    );
  
    console.log("Successfully updated", editId);
  
    resetTextInputs();
    setHomeworkItems(updated);
    setIsEditing(false);
    setEditId('');
  };
  

  const startEdit = (item:any) => {
    console.log('starting edit on:', item.id)
    setSubject(item.subject);
    setTitle(item.title);
    setDeadline(item.deadline);
    setIsEditing(true);
    setEditId(item.id);
  }

  const loadHomeworks = async () => {
    try {
      const jsonHomeworks = await AsyncStorage.getItem('homeworks');
      const loadedHomeworks = jsonHomeworks ? JSON.parse(jsonHomeworks) : [];
      setHomeworkItems(loadedHomeworks);
    } catch (err) {
      console.log('Error loading homeworks:', err);
    } finally {
      setIsInitialLoad(false);
    }
  };
  

  const saveHomework = async () => {
    try {
      const jsonHomeworks = JSON.stringify(homeworkItems);
      await AsyncStorage.setItem('homeworks', jsonHomeworks);
      if(homeworkItems.length > 0) {
        // console.log('Homeworks saved successfully!', `jsonHomeworks`);
      } else {
        console.log('No homeworks to save.')
      }
    } catch (err) {
      console.log('Error saving homeworks:', err);
    }
  }; 

  const completeHomework = (id: string) => {
    const itemsCopy = homeworkItems.filter(homework => homework.id !== id);
    setHomeworkItems(itemsCopy);
    const updatedHomeworks = homeworkItems.map(homework => {
      if (homework.id === id) {
        return { ...homework, state: !homework.state };
      }
      return homework;
    });
    setHomeworkItems(updatedHomeworks);
  };

  const deleteHomework = (id: string) => {
    const itemsCopy = homeworkItems.filter(homework => homework.id !== id);
    setHomeworkItems(itemsCopy);
    console.log('Deleted:', id)
  }


  return (
    <ThemedView style={tw`flex-1 pt-[10%]`}>
      <SafeAreaView style={tw`px-4 flex-col flex-grow gap-4 flex-1 flex`}>
        {/* Header Title */}
        <View style={tw`flex-row gap-4`}>
          <FontAwesome name='book' size={56} color={colors.red}/>
          <View style={tw`flex-col justify-between`}>
            <ThemedText style={tw`text-neutral-500`}>
              Pelajaran
            </ThemedText>
            <ThemedText type='title'>
              TugasKu
            </ThemedText>
          </View>
        </View>
        {/* Text Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={tw`w-full flex-col justify-around self-center gap-2 mb-4 z-100`}
          >
          <View style={tw`w-full flex-col flex gap-4`}>
          <View
            style={[
              tw`rounded-md`,
              {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
              },
            ]}
          >
              <TextInput
                style={tw`px-4 py-2 border border-neutral-300 rounded-md text-[${colors.text}] bg-[${colors.secondary}]`}
                placeholderTextColor={colors.textSecondary}
                placeholder="Apa tugas hari ini?"
                value={subject || ''}
                onChangeText={(text) => setSubject(text)}
                multiline
              />
            </View>
            <View
              style={[
                tw`rounded-md`,
                {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                },
              ]}
            >
              <TextInput
                style={tw`px-4 py-2 border border-neutral-300 rounded-md text-[${colors.text}] bg-[${colors.secondary}]`}
                placeholderTextColor={colors.textSecondary}
                placeholder="Apa mapelnya?"
                value={title || ''}
                onChangeText={(text) => setTitle(text)}
                multiline
              />
            </View>
            <View
              style={[
                tw`rounded-md`,
                {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 5,
                },
              ]}
            >
              <TextInput
                style={tw`px-4 py-2 border border-neutral-300 rounded-md text-[${colors.text}] bg-[${colors.secondary}]`}
                placeholderTextColor={colors.textSecondary}
                placeholder="Sampe kapan icibos?"
                value={deadline || ''}
                onChangeText={(text) => setDeadline(text)}
                multiline
              />
            </View>
            <ThemedButton onPress={isEditing ? handleEdit : handleAddHomework} style={tw`align-middle justify-center`}>
              <ThemedText style={tw`text-center p-2 bg-blue-500 rounded-lg text-white`}>{isEditing ? 'Edit' : 'Tambah'} Tugas</ThemedText>
            </ThemedButton>
          </View>
        </KeyboardAvoidingView>
        <ScrollView
        showsVerticalScrollIndicator={false}>
           {/* Homework Wrapper */}
          <ThemedView style={tw`flex-col gap-2`}>
          {homeworkItems.length === 0 ? (
            <View>
              <ThemedText style={tw`text-center`}>Udh abis tugasnya icibos</ThemedText>
            </View>
          ) : (
            <FlatList
              scrollEnabled={false}
              style={tw``}
              data={homeworkItems}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <ThemedButton onPress={() => completeHomework(item.id)}>
                  <View style={tw`px-2 py-2 rounded-lg flex-row justify-between items-center bg-[${colors.secondary}]`}>
                    <View style={tw`flex-row items-center justify-between flex-1`}>
                      <Feather name={item.state ? 'square' : 'check-square'} size={24} color={colors.text}/>
                      <View style={tw`flex-col gap-1`}>
                        <ThemedText style={tw`text-[${item.state === false ? colors.textSecondary : colors.text}] font-bold text-lg`}>{item.title}</ThemedText>
                        <ThemedText style={tw`text-[${item.state === false ? colors.textSecondary : colors.text}]`}>📕 {item.subject}</ThemedText>
                        <ThemedText style={tw`text-[${item.state === false ? colors.textSecondary : colors.text}]`}>🗓️ {item.deadline}</ThemedText>
                      </View>
                      <View style={tw`flex-row gap-1`}>
                        <ThemedButton style={tw`p-2 bg-[${'#032a4e'}]`} onPress={() => startEdit(item)}>
                          <FontAwesome5 name='pen' size={20} color='white'/>
                        </ThemedButton>
                        <ThemedButton style={tw`p-2 bg-[${'#8b1a10'}]`} onPress={() => deleteHomework(item.id)}>
                          <FontAwesome5 name='trash-alt' size={20} color='white'/>
                        </ThemedButton>
                      </View>
                    </View>
                  </View>
                </ThemedButton>
              )}
              ItemSeparatorComponent={() => <ThemedView style={tw`h-2`} />}
            />
          )}
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
};
