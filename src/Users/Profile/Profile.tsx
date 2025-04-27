import UserSidebar from "@/Users/Utility/UserSidebar.tsx";

export default function PesanMotor() {
    return (
        <>
            <div className="flex">
                <UserSidebar /> {/* UserSidebar remains static */}
                <div className="flex-1 p-6">
                    <h2 className="text-2xl font-bold">Halaman Profile</h2>
                    <p>Here is where you can manage motorcycles...</p>
                </div>
            </div>
        </>
    )
}