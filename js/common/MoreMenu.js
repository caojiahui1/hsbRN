/**
 * 更多菜单
 * @flow
 */
'use strict';
import React, {Component,PropTypes} from 'react'
import {
    ListView,
    StyleSheet,
    RefreshControl,
    TouchableHighlight,
    Text,
    Image,
    Linking,
    View,
} from 'react-native'

export const MORE_MENU = {
    Custom_Language:'Custom Language',
    Sort_Language:'Sort Language',
    Custom_Theme:'Custom Theme',
    Custom_Key:'Custom Key',
    Sort_Key:'Sort Key',
    Remove_Key:'Remove Key',
    About_Author:'About Author',
    About:'About',
    Website:'Website',
    Feedback:'Feedback',
}

export default class MoreMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            buttonRect: {},
        }
    }

    static propTypes = {
        contentStyle: View.propTypes.style,
        menus:PropTypes.array,
    }








}