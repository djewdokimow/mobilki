import React, { Component } from 'react';
import { View } from "react-native";
import * as Sensors from "react-native-sensors";
import AnimatedModelView from "react-native-gl-model-view";

export default class App extends Component {
constructor(props) {
    super(props);
        this.state = {
      rotateX: 0,
      rotateZ: 0,
      y:0,
      fromXY: undefined,
      valueXY: undefined,
      x: 0, y: 0, z: 0
    };

    Sensors["gyroscope"]
      .subscribe(({ x,y ,z}) => {
        this.setState(state => ({
          y: y + state.y,
          x:x+state.x,
          z:z+state.z
        }));
    });
  }

render() {
  return (
     <AnimatedModelView
      model={{
        uri:"mjolnir.obj"
      }}
      texture={{
        uri: 'mjolnir6.png'

      }}
        scale={0.2}
        translateZ={-2}
        rotateX={this.state.x}
        rotateY={this.state.y}
        rotateZ={360-this.state.z}
      style={{flex: 1}}
      animate
    />
    );
}
}
