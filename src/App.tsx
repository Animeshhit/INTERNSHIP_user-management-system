import { Route, Routes } from "react-router-dom";
import LoginForm from "./pages/Login";
import UserList from "./pages/UserList";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
