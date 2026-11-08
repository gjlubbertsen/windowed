<script lang="ts">
  import { db } from '../lib/db'
  import { store, tijd } from '../lib/store.svelte'
  import { ADEMHALING, CONTEXT_OPTIES, SPIERSPANNING, SPREEKTEMPO, ZONES, zone, type CheckIn, type Score } from '../lib/types'
  import Chips from './Chips.svelte'
  import Sheet from './Sheet.svelte'

  let { checkIn, onclose }: { checkIn: CheckIn; onclose: () => void } = $props()

  // svelte-ignore state_referenced_locally
  let c = $state<CheckIn>({ ...checkIn, triggers: [...checkIn.triggers] })
  const z = $derived(zone(c.score))
  const kleur = $derived(z.kleur === 'rood' ? 'bg-red-600' : z.kleur === 'oranje' ? 'bg-amber-500' : 'bg-green-600')

  const omhoog = $derived(store.triggers.filter((t) => t.richting === 'omhoog' && t.actief).map((t) => t.tekst))
  const omlaag = $derived(store.triggers.filter((t) => t.richting === 'omlaag' && t.actief).map((t) => t.tekst))

  function naarLokaleTijd(t: number): string {
    const d = new Date(t)
    const p = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
  }
  // svelte-ignore state_referenced_locally
  let tijdstipTekst = $state(naarLokaleTijd(checkIn.tijdstip))
  function tijdGewijzigd() {
    const t = new Date(tijdstipTekst).getTime()
    if (!Number.isNaN(t)) c.tijdstip = t
  }

  function bandKleur(score: Score) {
    const k = zone(score).kleur
    return k === 'rood' ? 'bg-red-600 border-red-600' : k === 'oranje' ? 'bg-amber-500 border-amber-500' : 'bg-green-600 border-green-600'
  }

  async function bewaar() {
    await db.checkIns.update(c.id!, { ...$state.snapshot(c) })
  }

  let bevestigVerwijderen = $state(false)

  async function verwijder() {
    if (!bevestigVerwijderen) {
      bevestigVerwijderen = true
      return
    }
    if (c.ontregelingId != null) await db.ontregelingen.delete(c.ontregelingId)
    await db.checkIns.delete(c.id!)
    onclose()
  }

  async function klaar() {
    await bewaar()
    onclose()
  }
</script>

<Sheet titel="{c.score} · {z.kort}" {kleur} onclose={klaar}>
  <p class="mb-4 text-sm text-stone-600">Opgeslagen om {tijd.format(c.tijdstip)}. Alles hieronder is optioneel.</p>

  <section class="mb-5">
    <div class="kop">Score</div>
    <div class="flex gap-2">
      {#each [...ZONES].reverse() as z (z.score)}
        <button
          type="button"
          class="flex h-11 flex-1 items-center justify-center rounded-xl border-2 text-lg font-bold text-white transition {bandKleur(z.score)}"
          class:opacity-40={c.score !== z.score}
          class:ring-2={c.score === z.score}
          class:ring-stone-900={c.score === z.score}
          aria-label="{z.score}: {z.naam}"
          aria-pressed={c.score === z.score}
          onclick={() => (c.score = z.score)}
        >
          {z.score}
        </button>
      {/each}
    </div>
  </section>

  <section class="mb-5">
    <div class="kop">Tijdstip</div>
    <input type="datetime-local" class="veld" bind:value={tijdstipTekst} onchange={tijdGewijzigd} />
  </section>

  <section class="mb-5">
    <div class="kop">Ademhaling</div>
    <Chips opties={ADEMHALING} gekozen={c.ademhaling} onchange={(v) => (c.ademhaling = v as CheckIn['ademhaling'])} />
  </section>
  <section class="mb-5">
    <div class="kop">Spierspanning</div>
    <Chips opties={SPIERSPANNING} gekozen={c.spierspanning} onchange={(v) => (c.spierspanning = v as CheckIn['spierspanning'])} />
  </section>
  <section class="mb-5">
    <div class="kop">Spreektempo</div>
    <Chips opties={SPREEKTEMPO} gekozen={c.spreektempo} onchange={(v) => (c.spreektempo = v as CheckIn['spreektempo'])} />
  </section>

  <section class="mb-5">
    <div class="kop">Wat speelde er? Richting vechten / vluchten</div>
    <Chips opties={omhoog} gekozen={c.triggers} meerdere onchange={(v) => (c.triggers = v as string[])} />
  </section>
  <section class="mb-5">
    <div class="kop">Richting bevriezen</div>
    <Chips opties={omlaag} gekozen={c.triggers} meerdere onchange={(v) => (c.triggers = v as string[])} />
  </section>

  <section class="mb-5">
    <div class="kop">Waar / met wie</div>
    <Chips opties={CONTEXT_OPTIES} gekozen={c.context} onchange={(v) => (c.context = v as string | undefined)} />
    <input class="veld mt-2" placeholder="Of typ het zelf" bind:value={c.context} />
  </section>

  <section class="mb-5">
    <div class="kop">Notitie</div>
    <textarea class="veld" rows="2" placeholder="Een regel is genoeg" bind:value={c.notitie}></textarea>
  </section>

  <button type="button" class="knop" onclick={klaar}>Klaar</button>
  <button type="button" class="knop knop-licht mt-3 !text-red-700" class:!bg-red-700={bevestigVerwijderen} class:!text-white={bevestigVerwijderen} onclick={verwijder}>
    {bevestigVerwijderen ? 'Zeker weten? Tik nogmaals om te verwijderen' : 'Check-in verwijderen'}
  </button>
  {#if bevestigVerwijderen}
    <button type="button" class="mt-2 w-full py-2 text-sm text-stone-500" onclick={() => (bevestigVerwijderen = false)}>Toch niet</button>
  {/if}
</Sheet>
