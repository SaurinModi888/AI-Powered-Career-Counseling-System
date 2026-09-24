import os
from datetime import datetime
from config import Config

def ensure_chat_dir():
    chat_dir = Config.CHAT_LOGS_DIR
    if not os.path.exists(chat_dir):
        os.makedirs(chat_dir, exist_ok=True)
    return chat_dir

def get_chat_file_path(user_id, selected_career):
    chat_dir = ensure_chat_dir()
    sanitized_career = "".join([c if c.isalnum() else "_" for c in selected_career]).lower()
    filename = f"chat_user_{user_id}_career_{sanitized_career}.txt"
    return os.path.join(chat_dir, filename)

def read_chat_transcript(file_path):
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            print(f"[Chat File Read Error] {e}")
            return ""
    return ""

def update_chat_transcript_file(file_path, messages):
    """
    Saves/updates the conversation transcript array to a .txt file.
    messages format: [{"role": "user"|"assistant", "content": "...", "timestamp": "..."}, ...]
    """
    ensure_chat_dir()
    try:
        lines = []
        lines.append(f"=== PathFinder AI Career Coaching Session Transcript ===")
        lines.append(f"Updated At: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}")
        lines.append("=" * 55 + "\n")
        
        for msg in messages:
            role_label = "USER" if msg.get("role") == "user" else "PATHFINDER AI"
            timestamp = msg.get("timestamp", "")
            content = msg.get("content", "")
            lines.append(f"[{timestamp}] {role_label}:\n{content}\n")
            lines.append("-" * 40)
            
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write("\n".join(lines))
        print(f"[Chat Log] File successfully updated: {file_path}")
        return True
    except Exception as e:
        print(f"[Chat File Save Error] {e}")
        return False

def generate_career_guidance_response(user_message, selected_career, transcript_context=""):
    """
    Calls Gemini API (or fallback mentor) with prior chat transcript context to guide the user towards their selected career path.
    """
    api_key = Config.GEMINI_API_KEY
    
    system_prompt = (
        f"You are PathFinder AI, a world-class career coach and mentor. "
        f"The user has chosen to pursue the career path: '{selected_career}'. "
        f"Your goal is to provide specific, actionable guidance, learning roadmaps, skills to master, "
        f"project ideas, resume tips, and interview advice for becoming a successful {selected_career}.\n\n"
    )

    full_prompt = system_prompt
    if transcript_context:
        full_prompt += f"--- PREVIOUS CONVERSATION CONTEXT FROM USER'S PAST SESSIONS ---\n{transcript_context}\n--- END PREVIOUS CONTEXT ---\n\n"
    
    full_prompt += f"User Question: {user_message}\n\nPathFinder AI Response:"

    if api_key:
        try:
            # Try Google GenAI client SDK
            try:
                from google import genai
                client = genai.Client(api_key=api_key)
                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=full_prompt,
                )
                if response and hasattr(response, 'text') and response.text:
                    return response.text.strip()
            except Exception as e1:
                # Try google.generativeai legacy package
                import google.generativeai as genai_legacy
                genai_legacy.configure(api_key=api_key)
                model = genai_legacy.GenerativeModel('gemini-pro')
                response = model.generate_content(full_prompt)
                if response and hasattr(response, 'text') and response.text:
                    return response.text.strip()
        except Exception as e:
            print(f"[Gemini API Call Failed] {e}")

    # Intelligent Fallback Response when API key is not configured or fails
    fallback_response = (
        f"As your PathFinder AI mentor for **{selected_career}**, here is actionable guidance for your goal:\n\n"
        f"1. **Core Skills to Focus On**: Master foundational tools and frameworks essential for {selected_career}.\n"
        f"2. **Recommended Next Step**: Build 2-3 portfolio projects demonstrating real-world problem solving in {selected_career}.\n"
        f"3. **Interview Preparation**: Practice mock technical and situational questions relevant to this field.\n\n"
        f"*(Note: Configure your GEMINI_API_KEY in backend/.env for live dynamic AI responses. Your chat logs are being saved and updated seamlessly in your transcript file!)*"
    )
    return fallback_response
