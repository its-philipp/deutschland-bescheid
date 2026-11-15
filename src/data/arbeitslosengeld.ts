import roh from './sources/arbeitslosengeld.json';
import type { Frist, Pruefpunkt, Quelle } from './bescheid';

/**
 * Typisierter Zugang zur Erhebung „Bewilligungsbescheid über Arbeitslosengeld"
 * (2026-11-15, SGB III in der an diesem Tag geltenden Fassung).
 *
 * Was dieser Datensatz anders sagt als viele Ratgeber — am Gesetzestext
 * gelesen und vom Orchestrator an den Kernstellen gegengelesen (§§ 143, 147,
 * 148, 149, 153, 155, 159 SGB III, § 86a SGG):
 *
 * 1. Die Sozialversicherungspauschale beträgt **20 Prozent** (§ 153 Abs. 1
 *    Satz 2 Nr. 1), nicht 21.
 * 2. Die Rahmenfrist beträgt **30 Monate** (§ 143 Abs. 1), nicht zwei Jahre.
 * 3. Eine Abfindung allein lässt den Anspruch nicht ruhen — nur, wenn das
 *    Arbeitsverhältnis ohne Einhaltung der ordentlichen Kündigungsfrist des
 *    Arbeitgebers endete (§ 158 Abs. 1).
 *
 * **Die Seite rechnet kein Arbeitslosengeld aus.** Die Lohnsteuer nach
 * Programmablaufplan ist nicht erhoben; ohne sie wäre jeder Eurobetrag
 * geraten. Der Musterauszug trägt deshalb Platzhalter statt Beträgen.
 */
export const RECHENWEG = roh.rechenweg;
export const LEISTUNGSSATZ = roh.leistungssatz;
export const ABZUEGE = roh.leistungsentgelt_abzuege;
export const ANSPRUCHSDAUER = roh.anspruchsdauer;
export const SPERRZEIT = roh.sperrzeit;
export const RUHEN = roh.ruhen;
export const NEBENEINKOMMEN = roh.nebeneinkommen;
export const MELDEFRISTEN = roh.meldefristen;
export const MUSTERAUSZUG = roh.musterauszug;
export const PRUEFPUNKTE = roh.pruefpunkte as Pruefpunkt[];
export const FRIST = roh.frist as Frist;
export const RDG_GRENZE = roh.rdg_grenze;
export const QUELLEN = roh._meta.sources as Quelle[];
export const ERHOBEN_AM = roh._meta.retrieved;
