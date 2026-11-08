export type Score = 1 | 2 | 3 | 4 | 5 | 6
export type Kleur = 'rood' | 'oranje' | 'groen'
export type Staat = 'vechtvlucht' | 'bevriezen'
export type Richting = 'omhoog' | 'omlaag'

export type Ademhaling = 'rustig' | 'hoog' | 'ingehouden'
export type Spierspanning = 'los' | 'gespannen' | 'stijf'
export type Spreektempo = 'normaal' | 'snel' | 'traag'

export interface CheckIn {
  id?: number
  tijdstip: number
  score: Score
  ademhaling?: Ademhaling
  spierspanning?: Spierspanning
  spreektempo?: Spreektempo
  triggers: string[]
  context?: string
  notitie?: string
  ontregelingId?: number
}

export interface Ontregeling {
  id?: number
  checkInId?: number
  gestart: number
  geeindigd?: number
  staat: Staat
  gemerktAan: string[]
  gemerktTekst?: string
  triggers: string[]
  triggerTekst?: string
  watHielp?: string
  terugInVenster: boolean
}

export interface Trigger {
  id?: number
  richting: Richting
  tekst: string
  actief: boolean
}

export interface Zone {
  score: Score
  naam: string
  kort: string
  kleur: Kleur
  omschrijving: string
  buiten: boolean
  staat?: Staat
}

/** Van boven (6) naar beneden (1), zoals op het werkblad. */
export const ZONES: Zone[] = [
  {
    score: 6,
    naam: 'Vechten of vluchten',
    kort: 'Vechten / vluchten',
    kleur: 'rood',
    omschrijving: 'Snel boos, geïrriteerd, of vluchten in doorgaan, perfectionisme, hard werken, social media.',
    buiten: true,
    staat: 'vechtvlucht',
  },
  {
    score: 5,
    naam: 'Bovenrand',
    kort: 'Bovenrand',
    kleur: 'oranje',
    omschrijving: 'Spanning loopt op, gejaagd, kort lontje, maar nog net in contact.',
    buiten: false,
  },
  {
    score: 4,
    naam: 'Gezonde spanning: uitdagingen aangaan',
    kort: 'Uitdagingen aangaan',
    kleur: 'groen',
    omschrijving: 'Actie, bewegen, grenzen en wensen aangeven, delen vanuit kwetsbaarheid.',
    buiten: false,
  },
  {
    score: 3,
    naam: 'Gezonde ontspanning: rusten en herstellen',
    kort: 'Rusten en herstellen',
    kleur: 'groen',
    omschrijving: 'Bijtanken, uitrusten, reflecteren, steun en kalmering ontvangen.',
    buiten: false,
  },
  {
    score: 2,
    naam: 'Onderrand',
    kort: 'Onderrand',
    kleur: 'oranje',
    omschrijving: 'Wegzakken, lusteloos, moeite met contact, maar nog niet verdoofd.',
    buiten: false,
  },
  {
    score: 1,
    naam: 'Bevriezen',
    kort: 'Bevriezen',
    kleur: 'rood',
    omschrijving: 'Geen gevoel, leeg, alleen, verdoofd, energieloos, niet gegrond.',
    buiten: true,
    staat: 'bevriezen',
  },
]

export function zone(score: Score): Zone {
  return ZONES.find((z) => z.score === score)!
}

export const STAAT_LABEL: Record<Staat, string> = {
  vechtvlucht: 'Vechten / vluchten',
  bevriezen: 'Bevriezen',
}

export const STAAT_RICHTING: Record<Staat, Richting> = {
  vechtvlucht: 'omhoog',
  bevriezen: 'omlaag',
}

export const ADEMHALING: { waarde: Ademhaling; label: string }[] = [
  { waarde: 'rustig', label: 'Rustig' },
  { waarde: 'hoog', label: 'Hoog / snel' },
  { waarde: 'ingehouden', label: 'Ingehouden' },
]
export const SPIERSPANNING: { waarde: Spierspanning; label: string }[] = [
  { waarde: 'los', label: 'Los' },
  { waarde: 'gespannen', label: 'Gespannen' },
  { waarde: 'stijf', label: 'Stijf' },
]
export const SPREEKTEMPO: { waarde: Spreektempo; label: string }[] = [
  { waarde: 'normaal', label: 'Normaal' },
  { waarde: 'snel', label: 'Snel' },
  { waarde: 'traag', label: 'Traag / stil' },
]

export const CONTEXT_OPTIES = ['Thuis', 'Werk', 'Gezin', 'Alleen', 'Onderweg']

/** Uit werkblad Venster 2. */
export const DEFAULT_TRIGGERS: Omit<Trigger, 'id'>[] = [
  { richting: 'omhoog', tekst: 'Het gevoel dat er niet van me gehouden wordt', actief: true },
  { richting: 'omhoog', tekst: 'Het gevoel dat ik niet goed genoeg ben', actief: true },
  { richting: 'omhoog', tekst: 'Het gevoel dat ik niet belangrijk voor je ben', actief: true },
  { richting: 'omhoog', tekst: 'Me machteloos voelen', actief: true },
  { richting: 'omhoog', tekst: 'Niet gesteund of gewaardeerd worden', actief: true },
  { richting: 'omhoog', tekst: 'Harde stemmen', actief: true },
  { richting: 'omhoog', tekst: 'Berichten op social media', actief: true },
  { richting: 'omhoog', tekst: 'Niet gezien of gehoord worden', actief: true },
  { richting: 'omhoog', tekst: 'Lange lijst met dingen die nog moeten', actief: true },
  { richting: 'omhoog', tekst: 'Lange wachtrijen', actief: true },
  { richting: 'omhoog', tekst: 'Luidruchtige collega’s', actief: true },
  { richting: 'omlaag', tekst: 'Constante verwachtingen waar ik niet aan kan voldoen', actief: true },
  { richting: 'omlaag', tekst: 'Genegeerd worden', actief: true },
  { richting: 'omlaag', tekst: 'In de steek gelaten worden', actief: true },
  { richting: 'omlaag', tekst: 'Het gevoel dat ik er niet toe doe of geen verschil kan maken', actief: true },
  { richting: 'omlaag', tekst: 'Chronische pijn of ziekte', actief: true },
  { richting: 'omlaag', tekst: 'Buitengesloten worden in een gesprek', actief: true },
  { richting: 'omlaag', tekst: 'Me eenzaam en alleen voelen', actief: true },
]

/** Waaraan merk je een ontregeling. Startpunt; in fase 2 komt dit uit het eigen signaleringsplan. */
export const SIGNALEN: Record<Staat, string[]> = {
  vechtvlucht: [
    'Ademhaling hoog of snel',
    'Spieren gespannen',
    'Kaken op elkaar',
    'Snel praten',
    'Geïrriteerd reageren',
    'Hoofd vol, malen',
    'Doorgaan, hard werken',
    'Terugtrekken',
    'Scrollen, afleiding zoeken',
  ],
  bevriezen: [
    'Adem inhouden of oppervlakkig',
    'Lichaam zwaar of slap',
    'Stil vallen',
    'Niets voelen, verdoofd',
    'Leeg gevoel',
    'Geen energie',
    'Geen contact maken',
    'Weg willen',
    'Alleen voelen',
  ],
}
