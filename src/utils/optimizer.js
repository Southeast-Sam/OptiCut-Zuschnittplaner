export function optimiereZuschnitte(platte, zuschnitte) {
  const platteBreite = Number(platte.breite);
  const platteLaenge = Number(platte.länge);
  const platziert = [];
  const verwendet = new Set();

  // Alle freien Rechtecke (start: gesamte Platte)
  const freieFlaechen = [
    {
      x: 0,
      y: 0,
      breite: platteBreite,
      laenge: platteLaenge,
    },
  ];

  // Sortieren nach Fläche (größte zuerst)
  const sortiert = [...zuschnitte].sort((a, b) => {
    return b.breite * b.länge - a.breite * a.länge;
  });

  for (const teil of sortiert) {
    const b = Number(teil.breite);
    const l = Number(teil.länge);
    if (!b || !l || isNaN(b) || isNaN(l)) continue;

    let platziertTeil = false;

    for (let i = 0; i < freieFlaechen.length; i++) {
      const flaeche = freieFlaechen[i];

      // Versuche ohne Rotation
      if (b <= flaeche.breite && l <= flaeche.laenge) {
        platziert.push({
          id: teil.id,
          breite: b,
          länge: l,
          x: flaeche.x,
          y: flaeche.y,
          rotiert: false,
        });
        verwendet.add(teil.id);
        platziertTeil = true;
        // Restflächen erzeugen
        freieFlaechen.splice(i, 1);
        freieFlaechen.push(
          {
            // rechts
            x: flaeche.x + b,
            y: flaeche.y,
            breite: flaeche.breite - b,
            laenge: l,
          },
          {
            // unten
            x: flaeche.x,
            y: flaeche.y + l,
            breite: flaeche.breite,
            laenge: flaeche.laenge - l,
          }
        );
        break;
      }

      // Versuche mit Rotation
      if (l <= flaeche.breite && b <= flaeche.laenge) {
        platziert.push({
          id: teil.id,
          breite: b,
          länge: l,
          x: flaeche.x,
          y: flaeche.y,
          rotiert: true,
        });
        verwendet.add(teil.id);
        platziertTeil = true;
        freieFlaechen.splice(i, 1);
        freieFlaechen.push(
          {
            // rechts
            x: flaeche.x + l,
            y: flaeche.y,
            breite: flaeche.breite - l,
            laenge: b,
          },
          {
            // unten
            x: flaeche.x,
            y: flaeche.y + b,
            breite: flaeche.breite,
            laenge: flaeche.laenge - b,
          }
        );
        break;
      }
    }

    if (!platziertTeil) {
      // könnte später in weitere Platte verschoben werden
    }
  }

  return platziert;
}
