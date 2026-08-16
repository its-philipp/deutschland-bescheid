import roh from './sources/grundsicherungsgeld.json';

/**
 * Typisierter Zugang zum erhobenen Datensatz (queue task 5.2).
 *
 * **Die Leistung heißt im SGB II nicht mehr Bürgergeld, sondern
 * Grundsicherungsgeld** — § 19 Abs. 1: „Erwerbsfähige Leistungsberechtigte
 * erhalten Grundsicherungsgeld." Für die Suche bleibt „Bürgergeld" richtig,
 * danach suchen die Leute; im Bescheid steht das andere Wort. Genau diese
 * Lücke ist der Daseinszweck dieser Seite: unter dem gesuchten Wort gefunden
 * werden, im Text den amtlichen Begriff erklären.
 *
 * **Kein Betrag wird hier geschrieben.** Alle Zahlen kommen aus der
 * JSON-Datei, die am Volltext von SGB II und RBSFV 2026 erhoben wurde; eine
 * Zahl im Fließtext einer Seite veraltet still, eine Zahl im Datensatz nicht.
 */

export interface Pruefpunkt {
  bestandteil: string;
  legal_basis: string;
  pruefen: string[];
  hinweis?: string;
  satz_prozent?: number;
  obergrenze?: string;
  grundfreibetrag_eur?: number;
  grundfreibetrag_regel?: string;
  erhoehte_obergrenze?: string;
  karenzzeit?: string;
  saetze?: { fall: string; prozent_des_regelbedarfs: number; legal_basis: string }[];
  erwerbstaetigenfreibetrag_staffel?: { von_eur: number; bis_eur: number | null; prozent: number }[];
}

export interface Regelbedarf {
  legal_basis: string;
  gueltig_ab: string;
  identisch_mit_2025: boolean;
  betraege_eur: Record<string, number>;
  zuordnung: Record<string, string>;
  hinweis?: string;
}

interface Quelle {
  label: string;
  url: string;
}

const daten = roh as unknown as {
  _meta: { retrieved: string; sources: Quelle[] };
  regelbedarfsstufen_2026: Regelbedarf;
  pruefpunkte: Pruefpunkt[];
  rdg_grenze: string;
  noch_offen: string[];
};

export const REGELBEDARF = daten.regelbedarfsstufen_2026;
export const PRUEFPUNKTE = daten.pruefpunkte;
export const QUELLEN = daten._meta.sources;
export const ERHOBEN_AM = daten._meta.retrieved;

/**
 * Die Grenze, die dieser ganze Datensatz einhält — wörtlich aus der Erhebung
 * übernommen, damit sie nicht in einer Umformulierung weicher wird.
 */
export const RDG_GRENZE = daten.rdg_grenze;

/** Die sechs Stufen in der Reihenfolge, in der sie in der Anlage stehen. */
export const STUFEN = Object.keys(REGELBEDARF.betraege_eur).map((schluessel) => ({
  schluessel,
  nummer: Number(schluessel.replace('stufe_', '')),
  betrag: REGELBEDARF.betraege_eur[schluessel],
  wer: REGELBEDARF.zuordnung[schluessel],
}));
