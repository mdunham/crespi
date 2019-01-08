import React, { Component } from 'react';
require('three-gltfloader');
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { SHOW_INFO, HIDE_INFO, LOOKING_AT } from '../redux/actions/actions';
import Video from './Video';
import { Scene, Toast } from '../style/dom.js';
import { sphereData } from '../configuration/config.js';
/* TODO:
  add redux to index for universal state
  add sass loader
  fix controls
  config
*/// sends state to props
const mapStateToProps = state => ({
  info: state.info,
  lookingAt: state.looking,
});
// sends props actions, taken as props to reducer
const mapDispatchToProps = dispatch => ({
  // binding actions. This method takes: (action, dispatcher)
  ...bindActionCreators(
    {
      SHOW_INFO,
      HIDE_INFO,
      LOOKING_AT,
    },
    dispatch,
  ),
});

class Dom extends Component {
  constructor(props) {
    super(props);
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.buttonsGroup = new THREE.Group();
    this.selected;
    this.minZoom = 1;
    this.maxZoom = 2;
    this.controls;
    this.elements = [];
  }
  render() {
    return (
      <Scene
        ref={el => (this.container = el)}
        onMouseDown={this.cameraRay}
        onClick={this.onClickEvent}
      >
        <Toast>{this.props.lookingAt}</Toast>
      </Scene>
    );
  }
  cameraRay = () => {
    console.log(sphereData);
    let cameraRay = new THREE.Raycaster();
    let rayVector = new THREE.Vector2(0, 0);
    cameraRay.setFromCamera(rayVector, this.camera);
    this.selected = cameraRay.intersectObjects(this.scene.children, true);
    try {
      if (typeof this.selected !== 'undefined') {
        // reading gltf.scene.children[0].nam
        this.props.LOOKING_AT(this.selected[0].object.parent.parent.name);
      }
    } catch (e) {
      this.props.LOOKING_AT('');
    }
  };
  controls = () => {
    this.controls = new THREE.OrbitControls(this.camera);
  };
  onClickEvent = e => {
    // calculates mouse position
    let mouse = new THREE.Vector2(
      (e.clientX / window.innerWidth) * 2 - 1,
      -(e.clientY / window.innerHeight) * 2 + 1,
    );
    let raycaster = new THREE.Raycaster();
    // updates the ray with mouse and camera position
    raycaster.setFromCamera(mouse, this.camera);
    //array of objects intersected by raycaster
    this.selected = raycaster.intersectObjects(this.scene.children, true);
    //let videoIntersects = raycaster.intersectObjects(video.children);
    //if raycaster detects something
    if (this.selected.length) {
      sphereData.forEach(element => {
        if (this.selected[0].object.parent.parent.name === element.id) {
          this.camera.lookAt(element.x, element.y, element.z);
          this.controls.enabled = false;
          this.camera.zoom = 2;
          this.props.SHOW_INFO(
            this.selected[0].object.parent.parent.name
          );
        } else {
        }
      });
    }
  };
  animate = () => {
    requestAnimationFrame(this.animate);
    if (this.elements) {
      // rotates every gltf.scene object pushed to this.elements
      this.elements.forEach(element => {
        element.rotation.y += 0.01;
      });
    }
    this.renderer.render(this.scene, this.camera);
  };
  componentDidMount = () => {
    // default: white
    console.log(sphereData);
    this.scene.background = new THREE.Color();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    const light = new THREE.AmbientLight();
    this.scene.add(light);
    const setCamera = () => {
      // telling this.camera what to lock at
      // setting this.camera init position
      // this.camera.target = new THREE.Vector3(0, 0, 50);
      // last one is fov
      this.camera.position.set(0, 0, 1);
      this.scene.add(this.camera);
    };
    const createButton = () => {
      const MAP_LOADER = new THREE.GLTFLoader();
      //spheredata.lenght determinates sphere quantity
      for (let i = 0; i < sphereData.length; i++) {
        // alt + 0096 for backthick (``) 😜
        MAP_LOADER.load(`../assets/3d/${sphereData[i].id}.gltf`, gltf => {
          this.scene.add(gltf.scene);
          gltf.scene.position.x = sphereData[i].x;
          gltf.scene.position.y = sphereData[i].y;
          gltf.scene.position.z = sphereData[i].z;
          gltf.scene.children[0].name = sphereData[i].id;
          this.scene.add(gltf.scene);
          this.elements.push(gltf.scene);
        });
      }
    };
    const onWindowResize = () => {
      // asign new window sizes to camera
      this.camera.aspect = window.innerWidth / window.innerHeight;
      // updates camera projections
      this.camera.updateProjectionMatrix();
      // updates this.renderer size on reductction for responsive canvas
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    };
    // adding addEventListeners for functions onClick and onWindowResize
    window.addEventListener('resize', onWindowResize, false);
    // wait react container element (This must be called at the end of everything)
    this.container.appendChild(this.renderer.domElement);
    setCamera();
    createButton();
    this.controls();
    this.animate();
    this.cameraRay();
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Dom);
