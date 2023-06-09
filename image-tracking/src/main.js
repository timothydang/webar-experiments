import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { MindARThree } from "mindar-image-three";
import { mockWithVideo } from "./helpers/camera-mock";
import { loadTextures } from "./helpers/loader.js";

document.addEventListener("DOMContentLoaded", () => {
  let stats;
  const pointer = new THREE.Vector2();

  const start = async () => {
    // mockWithVideo("./assets/mock-videos/mg-principle-1.mp4");
    // mockWithVideo("./assets/mock-videos/mg-logos.mp4");
    stats = new Stats();
    // document.body.appendChild(stats.dom);

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
      // maxTrack: 3,
    });

    const { renderer, scene, camera } = mindarThree;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

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

    const brandLogos = ["digio-logo", "mantel-group-logo"];

    const textures = await loadTextures(principles.map((p) => p.url));
    const group = new THREE.Group();

    for (let i = 0; i < principles.length; i++) {
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
        })
      );

      const cardGeometry = new THREE.PlaneGeometry(1, 1);
      const cardMaterial = new THREE.MeshBasicMaterial({
        map: textures[i],
        transparent: true,
        // depthWrite: false,
      });
      const card = new THREE.Mesh(cardGeometry, cardMaterial);

      // Positioning
      // plane.position.y = 1;
      plane.scale.set(1.4, 1.4, 1.4);
      if (i === 2) {
        plane.rotation.z = -Math.PI / 4;
      }
      // plane.add(card);

      plane.userData.clickable = true;
      plane.userData.name = principles[i].name;
      plane.visible = false;
      group.add(plane);

      const anchor = mindarThree.addAnchor(i);
      anchor.group.add(plane);
    }

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
      stats.update();
    });

    const raycaster = new THREE.Raycaster();

    document.body.addEventListener("click", (e) => {
      e.preventDefault();
      console.log(e.target);
      console.log(scene.children);
      // const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      // const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      const mouse = new THREE.Vector2(pointer.x, pointer.y);
      raycaster.setFromCamera(mouse, camera);
      // const planes = scene.children.map(c => c.children[0]);
      // console.log(planes);
      const intersects = raycaster.intersectObjects(scene.children, true);

      // console.log(intersects);
      if (intersects.length > 0) {
        const o = intersects[0].object;
        // while (o.parent && !o.userData.clickable) {
        //   o = o.parent;
        // }
        console.log(o);

        if (o.userData?.clickable) {
          window.open(
            `https://mantelgroup.com.au/our-principles/#${o.userData?.name}`,
            "_blank"
          );
        }
      }
    });

    await mindarThree.start();
  };

  function onPointerMove(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  window.addEventListener("pointermove", onPointerMove);

  start();
});

// document.addEventListener("DOMContentLoaded", () => {
//   const start = async () => {
//     mockWithVideo("./assets/mock-videos/portfolio1.mp4");

//     // initialize MindAR
//     const mindarThree = new window.MINDAR.IMAGE.MindARThree({
//       container: document.body,
//       imageTargetSrc: "./assets/targets/card.mind",
//     });
//     const { renderer, cssRenderer, scene, cssScene, camera } = mindarThree;

//     const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
//     scene.add(light);

//     const [
//       cardTexture,
//       emailTexture,
//       locationTexture,
//       webTexture,
//       profileTexture,
//       leftTexture,
//       rightTexture,
//       portfolioItem0Texture,
//       portfolioItem1Texture,
//       portfolioItem2Texture,
//     ] = await loadTextures([
//       "./assets/targets/card.png",
//       "./assets/portfolio/icons/email.png",
//       "./assets/portfolio/icons/location.png",
//       "./assets/portfolio/icons/web.png",
//       "./assets/portfolio/icons/profile.png",
//       "./assets/portfolio/icons/left.png",
//       "./assets/portfolio/icons/right.png",
//       "./assets/portfolio/portfolio/paintandquest-preview.png",
//       "./assets/portfolio/portfolio/coffeemachine-preview.png",
//       "./assets/portfolio/portfolio/peak-preview.png",
//     ]);

