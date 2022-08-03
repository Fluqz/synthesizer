
export class Storage {

    static baseName = "synthesizer"
  
    static load() {
      return window.localStorage.getItem(Storage.baseName + "-save")
    }
  
    static save(file) {
      window.localStorage.setItem(Storage.baseName + "-save", file)
    }
  }