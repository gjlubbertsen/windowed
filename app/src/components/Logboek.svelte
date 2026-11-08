<script lang="ts">
  import { db } from '../lib/db'
  import { deelOfDownload, maakExportTekst } from '../lib/export'
  import { dagLabel, startVanDag, store, tijd } from '../lib/store.svelte'
  import { STAAT_LABEL, zone, type CheckIn, type Ontregeling } from '../lib/types'

  import InfoKnop from './InfoKnop.svelte'

  let {
    onopen,
    onopenOntregeling,
    oninfo,
  }: { onopen: (c: CheckIn) => void; onopenOntregeling: (o: Ontregeling) => void; oninfo: () => void } = $props()

  const dagen = $derived.by(() => {
    const map = new Map<number, CheckIn[]>()
    for (const c of store.checkIns) {
      const k = startVanDag(c.tijdstip)
      if (!map.has(k)) map.set(k, [])
      map.get(k)!.push(c)
    }
    return [...map.entries()].sort((a, b) => b[0] - a[0])
  })

  const ontPerId = $derived(new Map(store.ontregelingen.map((o) => [o.id!, o])))

  function badgeKleur(score: number) {
    const k = zone(score as CheckIn['score']).kleur
    return k === 'rood' ? 'bg-red-600' : k === 'oranje' ? 'bg-amber-500' : 'bg-green-600'
  }

  function gemiddelde(items: CheckIn[]) {
    return (items.reduce((s, c) => s + c.score, 0) / items.length).toFixed(1)
  }

  /** Welke regel wacht op bevestiging van verwijderen: 'c:<id>' of 'o:<id>'. */
  let bevestig = $state<string | undefined>()

  async function verwijderCheckIn(c: CheckIn) {
    if (c.ontregelingId != null) await db.ontregelingen.delete(c.ontregelingId)
    await db.checkIns.delete(c.id!)
    bevestig = undefined
  }

  async function verwijderOntregeling(o: Ontregeling) {
    await db.ontregelingen.delete(o.id!)
    if (o.checkInId != null) await db.checkIns.update(o.checkInId, { ontregelingId: undefined })
    bevestig = undefined
  }

  async function exporteer() {
    await deelOfDownload(maakExportTekst(store.checkIns, store.ontregelingen))
  }
</script>

<div class="flex items-center justify-between">
  <h1 class="text-xl font-bold">Logboek</h1>
  <div class="flex items-center gap-2">
    <button type="button" class="knop knop-licht !w-auto !py-2 text-sm" onclick={exporteer} disabled={!store.checkIns.length}>
      Exporteren
    </button>
    <InfoKnop onclick={oninfo} />
  </div>
</div>
<p class="mt-1 text-sm text-stone-500">
  {store.checkIns.length} check-ins, {store.ontregelingen.length} ontregelingen.
</p>

{#if !store.checkIns.length}
  <div class="kaart mt-6 text-center text-stone-500">Nog niets gelogd. Tik op het venster bij Vandaag.</div>
{/if}

{#each dagen as [dag, items] (dag)}
  <section class="mt-5">
    <div class="mb-2 flex items-baseline justify-between">
      <h2 class="font-semibold capitalize">{dagLabel(dag)}</h2>
      <span class="text-xs text-stone-500">{items.length}× · gem. {gemiddelde(items)}</span>
    </div>
    <div class="overflow-hidden rounded-2xl bg-white shadow-sm">
      {#each items as c (c.id)}
        {@const z = zone(c.score)}
        {@const o = c.ontregelingId != null ? ontPerId.get(c.ontregelingId) : undefined}
        <div class="border-b border-stone-100 last:border-0">
          <div class="flex items-start gap-3 px-3 pt-3">
            <span class="badge {badgeKleur(c.score)}">{c.score}</span>
            <div class="min-w-0 flex-1">
              <div class="flex justify-between">
                <span class="font-medium">{z.kort}</span>
                <span class="text-sm text-stone-500">{tijd.format(c.tijdstip)}</span>
              </div>
              {#if c.ademhaling || c.spierspanning || c.spreektempo}
                <div class="text-xs text-stone-500">
                  {[c.ademhaling && `adem ${c.ademhaling}`, c.spierspanning && `spieren ${c.spierspanning}`, c.spreektempo && `spreken ${c.spreektempo}`]
                    .filter(Boolean)
                    .join(' · ')}
                </div>
              {/if}
              {#if c.triggers.length}
                <div class="text-xs text-stone-600">{c.triggers.join('; ')}</div>
              {/if}
              {#if c.context || c.notitie}
                <div class="text-sm text-stone-700">{[c.context, c.notitie].filter(Boolean).join(' · ')}</div>
              {/if}
            </div>
          </div>

          {#if o}
            <div class="mx-3 mt-2 rounded-lg bg-red-50 px-2 py-1.5 text-xs text-red-900">
              <strong>Ontregeling: {STAAT_LABEL[o.staat]}</strong>
              {#if o.gemerktAan.length || o.gemerktTekst}
                <br />gemerkt aan: {[...o.gemerktAan, o.gemerktTekst].filter(Boolean).join('; ')}
              {/if}
              {#if o.geeindigd}
                <br />terug na {Math.round((o.geeindigd - o.gestart) / 60_000)} min{o.watHielp ? `: ${o.watHielp}` : ''}
              {:else}
                <br />nog niet afgerond
              {/if}
              <div class="mt-1 flex gap-3">
                {#if bevestig === `o:${o.id}`}
                  <span>Ontregeling verwijderen? De check-in blijft staan.</span>
                  <button type="button" class="font-semibold underline" onclick={() => verwijderOntregeling(o)}>Ja</button>
                  <button type="button" class="font-semibold underline" onclick={() => (bevestig = undefined)}>Nee</button>
                {:else}
                  <button type="button" class="font-semibold underline" onclick={() => onopenOntregeling(o)}>Bewerken</button>
                  <button type="button" class="font-semibold underline" onclick={() => (bevestig = `o:${o.id}`)}>Verwijderen</button>
                {/if}
              </div>
            </div>
          {/if}

          <div class="flex items-center justify-end gap-1 px-2 py-1">
            {#if bevestig === `c:${c.id}`}
              <span class="mr-1 text-sm text-stone-600">
                {o ? 'Check-in én ontregeling verwijderen?' : 'Zeker weten?'}
              </span>
              <button type="button" class="rounded-lg bg-red-700 px-3 py-1.5 text-sm font-semibold text-white" onclick={() => verwijderCheckIn(c)}>
                Ja, verwijder
              </button>
              <button type="button" class="rounded-lg px-3 py-1.5 text-sm font-semibold text-stone-700" onclick={() => (bevestig = undefined)}>
                Nee
              </button>
            {:else}
              <button type="button" class="rounded-lg px-3 py-1.5 text-sm font-semibold text-stone-700 active:bg-stone-100" onclick={() => onopen(c)}>
                Bewerken
              </button>
              <button type="button" class="rounded-lg px-3 py-1.5 text-sm font-semibold text-red-700 active:bg-red-50" onclick={() => (bevestig = `c:${c.id}`)}>
                Verwijderen
              </button>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </section>
{/each}
