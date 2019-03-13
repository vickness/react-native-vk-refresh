# react-native-vk-refresh

A React Native button component .

<p align="center">
<img src="https://github.com/vickness/react-native-vk-refresh/blob/master/screenshot/image1.gif" width="300">
<img src="https://github.com/vickness/react-native-vk-refresh/blob/master/screenshot/image2.gif" width="300">
</p>

## Install

Install the package:

```bash
$ npm i react-native-vk-refresh --save
or yarn add react-native-vk-refresh
```

Import the ``BaseRefreshComponent`` component:

```javascript
import BaseRefreshComponent from 'react-native-vk-refresh'
```

## Usage

```javascript

/** 在FlatList中使用*/ 
<BaseRefreshComponent
      ContentComponent={FlatList}
      renderItem={() => <FlatItemCell/>}
      data={this.state.dataItems}
      onHeaderRefresh={this._onHeaderRefresh}
      onFooterRefresh={this._onFooterRefresh}
/>
          
/** 下拉刷新*/
_onHeaderRefresh = (notify) => {

   setTimeout(() => {

     this.setState({
       dataItems: FlatItems
     });

     // 刷新完成，无提示
     notify();
     
     // 刷新成功
     notify(RefreshStatus.HeaderFinish);
     
     // 刷新失败
     notify(RefreshStatus.HeaderFailure);

   }, 2000);
};

/** 上拉加载*/
_onFooterRefresh = (notify) => {

   setTimeout(() => {

     const oldItems = this.state.dataItems;
     this.setState({
       dataItems: oldItems.concat(FlatItems)
     });

     // 继续加载
     notify();
     
     // 加载失败
     notify(RefreshStatus.FooterFailure);
     
     // 加载完成，没有更多数据
     notify(RefreshStatus.FooterFinish);

   }, 2000);
};

```

```javascript
/** 在ScrollView中使用*/ 
<BaseRefreshComponent
       ContentComponent={ScrollView}
       onHeaderRefresh={this._onHeaderRefresh}
>
       <FlatItemCell/>
       <FlatItemCell/>
       <FlatItemCell/>
       <FlatItemCell/>
       <FlatItemCell/>
</BaseRefreshComponent>
```

# License

MIT
