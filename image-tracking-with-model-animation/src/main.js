import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod";
import { loadTextures, loadVideo, loadGLTF } from "./helpers/loader.js";

document.addEventListener("DOMContentLoaded", () => {
  let stats;

  const start = async () => {
    // stats = new Stats();
    // document.body.appendChild(stats.dom);

    // initialize MindAR
    const mindarThree = new MindARThree({
      container: document.body,
      imageTargetSrc: "./assets/targets/targets.mind",
      // filterMinCF: 0.0001,
      // filterBeta: 0.0001,
      // missTolerance: 0,
      // warmupTolerance: 0,
      uiScanning: false,
      uiLoading: "no",
      // maxTrack: 3,
    });

    const { renderer, scene, camera } = mindarThree;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);

    const anchor = mindarThree.addAnchor(0);

    const model = await loadGLTF('./assets/models/pikachu/scene.gltf');
    model.scene.scale.set(0.5, 0.5, 0.5);
    model.scene.position.set(0, 0, 0);
    anchor.group.add(model.scene);
    // anchor.onTargetFound = () => {
    //   debugger;
    //   // console.log('found');
    // }

    await mindarThree.start();

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
      // stats.update();
    });
  };

  start();
});
