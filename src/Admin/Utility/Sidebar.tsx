import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom"; // Use Link for navigation

export default function Sidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    // Check token when the sidebar is opened
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:8080/logout", {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            localStorage.removeItem("token");
            navigate("/", { replace: true }); // Redirect after logout
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100 relative">
            {/* UserSidebar */}
            <div className={`bg-white w-64 p-4 space-y-6 shadow-md fixed md:static top-0 left-0 h-full transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 z-50`}>
                <h2 className="text-xl font-bold"><Link to="/dashboard">Sidebar</Link></h2>
                <nav className="flex flex-col space-y-4">
                    <Link to="/motorcycles" className="hover:text-blue-500">Motorcycles</Link>
                    <Link to="/management_user" className="hover:text-blue-500">Management User</Link>
                    <Button variant="destructive" onClick={handleLogout} className="mt-4">
                        Logout
                    </Button>
                </nav>
            </div>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main content */}
            <div className="flex-1 p-6 md:ml-64">
                {/* Mobile menu button */}
                <div className="md:hidden mb-4">
                    <Button variant="outline" onClick={() => setSidebarOpen(true)}>
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>

                {/* Placeholder for dynamic page content */}
                <div>
                    {/* Here, you can place dynamic content based on route changes */}
                </div>
            </div>
        </div>
    );
}
