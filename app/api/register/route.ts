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

    // Sanitize WhatsApp number: strip non-digits, leading zeros, and redundant country codes
    let cleanWhatsapp = whatsapp.replace(/\D/g, ""); 
    if (cleanWhatsapp.startsWith("234")) {
      cleanWhatsapp = cleanWhatsapp.substring(3);
    }
    if (cleanWhatsapp.startsWith("0")) {
      cleanWhatsapp = cleanWhatsapp.substring(1);
    }
    const formattedWhatsapp = `+234${cleanWhatsapp}`;
    const timestamp = new Date().toISOString();

    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

    console.log(scriptUrl)

    // 2. Integration Method A: Direct Google Sheets API via Service Account Key
    if (clientEmail && privateKey && spreadsheetId) {
      // Initialize JWT Auth client
      const auth = new google.auth.JWT({
        email: clientEmail,
        key: privateKey.replace(/\\n/g, "\n"),
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });

      const sheets = google.sheets({ version: "v4", auth });

      // Append row to the sheet (defaulting to the first sheet)
      await sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: "A:E", // Appends to the first sheet, columns A to E
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[name, email, formattedWhatsapp, track, timestamp]],
        },
      });

      console.log("Direct Google Sheets API submission success");
    } 
    // 3. Integration Method B: Forwarding to Google Apps Script Web App
    else if (scriptUrl) {
      const response = await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          whatsapp: formattedWhatsapp,
          track,
        }),
      });

      if (!response.ok) {
        throw new Error(`Google Apps Script Web App returned status: ${response.status}`);
      }
      console.log("Google Apps Script submission success");
    } 
    // 4. Local Simulation Fallback
    else {
      console.log("GOOGLE API credentials are not set. Simulating Sheets submission for:", {
        name,
        email,
        formattedWhatsapp,
        track,
        timestamp,
      });
      // Brief simulated delay
      await new Promise((resolve) => setTimeout(resolve, 800));
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
