import React, {Component} from 'react';
import {BackHandler, ToastAndroid,ProgressBarAndroid, AppRegistry} from 'react-native';
import {WebView} from 'react-native-webview';

let lastUrl = '';
let currentUrl = '';

export default class ActivityIndicatorDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canGoBack: false,
      canExit: false,
      clickCount: 0,
      progress: 0,
    };
  }

  WEBVIEW_REF = React.createRef();

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    // console.log('get last', lastUrl);
    // console.log('get current', currentUrl);
    if (this.state.canExit) {
      this.state.clickCount = this.state.clickCount + 1;
      if (this.state.clickCount > 1) {
        return false;
      }
      ToastAndroid.show('再按一次退出', ToastAndroid.SHORT);
    } else if (this.state.canGoBack) {
      console.log(this.WEBVIEW_REF.current);
      this.state.clickCount = 0;
      // console.log('go back');
      this.WEBVIEW_REF.current.goBack();
      return true;
    } else {
      this.state.clickCount = this.state.clickCount + 1;
      ToastAndroid.show('再按一次退出', ToastAndroid.SHORT);
      if (this.state.clickCount > 1) {
        return false;
      }
    }
    return true;
  };

  onNavigationStateChange = navState => {
    lastUrl = currentUrl;
    currentUrl = navState.url;
    // console.log('set last', lastUrl);
    // console.log('set current', currentUrl);
    this.setState({
      canGoBack: navState.canGoBack,
    });
    if (
      currentUrl.endsWith('login') &&
      (lastUrl.endsWith('overview') ||
        lastUrl.endsWith('production') ||
        lastUrl.endsWith('warehousing') ||
        lastUrl.endsWith('security'))
    ) {
      // console.log('exit exit');
      this.state.canExit = true;
      return;
    }
    this.state.canExit = false;
  };
  onMessage = (event) => {
    const rep = event.nativeEvent.data;
    //console.log('-----------webview返回结果--------------');
    let minLog = rep;
    if (rep.length > 300) {
        minLog = rep.substring(0, 290);    //日志太长影响观感
    }
    console.log(minLog);
  };

  render() {
    return (
      <WebView
        source={{
          uri: 'http://8.134.66.236/',
          // uri: 'http://192.168.31.237:8888/',
        }}
        ref={this.WEBVIEW_REF}
        onNavigationStateChange={this.onNavigationStateChange}
        // 在webView内部网页中，调用window.postMessage可以触发此属性对应的函数，通过event.nativeEvent.data获取接收到的数据，实现网页和RN之间的数据传递
        onMessage={ this.onMessage }
        // 加载时强制使用loading转圈视图，如果为true，webview可能会加载失败，显示为空白
        startInLoadingState={true}
        // webview加载错误页面
        renderError={this.renderErrorView}
      />
    );
  }
}

AppRegistry.registerComponent('App', () => ActivityIndicatorDemo);
