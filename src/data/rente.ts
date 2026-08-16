import roh from './sources/rente.json';
import type { BescheidDatensatz } from './bescheid';

/**
 * Typisierter Zugang zur Rente-Erhebung (queue task 5.4).
 *
 * **Der aktuelle Rentenwert steht nicht im SGB VI.** Das Gesetz beschreibt in
 * §§ 63 bis 68 nur, wie er zustande kommt; der Betrag wird jährlich durch
 * Rechtsverordnung festgesetzt (§ 1 RWBestV 2026: 42,52 Euro ab dem
 * 1. Juli 2026). Er hat damit ein bekanntes Verfallsdatum — zum 1. Juli jedes
 * Jahres kommt eine neue Verordnung —, und der Datensatz führt es mit.
 *
 * Die Aussage, die diese Seite von anderen Ratgebern unterscheidet, betrifft
 * eine Frist vor der Frist: Wer einem Versicherungsverlauf nicht innerhalb von
 * **sechs Kalendermonaten** widerspricht, dessen mehr als sechs Jahre
 * zurückliegende Daten stellt der Träger anschließend durch Bescheid fest
 * (§ 149 Abs. 5 SGB VI). Dieses Schreiben ist kein Bescheid und trägt keine
 * Rechtsbehelfsbelehrung — es sieht aus wie eine Mitteilung und wirkt wie eine
 * Frist.
 */

export interface Rentenwert {
  legal_basis: string;
  betrag_eur: number;
  gilt_ab: string;
  naechste_anpassung: string;
  wortlaut: string;
  hinweis: string;
}

export interface Rentenartfaktor {
  rentenart: string;
  faktor: number;
}

export interface Altersgrenze {
  legal_basis: string;
  alter: string;
  wartezeit: string;
  uebergang?: string;
  hinweis?: string;
}

interface RenteDaten extends BescheidDatensatz {
  rentenformel: { legal_basis: string; darstellung: string; bedeutung: Record<string, string> };
  rentenwert: Rentenwert;
  rentenartfaktoren: { legal_basis: string; werte: Rentenartfaktor[]; hinweis: string };
  zugangsfaktor: {
    legal_basis: string;
    abschlag_je_monat: number;
    zuschlag_je_monat: number;
    abschlag_je_jahr_prozent: number;
    zuschlag_je_jahr_prozent: number;
    abgeleitet: string;
    regeln: string[];
    dauerhaft: string;
  };
  altersgrenzen: Record<string, Altersgrenze>;
  zeiten: Record<string, Record<string, string>>;
}

const daten = roh as unknown as RenteDaten;

export const RENTENFORMEL = daten.rentenformel;
export const RENTENWERT = daten.rentenwert;
export const RENTENARTFAKTOREN = daten.rentenartfaktoren;
export const ZUGANGSFAKTOR = daten.zugangsfaktor;
/**
 * Die Schlüssel der JSON-Blöcke sind die Namen der Sache selbst. Sie hier auf
 * die Schreibweise abzubilden, die eine Überschrift verträgt, ist die einzige
 * Stelle, an der aus dem Datensatz Text wird — bewusst als Tabelle und nicht
 * als Umformatierung des Schlüssels, damit „besonders_langjaehrig_versicherte"
 * nicht irgendwann als „Besonders Langjaehrig Versicherte" auf der Seite steht.
 */
const ALTERSGRENZE_TITEL: Record<string, string> = {
  regelaltersrente: 'Regelaltersrente',
  langjaehrig_versicherte: 'Altersrente für langjährig Versicherte',
  besonders_langjaehrig_versicherte: 'Altersrente für besonders langjährig Versicherte',
};

const ZEITEN_TITEL: Record<string, string> = {
  kindererziehung: 'Kindererziehungszeiten',
  beruecksichtigungszeit: 'Berücksichtigungszeiten',
  schulische_ausbildung: 'Zeiten schulischer Ausbildung',
  grundrentenzuschlag: 'Zuschlag für langjährige Versicherung',
};

export const ALTERSGRENZEN: (Altersgrenze & { titel: string })[] = Object.entries(
  daten.altersgrenzen,
).map(([schluessel, wert]) => ({
  titel: ALTERSGRENZE_TITEL[schluessel] ?? schluessel,
  ...wert,
}));

/**
 * Die Zeitenblöcke tragen je nach Sache verschiedene Felder — die
 * Kindererziehungszeit hat eine `dauer`, die schulische Ausbildung eine
 * `regel`, der Grundrentenzuschlag eine `voraussetzung`. Deshalb ein
 * Indexzugriff mit optionalen Werten statt einer Union: Die Seite fragt der
 * Reihe nach ab, und ein fehlendes Feld ist kein Fehler, sondern der
 * Normalfall.
 */
export type Zeitblock = { titel: string; legal_basis: string } & Partial<
  Record<'dauer' | 'regel' | 'voraussetzung' | 'zuordnung' | 'verlaengerung' | 'hinweis', string>
>;

export const ZEITEN: Zeitblock[] = Object.entries(daten.zeiten).map(([schluessel, wert]) => ({
  ...(wert as Omit<Zeitblock, 'titel'>),
  titel: ZEITEN_TITEL[schluessel] ?? schluessel,
}));
export const PRUEFPUNKTE = daten.pruefpunkte;
export const FRIST = daten.frist;
export const QUELLEN = daten._meta.sources;
export const ERHOBEN_AM = daten._meta.retrieved;
export const RDG_GRENZE = daten.rdg_grenze;
