from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel

from dotenv import load_dotenv
from groq import Groq

import os

# ----------------------------------------
# Load Environment Variables
# ----------------------------------------

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise Exception("GROQ_API_KEY not found in .env")

client = Groq(api_key=api_key)

# ----------------------------------------
# FastAPI App
# ----------------------------------------

app = FastAPI(title="AI Travel Planner")

app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")

# ----------------------------------------
# Request Model
# ----------------------------------------

class TravelRequest(BaseModel):
    destination: str

# ----------------------------------------
# Home Page
# ----------------------------------------

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):

    return templates.TemplateResponse(
    request=request,
    name="index.html"
)

# ----------------------------------------
# Generate Travel Plan
# ----------------------------------------

@app.post("/generate")
async def generate(data: TravelRequest):

    prompt = f"""
You are an Expert AI Travel Planner.

Generate a COMPLETE travel guide.

Destination:
{data.destination}

Use this exact format.

🌍 DESTINATION OVERVIEW

Write a short introduction.

------------------------------------------------

📍 LOCATION

Mention country, state and nearby cities.

------------------------------------------------

🌤 BEST TIME TO VISIT

Mention weather and seasons.

------------------------------------------------

✈ HOW TO REACH

Flights
Train
Bus
Road

------------------------------------------------

🏨 BEST HOTELS

Suggest five hotels.

------------------------------------------------

🏞 TOP TOURIST ATTRACTIONS

List the famous places.

------------------------------------------------

📅 DAY 1 PLAN

Morning

Afternoon

Evening

------------------------------------------------

📅 DAY 2 PLAN

Morning

Afternoon

Evening

------------------------------------------------

📅 DAY 3 PLAN

Morning

Afternoon

Evening

------------------------------------------------

🍽 FAMOUS FOODS

Mention local dishes.

------------------------------------------------

🚕 LOCAL TRANSPORTATION

Mention taxis, buses and rentals.

------------------------------------------------

🛍 SHOPPING PLACES

Mention shopping streets and markets.

------------------------------------------------

💰 ESTIMATED BUDGET

Budget Traveller

Standard Traveller

Luxury Traveller

------------------------------------------------

⚠ SAFETY TIPS

------------------------------------------------

🎒 PACKING CHECKLIST

------------------------------------------------

📞 EMERGENCY CONTACTS

------------------------------------------------

Finish with:

Have a wonderful trip! ✈
"""

    try:

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7
        )

        answer = completion.choices[0].message.content

        return JSONResponse(
            {
                "response": answer
            }
        )

    except Exception as e:

        return JSONResponse(
            status_code=500,
            content={
                "response": f"Error: {str(e)}"
            }
        )