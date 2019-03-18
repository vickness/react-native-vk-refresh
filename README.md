# react-native-vk-refresh

Refresh component for React Native (iOS and Android)

<p>
<img src="https://github.com/vickness/react-native-vk-refresh/blob/master/screenshot/image1.gif" height="500">
<img src="https://github.com/vickness/react-native-vk-refresh/blob/master/screenshot/image2.gif" height="500">
</p>

## Install

Install the package:

```bash
npm i react-native-vk-refresh --save
or 
yarn add react-native-vk-refresh
```

## Usage

```javascript
import RefreshComponent, { RefreshStatus, RefreshHeader, RefreshFooter} from 'react-native-vk-refresh';

/** 支持FlatList*/ 
<RefreshComponent
      ContentComponent={FlatList}
      renderItem={() => <FlatItemCell/>}
      data={[]}
      onHeaderRefresh={this._onHeaderRefresh}
      onFooterRefresh={this._onFooterRefresh}
/>
          
/** 下拉刷新*/
_onHeaderRefresh = (notify) => {

   setTimeout(() => {

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
/** 支持 ScrollView*/ 
<RefreshComponent
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
## Props
Prop                            | Type      | Optional | Default           | Description
-----------------------         | ------    | -------- | ---------         | -----------
...ContentComponent.propTypes   |           | Yes      |                   | 传入 ContentComponent 的所有属性
HeaderComponent                 | object    | Yes      | BaseRefreshHeader | 自定义刷新组件，继承 BaseRefreshHeader 并实现所有方法
FooterComponent                 | object    | Yes      | BaseRefreshFooter | 自定义加载组件，继承 BaseRefreshFooter 并实现所有方法
ContentComponent                | object    | Yes      | ScrollView        | 内容组件，支持FlatList, ScrollView或第三方滑动组件
headerHeight                    | number    | Yes      | 60                | 刷新组件高度，自定义组件必须填写
onHeaderRefresh                 | func      | Yes      |                   | 刷新回调, 带notify(RefreshStatus)参数，通知刷新完成
onFooterRefresh                 | func      | Yes      |                   | 加载回调，带notify(RefreshStatus)参数，通知加载完成

# License

MIT
