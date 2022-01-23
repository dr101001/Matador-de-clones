import { Preferences } from "./preferences.js";

const RESET_SAVED_DATA = false //Limpa todos os dados salvos ao iniciar. Útil pra debug

let preferences = new Preferences()


let htmlMinPosts = document.getElementById("minPosts")
let htmlMinWeeks = document.getElementById("minWeeks")
let htmlConditionAnd = document.getElementById("conditionAnd")
let htmlConditionOr = document.getElementById("conditionOr")
let htmlMethodHide = document.getElementById("methodHide")
let htmlMethodSpoiler = document.getElementById("methodSpoiler")
let htmlSave = document.getElementById("save")
let htmlReset = document.getElementById("reset")
let htmlTinyAlert = document.getElementById("tinyAlert")
let htmlHideMedia = document.getElementById("hideMedia")



initListeners()


if(RESET_SAVED_DATA){
  preferences.clearInChrome().finally(() => {
    load()
  })
} else{
  load()

}

/**
 * Carrega preferencias salvadas
 */
function load(){
  preferences.loadFromChrome().then((sucess) => {

  }, (err) => {
    console.log("Preferências não encontradas", err)
    showTinyAlert("Usando preferências padrão", false)
   
  }).finally(() => {
    setPageValues() //Inserindo valores nos campos do popup de preferências
  })
}

function save(){
  preferences.minPosts = parseInt(htmlMinPosts.value)
  preferences.minWeeks = parseFloat(htmlMinWeeks.value)
  preferences.condition = [htmlConditionAnd, htmlConditionOr].find(f => f.checked).value
  preferences.method = [htmlMethodHide, htmlMethodSpoiler].find(f => f.checked).value
  preferences.hideMedia = htmlHideMedia.checked

  preferences.saveInChrome().then((sucess) => {
    showTinyAlert("Preferências salvas")

  }, (err) => {
    showTinyAlert("Não foi possível salvar :(\n" + err.message, false)
  })


}

function reset(){
  
  /*preferences.minPosts = Preferences.DEFAULT_MIN_POSTS
  preferences.minWeeks = Preferences.DEFAULT_MIN_WEEKS
  preferences.condition = Preferences.DEFAULT_CONDITION
  preferences.method = Preferences.DEFAULT_METHOD
  preferences.hideMedia = Preferences.DEFAULT_HIDE_MEDIA*/
  preferences = new Preferences()
  setPageValues()
  showTinyAlert("Valores resetados")
}

/**
 * Preenche os campos do popup de preferencias
 */
function setPageValues() {

  console.log(preferences.minPosts)
  console.log(htmlMinPosts)
  
  htmlMinPosts.value = preferences.minPosts
  htmlMinWeeks.value = preferences.minWeeks
  htmlMethodHide.checked = preferences.method == htmlMethodHide.value
  htmlMethodSpoiler.checked = preferences.method == htmlMethodSpoiler.value
  htmlConditionAnd.checked = preferences.condition == htmlConditionAnd.value
  htmlConditionOr.checked = preferences.condition == htmlConditionOr.value
  htmlHideMedia.checked = preferences.hideMedia
  
}

/**
 * Escreve algo no fim do popup de preferencias
 * 
 * @param {String} text 
 * @param {Boolean} happy 
 * @param {Number} duration Em milissegundo
 */
function showTinyAlert(text, happy = true, duration = 3000){
  htmlTinyAlert.innerText = text

  if(happy)
    htmlTinyAlert.style.color = "#bcff11"
  else
    htmlTinyAlert.style.color = "#c20"

  setTimeout(() => {
    htmlTinyAlert.style.color = "rgba(255,255,255,0)"
  }, duration)

}


function initListeners(){
  
  htmlSave.addEventListener("click", async () => {
    
    save()
    
  });

  htmlReset.addEventListener("click", async () => {
    reset()
  });



}