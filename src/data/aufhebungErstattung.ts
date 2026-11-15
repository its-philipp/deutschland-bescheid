import roh from './sources/aufhebung-erstattung.json';
import type { Frist, Pruefpunkt, Quelle } from './bescheid';
import { STUFEN } from './grundsicherungsgeld';

/**
 * Typisierter Zugang zur Erhebung „Aufhebungs- und Erstattungsbescheid des
 * Jobcenters" (2026-11-15).
 *
 * Drei Aussagen dieses Datensatzes widersprechen dem, was Ratgeber meist
 * schreiben, und dürfen beim Weiterbauen nicht eingeebnet werden:
 *
 * 1. **Die Aufrechnung beträgt nicht „bis zu 30 Prozent", sondern je nach
 *    Rechtsgrundlage 10 oder 30** (§ 43 Abs. 2 SGB II). Die Rechtsgrundlage
 *    im Bescheid entscheidet also über die Höhe des monatlichen Abzugs.
 * 2. **§ 39 SGB II nennt die Erstattung nicht.** Der Wortlaut erfasst
 *    Bescheide, die Leistungen aufheben, zurücknehmen, widerrufen, entziehen.
 *    Die Seite gibt den Wortlaut wieder und zieht keine Folgerung — das
 *    Zusammenspiel ist Rechtsprechung, die nicht erhoben wurde.
 * 3. **Die Bagatellgrenze gilt für die ganze Bedarfsgemeinschaft**, nicht je
 *    Person (§ 40 Abs. 1 Satz 3 SGB II).
 *
 * **Die Eurobeträge der Aufrechnung werden hier gerechnet, nicht erhoben:**
 * Prozentsatz aus diesem Datensatz mal Regelbedarf aus dem
 * Grundsicherungsgeld-Datensatz. Ändert sich der Regelbedarf, ändert sich die
 * Tabelle mit — eine zweite Stelle mit Beträgen gibt es nicht.
 */
export const UEBERBLICK = roh.ueberblick;
export const BEHOERDENFRISTEN = roh.fristen_der_behoerde;
export const AUFRECHNUNG = roh.aufrechnung;
export const AUFRECHNUNG_SAETZE = roh.aufrechnung.saetze.filter((s) => s.art === 'satz');
export const AUFRECHNUNG_GRENZEN = roh.aufrechnung.saetze.filter((s) => s.art === 'grenze');
export const BAGATELLGRENZE = roh.bagatellgrenze;
export const AUFSCHIEBENDE_WIRKUNG = roh.aufschiebende_wirkung;
export const MUSTERAUSZUG = roh.musterauszug;
export const PRUEFPUNKTE = roh.pruefpunkte as Pruefpunkt[];
export const FRIST = roh.frist as Frist;
export const RDG_GRENZE = roh.rdg_grenze;
export const QUELLEN = roh._meta.sources as Quelle[];
export const ERHOBEN_AM = roh._meta.retrieved;

/** Die beiden Prozentsätze des § 43 Abs. 2 Satz 1, aus den Daten gelesen. */
const PROZENTE = [...new Set(AUFRECHNUNG_SAETZE.map((s) => s.prozent_des_regelbedarfs))].sort(
  (a, b) => a - b,
);

/** Je Regelbedarfsstufe der Monatsbetrag bei jedem der beiden Prozentsätze. */
export const AUFRECHNUNG_IN_EURO = STUFEN.map((s) => ({
  nummer: s.nummer,
  regelbedarf: s.betrag,
  betraege: PROZENTE.map((p) => ({ prozent: p, euro: (s.betrag * p) / 100 })),
}));
export const AUFRECHNUNG_PROZENTE = PROZENTE;
