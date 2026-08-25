from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from pypdf import PdfReader

from app.security import get_current_user
from app.services.ai_service import (
    generate_interview_questions,
    evaluate_interview
)


class InterviewEvaluationRequest(BaseModel):
    answers: list


router = APIRouter(
    prefix="/interview",
    tags=["Interview"]
)


@router.post("/analyze-input")
async def analyze_input(
    resume: UploadFile = File(...),
    job_description: str = Form(...),
    user_id: int = Depends(get_current_user)
):

    # Check file type
    if resume.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF resume"
        )

    # Read PDF
    contents = await resume.read()

    try:
        with open("temp_resume.pdf", "wb") as f:
            f.write(contents)

        reader = PdfReader("temp_resume.pdf")

        resume_text = ""

        for page in reader.pages:
            text = page.extract_text()

            if text:
                resume_text += text + "\n"

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Could not read resume: {str(e)}"
        )

    # Generate personalized interview questions
    try:
        interview_questions = generate_interview_questions(
            resume_text,
            job_description
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI question generation failed: {str(e)}"
        )

    return {
        "message": "Interview questions generated successfully",
        "user_id": user_id,
        "resume_filename": resume.filename,
        "job_description": job_description,
        "interview_questions": interview_questions
    }


@router.post("/evaluate")
async def evaluate(
    request: InterviewEvaluationRequest,
    user_id: int = Depends(get_current_user)
):

    try:
        evaluation = evaluate_interview(request.answers)

        return {
            "message": "Interview evaluated successfully",
            "user_id": user_id,
            "evaluation": evaluation
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Interview evaluation failed: {str(e)}"
        )