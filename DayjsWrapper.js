import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';
import isBetween from 'dayjs/plugin/isBetween.js';
import 'dayjs/locale/ja.js';

export class DayjsWrapper {
  constructor() {
    // Day.jsの設定諸々
    dayjs.extend(timezone);
    dayjs.extend(utc);
    dayjs.extend(isBetween);
    dayjs.tz.setDefault('Asia/Tokyo');
    dayjs.locale('ja');
  }

  getCurrentDate(format) {
    return dayjs.tz().format(format);
  }

  isBetween(date) {
    return dayjs.tz().isBetween(...date.split(', '), 'year', '[]');
  }
}
