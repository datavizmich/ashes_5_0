import assert from "node:assert/strict";
import test from "node:test";
import { dailyHistoryStats, readDailyHistory, recordDailyCompletion } from "../site/shared/daily-history.js";
const storage = () => { let value = null; return {getItem: () => value, setItem: (_, next) => {value = next;}}; };

test("completing both formats or replaying a response counts the date once", () => {
  const store = storage();
  for (const competition of ["ashes", "worldcup", "ashes"]) recordDailyCompletion({competition,date:"2026-10-02",attemptMode:"ranked",simulationComplete:true},store);
  assert.deepEqual(dailyHistoryStats(readDailyHistory(store),"2026-10-02"), {current:1,best:1,daysPlayed:1});
});
test("a yesterday streak survives until the current day ends", () => {
  const history = {ashes:["2026-09-30","2026-10-01"],worldcup:[]};
  assert.equal(dailyHistoryStats(history,"2026-10-02").current,2);
  assert.equal(dailyHistoryStats(history,"2026-10-03").current,0);
  assert.equal(dailyHistoryStats(history,"2026-10-03").best,2);
});
test("practice and incomplete attempts cannot extend the streak", () => {
  const store=storage();
  recordDailyCompletion({competition:"ashes",date:"2026-10-02",attemptMode:"practice",simulationComplete:true},store);
  recordDailyCompletion({competition:"ashes",date:"2026-10-02",attemptMode:"ranked",simulationComplete:false},store);
  assert.equal(dailyHistoryStats(readDailyHistory(store),"2026-10-02").daysPlayed,0);
});
test("invalid dates and future dates cannot inflate the visible streak", () => {
  assert.deepEqual(dailyHistoryStats({ashes:["2026-02-30","2026-10-02","2099-01-01"],worldcup:[]},"2026-10-02"),{current:1,best:1,daysPlayed:1});
});
test("corrupt or unavailable browser storage does not break play", () => {
  assert.deepEqual(readDailyHistory({getItem:()=>"oops"}),{ashes:[],worldcup:[]});
  const blocked={getItem(){throw Error("blocked")},setItem(){throw Error("blocked")}};
  assert.doesNotThrow(()=>recordDailyCompletion({competition:"ashes",date:"2026-10-02",attemptMode:"ranked",simulationComplete:true},blocked));
});
