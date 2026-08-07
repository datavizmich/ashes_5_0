import { renderPublicPage } from "./_lib/public-page-render.js";

export async function onRequestGet(context) {
  return renderPublicPage(context, "feedback");
}
