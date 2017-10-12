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
    ActivityIndicator,
    DeviceEventEmitter,
    Dimensions,
} from 'react-native';
import NavigationBar from './NavigationBar'

import DataRepository, { FLAG_STORAGE } from '../expand/dao/DataRepository'

import Label from 'teaset/components/Label/Label';
import Select from 'teaset/components/Select/Select';
import Toast from 'teaset/components/Toast/Toast';
import Badge from 'teaset/components/Badge/Badge';
import PullRefreshScrollView from 'react-native-pullrefresh-scrollview';

var Screen_Width = Dimensions.get('window').width;
var Screen_Height = Dimensions.get('window').height;
let zongArr = []
export default class PopularPage extends Component {
    constructor(props) {
        super(props)
        this.items = [
            {
                id: 0,
                name: '类型：全部',
            },
            {
                id: 2,
                name: '供',
            },
            {
                id: 1,
                name: '求',
            }
        ];

        this.result = []
        this.result2 = []
        this.state = {
            isLoading: true,
            valueCustom: '类型：全部',
            value: '类型：全部',
            customItems: [],

            defaultArr: [{
                id: 0,
                name: '类型：全部'
            }],
            pageNum: 1,
            demandTypeId: 0,
            supplyDemandType: 0,
            demandList: [],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            isLoadData: false,
            loadText: '加载中....',
            isLoad: true,
        }


    }

    componentDidMount() {


        Toast.message('Toast message');
        this.selectData()
        this.onRefresh()
    }
    onRefresh() {
        // this.setState({pageNum:1})
        // this.loadData(true)
        let that = this
        this.setState({
            isLoading: true,
            pageNum: 1
        }, function () {
            console.log(this.state.pageNum)

            fetch('http://m.hongsanban.com/remote/appDemand/findAPPDemandList?demandTypeId=' + this.state.demandTypeId + '&supplyDemandType=' + this.state.supplyDemandType + '&pageNum=1&time=1507689974824')
                .then((response) => response.json())
                .then((responseData) => {
                    console.log(this.state.pageNum, responseData.body.totalPage)
                    this.setState({ loadText: '' })
                    if (this.state.pageNum > responseData.body.totalPage) {
                        //Toast.message('没有更多数据了')
                        that.setState({ loadText: '没有更多数据了' })
                        that.setState({
                            isLoading: false,
                            isLoadData: true,
                            isLoad: false,
                        })
                        return
                    }

                    that.result = responseData.body.list

                    console.log('数据的长度：' + that.result.length)
                    this.setState({ dataSource: this.getDataSource(that.result), isLoading: false, isLoadData: false, isLoad: true }, () => {
                        // Toast.message('加载完成')
                    })

                }).done();
        })


    }
    selectData() {
        let url = 'http://m.hongsanban.com/remote/appDemand/getDemandTypeList?time=1507628423720'

        fetch(url)
            .then((response) => response.json())
            .then((responseData) => {

                let tempArr = this.state.defaultArr.concat(responseData.body.queryDemandTypeList)
                this.setState({ customItems: tempArr })

            }).done();
    }

    getDataSource(items) {
        return this.state.dataSource.cloneWithRows(items);
    }

    onSelect(item) {
        //console.log(item)
        // this.props.navigator.push({
        //     component:RepositoryDetail,
        //     params:{
        //         item:item,
        //         ...this.props
        //     }
        // })
        Toast.message('你点击了' + item.title);
    }

    renderRow(data) {
        let { navigator } = this.props;
        return (
            <DemandListCell
                data={data}
                key={data.id}
                onSelect={() => {
                    this.onSelect(data)
                }}
            />
            // <View style={{flex:1,height:10}}>
            //     <Text>{data.title}</Text>
            // </View>
        );
    }

    loadData() {
        let that = this
        let pageNum


        pageNum = this.state.pageNum + 1
        this.setState({
            pageNum: pageNum,
            isLoadData: true,
            isLoad: false,
        }, function () {
            console.log(this.state.pageNum)

            fetch('http://m.hongsanban.com/remote/appDemand/findAPPDemandList?demandTypeId=' + this.state.demandTypeId + '&supplyDemandType=' + this.state.supplyDemandType + '&pageNum=' + this.state.pageNum + '&time=1507689974824')
                .then((response) => response.json())
                .then((responseData) => {
                    console.log(this.state.pageNum, responseData.body.totalPage)
                    this.setState({ loadText: '' })
                    if (this.state.pageNum > responseData.body.totalPage) {
                        //Toast.message('没有更多数据了')
                        that.setState({ loadText: '没有更多数据了' })
                        that.setState({
                            isLoading: false,
                            isLoadData: true,
                            isLoad: false,
                        })
                        return
                    }


                    if (that.result.length > 0) {
                        that.result = that.result.concat(responseData.body.list)

                        console.log(that.result)
                    } else {
                        that.result = responseData.body.list
                        console.log(that.result)
                    }
                    //let pageNum = this.state.pageNum + 1
                    console.log('数据的长度：' + that.result.length)
                    this.setState({ dataSource: this.getDataSource(that.result), isLoading: false, isLoadData: false, isLoad: true }, () => {
                        // Toast.message('加载完成')
                    })




                }).done();
        })





    }


