import roh from './sources/bafoeg.json';
import type { BescheidDatensatz } from './bescheid';

/**
 * Typisierter Zugang zur BAföG-Erhebung (queue task 5.4).
 *
 * **Der Betrag im Gesetzestext ist hier nicht der Betrag, der gilt.**
 * § 23 Abs. 1 Satz 1 Nr. 1 BAföG nennt 353 Euro „vorbehaltlich einer
 * Bekanntmachung nach Absatz 6 Satz 3“; für 2026 sind es nach der
 * Bekanntmachung vom 18. November 2025 (BGBl. 2025 I Nr. 279) 389 Euro. Der
 * Datensatz führt beide Zahlen, damit die Seite den Unterschied erklären kann
 * statt ihn zu verstecken — wer den Paragraphen nachschlägt, findet sonst
 * einen Widerspruch und traut der Seite zu Recht nicht mehr.
 *
 * Die zweite Aussage, die diese Seite tragen muss: Die schärfste Frist im
 * BAföG ist nicht die Widerspruchsfrist, sondern das **Ende des
 * Bewilligungszeitraums** — danach sind Aktualisierungsantrag (§ 24 Abs. 3)
 * und Vorausleistung (§ 36) unwiderruflich verloren, und in keiner
 * Rechtsbehelfsbelehrung steht ein Wort davon.
 */

export interface Betragsposten {
  fall: string;
  betrag: number;
  legal_basis?: string;
}

export interface EigenesEinkommen {
  betrag_im_gesetzestext: number;
  betrag_2026: number;
  gilt_ab: string;
  fundstelle: string;
  mechanik: string;
  hinweis: string;
}

interface BafoegDaten extends BescheidDatensatz {
  bedarfssaetze: {
    legal_basis: string;
    stand: string;
    studierende: { fall: string; grundbedarf: number; legal_basis: string }[];
    wohnzuschlag: Betragsposten[];
    hoechstsatz_studierende: { betrag: number; rechnung: string; hinweis: string };
    schueler: { fall: string; betrag: number; legal_basis: string }[];
    zuschlaege: Betragsposten[];
  };
  freibetraege: {
    auszubildende: {
      legal_basis: string;
      eigenes_einkommen: EigenesEinkommen;
      weitere: Betragsposten[];
      voll_angerechnet: string;
    };
    eltern: {
      legal_basis: string;
      grundfreibetraege: Betragsposten[];
      erhoehungen: Betragsposten[];
      zusatzfreibetrag: string;
      haertefreibetrag: string;
    };
    vermoegen: {
      legal_basis: string;
      posten: { fall: string; betrag: number }[];
      stichtag: string;
      anrechnung: string;
    };
  };
}

const daten = roh as unknown as BafoegDaten;

export const BEDARFSSAETZE = daten.bedarfssaetze;
export const FREIBETRAEGE = daten.freibetraege;
export const PRUEFPUNKTE = daten.pruefpunkte;
export const FRIST = daten.frist;
export const QUELLEN = daten._meta.sources;
export const ERHOBEN_AM = daten._meta.retrieved;
export const RDG_GRENZE = daten.rdg_grenze;

/** Der Höchstsatz für Studierende, die nicht bei den Eltern wohnen. */
export const HOECHSTSATZ = daten.bedarfssaetze.hoechstsatz_studierende;

/** Der Freibetrag auf eigenes Einkommen — mit beiden Zahlen. */
export const EIGENES_EINKOMMEN = daten.freibetraege.auszubildende.eigenes_einkommen;
