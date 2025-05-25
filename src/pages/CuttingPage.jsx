import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";

function CuttingPage() {
  const [panelOffen, setPanelOffen] = useState(true);
  const [maße, setMaße] = useState([]);
  const [platte, setPlatte] = useState({ breite: "", länge: "" });

  const handleInputChange = (id, feld, wert) => {
    const neueListe = maße.map((eintrag) => {
      if (eintrag.id === id) {
        return { ...eintrag, [feld]: wert }; // nur dieses Feld ändern
      }
      return eintrag;
    });

    setMaße(neueListe);
  };

  const handleDelete = (id) => {
    setMaße(maße.filter((eintrag) => eintrag.id !== id));
  };

  const maxPixelBreite = 600;
  const maxPixelHöhe = 400;

  const breite = Number(platte.breite);
  const länge = Number(platte.länge);

  const scaleFactor =
    breite && länge
      ? Math.min(maxPixelBreite / breite, maxPixelHöhe / länge)
      : 1;

  return (
    <div className="flex flex-col-reverse h-screen">
      {/* Panel unten */}
      <div
        className={`mb-8 border-1 transition-all duration-300 overflow-hidden ${
          panelOffen ? "h-[200px] overflow-y-scroll" : "h-[40px]"
        } bg-gray-100 shadow-md flex-shrink-0`}
      >
        <div className="flex justify-between h-10 bg-gray-400 border-b-1 items-center">
          {/* Auf-/Zuklappen button */}
          <button
            onClick={() => setPanelOffen(!panelOffen)}
            className="p-3 text-md cursor-pointer"
          >
            {panelOffen ? "▼ einklappen" : "▲ öffnen"}
          </button>

          {/* hinzufügen button */}
          <button
            onClick={() => {
              setMaße([...maße, { id: Date.now(), breite: "", länge: "" }]);
            }}
            className="text-md p-4 cursor-pointer"
          >
            <FaPlusCircle size={24} />
          </button>
        </div>

        {/* Eingabefelder */}
        {maße.map((eintrag) => (
          <div
            key={eintrag.id}
            className="flex justify-center gap-10 mt-3 ml-6"
          >
            <input
              type="text"
              value={eintrag.breite}
              onChange={(e) =>
                handleInputChange(eintrag.id, "breite", e.target.value)
              }
              placeholder="Breite..."
              className="border-2 p-2 rounded-lg h-6"
            />
            <input
              type="text"
              value={eintrag.länge}
              onChange={(e) =>
                handleInputChange(eintrag.id, "länge", e.target.value)
              }
              placeholder="Länge..."
              className="border-2 p-2 rounded-lg h-6"
            />
            <button
              onClick={() => handleDelete(eintrag.id)}
              className="cursor-pointer"
            >
              <FaDeleteLeft size={24} />
            </button>
          </div>
        ))}
      </div>

      {/* Hauptbereich oben */}
      <div className="flex flex-col items-center h-screen overflow-auto gap-4 bg-white overflow-x-scroll overflow-y-scroll">
        {/* Hauptplatten-Eingabe */}
        <div className="shadow-lg p-2 w-full max-w-2xl bg-gray-50">
          <h2 className="text-center text-md font-bold mb-2">
            Hauptplatte festlegen(mm)
          </h2>
          <div className="flex justify-center gap-4">
            <input
              type="text"
              placeholder="Breite..."
              value={platte.breite}
              onChange={(e) => setPlatte({ ...platte, breite: e.target.value })}
              className="p-2 border rounded w-40 h-6"
            />
            <input
              type="text"
              placeholder="Länge..."
              value={platte.länge}
              onChange={(e) => setPlatte({ ...platte, länge: e.target.value })}
              className="p-2 border rounded w-40 h-6"
            />
          </div>
        </div>
        {platte.breite && platte.länge && (
          <div className="flex flex-col items-center mt-2">
            {/* Oberkante: Breite */}
            <div className="text-sm text-gray-700 mb-1">{breite} mm</div>

            {/* Platte mit Beschriftung auf rechter Kante */}
            <div className="relative">
              {/* Platte selbst */}
              <div
                className="bg-gray-300 border-2 border-black"
                style={{
                  width: `${breite * scaleFactor}px`,
                  height: `${länge * scaleFactor}px`,
                }}
              ></div>

              {/* Länge direkt auf rechter Kante */}
              <div
                className="absolute text-sm text-gray-700"
                style={{
                  top: "45%",
                  left: `${breite * scaleFactor}px`,
                  transform: "rotate(90deg) translateY(-100%)",
                  transformOrigin: "top left",
                  whiteSpace: "nowrap",
                }}
              >
                {länge} mm
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CuttingPage;
