/**
 * TrendingPage
 * @flow
 */
'use strict';
import React, { Component } from "react";
import {
    ListView,
    StyleSheet,
    RefreshControl,
    View,
    TouchableHighlight,
    Text,
    Image,
    DeviceEventEmitter,
    TouchableOpacity
} from "react-native";
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view'
import NavigationBar from './NavigationBar'
import ViewUtils from '../util/ViewUtils'
import TrendingRepoCell from "../common/TrendingRepoCell";
import RepositoryDetail from "./RepositoryDetail";
import DataRepository, { FLAG_STORAGE } from '../expand/dao/DataRepository'
import LanguageDao, { FLAG_LANGUAGE } from '../expand/dao/LanguageDao'
import TimeSpan from '../model/TimeSpan'
import Popover from '../common/Popover'
let dataRepository = new DataRepository(FLAG_STORAGE.flag_trending)
import Utils from '../util/Utils'
const API_URL = 'https://github.com/trending/'
let timeSpanTextArray = [
    new TimeSpan('今 天','since=daily'),
    new TimeSpan('本 周','since=weekly'),
    new TimeSpan('本 月','since=monthly'),
]
import FavoriteDao from '../expand/dao/FavoriteDao'
let favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending)
export default class TrendingPage extends Component {
    constructor(props) {
        super(props);
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_language);
       
