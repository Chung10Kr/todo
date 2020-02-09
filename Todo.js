import React from 'react';
import {
   StyleSheet
   ,Text
   ,View
   ,TouchableOpacity
   ,Dimensions
   ,TextInput
  } from 'react-native';
import { render } from 'react-dom';
import PropTypes from "prop-types";

const { height,width} = Dimensions.get("window");

export default class Todo extends React.Component {
  constructor(props){
      super(props);
      this.state = {
          isEditing : false,
          toDoValue : props.text
      };
  }
  static propTypes = {
      text: PropTypes.string.isRequired,
      isCompleted: PropTypes.bool.isRequired,
      deleteTodo : PropTypes.func.isRequired,
      id:PropTypes.string.isRequired
  }
  state={
      isEditing:false,
      toDoValue:""
  }
  render() { 
    const {isCompleted , isEditing, toDoValue} = this.state;
    const {text , id , deleteTodo} = this.props;
    return (
    <View style={styles.container}>
        <View style={styles.column}>
            <TouchableOpacity onPress={this._toggleComplete}>
                <View style={[
                    styles.circle,
                    isCompleted ? styles.completedCircle : styles.uncompletedCircle
                ]}/>
            </TouchableOpacity>
            { isEditing ? (
                <TextInput 
                style={[
                    styles.text,
                    styles.input,
                    isCompleted ? styles.completedText : styles.unCompletedText
                    ]} 
                value={toDoValue}
                multiline={true}
                onChangeText={this._controllInput}
                returnKeyType={"done"}
                onBlur={this._finishEditing}
                 />
            ) : (
                <Text 
                style={[
                    styles.text ,
                    isCompleted ? styles.completedText : styles.unCompletedText
                    ]}>
                    {text}
                </Text>
            )}
            
        </View>
        {isEditing ? (
            <View style={styles.actions}>
                <TouchableOpacity onPressOut={this._finishEditing}>
                    <View style={styles.actionContainer}>
                        <Text style={styles.actionText}>
                        ✅
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>   
        ) : (
            <View style={styles.actions}>
                <TouchableOpacity onPressOut={this._startEditing}>
                    <View style={styles.actionContainer}>
                        <Text style={styles.actionText}>
                            ✏️
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPressOut={()=>deleteTodo(id)}
                >
                    <View style={styles.actionContainer}>
                        <Text style={styles.actionText}>
                            ❌
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )}
    </View>
    );
  }
  _toggleComplete=()=>{
    this.setState(preState=>{
        return({
            isCompleted : !preState.isCompleted
        })
    })
  } 
  _startEditing=()=>{
    this.setState({
        isEditing:true,
    });
  }
  _finishEditing=()=>{
    this.setState({
        isEditing:false
    });
  }
  _controllInput=text=>{
      this.setState({
        toDoValue:text
      })
  }
}

const styles = StyleSheet.create({
  container:{
    width:width-50,
    borderBottomColor:"#bbb",
    borderBottomWidth:StyleSheet.hairlineWidth,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between"
  },
  circle:{
    width:30,
    height:30,
    borderRadius:15,
    borderWidth:3,
    marginRight:20,
    
  },
  text:{
    fontWeight:"600",
    fontSize:20,
    marginVertical:20
  },
  completedCircle:{
    borderColor:"#bbb",    
  },
  uncompletedCircle:{
    borderColor:"#F23657",    
  },
  completedText:{
    color: "#bbb",
    textDecorationLine:"line-through"
  },
  unCompletedText:{
    color: "#353839"
  },
  column:{
    flexDirection:"row",
    alignItems:"center",
    width:width/2
  },
  actions:{
      flexDirection:"row"
  },
  actionContainer:{
      marginVertical:10,
      marginHorizontal:10
  },
  input:{
    width:width/2,
    marginVertical:15,
    paddingBottom:5
    

  }
  
});