    renderSelect() {
        let that = this
        return (
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                {this.state.customItems.length > 0 ? <Select
                    style={{ flex: 1, marginLeft: 5, marginRight: 5, }}
                    value={this.state.demandTypeId}
                    valueStyle={{ flex: 1, color: '#8a6d3b', textAlign: 'center' }}
                    items={this.state.customItems}
                    getItemValue={(item, index) => item.id}
                    getItemText={(item, index) => item.name}
                    iconTintColor='#8a6d3b'
                    placeholder='Select item'
                    pickerTitle='融资类型'
                    onSelected={(item, index) => {
                        that.setState({ demandTypeId: item.id, pageNum: 1 }, function () {
                            Toast.message(this.state.demandTypeId);
                            that.result = []
                            that.onRefresh()
                        })
                    }}
                /> : null}
                <Select
                    style={{ flex: 1, marginLeft: 5, marginRight: 5, }}
                    value={this.state.supplyDemandType}
                    valueStyle={{ flex: 1, color: '#8a6d3b', textAlign: 'center' }}
                    items={this.items}
                    placeholder='Select item'
                    pickerTitle='供求类型'
                    getItemValue={(item, index) => item.id}
                    getItemText={(item, index) => item.name}
                    onSelected={(item, index) => {
                        this.setState({ supplyDemandType: item.id, pageNum: 1 }, () => {
                            Toast.message(this.state.supplyDemandType)
                            that.result = []
                            that.onRefresh()
                        })
                    }}
                />
            </View>
        )
    }


    renderNav() {

        return (
            <NavigationBar title="最热"
                style={{ backgroundColor: '#00a0ea' }}
                statusBar={{ backgroundColor: '#00a0ea' }}
            />
        )
    }

    _scroll(event) {

        let y = event.nativeEvent.contentOffset.y;
        let height = event.nativeEvent.layoutMeasurement.height;
        let contentHeight = event.nativeEvent.contentSize.height;
        // console.log('offsetY-->' + y);
        // console.log('height-->' + height);
        // console.log('contentHeight-->' + contentHeight);
        // console.log('下拉总高度:'+(y+height)+'...屏幕高度：'+contentHeight)
        if (y + height >= contentHeight - 50) {
            // Toast.message('上拉加载到底了')

            if (this.result.length > 0) {
                if (this.state.isLoad == true) {
                    this.loadData()
                }
            }
        }
    }

    renderDemandList() {
        let content =
            <ListView
                ref="listView"
                style={styles.listView}
                renderRow={(e) => this.renderRow(e)}
                renderFooter={() => {
                    return this.state.isLoadData ?
                        <View style={{ height: 50, alignItems: 'center', flex: 1, paddingTop: 15 }}>
                            <Text style={{ textAlign: 'center', }}>{this.state.loadText}</Text>
                        </View>
                        : null
                }}
                enableEmptySections={true}
                dataSource={this.state.dataSource}
                onScroll={(event) => {
                    this._scroll(event);
                }}

                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isLoading}
                        onRefresh={() => this.onRefresh()}
                        title="Loading..."

                    />}

            />;

        return content

    }
    renderBlock() {
        return (
            <View style={{ height: 50 }}>

            </View>
        )
    }

    render() {

        return (
            <View style={styles.container}>
                {this.renderNav()}

                {this.renderSelect()}


                {/* <Image style={{height:120,}} resizeMode ='stretch' source={require('../../res/images/liebiaologo.jpg')} /> */}


                {this.renderDemandList()}
                {this.renderBlock()}
            </View>
        )
    }
}


class DemandListCell extends Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        //console.log(this.props.data, 'ok')
    }
    render() {
        return (
            <TouchableOpacity style={[styles.cell_container]}
                onPress={this.props.onSelect}
            >
                <View style={{ margin: 10, position: 'relative', padding: 5 }}>
                    <Text style={styles.title}>{this.props.data.title}</Text>
                    <View style={[{ flexDirection: 'row', alignItems: 'flex-start', borderWidth: 2, borderRadius: 50, padding: 3, position: 'absolute', right: 0, top: 0 }, this.props.data.supplyDemandType === 2 ? { borderColor: '#00a0ea' } : { borderColor: '#E70012' },]}>
                        <Text style={[{}, this.props.data.supplyDemandType === 2 ? { color: '#00a0ea' } : { color: '#E70012' }]}>{this.props.data.supplyDemandType === 2 ? '供' : '求'}</Text>
                    </View>
                    {/* <Text style={styles.description}>{this.props.data.description}</Text> */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text>类型:</Text>
                            {/* <Image style={{width:20,height:20}} source={{uri: this.props.data.demandTypeString}}/> */}
                            {/* <Text>{this.props.data.demandTypeString}</Text> */}
                            <Badge style={[this.props.data.supplyDemandType === 2 ? { backgroundColor: '#00a0ea' } : { backgroundColor: '#E70012' },]} type='square' count={this.props.data.demandTypeString} />
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text>浏览:</Text>
                            <Text>{this.props.data.pv}</Text>
                        </View>

                    </View>

                </View>
            </TouchableOpacity>
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
    listView:{
        marginTop:10,
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
    },
    title: {
        fontSize: 16,
        marginBottom: 10,
        color: '#212121',
        paddingRight: 20
    },
    description: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575',
    },
    cell_container: {
        backgroundColor: 'white',
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        marginVertical: 3,
        borderWidth: 0.5,
        borderRadius: 5,
        borderColor: '#ddd',
        shadowColor: 'gray',
        shadowOffset: { width: 0.5, height: 0.5 },
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation: 2
    }
})