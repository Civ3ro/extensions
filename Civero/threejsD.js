// Name: Three-D
// ID: threeDjsExtension
// Description: Use three js inside Turbowarp! A 3D graphics library. 
// By: me <https://scratch.mit.edu/users/civero/>
// License: MIT License Copyright (c) 2021-2024 TurboWarp Extensions Contributors 
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("Three-D extension must run unsandboxed");
  }

  // @ts-ignore
  const vm = Scratch.vm;
  const runtime = vm.runtime
  const renderer = Scratch.renderer;
  const Cast = Scratch.Cast;
  const menuIconURI = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMTgiIGhlaWdodD0iMjE4IiB2aWV3Qm94PSIwLDAsMjE4LDIxOCI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEzMSwtNzEpIj48ZyBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCI+PHBhdGggZD0iTTEzMywxODBjMCwtNTkuMDk0NDcgNDcuOTA1NTMsLTEwNyAxMDcsLTEwN2M1OS4wOTQ0NywwIDEwNyw0Ny45MDU1MyAxMDcsMTA3YzAsNTkuMDk0NDcgLTQ3LjkwNTUzLDEwNyAtMTA3LDEwN2MtNTkuMDk0NDcsMCAtMTA3LC00Ny45MDU1MyAtMTA3LC0xMDd6IiBmaWxsPSIjMTkxOTE5IiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iIzVjZDQ5OCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIvPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjExLjU5OCwyODAuNDdsLTQzLjIxMywtMTc0Ljk0bDE3My4yMyw0OS44NzR6Ii8+PHBhdGggZD0iTTI1NC45NjgsMTMwLjQ3MmwyMS41OTEsODcuNDk2bC04Ni41NjcsLTI0Ljk0NXoiLz48cGF0aCBkPSJNMjMzLjQ4OCwyMDQuODlsLTEwLjcyNCwtNDMuNDY1bDQzLjAwOCwxMi4zNDZ6Ii8+PHBhdGggZD0iTTIxMi4wMzYsMTE4LjAxM2wxMC43MjQsNDMuNDY1bC00My4wMDgsLTEyLjM0NnoiLz48cGF0aCBkPSJNMjk4LjA0OCwxNDIuNzlsMTAuNzI0LDQzLjQ2NWwtNDMuMDA4LC0xMi4zNDZ6Ii8+PHBhdGggZD0iTTIzMy40OTMsMjA0LjkybDEwLjcyNCw0My40NjVsLTQzLjAwOCwtMTIuMzQ2eiIvPjwvZz48cGF0aCBkPSJNMjQwLDczYzU5LjA5NDQ3LDAgMTA3LDQ3LjkwNTUzIDEwNywxMDdjMCw1OS4wOTQ0NyAtNDcuOTA1NTMsMTA3IC0xMDcsMTA3Yy01OS4wOTQ0NywwIC0xMDcsLTQ3LjkwNTUzIC0xMDcsLTEwN2MwLC01OS4wOTQ0NyA0Ny45MDU1MywtMTA3IDEwNywtMTA3eiIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2U9IiM1Y2Q0OTgiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiLz48L2c+PC9nPjwvc3ZnPg==";

  let THREE
  let GLTFLoader
  let OrbitControls

  let threeRenderer
  let scene
  let camera
  let object

  let materials = {}
  let geometries = {}
  let lights = {}
  
    //custom functions
    function vector3ToString(prop) {
      if (!prop) return "0,0,0";

      const x = (typeof(prop.x) === "number") ? prop.x : (typeof(prop._x) === "number") ? prop._x : (JSON.stringify(prop).includes("X")) ? prop : 0
      const y = (typeof(prop.y) === "number") ? prop.y : (typeof(prop.y) === "number") ? prop._y : 0
      const z = (typeof(prop.z) === "number") ? prop.z : (typeof(prop.z) === "number") ? prop.z : 0

      return [x, y, z]
    }
    function createObject(name, content) {
      getObject(name, true)
      if (object) {removeObject(name); alert(name + " already exsisted, will replace!")}
      content.name = name
      content.rotation._order = "YXZ"

      scene.add(content)
    }
    function removeObject(name) {
      getObject(name)
      scene.remove(object)
    }
    function getObject(name, isNew) {
      object = null
      if (!scene) {alert("Can not get " + name + ". Create a scene first!"); return;}
      object = scene.getObjectByName(name)
      if (!object && !isNew) {alert(name + " does not exist! Add it to scene"); return;}
    }
    function encodeCostume (name) {
      return Scratch.vm.editingTarget.sprite.costumes.find(c => c.name === name).asset.encodeDataURI();
    }
    function setTexutre (texture, mode) {
      texture.colorSpace = THREE.SRGBColorSpace;

      if (mode === "Pixelate") {
      texture.minFilter = THREE.NearestFilter;
      texture.magFilter = THREE.NearestFilter;
      } else { //Blur
      texture.minFilter = THREE.LinearMipMapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      }
      texture.generateMipmaps = true;
    }
    async function resizeImageToSquare(uri, size = 128) {
    return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      // clear + draw image scaled to fit canvas
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);

      resolve(canvas.toDataURL()); // return normalized Data URI
    };
    img.src = uri;
  });
}

    
//
class threeDjsExtension {
  constructor() {  
    this.ready = this.load();
    this.startRenderLoop();
    }

