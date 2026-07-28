import { onRequestPost as __api_daily__id__attempts__attemptId__select_js_onRequestPost } from "/home/mcameron/ashes_5_0/functions/api/daily/[id]/attempts/[attemptId]/select.js"
import { onRequestPost as __api_daily__id__attempts__attemptId__simulate_js_onRequestPost } from "/home/mcameron/ashes_5_0/functions/api/daily/[id]/attempts/[attemptId]/simulate.js"
import { onRequest as __api_daily__id__attempts__attemptId__select_js_onRequest } from "/home/mcameron/ashes_5_0/functions/api/daily/[id]/attempts/[attemptId]/select.js"
import { onRequest as __api_daily__id__attempts__attemptId__simulate_js_onRequest } from "/home/mcameron/ashes_5_0/functions/api/daily/[id]/attempts/[attemptId]/simulate.js"
import { onRequestGet as __api_daily__id__attempts__attemptId__js_onRequestGet } from "/home/mcameron/ashes_5_0/functions/api/daily/[id]/attempts/[attemptId].js"
import { onRequest as __api_daily__id__attempts__attemptId__js_onRequest } from "/home/mcameron/ashes_5_0/functions/api/daily/[id]/attempts/[attemptId].js"
import { onRequestPost as __api_challenges__id__results_js_onRequestPost } from "/home/mcameron/ashes_5_0/functions/api/challenges/[id]/results.js"
import { onRequestPost as __api_daily__id__start_js_onRequestPost } from "/home/mcameron/ashes_5_0/functions/api/daily/[id]/start.js"
import { onRequest as __api_challenges__id__results_js_onRequest } from "/home/mcameron/ashes_5_0/functions/api/challenges/[id]/results.js"
import { onRequest as __api_daily__id__start_js_onRequest } from "/home/mcameron/ashes_5_0/functions/api/daily/[id]/start.js"
import { onRequestGet as __api_daily_current_js_onRequestGet } from "/home/mcameron/ashes_5_0/functions/api/daily/current.js"
import { onRequestGet as __api_leaderboards_players_js_onRequestGet } from "/home/mcameron/ashes_5_0/functions/api/leaderboards/players.js"
import { onRequestPost as __api_teams_solo_js_onRequestPost } from "/home/mcameron/ashes_5_0/functions/api/teams/solo.js"
import { onRequest as __api_daily_current_js_onRequest } from "/home/mcameron/ashes_5_0/functions/api/daily/current.js"
import { onRequest as __api_leaderboards_players_js_onRequest } from "/home/mcameron/ashes_5_0/functions/api/leaderboards/players.js"
import { onRequest as __api_teams_solo_js_onRequest } from "/home/mcameron/ashes_5_0/functions/api/teams/solo.js"
import { onRequestGet as __api_challenges__id__js_onRequestGet } from "/home/mcameron/ashes_5_0/functions/api/challenges/[id].js"
import { onRequestGet as __api_results__id__js_onRequestGet } from "/home/mcameron/ashes_5_0/functions/api/results/[id].js"
import { onRequest as __api_challenges__id__js_onRequest } from "/home/mcameron/ashes_5_0/functions/api/challenges/[id].js"
import { onRequest as __api_results__id__js_onRequest } from "/home/mcameron/ashes_5_0/functions/api/results/[id].js"
import { onRequestPost as __api_challenges_index_js_onRequestPost } from "/home/mcameron/ashes_5_0/functions/api/challenges/index.js"
import { onRequestPost as __api_feedback_js_onRequestPost } from "/home/mcameron/ashes_5_0/functions/api/feedback.js"
import { onRequest as __api_challenges_index_js_onRequest } from "/home/mcameron/ashes_5_0/functions/api/challenges/index.js"
import { onRequest as __api_feedback_js_onRequest } from "/home/mcameron/ashes_5_0/functions/api/feedback.js"
import { onRequestGet as __c__id__js_onRequestGet } from "/home/mcameron/ashes_5_0/functions/c/[id].js"
import { onRequestGet as __r__id__js_onRequestGet } from "/home/mcameron/ashes_5_0/functions/r/[id].js"
import { onRequestGet as __about_js_onRequestGet } from "/home/mcameron/ashes_5_0/functions/about.js"
import { onRequestGet as __ashes_js_onRequestGet } from "/home/mcameron/ashes_5_0/functions/ashes.js"
import { onRequestGet as __challenge_js_onRequestGet } from "/home/mcameron/ashes_5_0/functions/challenge.js"
import { onRequestGet as __daily_js_onRequestGet } from "/home/mcameron/ashes_5_0/functions/daily.js"
import { onRequestGet as __how_to_play_js_onRequestGet } from "/home/mcameron/ashes_5_0/functions/how-to-play.js"
import { onRequestGet as __leaderboard_js_onRequestGet } from "/home/mcameron/ashes_5_0/functions/leaderboard.js"
import { onRequestGet as __world_cup_js_onRequestGet } from "/home/mcameron/ashes_5_0/functions/world-cup.js"
import { onRequestGet as __index_js_onRequestGet } from "/home/mcameron/ashes_5_0/functions/index.js"

