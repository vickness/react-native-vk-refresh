import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from "react-native";
import RefreshStatus from "./RefreshStatus";

export default class BaseRefreshFooter extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            footerText: "正在加载中",
            refreshStatus: RefreshStatus.FooterRefresh
        };
    }

    render() {
        const { footerText, refreshStatus } = this.state;
        return (
            <View style={styles.container}>
                { (refreshStatus === RefreshStatus.FooterRefresh) ? <ActivityIndicator style={styles.icon}/> : null }
                <Text style={styles.text}>{this.state.footerText}</Text>
            </View>
        )
    }

    /** 加载中*/
    onRefresh(){
        this.setState({
            footerText: "正在加载中",
            refreshStatus: RefreshStatus.FooterRefresh
        })
    };

    /** 加载完成*/
    onFinish(){
        this.setState({
            footerText: "数据加载完成",
            refreshStatus: RefreshStatus.FooterFinish
        })
    };

    /** 加载失败*/
    onFailure() {
        this.setState({
            footerText: "数据加载失败, 点击重试",
            refreshStatus: RefreshStatus.FooterFailure
        })
    }

    /** 数据为空*/
    onEmpty() {
        this.setState({
            footerText: "暂无数据",
            refreshStatus: RefreshStatus.FooterEmpty
        })
    }
}

const styles = StyleSheet.create({
    container: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    icon: {
        width:18,
        height:18,
        marginRight:10
    },
    text: {
        fontSize: 14,
        color: '#666'
    }
});
