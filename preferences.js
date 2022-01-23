
const CONDITION = {
  AND: "and", OR: "or"
}
const METHOD = {
  HIDE: "hide", SPOILER: "spoiler"
}


const DEFAULT_MIN_POSTS = 100
const DEFAULT_MIN_WEEKS = 4
const DEFAULT_CONDITION = CONDITION.AND
const DEFAULT_METHOD = METHOD.HIDE
const DEFAULT_HIDE_MEDIA = false

export class Preferences{

  constructor(minPosts = DEFAULT_MIN_POSTS, minWeeks = DEFAULT_MIN_WEEKS, condition = DEFAULT_CONDITION, method = DEFAULT_METHOD, hideMedia = DEFAULT_HIDE_MEDIA){
    this.minPosts = minPosts
    this.minWeeks = minWeeks
    this.condition = condition
    this.method = method
    this.hideMedia = hideMedia
  }

  static get DEFAULT_MIN_POSTS(){
    return DEFAULT_MIN_POSTS
  }

  static get DEFAULT_MIN_WEEKS(){
    return DEFAULT_MIN_WEEKS
  }

  static get DEFAULT_METHOD(){
    return DEFAULT_METHOD
  }

  static get DEFAULT_CONDITION(){
    return DEFAULT_CONDITION
  }

  static get CONDITION(){
    return CONDITION
  }

  static get METHOD(){
    return METHOD
  }

  static get DEFAULT_HIDE_MEDIA(){
    return this.DEFAULT_HIDE_MEDIA
  }

  
  async loadFromChrome() {
    
    console.log("this:", this)
    return new Promise((resolve, reject) => {

      try {
        
        chrome.storage.sync.get(["preferences"], (options) => {
          let preferences = options.preferences
          resolve(preferences)

          this.minPosts = parseInt(preferences.minPosts)
          this.minWeeks = parseFloat(preferences.minWeeks)
          this.condition = preferences.condition
          this.method = preferences.method
          this.hideMedia = preferences.hideMedia
          console.log("Preferências carregas", this)
        });
        
      } catch (error) {
        reject(error)
      }
    })

  }

  async saveInChrome(){
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.sync.set({"preferences" : this}, (preferences) => {
          resolve(preferences)
          console.log("Preferências salvas", preferences)
        })
        
      } catch (error) {
        reject(error)
      }

    })
  }

  async clearInChrome(){
    return new Promise((resolve, reject) => {
      try {

        chrome.storage.sync.clear(() => {
          resolve(chrome.runtime.lastError)
        });
        
        
      } catch (error) {
        reject(error)
      }

    })
  }
}