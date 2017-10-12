import React,{Component} from 'react'
import {
    View,
    StyleSheet,
    Text,
    Navigator
} from 'react-native'
import WelcomePage from './WelcomePage'
function setUp(){
    class Root extends Component{
        renderScene(route,navigator){
            let Component=route.component;
            return <Component {...route.params} navigator={navigator}/>
        }
        
        render(){
            return <Navigator
                initialRoute={{component:WelcomePage}}   
                renderScene={(route,navigator)=>this.renderScene(route,navigator)}
            />
        }
    }
    return <Root/>
}
module.exports=setUp;