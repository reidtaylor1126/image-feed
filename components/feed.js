import React, { Component } from 'react';
import { Appearance, Keyboard, Animated, Share, AppRegistry, Text, View, StyleSheet, Image, TextInput, ImageBackground, Pressable, Alert, Dimensions, StatusBar, RefreshControl, FlatList, Platform, ScrollView, TouchableHighlightBase } from 'react-native';
import Slider from '@react-native-community/slider'
import Constants from 'expo-constants';

import icons from './components/icons'

export default class Feed extends Component {
    constructor() {}

    render() {
        return(
            <View style={{display: this.props.pageDisplay.feed}}>
                <FlatList 
                    ref={this.props.feedList}
                    style={{height: deviceHeight*(1-(headerHeight + 0.07))}}
                    onScroll={this.props.onScroll}
                    data={this.props.images}
                    refreshControl={
                      <RefreshControl
                          progressBackgroundColor={this.props.theme.accent}
                          colors={[this.props.theme.onAccent]}
                          refreshing={this.props.isLoading || this.props.isRefreshing}
                          onRefresh={() => {this.props.fetchImages()}}
                      />
                    }
                    renderItem={({item, index}) => {
                      let title = item.caption + " - " + item.usr.name;
                      return(
                        <View style={[styles.item]} key={index}>
                            <Text style={styles.postTitle}>
                                {title}
                            </Text>
              
                            <Image
                                source={item.src}
                                style={{width: deviceWidth, height: deviceWidth*item.ratio, backgroundColor: this.props.theme.outline}}
                            />
                            
                            <View style={[styles.postControlBar, {marginLeft: deviceWidth*0.025}]}>
                                <Pressable 
                                    style={styles.icon}
                                    activeOpacity={1}
                                    onPress={() => {this.props.likePost(item)}}>
                                  <Image
                                    source={{uri: icons.like}}
                                    style={[styles.icon, {tintColor: item.likedBy.includes(this.props.user) ? this.props.theme.accent : this.props.theme.onBackground2}]}
                                  />
                                </Pressable>
                                <Pressable 
                                    style={styles.icon}
                                    activeOpacity={1}
                                    onPress={() => {this.props.comments(item)}}>
                                  <Image
                                    source={{uri: icons.comment}}
                                    style={styles.icon}
                                  />
                                </Pressable>
                                <View style={{width: (deviceWidth*1.075) - (deviceHeight * 0.3)}}></View>
                                <Pressable 
                                    style={styles.icon}
                                    activeOpacity={1}
                                    onPress={() => {this.props.savePost(item)}}>
                                  <Image
                                    source={{uri: icons.save}}
                                    style={[styles.icon, {tintColor: this.props.user.saved.includes(item) ? this.props.theme.accent : this.props.theme.onBackground2}]}
                                  />
                                </Pressable>
                                <Pressable 
                                    style={styles.icon}
                                    activeOpacity={1}
                                    onPress={() => {this.props.sharePost(item)}}>
                                  <Image
                                    source={{uri: icons.share}}
                                    style={styles.icon}
                                  />
                                </Pressable>
                            </View>
              
                        </View>
                      );
                    }}
                />
            </View>
        );
    }
}