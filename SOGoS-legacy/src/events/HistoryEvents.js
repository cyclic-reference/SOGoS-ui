import type {Activity} from "../types/ActivityModels";
import type {DateRange} from "../reducers/HistoryReducer";

export const UPDATED_HISTORY_SELECTION: 'UPDATED_HISTORY_SELECTION' = 'UPDATED_HISTORY_SELECTION';
export const UPDATED_FULL_FEED: 'UPDATED_FULL_FEED' = 'UPDATED_FULL_FEED';
export const INITIALIZED_HISTORY: 'INITIALIZED_HISTORY' = 'INITIALIZED_HISTORY';
export const FOUND_BEFORE_CAPSTONE: 'FOUND_BEFORE_CAPSTONE' = 'FOUND_BEFORE_CAPSTONE';
export const FOUND_AFTER_CAPSTONE: 'FOUND_AFTER_CAPSTONE' = 'FOUND_AFTER_CAPSTONE';
export const UPDATED_CAPSTONES: 'UPDATED_CAPSTONES' = 'UPDATED_CAPSTONES';
export const UPDATED_HISTORY: 'UPDATED_HISTORY' = 'UPDATED_HISTORY';
export const VIEWED_HISTORY: 'VIEWED_HISTORY' = 'VIEWED_HISTORY';
export const ADJUSTED_HISTORY: 'ADJUSTED_HISTORY' = 'ADJUSTED_HISTORY';

export const createViewedHistoryEvent = () => ({
  type: VIEWED_HISTORY,
});

export type ActivityReceptionPayload = {
  activities: Activity[],
  between: DateRange,
}

export type CapstoneActivityUpdatePayload = {
  beforeCapstone: Activity,
  afterCapstone: Activity,
}

export type ActivityUpdatePayload = {
  selection : ActivityReceptionPayload,
  full: ActivityReceptionPayload,
}

export const createInitializedHistoryEvent = (activityUpdate: ActivityUpdatePayload) => ({
  type: INITIALIZED_HISTORY,
  payload: activityUpdate,
});

export const createUpdatedHistoryEvent = (activityUpdate: ActivityUpdatePayload) => ({
  type: UPDATED_HISTORY,
  payload: activityUpdate,
});

export const createFoundBeforeCapstoneEvent = (capstoneActivity: Activity) => ({
  type: FOUND_BEFORE_CAPSTONE,
  payload: capstoneActivity,
});

export const createFoundAfterCapstoneEvent = (capstoneActivity: Activity) => ({
  type: FOUND_AFTER_CAPSTONE,
  payload: capstoneActivity,
});

export const createUpdatedCapstonesEvent = (capstoneActivityUpdatePayload: CapstoneActivityUpdatePayload) => ({
  type: UPDATED_CAPSTONES,
  payload: capstoneActivityUpdatePayload,
});

export const createUpdatedHistorySelectionEvent = (activityUpdate: ActivityReceptionPayload) => ({
  type: UPDATED_HISTORY_SELECTION,
  payload: activityUpdate,
});

export const createUpdatedFullFeedEvent = (activityUpdate: ActivityReceptionPayload) => ({
  type: UPDATED_FULL_FEED,
  payload: activityUpdate,
});

export const createAdjustedHistoryTimeFrame = (from: number, to: number) => ({
  type: ADJUSTED_HISTORY,
  payload: {
    from,
    to
  }
});
