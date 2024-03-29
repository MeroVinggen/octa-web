import { modalStore, toastStore } from '@skeletonlabs/skeleton';
import OctaIConURL from '../../assets/icons/octopus-white.svg';
import type { TimeFrame } from '../pages/statistic/interfaces/TimeFrame.js';
import { InputHardHandler, type ConstructorParams } from './inputHardHandler.js';

/* --------------------------------- general -------------------------------- */

export const random = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);

export const randomFromArr = <T>(arr: readonly T[]) => arr[random(0, arr.length)];

export const openAddWordModal = () => {
  modalStore.trigger({
    type: "component",
    component: "addWord",
    backdropClasses: "!bg-cyan-200 !bg-opacity-50 backdrop-blur-sm cursor-pointer !z-40" + (import.meta.env.VITE_BUILD_PLATFORM === "desktop" && " h-[calc(100vh-24px)] bottom-0 top-auto"),
  });
};

export const openEditWordModal = () => {
  modalStore.trigger({
    type: "component",
    component: "editWord",
    backdropClasses:
      "!bg-purple-200 !bg-opacity-50 backdrop-blur-sm cursor-pointer !z-40" +
      (import.meta.env.VITE_BUILD_PLATFORM === "desktop" &&
        " h-[calc(100vh-24px)] bottom-0 top-auto"),
  });
};

export const createDebounce = (callback: (...params: unknown[]) => unknown, timeout: number) => {
  let timerID: NodeJS.Timeout;
  return (...params: unknown[]) => {
    clearTimeout(timerID);
    timerID = setTimeout(callback, timeout, ...params);
  };
};

const TOAST_OCTA_ICON = `<img class='h-8' src='${OctaIConURL}' alt='octa icon'/>`;

const TOAST_STYLES = "break-all text-white cursor-default !rounded-md [&_.text-base]:flex [&_.text-base]:gap-4 [&_.text-base]:items-center";

export const ERR_TOAST_STYLES = "break-all bg-red-400 text-white cursor-default !rounded-md [&_.text-base]:flex [&_.text-base]:gap-4 [&_.text-base]:items-center";

export const WARN_TOAST_STYLES = "break-all bg-yellow-500 text-white cursor-default !rounded-md [&_.text-base]:flex [&_.text-base]:gap-4 [&_.text-base]:items-center";

export const getIconMaskStyes = (iconSrc: string) => {
  return `-webkit-mask: url(${iconSrc}) no-repeat center / contain; mask: url(${iconSrc}) no-repeat center / contain;`;
};

/**
 * shuffle data to new array (not deep copy)
 */
export const shuffle = <T = unknown>(data: T[] | IterableIterator<T>) => [...data].sort(() => Math.random() - 0.5);

export function* createIteratorFromArr<T = unknown>(arr: T[]) {
  const length = arr.length;
  for (let curItemIndex = 0; curItemIndex < length; curItemIndex += 1) {
    yield arr[curItemIndex];
  }
};

export const inputHardHandlerCreator = (params: ConstructorParams) => new InputHardHandler(params);

export const getLearnSuccessPassiveStyles = (learnSuccess: number = 0) => {
  if (learnSuccess === 0) {
    return "bg-slate-400";
  } else if (learnSuccess < 40) {
    return "bg-orange-400";
  } else if (learnSuccess < 75) {
    return "bg-amber-400";
  } else {
    return "bg-green-400";
  }
};

export const getLearnSuccessActiveStyles = (learnSuccess: number) => {
  if (learnSuccess === 0) {
    return "bg-slate-300 hover:bg-slate-400 focus:bg-slate-400";
  } else if (learnSuccess < 40) {
    return "bg-orange-300 hover:bg-orange-400 focus:bg-orange-400";
  } else if (learnSuccess < 75) {
    return "bg-amber-300 hover:bg-amber-400 focus:bg-amber-400";
  } else {
    return "bg-green-300 hover:bg-green-400 focus:bg-green-400";
  }
};

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
] as const;

