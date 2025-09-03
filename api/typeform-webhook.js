import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple HTML templates
const TEMPLATE_A = `<h2 style="font-family: 'Open Sans', sans-serif;">Dėkojame už jūsų registraciją anglų kalbos kursams!</h2>
<p style="font-family: 'Open Sans', sans-serif;">Jūsų pateikta informacija - gauta. Šią netrukus peržiūrėsime ir jumis susisieksime.</p>
<p style="font-family: 'Open Sans', sans-serif;">Šilčiausi linkėjimai ir iki greito susitikimo!</p>
<p style="font-family: 'Open Sans', sans-serif;"><br>Mokslo sodo komanda</br></p>`;

const TEMPLATE_B = `<h2 style="font-family: 'Open Sans', sans-serif;">Dėkojame už jūsų vaiko registraciją anglų kalbos kursams!</h2>
<p style="font-family: 'Open Sans', sans-serif;">Jūsų pateikta informacija - gauta. Šią netrukus peržiūrėsime ir jumis susisieksime.</p>
<p style="font-family: 'Open Sans', sans-serif;">Šilčiausi linkėjimai ir iki greito susitikimo!</p>
<p style="font-family: 'Open Sans', sans-serif;"><br>Mokslo sodo komanda</br></p>`;

const TEMPLATE_C = `<h2 style="font-family: 'Open Sans', sans-serif;">Dėkojame už jūsų ir jūsų vaiko registraciją anglų kalbos kursams!</h2>
<p style="font-family: 'Open Sans', sans-serif;">Jūsų pateikta informacija - gauta. Šią netrukus peržiūrėsime ir jumis susisieksime.</p>
<p style="font-family: 'Open Sans', sans-serif;">Šilčiausi linkėjimai ir iki greito susitikimo!</p>
<p style="font-family: 'Open Sans', sans-serif;"><br>Mokslo sodo komanda</br></p>`;

// Vercel Serverless Function (Node.js)
export default async function handler(req, res) {
  console.log("=== New Request ===");
  // Only accept POST (feel free to change to 200 if you want a friendly GET)
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  const payload = req.body;
  console.log("Body:", JSON.stringify(payload, null, 2));

  // 1) ACK Typeform immediately (prevents retries)
  res.status(200).json({ received: true });

  try {
    // 2) Extract recipient email
    const email =
      payload?.form_response?.hidden?.email ||
      payload?.form_response?.answers?.find((a) => a.type === "email")?.email ||
      null;

    if (!email) {
      console.warn("No email in payload; skipping email send.");
      return;
    }

    // 3) Determine which template to use based on the first multiple_choice
    const choiceAnswer = payload?.form_response?.answers?.find(
      (a) => a.field?.id === "N1Gmh4M9xD7J" || a.type === "choice" || a.type === "choices"
    );

    const label = (() => {
      if (!choiceAnswer) return "";
      if (choiceAnswer.type === "choice") return (choiceAnswer.choice?.label || "").toLowerCase();
      if (choiceAnswer.type === "choices") {
        const labels = choiceAnswer.choices?.labels || [];
        return labels.join(" ").toLowerCase();
      }
      return "";
    })();

    let htmlBody = TEMPLATE_A;
    const hasSave = /save/.test(label);
    const hasChild = /vaik/.test(label); // covers "Vaiką"
    if (hasSave && hasChild) htmlBody = TEMPLATE_C;
    else if (!hasSave && hasChild) htmlBody = TEMPLATE_B;

    // 4) Send via Resend (with simple retries for transient network issues)
    let lastErr = null;
    for (const delay of [0, 400, 1000, 2000]) {
      try {
        if (delay) await new Promise((r) => setTimeout(r, delay));
        const resp = await resend.emails.send({
          from: "Mokslo Sodas <neatsakyti@mokslosodas.lt>",
          to: email,
          subject: "Registracija patvirtinta",
          html: htmlBody,
          text: "Gavome jūsų atsakymus. Susisieksime netrukus."
        });

        // Resend SDK v6 returns { data, error }
        if (resp?.error) {
          throw resp.error;
        }

        const id = resp?.data?.id || null;
        console.info("Resend response:", JSON.stringify(resp, null, 2));
        console.info("Resend OK:", id);
        return;
      } catch (e) {
        lastErr = e;
      }
    }
    console.error("Resend failed after retries:", JSON.stringify(lastErr, null, 2));
  } catch (err) {
    console.error("Unexpected error:", JSON.stringify(err, null, 2));
  }
}
