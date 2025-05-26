export function optimiereZuschnitte(platte, zuschnitte) {
  const breite = Number(platte.breite);
  const länge = Number(platte.länge);
  if (!breite || !länge) return [];

  const sortiert = [...zuschnitte]
    .filter((z) => Number(z.breite) > 0 && Number(z.länge) > 0)
    .sort((a, b) => b.breite * b.länge - a.breite * a.länge);

  const platziert = [];
  const luecken = [{ x: 0, y: 0, width: breite, height: länge }];

  for (const zuschnitt of sortiert) {
    const b = Number(zuschnitt.breite);
    const l = Number(zuschnitt.länge);

    let erfolgreich = false;

    // Versuche alle Lücken (sortiert nach y, dann x)
    luecken.sort((a, b) => a.y - b.y || a.x - b.x);

    for (let i = 0; i < luecken.length; i++) {
      const luecke = luecken[i];

      const passtNormal = b <= luecke.width && l <= luecke.height;
      const passtRotiert = l <= luecke.width && b <= luecke.height;

      const richtung = passtNormal ? "normal" : passtRotiert ? "rotiert" : null;

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
          {
            x: luecke.x + w,
            y: luecke.y,
            width: luecke.width - w,
            height: h,
          },
          {
            x: luecke.x,
            y: luecke.y + h,
            width: luecke.width,
            height: luecke.height - h,
          },
        ];

        luecken.splice(i, 1); // Alte Lücke entfernen
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
