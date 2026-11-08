<script lang="ts">
  import CheckInSheet from './components/CheckInSheet.svelte'
  import Info from './components/Info.svelte'
  import InfoKnop from './components/InfoKnop.svelte'
  import Logboek from './components/Logboek.svelte'
  import OntregelingForm from './components/OntregelingForm.svelte'
  import Venster from './components/Venster.svelte'
  import { db } from './lib/db'
  import { store, tijd } from './lib/store.svelte'
  import { STAAT_LABEL, zone, type CheckIn, type Ontregeling, type Score } from './lib/types'

  let tab = $state<'vandaag' | 'logboek'>('vandaag')
  let sheetCheckIn = $state<CheckIn | undefined>()
  let formOntregeling = $state<Ontregeling | undefined>()
  let infoOpen = $state(false)

  const laatste = $derived(store.vandaag.at(-1))

  async function checkIn(score: Score) {
    const nu = Date.now()
    const c: CheckIn = { tijdstip: nu, score, triggers: [] }
    const id = await db.checkIns.add(c)
    const z = zone(score)
    if (z.buiten && z.staat) {
      formOntregeling = { checkInId: id, gestart: nu, staat: z.staat, gemerktAan: [], triggers: [], terugInVenster: false }
    } else {
      sheetCheckIn = { ...c, id }
    }
  }

  function nieuweOntregeling() {
    formOntregeling = { gestart: Date.now(), staat: 'vechtvlucht', gemerktAan: [], triggers: [], terugInVenster: false }
  }
</script>

<div class="mx-auto flex min-h-dvh w-full max-w-md flex-col">
  <main class="flex-1 px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-28">
    {#if tab === 'vandaag'}
      <div class="flex items-start justify-between gap-3">
        <div>
          <h1 class="text-xl font-bold">Waar zit je nu?</h1>
          <p class="mb-3 text-sm text-stone-500">Tik op de band. Dat is alles.</p>
        </div>
        <InfoKnop onclick={() => (infoOpen = true)} />
      </div>

      <Venster vandaag={store.vandaag} onselect={checkIn} />

      {#if store.openOntregeling}
        {@const o = store.openOntregeling}
        <button type="button" class="kaart mt-4 w-full border-l-4 border-red-600 text-left" onclick={() => (formOntregeling = o)}>
          <div class="font-semibold">Om {tijd.format(o.gestart)}: {STAAT_LABEL[o.staat]}</div>
          <div class="text-sm text-stone-600">Ben je weer terug in je venster? Tik om af te ronden.</div>
        </button>
      {/if}

      <div class="mt-4 flex items-center justify-between text-sm text-stone-600">
        {#if laatste}
          <span>Laatste: <strong>{laatste.score}</strong> om {tijd.format(laatste.tijdstip)}, {store.vandaag.length}× vandaag</span>
          <button type="button" class="underline" onclick={() => (sheetCheckIn = laatste)}>aanvullen</button>
        {:else}
          <span>Vandaag nog niets gelogd.</span>
        {/if}
      </div>

      <button type="button" class="knop knop-licht mt-4" onclick={nieuweOntregeling}>Ik ben ontregeld</button>
    {:else}
      <Logboek onopen={(c) => (sheetCheckIn = c)} onopenOntregeling={(o) => (formOntregeling = o)} oninfo={() => (infoOpen = true)} />
    {/if}
  </main>

  <nav class="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white/95 backdrop-blur">
    <div class="mx-auto flex max-w-md pb-[env(safe-area-inset-bottom)]">
      {#each [['vandaag', 'Vandaag'], ['logboek', 'Logboek']] as const as [id, label] (id)}
        <button
          type="button"
          class="flex-1 py-3 text-sm font-semibold {tab === id ? 'text-stone-900' : 'text-stone-400'}"
          onclick={() => (tab = id)}
        >
          {label}
        </button>
      {/each}
    </div>
  </nav>
</div>

{#if sheetCheckIn}
  <CheckInSheet checkIn={sheetCheckIn} onclose={() => (sheetCheckIn = undefined)} />
{/if}
{#if formOntregeling}
  <OntregelingForm ontregeling={formOntregeling} onclose={() => (formOntregeling = undefined)} />
{/if}
{#if infoOpen}
  <Info onclose={() => (infoOpen = false)} />
{/if}
