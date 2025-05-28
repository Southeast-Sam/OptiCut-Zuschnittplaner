import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

  // Skalierung wie in CuttingPage
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
    <div className=" flex justify-center flex-col min-h-[70vh]">
      <h1 className="justify-center flex text-2xl font-bold mb-4">
        Zuschnittplan (PDF)
      </h1>

      {/* Export-Bereich */}
      <div className="bg-white p-4 shadow-xl flex justify-center">
        <div
          ref={pdfRef}
          className="relative"
          style={{
            width: `${breite * scaleFactor}px`,
            height: `${länge * scaleFactor}px`,
            border: "2px solid black",
            overflow: "hidden",
            backgroundColor: "#d1d5db",
          }}
        >
          {boxen.map((box, i) => {
            const farben = [
              "#93c5fd", // blue
              "#86efac", // green
              "#fca5a5", // red
              "#fde047", // yellow
              "#d8b4fe", // purple
              "#fdba74", // orange];
            ];
            const farbe = farben[i % farben.length];
            const style = {
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
            };
            return (
              <div key={i} style={style}>
                {box.breite}×{box.länge} mm
              </div>
            );
          })}
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={handlePDFExport}
        className="mt-6 bg-blue-600 text-white px-6 py-2 cursor-pointer rounded-2xl hover:bg-blue-700"
      >
        PDF herunterladen
      </button>
    </div>
  );
}

export default PDFExportPage;
