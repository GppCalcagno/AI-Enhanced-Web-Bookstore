import React, { Component } from "react";
import { Button, Table, ButtonToolbar, ButtonGroup } from "react-bootstrap";
import { Form, InputGroup, Image } from "react-bootstrap";
import { FcPaid,FcAbout,FcFilledFilter,FcFullTrash,FcSupport,FcPlus,FcCollaboration,FcAndroidOs} from "react-icons/fc";



import { Dropdown, DropdownButton } from "react-bootstrap";
import { AddBook } from "./AddBook";
import { EditBook } from "./EditBook";
import { DetailBook } from "./DetailBook";
import { ReviewBook } from "./ReviewBook";
import { ResumeAiBook } from "./resumeAiBook";



export class BookList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            books: [],
            orderBy: "bookID", 

            addBookShow: false,

            reviewShow: false,
            reviewList: null,
            
            detailBookShow: false,
            selectedDetail: null,
            bookSelected: null,
            
            editBookShow: false,

            resumeAiBookShow: false,
            
            titleFilter: "", authorFilter: "", priceFilter: "minor", priceValue: NaN
        };

        this.handleFilter = this.handleFilter.bind(this);
        this.handleBookDetail = this.handleBookDetail.bind(this);
        this.deleteBookfunction = this.handedeleteBook.bind(this);
        this.refreshList = this.handleBookList.bind(this);
        this.checkAuthenticated = this.handleAuthenticated.bind(this);
        this.handleCart = this.handleCart.bind(this);
        this.handleBookReview = this.handleBookReview.bind(this);
    }

    componentDidMount() {
        console.log("componentDidMount called")
        this.handleAuthenticated().then(() => {this.handleBookList(); });        
    }

    
    async handleAuthenticated  () {
        await fetch(process.env.REACT_APP_API + 'myApp/getloggeduser/', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(res => res.json()).then((result) => {
            if (result != null) {
                this.setState({ user: result });
            }else{
                this.setState({ user: null});
            }
        });
    }

    async handleBookList() {
        console.log("refreshList called");
        //console.log("TitleFilter: " + this.state.titleFilter);
        //console.log("AuthorFilter: " + this.state.authorFilter);
        //console.log("orderBy: " + this.state.orderBy);
        console.log("priceFilter: " + this.state.priceFilter);
        console.log("priceValue: " + this.state.priceValue);

        await fetch(process.env.REACT_APP_API +
            'myApp/books/?orderBy=' + this.state.orderBy +
            '&titleFilter=' + this.state.titleFilter +
            '&authorFilter=' + this.state.authorFilter +
            '&priceFilter=' + this.state.priceFilter +
            '&priceValue=' + this.state.priceValue
        ).then(response => response.json()).then(data => { this.setState({ books: data }); });
    }

    async handleCart(id) {
        await fetch(process.env.REACT_APP_API + 'myApp/cart/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"book":id})
        }).then(response => response.json()).then(data => {alert(data)});

    }

    async handleBookDetail(book) {
        console.log("handleBookDetail called");

        await fetch(process.env.REACT_APP_API + 'myApp/bookdetail/' + book.bookID, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(response => response.json()).then(data => { this.setState({ selectedDetail: data }); }).then(() => { this.setState({ bookSelected: book }); }).then(() => { this.setState({ detailBookShow: true }); });
    }

    
    async handleBookReview(book) {
        console.log("handleBookReview called");
        
        await fetch(process.env.REACT_APP_API + 'myApp/review/' + book.bookID +"/", {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(response => response.json()).then(data => { this.setState({ reviewList: data }); }).then(() => { this.setState({ bookSelected: book }); }).then(() => { this.setState({ reviewShow: true }); });
    }


    async handedeleteBook(book) {
        if (window.confirm('Are you sure?')) {

            await fetch(process.env.REACT_APP_API + 'myApp/books/', {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bookID: book.bookID,
                    title: book.title,
                    author: book.author,
                    pub_year: book.pub_year,
                    price: book.price
                })
            }).then(() => { this.handleBookList(); });
        }
    }


    handlebookAiResume(book) {
        console.log("handlebookAiResume called");
         this.setState({ resumeAiBookShow: true, bookSelected: book});
    }

    handleFilter(event) {
        event.preventDefault();
        this.setState({ titleFilter: event.target.elements.titleFilter.value, authorFilter: event.target.elements.authorFilter.value }, () => { this.handleBookList(); });
    }


    render() {
        const { books, bookid, title, author, pub_year, price } = this.state;

        // set State is asynchronous, so we need to use a callback to refresh the list after the state is set
        let addBookClose = () => { this.setState({ addBookShow: false }); this.handleBookList(); };

        let detailBookClose = () => { this.setState({ detailBookShow: false }); };
        let resumeAiBookClose = () => { this.setState({ resumeAiBookShow: false }); };
        let editBookClose = () => { this.setState({ editBookShow: false }, () => { this.handleBookList(); }); };

        let reviewClose = () => { this.setState({ reviewShow: false });};

        let editOrderBy = (orderBy) => { this.setState({ orderBy }, () => { this.handleBookList(); }); };

        // find the min and max price

        return (
            <div className="App" > <div />
                <div className="container border border rounded p-4 mt-3">
                    <div className="row">

                        <div className="col-md-8 d-flex align-items-center justify-content-center ">
                            <Form onSubmit={this.handleFilter} style={{ maxWidth: '600px' }}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="basic-addon3">
                                        Book Title:
                                    </InputGroup.Text>
                                    <Form.Control id="titleFilter" aria-describedby="basic-addon3" />
                                </InputGroup>

                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="basic-addon3">
                                        Author:
                                    </InputGroup.Text>
                                    <Form.Control id="authorFilter" aria-describedby="basic-addon3" />
                                </InputGroup>

                                <InputGroup className="mb-3">
                                    <InputGroup.Text id="basic-addon3">
                                        Price:
                                    </InputGroup.Text>

                                    <DropdownButton
                                        as={InputGroup.Prepend}
                                        variant="outline-secondary"
                                        title={this.state.priceFilter}
                                        id="input-group-dropdown-1"
                                    >
                                        <Dropdown.Item onClick={() => this.setState({ priceFilter: 'minor' })}>Minor</Dropdown.Item>
                                        <Dropdown.Item onClick={() => this.setState({ priceFilter: 'major' })}>Major</Dropdown.Item>
                                    </DropdownButton>

                                    <Form.Control
                                        type="number"
                                        placeholder="Enter price"
                                        aria-describedby="basic-addon3"
                                        value={isNaN(this.state.priceValue) ? "" : this.state.priceValue}
                                        onChange={(e) => this.setState({ priceValue: e.target.value === "" ? NaN : e.target.value })}
                                    />
                                </InputGroup>

                                <Button variant="primary" type="info" size="sm">
                                    Filter <FcFilledFilter/>
                                </Button>
                            </Form>
                        </div>

                        <div className="col-md-3 d-flex align-items-center justify-content-center">
                            <Image src="/search1.svg" rounded style={{ width: '200px', height: '200px' }} all="true" />
                        </div>

                    </div>
                </div>

                <Table className="mt-4 table-spinned" striped hover size="sm">

                    <thead>
                        <tr>

                            <th>
                                <DropdownButton as={ButtonGroup} title="Title" id="bg-nested-dropdown" variant="link">
                                    <Dropdown.Item eventKey="1" onClick={() => { editOrderBy("title") }} >Ascending </Dropdown.Item>
                                    <Dropdown.Item eventKey="2" onClick={() => { editOrderBy("-title") }} >Descending</Dropdown.Item>
                                </DropdownButton>
                            </th>
                            <th>
                                <DropdownButton as={ButtonGroup} title="Author" id="bg-nested-dropdown" variant="link">
                                    <Dropdown.Item eventKey="1" onClick={() => editOrderBy("author")} >Ascending </Dropdown.Item>
                                    <Dropdown.Item eventKey="2" onClick={() => editOrderBy("-author")} >Descending</Dropdown.Item>
                                </DropdownButton>
                            </th>
                            <th>
                                <DropdownButton as={ButtonGroup} title="Publication Year" id="bg-nested-dropdown" variant="link">
                                    <Dropdown.Item eventKey="1" onClick={() => editOrderBy("pub_year")} >Ascending </Dropdown.Item>
                                    <Dropdown.Item eventKey="2" onClick={() => editOrderBy("-pub_year")} >Descending</Dropdown.Item>
                                </DropdownButton>
                            </th>
                            <th>
                                <DropdownButton as={ButtonGroup} title="Price" id="bg-nested-dropdown" variant="link">
                                    <Dropdown.Item eventKey="1" onClick={() => editOrderBy("price")} >Ascending </Dropdown.Item>
                                    <Dropdown.Item eventKey="2" onClick={() => editOrderBy("-price")} >Descending</Dropdown.Item>
                                </DropdownButton>
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody >

                        {books.map(book =>
                            <tr key={book.bookID}>

                                <td>
                                    <div className="d-flex align-items-center justify-content-center">
                                        <ButtonToolbar className='align-middle'>
                                            <Button className='align-middle' size="sm" variant="outline-dark" onClick={() => this.handleBookDetail(book)}>
                                                {book.title}<FcAbout/>
                                            </Button>
                                        </ButtonToolbar>
                                    </div>

                                </td>
                                <td>{book.author}</td>
                                <td>{book.pub_year}</td>
                                <td>{book.price} $</td>
                                <td>
                                    <ButtonToolbar >
                                        <ButtonGroup className="me-2" aria-label="First group">
                                            <Button id="edit" className="mr-2" variant="light" size="sm" 
                                                onClick={() => this.setState({ editBookShow: true, bookid: book.bookID, title: book.title, author: book.author, pub_year: book.pub_year, price: book.price })}>
                                                <FcSupport/>
                                            </Button>
                                        </ButtonGroup>

                                        <ButtonGroup className="me-2" aria-label="Second group">
                                            <Button id="add" className="mr-2"  style={{ backgroundColor: '#ceff99',border:'#ceff99' }} size="sm"  disabled={this.state.user === null} onClick={() => {this.handleCart(book.bookID)}}>
                                                <FcPaid />
                                            </Button>
                                        </ButtonGroup>

                                        <ButtonGroup className="me-2" aria-label="Second group">
                                            <Button id="comments" className="mr-2"  style={{ backgroundColor: '#ffff99',border:'#ffff99' }} size="sm"  disabled={this.state.user === null} onClick={() => {this.handleBookReview(book);}}>
                                                <FcCollaboration />
                                            </Button>
                                        </ButtonGroup>

                                        <ButtonGroup className="me-2" aria-label="Second group">
                                            <Button id="ai" className="mr-2" style={{ backgroundColor: '#ffe6ff',border:'#ffe6ff' }} size="sm" onClick={() => { this.handlebookAiResume(book); }}>
                                                <FcAndroidOs/>
                                            </Button>
                                        </ButtonGroup>

                                        <ButtonGroup className="me-2" aria-label="Second group">
                                            <Button id="delete" className="mr-2" style={{ backgroundColor: '#ff8080',border:'#ff8080' }} size="sm" onClick={() => { this.handedeleteBook(book); }}>
                                                <FcFullTrash/>
                                            </Button>
                                        </ButtonGroup>
                                    </ButtonToolbar>

                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
                {this.state.user === null && "SignIn to add a book to the cart and have access to the reviews" }
                <ButtonToolbar >
                    <Button variant='primary' onClick={() => this.setState({ addBookShow: true })}>
                        Add Book <FcPlus/>
                    </Button>

                </ButtonToolbar>

                <DetailBook show={this.state.detailBookShow} onHide={detailBookClose} bookdetail={this.state.selectedDetail} bookselected={this.state.bookSelected} />


                <ResumeAiBook show={this.state.resumeAiBookShow} onHide={resumeAiBookClose} bookselected={this.state.bookSelected}/>

                <AddBook show={this.state.addBookShow} onHide={addBookClose} />

                <ReviewBook show={this.state.reviewShow} onHide={reviewClose} bookreviews={this.state.reviewList} bookselected={this.state.bookSelected} user={this.state.user} />
                
                <EditBook show={this.state.editBookShow} onHide={editBookClose} bookid={bookid} title={title} author={author} pub_year={pub_year} price={price}/>



            </div >
        );
    }
}