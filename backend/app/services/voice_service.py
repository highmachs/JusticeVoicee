import os
from twilio.twiml.voice_response import VoiceResponse
import app.services.legal_rag as legal_rag_module

class VoiceService:
    def __init__(self):
        # We now rely on the LegalRAGService for intelligence
        pass

    def generate_greeting(self) -> str:
        """Generates the initial TwiML greeting."""
        response = VoiceResponse()
        # "Sakhi" persona greeting
        response.say("Namaste. I am Sakhi, your sister and guide. Are you safe? How can I help you today?", voice='alice')
        response.gather(input='speech', action='/api/voice/process', timeout=4)
        response.say("I am here listening. Please speak when you are ready.")
        return str(response)

    async def process_speech(self, user_speech: str) -> str:
        """
        1. Process speech text with LegalRAGService (Sakhi persona).
        2. Return TwiML with the answer.
        """
        response = VoiceResponse()

        if not user_speech:
            response.say("I didn't hear you clearly. Please say that again.")
            response.gather(input='speech', action='/api/voice/process', timeout=4)
            return str(response)

        try:
            # Use RAG to get the answer
            # This is synchronous (LangChain invoke), but fast enough for a demo
            ai_text = legal_rag_module.legal_rag_service.query(user_speech)
            
            # Add to TwiML
            response.say(ai_text, voice='alice')
            
            # Continue conversation
            response.gather(input='speech', action='/api/voice/process', timeout=4)
            
        except Exception as e:
            print(f"Error calling RAG: {e}")
            response.say("I am having trouble finding that information right now. Please call the 181 helpline for immediate assistance.")
            
        return str(response)

# Singleton instance
voice_service = VoiceService()
