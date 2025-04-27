import { useState, useEffect } from "react";
import UserSidebar from "@/Users/Utility/UserSidebar.tsx";
import axios from "axios";

interface Motorcycle {
    id: number;
    name: string;
    platNumber: string;
    hargaSewaMotor: number;
    imageUrl: string;
    description: string;
}

export default function PesanMotor() {
    // Initialize motorcycles as an empty array to avoid the .map error
    const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedMotorcycle, setSelectedMotorcycle] = useState<Motorcycle | null>(null);
    const [formData, setFormData] = useState({
        motorcycleId: 0,
        tanggalPinjam: "",
        tanggalKembali: "",
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [bookingSummary, setBookingSummary] = useState<any>(null);

    useEffect(() => {
        // Fetch motorcycle data when component mounts
        fetchMotorcycles();
    }, []);

    const fetchMotorcycles = async () => {
        try {
            setLoading(true);
            // Adjust the URL to match your API endpoint
            const response = await axios.get("/get-all-data-motorcycle");

            // Add console logging to see the structure of the response
            console.log("API Response:", response);

            // Check if response.data is an array or access the correct property
            // If response.data itself is not an array but contains a property with the array:
            const motorcycleData = Array.isArray(response.data)
                ? response.data
                : response.data.data || response.data.motorcycles || [];

            console.log("Motorcycle Data:", motorcycleData);

            setMotorcycles(motorcycleData);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching motorcycles:", err);
            setError("Failed to load motorcycles");
            setLoading(false);
        }
    };

    const handleSelectMotorcycle = (motorcycle: Motorcycle) => {
        setSelectedMotorcycle(motorcycle);
        setFormData({
            ...formData,
            motorcycleId: motorcycle.id,
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const calculateDays = () => {
        if (!formData.tanggalPinjam || !formData.tanggalKembali) return 0;

        const startDate = new Date(formData.tanggalPinjam);
        const endDate = new Date(formData.tanggalKembali);
        const diffTime = endDate.getTime() - startDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const calculateTotal = () => {
        if (!selectedMotorcycle) return 0;
        const days = calculateDays();
        return days * selectedMotorcycle.hargaSewaMotor;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedMotorcycle) {
            setError("Please select a motorcycle");
            return;
        }

        try {
            // Get user ID from local storage or context
            const userId = localStorage.getItem("userId") || 1; // Default for testing

            const bookingData = {
                user_id: Number(userId),
                motorcycle_id: formData.motorcycleId,
                tanggal_pinjam: formData.tanggalPinjam,
                tanggal_kembali: formData.tanggalKembali,
            };

            const response = await axios.post("/api/pesan_motor", bookingData);
            setSuccessMessage("Booking successful!");
            setBookingSummary(response.data);

            // Reset form
            setFormData({
                motorcycleId: 0,
                tanggalPinjam: "",
                tanggalKembali: "",
            });
            setSelectedMotorcycle(null);
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to book motorcycle");
        }
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="flex">
            <UserSidebar />
            <div className="flex-1 p-6">
                <h2 className="text-2xl font-bold mb-6">Pesan Motor</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {successMessage}
                        {bookingSummary && (
                            <div className="mt-2">
                                <p>Durasi sewa: {bookingSummary.durasi_sewa} hari</p>
                                <p>Total harga: Rp {bookingSummary.total_harga.toLocaleString()}</p>
                            </div>
                        )}
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Motorcycle Selection Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Pilih Motor</h3>
                        {loading ? (
                            <p>Loading motorcycles...</p>
                        ) : motorcycles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Safely use map only if motorcycles is an array */}
                                {motorcycles.map((motor) => (
                                    <div
                                        key={motor.id}
                                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                            selectedMotorcycle?.id === motor.id
                                                ? "border-blue-500 bg-blue-50"
                                                : "hover:border-gray-400"
                                        }`}
                                        onClick={() => handleSelectMotorcycle(motor)}
                                    >
                                        <div className="w-full h-40 bg-gray-200 rounded-md mb-2">
                                            {motor.imageUrl ? (
                                                <img
                                                    src={motor.imageUrl}
                                                    alt={motor.name}
                                                    className="w-full h-full object-cover rounded-md"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                        <h4 className="font-medium">{motor.name}</h4>
                                        <p className="text-sm text-gray-500">{motor.platNumber}</p>
                                        <p className="text-sm mt-1">Rp {motor.hargaSewaMotor.toLocaleString()}/hari</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No motorcycles available.</p>
                        )}
                    </div>

                    {/* Booking Form Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Form Pemesanan</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Motor Terpilih
                                </label>
                                <input
                                    type="text"
                                    className="bg-gray-100 w-full p-2 rounded border"
                                    value={selectedMotorcycle ? selectedMotorcycle.name : "Belum memilih motor"}
                                    disabled
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tanggal Pinjam
                                </label>
                                <input
                                    type="date"
                                    name="tanggalPinjam"
                                    min={today}
                                    value={formData.tanggalPinjam}
                                    onChange={handleInputChange}
                                    className="w-full p-2 rounded border"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tanggal Kembali
                                </label>
                                <input
                                    type="date"
                                    name="tanggalKembali"
                                    min={formData.tanggalPinjam || today}
                                    value={formData.tanggalKembali}
                                    onChange={handleInputChange}
                                    className="w-full p-2 rounded border"
                                    required
                                />
                            </div>

                            {selectedMotorcycle && formData.tanggalPinjam && formData.tanggalKembali && (
                                <div className="p-4 bg-gray-50 rounded border">
                                    <h4 className="font-medium mb-2">Ringkasan Pesanan</h4>
                                    <div className="space-y-1">
                                        <p>Durasi: {calculateDays()} hari</p>
                                        <p>Harga per hari: Rp {selectedMotorcycle.hargaSewaMotor.toLocaleString()}</p>
                                        <p className="font-bold">Total: Rp {calculateTotal().toLocaleString()}</p>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
                                disabled={!selectedMotorcycle || !formData.tanggalPinjam || !formData.tanggalKembali}
                            >
                                Pesan Sekarang
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}