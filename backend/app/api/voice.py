from fastapi import APIRouter, Request, Response
from app.services.voice_service import voice_service

router = APIRouter()

@router.post("/incoming")
async def handle_incoming_call(request: Request):
    """
    Handle incoming call from Twilio.
    Returns TwiML to greet the user and gather speech.
    """
    try:
        # Generate initial TwiML
        twiml_response = voice_service.generate_greeting()
        return Response(content=twiml_response, media_type="application/xml")
    except Exception as e:
        return Response(content=str(e), status_code=500)

@router.post("/process")
async def process_speech_input(request: Request):
    """
    Handle speech input from Twilio <Gather>.
    Expects 'SpeechResult' in the form data.
    """
    try:
        form_data = await request.form()
        speech_text = form_data.get("SpeechResult", "")
        
        # Process speech and get TwiML response
        twiml_response = await voice_service.process_speech(speech_text)
        return Response(content=twiml_response, media_type="application/xml")
    
    except Exception as e:
        print(f"Error processing speech: {e}")
        return Response(content=str(e), status_code=500)
