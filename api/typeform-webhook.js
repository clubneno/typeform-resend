import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Modern HTML email templates with colors and logo
const TEMPLATE_A = `<!DOCTYPE html>
<html lang="lt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registracija patvirtinta</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- White header with logo -->
        <div style="background-color: white; padding: 40px 30px; text-align: center; border-bottom: 1px solid #e5e7eb;">
            <img src="https://raw.githubusercontent.com/clubneno/typeform-resend/main/bendras.png" alt="Mokslo Sodas" style="max-width: 140px; height: auto; margin: 0 auto;" />
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
                <p style="color: #70C040; margin: 0; font-weight: 600; font-size: 16px;">Mokslo sodo komanda</p>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">© 2025 UAB Mokslo Sodas. Visos teisės saugomos.</p>
        </div>
    </div>
</body>
</html>`;

const TEMPLATE_B = `<!DOCTYPE html>
<html lang="lt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vaiko registracija patvirtinta</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- White header with logo -->
        <div style="background-color: white; padding: 40px 30px; text-align: center; border-bottom: 1px solid #e5e7eb;">
            <img src="https://raw.githubusercontent.com/clubneno/typeform-resend/main/bendras.png" alt="Mokslo Sodas" style="max-width: 140px; height: auto; margin: 0 auto;" />
        </div>
        
        <!-- Main content -->
        <div style="padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="background-color: #70C040; border-radius: 50%; width: 60px; height: 60px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 24px; color: white;">✓</span>
                </div>
                <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">Dėkojame už vaiko registraciją!</h2>
                <p style="color: #6b7280; margin: 0; font-size: 16px; line-height: 1.6;">Jūsų vaiko registracija anglų kalbos kursams sėkmingai gauta</p>
            </div>
            
            <div style="background-color: #f0f9f0; border-radius: 8px; padding: 25px; margin: 30px 0; border-left: 4px solid #70C040;">
                <p style="color: #374151; margin: 0; font-size: 16px; line-height: 1.6;">
                    Jūsų pateikta informacija buvo gauta ir peržiūrima. Netrukus su jumis susisieksime dėl tolesnių žingsnių anglų kalbos kursuose.
                </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <p style="color: #6b7280; margin: 0 0 20px 0; font-size: 16px;">Šilčiausi linkėjimai ir iki greito susitikimo!</p>
                <p style="color: #70C040; margin: 0; font-weight: 600; font-size: 16px;">Mokslo sodo komanda</p>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">© 2025 UAB Mokslo Sodas. Visos teisės saugomos.</p>
        </div>
    </div>
</body>
</html>`;

const TEMPLATE_C = `<!DOCTYPE html>
<html lang="lt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registracija patvirtinta</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- White header with logo -->
        <div style="background-color: white; padding: 40px 30px; text-align: center; border-bottom: 1px solid #e5e7eb;">
            <img src="https://raw.githubusercontent.com/clubneno/typeform-resend/main/bendras.png" alt="Mokslo Sodas" style="max-width: 140px; height: auto; margin: 0 auto;" />
        </div>
        
        <!-- Main content -->
        <div style="padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="background-color: #70C040; border-radius: 50%; width: 60px; height: 60px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 24px; color: white;">✓</span>
                </div>
                <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">Dėkojame už registraciją!</h2>
                <p style="color: #6b7280; margin: 0; font-size: 16px; line-height: 1.6;">Jūsų ir jūsų vaiko registracija anglų kalbos kursams sėkmingai gauta</p>
            </div>
            
            <div style="background-color: #f0f9f0; border-radius: 8px; padding: 25px; margin: 30px 0; border-left: 4px solid #70C040;">
                <p style="color: #374151; margin: 0; font-size: 16px; line-height: 1.6;">
                    Jūsų pateikta informacija buvo gauta ir peržiūrima. Netrukus su jumis susisieksime dėl tolesnių žingsnių anglų kalbos kursuose.
                </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <p style="color: #6b7280; margin: 0 0 20px 0; font-size: 16px;">Šilčiausi linkėjimai ir iki greito susitikimo!</p>
                <p style="color: #70C040; margin: 0; font-weight: 600; font-size: 16px;">Mokslo sodo komanda</p>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">© 2025 UAB Mokslo Sodas. Visos teisės saugomos.</p>
        </div>
    </div>
</body>
</html>`;

