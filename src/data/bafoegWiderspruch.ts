import roh from './sources/bafoeg-widerspruch.json';

/**
 * Der Bescheidbegriff des BAföG und die Wege gegen einen BAföG-Bescheid
 * (2026-11-15).
 *
 * Aus den Suchdaten: „was ist ein bafög bescheid", „bescheid erteilt bafög
 * bedeutung", „bafög bescheid widerspruch", „einspruch gegen bafög bescheid"
 * landeten alle auf der Erklärseite, die diese Fragen nur am Rand beantwortete.
 *
 * **Zwei Grenzen, die dieser Datensatz bewusst zieht** (beide stehen auch
 * unter `noch_offen`):
 * 1. Er nennt nicht, welche Länder das Vorverfahren abgeschafft haben. Eine
 *    veraltete Länderliste schickt jemanden mit einem Widerspruch los, wo
 *    Klage nötig wäre — die Rechtsbehelfsbelehrung ist die einzige sichere
 *    Quelle.
 * 2. Er erklärt nicht die Statusanzeige eines Portals. „Bescheid erteilt" wird
 *    nur so weit gedeutet, wie § 50 Abs. 1 BAföG reicht.
 */
export const BESCHEID_BEGRIFF = roh.bescheid_begriff;
export const WEGE = roh.wege;
export const KEIN_EINSPRUCH = roh.kein_einspruch;
export const VORVERFAHREN = roh.vorverfahren;
export const FORM = roh.form;
export const INHALT = roh.inhalt;
export const FRIST_BELEHRUNG = roh.frist_belehrung;
export const WIEDEREINSETZUNG = roh.wiedereinsetzung;
export const WIRKUNG = roh.wirkung;
export const DANACH = roh.danach;
export const KOSTEN = roh.kosten;
export const RDG_GRENZE_WIDERSPRUCH = roh.rdg_grenze;
export const WIDERSPRUCH_QUELLEN = roh._meta.sources;
export const WIDERSPRUCH_ERHOBEN_AM = roh._meta.retrieved;
