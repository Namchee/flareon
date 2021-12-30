import { writeDaily } from './main';

addEventListener('scheduled', (event: ScheduledEvent) => {
  event.waitUntil(writeDaily());
});
