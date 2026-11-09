import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";

const HERO = "https://media.base44.com/images/public/6ad9ecd76c94f1606afce9c4/bdbcecdea_generated_image.png";
const SPROUT = "https://media.base44.com/images/public/6ad9ecd76c94f1606afce9c4/af6e7d5f9_generated_image.png";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <span className="font-heading text-2xl font-bold text-primary">קטן עלינו</span>
        <Button asChild variant="ghost"><Link to="/login">התחברות</Link></Button>
      </header>
      <main className="mx-auto grid max-w-5xl items-center gap-8 px-6 pb-16 pt-6 md:grid-cols-2 md:pt-12">
        <div className="space-y-6 text-center md:text-start">
          <h1 className="font-heading text-4xl font-bold leading-tight md:text-5xl">רגעים קטנים, התפתחות גדולה</h1>
          <p className="text-lg text-muted-foreground">רעיונות פשוטים לפעילות עם הילד שלכם, בכל רגע ביום, בפחות מ־30 שניות ובלי להתאמץ.</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
            <Button asChild className="h-12 rounded-2xl px-8 text-base"><Link to="/register">הרשמה</Link></Button>
            <Button asChild variant="outline" className="h-12 rounded-2xl px-8 text-base"><Link to="/login">כבר יש לי חשבון</Link></Button>
          </div>
        </div>
        <Image src={HERO} alt="הורה וילד משחקים יחד" fittingType="fit" className="mx-auto aspect-square w-full max-w-md rounded-3xl" />
      </main>
      <section className="bg-secondary py-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 text-center">
          <Image src={SPROUT} alt="נבט קטן" fittingType="fit" className="h-40 w-40 rounded-3xl" />
          <h2 className="font-heading text-2xl font-bold">מתחילים לצמוח ביחד</h2>
          <p className="text-muted-foreground">מצטרפים בכמה שניות ומקבלים רעיונות מותאמים לגיל ולרגע.</p>
          <Button asChild className="h-12 rounded-2xl px-8 text-base"><Link to="/register">מתחילים עכשיו</Link></Button>
        </div>
      </section>
    </div>
  );
}