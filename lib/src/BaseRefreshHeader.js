import React from 'react';
import {View, Text, Image, StyleSheet, ActivityIndicator} from "react-native";
import RefreshStatus from "./RefreshStatus";

const SuccessIcon = require('./res/success.png');
const FailureIcon = require('./res/failure.png');
const ArrowDownIcon = require('./res/arrow_down.png');
const ArrowUpIcon = require('./res/arrow_up.png');

export default class BaseRefreshHeader extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            headerText: "下拉刷新",
            iconSource: ArrowDownIcon,
            refreshStatus: RefreshStatus.HeaderIdle
        }
    }

    render() {
        const { headerText, refreshStatus, iconSource } = this.state;
        return (
            <View style={styles.container}>
                {
                    (refreshStatus === RefreshStatus.HeaderRefresh)
                        ? <ActivityIndicator style={styles.icon}/>
                        : <Image style={styles.icon} source={iconSource}/>
                }
                <Text style={styles.text}>{headerText}</Text>
            </View>
        )
    }

    /** 下拉准备中*/
    onPrepare(offset) {
        if (this.state.refreshStatus === RefreshStatus.HeaderIdle) return;
        this.setState({
            headerText: "下拉刷新",
            iconSource: ArrowDownIcon,
            refreshStatus: RefreshStatus.HeaderIdle
        });
    }

    /** 松开立即刷新*/
    onBegin(offset) {
        if (this.state.refreshStatus === RefreshStatus.HeaderBegin) return;
        this.setState({
            headerText: "释放刷新",
            iconSource: ArrowUpIcon,
            refreshStatus: RefreshStatus.HeaderBegin
        });
    }

    /** 刷新中*/
    onRefresh(){
        this.setState({
            headerText: "正在刷新",
            refreshStatus: RefreshStatus.HeaderRefresh
        })
    };

    /** 刷新结束*/
    onFinish() {
        this.setState({
            headerText: "刷新完成",
            iconSource: SuccessIcon,
            refreshStatus: RefreshStatus.HeaderFinish
        });
    }

    /** 刷新失败*/
    onFailure() {
        this.setState({
            headerText: "刷新失败",
            iconSource: FailureIcon,
            refreshStatus: RefreshStatus.HeaderFailure
        });
    }
}

const styles = StyleSheet.create({
    container: {
        height: 60,
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