const TEMPLATE_D = `<!DOCTYPE html>
<html lang="lt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registracija patvirtinta</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- White header with logo -->
        <div style="background-color: white; padding: 40px 30px; text-align: center; border-bottom: 1px solid #e5e7eb;">
            <img src="https://raw.githubusercontent.com/clubneno/typeform-resend/main/bendras.png" alt="Mokslo Sodas" style="max-width: 140px; height: auto; margin: 0 auto;" />
        </div>
        
        <!-- Main content -->
        <div style="padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="background-color: #70C040; border-radius: 50%; width: 60px; height: 60px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 24px; color: white;">✓</span>
                </div>
                <h2 style="color: #1f2937; margin: 0 0 15px 0; font-size: 24px; font-weight: 600;">Dėkojame!</h2>
                <p style="color: #6b7280; margin: 0; font-size: 16px; line-height: 1.6;">Vienas iš jūsų tėvų užregistravo jus į anglų kalbos kursus</p>
            </div>
            
            <div style="background-color: #f0f9f0; border-radius: 8px; padding: 25px; margin: 30px 0; border-left: 4px solid #70C040;">
                <p style="color: #374151; margin: 0; font-size: 16px; line-height: 1.6;">
                    Jūsų registracija anglų kalbos kursams buvo gauta. Netrukus su jumis susisieksime dėl tolesnių žingsnių.
                </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <p style="color: #6b7280; margin: 0 0 20px 0; font-size: 16px;">Šilčiausi linkėjimai ir iki greito susitikimo!</p>
                <p style="color: #70C040; margin: 0; font-weight: 600; font-size: 16px;">Mokslo sodo komanda</p>
            </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; margin: 0; font-size: 14px;">© 2025 UAB Mokslo Sodas. Visos teisės saugomos.</p>
        </div>
    </div>
</body>
</html>`;

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
    // 1) Extract emails from form responses
    // Get all email answers to debug
    const emailAnswers = payload?.form_response?.answers?.filter((a) => a.type === "email") || [];
    console.log("All email answers:", emailAnswers.map(a => ({ fieldId: a.field?.id, email: a.email })));

    // Parent email (question 19) - this is the main email for templates A, B, C
    // For now, use the first email found as parent email (we'll need to identify the correct field ID)
    const parentEmail = 
      payload?.form_response?.hidden?.email ||
      emailAnswers[0]?.email ||
      null;

    // Child email (question 6) - this is for template D
    // For now, use the second email found as child email (we'll need to identify the correct field ID)
    const childEmail = 
      emailAnswers[1]?.email ||
      null;

    console.log("Extracted parent email:", parentEmail);
    console.log("Extracted child email:", childEmail);

    if (!parentEmail) {
      console.warn("No parent email in payload; skipping email send.");
      console.log("Available fields:", Object.keys(payload?.form_response || {}));
      console.log("Answers:", payload?.form_response?.answers?.map(a => ({ type: a.type, field: a.field?.id })));
      return res.status(200).json({ received: true, parentEmail: null, childEmail, debug: "No parent email found in payload" });
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

    // 3) SEND EMAILS - Parent email first, then child email if available
    let parentEmailSent = false;
    let childEmailSent = false;
    let lastErr = null;
    
    // Send parent email (templates A, B, C)
    for (const delay of [0, 400, 1000, 2000]) {
      try {
        if (delay) {
          console.log("Retrying parent email after " + delay + "ms delay...");
          await new Promise((r) => setTimeout(r, delay));
        }
        
        console.log("Attempting to send parent email...");
        const resp = await resend.emails.send({
          from: "Mokslo Sodas <neatsakyti@mokslosodas.lt>",
          to: parentEmail,
          subject: "Registracija patvirtinta",
          html: htmlBody,
          text: "Gavome jūsų atsakymus. Susisieksime netrukus."
        });

        console.log("Parent email Resend response:", JSON.stringify(resp, null, 2));

        if (resp?.error) {
          console.error("Parent email Resend API error:", resp.error);
          throw resp.error;
        }

        console.info("Parent email Resend OK:", resp?.data?.id || null);
        parentEmailSent = true;
        break;
      } catch (e) {
        lastErr = e;
        console.warn("Parent email Resend attempt failed, will retry...", e?.message || e);
        console.warn("Error details:", JSON.stringify(e, null, 2));
      }
    }

    // Send child email (template D) if child email exists
    if (childEmail) {
      console.log("Attempting to send child email...");
      try {
        const childResp = await resend.emails.send({
          from: "Mokslo Sodas <neatsakyti@mokslosodas.lt>",
          to: childEmail,
          subject: "Registracija patvirtinta",
          html: TEMPLATE_D,
          text: "Vienas iš jūsų tėvų užregistravo jus į anglų kalbos kursus. Susisieksime netrukus."
        });

        console.log("Child email Resend response:", JSON.stringify(childResp, null, 2));

        if (childResp?.error) {
          console.error("Child email Resend API error:", childResp.error);
        } else {
          console.info("Child email Resend OK:", childResp?.data?.id || null);
          childEmailSent = true;
        }
      } catch (e) {
        console.error("Child email send failed:", e?.message || e);
      }
    }

    // 4) NOW acknowledge Typeform
    return res.status(200).json({ 
      received: true, 
      parentEmail, 
      childEmail,
      parentEmailSent, 
      childEmailSent,
      error: parentEmailSent ? null : String(lastErr?.message || lastErr)
    });

  } catch (err) {
    console.error("Unexpected error:", JSON.stringify(err, null, 2));
    // Ack anyway so Typeform doesn't retry endlessly
    return res.status(200).json({ 
      received: true, 
      parentEmail: null,
      childEmail: null,
      parentEmailSent: false,
      childEmailSent: false,
      error: String(err?.message || err) 
    });
  }
}
