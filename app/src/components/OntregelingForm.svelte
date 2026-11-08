<script lang="ts">
  import { db } from '../lib/db'
  import { store, tijd } from '../lib/store.svelte'
  import { SIGNALEN, STAAT_LABEL, STAAT_RICHTING, type Ontregeling, type Staat } from '../lib/types'
  import Chips from './Chips.svelte'
  import Sheet from './Sheet.svelte'

  let { ontregeling, onclose }: { ontregeling: Ontregeling; onclose: () => void } = $props()

  // svelte-ignore state_referenced_locally
  let o = $state<Ontregeling>({
    ...ontregeling,
    gemerktAan: [...ontregeling.gemerktAan],
    triggers: [...ontregeling.triggers],
  })
  // svelte-ignore state_referenced_locally
  let terug = $state(!!ontregeling.geeindigd)

  // svelte-ignore state_referenced_locally
  const nieuw = ontregeling.id == null
  const kleur = 'bg-red-700'
  const staten: { waarde: Staat; label: string }[] = [
    { waarde: 'vechtvlucht', label: STAAT_LABEL.vechtvlucht },
    { waarde: 'bevriezen', label: STAAT_LABEL.bevriezen },
  ]
  const triggerOpties = $derived(
    store.triggers.filter((t) => t.richting === STAAT_RICHTING[o.staat] && t.actief).map((t) => t.tekst),
  )

  /** Startpunt uit werkblad Venster 4. In fase 2 komt hier het eigen kalmeringsplan. */
  const KALMERING: Record<Staat, string[]> = {
    vechtvlucht: [
      'Ademhaling: adem langer uit dan in. Een paar keer.',
      'Beweging: loop even, schud armen en schouders los.',
      'Gedachte: wat heb ik nu nodig van mezelf? Van de ander?',
      'Uitspreken: zeg wat je nodig hebt, in één zin.',
    ],
    bevriezen: [
      'Ademhaling: adem bewust in, voel je voeten op de grond.',
      'Beweging: sta op, maak één beweging richting contact.',
      'Herinnering: denk aan een moment dat je veilig en verbonden was. Maak het levendig.',
      'Contact: stuur iemand een bericht, of ga naar een plek met mensen.',
    ],
  }

  async function bewaar() {
    const nu = Date.now()
    const data: Ontregeling = { ...$state.snapshot(o), terugInVenster: terug }
    if (terug && !data.geeindigd) data.geeindigd = nu
    if (!terug) data.geeindigd = undefined
    const id = await db.ontregelingen.put(data)
    if (nieuw && data.checkInId != null) {
      await db.checkIns.update(data.checkInId, { ontregelingId: id })
    }
    onclose()
  }

  let bevestigVerwijderen = $state(false)

  async function verwijder() {
    if (!bevestigVerwijderen) {
      bevestigVerwijderen = true
      return
    }
    if (o.id != null) {
      await db.ontregelingen.delete(o.id)
      if (o.checkInId != null) await db.checkIns.update(o.checkInId, { ontregelingId: undefined })
    }
    onclose()
  }
</script>

<Sheet titel="Ontregeling" {kleur} onclose={bewaar}>
  <p class="mb-4 text-sm text-stone-600">
    Gestart om {tijd.format(o.gestart)}. Vul in wat je nu kunt; de rest mag later.
  </p>

  <section class="mb-5">
    <div class="kop">In welke staat zit ik?</div>
    <Chips opties={staten} gekozen={o.staat} onchange={(v) => v && (o.staat = v as Staat)} />
  </section>

  <section class="mb-5">
    <div class="kop">Waaraan merk ik het?</div>
    <Chips opties={SIGNALEN[o.staat]} gekozen={o.gemerktAan} meerdere onchange={(v) => (o.gemerktAan = v as string[])} />
    <textarea class="veld mt-2" rows="2" placeholder="Lichaam, gedachten, gedrag, wat anderen zien" bind:value={o.gemerktTekst}></textarea>
  </section>

  <section class="mb-5">
    <div class="kop">Wat ging eraan vooraf?</div>
    <Chips opties={triggerOpties} gekozen={o.triggers} meerdere onchange={(v) => (o.triggers = v as string[])} />
    <input class="veld mt-2" placeholder="Of iets anders" bind:value={o.triggerTekst} />
  </section>

  <section class="kaart mb-5 border-l-4 border-green-600">
    <div class="kop text-green-800">Terug naar het venster</div>
    <ul class="space-y-1.5 text-sm text-stone-700">
      {#each KALMERING[o.staat] as regel (regel)}
        <li>{regel}</li>
      {/each}
    </ul>
  </section>

  <section class="mb-5">
    <label class="flex items-center gap-3 text-base font-semibold">
      <input type="checkbox" class="h-5 w-5" bind:checked={terug} />
      Ik ben weer terug in mijn venster
    </label>
    {#if terug}
      <div class="kop mt-3">Wat hielp om terug te komen?</div>
      <textarea class="veld" rows="3" placeholder="Ademhaling, beweging, contact, een gedachte..." bind:value={o.watHielp}></textarea>
    {:else}
      <p class="mt-2 text-sm text-stone-500">Nog niet? Prima. De app vraagt er straks nog eens naar.</p>
    {/if}
  </section>

  <button type="button" class="knop" onclick={bewaar}>Opslaan</button>
  {#if !nieuw}
    <button type="button" class="knop knop-licht mt-3 !text-red-700" class:!bg-red-700={bevestigVerwijderen} class:!text-white={bevestigVerwijderen} onclick={verwijder}>
      {bevestigVerwijderen ? 'Zeker weten? Tik nogmaals om te verwijderen' : 'Ontregeling verwijderen (check-in blijft staan)'}
    </button>
    {#if bevestigVerwijderen}
      <button type="button" class="mt-2 w-full py-2 text-sm text-stone-500" onclick={() => (bevestigVerwijderen = false)}>Toch niet</button>
    {/if}
  {/if}
</Sheet>
