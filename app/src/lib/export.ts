import { ADEMHALING, SPIERSPANNING, SPREEKTEMPO, STAAT_LABEL, zone, type CheckIn, type Ontregeling } from './types'
import { datumKort, datumLang, tijd } from './store.svelte'

function label<T>(lijst: { waarde: T; label: string }[], waarde?: T): string | undefined {
  return lijst.find((x) => x.waarde === waarde)?.label
}

export function maakExportTekst(checkIns: CheckIn[], ontregelingen: Ontregeling[]): string {
  const regels: string[] = []
  regels.push('VENSTER VAN STRESSTOLERANTIE - LOGBOEK')
  regels.push(`Geëxporteerd op ${datumKort.format(Date.now())} ${tijd.format(Date.now())}`)
  regels.push('')
  regels.push('Schaal: 6 vechten/vluchten, 5 bovenrand, 4 uitdagingen aangaan, 3 rusten en herstellen, 2 onderrand, 1 bevriezen')
  regels.push('')

  const perDag = new Map<string, CheckIn[]>()
  for (const c of [...checkIns].sort((a, b) => a.tijdstip - b.tijdstip)) {
    const key = datumLang.format(c.tijdstip)
    if (!perDag.has(key)) perDag.set(key, [])
    perDag.get(key)!.push(c)
  }

  const ontPerCheckIn = new Map<number, Ontregeling>()
  for (const o of ontregelingen) if (o.checkInId != null) ontPerCheckIn.set(o.checkInId, o)

  for (const [dag, items] of perDag) {
    regels.push(`=== ${dag} ===`)
    for (const c of items) {
      const z = zone(c.score)
      regels.push(`${tijd.format(c.tijdstip)}  [${c.score}] ${z.naam}`)
      const lichaam = [
        label(ADEMHALING, c.ademhaling) && `ademhaling ${label(ADEMHALING, c.ademhaling)!.toLowerCase()}`,
        label(SPIERSPANNING, c.spierspanning) && `spieren ${label(SPIERSPANNING, c.spierspanning)!.toLowerCase()}`,
        label(SPREEKTEMPO, c.spreektempo) && `spreektempo ${label(SPREEKTEMPO, c.spreektempo)!.toLowerCase()}`,
      ].filter(Boolean)
      if (lichaam.length) regels.push(`       lichaam: ${lichaam.join(', ')}`)
      if (c.triggers.length) regels.push(`       triggers: ${c.triggers.join('; ')}`)
      if (c.context) regels.push(`       context: ${c.context}`)
      if (c.notitie) regels.push(`       notitie: ${c.notitie}`)
      const o = c.id != null ? ontPerCheckIn.get(c.id) : undefined
      if (o) regels.push(...ontregelingRegels(o, '       '))
    }
    regels.push('')
  }

  const losse = ontregelingen.filter((o) => o.checkInId == null)
  if (losse.length) {
    regels.push('=== Ontregelingen zonder check-in ===')
    for (const o of [...losse].sort((a, b) => a.gestart - b.gestart)) {
      regels.push(`${datumKort.format(o.gestart)} ${tijd.format(o.gestart)}`)
      regels.push(...ontregelingRegels(o, '       '))
    }
  }

  return regels.join('\n')
}

function ontregelingRegels(o: Ontregeling, inspring: string): string[] {
  const r: string[] = []
  r.push(`${inspring}ONTREGELING: ${STAAT_LABEL[o.staat]}`)
  const gemerkt = [...o.gemerktAan, o.gemerktTekst].filter(Boolean)
  if (gemerkt.length) r.push(`${inspring}  gemerkt aan: ${gemerkt.join('; ')}`)
  const trig = [...o.triggers, o.triggerTekst].filter(Boolean)
  if (trig.length) r.push(`${inspring}  trigger: ${trig.join('; ')}`)
  if (o.watHielp) r.push(`${inspring}  wat hielp: ${o.watHielp}`)
  if (o.geeindigd) {
    const min = Math.round((o.geeindigd - o.gestart) / 60_000)
    r.push(`${inspring}  terug in venster: ${o.terugInVenster ? 'ja' : 'nee'} (na ${min} min, om ${tijd.format(o.geeindigd)})`)
  } else {
    r.push(`${inspring}  nog niet afgerond`)
  }
  return r
}

export async function deelOfDownload(tekst: string) {
  const bestandsnaam = `venster-logboek-${new Date().toISOString().slice(0, 10)}.txt`
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean }
  if (nav.share) {
    const bestand = new File([tekst], bestandsnaam, { type: 'text/plain' })
    try {
      if (nav.canShare?.({ files: [bestand] })) {
        await nav.share({ files: [bestand], title: 'Venster logboek' })
        return
      }
      await nav.share({ text: tekst, title: 'Venster logboek' })
      return
    } catch (e) {
      if ((e as Error).name === 'AbortError') return
    }
  }
  const blob = new Blob([tekst], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = bestandsnaam
  a.click()
  URL.revokeObjectURL(url)
}
