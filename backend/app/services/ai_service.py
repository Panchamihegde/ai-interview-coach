import os
import json

from dotenv import load_dotenv
from huggingface_hub import InferenceClient


# ============================================================
# LOAD ENVIRONMENT
# ============================================================

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")

if not HF_TOKEN:
    raise ValueError("HF_TOKEN is not set in .env")


# ============================================================
# HUGGING FACE CLIENT
# ============================================================

client = InferenceClient(
    provider="together",
    token=HF_TOKEN
)


# ============================================================
# MODEL
# ============================================================

MODEL_NAME = "openai/gpt-oss-20b"


# ============================================================
# GENERATE INTERVIEW QUESTIONS
# ============================================================
def generate_interview_questions(
    resume_text: str,
    job_description: str
):

    prompt = f"""
You are an expert technical interviewer.

Create a mock interview for the candidate using BOTH their resume
and the job description.

CANDIDATE RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}

You MUST generate EXACTLY 10 questions.

The 10 questions MUST contain:

1. 3 resume-based questions
2. 3 technical questions based on the job description
3. 2 project-based questions
4. 2 behavioral questions

IMPORTANT RULES:

- Generate exactly 10 questions.
- Each question must be a complete single question.
- Do not combine multiple questions.
- Do not skip any category.
- Do not add explanations.
- Do not add headings.
- Do not add numbering.
- Return ONLY a valid JSON array of strings.

Example format:

[
  "Tell me about your experience with Python.",
  "Explain the main project mentioned in your resume.",
  "What technical concepts are required for this role?",
  "How would you solve a problem involving databases?",
  "Explain your approach to debugging a software issue.",
  "What technologies from the job description have you worked with?",
  "Tell me about a project you are particularly proud of.",
  "What challenges did you face while building that project?",
  "Tell me about a time you handled a difficult situation.",
  "How do you prioritize tasks when working under pressure?"
]
"""

    try:

        response = client.chat_completion(
            model=MODEL_NAME,

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            max_tokens=1200,
            temperature=0.2
        )

        raw_response = (
            response.choices[0]
            .message.content
            .strip()
        )

        # Remove markdown fences if the model adds them
        if raw_response.startswith("```"):

            raw_response = raw_response.replace(
                "```json",
                ""
            )

            raw_response = raw_response.replace(
                "```",
                ""
            )

            raw_response = raw_response.strip()

        # Parse JSON
        questions = json.loads(raw_response)

        # Make sure response is actually a list
        if not isinstance(questions, list):
            raise ValueError(
                "AI did not return a list of questions."
            )

        # Make sure there are exactly 10
        if len(questions) != 10:
            raise ValueError(
                f"AI generated {len(questions)} questions instead of 10."
            )

        # Make sure every item is a string
        questions = [
            str(question).strip()
            for question in questions
            if str(question).strip()
        ]

        if len(questions) != 10:
            raise ValueError(
                "AI returned invalid or empty questions."
            )

        return questions

    except json.JSONDecodeError as e:

        print("Invalid JSON from AI:")
        print(raw_response)

        raise RuntimeError(
            f"AI returned invalid question format: {str(e)}"
        )

    except Exception as e:

        print("Hugging Face question generation error:")
        print(str(e))

        raise RuntimeError(
            f"AI provider error: {str(e)}"
        )


# ============================================================
# EVALUATE COMPLETED INTERVIEW
# ============================================================

