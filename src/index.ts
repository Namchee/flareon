import { writeDaily } from './main';

addEventListener('scheduled', event => {
  event.waitUntil(writeDaily());
});
