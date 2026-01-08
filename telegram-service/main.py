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

app = FastAPI(title="Telegram Member Extractor")

# CORS - Allow your frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, set to your domain: ["https://bootflow.com.br"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Telegram API credentials (set these as environment variables in Railway)
API_ID = os.getenv("TELEGRAM_API_ID")
API_HASH = os.getenv("TELEGRAM_API_HASH")
PHONE_NUMBER = os.getenv("TELEGRAM_PHONE_NUMBER")  # Your phone number with country code

# Session file name
SESSION_NAME = "telegram_session"


class ExtractRequest(BaseModel):
    group_link: str


class LoginRequest(BaseModel):
    phone: str


class VerifyCodeRequest(BaseModel):
    code: str


# Global client instance
client = None
pending_phone = None


def extract_group_username(link: str) -> str:
    """Extract the group username from various Telegram link formats."""
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
    
    # If no match, assume it's already a username
    return link.strip().replace('@', '')


@app.get("/")
async def root():
    return {
        "service": "Telegram Member Extractor",
        "status": "running",
        "endpoints": [
            "GET / - This info",
            "GET /health - Health check",
            "POST /login - Start login process",
            "POST /verify - Verify login code",
            "GET /session-status - Check if logged in",
            "POST /extract-members - Extract members from group"
        ]
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.get("/session-status")
async def session_status():
    """Check if we have an active session."""
    global client
    
    if not API_ID or not API_HASH:
        return {
            "logged_in": False,
            "error": "API_ID and API_HASH not configured. Set them as environment variables."
        }
    
    try:
        if client is None:
            client = TelegramClient(SESSION_NAME, int(API_ID), API_HASH)
        
        await client.connect()
        is_authorized = await client.is_user_authorized()
        
        if is_authorized:
            me = await client.get_me()
            return {
                "logged_in": True,
                "user": {
                    "id": me.id,
                    "first_name": me.first_name,
                    "username": me.username,
                    "phone": me.phone
                }
            }
        else:
            return {"logged_in": False, "error": "Session exists but not authorized"}
            
    except Exception as e:
        return {"logged_in": False, "error": str(e)}


@app.post("/login")
async def login(request: LoginRequest):
    """Start login process - sends verification code to phone."""
    global client, pending_phone
    
    if not API_ID or not API_HASH:
        raise HTTPException(status_code=500, detail="API_ID and API_HASH not configured")
    
    try:
        if client is None:
            client = TelegramClient(SESSION_NAME, int(API_ID), API_HASH)
        
        await client.connect()
        
        # Send code request
        pending_phone = request.phone
        await client.send_code_request(request.phone)
        
        return {
            "success": True,
            "message": f"Código de verificação enviado para {request.phone}. Verifique seu Telegram."
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/verify")
async def verify_code(request: VerifyCodeRequest):
    """Verify the login code."""
    global client, pending_phone
    
    if not client or not pending_phone:
        raise HTTPException(status_code=400, detail="Inicie o login primeiro")
    
    try:
        await client.sign_in(pending_phone, request.code)
        me = await client.get_me()
        pending_phone = None
        
        return {
            "success": True,
            "message": "Login realizado com sucesso!",
            "user": {
                "id": me.id,
                "first_name": me.first_name,
                "username": me.username
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/extract-members")
async def extract_members(request: ExtractRequest):
    """Extract members from a Telegram group."""
    global client
    
    if not API_ID or not API_HASH:
        raise HTTPException(status_code=500, detail="API_ID and API_HASH not configured")
    
    try:
        if client is None:
            client = TelegramClient(SESSION_NAME, int(API_ID), API_HASH)
        
        await client.connect()
        
        if not await client.is_user_authorized():
            raise HTTPException(
                status_code=401, 
                detail="Não autenticado. Faça login primeiro em /login"
            )
        
        # Extract group username from link
        group_identifier = extract_group_username(request.group_link)
        
        # Get the group/channel entity
        try:
            entity = await client.get_entity(group_identifier)
        except Exception as e:
            raise HTTPException(
                status_code=404, 
                detail=f"Grupo não encontrado: {group_identifier}. Certifique-se de que você é membro do grupo."
            )
        
        # Get participants
        members = []
        offset = 0
        limit = 100
        
        while True:
            try:
                participants = await client(GetParticipantsRequest(
                    entity,
                    ChannelParticipantsSearch(''),
                    offset,
                    limit,
                    hash=0
                ))
                
                if not participants.users:
                    break
                
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
                
                # Safety limit
                if offset >= 10000:
                    break
                    
                # Small delay to avoid rate limits
                await asyncio.sleep(0.5)
                
            except Exception as e:
                # If we hit an error (like not having admin), break
                print(f"Error fetching participants: {e}")
                break
        
        # Filter out bots
        members = [m for m in members if not m.get("is_bot")]
        
        return {
            "success": True,
            "group": group_identifier,
            "total_members": len(members),
            "members": members
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/logout")
async def logout():
    """Logout and remove session."""
    global client
    
    try:
        if client:
            await client.log_out()
            client = None
        
        # Remove session file
        if os.path.exists(f"{SESSION_NAME}.session"):
            os.remove(f"{SESSION_NAME}.session")
        
        return {"success": True, "message": "Logout realizado com sucesso"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
