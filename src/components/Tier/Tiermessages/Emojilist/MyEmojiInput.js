import React, { Component } from 'react';
import EmojiPicker from 'emoji-picker-react';

class MyEmojiInput extends Component {
  constructor(){
    super();
    this.getEmoji=this.getEmoji.bind(this);
  }
  getEmoji(name,rest){

    this.props.addEmoji(rest.name)
  }
  render() {

    return (
      <div className="Nav">
      <EmojiPicker onEmojiClick={(name,rest)=>this.getEmoji(name,rest)} />
      </div>
    );
  }
}

 
export default MyEmojiInput ;
