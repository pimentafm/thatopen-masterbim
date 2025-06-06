import * as React from "react";
import { useEffect } from "react";
import * as OBC from "@thatopen/components"
import * as OBCF from "@thatopen/components-front";
import * as BUI from "@thatopen/ui";
import * as CUI from "@thatopen/ui-obc";
import { FragmentsGroup } from "@thatopen/fragments"
import { float } from "three/examples/jsm/nodes/Nodes.js";

export function IFCViewer() {
  const components = new OBC.Components();
  let fragmentModel: FragmentsGroup | undefined;

  const  setViewer = () => {
    const worlds = components.get(OBC.Worlds)

    const world = worlds.create<
      OBC.SimpleScene,
      OBC.OrthoPerspectiveCamera,
      OBCF.PostproductionRenderer
    >()

    const sceneComponent = new OBC.SimpleScene(components);
    world.scene = sceneComponent;
    world.scene.setup()

    const viewerContainer = document.getElementById("viewer-container") as HTMLElement
    const rendererComponent = new OBCF.PostproductionRenderer(components, viewerContainer)
    world.renderer = rendererComponent

    const cameraComponent = new OBC.OrthoPerspectiveCamera(components)
    world.camera = cameraComponent

    components.init()

    world.renderer.postproduction.enabled = true;
    world.camera.controls.setLookAt(3,3,3,0,0,0)
    world.camera.updateAspect();

    const ifcLoader = components.get(OBC.IfcLoader)
    ifcLoader.setup()

    const fragmentsManager = components.get(OBC.FragmentsManager)
    fragmentsManager.onFragmentsLoaded.add( async (model) => {
      console.log("Fragments loaded", model)
      world.scene.three.add(model)

      const indexer = components.get(OBC.IfcRelationsIndexer)
      await indexer.process(model)

      fragmentModel = model
    })

    const highlighter = components.get(OBCF.Highlighter)
    highlighter.setup({ world })
    highlighter.zoomToSelection = true;

    viewerContainer.addEventListener("recsize", () => {
      rendererComponent.resize()
      cameraComponent.updateAspect();
    })
  }

  const onToggleVisibility = () => {
    const highlighter = components.get(OBCF.Highlighter)
    const fragments = components.get(OBC.FragmentsManager)
    const selection = highlighter.selection.select
    if (Object.keys(selection).length === 0) return
    for (const fragmentID in selection) {
      const fragment = fragments.list.get(fragmentID)
      const expressIDs = selection[fragmentID]
      for (const id of expressIDs) {
        if (!fragment) continue
          const isHidden = fragment.hiddenItems.has(id)
          if (isHidden) {
            fragment.setVisibility(true, [id])
          } else {
            fragment.setVisibility(false, [id])
          }
      }
    }
  }

  const onIsolate = () => {
    const highlighter = components.get(OBCF.Highlighter)
    const hider = components.get(OBC.Hider)
    const selection = highlighter.selection.select
    hider.isolate(selection)
  }

  const onShow = () => {
    const hider = components.get(OBC.Hider)
    hider.set(true)
  }
  const onShowProperties = async () => {
    if(!fragmentModel) return;
    const highlighter = components.get(OBCF.Highlighter)
    const selection = highlighter.selection.select
    const indexer = components.get(OBC.IfcRelationsIndexer)
    for (const fragmentID in selection) {
      const expressIDs = selection[fragmentID]
      for (const id of expressIDs) {
        const psets = indexer.getEntityRelations(fragmentModel, id, "ContainedInStructure")
        if (psets) {
          for (const expressId of psets) {
            const prop = await fragmentModel.getProperties(expressId)
          }
        }
      }
    }
  }

  const setupUI = () => {
    const viewerContainer = document.getElementById("viewer-container") as HTMLElement
    if (!viewerContainer) return;

    const floatingGrid = BUI.Component.create<BUI.Grid>(() => {
      return BUI.html `
        <bim-grid
          floating
          style="padding: 20px"
        >
        </bim-grid>
        `
    });

    const elementPropertyPanel = BUI.Component.create<BUI.Panel>(() => {
      const [propsTable, updatePropsTable] = CUI.tables.elementProperties({
        components,
        fragmentIdMap: {}
      })

      const highlighter = components.get(OBCF.Highlighter)
      highlighter.events.select.onHighlight.add((fragmentIdMap) => {
        if (!floatingGrid) return
        floatingGrid.layout = "second"
        updatePropsTable({ fragmentIdMap })
        propsTable.expanded = false
      })

      highlighter.events.select.onClear.add(() => {
        updatePropsTable({ fragmentIdMap: {} })
        if (!floatingGrid) return
        floatingGrid.layout = "main"
      })

      const search = (e: Event) => {
        const input = e.target as BUI.TextInput
        propsTable.queryString = input.value;
      }

      return BUI.html`
        <bim-panel>
          <bim-panel-section
            name="property"
            label="Property Information"
            icon="solar:document-bold"
            fixed
          >
            <bim-text-input @input=${search} placeholder="Search..."></bim-text-input>
            ${propsTable}
          </bim-panel-section>
        </bim-panel>
      `;
    })

    const onWorldsUpdate = () => {
      if (!floatingGrid) return;
      floatingGrid.layout = "world";
    }

    const worldPanel = BUI.Component.create<BUI.Panel>(() => {
      const [worldTable] = CUI.tables.worldsConfiguration({ components })

      const search = (e: Event) => {
        const input = e.target as BUI.TextInput
        worldTable.queryString = input.value;
      }
    
    return BUI.html`
      <bim-panel>
        <bim-panel-section
          name="world"
          label="World Information"
          icon="solar:document-bold"
          fixed
        >
          <bim-text-input @input=${search} placeholder="Search..."></bim-text-input>
          ${worldTable}
        </bim-panel-section>
      </bim-panel>
    `;
  })

    const toolbar = BUI.Component.create<BUI.Toolbar>(() => {
    const [loadIfcBtn] = CUI.buttons.loadIfc({ components: components })
    return BUI.html`
      <bim-toolbar style="justify-self: center;">
        <bim-toolbar-section label="App">
          <bim-button
            label="World"
            icon="tabler:brush"
            @click=${onWorldsUpdate}
          ></bim-button>
        </bim-toolbar-section>
        <bim-toolbar-section label="Import">
          ${loadIfcBtn}
        </bim-toolbar-section>
        <bim-toolbar-section label="Selection">
        <bim-button 
          label="Visibility"
          icon="material-symbols:visibility-outline"
          @click="${onToggleVisibility}"
        ></bim-button>
        <bim-button 
          label="Isolate"
          icon="mdi:filter"
          @click="${onIsolate}"
        ></bim-button>
        <bim-button 
          label="Show All"
          icon="tabler:eye-filled"
          @click="${onShow}"
        ></bim-button>
        </bim-toolbar-section>
        <bim-toolbar-section label="Property">
          <bim-button 
            label="Show"
            icon="clarity:list-line"
            @click="${onShowProperties}"
          ></bim-button>
        </bim-toolbar-section>
      </bim-toolbar>
    `;
    })

    floatingGrid.layouts = {
      main: {
        template: `
          "empty" 1fr
          "toolbar" auto
          /1fr
        `,
        elements: {
          toolbar
        }
      },
      second: {
        template: `
          "empty elementPropertyPanel" 1fr
          "toolbar toolbar" auto
          /1fr 20rem
        `,
        elements: {
          toolbar,
          elementPropertyPanel
        }
      },
      world: {
        template: `
          "empty worldPanel" 1fr
          "toolbar toolbar" auto
          /1fr 20rem
        `,
        elements: {
          toolbar,
          worldPanel
        }
      }
    }

    floatingGrid.layout = "main";
    viewerContainer.appendChild(floatingGrid);
  }

  useEffect(() => {
    setViewer();
    setupUI();

    return () => {
      if (components) {
        components.dispose();
      }

      if (fragmentModel) {
        fragmentModel.dispose();
        fragmentModel = undefined;
      }
      
    }
  }, []);

  return (
    <bim-viewport
      id="viewer-container"
    />
  );
}
