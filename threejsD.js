// Name: Three JS
// ID: threejsExtension
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
  if (Scratch.vm.extensionManager._loadedExtensions.has("threejsExtension")) return


  const vm = Scratch.vm;
  const runtime = vm.runtime
  const renderer = Scratch.renderer;
  const Cast = Scratch.Cast;
  const menuIconURI = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMTgiIGhlaWdodD0iMjE4IiB2aWV3Qm94PSIwLDAsMjE4LDIxOCI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEzMSwtNzEpIj48ZyBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCI+PHBhdGggZD0iTTEzMywxODBjMCwtNTkuMDk0NDcgNDcuOTA1NTMsLTEwNyAxMDcsLTEwN2M1OS4wOTQ0NywwIDEwNyw0Ny45MDU1MyAxMDcsMTA3YzAsNTkuMDk0NDcgLTQ3LjkwNTUzLDEwNyAtMTA3LDEwN2MtNTkuMDk0NDcsMCAtMTA3LC00Ny45MDU1MyAtMTA3LC0xMDd6IiBmaWxsPSIjMTkxOTE5IiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iIzVjZDQ5OCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIvPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjExLjU5OCwyODAuNDdsLTQzLjIxMywtMTc0Ljk0bDE3My4yMyw0OS44NzR6Ii8+PHBhdGggZD0iTTI1NC45NjgsMTMwLjQ3MmwyMS41OTEsODcuNDk2bC04Ni41NjcsLTI0Ljk0NXoiLz48cGF0aCBkPSJNMjMzLjQ4OCwyMDQuODlsLTEwLjcyNCwtNDMuNDY1bDQzLjAwOCwxMi4zNDZ6Ii8+PHBhdGggZD0iTTIxMi4wMzYsMTE4LjAxM2wxMC43MjQsNDMuNDY1bC00My4wMDgsLTEyLjM0NnoiLz48cGF0aCBkPSJNMjk4LjA0OCwxNDIuNzlsMTAuNzI0LDQzLjQ2NWwtNDMuMDA4LC0xMi4zNDZ6Ii8+PHBhdGggZD0iTTIzMy40OTMsMjA0LjkybDEwLjcyNCw0My40NjVsLTQzLjAwOCwtMTIuMzQ2eiIvPjwvZz48cGF0aCBkPSJNMjQwLDczYzU5LjA5NDQ3LDAgMTA3LDQ3LjkwNTUzIDEwNywxMDdjMCw1OS4wOTQ0NyAtNDcuOTA1NTMsMTA3IC0xMDcsMTA3Yy01OS4wOTQ0NywwIC0xMDcsLTQ3LjkwNTUzIC0xMDcsLTEwN2MwLC01OS4wOTQ0NyA0Ny45MDU1MywtMTA3IDEwNywtMTA3eiIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2U9IiM1Y2Q0OTgiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiLz48L2c+PC9nPjwvc3ZnPg==";
  
  let alerts = true
  if (vm.runtime.isPackaged) alerts = false
  console.log("alerts are "+ (alerts ? "enabled" : "disabled"))

  let isMouseDown = { left: false, middle: false, right: false }
  let prevMouse = { left: false, middle: false, right: false }

  let lastWidth = 0
  let lastHeight = 0

  let THREE
    let clock
    let running
    let ready = false
    let loopId
  //Addons
  let GLTFLoader
    let gltf
  let OrbitControls
    let controls
  let BufferGeometryUtils
  let TextGeometry
    let fontLoad
  //Physics
  let RAPIER
    let physicsWorld

  let threeRenderer
  let scene
  let camera
  let object
  
  let composer
  let renderPass
  let passes = {}

  let materials = {}
  let geometries = {}
  let lights = {}
  let models = {}

  let raycastResult = []
  
//utility
    function vector3ToString(prop) {
      if (!prop) return "0,0,0";

      const x = (typeof(prop.x) === "number") ? prop.x : (typeof(prop._x) === "number") ? prop._x : (JSON.stringify(prop).includes("X")) ? prop : 0
      const y = (typeof(prop.y) === "number") ? prop.y : (typeof(prop.y) === "number") ? prop._y : 0
      const z = (typeof(prop.z) === "number") ? prop.z : (typeof(prop.z) === "number") ? prop.z : 0

      return [x, y, z]
    }

//objects
    function createObject(name, content, parentName) {
      getObject(name, true)
      if (object) {
        removeObject(name)
        alerts ? alert(name + " already exsisted, will replace!") : null
      }
      content.name = name
      content.rotation._order = "YXZ"
      parentName === scene.name ? object = scene : getObject(parentName)
      content.physics = false

      object.add(content)
    }
    function removeObject(name) {
      getObject(name)
      if (!object) return

      scene.remove(object)

      if (object.rigidBody) {
        physicsWorld.removeCollider(object.collider, true)
        physicsWorld.removeRigidBody(object.rigidBody, true)
        object.rigidBody = null
        object.collider = null
      }
    }
    function getObject(name, isNew) {
      object = null
      if (!scene) {
        alerts ? alert("Can not get " + name + ". Create a scene first!") : null; return;}
      object = scene.getObjectByName(name)
      if (!object && !isNew) {alerts ? alert(name + " does not exist! Add it to scene"):null; return;}
    }

//materials
    function encodeCostume (name) {
      return Scratch.vm.editingTarget.sprite.costumes.find(c => c.name === name).asset.encodeDataURI()
    }
    function setTexutre (texture, mode, style, x, y) {
      texture.colorSpace = THREE.SRGBColorSpace

      if (mode === "Pixelate") {
      texture.minFilter = THREE.NearestFilter;
      texture.magFilter = THREE.NearestFilter;
      } else { //Blur
      texture.minFilter = THREE.LinearMipMapLinearFilter
      texture.magFilter = THREE.LinearFilter
      }

      if (style === "Repeat") {
      texture.wrapS = THREE.RepeatWrapping
      texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(x, y)
      }

      texture.generateMipmaps = true;
    }
    async function resizeImageToSquare(uri, size = 256) {
    return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      
      // clear + draw image scaled to fit canvas
      ctx.clearRect(0, 0, size, size)
      ctx.drawImage(img, 0, 0, size, size)

      resolve(canvas.toDataURL()) // return normalized Data URI
    };
    img.src = uri
  });
}
//light
function updateShadowFrustum(light, focusPos) { //should better this!
  if (light.type === "AmbientLight" || light.type === "PointLight") return;
  
  const d = 20; // half size of shadow box (larger = covers more area, softer shadows)
  
  light.shadow.camera.left   = -d;
  light.shadow.camera.right  =  d;
  light.shadow.camera.top    =  d;
  light.shadow.camera.bottom = -d;
  light.shadow.camera.near   = 0.1;
  light.shadow.camera.far    = 500;

  // Move the *shadow camera* center near the focus position (e.g. camera or player)
  light.position.copy(focusPos.clone().add(light.pos)); // offset light
  light.target.position.copy(focusPos);
  light.target.updateMatrixWorld();

  light.shadow.camera.updateProjectionMatrix();
}
//composer
function updateComposers() {
  if (!camera || !scene) return;                     // nothing to do yet

  // always recreate the RenderPass to point to the current scene/camera
  passes["Render"] = new RenderPass(scene, camera);

  // ensure composer has a RenderPass as the first pass
  const hasRender = composer.passes.some(p => p && p.scene);
  if (!hasRender) composer.addPass(passes["Render"]);
  else {
    // if composer already has one, replace it so it references current scene/camera
    const idx = composer.passes.findIndex(p => p && p.scene);
    composer.passes[idx] = passes["Render"];
  }
}
//utility
function getMouseNDC(event) {
  // Use threeRenderer.domElement for correct offset
  const rect = threeRenderer.domElement.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  return [x, y];
}
function checkCanvasSize() {
  const { width, height } = renderer.canvas
  if (width !== lastWidth || height !== lastHeight) {
    lastWidth = width
    lastHeight = height
    resize()
  }
  requestAnimationFrame(checkCanvasSize) //rerun next frame
}
//physics
function computeWorldBoundingBox(mesh) {
    // Create a Box3 in world coordinates
    const box = new THREE.Box3().setFromObject(mesh);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    return { size, center };
}
function createCuboidCollider(mesh) {
    const { size } = computeWorldBoundingBox(mesh);
    const collider = RAPIER.ColliderDesc.cuboid(
        size.x / 2,
        size.y / 2,
        size.z / 2
    )
    return collider;
}
function createBallCollider(mesh) {
    const { size } = computeWorldBoundingBox(mesh);
    // radius = 1/2 of the largest verticie
    const radius = Math.max(size.x, size.y, size.z) / 2;
    const collider = RAPIER.ColliderDesc.ball(radius)
    return collider //there's a flaw with this, if the ball is deformed in just one axis it will be inaccurate. use convex instead (?)
}
function createConvexHullCollider(mesh) {
    mesh.updateWorldMatrix(true, false);

    const position = mesh.geometry.attributes.position;
    const vertices = [];
    const vertex = new THREE.Vector3();

    // Matrix for scale only
    const scaleMatrix = new THREE.Matrix4().makeScale(
        mesh.scale.x,
        mesh.scale.y,
        mesh.scale.z
    );

    for (let i = 0; i < position.count; i++) {
        vertex.fromBufferAttribute(position, i).applyMatrix4(scaleMatrix);
        vertices.push(vertex.x, vertex.y, vertex.z);
    }

    const collider = RAPIER.ColliderDesc.convexHull(Float32Array.from(vertices));
    return collider;
}
function getModel(model, name) {
  const file = runtime.getTargetForStage().getSounds().find(c => c.name === model)
  if (!file) return

return new Promise((resolve, reject) => {
    gltf.parse(
      file.asset.data.buffer,
      "",
      gltf => {
        const root = gltf.scene
        root.traverse(child => {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
        });

        const mixer = new THREE.AnimationMixer(root)
        const actions = {}
        gltf.animations.forEach(clip => {
          const act = mixer.clipAction(clip)
          act.clampWhenFinished = true
          actions[clip.name] = act
        });

        models[name] = { root, mixer, actions }
        resolve(root)
      },
      error => {
        console.error("Error parsing GLB model:", error)
        reject(error)
      }
    )})
}
async function openFileExplorer(format) {
  return new Promise((resolve) => {
    const input = document.createElement("input");
      input.type = "file"
      input.accept = format
      input.multiple = false
      input.onchange = () => {
        resolve(input.files)
        input.remove()
      };
      input.click();
  })
}

