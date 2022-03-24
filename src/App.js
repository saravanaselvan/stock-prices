import { Box } from "@chakra-ui/layout";
import { Route, Routes } from "react-router";
import "./App.css";
import CalculateAvg from "./Components/CalculateAvg";
import Login from "./Components/Login";
import Register from "./Components/Register";

function App() {
  return (
    <Box
      className="App"
      bgGradient="linear(to-b, blue.100, blue.300, blue.200)"
    >
      <Routes>
        <Route path="/" element={<CalculateAvg />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Box>
  );
}

export default App;
