import './App.css';
import {Route, Routes} from "react-router-dom";
import Layout from "./Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UploadPage from './pages/UploadPage';
import {UserContextProvider} from "./UserContext";
import CreatePost from "./pages/addPhotos";
import Preview from './pages/preview';
import CreateAccount from "./pages/createAccount";
import Edit from "./pages/edit";
import NewProject from './pages/newProject';

function App() {
  return (
    <UserContextProvider>
      <Routes>
          <Route path="/" element={<Layout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/preview" element={<Preview/>} />
          <Route path="/createaccount" element={<CreateAccount/>} />
          <Route path="/edit" element={<Edit/>} />
          <Route path="/newproject" element={<NewProject/>} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
