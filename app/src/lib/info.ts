export interface Bron {
  titel: string
  url: string
  wie: string
  taal: 'nl' | 'en'
}

/** Gecontroleerd op 8 november 2026: alle pagina's laden en gaan over het model. */
export const BRONNEN: Bron[] = [
  {
    titel: 'De Window of Tolerance',
    url: 'https://traumanet.nl/infotheek/de-window-of-tolerance/',
    wie: 'Traumanet, onafhankelijk informatieplatform over trauma (stichting)',
    taal: 'nl',
  },
  {
    titel: 'Window of Tolerance: boven- en onderroute',
    url: 'https://www.psycholoogvannu.nl/window-of-tolerance/',
    wie: 'Psycholoog van Nu, psychologenpraktijk',
    taal: 'nl',
  },
  {
    titel: 'Window of Tolerance, met oefeningen',
    url: 'https://www.psychosomatischefysio.nl/window-of-tolerance-nederlands',
    wie: 'Fysio Jaap, psychosomatische fysiotherapie',
    taal: 'nl',
  },
  {
    titel: 'How to help your clients understand their window of tolerance',
    url: 'https://www.nicabm.com/trauma-how-to-help-your-clients-understand-their-window-of-tolerance/',
    wie: 'NICABM, infographic voor therapeuten en cliënten',
    taal: 'en',
  },
  {
    titel: 'Window of Tolerance: theory and practice',
    url: 'https://www.psychologytools.com/resource/window-of-tolerance/',
    wie: 'Psychology Tools, achtergrond en werkwijze',
    taal: 'en',
  },
  {
    titel: 'Het ambacht van de secure base coach',
    url: 'https://boom.nl/100-10496_Het-ambacht-van-de-secure-base-coach',
    wie: 'Van Wielink e.a. (2022), Boom. Bron van de werkbladen in deze app, p. 91',
    taal: 'nl',
  },
]
