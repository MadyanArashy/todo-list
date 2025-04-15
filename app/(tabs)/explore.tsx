import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Keyboard, KeyboardAvoidingView,
  Platform, TextInput,
  View, ScrollView
} from 'react-native';
import tw from 'twrnc';

import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FontAwesome } from '@expo/vector-icons';

export default function explore() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [subject, setSubject] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [deadline, setDeadline] = useState<string | null>(null);
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
    if (subject?.trim() && title?.trim() && deadline?.trim()) {
      const newHomework = {
        id: Date.now().toString(),
        subject: subject.trim(),
        title: title.trim(),
        deadline: deadline.trim(),
        state: true
      };

      setHomeworkItems([...homeworkItems, newHomework]);
      setSubject(null);
      setTitle(null);
      setDeadline(null);
    }
  };

  const resetTextInputs = () => {
    setSubject(null);
    setTitle(null);
    setDeadline(null);
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
    setEditId(null);
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
      if (jsonHomeworks !== null) {
        const loadedHomeworks = JSON.parse(jsonHomeworks);
        setHomeworkItems(loadedHomeworks);
        // console.log('Homeworks loaded successfully!');
      } else {
        // console.log('No homeworks found.');
      }
    } catch (err) {
      console.log('Error loading homeworks:', err);
    } finally {
      setIsInitialLoad(false); // 🚀 turn off after loading
    }
  };

  const saveHomework = async () => {
    try {
      const jsonHomeworks = JSON.stringify(homeworkItems);
      await AsyncStorage.setItem('homeworks', jsonHomeworks);
      if(homeworkItems.length > 0) {
        // console.log('Homeworks saved successfully!', jsonHomeworks);
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
            <TextInput
              style={tw`px-4 py-2 border border-neutral-300 rounded-md text-[${colors.text}] bg-[${colors.secondary}]`}
              placeholderTextColor={colors.textSecondary}
              placeholder="Mata pelajaran"
              value={subject || ''}
              onChangeText={(text) => setSubject(text)}
              multiline
            />
            <TextInput
              style={tw`px-4 py-2 border border-neutral-300 rounded-md text-[${colors.text}] bg-[${colors.secondary}]`}
              placeholderTextColor={colors.textSecondary}
              placeholder="Judul Tugas"
              value={title || ''}
              onChangeText={(text) => setTitle(text)}
              multiline
            />
            <TextInput
              style={tw`px-4 py-2 border border-neutral-300 rounded-md text-[${colors.text}] bg-[${colors.secondary}]`}
              placeholderTextColor={colors.textSecondary}
              placeholder="Deadline (tanggal)"
              value={deadline || ''}
              onChangeText={(text) => setDeadline(text)}
              multiline
            />
            <ThemedButton onPress={isEditing ? handleEdit : handleAddHomework} style={tw`align-middle justify-center`}>
              <ThemedText style={tw`text-center p-2 bg-blue-500 rounded-lg text-white`}>{isEditing ? 'Edit' : 'Tambah'} Tugas</ThemedText>
            </ThemedButton>
          </View>
        </KeyboardAvoidingView>
        <ScrollView
        showsVerticalScrollIndicator={false}>
           {/* Homework Wrapper */}
          <ThemedView style={tw`flex-col gap-2`}>
            <FlatList
            scrollEnabled={false}
            style={tw``}
            data={homeworkItems}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ThemedButton onPress={() =>
                completeHomework(item.id)
              }>
                <View style={tw`px-2 py-2 rounded-lg flex-row justify-between items-center bg-[${colors.secondary}]`}>
                  <View style={tw`flex-row items-center justify-between flex-1`}>
                    <View style={tw`flex-col gap-1`}>
                      <ThemedText style={tw`text-[${item.state === false ? colors.textSecondary : colors.text}] font-bold text-lg`}>{item.title} {item.state ? '' : '✅'}</ThemedText>
                      <ThemedText style={tw`text-[${item.state === false ? colors.textSecondary : colors.text}]`}>📕 {item.subject}</ThemedText>
                      <ThemedText style={tw`text-[${item.state === false ? colors.textSecondary : colors.text}]`}>🗓️ {item.deadline}</ThemedText>
          
                      <View style={tw`flex-row gap-5`}>
                        <ThemedButton style={tw`p-1`} onPress={() => startEdit(item)}>
                          <ThemedText style={tw`text-blue-500`}>
                            Edit
                          </ThemedText>
                        </ThemedButton>
                        <ThemedButton style={tw`p-1`} onPress={() => deleteHomework(item.id)}>
                          <ThemedText style={tw`text-red-500`}>
                            Delete
                          </ThemedText>
                        </ThemedButton>
                      </View>
                    </View>
                  </View>
                </View>
              </ThemedButton>
            )}
            ItemSeparatorComponent={() => <ThemedView style={tw`h-2`} />} />
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
};
