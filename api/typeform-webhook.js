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
  console.log("Method:", req.method);
  console.log("Headers:", JSON.stringify(req.headers, null, 2));

  // Accept POST (optionally allow GET to show 'alive' message)
  if (req.method !== "POST") {
    return res.status(200).json({ ok: true, message: "Webhook alive (send POST from Typeform)" });
  }

  const payload = req.body;
  console.log("Body:", JSON.stringify(payload, null, 2));

  // Check if RESEND_API_KEY is set
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY environment variable is not set!");
    return res.status(500).json({ 
      error: "RESEND_API_KEY not configured", 
      received: true 
    });
  }

  try {
    // 1) Extract recipient email
    const email =
      payload?.form_response?.hidden?.email ||
      payload?.form_response?.answers?.find((a) => a.type === "email")?.email ||
      null;

    console.log("Extracted email:", email);

    if (!email) {
      console.warn("No email in payload; skipping email send.");
      console.log("Available fields:", Object.keys(payload?.form_response || {}));
      console.log("Answers:", payload?.form_response?.answers?.map(a => ({ type: a.type, field: a.field?.id })));
      return res.status(200).json({ received: true, email: null, debug: "No email found in payload" });
    }

    // 2) Determine template (based on first multiple_choice)
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

    console.log("Choice answer:", choiceAnswer);
    console.log("Label:", label);

    let htmlBody = TEMPLATE_A;
    const hasSave = /save/.test(label);
    const hasChild = /vaik/.test(label); // covers "Vaiką"
    if (hasSave && hasChild) htmlBody = TEMPLATE_C;
    else if (!hasSave && hasChild) htmlBody = TEMPLATE_B;

    console.log("Using template:", hasSave && hasChild ? "C" : (!hasSave && hasChild ? "B" : "A"));

    // 3) SEND FIRST, then ack — to avoid Vercel freezing the invocation
    let lastErr = null;
    for (const delay of [0, 400, 1000, 2000]) {
      try {
        if (delay) {
          console.log(`Retrying after ${delay}ms delay...`);
          await new Promise((r) => setTimeout(r, delay));
        }
        
        console.log("Attempting to send email...");
        const resp = await resend.emails.send({
          from: "Mokslo Sodas <neatsakyti@mokslosodas.lt>",
          to: email,
          subject: "Registracija patvirtinta",
          html: htmlBody,
          text: "Gavome jūsų atsakymus. Susisieksime netrukus."
        });

        console.log("Resend response:", JSON.stringify(resp, null, 2));

        if (resp?.error) {
          console.error("Resend API error:", resp.error);
          throw resp.error;
        }

        console.info("Resend OK:", resp?.data?.id || null);

        // 4) NOW acknowledge Typeform
        return res.status(200).json({ 
          received: true, 
          email, 
          sent: true, 
          emailId: resp?.data?.id 
        });
      } catch (e) {
        lastErr = e;
        console.warn("Resend attempt failed, will retry...", e?.message || e);
        console.warn("Error details:", JSON.stringify(e, null, 2));
      }
    }

    console.error("Resend failed after retries:", JSON.stringify(lastErr, null, 2));
    // Still ack Typeform to avoid retries; log that email failed
    return res.status(200).json({ 
      received: true, 
      email, 
      sent: false, 
      error: String(lastErr?.message || lastErr) 
    });

  } catch (err) {
    console.error("Unexpected error:", JSON.stringify(err, null, 2));
    // Ack anyway so Typeform doesn't retry endlessly
    return res.status(200).json({ 
      received: true, 
      error: String(err?.message || err) 
    });
  }
}
