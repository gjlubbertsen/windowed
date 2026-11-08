<script lang="ts">
  import type { Snippet } from 'svelte'

  let { titel, kleur, onclose, children }: { titel: string; kleur?: string; onclose: () => void; children: Snippet } = $props()
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="fixed inset-0 z-40 flex flex-col justify-end bg-black/40" role="presentation" onclick={onclose}>
  <div
    class="mx-auto flex max-h-[92dvh] w-full max-w-md flex-col rounded-t-3xl bg-stone-100 shadow-2xl"
    role="dialog"
    aria-modal="true"
    aria-label={titel}
    tabindex="-1"
    onclick={(e) => e.stopPropagation()}
    onkeydown={(e) => e.key === 'Escape' && onclose()}
  >
    <div class="flex items-center justify-between rounded-t-3xl px-5 py-4 {kleur ?? 'bg-stone-800'} text-white">
      <h2 class="text-lg font-bold">{titel}</h2>
      <button type="button" class="rounded-full bg-white/20 px-3 py-1 text-sm font-semibold" onclick={onclose}>Sluiten</button>
    </div>
    <div class="flex-1 overflow-y-auto px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4">
      {@render children()}
    </div>
  </div>
</div>
