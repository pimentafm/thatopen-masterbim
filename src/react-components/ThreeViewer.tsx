import * as React from "react";
import { useEffect } from "react";

import * as THREE from "three";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";

export function ThreeViewer() {
  useEffect(() => {
    const scene = new THREE.Scene();
    const viewerContainer = document.getElementById(
      "viewer-container"
    ) as HTMLElement;
    const camera = new THREE.PerspectiveCamera(75);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    viewerContainer.append(renderer.domElement);

    function resizeViewer() {
      const containerDimensions = viewerContainer.getBoundingClientRect();
      renderer.setSize(containerDimensions.width, containerDimensions.height);
      const aspectRatio =
        containerDimensions.width / containerDimensions.height;
      camera.aspect = aspectRatio;
      camera.updateProjectionMatrix();
    }

    window.addEventListener("resize", resizeViewer);

    resizeViewer();

    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial();
    const cube = new THREE.Mesh(boxGeometry, material);

    const directionalLight = new THREE.DirectionalLight();
    const ambientLight = new THREE.AmbientLight();
    ambientLight.intensity = 0.4;

    scene.add(directionalLight, ambientLight);

    const cameraControls = new OrbitControls(camera, viewerContainer);

    function renderScene() {
      renderer.render(scene, camera);
      requestAnimationFrame(renderScene);
    }

    renderScene();

    const axes = new THREE.AxesHelper();
    const grid = new THREE.GridHelper();

    grid.material.transparent = true;
    grid.material.opacity = 0.4;
    grid.material.color = new THREE.Color("#808080");

    scene.add(axes, grid);

    const gui = new GUI();
    const cubeControls = gui.addFolder("Cube");

    cubeControls.add(cube.position, "x", -10, 10, 1);
    cubeControls.add(cube.position, "y", -10, 10, 1);
    cubeControls.add(cube.position, "z", -10, 10, 1);
    cubeControls.add(cube, "visible");
    cubeControls.addColor(cube.material, "color");
    cubeControls.add(cube.material, "wireframe");
    cubeControls.add(cube.rotation, "x", 0, Math.PI * 2, 0.1);
    cubeControls.add(cube.rotation, "y", 0, Math.PI * 2, 0.1);
    cubeControls.add(cube.rotation, "z", 0, Math.PI * 2, 0.1);
    cubeControls.add(cube.material, "metalness", 0, 1, 0.01);

    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();

    mtlLoader.load("../assets/Gear/Gear1.mtl", (materials) => {
      materials.preload();
      objLoader.setMaterials(materials);

      objLoader.load("../assets/Gear/Gear1.obj", (mesh) => {
        scene.add(mesh);
      });
    });
  }, []);

  return (
    <div
      id="viewer-container"
      className="dashboard-card"
      style={{ minWidth: 0 }}
    />
  );
}
