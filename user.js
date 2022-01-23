export class User{

  /**
   * 
   * @param {String} username 
   * @param {Number} posts 
   * @param {Date} joinedDate 
   * @param {Number} reactions 
   */
  constructor(username, posts, joinedDate, reactions){
    this.username  = username 
    this.posts  = posts 
    this.joinedDate  = joinedDate 
    this.reactions = reactions


  }

  /**
   * Em millisegundos
   */
  get joinedTime(){
    return this.joinedDate.getTime()
  }
  /**
   * 
   * @param {Element} htmlPost Element que engloba todo o post
   * @returns null se não vier de um post válido
   */
  static FromHtmlPost(htmlPost){
    let pairs = htmlPost.getElementsByClassName("pairs pairs--justified")

    let rows = Array.from(pairs).map(m => m.getElementsByTagName("dd")[0].innerHTML)

    let username = this.GetUsernameFromHtmlPost(htmlPost)
    let joined = new Date(rows[0])
    let posts = parseInt(rows[1].replace(",",""))
    let reactions = parseInt(rows[2].replace(",",""))

    return new User(username, posts, joined, reactions)
  }

  /**
   * 
   * @param {Element} htmlLoggedBox Qualquer Element que tenha como filho o "p-navgroup-linkText"
   * @returns null se o usuário não estiver logado
   */
  static GetLoggedUsernameFromHtml(){
    return document.getElementsByClassName("p-navgroup-linkText")[0].innerHTML
  }

  /**
   * 
   * @param {Element} htmlPost Element que engloba todo o post
   * 
   */
  static GetUsernameFromHtmlPost(htmlPost){
    return htmlPost
      .getElementsByClassName("message-userDetails")[0]
      .getElementsByClassName("username ")[0]
      .innerHTML
  }


}