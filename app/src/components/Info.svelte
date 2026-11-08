<script lang="ts">
  import { BRONNEN } from '../lib/info'
  import Sheet from './Sheet.svelte'

  let { onclose }: { onclose: () => void } = $props()

  const nl = BRONNEN.filter((b) => b.taal === 'nl')
  const en = BRONNEN.filter((b) => b.taal === 'en')
</script>

<Sheet titel="Over het venster" {onclose}>
  <div class="space-y-4 text-[0.95rem] leading-relaxed text-stone-800">
    <p>
      Het <strong>window of tolerance</strong>, in het Nederlands het venster van stresstolerantie of tolerantievenster,
      is een model van de Amerikaanse psychiater Dan Siegel (1999). Het beschrijft het spanningsgebied waarin je
      zenuwstelsel zó gereguleerd is dat je helder kunt denken, kunt voelen wat er is en in contact blijft met anderen.
      Binnen het venster wissel je gezond af tussen spanning (uitdagingen aangaan) en ontspanning (rusten en herstellen).
    </p>

    <div class="kaart border-l-4 border-red-600">
      <div class="font-bold text-red-700">Boven het venster: vechten of vluchten</div>
      <p class="mt-1 text-sm">
        Hyperarousal. Je sympathische zenuwstelsel staat aan. Snel boos of geïrriteerd, gejaagd, piekeren. Of vluchten in
        dóórgaan: hard werken, perfectionisme, scrollen, eten, sporten.
      </p>
    </div>

    <div class="kaart border-l-4 border-green-600">
      <div class="font-bold text-green-700">Binnen het venster: veilig en verbonden</div>
      <p class="mt-1 text-sm">
        Je voelt wat je voelt zonder erdoor overspoeld te worden. Je kunt grenzen aangeven, steun ontvangen en soepel
        wisselen tussen alleen zijn en samen zijn.
      </p>
    </div>

    <div class="kaart border-l-4 border-red-600">
      <div class="font-bold text-red-700">Onder het venster: bevriezen</div>
      <p class="mt-1 text-sm">
        Hypoarousal. Je systeem schakelt af. Leeg, verdoofd, energieloos, geen contact meer. Van buiten kan het rustig
        lijken, daarom wordt deze staat makkelijk gemist.
      </p>
    </div>

    <p>
      Iedereen heeft een venster, maar de breedte verschilt per persoon en per moment. Langdurige stress en trauma maken
      het smaller, waardoor gewone prikkels je er sneller uit duwen. Het venster kan ook weer breder worden. Dat begint
      met herkennen waar je zit, weten wat je triggers zijn en ontdekken wat je terugbrengt.
    </p>

    <p>
      <strong>Terug naar het venster.</strong> Bij vechten of vluchten helpt vertragen en aarden: langer uitademen dan
      inademen, bewegen, voeten op de grond. Bij bevriezen helpt zachte activatie en contact: opstaan, een beweging
      maken, iemand een bericht sturen, een veilige herinnering ophalen.
    </p>

    <p class="text-sm text-stone-600">
      De werkbladen waar deze app op is gebouwd komen uit <em>Het ambacht van de secure base coach</em> (Van Wielink
      e.a., 2022, p. 91). Deze app vervangt geen therapie; bespreek wat je logt met je behandelaar.
    </p>

    <section>
      <div class="kop">Meer lezen (Nederlands)</div>
      <ul class="space-y-2">
        {#each nl as b (b.url)}
          <li class="kaart !p-3">
            <a href={b.url} target="_blank" rel="noopener noreferrer" class="font-semibold text-stone-900 underline">
              {b.titel}
            </a>
            <div class="text-xs text-stone-500">{b.wie}</div>
          </li>
        {/each}
      </ul>
    </section>

    <section>
      <div class="kop">Meer lezen (Engels)</div>
      <ul class="space-y-2">
        {#each en as b (b.url)}
          <li class="kaart !p-3">
            <a href={b.url} target="_blank" rel="noopener noreferrer" class="font-semibold text-stone-900 underline">
              {b.titel}
            </a>
            <div class="text-xs text-stone-500">{b.wie}</div>
          </li>
        {/each}
      </ul>
    </section>
  </div>
</Sheet>