let mouseNDC = [0, 0]
//loops/init
function stopLoop() {
  if (!running) return
  running = false

  if (loopId) {
    cancelAnimationFrame(loopId)
    loopId = null
    if (threeRenderer) threeRenderer.clear();
  }
}
async function load() {
    if (!THREE) {
      
      // @ts-ignore
      THREE = await import("https://esm.sh/three@0.180.0")
      //Addons
      GLTFLoader = await import("https://esm.sh/three@0.180.0/examples/jsm/loaders/GLTFLoader.js")
      OrbitControls = await import("https://esm.sh/three@0.180.0/examples/jsm/controls/OrbitControls.js")
      BufferGeometryUtils = await import("https://esm.sh/three@0.180.0/examples/jsm/utils/BufferGeometryUtils.js")
      TextGeometry = await import("https://esm.sh/three@0.158.0/examples/jsm/geometries/TextGeometry.js")
      const FontLoader = await import("https://esm.sh/three@0.158.0/examples/jsm/loaders/FontLoader.js")
        fontLoad = new FontLoader.FontLoader()

      const POSTPROCESSING = await import("https://esm.sh/postprocessing@6.37.8")
      const {
        EffectComposer,
        EffectPass,
        RenderPass,

        BloomEffect,
        GodRaysEffect,
        DotScreenEffect,
        DepthOfFieldEffect,

        BlendFunction
      } = POSTPROCESSING

        window.EffectComposer = EffectComposer;
        window.EffectPass = EffectPass;
        window.RenderPass = RenderPass;
        window.BloomEffect = BloomEffect;
        window.GodRaysEffect = GodRaysEffect;
        window.DotScreenEffect = DotScreenEffect;
        window.DepthOfFieldEffect = DepthOfFieldEffect;
        window.BlendFunction = BlendFunction;

      RAPIER = await import("https://esm.sh/@dimforge/rapier3d-compat@0.19.0")
      await RAPIER.init()
  
      threeRenderer = new THREE.WebGLRenderer({
        powerPreference: "high-performance",
        antialias: false,
        stencil: false,
        depth: true
      })
      threeRenderer.setPixelRatio(window.devicePixelRatio)
      threeRenderer.outputColorSpace = THREE.SRGBColorSpace // correct colors
      threeRenderer.toneMapping = THREE.ACESFilmicToneMapping // HDR look (test)
      //threeRenderer.toneMappingExposure = 1.0 //(test)

      threeRenderer.shadowMap.enabled = true
      threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap // (optional)
      threeRenderer.domElement.style.pointerEvents = 'auto' //will disable turbowarp mouse events, but enable threejs's

      gltf = new GLTFLoader.GLTFLoader()
      clock = new THREE.Clock()
      
      // Example: create a composer
      composer = new EffectComposer(threeRenderer, {frameBufferType: THREE.HalfFloatType})

      renderer.addOverlay( threeRenderer.domElement, "manual" )
      renderer.addOverlay(renderer.canvas, "manual")
      renderer.setBackgroundColor(1, 1, 1, 0)

      resize()

      window.addEventListener("mousedown", e => {
        if (e.button === 0) isMouseDown.left = true
        if (e.button === 1) isMouseDown.middle = true
        if (e.button === 2) isMouseDown.right = true
      })
      window.addEventListener("mouseup", e => {
        if (e.button === 0) isMouseDown.left = false; prevMouse.left = false
        if (e.button === 1) isMouseDown.middle = false; prevMouse.middle = false
        if (e.button === 2) isMouseDown.right = false; prevMouse.right = false
      })
      // prevent contextmenu on right click
      threeRenderer.domElement.addEventListener("contextmenu", e => e.preventDefault());

      threeRenderer.domElement.addEventListener('mousemove', (event) => {
        mouseNDC = getMouseNDC(event);
      });

        running = false
        ready = load()

        startRenderLoop()
        runtime.on('PROJECT_START', () => startRenderLoop())
        runtime.on('PROJECT_STOP_ALL', () => stopLoop())
        runtime.on('STAGE_SIZE_CHANGED', () => {requestAnimationFrame(() => resize())})
        if (!runtime.isPackaged) checkCanvasSize() //only in editor
    }
  }
function startRenderLoop() {
  if (running) return
  running = true

  const loop = () => {
    if (!running) return
    //RAPIER
    if (physicsWorld && scene) {
      physicsWorld.step()

      scene.children.forEach(obj => {
        if (!(obj.isMesh) || !(obj.physics)) return;
        if (obj.rigidBody) {
            obj.position.copy(obj.rigidBody.translation());
            obj.quaternion.copy(obj.rigidBody.rotation());
        }
      })

    }
    if (scene && camera) {
        if (controls) controls.update()

      const delta = clock.getDelta()
      Object.values(models).forEach( model => { if (model) model.mixer.update(delta) } )

      Object.values(lights).forEach(light => updateShadowFrustum(light, camera.position))

      composer.render(delta)
    }

    loopId = requestAnimationFrame(loop)
  }

  loopId = requestAnimationFrame(loop)
}

function resize() {
  console.log("hey!")
  const w = renderer.canvas.width
  const h = renderer.canvas.height

  threeRenderer.setSize(w, h)
  composer.setSize(w, h)
  
  if (camera) {
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}
}

