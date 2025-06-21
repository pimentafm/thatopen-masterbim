import { useEffect } from 'react'
import * as OBC from '@thatopen/components'
import * as OBCF from '@thatopen/components-front'
import * as BUI from '@thatopen/ui'
import * as CUI from '@thatopen/ui-obc'
import { FragmentsGroup } from '@thatopen/fragments'
import { TodoCreator } from '../bim-components/TodoCreator'
import { SimpleQTO } from '../bim-components/SimpleQTO'

interface Props {
  components: OBC.Components
}

export function IFCViewer(props: Props) {
  const components: OBC.Components = props.components

  let fragmentModel: FragmentsGroup | undefined
  const [classificationsTree, updateClassificationsTree] =
    CUI.tables.classificationTree({
      components,
      classifications: [],
    })

  const setViewer = () => {
    const worlds = components.get(OBC.Worlds)

    const world = worlds.create<
      OBC.SimpleScene,
      OBC.OrthoPerspectiveCamera,
      OBCF.PostproductionRenderer
    >()

    const sceneComponent = new OBC.SimpleScene(components)
    world.scene = sceneComponent
    world.scene.setup()

    const viewerContainer = document.getElementById(
      'viewer-container'
    ) as HTMLElement
    const rendererComponent = new OBCF.PostproductionRenderer(
      components,
      viewerContainer
    )
    world.renderer = rendererComponent

    const cameraComponent = new OBC.OrthoPerspectiveCamera(components)
    world.camera = cameraComponent

    components.init()

    world.renderer.postproduction.enabled = true
    world.camera.controls.setLookAt(3, 3, 3, 0, 0, 0)
    world.camera.updateAspect()

    const ifcLoader = components.get(OBC.IfcLoader)
    ifcLoader.setup()

    const fragmentsManager = components.get(OBC.FragmentsManager)
    fragmentsManager.onFragmentsLoaded.add(async (model) => {
      console.log('Fragments loaded', model)
      world.scene.three.add(model)

      model.getLocalProperties()
      if (model.hasProperties) {
        await processModel(model)
      }

      fragmentModel = model
    })

    const highlighter = components.get(OBCF.Highlighter)
    highlighter.setup({ world })
    highlighter.zoomToSelection = true

    viewerContainer.addEventListener('recsize', () => {
      rendererComponent.resize()
      cameraComponent.updateAspect()
    })

    const todoCreator = components.get(TodoCreator)
    todoCreator.world = world
    todoCreator.setup()
  }

  const processModel = async (model: FragmentsGroup) => {
    const indexer = components.get(OBC.IfcRelationsIndexer)
    await indexer.process(model)

    const classifier = components.get(OBC.Classifier)
    await classifier.bySpatialStructure(model)
    classifier.byEntity(model)

    const classifications = [
      {
        system: 'entities',
        label: 'Entities',
      },
      {
        system: 'spatialStructures',
        label: 'Spatial Containers',
      },
    ]

    if (updateClassificationsTree) {
      updateClassificationsTree({
        classifications,
      })
    }
  }

  const onFragmentExport = () => {
    const fragmentsManager = components.get(OBC.FragmentsManager)

    if (!fragmentModel) return
    fragmentModel.getLocalProperties()

    const fragmentsBinary = fragmentsManager.export(fragmentModel)
    const blob = new Blob([fragmentsBinary])
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${fragmentModel.id}-${fragmentModel.name}.frag`
    a.click()
    URL.revokeObjectURL(url)
  }

  const onFragmentImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.frag'
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      const binary = reader.result
      if (!(binary instanceof ArrayBuffer)) return
      const fragmentBinary = new Uint8Array(binary)
      const fragmentsManager = components.get(OBC.FragmentsManager)
      fragmentsManager.load(fragmentBinary)
    })
    input.addEventListener('change', () => {
      const filesList = input.files
      if (!filesList) {
        return
      }
      reader.readAsArrayBuffer(filesList[0])
    })
    input.click()
  }

  const onFragmentDispose = () => {
    const fragmentsManager = components.get(OBC.FragmentsManager)
    for (const [, group] of fragmentsManager.groups) {
      fragmentsManager.disposeGroup(group)
    }
    fragmentModel = undefined
  }

  const onPropertiesImport = () => {
    if (!fragmentModel) {
      console.error('fragmentModel is not defined.')
      return
    }

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    const reader = new FileReader()

    reader.addEventListener('load', async () => {
      if (!fragmentModel) {
        console.error('fragmentModel is not defined.')
        return
      }

      const json = reader.result
      if (typeof json !== 'string') {
        console.error('File read result is not a string.')
        return
      }

      try {
        const properties = JSON.parse(json)
        fragmentModel.setLocalProperties(properties)
        await processModel(fragmentModel)
      } catch (error) {
        console.error('Failed to parse JSON:', error)
      }

      reader.addEventListener('error', () => {
        console.error('Error reading file:', reader.error)
      })
    })

    input.addEventListener('change', () => {
      const filesList = input.files
      if (!filesList || filesList.length === 0) {
        console.error('No file selected.')
        return
      }

      reader.readAsText(filesList[0])
    })

    input.click()
  }

  const onPropertiesExport = () => {
    if (!fragmentModel) return
    const properties = fragmentModel.getLocalProperties()
    const json = JSON.stringify(properties, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${fragmentModel.id}-${fragmentModel.name}-properties.json`
    a.click()
    URL.revokeObjectURL(url)
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
    if (!fragmentModel) return
    const highlighter = components.get(OBCF.Highlighter)
    const selection = highlighter.selection.select
    const indexer = components.get(OBC.IfcRelationsIndexer)
    for (const fragmentID in selection) {
      const expressIDs = selection[fragmentID]
      for (const id of expressIDs) {
        const psets = indexer.getEntityRelations(
          fragmentModel,
          id,
          'ContainedInStructure'
        )
        if (psets) {
          for (const expressId of psets) {
            const prop = await fragmentModel.getProperties(expressId)
          }
        }
      }
    }
  }

  const setupUI = () => {
    const viewerContainer = document.getElementById(
      'viewer-container'
    ) as HTMLElement
    if (!viewerContainer) return

    const floatingGrid = BUI.Component.create<BUI.Grid>(() => {
      return BUI.html`
        <bim-grid
          floating
          style="padding: 20px"
        >
        </bim-grid>
        `
    })

    const elementPropertyPanel = BUI.Component.create<BUI.Panel>(() => {
      const [propsTable, updatePropsTable] = CUI.tables.elementProperties({
        components,
        fragmentIdMap: {},
      })

      const highlighter = components.get(OBCF.Highlighter)
      highlighter.events.select.onHighlight.add(async (fragmentIdMap) => {
        if (!floatingGrid) return
        floatingGrid.layout = 'second'
        updatePropsTable({ fragmentIdMap })
        propsTable.expanded = false

        const simpleQTO = components.get(SimpleQTO)
        await simpleQTO.sumQuantities(fragmentIdMap)
      })

      highlighter.events.select.onClear.add(() => {
        updatePropsTable({ fragmentIdMap: {} })
        if (!floatingGrid) return
        floatingGrid.layout = 'main'

        const simpleQTO = components.get(SimpleQTO)
        simpleQTO.resetQuantities()
      })

      const search = (e: Event) => {
        const input = e.target as BUI.TextInput
        propsTable.queryString = input.value
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
      `
    })

    const onClassifier = () => {
      if (!floatingGrid) return
      if (floatingGrid.layout !== 'classifier') {
        floatingGrid.layout = 'classifier'
      } else {
        floatingGrid.layout = 'main'
      }
    }

    const classifierPanel = BUI.Component.create<BUI.Panel>(() => {
      return BUI.html`
        <bim-panel>
          <bim-panel-section
            name="classifier"
            label="Classifier"
            icon="solar:document-bold"
            fixed
          >
            <bim-label>Classifications</bim-label>
            ${classificationsTree}
          </bim-panel-section>
        </bim-panel>`
    })

    const onWorldsUpdate = () => {
      if (!floatingGrid) return
      if (floatingGrid.layout !== 'world') {
        floatingGrid.layout = 'world'
      } else {
        floatingGrid.layout = 'main'
      }
    }

    const worldPanel = BUI.Component.create<BUI.Panel>(() => {
      const [worldTable] = CUI.tables.worldsConfiguration({ components })

      const search = (e: Event) => {
        const input = e.target as BUI.TextInput
        worldTable.queryString = input.value
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
      `
    })

    const toolbar = BUI.Component.create<BUI.Toolbar>(() => {
      const [loadIfcBtn] = CUI.buttons.loadIfc({ components: components })
      loadIfcBtn.tooltipTitle = 'Load IFC'
      loadIfcBtn.label = ''

      return BUI.html`
      <bim-toolbar style="justify-self: center;">
        <bim-toolbar-section label="App">
          <bim-button
            tooltip-title="World"
            icon="tabler:brush"
            @click=${onWorldsUpdate}
          ></bim-button>
        </bim-toolbar-section>
        <bim-toolbar-section label="Import">
          ${loadIfcBtn}
        </bim-toolbar-section>
        <bim-toolbar-section label="Fragments">
          <bim-button
            tooltip-title="Load"
            icon="tabler:package-import"
            @click=${onFragmentImport}
          ></bim-button>
          <bim-button
            tooltip-title="Export"
            icon="tabler:package-export"
            @click=${onFragmentExport}
          ></bim-button>
          <bim-button
            tooltip-title="Dispose"
            icon="tabler:trash"
            @click=${onFragmentDispose}
          ></bim-button>
        </bim-toolbar-section>
        <bim-toolbar-section label="Selection">
        <bim-button 
          tooltip-title="Visibility"
          icon="material-symbols:visibility-outline"
          @click="${onToggleVisibility}"
        ></bim-button>
        <bim-button 
          tooltip-title="Isolate"
          icon="mdi:filter"
          @click="${onIsolate}"
        ></bim-button>
        <bim-button 
          tooltip-title="Show All"
          icon="tabler:eye-filled"
          @click="${onShow}"
        ></bim-button>
        </bim-toolbar-section>
        <bim-toolbar-section label="Property">
          <bim-button 
            tooltip-title="Show"
            icon="clarity:list-line"
            @click="${onShowProperties}"
          ></bim-button>
          <bim-button 
            tooltip-title="Import"
            icon="tabler:package-import"
            @click="${onPropertiesImport}"
          ></bim-button>
          <bim-button 
            tooltip-title="Export"
            icon="tabler:package-export"
            @click="${onPropertiesExport}"
          ></bim-button>
        </bim-toolbar-section>
        <bim-toolbar-section label="Groups">
          <bim-button
            tooltip-title="Classifier"
            icon="tabler:eye-filled"
            @click="${onClassifier}"
          ></bim-button>
        </bim-toolbar-section>
      </bim-toolbar>
    `
    })

    floatingGrid.layouts = {
      main: {
        template: `
          "empty" 1fr
          "toolbar" auto
          /1fr
        `,
        elements: {
          toolbar,
        },
      },
      second: {
        template: `
          "empty elementPropertyPanel" 1fr
          "toolbar toolbar" auto
          /1fr 20rem
        `,
        elements: {
          toolbar,
          elementPropertyPanel,
        },
      },
      world: {
        template: `
          "empty worldPanel" 1fr
          "toolbar toolbar" auto
          /1fr 20rem
        `,
        elements: {
          toolbar,
          worldPanel,
        },
      },
      classifier: {
        template: `
          "empty classifierPanel" 1fr
          "toolbar toolbar" auto
          /1fr 20rem
        `,
        elements: {
          toolbar,
          classifierPanel,
        },
      },
    }
    floatingGrid.layout = 'main'
    viewerContainer.appendChild(floatingGrid)
  }

  useEffect(() => {
    setTimeout(() => {
      setViewer()
      setupUI()
    })

    return () => {
      if (components) {
        components.dispose()
      }

      if (fragmentModel) {
        fragmentModel.dispose()
        fragmentModel = undefined
      }
    }
  }, [])

  return <bim-viewport id="viewer-container" />
}
