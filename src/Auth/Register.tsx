import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [namaLengkap, setNamaLengkap] = useState("");
    const [noTelp, setNoTelp] = useState("");
    const [nik, setNik] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate passwords match
        if (password !== confirmPassword) {
            alert("Password tidak cocok");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/register", {
                nama_lengkap: namaLengkap,
                no_telp: noTelp,
                nik: nik,
                email,
                password,
            });

            alert("Registrasi berhasil");
            navigate("/login");
        } catch (error: any) {
            console.error("Registrasi gagal:", error.response?.data?.error || error.message);
            alert(error.response?.data?.error || "Registrasi gagal");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center">Register</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="flex flex-col space-y-4">
                        <Input
                            type="text"
                            placeholder="Nama Lengkap"
                            value={namaLengkap}
                            onChange={(e) => setNamaLengkap(e.target.value)}
                            required
                        />
                        <Input
                            type="tel"
                            placeholder="Nomor Telepon"
                            value={noTelp}
                            onChange={(e) => setNoTelp(e.target.value)}
                            required
                        />
                        <Input
                            type="text"
                            placeholder="NIK"
                            value={nik}
                            onChange={(e) => setNik(e.target.value)}
                            required
                        />
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Konfirmasi Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <Button type="submit" className="w-full">
                            Register
                        </Button>
                        <div className="text-center">
                            <p className="text-sm">
                                Sudah punya akun?{" "}
                                <a
                                    href="/login"
                                    className="text-blue-600 hover:underline"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate("/login");
                                    }}
                                >
                                    Login
                                </a>
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}