import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Interface for the API response
interface LoginResponse {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
}

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post<LoginResponse>(
                "http://localhost:8080/login",
                {
                    email,
                    password,
                }
            );

            const { token, user } = response.data;

            // Store authentication data
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            // Redirect based on role
            switch (user.role) {
                case "admin":
                    navigate("/dashboard");
                    break;
                case "user":
                    navigate("/user_dashboard");
                    break;
                default:
                    navigate("/");
            }

        } catch (error: any) {
            console.error("Login failed:", error.response?.data?.error || error.message);
            alert(error.response?.data?.error || "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-sm shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="flex flex-col space-y-4">
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="username"
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}