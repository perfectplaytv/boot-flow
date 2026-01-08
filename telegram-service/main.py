# Telegram Member Extractor Service
# Deploy this on Railway.app

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from telethon import TelegramClient
from telethon.tl.functions.channels import GetParticipantsRequest
from telethon.tl.types import ChannelParticipantsSearch
import os
import asyncio
import re
import glob

app = FastAPI(title="Telegram Member Extractor")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Credentials
API_ID = os.getenv("TELEGRAM_API_ID")
API_HASH = os.getenv("TELEGRAM_API_HASH")

# State
active_clients = {}  # phone_clean -> TelegramClient
pending_auth_clients = {} # phone_clean -> TelegramClient

class ExtractRequest(BaseModel):
    phone: str # Which account to use
    group_link: str

class LoginRequest(BaseModel):
    phone: str

class VerifyCodeRequest(BaseModel):
    phone: str
    code: str

class LogoutRequest(BaseModel):
    phone: str

def clean_phone(phone: str) -> str:
    return re.sub(r'[^0-9]', '', phone)

def get_session_name(phone_clean: str) -> str:
    return f"session_{phone_clean}"

def extract_group_username(link: str) -> str:
    patterns = [
        r't\.me/([a-zA-Z0-9_]+)',
        r'telegram\.me/([a-zA-Z0-9_]+)',
        r't\.me/joinchat/([a-zA-Z0-9_-]+)',
        r'@([a-zA-Z0-9_]+)',
    ]
    for pattern in patterns:
        match = re.search(pattern, link)
        if match:
            return match.group(1)
    return link.strip().replace('@', '')

async def get_client(phone_clean: str):
    """Get or load a client for a specific phone number."""
    if not API_ID or not API_HASH:
        raise Exception("API_ID and API_HASH not configured")

    if phone_clean in active_clients:
        client = active_clients[phone_clean]
        if not client.is_connected():
            await client.connect()
        return client

    # Try to load existing session
    session_name = get_session_name(phone_clean)
    if os.path.exists(f"{session_name}.session"):
        client = TelegramClient(session_name, int(API_ID), API_HASH)
        await client.connect()
        if await client.is_user_authorized():
            active_clients[phone_clean] = client
            return client
    
    return None

@app.get("/")
async def root():
    return {"status": "running", "service": "Multi-Account Telegram Extractor"}

@app.get("/sessions")
async def list_sessions():
    """List all authorized sessions."""
    if not API_ID or not API_HASH:
        return {"sessions": [], "error": "Missing credentials"}

    sessions = []
    # Scan for session files
    files = glob.glob("session_*.session")
    
    for path in files:
        filename = os.path.basename(path)
        # Extract phone from filename: session_552199999999.session
        match = re.search(r'session_(\d+)\.session', filename)
        if match:
            ph = match.group(1)
            try:
                client = await get_client(ph)
                if client and await client.is_user_authorized():
                    me = await client.get_me()
                    sessions.append({
                        "phone": f"+{ph}", # Add + back for display
                        "clean_phone": ph,
                        "id": str(me.id),
                        "username": me.username,
                        "first_name": me.first_name,
                        "last_name": me.last_name
                    })
            except Exception as e:
                print(f"Error loading session {ph}: {e}")

    return {"sessions": sessions}

@app.post("/login")
async def login(request: LoginRequest):
    ph = clean_phone(request.phone)
    if not API_ID or not API_HASH:
        raise HTTPException(500, "Missing credentials")

    try:
        session_name = get_session_name(ph)
        client = TelegramClient(session_name, int(API_ID), API_HASH)
        await client.connect()
        
        await client.send_code_request(request.phone)
        pending_auth_clients[ph] = client
        
        return {"success": True, "message": f"Code sent to {request.phone}"}
    except Exception as e:
        raise HTTPException(400, str(e))

@app.post("/verify")
async def verify(request: VerifyCodeRequest):
    ph = clean_phone(request.phone)
    client = pending_auth_clients.get(ph)
    
    if not client:
        # Try to see if we can reconnect to a session that was starting? 
        # Usually client object holds state for sign_in.
        # If server restarted, we lose pending login state.
        raise HTTPException(400, "Session not found or expired. Try login again.")

    try:
        await client.sign_in(request.phone, request.code)
        
        # Success
        active_clients[ph] = client
        if ph in pending_auth_clients:
            del pending_auth_clients[ph]
            
        me = await client.get_me()
        return {
            "success": True, 
            "user": {
                "id": me.id,
                "username": me.username,
                "first_name": me.first_name
            }
        }
    except Exception as e:
        raise HTTPException(400, str(e))

@app.post("/extract-members")
async def extract(request: ExtractRequest):
    ph = clean_phone(request.phone)
    client = await get_client(ph)
    
    if not client or not await client.is_user_authorized():
        raise HTTPException(401, "Account not connected or unauthorized")

    try:
        group_identifier = extract_group_username(request.group_link)
        
        try:
            entity = await client.get_entity(group_identifier)
        except:
            raise HTTPException(404, f"Cluster/Group not found: {group_identifier}")

        members = []
        offset = 0
        limit = 100
        
        while True:
            try:
                participants = await client(GetParticipantsRequest(
                    entity, ChannelParticipantsSearch(''), offset, limit, hash=0
                ))
                if not participants.users: break
                
                for user in participants.users:
                    members.append({
                        "id": str(user.id),
                        "username": user.username or "",
                        "first_name": user.first_name or "",
                        "last_name": user.last_name or "",
                        "phone": user.phone or "",
                        "is_bot": user.bot
                    })
                
                offset += len(participants.users)
                if offset >= 10000: break
                await asyncio.sleep(0.5)
            except Exception as e:
                print(f"Error extracting: {e}")
                break
        
        members = [m for m in members if not m.get("is_bot")]
        return {
            "success": True,
            "group": group_identifier,
            "total_members": len(members),
            "members": members
        }
    except Exception as e:
        raise HTTPException(500, str(e))

@app.post("/logout")
async def logout(request: LogoutRequest):
    ph = clean_phone(request.phone)
    
    client = await get_client(ph)
    if client:
        await client.log_out()
        if ph in active_clients:
            del active_clients[ph]
            
    # Remove file
    fname = f"{get_session_name(ph)}.session"
    if os.path.exists(fname):
        os.remove(fname)
        
    return {"success": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
    
