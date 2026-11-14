import assert from 'node:assert/strict';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { loadDailyProgress } from '../functions/_lib/daily-progress.js';
import { buildDailyResultsLeaderboard } from '../site/shared/daily-ashes.js';
import { recentDailyDays, nextDailyResetText } from '../site/shared/daily-progress.js';

function database() {
  const sql = new DatabaseSync(':memory:');
  sql.exec(`CREATE TABLE daily_attempts (participant_id TEXT, display_name TEXT, completed_at TEXT,
    challenge_id TEXT, attempt_mode TEXT, simulation_complete INTEGER, hidden_from_public INTEGER)`);
  return {sql, prepare(query) {
    return {bind(...values) {return {async all() {return {results: sql.prepare(query).all(...values)};}};}};
  }};
}

test('streak podium counts consecutive UTC days across formats, excludes practice, hidden and late games', async () => {
  const db = database();
  const add = (participant, day, format = 'ashes', options = {}) => db.sql.prepare('INSERT INTO daily_attempts VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(participant, options.name ?? participant, `${options.completedDay ?? day}T12:00:00Z`, `daily-${format}-${day}`, options.mode ?? 'ranked', options.complete ?? 1, options.hidden ?? 0);
  for (const day of ['2026-11-10', '2026-11-11', '2026-11-12']) add('alice', day);
  add('alice', '2026-11-12', 'worldcup');
  add('alice', '2026-11-13', 'ashes', {mode: 'practice'});
  add('alice', '2026-11-14', 'ashes', {hidden: 1});
  add('bob', '2026-11-12'); add('bob', '2026-11-13', 'worldcup');
  add('bob', '2026-11-14', 'ashes', {complete: 0});
  add('carol', '2026-11-14');
  add('late', '2026-11-10', 'ashes', {completedDay: '2026-11-14'});
  add('future', '2026-11-15');
  const result = await loadDailyProgress(db, 'bob', '2026-11-14');
  assert.deepEqual(result.topStreaks.map(entry => [entry.displayName, entry.days]), [['alice', 3], ['bob', 2], ['carol', 1]]);
  assert.equal(result.personal.current, 2); // Yesterday's streak remains alive.
  assert.equal(result.personal.gamesPlayed, 2);
  assert.equal(result.personal.best, 2);
  assert.ok(!JSON.stringify(result.topStreaks).includes('participant'));
  const expired = await loadDailyProgress(db, 'bob', '2026-11-15');
  assert.equal(expired.personal.current, 0);
  assert.equal(expired.personal.best, 2);
  db.sql.close();
});

test('all finishers are ranked, including the current player below the podium', () => {
  const make = (id, summary, result, extras = {}) => ({id, displayName: id, simulationComplete: true,
    attemptMode: 'ranked', result: {matches: [{summary, result}]}, ...extras});
  const attempts = [
    make('loss-big', 'Lost by 80 runs', 'loss'), make('draw', 'Match drawn', 'draw'),
    make('loss-small', 'Lost by 4 runs', 'loss'), make('wicket-loss', 'Lost by 1 wicket', 'loss'),
    make('innings-win', 'Won by an innings and 1 run', 'win'), make('wicket-win', 'Won by 2 wickets', 'win'),
    make('run-win', 'Won by 40 runs', 'win'), make('practice', 'Won by 100 runs', 'win', {attemptMode: 'practice'}),
    make('hidden', 'Won by 100 runs', 'win', {hiddenFromPublic: true}),
  ];
  const board = buildDailyResultsLeaderboard(attempts, 'loss-small');
  assert.equal(board.entries.length, 7);
  assert.equal(board.totalWinners, 3);
  assert.deepEqual(board.entries.map(entry => entry.attemptId), ['innings-win', 'wicket-win', 'run-win', 'draw', 'loss-small', 'loss-big', 'wicket-loss']);
  assert.equal(board.entries.find(entry => entry.isCurrentUser).rank, 5);
});

test('calendar spans month boundaries and reset countdown uses UTC', () => {
  const days = recentDailyDays({ashes: ['2026-10-31'], worldcup: ['2026-11-01']}, '2026-11-02');
  assert.equal(days.length, 7);
  assert.equal(days[0].date, '2026-10-27');
  assert.equal(days.filter(day => day.completed).length, 2);
  assert.match(nextDailyResetText(new Date('2026-11-14T23:30:00Z')), /0h 30m/);
});
