import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Button, Dimensions , TextInput } from 'react-native';
import { useEffect, useState } from 'react';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

import { getJsonData, storeData } from './modules/storage.js';

import BottomBar from './components/BottomBar';
import CheckBox from './components/Checkbox.js';

const dataKey = "taskData:0.0"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },

  FlatList: {
    width: "100%",
    marginVertical: 30,
    justifyContent: "left",
    alignItems: "left",
    justifyContent: 'top',
    flex: 1

  },

  itemContainer: {
    justifyContent: "center",
    width: windowWidth
  },

  item: {
    marginLeft: "4%",
    fontSize: "30%",
    textAlign: "left",
    marginRight: "20%",
  },

  itemToggled: {
    marginLeft: "4%",
    fontSize: "30%",
    textAlign: "left",
    marginRight: "20%",
    color: "#aaa"
  },

  addTaskScreen: {
    width: "75%",
    height: "50%",
    top: "25%",
    left: "12.5%",
    backgroundColor: "#eee",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },

  taskInput: {
    marginLeft: "10%",
    marginRight: "10%",
    fontSize: "20%",
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  taskAddButton: {
    fontSize: "20%",
    flex: 1
  }
});

function Item({ item, setChecked }) {
  return <View style={styles.itemContainer}>
    <Text style={item.item["toggle"] ? styles.itemToggled:styles.item}>{item.item.key} </Text>
    <CheckBox checked={item.item["toggle"]} setChecked={(value) => {
      setChecked(item.index, value)
    }} />
  </View>
}

function AddTaskScreen({task, setTask, setAddTaskOpen, addTask}) {
  return <View style={styles.addTaskScreen}>
    <TextInput
      style={styles.taskInput}
      placeholder='TaskDescription'
      value={task}
      onChangeText={setTask}
      multiline={true}
    />

    <Button title="Add" style={styles.taskAddButton} onPress={() => {
      if (task == "") { return }
      addTask(task);
      setAddTaskOpen(false)
    }} />
  </View>
}

export default function App() {
  const [data, setData] = useState([])

  const [task, setTask] = useState("")
  const [addTaskOpen, setAddTaskOpen] = useState(false)

  const [gotData, setGotData] = useState(false)

  useEffect(() => {
    getJsonData(dataKey).then((d) => {
      setGotData(true)
      setData(d || [])
    })
  }, [])

  useEffect(() => {
    setTask("")
  }, [addTaskOpen])

  useEffect(() => {
    if (!gotData) {return}
    // console.log("Stored: ", data)
    storeData(dataKey, JSON.stringify(data)).then(() => { })
  }, [data])

  function addTask(task) {
    const d = JSON.parse(JSON.stringify(data))
    d.push({ key: task, toggle: false })
    setData(d)
  }

  function wipe() {
    setData([])
  }

  function clear()
  {
    const d = []
    data.map((value) => {
      if (!value.toggle)
        d.push(value)
    })
    setData(d)
  }

  function setChecked(i, value) {
    const d = JSON.parse(JSON.stringify(data))
    d[i]["toggle"] = value;
    setData(d)
  }

  return (
    <View style={styles.container}>
      <View style={styles.FlatList}>
        <FlatList data={data} renderItem={(item, i) => {
          return <Item item={item}setChecked={setChecked}/>
        }
          } keyExtractor={(item, index)=> index}>
        </FlatList>
      </View>

      {addTaskOpen && <AddTaskScreen setAddTaskOpen={setAddTaskOpen} 
        addTask={addTask} setTask={setTask} task={task}/>}

      <BottomBar addTaskOpen={addTaskOpen} setAddTaskOpen={setAddTaskOpen} wipe={wipe} Clear={clear}/>
      <StatusBar style="auto" />
    </View>
  );
}