export const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const WEEK_DAYS_SHORT_TO_LONG = {
  "Mon": "Monday",
  "Tue": "Tuesday",
  "Wed": "Wednesday",
  "Thu": "Thursday",
  "Fri": "Friday",
  "Sat": "Saturday",
  "Sun": "Sunday",
} as const;

export type WEEK_DAYS_SHORTS_TYPE = typeof WEEK_DAYS_SHORTS[number];

export const WEEK_DAYS_SHORTS = WEEK_DAYS.map((day) =>
  day.slice(0, 3)) as [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];

const WEEK_DAYS_SHORTS_INDEXES = {
  "Sun": 0,
  "Mon": 1,
  "Tue": 2,
  "Wed": 3,
  "Thu": 4,
  "Fri": 5,
  "Sat": 6,
};

export const sortShortWeekDays = (arr: Array<WEEK_DAYS_SHORTS_TYPE>) => {
  arr.sort((day1, day2) => {
    return WEEK_DAYS_SHORTS_INDEXES[day1] - WEEK_DAYS_SHORTS_INDEXES[day2];
  });
};

/**
 * removes all entries of passed data in array
 */
export const deleteAllInArray = (arr: unknown[], data: unknown) => {
  let lastIndex = arr.indexOf(data);
  while (lastIndex !== -1) {
    arr.splice(lastIndex, 1);
    lastIndex = arr.indexOf(data, lastIndex + 1);
  }
};

export const sortTimeFrames = (arr: TimeFrame[]) => {
  arr.sort(({ from: from1 }, { from: from2 }) => Number(from1.replace(":", "")) - Number(from2.replace(":", "")));
};

/* --------------------------- Esc keyboard button -------------------------- */

const preventEscButton = (e: KeyboardEvent) => {
  if (e.code === "Escape") {
    e.stopPropagation();
  }
};

export const enablePreventEscButton = () => {
  document.addEventListener("keydown", preventEscButton);
};

export const disablePreventEscButton = () => {
  document.removeEventListener("keydown", preventEscButton);
};

/* -------------------------- standard context menu ------------------------- */

const preventStandardContextMenu = (e: Event) => {
  e.preventDefault();
};

export const disableStandardContextMenu = () => {
  document.addEventListener("contextmenu", preventStandardContextMenu);
};

export const showToast = (msg: string, cssClasses?: string, timeout?: number) => {
  toastStore.trigger({
    message: TOAST_OCTA_ICON + `<div>${msg}</div>`,
    background: `${TOAST_STYLES} ${cssClasses}`,
    timeout,
  });
};

/* -------------------------------------------------------------------------- */
/*                            global error handling                           */
/* -------------------------------------------------------------------------- */

const showErrorToast = (errMsg: string) => {
  toastStore.trigger({
    message: TOAST_OCTA_ICON + `<div>${errMsg}</div>`,
    background: ERR_TOAST_STYLES,
    autohide: false
  });
};

export const showWarnToast = (warnMsg: string) => {
  toastStore.trigger({
    message: TOAST_OCTA_ICON + `<div>${warnMsg}</div>`,
    background: WARN_TOAST_STYLES,
  });
};

const onGlobalError = async (errMsg: string | Event) => {
  showErrorToast("UnexpectedException: " + errMsg as string);

  if (import.meta.env.VITE_BUILD_PLATFORM === "desktop") {
    (await import("../shared/desktopAppBuild/ipcUtils.js")).sendToIpcMain("mainWinErr", errMsg);
  }
};

const onGlobalUnhandledrejection = async ({ reason }: PromiseRejectionEvent) => {
  const errMsg = `Unhandledrejection: ${reason}`;

  showErrorToast(errMsg);

  if (import.meta.env.VITE_BUILD_PLATFORM === "desktop") {
    (await import("../shared/desktopAppBuild/ipcUtils.js")).sendToIpcMain("mainWinErr", errMsg);
  }
};

export const enableWindowErrCatcher = () => {
  window.onerror = onGlobalError;
  window.onunhandledrejection = onGlobalUnhandledrejection;
};

export const checkElectronApiExist = () => {
  if (window.electron === undefined) {
    throw "electron API is missing in window";
  }
};

export const secondsToHHMMSS = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds % 60).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};