  startRenderLoop() {
  const loop = () => {
    if (scene && camera) {
      if (this.controls) this.controls.update(); // OrbitControl: keep controls synced
      threeRenderer.render(scene, camera);
    }
    requestAnimationFrame(loop);
  };
  loop();
}

async load() {
    if (!THREE) {
      
      // @ts-ignore
      THREE = await import("https://esm.sh/three@0.180.0");
      // @ts-ignore
      GLTFLoader = await import("https://esm.sh/three@0.180.0/examples/jsm/loaders/GLTFLoader.js");
      // @ts-ignore
      OrbitControls = await import("https://esm.sh/three@0.180.0/examples/jsm/controls/OrbitControls.js");

      threeRenderer = new THREE.WebGLRenderer({alpa: true})
      threeRenderer.setSize(480, 360)
      threeRenderer.setPixelRatio(window.devicePixelRatio * 1)

      renderer.addOverlay( threeRenderer.domElement, "scale" )
      renderer.addOverlay(renderer.canvas, "manual")
      renderer.setBackgroundColor(1, 1, 1, 0)

      this.gltf = new GLTFLoader.GLTFLoader()

      this.defaultMaterial = new THREE.MeshStandardMaterial()
      this.defaultGeometry = new THREE.BoxGeometry()

    }
  }

    getInfo() {
      return {
        id: "threeDjsExtension",
        name: Scratch.translate("Three-D"),
        color1: "#222222",
        color2: "#169976",
        color3: "#1DCD9F",
        menuIconURI,

        blocks: [
            {blockType: Scratch.BlockType.BUTTON, text: "Show docs", func: "openDocs"},
            {blockType: Scratch.BlockType.LABEL, text: "Renderer"},
            {opcode: "setRendererRatio", blockType: Scratch.BlockType.COMMAND, text: "set Pixel Ratio to [VALUE]", arguments: {VALUE: {type: Scratch.ArgumentType.STRING, defaultValue: "1"}}},
            

            {blockType: Scratch.BlockType.LABEL, text: "Scene"},
            {opcode: "newScene", blockType: Scratch.BlockType.COMMAND, text: "new Scene", arguments: {}},
            {opcode: "setSceneProperty", blockType: Scratch.BlockType.COMMAND, text: "set Scene [PROPERTY] to [VALUE]", arguments: {PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "sceneProperties", defaultValue: "background"}, VALUE: {type: Scratch.ArgumentType.STRING, defaultValue: "#000000"}}},
            "---",
            {opcode: "getSceneObjects", blockType: Scratch.BlockType.REPORTER, text: "get Scene [THING]", arguments:{THING: {type: Scratch.ArgumentType.STRING, menu: "sceneThings"}}},
            "---",
            {opcode: "renderSceneCamera", blockType: Scratch.BlockType.COMMAND, text: "set Scene rendering camera to [CAMERA]", arguments: {CAMERA: {type: Scratch.ArgumentType.STRING, defaultValue: "myCamera"}}},

            {blockType: Scratch.BlockType.LABEL, text: "Camera"},
            {opcode: "addCamera", blockType: Scratch.BlockType.COMMAND, text: "add camera [TYPE] [CAMERA] to scene", arguments: {CAMERA: {type: Scratch.ArgumentType.STRING, defaultValue: "myCamera"}, TYPE: {type: Scratch.ArgumentType.STRING, menu: "cameraTypes"}}},
            {opcode: "setCamera", blockType: Scratch.BlockType.COMMAND, text: "set camera [PROPERTY] of [CAMERA] to [VALUE]", arguments: {CAMERA: {type: Scratch.ArgumentType.STRING, defaultValue: "myCamera"}, PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "cameraProperties"}, VALUE: {type: Scratch.ArgumentType.STRING, defaultValue: "0"}}},
            {opcode: "getCamera", blockType: Scratch.BlockType.REPORTER, text: "get camera [PROPERTY] of [CAMERA]", arguments: {CAMERA: {type: Scratch.ArgumentType.STRING, defaultValue: "myCamera"}, PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "cameraProperties"}}},
                        

