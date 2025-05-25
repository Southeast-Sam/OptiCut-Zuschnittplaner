import { Outlet } from "react-router-dom";
import Burgermenu from "./BurgerMenu";

function Layout() {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <Burgermenu />
      <main className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
