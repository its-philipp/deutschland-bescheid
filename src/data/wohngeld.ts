import roh from './sources/wohngeld.json';
import type { BescheidDatensatz } from './bescheid';

/**
 * Typisierter Zugang zur Wohngeld-Erhebung (queue task 5.4).
 *
 * **Kein Betrag wird hier geschrieben.** Alle Zahlen kommen aus der
 * JSON-Datei, die am Volltext des WoGG erhoben wurde — die Höchstbeträge
 * stammen aus der Tabellenstruktur der Anlage 1, nicht aus dem Abtippen.
 *
 * Zwei Dinge, die diese Seite über Wohngeld sagen muss und die man leicht
 * falsch macht:
 *
 * 1. **Der Widerspruch ist nicht überall der richtige Rechtsbehelf.** Wohngeld
 *    ist Sozialleistung (§ 68 Nr. 10 SGB I), der Rechtsweg führt aber zum
 *    Verwaltungsgericht. § 68 Abs. 1 Satz 2 VwGO erlaubt den Ländern, das
 *    Vorverfahren abzuschaffen; in Bayern etwa kann man direkt klagen. Was
 *    gilt, sagt die Rechtsbehelfsbelehrung des Bescheids.
 * 2. **Die Beträge haben ein Verfallsdatum.** § 43 Abs. 4 WoGG schreibt die
 *    Höchstbeträge zum 1. Januar jedes zweiten Jahres fort. Die hier
 *    geführten Werte gelten bis zum 31. Dezember 2026; der Datensatz trägt
 *    diesen Termin selbst.
 */

export interface HoechstbetragZeile {
  haushaltsmitglieder: string;
  betraege: number[];
}

export interface Hoechstbetraege {
  legal_basis: string;
  fundstelle_anlage: string;
  gilt_ab: string;
  gilt_bis: string;
  naechste_fortschreibung: string;
  mietenstufen: string[];
  zeilen: HoechstbetragZeile[];
  hinweis: string;
}

export interface Zuschlagszeile {
  haushaltsmitglieder: string;
  co2?: number;
  dauerhaft?: number;
  gesamt?: number;
  betrag?: number;
}

interface WohngeldDaten extends BescheidDatensatz {
  hoechstbetraege: Hoechstbetraege;
  heizkostenentlastung: { legal_basis: string; erlaeuterung: string; zeilen: Zuschlagszeile[] };
  klimakomponente: { legal_basis: string; erlaeuterung: string; zeilen: Zuschlagszeile[] };
  formel: {
    legal_basis: string;
    darstellung: string;
    rechenschritte: string;
    mindestwerte: string;
    ueber_zwoelf: string;
    hinweis: string;
    bedeutung: Record<string, string>;
  };
  freibetraege: {
    legal_basis: string;
    posten: { fall: string; betrag: number; legal_basis: string }[];
    grundrentenfreibetrag: { legal_basis: string; voraussetzung: string; betrag: string; hinweis: string };
    unterhaltsabzug: {
      legal_basis: string;
      posten: { fall: string; bis_eur_jahr: number }[];
      hinweis: string;
    };
  };
}

const daten = roh as unknown as WohngeldDaten;

export const HOECHSTBETRAEGE = daten.hoechstbetraege;
export const HEIZKOSTEN = daten.heizkostenentlastung;
export const KLIMAKOMPONENTE = daten.klimakomponente;
export const FORMEL = daten.formel;
export const FREIBETRAEGE = daten.freibetraege;
export const PRUEFPUNKTE = daten.pruefpunkte;
export const FRIST = daten.frist;
export const QUELLEN = daten._meta.sources;
export const ERHOBEN_AM = daten._meta.retrieved;
export const RDG_GRENZE = daten.rdg_grenze;

/** Der Höchstbetrag für einen Einpersonenhaushalt in der mittleren Mietenstufe III. */
export const BEISPIEL_HOECHSTBETRAG = {
  stufe: HOECHSTBETRAEGE.mietenstufen[2],
  betrag: HOECHSTBETRAEGE.zeilen[0].betraege[2],
};
