import React, { Component } from "react";
import { Modal, Button,Form } from "react-bootstrap";


export class DetailBook extends Component {

    constructor(props) {
        super(props);
        this.handleSubmitDescription = this.handleSubmitDescription.bind(this);

        //bookdetail
        //bookselected
    }



    handleSubmitDescription(event) {
        event.preventDefault();
        
        if(this.props.bookdetail.bookDetailID !== undefined){
            console.log("Put");
            fetch(process.env.REACT_APP_API + 'myApp/bookdetail/'+this.props.bookselected.bookID+"/", {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
    
                body: JSON.stringify({
                    bookDetailID: this.props.bookdetail.bookDetailID,
                    isbn: event.target.isbn.value === "" ? null : event.target.isbn.value,
                    notes: event.target.notes.value === "" ? null : event.target.notes.value,
                    pages: event.target.pages.value === "" ? null : event.target.pages.value,
                    book: this.props.bookselected.bookID,
    
                })
            }).then(res => res.json()).then((result) => {this.props.onHide();alert(result);});
        }
        
        else{
            console.log(event.target.pages.value);
            fetch(process.env.REACT_APP_API + 'myApp/bookdetail/'+this.props.bookselected.bookID+"/", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
    
                body: JSON.stringify({
                    isbn: event.target.isbn.value === "" ? null : event.target.isbn.value,
                    notes: event.target.notes.value === "" ? null : event.target.notes.value,
                    pages: event.target.pages.value === "" ? null : event.target.pages.value,
                    book: this.props.bookselected.bookID,
    
                })
            }).then(res => res.json()).then((result) => {this.props.onHide();alert(result);});
        }
    }

    


    render() {


        return (
            <div className="container" >
                <Modal
                    {...this.props}
                    size="lg"
                    //aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Book Information {this.props.bookselected !== null && (this.props.bookselected.title)}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body >
                        <div className="d-flex align-items-center justify-content-center">
                            {this.props.bookdetail !== null && (



                                <Form onSubmit={this.handleSubmitDescription} style={{ minWidth: '500px' }} >

                                    <Form.Group controlId="Book Title" className="mt-2">
                                        <Form.Label>Book Title</Form.Label>
                                        <Form.Control type="text" name="BookTitle" required disabled defaultValue={this.props.bookselected.title}/>
                                    </Form.Group>

                                    <Form.Group controlId="isbn" className="mt-2">
                                        <Form.Label>ISBN</Form.Label>
                                        <Form.Control type="isbn" name="isbn" defaultValue={this.props.bookdetail.isbn}
                                            placeholder="NO ISBN available" />
                                    </Form.Group>

                                    <Form.Group controlId="notes" className="mt-2">
                                        <Form.Label>Notes</Form.Label>
                                        <Form.Control type="notes" name="notes" defaultValue={this.props.bookdetail.notes}
                                            placeholder="NO notes available" />
                                    </Form.Group>

                                    <Form.Group controlId="pages" className="mt-2">
                                        <Form.Label>Number of Pages</Form.Label>
                                        <Form.Control type="number" name="pages" defaultValue={this.props.bookdetail.pages}
                                            placeholder="NO pages available"/>
                                    </Form.Group>

                            
                                    <Form.Group className="mt-3">
                                        <Button variant="primary" type="submit" size="sm">
                                            Update Book Information 
                                        </Button>
                                    
                                    </Form.Group>
                                    
                                </Form>


                            )}
                            {
                            }
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={this.props.onHide}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }

}


