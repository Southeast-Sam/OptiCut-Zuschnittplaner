import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { LuDownload } from "react-icons/lu";
function PDFExportPage() {
  const [boxen, setBoxen] = useState([]);
  const [platte, setPlatte] = useState({});
  const pdfRef = useRef();
  useEffect(() => {
    const gespeicherteBoxen =
      JSON.parse(localStorage.getItem("opticut_zuschnitte")) || [];
    const gespeichertePlatte =
      JSON.parse(localStorage.getItem("opticut_platte")) || {};
    if (
      gespeicherteBoxen.length > 0 &&
      gespeichertePlatte.breite &&
      gespeichertePlatte.länge
    ) {
      setBoxen(gespeicherteBoxen);
      setPlatte(gespeichertePlatte);
    } else {
      alert(
        "Keine gespeicherten Daten gefunden. Bitte zuerst einen Zuschnitt berechnen."
      );
    }
  }, []);
  const maxPixelBreite = window.innerWidth * 0.8;
  const maxPixelHöhe = window.innerHeight * 0.6;
  const breite = Number(platte.breite);
  const länge = Number(platte.länge);
  const scaleFactor =
    breite && länge
      ? Math.min(maxPixelBreite / breite, maxPixelHöhe / länge)
      : 1;
  const handlePDFExport = async () => {
    const element = pdfRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0);
    pdf.save("zuschnittsplan.pdf");
  };
  return (
    <div className="flex flex-col items-center min-h-[70vh] p-6">
      <h1 className="text-2xl font-bold mb-4">Zuschnittplan (PDF)</h1>
      <div
        ref={pdfRef}
        className="bg-white p-10 shadow-xl relative flex flex-col items-center"
      >
        <div
          className="relative"
          style={{
            width: `${breite * scaleFactor}px`,
            height: `${länge * scaleFactor}px`,
          }}
        >
          {/* Breiten-Beschriftung oben */}
          <div
            style={{
              position: "absolute",
              top: "-28px",
              left: "50%",
              transform: "translateX(-50%)",
              fontSize: "16px",
              fontWeight: "600",
              color: "#374151",
            }}
          >
            {breite} mm
          </div>
          {/* Längen-Beschriftung rechts */}
          <div
            style={{
              position: "absolute",
              top: "45%",
              left: `${breite * scaleFactor}px`,
              transform: "rotate(90deg) translateY(-125%)",
              transformOrigin: "top left",
              whiteSpace: "nowrap",
              fontSize: "16px",
              fontWeight: "600",
              color: "#374151",
            }}
          >
            {länge} mm
          </div>
          {/* Hauptplatte + Zuschnitte */}
          <div
            className="relative"
            style={{
              width: `${breite * scaleFactor}px`,
              height: `${länge * scaleFactor}px`,
              backgroundColor: "#d1d5db",
              border: "2px solid black",
              overflow: "hidden",
            }}
          >
            {boxen.map((box, i) => {
              const farben = [
                "#93c5fd",
                "#86efac",
                "#fde047",
                "#d8b4fe",
                "#fdba74",
                "#6ee7b7",
                "#f87171",
                "#facc15",
              ];
              const farbe = farben[i % farben.length];
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${box.x * scaleFactor}px`,
                    top: `${box.y * scaleFactor}px`,
                    width: `${
                      (box.rotiert ? box.länge : box.breite) * scaleFactor
                    }px`,
                    height: `${
                      (box.rotiert ? box.breite : box.länge) * scaleFactor
                    }px`,
                    backgroundColor: farbe,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    fontWeight: "bold",
                    border: "1px solid #333",
                  }}
                >
                  {box.breite} × {box.länge}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <button
        onClick={handlePDFExport}
        className="mt-6 bg-blue-600 text-white text-lg font-bold px-8 py-2 rounded-3xl hover:bg-blue-700 active:scale-95 flex items-center gap-2"
      >
        <LuDownload size={20} />
        PDF
      </button>
    </div>
  );
}
export default PDFExportPage;
