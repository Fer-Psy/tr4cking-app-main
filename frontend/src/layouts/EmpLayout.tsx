import { Outlet } from "react-router-dom";
import EmpSidebar from "../components/EmpSidebar";
import Header from "../components/Header";

const EmpLayout = () => {
  return (
    <div className="flex h-screen">
      <EmpSidebar />
      <div className="flex-grow flex flex-col">
        <Header />
        <section className="flex-grow p-6 bg-gray-100 overflow-auto h-[calc(100vh-4rem)]">
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default EmpLayout;
