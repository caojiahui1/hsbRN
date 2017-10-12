import React, { Component } from 'react';
import {
    Text,
    Navigator,
    View,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';
import NavigationBar from './NavigationBar'
export default class PopularPage extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    renderBtn(image) {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.navigator.pop()
                }
                }
            >
                <Image source={image} style={{ width: 20, height: 20, margin: 5 }} />
            </TouchableOpacity>
        )


    }
    render() {
        return (
            <View style={styles.container}>
                <NavigationBar title="老股转让"
                    style={{ backgroundColor: '#EE6363' }}
                    statusBar={{ backgroundColor: '#EE6363' }}
                   
                />
                <Text style={styles.text}>I am gril3333</Text>
                <Text style={styles.text}>我收到了男孩送的：{this.props.word}</Text>
                <Text style={styles.text}
                    onPress={() => {
                        this.props.onCallBack('一盒巧克力')
                        this.props.navigator.pop()
                    }}
                >回赠巧克力</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'yellow',
        // justifyContent: 'center',
        //  alignItems: 'center',
    },
    text: {
        fontSize: 20
    }
})