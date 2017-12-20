import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  StatusBar,
  Platform,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  AsyncStorage,
  KeyboardAvoidingView,
  ScrollView
} from "react-native";
import { AppLoading } from "expo";
import uuidv1 from "uuid/v1";
import ToDo from "./components/ToDo";

const { height, width } = Dimensions.get("window");

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newToDo: "",
      loadedToDos: false,
      toDos: {}
    };
  }
  componentDidMount() {
    this._loadTodos();
  }
  render() {
    const { newToDo, loadedToDos, toDos } = this.state;
    if (!loadedToDos) {
      return <AppLoading />;
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>Kawai To Do</Text>
        <View style={styles.card}>
          <TextInput
            value={newToDo}
            style={newToDo}
            onChangeText={this._controllNewToDo}
            placeholderTextColor={"#999"}
            placeholder={"New To Do"}
            onSubmitEditing={this._addToDo}
            returnKeyType={"done"}
            style={styles.newToDo}
            blurOnSubmit={true}
          />
          <ScrollView contentContainerStyle={styles.toDoList}>
            {Object.values(toDos).map(toDo => (
              <ToDo
                uncomplete={this._uncompleteToDo}
                complete={this._completeToDo}
                key={toDo.id}
                {...toDo}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }
  _controllNewToDo = text => {
    this.setState({
      newToDo: text
    });
  };
  _dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  _addToDo = async () => {
    const { newToDo, toDos } = this.state;
    let newState;
    this.setState(prevState => {
      const ID = uuidv1();
      const newToDoObject = {
        [ID]: { id: ID, isCompleted: false, text: newToDo }
      };
      newState = {
        ...prevState,
        toDos: { ...prevState.toDos, ...newToDoObject },
        newToDo: ""
      };
      const saveState = AsyncStorage.setItem(
        "toDos",
        JSON.stringify(newState.toDos)
      );
      return { ...newState };
    });
  };
  _loadTodos = async () => {
    try {
      const toDos = await AsyncStorage.getItem("toDos");
      if (toDos) {
        const parsedToDos = JSON.parse(toDos);
        this.setState({ loadedToDos: true, toDos: parsedToDos });
      } else {
        this.setState({
          loadedToDos: true,
          toDos: {}
        });
      }
    } catch (err) {
      console.log(err);
    }
  };
  _completeToDo = id => {
    this.setState(prevState => {
      return {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: true
          }
        }
      };
    });
  };
  _uncompleteToDo = id => {
    this.setState(prevState => {
      return {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: false
          }
        }
      };
    });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F23657",
    alignItems: "center"
  },
  title: {
    marginTop: 50,
    marginBottom: 30,
    fontSize: 30,
    color: "white",
    fontWeight: "200"
  },
  card: {
    flex: 1,
    width: width - 25,
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "rgb(50, 50, 50)",
        shadowOffset: {
          height: -1,
          width: 0
        },
        shadowOpacity: 0.5,
        shadowRadius: 5
      },
      android: {
        elevation: 3
      }
    })
  },
  newToDo: {
    padding: 20,
    borderBottomColor: "#bbb",
    borderBottomWidth: 1,
    fontSize: 25
  },
  toDoList: {
    flex: 1,
    alignItems: "center"
  }
});

export default App;
