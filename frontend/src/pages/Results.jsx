import "./Results.css";
import { useNavigate } from "react-router-dom";

function Results() {
  const navigate = useNavigate();

  const storedResult = localStorage.getItem("latestInterview");

  const interviewResult = storedResult
    ? JSON.parse(storedResult)
    : null;

  const evaluation = interviewResult?.evaluation;

  // No interview completed yet
  if (!evaluation) {
    return (
      <div className="results-page">

        <section className="results-summary-card">

          <div className="summary-info">

            <span className="summary-tag">
              No Results Yet
            </span>

            <h1 className="summary-title">
              Interview Results
            </h1>

            <p className="summary-desc">
              Complete an interview to receive your
              AI-powered performance evaluation.
            </p>

          </div>

        </section>

        <div className="results-actions">

          <button
            className="btn btn-secondary"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/interview")}
          >
            Start Interview
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="results-page">

      {/* =========================
          RESULTS SUMMARY
      ========================== */}

      <section className="results-summary-card">

        <div className="summary-info">

          <span className="summary-tag">
            Interview Complete
          </span>

          <h1 className="summary-title">
            Interview Results
          </h1>

          <p className="summary-desc">
            Review your interview performance,
            strengths, and areas where you can improve.
          </p>

          {interviewResult?.date && (
            <p className="summary-desc">
              Completed on{" "}
              {new Date(interviewResult.date).toLocaleString()}
            </p>
          )}

        </div>


        {/* Overall Score */}

        <div className="score-circle-wrapper">

          <span className="score-number">
            {evaluation.overall_score}
          </span>

          <span className="score-max">
            Overall Score / 100
          </span>

        </div>

      </section>


      {/* =========================
          COMPETENCY SCORES
      ========================== */}

      <section className="competency-grid">

        {/* Technical */}

        <div className="competency-card">

          <div className="competency-header">

            <span className="competency-name">
              Technical Skills
            </span>

            <span className="competency-score">
              {evaluation.technical_score}/100
            </span>

          </div>

          <div className="progress-bar-bg">

            <div
              className="progress-bar-fill"
              style={{
                width: `${evaluation.technical_score}%`
              }}
            ></div>

          </div>

        </div>


        {/* Communication */}

        <div className="competency-card">

          <div className="competency-header">

            <span className="competency-name">
              Communication
            </span>

            <span className="competency-score">
              {evaluation.communication_score}/100
            </span>

          </div>

          <div className="progress-bar-bg">

            <div
              className="progress-bar-fill"
              style={{
                width: `${evaluation.communication_score}%`
              }}
            ></div>

          </div>

        </div>


        {/* Problem Solving */}

        <div className="competency-card">

          <div className="competency-header">

            <span className="competency-name">
              Problem Solving
            </span>

            <span className="competency-score">
              {evaluation.problem_solving_score}/100
            </span>

          </div>

          <div className="progress-bar-bg">

            <div
              className="progress-bar-fill"
              style={{
                width: `${evaluation.problem_solving_score}%`
              }}
            ></div>

          </div>

        </div>


        {/* Behavioral */}

        <div className="competency-card">

          <div className="competency-header">

            <span className="competency-name">
              Behavioral Skills
            </span>

            <span className="competency-score">
              {evaluation.behavioral_score}/100
            </span>

          </div>

          <div className="progress-bar-bg">

            <div
              className="progress-bar-fill"
              style={{
                width: `${evaluation.behavioral_score}%`
              }}
            ></div>

          </div>

        </div>

      </section>


      {/* =========================
          FEEDBACK
      ========================== */}

      <section className="insight-card">

        <div className="insight-header">

          <span className="insight-icon">
            💡
          </span>

          <h2>
            AI Coach Feedback
          </h2>

        </div>

        <p className="summary-desc">
          {evaluation.feedback}
        </p>

      </section>


      {/* =========================
          STRENGTHS + IMPROVEMENTS
      ========================== */}

      <section className="insights-grid">

        {/* Strengths */}

        <div className="insight-card">

          <div className="insight-header strengths-header">

            <span className="insight-icon">
              ✓
            </span>

            <h2>
              Strengths
            </h2>

          </div>

          <ul className="insight-list">

            {evaluation.strengths?.map(
              (strength, index) => (

                <li
                  className="insight-item"
                  key={index}
                >

                  <span className="bullet-dot bullet-green"></span>

                  <span>
                    {strength}
                  </span>

                </li>

              )
            )}

          </ul>

        </div>


        {/* Improvements */}

        <div className="insight-card">

          <div className="insight-header improvements-header">

            <span className="insight-icon">
              !
            </span>

            <h2>
              Areas to Improve
            </h2>

          </div>

          <ul className="insight-list">

            {evaluation.improvements?.map(
              (improvement, index) => (

                <li
                  className="insight-item"
                  key={index}
                >

                  <span className="bullet-dot bullet-amber"></span>

                  <span>
                    {improvement}
                  </span>

                </li>

              )
            )}

          </ul>

        </div>

      </section>


      {/* =========================
          ACTIONS
      ========================== */}

      <div className="results-actions">

        <button
          className="btn btn-secondary"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/interview")}
        >
          Practice Again
        </button>

      </div>

    </div>
  );
}

export default Results;