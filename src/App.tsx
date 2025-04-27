import { useEffect } from "react";
import Navbar from "./utility/Navbar.tsx";
import Footer from "./utility/Footer.tsx";
import AOS from "aos";
import "aos/dist/aos.css";
import {Link} from "react-router-dom";
import {Helmet} from "react-helmet";

function App() {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: false,
            mirror: true,
        });
    }, []);

    return(
        <>
            <Helmet>
                <title>Pesan Motor Apps - Pesan Motor dengan Mudah dan Cepat</title>
                <meta name="description" content="Aplikasi pemesanan motor online yang mudah dan cepat. Dapatkan motor impian Anda dengan beberapa klik." />
                <meta name="keywords" content="pesan motor, aplikasi motor, sewa motor, beli motor" />
                <meta property="og:title" content="Pesan Motor Apps" />
                <meta property="og:description" content="Aplikasi pemesanan motor online yang mudah dan cepat." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://pesanmotor.com" />
                <meta property="og:image" content="https://www.wsrentaljogja.com/wp-content/uploads/2020/02/banner-e1580525634689.jpg" />
                <link rel="canonical" href="https://pesanmotor.com" />
            </Helmet>

            <Navbar/>

            <div className="min-h-svh">
                {/* Spasi kosong di atas hero (untuk menurunkan posisi hero) */}
                <div className="h-60"></div>

                {/* Hero Section */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                        {/* Bagian Kiri - Text */}
                        <div className="lg:w-1/2" data-aos="fade-right">
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                Pesan Motor Apps
                            </h1>
                            <p className="text-base text-gray-600 mb-6">
                                Saat nya untuk pesan motor dengan applikasi yang mudah dan cepat.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-md transition-colors">
                                    <Link to="/register">Mulai Sekarang </Link>
                                </button>
                                {/*<button className="bg-white text-blue-600 border border-blue-600 font-medium py-2 px-5 rounded-md hover:bg-blue-50 transition-colors">*/}
                                {/*    Pelajari Selengkapnya*/}
                                {/*</button>*/}
                            </div>
                        </div>

                        {/* Bagian Kanan - Image */}
                        <div className="lg:w-1/2 mt-8 lg:mt-0" data-aos="fade-left">
                            <img
                                src="https://www.wsrentaljogja.com/wp-content/uploads/2020/02/banner-e1580525634689.jpg"
                                alt="Hero Image"
                                className="w-full h-auto"
                            />
                        </div>
                    </div>
                </div>

                {/* Konten tambahan di bawah hero jika diperlukan */}
                <div className="flex flex-col items-center justify-center py-12">
                    {/*<Button>Click Me</Button>*/}
                </div>
            </div>
            <Footer/>
        </>
    )
}

export default App;