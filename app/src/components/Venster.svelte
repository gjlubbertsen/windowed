<script lang="ts">
  import { ZONES, type CheckIn, type Score } from '../lib/types'

  let { vandaag, onselect }: { vandaag: CheckIn[]; onselect: (score: Score) => void } = $props()

  let w = $state(0)
  let h = $state(0)

  const BEGIN_UUR = 6
  const EIND_UUR = 24

  const laatste = $derived(vandaag.at(-1))

  const punten = $derived(
    vandaag.map((c) => {
      const d = new Date(c.tijdstip)
      const uur = Math.min(EIND_UUR, Math.max(BEGIN_UUR, d.getHours() + d.getMinutes() / 60))
      return {
        x: ((uur - BEGIN_UUR) / (EIND_UUR - BEGIN_UUR)) * w,
        y: ((6 - c.score + 0.5) / 6) * h,
      }
    }),
  )
  const pad = $derived(punten.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '))
</script>

<div class="relative flex flex-col overflow-hidden rounded-2xl shadow-md" bind:clientWidth={w} bind:clientHeight={h}>
  {#each ZONES as z (z.score)}
    <button
      type="button"
      class="band band-{z.kleur}"
      class:grens-hard={z.score === 5 || z.score === 1}
      class:grens-zacht={z.score === 4 || z.score === 2}
      class:band-geselecteerd={laatste?.score === z.score}
      onclick={() => onselect(z.score)}
      aria-label="{z.score}: {z.naam}"
    >
      <span class="score">{z.score}</span>
      <span class="tekst">
        <strong>{z.kort}</strong>
        <small>{z.omschrijving}</small>
      </span>
    </button>
  {/each}

  {#if punten.length}
    <svg class="pointer-events-none absolute inset-0" width={w} height={h} aria-hidden="true">
      <path d={pad} fill="none" stroke="#1c1917" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" />
      {#each punten as p, i (i)}
        <circle cx={p.x} cy={p.y} r="6" fill="#1c1917" stroke="#fff" stroke-width="2.5" />
      {/each}
    </svg>
  {/if}
</div>
<div class="mt-1 flex justify-between px-1 text-[0.65rem] text-stone-500">
  <span>6:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
</div>
