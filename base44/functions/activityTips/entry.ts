import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { activity_id } = await req.json();
    if (!activity_id) return Response.json({ error: 'activity_id required' }, { status: 400 });

    // user-scoped read: RLS ensures the caller is a parent of this activity
    const activity = await base44.entities.Activity.get(activity_id);
    if (!activity) return Response.json({ error: 'Not found' }, { status: 404 });
    if (activity.tips?.length) return Response.json({ tips: activity.tips });

    const llm = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `פעילות התפתחותית להורה וילד: "${String(activity.title).slice(0, 80)}". תיאור: ${String(activity.description || '').slice(0, 400)}.
תן/י 5 טיפים והמלצות קצרים (משפט עד שניים כל אחד) למה ההורה יכול לעשות עם הילד באותו רגע ובאותה סיטואציה: איך להתחיל, מה לומר, איך להתאים אם הילד מתעניין או מתעייף, ואיך להמשיך ולהעמיק. בעברית, בטון חם ומעשי, ללא אבחנות רפואיות.`,
      response_json_schema: {
        type: 'object',
        properties: { tips: { type: 'array', items: { type: 'string' } } },
        required: ['tips'],
      },
    });
    const tips = (llm.tips || []).slice(0, 6);
    await base44.entities.Activity.update(activity_id, { tips });
    return Response.json({ tips });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}