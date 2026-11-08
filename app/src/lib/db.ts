import Dexie, { type EntityTable } from 'dexie'
import { DEFAULT_TRIGGERS, type CheckIn, type Ontregeling, type Trigger } from './types'

export const db = new Dexie('venster') as Dexie & {
  checkIns: EntityTable<CheckIn, 'id'>
  ontregelingen: EntityTable<Ontregeling, 'id'>
  triggers: EntityTable<Trigger, 'id'>
}

db.version(1).stores({
  checkIns: '++id, tijdstip, score, ontregelingId',
  ontregelingen: '++id, gestart, geeindigd, staat, checkInId',
  triggers: '++id, richting',
})

export async function seedTriggers() {
  if ((await db.triggers.count()) === 0) {
    await db.triggers.bulkAdd(DEFAULT_TRIGGERS as Trigger[])
  }
}
