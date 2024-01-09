import React, { Component } from "react";
import { Modal, Button, } from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';
import { Container, Col } from 'react-bootstrap';

export class ResumeAiBook extends Component {

    constructor(props) {
        super(props);
        this.state = { data: null }
        this.handleShow = this.handleShow.bind(this);
    }



    handleShow() {
        // Your function to be called when the modal is about to be shown
        fetch(process.env.REACT_APP_API + 'myApp/bookresume/'+this.props.bookselected.bookID+"/", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(res => res.json()).then((result) => { this.setState({ data: result })}).then((result) => {console.log(this.state.data);});
    };

    render() {
        return (
            <div className="container" >
                <Modal
                    {...this.props}
                    size="lg"
                    //aria-labelledby="contained-modal-title-vcenter"
                    centered
                    onShow={this.handleShow}
                    onExit={() => { this.setState({ data: null }) }}
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            AI Powered Resume
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body >

                        {this.state.data === null ?

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Spinner mt-3="true" animation="grow" variant="primary" style={{ width: '120px', height: '120px' }} />
                            </div>
                            : 
                                <Container className="text-display-container">
                                <Col>
                                <div md={6} className="text-column">
                                    <h4> The Robotic Librarian's Reflections</h4>
                                    <p>{this.state.data.bookinfo}</p>
                                </div>
                                <div md={6} className="text-column">
                                    <h4>Reader's Echo: What Others Are Saying</h4>
                                    <p>{this.state.data.commentsummary}</p>
                                </div>
                                </Col>
                            </Container>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="mt-3" variant="danger" onClick={this.props.onHide}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }

}