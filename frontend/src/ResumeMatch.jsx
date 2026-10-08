import { useState } from "react";

function ResumeMatch({ job, onBack }) {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF or DOC/DOCX resume.");
      event.target.value = "";
      return;
    }

    setResume(file);
    setResult(null);
    setError("");
  };

  const handleMatch = async () => {
    if (!resume) {
      alert("Please upload your resume first.");
      return;
    }

    if (!job.description) {
      alert("Job description is not available for this job.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const formData = new FormData();

      // Resume file
      formData.append("resume", resume);

      // Actual job description
      formData.append(
        "job_description",
        job.description
      );

      const response = await fetch(
        "http://127.0.0.1:8000/api/match-resume",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Resume matching failed."
        );
      }

      setResult(data);

    } catch (error) {
      console.error("Resume matching error:", error);

      setError(
        error.message ||
        "Unable to connect to the resume matching server."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-match-page">

      <div className="resume-match-container">

        {/* Back Button */}
        <button
          className="back-button"
          onClick={onBack}
        >
          ← Back to Jobs
        </button>

        {/* Header */}
        <div className="resume-match-header">

          <h1>Resume Match</h1>

          <p>
            Check how well your resume matches this job.
          </p>

        </div>

        {/* Selected Job */}
        <div className="selected-job-card">

          <h2>{job.title}</h2>

          <p className="selected-company">
            🏢 {job.company}
          </p>

          <p className="selected-location">
            📍 {job.location}
          </p>

          {job.experience && (
            <p className="selected-experience">
              💼 Experience: {job.experience}
            </p>
          )}

        </div>

        {/* Job Description */}
        <div className="job-description-card">

          <h2>📋 Job Description</h2>

          <p>
            {job.description ||
              "Job description not available."}
          </p>

        </div>

        {/* Upload Card */}
        <div className="upload-card">

          <div className="upload-icon">
            📄
          </div>

          <h2>Upload Your Resume</h2>

          <p>
            Upload your latest resume in PDF or DOC/DOCX format.
          </p>

          {/* File Upload */}
          <label className="upload-area">

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />

            <div className="upload-content">

              <div className="upload-cloud">
                ☁️
              </div>

              <h3>
                Upload your resume
              </h3>

              <p>
                Drag & drop your resume here or click to browse
              </p>

              <span className="choose-file-button">
                📁 Choose Resume
              </span>

              <small>
                PDF, DOC or DOCX
              </small>

            </div>

          </label>

          {/* Selected File */}
          {resume && (
            <div className="selected-file">

              <strong>
                📄 Selected Resume:
              </strong>

              <span>
                {resume.name}
              </span>

            </div>
          )}

          {/* Error */}
          {error && (
            <div className="match-error">
              ❌ {error}
            </div>
          )}

          {/* Match Button */}
          <button
            className="match-resume-button"
            onClick={handleMatch}
            disabled={loading}
          >
            {loading
              ? "⏳ Analyzing Resume..."
              : "🤖 Match My Resume"}
          </button>

        </div>

        {/* =========================
            MATCH RESULT
        ========================= */}

        {result && (
          <div className="match-result">

            <div className="result-header">

              <h2>
                🎯 Resume Match Result
              </h2>

              <p>
                Analysis based on your resume and this job description.
              </p>

            </div>

            {/* Score */}
            <div className="score-card">

              <div className="score-circle">

                <span className="score-number">
                  {result.score}
                </span>

                <span className="score-out-of">
                  /100
                </span>

              </div>

              <div className="score-details">

                <h3>
                  Match Score
                </h3>

                <p>
                  {result.score >= 80
                    ? "🔥 Excellent Match"
                    : result.score >= 60
                    ? "👍 Good Match"
                    : result.score >= 40
                    ? "⚠️ Moderate Match"
                    : "❌ Low Match"}
                </p>

              </div>

            </div>

            {/* Matched Skills */}
            <div className="result-section">

              <h3>
                ✅ Matched Skills
              </h3>

              {result.matched_skills &&
              result.matched_skills.length > 0 ? (

                <div className="skill-list">

                  {result.matched_skills.map(
                    (skill, index) => (
                      <span
                        className="matched-skill"
                        key={index}
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>

              ) : (

                <p className="no-result">
                  No matching skills found.
                </p>

              )}

            </div>

            {/* Missing Skills */}
            <div className="result-section">

              <h3>
                ⚠️ Missing Skills
              </h3>

              {result.missing_skills &&
              result.missing_skills.length > 0 ? (

                <div className="skill-list">

                  {result.missing_skills.map(
                    (skill, index) => (
                      <span
                        className="missing-skill"
                        key={index}
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>

              ) : (

                <p className="no-result">
                  🎉 No major missing skills detected.
                </p>

              )}

            </div>

            {/* Suggestions */}
            <div className="result-section">

              <h3>
                💡 Resume Suggestions
              </h3>

              {result.suggestions &&
              result.suggestions.length > 0 ? (

                <ul className="suggestion-list">

                  {result.suggestions.map(
                    (suggestion, index) => (
                      <li key={index}>
                        {suggestion}
                      </li>
                    )
                  )}

                </ul>

              ) : (

                <p>
                  Your resume looks good for this position.
                </p>

              )}

            </div>

          </div>
        )}

        {/* Features */}
        {!result && (
          <div className="match-info">

            <h3>
              What you'll get
            </h3>

            <div className="match-features">

              <div>
                <span>🎯</span>

                <strong>
                  Match Score
                </strong>

                <p>
                  Get a score from 0 to 100.
                </p>
              </div>

              <div>
                <span>✅</span>

                <strong>
                  Matched Skills
                </strong>

                <p>
                  See the skills already present in your resume.
                </p>
              </div>

              <div>
                <span>⚠️</span>

                <strong>
                  Missing Skills
                </strong>

                <p>
                  Find important skills missing from your resume.
                </p>
              </div>

              <div>
                <span>💡</span>

                <strong>
                  Suggestions
                </strong>

                <p>
                  Get suggestions to improve your resume.
                </p>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default ResumeMatch;