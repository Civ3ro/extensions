// Name: Extra 3D Addons
// ID: threejsAddonsExtension
// Description: Extension of extra3D extension, old addons + new ones here 
// By: Civero <https://scratch.mit.edu/users/civero/> <https://civero.itch.io> <https://civ3ro.github.io/extensions>
// License: MIT License Copyright (c) 2021-2024 TurboWarp Extensions Contributors

(function (Scratch) {
"use strict";

  if (!Scratch.extensions.unsandboxed) {throw new Error("Extension must run unsandboxed")}
  if (!Scratch.vm.extensionManager._loadedExtensions.has("threejsExtension")) throw new Error("Load Extra 3D first! This extension adds Addons, this is not the main one.")
  
  const vm = Scratch.vm
  const runtime = vm.runtime
  const Cast = Scratch.Cast
  let alerts = false
  console.log('Loading Extra3D Addons')
  console.log("alerts are " + (alerts ? "enabled" : "disabled"))

  const THREE = _Extra3D_.THREE

  //Addons
  let GLTFLoader
  let gltf
  let OrbitControls
  let controls
  let BufferGeometryUtils

  //Physics
  let RAPIER
  let physicsWorld

  let composer
  let customEffects = []
  let models = {}
  let rect

  let 
    EffectComposer,
    EffectPass,
    RenderPass,

    Effect,
    BloomEffect,
    GodRaysEffect,
    DotScreenEffect,
    DepthOfFieldEffect,

    BlendFunction;
  

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
  function TriMesh(mesh) {
    // Get the positions array (from your geoPoints function)
  const positions = mesh.geometry.attributes.position.array; 
  const numVertices = positions.length / 3;

  // Create an index array: [0, 1, 2, 3, 4, 5, ..., numVertices - 1]
  const indices = Array.from({ length: numVertices }, (_, i) => i);

  const collider = RAPIER.ColliderDesc.trimesh(
      positions, 
      new Uint32Array(indices) 
  );

  return collider
  }

  function resetComposer() {
    composer.reset()
    composer.passes = []
    customEffects = []
    updateComposer()
  }
  function updateComposer() {
    if (!_Extra3D_.CAMERA || !_Extra3D_.SCENE) return

    const Render = new RenderPass(_Extra3D_.SCENE, _Extra3D_.CAMERA)
    if (!composer.passes.some(p => p && p._Extra3D_.SCENE)) composer.addPass(Render) //add
    else { //replace it to current scene&camera
      const idx = composer.passes.findIndex(p => p && p._Extra3D_.SCENE);
      composer.passes[idx] = Render;
    }
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
  async function load() {
    GLTFLoader = await import("https://esm.sh/three@0.180.0/examples/jsm/loaders/GLTFLoader.js")
    gltf = new GLTFLoader.GLTFLoader()

    OrbitControls = await import("https://esm.sh/three@0.180.0/examples/jsm/controls/OrbitControls.js")
    BufferGeometryUtils = await import("https://esm.sh/three@0.180.0/examples/jsm/utils/BufferGeometryUtils.js")

    const POSTPROCESSING = await import("https://esm.sh/postprocessing@6.37.8"); //damm only case i do need to add semicolon
    ({
      EffectComposer,
      EffectPass,
      RenderPass,

      Effect,
      BloomEffect,
      GodRaysEffect,
      DotScreenEffect,
      DepthOfFieldEffect,

      BlendFunction
    } = POSTPROCESSING)

    // Example: create a composer
    composer = new EffectComposer(_Extra3D_.THREERENDERER, {frameBufferType: THREE.HalfFloatType})

    Object.defineProperties(_Extra3D_, {
      COMPOSER: { get: () => composer, enumerable: true, configurable: true },
      CustomEffects: { get: () => customEffects, configurable: true }
    })

    _Extra3D_.resetComposer = resetComposer
    _Extra3D_.updateComposer = updateComposer

    RAPIER = await import("https://esm.sh/@dimforge/rapier3d-compat@0.19.0")
    await RAPIER.init()

    _Extra3D_.onUpdate.push(loop)
  }
  const loop = (delta) => {
    if (_Extra3D_.SCENE && _Extra3D_.CAMERA) {
      if (controls) controls.update()

      Object.values(models).forEach( model => { if (model) model.mixer.update(delta) } )

      if (_Extra3D_.CustomEffects) _Extra3D_.CustomEffects.forEach(e => {
        if (e.uniforms.get('time')) {
        e.uniforms.get('time').value += delta
        }
      })
    }

    if (physicsWorld && _Extra3D_.SCENE) {
      physicsWorld.step()

      _Extra3D_.SCENE.children.forEach(obj => {
        if (!(obj.isMesh) || !(obj.physics)) return
        if (obj.rigidBody) {
            obj.position.copy(obj.rigidBody.translation())
            obj.quaternion.copy(obj.rigidBody.rotation())
        }
      })

    }
  }

  Promise.resolve(load()).then(() => {

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
            {opcode: "splineModel", extensions: ["colours_data_lists"], blockType: Scratch.BlockType.COMMAND, text: "create (geometry&material) spline [NAME] using model [MODEL] along curve [CURVE] with spacing [SPACING]", arguments: {NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "mySpline"}, MODEL: {type: Scratch.ArgumentType.STRING, menu: "modelsList"}, CURVE: {type: Scratch.ArgumentType.STRING, defaultValue: "[curve]", exemptFromNormalization: true}, SPACING: {type: Scratch.ArgumentType.NUMBER, defaultValue: 1}}},
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

        _Extra3D_.createObject(args.NAME, group, args.GROUP)
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

    async splineModel(args) {
        const model = await getModel(args.MODEL, args.NAME)
        if (!model) return console.warn("Model not found:", args.MODEL)

        const curve = _Extra3D_.getAsset(args.CURVE)
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
        _Extra3D_.GEOMETRIES[args.NAME] = merged
        matList.name = args.NAME
        _Extra3D_.MATERIALS[args.NAME] = matList
    }


    }
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
            {opcode: "resetComposer", blockType: Scratch.BlockType.COMMAND, text: "reset composer"},
            {opcode: "bloom", blockType: Scratch.BlockType.COMMAND, text: "add bloom intensity:[I] smoothing:[S] threshold:[T] | blend: [BLEND] opacity:[OP]", arguments: {OP: {type: Scratch.ArgumentType.NUMBER, defaultValue: 1},I: {type: Scratch.ArgumentType.NUMBER, defaultValue: 1}, S:{type: Scratch.ArgumentType.NUMBER, defaultValue: 0.5}, T:{type: Scratch.ArgumentType.NUMBER, defaultValue: 0.5}, BLEND: {type: Scratch.ArgumentType.STRING, menu: "blendModes", defaultValue: "SCREEN"}}},
            {opcode: "godRays", blockType: Scratch.BlockType.COMMAND, text: "add god rays object:[NAME] density:[DENS] decay:[DEC] weight:[WEI] exposition:[EXP] | resolution:[RES] samples:[SAMP] | blend: [BLEND] opacity:[OP]", arguments: {OP: {type: Scratch.ArgumentType.NUMBER, defaultValue: 1},NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"},BLEND: {type: Scratch.ArgumentType.STRING, menu: "blendModes", defaultValue: "SCREEN"}, DEC:{type: Scratch.ArgumentType.NUMBER, defaultValue: 0.95}, DENS:{type: Scratch.ArgumentType.NUMBER, defaultValue: 1},EXP:{type: Scratch.ArgumentType.NUMBER, defaultValue: 0.1},WEI:{type: Scratch.ArgumentType.NUMBER, defaultValue: 0.4},RES:{type: Scratch.ArgumentType.NUMBER, defaultValue: 1},SAMP:{type: Scratch.ArgumentType.NUMBER, defaultValue: 64},}},
            {opcode: "dots", blockType: Scratch.BlockType.COMMAND, text: "add dots scale:[S] angle:[A] | blend: [BLEND] opacity:[OP]", arguments: {OP: {type: Scratch.ArgumentType.NUMBER, defaultValue: 1},S:{type: Scratch.ArgumentType.NUMBER, defaultValue: 1}, A: {type: Scratch.ArgumentType.ANGLE, defaultValue: 0},BLEND: {type: Scratch.ArgumentType.STRING, menu: "blendModes", defaultValue: "SCREEN"}}},
            {opcode: "depth", blockType: Scratch.BlockType.COMMAND, text: "add depth of field focusDistance:[FD] focalLength:[FL] bokehScale:[BS] | height:[H] | blend: [BLEND] opacity:[OP]", arguments: {FD: {type: Scratch.ArgumentType.NUMBER, defaultValue: (3)},FL: {type: Scratch.ArgumentType.NUMBER, defaultValue: (0.001)},BS: {type: Scratch.ArgumentType.NUMBER, defaultValue: 4},H: {type: Scratch.ArgumentType.NUMBER, defaultValue: 240},OP: {type: Scratch.ArgumentType.NUMBER, defaultValue: 1},BLEND: {type: Scratch.ArgumentType.STRING, menu: "blendModes", defaultValue: "NORMAL"}}},
            "---",
            {opcode: "custom", blockType: Scratch.BlockType.COMMAND, text: "add custom shader [NAME] with GLSL fragm [FRA] vert [VER] | blend: [BLEND] opacity:[OP]", arguments: {NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "myShader"}, FRA: {type: Scratch.ArgumentType.STRING}, VER: {type: Scratch.ArgumentType.STRING}, BLEND: {type: Scratch.ArgumentType.STRING, menu: "blendModes", defaultValue: "NORMAL"}, OP: {type: Scratch.ArgumentType.NUMBER, defaultValue: 1}}},
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
      if (controls) controls.dispose()

      controls = new OrbitControls.OrbitControls(_Extra3D_.CAMERA, _Extra3D_.THREERENDERER.domElement);
      controls.enableDamping = true
      
      controls.enabled = !!args.STATE
    }

    resetComposer() {
      resetComposer()
    }

    bloom(args) {
    if (!_Extra3D_.CAMERA || !_Extra3D_.SCENE) {if (alerts) alert("set a camera!"); return}
    const bloomEffect = new BloomEffect({
        intensity: args.I,
        luminanceThreshold: args.T,   // ← correct key
        luminanceSmoothing: args.S,
        blendFunction: BlendFunction[args.BLEND],
    })
    bloomEffect.blendMode.opacity.value = args.OP

    const pass = new EffectPass(_Extra3D_.CAMERA, bloomEffect)

    composer.addPass(pass)
    }

    godRays(args) {
    if (!_Extra3D_.CAMERA || !_Extra3D_.SCENE) {if (alerts) alert("set a camera!"); return}
        let object = _Extra3D_.getObject(args.NAME)
        const sun = object

        const godRays = new GodRaysEffect(_Extra3D_.CAMERA, sun, {
        resolutionScale: args.RES,
        density: args.DENS,           // ray density
        decay: args.DEC,             // fade out
        weight: args.WEI,             // brightness of rays
        exposure: args.EXP,
        samples: args.SAMP,
        blendFunction: BlendFunction[args.BLEND],
        })
        godRays.blendMode.opacity.value = args.OP
        const pass = new EffectPass(_Extra3D_.CAMERA, godRays)
        composer.addPass(pass)
    }

    dots(args) {
    if (!_Extra3D_.CAMERA || !_Extra3D_.SCENE) {if (alerts) alert("set a camera!"); return}
        const dot = new DotScreenEffect({
        angle: args.A,
        scale: args.S,
        blendFunction: BlendFunction[args.BLEND],
        })
        dot.blendMode.opacity.value = args.OP
        const pass = new EffectPass(_Extra3D_.CAMERA, dot)
        composer.addPass(pass)
    }

    depth(args) {
        if (!_Extra3D_.CAMERA || !_Extra3D_.SCENE) {if (alerts) alert("set a camera!"); return}
        const dofEffect = new DepthOfFieldEffect(_Extra3D_.CAMERA, {
        focusDistance: (args.FD - _Extra3D_.CAMERA.near) / (_Extra3D_.CAMERA.far - _Extra3D_.CAMERA.near),     // how far from camera things are sharp (0 = near, 1 = far)
        focalLength: args.FL,      // lens focal length in meters
        bokehScale: args.BS,      // strength/size of the blur circles
        height: args.H,          // resolution hint (affects quality/perf)
        blendFunction: BlendFunction[args.BLEND],
        })
        dofEffect.blendMode.opacity.value = args.OP

        const dofPass = new EffectPass(_Extra3D_.CAMERA, dofEffect)
        composer.addPass(dofPass)
    }

    async custom(args) {
        function cleanGLSL(glslCode) {
        //delete multilines comments
        let cleanedCode = glslCode.replace(/\/\*[\s\S]*?\*\//g, ' ')
        .replace(/  /g, '\n')
        .replace(/\/\/.*$/gm, ' ')
        .replace(/; /g, ';\n')
        
        return cleanedCode;
        }

        let fs = cleanGLSL(`
        ${args.FRA}
        `)
        if (!args.FRA.trim()) {fs = `void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) { outputColor = inputColor; }`}
        const vs = cleanGLSL(`
        ${args.VER}
        `)
        console.log(fs)
        console.log(vs)

        const effect = new Effect(
        "Custom", 
        fs, 
        {
            blendFunction: BlendFunction[args.BLEND],
            vertexShader: vs,
            uniforms: new Map([ //uniforms usually in shaders... open to more!
            ['time', new THREE.Uniform(0.0)], 
            ['resolution', new THREE.Uniform(new THREE.Vector2(_Extra3D_.THREERENDERER.domElement.width, _Extra3D_.THREERENDERER.domElement.height))] 
            ]),
            defines: new Map([['USE_TIME', '1'], ['USE_VERTEX_TRANSFORM', '']]),
        }
        );

        effect.blendMode.opacity.value = args.OP

        const pass = new EffectPass(_Extra3D_.CAMERA, effect);
        composer.addPass(pass);

        customEffects.push(effect);
    }

    }
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
            {opcode: "objectPhysics", blockType: Scratch.BlockType.COMMAND, text: "enable physics for object [OBJECT] [state] | rigidBody [type] | collider [collider] mass [mass] density [density] friction [friction] sensor [state2]", arguments: {state2: {type: Scratch.ArgumentType.STRING, menu: "state2"},state: {type: Scratch.ArgumentType.STRING, menu: "state", defaultValue: "true"}, type: {type: Scratch.ArgumentType.STRING, menu: "objectTypes", defaultValue: "dynamic"}, collider: {type: Scratch.ArgumentType.STRING, menu: "colliderTypes", defaultValue: "cuboid"}, OBJECT: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"},mass: {type: Scratch.ArgumentType.NUMBER, defaultValue: "1"},density: {type: Scratch.ArgumentType.NUMBER, defaultValue: "1"},friction: {type: Scratch.ArgumentType.NUMBER, defaultValue: "0.5"}}},
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
            {opcode: "enableCCD", blockType: Scratch.BlockType.COMMAND, text: "enable Continuous Collision Detection for [OBJECT] [state]", arguments: {state: {type: Scratch.ArgumentType.STRING, menu: "state", defaultValue: "true"},PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "oPropS", defaultValue: "physics"}, OBJECT: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"}}},
            "---",
            {opcode: "fixedJoint", blockType: Scratch.BlockType.COMMAND, text: "create FIXED joint between [ObjA] & [ObjB] | anchor A: [VA] [RA] B: [VB] [RB]", arguments: {ObjA: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"},ObjB: {type: Scratch.ArgumentType.STRING, defaultValue: "myObjectB"},VA: {type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]"},VB: {type: Scratch.ArgumentType.STRING, defaultValue: "[0,1,0]"},RA: {type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]"},RB: {type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]"},}},
            {opcode: "sphericalJoint", blockType: Scratch.BlockType.COMMAND, text: "create SPHERICAL joint between [ObjA] & [ObjB] | anchor A: [VA] B: [VB]", arguments: {ObjA: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"},ObjB: {type: Scratch.ArgumentType.STRING, defaultValue: "myObjectB"},VA: {type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]"},VB: {type: Scratch.ArgumentType.STRING, defaultValue: "[0,1,0]"},}},
            {opcode: "revoluteJoint", blockType: Scratch.BlockType.COMMAND, text: "create REVOLUTE joint between [ObjA] & [ObjB] | anchor A: [VA] B: [VB] | axis: [X]", arguments: {ObjA: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"},ObjB: {type: Scratch.ArgumentType.STRING, defaultValue: "myObjectB"},VA: {type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]"},VB: {type: Scratch.ArgumentType.STRING, defaultValue: "[0,1,0]"},X: {type: Scratch.ArgumentType.STRING, defaultValue: "[1,0,0]"},}},
            "---",
            {blockType: Scratch.BlockType.LABEL, text: "- Collider"},
            {opcode: "setC", blockType: Scratch.BlockType.COMMAND, text: "set collider [PROPERTY] of [OBJECT] to [VALUE]", arguments: {PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "colliderSets"}, OBJECT: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"}, VALUE: {type: Scratch.ArgumentType.STRING, defaultValue: "1"}}},
            {opcode: "getC", blockType: Scratch.BlockType.REPORTER, text: "get collider [PROPERTY] of [OBJECT]", arguments: {PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "colliderProperties"}, OBJECT: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"}}},
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
            colliderTypes: {acceptReporters: false, items: [{text: "Box, Rectangle, cuboid", value: "cuboid"},{text: "Sphere, ball", value: "ball"},{text: "Custom, complex simple shapes, convexHull", value: "convexHull"},{text:"Precision, TriMesh",value:"trimesh"}]},
            forces: {acceptReporters: false, items: [{text: "Force", value: "addForce"},{text: "Torque (rotation)", value: "addTorque"},{text: "Apply Impulse", value: "applyImpulse"},{text: "Apply Torque Impulse (rotation)", value: "applyTorqueImpulse"},{text: "Linear Velocity", value: "setLinvel"},{text: "Angular Velocity", value: "setAngvel"},]},
            resetF: {acceptReporters: false, items: [{text:"Forces", value: "resetForces"},{text:"Torques", value: "resetTorques"},]}
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
        const objectA = _Extra3D_.getObject(args.ObjA)
        let object = _Extra3D_.getObject(args.ObjB)
        this.joint(data, objectA, object)
        }

        sphericalJoint(args) {
        const VA = JSON.parse(args.VA).map(Number)
        const VB = JSON.parse(args.VB).map(Number)

        const data = RAPIER.JointData.spherical(
            { x: VA[0], y: VA[1], z: VA[2] },
            { x: VB[0], y: VB[1], z: VB[2] }
        )
        const objectA = _Extra3D_.getObject(args.ObjA)
        let object = _Extra3D_.getObject(args.ObjB)
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
        const objectA = _Extra3D_.getObject(args.ObjA)
        let object = _Extra3D_.getObject(args.ObjB)
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
        const objectA = _Extra3D_.getObject(args.ObjA)
        let object = _Extra3D_.getObject(args.ObjB)
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
        let object = _Extra3D_.getObject(args.OBJECT)
        object.rigidBody[args.PROPERTY](value)
        }
        setC(args) {
        let value = args.VALUE
        if (args.VALUE === "true" || args.VALUE === "false") value = !!args.VALUE
        let object = _Extra3D_.getObject(args.OBJECT)
        object.collider[args.PROPERTY](value)
        }

        getRB(args) {
        let object = _Extra3D_.getObject(args.OBJECT)
        return JSON.stringify(object.rigidBody[args.PROPERTY]())
        }
        getC(args) {
        let object = _Extra3D_.getObject(args.OBJECT)
        return JSON.stringify(object.collider[args.PROPERTY]())
        }

        lockObjectAxis(args) {
        let object = _Extra3D_.getObject(args.OBJECT)
        const x =  !JSON.parse(args.X)
        const y = !JSON.parse(args.Y)
        const z = !JSON.parse(args.Z)
        object.rigidBody[args.PROPERTY](x,y,z,true) //changes is xyz, wake up
        }

        objectPhysics(args) {
        let object = _Extra3D_.getObject(args.OBJECT)
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
            case "cuboid": colliderDesc = createCuboidCollider(object,); break
            case "ball": colliderDesc = createBallCollider(object); break
            case "convexHull": colliderDesc = createConvexHullCollider(object); break
            case "trimesh": colliderDesc = TriMesh(object); break
        }
        colliderDesc.setSensor(JSON.parse(args.state2)).setMass(args.mass).setDensity(args.density).setFriction(args.friction)

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
        let object = _Extra3D_.getObject(args.OBJECT)
        if (object.physics) {
            let rigidBody = object.rigidBody
            rigidBody.enableCcd(JSON.parse(args.state))
        }
        }

        addForce(args) {
        let object = _Extra3D_.getObject(args.OBJECT)
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
        const sensor = _Extra3D_.getObject(args.SENSOR)

        let object = _Extra3D_.getObject(args.OBJECT)

        let touching = false
        physicsWorld.intersectionPairsWith(sensor.collider, otherCollider => {
        if (otherCollider === object.collider) touching = true
        })

        return touching
        }

        sensorAll(args) {
        const sensor = _Extra3D_.getObject(args.SENSOR)

        const touchedObjects = []

        // loop thruogh every collider touching sensor
        physicsWorld.intersectionPairsWith(sensor.collider, otherCollider => {
        // find owner of collider
        const otherObject = _Extra3D_.SCENE.children.find(o => o.collider === otherCollider)
        console.log(otherCollider)
        if (otherObject) touchedObjects.push(otherObject.name)
        })

        return JSON.stringify(touchedObjects)
        }

    }

    Scratch.extensions.register(new ThreeGLB())
    Scratch.extensions.register(new ThreeAddons())
    Scratch.extensions.register(new RapierPhysics())

  })

})(Scratch);