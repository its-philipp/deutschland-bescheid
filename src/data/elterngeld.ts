import roh from './sources/elterngeld.json';
import type { Frist, Pruefpunkt, Quelle } from './bescheid';

/**
 * Typisierter Zugang zur Erhebung „Elterngeldbescheid" (2026-11-15, BEEG in
 * der an diesem Tag geltenden Fassung).
 *
 * **Für welche Kinder die Zahlen gelten, ist hier Teil der Aussage:** Die
 * heutige Fassung gilt nach § 28 BEEG für Geburten ab dem 1. Mai 2025; für
 * frühere Geburten gelten ältere Fassungen weiter, die nicht erhoben wurden.
 * Die Seite sagt das sichtbar — ein Elterngeldbescheid für ein 2024 geborenes
 * Kind rechnet nach anderem Recht.
 *
 * Am Gesetzestext gegengelesen (Orchestrator): § 1 Abs. 8, § 2 Abs. 1 bis 3,
 * § 2f Abs. 1, § 4 Abs. 6, § 7 Abs. 1 und 2, § 13 BEEG.
 *
 * **Keine Steuerberatung:** Zur Steuerklasse steht nur, welche das Gesetz
 * zugrunde legt (§ 2c Abs. 3, § 2e Abs. 3) — keine Empfehlung zum Wechsel.
 */
export const HOEHE = roh.hoehe;
export const ZUSCHLAEGE = roh.zuschlaege;
export const BEMESSUNGSZEITRAUM = roh.bemessungszeitraum;
export const ABZUEGE = roh.abzuege;
export const VARIANTEN = roh.varianten;
export const GLEICHZEITIGER_BEZUG = roh.gleichzeitiger_bezug;
export const EINKOMMENSGRENZE = roh.einkommensgrenze;
/** Nur Grenzen mit Betrag; ältere Geburten nennt die Übergangsvorschrift. */
export const GRENZEN_MIT_BETRAG = roh.einkommensgrenze.grenzen.filter(
  (g): g is typeof g & { betrag_eur: number } => g.betrag_eur !== null,
);
export const ANRECHNUNG = roh.anrechnung;
export const VORLAEUFIG = roh.vorlaeufig_und_endgueltig;
export const ANTRAGSFRIST = roh.antragsfrist;
export const MUSTERAUSZUG = roh.musterauszug;
export const PRUEFPUNKTE = roh.pruefpunkte as Pruefpunkt[];
export const FRIST = roh.frist as Frist;
export const RDG_GRENZE = roh.rdg_grenze;
export const QUELLEN = roh._meta.sources as Quelle[];
export const ERHOBEN_AM = roh._meta.retrieved;
