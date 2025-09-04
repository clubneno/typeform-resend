
# Typeform → Resend on Vercel (no-code friendly)

This project receives a Typeform webhook and sends a confirmation email using **Resend**.

## What you need
1) A Resend account + API Key  
2) Your domain **mokslosodas.lt** verified in Resend  
3) A Vercel project (this folder deployed to Vercel)

## Setup (Vercel Dashboard)
1. Go to **Vercel → Projects → typeform-resend → Settings → Environment Variables**.
2. Add these variables:  
   - **Name**: `RESEND_API_KEY`  
     **Value**: your Resend API key (starts with `re_...`)  
     **Environments**: Production (and Preview if you want)
   - **Name**: `TYPEFORM_WEBHOOK_SECRET`  
     **Value**: your Typeform webhook secret (get this from Typeform webhook settings)  
     **Environments**: Production (and Preview if you want)  
3. Deploy (or redeploy) your project.

## Resend domain
In **Resend Dashboard → Domains** add **mokslosodas.lt** (or a subdomain like `mail.mokslosodas.lt`), copy the **SPF** and **DKIM** records into your domain DNS, then wait for verification to turn green.

## Security Features
This implementation includes:
- ✅ **Webhook signature verification** - Only accepts requests from Typeform
- ✅ **Email format validation** - Prevents invalid emails from being sent
- ✅ **Security headers** - Protects against common web vulnerabilities
- ✅ **Input sanitization** - Validates all incoming data

## Test
- In **Typeform → Connect → Webhooks**, point to your deployed URL:  
  `https://<your-vercel-domain>/api/typeform-webhook`  
  **Important**: Make sure to set a webhook secret in Typeform and add it as `TYPEFORM_WEBHOOK_SECRET` in Vercel environment variables.
  Use the "Send test webhook" button.
- Or use curl locally:
  ```bash
  curl -sS -X POST https://<your-vercel-domain>/api/typeform-webhook     -H "content-type: application/json"     -d @sample-payload.json
  ```
