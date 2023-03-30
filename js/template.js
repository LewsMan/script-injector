const Template = function() {
    return {
        inputHidden: function(name, value, classList) {
            const inputElement = document.createElement("input")
            inputElement.setAttribute("type", "hidden")
            inputElement.setAttribute("name", name)
            classList.forEach(className => {
                inputElement.classList.add(className)
            });
            inputElement.setAttribute("value", value)
            return inputElement
        },
        tag: function(tag, content, classList) {
            const element = document.createElement(tag)
            classList.forEach(className => {
                element.classList.add(className)
            });
            if (content)
                element.innerHTML = content
            return element
        },
        optionBtn: function(optionId, icon, classList) {
            const option = document.createElement("img")
            option.classList.add("icon")
            option.classList.add("btn")
            option.classList.add("btn-sm")
            classList.forEach(className => {
                option.classList.add(className)
            });
            option.setAttribute("data-id", optionId)
            option.setAttribute("src", icon)
            return option
        }
    }
}()
