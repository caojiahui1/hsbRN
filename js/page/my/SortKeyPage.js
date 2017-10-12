import React, { Component } from 'react';
import {
    Text,
    Navigator,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    TouchableHighlight,
     Alert
} from 'react-native';
import NavigationBar from '../NavigationBar'
import LanguageDao,{FLAG_LANGUAGE} from '../../expand/dao/LanguageDao'
import ArrayUtils from '../../util/ArrayUtils'
import SortableListView from 'react-native-sortable-listview'
import ViewUtils from '../../util/ViewUtils'
export default class SortKeyPage extends Component {
    constructor(props) {
        super(props)
        this.dataArray=[];
        this.sortResultArray=[];
        this.originalCheckedArray=[];
        
        this.state = {
            checkedArray:[]
        }
    }
    componentDidMount(){
        this.languageDao = new LanguageDao(this.props.flag)
        this.loadData()
    }
    loadData(){
        this.languageDao.fetch()
            .then(result=>{
                this.getCheckedItems(result)
            }).catch(error=>{
                console.log(error)
            })
    }
    getCheckedItems(result){
        this.dataArray=result;
        let checkedArray=[];
        for(let i=0,len=result.length;i<len;i++){
            let data = result[i];
            if(data.checked)checkedArray.push(data);

        }
        this.setState({
            checkedArray:checkedArray
        })
        this.originalCheckedArray=ArrayUtils.clone(checkedArray)
    }
    onSave(haChecked) {
        if(!haChecked){
            if (ArrayUtils.isEqual(this.originalCheckedArray,this.state.checkedArray)) {
                this.props.navigator.pop();
                return;
            }
        }
        this.getSortResult();
        this.languageDao.save(this.sortResultArray);

        this.props.navigator.pop();
    }

    onBack() {
        if (!ArrayUtils.isEqual(this.originalCheckedArray,this.state.checkedArray)) {
            Alert.alert(
                'Confirm Exit',
                'Do you want to save your changes before exitting?',
                [
                    {
                        text: 'No', onPress: () => {
                        this.props.navigator.pop();
                    }
                    }, {
                    text: 'Yes', onPress: () => {
                        this.onSave(true);
                    }
                }
                ]
            )
        } else {
            this.props.navigator.pop();
        }
    }
    getSortResult(){
        this.sortResultArray = ArrayUtils.clone(this.dataArray)
        for(let i=0,len=this.originalCheckedArray.length;i<len;i++){
            let item=this.originalCheckedArray[i];
            let index=this.dataArray.indexOf(item);
            this.sortResultArray.splice(index,1,this.state.checkedArray[i])

        }
    }



    render() {

         let rightButton = <TouchableOpacity
            onPress={()=>this.onSave()}
        >
            <View style={{margin:10}}>
                <Text style={styles.title}>保存</Text>
            </View>
        </TouchableOpacity>

        let title = this.props.flag === FLAG_LANGUAGE.flag_language?'语言排序':'标签排序'
        return (
            <View style={styles.container}>
                <NavigationBar title={title}
                    style={{ backgroundColor: '#EE6363' }}
                    statusBar={{ backgroundColor: '#EE6363' }}
                    leftButton={ViewUtils.getLeftButton(()=>this.onBack())}
                    rightButton={rightButton}
                />
                
      
                <SortableListView
                    data={this.state.checkedArray}
                    order={Object.keys(this.state.checkedArray)}
                    onRowMoved={(e) => {
                        this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0]);
                        this.forceUpdate();
                    }}
                    renderRow={row => <SortCell data={row} {...this.props}/>}
                />
            </View>
        )
    }
}

class SortCell extends Component{
    render(){
        return <TouchableHighlight
                underlayColor={'#eee'}
                delayLongPress={500}
                style={styles.item}
                {...this.props.sortHandlers}
                >
                <View style={styles.row}>
                    <Image 
                    style={styles.image}
                    source={require('./img/ic_sort.png')}
                    tintColor={'#2196f3'}
                     />
                    <Text >{this.props.data.name}</Text>
                </View>
            
        </TouchableHighlight>

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
       
    },
    text: {
        fontSize: 20
    },
    item:{
        padding:25,
        backgroundColor:'#f8f8f8',
        borderColor:'#eee',
        borderBottomWidth:1
    },
    row:{
        flexDirection:'row',
        alignItems:'center'
    },
    image:{
        tintColor:'#2196f3',
        height:16,
        width:16,
        marginRight:10,
    },
     title:{
        fontSize:20,
        color:'white'
    },
})