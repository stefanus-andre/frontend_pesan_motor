import { Route, Routes } from "react-router-dom";
import App from "@/App.tsx";
import Register from "@/Auth/Register.tsx";
import Dashboard from "@/Admin/Dashboard/dashboard.tsx";
import Login from "@/Auth/Login.tsx";
import Motorcycle from "@/Admin/Motorcycle/Motorcycle.tsx";
import UserDashboard from "@/Users/Dashboard/UserDashboard.tsx";
import PesanMotor from "@/Users/pesan_motor/PesanMotor.tsx";
import ManagementUser from "@/Admin/ManagementUser/ManagementUser.tsx";
import Profile from "../Users/Profile/Profile.tsx";

export default function Routing() {
    return (
        <Routes>
            <Route path="/" element={<App/>} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/motorcycles" element={<Motorcycle />} />
            <Route path="/user_dashboard" element={<UserDashboard />} />
            <Route path="/pesan_motor" element={<PesanMotor />} />
            <Route path="/management_user" element={<ManagementUser/>} />
            <Route path="/profile" element={<Profile/>}/>
        </Routes>
    );
}
