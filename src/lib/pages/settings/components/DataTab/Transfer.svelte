<script lang="ts">
  import { FileDropzone, modalStore } from "@skeletonlabs/skeleton";
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { DBUtilsFacade } from "../../../../DB/DBUtilsFacade.js";
  import {
    initDBAppSettingsStoreListener,
    stopDBAppSettingsStoreListener,
  } from "../../../../DB/storesListeners/appSettingsStoreListener.js";
  import { getConfirmModalSettings } from "../../../../shared/components/ConfirmModal/ConfirmModalUtils.js";
  import {
    closeLoadingDrawer,
    openLoadingDrawer,
  } from "../../../../shared/components/Drawer/loadingDrawer/loadingDrawerUtils.js";
  import { getIconMaskStyes } from "../../../../utils/helpers.js";
  import { wordStore } from "../../../dictionary/stores/wordStore.js";
  import { settingsStore } from "../../../practice/stores/settingsStore.js";
  import { addingNewArrivedYearToStatisticIfNeeded } from "../../../statistic/components/chart/statisticUtils.js";
  import { statisticStore } from "../../../statistic/stores/statisticStore/statisticStore.js";
  import { initIdleTimerCountdown } from "../../modules/idleMode/idleTimerCountdown.js";
  import { activePracticeSettingsStore } from "../../stores/activePractice/activePracticeSettingsStore.js";
  import { basicSettingsStore } from "../../stores/basicSettingsStore.js";
  import { idleModeCountdownStore } from "../../stores/idleModeSettings/idleModeCountdownStore.js";
  import { idleModeStore } from "../../stores/idleModeSettings/idleModeStore.js";
  import { passivePracticeSettingsStore } from "../../stores/passivePractice/passivePracticeSettingsStore.js";
  import {
    transferActionStore,
    transferActionStoreSet,
  } from "../../stores/transferActionStore.js";
  import { exportAppData } from "./DataTab/DataTabUtils.js";
  import FileAngryWhiteIconUrl from "/src/assets/icons/file-angry-white.svg";
  import FileRemoveWhiteIconUrl from "/src/assets/icons/file-remove-white.svg";
  import FileSmileWhiteIconUrl from "/src/assets/icons/file-smile-white.svg";

  const btnCssClasses =
    "btn grow bg-emerald-300 text-emerald-900 rounded-md focus:brightness-110";

  const loadingDrawerSettings = {
    bgBackdropColor: "emerald",
    OctaIconColor: "emerald",
  };

  let isDragEnter = false;
  let inputTag: HTMLInputElement;
  let inputIcon = FileRemoveWhiteIconUrl;
  let inputFileName = "Empty";
  let errFileType = false;
  let importDataDisabled = true;
  let files: FileList;

  const onDragEnter = () => {
    isDragEnter = true;
  };

  const onDragLeave = () => {
    isDragEnter = false;
  };

  const onRemoveImportFile = () => {
    // inputTag could be null if no change event were detected before this code called
    inputTag && (inputTag.value = "");
    inputIcon = FileRemoveWhiteIconUrl;
    inputFileName = "Empty";
    errFileType = false;
    importDataDisabled = true;
  };

  const onNewImportFile = () => {
    const [fileName, fileType] = files[0].name.split(".");
    inputFileName =
      fileName.length > 10
        ? fileName.slice(0, 10) + `... .${fileType}`
        : files[0].name;

    if (fileType !== "octa") {
      errFileType = true;
      importDataDisabled = true;
      inputIcon = FileAngryWhiteIconUrl;
    } else {
      errFileType = false;
      importDataDisabled = false;
      inputIcon = FileSmileWhiteIconUrl;
    }
  };

  const onFileDropzoneChange = (e: Event) => {
    // getting input tag ref, no bind available on comp so far
    inputTag = e.target as HTMLInputElement;

    if (files.length !== 0) {
      onNewImportFile();
    }
  };

  export const onImportDataModalResponse = async (result: boolean | null) => {
    // skip false answer and null (on store reset after answer)
    if (!result) {
      return;
    }

    openLoadingDrawer(loadingDrawerSettings);
    await DBUtilsFacade.importAppDBData(files[0]);
    // app settings update will be listened with DB and rewrite it's data before other stores will get it
    stopDBAppSettingsStoreListener();
    await wordStore.reInitFromDB();
    await settingsStore.reInitFromDB();
    await passivePracticeSettingsStore.reInitFromDB();
    await activePracticeSettingsStore.reInitFromDB();
    await basicSettingsStore.reInitFromDB();
    // appSettingsStore is derived from 3 stores above, so it will reinit automatically
    await statisticStore.reInitFromDB();

    const statisticData = [...get(statisticStore).values()];
    await addingNewArrivedYearToStatisticIfNeeded(statisticData);
    statisticStore.reInit(statisticData);

    const { timerValue } = await idleModeStore.reInitFromDB();
    idleModeCountdownStore.set(timerValue);
    initIdleTimerCountdown(timerValue);

    initDBAppSettingsStoreListener();
    onRemoveImportFile();

    // in desktop close drawer on desktopDB ready by ipc signal at channel `importDBDataFinished`
    if (import.meta.env.VITE_BUILD_PLATFORM === "web") {
      closeLoadingDrawer();
    } else {
      // mock answer for `DEV` in `desktop`
      if (import.meta.env.DEV) {
        closeLoadingDrawer();
      }
    }
  };

  const onExportAppData = async () => {
    openLoadingDrawer(loadingDrawerSettings);
    await exportAppData();
    closeLoadingDrawer();
  };

  const onImportButtonClick = () => {
    modalStore.trigger(
      getConfirmModalSettings({
        backdropColor: "emerald",
        body: "Import data from file will <i class='text-red-300 bg-white px-1 rounded-md'>delete</i> all existing ones!",
        color: "emerald",
        backdropActionName: "transferImportConfirmAnswer",
        response: transferActionStoreSet,
      }),
    );
  };

  onMount(() => transferActionStore.subscribe(onImportDataModalResponse));
