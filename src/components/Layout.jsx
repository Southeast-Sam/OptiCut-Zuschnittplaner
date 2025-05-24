import { Outlet } from "react-router-dom";
import Burgermenu from "./BurgerMenu";

function Layout() {
  return (
    <div className="w-60 h-40 bg-white overflow-hidden">
      <Burgermenu />
      <main className="">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
