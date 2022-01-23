
import {Preferences} from "./preferences.js";
import { User } from "./user.js";

window.onload = main



const WEEK_MILLIS = 6.048e+8 //Uma semana em millisegundos
const HTML_POST_NODE = "message--post" //Nome da classe que engloba um post
const HIDDEN_IMAGE_STR = "[Imagem ocultada]"
const USE_IN_SELF = false //Para não bloquear as próprias imagens, porém como true é bom pra testar

let preferences = new Preferences()

export function main() {

  

  preferences.loadFromChrome().then((sucess) => {
    onLoadedPreferences()
  }, (err) => {
    onLoadedPreferences()
  })

  
  

}

function onLoadedPreferences() {


  let htmlPosts = Array.from(document.getElementsByClassName(HTML_POST_NODE))
  
  let loggedUsername = User.GetLoggedUsernameFromHtml()


  for (const htmlPost of htmlPosts) {
    let user = User.FromHtmlPost(htmlPost)


    if(loggedUsername != null && user.username == loggedUsername && !USE_IN_SELF)
      continue //É um post de vc mesmo
    
    
    //Tempo em semanas desde a criação da conta
    let periodWeeks =  Math.abs(millisToWeek(user.joinedTime - new Date().getTime()))

    //É clone ou não?
    let isTambaqui = false
    if(preferences.condition == Preferences.CONDITION.AND){ //Usando condição E
      isTambaqui = user.posts < preferences.minPosts && periodWeeks < preferences.minWeeks
    } else { //Condição Ou
      isTambaqui = user.posts < preferences.minPosts || periodWeeks < preferences.minWeeks
    }

    if(isTambaqui){
      console.log("Tambaqui postou")

      let htmlMessage = extractHtmlMessage(htmlPost)
      
      
      switch (preferences.method) {
        case Preferences.METHOD.HIDE:{
          hideMedia(htmlMessage, preferences.hideMedia)
          break;
        }
      
        case Preferences.METHOD.SPOILER:{
          spoilerMedia(htmlMessage, preferences.hideMedia)
          break;
        }
        default:{
          
          console.log("wtf não há metodo")
          hideMedia(htmlMessage, preferences.hideMedia)
          break;
        }

      }
      


    }
    
    
  }
}

/**
 * 
 * @param {Element} htmlMessage 
 * @param {boolean} includeEmbeddedMedia
 */
function spoilerMedia(htmlMessage, includeEmbeddedMedia = false) {
  let htmlMediaContainers = extractMedia(htmlMessage, includeEmbeddedMedia)
  //console.log("spoilando")
  for (const htmlContainer of htmlMediaContainers) {
    if(htmlContainer instanceof Element)
      involveInSpoiler(htmlContainer, htmlContainer.tagName === "IFRAME")
  }
  
}

/**
 * 
 * @param {Element} htmlMessage 
 * @param {boolean} includeEmbeddedMedia
 */
 function hideMedia(htmlMessage, includeEmbeddedMedia = false) {
  let htmlMediaContainers = extractMedia(htmlMessage, includeEmbeddedMedia)

  for (const htmlContainer of htmlMediaContainers) {
    if(htmlContainer instanceof Element)
      htmlContainer.outerHTML = HIDDEN_IMAGE_STR //Substuindo mídia por texto
  }
  
}


/**
 * 
 * @param {Element} htmlMessage 
 * @param {boolean} includeEmbeddedMedia 
 * @returns {Element[]} Todas as mídias e imagens
 */
function extractMedia(htmlMessage, includeEmbeddedMedia) {
  let htmlMediaContainers = []
  htmlMediaContainers.push.apply(htmlMediaContainers, Array.from(htmlMessage.getElementsByClassName("lbContainer")));

  if (includeEmbeddedMedia) {
    htmlMediaContainers.push.apply(htmlMediaContainers, Array.from(htmlMessage.getElementsByTagName("iframe")));
    
    //Removendo filhos das mídias capturadas
    for (let childI = htmlMediaContainers.length - 1; childI >= 0; childI--) {
      for (let parentI = 0; parentI < htmlMediaContainers.length; parentI++) {
        let isChild = checkParent(htmlMediaContainers[parentI], htmlMediaContainers[childI]);
        if (isChild) {
          htmlMediaContainers.splice(childI);
        }
      }
    }
  }

  return htmlMediaContainers

}

/**
 * 
 * @param {Element} htmlImageContainer 
 * @param {isMedia} isMedia
 */
function involveInSpoiler(htmlImageContainer, isMedia){

  
  let newElement = `
    <div class="bbCodeSpoiler">
	    <button type="button" class="bbCodeSpoiler-button button"
          data-xf-click="toggle" data-xf-init="tooltip" data-original-title="Click to reveal or hide spoiler">
        <span class="button-text">
	  	    <span>`.concat(HIDDEN_IMAGE_STR).concat(`</span>
	      </span>
      </button>
	    <div class="bbCodeSpoiler-content" tabindex="-1" style="">
	    	<div class="bbCodeBlock bbCodeBlock--spoiler">
	    		<div class="bbCodeBlock-content">

          `).concat(htmlImageContainer.outerHTML).concat(`

	    	</div>
	    </div>
    </div>`
  )

  let newHtmlElement =  document.createElement("div")
  newHtmlElement.innerHTML = newElement

  //let clone = htmlImageContainer.cloneNode()

  
  htmlImageContainer.replaceWith(newHtmlElement.firstElementChild)
  if(isMedia){
    //Recarregando mídia, algumas ficam em escuro após envolver em spoiler
    //let iframe = htmlImageContainer.outerHTML
    //let newNode = htmlImageContainer.cloneNode()
    //htmlImageContainer.append(newNode)
    //htmlImageContainer.replaceWith(clone)
    
  }
//  htmlImage.replaceWith()
}

/**
 * 
 * @param {Element} htmlPost Element que engloba todo o post
 */
function extractHtmlMessage(htmlPost){
  return htmlPost.getElementsByClassName("bbWrapper")[0]
}


/**
 * 
 * @param {Number} millis 
 * @returns {Number}
 */
function millisToWeek(millis) {

  return millis / WEEK_MILLIS
  
}

/**
 * 
 * @param {Element} parent 
 * @param {Element} child 
 * @returns 
 */
function checkParent(parent, child) {
  let node = child.parentNode;

  while (node != null) {
      if (node == parent) {
          return true;
      }
   node = node.parentNode;
   }
 return false;
}