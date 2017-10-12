/**
 * RepositoryDetail
 * @flow
 **/
'use strict'
import React, {Component} from 'react'
import {
    Image,
    ScrollView,
    StyleSheet,
    WebView,
    Platform,
    TouchableOpacity,
    Text,
    View,
} from 'react-native'
import NavigationBar from './NavigationBar'

import FavoriteDao from '../expand/dao/FavoriteDao'
import ViewUtils from '../util/ViewUtils'

const TRENDING_URL = 'https://github.com/'
var WEBVIEW_REF = 'webview';

export default class RepositoryDetail extends Component {
    constructor(props) {
        super(props);
       var url = this.props.projectModel.html_url ? this.props.projectModel.html_url
            : TRENDING_URL + this.props.projectModel.fullName;
        var title = this.props.projectModel.full_name ? this.props.projectModel.full_name
            : this.props.projectModel.fullName;
        this.state = {
            isFavorite: this.props.projectModel.isFavorite,
            favoriteIcon: this.props.projectModel.isFavorite ? require('../../res/images/ic_star.png') : require('../../res/images/ic_star_navbar.png'),
            url: url,
            canGoBack: false,
            title: title,
           // theme: this.props.theme
        }
    }

    componentDidMount() {
      console.log(this.props)
      this.favoriteDao = new FavoriteDao(this.props.flag);
    }

    componentWillUnmount() {
       
    }

    onNavigationStateChange(navState) {
        this.setState({
            canGoBack: navState.canGoBack,
            url: navState.url,
        });
    }

    onBack(){
        if(this.state.canGoBack){
            this.webView.goBack()
        }else{
            this.props.navigator.pop()
        }
    }

        setFavoriteState(isFavorite) {
        this.setState({
            isFavorite: isFavorite,
            favoriteIcon: isFavorite ? require('../../res/images/ic_star.png') : require('../../res/images/ic_star_navbar.png')
        })
    }

        onRightButtonClick() {//favoriteIcon单击回调函数
        var projectModel = this.props.projectModel;
        this.setFavoriteState(projectModel.isFavorite = !projectModel.isFavorite);
        var key = projectModel.fullName ? projectModel.fullName : projectModel.id.toString();
        if (projectModel.isFavorite) {
            this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel));
        } else {
            this.favoriteDao.removeFavoriteItem(key);
        }
    }

        renderRightButton() {
        return <TouchableOpacity
            onPress={()=>this.onRightButtonClick()}>
            <Image
                style={{width: 20, height: 20,marginRight:10}}
                source={this.state.favoriteIcon}/>
        </TouchableOpacity>
    }
    render() {
       
        return (
            <View style={styles.container}>
                <NavigationBar title={this.state.title}
                    style={{ backgroundColor: '#00a0ea' }}
                    statusBar={{ backgroundColor: '#00a0ea' }}
                    leftButton={ViewUtils.getLeftButton(()=>this.onBack())}
                    rightButton={this.renderRightButton()}
                />
                <WebView
                    ref={webView=>this.webView=webView}
                    startInLoadingState={true}
                    onNavigationStateChange={(e)=>this.onNavigationStateChange(e)}
                    source={{uri: this.state.url}}/>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        // marginBottom: Platform.OS === "ios" ? 50 : 0,
    },
})