        this.state = {
            languages: [],
            isVisible:false,
            buttonRect:{},
            timeSpan: timeSpanTextArray[0],
        };
    }

    componentDidMount() {
        this.loadLanguage();
    }




    loadLanguage() {
        this.languageDao.fetch().then((languages) => {
            if (languages) {
                this.setState({
                    languages: languages,
                });
            }
        }).catch((error) => {

        });
    }

    renderTitleView(){
        return(
            <View>
                <TouchableOpacity 
                    ref='button'
                    onPress={()=>this.showPopover()}
                    >
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text style={{
                            fontSize:18,
                            color:'white',
                            fontWeight:'400',
                            
                        }}>趋势{this.state.timeSpan.showText}</Text>
                        <Image style={{width:12,height:12,marginLeft:5}} source={require('../../res/images/ic_spinner_triangle.png')}/>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    showPopover() {
        this.refs.button.measure((ox, oy, width, height, px, py) => {
            this.setState({
                isVisible: true,
                buttonRect: {x: px, y: py, width: width, height: height}
            });
        });
    }

    closePopover() {
        this.setState({isVisible: false});
    }

    onSelectTimeSpan(timeSpan) {
        this.closePopover();
        this.setState({
            timeSpan: timeSpan
        })
    }


    render() {
        let content = this.state.languages.length > 0 ?
            <ScrollableTabView
                tabBarUnderlineColor='#e7e7e7'
                tabBarInactiveTextColor='mintcream'
                tabBarActiveTextColor='white'
                tabBarBackgroundColor='#00a0ea'
                ref="scrollableTabView"
                initialPage={0}
                renderTabBar={() => <ScrollableTabBar style={{ height: 40, borderWidth: 0, elevation: 2 }} tabStyle={{ height: 39 }}
                    underlineHeight={2} />}

            >
                {this.state.languages.map((result, i, arr) => {
                    var language = arr[i];
                    return language && language.checked ?
                        <TrendingTab key={i} timeSpan={this.state.timeSpan} {...this.props} theme={'#00a0ea'}
                            tabLabel={language.name} /> : null;
                })}
            </ScrollableTabView>
            : null;

        let navigationBar =
            <NavigationBar
                titleView={this.renderTitleView()}
                title="趋势"
                style={{ backgroundColor: '#00a0ea' }}
                statusBar={{ backgroundColor: '#00a0ea' }} />;
        let timeSpanView = <Popover
                                isVisible={this.state.isVisible}
                                fromRect={this.state.buttonRect}
                                placement='bottom'
                                onClose={()=>this.closePopover()}
                                contentStyle={{backgroundColor:'#343434',opacity:0.9}}
                                >
                                {timeSpanTextArray.map((result,i,arr)=>{
                                   return(
                                       <TouchableOpacity key={i} onPress={()=>this.onSelectTimeSpan(arr[i])} >
                                            <Text
                                                style={{fontSize:18,color:'#fff',fontWeight:'400',
                                                        padding:10
                                                        }}
                                            >{arr[i].showText}</Text>
                                       </TouchableOpacity>
                                   )
                                })}
                                
                                
                                </Popover>
                
        return (
            <View style={styles.container}>
                {navigationBar}
                {content}
                {timeSpanView}
            </View>
        );
    }

}


class TrendingTab extends Component {
    constructor(props) {
        super(props);
        this.isRender = true;
        
        this.state = {
            isLoading: false,
            isLodingFail: false,
            items: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            favoriteKeys: []

        };
    }

    componentDidMount() {

        this.loadData(this.props.timeSpan,true);
    }

     flushFavoriteState() {//更新ProjectItem的Favorite状态
        let projectModels = [];
        let items = this.items;
        for (var i = 0, len = items.length; i < len; i++) {
            projectModels.push(new ProjectModel(items[i], Utils.checkFavorite(items[i], this.state.favoritKeys)));
        }
        this.setState({
            isLoading: false,
            isLoadingFail: false,
            dataSource: this.getDataSource(projectModels),
        });
    }

    getDataSource(items) {
        return this.state.dataSource.cloneWithRows(items);
    }
    getFavoriteKeys() {
        favoriteDao.getFavoriteKeys().then(keys => {
            if (keys) {
                this.setState({ favoriteKeys: keys })
            }
            //this.flushFavoriteState()
        }).catch(e => {
            //this.flushFavoriteState()
        })
    }


    componentWillReceiveProps(nextProps) {
        if(nextProps.timeSpan!==this.props.timeSpan){
            this.loadData(nextProps.timeSpan)
        }
    }

 loadData(timeSpan,isRefresh) {
        this.setState({ isLoading: true })

        let url = this.genFetchUrl(timeSpan,this.props.tabLabel)
        dataRepository.fetchRepository(url).then(result => {
            this.item = result && result.items ? result.items : result ? result : [];
            //result && result.items ? result.items : result ? result : [];
       this.getFavoriteKeys()
             this.setState({
                    result: JSON.stringify(result),
                    dataSource: this.state.dataSource.cloneWithRows(this.item),
                    isLoading: false
                })
            if (result && result.update_date && dataRepository.checkData(result.update_date)) {
                DeviceEventEmitter.emit('showToast', '数据过时')
                return dataRepository.fetchNetRepository(url)
            } else {
                DeviceEventEmitter.emit('showToast', '显示缓存数据')
            }

        }).then(items => {
                console.log(items,'哈哈')
                if (!items || items.length === 0) return;
               this.getFavoriteKeys()
                this.setState({
                    result: JSON.stringify(result),
                    dataSource: this.state.dataSource.cloneWithRows(items),
                    isLoading: false
                })
                DeviceEventEmitter.emit('showToast', '显示网络数据')
                
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    isLoading: false
                })
            })
    }
    genFetchUrl(timeSpan,category) {//objective-c?since=daily
        return API_URL  +category+'?'+timeSpan.searchText;
    }

    onSelect(item){
            //console.log(item)
        this.props.navigator.push({
            component:RepositoryDetail,
            params:{
                item:item,
                ...this.props
            }
        })
    }
    onSelectRepository(projectModel) {
        //console.log(111)
        var item = projectModel.item;
        this.props.navigator.push({
            title: projectModel.fullName,
            component: RepositoryDetail,
            params: {
                projectModel: projectModel,
                parentComponent: this,
                flag: FLAG_STORAGE.flag_trending,
                ...this.props
            },
        });
    }

    onFavorite(item, isFavorite) {//favoriteIcon单击回调函数
        if (isFavorite) {
            favoriteDao.saveFavoriteItem(item.fullName, JSON.stringify(item));
        } else {
            favoriteDao.removeFavoriteItem(item.fullName);
        }
    }
   renderRow(projectModel, sectionID, rowID) {
        let {navigator}=this.props;
        console.log(projectModel)
        return (
            <TrendingRepoCell
                key={projectModel.fullName}
                onSelect={()=>this.onSelectRepository(projectModel)}
               // theme={this.state.theme}
                {...{navigator}}
                projectModel={projectModel}
                onFavorite={(projectModel, isFavorite)=>this.onFavorite(projectModel, isFavorite)}/>
        );
    }
    // renderRow(data) {
    //     let { navigator } = this.props;
    //     return (
    //         <TrendingRepoCell
    //             data={data}
    //             key={data.id}
    //             onSelect={() => {
    //                 this.onSelect(data)
    //             }}
    //         />
    //     );
    // }

onRefresh(){
    this.loadData(this.props.timeSpan)
}

    render() {
        var content =
            <ListView
                ref="listView"
                style={styles.listView}
                renderRow={(e) => this.renderRow(e)}
                renderFooter={() => {
                    return <View style={{ height: 50 }} />
                }}
                enableEmptySections={true}
                dataSource={this.state.dataSource}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isLoading}
                        onRefresh={() => this.onRefresh()}

                        title="Loading..."


                    />}
            />;
       
        
        return (
            <View style={styles.container}>
                {content}
                
            </View>
        );
    }


   

}

var styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listView: {
        // marginTop:-20,
    },
});
