import React, { Component } from 'react';
import axios from 'axios';
import './FileUpload.css'

function sendToback(photo){
    console.log(photo)
    return axios.post('/api/photoUpload', photo)
}

export default class FileUpload extends Component {
    constructor(){
        super()

        this.state={
            file: '',
            filename: '',
            filetype: ''
        }
        this.handlePhoto=this.handlePhoto.bind(this)
        this.sendPhoto=this.sendPhoto.bind(this)
    }

    handlePhoto(event){
        const reader = new FileReader()
            , file = event.target.files[0]
            , _this = this
        
        reader.onload = photo => {
            this.setState({
                file: photo.target.result,
                filename: file.name,
                filetype: file.type
            })
        }
        reader.readAsDataURL(file)
    }

    sendPhoto(event){
        event.preventDefault()

        sendToback(this.state).then(response => {
            console.log(response.data)
            window.location.reload()
        })
    }

    render(){
        this.state.file && console.log(this.state.photo)
        return (
            <div id="FileUpload">
                <input type="file" onChange={this.handlePhoto}/>
                <br/>

                <button onClick={this.sendPhoto}>UPDATE</button>
                
            </div>
        )
    }
}