            {blockType: Scratch.BlockType.LABEL, text: "Object"},
            {opcode: "addObject", blockType: Scratch.BlockType.COMMAND, text: "add object [OBJECT3D] to scene", arguments: {OBJECT3D: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"}}},
            {opcode: "setObject", blockType: Scratch.BlockType.COMMAND, text: "set object [PROPERTY] of [OBJECT3D] to [NAME]", arguments: {OBJECT3D: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"}, PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "objectProperties"}, NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myMaterial"}}},
            {opcode: "getObject", blockType: Scratch.BlockType.REPORTER, text: "get object [PROPERTY] of [OBJECT3D]", arguments: {OBJECT3D: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"}, PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "objectProperties"}}},
            {opcode: "removeObject", blockType: Scratch.BlockType.COMMAND, text: "remove object [OBJECT3D] from scene", arguments: {OBJECT3D: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"}}},
       
            {blockType: Scratch.BlockType.LABEL, text: "Transforms"},            
            {opcode: "setObjectV3", blockType: Scratch.BlockType.COMMAND, text: "set transform [PROPERTY] of [OBJECT3D] to [VALUE]", arguments: {PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "objectVector3", defaultValue: "position"}, OBJECT3D: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"}, VALUE: {type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]"}}},           
            {opcode: "changeObjectV3", blockType: Scratch.BlockType.COMMAND, text: "change transform [PROPERTY] of [OBJECT3D] by [VALUE]", arguments: {PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "objectVector3", defaultValue: "position"}, OBJECT3D: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"}, VALUE: {type: Scratch.ArgumentType.STRING, defaultValue: "[1,1,1]"}}},
            {opcode: "changeObjectXV3", blockType: Scratch.BlockType.COMMAND, text: "change transform [PROPERTY] [X] of [OBJECT3D] to [VALUE]", arguments: {PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "objectVector3"},X: {type: Scratch.ArgumentType.STRING, menu: "XYZ"}, OBJECT3D: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"}, VALUE: {type: Scratch.ArgumentType.STRING, defaultValue: "1"}}},

            {opcode: "getObjectV3", blockType: Scratch.BlockType.REPORTER, text: "get [PROPERTY] of [OBJECT3D]", arguments: {PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "objectVector3", defaultValue: "position"}, OBJECT3D: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"}}},
            "---",

            {blockType: Scratch.BlockType.LABEL, text: "Materials"},
            {opcode: "newMaterial", blockType: Scratch.BlockType.COMMAND, text: "new material [NAME]", arguments: {NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myMaterial"}}},
            {opcode: "setMaterial", blockType: Scratch.BlockType.COMMAND, text: "set material [PROPERTY] of [NAME] to [VALUE]", arguments: {PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "materialProperties"},NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myMaterial"}, VALUE: {type: Scratch.ArgumentType.STRING, defaultValue: "#ffff00"}}},
            {opcode: "removeMaterial", blockType: Scratch.BlockType.COMMAND, text: "remove material [NAME]", arguments: {NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myMaterial"}}},
            
            {blockType: Scratch.BlockType.LABEL, text: "Geometries"},
            {opcode: "newGeometry", blockType: Scratch.BlockType.COMMAND, text: "new geometry [NAME] [TYPE]", arguments: {NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myGeometry"}, TYPE: {type: Scratch.ArgumentType.STRING, menu: "geometryTypes", defaultValue: "BoxGeometry"}}},
            //{opcode: "setGeometry", blockType: Scratch.BlockType.COMMAND, text: "set geometry [PROPERTY] of [NAME] to [VALUE]", arguments: {PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "geometryProperties"},NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myGeometry"}, VALUE: {type: Scratch.ArgumentType.STRING, defaultValue: "1,1,1"}}},
            {opcode: "removeGeometry", blockType: Scratch.BlockType.COMMAND, text: "remove geometry [NAME]", arguments: {NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myGeometry"}, TYPE: {type: Scratch.ArgumentType.STRING, menu: "geometryTypes", defaultValue: "BoxGeometry"}}},
            
            {blockType: Scratch.BlockType.LABEL, text: "Lights"},
            {opcode: "newLight", blockType: Scratch.BlockType.COMMAND, text: "new light [NAME] type [TYPE]", arguments: {NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myLight"}, TYPE: {type: Scratch.ArgumentType.STRING, menu: "lightTypes"}}},
            {opcode: "setLight", blockType: Scratch.BlockType.COMMAND, text: "set light [NAME][PROPERTY] to [VALUE]", arguments: {PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "lightProperties"},NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myLight"}, VALUE: {type: Scratch.ArgumentType.STRING, defaultValue: "#ffffff"}}},
            {opcode: "removeLight", blockType: Scratch.BlockType.COMMAND, text: "remove light [NAME]", arguments: {NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myLight"}}},

            {blockType: Scratch.BlockType.LABEL, text: "Utilities"},
            {opcode: "newColor", blockType: Scratch.BlockType.REPORTER, text: "New Color [HEX]", arguments: {HEX: {type: Scratch.ArgumentType.COLOR, defaultValue: "#9966ff"}}},
            {opcode: "newVector3", blockType: Scratch.BlockType.REPORTER, text: "New Vector [X] [Y] [Z]", arguments: {X: {type: Scratch.ArgumentType.NUMBER}, Y: {type: Scratch.ArgumentType.NUMBER}, Z: {type: Scratch.ArgumentType.NUMBER}}},
            {opcode: "newFog", blockType: Scratch.BlockType.REPORTER, text: "New Fog [COLOR] [NEAR] [FAR]", arguments: {COLOR: {type: Scratch.ArgumentType.COLOR, defaultValue: "#9966ff"}, NEAR: {type: Scratch.ArgumentType.NUMBER}, FAR: {type: Scratch.ArgumentType.NUMBER, defaultValue: 10}}},
            {opcode: "newTexture", blockType: Scratch.BlockType.REPORTER, text: "New Texture [COSTUME] [MODE]", arguments: {COSTUME: {type: Scratch.ArgumentType.COSTUME}, MODE: {type: Scratch.ArgumentType.STRING, menu: "textureModes"}}},
            {opcode: "newCubeTexture", blockType: Scratch.BlockType.REPORTER, text: "New Cube Texture X+[COSTUMEX0]X-[COSTUMEX1]Y+[COSTUMEY0]Y-[COSTUMEY1]Z+[COSTUMEZ0]Z-[COSTUMEZ1] [MODE]", arguments: {"COSTUMEX0": {type: Scratch.ArgumentType.COSTUME},"COSTUMEX1": {type: Scratch.ArgumentType.COSTUME},"COSTUMEY0": {type: Scratch.ArgumentType.COSTUME},"COSTUMEY1": {type: Scratch.ArgumentType.COSTUME},"COSTUMEZ0": {type: Scratch.ArgumentType.COSTUME},"COSTUMEZ1": {type: Scratch.ArgumentType.COSTUME}, MODE: {type: Scratch.ArgumentType.STRING, menu: "textureModes"}}},

            {blockType: Scratch.BlockType.LABEL, text: "Addons"},
            {opcode: "OrbitControl", blockType: Scratch.BlockType.COMMAND, text: "set addon [STATE] Orbit Control", arguments: {STATE: {type: Scratch.ArgumentType.STRING, menu: "onoff"},}},
            {blockType: Scratch.BlockType.LABEL, text: "GLB Load"},
            {blockType: Scratch.BlockType.BUTTON, text: "Load GLB File", func: "loadModelFile"},
            {opcode: "addModel", blockType: Scratch.BlockType.COMMAND, text: "add [ITEM] to scene", arguments: {ITEM: {type: Scratch.ArgumentType.STRING, menu: "modelsList"}}},
        ],
        menus: {
            sceneProperties: {acceptReporters: false, items: [
                {text: "Background", value: "background"},{text: "Background Blurriness", value: "backgroundBlurriness"},{text: "Background Intensity", value: "backgroundIntensity"},{text: "Background Rotation", value: "backgroundRotation"},
                {text: "Environment", value: "environment"},{text: "Environment Intensity", value: "environmentIntensity"},{text: "Environment Rotation", value: "environmentRotation"},{text: "Fog", value: "fog"},
            ]},
            sceneThings: {acceptReporters: false, items: ["Objects", "Materials", "Geometries","Lights","Scene Properties"]},
            objectVector3: {acceptReporters: false, items: [
                {text: "Positon", value: "position"},{text: "Rotation", value: "rotation"},{text: "Scale", value: "scale"},{text: "Facing Direction (.up)", value: "up"}
            ]},
            objectProperties: {acceptReporters: false, items: [
              {text: "Material", value: "material"},{text: "Geometry", value: "geometry"},{text: "castShadow", value: "castShadow"},{text: "receiveShadow", value: "receiveShadow"}
            ]},
            cameraTypes: {acceptReporters: false, items: [
                {text: "Perspective", value: "PerspectiveCamera"},{text: "Orthographic", value: "OrthographicCamera"}
            ]},
            cameraProperties: {acceptReporters: false, items: [
                {text: "Near", value: "near"},{text: "Far", value: "far"},{text: "FOV", value: "fov"},{text: "Focus", value: "focus"},{text: "Zoom", value: "zoom"},
            ]},
            XYZ: {acceptReporters: false, items: [{text: "X", value: "x"},{text: "Y", value: "y"},{text: "Z", value: "z"}]},
            materialProperties: {acceptReporters: false, items: [
              {text: "Color", value: "color"},{text: "Map (texture)", value: "map"},
            ]},
            textureModes: {acceptReporters: false, items: [{text: "Pixelate", value: "Pixelate"},{text: "Blur", value: "Blur"}]},
            geometryTypes: {acceptReporters: false, items: [
              {text: "Box Geometry", value: "BoxGeometry"},{text: "Sphere Geometry", value: "SphereGeometry"},{text: "Plane Geometry", value: "PlaneGeometry"},{text: "Circle Geometry", value: "CircleGeometry"},{text: "Torus Geometry", value: "TorusGeometry"},{text: "Torus Knot Geometry", value: "TorusKnotGeometry"},
            ]},
            /*geometryProperties: {acceptReporters: false, items: [
              {text: "BoxG", value: "BoxGeometry"},{text: "Sphere Geometry", value: "SphereGeometry"},
            ]},*/
            onoff: {acceptReporters: true, items: [{text: "on", value: "1"},{text: "off", value: "0"},]},
            modelsList: {acceptReporters: false, items: () => {
                  const stage = runtime.getTargetForStage();
                  if (!stage) return ["(loading...)"];

                  // @ts-ignore
                  const models = Scratch.vm.runtime.getTargetForStage().getSounds()//.filter(c => c.hasOwnProperty("data"))
                  if (models.length < 1) return [["Load a model!"]]
                  
                  // @ts-ignore
                  return models.map( m =>  [m.name] )
                }},
            lightTypes: {acceptReporters: false, items: [
              {text: "Ambient Light", value: "AmbientLight"},{text: "Directional Light", value: "DirectionalLight"},{text: "Point Light", value: "PointLight"},
            ]},
            lightProperties: {acceptReporters: false, items: [
              {text: "Color", value: "color"},{text: "Intensity", value: "intensity"},
            ]},
        }
      };
    }
    openDocs(){
      alert(`
        Start by creating a scene. Add objects here.
        Add a camera, and set the rendering camera to that one. The stage should update.

        Add an object. By default a white cube will appear.
        Create materials and geometries, then asign the object these.
        You can modify these after!
        
        Pixel ratio is set to 1. Might add a block to change!
        Camera defaults is [0,0,3] FOV: 90 Ratio: Canvas ratio

        Creating Objects/Materials/Geometries with the same name will replace them.
        
        To do:
        Lighting
        `)
    }

    setRendererRatio(args) {
      threeRenderer.setPixelRatio(window.devicePixelRatio * args.VALUE)
    }
    OrbitControl(args) {
      if (!args.STATE) {
        this.controls.enabled = false; 
        threeRenderer.domElement.style.pointerEvents = 'none';
        return
      }

      console.warn("enabling orbit control might disable scratch's mouse detection!")
      threeRenderer.domElement.style.pointerEvents = 'auto';
      this.controls = new OrbitControls.OrbitControls(camera, threeRenderer.domElement);
      this.controls.enableDamping = true; // smooth
    }

    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    newScene(args) {
        scene = new THREE.Scene();
        scene.background = new THREE.Color("#222")
        //scene.add(new THREE.GridHelper(16, 16))
        materials = {}
        geometries = {}
    }

    async setSceneProperty(args) {
        const property = args.PROPERTY;
        const value = await args.VALUE;

        scene[property] = value;
    }
    getSceneObjects(args){
      const names = [];
      if (args.THING === "Objects") {
      scene.traverse(obj => {
        if (obj.name) names.push(obj.name); //if it has a name, add to list!
      }); 
    } 
    else if (args.THING === "Materials") return JSON.stringify(Object.keys(materials))
    else if (args.THING === "Geometries") return JSON.stringify(Object.keys(geometries))
    else if (args.THING === "Ligts") return JSON.stringify(Object.keys(lights)) 
    else if (args.THING === "Scene Properties") {console.log(scene); return "check console"}

      return JSON.stringify(names); // if objects
    }
    renderSceneCamera(args) {
      getObject(args.CAMERA)
      if (!object) return
      camera = object
    }

    addCamera(args) {
        let v2 = new THREE.Vector2()
        threeRenderer.getSize(v2)
        const object = new THREE[args.TYPE](90, v2.x / v2.y  )
        object.position.z = 3
 
        createObject(args.CAMERA, object)
    }
    setCamera(args) {
      getObject(args.CAMERA)
      object[args.PROPERTY].set(...JSON.parse(args.VALUE));
    }
    getCamera(args) {
      getObject(args.CAMERA)
      const value = JSON.stringify(object[args.PROPERTY])
      return value
    }

    addObject(args) {
        const object = new THREE.Mesh();
        object.material = this.defaultMaterial
        object.geometry = this.defaultGeometry
        object.castShadow = true
        object.receiveShadow = true

        createObject(args.OBJECT3D, object)
    }
    setObjectV3(args) {
        getObject(args.OBJECT3D)
        let values = JSON.parse(args.VALUE)

        if (args.PROPERTY === "rotation") {
          values = values.map(v => v * Math.PI / 180);
          object.rotation.set(0,0,0) //why not? set.(...values)
        }
          object[args.PROPERTY].set(...values);
    }
    changeObjectV3(args) {
        getObject(args.OBJECT3D)
        let values = JSON.parse(args.VALUE)

        if (args.PROPERTY === "rotation") {
          values = values.map(v => v * Math.PI / 180);
          object.rotation.x += values[0]
          object.rotation.y += values[1]
          object.rotation.z += values[2]
        }
        else {
          object[args.PROPERTY].add(...values);
        }
    }
    changeObjectXV3(args) {
        getObject(args.OBJECT3D)
        let value = args.VALUE
        if (args.PROPERTY === "rotation") value = value * Math.PI / 180

          object[args.PROPERTY][args.X] += value
    }
    getObjectV3(args) {
        getObject(args.OBJECT3D)
        let values = vector3ToString(object[args.PROPERTY])
        if (args.PROPERTY === "rotation") {
          const toDeg = Math.PI/180
          values = [values[0]/toDeg,values[1]/toDeg,values[2]/toDeg,]
        }

        return JSON.stringify(values)
    }

    setObject(args){
      getObject(args.OBJECT3D)
      let value = args.VALUE
      if (args.PROPERTY === "material") value = materials[args.NAME]
      else if (args.PROPERTY === "geometry") value = geometries[args.NAME]

      object[args.PROPERTY] = value
    }
    getObject(args){
      getObject(args.OBJECT3D)
      const value = object[args.PROPERTY]
      console.log(value)
      return JSON.stringify(value)
    }
    removeObject(args) {
      removeObject(args.OBJECT3D)
    }

    newMaterial(args) {
      if (materials[args.NAME]) alert ("material already exists! will replace...")
      const mat = new THREE.MeshStandardMaterial();
      mat.name = args.NAME;

      materials[args.NAME] = mat;
    }
    async setMaterial(args) {
      const mat = materials[args.NAME]
      mat[args.PROPERTY] = await (args.VALUE)

      mat.needsUpdate = true;
    }
    removeMaterial(args){
      const mat = materials[args.NAME]
      mat.dispose()
      delete(materials[args.NAME])
    }

    newGeometry(args) {
      if (geometries[args.NAME]) alert ("geometry already exists! will replace...")
      const geo = new THREE[args.TYPE]()
      geo.name = args.NAME;

      geometries[args.NAME] = geo;
    }
    setGeometry(args) {
      const geo = geometries[args.NAME]
      geo[args.PROPERTY] = (args.VALUE)

      geo.needsUpdate = true;
    }
    removeGeometry(args){
      const geo = geometries[args.NAME]
      geo.dispose()
      delete(geometries[args.NAME])
    }

    newLight(args) {
      if (lights[args.NAME]) alert ("light already exists! will replace...")
      const light = new THREE[args.TYPE](0xffffff, 1)
      if (args.TYPE === "PointLight")
      light.castShadow = true
      light.name = args.NAME

      scene.add(light)
      lights[args.NAME] = light
      console.log(lights)
    }
    setLight(args) {
      const light = lights[args.NAME]
      light[args.PROPERTY] = args.VALUE

      light.needsUpdate = true
      console.log(lights, light)
    }
    removeLight(args) {
      const light = lights[args.NAME]
      
      scene.remove(light);
      // Dispose shadow maps if any
      if (light.shadow && light.shadow.map) {
        light.shadow.map.dispose();
      }

      delete(lights[args.NAME])
    }

    newColor(args) {
        return new THREE.Color(args.HEX);
    }
    newVector3(args) {
        return JSON.stringify([args.X, args.Y, args.Z])
    }
    newFog(args) {
        return new THREE.Fog(args.COLOR, args.NEAR, args.FAR)
    }
    async newTexture(args) {
      const textureURI = encodeCostume(args.COSTUME)
      const texture = await new THREE.TextureLoader().loadAsync(textureURI);
      texture.name = args.COSTUME;

      setTexutre(texture, args.MODE)
      return texture;
    }
    async newCubeTexture(args) {
      const uris = [encodeCostume(args.COSTUMEX0),encodeCostume(args.COSTUMEX1), encodeCostume(args.COSTUMEY0),encodeCostume(args.COSTUMEY1), encodeCostume(args.COSTUMEZ0),encodeCostume(args.COSTUMEZ1)]
      const normalized = await Promise.all(uris.map(uri => resizeImageToSquare(uri, 256)));
      const texture = await new THREE.CubeTextureLoader().loadAsync(normalized);
      
      texture.name = "CubeTexture" + args.COSTUMEX0;

      setTexutre(texture, args.MODE)
      return texture;
    }

    async loadModelFile(args, util) {
      // @ts-ignore
      async function openFileExplorer(args, util) {
        return new Promise((resolve) => {
          const input = document.createElement("input");
            input.type = "file";
            input.accept = ".glb"
            input.multiple = false;
            input.onchange = () => {
              resolve(input.files)
              input.remove()
            };
            input.click();
        });}

      openFileExplorer().then(files => {
        const file = files[0];
        const reader = new FileReader();

        reader.onload = async (e) => {
          const arrayBuffer = e.target.result;
          
        { // From lily's assets

              // Thank you PenguinMod for providing this code.
          {
            const targetId = runtime.getTargetForStage().id; //util.target.id not working!
            const assetName = Cast.toString(file.name);

            //const res = await Scratch.fetch(args.URL);
            //const buffer = await res.arrayBuffer();
            const buffer = arrayBuffer

            const storage = runtime.storage;
            const asset = storage.createAsset(
              storage.AssetType.Sound,
              storage.DataFormat.MP3,
              // @ts-ignore
              new Uint8Array(buffer),
              null,
              true
            );

            try {
              await vm.addSound(
                // @ts-ignore
                {
                  asset,
                  md5: asset.assetId + "." + asset.dataFormat,
                  name: assetName,
                },
                targetId
              );
              alert("Model loaded successfully!");
            } catch (e) {
              console.error(e);
              alert("Error loading model.");
            }
          }
          // End of PenguinMod
        }
        };

        reader.readAsArrayBuffer(file);
      });

    }

    addModel(args) {
    const model = runtime.getTargetForStage().getSounds().find(c => c.name === args.ITEM /*&& c.dataFormat === "glb"*/);
    if (!model) return;
      console.log(model)
      // @ts-ignore
      console.log(model.asset.data)

      this.gltf.parse(
        // @ts-ignore
        model.asset.data.buffer, 
        "", 
        gltf => {
          console.log("added!")
          scene.add(gltf.scene);
          console.log(gltf)
        },
        error => {console.error("Error parsing GLB model:", error);}
      );
    }

  }

  // @ts-ignore throws error bcs separator "---",
  Scratch.extensions.register(new threeDjsExtension());
})(Scratch);