import React, { Component } from "react";
import SoundPlayer from "react-native-sound-player";
import { Easing, Animated, View, Button } from "react-native";
import Slider from "@react-native-community/slider";

export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.RotateValueHolder = new Animated.Value(0);
    this.state = {
      pause: false,
      stopped: true,
      duration: 0.0,
      currentTime: 0.0,
      volume: 0.5
    };
  }

  playSong() {
    if (this.state.stopped) {
      SoundPlayer.loadSoundFile("rammstein", "mp3");
      SoundPlayer.onFinishedLoading((success: boolean) => {
        // success is true when the sound is played
        SoundPlayer.play();
      });
    } else {
      SoundPlayer.play();
      // this.getInfo();
    }
      this.state.stopped = false;
      this.state.pause = false;
      SoundPlayer.setVolume(this.state.volume);
      this.interval = setInterval(() => this.getInfo(), 1000);
    this.startImageRotate();
  }

  pauseSong() {
     clearInterval(this.state.interval);
    try {
      SoundPlayer.pause();
      this.setState({
        stopped: false,
        pause: true
      });
    } catch (e) {
      alert("Cannot play the file");
      console.log("cannot play the song file", e);
    }
  }

  stopSong() {
    clearInterval(this.state.interval);
    try {
      SoundPlayer.stop();
      this.setState({
        stopped: true,
        pause: false
      });
    } catch (e) {
      alert("Cannot play the file");
      console.log("cannot play the song file", e);
    }
  }

async getInfo() { // You need the keyword `async`
    try {
      const info = await SoundPlayer.getInfo() // Also, you need to await this because it is async
      await this.setState({
        duration: info.duration,
        currentTime: info.currentTime
      })
      console.log('getInfo', info) // {duration: 12.416, currentTime: 7.691}
    } catch (e) {
      console.log('There is no song playing', e)
    }
  }

startImageRotate() {
  if(!this.state.pause && !this.state.stopped){
    this.RotateValueHolder.setValue(0);
    Animated.timing(this.RotateValueHolder, {
      toValue: 1,
      duration: 3000,
      easing: Easing.linear
    }).start(() => this.startImageRotate());
  }
    }

  render() {
  const RotateData = this.RotateValueHolder.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    return (
      <View
       style={{
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  }}
      >
  <Animated.Image
          style={{
            transform: [{ rotate: RotateData }],
          }}
          source={require('./logo.jpg')}
        />
        <Slider
          style={{
          width: "100%",
            height: 40
          }}
          minimumValue={0}
          maximumValue={1}
          step={0.01}
          value={this.state.volume}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
          onValueChange={(volume) => 
            {
              SoundPlayer.setVolume(volume);
              this.state.volume = volume;
            }
          }
        />
        <Button onPress={() => this.playSong()} title="Play" />
        <Button onPress={() => this.pauseSong()} title="Pause" />
        <Button onPress={() => this.stopSong()} title="Stop" />
        <Slider
          style={{
             width: "100%",
            height: 40
          }}
          minimumValue={0}
          maximumValue={this.state.duration}
          value={this.state.currentTime}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
        />
      </View>
    );
  }
}
