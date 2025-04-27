import Sidebar from "@/Admin/Utility/Sidebar.tsx";

export default function Dashboard() {
   return (
       <div className="flex">
          <Sidebar /> {/* UserSidebar remains static */}
          <div className="flex-1 p-6">
             <h2 className="text-2xl font-bold">Halaman Admin Dashboard</h2>
             <p>Here is where you can manage motorcycles...</p>
          </div>
       </div>
   )
}