Promise.resolve(load()).then(() => {

  class threejsExtension {
    getInfo() {
      return {
        id: "threejsExtension",
        name: "Three JS",
        color1: "#222222",
        color2: "#222222",
        color3: "#11cc99",
        menuIconURI,

        blocks: [
            {blockType: Scratch.BlockType.BUTTON, text: "Show Docs", func: "openDocs"},
            {blockType: Scratch.BlockType.BUTTON, text: "Toggle Alerts", func: "alerts"},
          ],
        menus: {}
      }}
    openDocs(){
      alert(`
        IF YOU STOP THE PROJECT, THE RENDERER WON'T DRAW AGAIN UNTIL THE FLAG IS PRESSED.

        Start by creating a scene. Add objects here.
        Add a camera, and set the rendering camera to that one. The stage should update.

        Add an object. Create a geometry. Assing this geometry to the object.
        By default a white cube will appear.
        Create and modify materials and geometries, then asign the object these.
        You can modify these after! Or apply the same material to diferent objects!

        Add a light, only Light Points can be moved.
        Directional light changes direction if moved. Changing the direction does nothing.
        
        Camera defaults is [0,0,3], FOV: 90, Ratio: Canvas ratio
        Pixel Ratio default is 1, recommended: 2-3 You can set decimals.

        Creating Objects with an exsisting name will replace them.
        
        To do:
        Instancing or cloneing objects/groups 
        Physics?
        Postprocesing? Focal thing would be cool! Godrays, and more...
        `)
    }
    alerts() {alerts = !alerts; alerts ? alert("Alerts have been enabled!") : alert("Alerts have been disabled!")}
  }
  Scratch.extensions.register(new threejsExtension())

  class ThreeRenderer {
    getInfo() {
      return {
        id: "threeRenderer",
        name: "Three Renderer",
        color1: "#8a8a8aff",
        color2: "#222222",
        color3: "#222222",

        blocks: [
          {opcode: "setRendererRatio", blockType: Scratch.BlockType.COMMAND, text: "set Pixel Ratio to [VALUE]", arguments: {VALUE: {type: Scratch.ArgumentType.STRING, defaultValue: "1"}}},

        ],
        menus: {}
      }}

    setRendererRatio(args) {
      threeRenderer.setPixelRatio(window.devicePixelRatio * args.VALUE)
    }


  }
  Scratch.extensions.register(new ThreeRenderer())

  class ThreeScene {
    getInfo() {
      return {
        id: "threeScene",
        name: "Three Scene",
        color1: "#4638c5ff",
        color2: "#222222",
        color3: "#222222",

        blocks: [
            {opcode: "newScene", blockType: Scratch.BlockType.COMMAND, text: "new Scene [NAME]", arguments: {NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "scene"}}},

            {opcode: "setSceneProperty", blockType: Scratch.BlockType.COMMAND, text: "set Scene [PROPERTY] to [VALUE]", arguments: {PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "sceneProperties", defaultValue: "background"}, VALUE: {type: Scratch.ArgumentType.STRING, defaultValue: "new Color()", exemptFromNormalization: true}}},
            "---",
            {opcode: "getSceneObjects", blockType: Scratch.BlockType.REPORTER, text: "get Scene [THING]", arguments:{THING: {type: Scratch.ArgumentType.STRING, menu: "sceneThings"}}},
        ],
        menus: {
          sceneProperties: {acceptReporters: false, items: [
                {text: "Background", value: "background"},{text: "Background Blurriness", value: "backgroundBlurriness"},{text: "Background Intensity", value: "backgroundIntensity"},{text: "Background Rotation", value: "backgroundRotation"},
                {text: "Environment", value: "environment"},{text: "Environment Intensity", value: "environmentIntensity"},{text: "Environment Rotation", value: "environmentRotation"},{text: "Fog", value: "fog"},
            ]},
            sceneThings: {acceptReporters: false, items: ["Objects", "Materials", "Geometries","Lights","Scene Properties"]},
            
        }
      }}

          newScene(args) {
        scene = new THREE.Scene();
        scene.name = args.NAME 
        scene.background = new THREE.Color("#222")
        //scene.add(new THREE.GridHelper(16, 16)) //future helper section?
        materials = {}
        geometries = {}
        lights = {}
        models = {}
        camera = undefined

        composer.reset()
        updateComposers()
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

  }
  Scratch.extensions.register(new ThreeScene())

  class ThreeCameras {
    getInfo() {
      return {
        id: "threeCameras",
        name: "Three Cameras",
        color1: "#38c59bff",
        color2: "#222222",
        color3: "#222222",

        blocks: [
            {opcode: "addCamera", blockType: Scratch.BlockType.COMMAND, text: "add camera [TYPE] [CAMERA] to [GROUP]", arguments: {GROUP: {type: Scratch.ArgumentType.STRING, defaultValue: "scene"},CAMERA: {type: Scratch.ArgumentType.STRING, defaultValue: "myCamera"}, TYPE: {type: Scratch.ArgumentType.STRING, menu: "cameraTypes"}}},
            {opcode: "setCamera", blockType: Scratch.BlockType.COMMAND, text: "set camera [PROPERTY] of [CAMERA] to [VALUE]", arguments: {CAMERA: {type: Scratch.ArgumentType.STRING, defaultValue: "myCamera"}, PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "cameraProperties"}, VALUE: {type: Scratch.ArgumentType.STRING, defaultValue: "0", exemptFromNormalization: true}}},
            {opcode: "getCamera", blockType: Scratch.BlockType.REPORTER, text: "get camera [PROPERTY] of [CAMERA]", arguments: {CAMERA: {type: Scratch.ArgumentType.STRING, defaultValue: "myCamera"}, PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "cameraProperties"}}},
            "---",
            {opcode: "renderSceneCamera", blockType: Scratch.BlockType.COMMAND, text: "set rendering camera to [CAMERA]", arguments: {CAMERA: {type: Scratch.ArgumentType.STRING, defaultValue: "myCamera"}}},

        ],
        menus: {
            cameraTypes: {acceptReporters: false, items: [
                {text: "Perspective", value: "PerspectiveCamera"},{text: "Orthographic (not done yet!)", value: "OrthographicCamera"}
            ]},
            cameraProperties: {acceptReporters: false, items: [
                {text: "Near", value: "near"},{text: "Far", value: "far"},{text: "FOV", value: "fov"},{text: "Focus (nothing...)", value: "focus"},{text: "Zoom", value: "zoom"},
            ]},
        }
      }}
    addCamera(args) {
        let v2 = new THREE.Vector2()
        threeRenderer.getSize(v2)
        const object = new THREE[args.TYPE](90, v2.x / v2.y  )
        object.position.z = 3
 
        createObject(args.CAMERA, object, args.GROUP)
        updateComposers()

    }
    setCamera(args) {
      getObject(args.CAMERA)
      object[args.PROPERTY] = args.VALUE
      object.updateProjectionMatrix()
    }
    getCamera(args) {
      getObject(args.CAMERA)
      const value = JSON.stringify(object[args.PROPERTY])
      return value
    }
    renderSceneCamera(args) {
      getObject(args.CAMERA)
      if (!object) return
      camera = object
      updateComposers()
    }
  }
  Scratch.extensions.register(new ThreeCameras())

  class ThreeObjects {
    getInfo() {
      return {
        id: "threeObjects",
        name: "Three Objects",
        color1: "#38c567ff",
        color2: "#222222",
        color3: "#222222",

        blocks: [
            {opcode: "addObject", blockType: Scratch.BlockType.COMMAND, text: "add object [OBJECT3D] [TYPE] to [GROUP]", arguments: {GROUP: {type: Scratch.ArgumentType.STRING, defaultValue: "scene"},TYPE: {type: Scratch.ArgumentType.STRING, menu: "objectTypes"},OBJECT3D: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"}}},
            {opcode: "cloneObject", blockType: Scratch.BlockType.COMMAND, text: "clone object [OBJECT3D] as [NAME] & add to [GROUP]", arguments: {GROUP: {type: Scratch.ArgumentType.STRING, defaultValue: "scene"},NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myClone"},OBJECT3D: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"}}},
            "---",
            {opcode: "setObject", blockType: Scratch.BlockType.COMMAND, text: "set [PROPERTY] of object [OBJECT3D] to [NAME]", arguments: {OBJECT3D: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"}, PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "objectProperties"}, NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myGeometry"}}},
            {opcode: "getObject", blockType: Scratch.BlockType.REPORTER, text: "get [PROPERTY] of object [OBJECT3D]", arguments: {OBJECT3D: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"}, PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "objectProperties"}}},
            {opcode: "objectE", blockType: Scratch.BlockType.BOOLEAN, text: "is there an object [NAME]?", arguments: {NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"}}},
            "---",
            {opcode: "removeObject", blockType: Scratch.BlockType.COMMAND, text: "remove object [OBJECT3D] from scene", arguments: {OBJECT3D: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"}}},

            {blockType: Scratch.BlockType.LABEL, text: " ↳ Transforms"},            
            {opcode: "setObjectV3",extensions: ["colours_motion"], blockType: Scratch.BlockType.COMMAND, text: "set transform [PROPERTY] of [OBJECT3D] to [VALUE]", arguments: {PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "objectVector3", defaultValue: "position"}, OBJECT3D: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"}, VALUE: {type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]"}}},           
            //{opcode: "changeObjectV3",extensions: ["colours_motion"], blockType: Scratch.BlockType.COMMAND, text: "change transform [PROPERTY] of [OBJECT3D] by [VALUE]", arguments: {PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "objectVector3", defaultValue: "position"}, OBJECT3D: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"}, VALUE: {type: Scratch.ArgumentType.STRING, defaultValue: "[1,1,1]"}}},
            //{opcode: "changeObjectXV3",extensions: ["colours_motion"], blockType: Scratch.BlockType.COMMAND, text: "change transform [PROPERTY] [X] of [OBJECT3D] to [VALUE]", arguments: {PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "objectVector3"},X: {type: Scratch.ArgumentType.STRING, menu: "XYZ"}, OBJECT3D: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"}, VALUE: {type: Scratch.ArgumentType.STRING, defaultValue: "1"}}},
            {opcode: "getObjectV3",extensions: ["colours_motion"], blockType: Scratch.BlockType.REPORTER, text: "get [PROPERTY] of [OBJECT3D]", arguments: {PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "objectVector3", defaultValue: "position"}, OBJECT3D: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"}}},

            {blockType: Scratch.BlockType.LABEL, text: "↳ Materials"},
            {opcode: "newMaterial",extensions: ["colours_looks"], blockType: Scratch.BlockType.COMMAND, text: "new material [NAME] [TYPE]", arguments: {NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myMaterial"}, TYPE: {type: Scratch.ArgumentType.STRING, menu: "materialTypes", defaultValue: "MeshStandardMaterial"}}},
            {opcode: "materialE",extensions: ["colours_looks"], blockType: Scratch.BlockType.BOOLEAN, text: "is there a material [NAME]?", arguments: {NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myMaterial"}}},
            {opcode: "removeMaterial",extensions: ["colours_looks"], blockType: Scratch.BlockType.COMMAND, text: "remove material [NAME]", arguments: {NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myMaterial"}}},
            {opcode: "setMaterial",extensions: ["colours_looks"], blockType: Scratch.BlockType.COMMAND, text: "set material [PROPERTY] of [NAME] to [VALUE]", arguments: {PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "materialProperties"},NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myMaterial"}, VALUE: {type: Scratch.ArgumentType.STRING, defaultValue: "new Color()", exemptFromNormalization: true}}},
            {opcode: "setBlending",extensions: ["colours_looks"], blockType: Scratch.BlockType.COMMAND, text: "set material [NAME] blending to [VALUE]", arguments: {NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myMaterial"}, VALUE: {type: Scratch.ArgumentType.STRING, menu: "blendModes"}}},
            {opcode: "setDepth",extensions: ["colours_looks"], blockType: Scratch.BlockType.COMMAND, text: "set material [NAME] depth to [VALUE]", arguments: {NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myMaterial"}, VALUE: {type: Scratch.ArgumentType.STRING, menu: "depthModes"}}},
            
            {blockType: Scratch.BlockType.LABEL, text: "↳ Geometries"},
            {opcode: "newGeometry",extensions: ["colours_data_lists"], blockType: Scratch.BlockType.COMMAND, text: "new geometry [NAME] [TYPE]", arguments: {NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myGeometry"}, TYPE: {type: Scratch.ArgumentType.STRING, menu: "geometryTypes", defaultValue: "BoxGeometry"}}},
            {opcode: "geometryE",extensions: ["colours_data_lists"], blockType: Scratch.BlockType.BOOLEAN, text: "is there a geometry [NAME]?", arguments: {NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myGeometry"}}},
            {opcode: "removeGeometry",extensions: ["colours_data_lists"], blockType: Scratch.BlockType.COMMAND, text: "remove geometry [NAME]", arguments: {NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myGeometry"}, TYPE: {type: Scratch.ArgumentType.STRING, menu: "geometryTypes", defaultValue: "BoxGeometry"}}},
            {opcode: "splines", extensions: ["colours_data_lists"], blockType: Scratch.BlockType.COMMAND, text: "create spline [NAME] from curve [CURVE]", arguments: {NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "mySpline"}, CURVE: {type: Scratch.ArgumentType.STRING, defaultValue: "[curve]", exemptFromNormalization: true}}},
            {opcode: "splineModel", extensions: ["colours_operators"], blockType: Scratch.BlockType.COMMAND, text: "create (geometry&material) spline [NAME] using model [MODEL] along curve [CURVE] with spacing [SPACING]", arguments: {NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "mySpline"}, MODEL: {type: Scratch.ArgumentType.STRING, menu: "modelsList"}, CURVE: {type: Scratch.ArgumentType.STRING, defaultValue: "[curve]", exemptFromNormalization: true}, SPACING: {type: Scratch.ArgumentType.NUMBER, defaultValue: 1}}},
            {blockType: Scratch.BlockType.BUTTON, text: "Convert font to JSON", func: "openConv"},
            {blockType: Scratch.BlockType.BUTTON, text: "Load JSON font file", func: "loadFont"},
            {opcode: "text", extensions: ["colours_data_lists"], blockType: Scratch.BlockType.COMMAND, text: "create text geometry [NAME] with text [TEXT] in font [FONT] size [S] depth [D] curvedSegments [CS]", arguments: {NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myText"}, TEXT: {type: Scratch.ArgumentType.STRING, defaultValue: "C-369"}, FONT: {type: Scratch.ArgumentType.STRING, menu: "fonts"}, S: {type: Scratch.ArgumentType.NUMBER, defaultValue: 1}, D: {type: Scratch.ArgumentType.NUMBER, defaultValue: 0.1}, CS: {type: Scratch.ArgumentType.NUMBER, defaultValue: 6}}},
        ],
        menus: {
            objectVector3: {acceptReporters: false, items: [
                {text: "Positon", value: "position"},{text: "Rotation", value: "rotation"},{text: "Scale", value: "scale"},{text: "Facing Direction (.up)", value: "up"}
            ]},
            objectProperties: {acceptReporters: false, items: [
              {text: "Geometry", value: "geometry"},{text: "Material", value: "material"},{text: "Visible (true/false)", value: "visible"},
            ]},
            objectTypes: { acceptReporters: false, items: [
              { text: "Mesh", value: "Mesh" }, { text: "Sprite", value: "Sprite" }, { text: "Points", value: "Points" }, { text: "Line", value: "Line" }, { text: "Group", value: "Group" }
            ]},
            XYZ: {acceptReporters: false, items: [{text: "X", value: "x"},{text: "Y", value: "y"},{text: "Z", value: "z"}]},
            materialProperties: {acceptReporters: false, items: [
    "alphaMap","anisotropy","anisotropyMap","anisotropyRotation","aoMap","aoMapIntensity","attenuationColor","attenuationDistance","bumpMap","bumpScale","clearcoat","clearcoatMap","clearcoatNormalMap","clearcoatNormalScale","clearcoatRoughness","clearcoatRoughnessMap","color","combine","displacementBias","displacementMap","displacementScale","emissive","emissiveIntensity","emissiveMap","envMap","envMapIntensity","envMapRotation","flatShading","fog","ior","iridescence","iridescenceIOR","iridescenceMap","iridescenceThicknessMap","iridescenceThicknessRange","lightMap","lightMapIntensity","map","metalness","metalnessMap","normalMap","normalMapType","normalScale","reflectivity","refractionRatio","roughness","roughnessMap","sheen","sheenColor","sheenColorMap","sheenRoughness","sheenRoughnessMap","shininess","specular","specularColor","specularColorMap","specularIntensity","specularIntensityMap","specularMap","thickness","thicknessMap","transmission","transmissionMap", "wireframe","wireframeLinecap","wireframeLinejoin", "wireframeLinewidth"
]},
            blendModes: {acceptReporters: false, items: [
              { text: "No Blending", value: "NoBlending" },{ text: "Normal Blending", value: "NormalBlending" },{ text: "Additive Blending", value: "AdditiveBlending" },{ text: "Subtractive Blending", value: "SubtractiveBlending" },{ text: "Multiply Blending", value: "MultiplyBlending" },{ text: "Custom Blending", value: "CustomBlending" }
            ]},
            depthModes: {acceptReporters: false, items: [
            { text: "Never Depth", value: "NeverDepth" },{ text: "Always Depth", value: "AlwaysDepth" },{ text: "Equal Depth", value: "EqualDepth" },{ text: "Less Depth", value: "LessDepth" },{ text: "Less Equal Depth", value: "LessEqualDepth" },{ text: "Greater Equal Depth", value: "GreaterEqualDepth" },{ text: "Greater Depth", value: "GreaterDepth" },{ text: "Not Equal Depth", value: "NotEqualDepth" }
            ]},
            materialTypes:{acceptReporters: false, items: [
              {text:"Mesh Basic Material",value:"MeshBasicMaterial"},{text:"Mesh Standard Material",value:"MeshStandardMaterial"},{text:"Mesh Physical Material",value:"MeshPhysicalMaterial"},{text:"Mesh Lambert Material",value:"MeshLambertMaterial"},{text:"Mesh Phong Material",value:"MeshPhongMaterial"},{text:"Mesh Depth Material",value:"MeshDepthMaterial"},{text:"Mesh Normal Material",value:"MeshNormalMaterial"},{text:"Mesh Matcap Material",value:"MeshMatcapMaterial"},{text:"Mesh Toon Material",value:"MeshToonMaterial"},{text:"Line Basic Material",value:"LineBasicMaterial"},{text:"Line Dashed Material",value:"LineDashedMaterial"},{text:"Points Material",value:"PointsMaterial"},{text:"Sprite Material",value:"SpriteMaterial"},{text:"Shadow Material",value:"ShadowMaterial"}
            ]},
            textureModes: {acceptReporters: false, items: ["Pixelate","Blur"]},
            textureStyles: {acceptReporters: false, items: ["Repeat","Clamp"]},
            geometryTypes: {acceptReporters: false, items: [
              {text: "Box Geometry", value: "BoxGeometry"},{text: "Sphere Geometry", value: "SphereGeometry"},{text: "Cylinder Geometry", value: "CylinderGeometry"},{text: "Plane Geometry", value: "PlaneGeometry"},{text: "Circle Geometry", value: "CircleGeometry"},{text: "Torus Geometry", value: "TorusGeometry"},{text: "Torus Knot Geometry", value: "TorusKnotGeometry"},
            ]},
            modelsList: {acceptReporters: false, items: () => {
              const stage = runtime.getTargetForStage();
              if (!stage) return ["(loading...)"];

                // @ts-ignore
                const models = Scratch.vm.runtime.getTargetForStage().getSounds().filter(e => e.name && e.name.endsWith('.glb'))
                if (models.length < 1) return [["Load a model! (GLB Loader category)"]]
                  
                  // @ts-ignore
                  return models.map( m =>  [m.name] )
            }},
            fonts: {acceptReporters: false, items: () => {
              const stage = runtime.getTargetForStage();
              if (!stage) return ["(loading...)"];

                // @ts-ignore
                const models = Scratch.vm.runtime.getTargetForStage().getSounds().filter(e => e.name && e.name.endsWith('.json'))
                if (models.length < 1) return [["Load a font!"]]
                  
                  // @ts-ignore
                  return models.map( m =>  [m.name] )
            }},

        }
      }}

    addObject(args) {
        const object = new THREE[args.TYPE]();

        object.castShadow = true
        object.receiveShadow = true

        createObject(args.OBJECT3D, object, args.GROUP)
    }
    cloneObject(args) {
      getObject(args.OBJECT3D)
      const clone = object.clone(true)
      clone.name
      createObject(args.NAME, clone, args.GROUP)
    }

    setObjectV3(args) {
        getObject(args.OBJECT3D)
        let values = JSON.parse(args.VALUE)

        function degToRad(deg) {
          return deg * Math.PI / 180;
        }


        if (object.rigidBody) {
          const x = values[0]
          const y = values[1]
          const z = values[2]
          if (args.PROPERTY === "rotation") {
            const euler = new THREE.Euler(
              degToRad(x),
              degToRad(y),
              degToRad(z),
              'YXZ'
            )
            const quaternion = new THREE.Quaternion()
            quaternion.setFromEuler(euler)

            object.rigidBody.setRotation({
              x: quaternion.x,
              y: quaternion.y,
              z: quaternion.z,
              w: quaternion.w
            });
          } else if (args.PROPERTY === "position") {
            object.rigidBody.setTranslation({ x: x, y: y, z: z }, true)
          }
          return
        }

        if (object.isCamera == true && controls) {

        }

        if (args.PROPERTY === "rotation") {
          values = values.map(v => v * Math.PI / 180);
          object.rotation.set(0,0,0)
        }
        if (object.isDirectionalLight == true) {object.pos = new THREE.Vector3(...values); console.log(true, values, object.pos); return}
          object[args.PROPERTY].set(...values);
    }
    /*
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
    */
    getObjectV3(args) {
        getObject(args.OBJECT3D)
        if (!object) return
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
      else value = !!value

      object[args.PROPERTY] = value
    }
    getObject(args){
      getObject(args.OBJECT3D)
      if (!object) return
      const value = object[args.PROPERTY]
      return JSON.stringify(value)
    }
    removeObject(args) {
      removeObject(args.OBJECT3D)
    }
    objectE(args) {
      return scene.children.map(o => o.name).includes(args.NAME)
    }

//defines
    newMaterial(args) {
      if (materials[args.NAME] && alerts) alert ("material already exists! will replace...")
      const mat = new THREE[args.TYPE]();
      mat.name = args.NAME;

      materials[args.NAME] = mat;
    }
    async setMaterial(args) {
      const mat = materials[args.NAME]
      let value = args.VALUE
      if  (args.PROPERTY === "side") {
      value = (value === "double" ? THREE.DoubleSide : value === "back" ? THREE.BackSide : THREE.FrontSide)
      } else if (args.PROPERTY === "normalScale") value = new THREE.Vector2(...(JSON.parse(value))); console.log(value)

      value === "true" ? value = true : value === "false" ? value = false : null

      
      mat[args.PROPERTY] = await (value)
      if (args.PROPERTY === "wireframe") mat.wireframeLinecap = "butt"; mat.wireframeLinejoin = "bevel"
      mat.transparent = mat.opacity < 1.0
      mat.needsUpdate = true;
    }
    setBlending(args) {
      const mat = materials[args.NAME]
      mat.blending = THREE[args.VALUE]
      mat.premultipliedAlpha = true
      mat.needsUpdate = true
    }
    setDepth(args) {
      const mat = materials[args.NAME]
      mat.depthFunc = THREE[args.VALUE]
      mat.needsUpdate = true
    }
    removeMaterial(args){
      const mat = materials[args.NAME]
      mat.dispose()
      delete(materials[args.NAME])
    }
    materialE(args) {
      return materials[args.NAME] ? true : false
    }

    newGeometry(args) {
      if (geometries[args.NAME] && alerts) alert ("geometry already exists! will replace...")
      const geo = new THREE[args.TYPE]()
      geo.name = args.NAME

      geometries[args.NAME] = geo
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
    geometryE(args) {
      return geometries[args.NAME] ? true : false
    }

    splines(args) {
      const geometry = new THREE.TubeGeometry(args.CURVE)
      geometry.name = args.NAME

      geometries[args.NAME] = geometry
    }

    async splineModel(args) {
  const model = await getModel(args.MODEL, args.NAME)
  if (!model) return console.warn("Model not found:", args.MODEL)

  const curve = args.CURVE
  const spacing = parseFloat(args.SPACING) || 1
  const curveLength = curve.getLength()
  const divisions = Math.floor(curveLength / spacing)

  const geomList = []
  const matList = []

  for (let i = 0; i <= divisions; i++) {
    const t = i / divisions
    const pos = curve.getPointAt(t)
    const tangent = curve.getTangentAt(t)

    const temp = model.clone(true)
    temp.position.copy(pos)

    const up = new THREE.Vector3(0, 0, 1)
    const quat = new THREE.Quaternion().setFromUnitVectors(up, tangent.clone().normalize())
    temp.quaternion.copy(quat)

    temp.updateMatrixWorld(true)

    temp.traverse(child => {
      if (child.isMesh && child.geometry) {
        const geom = child.geometry.clone()
        geom.applyMatrix4(child.matrixWorld)
        geomList.push(geom)
        matList.push(child.material) //.clone() ?
      }
    })
  }

  const validGeoms = geomList.filter(g => {
    const ok = g && g.isBufferGeometry && g.attributes && g.attributes.position
    if (!ok) console.warn("geometry skipped:", g)
    return ok
  })

  const merged = BufferGeometryUtils.mergeGeometries(validGeoms, true)
  merged.computeBoundingBox()
  merged.computeBoundingSphere()

  merged.name = args.NAME
  geometries[args.NAME] = merged
  matList.name = args.NAME
  materials[args.NAME] = matList
    }    
    
    async text(args) {
      const fontFile = runtime.getTargetForStage().getSounds().find(c => c.name === args.FONT)
      if (!fontFile) return

      const json = new TextDecoder().decode(fontFile.asset.data.buffer)
      const fontData = JSON.parse(json)

      const font = fontLoad.parse(fontData)

      const params = {font: font, size: JSON.parse(args.S), height: JSON.parse(args.D), curveSegments: JSON.parse(args.CS), bevelEnabled: false}
      const geometry = new TextGeometry.TextGeometry(args.TEXT, params)
      geometry.computeVertexNormals()
      geometry.center() // optional, recenters the text
      

      geometry.name = args.NAME

      geometries[args.NAME] = geometry
    }

    async loadFont() {
      openFileExplorer(".json").then(files => {
        const file = files[0]
        const reader = new FileReader()

        reader.onload = async (e) => {
          const arrayBuffer = e.target.result
          
         // From lily's assets
         // // Thank you PenguinMod for providing this code.
          
            const targetId = runtime.getTargetForStage().id //util.target.id not working!
            const assetName = Cast.toString(file.name)

            const buffer = arrayBuffer

            const storage = runtime.storage
            const asset = storage.createAsset(
              storage.AssetType.Sound,
              storage.DataFormat.MP3,
              // @ts-ignore
              new Uint8Array(buffer),
              null,
              true
            )

            try {
              await vm.addSound(
                // @ts-ignore
                {
                  asset,
                  md5: asset.assetId + "." + asset.dataFormat,
                  name: assetName,
                },
                targetId
              )
              alert("Font loaded successfully!")
            } catch (e) {
              console.error(e)
              alert("Error loading font.")
            }
          
          // End of PenguinMod
        }

        reader.readAsArrayBuffer(file);
      })
    }
    openConv() {{open("https://gero3.github.io/facetype.js/")}}

  }
  Scratch.extensions.register(new ThreeObjects())

  class ThreeLights {
    getInfo() {
      return {
        id: "threeLights",
        name: "Three Lights",
        color1: "#c7a22aff",
        color2: "#222222",
        color3: "#222222",

        blocks: [
            {opcode: "addLight", blockType: Scratch.BlockType.COMMAND, text: "add light [NAME] type [TYPE] to [GROUP]", arguments: {GROUP: {type: Scratch.ArgumentType.STRING, defaultValue: "scene"},NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myLight"}, TYPE: {type: Scratch.ArgumentType.STRING, menu: "lightTypes"}}},
            {opcode: "setLight", blockType: Scratch.BlockType.COMMAND, text: "set light [NAME][PROPERTY] to [VALUE]", arguments: {PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "lightProperties"},NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myLight"}, VALUE: {type: Scratch.ArgumentType.STRING, defaultValue: "#ffffff", exemptFromNormalization: true}}},
            {opcode: "removeLight", blockType: Scratch.BlockType.COMMAND, text: "remove light [NAME]", arguments: {NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myLight"}}},

        ],
        menus: {
            lightTypes: {acceptReporters: false, items: [
              {text: "Ambient Light", value: "AmbientLight"},{text: "Directional Light", value: "DirectionalLight"},{text: "Point Light", value: "PointLight"},
            ]},
            lightProperties: {acceptReporters: false, items: [
              {text: "Color", value: "color"},{text: "Intensity", value: "intensity"},
            ]},
        }
      }}

      addLight(args) {
      const light = new THREE[args.TYPE](0xffffff, 1)

      createObject(args.NAME, light, args.GROUP)
      lights[args.NAME] = light
      if (light.type === "AmbientLight") return
      
      light.castShadow = true
      if (light.type === "PointLight") return

      light.target.position.set(0, 0, 0)
      scene.add(light.target)

      light.pos = new THREE.Vector3(0,0,0)

      light.shadow.mapSize.width = 4096
      light.shadow.mapSize.height = 2048

      //scene.add(new THREE.CameraHelper(light.shadow.camera))
    }

    setLight(args) {
      const light = lights[args.NAME]
      light[args.PROPERTY] = args.VALUE

      light.needsUpdate = true
    }
    removeLight(args) {
      const light = lights[args.NAME]
      
      scene.remove(light);
      // should check if material has any type of maps...
      delete(lights[args.NAME])
    }

  }
  Scratch.extensions.register(new ThreeLights())

  class ThreeGLB {
    getInfo() {
      return {
        id: "threeGLB",
        name: "Three GLB Loader",
        color1: "#c53838ff",
        color2: "#222222",
        color3: "#222222",

        blocks: [
          {blockType: Scratch.BlockType.BUTTON, text: "Load GLB File", func: "loadModelFile"},
            {opcode: "addModel", blockType: Scratch.BlockType.COMMAND, text: "add [ITEM] as [NAME] to [GROUP]", arguments: {GROUP: {type: Scratch.ArgumentType.STRING, defaultValue: "scene"},ITEM: {type: Scratch.ArgumentType.STRING, menu: "modelsList"}, NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myModel"}}},
            {opcode: "getModel", blockType: Scratch.BlockType.REPORTER, text: "get object [PROPERTY] of [NAME]", arguments: {NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myModel"}, PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "modelProperties"}}},
            {opcode: "playAnimation", blockType: Scratch.BlockType.COMMAND, text: "play animation [ANAME] of [NAME], [TIMES] times", arguments: {TIMES: {type: Scratch.ArgumentType.NUMBER, defaultValue: "0"}, NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myModel"}, ANAME: {type: Scratch.ArgumentType.STRING, defaultValue: "walk",exemptFromNormalization: true}}},
            {opcode: "pauseAnimation", blockType: Scratch.BlockType.COMMAND, text: "set [TOGGLE] animation [ANAME] of [NAME]", arguments: {TOGGLE: {type: Scratch.ArgumentType.NUMBER, menu: "pauseUn"}, NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myModel"}, ANAME: {type: Scratch.ArgumentType.STRING, defaultValue: "walk",exemptFromNormalization: true}}},
            {opcode: "stopAnimation", blockType: Scratch.BlockType.COMMAND, text: "stop animation [ANAME] of [NAME]", arguments: {NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myModel"}, ANAME: {type: Scratch.ArgumentType.STRING, defaultValue: "walk",exemptFromNormalization: true}}},

        ],
        menus: {
            modelProperties: {acceptReporters: false, items: [
              {text: "Animations", value: "animations"},
            ]},
            pauseUn: {acceptReporters: true, items: [{text: "Pause", value: "true"},{text: "Unpasue", value: "false"},]},
            modelsList: {acceptReporters: false, items: () => {
              const stage = runtime.getTargetForStage();
              if (!stage) return ["(loading...)"];

                // @ts-ignore
                const models = Scratch.vm.runtime.getTargetForStage().getSounds().filter(e => e.name && e.name.endsWith('.glb'))
                if (models.length < 1) return [["Load a model!"]]
                  
                  // @ts-ignore
                  return models.map( m =>  [m.name] )
            }},
        }
      }}

    async loadModelFile() {

      openFileExplorer(".glb").then(files => {
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
      })

    }
    async addModel(args) {
      const group = await getModel(args.ITEM, args.NAME)

      createObject(args.NAME, group, args.GROUP)
    }
    getModel(args){
      if (!models[args.NAME]) return;
      return Object.keys(models[args.NAME].actions).toString()
    }

    playAnimation(args) {
      const model = models[args.NAME]
      if (!model) {console.log("no model!"); return}

      const action = model.actions[args.ANAME] //clones of models dont have a stored actions!
      if (!action) {
        console.log("no action!")
        return
      }

        args.TIMES > 0 ? action.setLoop(THREE.LoopRepeat, args.TIMES) : action.setLoop(THREE.LoopRepeat, Infinity)

      action.reset()
        .play()
    }
    stopAnimation(args) {
      const model = models[args.NAME];
      if (!model) return;

      const action = model.actions[args.ANAME];
      if (action) action.stop();
    }
    pauseAnimation(args) {
      const model = models[args.NAME];
      if (!model) return;

      const action = model.actions[args.ANAME];
      if (action) action.paused = args.TOGGLE
    }

  }
  Scratch.extensions.register(new ThreeGLB()) //create a group then add the loaded glb there? so no errors while loading.

  class ThreeUtilities {
    getInfo() {
      return {
        id: "threeUtility",
        name: "Three Utilities",
        color1: "#3875c5ff",
        color2: "#222222",
        color3: "#222222",

        blocks: [
            {opcode: "newVector2", blockType: Scratch.BlockType.REPORTER, text: "New Vector [X] [Y]", arguments: {X: {type: Scratch.ArgumentType.NUMBER}, Y: {type: Scratch.ArgumentType.NUMBER}}},
            {opcode: "newVector3", blockType: Scratch.BlockType.REPORTER, text: "New Vector [X] [Y] [Z]", arguments: {X: {type: Scratch.ArgumentType.NUMBER}, Y: {type: Scratch.ArgumentType.NUMBER}, Z: {type: Scratch.ArgumentType.NUMBER}}},
            "---",
            {opcode: "moveVector3", blockType: Scratch.BlockType.REPORTER, text: "move [S] vector [V3] in direction [D3]", arguments: {S: {type: Scratch.ArgumentType.NUMBER},V3: {type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]"}, D3: {type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]"}}},
            {opcode: "directionTo", blockType: Scratch.BlockType.REPORTER, text: "direction from [V3] to [T3]", arguments: {V3: {type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,3]"}, T3: {type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]"}}},
            "---",
            {opcode: "newColor", blockType: Scratch.BlockType.REPORTER, text: "New Color [HEX]", arguments: {HEX: {type: Scratch.ArgumentType.COLOR, defaultValue: "#9966ff"}}},
            {opcode: "newFog", blockType: Scratch.BlockType.REPORTER, text: "New Fog [COLOR] [NEAR] [FAR]", arguments: {COLOR: {type: Scratch.ArgumentType.COLOR, defaultValue: "#9966ff", exemptFromNormalization: true}, NEAR: {type: Scratch.ArgumentType.NUMBER}, FAR: {type: Scratch.ArgumentType.NUMBER, defaultValue: 10}}},
            {opcode: "newTexture", blockType: Scratch.BlockType.REPORTER, text: "New Texture [COSTUME] [MODE] [STYLE] repeat [X][Y]", arguments: {COSTUME: {type: Scratch.ArgumentType.COSTUME}, MODE: {type: Scratch.ArgumentType.STRING, menu: "textureModes"},STYLE: {type: Scratch.ArgumentType.STRING, menu: "textureStyles"}, X: {type: Scratch.ArgumentType.NUMBER, defaultValue: 1},Y: {type: Scratch.ArgumentType.NUMBER,defaultValue: 1}}},
            {opcode: "newCubeTexture", blockType: Scratch.BlockType.REPORTER, text: "New Cube Texture X+[COSTUMEX0]X-[COSTUMEX1]Y+[COSTUMEY0]Y-[COSTUMEY1]Z+[COSTUMEZ0]Z-[COSTUMEZ1] [MODE] [STYLE] repeat [X][Y]", arguments: {"COSTUMEX0": {type: Scratch.ArgumentType.COSTUME},"COSTUMEX1": {type: Scratch.ArgumentType.COSTUME},"COSTUMEY0": {type: Scratch.ArgumentType.COSTUME},"COSTUMEY1": {type: Scratch.ArgumentType.COSTUME},"COSTUMEZ0": {type: Scratch.ArgumentType.COSTUME},"COSTUMEZ1": {type: Scratch.ArgumentType.COSTUME}, MODE: {type: Scratch.ArgumentType.STRING, menu: "textureModes"},STYLE: {type: Scratch.ArgumentType.STRING, menu: "textureStyles"}, X: {type: Scratch.ArgumentType.NUMBER,defaultValue: 1},Y: {type: Scratch.ArgumentType.NUMBER,defaultValue: 1}}},
            {opcode: "newEquirectangularTexture", blockType: Scratch.BlockType.REPORTER, text: "New Equirectangular Texture [COSTUME] [MODE]", arguments: {COSTUME: {type: Scratch.ArgumentType.COSTUME}, MODE: {type: Scratch.ArgumentType.STRING, menu: "textureModes"}}},
            "---",
            {opcode: "curve", extensions: ["colours_data_lists"], blockType: Scratch.BlockType.REPORTER, text: "generate curve [TYPE] from points [POINTS], closed: [CLOSED]", arguments: {TYPE: {type: Scratch.ArgumentType.STRING, menu: "curveTypes"}, POINTS: {type: Scratch.ArgumentType.STRING, defaultValue: "[0,3,0] [2.5,-1.5,0] [-2.5,-1.5,0]"}, CLOSED: {type: Scratch.ArgumentType.STRING, defaultValue: "true"}}},
            "---",
            {opcode:"mouseDown",extensions: ["colours_sensing"], blockType: Scratch.BlockType.BOOLEAN, text: "mouse [BUTTON] [action]?", arguments: {BUTTON: {type: Scratch.ArgumentType.STRING, menu: "mouseButtons"},action: {type: Scratch.ArgumentType.STRING, menu: "mouseAction"}}},
            {opcode: "mousePos",extensions: ["colours_sensing"], blockType: Scratch.BlockType.REPORTER, text: "mouse position", arguments: {}},
            "---",
            {opcode: "getItem",extensions: ["colours_data_lists"], blockType: Scratch.BlockType.REPORTER, text: "get item [ITEM] of [ARRAY]", arguments: {ITEM: {type: Scratch.ArgumentType.STRING, defaultValue: "1"}, ARRAY: {type: Scratch.ArgumentType.STRING, defaultValue: `["myObject", "myLight"]`}}},
            {blockType: Scratch.BlockType.LABEL, text: "↳ Raycasting"},
            {opcode: "raycast", blockType: Scratch.BlockType.COMMAND, text: "raycast from [V3] in direction [D3]", arguments: {V3: {type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,3]"}, D3: {type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]"}}},
            {opcode: "getRaycast", blockType: Scratch.BlockType.REPORTER, text: "get raycast [PROPERTY]", arguments: {PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "raycastProperties"}}},

        ],
        menus: {
            materialProperties: {acceptReporters: false, items: [
              {text: "Color", value: "color"},{text: "Map (texture)", value: "map"},{text: "Alpha Map (texture)", value: "alphaMap"},{text: "Alpha Test (0-1)", value: "alphaTest"},{text: "Side (front/back/double)", value: "side"},{text: "Bump Map (texture)", value: "bumpMap"},{text: "Bump Scale", value: "bumpScale"},
            ]},
            textureModes: {acceptReporters: false, items: ["Pixelate","Blur"]},
            textureStyles: {acceptReporters: false, items: ["Repeat","Clamp"]},
            raycastProperties: {acceptReporters: false, items: [
              {text: "Intersected Object Names", value: "name"},{text: "Number of Objects", value: "number"},{text: "Intersected Objects distances", value: "distance"},
            ]},
            mouseButtons: {acceptReporters: false, items: ["left","middle","right"]},
            mouseAction: {acceptReporters: false, items: ["Down","Clicked"]},
            curveTypes: {acceptReporters: false, items: ["CatmullRomCurve3"]}
        }
      }}
    mouseDown(args) {
      if (args.action === "Down") return isMouseDown[args.BUTTON]
      if (args.action === "Clicked") {
        if (isMouseDown[args.BUTTON] == prevMouse[args.BUTTON]) return false
        else prevMouse[args.BUTTON] = true; return true
      }
    }
    mousePos(event) {
      return JSON.stringify(mouseNDC)
    }

    newColor(args) {
        return new THREE.Color(args.HEX);
    }
    newVector3(args) {
        return JSON.stringify([args.X, args.Y, args.Z])
    }
    newVector2(args) {
        return JSON.stringify([args.X, args.Y])
    }

    moveVector3(args) {
        // Starting position
        const v3 = new THREE.Vector3(...JSON.parse(args.V3))

        // Parse yaw, pitch, roll from args.D3 (degrees → radians)
        const [yawDeg, pitchDeg, rollDeg] = JSON.parse(args.D3).map(Number)
        const yaw   = THREE.MathUtils.degToRad(yawDeg)
        const pitch = THREE.MathUtils.degToRad(pitchDeg)
        const roll  = THREE.MathUtils.degToRad(rollDeg)

        const euler = new THREE.Euler(pitch, yaw, roll, "YXZ")
        const direction = new THREE.Vector3(0, 0, -1).applyEuler(euler).normalize()

        const pos = v3.clone().add(direction.multiplyScalar(args.S))
        return JSON.stringify([pos.x, pos.y, pos.z])
    }

  directionTo(args) {
  const v3 = new THREE.Vector3(...JSON.parse(args.V3))
  const toV3 = new THREE.Vector3(...JSON.parse(args.T3))

  const direction = toV3.clone().sub(v3).normalize();
  // Pitch (X)
  const pitch = Math.atan2(-direction.y, Math.sqrt(direction.x*direction.x + direction.z*direction.z));
  // Yaw (Y)
  const yaw = Math.atan2(direction.x, direction.z);

  // Roll always 0
  return JSON.stringify([180+THREE.MathUtils.radToDeg(pitch),THREE.MathUtils.radToDeg(yaw),0])
  }

    newFog(args) {
        return new THREE.Fog(args.COLOR, args.NEAR, args.FAR)
    }
    async newTexture(args) {
      const textureURI = encodeCostume(args.COSTUME)
      const texture = await new THREE.TextureLoader().loadAsync(textureURI);
      texture.name = args.COSTUME

      setTexutre(texture, args.MODE, args.STYLE, args.X, args.Y)
      return texture;
    }
    async newCubeTexture(args) {
      const uris = [encodeCostume(args.COSTUMEX0),encodeCostume(args.COSTUMEX1), encodeCostume(args.COSTUMEY0),encodeCostume(args.COSTUMEY1), encodeCostume(args.COSTUMEZ0),encodeCostume(args.COSTUMEZ1)]
      const normalized = await Promise.all(uris.map(uri => resizeImageToSquare(uri, 256)));
      const texture = await new THREE.CubeTextureLoader().loadAsync(normalized);
      
      texture.name = "CubeTexture" + args.COSTUMEX0;

      setTexutre(texture, args.MODE, args.STYLE, args.X, args.Y)
      return texture;
    }
    async newEquirectangularTexture(args) {
      const textureURI = encodeCostume(args.COSTUME)
      const texture = await new THREE.TextureLoader().loadAsync(textureURI);
      texture.name = args.COSTUME
      texture.mapping = THREE.EquirectangularReflectionMapping

      setTexutre(texture, args.MODE)
      return texture;
    }

    curve(args) {
      function parsePoints(input) {
        // Match all [x,y,z] groups
        const matches = input.match(/\[([^\]]+)\]/g)
        if (!matches) return []

        return matches.map(str => {
          const nums = str
            .replace(/[\[\]\s]/g, '')
            .split(',')
            .map(Number)
          return new THREE.Vector3(nums[0] || 0, nums[1] || 0, nums[2] || 0)
        })
      }
      const points = parsePoints(args.POINTS)
      const curve = new THREE[args.TYPE](points)
      curve.closed = JSON.parse(args.CLOSED)
      return curve
    }

    getItem(args) {
      const items = JSON.parse(args.ARRAY)
      const item = items[args.ITEM - 1]
      if (!item) return "0"
      return item
    }

    raycast(args) {
      const origin = new THREE.Vector3(...JSON.parse(args.V3))
        // rotation is in degrees => convert to radians first
        const rot = JSON.parse(args.D3).map(v => v * Math.PI / 180)

        const euler = new THREE.Euler(rot[0], rot[1], rot[2], "YXZ")
        const direction = new THREE.Vector3(0, 0, -1).applyEuler(euler).normalize()

      const raycaster = new THREE.Raycaster()
      //const camera = getObject(args.CAMERA)
      raycaster.set( origin, direction );

      const intersects = raycaster.intersectObjects( scene.children, true )

      raycastResult = intersects
    }
    getRaycast(args) {
      if (args.PROPERTY === "number") return raycastResult.length
      if (args.PROPERTY === "distance") return JSON.stringify(raycastResult.map(i => i.distance))
      return JSON.stringify(raycastResult.map(i => i.object[args.PROPERTY]))
    }

  }
  Scratch.extensions.register(new ThreeUtilities())

  class ThreeAddons {
    getInfo() {
      return {
        id: "threeAddons",
        name: "Three Addons",
        color1: "#c538a2ff",
        color2: "#222222",
        color3: "#222222",

        blocks: [
            {blockType: Scratch.BlockType.LABEL, text: "Orbit Control"},
            {opcode: "OrbitControl", blockType: Scratch.BlockType.COMMAND, text: "set addon Orbit Control [STATE]", arguments: {STATE: {type: Scratch.ArgumentType.STRING, menu: "onoff"},}},
       
            {blockType: Scratch.BlockType.LABEL, text: "Post Processing"},
            {opcode: "resetComposer",extensions: ["colours_operators"], blockType: Scratch.BlockType.COMMAND, text: "reset composer"},
            {opcode: "bloom", blockType: Scratch.BlockType.COMMAND, text: "add bloom intensity:[I] smoothing:[S] threshold:[T] | blend: [BLEND] opacity:[OP]", arguments: {OP: {type: Scratch.ArgumentType.NUMBER, defaultValue: 1},I: {type: Scratch.ArgumentType.NUMBER, defaultValue: 1}, S:{type: Scratch.ArgumentType.NUMBER, defaultValue: 0.5}, T:{type: Scratch.ArgumentType.NUMBER, defaultValue: 0.5}, BLEND: {type: Scratch.ArgumentType.STRING, menu: "blendModes", defaultValue: "SCREEN"}}},
            {opcode: "godRays", blockType: Scratch.BlockType.COMMAND, text: "add god rays object:[NAME] density:[DENS] decay:[DEC] weight:[WEI] exposition:[EXP] | resolution:[RES] samples:[SAMP] | blend: [BLEND] opacity:[OP]", arguments: {OP: {type: Scratch.ArgumentType.NUMBER, defaultValue: 1},NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"},BLEND: {type: Scratch.ArgumentType.STRING, menu: "blendModes", defaultValue: "SCREEN"}, DEC:{type: Scratch.ArgumentType.NUMBER, defaultValue: 0.95}, DENS:{type: Scratch.ArgumentType.NUMBER, defaultValue: 1},EXP:{type: Scratch.ArgumentType.NUMBER, defaultValue: 0.1},WEI:{type: Scratch.ArgumentType.NUMBER, defaultValue: 0.4},RES:{type: Scratch.ArgumentType.NUMBER, defaultValue: 1},SAMP:{type: Scratch.ArgumentType.NUMBER, defaultValue: 64},}},
            {opcode: "dots", blockType: Scratch.BlockType.COMMAND, text: "add dots scale:[S] angle:[A] | blend: [BLEND] opacity:[OP]", arguments: {OP: {type: Scratch.ArgumentType.NUMBER, defaultValue: 1},S:{type: Scratch.ArgumentType.NUMBER, defaultValue: 1}, A: {type: Scratch.ArgumentType.ANGLE, defaultValue: 0},BLEND: {type: Scratch.ArgumentType.STRING, menu: "blendModes", defaultValue: "SCREEN"}}},
            {opcode: "depth", blockType: Scratch.BlockType.COMMAND, text: "add depth of field focusDistance:[FD] focalLength:[FL] bokehScale:[BS] | height:[H] | blend: [BLEND] opacity:[OP]", arguments: {FD: {type: Scratch.ArgumentType.NUMBER, defaultValue: (3)},FL: {type: Scratch.ArgumentType.NUMBER, defaultValue: (0.001)},BS: {type: Scratch.ArgumentType.NUMBER, defaultValue: 4},H: {type: Scratch.ArgumentType.NUMBER, defaultValue: 240},OP: {type: Scratch.ArgumentType.NUMBER, defaultValue: 1},BLEND: {type: Scratch.ArgumentType.STRING, menu: "blendModes", defaultValue: "NORMAL"}}}
        
          ],
        menus: {            
          onoff: {acceptReporters: true, items: [{text: "enabled", value: "1"},{text: "disabled", value: "0"},]},
          blendModes: {acceptReporters: false, items: [
            "SKIP","SET","ADD","ALPHA","AVERAGE","COLOR","COLOR_BURN","COLOR_DODGE",
            "DARKEN","DIFFERENCE","DIVIDE","DST","EXCLUSION","HARD_LIGHT","HARD_MIX",
            "HUE","INVERT","INVERT_RGB","LIGHTEN","LINEAR_BURN","LINEAR_DODGE",
            "LINEAR_LIGHT","LUMINOSITY","MULTIPLY","NEGATION","NORMAL","OVERLAY",
            "PIN_LIGHT","REFLECT","SCREEN","SRC","SATURATION","SOFT_LIGHT","SUBTRACT",
            "VIVID_LIGHT"
          ]},
        }
      }}

      OrbitControl(args) {

        console.log("creating...", OrbitControls)
        controls = new OrbitControls.OrbitControls(camera, threeRenderer.domElement);
        controls.enableDamping = true
        
        controls.enabled = !!args.STATE
        console.log(controls)
    }

    resetComposer() {
      composer.passes = []
      passes = {}
      updateComposers()
    }

    bloom(args) {
    if (!camera || !scene) {if (alerts) alert("set a camera!"); return}
    const bloomEffect = new BloomEffect({
        intensity: args.I,
        luminanceThreshold: args.T,   // ← correct key
        luminanceSmoothing: args.S,
        blendFunction: BlendFunction[args.BLEND],
    })
    bloomEffect.blendMode.opacity.value = args.OP

    const pass = new EffectPass(camera, bloomEffect)

    composer.addPass(pass)
    }

    godRays(args) {
    if (!camera || !scene) {if (alerts) alert("set a camera!"); return}
      getObject(args.NAME)
      const sun = object

      const godRays = new GodRaysEffect(camera, sun, {
        resolutionScale: args.RES,
        density: args.DENS,           // ray density
        decay: args.DEC,             // fade out
        weight: args.WEI,             // brightness of rays
        exposure: args.EXP,
        samples: args.SAMP,
        blendFunction: BlendFunction[args.BLEND],
      })
      godRays.blendMode.opacity.value = args.OP
      const pass = new EffectPass(camera, godRays)
      composer.addPass(pass)
    }

    dots(args) {
    if (!camera || !scene) {if (alerts) alert("set a camera!"); return}
      const dot = new DotScreenEffect({
        angle: args.A,
        scale: args.S,
        blendFunction: BlendFunction[args.BLEND],
      })
      dot.blendMode.opacity.value = args.OP
      const pass = new EffectPass(camera, dot)
      composer.addPass(pass)
    }

    depth(args) {
      if (!camera || !scene) {if (alerts) alert("set a camera!"); return}
      const dofEffect = new DepthOfFieldEffect(camera, {
        focusDistance: (args.FD - camera.near) / (camera.far - camera.near),     // how far from camera things are sharp (0 = near, 1 = far)
        focalLength: args.FL,      // lens focal length in meters
        bokehScale: args.BS,      // strength/size of the blur circles
        height: args.H,          // resolution hint (affects quality/perf)
        blendFunction: BlendFunction[args.BLEND],
      })
      dofEffect.blendMode.opacity.value = args.OP

      const dofPass = new EffectPass(camera, dofEffect)
      composer.addPass(dofPass)
    }


  }
  Scratch.extensions.register(new ThreeAddons())

  class RapierPhysics {
      getInfo() {
        return {
          id: "rapierPhysics",
          name: "RAPIER Physics",
          color1: "#222222",
          color2: "#203024ff",
          color3: "#78f07eff",
          blocks: [
            {opcode: "createWorld", blockType: Scratch.BlockType.COMMAND, text: "create world | gravity:[G]", arguments: {G: {type: Scratch.ArgumentType.STRING, defaultValue: "[0,-9.81,0]"}}},
            {opcode: "getWorld", blockType: Scratch.BlockType.REPORTER, text: "get world [PROPERTY]", arguments: {PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "wProp"}}},
            "---",
            {opcode: "objectPhysics", blockType: Scratch.BlockType.COMMAND, text: "enable physics for object [OBJECT] [state] | rigidBody [type] | collider [collider] density [density] friction [friction] sensor [state2]", arguments: {state2: {type: Scratch.ArgumentType.STRING, menu: "state2"},state: {type: Scratch.ArgumentType.STRING, menu: "state", defaultValue: "true"}, type: {type: Scratch.ArgumentType.STRING, menu: "objectTypes", defaultValue: "dynamic"}, collider: {type: Scratch.ArgumentType.STRING, menu: "colliderTypes", defaultValue: "cuboid"}, OBJECT: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"},density: {type: Scratch.ArgumentType.STRING, defaultValue: "1"},friction: {type: Scratch.ArgumentType.STRING, defaultValue: "0.5"}}},
            "---",
            {blockType: Scratch.BlockType.LABEL, text: "- RigidBody"},
            {opcode: "setRB", blockType: Scratch.BlockType.COMMAND, text: "set rigidbody [PROPERTY] of [OBJECT] to [VALUE]", arguments: {PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "rigidBodySets"}, OBJECT: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"}, VALUE: {type: Scratch.ArgumentType.STRING, defaultValue: "1"}}},
            {opcode: "getRB", blockType: Scratch.BlockType.REPORTER, text: "get rigidbody [PROPERTY] of [OBJECT]", arguments: {PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "rigidBodyProperties"}, OBJECT: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"}}},
            "---",
            {opcode: "lockObjectAxis", blockType: Scratch.BlockType.COMMAND, text: "lock rigidbody [OBJECT] [PROPERTY] on x:[X] y:[Y] z:[Z]", arguments: {OBJECT: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"}, PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "lockAxes"}, X: {type: Scratch.ArgumentType.STRING, menu: "tf"}, Y: {type: Scratch.ArgumentType.STRING, menu: "tf"}, Z: {type: Scratch.ArgumentType.STRING, menu: "tf"}}},
            "---",
            {opcode: "addForce", blockType: Scratch.BlockType.COMMAND, text: "set [PROPERTY] of [OBJECT] to [VALUE] in [SPACE] space", arguments: {VALUE: {type: Scratch.ArgumentType.STRING, defaultValue: "[0,10,0]"},PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "forces", defaultValue: "addForce"},SPACE: {type: Scratch.ArgumentType.STRING, menu: "spaces", defaultValue: "world"}, OBJECT: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"}}},
            {opcode: "resetForces", blockType: Scratch.BlockType.COMMAND, text: "reset [PROPERTY] of [OBJECT]", arguments: {PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "resetF", defaultValue: "resetForces"}, OBJECT: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"}}},
            "---",
            {opcode: "fixedJoint", blockType: Scratch.BlockType.COMMAND, text: "create FIXED joint between [ObjA] & [ObjB] | anchor A: [VA] [RA] B: [VB] [RB]", arguments: {ObjA: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"},ObjB: {type: Scratch.ArgumentType.STRING, defaultValue: "myObjectB"},VA: {type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]"},VB: {type: Scratch.ArgumentType.STRING, defaultValue: "[0,1,0]"},RA: {type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]"},RB: {type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]"},}},
            {opcode: "sphericalJoint", blockType: Scratch.BlockType.COMMAND, text: "create SPHERICAL joint between [ObjA] & [ObjB] | anchor A: [VA] B: [VB]", arguments: {ObjA: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"},ObjB: {type: Scratch.ArgumentType.STRING, defaultValue: "myObjectB"},VA: {type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]"},VB: {type: Scratch.ArgumentType.STRING, defaultValue: "[0,1,0]"},}},
            {opcode: "revoluteJoint", blockType: Scratch.BlockType.COMMAND, text: "create REVOLUTE joint between [ObjA] & [ObjB] | anchor A: [VA] B: [VB] | axis: [X]", arguments: {ObjA: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"},ObjB: {type: Scratch.ArgumentType.STRING, defaultValue: "myObjectB"},VA: {type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]"},VB: {type: Scratch.ArgumentType.STRING, defaultValue: "[0,1,0]"},X: {type: Scratch.ArgumentType.STRING, defaultValue: "[1,0,0]"},}},
            "---",
            {blockType: Scratch.BlockType.LABEL, text: "- Collider"},
            {opcode: "setC", blockType: Scratch.BlockType.COMMAND, text: "set collider [PROPERTY] of [OBJECT] to [VALUE]", arguments: {PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "colliderSets"}, OBJECT: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"}, VALUE: {type: Scratch.ArgumentType.STRING, defaultValue: "1"}}},
            {opcode: "getC", blockType: Scratch.BlockType.REPORTER, text: "get collider [PROPERTY] of [OBJECT]", arguments: {PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "colliderProperties"}, OBJECT: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"}}},
            {opcode: "enableCCD", blockType: Scratch.BlockType.COMMAND, text: "enable Continuous collision detection for [OBJECT] [state]", arguments: {state: {type: Scratch.ArgumentType.STRING, menu: "state", defaultValue: "true"},PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "oPropS", defaultValue: "physics"}, OBJECT: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"}}},
            "---",
            {opcode: "sensorSingle", blockType: Scratch.BlockType.BOOLEAN, text: "is sensor [SENSOR] touching [OBJECT]?", arguments: {SENSOR: {type: Scratch.ArgumentType.STRING, defaultValue: "mySensor"}, OBJECT: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"}}},
            {opcode: "sensorAll", blockType: Scratch.BlockType.REPORTER, text: "objects touching sensor [SENSOR]", arguments: {SENSOR: {type: Scratch.ArgumentType.STRING, defaultValue: "mySensor"}}}
          ],
          menus: {
            wProp: {acceptReporters: false, items: [
              {text: "Gravity", value: "gravity"}, {text: "log to console", value: "log"}
            ]},
            tf: {acceptReporters: true, items: [{text: "false", value: "false"},{text: "true", value: "true"}]},
            lockAxes: {acceptReporters: false, items: [
              {text: "Translation", value: "setEnabledTranslations"}, {text: "Rotation", value: "setEnabledRotations"}
            ]},
            rigidBodyProperties: {acceptReporters: false, items: [
              {text: "Type", value: "bodyType"},
              {text: "Linear Velocity", value: "linvel"},
              {text: "Angular Velocity", value: "angvel"},
              {text: "Translation (position)", value: "translation"},
              {text: "Rotation (quaternion)", value: "rotation"},
              {text: "Mass", value: "mass"},
              //{text: "Center of Mass", value: "centerOfMass"},
              {text: "Linear Damping", value: "linearDamping"},
              {text: "Angular Damping", value: "angularDamping"},
              {text: "Is Sleeping?", value: "isSleeping"},
              //{text: "Can Sleep?", value: "isCanSleep"},
              {text: "Gravity Scale", value: "gravityScale"},
              {text: "Is Fixed?", value: "isFixed"},
              {text: "Is Dynamic?", value: "isDynamic"},
              {text: "Is Kinematic?", value: "isKinematic"},
              //{text: "Sleeping", value: "sleeping"}
            ]},
            rigidBodySets: {acceptReporters: false, items: [
              //{text: "Linear Velocity", value: "setLinvel"},
              //{text: "Angular Velocity", value: "setAngvel"},
              //{text: "Mass", value: "setMass"},
              {text: "Gravity Scale", value: "setGravityScale"},
              //{text: "Can Sleep?", value: "setCanSleep"},
              //{text: "Sleeping", value: "sleeping"},
              {text: "Linear Damping", value: "setLinearDamping"},
              {text: "Angular Damping", value: "setAngularDamping"},
              {text: "Is Fixed?", value: "isFixed"},
              {text: "Is Dynamic?", value: "isDynamic"},
              {text: "Is Kinematic?", value: "isKinematic"}
            ]},
            colliderProperties: {acceptReporters: false, items: [
              //{text: "Collider Type", value: "type"},
              {text: "Is Sensor?", value: "isSensor"},
              {text: "Friction", value: "friction"},
              {text: "Restitution", value: "restitution"},
              {text: "Density", value: "density"},
              {text: "Mass", value: "mass"},
              {text: "Position", value: "translation"},
              {text: "Rotation", value: "rotation"},
              //{text: "Area", value: "area"},
              {text: "Volume", value: "volume"},
              {text: "Collision Groups", value: "collisionGroups"},
              //{text: "Collision Mask", value: "collisionMask"},
              //{text: "Is Enabled?", value: "enabled"},
              //{text: "Contact Count", value: "contactCount"},
              //{text: "RigidBody Handle", value: "rigidBody"}
            ]},
            colliderSets: {acceptReporters: false, items: [
              {text: "Friction", value: "setFriction"},
              {text: "Restitution", value: "setRestitution"},
              {text: "Density", value: "setDensity"},
              {text: "Is Sensor?", value: "setSensor"},
              {text: "Collision Groups", value: "setCollisionGroups"},
              //{text: "Enabled", value: "enabled"},                 // object.collider.enabled = bool
              //{text: "Position Offset", value: "setTranslation"},
              //{text: "Rotation Offset", value: "setRotation"}
            ]},
            state: {acceptReporters: true, items: [{text: "on", value: "true"},{text: "off", value: "false"}]},
            state2: {acceptReporters: true, items: [{text: "false", value: "false"},{text: "true (must be fixed)", value: "true"}]},
            spaces: {acceptReporters: false, items: [{text: "World", value: "world"},{text: "Local", value: "local"}]},
            objectTypes: {acceptReporters: false, items: [{text: "Dynamic", value: "dynamic"},{text: "Fixed", value: "fixed"},{text: "Kinematic Position Based",value: "kinematicPositionBased"}]},
            colliderTypes: {acceptReporters: false, items: [{text: "Box, Rectangle, cuboid", value: "cuboid"},{text: "Sphere, ball", value: "ball"},{text: "Custom, convexHull", value: "convexHull"},]},
            forces: {acceptReporters: false, items: [{text: "Force", value: "addForce"},{text: "Torque (rotation)", value: "addTorque"},{text: "Apply Impulse", value: "applyImpulse"},{text: "Apply Torque Impulse (rotation)", value: "applyTorqueImpulse"},{text: "Linear Velocity", value: "setLinvel"},{text: "Angular Velocity", value: "setAngvel"},]},
            resetF: {acceptReporters: false, items: [{text:"Reset Forces", value: "resetForces"},{text:"Reset Torques", value: "resetTorques"},]}
          }
        }
      }
      joint(jointData, bodyA, bodyB) {
        physicsWorld.createImpulseJoint(jointData, bodyA.rigidBody, bodyB.rigidBody, true)
      }

      fixedJoint(args) {
        const VA = JSON.parse(args.VA).map(Number)
        const VB = JSON.parse(args.VB).map(Number)
        let RA = JSON.parse(args.RA).map(Number)
        let RB = JSON.parse(args.RB).map(Number)

        RA = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(
            THREE.MathUtils.degToRad(RA[0]),
            THREE.MathUtils.degToRad(RA[1]),
            THREE.MathUtils.degToRad(RA[2])
          )
        )
        RB = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(
            THREE.MathUtils.degToRad(RB[0]),
            THREE.MathUtils.degToRad(RB[1]),
            THREE.MathUtils.degToRad(RB[2])
          )
        )

        const data = RAPIER.JointData.fixed(
            { x: VA[0], y: VA[1], z: VA[2] }, RA,
            { x: VB[0], y: VB[1], z: VB[2] }, RB
        )
        getObject(args.ObjA)
        const objectA = object
        getObject(args.ObjB)
        this.joint(data, objectA, object)
      }

      sphericalJoint(args) {
        const VA = JSON.parse(args.VA).map(Number)
        const VB = JSON.parse(args.VB).map(Number)

        const data = RAPIER.JointData.spherical(
            { x: VA[0], y: VA[1], z: VA[2] },
            { x: VB[0], y: VB[1], z: VB[2] }
        )
        getObject(args.ObjA)
        const objectA = object
        getObject(args.ObjB)
        this.joint(data, objectA, object)
      }

      revoluteJoint(args) {
        const VA = JSON.parse(args.VA).map(Number)
        const VB = JSON.parse(args.VB).map(Number)
        const x = JSON.parse(args.X).map(Number)

        const data = RAPIER.JointData.revolute(
            { x: VA[0], y: VA[1], z: VA[2] },
            { x: VB[0], y: VB[1], z: VB[2] }, { x: x[0], y: x[1], z: x[2] },
        )
        getObject(args.ObjA)
        const objectA = object
        getObject(args.ObjB)
        this.joint(data, objectA, object)
      }

      prismaticJoint(args) {
        const VA = JSON.parse(args.VA).map(Number)
        const VB = JSON.parse(args.VB).map(Number)
        const x = JSON.parse(args.X).map(Number)

        const data = RAPIER.JointData.prismatic(
            { x: VA[0], y: VA[1], z: VA[2] },
            { x: VB[0], y: VB[1], z: VB[2] }, { x: x[0], y: x[1], z: x[2] },
        )
        getObject(args.ObjA)
        const objectA = object
        getObject(args.ObjB)
        this.joint(data, objectA, object)
      }

      createWorld(args) {
        const v3 = JSON.parse(args.G).map(Number)
        const gravity = { x: v3[0], y: v3[1], z: v3[2]}
        physicsWorld = new RAPIER.World(gravity)

        console.log(physicsWorld)
      }

      getWorld(args) {
        if (args.PROPERTY === "log") {console.log(physicsWorld); return "logged"}
        return JSON.stringify(physicsWorld[args.PROPERTY])
      }

      setRB(args) {
        let value = args.VALUE
        if (args.VALUE === "true" || args.VALUE === "false") value = !!args.VALUE
        getObject(args.OBJECT)
        object.rigidBody[args.PROPERTY](value)
      }
      setC(args) {
        let value = args.VALUE
        if (args.VALUE === "true" || args.VALUE === "false") value = !!args.VALUE
        getObject(args.OBJECT)
        object.collider[args.PROPERTY](value)
      }

      getRB(args) {
        getObject(args.OBJECT)
        return JSON.stringify(object.rigidBody[args.PROPERTY]())
      }
      getC(args) {
        getObject(args.OBJECT)
        return JSON.stringify(object.collider[args.PROPERTY]())
      }

      lockObjectAxis(args) {
        getObject(args.OBJECT)
        const x =  !JSON.parse(args.X)
        const y = !JSON.parse(args.Y)
        const z = !JSON.parse(args.Z)
        object.rigidBody[args.PROPERTY](x,y,z,true) //changes is xyz, wake up
      }

      objectPhysics(args) {
        getObject(args.OBJECT)
        object.physics = JSON.parse(args.state)

        if (JSON.parse(args.state)) {
          //if already exists delete:
          if (object.rigidBody) {
            physicsWorld.removeRigidBody(object.rigidBody)
            object.rigidBody = null
            object.collider = null
          }
          /*asing a rigidbody and collider to object and add them to physicsWorld*/
        let rigidBodyDesc = RAPIER.RigidBodyDesc[args.type]()
            .setTranslation(object.position.x, object.position.y, object.position.z)
            .setRotation({w: object.quaternion._w, x: object.quaternion._x, y: object.quaternion._y, z: object.quaternion._z})

        let colliderDesc
        switch(args.collider) {
            case "cuboid": colliderDesc = createCuboidCollider(object, args.state2); break
            case "ball": colliderDesc = createBallCollider(object, args.state2); break
            case "convexHull": colliderDesc = createConvexHullCollider(object, args.state2); break
        }
        colliderDesc.setSensor(JSON.parse(args.state2)).setDensity(args.density).setFriction(args.friction)
        
        let rigidBody = physicsWorld.createRigidBody(rigidBodyDesc)
        let collider = physicsWorld.createCollider(colliderDesc, rigidBody)

        object.rigidBody = rigidBody
        object.collider = collider
        } else {
          /*if disabling physics, delete rigidbody and collider from physicsWorld and object*/
          physicsWorld.removeRigidBody(object.rigidBody)
          object.rigidBody = null
          object.collider = null
        }

      }

      enableCCD(args) {
        getObject(args.OBJECT)
        if (object.physics) {
          let rigidBody = object.rigidBody
          rigidBody.enableCcd(JSON.parse(args.state))
        }
     }

     addForce(args) {
      getObject(args.OBJECT)
      const vector = JSON.parse(args.VALUE).map(Number)
      
      let force = new THREE.Vector3(vector[0],vector[1],vector[2])
        if (args.SPACE === "local") {
          force.applyQuaternion(object.quaternion);
        }

      object.rigidBody[args.PROPERTY](force,true)
     }

     resetForces(args) {
      rigidBody[args.PROPERTY](true)
     }

     sensorSingle(args) {
      getObject(args.SENSOR)
      const sensor = object

      getObject(args.OBJECT)

      let touching = false
      physicsWorld.intersectionPairsWith(sensor.collider, otherCollider => {
        if (otherCollider === object.collider) touching = true
      })

      return touching
     }

     sensorAll(args) {
      getObject(args.SENSOR)
      const sensor = object

      const touchedObjects = []

      // loop thruogh every collider touching sensor
      physicsWorld.intersectionPairsWith(sensor.collider, otherCollider => {
        // find owner of collider
        const otherObject = scene.children.find(o => o.collider === otherCollider)
        console.log(otherCollider)
        if (otherObject) touchedObjects.push(otherObject.name)
      })

      return JSON.stringify(touchedObjects)
     }

    }
  Scratch.extensions.register(new RapierPhysics())
  })

})(Scratch);