
# Typeform → Resend on Vercel (no-code friendly)

This project receives a Typeform webhook and sends a confirmation email using **Resend**.

## What you need
1) A Resend account + API Key  
2) Your domain **mokslosodas.lt** verified in Resend  
3) A Vercel project (this folder deployed to Vercel)

## Setup (Vercel Dashboard)
1. Go to **Vercel → Projects → typeform-resend → Settings → Environment Variables**.
2. Add a new variable:  
   - **Name**: `RESEND_API_KEY`  
   - **Value**: your Resend API key (starts with `re_...`)  
   - **Environments**: Production (and Preview if you want)  
3. Deploy (or redeploy) your project.

## Resend domain
In **Resend Dashboard → Domains** add **mokslosodas.lt** (or a subdomain like `mail.mokslosodas.lt`), copy the **SPF** and **DKIM** records into your domain DNS, then wait for verification to turn green.

## Test
- In **Typeform → Connect → Webhooks**, point to your deployed URL:  
  `https://<your-vercel-domain>/api/typeform-webhook`  
  Use the “Send test webhook” button.
- Or use curl locally:
  ```bash
  curl -sS -X POST https://<your-vercel-domain>/api/typeform-webhook     -H "content-type: application/json"     -d @sample-payload.json
  ```
