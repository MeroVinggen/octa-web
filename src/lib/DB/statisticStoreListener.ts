import type { StatisticStoreValues, Year } from '../pages/statistic/interfaces/StatisticStore.js';
import { statisticUpdateStore } from '../pages/statistic/stores/statisticUpdateStore.js';
import { updateStatistic } from './utils.js';

const statisticStoreListener = (yearData: StatisticStoreValues) => {
  updateStatistic(yearData);
};

export const initDBStatisticStoreListener = () => {
  statisticUpdateStore.subscribe(statisticStoreListener);
};
