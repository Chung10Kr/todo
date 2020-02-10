import React from 'react';
import {
   StyleSheet
   ,Text
   ,View
   ,StatusBar
   ,TextInput
   ,Dimensions
   ,Platform
   ,ScrollView
   ,AsyncStorage
  } from 'react-native';
import { render } from 'react-dom';
import { AppLoading } from "expo"
import Todo from "./Todo";
import uuidv1 from "uuid/v1";


const { height,width} = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    newTodo : "",
    loadedToDos:false,
    toDos:{}
  }
  componentDidMount=()=>{
    this._loadToDos();
  }
  render() {
    const { newTodo , loadedToDos , toDos} = this.state;
    
    if( !loadedToDos ){
      return <AppLoading/>
    };
    const {text} = this.props;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content"/>
        <Text style={styles.title}>To do</Text>
        <View style={styles.card}>
          <TextInput 
          style={styles.input} 
          placeholder={"New To Do"}
          placeholderTextColor={"#999"}
          value={newTodo}
          onChangeText={this._controlNewTodo}
          returnKeyType={"done"}
          autoCorrect={false}
          onSubmitEditing={this._addTodo}
          />
          <ScrollView contentContainerStyle={styles.toDos}>
            {Object.values(toDos).reverse().map(todo=>
              <Todo 
                key={todo.id} 
                {...todo} 
                deleteTodo={this._deleteTodo}
                uncompleteTodo={this._uncompleteTodo}
                completeTodo={this._completeTodo}
                updateTodo={this._updateTodo}
                />
              )}
          </ScrollView>
        </View>
      </View>
    );
  } 
  _controlNewTodo = text=>{
    this.setState({
      newTodo:text
    });
  };
  _loadToDos=async()=>{
    try{
        const toDos =await AsyncStorage.getItem("toDos");
        const parsedToDos = JSON.parse( toDos );
        this.setState({loadedToDos:true , toDos: parsedToDos || {} });    
    }catch(err){
      console.log( err );
    }
    
  };
  _addTodo=()=>{
    const {newTodo} = this.state;
    if(newTodo != ""){
      this.setState(prevState=>{
        const ID = uuidv1();
        const newToDoObject ={
          [ID]:{
            id:ID,
            isCompleted:false,
            text:newTodo,
            createedAt: Date.now()
          }
        }
        const newState ={
          ...prevState,
          newTodo:"",
          toDos:{
            ...prevState.toDos,
            ...newToDoObject
          }
        }
        this._saveToDos(newState.toDos);
        return {...newState };
      })
    };
  };
  
  _deleteTodo=(id)=>{
    this.setState(prevState=>{
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState ={
       ...prevState,
       ...toDos 
      };
      this._saveToDos(newState.toDos);
      return {...newState};
    });
  };
  _uncompleteTodo =(id)=>{
   this.setState(prevState=>{
     const newState ={
        ...prevState,
        toDos:{
          ...prevState.toDos,
          [id]:{
            ...prevState.toDos[id],
            isCompleted:false
          }
        }
    };
    this._saveToDos(newState.toDos);
    return {...newState};
   }); 
  }
  _completeTodo =(id)=>{
    this.setState(prevState=>{
      const newState ={
         ...prevState,
         toDos:{
           ...prevState.toDos,
           [id]:{
             ...prevState.toDos[id],
             isCompleted:true
           }
         }
     };
     this._saveToDos(newState.toDos);
     return {...newState};
    }); 
  }
  _updateTodo = (id , text)=>{
    this.setState(prevState=>{
      const newState ={
         ...prevState,
         toDos:{
           ...prevState.toDos,
           [id]:{
             ...prevState.toDos[id],
             text:text
           }
         }
     };
     this._saveToDos(newState.toDos);
     return {...newState};
    }); 
  }
  _saveToDos = (newToDos) =>{
    const saveTodos = AsyncStorage.setItem("toDos",JSON.stringify(newToDos));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F23657',
    alignItems: 'center',
  },
  title:{
    color:"white",
    fontSize:30,
    marginTop:50,
    fontWeight:"200",
    marginBottom:30

  },
  card:{
    backgroundColor: 'white',
    flex:1,
    width: width - 25,
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    elevation:3,
    ...Platform.select({
      ios:{
        shadowColor:"rgb(50,50,50)",
        shadowOpacity:0.5,
        shadowRadius:5,
        shadowOffset:{
          height:-1,
          width:0
        }
      },
      android:{
        elevation:3
      }
    })
  },
  input:{
    padding:20,
    borderBottomColor:"#bbb",
    borderBottomWidth:1,
    fontSize:25
  },
  toDos:{
    alignItems:"center"
  }
});
