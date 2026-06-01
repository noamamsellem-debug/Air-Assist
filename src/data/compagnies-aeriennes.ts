/**
 * Liste de compagnies aériennes (code IATA + nom) pour le sélecteur du
 * calculateur / tunnel. Le code IATA sert de préfixe au numéro de vol
 * (ex. Lufthansa → « LH » + 1024 = LH1024).
 */
export interface CompagnieAerienne {
  code: string; // IATA (2 caractères)
  nom: string;
}

export const COMPAGNIES_AERIENNES: CompagnieAerienne[] = [
  { code: "AF", nom: "Air France" },
  { code: "LH", nom: "Lufthansa" },
  { code: "BA", nom: "British Airways" },
  { code: "FR", nom: "Ryanair" },
  { code: "U2", nom: "easyJet" },
  { code: "IB", nom: "Iberia" },
  { code: "VY", nom: "Vueling" },
  { code: "TP", nom: "TAP Air Portugal" },
  { code: "KL", nom: "KLM" },
  { code: "AZ", nom: "ITA Airways" },
  { code: "LX", nom: "SWISS" },
  { code: "OS", nom: "Austrian Airlines" },
  { code: "SN", nom: "Brussels Airlines" },
  { code: "SK", nom: "SAS" },
  { code: "AY", nom: "Finnair" },
  { code: "DY", nom: "Norwegian" },
  { code: "EW", nom: "Eurowings" },
  { code: "EI", nom: "Aer Lingus" },
  { code: "TO", nom: "Transavia France" },
  { code: "HV", nom: "Transavia" },
  { code: "W6", nom: "Wizz Air" },
  { code: "A3", nom: "Aegean Airlines" },
  { code: "TK", nom: "Turkish Airlines" },
  { code: "PC", nom: "Pegasus Airlines" },
  { code: "LO", nom: "LOT Polish Airlines" },
  { code: "RO", nom: "TAROM" },
  { code: "OU", nom: "Croatia Airlines" },
  { code: "JU", nom: "Air Serbia" },
  { code: "FB", nom: "Bulgaria Air" },
  { code: "EK", nom: "Emirates" },
  { code: "QR", nom: "Qatar Airways" },
  { code: "EY", nom: "Etihad Airways" },
  { code: "DL", nom: "Delta Air Lines" },
  { code: "AA", nom: "American Airlines" },
  { code: "UA", nom: "United Airlines" },
  { code: "AC", nom: "Air Canada" },
  { code: "MS", nom: "EgyptAir" },
  { code: "AT", nom: "Royal Air Maroc" },
  { code: "TU", nom: "Tunisair" },
  { code: "LY", nom: "El Al" },
  { code: "SV", nom: "Saudia" },
  { code: "ET", nom: "Ethiopian Airlines" },
  { code: "XQ", nom: "SunExpress" },
];

export function getCompagnieAerienne(code: string): CompagnieAerienne | undefined {
  return COMPAGNIES_AERIENNES.find((c) => c.code.toLowerCase() === code.toLowerCase());
}
