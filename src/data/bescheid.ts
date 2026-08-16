/**
 * Die Form, die alle Bescheidtyp-Datensätze teilen (queue task 5.4).
 *
 * Jede Erhebung zu einem Bescheidtyp bringt dreierlei mit: Prüfpunkte (was in
 * diesem Bescheidtyp steht und wo dort bekannte Fehlerbilder sitzen), eine
 * Fristenkette (welcher Rechtsbehelf statthaft ist und wie sich das Fristende
 * rechnet) und ihre Quellen samt Abrufdatum.
 *
 * **Die Fristenkette ist je Bescheidtyp verschieden — die Rechnung nicht.**
 * Grundsicherungsgeld und Rente laufen über SGG und SGB X, Wohngeld und BAföG
 * über VwGO, VwVfG, ZPO und BGB. Beide Wege ergeben Tag für Tag dasselbe
 * Fristende: vier Tage bis zur Bekanntgabe, dann ein Monat, dann die
 * Verschiebung auf den nächsten Werktag. Deshalb rechnet `lib/frist.ts` für
 * alle vier Typen richtig und nennt trotzdem nur die Fundstellen des SGG —
 * die Erklärseiten tragen die jeweils eigenen nach.
 */

/** Ein Baustein eines Bescheids und die Fragen, die man daran stellen kann. */
export interface Pruefpunkt {
  bestandteil: string;
  legal_basis: string;
  pruefen: string[];
  hinweis?: string;
}

/** Ein Schritt der Fristenkette mit seiner Vorschrift. */
export interface Fristschritt {
  schritt: string;
  legal_basis: string;
  hinweis?: string;
}

export interface Frist {
  rechtsweg: string;
  rechtsweg_begruendung: string;
  rechtsbehelf: string;
  dauer: string;
  kette: Fristschritt[];
  /** Was an diesem Bescheidtyp anders ist, als man erwartet. */
  achtung?: string;
  besonderheit?: string;
  rechnung_identisch?: string;
  wichtiger_als_die_widerspruchsfrist?: string;
}

export interface Quelle {
  label: string;
  url: string;
  retrieved: string;
}

export interface BescheidMeta {
  topic: string;
  retrieved: string;
  method: string;
  sources: Quelle[];
}

/**
 * Der gemeinsame Kern jedes Datensatzes. Die fachlichen Blöcke (Höchstbeträge,
 * Bedarfssätze, Rentenformel) hängen am jeweiligen Modul, weil sie nichts
 * gemeinsam haben außer ihrer Herkunft.
 */
export interface BescheidDatensatz {
  _meta: BescheidMeta;
  pruefpunkte: Pruefpunkt[];
  frist: Frist;
  rdg_grenze: string;
  noch_offen: string[];
}
