import { useState, useEffect } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { optimiereZuschnitte } from "../utils/optimizer";

function CuttingPage() {
  const [panelOffen, setPanelOffen] = useState(true); // Steuert, ob das Panel offen ist
  const [maße, setMaße] = useState([]); // Liste der Zuschnitte
  const [platte, setPlatte] = useState({ breite: "", länge: "" }); // Hauptplatte Maße
  const [platzierteBoxen, setPlatzierteBoxen] = useState([]); // Optimierte Zuschnitte

  useEffect(() => {
    const ergebnis = optimiereZuschnitte(platte, maße);
    if (ergebnis) {
      setPlatzierteBoxen(ergebnis);

      // Speichern für PDF-Seite
      localStorage.setItem("opticut_zuschnitte", JSON.stringify(ergebnis));

      if (Number(platte.breite) > 0 && Number(platte.länge) > 0) {
        localStorage.setItem(
          "opticut_platte",
          JSON.stringify({
            breite: Number(platte.breite),
            länge: Number(platte.länge),
          })
        );
      }
    }
  }, [platte, maße]);

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

      {/* Hauptbereich (außerhalb vom Panel!) */}
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

            {/* Hauptplatte anzeigen */}
            <div className="relative">
              <div
                id="pdf-export-target"
                className="bg-gray-300 border-2 border-black flex items-center justify-center text-gray-100 text-sm overflow-hidden relative"
                style={{
                  width: `${breite * scaleFactor}px`,
                  height: `${länge * scaleFactor}px`,
                }}
              >
                Hauptplatte
                {/* Zuschnitten anzeigen */}
                {platzierteBoxen.map((box, index) => {
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
                  const farbklasse = farben[index % farben.length];

                  return (
                    <div
                      key={box.id}
                      className={`absolute ${farbklasse} text-white text-xs flex items-center justify-center`}
                      style={{
                        width: `${
                          (box.rotiert ? box.länge : box.breite) * scaleFactor
                        }px`,
                        height: `${
                          (box.rotiert ? box.breite : box.länge) * scaleFactor
                        }px`,
                        left: `${box.x * scaleFactor}px`,
                        top: `${box.y * scaleFactor}px`,
                      }}
                    >
                      {box.breite} x {box.länge}
                    </div>
                  );
                })}
              </div>

              {/* Beschriftung der Hauptplatte (Länge) */}
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
