from fastapi import FastAPI
from app.api.interview import router as interview_router
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router


app = FastAPI(
    title="Multi-Agent Interview Coach"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(interview_router)


@app.get("/")
def root():
    return {
        "message": "Multi-Agent Interview Coach API is running"
    }
