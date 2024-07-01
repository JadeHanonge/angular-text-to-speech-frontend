import { Directive, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: '[tts-directive]'
})
export class TtsDirectiveDirective {

  constructor(private el: ElementRef) { }
  private text!: string;

  extractText(element: HTMLElement, clikedElementClasse: string) {

    let children = Array.from(element.childNodes);
    this.text = '';

    for (let child of children){
      let el = child as HTMLElement;
      if(el.className != clikedElementClasse){
        this.text += el.innerText
      }
    }
    
    return this.text; 

  }


  @HostListener('click', ['$event']) onClick(event: Event) {
    
    const clikedElement = event.target as HTMLElement
    
    if (clikedElement && clikedElement.className === 'btnListen'){
      event.stopPropagation();
      this.text = this.extractText(this.el.nativeElement, clikedElement.className)
    }
    // console.log("text : " + this.text);
    // console.log("native element : " + this.el.nativeElement);
    
    
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
    
  }

}
