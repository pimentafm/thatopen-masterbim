import * as React from "react";
import { useEffect } from "react";
import * as THREE from "three";
import * as OBC from "@thatopen/components"

export function IFCViewer() {
  const  setViewer = () => {
    const viewer = new OBC.Components();
    const worlds = viewer.get(OBC.Worlds)

    const world = worlds.create<
    OBC.SimpleScene,
    OBC.OrthoPerspectiveCamera,
    OBC.SimpleRenderer
    >()

    const sceneComponent = new OBC.SimpleScene(viewer);
    world.scene = sceneComponent;
    world.scene.setup()
    world.scene.three.background = null;

    const viewerContainer = document.getElementById("viewer-container") as HTMLElement
    const rendererComponent = new OBC.SimpleRenderer(viewer, viewerContainer)
    world.renderer = rendererComponent

    const cameraComponent = new OBC.OrthoPerspectiveCamera(viewer)
    world.camera = cameraComponent

    viewer.init()

    const material = new THREE.MeshLambertMaterial({ color: "#6528D7" })
    const geometry = new THREE.BoxGeometry()
    const cube = new THREE.Mesh(geometry, material)
    world.scene.three.add(cube)

    world.camera.controls.setLookAt(3,3,3,0,0,0)
    world.camera.updateAspect();
  }

  useEffect(() => {
    setViewer();

    return () => {

    }
  }, []);

  return (
    <div
      id="viewer-container"
      className="dashboard-card"
      style={{ minWidth: 0 }}
    />
  );
}
