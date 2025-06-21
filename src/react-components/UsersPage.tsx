import * as React from 'react'
import * as BUI from '@thatopen/ui'
import { useEffect } from 'react'

export function UsersPage() {
  const usersTable = BUI.Component.create<BUI.Table>(() => {
    const onTableCreated = (element?: Element) => {
      const table = element as BUI.Table

      table.data = [
        {
          data: {
            Name: 'Fernando Pimenta',
            Task: 'Create a new project',
            Role: 'Engineer',
          },
        },
        {
          data: {
            Name: 'Lorena Carvalho',
            Task: 'Manage project',
            Role: 'Engineer',
          },
        },
        {
          data: {
            Name: 'Paulo Cesar',
            Task: 'Develop a new feature',
            Role: 'Developer',
          },
        },
      ]
    }

    return BUI.html`
      <bim-table ${BUI.ref(onTableCreated)}></bim-table>
    `
  })

  const content = BUI.Component.create<BUI.Panel>(() => {
    return BUI.html`
    <bim-panel style="border-radius: 0px">
      <bim-panel-section>
        ${usersTable}
      </bim-panel-section>
    </bim-panel>
    `
  })

  const sidebar = BUI.Component.create<BUI.Component>(() => {
    const buttonStyle = {
      height: '50px',
    }

    return BUI.html`
      <div style="padding: 4px">
      <bim-button 
        style=${BUI.styleMap(buttonStyle)}
        icon="material-symbols:print-sharp"
        @click=${() => {
          console.log(usersTable.value)
        }}
        ></bim-button>

      <bim-button 
        style=${BUI.styleMap(buttonStyle)}
        icon="mdi:file"
        @click=${() => {
          const csvData = usersTable.csv
          const blob = new Blob([csvData], { type: 'text/csv' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'users.csv'
          a.click()
        }}
        ></bim-button>
      </div>
    `
  })

  const footer = BUI.Component.create<BUI.Component>(() => {
    return BUI.html`
      <div style="display: flex; justify-content: center;">
        <bim-label>
        Copyright of Construction Company
        </bim-label>
      </div>
    `
  })

  const gridLayout: BUI.Layouts = {
    primary: {
      template: `
      "header header" 40px
      "content sidebar" 1fr
      "footer footer" 40px
      / 1fr 60px
      `,
      elements: {
        header: (() => {
          const inputBox = BUI.Component.create<BUI.TextInput>(() => {
            return BUI.html`
              <bim-text-input
                placeholder="🔍 Search user by name"
                style="padding: 8px"
              ></bim-text-input>
            `
          })
          inputBox.addEventListener('input', (e) => {
            usersTable.queryString = inputBox.value
          })
          return inputBox
        })(),
        content,
        sidebar,
        footer,
      },
    },
  }

  useEffect(() => {
    const grid = document.getElementById('bimGrid') as BUI.Grid
    grid.layouts = gridLayout
    grid.layout = 'primary'
  }, [])

  return (
    <div>
      <bim-grid id="bimGrid"></bim-grid>
    </div>
  )

  //   <div id="users-page" className="page">
  //     <header>
  //       <h2>Users</h2>
  //       <div
  //         style={{
  //           display: "flex",
  //           alignItems: "center",
  //           justifyContent: "end",
  //           columnGap: 20,
  //         }}
  //       >
  //         <div style={{ display: "flex", alignItems: "center", columnGap: 10 }}>
  //           <input
  //             type="text"
  //             placeholder="🔍 Search user by name"
  //             style={{ width: "100%" }}
  //           />
  //         </div>
  //       </div>
  //       <div>
  //         <button>
  //           <span className="material-symbols-rounded"> add </span>Add user
  //         </button>
  //       </div>
  //     </header>
  //     <div className="main-page-content">
  //       <div style={{ display: "flex", flexDirection: "column", rowGap: 30 }}>
  //         <div className="profile">
  //           <div style={{ display: "flex", flexDirection: "column" }}>
  //             <div
  //               style={{
  //                 display: "flex",
  //                 flexDirection: "row",
  //                 paddingBottom: 5,
  //               }}
  //             >
  //               <img
  //                 src="https://www.gravatar.com/avatar/d8165a2bef7d658eb11abb04ee8d5e70?s=200&d=identicon"
  //                 alt="Profile Picture"
  //                 className="profile-picture"
  //               />
  //               <div className="profile-info">
  //                 <span className="profile-name">Fernando Pimenta</span>
  //                 <span className="badge">Owner</span>
  //               </div>
  //             </div>
  //             <div className="profile-project">
  //               <div style={{ display: "flex", flexDirection: "row" }}>
  //                 <h5>Project:</h5>
  //                 <p style={{ marginLeft: 5, color: "#969696" }}>
  //                   Community Hospital
  //                 </p>
  //               </div>
  //               <div style={{ display: "flex", flexDirection: "row" }}>
  //                 <h5>Role:</h5>
  //                 <p style={{ marginLeft: 5, color: "#969696" }}>Engineer</p>
  //               </div>
  //             </div>
  //           </div>
  //           <div>
  //             <button className="btn-secondary">
  //               <span className="material-symbols-rounded"> edit </span>Edit
  //             </button>
  //           </div>
  //         </div>
  //         <div className="profile">
  //           <div style={{ display: "flex", flexDirection: "column" }}>
  //             <div
  //               style={{
  //                 display: "flex",
  //                 flexDirection: "row",
  //                 paddingBottom: 5,
  //               }}
  //             >
  //               <img
  //                 src="https://www.gravatar.com/avatar/d8165a2bef7d658eb11abb04ee8d5e70?s=200&d=identicon"
  //                 alt="Profile Picture"
  //                 className="profile-picture"
  //               />
  //               <div className="profile-info">
  //                 <span className="profile-name">Fernando Pimenta</span>
  //                 <span className="badge">Owner</span>
  //               </div>
  //             </div>
  //             <div className="profile-project">
  //               <div style={{ display: "flex", flexDirection: "row" }}>
  //                 <h5>Project:</h5>
  //                 <p style={{ marginLeft: 5, color: "#969696" }}>
  //                   Community Hospital
  //                 </p>
  //               </div>
  //               <div style={{ display: "flex", flexDirection: "row" }}>
  //                 <h5>Role:</h5>
  //                 <p style={{ marginLeft: 5, color: "#969696" }}>Engineer</p>
  //               </div>
  //             </div>
  //           </div>
  //           <div>
  //             <button className="btn-secondary">
  //               <span className="material-symbols-rounded"> edit </span>Edit
  //             </button>
  //           </div>
  //         </div>
  //         <div className="profile">
  //           <div style={{ display: "flex", flexDirection: "column" }}>
  //             <div
  //               style={{
  //                 display: "flex",
  //                 flexDirection: "row",
  //                 paddingBottom: 5,
  //               }}
  //             >
  //               <img
  //                 src="https://www.gravatar.com/avatar/d8165a2bef7d658eb11abb04ee8d5e70?s=200&d=identicon"
  //                 alt="Profile Picture"
  //                 className="profile-picture"
  //               />
  //               <div className="profile-info">
  //                 <span className="profile-name">Fernando Pimenta</span>
  //                 <span className="badge">Owner</span>
  //               </div>
  //             </div>
  //             <div className="profile-project">
  //               <div style={{ display: "flex", flexDirection: "row" }}>
  //                 <h5>Project:</h5>
  //                 <p style={{ marginLeft: 5, color: "#969696" }}>
  //                   Community Hospital
  //                 </p>
  //               </div>
  //               <div style={{ display: "flex", flexDirection: "row" }}>
  //                 <h5>Role:</h5>
  //                 <p style={{ marginLeft: 5, color: "#969696" }}>Engineer</p>
  //               </div>
  //             </div>
  //           </div>
  //           <div>
  //             <button className="btn-secondary">
  //               <span className="material-symbols-rounded"> edit </span>Edit
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
}
