import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const DOMAINS = ['language', 'motor', 'social', 'emotional', 'cognitive', 'creativity'];

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { child_id } = await req.json();
    if (!child_id) return Response.json({ error: 'child_id required' }, { status: 400 });

    // user-scoped read: RLS ensures the caller is a parent of this child
    const child = await base44.entities.Child.get(child_id);
    if (!child) return Response.json({ error: 'Not found' }, { status: 404 });

    const existing = await base44.entities.Activity.filter({ child_id }, { limit: 100 });
    const titles = (existing.items || []).map((a) => a.title);

    const birth = new Date(child.birth_date);
    const ageMonths = Math.max(0, Math.min(84, Math.floor((Date.now() - birth.getTime()) / (30.44 * 24 * 3600 * 1000))));
    const focus = (child.priorities && child.priorities.length ? child.priorities : DOMAINS).filter((d) => DOMAINS.includes(d));

    const profile = [
      child.development_notes,
      child.challenge && `אתגר מרכזי: ${child.challenge}`,
      child.daily_minutes && `זמן פנוי: ${child.daily_minutes}`,
      child.day_type && `מבנה היום: ${child.day_type}`,
      child.routine?.length && `רגעי שגרה מתאימים: ${child.routine.join(', ')}`,
      child.child_interests?.length && `תחומי עניין של הילד: ${child.child_interests.join(', ')}`,
      child.parent_interests?.length && `תחומי עניין של ההורה: ${child.parent_interests.join(', ')}`,
    ].filter(Boolean).join('. ').slice(0, 1200);

    const prompt = `את/ה יועץ/ת התפתחות הילד המסתמך/ת על מחקר מוכר (AAP, CDC, WHO).
ילד/ה: ${String(child.name).slice(0, 40)}, גיל ${ageMonths} חודשים.
פרופיל: ${profile || 'אין מידע נוסף'}.
הצע/י 6 פעילויות התפתחותיות קצרות (עד 10 דקות), בטוחות ומותאמות בדיוק לגיל, ללא ציוד מיוחד.
פזר/י אותן בין התחומים: ${focus.join(', ')} (אפשר לחזור על תחום). domain חייב להיות אחד מ: ${DOMAINS.join(', ')}.
אל תחזור/י על פעילויות אלה: ${titles.slice(0, 40).join(', ') || 'אין'}.
כתוב/י בעברית, בטון חם. אל תתן/י אבחנות רפואיות.
לכל פעילות גם image_prompt באנגלית: תיאור תמונה חמה ופשוטה של הפעילות, בסגנון איור ידידותי.`;

    const llm = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          activities: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string', description: 'כותרת קצרה, עד 4 מילים' },
                description: { type: 'string', description: '2-3 משפטים עם הוראות פשוטות' },
                why: { type: 'string', description: 'משפט אחד: מה זה מפתח' },
                minutes: { type: 'number' },
                domain: { type: 'string' },
                image_prompt: { type: 'string' },
              },
              required: ['title', 'description', 'why', 'domain', 'image_prompt'],
            },
          },
        },
        required: ['activities'],
      },
    });

    const list = (llm.activities || []).slice(0, 6);
    const images = await Promise.allSettled(
      list.map((a) => base44.asServiceRole.integrations.Core.GenerateImage({
        prompt: `${String(a.image_prompt).slice(0, 300)}. Elegant minimalist one-line continuous line art illustration, single thin dark green (#467c61) stroke on a plain warm off-white (#faf6ee) background, lots of empty space, calm and simple, no fill, no shading, no text.`,
      }))
    );

    const parent_emails = child.parent_emails || [user.email];
    const records = list.map((a, i) => ({
      child_id,
      title: a.title,
      description: a.description,
      why: a.why,
      minutes: a.minutes || 5,
      domain: DOMAINS.includes(a.domain) ? a.domain : 'cognitive',
      image_url: images[i].status === 'fulfilled' ? images[i].value?.url : undefined,
      parent_emails,
    }));
    await base44.asServiceRole.entities.Activity.bulkCreate(records);

    return Response.json({ created: records.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}