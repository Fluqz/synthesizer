
export class Storage {

    static storeName = "synthesizer"
  
    static save(file) {

      window.localStorage.setItem(Storage.storeName + "-save", file)
    }

    static load() {

      return window.localStorage.getItem(Storage.storeName + "-save")
    }
  }