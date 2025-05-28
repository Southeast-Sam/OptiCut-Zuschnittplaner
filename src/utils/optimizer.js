export function optimiereZuschnitte(platte, zuschnitte) {
  const breite = Number(platte.breite);
  const länge = Number(platte.länge);
  if (!breite || !länge) return [];
  // 2D Algorithmen
  // Kopie vom Array machen (spread Operator), weil .sort die Originalreihenfolge verändern würde
  const sortiert = [...zuschnitte]
    .filter((z) => Number(z.breite) > 0 && Number(z.länge) > 0)
    .sort((a, b) => b.breite * b.länge - a.breite * a.länge); // Größte Zuschnitte zuerst
  // Fläche berechnen
  const platteFlaeche = breite * länge;
  const zuschnittFlaeche = sortiert.reduce((summe, z) => {
    const b = Number(z.breite);
    const l = Number(z.länge);
    return summe + b * l;
  }, 0);
  // Alert, wenn Zuschnittsfläche zu groß werden
  if (zuschnittFlaeche > platteFlaeche) {
    alert("Die Zuschnittsfläche ist größer als die verfügbare Platte!");
    return null;
  }
  const platziert = [];
  const luecken = [{ x: 0, y: 0, width: breite, height: länge }];
  for (const zuschnitt of sortiert) {
    const b = Number(zuschnitt.breite);
    const l = Number(zuschnitt.länge);
    let erfolgreich = false;
    // Versuche alle Lücken (sortiert nach y, dann x)
    luecken.sort((a, b) => a.y - b.y || a.x - b.x);
    for (let i = 0; i < luecken.length; i++) {
      // Die aktuelle Lücke rausholen z.B.: { x: 2000, y: 0, width: 2000, height: 1300 }
      const luecke = luecken[i];
      const passtNormal = b <= luecke.width && l <= luecke.height;
      const passtRotiert = l <= luecke.width && b <= luecke.height;
      const richtung = passtNormal ? "normal" : passtRotiert ? "rotiert" : null;
      // Prüfe ob passt
      if (richtung) {
        const w = richtung === "normal" ? b : l;
        const h = richtung === "normal" ? l : b;
        platziert.push({
          id: zuschnitt.id,
          breite: b,
          länge: l,
          x: luecke.x,
          y: luecke.y,
          rotiert: richtung === "rotiert",
        });
        // Neue Lücken generieren
        const neueLuecken = [
          // Lücke rechts
          {
            x: luecke.x + w,
            y: luecke.y,
            width: luecke.width - w,
            height: h,
          },
          // Lücke links
          {
            x: luecke.x,
            y: luecke.y + h,
            width: luecke.width,
            height: luecke.height - h,
          },
        ];
        luecken.splice(i, 1); // Alte Lücke entfernen, neue hinzufügen
        for (const l of neueLuecken) {
          if (l.width > 0 && l.height > 0) luecken.push(l);
        }
        erfolgreich = true;
        break;
      }
    }
  }
  return platziert;
}
