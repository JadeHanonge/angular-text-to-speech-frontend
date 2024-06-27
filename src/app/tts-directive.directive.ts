import { Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[tts-directive]'
})
export class TtsDirectiveDirective {

  constructor(private el: ElementRef) { }

  @HostListener('click', ['$event']) onClick(event: Event) {
    
    console.log("el : " + this.el);
    console.log("event : " + event);
    
    
    const clikedElement = event.target as HTMLElement
    let text = '';

    if (clikedElement && clikedElement.id === 'btnListen'){
      event.stopPropagation();
      text = extractText(this.el.nativeElement, clikedElement.id)
    }
    console.log("text : " + text);
    console.log("native element : " + this.el.nativeElement);
    
    
    //envoie le text au serveur
    fetch('http://localhost:3001/speak', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: text })
      
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
    function extractText(element: HTMLElement, clikedElementID: string) {

      let text = ' ';
      let children = Array.from(element.childNodes);

     for (let child of children) {
        if (child.nodeType === Node.TEXT_NODE){
          text += child.nodeValue;
          console.log("text node: " + text);
          
          
        }else if (child.nodeType === Node.ELEMENT_NODE){
          const el = child as HTMLElement;
         if (el.id != clikedElementID) {
            text += extractText(el, clikedElementID)
            console.log("text element node : " + text);
            
          }
        }
    }
      console.log("children : " + children);
      return text;
      
      

    }

    

    
    
  }

}
