import assert from 'node:assert/strict';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { ensureDailyStoreSchema } from '../functions/_lib/daily-store.js';
import { onRequestGet } from '../functions/api/daily/comparison.js';

test('shared daily results expose only public comparison fields and reject hidden or practice attempts', async () => {
  const sql = new DatabaseSync(':memory:');
  const db = {
    prepare(query) {

      const bound = values => ({
        async all() { return {results: sql.prepare(query).all(...values)}; },
        async first() { return sql.prepare(query).get(...values) ?? null; },
        async run() { return sql.prepare(query).run(...values); },
      });
      return {...bound([]), bind: (...values) => bound(values)};
    },
    async batch(statements) { return Promise.all(statements.map(statement => statement.run())); },
  };
  sql.exec('CREATE TABLE players (id TEXT PRIMARY KEY)');
  await ensureDailyStoreSchema(db);
  for (const [id, mode, hidden, complete] of [['public','ranked',0,1],['practice','practice',0,1],['hidden','ranked',1,1],['unfinished','ranked',0,0]]) {
    sql.prepare(`INSERT INTO daily_attempts (id,challenge_id,participant_id,attempt_mode,submission_key,display_name,
      draft_complete,simulation_complete,hidden_from_public,result_json,created_at,updated_at,completed_at)
      VALUES (?, 'daily-ashes-2026-11-14', ?, ?, ?, 'Alice', 1, ?, ?, ?, '2026-11-14', '2026-11-14','2026-11-14')`)
      .run(id, `secret-participant-${id}`, mode, `submission-${id}`, complete, hidden,
        JSON.stringify({matches:[{result:'loss',summary:'Lost by 5 runs'}],secret:'PRIVATE LINEUP'}));
  }
  const get = id => onRequestGet({request:new Request(`https://ashes-5-0.co.uk/api/daily/comparison?id=${id}`),env:{DB:db}});
  const response = await get('public');
  assert.equal(response.status,200);
  const payload = await response.json();
  assert.deepEqual(Object.keys(payload.comparison).sort(), ['attemptId','competition','date','displayName','margin','rank'].sort());
  assert.equal(payload.comparison.margin,'Lost by 5 runs');
  assert.ok(!JSON.stringify(payload).includes('secret'));
  for (const id of ['practice','hidden','unfinished','missing']) assert.equal((await get(id)).status,404);
  assert.equal((await get('!')).status,400);
  sql.close();
});
