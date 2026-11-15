import roh from './sources/regelbedarf-verlauf.json';

/**
 * Die Regelbedarfsstufen seit 2011 (2026-11-15).
 *
 * Anlass waren die eigenen Suchdaten: „regelbedarf 2018", „regelbedarf 2019",
 * „regelbedarfsstufen 2022 tabelle" landeten auf einer Seite, die nur das
 * laufende Jahr kannte. Die Antwort steht vollständig in einer einzigen
 * amtlichen Tabelle — der Anlage zu § 28 SGB XII, die jede Fortschreibung als
 * neue Zeile anfügt. Von dort zeilenweise übernommen, nichts gerechnet.
 *
 * **Gerechnet wird erst hier**, und nur Differenzen zwischen zwei Zeilen
 * derselben Tabelle. Jede Aussage der Seite („größter Anstieg", „unverändert
 * seit") ist damit aus den Daten abgeleitet und kann nicht von ihnen abweichen.
 */

export interface Jahreszeile {
  jahr: number;
  betraege: number[];
  /** Veränderung der Stufe 1 zum Vorjahr in Euro; `null` in der ersten Zeile. */
  differenzStufe1: number | null;
  /** Dieselbe Veränderung in Prozent, eine Nachkommastelle. */
  prozentStufe1: number | null;
}

export const VERLAUF: Jahreszeile[] = roh.jahre.map((z, i) => {
  const vor = i > 0 ? roh.jahre[i - 1].betraege[0] : null;
  const differenz = vor === null ? null : z.betraege[0] - vor;
  return {
    jahr: Number(z.gueltig_ab.slice(0, 4)),
    betraege: z.betraege,
    differenzStufe1: differenz,
    prozentStufe1: vor === null || differenz === null ? null : Math.round((differenz / vor) * 1000) / 10,
  };
});

const mitDifferenz = VERLAUF.filter((z) => z.differenzStufe1 !== null);

/** Das Jahr mit dem größten Anstieg der Stufe 1. */
export const GROESSTER_ANSTIEG = mitDifferenz.reduce((a, b) =>
  (b.differenzStufe1 ?? 0) > (a.differenzStufe1 ?? 0) ? b : a,
);

/** Seit welchem Jahr der heutige Betrag der Stufe 1 unverändert gilt. */
export const UNVERAENDERT_SEIT = (() => {
  const heute = VERLAUF[VERLAUF.length - 1].betraege[0];
  return VERLAUF.find((z) => z.betraege[0] === heute)!.jahr;
})();

export const ERSTES_JAHR = VERLAUF[0];
export const LETZTES_JAHR = VERLAUF[VERLAUF.length - 1];
export const NEUERMITTLUNG = roh.neuermittlung;
export const VERLAUF_QUELLEN = roh._meta.sources;
export const VERLAUF_ERHOBEN_AM = roh._meta.retrieved;
export const VERLAUF_LEGAL_BASIS = roh.legal_basis;
