import * as fs from 'fs/promises';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import 'dayjs/locale/ja.js';
import { WebhookClient, MessageEmbed } from 'discord.js';

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const JSON_PATH = './opening-hours.json';

// JSONからデータ整形
const getOpeningHours = async (date) => {
  const json = JSON.parse(await fs.readFile(JSON_PATH, { encoding: 'utf8' }));
  const fields = [];

  if (date in json) {
    if ('restaurant' in json[date]) {
      fields.push({
        name: '食堂',
        value: json[date].restaurant,
      });
    }

    if ('cafeteria' in json[date]) {
      fields.push({
        name: '喫茶',
        value: json[date].cafeteria,
      });
    }

    if ('shop' in json[date]) {
      fields.push({
        name: '売店',
        value: json[date].shop,
      });
    }
  } else {
    fields.push({
      name: 'エラー',
      value: 'データが見つかりません',
    });
  }

  return fields;
};

// ここから下はdiscord.js
{
  // Day.jsの設定諸々
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.tz.setDefault('Asia/Tokyo');
  dayjs.locale('ja');

  const webhookUrl = new URL(DISCORD_WEBHOOK_URL).pathname.split('/');
  const [id, token] = webhookUrl.slice(3);
  const client = new WebhookClient(id, token);

  const embed = new MessageEmbed({
    title: `福利施設 - ${dayjs.tz().format('M月DD日(dd)')}`,
    color: 0xff0000,
    fields: await getOpeningHours(dayjs.tz().format('YYYY-MM-DD')),
  });

  client.send(embed);
  client.destroy();
}
