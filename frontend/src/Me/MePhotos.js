import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Container, Button, Card, Row} from 'react-bootstrap'
import {Input} from 'reactstrap';
import AppNavbar from '../AppNavbar';
import $ from 'jquery';
import ErrorHandler from '../Handler/ErrorHandler';
import ErrorNotifier from '../Handler/ErrorNotifier';
import Constants from '../Const/Constants';

const address = ""

let thisObj; 

class MePhotos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login : localStorage.getItem("login"),
            id : localStorage.getItem("id"),
            role : localStorage.getItem("role"),
            user: null,
            isLoading: true,
            }

            this.upload = this.upload.bind(this)
            this.setAvatar = this.setAvatar.bind(this)
            this.removePhoto = this.removePhoto.bind(this)
            
            thisObj = this
        }

    async componentDidMount() {
        $.ajax({
            method: "Get",
            url: "/me",
            headers: {
                "Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
              },
            success: function(data){
                thisObj.setState({ user: data, isLoading: false  });
                
                Constants.updateRole(data.role)
            },
            error: function(data){
                ErrorHandler.runError(data)
            }
        })
    }

    setAvatar(event){
        let photoInDto = {
            id: event.target.getAttribute("photoId")
        }

        $.ajax({
            url: "/me/avatar",
            method: "PUT",
            data: JSON.stringify(photoInDto),
            headers: {
                "Content-Type": "application/json",
				"Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
            success: function(){
                window.location.reload ();
            },
            error: function(data){
                ErrorHandler.runError(data)
            }
        })

    }
    
    removePhoto(event){
        let photoInDto = {
            id: event.target.getAttribute("photoId")
        }

        $.ajax({
            url: "/me/photos",
            method: "DELETE",
            data: JSON.stringify(photoInDto),
            headers: {
                "Content-Type": "application/json",
				"Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
            },
            success: function(){
                window.location.reload ();
            },
            error: function(data){
                ErrorHandler.runError(data)
            }
        })
    }

	upload(event) {
		let target = event.target
		console.log(target)
		const fileInput = document.querySelector("#userImages");
		const formData = new FormData();

        for(let photo of fileInput.files){
            formData.append('photos', photo);
        }
	
		fetch("/resources/users/" + this.state.id, {
			method: "POST",
			body: formData,
			headers: {
				"Authorization": localStorage.getItem("tokenType") + " " + localStorage.getItem("accessToken")
			}
		}).then(function(){
            window.location.reload ();
        });
	}

    render() {

        if(localStorage.getItem("login") == null 
        || !Constants.isAnyRole((localStorage.getItem("role"))) 
        || localStorage.getItem("id") == null){
            return <ErrorNotifier/>
        }

		const { user, isLoading } = this.state;

		if (isLoading) {
			return <p>Loading...</p>;
		}

        console.log(Boolean(this.state.login))
        if(this.state.login == null || this.state.role == null || this.state.id == null){
            return <div><h1>Unauthorized</h1></div>
        }

        console.log(this.state.user)

		const photosList = this.state.user.photos.map(photo => {
            return <Card border="light"> 
                        <Card.Img src={"/resources/users/" + this.state.user.id + "/photos/" + photo.id} />
                        <Button onClick={this.setAvatar} photoId={photo.id} variant="success" className="mt-1">Set as Avatar</Button>
                        <Button onClick={this.removePhoto} photoId={photo.id} variant="danger" className="mt-1">Remove</Button>
                    </Card>
        })

        const avatar = user.avatar !== null ?   <Card> 
                                                    <Card.Img src={"/resources/users/" + user.id + "/photos/" + user.avatar.id}/>
                                                </Card> 
                                                : ""

        return <div>
                    <Input color="primary" type="file" name="image" id={"userImages"} multiple/>
                    <Button onClick={this.upload}> Upload</Button>
                    <Row xs={1} md={3} className="g-4">
                        {photosList}
                    </Row>
                </div>
    }
}

export default withRouter(MePhotos);