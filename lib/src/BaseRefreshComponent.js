import React from 'react';
import {
    View,
    Platform,
    UIManager,
    PanResponder,
    LayoutAnimation,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import PropTypes from "prop-types";
import BaseRefreshHeader from "./BaseRefreshHeader";
import BaseRefreshFooter from "./BaseRefreshFooter";
import RefreshStatus from "./RefreshStatus";

class BaseRefreshComponent extends React.PureComponent {

    constructor(props) {
        super(props);

        //内容视图偏移
        this.contentOffset = 0;

        //内容高度
        this.contentHeight = 0;

        //滚动视图偏移
        this.scrollerOffset = 0;

        //滚动视图高度
        this.scrollerHeight = 0;

        //是否能够滚动
        this.isScrollEnabled = false;

        //初始化状态
        this.refreshStatus = RefreshStatus.HeaderIdle;
    }

    render() {
        const { HeaderComponent, FooterComponent, ContentComponent, headerHeight, onHeaderRefresh, onFooterRefresh, ...others } = this.props;

        //是否设置上拉加载
        const footerProps = onFooterRefresh ? {
            ListFooterComponent: (
                <TouchableOpacity onPress={this._onFooterReload}>
                    <FooterComponent ref={o => this.footerRef = o}/>
                </TouchableOpacity>
            ),
            onEndReachedThreshold: 0.1,
            onEndReached: this._onEndReached
        } : {};

        return (
            <View style={{flex: 1, zIndex: -1}} {...this._panResponder.panHandlers}>
                <View style={{ marginTop: -headerHeight }} ref={o => this.headerBackRef = o}>
                    <HeaderComponent ref={o => this.headerRef = o}/>
                </View>
                <ContentComponent
                    showsVerticalScrollIndicator={false}
                    keyExtractor={this._keyExtractor}
                    {...others}
                    ref={o => this.contentRef = o}
                    bounces={false}
                    overScrollMode={'never'}
                    scrollEnabled={false}
                    onScroll={this._onScrollEvent}
                    onTouchEnd={this._onScrollFinish}
                    onScrollEndDrag={this._onScrollFinish}
                    onMomentumScrollEnd={this._onScrollFinish}
                    onLayout={this._onLayout}
                    onContentSizeChange={this._onContentSizeChange}
                    {...footerProps}
                />
            </View>
        )
    }

    _keyExtractor = (item, index) => index.toString();

    /** 获取滑动视图高度*/
    _onLayout = (event) => {
        //console.log("_onLayout_Height: "+event.nativeEvent.layout.height);
        this.scrollerHeight = event.nativeEvent.layout.height
    };

    /** 获取内容高度*/
    _onContentSizeChange = (contentWidth, contentHeight) => {
        //console.log("contentHeight: "+contentHeight);
        this.contentHeight = contentHeight;
    };


    componentWillMount() {

        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        }

        //创建手势响应
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
            onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
            onPanResponderGrant: this._handlePanResponderGrant,
            onPanResponderMove: this._handlePanResponderMove,
            onPanResponderRelease: this._handlePanResponderEnd,
            onPanResponderTerminate: this._handlePanResponderEnd,
        });
    }

    /** 手势是否响应*/
    _handleStartShouldSetPanResponder = (evt, gestureState) => {
        //console.log("_handleStartShouldSetPanResponder: "+this.isScrollEnabled);
        return !this.isScrollEnabled;
    };

    /** 手势是否移动*/
    _handleMoveShouldSetPanResponder = (evt, gestureState) => {
        //console.log("_handleMoveShouldSetPanResponder: "+this.isScrollEnabled);
        return !this.isScrollEnabled;
    };

    /** 手势开始*/
    _handlePanResponderGrant = (evt, gestureState) => {
        //console.log("_handlePanResponderGrant");
    };

    /** 手势移动*/
    _handlePanResponderMove = (evt, gestureState) => {

        //console.log("_handlePanResponderMove: "+gestureState.dy);

        if ( (gestureState.dy >= 0 && this.scrollerOffset <= 0)) {
            this._setHeaderMoving(gestureState.dy);
        }
        else if (this.contentOffset <= 0) {
            this._scrollToOffset(-1*gestureState.dy);
        }
    };

    /** 手势结束*/
    _handlePanResponderEnd = (evt, gestureState) => {

        //console.log("_handlePanResponderEnd");

        //手势结束时，偏移大于0，设置为可以移动
        if (this.scrollerOffset > 0) {
            !this.isScrollEnabled && this._setContentScrollEnabled(true);
            return;
        }

        //手势结束时，根据状态判断
        switch (this.refreshStatus) {
            case RefreshStatus.HeaderIdle:
                this._setHeaderRestore();
                break;
            case RefreshStatus.HeaderBegin:
                this._setHeaderRefreshing();
                break;
            case RefreshStatus.HeaderRefresh:
                this._setHeaderRefreshing();
                break;
        }
    };


    /** 内容滑动结束*/
    _onScrollFinish = (event) => {

        if (event.nativeEvent.contentOffset) {
            this.scrollerOffset = event.nativeEvent.contentOffset.y;
        }

        //滚动结束时，若偏移为0，设置内容禁止滚动
        if (this.scrollerOffset === 0 && this.isScrollEnabled) {
            this._setContentScrollEnabled(false);
        }
    };

    /** 内容滑动回调*/
    _onScrollEvent = (event) => {
        //console.log("_onScrollEvent: "+event.nativeEvent.contentOffset.y);
        this.scrollerOffset = event.nativeEvent.contentOffset.y;
    };


    /** 内容滑动到底部*/
    _onEndReached = () => {

        //console.log("_onEndReached");
        this.refreshStatus = RefreshStatus.FooterRefresh;
        this.footerRef.onRefresh();
        this.props.onFooterRefresh((status) => {

            switch (status) {
                case RefreshStatus.FooterFinish:
                    this.refreshStatus = RefreshStatus.FooterFinish;
                    this.footerRef.onFinish();
                    break;
                case RefreshStatus.FooterFailure:
                    this.refreshStatus = RefreshStatus.FooterFailure;
                    this.footerRef.onFailure();
                    break;
            }
        });
    };

    /** 底部重新加载*/
    _onFooterReload = () => {
        if (this.refreshStatus === RefreshStatus.FooterFailure ||
            this.refreshStatus === RefreshStatus.HeaderFinish)
        {
            this._onEndReached();
        }
    };


    /** 头部下拉中*/
    _setHeaderMoving(offset) {

        //计算下拉阻力，设置头部偏移
        this.contentOffset = offset / (1 + offset / (this.props.headerHeight*2));

        //如果头部正在刷新中
        if (this.refreshStatus === RefreshStatus.HeaderRefresh) {

            this.headerBackRef.setNativeProps({
                style:{ marginTop: this.contentOffset }
            });

        } else {

            this.headerBackRef.setNativeProps({
                style:{ marginTop: -this.props.headerHeight + this.contentOffset }
            });

            //如果下拉距离大于头部高度，改变状态为准备刷新
            if (this.contentOffset >= this.props.headerHeight) {
                this.refreshStatus = RefreshStatus.HeaderBegin;
                this.headerRef.onBegin(this.contentOffset);
            } else {
                this.refreshStatus = RefreshStatus.HeaderIdle;
                this.headerRef.onPrepare(this.contentOffset);
            }
        }
    }

    /** 头部刷新中*/
    _setHeaderRefreshing() {

        //添加动画
        this._setRefreshingAnimation();

        //将位置还原为头部高度
        this.contentOffset = this.props.headerHeight;
        this.headerBackRef.setNativeProps({
            style:{ marginTop: 0 }
        });

        //如果已经是刷新状态，忽略操作
        if (this.refreshStatus === RefreshStatus.HeaderRefresh) {
            return;
        }

        //设置头部为正在刷状态
        this.refreshStatus = RefreshStatus.HeaderRefresh;
        this.headerRef.onRefresh(this.contentOffset);

        //设置回调接口
        this.props.onHeaderRefresh && this.props.onHeaderRefresh((status) => {

            this.refreshStatus = status;
            this._setHeaderRefreshFinish();
        });
    }

    /** 头部刷新结束*/
    _setHeaderRefreshFinish() {

        switch (this.refreshStatus) {
            case RefreshStatus.HeaderFinish:
            {
                this.headerRef.onFinish();
                setTimeout(() => {

                    //console.log("HeaderFinish 延迟0.5秒");
                    this._setHeaderRestore();
                }, 500);
            }
                break;
            case RefreshStatus.HeaderFailure:
            {
                this.headerRef.onFailure();
                setTimeout(() => {

                    //console.log("HeaderFailure 延迟0.5秒");
                    this._setHeaderRestore();
                }, 500);
            }
                break;
            default:
            {
                this._setHeaderRestore();
            }
                break;
        }
    }

    /** 头部还原*/
    _setHeaderRestore() {

        //添加动画
        this._setRefreshDoneAnimation();

        //头部位置还原
        this.contentOffset = 0;
        this.headerBackRef.setNativeProps({
            style:{ marginTop: -this.props.headerHeight }
        });

        //状态还原
        if (this.scrollerOffset > 0 && !this.isScrollEnabled) {
            this._setContentScrollEnabled(true);
        }

        this.refreshStatus = RefreshStatus.HeaderFinish;
    }


    /** 内容滑动到指定位置*/
    _scrollToOffset(offset) {

        //console.log(`contentHeight: ${this.contentHeight} -- scrollerHeight: ${this.scrollerHeight} -- offset: ${offset}`);
        //console.log(this.contentRef);
        //如果内容长度不够，直接返回
        if (this.contentHeight <= this.scrollerHeight + offset) return;

        if (this.contentRef.scrollToOffset) {
            this.contentRef.scrollToOffset({offset: offset, animated: false});
        } else if (this.contentRef.scrollTo) {
            this.contentRef.scrollTo({y: offset, animated: false});
        } else if (this.contentRef.flatList) {
            this.contentRef.flatList.scrollToOffset({offset: offset, animated: false});
        } else if (this.contentRef.scrollView) {
            this.contentRef.scrollView.scrollTo({y: offset, animated: false});
        }
    }

    /** 内容是否能滑动*/
    _setContentScrollEnabled(enabled) {
        this.isScrollEnabled = enabled;
        if (this.contentRef.setNativeProps) {
            this.contentRef.setNativeProps({
                scrollEnabled: enabled
            });
        } else if (this.contentRef.scrollView) {
            this.contentRef.scrollView.setNativeProps({
                scrollEnabled: enabled
            });
        } else if (this.contentRef.flatList) {
            this.contentRef.flatList.setNativeProps({
                scrollEnabled: enabled
            });
        }
    }

    /** 刷新开始动画*/
    _setRefreshingAnimation() {
        LayoutAnimation.configureNext({
            duration: 150,
            update: {
                type: LayoutAnimation.Types.easeOut,
                //springDamping: 0.5
            }
        });
    }

    /** 刷新完成动画*/
    _setRefreshDoneAnimation() {
        LayoutAnimation.configureNext({
            duration: 150,
            update: {
                type: LayoutAnimation.Types.easeOut
            }
        });
    }
}


BaseRefreshComponent.defaultProps = {
    HeaderComponent: BaseRefreshHeader,
    FooterComponent: BaseRefreshFooter,
    ContentComponent: ScrollView,
    headerHeight: 60,
};

BaseRefreshComponent.propType = {

    /** 刷新组件，需要继承BaseRefreshHeader，并重写对应的方法*/
    HeaderComponent: PropTypes.object,

    /** 加载组件，需要继承BaseRefreshFooter，并重写对应的方法*/
    FooterComponent: PropTypes.object,

    /** 内容组件，支持FlatList, ScrollView等可以滑动的组件*/
    ContentComponent: PropTypes.object,

    /** 刷新组件高度，自定义必须要设置*/
    headerHeight: PropTypes.number,

    /** 刷新回调， 使用函数 notify(RefreshStatus) 通知刷新完成*/
    onHeaderRefresh: PropTypes.func,

    /** 加载回调，使用函数 notify(RefreshStatus) 通知加载完成*/
    onFooterRefresh: PropTypes.func,
};

export default BaseRefreshComponent;
