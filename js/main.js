const Injector = function() {
    return {
        addClick: (selector, callback) => {
            const element = document.querySelector(selector)
            if (element)
                element.addEventListener("click", callback)
        },
        toggleClass: (selector, toggle) => {
            const element = document.querySelector(selector)
            if (element)
                element.classList.toggle(toggle)
        },
        getValue: (inputSelector) => {
            const element = document.querySelector(inputSelector)
            if (element)
                return element.value
        },
        setValue: (inputSelector, value) => {
            const element = document.querySelector(inputSelector)
            if (element)
                element.value = value
        },
        init: function() {
            this.__initBinds()
            this.__getScripts()
        },
        __initBinds: function() {
            document.addEventListener("click", (e) => {
                if(e.target.closest(".btn-add") ||
                   e.target.closest(".btn-cancel")) {
                    e.preventDefault()
                    this.__callbackToogleNewScript()
                }
                if(e.target.closest(".btn-save")) {
                    event.preventDefault()
                    const newInfo = {
                        id: btoa(Date.now()),
                        name: Injector.getValue(".script-name"),
                        desc: Injector.getValue(".script-desc"),
                        code: Injector.getValue(".script-code"),
                    }
                    this.__addScript(newInfo)
                    this.__updateList()
                    this.__callbackToogleNewScript(event)
                    Injector.setValue(".script-name", "")
                    Injector.setValue(".script-desc", "")
                    Injector.setValue(".script-code", "")
                }
                if(e.target.closest(".btn-delete")) {
                    e.preventDefault()
                    const scriptId = e.target.dataset.id
                    if (scriptId)
                        this.__deleteScript(scriptId)
                    this.__updateList()
                }
                if(e.target.closest(".btn-edit")) {
                    e.preventDefault()
                    const scriptId = e.target.dataset.id
                    if (scriptId)
                        this.__editScript(scriptId)
                }
                if(e.target.closest(".btn-run")) {
                    e.preventDefault()
                    const scriptId = e.target.dataset.id
                    if (scriptId)
                        this.__runScript(scriptId)
                }
              })
            this.addClick(".btn-delete", this.__deleteScript)
        },
        __getScripts: () => {
            extensionApi.storage.sync.get({
                list: []
            }, function (items) {
                Injector.setValue(".script-list", JSON.stringify(items.list))
                items.list.forEach(element => {
                    document.querySelector(".list-group").appendChild(Injector.__templateScript(element))
                })
            })
        },
        __addScript: (item) => {
            const list = JSON.parse(Injector.getValue(".script-list") || "[]")
            list.push(item)
            Injector.setValue(".script-list", JSON.stringify(list))
            extensionApi.storage.sync.set({
                list: list
            })
        },
        __deleteScript: (scriptId) => {
            const list = JSON.parse(Injector.getValue(".script-list") || "[]")
            const newList = list.filter(x => x.id !== scriptId)
            Injector.setValue(".script-list", JSON.stringify(newList))
            extensionApi.storage.sync.set({
                list: newList
            })
        },
        __editScript: (scriptId) => {
            Injector.__callbackToogleNewScript()
            const list = JSON.parse(Injector.getValue(".script-list") || "[]")
            const itemEdit = list.find(x => x.id === scriptId)
            Injector.setValue(".script-name", itemEdit.name)
            Injector.setValue(".script-desc", itemEdit.desc)
            Injector.setValue(".script-code", itemEdit.code)
        },
        __runScript: (scriptId) => {
            const list = JSON.parse(Injector.getValue(".script-list") || "[]")
            const itemEdit = list.find(x => x.id === scriptId)
            chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
                chrome.scripting.executeScript({ 
                    target: { tabId: tabs[0].id }, 
                    args: [itemEdit.code],
                    func: (scriptCode) => {
                        console.log("insert")
                        const scriptTag = document.createElement("script")
                        scriptTag.innerHTML = scriptCode
                        console.log(scriptTag)
                        document.body.appendChild(scriptTag)
                    }
                })
            })
        },
        __updateList: () => {
            document.querySelector(".list-group").innerHTML = ""
            const listStoreVal = Injector.getValue(".script-list")
            const list = JSON.parse(listStoreVal || "[]")
            list.forEach(element => {
                document.querySelector(".list-group").appendChild(Injector.__templateScript(element))
            })
        },
        __callbackToogleNewScript: () => {
            Injector.toggleClass(".btn-add", "hide")
            Injector.toggleClass(".new-script", "hide")
            Injector.toggleClass(".list-group", "hide")
        },
        __templateScript: function(info) {
            const li = document.createElement("li")
            li.classList.add("list-group-item")

            const infoDiv = document.createElement("div")
            const infoName = Template.tag("b", info.name, [])
            const infoDesc = Template.tag("i", info.desc, [])
            infoDiv.appendChild(infoName)
            infoDiv.appendChild(document.createElement("br"))
            infoDiv.appendChild(infoDesc)
            li.appendChild(infoDiv)


            const optionDiv = document.createElement("div")
            optionDiv.classList.add("options")
            const optionRun = Template.optionBtn(info.id, "/icon/play.svg", ["btn-warning", "btn-run"])
            optionDiv.appendChild(optionRun)
            const optionedit = Template.optionBtn(info.id, "/icon/edit.svg", ["btn-light", "btn-edit"])
            optionDiv.appendChild(optionedit)
            const optionDetele = Template.optionBtn(info.id, "/icon/trash.svg", ["btn-light", "btn-delete"])
            optionDiv.appendChild(optionDetele)
            li.appendChild(optionDiv)

            return li

        }
    }
}()

Injector.init()