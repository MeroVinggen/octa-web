import { CustomWritableStoreWithoutInitialCallFactory } from '../../../utils/customStores/CustomWritableStoreWithoutInitialCallFactory.js';

export type PracticeActionStoreActions = 'successful' | 'unsuccessful';

/**
 * broadcast last action in practice (such as: PracticeActionStoreActions type)
 */
export const practiceActionStore = CustomWritableStoreWithoutInitialCallFactory<PracticeActionStoreActions>();
