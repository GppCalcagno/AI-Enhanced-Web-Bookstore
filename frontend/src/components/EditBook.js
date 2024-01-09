import React, { Component } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export class EditBook extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleSubmit(event) {

        event.preventDefault();
        fetch(process.env.REACT_APP_API + 'myApp/books/', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                bookID: event.target.BookId.value,
                title: event.target.Title.value,
                author: event.target.Author.value,
                pub_year: event.target.PubYear.value,
                price: event.target.BookPrice.value
            })
        }).then(res => res.json()).then((result) => {this.props.onHide();  alert(result);});

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
                            Edit Book
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body >
                        <div className="d-flex align-items-center justify-content-center" >
                        <Form onSubmit={this.handleSubmit} style={{ minWidth: '500px' }} >

                            <Form.Group controlId="BookId" >
                                <Form.Label>Book ID</Form.Label>
                                <Form.Control type="text" name="BookId" required disabled defaultValue={this.props.bookid}
                                    placeholder="BookId" />
                            </Form.Group>

                            <Form.Group controlId="Title" className="mt-2">
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" name="Title" required defaultValue={this.props.title}
                                    placeholder="Title" />
                            </Form.Group>

                            <Form.Group controlId="Author" className="mt-2">
                                <Form.Label>BookAuthor</Form.Label>
                                <Form.Control type="text" name="Author" required defaultValue={this.props.author}
                                    placeholder="Author" />
                            </Form.Group>

                            <Form.Group controlId="PubYear" className="mt-2">
                                <Form.Label>PubYear</Form.Label>
                                <Form.Control type="text" name="PubYear" required defaultValue={this.props.pub_year}
                                    placeholder="PubYear" />
                            </Form.Group>

                            <Form.Group controlId="BookPrice" className="mt-2">
                                <Form.Label>BookPrice</Form.Label>
                                <Form.Control type="text" name="BookPrice" required defaultValue={this.props.price}
                                    placeholder="BookPrice" />
                            </Form.Group>

                            <Form.Group>
                                <Button className="mt-3" variant="primary" type="submit">
                                    Update Book
                                </Button>
                            </Form.Group>
                        </Form>
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="mt-3" variant="danger" onClick={this.props.onHide}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }

}