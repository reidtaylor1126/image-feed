import React, { Component } from 'react';
import { Appearance, Keyboard, Animated, Share, AppRegistry, Text, View, StyleSheet, Image, TextInput, ImageBackground, Pressable, Alert, Dimensions, StatusBar, RefreshControl, FlatList, Platform, ScrollView, TouchableHighlightBase } from 'react-native';
import Slider from '@react-native-community/slider'
import Constants from 'expo-constants';
import * as Device from 'expo-device';

import CreatePost from './components/createPost';
import Feed from './components/feed';
import { GenerateStyles as generateStyles } from './components/styles';
import icons from './components/icons'
import { light } from './components/themes'

let imgscale = 2;
let pageRange = 30;
let postsOnPage = 10;
let maxPosts = 20;
let scrollButtonThreshold = 6;
let theme = light;

let gesturebar = Device.brand == 'google' ? 20 : 0;
let headerHeight = 0.09;
let statusBarHeight = StatusBar.currentHeight;
let deviceHeight = Dimensions.get('window').height + statusBarHeight - gesturebar;
let deviceWidth = Dimensions.get('window').width;
StatusBar.setBarStyle(theme.statusBarStyle);
StatusBar.setBackgroundColor(theme.background2);

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default class App extends Component {

    _isMounted = 'false';
    buttonOpacity = new Animated.Value(0);
    postAnim = new Animated.Value(0);
    showButton = false;
    feedList = React.createRef();
    savedList = React.createRef();

    state = {
      // UI
      header: 'Your Feed',
      pageDisplay: {
        current: 'feed',
        'feed': 'flex',
        'post': 'none',
        'saved': 'none',
        'profile': 'none'
      },
      headers: {
        'feed': 'Your Feed',
        'post': 'Create Post',
        'saved': 'Saved Posts',
        'profile': 'Your Profile'
      },
      showPost: 'none',
      postOpacity: 0,
      postTop: 0,
      showMenu: 'none',
      currentList: [],
      editingPfp: false,

      // User
      user: {
        name: 'User',
        pfp: {uri: icons.profile},
        posts: [],
        saved: [],
      },
      commentInEdit: "",
      users: [
      ],
      pfpTemp: "",
      imgTemp: "",
      titleTemp: "",
      ratioTemp: 1,
      defaultUser: {
        name: 'New User',
        pfp: {uri: icons.profile},
        posts: [],
        saved: [],
      },

      // Posts
      isLoading: true,
      isRefreshing: true,
      images: [],
      currentImage: {
        src: {uri: icons.blankImg},
        usn: "sample",
        ratio: 1,
        id: 0 + "",
        likedBy: [],
        baseLikes: 0,
        caption: "sample",
        comments: [{user: 'sample', comment: "sample ", id: '0'},]
      },
      usedPages: [],
      scrollPosition: 0,
    }

    UNSAFE_componentWillMount() {
      this._isMounted = true;
      this.fetchImages();
      this.postAnim.addListener((value) => {this.setState({postOpacity: value})});
      this.keyboardDidShowListener = Keyboard.addListener(
        'keyboardDidShow',
        this._keyboardDidShow,
      );
      this.keyboardDidHideListener = Keyboard.addListener(
        'keyboardDidHide',
        this._keyboardDidHide,
      );
    }
    componentWillUnmount() {
      this._isMounted = false;
    }

    toPage = (page) => {
        let pages_temp = this.state.pageDisplay;
        let currentPage = pages_temp.current;
        pages_temp[currentPage] = 'none';
        pages_temp[page] = 'flex';
        pages_temp.current = page;
        this.setState({pageDisplay: pages_temp, header: this.state.headers[page]});
    }

    animateButtonTo = (value, time) => {
      Animated.timing(this.buttonOpacity, {
        toValue: value,
        duration: time,
        useNativeDriver: false
      }).start();
    }

    animatePostTo = (value, time) => {
      Animated.timing(this.postAnim, {
        toValue: value,
        duration: time,
        useNativeDriver: true
      }).start(() => {if(value == 0) this.setState({showPost: 'none'})});
    }

    _keyboardDidHide = (e) => {
        this.setState({postTop: 0});
    }

    _keyboardDidShow = (e) => {
      this.setState({postTop: -1 * e.endCoordinates.height / deviceHeight});
    }

    _handleScroll = (event) => {
      let position = Math.round(event.nativeEvent.contentOffset.y * 100 / deviceHeight) / 100;
      if(position > scrollButtonThreshold && this.showButton == false) {
        this.showButton = true;
        this.animateButtonTo(1, 400);
      }
      else if(position < scrollButtonThreshold && this.showButton == true) {
        this.showButton = false;
        this.animateButtonTo(0, 400);
      }
      this.setState({ scrollPosition: position});
    }

    toTop = () => {
      if(this.state.pageDisplay.current == 'feed') {
        this.feedList.current.scrollToIndex({animated: true, index: 0});
      }
      else if(this.state.pageDisplay.current == 'saved') {
        this.savedList.current.scrollToIndex({animated: true, index: 0});
      }
      else {
        this.animateButtonTo(0, 10);
      }
    }

    fetchImages = () => {
      this.setState({isRefreshing: true});
      let page = Math.ceil(pageRange*Math.random());
      if(this.state.usedPages.length == pageRange) pageRange += 2;
      while(this.state.usedPages.includes(page)) {
        page = Math.ceil(pageRange*Math.random());
      }
      this.state.usedPages.push(page);
      fetch('https://picsum.photos/v2/list?page=' + page + '&limit=' + postsOnPage).then(
        (response) => response.json()).then(
        (data) => {
          let imgs = this.state.images;
          if(imgs.length >= maxPosts) {
            imgs = imgs.slice(0, maxPosts - postsOnPage);
          }
          data.map((img, index) => {
            let url_arr = img.download_url.split('/');
            let url = '';
            for(let i = 0; i < 5; i++) {
              url += url_arr[i] + '/';
            }
            let rat = img.height/img.width;
            url += Math.round(deviceWidth*imgscale) + '/' + Math.round(deviceWidth*rat*imgscale);
            let usn = img.author;
            /*fetch('https://randomuser.me/api').then(
              (usrResponse) => usrResponse.json()).then(
              (usrData) => {
                usn = usrData.results[0].login.name;
                console.log(usn);
              })
              */
            let likes = Math.round(Math.random * 200);
            imgs.unshift({
              src: {uri: url},
              usr: {name: usn},
              ratio: rat,
              id: index + "",
              likedBy: [],
              baseLikes: likes,
              caption: "",
              comments: []
            })
          })

          fetch('https://random-word-api.herokuapp.com/word?number=' + postsOnPage).then(
            (captionResp) => captionResp.json()).then(
            (captionData) => {
              captionData.map((cap, index) => {
                let capital = cap.charAt(0).toUpperCase() + cap.slice(1);
                imgs[index].caption = capital;
                imgs[index].comments.push({user: imgs[index].usr, comment: capital, id: index+""});
                imgs[index].id += cap;
              })
              this.setState({isLoading: false, isRefreshing: false, images: imgs});
            })
        })
    }

    _changeUsn = (usn) => {
      let usrTemp = this.state.user;
      usrTemp.name = usn;
      this.setState({user: usrTemp});
    }

    editPfp = () => {
      this.setState({editingPfp: true});
    }

    cancelPfp = () => {
      this.setState({editingPfp: false, pfpTemp: ""});
    }

    _changePfp = (url) => {
      this.setState({pfpTemp: url})
    }

    confirmPfp = () => {
      this.state.user.pfp.uri = this.state.pfpTemp;
      this.setState({editingPfp: false});
    }

    _changeComment = (comm) => {
      this.setState({commentInEdit: comm});
    }

    likePost = (post) => {
      let index = post.likedBy.indexOf(this.state.user);
      if(index == -1) {
        post.likedBy.push(this.state.user)
      }
      else {
        post.likedBy.splice(index, 1);
      }

      this.setState({});
    }

    comments = (post) => {
      //console.log("opening post " + post.caption);
      this.setState({currentImage: post, showPost: 'flex'})
      this.animatePostTo(1, 150);
    }

    submitComment = () => {
      if(this.state.commentInEdit != "") {
        this.state.currentImage.comments.push({user: this.state.user, comment: this.state.commentInEdit, id: this.state.currentImage.comments.length});
        this.setState({commentInEdit: ''});
      }
    }

    exitPost = () => {
      //console.log('closing post')
      this.animatePostTo(0, 250);
    }

    savePost = (post) => {
      let index = this.state.user.saved.indexOf(post);
      if(index == -1) {
        this.state.user.saved.unshift(post);
      }
      else {
        this.state.user.saved.splice(index, 1);
      }

      this.setState({});
    }

    sharePost = (post) => {
      let shareMessage = {};
      if(Platform.OS == 'ios') {
        shareMessage = {url: post.src.uri};
      }
      else {
        shareMessage = {message: post.src.uri};
      }
      try{
        Share.share(shareMessage)
      } catch (error) {
        alert(error.message);
      }
    }

    toggleUsers = () => {
      //console.log("showing users");
      if(!this.state.users.includes(this.state.user)) {
        this.state.users.push(this.state.user);
      }
      this.state.currentList = this.state.users;
      this.setState({showMenu: this.state.showMenu == 'flex' ? 'none' : 'flex'});
    }

    pickUser = (user) => {
      this.setState({
        showMenu: 'none',
        user: user
      });
    }

    addUser = () => {
      this.setState({
        user: JSON.parse(JSON.stringify(this.state.defaultUser)),
        showMenu: 'none'
      });
      this.toPage('profile');
    }

    confirmPost = (postData, callback) => {
      if(postData.imgTemp != "" && postData.titleTemp != "") {
        let post = {
          src: {uri: postData.imgTemp},
          usr: this.state.user,
          ratio: postData.ratioTemp,
          id: this.state.user.posts.length + this.state.titleTemp,
          likedBy: [],
          baseLikes: 0,
          caption: postData.titleTemp,
          comments: [{user: this.state.user, comment: postData.titleTemp, id: "0"}]
        }

        this.state.user.posts.unshift(post);
        this.state.images.unshift(post);
        this.toPage('feed');
        () => {callback()}
      }
    }

    PostList = (props) => {
      return(
      <View style={props.style}>
        <Text>
          {props.title}
        </Text>
      </View>
      )
    }

    render() {
        return (
            <View style={styles.container}>
              
              <View style={{height: deviceHeight*headerHeight}}></View>

              {/** Main Feed Page */}
              <Feed 
                  pageDisplay={this.state.pageDisplay}
                  feedList={this.feedList}
                  images={this.state.images}
                  theme={theme}
                  isLoading={this.state.isLoading}
                  isRefreshing={this.state.isRefreshing}
                  user={this.state.user}

                  comments={this.comments}
                  savePost={this.savePost}
                  sharePost={this.sharePost}
                  likePost={this.likePost}
                  fetchImages={this.fetchImages}
                  onScroll={this._handleScroll}
              />

              {/** Create Post page */}
              <CreatePost
                  pageDisplay={this.state.pageDisplay}
                  dimensions={{width: deviceWidth, height: deviceHeight}}
                  theme={theme}
                  postTop={this.state.postTop}

                  confirmPost={this.confirmPost}
              />

              {/** Saved page */}
              <View style={{display: this.state.pageDisplay.saved}}>
                <Text style={[styles.smallText, {display: this.state.user.saved.length == 0 ? "flex" : 'none'}]}>You have no saved posts.</Text>
                <FlatList 
                    ref={this.savedList}
                    style={{height: deviceHeight*(1-(headerHeight + 0.07))}}
                    onScroll={this._handleScroll}
                    data={this.state.user.saved}
                    renderItem={({item, index}) => {
                      let title = item.caption + " - " + item.usr.name;
                      return(
                        <View style={[styles.item]} key={index}>
                            <Text style={styles.postTitle}>
                                {title}
                            </Text>
              
                            <Image
                                source={item.src}
                                style={{width: deviceWidth, height: deviceWidth*item.ratio, backgroundColor: theme.outline}}
                            />
                            
                            <View style={[styles.postControlBar, {marginLeft: deviceWidth*0.025}]}>
                                <Pressable 
                                    style={styles.icon}
                                    activeOpacity={1}
                                    onPress={() => {this.likePost(item)}}>
                                  <Image
                                    source={{uri: icons.like}}
                                    style={[styles.icon, {tintColor: item.likedBy.includes(this.state.user) ? theme.accent : theme.onBackground2}]}
                                  />
                                </Pressable>
                                <Pressable 
                                    style={styles.icon}
                                    activeOpacity={1}
                                    onPress={() => {this.comments(item)}}>
                                  <Image
                                    source={{uri: icons.comment}}
                                    style={styles.icon}
                                  />
                                </Pressable>
                                <View style={{width: (deviceWidth*1.075) - (deviceHeight * 0.3)}}></View>
                                <Pressable 
                                    style={styles.icon}
                                    activeOpacity={1}
                                    onPress={() => {this.savePost(item)}}>
                                  <Image
                                    source={{uri: icons.save}}
                                    style={[styles.icon, {tintColor: this.state.user.saved.includes(item) ? theme.accent : theme.onBackground2}]}
                                  />
                                </Pressable>
                                <Pressable 
                                    style={styles.icon}
                                    activeOpacity={1}
                                    onPress={() => {this.sharePost(item)}}>
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

              {/** Profile page */}
              <View style={{display: this.state.pageDisplay.profile}}>
                <View style={styles.profileHeader}>
                      <View style={{height: deviceWidth*0.4 + deviceHeight*0.025, alignItems: 'center', display: this.state.editingPfp ? 'flex' : 'none', flexDirection: 'row'}}>
                        <Image
                          source={{uri: this.state.pfpTemp == "" ? icons.profile : this.state.pfpTemp}}
                          style={[styles.pfpSmall, {marginRight: 0,}]}
                        />
                        <TextInput style={[styles.smallText, {width: deviceWidth*0.6, borderBottomColor: theme.onBackground2, borderBottomWidth: deviceHeight*0.002,}]}
                            value={this.state.pfpTemp}
                            onChangeText={(url) => this._changePfp(url)}
                        />
                        <Pressable
                            onPressOut={() => {this.confirmPfp()}}
                            
                        >
                          <Image
                            source={{uri: icons.check}}
                            style={[styles.pfpSmall, {opacity: this.state.pfpTemp == "" ? 0.5 : 1}]}
                          />
                        </Pressable>
                        <Pressable
                            onPressOut={() => {this.cancelPfp()}}
                        >
                          <Image
                            source={{uri: icons.exit}}
                            style={[styles.pfpSmall, {marginRight: 0,}]}
                          />
                        </Pressable>
                      </View>
                      <Pressable
                        onPressOut={() => {this.editPfp()}}
                      >
                        <Image 
                            source={this.state.user.pfp}
                            style={[styles.pfpLarge, {display: this.state.editingPfp ? 'none' : 'flex'}]}
                        />
                      </Pressable>
                      <TextInput style={styles.headerText}
                          value={this.state.user.name}
                          onChangeText={(usn) => this._changeUsn(usn)}
                      />
                  </View>
                  <Text style={[styles.smallText, {textAlign: 'center', display: this.state.user.posts.length == 0 ? "flex" : 'none'}]}>You have no posts.</Text>
                  <FlatList 
                    ref={this.savedList}
                    style={{elevation: 0, height: deviceHeight*(0.675-(headerHeight + 0.07))}}
                    onScroll={this._handleScroll}
                    data={this.state.user.posts}
                    renderItem={({item, index}) => {
                      let title = item.caption + " - " + item.usr.name;
                      return(
                        <View style={[styles.item]} key={index}>
                            <Text style={styles.postTitle}>
                                {title}
                            </Text>
              
                            <Image
                                source={item.src}
                                style={{width: deviceWidth, height: deviceWidth*item.ratio, backgroundColor: theme.outline}}
                            />
                            
                            <View style={[styles.postControlBar, {marginLeft: deviceWidth*0.025}]}>
                                <Pressable 
                                    style={styles.icon}
                                    activeOpacity={1}
                                    onPress={() => {this.likePost(item)}}>
                                  <Image
                                    source={{uri: icons.like}}
                                    style={[styles.icon, {tintColor: item.likedBy.includes(this.state.user) ? theme.accent : theme.onBackground2}]}
                                  />
                                </Pressable>
                                <Pressable 
                                    style={styles.icon}
                                    activeOpacity={1}
                                    onPress={() => {this.comments(item)}}>
                                  <Image
                                    source={{uri: icons.comment}}
                                    style={styles.icon}
                                  />
                                </Pressable>
                                <View style={{width: (deviceWidth*1.075) - (deviceHeight * 0.3)}}></View>
                                <Pressable 
                                    style={styles.icon}
                                    activeOpacity={1}
                                    onPress={() => {this.savePost(item)}}>
                                  <Image
                                    source={{uri: icons.save}}
                                    style={[styles.icon, {tintColor: this.state.user.saved.includes(item) ? theme.accent : theme.onBackground2}]}
                                  />
                                </Pressable>
                                <Pressable 
                                    style={styles.icon}
                                    activeOpacity={1}
                                    onPress={() => {this.sharePost(item)}}>
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

              {/** App header */}
              <View style={styles.headerBar}>
                  <Text style={styles.headerText}>
                      {this.state.header}
                  </Text>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Pressable
                        onPress={() => {this.toggleUsers()}}
                    >
                      <Image
                        source={this.state.user.pfp}
                        style={[styles.pfpSmall, {marginBottom: deviceHeight*0.01}]}
                      />
                    </Pressable>
                  </View>
              </View>

              {/** 'Return to top' button */}
              <AnimatedPressable 
                style={[styles.toTopButton, {opacity: this.buttonOpacity, display: this.showButton ? 'flex' : 'none'}]}
                onPress={() => {
                  this.toTop();
                }}>
                  <Image
                    source={{uri: icons.up_arrow}}
                    style={{width: deviceWidth*0.1, height: deviceWidth*0.1, tintColor: theme.onAccent}}
                  />
              </AnimatedPressable>

              {/** Navbar */}
              <View style={styles.navbar}>
                  <Pressable 
                      style={styles.icon}
                      activeOpacity={1}
                      onPress={() => {this.toPage('feed')}}>
                    <Image
                      source={{uri: icons.home}}
                      style={[styles.icon, {tintColor: this.state.pageDisplay.feed == 'flex' ? theme.accent : theme.onBackground2}]}
                    />
                  </Pressable>
                  <Pressable 
                      style={styles.icon}
                      activeOpacity={1}
                      onPress={() => {this.toPage('post')}}>
                    <Image
                      source={{uri: icons.post}}
                      style={[styles.icon, {tintColor: this.state.pageDisplay.post == 'flex' ? theme.accent : theme.onBackground2}]}
                    />
                  </Pressable>
                  <Pressable 
                      style={styles.icon}
                      activeOpacity={1}
                      onPress={() => {this.toPage('saved')}}>
                    <Image
                      source={{uri: icons.saved}}
                      style={[styles.icon, {tintColor: this.state.pageDisplay.saved == 'flex' ? theme.accent : theme.onBackground2}]}
                    />
                  </Pressable>
                  <Pressable 
                      style={styles.icon} 
                      activeOpacity={1}
                      onPress={() => {this.toPage('profile')}}>
                    <Image
                      source={{uri: icons.profile}}
                      style={[styles.icon, {tintColor: this.state.pageDisplay.profile == 'flex' ? theme.accent : theme.onBackground2}]}
                    />
                  </Pressable>
              </View>

              {/** User picker */}
              <View style={{display: this.state.showMenu, position: 'absolute', top: deviceHeight*headerHeight, right: 0, elevation: 17}}>
                <ScrollView style={{display: this.state.showMenu}}>
                  {this.state.users.map((user, index) => {
                    return(
                      <Pressable
                        key={index}
                        onPressOut={()=>{this.pickUser(user)}}
                      >
                        <View style={[styles.listItem, {display: this.state.showMenu}]}>
                          <Text style={styles.smallText}>
                            {user.name}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                  <Pressable
                        key={this.state.users.length}
                        onPressOut={()=>{this.addUser()}}
                      >
                        <View style={[styles.listItem, {borderTopWidth: deviceHeight*0.001, borderColor: theme.onBackground2, display: this.state.showMenu}]}>
                          <Text style={styles.smallText}>
                            Add User
                          </Text>
                        </View>
                      </Pressable>
                </ScrollView>
              </View>

              {/** Full Post View */}
              <Animated.View style={{display: this.state.showPost, elevation: 18, width: deviceWidth, height: deviceHeight, backgroundColor: 'rgba(0,0,0,0.5)', opacity: this.postAnim, position: this.postAnim.__getValue() == 0 ? 'relative' : 'absolute', top: deviceHeight*this.state.postTop}}></Animated.View>
              <Animated.View style={{borderRadius: deviceHeight*0.02, display: this.state.showPost, elevation: 20, alignSelf: 'center', backgroundColor: theme.background, opacity: this.postAnim, width: deviceWidth*0.95, height: deviceHeight*0.925, position: this.postAnim.__getValue() == 0 ? 'relative' : 'absolute', top: deviceHeight*(0.05+this.state.postTop)}}>
                <View style={[styles.item, {borderTopLeftRadius: deviceHeight*0.02, borderTopRightRadius: deviceHeight*0.02, width: deviceWidth*0.95, marginBottom: 0}]}>
                    <View style={[styles.postControlBar, {marginLeft: deviceWidth*0.025}]}>
                        <Pressable 
                            style={styles.icon}
                            activeOpacity={1}
                            onPress={() => {this.likePost(this.state.currentImage)}}>
                          <Image
                            source={{uri: icons.like}}
                            style={[styles.icon, {tintColor: this.state.currentImage.likedBy.includes(this.state.user) ? theme.accent : theme.onBackground2}]}
                          />
                        </Pressable>
                        <Pressable 
                            style={styles.icon}
                            activeOpacity={1}
                            onPress={() => {this.savePost(this.state.currentImage)}}>
                          <Image
                            source={{uri: icons.save}}
                            style={[styles.icon, {tintColor: this.state.user.saved.includes(this.state.currentImage) ? theme.accent : theme.onBackground2}]}
                          />
                        </Pressable>
                        <Pressable 
                            style={styles.icon}
                            activeOpacity={1}
                            onPress={() => {this.sharePost(this.state.currentImage)}}>
                          <Image
                            source={{uri: icons.share}}
                            style={styles.icon}
                          />
                        </Pressable>
                        <View style={{width: (deviceWidth*0.92) - (deviceHeight * 0.25)}}></View>
                        <Pressable 
                            style={styles.icon}
                            activeOpacity={1}
                            onPress={() => {this.exitPost()}}>
                          <Image
                            source={{uri: icons.exit}}
                            style={styles.icon}
                          />
                        </Pressable>
                    </View>
                </View>
                
                <ScrollView>
                  
                  <Image
                      source={this.state.currentImage.src}
                      style={{width: deviceWidth*0.95, height: deviceWidth*0.95*this.state.currentImage.ratio, backgroundColor: theme.outline}}
                  />

                  {this.state.currentImage.comments.map((comm, index) => {
                    return(
                      <View style={{backgroundColor: theme.background2, padding: deviceWidth*0.01, marginBottom: deviceHeight*0.005}} key={index}>
                        <Text style={[styles.smallText, {fontWeight: 'bold'}]}>
                          {comm.user.name}
                        </Text>
                        <Text style={styles.smallText}>
                          {comm.comment}
                        </Text>
                      </View>
                    );
                  })}
                </ScrollView>

                <View style={{borderBottomLeftRadius: deviceHeight*0.02, borderBottomRightRadius: deviceHeight*0.02, alignItems: 'center', backgroundColor: theme.background2, padding: deviceWidth*0.01, marginBottom: 0, flexDirection: 'row'}}>
                  <TextInput
                    editable={this.postAnim.__getValue() == 1}
                    value={this.state.commentInEdit}
                    onChangeText={(text) => {this._changeComment(text)}}
                    style={[styles.smallText, {width: deviceWidth*0.78,borderBottomColor: theme.onBackground2, borderBottomWidth: deviceHeight*0.002, marginBottom: deviceHeight*0.01}]}
                  />
                  <Pressable
                      activeOpacity={1}
                      onPress={() => {this.submitComment()}}>
                      
                    <Image
                      source={{uri: icons.send}}
                      style={{opacity: this.state.commentInEdit == "" ? 0.5 : 1, alignSelf: 'center', width: deviceHeight*0.04, height: deviceHeight*0.04, marginRight: deviceWidth*0.02, tintColor: theme.onBackground2}}
                    />
                  </Pressable>
                </View>
              </Animated.View>

            </View>
        );
    }
}

let styles = generateStyles(deviceHeight, deviceWidth, theme);
