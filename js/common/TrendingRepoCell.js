/**
 *
 *
 * @flow
 */
'use strict';

import React, {Component} from 'react'
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableNativeFeedback,
    TouchableOpacity,
    View,
    Alert,
} from 'react-native'
import GlobalStyles from '../../res/styles/GlobalStyles'
import HTMLView from 'react-native-htmlview'
import WebViewPage from '../page/WebViewPage'

export default class TrendingRepoCell extends Component {
    constructor(props) {
        super(props);
        this.state = {
             isFavorite:false,
            favoriteIcon:require('../../res/images/ic_unstar_transparent.png'),
        };
    }

    onPressFavorite(){
     this.setFavoriteState(!this.state.isFavorite);
     //this.props.onFavorite(this.props.projectModel,!this.state.isFavorite)
    }
    setFavoriteState(isFavorite){
        this.setState({
            isFavorite:isFavorite,
            favoriteIcon:isFavorite?require('../../res/images/ic_star.png'):
            require('../../res/images/ic_unstar_transparent.png'),
        })
    }

    render() {
       // console.log(this.props.onSelect)
       //console.log()
        var item = this.props.projectModel;
       // console.log(item)
        let favoriteButton=<TouchableOpacity
            onPress={()=>this.onPressFavorite()}
        >
            <Image source={this.state.favoriteIcon} style={[{width:22,height:22},{tintColor:'#2196f3'}]}/>
        </TouchableOpacity>
        var TouchableElement = TouchableHighlight;
        var description='<p>'+item.description+'</p>';
        return (
            <TouchableOpacity
                onPress={this.props.onSelect}
                onShowUnderlay={this.props.onHighlight}
                underlayColor='transparent'
                onHideUnderlay={this.props.onUnhighlight}>
                <View style={styles.container}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={styles.title}>
                            {item.fullName}
                        </Text>

                    </View>
                
                    <HTMLView
                        value={description}
                        onLinkPress={(url) => {
                            this.props.navigator.push({
                                component: WebViewPage,
                                params: {
                                    title:url,
                                    url:url,
                                    ...this.props
                                },
                            });
                        }}
                        stylesheet={{
                            p:styles.description,
                            a:styles.description,
                        }}
                    />
                    <Text style={[styles.description, {fontSize: 14}]}>
                        {item.meta}
                    </Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={styles.author}>Built by  </Text>
                            {item.contributors.map((result, i, arr) => {
                                return <Image
                                    key={i}
                                    style={{width: 22, height: 22,margin:2}}
                                    source={{uri: arr[i]}}
                                />
                             })
                            }
                        </View>
                        <TouchableHighlight
                            style={{padding:6}}
                            onPress={()=>this.onPressFavorite()} underlayColor='transparent'>
                            {favoriteButton}
                        </TouchableHighlight>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}


var styles = StyleSheet.create({
     container: {
        flex: 1,
        padding:10,
         backgroundColor:'white',
        padding:10,
        marginLeft:5,
        marginRight:5,
        marginVertical:3,
        borderWidth:0.5,
        borderRadius:5,
        borderColor:'#ddd',
        shadowColor:'gray',
        shadowOffset:{width:0.5,height:0.5},
        shadowOpacity:0.4,
        shadowRadius:1,
        elevation:2
    },
    title: {
        fontSize: 16,
        marginBottom: 2,
        color: '#212121'
    },
    description: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575'
    },
    author: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575'
    },
});

