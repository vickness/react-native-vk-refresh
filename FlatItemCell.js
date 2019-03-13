import React from 'react';
import {View, TouchableOpacity} from "react-native";

const ContentItems = ["","","","","","","","","",""];

export default class FlatItemCell extends React.PureComponent {

    // render() {
    //     return (
    //         <View style={{height: 150, backgroundColor: 'green', padding: 10}}>
    //             <View style={{flex: 1, backgroundColor: 'yellow', flexDirection: 'row'}}>
    //                 {
    //                     ContentItems.map((item, index) => {
    //                         return (
    //                             <View key={index} style={{flex: 1, backgroundColor: 'red', margin: 5}}/>
    //                         )
    //                     })
    //                 }
    //             </View>
    //             <View style={{flex: 1, backgroundColor: 'blue', flexDirection: 'row'}}>
    //                 {
    //                     ContentItems.map((item, index) => {
    //                         return (
    //                             <View key={index} style={{flex: 1, backgroundColor: 'red', margin: 5}}/>
    //                         )
    //                     })
    //                 }
    //             </View>
    //             <View style={{flex: 1, backgroundColor: 'gray', flexDirection: 'row'}}>
    //                 {
    //                     ContentItems.map((item, index) => {
    //                         return (
    //                             <View key={index} style={{flex: 1, backgroundColor: 'red', margin: 5}}/>
    //                         )
    //                     })
    //                 }
    //             </View>
    //         </View>
    //     )
    // }

    render() {
        return (
            <TouchableOpacity style={{height: 80, paddingHorizontal: 10, marginBottom: 10, backgroundColor: 'white', flexDirection: 'row'}} onPress={() => {alert("abc")}}>
                <View style={{backgroundColor: '#eee', width: 80, marginRight: 10, marginVertical: 3}}/>
                <View style={{flex: 1}}>
                    <View style={{backgroundColor: '#eee', flex: 1, marginVertical: 3}}/>
                    <View style={{backgroundColor: '#eee', flex: 1, marginVertical: 3}}/>
                    <View style={{backgroundColor: '#eee', flex: 1, marginVertical: 3}}/>
                </View>
            </TouchableOpacity>
        )
    }
}
