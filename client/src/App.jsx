import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;