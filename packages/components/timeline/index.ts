import { withInstall, withNoopInstall } from '@lemon-peel/utils';
import Timeline from './src/Timeline';
import TimelineItem from './src/TimelineItem.vue';

export const LpTimeline = withInstall(Timeline, {
  TimelineItem,
});
export default LpTimeline;
export const LpTimelineItem = withNoopInstall(TimelineItem);

export * from './src/Timeline';
export * from './src/timelineItem';
