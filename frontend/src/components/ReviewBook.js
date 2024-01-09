import React, { Component } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { GoStarFill } from "react-icons/go";



export class ReviewBook extends Component {

    constructor(props) {
        super(props); //bookselected, bookreviews, user
        this.handleSubmitReview = this.handleSubmitReview.bind(this);


    }

    
    async handleSubmitReview(event) {
        console.log("handleSubmitReview called");
        event.preventDefault();

        await fetch(process.env.REACT_APP_API + "myApp/review/" + this.props.bookselected.bookID + '/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                "review": event.target.review.value,
                "rating": event.target.rating.value,
            })
        }).then(res => res.json()).then((result) => {this.props.onHide();alert(result);});
    };


    renderStars(rating) {
        const stars = [];
        for (let i = 0; i < rating; i++) {stars.push(<GoStarFill key={i} className="text-warning" />);}
        return stars;
    }


    render() {
        const userHasReview = this.props.bookreviews !== null && this.props.bookreviews.some((review) => review.user === this.props.user.userID);

        return (
            <div className="container" >
                <Modal {...this.props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Book Reviews: {this.props.bookselected !== null && (this.props.bookselected.title)}
                        </Modal.Title>
                    </Modal.Header>
                    <div className="row justify-content-center mx-3">

                        {this.props.bookreviews !== null && this.props.bookreviews.length > 0 ?
                            <div className="overflow-auto border mx-3" style={{ maxHeight: '350px' }}>
                                <ul className="list-group list-group-flush">
                                    {this.props.bookreviews.map(item => (
                                        <li key={item.reviewID} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>Rating: {this.renderStars(item.rating)}</strong>
                                                <p className="mb-0">{item.review}</p>
                                            </div>
                                            <span className="badge bg-primary">{/* Additional info */}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            : <div className="text-center mt-2">
                                <h2>No Reviews</h2>
                            </div>
                        }

                        {userHasReview ?
                            <div className="text-center mt-2">
                                <h3 className="mt-3">Review already Present</h3>
                            </div> :
                            <Form onSubmit={this.handleSubmitReview} style={{ width: '450px' }} className="mt-3" >

                                <Form.Group controlId="review" >
                                    <Form.Label>Review</Form.Label>
                                    <Form.Control as="textarea" rows={3} />
                                </Form.Group>

                                <Form.Group controlId="rating">
                                    <Form.Label>Rating</Form.Label>
                                    <Form.Control as="select">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Form.Control>
                                </Form.Group>

                                <Button className="mt-3" variant="primary" type="submit">
                                    Submit
                                </Button>

                            </Form>

                        }
                    </div>
                    <Modal.Body >



                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={this.props.onHide}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }

}



