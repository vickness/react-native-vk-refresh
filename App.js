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

  render() {
    return (
        <SafeAreaView style={styles.container}>
          <RefreshComponent
              ContentComponent={FlatList}
              renderItem={() => <FlatItemCell/>}
              data={this.state.dataItems}
              onHeaderRefresh={this._onHeaderRefresh}
              onFooterRefresh={this._onFooterRefresh}
          />
        </SafeAreaView>
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
