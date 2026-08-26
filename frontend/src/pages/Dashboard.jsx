import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

function Dashboard() {
  const navigate = useNavigate();

  // ============================================================
  // STATES
  // ============================================================

  const fileInputRef = useRef(null);

  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");

  const [interviewHistory, setInterviewHistory] = useState([]);
  const [averageScore, setAverageScore] = useState("--");
  const [bestScore, setBestScore] = useState("--");
  const [questionsGenerated, setQuestionsGenerated] = useState(
  Boolean(localStorage.getItem("interviewQuestions"))
  );
  // ============================================================
  // LOAD INTERVIEW HISTORY
  // ============================================================

  useEffect(() => {
    loadInterviewHistory();
  }, []);

  const loadInterviewHistory = () => {
    const savedHistory =
      JSON.parse(localStorage.getItem("interviewHistory")) || [];

    setInterviewHistory(savedHistory);

    // ------------------------------------------------------------
    // Get scores from completed interviews
    // ------------------------------------------------------------

    const scores = savedHistory
      .map((interview) => {
        // New format
        if (
          interview.evaluation &&
          typeof interview.evaluation.overall_score === "number"
        ) {
          return interview.evaluation.overall_score;
        }

        // Support older saved format
        if (typeof interview.overallScore === "number") {
          return interview.overallScore;
        }

        return null;
      })
      .filter((score) => score !== null);

    // ------------------------------------------------------------
    // Calculate average and best score
    // ------------------------------------------------------------

    if (scores.length > 0) {
      const total = scores.reduce(
        (sum, score) => sum + score,
        0
      );

      const average = Math.round(total / scores.length);

      const best = Math.max(...scores);

      setAverageScore(average);
      setBestScore(best);
    } else {
      setAverageScore("--");
      setBestScore("--");
    }
  };

  // ============================================================
  // RESUME UPLOAD
  // ============================================================

  const handleResumeUpload = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setResumeFile(file);

    console.log("Selected resume:", file.name);
  };

  // ============================================================
  // ANALYZE RESUME
  // ============================================================

  const handleAnalyzeResume = async () => {
    if (!resumeFile) {
      alert("Please upload your resume first.");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please enter the job description.");
      return;
    }

    const formData = new FormData();

    formData.append("resume", resumeFile);
    formData.append(
      "job_description",
      jobDescription
    );

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://ai-interview-coach-backend-1oth.onrender.com/interview/analyze-input",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Resume analysis failed"
        );
      }

      console.log(
        "Interview questions:",
        data
      );

      // Save AI-generated questions
     if (
  !Array.isArray(data.interview_questions) ||
  data.interview_questions.length !== 10
) {
  throw new Error(
    "AI did not generate exactly 10 interview questions."
  );
}

localStorage.setItem(
  "interviewQuestions",
  JSON.stringify(data.interview_questions)
);

setQuestionsGenerated(true);

