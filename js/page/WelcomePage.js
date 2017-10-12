import React,{Component} from 'react'
import {
    View,
    StyleSheet,
    Text,
    Navigator
} from 'react-native'
import NavigationBar from './NavigationBar'
import HomePage from "./HomePage"
export default class WelcomePage extends Component{ 

        componentDidMount() {
        const {navigator} = this.props;
      
        this.timer = setTimeout(() => {
                navigator.resetTo({
                    component: HomePage,
                });
        
        }, 500);
    }
    componentWillUnmount(){
        this.timer&&clearTimeout(this.timer)
    }
    render(){
        return <View>
             {/* <NavigationBar
                title='欢迎'
            />  */}
            <Text>欢迎</Text>
        </View>
    }
}