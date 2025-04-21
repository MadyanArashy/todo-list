import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme.web';
import { Feather, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import tw from 'twrnc';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [task, setTask] = useState<string | ''>('');
  const [taskItems, setTaskItems] = useState<{ id: string; title: string; state: boolean; }[]>([]);

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Load tasks when the component mounts
  useEffect(() => {
    loadTasks();
  }, []);

  // Save tasks whenever taskItems changes
  useEffect(() => {
    if(!isInitialLoad){saveTask();}
  }, [taskItems]);

  const handleAddTask = () => {
    if (task?.trim().length >= 3) {
      Keyboard.dismiss();
      const newTask = {
        id: Date.now().toString(),
        title: task.trim(),
        state: true
      }

      setTaskItems([...taskItems, newTask]);
      setTask('');
    }
    else if (task?.trim().length > 0) {
      Alert.alert('Error', 'sependek dihh gw 💔')
    }
    else {
      Alert.alert('Error', 'dimana tulisannya vro 🥀')
    }
  };

  const handleEdit = () => {
    const updated = taskItems.map(item =>
      item.id === editId && task !== null
        ? {...item, title: task.trim()}
        : item
    );
    setTaskItems(updated);
    setTask("");
    setIsEditing(false);
    setEditId(null);
  }

  const startEdit = (item:any) => {
    setTask(item.title);
    setIsEditing(true);
    setEditId(item.id);
  }

  const loadTasks = async () => {
    try {
      const jsonTasks = await AsyncStorage.getItem('tasks');
      if (jsonTasks !== null) {
        const loadedTasks = JSON.parse(jsonTasks);
        setTaskItems(loadedTasks);
        // console.log('Tasks loaded successfully!');
      } else {
        // console.log('No tasks found.');
      }
    } catch (err) {
      console.log('Error loading tasks:', err);
    } finally {
      setIsInitialLoad(false); // 🚀 turn off after loading
    }
  };

  const saveTask = async () => {
    try {
      const jsonTasks = JSON.stringify(taskItems);
      await AsyncStorage.setItem('tasks', jsonTasks);
      if(taskItems.length > 0) {
        // console.log('Tasks saved successfully!', jsonTasks);
      } else {
        // console.log('No tasks to save.')
      }
    } catch (err) {
      console.log('Error saving tasks:', err);
    }
  }; 

  const completeTask = (id: string) => {
    // const itemsCopy = taskItems.filter(task => task.id !== id);
    // setTaskItems(itemsCopy);
    const updatedTasks = taskItems.map(task => {
      if (task.id === id) {
        return { ...task, state: !task.state };
      }
      return task;
    });
    setTaskItems(updatedTasks);
  };

  const deleteTask = (id: string) => {
    const itemsCopy = taskItems.filter(task => task.id !== id);
    setTaskItems(itemsCopy);
    console.log('Deleted:', id)
    if(editId === id) {
      setTask("");
      setIsEditing(false);
      setEditId(null);
    }
  }
  function coolArrows() {
    for(let i = 1;i <= 15;i++) {
    let line = ''
    for(let k = 1;k <= 15; k++) {
      if(k < i) {
        line = line.concat('=')
      } else if(k == i) {
        line = line.concat('>')
      } else {
        line = line.concat('.')
      }
    }
    console.log(line)
  }}

  return (
    <ThemedView style={tw`flex-1`}>
      <View style={tw`bg-yellow-200 p-20 rounded-b-full top--10 mb--5`}></View>
      <View style={tw`px-4 flex-col gap-4 flex-1 flex`}>

        {/* Header Title */}
        <View style={tw`flex-row gap-4`}>
          <FontAwesome6 name='person-rifle' size={56} color={colors.tabIconSelected}/>
          <View style={tw`flex-col justify-between`}>
            <ThemedText style={tw`text-neutral-500`}>
              Tasks
            </ThemedText>
            <ThemedText type='title'>
              Personal
            </ThemedText>
          </View>
        </View>

        {/* Task Wrapper */}
        <ThemedView style={tw`flex-col gap-2`}>
          <FlatList 
          data={taskItems}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={tw`p-1`} onPress={() => 
              completeTask(item.id)
            }>
              <View style={tw`px-4 py-2 rounded-lg flex-row justify-between items-center bg-[${colors.secondary}] shadow-md shadow-black inset-shadow-blue-500`}>
                <View style={tw`flex-row gap-4 items-center justify-between flex-1`}>
                  <View style={tw`flex-row gap-2 items-center`}>
                    <Feather name={item.state ? 'square' : 'check-square'} size={24} color={colors.text}/>
                    <ThemedText style={tw`text-[${item.state === false ? colors.textSecondary : colors.text}] ${item.state ? '' : 'line-through'}`}>{item.title}</ThemedText>
                  </View>
                  <View style={tw`flex-row gap-5 items-center`}>
                    <TouchableOpacity style={tw`p-1.5 bg-[${'#032a4e'}]`} onPress={() => startEdit(item)}>
                      <FontAwesome5 name='pen' size={18} color='white'/>
                    </TouchableOpacity>
                    <TouchableOpacity style={tw`p-1.5 bg-[${'#8b1a10'}]`} onPress={() => deleteTask(item.id)}>
                      <FontAwesome5 name='trash-alt' size={18} color='white'/>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <ThemedView style={tw`h-2`} />} />
        </ThemedView>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={tw`w-full flex-col justify-around absolute bottom-4 self-center gap-2`}
          >
          <ThemedText style={tw`pl-4 text-[${colors.textSecondary}]`}>
            {isEditing
            ? 'Editing...'
            : 'Write a task!'
            }
          </ThemedText>
          <View style={tw`w-full flex-row flex flex-1 gap-4`}>
            <TextInput
              style={tw`px-4 py-2 border border-neutral-300 rounded-lg flex-1 text-[${colors.text}] bg-[${colors.secondary}]`}
              placeholderTextColor={colors.textSecondary}
              placeholder="Write a task"
              value={task || ''}
              onChangeText={(text) => setTask(text)}
              multiline
            />
            <TouchableOpacity onPress={isEditing ? handleEdit : handleAddTask}>
              <ThemedView style={tw`w-10 h-10 border border-neutral-300 rounded-full align-middle justify-center`}>
                <ThemedText style={tw`text-center`}>+</ThemedText>
              </ThemedView>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ThemedView>
  );
}