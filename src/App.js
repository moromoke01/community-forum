import './App.css';
import LoginPage from './Components/Auth/Login';
import SignUpPage from './Components/Auth/SignUp';
import CommunityForum from './Components/CommunityForum1';
import PostDetails from './Components/PostDetails';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom"

function App() {
  return (
    <div className="App">
     
     <Router>
        <Routes>
          <Route path='/Login' element={<LoginPage />}  />
          <Route path='/' element={<SignUpPage />}  />
          <Route path="/post/:postId" component={PostDetails} />
          <Route path='/CommunityForum' element={<CommunityForum />}  />
        </Routes>
      </Router>      
    </div>
  );
}

export default App;
