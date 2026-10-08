import { useState } from "react";
import Login from "./login.jsx";
import Signup from "./Signup.jsx";
import ResumeMatch from "./ResumeMatch.jsx";

function App() {
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
const [showResumeMatch, setShowResumeMatch] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (event) => {
    event.preventDefault();

    if (!role || !location || !experience) {
      setError("Please select all search options.");
      return;
    }

    setLoading(true);
    setError("");
    setJobs([]);

    try {
      const params = new URLSearchParams();

      params.append("job_role", role);
      params.append("location", location);
      params.append("experience", experience);

      const response = await fetch(
        `http://127.0.0.1:8000/api/jobs?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();

      console.log("Jobs received:", data);

      setJobs(data.jobs);
    } catch (err) {
      console.error("Search error:", err);
      setError(
        "Unable to connect to the job server. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // Signup page
  if (showSignup) {
    return (
      <Signup
        onSignup={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
        onBackToLogin={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />
    );
  }

  // Login page
  if (showLogin) {
    return (
      <Login
        onLogin={(user) => {
          setCurrentUser(user);
          setShowLogin(false);
        }}
        onCreateAccount={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
      />
    );
  }
  if (showResumeMatch && selectedJob) {
  return (
    <ResumeMatch
      job={selectedJob}
      onBack={() => {
        setShowResumeMatch(false);
        setSelectedJob(null);
      }}
    />
  );
}

  return (
    <div className="app">

      <header className="navbar">

        <div className="logo">
          JobMatch <span>AI</span>
        </div>

        <nav>
          <a href="#jobs">Jobs</a>
          <a href="#applications">My Applications</a>
          <a href="#resume">Resume Match</a>
        </nav>

        {/* LOGIN / USER NAME */}
        {currentUser ? (
          <div className="user-menu">

            <span className="user-name">
              Hi, {currentUser.name}
            </span>

            <button
              className="login-btn"
              onClick={() => {
                setCurrentUser(null);
              }}
            >
              Logout
            </button>

          </div>
        ) : (
          <button
            className="login-btn"
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>
        )}

      </header>

      <main>

        <section className="hero">

          <div className="hero-content">

            <div className="badge">
              🚀 AI-Powered Job Search
            </div>

            <h1>
              Find Jobs That
              <span> Match You</span>
            </h1>

            <p>
              Search job openings and use AI to check
              how well your resume matches each opportunity.
            </p>

            <form
              className="search-card"
              onSubmit={handleSearch}
            >

              <div className="field">

                <label>Job Role</label>

                <select
                  value={role}
                  onChange={(event) =>
                    setRole(event.target.value)
                  }
                >
                  <option value="">
                    Select Job Role
                  </option>

                  <option value="Data Analyst">
                    Data Analyst
                  </option>

                  <option value="Business Analyst">
                    Business Analyst
                  </option>

                  <option value="Data Scientist">
                    Data Scientist
                  </option>

                  <option value="Machine Learning Engineer">
                    Machine Learning Engineer
                  </option>

                  <option value="AI Engineer">
                    AI Engineer
                  </option>

                  <option value="Python Developer">
                    Python Developer
                  </option>

                  <option value="Java Developer">
                    Java Developer
                  </option>

                  <option value="Software Developer">
                    Software Developer
                  </option>

                  <option value="Full Stack Developer">
                    Full Stack Developer
                  </option>

                  <option value="Frontend Developer">
                    Frontend Developer
                  </option>

                  <option value="Backend Developer">
                    Backend Developer
                  </option>

                  <option value="SQL Developer">
                    SQL Developer
                  </option>

                  <option value="DevOps Engineer">
                    DevOps Engineer
                  </option>

                  <option value="Cloud Engineer">
                    Cloud Engineer
                  </option>

                  <option value="Power BI Developer">
                    Power BI Developer
                  </option>

                  <option value="QA Engineer">
                    QA Engineer
                  </option>

                </select>

              </div>


              <div className="field">

                <label>Location</label>

                <select
                  value={location}
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                >
                  <option value="">
                    Select Location
                  </option>

                  <option value="Pune">Pune</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Navi Mumbai">Navi Mumbai</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Noida">Noida</option>
                  <option value="Gurugram">Gurugram</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Jaipur">Jaipur</option>
                  <option value="Indore">Indore</option>
                  <option value="Nagpur">Nagpur</option>
                  <option value="Remote">Remote</option>

                  <option value="Work From Home">
                    Work From Home
                  </option>

                </select>

              </div>


              <div className="field">

                <label>Experience</label>

                <select
                  value={experience}
                  onChange={(event) =>
                    setExperience(event.target.value)
                  }
                >
                  <option value="">
                    Select Experience
                  </option>

                  <option value="Fresher">
                    Fresher
                  </option>

                  <option value="0-1 Years">
                    0 - 1 Years
                  </option>

                  <option value="1-2 Years">
                    1 - 2 Years
                  </option>

                  <option value="2-3 Years">
                    2 - 3 Years
                  </option>

                  <option value="3-5 Years">
                    3 - 5 Years
                  </option>

                  <option value="5-8 Years">
                    5 - 8 Years
                  </option>

                  <option value="8+ Years">
                    8+ Years
                  </option>

                </select>

              </div>


              <button
                className="search-btn"
                type="submit"
              >
                🔍 Search Jobs
              </button>

            </form>

          </div>

        </section>


        <section className="jobs-section" id="jobs">

          <div className="section-heading">

            <div>

              <h2>
                Latest Job Opportunities
              </h2>

              <p>
                Jobs matching your selected preferences.
              </p>

            </div>

            <span className="job-count">
              {jobs.length} Jobs
            </span>

          </div>


          {loading && (

            <div className="empty-jobs">

              <div className="empty-icon">
                ⏳
              </div>

              <h3>
                Searching for jobs...
              </h3>

              <p>
                Please wait while we find matching jobs.
              </p>

            </div>

          )}


          {error && !loading && (

            <div className="error-box">
              ❌ {error}
            </div>

          )}


          {!loading &&
            !error &&
            jobs.length === 0 && (

              <div className="empty-jobs">

                <div className="empty-icon">
                  🔍
                </div>

                <h3>
                  No jobs found
                </h3>

                <p>
                  Try changing your job role, location
                  or experience.
                </p>

              </div>

            )}


          {!loading && jobs.length > 0 && (

            <div className="job-list">

              {jobs.map((job) => (

                <div
                  className="job-card"
                  key={job.id}
                >

                  <div className="job-top">

                    <div>

                      <h3>
                        {job.title}
                      </h3>

                      <p className="company">
                        🏢 {job.company}
                      </p>

                    </div>

                    <span className="experience-badge">
                      {job.experience}
                    </span>

                  </div>


                  <div className="job-location">
                    📍 {job.location}
                  </div>


                  <p className="job-description">
                    {job.description}
                  </p>


                  <div className="skills">

                    {job.skills?.map((skill) => (

                      <span
                        className="skill"
                        key={skill}
                      >
                        {skill}
                      </span>

                    ))}

                  </div>


                  <div className="job-actions">

                    <a
                      href={job.apply_url}
                      target="_blank"
                      rel="noreferrer"
                      className="apply-btn"
                    >
                      Apply
                    </a>


                    <button
  className="match-btn"
  onClick={() => {
    setSelectedJob(job);
    setShowResumeMatch(true);
  }}
>
  🤖 Match Resume
</button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>


      <footer>

        <div>

          <strong>
            JobMatch AI
          </strong>

          <p>
            Find the right job. Match your resume.
            Apply with confidence.
          </p>

        </div>

        <p>
          © 2026 JobMatch AI
        </p>

      </footer>

    </div>
  );
}

export default App;