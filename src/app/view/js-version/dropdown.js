import { Subject } from "rxjs"


export class Dropdown {

    dom
    selected
    selectedDOM
    dropdownDOM
    optionDOMs

    array

    capitalize

    deletable

    onSelectOption
    onDeleteOption

    /**
     * 
     * @param {*} array - Array of options
     */
    constructor(array, selected, capitalize, deletable) {

        this.array = array
        this.selected = selected == null ? 'None' : selected
        this.capitalize = capitalize
        this.deletable = deletable

        this.onSelectOption = new Subject()
        this.onDeleteOption = new Subject()

        this.create()
    }

    create() {

        this.dom = document.createElement('div')
        this.dom.classList.add('dropdown')

        this.selectedDOM = document.createElement('div')
        this.selectedDOM.classList.add('dropdown-selected')
        this.setSelected(this.selected ? this.selected : 'none')
        this.dom.append(this.selectedDOM)

        this.selectedDOM.addEventListener('mouseenter', this.open.bind(this))
        this.dom.addEventListener('mouseleave', this.close.bind(this))

        this.dropdownDOM = document.createElement('div')
        this.dropdownDOM.classList.add('dropdown-options')
        this.dom.append(this.dropdownDOM)

        this.addOptionDOMs()
    }

    set(array) {

        this.array = array

        for(let i = this.optionDOMs.length-1; i >= 0; i--) {

            this.optionDOMs[i].removeEventListener('mouseup', this.onSelect.bind(this))
            this.dropdownDOM.removeChild(this.optionDOMs[i])
        }

        this.addOptionDOMs()
    }

    setSelected(v) {

        this.selected = v

        this.selectedDOM.innerHTML = this.capitalize ? this.selected[0].toUpperCase() + this.selected.substr(1) : this.selected
    }

    add(v) {

        this.array.push(v)

        this.set(this.array)

        this.setSelected(v)
    }

    remove(v) {

        this.array.splice(this.array.indexOf(v), 1)

        this.set(this.array)
    }

    addOptionDOMs() {

        this.optionDOMs = []

        let o
        for(let a of this.array) {

            o = document.createElement('div')
            this.dropdownDOM.appendChild(o)
            o.classList.add('dropdown-option')
            o.innerHTML = this.capitalize ? a[0].toUpperCase() + a.substr(1) : a

            o.setAttribute('value', a)

            this.optionDOMs.push(o)

            o.addEventListener('mouseup', this.onSelect.bind(this))

            if(this.deletable) {

                let d = document.createElement('div')
                d.classList.add('dropdown-option-delete')
                d.innerHTML = 'x'
                o.append(d)
        
                d.addEventListener('mouseup', this.onDelete.bind(this))
            }
        }
    }

    open(e) {

        this.dropdownDOM.classList.add('active')
    }

    close(e) {

        this.dropdownDOM.classList.remove('active')
    }

    onSelect(e) {

        this.setSelected(e.target.getAttribute('value'))

        this.onSelectOption.next(this.selected)

        this.close()
    }

    onDelete(e) {

        e.stopPropagation()

        this.onDeleteOption.next(e.target.parentElement.getAttribute('value'))
    }
}