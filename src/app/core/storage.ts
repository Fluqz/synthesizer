
export class Storage {

    static storeName = 'synthesizer'

    private static currentUndoID: number
    private static undoID: number = 0
    private static undoSteps: number = 20
  
    /** Save to localstorage */
    static save(file) {

      window.localStorage.setItem(Storage.storeName + '-save', file)
    }

    /** Load to localstorage */
    static load() {

      return window.localStorage.getItem(Storage.storeName + '-save')
    }

    /** Save undo */
    static saveUndo(file) {

      console.log('SAVE UNDO', this.undoID)
      // console.trace()

      if (Storage.undoID - Storage.undoSteps > 0) localStorage.removeItem(Storage.storeName + '-undo-' + (Storage.undoID - Storage.undoSteps))

      window.localStorage.setItem(Storage.storeName + '-undo-' + this.undoID++, file)
    }

    /** Undo. Returns the undo or null */
    static undo() {

      this.undoID--

      if(this.undoID < 0) this.undoID = 0

      return window.localStorage.getItem(Storage.storeName + '-undo-' + this.undoID)
    }

    /** Redo. Returns the redo or null */
    static redo() {

      this.undoID++

      const file = window.localStorage.getItem(Storage.storeName + '-undo-' + this.undoID)

      if(file != undefined) return file

      this.undoID--
    }
  }