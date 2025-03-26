
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Twilio } from "npm:twilio@4.22.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, body, from } = await req.json();
    
    // Validate required fields
    if (!to || !body) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const defaultFrom = Deno.env.get("TWILIO_PHONE_NUMBER");
    
    if (!accountSid || !authToken || !defaultFrom) {
      return new Response(
        JSON.stringify({ error: "Twilio credentials not configured" }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    const client = new Twilio(accountSid, authToken);
    
    // Send SMS
    const message = await client.messages.create({
      body,
      from: from || defaultFrom,
      to
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "SMS sent successfully", 
        sid: message.sid 
      }),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
    
  } catch (error) {
    console.error("Unexpected error in send-sms function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json", ...corsHeaders } 
      }
    );
  }
});
