import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';
import isBetween from 'dayjs/plugin/isBetween.js';
import 'dayjs/locale/ja.js';

export class DayjsWrapper {
  #today;

  constructor() {
    // Day.jsの設定諸々
    dayjs.extend(timezone);
    dayjs.extend(utc);
    dayjs.extend(isBetween);
    dayjs.tz.setDefault('Asia/Tokyo');
    dayjs.locale('ja');

    this.#today = dayjs.tz();
  }

  getCurrentDate(format) {
    return this.#today.format(format);
  }

  getWeekdayOrNot() {
    const dayOfWeek = this.#today.day();

    if (dayOfWeek == 0 || dayOfWeek == 6) {
      return 'weekend';
    } else {
      return 'weekday';
    }
  }

  isBetween(start, end) {
    if (!start || !end) return false;

    return this.#today.isBetween(start, end, 'day', '[]');
  }
}