//     const planeGeometry = new THREE.PlaneGeometry(1, 0.552);
//     const cardMaterial = new THREE.MeshBasicMaterial({ map: cardTexture });
//     const card = new THREE.Mesh(planeGeometry, cardMaterial);

//     const iconGeometry = new THREE.CircleGeometry(0.075, 32);
//     const emailMaterial = new THREE.MeshBasicMaterial({ map: emailTexture });
//     const webMaterial = new THREE.MeshBasicMaterial({ map: webTexture });
//     const profileMaterial = new THREE.MeshBasicMaterial({
//       map: profileTexture,
//     });
//     const locationMaterial = new THREE.MeshBasicMaterial({
//       map: locationTexture,
//     });
//     const leftMaterial = new THREE.MeshBasicMaterial({ map: leftTexture });
//     const rightMaterial = new THREE.MeshBasicMaterial({ map: rightTexture });
//     const emailIcon = new THREE.Mesh(iconGeometry, emailMaterial);
//     const webIcon = new THREE.Mesh(iconGeometry, webMaterial);
//     const profileIcon = new THREE.Mesh(iconGeometry, profileMaterial);
//     const locationIcon = new THREE.Mesh(iconGeometry, locationMaterial);
//     const leftIcon = new THREE.Mesh(iconGeometry, leftMaterial);
//     const rightIcon = new THREE.Mesh(iconGeometry, rightMaterial);

//     const portfolioItem0Video = await loadVideo(
//       "../../assets/portfolio/portfolio/paintandquest.mp4"
//     );
//     portfolioItem0Video.muted = true;
//     const portfolioItem0VideoTexture = new THREE.VideoTexture(
//       portfolioItem0Video
//     );
//     const portfolioItem0VideoMaterial = new THREE.MeshBasicMaterial({
//       map: portfolioItem0VideoTexture,
//     });
//     const portfolioItem0Material = new THREE.MeshBasicMaterial({
//       map: portfolioItem0Texture,
//     });
//     const portfolioItem1Material = new THREE.MeshBasicMaterial({
//       map: portfolioItem1Texture,
//     });
//     const portfolioItem2Material = new THREE.MeshBasicMaterial({
//       map: portfolioItem2Texture,
//     });

//     const portfolioItem0V = new THREE.Mesh(
//       planeGeometry,
//       portfolioItem0VideoMaterial
//     );
//     const portfolioItem0 = new THREE.Mesh(
//       planeGeometry,
//       portfolioItem0Material
//     );
//     const portfolioItem1 = new THREE.Mesh(
//       planeGeometry,
//       portfolioItem1Material
//     );
//     const portfolioItem2 = new THREE.Mesh(
//       planeGeometry,
//       portfolioItem2Material
//     );

//     profileIcon.position.set(-0.42, -0.5, 0);
//     webIcon.position.set(-0.14, -0.5, 0);
//     emailIcon.position.set(0.14, -0.5, 0);
//     locationIcon.position.set(0.42, -0.5, 0);

//     const portfolioGroup = new THREE.Group();
//     portfolioGroup.position.set(0, 0, -0.01);
//     portfolioGroup.position.set(0, 0.6, -0.01);

//     portfolioGroup.add(portfolioItem0);
//     portfolioGroup.add(leftIcon);
//     portfolioGroup.add(rightIcon);
//     leftIcon.position.set(-0.7, 0, 0);
//     rightIcon.position.set(0.7, 0, 0);

//     const avatar = await loadGLTF("../../assets/models/softmind/scene.gltf");
//     avatar.scene.scale.set(0.004, 0.004, 0.004);
//     avatar.scene.position.set(0, -0.25, -0.3);

//     const anchor = mindarThree.addAnchor(0);
//     anchor.group.add(avatar.scene);
//     anchor.group.add(card);
//     anchor.group.add(emailIcon);
//     anchor.group.add(webIcon);
//     anchor.group.add(profileIcon);
//     anchor.group.add(locationIcon);
//     anchor.group.add(portfolioGroup);

