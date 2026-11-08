import { liveQuery } from 'dexie'
import { db, seedTriggers } from './db'
import type { CheckIn, Ontregeling, Trigger } from './types'

class Store {
  checkIns = $state<CheckIn[]>([])
  ontregelingen = $state<Ontregeling[]>([])
  triggers = $state<Trigger[]>([])
  klaar = $state(false)

  async start() {
    await seedTriggers()
    liveQuery(() => db.checkIns.orderBy('tijdstip').reverse().toArray()).subscribe((v) => {
      this.checkIns = v
      this.klaar = true
    })
    liveQuery(() => db.ontregelingen.orderBy('gestart').reverse().toArray()).subscribe((v) => {
      this.ontregelingen = v
    })
    liveQuery(() => db.triggers.toArray()).subscribe((v) => {
      this.triggers = v
    })
  }

  get vandaag(): CheckIn[] {
    const start = startVanDag(Date.now())
    return this.checkIns.filter((c) => c.tijdstip >= start).sort((a, b) => a.tijdstip - b.tijdstip)
  }

  get openOntregeling(): Ontregeling | undefined {
    return this.ontregelingen.find((o) => !o.geeindigd)
  }
}

export const store = new Store()

export function startVanDag(t: number): number {
  const d = new Date(t)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export const tijd = new Intl.DateTimeFormat('nl-NL', { hour: '2-digit', minute: '2-digit' })
export const datumLang = new Intl.DateTimeFormat('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })
export const datumKort = new Intl.DateTimeFormat('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' })

export function dagLabel(t: number): string {
  const vandaag = startVanDag(Date.now())
  const dag = startVanDag(t)
  if (dag === vandaag) return 'Vandaag'
  if (dag === vandaag - 86_400_000) return 'Gisteren'
  return datumLang.format(t)
}
