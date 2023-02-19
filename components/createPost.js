import React, { Component } from 'react';
import { Appearance, Keyboard, Animated, Share, AppRegistry, Text, View, StyleSheet, Image, TextInput, ImageBackground, Pressable, Alert, Dimensions, StatusBar, RefreshControl, FlatList, Platform, ScrollView, TouchableHighlightBase } from 'react-native';
import Slider from '@react-native-community/slider'

import icons from './icons'

export default class CreatePost extends Component {
    constructor() {
        this.state = {
            imgTemp: "",
            ratioTemp: 1.0,
            titleTemp: ""
        };
    }

    _changeImage = (img) => {
        this.setState({imgTemp: img});
    }

    _changeTitle = (title) => {
        this.setState({titleTemp: title});
    }

    _handleSlider = (value) => {
      this.setState({ratioTemp: value});
    }

    clearPost = () => {
      this.setState({
        imgTemp: "",
        titleTemp: "",
        ratioTemp: 1,
      })
    }

    render() {
        const deviceWidth = this.props.dimensions.width;
        const deviceHeight = this.props.dimensions.height;

        return(
            <View style={{display: this.props.pageDisplay.post}}>
                <View style={{width: deviceWidth, height: deviceWidth, alignItems: 'center', justifyContent: 'center'}}>
                    <Image
                    source={{uri: this.state.imgTemp == "" ? icons.blankImg : this.state.imgTemp}}
                    style={{height: deviceWidth*(Math.min(1, this.props.ratioTemp)), width: deviceWidth*Math.min(1, 1/this.props.ratioTemp)}}
                    />
                </View>
                <View style={{backgroundColor: this.props.theme.background2, width: deviceWidth, height: deviceHeight, elevation: 12, position: 'absolute', top: deviceWidth + (this.props.postTop*0.5)*deviceHeight}}>
                    <View style={{elevation: 12, height: deviceHeight*0.075, alignItems: 'center', color: this.props.theme.background2, flexDirection: 'row', justifyContent: 'center', }}>
                        <Text style={[styles.smallText, {width: deviceWidth*0.15, marginRight: 0}]}>
                        Source: 
                        </Text>
                        <TextInput style={[styles.smallText, {width: deviceWidth*0.7, borderBottomColor: this.props.theme.onBackground2, borderBottomWidth: deviceHeight*0.002,}]}
                            value={this.state.imgTemp}
                            onChangeText={(url) => this._changeImage(url)}
                        />
                    </View>
                    <View style={{elevation: 12, height: deviceHeight*0.075, alignItems: 'center', color: this.props.theme.background2, flexDirection: 'row', justifyContent: 'center'}}>
                        <Text style={[styles.smallText, {width: deviceWidth*0.15, marginRight: 0}]}>
                        Title: 
                        </Text>
                        <TextInput style={[styles.smallText, {width: deviceWidth*0.7, borderBottomColor: this.props.theme.onBackground2, borderBottomWidth: deviceHeight*0.002,}]}
                            value={this.state.titleTemp}
                            onChangeText={(text) => this._changeTitle(text)}
                        />
                    </View>
                    <View style={{elevation: 12, height: deviceHeight*0.075, alignItems: 'center', color: this.props.theme.background2, flexDirection: 'row', justifyContent: 'center'}}>
                        <Text style={[styles.smallText, {width: deviceWidth*0.2, marginRight: 0}]}>
                        Aspect Ratio: 
                        </Text>
                        <Slider
                        style={{width: deviceWidth*0.7, height: deviceHeight*0.05}}
                        value={1}
                        minimumValue={0.5}
                        maximumValue={2}
                        minimumTrackTintColor={theme.onBackground}
                        maximumTrackTintColor={theme.onBackground2}
                        thumbTintColor={theme.accent}
                        onValueChange={(value) => {this._handleSlider(value)}}
                        />
                    </View>
                    <View style={{elevation: 12, height: deviceHeight*0.075, alignItems: 'center', color: this.props.theme.background2, flexDirection: 'row', justifyContent: 'space-evenly'}}>
                        <Pressable
                        activeOpacity={1}
                        onPressOut={() => {this.props.confirmPost(this.state)}}
                        >
                        <Image
                            source={{uri: icons.send}}
                            style={[styles.icon, {tintColor: this.state.imgTemp != "" && this.state.titleTemp != "" ? this.props.theme.accent : this.props.theme.onBackground2}]}
                        />
                        </Pressable>

                        <Pressable
                        activeOpacity={1}
                        onPressOut={() => {this.clearPost()}}
                        >
                        <Image
                            source={{uri: icons.exit}}
                            style={[styles.icon, {tintColor: this.props.theme.accent2}]}
                        />
                        </Pressable>
                    </View>
                </View>
            </View>
        );
    }
}