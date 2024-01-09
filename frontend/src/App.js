import './App.css';

import {BookList} from "./components/BookList";
import {User} from "./components/User";
import {Navigation} from "./components/Navigation";


import {BrowserRouter,Route,Routes} from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Navigation />
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/user" element={<User />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
