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

export default class RepositoryCell extends Component{
    constructor(props){
        super(props)
        this.state={
            isFavorite:false,
            favoriteIcon:require('../../res/images/ic_unstar_transparent.png'),
        }
    }
    // componentWillReceiveProps(nextProps){
    //     this.setFavoriteState(nextProps.projectModel.isFavorite)
    // }
   // onPressFavorite(){
     //this.setFavoriteState(!this.state.isFavorite);
     //this.props.onFavorite(this.props.projectModel,!this.state.isFavorite)
    //}
    // setFavoriteState(isFavorite){
    //     this.setState({
    //         isFavorite:isFavorite,
    //         favoriteIcon:isFavorite?require('../../res/images/ic_star.png'):
    //         require('../../res/images/ic_unstar_transparent.png'),
    //     })
    // }
        componentDidMount(){
        this.setFavoriteState(this.state.isFavorite)
    }
     componentWillReceiveProps(nextProps) {//当从当前页面切换走，再切换回来后
        this.setFavoriteState(nextProps.projectModel.isFavorite)
    }

    setFavoriteState(isFavorite) {
        this.props.projectModel.isFavorite = isFavorite;
        this.setState({
            isFavorite: isFavorite,
            favoriteIcon: isFavorite ? require('../../res/images/ic_star.png') : require('../../res/images/ic_unstar_transparent.png')
        })
    }

    onPressFavorite() {
        this.setFavoriteState(!this.state.isFavorite)
        this.props.onFavorite(this.props.projectModel, !this.state.isFavorite)
    }



    render(){
        let data  = this.props.projectModel;
        let favoriteButton=<TouchableOpacity
            onPress={()=>this.onPressFavorite()}
        >
            <Image source={this.state.favoriteIcon} style={[{width:22,height:22},{tintColor:'#2196f3'}]}/>
        </TouchableOpacity>
        return(
            <TouchableOpacity style={[styles.container,styles.cell_container]}
                onPress={this.props.onSelect}
            >
            <View style={{margin:10}}>
                <Text style={styles.title}>{this.props.projectModel.full_name}</Text>
                <Text style={styles.description}>{this.props.projectModel.description}</Text>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <View  style={{flexDirection:'row',alignItems:'center'}}>
                        <Text>Author:</Text>
                        <Image style={{width:20,height:20}} source={{uri: this.props.projectModel.owner.avatar_url}}/>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text>Stars:</Text>
                        <Text>{this.props.projectModel.stargazers_count}</Text>
                    </View>
                    {favoriteButton}
                </View>
                
            </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    title:{
        fontSize:16,
        marginBottom:2,
        color:'#212121'
    },
    description:{
        fontSize:14,
        marginBottom:2,
        color:'#757575',
    },
    cell_container:{
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
    }
})