def evaluate_interview(answers):

    answers_text = ""

    for index, item in enumerate(answers, start=1):

        answers_text += f"""
Question {index}:
{item.get("question", "")}

Candidate Answer:
{item.get("answer", "")}

--------------------------------
"""

    prompt = f"""
You are a strict and fair professional interview evaluator.

Evaluate the candidate's completed mock interview.

INTERVIEW QUESTIONS AND ANSWERS:

{answers_text}

Evaluate EACH candidate answer based on:

- Whether the answer is correct
- Whether it actually answers the question
- Technical accuracy
- Relevance
- Clarity
- Problem-solving quality
- Behavioral quality where applicable

IMPORTANT SCORING RULES:

- Do NOT give a high score just because the candidate answered.
- If an answer is incorrect, clearly penalize it.
- If an answer is partially correct, give partial credit.
- If an answer is irrelevant, give very low credit.
- If the candidate says something incorrect, identify it as an improvement.
- Do not assume an answer is correct without evaluating its content.
- Communication should evaluate clarity and structure.
- Technical Skills should evaluate technical correctness.
- Problem Solving should evaluate reasoning and approach.
- Behavioral Skills should evaluate behavioral answers.
- A wrong factual or technical answer must receive low credit.
- "yes", "no", "okay", "I don't know", or meaningless answers must receive very low credit.
- Do not award points simply for attempting an answer.
- Do not assume knowledge that the candidate did not demonstrate.
- For technical questions, factual correctness is more important than confidence.
- For project questions, verify that the candidate actually understands their project.
- Do not automatically give scores around 70-80.

After evaluating all answers, calculate:

Technical Skills score: 0-100
Communication score: 0-100
Problem Solving score: 0-100
Behavioral Skills score: 0-100

Calculate the overall score from these four category scores.

Provide:

3 to 5 specific strengths.

3 to 5 specific improvements.

A short overall feedback summary.

RETURN ONLY VALID JSON.

Do not use markdown.
Do not use ```json.
Do not write anything before the JSON.
Do not write anything after the JSON.

Use EXACTLY this structure:

{{
    "overall_score": 0,
    "technical_score": 0,
    "communication_score": 0,
    "problem_solving_score": 0,
    "behavioral_score": 0,
    "strengths": [
        "strength 1",
        "strength 2",
        "strength 3"
    ],
    "improvements": [
        "improvement 1",
        "improvement 2",
        "improvement 3"
    ],
    "feedback": "Short overall feedback summary."
}}
"""

    try:

        response = client.chat_completion(
            model=MODEL_NAME,

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            max_tokens=1200,
            temperature=0.1
        )

        raw_response = (
            response.choices[0]
            .message.content
            .strip()
        )

        print("====================================")
        print("AI EVALUATION RAW RESPONSE:")
        print(raw_response)
        print("====================================")

    except Exception as e:

        print("Hugging Face evaluation error:")
        print(str(e))

        raise RuntimeError(
            f"AI provider error: {str(e)}"
        )

    # --------------------------------------------------------
    # REMOVE MARKDOWN CODE FENCES
    # --------------------------------------------------------

    if "```json" in raw_response:

        raw_response = raw_response.replace(
            "```json",
            ""
        )

    if "```" in raw_response:

        raw_response = raw_response.replace(
            "```",
            ""
        )

    raw_response = raw_response.strip()

    # --------------------------------------------------------
    # FIND JSON OBJECT
    # --------------------------------------------------------

    start = raw_response.find("{")
    end = raw_response.rfind("}")

    if start != -1 and end != -1:

        raw_response = raw_response[
            start:end + 1
        ]

    # --------------------------------------------------------
    # PARSE JSON
    # --------------------------------------------------------

    try:

        evaluation = json.loads(
            raw_response
        )

    except json.JSONDecodeError:

        print("====================================")
        print("INVALID JSON AFTER CLEANING:")
        print(raw_response)
        print("====================================")

        raise ValueError(
            "AI returned invalid JSON."
        )

    # --------------------------------------------------------
    # BASIC VALIDATION
    # --------------------------------------------------------

    required_fields = [
        "overall_score",
        "technical_score",
        "communication_score",
        "problem_solving_score",
        "behavioral_score",
        "strengths",
        "improvements",
        "feedback"
    ]

    for field in required_fields:

        if field not in evaluation:

            raise ValueError(
                f"AI evaluation missing field: {field}"
            )

    return evaluation


