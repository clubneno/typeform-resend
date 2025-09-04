import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Modern HTML email templates with colors and logo
const TEMPLATE_A = `
<!DOCTYPE html>
<html lang="lt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registracija patvirtinta</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header with brand colors -->
        <div style="background: linear-gradient(135deg, #70C040 0%, #5BA832 100%); padding: 40px 30px; text-align: center;">
            <div style="background-color: rgba(255, 255, 255, 0.15); border-radius: 12px; padding: 20px; margin: 0 auto 20px; display: inline-block; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                <div style="color: white; font-size: 24px; font-weight: bold; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">MOKSLO SODAS</div>
            </div>
        </div>
        
        <!-- Main content -->
        <div style="padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="background-color: #70C040; border-radius: 50%; width: 60px; height: 60px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 24px; color: white;">✓</span>
                </div>
                <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">Dėkojame už registraciją!</h2>
                <p style="color: #6b7280; margin: 0; font-size: 16px; line-height: 1.6;">Jūsų registracija anglų kalbos kursams sėkmingai gauta</p>
            </div>
            
            <div style="background-color: #f0f9f0; border-radius: 8px; padding: 25px; margin: 30px 0; border-left: 4px solid #70C040;">
                <p style="color: #374151; margin: 0; font-size: 16px; line-height: 1.6;">
                    Jūsų pateikta informacija buvo gauta ir peržiūrima. Netrukus su jumis susisieksime dėl tolesnių žingsnių.
                </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <p style="color: #6b7280; margin: 0 0 20px 0; font-size: 16px;">Šilčiausi linkėjimai ir iki greito susitikimo!</p>
                <div style="background: linear-gradient(135deg, #70C040 0%, #5BA832 100%); border-radius: 8px; padding: 15px; display: inline-block;">
                    <p style="color: white; margin: 0; font-weight: 600; font-size: 16px;">Mokslo sodo komanda</p>

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
