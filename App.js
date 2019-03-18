/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, SafeAreaView, View, FlatList, ScrollView} from 'react-native';
import RefreshComponent, { RefreshStatus, RefreshHeader, RefreshFooter} from "./lib/index";
import FlatItemCell from "./FlatItemCell";
import GridView from "react-native-super-grid";
import ParallaxScrollView from 'react-native-parallax-scroll-view';

const FlatItems = [
  "","","",""
  ,"","","",""
];

type Props = {};
export default class App extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      dataItems: FlatItems
    }
  }

  // render() {
  //   return (
  //     <SafeAreaView style={styles.container}>
  //       <BaseRefreshComponent
  //           ContentComponent={ScrollView}
  //           onHeaderRefresh={this._onHeaderRefresh}
  //       >
  //         <FlatItemCell/>
  //         <FlatItemCell/>
  //         <FlatItemCell/>
  //         <FlatItemCell/>
  //         <FlatItemCell/>
  //         <FlatItemCell/>
  //         <FlatItemCell/>
  //         <FlatItemCell/>
  //         <FlatItemCell/>
  //         <FlatItemCell/>
  //         <FlatItemCell/>
  //         <FlatItemCell/>
  //       </BaseRefreshComponent>
  //     </SafeAreaView>
  //   );
  // }


  // render() {
  //   return (
  //       <SafeAreaView style={styles.container}>
  //         <View style={{height: 100, backgroundColor: 'red'}}/>
  //         <RefreshComponent
  //             ContentComponent={FlatList}
  //             renderItem={() => <FlatItemCell/>}
  //             data={this.state.dataItems}
  //             onHeaderRefresh={this._onHeaderRefresh}
  //             onFooterRefresh={this._onFooterRefresh}
  //         />
  //         <View style={{height: 100, backgroundColor: 'red'}}/>
  //       </SafeAreaView>
  //   );
  // }

  // render() {
  //   return (
  //       <SafeAreaView style={styles.container}>
  //         <View style={{height: 60, backgroundColor: 'gray'}}/>
  //         <RefreshComponent
  //             ContentComponent={GridView}
  //             renderItem={() => <FlatItemCell/>}
  //             items={this.state.dataItems}
  //             onHeaderRefresh={this._onHeaderRefresh}
  //             onFooterRefresh={this._onFooterRefresh}
  //         />
  //         <View style={{height: 60, backgroundColor: 'gray'}}/>
  //       </SafeAreaView>
  //   );
  // }

  render() {
    return (
        <RefreshComponent
            ContentComponent={ParallaxScrollView}
            onHeaderRefresh={this._onHeaderRefresh}
            onFooterRefresh={this._onFooterRefresh}

            backgroundColor="#ddd"
            contentBackgroundColor="#ddd"
            parallaxHeaderHeight={180}
            // renderScrollComponent={() => <Animated.View />}
            //renderScrollComponent={() => <AnimatedCustomScrollView />}
            renderForeground={() => (
                <View style={{ height: 180, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Text>Hello World!</Text>
                </View>
            )}
        >

          <FlatItemCell/>
          <FlatItemCell/>
          <FlatItemCell/>
          <FlatItemCell/>
          <FlatItemCell/>
          <FlatItemCell/>

          <FlatItemCell/>
          <FlatItemCell/>
          <FlatItemCell/>
          <FlatItemCell/>
          <FlatItemCell/>
          <FlatItemCell/>

        </RefreshComponent>
    );
  }

  /** 下拉刷新*/
  _onHeaderRefresh = (notify) => {

    setTimeout(() => {

      this.setState({
        dataItems: FlatItems
      });

      notify(RefreshStatus.HeaderFinish);

    }, 2000);
  };

  /** 上拉加载*/
  _onFooterRefresh = (notify) => {

    setTimeout(() => {

      const oldItems = this.state.dataItems;
      this.setState({
        dataItems: oldItems.concat(FlatItems)
      });

      notify(RefreshStatus.FooterFailure);

    }, 2000);
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
});
