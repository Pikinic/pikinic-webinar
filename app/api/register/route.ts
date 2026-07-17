import { NextResponse } from "next/server";
import { google } from "googleapis";
import { registerSchema } from "../../schemas/register";

export async function POST(request: Request) {
  try {
    const body = await request.json();
     console.log(body)
    // 1. Validate inputs server-side using Zod
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.format() },
        { status: 400 }
      );
    }

    const { name, email, whatsapp, track } = validation.data;

    // Sanitize WhatsApp number: strip non-digits and format with proper country code
    let cleanWhatsapp = whatsapp.replace(/\D/g, ""); 
    let formattedWhatsapp = "";
    
    if (whatsapp.startsWith("+")) {
      formattedWhatsapp = `+${cleanWhatsapp}`;
    } else if (cleanWhatsapp.startsWith("234") && cleanWhatsapp.length >= 11) {
      formattedWhatsapp = `+${cleanWhatsapp}`;
    } else if (cleanWhatsapp.length === 11 && cleanWhatsapp.startsWith("0")) {
      formattedWhatsapp = `+234${cleanWhatsapp.substring(1)}`;
    } else if (cleanWhatsapp.length === 10 && /^[789]/.test(cleanWhatsapp)) {
      formattedWhatsapp = `+234${cleanWhatsapp}`;
    } else {
      // Fallback: prepend '+' to whatever digits are provided
      formattedWhatsapp = `+${cleanWhatsapp}`;
    }
    const timestamp = new Date().toISOString();

    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    const zohoWebhookUrl = process.env.ZOHO_FLOW_WEBHOOK_URL || process.env.ZOHO_WEBHOOK_URL;

    console.log("Apps Script Web App URL:", scriptUrl);
    console.log("Zoho Flow Webhook URL configured:", !!zohoWebhookUrl);

    const promises: Promise<any>[] = [];

    // 1. Primary storage promise (Google Sheets)
    let sheetsPromise: Promise<any>;
    if (clientEmail && privateKey && spreadsheetId) {
      // Direct Google Sheets API via Service Account Key
      const auth = new google.auth.JWT({
        email: clientEmail,
        key: privateKey.replace(/\\n/g, "\n"),
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
      const sheets = google.sheets({ version: "v4", auth });
      sheetsPromise = sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: "A:E",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[name, email, formattedWhatsapp, track, timestamp]],
        },
      }).then(() => "Google Sheets (Direct API) success");
    } else if (scriptUrl) {
      // Forwarding to Google Apps Script Web App
      sheetsPromise = fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          whatsapp: formattedWhatsapp,
          track,
        }),
        signal: AbortSignal.timeout(5000), // Timeout after 5s to prevent Vercel Hobby plan timeout (10s limit)
      }).then(async (res) => {
        if (!res.ok) {
          throw new Error(`Google Apps Script Web App returned status: ${res.status}`);
        }
        return "Google Sheets (Apps Script Web App) success";
      });
    } else {
      // Local Simulation Fallback
      sheetsPromise = new Promise((resolve) => setTimeout(() => resolve("Simulated Sheets success"), 800));
    }
    promises.push(sheetsPromise);

    // 2. Zoho Flow Webhook promise
    if (zohoWebhookUrl) {
      const zohoPromise = fetch(zohoWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          whatsapp: formattedWhatsapp,
          track,
          timestamp,
        }),
        signal: AbortSignal.timeout(4000), // Timeout after 4s for Zoho Flow
      }).then(async (res) => {
        if (!res.ok) {
          throw new Error(`Zoho Flow Webhook returned status: ${res.status}`);
        }
        return "Zoho Flow Webhook success";
      });
      promises.push(zohoPromise);
    }

    // Run both integrations in parallel to maximize performance and avoid serverless timeouts
    const results = await Promise.allSettled(promises);

    results.forEach((result, idx) => {
      if (result.status === "rejected") {
        console.error(`Integration #${idx + 1} failed:`, result.reason);
      } else {
        console.log(`Integration #${idx + 1} succeeded:`, result.value);
      }
    });

    // Check if Sheets insertion succeeded (primary requirement)
    const sheetsResult = results[0];
    if (sheetsResult.status === "rejected") {
      throw new Error(`Spreadsheet storage failed: ${sheetsResult.reason}`);
    }

    return NextResponse.json({ success: true, message: "Registration saved successfully" });
  } catch (error: any) {
    console.error("API /api/register server-side error details:", error);
    return NextResponse.json(
      { error: "Registration service is temporarily unavailable. Please try again shortly." },
      { status: 500 }
    );
  }
}
