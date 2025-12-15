/* jshint esversion: 11 */
// Name: Extra 3D
// ID: threejsExtension
// Description: Use three js inside Turbowarp! A 3D graphics library.
// By: Civero <https://scratch.mit.edu/users/civero/> <https://civero.itch.io> <https://civ3ro.github.io/extensions>
// License: MIT License Copyright (c) 2021-2024 TurboWarp Extensions Contributors

(function(Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("Three-D extension must run unsandboxed");
  }

  if (Scratch.vm.runtime.isPackaged) {
    alert(`Uncheck the setting "Remove raw asset data after loading to save RAM" for package!`);
    return;
  }
  //if (Scratch.vm.extensionManager._loadedExtensions.has("threejsExtension") && typeof scaffolding == "undefined") return

  const vm = Scratch.vm;
  const runtime = vm.runtime;
  const renderer = Scratch.renderer;
  const canvas = renderer.canvas;
  const Cast = Scratch.Cast;
  const menuIconURI =
    "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwLDAsMTc3LjIzLDE4MC40NzU3MSIgaGVpZ2h0PSIxODAuNDc1NzEiIHdpZHRoPSIxNzcuMjMiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE2Ni4zODUsLTEwMS45OTQyOSkiPjxnIHN0cm9rZS1taXRlcmxpbWl0PSIxMCI+PHBhdGggc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2U9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgZmlsbD0iI2ZmZmZmZiIgZD0iTTMxMS4wMjY0NCwxMzYuMzI5ODRjLTAuMDgxMzYsMC4zNDU3OCAtMC4xNDIzOCwwLjY5MTU2IC0wLjI0NDA4LDEuMDM3MzRjLTAuMzA1MSwxLjI4MTQyIC0wLjkzNTY0LDQuMzEyMDggLTEuNTY2MTgsMTAuMjMxMDJjMCwwLjEwMTcgMCwwLjE4MzA2IC0wLjAyMDM0LDAuMjQ0MDhjMy40NzgxNCwxMy45OTM5MyAtMi4zNzk3OCwyMi41MTY0IC02LjI2NDcyLDI2LjQwMTM0Yy0wLjI0NDA4LDAuMjY0NDIgLTAuNTA4NSwwLjUwODUxIC0wLjc5MzI2LDAuNzUyNTljLTMuODAzNTgsMy40NTc4MSAtMTAuNDU0NzcsNy41ODY4MyAtMjAuMzgwNyw3LjU4NjgzYy00Ljk0MjYzLDAgLTkuNTU5OCwtMS4wOTgzNyAtMTMuNTg3MTMsLTMuMTEyMDNjMC4xMDE3LDUuNTUyODMgMC4xNjI3MiwxMy4yMDA2NyAwLjE2MjcyLDIzLjgxODE2YzMuNjYxMiwxLjI4MTQyIDcuMDE3MzEsMy4zNTYxMSA5Ljg2NDkxLDYuMDgxNjdjNS42NTQ1Miw1LjQzMDc5IDguNzQ2MiwxMi42OTIxNyA4Ljc0NjIsMjAuNDQxNzFjMCwxMS41MTI0NSAtNi42MzA4NCwyMS41MTk3MyAtMTcuMzA5MzUsMjYuMDk2MjRjLTAuMjY0NDIsMC4xMjIwNCAtMC41NDkxOSwwLjI0NDA4IC0wLjgxMzYsMC4zNDU3OGMtMy41Nzk4NCwxLjM2Mjc4IC03LjYwNzE2LDIuMDM0IC0xMi4zMjYwNSwyLjAzNGMtMS43MDg1NiwwIC0zLjUzOTE2LC0wLjA4MTM2IC01LjUzMjQ4LC0wLjI2NDQyYy0xLjIyMDQsLTAuMDYxMDIgLTMuMDEwMzIsLTAuMDQwNjggLTUuMTI1NjksMC4wMjAzNGMtMy44NDQyNywwLjQyNzE0IC05LjI1NDcxLDAuODU0MjggLTE2LjQ5NTc2LDEuMjYxMDhjLTAuMTQyMzgsMCAtMC4yODQ3NiwwLjAyMDM0IC0wLjQ0NzQ4LDAuMDIwMzRjLTAuOTU1OTgsMC4wNDA2OCAtMS44NzEyOCwwLjA2MTAyIC0yLjc2NjI0LDAuMDYxMDJjLTEyLjk1NjU5LDAgLTIyLjQxNDY5LC00LjEwODY5IC0yOC4xMzAyNCwtMTIuMTgzNjdjLTAuMTIyMDQsLTAuMTYyNzIgLTAuMjIzNzQsLTAuMzI1NDQgLTAuMzI1NDQsLTAuNDg4MTZjLTUuODE3MjQsLTguNjg1MTggLTUuOTc5OTYsLTE5LjY2ODc5IC0wLjQ0NzQ4LC0yOC42Mzg3NGMwLjA0MDY4LC0wLjEwMTcgMC4xMDE3LC0wLjE4MzA2IDAuMTYyNzIsLTAuMjg0NzZjMy41MTg4MiwtNS41MzI0OSA4LjY2NDg0LC05LjQ3ODQ1IDE1LjMzNjM3LC0xMS43OTcyMWMwLjA4MTM2LC0zLjkyNTYyIDAuMDYxMDIsLTguODQ3OSAtMC4wNjEwMiwtMTQuNjg1NDljLTMuMzE1NDMsMS4zODMxMiAtNy4xMzkzNCwyLjE5NjcyIC0xMS40MzEwOSwyLjE5NjcyYy0xMS4zMjkzOSwwIC0yMC42ODU4LC02LjczMjU0IC0yMy45NDAyLC0xNi45NjM1N2MtMC42NzEyMiwtMi4wNzQ2OCAtMS4zMDE3NiwtNS4xMDUzNCAtMi43NjYyNCwtMTEuOTM5NTljLTAuMDYxMDIsLTAuMjQ0MDggLTAuMTAxNywtMC40ODgxNiAtMC4xNDIzOCwtMC43MzIyNGwtMy4wMTAzMiwtMTYuODIxMTljLTAuMTAxNywtMC4zNjYxMiAtMC4yNDQwOCwtMC43OTMyNiAtMC40MDY4LC0xLjI4MTQyYy0xLjU2NjE4LC00LjQ1NDQ2IC0yLjI5ODQzLC04LjIzNzcxIC0yLjI5ODQzLC0xMS44OTg5MWMwLC00LjUzNTgyIDEuMzIyMSwtMTEuMzkwNCA3LjU4NjgzLC0xOC4yMjQ2NWMzLjE1MjcsLTMuNDU3OCA4Ljg4ODU5LC03LjkzMjYxIDE4LjEyMjk1LC05LjM3Njc1YzEuMTM5MDQsLTAuMTgzMDYgMi4yOTg0MywtMC4yODQ3NiAzLjQ1NzgxLC0wLjI4NDc2aDIyLjQ5NjA2YzAuNTA4NSwwIDEuMDE3LDAuMDIwMzQgMS41MjU1LDAuMDYxMDJjOC41ODM0OCwwLjMwNTEgMTYuMjcyMDEsMC4yODQ3NiAyMi44NjIxOCwtMC4wMjAzNGM5LjIxNDAyLC0wLjQwNjggMTguNDA3NzEsLTEuMjAwMDYgMjcuNDE4MzQsLTIuMzU5NDRjMS4wMTcsLTAuMzI1NDQgMi4xMTUzNiwtMC42NTA4OCAzLjI5NTA4LC0wLjkzNTY0YzEuMTE4NywtMC4yODQ3NiAyLjI1Nzc1LC0wLjQ2NzgyIDMuMzk2NzksLTAuNTg5ODZjOC42NjQ4NSwtMC43OTMyNiAxNi43Mzk4MywxLjcwODU2IDIzLjAyNDksNy4wNzgzMmM3Ljc5MDIzLDYuNjkxODYgMTEuMjI3NjksMTYuODIxMTkgOS4xNzMzNSwyNy4xMTMyNHoiPjwvcGF0aD48cGF0aCBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZT0iI2ZmZmZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjMjIyMjIyIiBkPSJNMjExLjU5OCwyODAuNDdsLTQzLjIxMywtMTc0Ljk0bDE3My4yMyw0OS44NzR6Ij48L3BhdGg+PHBhdGggc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2U9IiNmZmZmZmYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbD0iIzIyMjIyMiIgZD0iTTI1NC45NjgsMTMwLjQ3MmwyMS41OTEsODcuNDk2bC04Ni41NjcsLTI0Ljk0NXoiPjwvcGF0aD48cGF0aCBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZT0iI2ZmZmZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjMjIyMjIyIiBkPSJNMjMzLjQ4OCwyMDQuODlsLTEwLjcyNCwtNDMuNDY1bDQzLjAwOCwxMi4zNDZ6Ij48L3BhdGg+PHBhdGggc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2U9IiNmZmZmZmYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbD0iIzIyMjIyMiIgZD0iTTIxMi4wMzYsMTE4LjAxM2wxMC43MjQsNDMuNDY1bC00My4wMDgsLTEyLjM0NnoiPjwvcGF0aD48cGF0aCBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZT0iI2ZmZmZmZiIgZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjMjIyMjIyIiBkPSJNMjk4LjA0OCwxNDIuNzlsMTAuNzI0LDQzLjQ2NWwtNDMuMDA4LC0xMi4zNDZ6Ij48L3BhdGg+PHBhdGggc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2U9IiNmZmZmZmYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbD0iIzIyMjIyMiIgZD0iTTIzMy40OTMsMjA0LjkybDEwLjcyNCw0My40NjVsLTQzLjAwOCwtMTIuMzQ2eiI+PC9wYXRoPjxwYXRoIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS13aWR0aD0iNSIgc3Ryb2tlPSIjMmRmZmIyIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGZpbGw9IiNmN2Y3ZjciIGQ9Ik0yODkuMDgzNjMsMTMxLjk0NDUzYy0wLjgzMzk0LDMuMzQxODcgLTEuNTQ5OTEsNy44NzE1OCAtMi4xNDU4NywxMy41OTczYy0wLjI0MjA1LDIuODYzODggLTAuMTI0MDcsNS4xODg3NCAwLjM1Nzk5LDYuOTc4NjZjMC44Mjk4OCwyLjk4Mzg4IDAuNzc0OTUsNC45NTI3OSAtMC4xNzksNS45MDQ3Yy0xLjMxMzk2LDEuMTkxOTIgLTMuMTAxODUsMS43ODc4OSAtNS4zNjc3MywxLjc4Nzg5Yy0yLjYyNTksMCAtNC4zNTg4NiwtMC43NzkwMiAtNS4xODg3NCwtMi4zNDExM2MtMC4xMjQwOCwtNC44MDQzMSAtMC4wNjMwNiwtOS4zMTE2NiAwLjE3ODk5LC0xMy41MTc5OGMwLjIzMzkxLC01LjE2NjM3IDAuMzU3OTksLTcuODY5NTUgMC4zNTc5OSwtOC4xMDk1N2MtMC4xMjQwOCwwIC0wLjMwMTAzLC0wLjEyMDAxIC0wLjUzNjk4LC0wLjM2MjA1Yy0xMS4wOTU0OCwwLjQ4MjA2IC0yMS41MzE5NCwxLjE5ODAzIC0zMS4zMTE0MiwyLjE1NDAxYy0wLjI0MDAxLDEuMTk4MDMgLTAuMjQwMDEsMy4xMDc5NiAwLDUuNzM1ODhjMC40NzM5MiwzLjcwNTk1IDAuNzE1OTYsNS44NTc5MiAwLjcxNTk2LDYuNDUxODVjLTAuNDc1OTUsMy43MDU5NSAtMC43MTU5Niw5LjIwMTgyIC0wLjcxNTk2LDE2LjQ5MzcyYzAuNDczOTIsMy4xMDc5NiAwLjcxNTk2LDE2LjQzNDczIDAuNzE1OTYsMzkuOTc4M3YxMy4wODg4YzAsMi4wMzE5NyAwLjI5NDkzLDMuNDY1OTQgMC44ODY4Myw0LjMwMTkxaDEwLjk4NTY0YzIuMDA3NTYsLTAuMjM3OTggMy42MzA2OSwwLjI0MDAxIDQuODczNDcsMS40MzE5NGMxLjIzODcsMS4xOTM5NiAxLjg1OTA4LDIuNjIzODYgMS44NTkwOCw0LjI5MTc0YzAsMi42MjE4MyAtMS4yNTA5MSw0LjQ3Mjc3IC0zLjc1NjgsNS41NDg3NmMtMS41NTE5NCwwLjU5MzkzIC00LjI5Mzc3LDAuNzE1OTcgLTguMjI5NTcsMC4zNTc5OWMtMS45MDc4OSwtMC4xMjIwNCAtNC43MTI3OSwtMC4xMjIwNCAtOC40MTA2LDBjLTMuMzM5ODMsMC40MTQ5NCAtOC43MDU1MiwwLjgzMTkxIC0xNi4xMDExNSwxLjI1MDkxYy02LjQ0MTY5LDAuMjM3OTggLTEwLjM3NzQ4LC0wLjY1Njk4IC0xMS44MDk0MSwtMi42ODI4NWMtMC45NTU5OCwtMS40Mjk5IC0wLjk1NTk4LC0yLjkyMjg2IDAsLTQuNDcyNzdjMS42Njc4OCwtMi42MjE4MyA2LjAyMjY3LC0zLjkzNTggMTMuMDYyMzUsLTMuOTM1OGMyLjUwMzg1LDAgNC4wNTE3NCwtMC4yMDc0NiA0LjY0OTczLC0wLjYyNDQzYzAuNTk1OTYsLTAuNDE2OTcgMC44OTQ5NiwtMS4yMjI0NCAwLjg5NDk2LC0yLjQxNDM2YzAsLTEuMDY5ODggMCwtMi4wODA3OCAwLC0zLjAzNDczYzAsLTEuNzgzODIgMCwtNC40MDM2MiAwLC03Ljg1NTMxYzAuMzU3OTksLTYuMDY3NDIgMC4zNTc5OSwtMTUuMTE2NyAwLC0yNy4xMzk2OWMtMC40Nzc5OSwtMTcuMjU4NTEgLTAuMjQwMDEsLTMyLjQzMjE1IDAuNzE1OTcsLTQ1LjUyNzA1Yy0wLjEyLC0wLjExNzk3IC0wLjI5OSwtMC4yOTY5NyAtMC41NDEwNCwtMC41MzY5OGMtNC4zMTgxOCwwLjI0MDAxIC0xMS4yNzQ0OCwwLjEyMDAxIC0yMC44Njg4NiwtMC4zNjAwMmMtMS4wODAwNSwwIC00Ljc0MTI1LDAuMjQyMDUgLTEwLjk3NTQ3LDAuNzE4MDFjMS41NDk5MSwxMC44NTU0NyAyLjUwMzg1LDE5LjAyNjA1IDIuODYxODQsMjQuNTExNzVjMCwwLjcxNTk3IC0wLjEyLDIuMzI2OSAtMC4zNTc5OCw0LjgzMDc1Yy0wLjEyLDEuNzg3ODggLTEuNjEwOTMsMi42ODI4NSAtNC40NzI3NywyLjY4Mjg1Yy0xLjU1MTk0LDAgLTIuNDQ0ODcsLTAuNTMyOSAtMi42ODI4NSwtMS41OTY2OWMtMC4xMiwtMC4yMzM5MSAtMC44MzU5NywtMy40MzEzNiAtMi4xNDc5LC05LjU4MjE4Yy0wLjcxNTk3LC00LjAyMTIyIC0xLjczMDk0LC05LjcwMDE1IC0zLjA0MDg0LC0xNy4wMzQ3NmMwLC0wLjQ2NzgyIC0wLjQxOSwtMS45NDY1NCAtMS4yNTA5MSwtNC40MzQxMmMtMC43MTE5LC0yLjAxMTYzIC0xLjA2Nzg1LC0zLjU0OTMzIC0xLjA2Nzg1LC00LjYxMzExYzAsLTAuODI1ODEgMC41NjM0MiwtMS44NjUxOCAxLjcwMDQyLC0zLjEwMzg5YzEuMTMyOTQsLTEuMjQwNzQgMi44MzMzNiwtMi4wNDIxMyA1LjA5OTI0LC0yLjM5ODA4YzAuMzU3OTksMCAwLjkyMTQsMCAxLjcwMDQyLDBjMC43NzI5MiwwIDEuMzk5MzksMCAxLjg3NzM5LDBjMTQuMTk1MjksMCAyMC4zOTY5NiwwIDE4LjYwNzA1LDBjOS42NjE1MSwwLjM2MDAyIDE4LjI0OTA3LDAuMzYwMDIgMjUuNzYyNjcsMGMxMC43MzM0MywtMC40NzM5MiAyMS4zNDY4NSwtMS40Mjk5MSAzMS44NDYzNiwtMi44NjE4NGMwLjcxNTk3LC0wLjM1Nzk4IDEuNzg3ODgsLTAuNzE1OTcgMy4yMTc3OSwtMS4wNzE5MmMyLjYyNTksLTAuMjM3OTggNC43NzE3NywwLjM1Nzk4IDYuNDQzNzIsMS43ODk5MmMxLjY2Nzg4LDEuNDI3ODcgMi4yNjM4NCwzLjMzNzggMS43ODc4OCw1LjcyMzY4eiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjczLjYxNTAwMDAwMDAwMDAxOjc4LjAwNTcxMTMwMDg0OTk0LS0+";

  let alerts = false;
  console.log("alerts are " + (alerts ? "enabled" : "disabled"));

  let isMouseDown = {
    left: false,
    middle: false,
    right: false,
  };
  let prevMouse = {
    left: false,
    middle: false,
    right: false,
  };

  let lastWidth = 0;
  let lastHeight = 0;

  let THREE;
  let clock;
  let running;
  let loopId;
  //Addons
  let GLTFLoader;
  let gltf;
  let OrbitControls;
  let controls;
  let BufferGeometryUtils;
  let TextGeometry;
  let fontLoad;
  //Physics
  let RAPIER;
  let physicsWorld;

  let threeRenderer;
  let camera;
  let eulerOrder = "YXZ";

  let composer;
  let passes = {};
  let customEffects = [];
  let renderTargets = {};

  let materials = {};
  let geometries = {};
  let lights = {};
  let models = {};

  let assets = {
    //should i place materials, geometries; inside too?
    textures: {},
    colors: {},
    fogs: {},
    curves: {},
    renderTargets: {}, //not the same as the global one! this one only stores textures
  };

  let raycastResult = [];

  function resetor(level) {
    camera = undefined;
    if (composer) composer.reset();

    passes = {};
    customEffects = [];
    renderTargets = {};

    materials = {};
    geometries = {};
    lights = {};
    models = {};

    if (level > 0) {
      assets = {
        textures: {},
        colors: {},
        fogs: {},
        curves: {},
        renderTargets: {},
      };
    }

    updateComposers();
  }

  //utility
  function vector3ToString(prop) {
    if (!prop) return "0,0,0";

    const x =
      typeof prop.x === "number" ?
      prop.x :
      typeof prop._x === "number" ?
      prop._x :
      JSON.stringify(prop).includes("X") ?
      prop :
      0;
    const y = typeof prop.y === "number" ? prop.y : typeof prop.y === "number" ? prop._y : 0;
    const z = typeof prop.z === "number" ? prop.z : typeof prop.z === "number" ? prop.z : 0;

    return [x, y, z];
  }

  // Helper function to get current scene
  function getCurrentScene() {
    const threeScene = runtime.ext_threeScene;
    if (!threeScene) return null;
    const currentSceneName = threeScene.currentSceneName;
    return currentSceneName ? threeScene.scenes[currentSceneName] : null;
  }

  // Helper function to get scene by name
  function getSceneByName(sceneName) {
    const threeScene = runtime.ext_threeScene;
    if (!threeScene) return null;
    return threeScene.scenes[sceneName];
  }

  // Helper function to set current scene
  function setCurrentScene(sceneName) {
    const threeScene = runtime.ext_threeScene;
    if (!threeScene) return;
    threeScene.currentSceneName = sceneName;
  }

  //objects
  function createObject(name, content, parentName) {
    const scene = getCurrentScene();
    if (!scene) {
      alerts ? alert("No active scene! Create a scene first!") : null;
      return;
    }
    
    let object = getObject(name, true);
    if (object) {
      removeObject(name);
      alerts ? alert(name + " already exsisted, will replace!") : null;
    }
    content.name = name;
    content.rotation._order = eulerOrder;
    
    let parentObject;
    if (parentName === scene.name) {
      parentObject = scene;
    } else {
      parentObject = getObject(parentName);
      if (!parentObject) {
        parentObject = scene;
      }
    }
    
    content.physics = false;
    parentObject.add(content);
  }

  function removeObject(name) {
    const scene = getCurrentScene();
    if (!scene) return;

    let object = getObject(name);
    if (!object) return;

    scene.remove(object);

    if (object.rigidBody) {
      physicsWorld.removeCollider(object.collider, true);
      physicsWorld.removeRigidBody(object.rigidBody, true);
      object.rigidBody = null;
      object.collider = null;
    }
    if (object.isLight) {
      delete lights[name];
    }
  }

  function getObject(name, isNew) {
    const scene = getCurrentScene();
    if (!scene) {
      alerts ? alert("Can not get " + name + ". Create a scene first!") : null;
      return null;
    }
    
    let object = scene.getObjectByName(name);
    if (!object && !isNew) {
      alerts ? alert(name + " does not exist! Add it to scene") : null;
      return null;
    }
    return object;
  }

  //materials
  function encodeCostume(name) {
    if (name.startsWith("data:image/")) return name;
    const editingTarget = vm.editingTarget;
    if (!editingTarget) return null;
    const costume = editingTarget.sprite.costumes.find((c) => c.name === name);
    return costume ? costume.asset.encodeDataURI() : null;
  }

  function setTexutre(texture, mode, style, x, y) {
    texture.colorSpace = THREE.SRGBColorSpace;

    if (mode === "Pixelate") {
      texture.minFilter = THREE.NearestFilter;
      texture.magFilter = THREE.NearestFilter;
    } else {
      //Blur
      texture.minFilter = THREE.NearestMipmapLinearFilter;
      texture.magFilter = THREE.NearestMipmapLinearFilter;
    }

    if (style === "Repeat") {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(x, y);
    }

    texture.generateMipmaps = true;
  }
  async function resizeImageToSquare(uri, size = 256) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        // clear + draw image scaled to fit canvas
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);

        resolve(canvas.toDataURL()); // return normalized Data URI
        //delete canvas?
      };
      img.src = uri;
    });
  }
  //light
  function updateShadowFrustum(light, focusPos) {
    if (light.type !== "DirectionalLight") return;

    // Frustum Size - Increase this value to cover a larger area.
    const d = 50;

    // Update Orthographic Shadow Camera Frustum
    const shadowCamera = light.shadow.camera;

    // Set the width/height of the frustum
    shadowCamera.left = -d;
    shadowCamera.right = d;
    shadowCamera.top = d;
    shadowCamera.bottom = -d;

    // Determine ranges
    shadowCamera.near = 0.1;
    shadowCamera.far = 500;

    // Position the Light and its Target
    light.target.position.copy(focusPos);
    const direction = light.position.clone().sub(light.target.position).normalize();
    light.position.copy(focusPos.clone().add(direction.multiplyScalar(100)));

    // Ensure matrices are updated.
    light.target.updateMatrixWorld();
    light.shadow.camera.updateProjectionMatrix();
    light.shadow.needsUpdate = true;
  }
  //composer
  function updateComposers() {
    const scene = getCurrentScene();
    if (!camera || !scene) return; // nothing to do yet

    // always recreate the RenderPass to point to the current scene/camera
    passes["Render"] = new RenderPass(scene, camera);

    // ensure composer has a RenderPass as the first pass
    const hasRender = composer.passes.some((p) => p && p.scene);
    if (!hasRender) composer.addPass(passes["Render"]);
    else {
      // if composer already has one, replace it so it references current scene/camera
      const idx = composer.passes.findIndex((p) => p && p.scene);
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
    const {
      width,
      height
    } = canvas;
    if (width !== lastWidth || height !== lastHeight) {
      lastWidth = width;
      lastHeight = height;
      resize();
    }
    requestAnimationFrame(checkCanvasSize); //rerun next frame
  }
  //physics
  function computeWorldBoundingBox(mesh) {
    // Create a Box3 in world coordinates
    const box = new THREE.Box3().setFromObject(mesh);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    return {
      size,
      center,
    };
  }

  function createCuboidCollider(mesh) {
    const {
      size
    } = computeWorldBoundingBox(mesh);
    const collider = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2);
    return collider;
  }

  function createBallCollider(mesh) {
    const {
      size
    } = computeWorldBoundingBox(mesh);
    // radius = 1/2 of the largest verticie
    const radius = Math.max(size.x, size.y, size.z) / 2;
    const collider = RAPIER.ColliderDesc.ball(radius);
    return collider; //there's a flaw with this, if the ball is deformed in just one axis it will be inaccurate. use convex instead (?)
  }

  function createConvexHullCollider(mesh) {
    mesh.updateWorldMatrix(true, false);

    const position = mesh.geometry.attributes.position;
    const vertices = [];
    const vertex = new THREE.Vector3();

    // Matrix for scale only
    const scaleMatrix = new THREE.Matrix4().makeScale(mesh.scale.x, mesh.scale.y, mesh.scale.z);

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
    const indices = Array.from({
        length: numVertices,
      },
      (_, i) => i
    );

    const collider = RAPIER.ColliderDesc.trimesh(positions, new Uint32Array(indices));

    return collider;
  }

  function getModel(model, name) {
    const file = runtime
      .getTargetForStage()
      .getSounds()
      .find((c) => c.name === model);
    if (!file) return;

    return new Promise((resolve, reject) => {
      gltf.parse(
        file.asset.data.buffer,
        "",
        (gltf) => {
          const root = gltf.scene;
          root.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          const mixer = new THREE.AnimationMixer(root);
          const actions = {};
          gltf.animations.forEach((clip) => {
            const act = mixer.clipAction(clip);
            act.clampWhenFinished = true;
            actions[clip.name] = act;
          });

          models[name] = {
            root,
            mixer,
            actions,
          };
          resolve(root);
        },
        (error) => {
          console.error("Error parsing GLB model:", error);
          reject(error);
        }
      );
    });
  }
  async function openFileExplorer(format) {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = format;
      input.multiple = false;
      input.onchange = () => {
        resolve(input.files);
        input.remove();
      };
      input.click();
    });
  }

  function getMeshesUsingTexture(scene, targetTexture) {
    const meshes = [];

    scene.traverse((object) => {
      if (object.material) {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        for (const material of materials) {
          if (material.map === targetTexture) {
            meshes.push(object);
            break;
          }
        }
      }
    });

    return meshes;
  }

  function getAsset(path) {
    if (typeof path == "string") {
      //string?
      if (path.includes("/")) {
        //has the /?
        const value = path.split("/");
        console.log(value[0], value[1]);
        return assets[value[0]][value[1]];
      }
    }

    return JSON.parse(path); //boolean or number
  }

  let mouseNDC = [0, 0];
  //loops/init
  function stopLoop() {
    if (!running) return;
    running = false;

    if (loopId) {
      cancelAnimationFrame(loopId);
      loopId = null;
      if (threeRenderer) threeRenderer.clear();
    }
  }
  async function load() {
    if (!THREE) {
      // @ts-ignore
      THREE = await import("https://esm.sh/three@0.180.0");
      //Addons
      GLTFLoader = await import("https://esm.sh/three@0.180.0/examples/jsm/loaders/GLTFLoader.js");
      OrbitControls = await import("https://esm.sh/three@0.180.0/examples/jsm/controls/OrbitControls.js");
      BufferGeometryUtils = await import("https://esm.sh/three@0.180.0/examples/jsm/utils/BufferGeometryUtils.js");
      TextGeometry = await import("https://esm.sh/three@0.158.0/examples/jsm/geometries/TextGeometry.js");
      const FontLoader = await import("https://esm.sh/three@0.158.0/examples/jsm/loaders/FontLoader.js");
      fontLoad = new FontLoader.FontLoader();

      const POSTPROCESSING = await import("https://esm.sh/postprocessing@6.37.8");
      const {
        EffectComposer,
        EffectPass,
        RenderPass,

        Effect,
        BloomEffect,
        GodRaysEffect,
        DotScreenEffect,
        DepthOfFieldEffect,

        BlendFunction,
      } = POSTPROCESSING;
      //so i can use them later as global
      window.EffectComposer = EffectComposer;
      window.EffectPass = EffectPass;
      window.RenderPass = RenderPass;
      window.Effect = Effect;
      window.BloomEffect = BloomEffect;
      window.GodRaysEffect = GodRaysEffect;
      window.DotScreenEffect = DotScreenEffect;
      window.DepthOfFieldEffect = DepthOfFieldEffect;
      window.BlendFunction = BlendFunction;

      RAPIER = await import("https://esm.sh/@dimforge/rapier3d-compat@0.19.0");
      await RAPIER.init();

      threeRenderer = new THREE.WebGLRenderer({
        powerPreference: "high-performance",
        antialias: false,
        stencil: false,
        depth: true,
      });
      threeRenderer.setPixelRatio(window.devicePixelRatio);
      threeRenderer.outputColorSpace = THREE.SRGBColorSpace; // correct colors
      threeRenderer.toneMapping = THREE.ACESFilmicToneMapping; // HDR look (test)
      //threeRenderer.toneMappingExposure = 1.0 //(test)

      threeRenderer.shadowMap.enabled = true;
      threeRenderer.shadowMap.type = THREE.PCFSoftShadowMap; // (optional)
      threeRenderer.domElement.style.pointerEvents = "auto"; //will disable turbowarp mouse events, but enable threejs's

      gltf = new GLTFLoader.GLTFLoader();
      clock = new THREE.Clock();

      // Example: create a composer
      composer = new EffectComposer(threeRenderer, {
        frameBufferType: THREE.HalfFloatType,
      });

      renderer.addOverlay(threeRenderer.domElement, "manual");
      renderer.addOverlay(canvas, "manual");
      renderer.setBackgroundColor(1, 1, 1, 0);

      resize();

      window.addEventListener("mousedown", (e) => {
        if (e.button === 0) isMouseDown.left = true;
        if (e.button === 1) isMouseDown.middle = true;
        if (e.button === 2) isMouseDown.right = true;
      });
      window.addEventListener("mouseup", (e) => {
        if (e.button === 0) isMouseDown.left = false;
        prevMouse.left = false;
        if (e.button === 1) isMouseDown.middle = false;
        prevMouse.middle = false;
        if (e.button === 2) isMouseDown.right = false;
        prevMouse.right = false;
      });
      // prevent contextmenu on right click
      threeRenderer.domElement.addEventListener("contextmenu", (e) => e.preventDefault());

      threeRenderer.domElement.addEventListener("mousemove", (event) => {
        mouseNDC = getMouseNDC(event);
      });

      running = false;
      load();

      startRenderLoop();
      runtime.on("PROJECT_START", () => startRenderLoop());
      runtime.on("PROJECT_STOP_ALL", () => stopLoop());
      runtime.on("STAGE_SIZE_CHANGED", () => {
        requestAnimationFrame(() => resize());
      });
      //if (!runtime.isPackaged) checkCanvasSize() //only in editor
    }
  }

  function startRenderLoop() {
    if (running) return;
    running = true;

    const loop = () => {
      if (!running) return;
      
      const scene = getCurrentScene();
      if (!scene) {
        loopId = requestAnimationFrame(loop);
        return;
      }
      
      //RAPIER
      if (physicsWorld) {
        physicsWorld.step();

        scene.children.forEach((obj) => {
          if (!obj.isMesh || !obj.physics) return;
          if (obj.rigidBody) {
            obj.position.copy(obj.rigidBody.translation());
            obj.quaternion.copy(obj.rigidBody.rotation());
          }
        });
      }
      if (camera) {
        if (controls) controls.update();

        const delta = clock.getDelta();
        Object.values(models).forEach((model) => {
          if (model) model.mixer.update(delta);
        });

        Object.values(lights).forEach((light) => updateShadowFrustum(light, camera.position));

        //update custom effects time
        customEffects.forEach((e) => {
          if (e.uniforms.get("time")) {
            e.uniforms.get("time").value += delta;
          }
        });
        Object.values(renderTargets).forEach((t) => {
          if (t.camera.type == "PerspectiveCamera") {
            t.camera.aspect = t.target.width / t.target.height;
            t.camera.updateProjectionMatrix();
          }
          // get meshes using the texture associated with this target
          const displayMeshes = getMeshesUsingTexture(scene, t.target.texture);

          displayMeshes.forEach((mesh) => {
            mesh.visible = false;
          });

          if (t.camera.type == "PerspectiveCamera") {
            threeRenderer.setRenderTarget(t.target);
            threeRenderer.clear(true, true, true);
            threeRenderer.render(scene, t.camera);
          } else {
            t.target.clear(threeRenderer);
            t.camera.update(threeRenderer, scene); //cubeCamera
          }

          displayMeshes.forEach((mesh) => {
            mesh.visible = true;
          });
        });

        camera.aspect = threeRenderer.domElement.width / threeRenderer.domElement.height;
        camera.updateProjectionMatrix();
        threeRenderer.setRenderTarget(null);
        composer.render(delta);
      }

      loopId = requestAnimationFrame(loop);
    };

    loopId = requestAnimationFrame(loop);
  }

  function resize() {
    const w = canvas.width;
    const h = canvas.height;

    threeRenderer.setSize(w, h);
    if (composer) composer.setSize(w, h);
    customEffects.forEach((e) => {
      if (e.uniforms.get("resolution")) {
        e.uniforms.get("resolution").value.set(w, h);
      }
    });

    if (camera) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
  }
  //wait until all packages are loaded
  Promise.resolve(load()).then(() => {
    class threejsExtension {
      getInfo() {
        return {
          id: "threejsExtension",
          name: "Extra 3D",
          color1: "#222222",
          color2: "#222222",
          color3: "#11cc99",
          menuIconURI,
          blockIconURI: menuIconURI,

          blocks: [{
              blockType: Scratch.BlockType.BUTTON,
              text: "Show Docs",
              func: "openDocs",
            },
            {
              blockType: Scratch.BlockType.BUTTON,
              text: "Toggle Alerts",
              func: "alerts",
            },
          ],
          menus: {},
        };
      }
      openDocs() {
        open("https://civ3ro.github.io/extensions/Documentation/");
      }
      alerts() {
        alerts = !alerts;
        alerts ? alert("Alerts have been enabled!") : alert("Alerts have been disabled!");
      }
    }
    Scratch.extensions.register(new threejsExtension());

    class ThreeRenderer {
      getInfo() {
        return {
          id: "threeRenderer",
          name: "Three Renderer",
          color1: "#8a8a8aff",
          color2: "#222222",
          color3: "#222222",

          blocks: [{
              opcode: "setRendererRatio",
              blockType: Scratch.BlockType.COMMAND,
              text: "set Pixel Ratio to [VALUE]",
              arguments: {
                VALUE: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: "1",
                },
              },
            },
            {
              opcode: "eulerOrder",
              blockType: Scratch.BlockType.COMMAND,
              text: "set euler order to [VALUE]",
              arguments: {
                VALUE: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "YXZ",
                },
              },
            },
          ],
          menus: {},
        };
      }

      setRendererRatio(args) {
        threeRenderer.setPixelRatio(window.devicePixelRatio * args.VALUE);
      }
      eulerOrder(args) {
        eulerOrder = args.VALUE;
        console.log("euler order set to", eulerOrder);
      }
    }
    Scratch.extensions.register(new ThreeRenderer());

    class ThreeScene {
      constructor() {
        // expose threejs and the scenes, so other extensions and javascript can do stuff manually
        this.THREE = THREE;
        this.scenes = {};
        this.currentSceneName = null;
      }

      getInfo() {
        return {
          id: "threeScene",
          name: "Three Scene",
          color1: "#4638c5ff",
          color2: "#222222",
          color3: "#222222",

          blocks: [{
              opcode: "newScene",
              blockType: Scratch.BlockType.COMMAND,
              text: "new Scene [NAME]",
              arguments: {
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "scene",
                },
              },
            },

            {
              opcode: "setSceneProperty",
              blockType: Scratch.BlockType.COMMAND,
              text: "set Scene [PROPERTY] to [VALUE]",
              arguments: {
                PROPERTY: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "sceneProperties",
                  defaultValue: "background",
                },
                VALUE: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "new Color()",
                  exemptFromNormalization: true,
                },
              },
            },
            "---",
            {
              opcode: "getSceneObjects",
              blockType: Scratch.BlockType.REPORTER,
              text: "get Scene [THING]",
              arguments: {
                THING: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "sceneThings",
                },
              },
            },
            {
              opcode: "reset",
              blockType: Scratch.BlockType.COMMAND,
              text: "Reset Everything",
            },
          ],
          menus: {
            sceneProperties: {
              acceptReporters: false,
              items: [{
                  text: "Background",
                  value: "background",
                },
                {
                  text: "Background Blurriness",
                  value: "backgroundBlurriness",
                },
                {
                  text: "Background Intensity",
                  value: "backgroundIntensity",
                },
                {
                  text: "Background Rotation",
                  value: "backgroundRotation",
                },
                {
                  text: "Environment",
                  value: "environment",
                },
                {
                  text: "Environment Intensity",
                  value: "environmentIntensity",
                },
                {
                  text: "Environment Rotation",
                  value: "environmentRotation",
                },
                {
                  text: "Fog",
                  value: "fog",
                },
              ],
            },
            sceneThings: {
              acceptReporters: false,
              items: ["Objects", "Materials", "Geometries", "Lights", "Scene Properties", "Other assets"],
            },
          },
        };
      }

      newScene(args) {
        const scene = new THREE.Scene();
        const sceneName = Scratch.Cast.toString(args.NAME);
        scene.name = sceneName;
        scene.background = new THREE.Color("#222");
      
        this.scenes[sceneName] = scene;
        this.currentSceneName = sceneName; // Set as current scene
      
        resetor(0);
      }

      reset() {
        resetor(1);
        this.scenes = {};
        this.currentSceneName = null;
      }

      async setSceneProperty(args) {
        const scene = getCurrentScene();
        if (!scene) {
          alerts ? alert("No active scene! Create a scene first!") : null;
          return;
        }
        
        const property = args.PROPERTY;
        const value = getAsset(args.VALUE);

        scene[property] = value;
      }
      
      getSceneObjects(args) {
        const scene = getCurrentScene();
        if (!scene) {
          alerts ? alert("No active scene! Create a scene first!") : null;
          return "[]";
        }
        
        const names = [];
        if (args.THING === "Objects") {
          scene.traverse((obj) => {
            if (obj.name) names.push(obj.name); //if it has a name, add to list!
          });
        } else if (args.THING === "Materials") return JSON.stringify(Object.keys(materials));
        else if (args.THING === "Geometries") return JSON.stringify(Object.keys(geometries));
        else if (args.THING === "Lights") return JSON.stringify(Object.keys(lights));
        else if (args.THING === "Scene Properties") {
          console.log(scene);
          return "check console";
        } else if (args.THING === "Other assets") return JSON.stringify(assets);

        return JSON.stringify(names); // if objects
      }
    }
    Scratch.extensions.register(new ThreeScene());

    class ThreeCameras {
      getInfo() {
        return {
          id: "threeCameras",
          name: "Three Cameras",
          color1: "#38c59bff",
          color2: "#222222",
          color3: "#222222",

          blocks: [{
              opcode: "addCamera",
              blockType: Scratch.BlockType.COMMAND,
              text: "add camera [TYPE] [CAMERA] to [GROUP]",
              arguments: {
                GROUP: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "scene",
                },
                CAMERA: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myCamera",
                },
                TYPE: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "cameraTypes",
                },
              },
            },
            {
              opcode: "setCamera",
              blockType: Scratch.BlockType.COMMAND,
              text: "set camera [PROPERTY] of [CAMERA] to [VALUE]",
              arguments: {
                CAMERA: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myCamera",
                },
                PROPERTY: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "cameraProperties",
                },
                VALUE: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "0.1",
                  exemptFromNormalization: true,
                },
              },
            },
            {
              opcode: "getCamera",
              blockType: Scratch.BlockType.REPORTER,
              text: "get camera [PROPERTY] of [CAMERA]",
              arguments: {
                CAMERA: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myCamera",
                },
                PROPERTY: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "cameraProperties",
                },
              },
            },
            "---",
            {
              opcode: "renderSceneCamera",
              blockType: Scratch.BlockType.COMMAND,
              text: "set rendering camera to [CAMERA]",
              arguments: {
                CAMERA: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myCamera",
                },
              },
            },
            "---",
            {
              opcode: "cubeCamera",
              blockType: Scratch.BlockType.COMMAND,
              text: "add cube camera [CAMERA] to [GROUP] with RenderTarget [RT]",
              arguments: {
                CAMERA: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "cubeCamera",
                },
                GROUP: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "scene",
                },
                RT: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myTarget",
                },
              },
            },
            "---",
            {
              opcode: "renderTarget",
              blockType: Scratch.BlockType.COMMAND,
              text: "set a RenderTarget: [RT] for camera [CAMERA]",
              arguments: {
                CAMERA: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myCamera",
                },
                RT: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myTarget",
                },
              },
            },
            {
              opcode: "sizeTarget",
              blockType: Scratch.BlockType.COMMAND,
              text: "set RenderTarget [RT] size to [W] [H]",
              arguments: {
                RT: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myTarget",
                },
                W: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: 480,
                },
                H: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: 360,
                },
              },
            },
            {
              opcode: "getTarget",
              blockType: Scratch.BlockType.REPORTER,
              text: "get RenderTarget: [RT] texture",
              arguments: {
                RT: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myTarget",
                },
              },
            },
            {
              opcode: "removeTarget",
              blockType: Scratch.BlockType.COMMAND,
              text: "remove RenderTarget: [RT]",
              arguments: {
                RT: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myTarget",
                },
              },
            },
          ],
          menus: {
            cameraTypes: {
              acceptReporters: false,
              items: [{
                text: "Perspective",
                value: "PerspectiveCamera",
              }, ],
            },
            cameraProperties: {
              acceptReporters: false,
              items: [{
                  text: "Near",
                  value: "near",
                },
                {
                  text: "Far",
                  value: "far",
                },
                {
                  text: "FOV",
                  value: "fov",
                },
                {
                  text: "Focus (nothing...)",
                  value: "focus",
                },
                {
                  text: "Zoom",
                  value: "zoom",
                },
              ],
            },
          },
        };
      }
      addCamera(args) {
        let v2 = new THREE.Vector2();
        threeRenderer.getSize(v2);
        const object = new THREE.PerspectiveCamera(90, v2.x / v2.y);
        object.position.z = 3;

        createObject(args.CAMERA, object, args.GROUP);
      }
      setCamera(args) {
        let object = getObject(args.CAMERA);
        if (!object) return;
        object[args.PROPERTY] = args.VALUE;
        object.updateProjectionMatrix();
      }
      getCamera(args) {
        let object = getObject(args.CAMERA);
        if (!object) return "null";
        const value = JSON.stringify(object[args.PROPERTY]);
        return value;
      }
      renderSceneCamera(args) {
        let object = getObject(args.CAMERA);
        if (!object) return;
        camera = object;
        //reset composer, else it does not update.
        composer.passes = [];
        passes = {};
        customEffects = [];
        updateComposers();
      }

      cubeCamera(args) {
        // Create cube render target
        const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
          generateMipmaps: true,
        });
        // Create cube camera
        const cubeCamera = new THREE.CubeCamera(0.1, 500, cubeRenderTarget);
        createObject(args.CAMERA, cubeCamera, args.GROUP);

        renderTargets[args.RT] = {
          target: cubeRenderTarget,
          camera: cubeCamera,
        };
        assets.renderTargets[cubeRenderTarget.texture.uuid] = cubeRenderTarget.texture;
      }

      renderTarget(args) {
        let object = getObject(args.CAMERA);
        if (!object) return;
        
        const renderTarget = new THREE.WebGLRenderTarget(360, 360, {
          generateMipmaps: false,
        });

        renderTargets[args.RT] = {
          target: renderTarget,
          camera: object,
        };
        assets.renderTargets[renderTarget.texture.uuid] = renderTarget.texture;
      }
      sizeTarget(args) {
        const target = renderTargets[args.RT];
        if (!target) return;
        target.target.setSize(args.W, args.H);
      }
      getTarget(args) {
        const target = renderTargets[args.RT];
        if (!target) return "null";
        const t = target.target.texture;
        console.log(t, renderTargets[args.RT]);
        return `renderTargets/${t.uuid}`;
      }
      removeTarget(args) {
        const target = renderTargets[args.RT];
        if (!target) return;
        delete assets.renderTargets[target.target.texture.uuid];
        target.target.dispose();
        delete renderTargets[args.RT];
      }
    }
    Scratch.extensions.register(new ThreeCameras());

    class ThreeObjects {
      getInfo() {
        return {
          id: "threeObjects",
          name: "Three Objects",
          color1: "#38c567ff",
          color2: "#222222",
          color3: "#222222",

          blocks: [{
              opcode: "addObject",
              blockType: Scratch.BlockType.COMMAND,
              text: "add object [OBJECT3D] [TYPE] to [GROUP]",
              arguments: {
                GROUP: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "scene",
                },
                TYPE: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "objectTypes",
                },
                OBJECT3D: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myObject",
                },
              },
            },
            {
              opcode: "cloneObject",
              blockType: Scratch.BlockType.COMMAND,
              text: "clone object [OBJECT3D] as [NAME] & add to [GROUP]",
              arguments: {
                GROUP: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "scene",
                },
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myClone",
                },
                OBJECT3D: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myObject",
                },
              },
            },
            "---",
            {
              opcode: "setObject",
              blockType: Scratch.BlockType.COMMAND,
              text: "set [PROPERTY] of object [OBJECT3D] to [NAME]",
              arguments: {
                OBJECT3D: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myObject",
                },
                PROPERTY: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "objectProperties",
                },
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myGeometry",
                },
              },
            },
            {
              opcode: "getObject",
              blockType: Scratch.BlockType.REPORTER,
              text: "get [PROPERTY] of object [OBJECT3D]",
              arguments: {
                OBJECT3D: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myObject",
                },
                PROPERTY: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "objectProperties",
                },
              },
            },
            {
              opcode: "objectE",
              blockType: Scratch.BlockType.BOOLEAN,
              text: "is there an object [NAME]?",
              arguments: {
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myObject",
                },
              },
            },
            "---",
            {
              opcode: "removeObject",
              blockType: Scratch.BlockType.COMMAND,
              text: "remove object [OBJECT3D] from scene",
              arguments: {
                OBJECT3D: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myObject",
                },
              },
            },

            {
              blockType: Scratch.BlockType.LABEL,
              text: " ↳ Transforms",
            },
            {
              opcode: "setObjectV3",
              extensions: ["colours_motion"],
              blockType: Scratch.BlockType.COMMAND,
              text: "set transform [PROPERTY] of [OBJECT3D] to [VALUE]",
              arguments: {
                PROPERTY: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "objectVector3",
                  defaultValue: "position",
                },
                OBJECT3D: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myObject",
                },
                VALUE: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "[0,0,0]",
                },
              },
            },
            //{opcode: "changeObjectV3",extensions: ["colours_motion"], blockType: Scratch.BlockType.COMMAND, text: "change transform [PROPERTY] of [OBJECT3D] by [VALUE]", arguments: {PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "objectVector3", defaultValue: "position"}, OBJECT3D: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"}, VALUE: {type: Scratch.ArgumentType.STRING, defaultValue: "[1,1,1]"}}},
            //{opcode: "changeObjectXV3",extensions: ["colours_motion"], blockType: Scratch.BlockType.COMMAND, text: "change transform [PROPERTY] [X] of [OBJECT3D] to [VALUE]", arguments: {PROPERTY: {type: Scratch.ArgumentType.STRING, menu: "objectVector3"},X: {type: Scratch.ArgumentType.STRING, menu: "XYZ"}, OBJECT3D: {type: Scratch.ArgumentType.STRING, defaultValue: "myObject"}, VALUE: {type: Scratch.ArgumentType.STRING, defaultValue: "1"}}},
            {
              opcode: "getObjectV3",
              extensions: ["colours_motion"],
              blockType: Scratch.BlockType.REPORTER,
              text: "get [PROPERTY] of [OBJECT3D]",
              arguments: {
                PROPERTY: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "objectVector3",
                  defaultValue: "position",
                },
                OBJECT3D: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myObject",
                },
              },
            },

            {
              blockType: Scratch.BlockType.LABEL,
              text: "↳ Materials",
            },
            {
              opcode: "newMaterial",
              extensions: ["colours_looks"],
              blockType: Scratch.BlockType.COMMAND,
              text: "new material [NAME] [TYPE]",
              arguments: {
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myMaterial",
                },
                TYPE: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "materialTypes",
                  defaultValue: "MeshStandardMaterial",
                },
              },
            },
            {
              opcode: "materialE",
              extensions: ["colours_looks"],
              blockType: Scratch.BlockType.BOOLEAN,
              text: "is there a material [NAME]?",
              arguments: {
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myMaterial",
                },
              },
            },
            {
              opcode: "removeMaterial",
              extensions: ["colours_looks"],
              blockType: Scratch.BlockType.COMMAND,
              text: "remove material [NAME]",
              arguments: {
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myMaterial",
                },
              },
            },
            {
              opcode: "setMaterial",
              extensions: ["colours_looks"],
              blockType: Scratch.BlockType.COMMAND,
              text: "set material [PROPERTY] of [NAME] to [VALUE]",
              arguments: {
                PROPERTY: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "materialProperties",
                  defaultValue: "color",
                },
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myMaterial",
                },
                VALUE: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "new Color()",
                  exemptFromNormalization: true,
                },
              },
            },
            {
              opcode: "setBlending",
              extensions: ["colours_looks"],
              blockType: Scratch.BlockType.COMMAND,
              text: "set material [NAME] blending to [VALUE]",
              arguments: {
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myMaterial",
                },
                VALUE: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "blendModes",
                },
              },
            },
            {
              opcode: "setDepth",
              extensions: ["colours_looks"],
              blockType: Scratch.BlockType.COMMAND,
              text: "set material [NAME] depth to [VALUE]",
              arguments: {
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myMaterial",
                },
                VALUE: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "depthModes",
                },
              },
            },

            {
              blockType: Scratch.BlockType.LABEL,
              text: "↳ Geometries",
            },
            {
              opcode: "newGeometry",
              extensions: ["colours_data_lists"],
              blockType: Scratch.BlockType.COMMAND,
              text: "new geometry [NAME] [TYPE]",
              arguments: {
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myGeometry",
                },
                TYPE: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "geometryTypes",
                  defaultValue: "BoxGeometry",
                },
              },
            },
            {
              opcode: "geometryE",
              extensions: ["colours_data_lists"],
              blockType: Scratch.BlockType.BOOLEAN,
              text: "is there a geometry [NAME]?",
              arguments: {
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myGeometry",
                },
              },
            },
            {
              opcode: "removeGeometry",
              extensions: ["colours_data_lists"],
              blockType: Scratch.BlockType.COMMAND,
              text: "remove geometry [NAME]",
              arguments: {
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myGeometry",
                },
              },
            },
            "---",
            {
              opcode: "newGeo",
              extensions: ["colours_data_lists"],
              blockType: Scratch.BlockType.COMMAND,
              text: "new empty geometry [NAME]",
              arguments: {
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myGeometry",
                },
                POINTS: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "[points]",
                },
              },
            },
            {
              opcode: "geoPoints",
              extensions: ["colours_data_lists"],
              blockType: Scratch.BlockType.COMMAND,
              text: "set geometry [NAME] vertex points to [POINTS]",
              arguments: {
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myGeometry",
                },
                POINTS: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "[points]",
                },
              },
            },
            {
              opcode: "geoUVs",
              extensions: ["colours_data_lists"],
              blockType: Scratch.BlockType.COMMAND,
              text: "set geometry [NAME] UVs to [POINTS]",
              arguments: {
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myGeometry",
                },
                POINTS: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "[UVs]",
                },
              },
            },
            "---",
            {
              opcode: "splines",
              extensions: ["colours_data_lists"],
              blockType: Scratch.BlockType.COMMAND,
              text: "create spline [NAME] from curve [CURVE]",
              arguments: {
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "mySpline",
                },
                CURVE: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "[curve]",
                  exemptFromNormalization: true,
                },
              },
            },
            {
              opcode: "splineModel",
              extensions: ["colours_operators"],
              blockType: Scratch.BlockType.COMMAND,
              text: "create (geometry&material) spline [NAME] using model [MODEL] along curve [CURVE] with spacing [SPACING]",
              arguments: {
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "mySpline",
                },
                MODEL: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "modelsList",
                },
                CURVE: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "[curve]",
                  exemptFromNormalization: true,
                },
                SPACING: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: 1,
                },
              },
            },
            "---",
            {
              blockType: Scratch.BlockType.BUTTON,
              text: "Convert font to JSON",
              func: "openConv",
            },
            {
              blockType: Scratch.BlockType.BUTTON,
              text: "Load JSON font file",
              func: "loadFont",
            },
            {
              opcode: "text",
              extensions: ["colours_data_lists"],
              blockType: Scratch.BlockType.COMMAND,
              text: "create text geometry [NAME] with text [TEXT] in font [FONT] size [S] depth [D] curvedSegments [CS]",
              arguments: {
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myText",
                },
                TEXT: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "C-369",
                },
                FONT: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "fonts",
                },
                S: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: 1,
                },
                D: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: 0.1,
                },
                CS: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: 6,
                },
              },
            },
          ],
          menus: {
            objectVector3: {
              acceptReporters: false,
              items: [{
                  text: "Positon",
                  value: "position",
                },
                {
                  text: "Rotation",
                  value: "rotation",
                },
                {
                  text: "Scale",
                  value: "scale",
                },
                {
                  text: "Facing Direction (.up)",
                  value: "up",
                },
              ],
            },
            objectProperties: {
              acceptReporters: false,
              items: [{
                  text: "Geometry",
                  value: "geometry",
                },
                {
                  text: "Material",
                  value: "material",
                },
                {
                  text: "Visible (true/false)",
                  value: "visible",
                },
              ],
            },
            objectTypes: {
              acceptReporters: false,
              items: [{
                  text: "Mesh",
                  value: "Mesh",
                },
                {
                  text: "Sprite",
                  value: "Sprite",
                },
                {
                  text: "Points",
                  value: "Points",
                },
                {
                  text: "Line",
                  value: "Line",
                },
                {
                  text: "Group",
                  value: "Group",
                },
              ],
            },
            XYZ: {
              acceptReporters: false,
              items: [{
                  text: "X",
                  value: "x",
                },
                {
                  text: "Y",
                  value: "y",
                },
                {
                  text: "Z",
                  value: "z",
                },
              ],
            },
            materialProperties: {
              acceptReporters: false,
              items: [
                "|GENERAL| <-- not a property",
                {
                  text: "Color",
                  value: "color",
                },
                {
                  text: "Map",
                  value: "map",
                },
                {
                  text: "Opacity",
                  value: "opacity",
                },
                {
                  text: "Transparent",
                  value: "transparent",
                },
                {
                  text: "Alpha Map",
                  value: "alphaMap",
                },
                {
                  text: "Alpha Test",
                  value: "alphaTest",
                },
                {
                  text: "Depth Test",
                  value: "depthTest",
                },
                {
                  text: "Depth Write",
                  value: "depthWrite",
                },
                {
                  text: "Color Write",
                  value: "colorWrite",
                },
                {
                  text: "Side",
                  value: "side",
                },
                {
                  text: "Visible",
                  value: "visible",
                },
                /*
                  { text: "Blending", value: "blending" },
                  { text: "Blend Src", value: "blendSrc" },
                  { text: "Blend Dst", value: "blendDst" },
                  { text: "Blend Equation", value: "blendEquation" },
                  { text: "Blend Src Alpha", value: "blendSrcAlpha" },
                  { text: "Blend Dst Alpha", value: "blendDstAlpha" },
                  { text: "Blend Equation Alpha", value: "blendEquationAlpha" },*/
                {
                  text: "Blend Aplha",
                  value: "blendAplha",
                },
                {
                  text: "Blend Color",
                  value: "blendColor",
                },
                {
                  text: "Alpha Hash",
                  value: "alphaHash",
                },
                {
                  text: "Premultiplied Alpha",
                  value: "premultipliedAlpha",
                },

                {
                  text: "Tone Mapped",
                  value: "toneMapped",
                },
                {
                  text: "Fog",
                  value: "fog",
                },
                {
                  text: "Flat Shading",
                  value: "flatShading",
                },

                "|MESH Standard / Physical| <-- not a property",
                {
                  text: "Metalness",
                  value: "metalness",
                },
                {
                  text: "Metalness Map",
                  value: "metalnessMap",
                },
                {
                  text: "Roughness",
                  value: "roughness",
                },
                {
                  text: "Reflectivity",
                  value: "reflectivity",
                },
                {
                  text: "Roughness Map",
                  value: "roughnessMap",
                },
                {
                  text: "Emissive",
                  value: "emissive",
                },
                {
                  text: "Emissive Intensity",
                  value: "emissiveIntensity",
                },
                {
                  text: "Emissive Map",
                  value: "emissiveMap",
                },
                {
                  text: "Env Map",
                  value: "envMap",
                },
                {
                  text: "Env Map Intensity",
                  value: "envMapIntensity",
                },
                {
                  text: "Env Map Rotation",
                  value: "envMapRotation",
                },
                {
                  text: "Ior",
                  value: "ior",
                },
                {
                  text: "Refraction Ratio",
                  value: "refractionRatio",
                },
                {
                  text: "Clearcoat",
                  value: "clearcoat",
                },
                {
                  text: "Clearcoat Map",
                  value: "clearcoatMap",
                },
                {
                  text: "Clearcoat Roughness",
                  value: "clearcoatRoughness",
                },
                {
                  text: "Clearcoat Roughness Map",
                  value: "clearcoatRoughnessMap",
                },
                {
                  text: "Dispersion",
                  value: "dispersion",
                },
                {
                  text: "Sheen",
                  value: "sheen",
                },
                {
                  text: "Sheen Color",
                  value: "sheenColor",
                },
                {
                  text: "Sheen Color Map",
                  value: "sheenColorMap",
                },
                {
                  text: "Sheen Roughness",
                  value: "sheenRoughness",
                },
                {
                  text: "Sheen Roughness Map",
                  value: "sheenRoughnessMap",
                },
                {
                  text: "Specular Color",
                  value: "specularColor",
                },
                {
                  text: "Specular Color Map",
                  value: "specularColorMap",
                },
                {
                  text: "Specular Intensity",
                  value: "specularIntensity",
                },
                {
                  text: "Specular Intensity Map",
                  value: "specularIntensityMap",
                },
                {
                  text: "Transmission",
                  value: "transmission",
                },
                {
                  text: "Transmission Map",
                  value: "transmissionMap",
                },
                {
                  text: "Thickness",
                  value: "thickness",
                },
                {
                  text: "Thickness Map",
                  value: "thicknessMap",
                },
                {
                  text: "Anisotropy",
                  value: "anisotropy",
                },
                {
                  text: "Anisotropy Map",
                  value: "anisotropyMap",
                },
                {
                  text: "Anisotropy Rotation",
                  value: "anisotropyRotation",
                },
                {
                  text: "Attenuation Distance",
                  value: "attenuationDistance",
                },
                {
                  text: "Attenuation Color",
                  value: "attenuationColor",
                },
                {
                  text: "Thickness",
                  value: "thickness",
                },
                {
                  text: "Iridescence",
                  value: "iridescence",
                },
                {
                  text: "Iridescence Ior",
                  value: "iridescenceIOR",
                },
                {
                  text: "Iridescence Map",
                  value: "iridescenceMap",
                },
                {
                  text: "Iridescence Thickness Range",
                  value: "iridescenceThicknessRange",
                },

                "|MESH Displacement / Normal / Bump| <-- not a property",
                {
                  text: "Displacement Map",
                  value: "displacementMap",
                },
                {
                  text: "Displacement Scale",
                  value: "displacementScale",
                },
                {
                  text: "Displacement Bias",
                  value: "displacementBias",
                },
                {
                  text: "Bump Map",
                  value: "bumpMap",
                },
                {
                  text: "Bump Scale",
                  value: "bumpScale",
                },
                {
                  text: "Normal Map Type",
                  value: "normalMapType",
                },

                "|MESH Matcap / Toon / Phong / Lambert / Basic| <-- not a property",
                {
                  text: "Shininess",
                  value: "shininess",
                },

                {
                  text: "Wireframe",
                  value: "wireframe",
                },
                {
                  text: "Wireframe Linewidth",
                  value: "wireframeLinewidth",
                },
                {
                  text: "Wireframe Linecap",
                  value: "wireframeLinecap",
                },
                {
                  text: "Wireframe Linejoin",
                  value: "wireframeLinejoin",
                },

                "|POINTS| <-- not a property",
                {
                  text: "Size",
                  value: "size",
                },
                {
                  text: "Size Attenuation",
                  value: "sizeAttenuation",
                },

                "|LINES| <-- not a property",
                {
                  text: "Scale",
                  value: "scale",
                },
                {
                  text: "Dash Size",
                  value: "dashSize",
                },
                {
                  text: "Gap Size",
                  value: "gapSize",
                },

                "|SPRITES| <-- not a property",
                {
                  text: "Rotation",
                  value: "rotation",
                },
              ],
            },
            blendModes: {
              acceptReporters: false,
              items: [{
                  text: "No Blending",
                  value: "NoBlending",
                },
                {
                  text: "Normal Blending",
                  value: "NormalBlending",
                },
                {
                  text: "Additive Blending",
                  value: "AdditiveBlending",
                },
                {
                  text: "Subtractive Blending",
                  value: "SubtractiveBlending",
                },
                {
                  text: "Multiply Blending",
                  value: "MultiplyBlending",
                },
                {
                  text: "Custom Blending",
                  value: "CustomBlending",
                },
              ],
            },
            depthModes: {
              acceptReporters: false,
              items: [{
                  text: "Never Depth",
                  value: "NeverDepth",
                },
                {
                  text: "Always Depth",
                  value: "AlwaysDepth",
                },
                {
                  text: "Equal Depth",
                  value: "EqualDepth",
                },
                {
                  text: "Less Depth",
                  value: "LessDepth",
                },
                {
                  text: "Less Equal Depth",
                  value: "LessEqualDepth",
                },
                {
                  text: "Greater Equal Depth",
                  value: "GreaterEqualDepth",
                },
                {
                  text: "Greater Depth",
                  value: "GreaterDepth",
                },
                {
                  text: "Not Equal Depth",
                  value: "NotEqualDepth",
                },
              ],
            },
            materialTypes: {
              acceptReporters: false,
              items: [{
                  text: "Mesh Basic Material",
                  value: "MeshBasicMaterial",
                },
                {
                  text: "Mesh Standard Material",
                  value: "MeshStandardMaterial",
                },
                {
                  text: "Mesh Physical Material",
                  value: "MeshPhysicalMaterial",
                },
                {
                  text: "Mesh Lambert Material",
                  value: "MeshLambertMaterial",
                },
                {
                  text: "Mesh Phong Material",
                  value: "MeshPhongMaterial",
                },
                {
                  text: "Mesh Depth Material",
                  value: "MeshDepthMaterial",
                },
                {
                  text: "Mesh Normal Material",
                  value: "MeshNormalMaterial",
                },
                {
                  text: "Mesh Matcap Material",
                  value: "MeshMatcapMaterial",
                },
                {
                  text: "Mesh Toon Material",
                  value: "MeshToonMaterial",
                },
                {
                  text: "Line Basic Material",
                  value: "LineBasicMaterial",
                },
                {
                  text: "Line Dashed Material",
                  value: "LineDashedMaterial",
                },
                {
                  text: "Points Material",
                  value: "PointsMaterial",
                },
                {
                  text: "Sprite Material",
                  value: "SpriteMaterial",
                },
                {
                  text: "Shadow Material",
                  value: "ShadowMaterial",
                },
              ],
            },
            textureModes: {
              acceptReporters: false,
              items: ["Pixelate", "Blur"],
            },
            textureStyles: {
              acceptReporters: false,
              items: ["Repeat", "Clamp"],
            },
            geometryTypes: {
              acceptReporters: false,
              items: [{
                  text: "Box Geometry",
                  value: "BoxGeometry",
                },
                {
                  text: "Sphere Geometry",
                  value: "SphereGeometry",
                },
                {
                  text: "Cylinder Geometry",
                  value: "CylinderGeometry",
                },
                {
                  text: "Plane Geometry",
                  value: "PlaneGeometry",
                },
                {
                  text: "Circle Geometry",
                  value: "CircleGeometry",
                },
                {
                  text: "Torus Geometry",
                  value: "TorusGeometry",
                },
                {
                  text: "Torus Knot Geometry",
                  value: "TorusKnotGeometry",
                },
              ],
            },
            modelsList: {
              acceptReporters: false,
              items: () => {
                const stage = runtime.getTargetForStage();
                if (!stage) return ["(loading...)"];

                // @ts-ignore
                const models = Scratch.vm.runtime
                  .getTargetForStage()
                  .getSounds()
                  .filter((e) => e.name && e.name.endsWith(".glb"));
                if (models.length < 1) return [
                  ["Load a model! (GLB Loader category)"]
                ];

                // @ts-ignore
                return models.map((m) => [m.name]);
              },
            },
            fonts: {
              acceptReporters: false,
              items: () => {
                const stage = runtime.getTargetForStage();
                if (!stage) return ["(loading...)"];

                // @ts-ignore
                const models = Scratch.vm.runtime
                  .getTargetForStage()
                  .getSounds()
                  .filter((e) => e.name && e.name.endsWith(".json"));
                if (models.length < 1) return [
                  ["Load a font!"]
                ];

                // @ts-ignore
                return models.map((m) => [m.name]);
              },
            },
          },
        };
      }

      addObject(args) {
        const object = new THREE[args.TYPE]();

        object.castShadow = true;
        object.receiveShadow = true;

        createObject(args.OBJECT3D, object, args.GROUP);
      }
      cloneObject(args) {
        let object = getObject(args.OBJECT3D);
        if (!object) return;
        const clone = object.clone(true);
        clone.name;
        createObject(args.NAME, clone, args.GROUP);
      }
      setObjectV3(args) {
        let object = getObject(args.OBJECT3D);
        if (!object) return;
        
        let values = JSON.parse(args.VALUE);

        function degToRad(deg) {
          return (deg * Math.PI) / 180;
        }

        if (object.rigidBody) {
          const x = values[0];
          const y = values[1];
          const z = values[2];
          if (args.PROPERTY === "rotation") {
            const euler = new THREE.Euler(degToRad(x), degToRad(y), degToRad(z), "YXZ");
            const quaternion = new THREE.Quaternion();
            quaternion.setFromEuler(euler);

            object.rigidBody.setRotation({
              x: quaternion.x,
              y: quaternion.y,
              z: quaternion.z,
              w: quaternion.w,
            });
          } else if (args.PROPERTY === "position") {
            object.rigidBody.setTranslation({
                x: x,
                y: y,
                z: z,
              },
              true
            );
          }
          return;
        }

        if (object.isCamera == true && controls) {}

        if (args.PROPERTY === "rotation") {
          values = values.map((v) => (v * Math.PI) / 180);
          object.rotation.set(0, 0, 0);
        }
        if (object.isDirectionalLight == true) {
          object.pos = new THREE.Vector3(...values);
          console.log(true, values, object.pos);
          return;
        }
        object[args.PROPERTY].set(...values);

        if (object.type == "CubeCamera") object.updateCoordinateSystem();
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
        let object = getObject(args.OBJECT3D);
        if (!object) return "[0,0,0]";
        let values = vector3ToString(object[args.PROPERTY]);
        if (args.PROPERTY === "rotation") {
          const toDeg = Math.PI / 180;
          values = [values[0] / toDeg, values[1] / toDeg, values[2] / toDeg];
        }

        return JSON.stringify(values);
      }
      setObject(args) {
        let object = getObject(args.OBJECT3D);
        if (!object) return;
        
        let value = args.VALUE;
        if (args.PROPERTY === "material") {
          const mat = materials[args.NAME];
          if (mat) value = mat;
          else value = undefined;
        } else if (args.PROPERTY === "geometry") {
          const geo = geometries[args.NAME];
          if (geo) value = geo;
          else value = undefined;
        } else value = !!value;

        if (value == undefined) return; //invalid geo/mat
        object[args.PROPERTY] = value;
      }
      getObject(args) {
        let object = getObject(args.OBJECT3D);
        if (!object) return "null";
        let value;
        if (args.PROPERTY != "visible") value = object[args.PROPERTY].name;
        else value = object.visible;

        return value;
      }
      removeObject(args) {
        removeObject(args.OBJECT3D);
      }
      objectE(args) {
        const scene = getCurrentScene();
        if (!scene) return false;
        return scene.children.map((o) => o.name).includes(args.NAME);
      }

      //defines
      newMaterial(args) {
        if (materials[args.NAME] && alerts) alert("material already exists! will replace...");
        const mat = new THREE[args.TYPE]();
        mat.name = args.NAME;

        materials[args.NAME] = mat;
      }
      async setMaterial(args) {
        if (typeof args.VALUE == "string" && args.VALUE.at(0) == "|") return;
        const mat = materials[args.NAME];
        if (!mat) return;

        let value = args.VALUE;

        if (args.VALUE == "false") value = false;

        if (args.PROPERTY == "side") {
          value = args.VALUE == "D" ? THREE.DoubleSide : args.VALUE == "B" ? THREE.BackSide : THREE.FrontSide;
        } else if (args.PROPERTY === "normalScale") value = new THREE.Vector2(...JSON.parse(args.VALUE));
        else value = getAsset(value);

        console.log("o:", args.VALUE, typeof args.VALUE);
        console.log("r:", value, typeof value);

        mat[args.PROPERTY] = await value; //await incase its a texture
        mat.needsUpdate = true;
      }
      setBlending(args) {
        const mat = materials[args.NAME];
        if (!mat) return;
        mat.blending = THREE[args.VALUE];
        mat.premultipliedAlpha = true;
        mat.needsUpdate = true;
      }
      setDepth(args) {
        const mat = materials[args.NAME];
        if (!mat) return;
        mat.depthFunc = THREE[args.VALUE];
        mat.needsUpdate = true;
      }
      removeMaterial(args) {
        const mat = materials[args.NAME];
        if (!mat) return;
        mat.dispose();
        delete materials[args.NAME];
      }
      materialE(args) {
        return materials[args.NAME] ? true : false;
      }

      newGeometry(args) {
        if (geometries[args.NAME] && alerts) alert("geometry already exists! will replace...");
        const geo = new THREE[args.TYPE]();
        geo.name = args.NAME;

        geometries[args.NAME] = geo;
      }
      setGeometry(args) {
        const geo = geometries[args.NAME];
        if (!geo) return;
        geo[args.PROPERTY] = args.VALUE;

        geo.needsUpdate = true;
      }
      removeGeometry(args) {
        const geo = geometries[args.NAME];
        if (!geo) return;
        geo.dispose();
        delete geometries[args.NAME];
      }
      geometryE(args) {
        return geometries[args.NAME] ? true : false;
      }

      newGeo(args) {
        const geometry = new THREE.BufferGeometry();
        geometry.name = args.NAME;
        geometries[args.NAME] = geometry;
      }
      async geoPoints(args) {
        const geometry = geometries[args.NAME];
        if (!geometry) return;
        const positions = args.POINTS.split(" ")
          .map((v) => JSON.parse(v))
          .flat(); //array of v3 of each vertex of each triangle

        geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
        geometry.computeVertexNormals();

        geometry.needsUpdate = true;
      }
      geoUVs(args) {
        const geometry = geometries[args.NAME];
        if (!geometry) return;
        const UVs = args.POINTS.split(" ")
          .map((v) => JSON.parse(v))
          .flat(); //array of v2 of each UV of each triangle

        geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(UVs), 2));
        geometry.needsUpdate = true;
      }

      splines(args) {
        const geometry = new THREE.TubeGeometry(getAsset(args.CURVE));
        geometry.name = args.NAME;

        geometries[args.NAME] = geometry;
      }

      async splineModel(args) {
        const model = await getModel(args.MODEL, args.NAME);
        if (!model) return console.warn("Model not found:", args.MODEL);

        const curve = getAsset(args.CURVE);
        const spacing = parseFloat(args.SPACING) || 1;
        const curveLength = curve.getLength();
        const divisions = Math.floor(curveLength / spacing);

        const geomList = [];
        const matList = [];

        for (let i = 0; i <= divisions; i++) {
          const t = i / divisions;
          const pos = curve.getPointAt(t);
          const tangent = curve.getTangentAt(t);

          const temp = model.clone(true);
          temp.position.copy(pos);

          const up = new THREE.Vector3(0, 0, 1);
          const quat = new THREE.Quaternion().setFromUnitVectors(up, tangent.clone().normalize());
          temp.quaternion.copy(quat);

          temp.updateMatrixWorld(true);

          temp.traverse((child) => {
            if (child.isMesh && child.geometry) {
              const geom = child.geometry.clone();
              geom.applyMatrix4(child.matrixWorld);
              geomList.push(geom);
              matList.push(child.material); //.clone() ?
            }
          });
        }

        const validGeoms = geomList.filter((g) => {
          const ok = g && g.isBufferGeometry && g.attributes && g.attributes.position;
          if (!ok) console.warn("geometry skipped:", g);
          return ok;
        });

        const merged = BufferGeometryUtils.mergeGeometries(validGeoms, true);
        merged.computeBoundingBox();
        merged.computeBoundingSphere();

        merged.name = args.NAME;
        geometries[args.NAME] = merged;
        matList.name = args.NAME;
        materials[args.NAME] = matList;
      }

      async text(args) {
        const fontFile = runtime
          .getTargetForStage()
          .getSounds()
          .find((c) => c.name === args.FONT);
        if (!fontFile) return;

        const json = new TextDecoder().decode(fontFile.asset.data.buffer);
        const fontData = JSON.parse(json);

        const font = fontLoad.parse(fontData);

        const params = {
          font: font,
          size: JSON.parse(args.S),
          height: JSON.parse(args.D),
          curveSegments: JSON.parse(args.CS),
          bevelEnabled: false,
        };
        const geometry = new TextGeometry.TextGeometry(args.TEXT, params);
        geometry.computeVertexNormals();
        geometry.center(); // optional, recenters the text

        geometry.name = args.NAME;

        geometries[args.NAME] = geometry;
      }

      async loadFont() {
        openFileExplorer(".json").then((files) => {
          const file = files[0];
          const reader = new FileReader();

          reader.onload = async (e) => {
            const arrayBuffer = e.target.result;

            // From lily's assets
            // // Thank you PenguinMod for providing this code.

            const targetId = runtime.getTargetForStage().id; //util.target.id not working!
            const assetName = Cast.toString(file.name);

            const buffer = arrayBuffer;

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
              alert("Font loaded successfully!");
            } catch (e) {
              console.error(e);
              alert("Error loading font.");
            }

            // End of PenguinMod
          };

          reader.readAsArrayBuffer(file);
        });
      }
      openConv() {
        {
          open("https://gero3.github.io/facetype.js/");
        }
      }
    }
    Scratch.extensions.register(new ThreeObjects());

    class ThreeLights {
      getInfo() {
        return {
          id: "threeLights",
          name: "Three Lights",
          color1: "#c7a22aff",
          color2: "#222222",
          color3: "#222222",

          blocks: [{
              opcode: "addLight",
              blockType: Scratch.BlockType.COMMAND,
              text: "add light [NAME] type [TYPE] to [GROUP]",
              arguments: {
                GROUP: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "scene",
                },
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myLight",
                },
                TYPE: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "lightTypes",
                },
              },
            },
            {
              opcode: "setLight",
              blockType: Scratch.BlockType.COMMAND,
              text: "set light [NAME][PROPERTY] to [VALUE]",
              arguments: {
                PROPERTY: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "lightProperties",
                  defaultValue: "intensity",
                },
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myLight",
                },
                VALUE: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "1",
                  exemptFromNormalization: true,
                },
              },
            },
          ],
          menus: {
            lightTypes: {
              acceptReporters: false,
              items: [{
                  text: "Ambient Light",
                  value: "AmbientLight",
                },
                {
                  text: "Directional Light",
                  value: "DirectionalLight",
                },
                {
                  text: "Point Light",
                  value: "PointLight",
                },
                {
                  text: "Hemisphere Light",
                  value: "HemisphereLight",
                },
                {
                  text: "Spot Light",
                  value: "SpotLight",
                },
              ],
            },
            lightProperties: {
              acceptReporters: false,
              items: [{
                  text: "Color",
                  value: "color",
                },
                {
                  text: "Intensity",
                  value: "intensity",
                },
                {
                  text: "Cast Shadow?",
                  value: "castShadow",
                },
                {
                  text: "Ground Color (HemisphereLight)",
                  value: "groundColor",
                },
                {
                  text: "Map (SpotLight)",
                  value: "map",
                },
                {
                  text: "Distance (SpotLight)",
                  value: "distance",
                },
                {
                  text: "Decay (SpotLight)",
                  value: "decay",
                },
                {
                  text: "Penumbra (SpotLight)",
                  value: "penumbra",
                },
                {
                  text: "Angle/Size (SpotLight)",
                  value: "angle",
                },
                {
                  text: "Power (SpotLight)",
                  value: "power",
                },
                {
                  text: "Target Position (Directional/SpotLight)",
                  value: "target",
                },
              ],
            },
          },
        };
      }

      addLight(args) {
        const light = new THREE[args.TYPE](0xffffff, 1);

        createObject(args.NAME, light, args.GROUP);
        lights[args.NAME] = light;
        if (light.type === "AmbientLight" || "HemisphereLight") return;

        light.castShadow = true;
        if (light.type === "PointLight") return;
        //Directional & Spot Light
        light.target.position.set(0, 0, 0);
        
        const scene = getCurrentScene();
        if (scene) scene.add(light.target);

        light.pos = new THREE.Vector3(0, 0, 0);

        light.shadow.mapSize.width = 4096;
        light.shadow.mapSize.height = 2048;

        if (light.type === "SpotLight") {
          light.decay = 0;
          light.shadow.camera.near = 500;
          light.shadow.camera.far = 4000;
          light.shadow.camera.fov = 30;
        }
        light.shadow.needsUpdate = true;
        light.needsUpdate = true;
      }

      setLight(args) {
        const light = lights[args.NAME];
        if (!light || !args.PROPERTY) return;
        
        if (args.PROPERTY === "target") {
          light.target.position.set(...JSON.parse(args.VALUE)); //vector3
          light.target.updateMatrixWorld();
        } else {
          light[args.PROPERTY] = getAsset(args.VALUE);
        }
        light.needsUpdate = true;

        if (light.type === "AmbientLight" || "HemisphereLight") return;

        light.shadow.camera.updateProjectionMatrix();
        light.shadow.needsUpdate = true;
      }
    }
    Scratch.extensions.register(new ThreeLights());

    class ThreeUtilities {
      getInfo() {
        return {
          id: "threeUtility",
          name: "Three Utilities",
          color1: "#3875c5ff",
          color2: "#222222",
          color3: "#222222",

          blocks: [{
              opcode: "newVector2",
              blockType: Scratch.BlockType.REPORTER,
              text: "New Vector [X] [Y]",
              arguments: {
                X: {
                  type: Scratch.ArgumentType.NUMBER,
                },
                Y: {
                  type: Scratch.ArgumentType.NUMBER,
                },
              },
            },
            {
              opcode: "newVector3",
              blockType: Scratch.BlockType.REPORTER,
              text: "New Vector [X] [Y] [Z]",
              arguments: {
                X: {
                  type: Scratch.ArgumentType.NUMBER,
                },
                Y: {
                  type: Scratch.ArgumentType.NUMBER,
                },
                Z: {
                  type: Scratch.ArgumentType.NUMBER,
                },
              },
            },
            "---",
            {
              opcode: "operateV3",
              blockType: Scratch.BlockType.REPORTER,
              text: "do [V3] [O] [V32]",
              arguments: {
                V3: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "[0,0,0]",
                },
                O: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "operators",
                },
                V32: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "[1,0,0]",
                },
              },
            },
            {
              opcode: "moveVector3",
              blockType: Scratch.BlockType.REPORTER,
              text: "move [S] steps in vector [V3] in direction [D3]",
              arguments: {
                S: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: 1,
                },
                V3: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "[0,0,0]",
                },
                D3: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "[1,0,0]",
                },
              },
            },
            {
              opcode: "directionTo",
              blockType: Scratch.BlockType.REPORTER,
              text: "direction from [V3] to [T3]",
              arguments: {
                V3: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "[0,0,3]",
                },
                T3: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "[0,0,0]",
                },
              },
            },
            "---",
            {
              opcode: "newColor",
              blockType: Scratch.BlockType.REPORTER,
              text: "New Color [HEX]",
              arguments: {
                HEX: {
                  type: Scratch.ArgumentType.COLOR,
                  defaultValue: "#9966ff",
                },
              },
            },
            {
              opcode: "newFog",
              blockType: Scratch.BlockType.REPORTER,
              text: "New Fog [COLOR] [NEAR] [FAR]",
              arguments: {
                COLOR: {
                  type: Scratch.ArgumentType.COLOR,
                  defaultValue: "#9966ff",
                  exemptFromNormalization: true,
                },
                NEAR: {
                  type: Scratch.ArgumentType.NUMBER,
                },
                FAR: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: 10,
                },
              },
            },
            {
              opcode: "newTexture",
              blockType: Scratch.BlockType.REPORTER,
              text: "New Texture [COSTUME] [MODE] [STYLE] repeat [X][Y]",
              arguments: {
                COSTUME: {
                  type: Scratch.ArgumentType.COSTUME,
                },
                MODE: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "textureModes",
                },
                STYLE: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "textureStyles",
                },
                X: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: 1,
                },
                Y: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: 1,
                },
              },
            },
            {
              opcode: "newCubeTexture",
              blockType: Scratch.BlockType.REPORTER,
              text: "New Cube Texture X+[COSTUMEX0]X-[COSTUMEX1]Y+[COSTUMEY0]Y-[COSTUMEY1]Z+[COSTUMEZ0]Z-[COSTUMEZ1] [MODE] [STYLE] repeat [X][Y]",
              arguments: {
                COSTUMEX0: {
                  type: Scratch.ArgumentType.COSTUME,
                },
                COSTUMEX1: {
                  type: Scratch.ArgumentType.COSTUME,
                },
                COSTUMEY0: {
                  type: Scratch.ArgumentType.COSTUME,
                },
                COSTUMEY1: {
                  type: Scratch.ArgumentType.COSTUME,
                },
                COSTUMEZ0: {
                  type: Scratch.ArgumentType.COSTUME,
                },
                COSTUMEZ1: {
                  type: Scratch.ArgumentType.COSTUME,
                },
                MODE: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "textureModes",
                },
                STYLE: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "textureStyles",
                },
                X: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: 1,
                },
                Y: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: 1,
                },
              },
            },
            {
              opcode: "newEquirectangularTexture",
              blockType: Scratch.BlockType.REPORTER,
              text: "New Equirectangular Texture [COSTUME] [MODE]",
              arguments: {
                COSTUME: {
                  type: Scratch.ArgumentType.COSTUME,
                },
                MODE: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "textureModes",
                },
              },
            },
            "---",
            {
              opcode: "curve",
              extensions: ["colours_data_lists"],
              blockType: Scratch.BlockType.REPORTER,
              text: "generate curve [TYPE] from points [POINTS], closed: [CLOSED]",
              arguments: {
                TYPE: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "curveTypes",
                },
                POINTS: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "[0,3,0] [2.5,-1.5,0] [-2.5,-1.5,0]",
                },
                CLOSED: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "true",
                },
              },
            },
            "---",
            {
              opcode: "mouseDown",
              extensions: ["colours_sensing"],
              blockType: Scratch.BlockType.BOOLEAN,
              text: "mouse [BUTTON] [action]?",
              arguments: {
                BUTTON: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "mouseButtons",
                },
                action: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "mouseAction",
                },
              },
            },
            {
              opcode: "mousePos",
              extensions: ["colours_sensing"],
              blockType: Scratch.BlockType.REPORTER,
              text: "mouse position",
              arguments: {},
            },
            "---",
            {
              opcode: "getItem",
              extensions: ["colours_data_lists"],
              blockType: Scratch.BlockType.REPORTER,
              text: "get item [ITEM] of [ARRAY]",
              arguments: {
                ITEM: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "1",
                },
                ARRAY: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: `["myObject", "myLight"]`,
                },
              },
            },
            {
              blockType: Scratch.BlockType.LABEL,
              text: "↳ Raycasting",
            },
            {
              opcode: "raycast",
              blockType: Scratch.BlockType.COMMAND,
              text: "Raycast from [V3] in direction [D3]",
              arguments: {
                V3: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "[0,0,3]",
                },
                D3: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "[0,0,1]",
                },
              },
            },
            {
              opcode: "getRaycast",
              blockType: Scratch.BlockType.REPORTER,
              text: "get raycast [PROPERTY]",
              arguments: {
                PROPERTY: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "raycastProperties",
                },
              },
            },
          ],
          menus: {
            materialProperties: {
              acceptReporters: false,
              items: [{
                  text: "Color",
                  value: "color",
                },
                {
                  text: "Map (texture)",
                  value: "map",
                },
                {
                  text: "Alpha Map (texture)",
                  value: "alphaMap",
                },
                {
                  text: "Alpha Test (0-1)",
                  value: "alphaTest",
                },
                {
                  text: "Side (front/back/double)",
                  value: "side",
                },
                {
                  text: "Bump Map (texture)",
                  value: "bumpMap",
                },
                {
                  text: "Bump Scale",
                  value: "bumpScale",
                },
              ],
            },
            textureModes: {
              acceptReporters: false,
              items: ["Pixelate", "Blur"],
            },
            textureStyles: {
              acceptReporters: false,
              items: ["Repeat", "Clamp"],
            },
            raycastProperties: {
              acceptReporters: false,
              items: [{
                  text: "Intersected Object Names",
                  value: "name",
                },
                {
                  text: "Number of Objects",
                  value: "number",
                },
                {
                  text: "Intersected Objects distances",
                  value: "distance",
                },
              ],
            },
            mouseButtons: {
              acceptReporters: false,
              items: ["left", "middle", "right"],
            },
            mouseAction: {
              acceptReporters: false,
              items: ["Down", "Clicked"],
            },
            curveTypes: {
              acceptReporters: false,
              items: ["CatmullRomCurve3"],
            },
            operators: {
              acceptReporters: false,
              items: ["+", "-", "*", "/", "=", "max", "min", "dot", "cross", "distance to", "angle to", "apply euler"],
            },
          },
        };
      }
      mouseDown(args) {
        if (args.action === "Down") return isMouseDown[args.BUTTON];
        if (args.action === "Clicked") {
          if (isMouseDown[args.BUTTON] == prevMouse[args.BUTTON]) return false;
          else prevMouse[args.BUTTON] = true;
          return true;
        }
      }
      mousePos(event) {
        return JSON.stringify(mouseNDC);
      }
      newVector3(args) {
        return JSON.stringify([args.X, args.Y, args.Z]);
      }
      operateV3(args) {
        const v3 = new THREE.Vector3(...JSON.parse(args.V3));
        const v32 = new THREE.Vector3(...JSON.parse(args.V32));

        let r;
        if (args.O == "+") r = v3.add(v32);
        else if (args.O == "-") r = v3.sub(v32);
        else if (args.O == "*") r = v3.multiply(v32);
        else if (args.O == "/") r = v3.divide(v32);
        else if (args.O == "=") r = v3.equals(v32);
        else if (args.O == "max") r = v3.max(v32);
        else if (args.O == "min") r = v3.min(v32);
        else if (args.O == "dot") r = v3.dot(v32);
        else if (args.O == "cross") r = v3.cross(v32);
        else if (args.O == "distance to") r = v3.distanceTo(v32);
        else if (args.O == "angle to") r = v3.angleTo(v32);
        else if (args.O == "apply euler") r = v3.applyEuler(new THREE.Euler(v32.x, v32.y, v32.z, eulerOrder));

        if (typeof r == "object") return JSON.stringify([r.x, r.y, r.z]);
        else return JSON.stringify(r);
      }

      newVector2(args) {
        return JSON.stringify([args.X, args.Y]);
      }

      moveVector3(args) {
        const currentPos = new THREE.Vector3(...JSON.parse(args.V3));
        const steps = Number(args.S);

        const [pitchInputDeg, yawInputDeg, rollInputDeg] = JSON.parse(args.D3).map(Number);

        const yaw = THREE.MathUtils.degToRad(yawInputDeg);
        const pitch = THREE.MathUtils.degToRad(pitchInputDeg);
        const roll = THREE.MathUtils.degToRad(rollInputDeg);

        const euler = new THREE.Euler(pitch, yaw, roll, eulerOrder);

        const forwardVector = new THREE.Vector3(0, 0, -1);
        const direction = forwardVector.applyEuler(euler).normalize();

        const newPos = currentPos.add(direction.multiplyScalar(steps));
        return JSON.stringify([newPos.x, newPos.y, newPos.z]);
      }

      directionTo(args) {
        const v3 = new THREE.Vector3(...JSON.parse(args.V3));
        const toV3 = new THREE.Vector3(...JSON.parse(args.T3));

        const direction = toV3.clone().sub(v3).normalize();
        // Pitch (X)
        const pitch = Math.atan2(-direction.y, Math.sqrt(direction.x * direction.x + direction.z * direction.z));
        // Yaw (Y)
        const yaw = Math.atan2(direction.x, direction.z);

        // Roll always 0
        return JSON.stringify([180 + THREE.MathUtils.radToDeg(pitch), THREE.MathUtils.radToDeg(yaw), 0]);
      }

      newColor(args) {
        const color = new THREE.Color(args.HEX);
        const uuid = crypto.randomUUID();
        assets.colors[uuid] = color;
        return `colors/${uuid}`;
      }
      newFog(args) {
        const fog = new THREE.Fog(args.COLOR, args.NEAR, args.FAR);
        const uuid = crypto.randomUUID();
        assets.fogs[uuid] = fog;
        return `fogs/${uuid}`;
      }
      async newTexture(args) {
        const textureURI = encodeCostume(args.COSTUME);
        if (!textureURI) return "null";
        const texture = await new THREE.TextureLoader().loadAsync(textureURI);
        texture.name = args.COSTUME;

        setTexutre(texture, args.MODE, args.STYLE, args.X, args.Y);
        assets.textures[texture.uuid] = texture;
        return `textures/${texture.uuid}`;
      }
      async newCubeTexture(args) {
        const uris = [
          encodeCostume(args.COSTUMEX0),
          encodeCostume(args.COSTUMEX1),
          encodeCostume(args.COSTUMEY0),
          encodeCostume(args.COSTUMEY1),
          encodeCostume(args.COSTUMEZ0),
          encodeCostume(args.COSTUMEZ1),
        ];
        // Check if all URIs are valid
        if (uris.some(uri => !uri)) return "null";
        
        const normalized = await Promise.all(uris.map((uri) => resizeImageToSquare(uri, 256)));
        const texture = await new THREE.CubeTextureLoader().loadAsync(normalized);

        texture.name = "CubeTexture" + args.COSTUMEX0;

        setTexutre(texture, args.MODE, args.STYLE, args.X, args.Y);
        assets.textures[texture.uuid] = texture;
        return `textures/${texture.uuid}`;
      }
      async newEquirectangularTexture(args) {
        const textureURI = encodeCostume(args.COSTUME);
        if (!textureURI) return "null";
        const texture = await new THREE.TextureLoader().loadAsync(textureURI);
        texture.name = args.COSTUME;
        texture.mapping = THREE.EquirectangularReflectionMapping;

        setTexutre(texture, args.MODE);
        assets.textures[texture.uuid] = texture;
        return `textures/${texture.uuid}`;
      }

      curve(args) {
        function parsePoints(input) {
          // Match all [x,y,z] groups
          const matches = input.match(/\[([^\]]+)\]/g);
          if (!matches) return [];

          return matches.map((str) => {
            const nums = str
              .replace(/[\[\]\s]/g, "")
              .split(",")
              .map(Number);
            return new THREE.Vector3(nums[0] || 0, nums[1] || 0, nums[2] || 0);
          });
        }
        const points = parsePoints(args.POINTS);
        const curve = new THREE[args.TYPE](points);
        curve.closed = JSON.parse(args.CLOSED);

        const uuid = crypto.randomUUID();
        assets.curves[uuid] = curve;
        return `curves/${uuid}`;
      }

      getItem(args) {
        const items = JSON.parse(args.ARRAY);
        const item = items[args.ITEM - 1];
        if (!item) return "0";
        return item;
      }

      raycast(args) {
        const scene = getCurrentScene();
        if (!scene) return;
        
        const origin = new THREE.Vector3(...JSON.parse(args.V3));
        // rotation is in degrees => convert to radians first
        const rot = JSON.parse(args.D3).map((v) => (v * Math.PI) / 180);

        const euler = new THREE.Euler(rot[0], rot[1], rot[2], eulerOrder);
        const direction = new THREE.Vector3(0, 0, -1).applyEuler(euler).normalize();

        const raycaster = new THREE.Raycaster();
        //const camera = getObject(args.CAMERA)
        raycaster.set(origin, direction);

        const intersects = raycaster.intersectObjects(scene.children, true);

        raycastResult = intersects;
      }
      getRaycast(args) {
        if (args.PROPERTY === "number") return raycastResult.length;
        if (args.PROPERTY === "distance") return JSON.stringify(raycastResult.map((i) => i.distance));
        return JSON.stringify(raycastResult.map((i) => i.object[args.PROPERTY]));
      }
    }
    Scratch.extensions.register(new ThreeUtilities());

    class ThreeGLB {
      getInfo() {
        return {
          id: "threeGLB",
          name: "Three GLB Loader",
          color1: "#c53838ff",
          color2: "#222222",
          color3: "#222222",

          blocks: [{
              blockType: Scratch.BlockType.BUTTON,
              text: "Load GLB File",
              func: "loadModelFile",
            },
            {
              opcode: "addModel",
              blockType: Scratch.BlockType.COMMAND,
              text: "add [ITEM] as [NAME] to [GROUP]",
              arguments: {
                GROUP: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "scene",
                },
                ITEM: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "modelsList",
                },
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myModel",
                },
              },
            },
            {
              opcode: "getModel",
              blockType: Scratch.BlockType.REPORTER,
              text: "get object [PROPERTY] of [NAME]",
              arguments: {
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myModel",
                },
                PROPERTY: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "modelProperties",
                },
              },
            },
            {
              opcode: "playAnimation",
              blockType: Scratch.BlockType.COMMAND,
              text: "play animation [ANAME] of [NAME], [TIMES] times",
              arguments: {
                TIMES: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: "0",
                },
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myModel",
                },
                ANAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "walk",
                  exemptFromNormalization: true,
                },
              },
            },
            {
              opcode: "pauseAnimation",
              blockType: Scratch.BlockType.COMMAND,
              text: "set [TOGGLE] animation [ANAME] of [NAME]",
              arguments: {
                TOGGLE: {
                  type: Scratch.ArgumentType.NUMBER,
                  menu: "pauseUn",
                },
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myModel",
                },
                ANAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "walk",
                  exemptFromNormalization: true,
                },
              },
            },
            {
              opcode: "stopAnimation",
              blockType: Scratch.BlockType.COMMAND,
              text: "stop animation [ANAME] of [NAME]",
              arguments: {
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myModel",
                },
                ANAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "walk",
                  exemptFromNormalization: true,
                },
              },
            },
          ],
          menus: {
            modelProperties: {
              acceptReporters: false,
              items: [{
                text: "Animations",
                value: "animations",
              }, ],
            },
            pauseUn: {
              acceptReporters: true,
              items: [{
                  text: "Pause",
                  value: "true",
                },
                {
                  text: "Unpasue",
                  value: "false",
                },
              ],
            },
            modelsList: {
              acceptReporters: false,
              items: () => {
                const stage = runtime.getTargetForStage();
                if (!stage) return ["(loading...)"];

                // @ts-ignore
                const models = Scratch.vm.runtime
                  .getTargetForStage()
                  .getSounds()
                  .filter((e) => e.name && e.name.endsWith(".glb"));
                if (models.length < 1) return [
                  ["Load a model!"]
                ];

                // @ts-ignore
                return models.map((m) => [m.name]);
              },
            },
          },
        };
      }

      async loadModelFile() {
        openFileExplorer(".glb").then((files) => {
          const file = files[0];
          const reader = new FileReader();

          reader.onload = async (e) => {
            const arrayBuffer = e.target.result;

            {
              // From lily's assets

              // Thank you PenguinMod for providing this code.
              {
                const targetId = runtime.getTargetForStage().id; //util.target.id not working!
                const assetName = Cast.toString(file.name);

                //const res = await Scratch.fetch(args.URL);
                //const buffer = await res.arrayBuffer();
                const buffer = arrayBuffer;

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
      async addModel(args) {
        const group = await getModel(args.ITEM, args.NAME);

        createObject(args.NAME, group, args.GROUP);
      }
      getModel(args) {
        if (!models[args.NAME]) return "null";
        return Object.keys(models[args.NAME].actions).toString();
      }

      playAnimation(args) {
        const model = models[args.NAME];
        if (!model) {
          console.log("no model!");
          return;
        }

        const action = model.actions[args.ANAME]; //clones of models dont have a stored actions!
        if (!action) {
          console.log("no action!");
          return;
        }

        args.TIMES > 0 ? action.setLoop(THREE.LoopRepeat, args.TIMES) : action.setLoop(THREE.LoopRepeat, Infinity);

        action.reset().play();
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
        if (action) action.paused = args.TOGGLE;
      }
    }
    Scratch.extensions.register(new ThreeGLB());

    class ThreeAddons {
      getInfo() {
        return {
          id: "threeAddons",
          name: "Three Addons",
          color1: "#c538a2ff",
          color2: "#222222",
          color3: "#222222",

          blocks: [{
              blockType: Scratch.BlockType.LABEL,
              text: "Orbit Control",
            },
            {
              opcode: "OrbitControl",
              blockType: Scratch.BlockType.COMMAND,
              text: "set addon Orbit Control [STATE]",
              arguments: {
                STATE: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "onoff",
                },
              },
            },

            {
              blockType: Scratch.BlockType.LABEL,
              text: "Post Processing",
            },
            {
              opcode: "resetComposer",
              blockType: Scratch.BlockType.COMMAND,
              text: "reset composer",
            },
            {
              opcode: "bloom",
              blockType: Scratch.BlockType.COMMAND,
              text: "add bloom intensity:[I] smoothing:[S] threshold:[T] | blend: [BLEND] opacity:[OP]",
              arguments: {
                OP: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: 1,
                },
                I: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: 1,
                },
                S: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: 0.5,
                },
                T: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: 0.5,
                },
                BLEND: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "blendModes",
                  defaultValue: "SCREEN",
                },
              },
            },
            {
              opcode: "godRays",
              blockType: Scratch.BlockType.COMMAND,
              text: "add god rays object:[NAME] density:[DENS] decay:[DEC] weight:[WEI] exposition:[EXP] | resolution:[RES] samples:[SAMP] | blend: [BLEND] opacity:[OP]",
              arguments: {
                OP: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: 1,
                },
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myObject",
                },
                BLEND: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "blendModes",
                  defaultValue: "SCREEN",
                },
                DEC: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: 0.95,
                },
                DENS: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: 1,
                },
                EXP: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: 0.1,
                },
                WEI: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: 0.4,
                },
                RES: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: 1,
                },
                SAMP: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: 64,
                },
              },
            },
            {
              opcode: "dots",
              blockType: Scratch.BlockType.COMMAND,
              text: "add dots scale:[S] angle:[A] | blend: [BLEND] opacity:[OP]",
              arguments: {
                OP: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: 1,
                },
                S: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: 1,
                },
                A: {
                  type: Scratch.ArgumentType.ANGLE,
                  defaultValue: 0,
                },
                BLEND: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "blendModes",
                  defaultValue: "SCREEN",
                },
              },
            },
            {
              opcode: "depth",
              blockType: Scratch.BlockType.COMMAND,
              text: "add depth of field focusDistance:[FD] focalLength:[FL] bokehScale:[BS] | height:[H] | blend: [BLEND] opacity:[OP]",
              arguments: {
                FD: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: 3,
                },
                FL: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: 0.001,
                },
                BS: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: 4,
                },
                H: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: 240,
                },
                OP: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: 1,
                },
                BLEND: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "blendModes",
                  defaultValue: "NORMAL",
                },
              },
            },
            "---",
            {
              opcode: "custom",
              blockType: Scratch.BlockType.COMMAND,
              text: "add custom shader [NAME] with GLSL fragm [FRA] vert [VER] | blend: [BLEND] opacity:[OP]",
              arguments: {
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myShader",
                },
                FRA: {
                  type: Scratch.ArgumentType.STRING,
                },
                VER: {
                  type: Scratch.ArgumentType.STRING,
                },
                BLEND: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "blendModes",
                  defaultValue: "NORMAL",
                },
                OP: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: 1,
                },
              },
            },
          ],
          menus: {
            onoff: {
              acceptReporters: true,
              items: [{
                  text: "enabled",
                  value: "1",
                },
                {
                  text: "disabled",
                  value: "0",
                },
              ],
            },
            blendModes: {
              acceptReporters: false,
              items: [
                "SKIP",
                "SET",
                "ADD",
                "ALPHA",
                "AVERAGE",
                "COLOR",
                "COLOR_BURN",
                "COLOR_DODGE",
                "DARKEN",
                "DIFFERENCE",
                "DIVIDE",
                "DST",
                "EXCLUSION",
                "HARD_LIGHT",
                "HARD_MIX",
                "HUE",
                "INVERT",
                "INVERT_RGB",
                "LIGHTEN",
                "LINEAR_BURN",
                "LINEAR_DODGE",
                "LINEAR_LIGHT",
                "LUMINOSITY",
                "MULTIPLY",
                "NEGATION",
                "NORMAL",
                "OVERLAY",
                "PIN_LIGHT",
                "REFLECT",
                "SCREEN",
                "SRC",
                "SATURATION",
                "SOFT_LIGHT",
                "SUBTRACT",
                "VIVID_LIGHT",
              ],
            },
          },
        };
      }

      OrbitControl(args) {
        if (controls) controls.dispose();

        console.log("creating...", OrbitControls);
        controls = new OrbitControls.OrbitControls(camera, threeRenderer.domElement);
        controls.enableDamping = true;

        controls.enabled = !!args.STATE;
        console.log(controls);
      }

      resetComposer() {
        composer.passes = [];
        passes = {};
        customEffects = [];
        updateComposers();
      }

      bloom(args) {
        const scene = getCurrentScene();
        if (!camera || !scene) {
          if (alerts) alert("set a camera!");
          return;
        }
        const bloomEffect = new BloomEffect({
          intensity: args.I,
          luminanceThreshold: args.T, // ← correct key
          luminanceSmoothing: args.S,
          blendFunction: BlendFunction[args.BLEND],
        });
        bloomEffect.blendMode.opacity.value = args.OP;

        const pass = new EffectPass(camera, bloomEffect);

        composer.addPass(pass);
      }

      godRays(args) {
        const scene = getCurrentScene();
        if (!camera || !scene) {
          if (alerts) alert("set a camera!");
          return;
        }
        let object = getObject(args.NAME);
        if (!object) return;
        const sun = object;

        const godRays = new GodRaysEffect(camera, sun, {
          resolutionScale: args.RES,
          density: args.DENS, // ray density
          decay: args.DEC, // fade out
          weight: args.WEI, // brightness of rays
          exposure: args.EXP,
          samples: args.SAMP,
          blendFunction: BlendFunction[args.BLEND],
        });
        godRays.blendMode.opacity.value = args.OP;
        const pass = new EffectPass(camera, godRays);
        composer.addPass(pass);
      }

      dots(args) {
        const scene = getCurrentScene();
        if (!camera || !scene) {
          if (alerts) alert("set a camera!");
          return;
        }
        const dot = new DotScreenEffect({
          angle: args.A,
          scale: args.S,
          blendFunction: BlendFunction[args.BLEND],
        });
        dot.blendMode.opacity.value = args.OP;
        const pass = new EffectPass(camera, dot);
        composer.addPass(pass);
      }

      depth(args) {
        const scene = getCurrentScene();
        if (!camera || !scene) {
          if (alerts) alert("set a camera!");
          return;
        }
        const dofEffect = new DepthOfFieldEffect(camera, {
          focusDistance: (args.FD - camera.near) / (camera.far - camera.near), // how far from camera things are sharp (0 = near, 1 = far)
          focalLength: args.FL, // lens focal length in meters
          bokehScale: args.BS, // strength/size of the blur circles
          height: args.H, // resolution hint (affects quality/perf)
          blendFunction: BlendFunction[args.BLEND],
        });
        dofEffect.blendMode.opacity.value = args.OP;

        const dofPass = new EffectPass(camera, dofEffect);
        composer.addPass(dofPass);
      }

      async custom(args) {
        function cleanGLSL(glslCode) {
          //delete multilines comments
          let cleanedCode = glslCode
            .replace(/\/\*[\s\S]*?\*\//g, " ")
            .replace(/  /g, "\n")
            .replace(/\/\/.*$/gm, " ")
            .replace(/; /g, ";\n");

          return cleanedCode;
        }

        let fs = cleanGLSL(`
        ${args.FRA}
      `);
        if (!args.FRA.trim()) {
          fs = `void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) { outputColor = inputColor; }`;
        }
        const vs = cleanGLSL(`
        ${args.VER}
      `);
        console.log(fs);
        console.log(vs);

        const effect = new Effect("Custom", fs, {
          blendFunction: BlendFunction[args.BLEND],
          vertexShader: vs,
          uniforms: new Map([
            //uniforms usually in shaders... open to more!
            ["time", new THREE.Uniform(0.0)],
            [
              "resolution",
              new THREE.Uniform(new THREE.Vector2(threeRenderer.domElement.width, threeRenderer.domElement.height)),
            ],
          ]),
          defines: new Map([
            ["USE_TIME", "1"],
            ["USE_VERTEX_TRANSFORM", ""],
          ]),
        });

        effect.blendMode.opacity.value = args.OP;

        const pass = new EffectPass(camera, effect);
        composer.addPass(pass);

        customEffects.push(effect);
      }
    }
    Scratch.extensions.register(new ThreeAddons());

    class RapierPhysics {
      getInfo() {
        return {
          id: "rapierPhysics",
          name: "RAPIER Physics",
          color1: "#222222",
          color2: "#203024ff",
          color3: "#78f07eff",
          blocks: [{
              opcode: "createWorld",
              blockType: Scratch.BlockType.COMMAND,
              text: "create world | gravity:[G]",
              arguments: {
                G: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "[0,-9.81,0]",
                },
              },
            },
            {
              opcode: "getWorld",
              blockType: Scratch.BlockType.REPORTER,
              text: "get world [PROPERTY]",
              arguments: {
                PROPERTY: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "wProp",
                },
              },
            },
            "---",
            {
              opcode: "objectPhysics",
              blockType: Scratch.BlockType.COMMAND,
              text: "enable physics for object [OBJECT] [state] | rigidBody [type] | collider [collider] mass [mass] density [density] friction [friction] sensor [state2]",
              arguments: {
                state2: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "state2",
                },
                state: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "state",
                  defaultValue: "true",
                },
                type: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "objectTypes",
                  defaultValue: "dynamic",
                },
                collider: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "colliderTypes",
                  defaultValue: "cuboid",
                },
                OBJECT: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myObject",
                },
                mass: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: "1",
                },
                density: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: "1",
                },
                friction: {
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: "0.5",
                },
              },
            },
            "---",
            {
              blockType: Scratch.BlockType.LABEL,
              text: "- RigidBody",
            },
            {
              opcode: "setRB",
              blockType: Scratch.BlockType.COMMAND,
              text: "set rigidbody [PROPERTY] of [OBJECT] to [VALUE]",
              arguments: {
                PROPERTY: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "rigidBodySets",
                },
                OBJECT: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myObject",
                },
                VALUE: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "1",
                },
              },
            },
            {
              opcode: "getRB",
              blockType: Scratch.BlockType.REPORTER,
              text: "get rigidbody [PROPERTY] of [OBJECT]",
              arguments: {
                PROPERTY: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "rigidBodyProperties",
                },
                OBJECT: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myObject",
                },
              },
            },
            "---",
            {
              opcode: "lockObjectAxis",
              blockType: Scratch.BlockType.COMMAND,
              text: "lock rigidbody [OBJECT] [PROPERTY] on x:[X] y:[Y] z:[Z]",
              arguments: {
                OBJECT: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myObject",
                },
                PROPERTY: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "lockAxes",
                },
                X: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "tf",
                },
                Y: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "tf",
                },
                Z: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "tf",
                },
              },
            },
            "---",
            {
              opcode: "addForce",
              blockType: Scratch.BlockType.COMMAND,
              text: "set [PROPERTY] of [OBJECT] to [VALUE] in [SPACE] space",
              arguments: {
                VALUE: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "[0,10,0]",
                },
                PROPERTY: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "forces",
                  defaultValue: "addForce",
                },
                SPACE: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "spaces",
                  defaultValue: "world",
                },
                OBJECT: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myObject",
                },
              },
            },
            {
              opcode: "resetForces",
              blockType: Scratch.BlockType.COMMAND,
              text: "reset [PROPERTY] of [OBJECT]",
              arguments: {
                PROPERTY: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "resetF",
                  defaultValue: "resetForces",
                },
                OBJECT: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myObject",
                },
              },
            },
            "---",
            {
              opcode: "enableCCD",
              blockType: Scratch.BlockType.COMMAND,
              text: "enable Continuous Collision Detection for [OBJECT] [state]",
              arguments: {
                state: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "state",
                  defaultValue: "true",
                },
                PROPERTY: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "oPropS",
                  defaultValue: "physics",
                },
                OBJECT: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myObject",
                },
              },
            },
            "---",
            {
              opcode: "fixedJoint",
              blockType: Scratch.BlockType.COMMAND,
              text: "create FIXED joint between [ObjA] & [ObjB] | anchor A: [VA] [RA] B: [VB] [RB]",
              arguments: {
                ObjA: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myObject",
                },
                ObjB: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myObjectB",
                },
                VA: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "[0,0,0]",
                },
                VB: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "[0,1,0]",
                },
                RA: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "[0,0,0]",
                },
                RB: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "[0,0,0]",
                },
              },
            },
            {
              opcode: "sphericalJoint",
              blockType: Scratch.BlockType.COMMAND,
              text: "create SPHERICAL joint between [ObjA] & [ObjB] | anchor A: [VA] B: [VB]",
              arguments: {
                ObjA: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myObject",
                },
                ObjB: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myObjectB",
                },
                VA: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "[0,0,0]",
                },
                VB: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "[0,1,0]",
                },
              },
            },
            {
              opcode: "revoluteJoint",
              blockType: Scratch.BlockType.COMMAND,
              text: "create REVOLUTE joint between [ObjA] & [ObjB] | anchor A: [VA] B: [VB] | axis: [X]",
              arguments: {
                ObjA: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myObject",
                },
                ObjB: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myObjectB",
                },
                VA: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "[0,0,0]",
                },
                VB: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "[0,1,0]",
                },
                X: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "[1,0,0]",
                },
              },
            },
            "---",
            {
              blockType: Scratch.BlockType.LABEL,
              text: "- Collider",
            },
            {
              opcode: "setC",
              blockType: Scratch.BlockType.COMMAND,
              text: "set collider [PROPERTY] of [OBJECT] to [VALUE]",
              arguments: {
                PROPERTY: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "colliderSets",
                },
                OBJECT: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myObject",
                },
                VALUE: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "1",
                },
              },
            },
            {
              opcode: "getC",
              blockType: Scratch.BlockType.REPORTER,
              text: "get collider [PROPERTY] of [OBJECT]",
              arguments: {
                PROPERTY: {
                  type: Scratch.ArgumentType.STRING,
                  menu: "colliderProperties",
                },
                OBJECT: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myObject",
                },
              },
            },
            "---",
            {
              opcode: "sensorSingle",
              blockType: Scratch.BlockType.BOOLEAN,
              text: "is sensor [SENSOR] touching [OBJECT]?",
              arguments: {
                SENSOR: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "mySensor",
                },
                OBJECT: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "myObject",
                },
              },
            },
            {
              opcode: "sensorAll",
              blockType: Scratch.BlockType.REPORTER,
              text: "objects touching sensor [SENSOR]",
              arguments: {
                SENSOR: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "mySensor",
                },
              },
            },
          ],
          menus: {
            wProp: {
              acceptReporters: false,
              items: [{
                  text: "Gravity",
                  value: "gravity",
                },
                {
                  text: "log to console",
                  value: "log",
                },
              ],
            },
            tf: {
              acceptReporters: true,
              items: [{
                  text: "false",
                  value: "false",
                },
                {
                  text: "true",
                  value: "true",
                },
              ],
            },
            lockAxes: {
              acceptReporters: false,
              items: [{
                  text: "Translation",
                  value: "setEnabledTranslations",
                },
                {
                  text: "Rotation",
                  value: "setEnabledRotations",
                },
              ],
            },
            rigidBodyProperties: {
              acceptReporters: false,
              items: [{
                  text: "Type",
                  value: "bodyType",
                },
                {
                  text: "Linear Velocity",
                  value: "linvel",
                },
                {
                  text: "Angular Velocity",
                  value: "angvel",
                },
                {
                  text: "Translation (position)",
                  value: "translation",
                },
                {
                  text: "Rotation (quaternion)",
                  value: "rotation",
                },
                {
                  text: "Mass",
                  value: "mass",
                },
                //{text: "Center of Mass", value: "centerOfMass"},
                {
                  text: "Linear Damping",
                  value: "linearDamping",
                },
                {
                  text: "Angular Damping",
                  value: "angularDamping",
                },
                {
                  text: "Is Sleeping?",
                  value: "isSleeping",
                },
                //{text: "Can Sleep?", value: "isCanSleep"},
                {
                  text: "Gravity Scale",
                  value: "gravityScale",
                },
                {
                  text: "Is Fixed?",
                  value: "isFixed",
                },
                {
                  text: "Is Dynamic?",
                  value: "isDynamic",
                },
                {
                  text: "Is Kinematic?",
                  value: "isKinematic",
                },
                //{text: "Sleeping", value: "sleeping"}
              ],
            },
            rigidBodySets: {
              acceptReporters: false,
              items: [
                //{text: "Linear Velocity", value: "setLinvel"},
                //{text: "Angular Velocity", value: "setAngvel"},
                //{text: "Mass", value: "setMass"},
                {
                  text: "Gravity Scale",
                  value: "setGravityScale",
                },
                //{text: "Can Sleep?", value: "setCanSleep"},
                //{text: "Sleeping", value: "sleeping"},
                {
                  text: "Linear Damping",
                  value: "setLinearDamping",
                },
                {
                  text: "Angular Damping",
                  value: "setAngularDamping",
                },
                {
                  text: "Is Fixed?",
                  value: "isFixed",
                },
                {
                  text: "Is Dynamic?",
                  value: "isDynamic",
                },
                {
                  text: "Is Kinematic?",
                  value: "isKinematic",
                },
              ],
            },
            colliderProperties: {
              acceptReporters: false,
              items: [
                //{text: "Collider Type", value: "type"},
                {
                  text: "Is Sensor?",
                  value: "isSensor",
                },
                {
                  text: "Friction",
                  value: "friction",
                },
                {
                  text: "Restitution",
                  value: "restitution",
                },
                {
                  text: "Density",
                  value: "density",
                },
                {
                  text: "Mass",
                  value: "mass",
                },
                {
                  text: "Position",
                  value: "translation",
                },
                {
                  text: "Rotation",
                  value: "rotation",
                },
                //{text: "Area", value: "area"},
                {
                  text: "Volume",
                  value: "volume",
                },
                {
                  text: "Collision Groups",
                  value: "collisionGroups",
                },
                //{text: "Collision Mask", value: "collisionMask"},
                //{text: "Is Enabled?", value: "enabled"},
                //{text: "Contact Count", value: "contactCount"},
                //{text: "RigidBody Handle", value: "rigidBody"}
              ],
            },
            colliderSets: {
              acceptReporters: false,
              items: [{
                  text: "Friction",
                  value: "setFriction",
                },
                {
                  text: "Restitution",
                  value: "setRestitution",
                },
                {
                  text: "Density",
                  value: "setDensity",
                },
                {
                  text: "Is Sensor?",
                  value: "setSensor",
                },
                {
                  text: "Collision Groups",
                  value: "setCollisionGroups",
                },
                //{text: "Enabled", value: "enabled"},                 // object.collider.enabled = bool
                //{text: "Position Offset", value: "setTranslation"},
                //{text: "Rotation Offset", value: "setRotation"}
              ],
            },
            state: {
              acceptReporters: true,
              items: [{
                  text: "on",
                  value: "true",
                },
                {
                  text: "off",
                  value: "false",
                },
              ],
            },
            state2: {
              acceptReporters: true,
              items: [{
                  text: "false",
                  value: "false",
                },
                {
                  text: "true (must be fixed)",
                  value: "true",
                },
              ],
            },
            spaces: {
              acceptReporters: false,
              items: [{
                  text: "World",
                  value: "world",
                },
                {
                  text: "Local",
                  value: "local",
                },
              ],
            },
            objectTypes: {
              acceptReporters: false,
              items: [{
                  text: "Dynamic",
                  value: "dynamic",
                },
                {
                  text: "Fixed",
                  value: "fixed",
                },
                {
                  text: "Kinematic Position Based",
                  value: "kinematicPositionBased",
                },
              ],
            },
            colliderTypes: {
              acceptReporters: false,
              items: [{
                  text: "Box, Rectangle, cuboid",
                  value: "cuboid",
                },
                {
                  text: "Sphere, ball",
                  value: "ball",
                },
                {
                  text: "Custom, complex simple shapes, convexHull",
                  value: "convexHull",
                },
                {
                  text: "Precision, TriMesh",
                  value: "trimesh",
                },
              ],
            },
            forces: {
              acceptReporters: false,
              items: [{
                  text: "Force",
                  value: "addForce",
                },
                {
                  text: "Torque (rotation)",
                  value: "addTorque",
                },
                {
                  text: "Apply Impulse",
                  value: "applyImpulse",
                },
                {
                  text: "Apply Torque Impulse (rotation)",
                  value: "applyTorqueImpulse",
                },
                {
                  text: "Linear Velocity",
                  value: "setLinvel",
                },
                {
                  text: "Angular Velocity",
                  value: "setAngvel",
                },
              ],
            },
            resetF: {
              acceptReporters: false,
              items: [{
                  text: "Forces",
                  value: "resetForces",
                },
                {
                  text: "Torques",
                  value: "resetTorques",
                },
              ],
            },
          },
        };
      }
      joint(jointData, bodyA, bodyB) {
        if (!physicsWorld || !bodyA || !bodyB) return;
        physicsWorld.createImpulseJoint(jointData, bodyA.rigidBody, bodyB.rigidBody, true);
      }

      fixedJoint(args) {
        const VA = JSON.parse(args.VA).map(Number);
        const VB = JSON.parse(args.VB).map(Number);
        let RA = JSON.parse(args.RA).map(Number);
        let RB = JSON.parse(args.RB).map(Number);

        RA = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(
            THREE.MathUtils.degToRad(RA[0]),
            THREE.MathUtils.degToRad(RA[1]),
            THREE.MathUtils.degToRad(RA[2])
          )
        );
        RB = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(
            THREE.MathUtils.degToRad(RB[0]),
            THREE.MathUtils.degToRad(RB[1]),
            THREE.MathUtils.degToRad(RB[2])
          )
        );

        const data = RAPIER.JointData.fixed({
            x: VA[0],
            y: VA[1],
            z: VA[2],
          },
          RA, {
            x: VB[0],
            y: VB[1],
            z: VB[2],
          },
          RB
        );
        const objectA = getObject(args.ObjA);
        let object = getObject(args.ObjB);
        this.joint(data, objectA, object);
      }

      sphericalJoint(args) {
        const VA = JSON.parse(args.VA).map(Number);
        const VB = JSON.parse(args.VB).map(Number);

        const data = RAPIER.JointData.spherical({
          x: VA[0],
          y: VA[1],
          z: VA[2],
        }, {
          x: VB[0],
          y: VB[1],
          z: VB[2],
        });
        const objectA = getObject(args.ObjA);
        let object = getObject(args.ObjB);
        this.joint(data, objectA, object);
      }

      revoluteJoint(args) {
        const VA = JSON.parse(args.VA).map(Number);
        const VB = JSON.parse(args.VB).map(Number);
        const x = JSON.parse(args.X).map(Number);

        const data = RAPIER.JointData.revolute({
          x: VA[0],
          y: VA[1],
          z: VA[2],
        }, {
          x: VB[0],
          y: VB[1],
          z: VB[2],
        }, {
          x: x[0],
          y: x[1],
          z: x[2],
        });
        const objectA = getObject(args.ObjA);
        let object = getObject(args.ObjB);
        this.joint(data, objectA, object);
      }

      prismaticJoint(args) {
        const VA = JSON.parse(args.VA).map(Number);
        const VB = JSON.parse(args.VB).map(Number);
        const x = JSON.parse(args.X).map(Number);

        const data = RAPIER.JointData.prismatic({
          x: VA[0],
          y: VA[1],
          z: VA[2],
        }, {
          x: VB[0],
          y: VB[1],
          z: VB[2],
        }, {
          x: x[0],
          y: x[1],
          z: x[2],
        });
        const objectA = getObject(args.ObjA);
        let object = getObject(args.ObjB);
        this.joint(data, objectA, object);
      }

      createWorld(args) {
        const v3 = JSON.parse(args.G).map(Number);
        const gravity = {
          x: v3[0],
          y: v3[1],
          z: v3[2],
        };
        physicsWorld = new RAPIER.World(gravity);

        console.log(physicsWorld);
      }

      getWorld(args) {
        if (!physicsWorld) return "null";
        if (args.PROPERTY === "log") {
          console.log(physicsWorld);
          return "logged";
        }
        return JSON.stringify(physicsWorld[args.PROPERTY]);
      }

      setRB(args) {
        let value = args.VALUE;
        if (args.VALUE === "true" || args.VALUE === "false") value = !!args.VALUE;
        let object = getObject(args.OBJECT);
        if (!object || !object.rigidBody) return;
        object.rigidBody[args.PROPERTY](value);
      }
      setC(args) {
        let value = args.VALUE;
        if (args.VALUE === "true" || args.VALUE === "false") value = !!args.VALUE;
        let object = getObject(args.OBJECT);
        if (!object || !object.collider) return;
        object.collider[args.PROPERTY](value);
      }

      getRB(args) {
        let object = getObject(args.OBJECT);
        if (!object || !object.rigidBody) return "null";
        return JSON.stringify(object.rigidBody[args.PROPERTY]());
      }
      getC(args) {
        let object = getObject(args.OBJECT);
        if (!object || !object.collider) return "null";
        return JSON.stringify(object.collider[args.PROPERTY]());
      }

      lockObjectAxis(args) {
        let object = getObject(args.OBJECT);
        if (!object || !object.rigidBody) return;
        
        const x = !JSON.parse(args.X);
        const y = !JSON.parse(args.Y);
        const z = !JSON.parse(args.Z);
        object.rigidBody[args.PROPERTY](x, y, z, true); //changes is xyz, wake up
      }

      objectPhysics(args) {
        let object = getObject(args.OBJECT);
        if (!object) return;
        
        object.physics = JSON.parse(args.state);

        if (JSON.parse(args.state)) {
          //if already exists delete:
          if (object.rigidBody) {
            if (physicsWorld) {
              physicsWorld.removeRigidBody(object.rigidBody);
            }
            object.rigidBody = null;
            object.collider = null;
          }
          
          if (!physicsWorld) {
            console.error("Physics world not created!");
            return;
          }
          
          /*asing a rigidbody and collider to object and add them to physicsWorld*/
          let rigidBodyDesc = RAPIER.RigidBodyDesc[args.type]()
            .setTranslation(object.position.x, object.position.y, object.position.z)
            .setRotation({
              w: object.quaternion._w,
              x: object.quaternion._x,
              y: object.quaternion._y,
              z: object.quaternion._z,
            });

          let colliderDesc;
          switch (args.collider) {
            case "cuboid":
              colliderDesc = createCuboidCollider(object);
              break;
            case "ball":
              colliderDesc = createBallCollider(object);
              break;
            case "convexHull":
              colliderDesc = createConvexHullCollider(object);
              break;
            case "trimesh":
              colliderDesc = TriMesh(object);
              break;
            default:
              console.error("Unknown collider type:", args.collider);
              return;
          }
          
          if (!colliderDesc) return;
          
          colliderDesc
            .setSensor(JSON.parse(args.state2))
            .setMass(args.mass)
            .setDensity(args.density)
            .setFriction(args.friction);

          let rigidBody = physicsWorld.createRigidBody(rigidBodyDesc);
          let collider = physicsWorld.createCollider(colliderDesc, rigidBody);

          object.rigidBody = rigidBody;
          object.collider = collider;
        } else {
          /*if disabling physics, delete rigidbody and collider from physicsWorld and object*/
          if (physicsWorld && object.rigidBody) {
            physicsWorld.removeRigidBody(object.rigidBody);
          }
          object.rigidBody = null;
          object.collider = null;
        }
      }

      enableCCD(args) {
        let object = getObject(args.OBJECT);
        if (object && object.physics && object.rigidBody) {
          let rigidBody = object.rigidBody;
          rigidBody.enableCcd(JSON.parse(args.state));
        }
      }

      addForce(args) {
        let object = getObject(args.OBJECT);
        if (!object || !object.rigidBody) return;
        
        const vector = JSON.parse(args.VALUE).map(Number);

        let force = new THREE.Vector3(vector[0], vector[1], vector[2]);
        if (args.SPACE === "local") {
          force.applyQuaternion(object.quaternion);
        }

        object.rigidBody[args.PROPERTY](force, true);
      }

      resetForces(args) {
        let object = getObject(args.OBJECT);
        if (!object || !object.rigidBody) return;
        
        object.rigidBody[args.PROPERTY](true);
      }

      sensorSingle(args) {
        const sensor = getObject(args.SENSOR);
        if (!sensor || !sensor.collider || !physicsWorld) return false;

        let object = getObject(args.OBJECT);
        if (!object || !object.collider) return false;

        let touching = false;
        physicsWorld.intersectionPairsWith(sensor.collider, (otherCollider) => {
          if (otherCollider === object.collider) touching = true;
        });

        return touching;
      }

      sensorAll(args) {
        const sensor = getObject(args.SENSOR);
        if (!sensor || !sensor.collider || !physicsWorld) return "[]";

        const touchedObjects = [];

        // loop through every collider touching sensor
        physicsWorld.intersectionPairsWith(sensor.collider, (otherCollider) => {
          // find owner of collider
          const scene = getCurrentScene();
          if (!scene) return;
          
          const otherObject = scene.children.find((o) => o.collider === otherCollider);
          if (otherObject) touchedObjects.push(otherObject.name);
        });

        return JSON.stringify(touchedObjects);
      }
    }
    Scratch.extensions.register(new RapierPhysics());

    //Thanks to the PointerLock extension of Turbowarp
    const mouse = vm.runtime.ioDevices.mouse;
    let isLocked = false;
    let isPointerLockEnabled = false;

    let rect = threeRenderer.domElement.getBoundingClientRect();
    document.addEventListener("resize", () => {
      rect = threeRenderer.domElement.getBoundingClientRect();
    });

    const postMouseData = (e, isDown) => {
      const {
        movementX,
        movementY
      } = e;
      const {
        width,
        height
      } = rect;
      const x = mouse._clientX + movementX;
      const y = mouse._clientY - movementY;
      mouse._clientX = x;
      mouse._scratchX = mouse.runtime.stageWidth * (x / width - 0.5);
      mouse._clientY = y;
      mouse._scratchY = mouse.runtime.stageHeight * (y / height - 0.5);
      if (typeof isDown === "boolean") {
        const data = {
          button: e.button,
          isDown,
        };
        originalPostIOData(data);
      }
    };

    const mouseDevice = vm.runtime.ioDevices.mouse;
    const originalPostIOData = mouseDevice.postData.bind(mouseDevice);
    mouseDevice.postData = (data) => {
      if (!isPointerLockEnabled) {
        return originalPostIOData(data);
      }
    };

    document.addEventListener(
      "mousedown",
      (e) => {
        // @ts-expect-error
        if (threeRenderer.domElement.contains(e.target)) {
          if (isLocked) {
            postMouseData(e, true);
          } else if (isPointerLockEnabled) {
            threeRenderer.domElement.requestPointerLock();
          }
        }
      },
      true
    );
    document.addEventListener(
      "mouseup",
      (e) => {
        if (isLocked) {
          postMouseData(e, false);
          // @ts-expect-error
        } else if (isPointerLockEnabled && threeRenderer.domElement.contains(e.target)) {
          threeRenderer.domElement.requestPointerLock();
        }
      },
      true
    );
    document.addEventListener(
      "mousemove",
      (e) => {
        if (isLocked) {
          postMouseData(e);
        }
      },
      true
    );

    document.addEventListener("pointerlockchange", () => {
      isLocked = document.pointerLockElement === threeRenderer.domElement;
    });
    document.addEventListener("pointerlockerror", (e) => {
      console.error("Pointer lock error", e);
    });

    const oldStep = vm.runtime._step;
    vm.runtime._step = function(...args) {
      const ret = oldStep.call(this, ...args);
      if (isPointerLockEnabled) {
        const {
          width,
          height
        } = rect;
        mouse._clientX = width / 2;
        mouse._clientY = height / 2;
        mouse._scratchX = 0;
        mouse._scratchY = 0;
      }
      return ret;
    };

    vm.runtime.on("PROJECT_LOADED", () => {
      isPointerLockEnabled = false;
      if (isLocked) {
        document.exitPointerLock();
      }
    });

    class Pointerlock {
      getInfo() {
        return {
          id: "threepointerlockmod",
          name: "Pointerlock for Extra 3D",
          color1: "#8a8a8aff",
          color2: "#222222",
          color3: "#222222",

          blocks: [{
              opcode: "setLocked",
              blockType: Scratch.BlockType.COMMAND,
              text: "set pointer lock [enabled]",
              arguments: {
                enabled: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: "true",
                  menu: "enabled",
                },
              },
            },
            {
              opcode: "isLocked",
              blockType: Scratch.BlockType.BOOLEAN,
              text: "pointer locked?",
            },
          ],
          menus: {
            enabled: {
              acceptReporters: true,
              items: [{
                  text: "enabled",
                  value: "true",
                },
                {
                  text: "disabled",
                  value: "false",
                },
              ],
            },
          },
        };
      }

      setLocked(args) {
        isPointerLockEnabled = Scratch.Cast.toBoolean(args.enabled) === true;
        if (!isPointerLockEnabled && isLocked) {
          document.exitPointerLock();
        }
      }

      isLocked() {
        return isLocked;
      }
    }
    Scratch.extensions.register(new Pointerlock());
  });
})(Scratch);
