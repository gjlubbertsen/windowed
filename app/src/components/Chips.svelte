<script lang="ts">
  let {
    opties,
    gekozen,
    meerdere = false,
    onchange,
  }: {
    opties: { waarde: string; label: string }[] | string[]
    gekozen: string[] | string | undefined
    meerdere?: boolean
    onchange: (nieuw: string[] | string | undefined) => void
  } = $props()

  const items = $derived(opties.map((o) => (typeof o === 'string' ? { waarde: o, label: o } : o)))

  function aan(waarde: string): boolean {
    return Array.isArray(gekozen) ? gekozen.includes(waarde) : gekozen === waarde
  }

  function klik(waarde: string) {
    if (meerdere) {
      const lijst = Array.isArray(gekozen) ? gekozen : []
      onchange(lijst.includes(waarde) ? lijst.filter((x) => x !== waarde) : [...lijst, waarde])
    } else {
      onchange(gekozen === waarde ? undefined : waarde)
    }
  }
</script>

<div class="flex flex-wrap gap-2">
  {#each items as it (it.waarde)}
    <button type="button" class="chip" class:chip-aan={aan(it.waarde)} onclick={() => klik(it.waarde)}>
      {it.label}
    </button>
  {/each}
</div>
