import * as fs from 'fs/promises';
import { WebhookClient, MessageEmbed } from 'discord.js';
import { DayjsWrapper } from './DayjsWrapper.js';

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const JSON_PATH = './opening-hours.json';

const dayjs = new DayjsWrapper();

// JSONからデータ整形
const getOpeningHours = async () => {
  const json = JSON.parse(await fs.readFile(JSON_PATH, { encoding: 'utf8' }));

  for (const key in json) {
    const [start, end] = key.split(', ');

    if (!end || dayjs.isBetween(start, end)) {
      return [
        {
          name: '食堂',
          value: json[key].restaurant,
        },
        {
          name: '喫茶',
          value: json[key].cafeteria,
        },
        {
          name: '売店',
          value: json[key].shop,
        },
      ];
    }
  }

  return [
    {
      name: 'エラー',
      value: 'データが見つかりません',
    },
  ];
};

// ここから下はdiscord.js
{
  const webhookUrl = new URL(DISCORD_WEBHOOK_URL).pathname.split('/');
  const [id, token] = webhookUrl.slice(3);
  const client = new WebhookClient(id, token);

  const embed = new MessageEmbed({
    title: `福利施設 - ${dayjs.getCurrentDate('M月DD日(dd)')}`,
    color: 0xff0000,
    fields: await getOpeningHours(),
  });

  client.send(embed);
  client.destroy();
}
