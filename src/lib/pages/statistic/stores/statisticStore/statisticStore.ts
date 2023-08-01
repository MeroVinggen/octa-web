import type { CustomWritableStore } from '../../../../utils/customStores/CustomWritableStore.js';
import { CustomWritableStoreFactory } from '../../../../utils/customStores/CustomWritableStoreFactory.js';
import type { StatisticStore, Year, YearData } from '../../interfaces/StatisticStore.js';
import { initStatisticStoreListeners } from './statisticStoreUtils.js';

export type StatisticStoreValue = Map<Year, YearData>;

export let statisticStore: CustomWritableStore<StatisticStore> & {
  reInit: typeof reInit;
};

const getInitialStatisticStoreValue = (statisticArr: YearData[]) => {
  const initialStatisticMap: StatisticStoreValue = new Map();

  statisticArr.forEach((yearData) => {
    initialStatisticMap.set(yearData.year, yearData);
  });

  return initialStatisticMap;
};

const reInit = (value: YearData[]) => {
  statisticStore.value = getInitialStatisticStoreValue(value);
};

export const createStatisticStore = (statisticArr: YearData[]) => {
  statisticStore = CustomWritableStoreFactory(getInitialStatisticStoreValue(statisticArr), {
    reInit
  });
  initStatisticStoreListeners();
};
