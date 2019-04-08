import React from "react";
import {
    Platform,
    FlatList,
    TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import RefreshStatus from "./RefreshStatus";
import BaseRefreshFooter from "./BaseRefreshFooter";

class DefaultRefreshComponent extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            refreshStatus: RefreshStatus.HeaderIdle,
            showFooter: props.autoLoading
        };
    }

    componentDidMount() {

        if (this.props.autoLoading) {
            this.beginRefreshing();
        }
    }

    render() {
        const { ContentComponent, FooterComponent, onHeaderRefresh, onFooterRefresh, ...others } = this.props;

        // 设置下拉刷新属性
        const headerProps = onHeaderRefresh ? {
            onRefresh: this._onRefresh,
            refreshing: (this.state.refreshStatus === RefreshStatus.HeaderBegin || this.state.refreshStatus === RefreshStatus.HeaderRefresh)
        } : {};

        // 设置上拉加载属性
        const footerProps = (this.state.showFooter || onFooterRefresh) ? {
            ListFooterComponent: (
                <TouchableOpacity onPress={this._onFooterReload} disabled={this.state.refreshStatus !== RefreshStatus.FooterFailure}>
                    <FooterComponent ref={o => this.footerRef = o}/>
                </TouchableOpacity>
            ),
            onEndReachedThreshold: 0.01,
            onEndReached: this._onEndReached
        } : {};

        return (
            <ContentComponent
                ref={o => this.contentRef = o}
                onScrollEndDrag={this._onScrollEndDrag}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                {...others}
                {...headerProps}
                {...footerProps}
            />
        );
    }


    /** 设置下拉刷新状态*/
    _setRefreshStatus(status) {
        this.setState({
            refreshStatus: status,
            showFooter: (status === RefreshStatus.FooterEmpty)
        });
    }

    /** 设置上拉加载状态*/
    _setFooterStatus(status) {
        if (!this.footerRef) return;
        switch (status) {
            case RefreshStatus.FooterRefresh:
                this.footerRef.onRefresh();
                break;
            case RefreshStatus.FooterFinish:
                this.footerRef.onFinish();
                break;
            case RefreshStatus.FooterFailure:
                this.footerRef.onFailure();
                break;
            case RefreshStatus.FooterEmpty:
                this.footerRef.onEmpty();
                break;
        }
    }

    /** 设置刷新回调*/
    _setHeaderRefreshNotify() {
        // 设置为刷新状态
        this._setRefreshStatus(RefreshStatus.HeaderRefresh);
        this.props.onHeaderRefresh && this.props.onHeaderRefresh(status => {
            this._setRefreshStatus(status);
            this._setFooterStatus(status);
        });
    }

    /** 设置加载回调*/
    _setFooterRefreshNotify() {
        // 设置为加载状态
        this._setRefreshStatus(RefreshStatus.FooterRefresh);
        this.footerRef.onRefresh();
        this.props.onFooterRefresh && this.props.onFooterRefresh(status => {
            this._setRefreshStatus(status);
            this._setFooterStatus(status);
        });
    }


    /** 系统下拉
     *  iOS下拉后执行，刷新数据在松手后调用
     *  Android下拉松开后执行，刷新数据立即执行
     * */
    _onRefresh = () => {

        // 正在刷新或加载时，直接返回
        if (this.state.refreshStatus === RefreshStatus.HeaderRefresh ||
            this.state.refreshStatus === RefreshStatus.FooterRefresh) {
            return;
        }

        // 设置为刷新状态
        this._setRefreshStatus(RefreshStatus.HeaderBegin);

        if (Platform.OS === 'android') {
            this._setHeaderRefreshNotify();
        }
    };

    /** 系统加载*/
    _onEndReached = (info: {distanceFromEnd: number}) => {

        if (this.state.refreshStatus !== RefreshStatus.HeaderRefresh &&
            this.state.refreshStatus !== RefreshStatus.FooterEmpty &&
            this.state.refreshStatus !== RefreshStatus.FooterFinish) {
            this._setFooterRefreshNotify();
        }
    };


    /** 停止拉动*/
    _onScrollEndDrag = (event) => {
        if (Platform.OS === 'ios' && this.state.refreshStatus === RefreshStatus.HeaderBegin) {
            this._setHeaderRefreshNotify();
        }
    };

    /** 重新加载*/
    _onFooterReload = () => {
        this._setRefreshStatus(RefreshStatus.FooterRefresh);
        this._setFooterRefreshNotify();
    };

    /** 主动调用刷新*/
    beginRefreshing() {
        this._setHeaderRefreshNotify();
    }
}


DefaultRefreshComponent.defaultProps = {
    FooterComponent: BaseRefreshFooter,
    ContentComponent: FlatList,
    autoLoading: false
};

DefaultRefreshComponent.propType = {

    /** 内容组件，支持FlatList等带下拉刷新的组件*/
    ContentComponent: PropTypes.object,

    /** 加载组件，需要继承BaseRefreshFooter，并重写对应的方法*/
    FooterComponent: PropTypes.object,

    /** 刷新回调， 使用函数 notify(RefreshStatus) 通知刷新完成*/
    onHeaderRefresh: PropTypes.func,

    /** 加载回调，使用函数 notify(RefreshStatus) 通知加载完成*/
    onFooterRefresh: PropTypes.func,

    /** 组件加载时，自动加载数据*/
    autoLoading: PropTypes.bool,
};

export default DefaultRefreshComponent;
