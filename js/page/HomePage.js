/**
 * 首页
 * @flow
 */

import React, { Component } from 'react';

import {
    StyleSheet,
    Image,
    View,
    Text,
    Navigator,
    DeviceEventEmitter
} from 'react-native'
import TabNavigator from 'react-native-tab-navigator'
import PopularPage from './PopularPage'
import TrendingPage from './TrendingPage'
import FavoritePage from './FavoritePage'
import MyPage from './my/MyPage'
import DataRepository from '../expand/dao/DataRepository'

import Toast,{DURATION} from 'react-native-easy-toast'
import ArrayUtils from '../util/ArrayUtils'

export var FLAG_TAB = {
    flag_popularTab: 'flag_popularTab', flag_trendingTab: 'flag_trendingTab',
    flag_favoriteTab: 'flag_favoriteTab', flag_myTab: 'flag_myTab'
}

const URL='https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=starts';

import ScrollsbleTabView,{} from 'react-native-scrollable-tab-view'

export default class HomePage extends Component {
    constructor(props) {
        super(props);

        this.dataRepository = new DataRepository();

        this.subscribers = [];
        this.changedValues = {
            favorite: { popularChange: false, trendingChange: false },
            my: { languageChange: false, keyChange: false, themeChange: false }
        };
        let selectedTab = this.props.selectedTab ? this.props.selectedTab : FLAG_TAB.flag_popularTab;
        this.state = {
            selectedTab: selectedTab,
            //theme: this.props.theme
            text:'',
            result:''
        };
    }

    componentDidMount() {
        this.listen = DeviceEventEmitter.addListener('showToast',(text)=>{
            this.toast.show(text,DURATION.LENGTH_LONG)
        })
    }
    componentDidUnMount(){
        this.listen&&this.listen.remove()
    }
    onload(){
        let url = this.getUrl(this.text)
        this.dataRepository.fetchNetRepository(url)
            .then(result=>{

            })
    }

    getUrl(key){
        return URL+key+QUERY_STR
    }

    addSubscriber(subscriber) {
        ArrayUtils.add(this.subscribers, subscriber);
    }

    removeSubscriber(subscriber) {
        ArrayUtils.remove(this.subscribers, subscriber);
    }

    onSelected(object) {
        // if (this.updateFavorite && 'popularTab' === object)this.updateFavorite(object);

        if (object !== this.state.selectedTab) {
            this.subscribers.forEach((item, index, arr) => {
                if (typeof (item) == 'function') item(this.state.selectedTab, object);
            })
        }
        if (object === FLAG_TAB.flag_popularTab) this.changedValues.favorite.popularChange = false;
        if (object === FLAG_TAB.flag_trendingTab) this.changedValues.favorite.trendingChange = false;

        this.setState({
            selectedTab: object,
        })

    }


    onReStart(jumpToTab) {
        this.props.navigator.resetTo({
            component: HomePage,
            name: 'HomePage',
            params: {
                ...this.props,
               // theme: this.state.theme,
                selectedTab: jumpToTab,
            }
        });
    }

    _renderTab(Component, selectedTab, title, renderIcon) {
        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === selectedTab}
                title={title}
                selectedTitleStyle={[styles.selectColor]}
                renderIcon={() => <Image style={styles.tabBarIcon}
                    source={renderIcon} />}
                renderSelectedIcon={() => <Image
                    style={[styles.tabBarSelectedIcon]}
                    source={renderIcon} />}
                onPress={() => this.onSelected(selectedTab)}>
                <Component {...this.props} homeComponent={this} />
            </TabNavigator.Item>
        )
    }





    render() {
        return (
            <View style={styles.container}>
                <TabNavigator
                    tabBarStyle={{ opacity: 0.9, }}
                    sceneStyle={{ paddingBottom: 0 }}
                >
                    {this._renderTab(PopularPage, FLAG_TAB.flag_popularTab, '资本视野', require('../../res/images/ic_polular.png'))}
                    {this._renderTab(TrendingPage, FLAG_TAB.flag_trendingTab, '资本需求', require('../../res/images/ic_trending.png'))}
                    {this._renderTab(FavoritePage, FLAG_TAB.flag_favoriteTab, '老股转让', require('../../res/images/ic_favorite.png'))}
                    {this._renderTab(MyPage, FLAG_TAB.flag_myTab, '我的', require('../../res/images/ic_my.png'))}
                </TabNavigator>
                <Toast ref={toast=>this.toast=toast}/>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    page1: {
        flex: 1,
        backgroundColor: "#2196f3"
    },
    page2: {
        flex: 1,
        backgroundColor: "yellow"
    },
    image: {
        width: 20,
        height: 20
    },
    tabBarIcon: {
        width: 26, height: 26,
        resizeMode: 'contain',
    },
    tabBarSelectedIcon: {
        width: 26, height: 26,
        resizeMode: 'contain',
         tintColor:'#2196f3'
    },
    selectColor:{
        color:'#2196f3',
       
    }

})
