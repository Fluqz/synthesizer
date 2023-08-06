
export class Storage {

    static storeName = "synthesizer"
  
    static save(file) {

      window.localStorage.setItem(Storage.storeName + "-save", file)
    }

    static load() {

      return window.localStorage.getItem(Storage.storeName + "-save")
    }

    static saveUndo(file) {

      window.localStorage.setItem(Storage.storeName + "-undo", file)
    }

    static loadUndo() {

      window.localStorage.getItem(Storage.storeName + "-undo")
    }
  }