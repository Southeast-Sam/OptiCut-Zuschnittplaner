import React from "react";
import { useState, useEffect, useRef } from "react";
import { FaBars } from "react-icons/fa";
import { History } from "lucide-react";
import { GiCircularSawblade } from "react-icons/gi";
import { NavLink } from "react-router-dom";

function BurgerMenu() {
  const [aktiv, setAktiv] = useState(false); // Steuert ob das Menü logisch offen ist
  // useRef merken, wo das Menü ist, ist ein unsichtbare Finger, der auf Menü zeigt
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setAktiv(false);
      }
    }

    // Wenn menü aktiv ist, dann höre auf jeden Mausklick auf der ganzen Seite
    if (aktiv) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Wenn geschlossen ist, oder was ändert, dann aufhören, auf Mausklick zu achten
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [aktiv]);

  return (
    <div className="relative z-50 ">
      <button
        onClick={() => setAktiv(!aktiv)}
        className="absolute top-4 left-4 text-2xl cursor-pointer w-12 h-12 flex items-center justify-center rounded-ful hover:scale-105 active:scale-100"
      >
        <FaBars size={24} className="text-black" />
      </button>
      {aktiv && (
        <div ref={menuRef} className="absolute top-4 left-4">
          {/* Jetzt zeigt der unsichtbare Finger (menuRef) auf die 2 Optionen */}
          <NavLink
            to={"/"}
            className="absolute translate-x-[20px] translate-y-[70px] w-12 h-12 rounded-full border-black bg-gray-600 text-white flex items-center justify-center p-2 cursor-pointer hover:scale-110 active:scale-100 transition-transform"
            style={{
              animation: "pop 0.2s ease-out forwards",
            }}
          >
            <GiCircularSawblade size={22} />
          </NavLink>
          <NavLink
            to={"history"}
            className="absolute translate-x-[75px] translate-y-[10px] w-12 h-12 rounded-full border-2 border-black bg-gray-600 text-white flex items-center justify-center p-2 cursor-pointer hover:scale-110 active:scale-100 transition-transform"
            style={{
              animation: "pop 0.2s ease-out forwards",
            }}
          >
            <History size={22} />
          </NavLink>
        </div>
      )}
      <style>
        {`
      @keyframes pop {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
    `}
      </style>
    </div>
  );
}

export default BurgerMenu;
