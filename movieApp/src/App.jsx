import Home from "./pages/Home";
import Login from "./pages/Login";
import SignIn from "./pages/SignIn";
import AboutUs from "./pages/AboutUs";
import Infor from "./pages/Infor";
import Container from "./pages/Container";
import NotFound from "./pages/NotFound";
import Watch from "./pages/Watch";
import ListMovies from "./pages/ListMovies";
import ListType from "./pages/ListType";
import "@coreui/coreui/dist/css/coreui.min.css";
import { type } from "./global/Type";
import { LoadingProvider } from "./global/LoadingProvider";
import { LoginProvider } from "./global/LoginProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserProfile from "./pages/User";
import OAuthSuccess from "./pages/OAuthSuccess";
import Dashboard from "./pages/DashBoard";
import "react-toastify/dist/ReactToastify.css"; // <-- Đặt cuối

function App() {
  return (
    <LoadingProvider>
      <LoginProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Container />}>
              <Route path="/" element={<Home />} />
              <Route path="/list">
                <Route path="find_movies" element={<ListMovies title="" />} />
                <Route
                  path="top_movies"
                  element={<ListMovies title="Phim Hot" />}
                />
                {type.map((item) => {
                  return (
                    <Route
                      key={item._id}
                      path={item.slug}
                      element={<ListMovies title={item.name} />}
                    />
                  );
                })}
              </Route>
              <Route path="/listType/:slug" element={<ListType />}></Route>
              <Route path="/about_us" element={<AboutUs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/infor/:slug" element={<Infor />} />
              <Route path="/watch/:slug" element={<Watch />}></Route>
              <Route path="/user/:id" element={<UserProfile />}></Route>
              <Route path="/oauth-success" element={<OAuthSuccess />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LoginProvider>
    </LoadingProvider>
  );
}

export default App;
