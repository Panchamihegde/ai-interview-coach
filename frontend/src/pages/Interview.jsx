import "./Interview.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Interview() {
  const navigate = useNavigate();

  const [answer, setAnswer] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);

  // Get AI-generated questions from localStorage
 const storedQuestions =
  localStorage.getItem("interviewQuestions");

let questions = [];

try {
  questions = storedQuestions
    ? JSON.parse(storedQuestions)
    : [];
} catch (error) {
  console.error(
    "Could not parse interview questions:",
    error
  );
}

if (!questions || questions.length === 0) {
  questions = [
    "Tell me about yourself."
  ];
}

  const question = questions[currentQuestion];

  // Submit answer
  const handleSubmit = async () => {
    if (!answer.trim()) return;

    const currentAnswer = {
      question: question,
      answer: answer.trim()
    };

    const updatedAnswers = [
      ...userAnswers,
      currentAnswer
    ];

    // More questions remaining
    if (currentQuestion < questions.length - 1) {
      setUserAnswers(updatedAnswers);
      setAnswer("");
      setCurrentQuestion((prev) => prev + 1);
      return;
    }

    // ==========================================
    // INTERVIEW COMPLETED
    // ==========================================

    const interviewResult = {
      id: Date.now(),
      date: new Date().toISOString(),
      totalQuestions: questions.length,
      answers: updatedAnswers
    };

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://ai-interview-coach-backend-i3hw.onrender.com/interview/evaluate",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            answers: updatedAnswers
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Interview evaluation failed"
        );
      }

      console.log("AI Evaluation:", data);

      // Attach AI evaluation to interview result
      interviewResult.evaluation = data.evaluation;

      // Save latest interview
      localStorage.setItem(
        "latestInterview",
        JSON.stringify(interviewResult)
      );

      // Get previous interview history
      const existingHistory =
        JSON.parse(
          localStorage.getItem("interviewHistory")
        ) || [];

      // Add completed interview
      existingHistory.push(interviewResult);

      // Save updated history
      localStorage.setItem(
        "interviewHistory",
        JSON.stringify(existingHistory)
      );

      alert("Interview evaluated successfully!");

      // Go to results
      navigate("/results");

    } catch (error) {
      console.error("Evaluation error:", error);

      alert(
        error.message ||
        "Something went wrong while evaluating the interview."
      );
    }
  };

  return (
    <div className="interview-layout">

      {/* =========================
          MAIN INTERVIEW AREA
      ========================== */}

      <main className="interview-main">

        {/* Header */}
        <div className="interview-header">

          <div className="session-info">

            <div>
              <h2>AI Interview Coach</h2>
              <p>Mock Interview</p>
            </div>

            <span className="live-badge">
              <span className="live-dot"></span>
              LIVE
            </span>

          </div>

          <button
            className="btn btn-danger"
            onClick={() => navigate("/dashboard")}
          >
            Exit Interview
          </button>

        </div>


        {/* =========================
            MESSAGES
        ========================== */}

        <div className="messages-container">

          {/* AI QUESTION */}

          <div className="message-bubble">

            <div className="agent-icon lead">
              AI
            </div>

            <div className="message-content">

              <div className="agent-name lead-color">
                AI Interviewer
              </div>

              <p>
                Question {currentQuestion + 1} of {questions.length}
              </p>

              <p>
                {question}
              </p>

            </div>

          </div>


          {/* USER ANSWER */}

          {answer && (
            <div className="message-bubble user">

              <div className="agent-icon user">
                You
              </div>

              <div className="message-content">

                <div className="agent-name">
                  You
                </div>

                <p>
                  {answer}
                </p>

              </div>

            </div>
          )}

        </div>


        {/* =========================
            ANSWER CONTROLS
        ========================== */}

        <div className="interview-controls">

          <input
            type="text"
            className="input-field"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit();
              }
            }}
          />

          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!answer.trim()}
          >
            Submit
          </button>

        </div>

      </main>


      {/* =========================
          RIGHT SIDEBAR
      ========================== */}

      <aside className="interview-sidebar">

        {/* AI AGENTS */}

        <div className="sidebar-card">

          <h3>🤖 AI Agents</h3>

          <div className="active-agent-list">

            <div className="agent-status-item">

              <span className="lead-color">
                AI Interviewer
              </span>

              <span>
                ● Active
              </span>

            </div>


            <div className="agent-status-item">

              <span className="tech-color">
                Technical Agent
              </span>

              <span>
                ● Ready
              </span>

            </div>


            <div className="agent-status-item">

              <span className="behavioral-color">
                Behavioral Agent
              </span>

              <span>
                ● Ready
              </span>

            </div>


            <div className="agent-status-item">

              <span className="coach-color">
                AI Coach
              </span>

              <span>
                ● Ready
              </span>

            </div>

          </div>

        </div>


        {/* =========================
            PROGRESS
        ========================== */}

        <div className="sidebar-card">

          <h3>📊 Interview Progress</h3>

          <p>
            Question {currentQuestion + 1} of {questions.length}
          </p>

          <div className="progress-bar-bg">

            <div
              className="progress-bar-fill"
              style={{
                width: `${
                  ((currentQuestion + 1) / questions.length) * 100
                }%`
              }}
            ></div>

          </div>

        </div>


        {/* =========================
            AI COACH
        ========================== */}

        <div className="sidebar-card">

          <h3>💡 AI Coach</h3>

          <p>
            Take your time and give a clear,
            structured answer.
          </p>

          <p>
            Your response will be evaluated for
            clarity, relevance, and communication.
          </p>

        </div>

      </aside>

    </div>
  );
}

export default Interview;