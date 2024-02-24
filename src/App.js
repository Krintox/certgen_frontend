import './App.css';
import Post from "./Post";
import Header from "./Header";
import {Route, Routes} from "react-router-dom";
import Layout from "./Layout";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UploadPage from './pages/UploadPage';
import {UserContextProvider} from "./UserContext";
import CreatePost from "./pages/CreatePost";
import PostProcess from "./pages/postProcess";
import Preview from "./pages/preview";
import CreateAccount from "./pages/createAccount";

function App() {
  return (
    <UserContextProvider>
      <Routes>
          <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/postprocess" element={<PostProcess/>} />
          <Route path="/preview" element={<Preview/>} />
          <Route path="/createaccount" element={<CreateAccount/>} />
          <Route path="/edit" element={<Edit/>} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
