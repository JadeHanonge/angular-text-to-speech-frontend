import { Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[tts-directive]'
})
export class TtsDirectiveDirective {

  constructor(private el: ElementRef) { }
  private text = '';

  extractText(element: HTMLElement, clikedElementClasse: string) {

    let children = Array.from(element.childNodes);
    this.text = '';

    for (let child of children){
      let el = child as HTMLElement;
      if(el.className != clikedElementClasse){
        this.text += el.innerText
      }
    }
    

   //for (let child of children) {
    //if (child)
      // if (child.nodeType === Node.TEXT_NODE){
      //   this.text += child.nodeValue;
      //   console.log("text node: " + this.text);
        
        
      // }else if (child.nodeType === Node.ELEMENT_NODE){
      //   const el = child as HTMLElement;
      //  if (el.className != clikedElementClasse) {
      //     this.text += this.extractText(el, clikedElementClasse)
      //     console.log("text element node : " + this.text);
          
      //   }
      // }
  //}
    console.log("children : " + children);
    console.log("text methode : " + this.text);
    
    return this.text;
    
    

  }


  @HostListener('click', ['$event']) onClick(event: Event) {
    
    const clikedElement = event.target as HTMLElement
    let test = this.el.nativeElement.innerText;
    console.log("test : " + test);
    
    if (clikedElement && clikedElement.className === 'btnListen'){
      event.stopPropagation();
      this.text = this.extractText(this.el.nativeElement, clikedElement.className)
    }
    console.log("text : " + this.text);
    console.log("native element : " + this.el.nativeElement);
    
    
    //envoie le text au serveur
    fetch('http://localhost:3001/speak', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: this.text })
      
    })
    //recois une repons sous forme de fichier audio
    .then(response => response.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.play();
    })
    .catch(error => {
      console.error('Erreur:', error);
    });

    //fonction pour recuperer le text contenue dans la div.
    // function extractText(element: HTMLElement, clikedElementID: string) {

    //   let text = ' ';
    //   let children = Array.from(element.childNodes);

    //  for (let child of children) {
    //     if (child.nodeType === Node.TEXT_NODE){
    //       text += child.nodeValue;
    //       console.log("text node: " + text);
          
          
    //     }else if (child.nodeType === Node.ELEMENT_NODE){
    //       const el = child as HTMLElement;
    //      if (el.id != clikedElementID) {
    //         text += extractText(el, clikedElementID)
    //         console.log("text element node : " + text);
            
    //       }
    //     }
    // }
    //   console.log("children : " + children);
    //   return text;
      
      

    // }

    

    
    
  }

}
