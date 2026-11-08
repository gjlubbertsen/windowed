<script lang="ts">
  let { onclick }: { onclick: () => void } = $props()
</script>

<button
  type="button"
  class="flex h-9 w-9 flex-none items-center justify-center rounded-full border-1.5 border-stone-300 bg-white text-stone-700 active:bg-stone-100"
  aria-label="Uitleg over het venster van stresstolerantie"
  title="Over het venster"
  {onclick}
>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="11" x2="12" y2="17" />
    <circle cx="12" cy="7.5" r="0.6" fill="currentColor" />
  </svg>
</button>
