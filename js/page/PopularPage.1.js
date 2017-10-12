import React, { Component } from 'react';
import {
    Text,
    Navigator,
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    ListView,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import NavigationBar from './NavigationBar'
import Toast, { DURATION } from 'react-native-easy-toast'
import TrendingPage from './TrendingPage'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
export default class PopularPage extends Component {
    constructor(props) {
        super(props)
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        this.state = {
            result: '',
            loaded: false,
            isLoading: false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            
            a: 1,
            botLoading:false
        }
    }

    componentDidMount() {

        //this.myonLoad()

    }
    // renderFooter(botLoading) {
    //     //this.myonLoad()
    //     if(botLoading==true){
            
    //         return <ActivityIndicator />;
    //     }else{
    //         return;
    //     }
            
    //     }


    // myonLoad() {
    //     let that = this
    
    //     setTimeout(() => {
         
    //         this.setState({
    //             isLoading:true,
    //             botLoading:true
    //         })
    //         fetch('http://m.hongsanban.com/remote/cms/findNewsPage?pageNum=' + this.state.a + '&pageSize=20&time=1506232374752', { timeout: 10 }).then(response => response.json()).then(result => {
    //             this.setState({
    //                 dataSource: this.state.dataSource.cloneWithRows(result.body.list),
    //                 loaded: true,
    //                 isLoading: false,
    //                 a: this.state.a + 1,
    //                 botLoading:false
    //             }, function () {
    //                 this.toast.show('请求成功', DURATION.LENGTH_LONG)
    //             });

    //         }).catch(error => {
    //             this.setState({ result: 1 })

    //         })
    //     }, 2000)
    // }

    renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        return (
            <View key={rowID} style={styles.line}></View>
        )
    }


    renderLoadingView() {
        return (<View style={styles.container} >
            <NavigationBar title="资本视野"
                style={{ backgroundColor: '#EE6363' }}
                statusBar={{ backgroundColor: '#EE6363' }}

            />
            <Text>Loading movies......</Text>
        </View>

        );
    }


    renderMovie(movie) {
        //console.log(movie)
        return (
            <View style={styles.container}>
                {/* <Image
                     source={{uri: movie.posters.thumbnail}}
                     style={styles.thumbnail}
                 /> */}
                <TouchableOpacity onPress={
                    () => {
                        this.toast.show('你单击了：' + movie.id, DURATION.LENGTH_LONG)
                        this.props.navigator.push({
                            component: TrendingPage,
                            params: {
                                word: movie.id,
                                onCallBack: (word) => {
                                    this.setState({
                                        word: word
                                    })
                                }
                            }
                        })
                    }
                }>
                    <View style={styles.item}>
                        <View style={styles.itemImg}><Image style={{ width: 50, height: 50 }} source={{ uri: movie.image_url }} /></View>
                        <View style={styles.itemRight}>
                            <Text style={styles.text}>{movie.title}</Text>
                        </View>


                    </View>
                </TouchableOpacity>
            </View>
        );
    }


    render() {
        // if (!this.state.loaded) {
        //     return this.renderLoadingView();
        // }
        return (
            <View style={styles.container}>
                <NavigationBar title="资本视野"
                    style={{ backgroundColor: '#EE6363' }}
                    statusBar={{ backgroundColor: '#EE6363' }}

                />
                {/* <ListView
                    style={styles.listContainer}
                    dataSource={this.state.dataSource}
                    renderRow={(item) => this.renderMovie(item)}
                    renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => { this.renderSeparator(sectionID, rowID, adjacentRowHighlighted) }}
                    refreshControl={<RefreshControl
                        refreshing={this.state.isLoading}
                        onRefresh={() => this.myonLoad()} />}
                        renderFooter={()=>this.renderFooter(this.state.botLoading)}
                        
                /> */}
                <ScrollableTabView
                    renderTabBar={()=>{
                        <ScrollableTabBar/>
                    }}
                >
                    <Text tabLabel='java'>java</Text>
                    <Text tabLabel='ios'>ios</Text>
                    <Text tabLabel='android'>android</Text>
                    <Text tabLabel='php'>php</Text>
                </ScrollableTabView>
                <Toast ref={toast => { this.toast = toast }} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // justifyContent: 'center',
        //  alignItems: 'center',
    },
    listContainer: {
        padding: 10,
        marginBottom: 50,
    },
    text: {
        fontSize: 16
    },
    item: {
        height: 80,
        overflow: 'hidden',
        marginTop: 10,
        borderWidth: 2,
        borderColor: '#e3e3e3',
        flexDirection: 'row',
        // display:"flex",
        padding: 5,
    },
    line: {
        flex: 1,
        height: 1,
        width: 100,
        backgroundColor: 'black',

    },
    itemImg: {
        padding: 10,
        flex: 2,

    },
    itemRight: {
        flex: 8,
        paddingTop: 10,
    }

})