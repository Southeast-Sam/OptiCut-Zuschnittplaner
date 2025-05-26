import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";

function CuttingPage() {
  const [panelOffen, setPanelOffen] = useState(true); // Steuert, ob das Panel offen ist
  const [maße, setMaße] = useState([]); // Liste der Zuschnitte
  const [platte, setPlatte] = useState({ breite: "", länge: "" }); // Hauptplatte Maße
  // Initiale Maße der Hauptplatte
  const handleInputChange = (id, feld, wert) => {
    const neueListe = maße.map((eintrag) => {
      if (eintrag.id === id) {
        return { ...eintrag, [feld]: wert };
      }
      return eintrag;
    });
    setMaße(neueListe);
  };

  const handleDelete = (id) => {
    setMaße(maße.filter((eintrag) => eintrag.id !== id));
  };

  const maxPixelBreite = window.innerWidth * 0.8;
  const maxPixelHöhe = window.innerHeight * 0.6;
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
          <button
            onClick={() => setPanelOffen(!panelOffen)}
            className="p-3 text-md cursor-pointer"
          >
            {panelOffen ? "▼ schließen" : "▲ öffnen"}
          </button>
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

      {/* ✅ Hauptbereich (außerhalb vom Panel!) */}
      <div className="flex flex-col items-center h-screen overflow-auto gap-4 bg-white">
        {/* Hauptplatten-Eingabe */}
        <div className="shadow-lg p-2 w-full max-w-2xl bg-gray-50">
          <h2 className="text-center text-md font-bold mb-2">
            Hauptplatte festlegen (mm)
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

        {/* Plattenanzeige */}
        {platte.breite && platte.länge && (
          <div className="flex flex-col items-center mt-2">
            <div className="text-sm text-gray-700 mb-1">{breite} mm</div>

            <div className="relative">
              <div
                className="bg-gray-300 border-2 border-black flex items-center justify-center text-gray-100 text-sm relative"
                style={{
                  width: `${breite * scaleFactor}px`,
                  height: `${länge * scaleFactor}px`,
                }}
              >
                Hauptplatte
                {/* Zuschnitte */}
                {/* Immediately Invoked Function Expression */}
                {(() => {
                  let x = 0;
                  let y = 0;
                  let reiheHöhe = 0;
                  const abstand = 5;
                  const farben = [
                    "bg-blue-300",
                    "bg-green-300",
                    "bg-red-300",
                    "bg-yellow-300",
                    "bg-purple-300",
                    "bg-amber-300",
                    "bg-teal-300",
                    "bg-orange-300",
                    "bg-emerald-300",
                  ];

                  return maße.map((zuschnitt, index) => {
                    const w = Number(zuschnitt.breite);
                    const h = Number(zuschnitt.länge);

                    if (x + w > breite) {
                      x = 0;
                      y += reiheHöhe + abstand;
                      reiheHöhe = 0;
                    }

                    const farbklasse = farben[index % farben.length];

                    const box = (
                      <div
                        key={zuschnitt.id}
                        className={`absolute ${farbklasse} border border-white text-white text-xs text-[10px] flex items-center justify-center`}
                        style={{
                          width: `${w * scaleFactor}px`,
                          height: `${h * scaleFactor}px`,
                          left: `${x * scaleFactor}px`,
                          top: `${y * scaleFactor}px`,
                        }}
                      >
                        {w} x {h}
                      </div>
                    );

                    x += w + abstand;
                    if (h > reiheHöhe) reiheHöhe = h;
                    return box;
                  });
                })()}
              </div>

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
