import Navbar from "../Navigation/Navbar";
import Sidebar from "../Navigation/Sidebar";
import bg from "../../assets/bg.jpg";

export default function Layout({ children }) {
  return (
    <div
      className="min-h-screen flex flex-col md:flex-row relative"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-10 pointer-events-none"></div>

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white shadow-lg border-r border-gray-200 z-10">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen z-10">
        {/* Navbar */}
        <header className="sticky top-0 z-20 w-full">
          <Navbar />
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <div className="w-full max-w-7xl mx-auto">
            {/* Page Title */}
            

            {/* Dashboard Cards / Content */}
            <div className="flex flex-wrap gap-6">
  {children}
</div>
          </div>
        </main>
      </div>
    </div>
  );
}