import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo'
import Rank from './components/Rank/Rank'
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import './App.css';
// import { tsConstructorType } from '@babel/types';

const app = new Clarifai.App({
  apiKey: '32e6553e88c94bfb8d25f62d826fd97e'
 });

const particlesOptions = {
  particles: {
    number: {
      value: 99,
      density: {
        enable: true,
        value_area: 800
      }
    },
    color: {
      value: '#6495ED'
    },
    line_linked: {
      color: '#66cdaa',
      shadow: {
        enable: false
      }
    },
    size: {
      value: 3,
      random: true,
    },
    move: {
      enable: true,
      speed: 3,
      random: true,
      out_mode: "out",
      attract: {
        enable: false,
        rotateX: 600,
        rotateY: 1200
      }
    }
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {}
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = image.width;
    const height = image.height;
    console.log(clarifaiFace);
    return  {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayClarifaiFace = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response => this.displayClarifaiFace(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="App">
        <Particles className='particles'
                  params={particlesOptions}
                />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
      </div>
    );
  }
}

export default App;