</script>

<div
  class="max-w-lg p-2 border-2 rounded-md bg-emerald-200 bg-opacity-50 text-emerald-900"
>
  <div
    class="w-full border-emerald-400 border-2 rounded-md p-2 cursor-default select-none"
  >
    Transfer
  </div>
  <div class="flex gap-2 mt-2">
    <FileDropzone
      name="importData"
      rounded="rounded-md"
      class="{isDragEnter && 'bg-emerald-300'} {!importDataDisabled &&
        'bg-emerald-200'}"
      bind:files
      on:change={onFileDropzoneChange}
      on:dragenter={onDragEnter}
      on:dragleave={onDragLeave}
      on:drop={onDragLeave}
      accept=".octa"
    >
      <svelte:fragment slot="lead">
        <div
          class={`h-10 w-10 m-auto ${
            errFileType ? "bg-red-400" : "bg-emerald-400"
          }`}
          style={getIconMaskStyes(inputIcon)}
        />
        <div>{inputFileName}</div>
      </svelte:fragment>
      <svelte:fragment slot="message"
        >Choose a file | drag & drop</svelte:fragment
      >
      <svelte:fragment slot="meta">
        <div class:animate-pulse={errFileType} class:text-red-700={errFileType}>
          only OCTA files allowed
        </div>
      </svelte:fragment>
    </FileDropzone>
    <div class="flex flex-col gap-2 w-1/2">
      <button on:click={onRemoveImportFile} class={btnCssClasses}>
        Remove chosen file
      </button>
      <button
        on:click={onImportButtonClick}
        disabled={importDataDisabled}
        class={btnCssClasses}
      >
        Import app data
      </button>
      <button class={btnCssClasses} on:click={onExportAppData}>
        Export app data
      </button>
    </div>
  </div>
</div>
