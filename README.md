# 🤖 AI Interview Coach

An AI-powered mock interview platform that generates personalized
interview questions from a candidate's resume and job description,
conducts a mock interview, and evaluates the candidate's responses.

## 🚀 Features

- 📄 Resume upload
- 💼 Job-description based questions
- 🤖 AI-generated interview questions
- 🎯 Technical, behavioral and project questions
- 🧠 AI-powered answer evaluation
- 📊 Performance scoring
- 💡 Personalized feedback
- 📈 Interview history dashboard

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Python
- FastAPI
- Hugging Face Inference API

### AI
- OpenAI GPT-OSS 20B
- Together AI inference provider

## 🏗️ Architecture

React Frontend
        ↓
FastAPI Backend
        ↓
AI Service
        ↓
Hugging Face / Together AI

## 📁 Project Structure

```text
ai-interview-coach/
│
├── backend/
│   └── app/
│       ├── api/
│       ├── services/
│       ├── models/
│       ├── schemas/
│       └── main.py
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
