import React, { Component } from 'react';
import EmojiPicker from 'emoji-picker-react';
import './MyEmojiInput.css'

class MyEmojiInput extends Component {
  constructor(){
    super();
    
    this.getEmoji=this.getEmoji.bind(this);
  }
  getEmoji(name,rest){
    var emo=`https://cdn.jsdelivr.net/emojione/assets/3.0/png/32/${name}.png`
    this.setState({emo})
    this.props.addEmoji(emo)
  }
  render() {

    return (
      <div >
      <EmojiPicker  onEmojiClick={(name,rest)=>this.getEmoji(name,rest)}/>
      </div>
    );
  }
}

export default MyEmojiInput ;
