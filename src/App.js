// App.js
import './App.css';
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UploadPage from './pages/UploadPage';
import { UserContextProvider } from "./UserContext";
import CreatePost from "./pages/addPhotos";
import Preview from './pages/preview';
import CreateAccount from "./pages/createAccount";
import Edit from "./pages/edit";
import NewProject from './pages/newProject';
import ProfileView from './pages/profileview';
import ProfileForm from './pages/Profile';
import NewProj from './pages/newproj';
import MyProjects from './pages/myprojects';
import ProjectDetails from './pages/ProjectDetails'; // Import the new component

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/profileview" element={<ProfileView />} />
          <Route path="/profileform" element={<ProfileForm />} />
          <Route path="/createaccount" element={<CreateAccount />} />
          <Route path="/edit" element={<Edit />} />
          <Route path="/newproject" element={<NewProject />} />
          <Route path="/newproj" element={<NewProj />} />
          <Route path="/myproject" element={<MyProjects />} />
          <Route path="/myproject/:id" element={<ProjectDetails />} /> {/* Update route */}
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
