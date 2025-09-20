import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Icons from "./pages/Icons";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp"
import Layout from "./Layout";
import NotFound from "./pages/NotFound";
import "./App.css";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route path="/icons" element={<Icons />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