setQuestionsGenerated(true);

      alert(
        "Resume analyzed successfully! Interview questions generated."
      );

    } catch (error) {
      console.error(
        "Resume analysis error:",
        error
      );

      alert(error.message);
    }
  };

  // ============================================================
  // NAVIGATION
  // ============================================================

  const handleStartInterview = () => {
  const storedQuestions =
    localStorage.getItem("interviewQuestions");

  if (!storedQuestions || !storedQuestions.trim()) {
    alert(
      "Please upload your resume and generate interview questions first."
    );
    return;
  }

  navigate("/interview");
};

  const handleViewResults = () => {
    navigate("/results");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ============================================================
  // GET SCORE FROM INTERVIEW
  // ============================================================

  const getInterviewScore = (interview) => {
    if (
      interview.evaluation &&
      typeof interview.evaluation.overall_score === "number"
    ) {
      return interview.evaluation.overall_score;
    }

    if (
      typeof interview.overallScore === "number"
    ) {
      return interview.overallScore;
    }

    return null;
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="dashboard-container">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="dashboard-header">

        <div>

          <h1 className="dashboard-heading">
            Welcome to AI Interview Coach 👋
          </h1>

          <p className="dashboard-subheading">
            Practice interviews, improve your answers,
            and get AI-powered feedback to become
            interview-ready.
          </p>

        </div>

        <button
          className="btn btn-danger"
          onClick={handleLogout}
        >
          Logout
        </button>

      </header>


      {/* ======================================================
          NAVIGATION
      ====================================================== */}

      <nav className="navbar">

        <div className="nav-brand">

          <div className="brand-badge">
            AI
          </div>

          AI Interview Coach

        </div>


        <div className="nav-links">

          <button
            className="nav-link active"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            Dashboard
          </button>


          <button
            className="nav-link"
            onClick={() =>
              navigate("/interview")
            }
          >
            Interview
          </button>


          <button
            className="nav-link"
            onClick={handleViewResults}
          >
            Results
          </button>

        </div>

      </nav>


      {/* ======================================================
          MAIN DASHBOARD GRID
      ====================================================== */}

      <section className="dashboard-main-grid">


        {/* ====================================================
            PRACTICE INTERVIEW CARD
        ==================================================== */}

        <div className="config-card">

          <div className="card-title-group">

            <div className="card-icon">
              🎤
            </div>

            <div>

              <h2 className="card-heading">
                Practice Interview
              </h2>

            </div>

          </div>


          <p className="dashboard-subheading">
            Start an AI-powered mock interview
            and receive feedback on your performance.
          </p>


          <div className="field-grid">

            <div className="form-group">

              <label className="form-label">
                Interview Type
              </label>

              <select className="form-select">

                <option>
                  Technical Interview
                </option>

                <option>
                  Behavioral Interview
                </option>

                <option>
                  Mixed Interview
                </option>

              </select>

            </div>


            <div className="form-group">

              <label className="form-label">
                Difficulty
              </label>

              <select className="form-select">

                <option>
                  Beginner
                </option>

                <option>
                  Intermediate
                </option>

                <option>
                  Advanced
                </option>

              </select>

            </div>

          </div>


          <div className="form-group">

            <label className="form-label">
              Focus Areas
            </label>


            <div className="role-badge-list">

              <span className="role-chip selected">
                Technical
              </span>

              <span className="role-chip">
                Behavioral
              </span>

              <span className="role-chip">
                Communication
              </span>

              <span className="role-chip">
                Problem Solving
              </span>

            </div>

          </div>


          <button
            className="btn btn-primary btn-block"
            onClick={handleStartInterview}
          >
            Start New Interview
          </button>

        </div>


        {/* ====================================================
            RESUME CARD
        ==================================================== */}

        <div className="resume-card">

          <div className="card-title-group">

            <div className="card-icon">
              📄
            </div>

            <div>

              <h2 className="card-heading">
                Your Resume
              </h2>

            </div>

          </div>


          <p className="dashboard-subheading">
            Upload your resume to personalize
            interview questions based on your experience.
          </p>


          <div className="file-upload-box">

            <div className="upload-icon">
              📄
            </div>

            <div className="upload-text">
              Upload your resume
            </div>

            <div className="upload-hint">
              PDF only
            </div>

          </div>


          {/* Hidden file input */}

          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf"
            style={{
              display: "none"
            }}
            onChange={handleResumeUpload}
          />


          <button
            className="btn btn-primary btn-block"
            onClick={() =>
              fileInputRef.current.click()
            }
          >
            Upload Resume
          </button>


          {/* Selected resume */}

          {resumeFile && (

            <div className="resume-selected">

              <span>
                📄
              </span>

              <div>

                <strong>
                  {resumeFile.name}
                </strong>

                <p>
                  Resume selected successfully
                </p>

              </div>

            </div>

          )}


          {/* Job Description */}

          <div className="form-group">

            <label className="form-label">
              Job Description
            </label>


            <textarea
              className="form-select"
              value={jobDescription}
              onChange={(e) =>
                setJobDescription(
                  e.target.value
                )
              }
              placeholder="Paste the job description here..."
              rows="5"
            />

          </div>


          {/* Analyze */}

          <button
            className="btn btn-primary btn-block"
            onClick={handleAnalyzeResume}
          >
            Analyze Resume & Generate Questions
          </button>

        </div>

      </section>


      {/* ======================================================
          STATISTICS
      ====================================================== */}

      <section className="stats-overview-grid">


        {/* Interviews */}

        <div className="stat-item">

          <span className="stat-title">
            Interviews
          </span>

          <span className="stat-value">
            {interviewHistory.length}
          </span>

          <span className="stat-change">
            Total interviews completed
          </span>

        </div>


        {/* Average Score */}

        <div className="stat-item">

          <span className="stat-title">
            Average Score
          </span>

          <span className="stat-value">

            {averageScore === "--"
              ? "--"
              : `${averageScore}%`}

          </span>

          <span className="stat-change">
            Your average interview score
          </span>

        </div>


        {/* Best Score */}

        <div className="stat-item">

          <span className="stat-title">
            Best Score
          </span>

          <span className="stat-value">

            {bestScore === "--"
              ? "--"
              : `${bestScore}%`}

          </span>

          <span className="stat-change">
            Your highest interview score
          </span>

        </div>

      </section>


      {/* ======================================================
          RECENT INTERVIEWS
      ====================================================== */}

      <section className="history-card">


        <div className="card-title-group">

          <div className="card-icon">
            📊
          </div>

          <div>

            <h2 className="card-heading">
              Recent Interviews
            </h2>

          </div>

        </div>


        <table className="history-table">

          <thead>

            <tr>

              <th>
                Interview
              </th>

              <th>
                Date
              </th>

              <th>
                Score
              </th>

            </tr>

          </thead>


          <tbody>

            {interviewHistory.length === 0 ? (

              <tr>

                <td colSpan="3">

                  No interviews yet.
                  Start your first mock
                  interview to see your
                  performance here.

                </td>

              </tr>

            ) : (

              interviewHistory
                .slice()
                .reverse()
                .slice(0, 5)
                .map((interview, index) => {

                  const score =
                    getInterviewScore(
                      interview
                    );

                  return (

                    <tr
                      key={
                        interview.id ||
                        index
                      }
                    >

                      <td>
                        Mock Interview
                      </td>


                      <td>

                        {interview.date
                          ? new Date(
                              interview.date
                            ).toLocaleDateString()
                          : "--"}

                      </td>


                      <td>

                        {typeof score === "number"
                          ? `${Math.round(score)}%`
                          : "--"}

                      </td>

                    </tr>

                  );

                })

            )}

          </tbody>

        </table>


        <button
          className="btn btn-primary"
          onClick={handleStartInterview}
          style={{
            marginTop: "1.25rem"
          }}
        >
          Start Your First Interview
        </button>

      </section>

    </div>
  );
}

export default Dashboard;