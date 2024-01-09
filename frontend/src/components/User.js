import React, { Component } from "react";
import { Button, Form, Image,Table } from "react-bootstrap";
import {FcFullTrash} from "react-icons/fc";

export class User extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLogin: true,
            isAuthenticated: false,
            user: null,
            bookList: null,
        };
    }

     async componentDidMount() {
        await this.checkAuthenticated().then(() => {
            if(this.state.isAuthenticated){this.getCart();}});
    }


    checkAuthenticated = async () => {
        await fetch(process.env.REACT_APP_API + 'myApp/getloggeduser/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(res => res.json()).then((result) => {
            if (result != null) {
                this.setState({ user: result, isAuthenticated: true },() => { this.getCart(); });
            }else{
                 this.setState({ user: null, isAuthenticated: false });
            }
        });
    }


    handleSubmit = async (event) => {
        event.preventDefault();

        if (this.state.isLogin) {
            await fetch(process.env.REACT_APP_API + 'myApp/login/', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: event.target.mail.value,
                    password: event.target.password.value,
                })
            }).then(res => res.json()).then((result) => { this.checkAuthenticated(); alert(result); });
        } else {
            await fetch(process.env.REACT_APP_API + 'myApp/signup/', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    email: event.target.mail.value,
                    password: event.target.password.value,
                })
            }).then(res => res.json()).then((result) => { this.checkAuthenticated(); alert(result); });
        }
    }

    handleLogout = async () => {
        await fetch(process.env.REACT_APP_API + 'myApp/logout/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

        }).then(res => res.json()).then(() => {this.setState({isLogin: true, isAuthenticated: false, user: null, bookList: null,});this.checkAuthenticated(); });
    }



    async getCart(){
        
        await fetch(process.env.REACT_APP_API + 'myApp/cart/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },

        }).then((res) => res.json()).then((result) => {this.setState({ bookList: result});});
        
    }

    handleRemoveBook = async (id) => {
        
        await fetch(process.env.REACT_APP_API + 'myApp/cart/', {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                book: id,
            })

        }).then(res => res.json()).then((result) => {this.getCart();  alert(result);}) ;
    }


    // UI Rendering using bootstrap    <div className="col-md-8 d-flex align-items-center justify-content-center ">
    render() {
        // sum all bookList.price
        const totalprice = this.state.bookList != null ? this.state.bookList.reduce((sum, book) => sum + book.price, 0) : 0;

        if (this.state.isAuthenticated) {
            return (
                <div >
                <div className="container border rounded mt-3 text-center"> {/* Added text-center class to center the container */}
                    <div className="row justify-content-center align-items-center">
                        <div className="col text-center mt-3 mb-3">
                            <Image src="/welcome2.svg" rounded style={{ width: '200px' }} alt="Image Alt Text" />
                        </div>

                        <div className="col mt-3">
                            <h2 className="text-center">Welcome {this.state.user.email.split('@')[0]}</h2>
                        </div>
                        <Button variant="secondary" onClick={() => { this.handleLogout() }}> logout </Button>
                    </div>
                </div>

                {this.state.bookList && this.state.bookList.length ? <div className="container border rounded mt-3 text-center"> {/* Added text-center class to center the container */}
                    <h3 className="mt-4 ms-3">Shopping Cart</h3>
                    <h5 className="mt-4 ms-3">Total Price: {totalprice}$ </h5>

                    <Table className="mt-4 table-spinned" hover size="sm" >
                        {/* Add style={{ width: 'your-desired-width' }} to control the width of the table */}
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.bookList && this.state.bookList.map((book,index) => (
                                <tr key={index}>
                                    <td>{book.title}</td>
                                    <td>{book.price}</td>
                                    <td>
                                        <Button id="delete" className="mr-2" style={{ backgroundColor: '#ff8080', border: '#ff8080' }} size="sm" onClick={() => { this.handleRemoveBook(book.bookID) }}>
                                            <FcFullTrash />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>: this.state.bookList ?
                
                
                <div className="container  rounded mt-5 text-center"> {/* Added text-center class to center the container */}
                    <div className="col justify-content-center align-items-center">
                        <div className="col text-center mt-3 mb-3">
                            <Image src="/cart.svg" rounded style={{ width: '300px' }} alt="Image Alt Text" />
                        </div>

                        <div className="col mt-3">
                            <h5 className="text-center"> Add a Book to the Cart!</h5>
                        </div>
                    </div>
                </div>
                : null}

                </div>

            )
        }
        else {
            return (
                <div className="container border rounded mt-3">
                    <div className="row justify-content-center align-items-center">
                        <div className="col text-center">
                            <Image src="/login.svg" rounded style={{ width: '400px' }} alt="Image Alt Text" />
                        </div>

                        <div className="col">
                            <div className="text-center">
                                <h2> {this.state.isLogin ? "Login" : "Register"} </h2>
                            </div>
                            <Form onSubmit={this.handleSubmit} style={{ maxWidth: '500px', margin: 'auto' }}>
                                <Form.Group controlId="email" className="mb-3">
                                    <Form.Label>User Email</Form.Label>
                                    <Form.Control type="text" name="mail" required placeholder="Enter email" />
                                </Form.Group>

                                <Form.Group controlId="password" className="mb-4">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" name="password" required placeholder="Enter password" />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Button variant="primary" type="submit">
                                        {this.state.isLogin ? "Login" : "Register"}
                                    </Button>

                                    <Button variant="link" onClick={() => this.setState({ isLogin: !this.state.isLogin })}>
                                        {this.state.isLogin ? "or Create an Account" : "or Login "}
                                    </Button>
                                </Form.Group>

                            </Form>

                        </div>
                    </div>
                </div>
            );

        }

    }
}

