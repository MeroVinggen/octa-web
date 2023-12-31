<script lang="ts">
  import { modalStore } from "@skeletonlabs/skeleton";
  import { getContext } from "svelte";
  import { flip } from "svelte/animate";
  import { scale } from "svelte/transition";
  import { getConfirmModalSettings } from "../../../../../../shared/components/ConfirmModal/ConfirmModalUtils.js";
  import {
    WEEK_DAYS_SHORT_TO_LONG,
    type WEEK_DAYS_SHORTS_TYPE,
  } from "../../../../../../utils/helpers.js";
  import type { PracticeStores } from "../../../../interfaces/practiceStores.js";
  import {
    onDayCopySettingsCallback,
    setUtilsCurrentDay,
    setUtilsDayToCopy,
    setUtilsSettingsStore,
  } from "./utils.js";

  export let currentDay: WEEK_DAYS_SHORTS_TYPE;
  setUtilsCurrentDay(currentDay);

  const { chosenPracticeDays } = getContext<PracticeStores>("stores");
  let daysToRender: Array<WEEK_DAYS_SHORTS_TYPE>;
  let dayToCopy: WEEK_DAYS_SHORTS_TYPE;

  $: daysToRender = $chosenPracticeDays.filter((day) => day !== currentDay);

  setUtilsSettingsStore(getContext<PracticeStores>("stores").settingsStore);
  const mainColor = getContext<string>("mainColor");
  const weekdaysStyles = getContext("weekdaysStyles");
  const weekendsStyles = getContext("weekendsStyles");

  const onDayCopySettingsClick = (chosenDay: WEEK_DAYS_SHORTS_TYPE) => {
    dayToCopy = chosenDay;
    setUtilsDayToCopy(chosenDay);

    modalStore.trigger(
      getConfirmModalSettings({
        backdropColor: mainColor,
        color: mainColor,
        body: `Current day settings will be <i class='px-1 bg-white text-red-700 rounded-md'>overwritten</i><br> by <i class='px-1 mr-1 bg-white text-red-700 rounded-md'>${WEEK_DAYS_SHORT_TO_LONG[dayToCopy]}</i> settings`,
        backdropActionName: "copyPracticeDaySettingsConfirmAnswer",
        response: onDayCopySettingsCallback,
      })
    );
  };
</script>

<div transition:scale>
  <div
    class="cursor-default text-xs bg-white rounded-md mt-2 p-2 text-{mainColor}-500 align-middle"
  >
    Copy settings from day
  </div>
  <div class="my-2 flex flex-wrap justify-center gap-2">
    {#each daysToRender as chosenDay (chosenDay)}
      <button
        animate:flip={{ duration: 300 }}
        on:click={() => onDayCopySettingsClick(chosenDay)}
        class="chip text-white select-none {chosenDay !== 'Sat' &&
        chosenDay !== 'Sun'
          ? weekdaysStyles
          : weekendsStyles}"
      >
        {chosenDay}
      </button>
    {/each}
  </div>
</div>
