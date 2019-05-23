import React, { Component } from "react";
import "./App.css";
import Navigation from "./Components/Navigation";
import Logo from "./Components/Logo";
import ImageLinkForm from "./Components/ImageLinkForm";
import FaceRecognition from "./Components/FaceRecognition";
import Clarifai from "clarifai";
import Rank from "./Components/Rank";
import "tachyons";
import Particles from "react-particles-js";
import Signin from "./Components/signin";
import Register from "./Components/Register";

const app = new Clarifai.App({
  apiKey: "594edc764e274ca094eb42da214956b7"
});

const initialState = {
  input: "",
  imageURL: "",
  box: {},
  route: "signin",
  isSignedIn: true,
  users: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: ""
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = data => {
    this.setState({
      users: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    });
  };

  calculateFaceLocation = data => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height
    };
  };
  displayFaceBox = box => {
    this.setState({ box: box });
  };

  onInputChange = event => {
    this.setState({ input: event.target.value });
  };
  onButtonSubmit = () => {
    this.setState({ imageURL: this.state.input });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => {
        if (response) {
          fetch("http://localhost:8080/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.users.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(
                Object.assign(this.state.users, { entries: count })
              );
            })
            .catch(console.log());
        }
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch(err => console.log(err));
  };

  onRouteChange = route => {
    if (route === "signout") {
      this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }

    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, route, imageURL, box } = this.state;
    return (
      <div className="App">
        <Particles
          className="particles"
          params={{
            particles: {
              line_linked: {
                shadow: {
                  enable: true,
                  color: "#3CA9D1",
                  blur: 5
                }
              }
            }
          }}
        />

        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {this.state.route === "home" ? (
          <div>
            <Logo />
            <Rank
              name={this.state.users.name}
              entries={this.state.users.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition box={box} imageURL={imageURL} />
          </div>
        ) : route === "signin" ? (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
