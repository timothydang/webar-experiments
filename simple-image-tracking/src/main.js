import * as THREE from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { MindARThree } from "mind-ar/dist/mindar-image-three.prod";
import { mockWithVideo } from "./helpers/camera-mock";
import { loadTextures, loadVideo, loadGLTF } from "./helpers/loader.js";

document.addEventListener("DOMContentLoaded", () => {
  let stats;
  const pointer = new THREE.Vector2();

  const start = async () => {
    stats = new Stats();
    document.body.appendChild(stats.dom);

    // initialize MindAR
    const mindarThree = new MindARThree({
      container: document.body,
      imageTargetSrc: "./assets/targets/mg-targets.mind",
      filterMinCF: 0.0001,
      filterBeta: 0.0001,
      // missTolerance: 0,
      // warmupTolerance: 0,
      uiScanning: false,
      uiLoading: "no",
      maxTrack: 3,
    });

    const { renderer, scene, camera } = mindarThree;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    scene.add(light);
    const principles = [
      {
        name: "p-communicate-directly",
        url: "./assets/images/p-communicate-directly-typography.png",
      },
      {
        name: "p-in-it-together",
        url: "./assets/images/p-in-it-together-typography.png",
      },
      {
        name: "p-love-what-you-do",
        url: "./assets/images/p-love-what-you-do-typography.png",
      },
      {
        name: "p-make-good-choices",
        url: "./assets/images/p-make-good-choices-typography.png",
      },
      {
        name: "p-make-things-better",
        url: "./assets/images/p-make-things-better-typography.png",
      },
    ];

    const textures = await loadTextures(principles.map((p) => p.url));

    const planeGeometry = new THREE.PlaneGeometry(1, 1);
    for (let i = 0; i < principles.length; i++) {
      const emailMaterial = new THREE.MeshBasicMaterial({
        map: textures[i],
        transparent: true,
      });

      const principleImage = new THREE.Mesh(planeGeometry, emailMaterial);
      principleImage.visible = false;
      const anchor = mindarThree.addAnchor(i);
      anchor.group.add(principleImage);
      anchor.onTargetFound = () => {
        principleImage.visible = true;
      };
      anchor.onTargetLost = () => {
        principleImage.visible = false;
      };
      principleImage.userData.clickable = true;
      principleImage.userData.name = principles[i].name;
    }

    const raycaster = new THREE.Raycaster();
    document.body.addEventListener("click", (e) => {
      e.preventDefault();
      const mouse = new THREE.Vector2(pointer.x, pointer.y);
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length > 0) {
        let o = intersects.find(
          (intersect) => intersect.object.visible
        )?.object;
        if (!o) return;
        while (o.parent && !o.userData.clickable) {
          o = o.parent;
        }
        if (o.userData?.clickable) {
          if (o.userData.name === "p-make-things-better") {
            window.open(
              `https://mantelgroup.com.au/our-principles/#${o.userData?.name}`,
              "_blank"
            );
          }
        }
      }
    });

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
      stats.update();
    });
  };

  function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  window.addEventListener("pointermove", onPointerMove);

  start();
});
