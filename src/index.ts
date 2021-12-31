import { writeDailyReport } from './main';

addEventListener('scheduled', (event: ScheduledEvent) => {
  event.waitUntil(writeDailyReport());
});