export const routes = [
    {
      routePath: "/api/daily/:id/attempts/:attemptId/select",
      mountPath: "/api/daily/:id/attempts/:attemptId",
      method: "POST",
      middlewares: [],
      modules: [__api_daily__id__attempts__attemptId__select_js_onRequestPost],
    },
  {
      routePath: "/api/daily/:id/attempts/:attemptId/simulate",
      mountPath: "/api/daily/:id/attempts/:attemptId",
      method: "POST",
      middlewares: [],
      modules: [__api_daily__id__attempts__attemptId__simulate_js_onRequestPost],
    },
  {
      routePath: "/api/daily/:id/attempts/:attemptId/select",
      mountPath: "/api/daily/:id/attempts/:attemptId",
      method: "",
      middlewares: [],
      modules: [__api_daily__id__attempts__attemptId__select_js_onRequest],
    },
  {
      routePath: "/api/daily/:id/attempts/:attemptId/simulate",
      mountPath: "/api/daily/:id/attempts/:attemptId",
      method: "",
      middlewares: [],
      modules: [__api_daily__id__attempts__attemptId__simulate_js_onRequest],
    },
  {
      routePath: "/api/daily/:id/attempts/:attemptId",
      mountPath: "/api/daily/:id/attempts",
      method: "GET",
      middlewares: [],
      modules: [__api_daily__id__attempts__attemptId__js_onRequestGet],
    },
  {
      routePath: "/api/daily/:id/attempts/:attemptId",
      mountPath: "/api/daily/:id/attempts",
      method: "",
      middlewares: [],
      modules: [__api_daily__id__attempts__attemptId__js_onRequest],
    },
  {
      routePath: "/api/challenges/:id/results",
      mountPath: "/api/challenges/:id",
      method: "POST",
      middlewares: [],
      modules: [__api_challenges__id__results_js_onRequestPost],
    },
  {
      routePath: "/api/daily/:id/start",
      mountPath: "/api/daily/:id",
      method: "POST",
      middlewares: [],
      modules: [__api_daily__id__start_js_onRequestPost],
    },
  {
      routePath: "/api/challenges/:id/results",
      mountPath: "/api/challenges/:id",
      method: "",
      middlewares: [],
      modules: [__api_challenges__id__results_js_onRequest],
    },
  {
      routePath: "/api/daily/:id/start",
      mountPath: "/api/daily/:id",
      method: "",
      middlewares: [],
      modules: [__api_daily__id__start_js_onRequest],
    },
  {
      routePath: "/api/daily/current",
      mountPath: "/api/daily",
      method: "GET",
      middlewares: [],
      modules: [__api_daily_current_js_onRequestGet],
    },
  {
      routePath: "/api/leaderboards/players",
      mountPath: "/api/leaderboards",
      method: "GET",
      middlewares: [],
      modules: [__api_leaderboards_players_js_onRequestGet],
    },
  {
      routePath: "/api/teams/solo",
      mountPath: "/api/teams",
      method: "POST",
      middlewares: [],
      modules: [__api_teams_solo_js_onRequestPost],
    },
  {
      routePath: "/api/daily/current",
      mountPath: "/api/daily",
      method: "",
      middlewares: [],
      modules: [__api_daily_current_js_onRequest],
    },
  {
      routePath: "/api/leaderboards/players",
      mountPath: "/api/leaderboards",
      method: "",
      middlewares: [],
      modules: [__api_leaderboards_players_js_onRequest],
    },
  {
      routePath: "/api/teams/solo",
      mountPath: "/api/teams",
      method: "",
      middlewares: [],
      modules: [__api_teams_solo_js_onRequest],
    },
  {
      routePath: "/api/challenges/:id",
      mountPath: "/api/challenges",
      method: "GET",
      middlewares: [],
      modules: [__api_challenges__id__js_onRequestGet],
    },
  {
      routePath: "/api/results/:id",
      mountPath: "/api/results",
      method: "GET",
      middlewares: [],
      modules: [__api_results__id__js_onRequestGet],
    },
  {
      routePath: "/api/challenges/:id",
      mountPath: "/api/challenges",
      method: "",
      middlewares: [],
      modules: [__api_challenges__id__js_onRequest],
    },
  {
      routePath: "/api/results/:id",
      mountPath: "/api/results",
      method: "",
      middlewares: [],
      modules: [__api_results__id__js_onRequest],
    },
  {
      routePath: "/api/challenges",
      mountPath: "/api/challenges",
      method: "POST",
      middlewares: [],
      modules: [__api_challenges_index_js_onRequestPost],
    },
  {
      routePath: "/api/feedback",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_feedback_js_onRequestPost],
    },
  {
      routePath: "/api/challenges",
      mountPath: "/api/challenges",
      method: "",
      middlewares: [],
      modules: [__api_challenges_index_js_onRequest],
    },
  {
      routePath: "/api/feedback",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_feedback_js_onRequest],
    },
  {
      routePath: "/c/:id",
      mountPath: "/c",
      method: "GET",
      middlewares: [],
      modules: [__c__id__js_onRequestGet],
    },
  {
      routePath: "/r/:id",
      mountPath: "/r",
      method: "GET",
      middlewares: [],
      modules: [__r__id__js_onRequestGet],
    },
  {
      routePath: "/about",
      mountPath: "/",
      method: "GET",
      middlewares: [],
      modules: [__about_js_onRequestGet],
    },
  {
      routePath: "/ashes",
      mountPath: "/",
      method: "GET",
      middlewares: [],
      modules: [__ashes_js_onRequestGet],
    },
  {
      routePath: "/challenge",
      mountPath: "/",
      method: "GET",
      middlewares: [],
      modules: [__challenge_js_onRequestGet],
    },
  {
      routePath: "/daily",
      mountPath: "/",
      method: "GET",
      middlewares: [],
      modules: [__daily_js_onRequestGet],
    },
  {
      routePath: "/how-to-play",
      mountPath: "/",
      method: "GET",
      middlewares: [],
      modules: [__how_to_play_js_onRequestGet],
    },
  {
      routePath: "/leaderboard",
      mountPath: "/",
      method: "GET",
      middlewares: [],
      modules: [__leaderboard_js_onRequestGet],
    },
  {
      routePath: "/world-cup",
      mountPath: "/",
      method: "GET",
      middlewares: [],
      modules: [__world_cup_js_onRequestGet],
    },
  {
      routePath: "/",
      mountPath: "/",
      method: "GET",
      middlewares: [],
      modules: [__index_js_onRequestGet],
    },
  ]