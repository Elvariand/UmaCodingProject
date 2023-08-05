import { Routes, Route } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Form from "./components/Form";


function App() {
  return (

    <div class="app mt-5">
      <div class="auth-wrapper">
        <div class="auth-inner">
          <Routes>
            <Route exact path="/" Component={ Form } />
            <Route path="/app" Component={ Form } />
          </Routes>
        </div>
      </div>
    </div>

  );
}

export default App;
