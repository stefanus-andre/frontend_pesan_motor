import { useState, useEffect } from "react";
import UserSidebar from "@/Users/Utility/UserSidebar.tsx";
import axios from "axios";

interface ApiMotorcycle {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    nama_motor: string;
    jenis_motor: string;
    nomor_plat_motor: string;
    qty_motor: number;
    harga_sewa_motor: number;
    tanggal_pinjam: string;
    tanggal_kembali: string;
    image_motor: string;
}

interface Motorcycle {
    id: number;
    name: string;
    platNumber: string;
    hargaSewaMotor: number;
    imageUrl: string;
    description: string;
}

interface BookingResponse {
    data: {
        ID: number;
        motorcycle_id: number;
        tanggal_pinjam: string;
        tanggal_kembali: string;
        total_harga_sewa: number;
    };
    durasi_sewa: number;
    message: string;
    total_harga: number;
}

interface Notification {
    type: 'success' | 'error' | 'info';
    message: string;
    details?: React.ReactNode;
}

export default function PesanMotor() {
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
    const [showModal, setShowModal] = useState(false);
    const [notification, setNotification] = useState<Notification | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchMotorcycles();
    }, []);

    // Auto hide notification after 5 seconds
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const showNotification = (type: 'success' | 'error' | 'info', message: string, details?: React.ReactNode) => {
        setNotification({ type, message, details });
    };

    const fetchMotorcycles = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8080/user/motorcycles",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const rawData = response.data["data semua motorcycles"] || [];
            const motorcycleData = rawData.map((motor: ApiMotorcycle) => ({
                id: motor.ID,
                name: motor.nama_motor,
                platNumber: motor.nomor_plat_motor,
                hargaSewaMotor: motor.harga_sewa_motor,
                imageUrl: motor.image_motor,
                description: motor.jenis_motor
            }));

            setMotorcycles(motorcycleData);
            setLoading(false);
        } catch (err: any) {
            if (err.response?.status === 401) {
                showNotification('error', "Session expired. Please login again.");
                localStorage.removeItem("token");
                window.location.href = "/login";
            } else {
                showNotification('error', "Failed to load motorcycles. Please try again later.");
            }
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedMotorcycle) {
            showNotification('error', "Silakan pilih motor terlebih dahulu");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                showNotification('error', "Anda perlu login terlebih dahulu");
                window.location.href = "/login";
                return;
            }

            const userData = localStorage.getItem("user");
            if (!userData) {
                showNotification('error', "Data pengguna tidak ditemukan. Silakan login kembali.");
                window.location.href = "/login";
                return;
            }

            // Display info notification that order is being processed
            showNotification('info', "Sedang memproses pesanan Anda...");
            setIsSubmitting(true);

            const response = await axios.post<BookingResponse>(
                "http://localhost:8080/user/bookings",
                {
                    motorcycle_id: selectedMotorcycle.id,
                    tanggal_pinjam: formData.tanggalPinjam,
                    tanggal_kembali: formData.tanggalKembali,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            setIsSubmitting(false);

            if (response.data) {
                const bookingData = response.data;

                // Create detailed success notification
                const notificationDetails = (
                    <div className="mt-2 text-sm">
                        <div className="flex justify-between border-b pb-1 mb-1">
                            <span className="font-medium">ID Pesanan:</span>
                            <span>{bookingData.data.ID}</span>
                        </div>
                        <div className="flex justify-between border-b pb-1 mb-1">
                            <span className="font-medium">Durasi Sewa:</span>
                            <span>{bookingData.durasi_sewa} hari</span>
                        </div>
                        <div className="flex justify-between border-b pb-1 mb-1">
                            <span className="font-medium">Tanggal Pinjam:</span>
                            <span>{formatDate(bookingData.data.tanggal_pinjam)}</span>
                        </div>
                        <div className="flex justify-between border-b pb-1 mb-1">
                            <span className="font-medium">Tanggal Kembali:</span>
                            <span>{formatDate(bookingData.data.tanggal_kembali)}</span>
                        </div>
                        <div className="flex justify-between font-medium text-green-700">
                            <span>Total Biaya:</span>
                            <span>Rp {bookingData.total_harga.toLocaleString()}</span>
                        </div>
                    </div>
                );

                // Show success notification with details
                showNotification(
                    'success',
                    "Motor berhasil dipesan!",
                    notificationDetails
                );

                setSuccessMessage(bookingData.message);
                setBookingSummary({
                    durasi_sewa: bookingData.durasi_sewa,
                    total_harga: bookingData.total_harga,
                });
                setShowModal(true);

                // Reset form
                setSelectedMotorcycle(null);
                setFormData({
                    motorcycleId: 0,
                    tanggalPinjam: "",
                    tanggalKembali: "",
                });
            }

        } catch (err: any) {
            setIsSubmitting(false);
            if (err.response?.status === 401) {
                showNotification('error', "Session expired. Please login again.");
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
            } else {
                const errorMessage = err.response?.data?.error || "Gagal membuat pesanan. Silakan coba lagi nanti.";
                showNotification('error', errorMessage);
            }
        }
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="flex">
            <UserSidebar />
            <div className="flex-1 p-6 relative">
                {/* Toast Notification */}
                {notification && (
                    <div className="fixed top-4 right-4 max-w-md z-50 animate-slide-in">
                        <div className={`rounded-lg shadow-lg p-4 ${
                            notification.type === 'success' ? 'bg-green-50 border-l-4 border-green-500' :
                                notification.type === 'error' ? 'bg-red-50 border-l-4 border-red-500' :
                                    'bg-blue-50 border-l-4 border-blue-500'
                        }`}>
                            <div className="flex items-center">
                                {notification.type === 'success' ? (
                                    <svg className="h-6 w-6 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : notification.type === 'error' ? (
                                    <svg className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="h-6 w-6 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                )}
                                <p className={`text-sm font-medium ${
                                    notification.type === 'success' ? 'text-green-700' :
                                        notification.type === 'error' ? 'text-red-700' :
                                            'text-blue-700'
                                }`}>
                                    {notification.message}
                                </p>
                                <button
                                    onClick={() => setNotification(null)}
                                    className="ml-auto text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {notification.details && (
                                <div className="mt-2">
                                    {notification.details}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <h2 className="text-2xl font-bold mb-6">Pesan Motor</h2>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Motorcycle Selection */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Pilih Motor</h3>
                        {loading ? (
                            <div className="flex justify-center items-center h-40">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : motorcycles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                        <p className="text-xs text-gray-500 mt-1">{motor.description}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-100 p-4 rounded-lg text-center">
                                <p>Tidak ada motor yang tersedia saat ini.</p>
                                <button
                                    onClick={fetchMotorcycles}
                                    className="mt-2 text-blue-600 hover:text-blue-800"
                                >
                                    Coba Muat Ulang
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Booking Form */}
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

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full p-2 rounded transition ${
                                    isSubmitting
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-blue-500 hover:bg-blue-600 text-white"
                                }`}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Memproses...
                                    </div>
                                ) : "Pesan Motor"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal Booking Success */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4 text-green-600">Pemesanan Berhasil!</h2>
                        {bookingSummary && (
                            <div className="space-y-2 mb-4">
                                <p>Durasi Sewa: {bookingSummary.durasi_sewa} hari</p>
                                <p>Total Harga: Rp {bookingSummary.total_harga.toLocaleString()}</p>
                            </div>
                        )}
                        <button
                            onClick={() => setShowModal(false)}
                            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}