import React from 'react';
import logo from './logo.svg';
import './App.css';
import Jarvis from './Components/ReactJarvis/ReactJarvis';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continous = true;
recognition.interimResults = true;
recognition.lang = 'es-PE';


export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      listening: false,finalText:""
    }
    this.toggleListen = this.toggleListen.bind(this)
    this.handleListen = this.handleListen.bind(this)
  }

  toggleListen() {
    this.setState({
      listening: !this.state.listening
    }, this.handleListen)
  }
  
  handleListen(){
    console.log('listening?', this.state.listening)

    if (this.state.listening) {
      recognition.start()
      recognition.onend = () => {
        console.log("...continue listening...")
        recognition.start()
      }

    } else {
      recognition.stop()
      recognition.onend = () => {
        console.log("Stopped listening per click")
      }
    }

    recognition.onstart = () => {
      console.log("Listening!")
    }
    let finalTranscript = '';
    recognition.onresult = event => {
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + ' ';
        else interimTranscript += transcript;
      }
      this.setState({finalText:finalTranscript})


      const transcriptArr = finalTranscript.split(' ')
      const stopCmd = transcriptArr.slice(-3, -1)
      console.log('stopCmd', stopCmd)

      if (stopCmd[0] === 'stop' && stopCmd[1] === 'listening'){
        recognition.stop()
        recognition.onend = () => {
          console.log('Stopped listening per command')
          const finalText = transcriptArr.slice(0, -3).join(' ')
          console.log(finalText);
        }
      }
    }

    recognition.onerror = event => {
      console.log("Error occurred in recognition: " + event.error)
      this.toggleListen();
    }
  }
  render() {
    
    return (
      <div className="App">
     
        <Jarvis />
        <div className="text-container"><p>{this.state.finalText}</p> </div>
        <div className="btn-container"><div onClick={this.toggleListen} className="boton"><p>START</p> </div></div>
        <button onClick={
          
          ()=>{
            let utterance  = new SpeechSynthesisUtterance();
            utterance.text = 'Hola kevin.';
            utterance.volume = 1;
            utterance.rate = 1.7;
            window.speechSynthesis.speak(utterance);
          }
          }>HABLAR</button>
    </div>
    )
  }
}