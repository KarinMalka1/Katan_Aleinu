import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const DOMAINS = ['language', 'motor', 'social', 'emotional', 'cognitive', 'creativity'];
const PLACES: Record<string, string> = {
  'home.diaper': 'בבית, בזמן החתלה והחלפת חיתול', 'home.play': 'בבית, במשחק עם צעצוע', 'home.eat': 'בבית, בזמן אכילה', 'home.dress': 'בבית, בזמן התלבשות ולבוש', 'home.bath': 'בבית, בזמן רחצה', 'home.story': 'בבית, בזמן הקראת סיפור',
  'kitchen.cook': 'במטבח, בישול ביחד', 'kitchen.meal': 'במטבח, בזמן ארוחה', 'kitchen.clean': 'במטבח, סידור ושטיפה',
  'park.playground': 'בפארק, במתקני המשחקים', 'park.nature': 'בפארק, בטבע ובהליכה', 'park.ball': 'בפארק, במשחקי כדור',
  'market.cart': 'בסופר, בזמן ישיבה בעגלה', 'market.choose': 'בסופר, בבחירת מוצרים', 'market.checkout': 'בסופר, בהמתנה בתור לקופה',
  'car.short': 'באוטו, בנסיעה קצרה', 'car.long': 'באוטו, בנסיעה ארוכה', 'car.buckle': 'באוטו, בעלייה וחגירה',
};

const FIXED: Record<string, string[]> = {
  'home.bath': ['שיום איברי גוף', 'שימוש בחושים וקצף', 'משחק של קצף ותיפוף על המים'],
};

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { child_id, place } = await req.json();
    if (!child_id || !PLACES[place]) return Response.json({ error: 'bad input' }, { status: 400 });

    // user-scoped read: RLS ensures the caller is a parent of this child
    const child = await base44.entities.Child.get(child_id);
    if (!child) return Response.json({ error: 'Not found' }, { status: 404 });

    const existing = await base44.entities.Activity.filter({ child_id, place }, { limit: 50 });
    if ((existing.items || []).length) return Response.json({ created: 0 });

    const ageMonths = Math.max(0, Math.min(84, Math.floor((Date.now() - new Date(child.birth_date).getTime()) / (30.44 * 24 * 3600 * 1000))));
    const profile = [
      child.development_notes,
      child.challenge && `אתגר מרכזי: ${child.challenge}`,
      child.child_interests?.length && `תחומי עניין: ${child.child_interests.join(', ')}`,
      child.priorities?.length && `תחומי עדיפות: ${child.priorities.join(', ')}`,
    ].filter(Boolean).join('. ').slice(0, 800);

    const llm = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `את/ה יועץ/ת התפתחות הילד המסתמך/ת על מחקר מוכר (AAP, CDC, WHO).
ילד/ה: ${String(child.name).slice(0, 40)}, גיל ${ageMonths} חודשים. פרופיל: ${profile || 'אין מידע נוסף'}.
${FIXED[place]
  ? `כתוב/י בדיוק ${FIXED[place].length} פעילויות להורה לעשות עם הילד/ה ${PLACES[place]}, לפי הנושאים האלה בסדר הזה: ${FIXED[place].map((t, i) => `${i + 1}. ${t}`).join(' ')}. התאם/י לגיל ולשלב ההתפתחותי, בטוחות וללא ציוד מיוחד. נסח/י בשפה פשוטה ויומיומית שכל הורה מבין, בצורה משחקית וחיננית, עם דוגמאות למה להגיד ולעשות (למשל שירים או קולות), בלי מונחים מקצועיים.`
  : `הצע/י 4 רעיונות קצרים וברי ביצוע להורה לעשות עם הילד/ה ${PLACES[place]}, בדיוק לפי הגיל והשלב ההתפתחותי, בטוחים וללא ציוד מיוחד.`}
domain חייב להיות אחד מ: ${DOMAINS.join(', ')}. בעברית, בטון חם, ללא אבחנות רפואיות.
לכל רעיון image_prompt באנגלית: תיאור תמונה חמה ופשוטה בסגנון איור ידידותי.`,
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
                why: { type: 'string' },
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

    const list = (llm.activities || []).slice(0, FIXED[place]?.length || 4);
    const images = await Promise.allSettled(
      list.map((a) => base44.asServiceRole.integrations.Core.GenerateImage({
        prompt: `${String(a.image_prompt).slice(0, 300)}. Elegant minimalist one-line continuous line art illustration, single thin dark green (#467c61) stroke on a plain warm off-white (#faf6ee) background, lots of empty space, calm and simple, no fill, no shading, no text.`,
      }))
    );
    const parent_emails = child.parent_emails || [user.email];
    const records = list.map((a, i) => ({
      child_id,
      place,
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