//     const textElement = document.createElement("div");
//     const textObj = new CSS3DObject(textElement);
//     textObj.position.set(0, -1000, 0);
//     textObj.visible = false;
//     textElement.style.background = "#FFFFFF";
//     textElement.style.padding = "30px";
//     textElement.style.fontSize = "60px";

//     const cssAnchor = mindarThree.addCSSAnchor(0);
//     cssAnchor.group.add(textObj);

//     // handle buttons
//     leftIcon.userData.clickable = true;
//     rightIcon.userData.clickable = true;
//     emailIcon.userData.clickable = true;
//     webIcon.userData.clickable = true;
//     profileIcon.userData.clickable = true;
//     locationIcon.userData.clickable = true;
//     portfolioItem0.userData.clickable = true;
//     portfolioItem0V.userData.clickable = true;

//     const portfolioItems = [portfolioItem0, portfolioItem1, portfolioItem2];
//     let currentPortfolio = 0;

//     document.body.addEventListener("click", (e) => {
//       const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
//       const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
//       const mouse = new THREE.Vector2(mouseX, mouseY);
//       const raycaster = new THREE.Raycaster();
//       raycaster.setFromCamera(mouse, camera);
//       const intersects = raycaster.intersectObjects(scene.children, true);

//       if (intersects.length > 0) {
//         let o = intersects[0].object;
//         while (o.parent && !o.userData.clickable) {
//           o = o.parent;
//         }
//         if (o.userData.clickable) {
//           if (o === leftIcon || o === rightIcon) {
//             if (o === leftIcon) {
//               currentPortfolio =
//                 (currentPortfolio - 1 + portfolioItems.length) %
//                 portfolioItems.length;
//             } else {
//               currentPortfolio = (currentPortfolio + 1) % portfolioItems.length;
//             }
//             portfolioItem0Video.pause();
//             for (let i = 0; i < portfolioItems.length; i++) {
//               portfolioGroup.remove(portfolioItems[i]);
//             }
//             portfolioGroup.add(portfolioItems[currentPortfolio]);
//           } else if (o === portfolioItem0) {
//             portfolioGroup.remove(portfolioItem0);
//             portfolioGroup.add(portfolioItem0V);
//             portfolioItems[0] = portfolioItem0V;
//             portfolioItem0Video.play();
//           } else if (o === portfolioItem0V) {
//             if (portfolioItem0Video.paused) {
//               portfolioItem0Video.play();
//             } else {
//               portfolioItem0Video.pause();
//             }
//           } else if (o === webIcon) {
//             textObj.visible = true;
//             textElement.innerHTML = "https://github.com/hiukim/mind-ar-js";
//           } else if (o === emailIcon) {
//             textObj.visible = true;
//             textElement.innerHTML = "hiukim528 [at] gmail";
//           } else if (o === profileIcon) {
//             textObj.visible = true;
//             textElement.innerHTML = "https://hiukim.com";
//           } else if (o === locationIcon) {
//             textObj.visible = true;
//             textElement.innerHTML = "Vancouver, Canada";
//           }
//         }
//       }
//     });

//     const clock = new THREE.Clock();
//     await mindarThree.start();
//     renderer.setAnimationLoop(() => {
//       const delta = clock.getDelta();
//       const elapsed = clock.getElapsedTime();
//       const iconScale = 1 + 0.2 * Math.sin(elapsed * 5);
//       [webIcon, emailIcon, profileIcon, locationIcon].forEach((icon) => {
//         icon.scale.set(iconScale, iconScale, iconScale);
//       });

//       const avatarZ = Math.min(0.3, -0.3 + elapsed * 0.5);
//       avatar.scene.position.set(0, -0.25, avatarZ);

//       renderer.render(scene, camera);
//       cssRenderer.render(cssScene, camera);
//     });
//   };
//   start();
// });
