from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import requests

# Load environment variables
load_dotenv()

# Adzuna credentials
ADZUNA_APP_ID = os.getenv("ADZUNA_APP_ID")
ADZUNA_APP_KEY = os.getenv("ADZUNA_APP_KEY")

# FastAPI application
app = FastAPI(
    title="JobMatch AI API",
    description="Backend API for JobMatch AI",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Home route
@app.get("/")
def home():
    return {
        "message": "JobMatch AI API is running successfully!"
    }


# Live job search
@app.get("/api/jobs")
def get_jobs(
    job_role: str = "",
    location: str = "",
    experience: str = ""
):

    # Check API credentials
    if not ADZUNA_APP_ID or not ADZUNA_APP_KEY:
        return {
            "count": 0,
            "jobs": [],
            "error": "Adzuna API credentials are missing."
        }

    # Default values
    search_role = job_role.strip()
    search_location = location.strip()

    # Add experience to search keywords
    search_keywords = search_role

    if experience:
        search_keywords = f"{search_role} {experience}"

    # Adzuna India API
    url = "https://api.adzuna.com/v1/api/jobs/in/search/1"

    params = {
        "app_id": ADZUNA_APP_ID,
        "app_key": ADZUNA_APP_KEY,
        "what": search_keywords,
        "where": search_location,
        "results_per_page": 20,
        "content-type": "application/json"
    }

    try:

        response = requests.get(
            url,
            params=params,
            timeout=15
        )

        # API error
        if response.status_code != 200:
            return {
                "count": 0,
                "jobs": [],
                "error": f"Adzuna API error: {response.status_code}"
            }

        data = response.json()

        adzuna_jobs = data.get("results", [])

        jobs = []

        for index, job in enumerate(adzuna_jobs):

            company = job.get("company", {})
            job_location = job.get("location", {})

            jobs.append({
                "id": index + 1,
                "adzuna_id": job.get("id"),

                "title": job.get(
                    "title",
                    "Job Title Not Available"
                ),

                "company": company.get(
                    "display_name",
                    "Company Not Available"
                ),

                "location": job_location.get(
                    "display_name",
                    search_location
                ),

                "experience": experience if experience else "Not specified",

                "skills": [],

                "description": job.get(
                    "description",
                    "Job description not available."
                ),

                "apply_url": job.get(
                    "redirect_url",
                    "#"
                )
            })

        return {
            "count": len(jobs),
            "jobs": jobs
        }

    except requests.exceptions.Timeout:

        return {
            "count": 0,
            "jobs": [],
            "error": "Adzuna API request timed out."
        }

    except requests.exceptions.RequestException as e:

        return {
            "count": 0,
            "jobs": [],
            "error": f"Connection error: {str(e)}"
        }

    except Exception as e:

        return {
            "count": 0,
            "jobs": [],
            "error": f"Unexpected error: {str(e)}"
        }



        # ============================================================
# RESUME MATCHING
# ============================================================

import re
from io import BytesIO
from pypdf import PdfReader
from docx import Document


def extract_text_from_pdf(file_bytes):
    """Extract text from a PDF resume."""

    try:
        reader = PdfReader(BytesIO(file_bytes))

        text = ""

        for page in reader.pages:
            page_text = page.extract_text()

            if page_text:
                text += page_text + "\n"

        return text

    except Exception as e:
        raise Exception(f"Could not read PDF file: {str(e)}")


def extract_text_from_docx(file_bytes):
    """Extract text from a DOCX resume."""

    try:
        document = Document(BytesIO(file_bytes))

        text = ""

        for paragraph in document.paragraphs:
            if paragraph.text:
                text += paragraph.text + "\n"

        return text

    except Exception as e:
        raise Exception(f"Could not read DOCX file: {str(e)}")


def extract_resume_text(filename, file_bytes):
    """Detect file type and extract resume text."""

    filename = filename.lower()

    if filename.endswith(".pdf"):
        return extract_text_from_pdf(file_bytes)

    elif filename.endswith(".docx"):
        return extract_text_from_docx(file_bytes)

    elif filename.endswith(".doc"):
        raise Exception(
            "Old .doc files are not supported yet. "
            "Please upload PDF or DOCX."
        )

    else:
        raise Exception(
            "Unsupported file type. Please upload PDF or DOCX."
        )


def clean_text(text):
    """Convert text into searchable lowercase words."""

    text = text.lower()

    text = re.sub(r"[^a-zA-Z0-9+#. ]", " ", text)

    text = re.sub(r"\s+", " ", text)

    return text


def calculate_resume_match(resume_text, job_description):
    """
    Compare resume text with job description.

    This first version uses keyword/skill matching.
    """

    resume_clean = clean_text(resume_text)
    job_clean = clean_text(job_description)

    # Common Data / IT / Software skills
    skills = [
        "python",
        "sql",
        "mysql",
        "postgresql",
        "excel",
        "power bi",
        "tableau",
        "pandas",
        "numpy",
        "matplotlib",
        "seaborn",
        "data analysis",
        "data analytics",
        "machine learning",
        "deep learning",
        "artificial intelligence",
        "ai",
        "statistics",
        "power query",
        "databricks",
        "spark",
        "aws",
        "azure",
        "gcp",
        "docker",
        "kubernetes",
        "git",
        "github",
        "javascript",
        "html",
        "css",
        "react",
        "node.js",
        "node",
        "fastapi",
        "flask",
        "java",
        "c++",
        "mongodb",
        "database",
        "etl",
        "api",
        "rest api",
        "communication",
        "problem solving",
    ]

    # Find skills mentioned in the job description
    job_skills = []

    for skill in skills:
        if skill in job_clean:
            job_skills.append(skill)

    # Find which job skills exist in resume
    matched_skills = []

    for skill in job_skills:
        if skill in resume_clean:
            matched_skills.append(skill)

    # Missing skills
    missing_skills = [
        skill
        for skill in job_skills
        if skill not in resume_clean
    ]

    # Skill score
    if len(job_skills) > 0:
        skill_score = (
            len(matched_skills) / len(job_skills)
        ) * 100
    else:
        skill_score = 0

    # Extract important words from job description
    stop_words = {
        "the",
        "and",
        "for",
        "with",
        "that",
        "this",
        "from",
        "your",
        "you",
        "are",
        "our",
        "will",
        "have",
        "has",
        "job",
        "role",
        "work",
        "working",
        "years",
        "year",
        "experience",
        "required",
        "requirements",
        "using",
        "into",
        "their",
        "they",
        "them",
        "about",
        "who",
        "all",
        "can",
        "should",
        "must",
        "not",
        "but",
        "also",
        "such",
        "more",
        "than",
        "other",
        "we",
        "as",
        "an",
        "a",
        "to",
        "of",
        "in",
        "on",
        "is",
        "be",
        "or",
    }

    job_words = set(
        word
        for word in job_clean.split()
        if len(word) >= 4
        and word not in stop_words
    )

    resume_words = set(
        word
        for word in resume_clean.split()
        if len(word) >= 4
    )

    common_words = job_words.intersection(resume_words)

    if len(job_words) > 0:
        keyword_score = (
            len(common_words) / len(job_words)
        ) * 100
    else:
        keyword_score = 0

    # Give skills more importance than general keywords
    final_score = (
        (skill_score * 0.70)
        + (keyword_score * 0.30)
    )

    final_score = round(
        min(final_score, 100)
    )

    # Suggestions
    suggestions = []

    if missing_skills:
        suggestions.append(
            "Consider adding relevant missing skills: "
            + ", ".join(missing_skills[:8])
        )

    if final_score < 50:
        suggestions.append(
            "Your resume has a relatively low match with "
            "this job. Consider tailoring it specifically "
            "to the job description."
        )

    elif final_score < 75:
        suggestions.append(
            "Your resume has a moderate match. Add more "
            "job-specific skills and project experience."
        )

    else:
        suggestions.append(
            "Your resume has a strong match with this job."
        )

    if "project" not in resume_clean:
        suggestions.append(
            "Consider adding relevant projects with "
            "technologies and measurable results."
        )

    if "experience" not in resume_clean:
        suggestions.append(
            "Make your relevant experience clearly visible "
            "in your resume."
        )

    return {
        "score": final_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "suggestions": suggestions,
    }


@app.post("/api/match-resume")
async def match_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):

    if not resume.filename:
        raise HTTPException(
            status_code=400,
            detail="Resume file is required."
        )

    allowed_extensions = [
        ".pdf",
        ".docx",
        ".doc",
    ]

    filename = resume.filename.lower()

    if not any(
        filename.endswith(extension)
        for extension in allowed_extensions
    ):
        raise HTTPException(
            status_code=400,
            detail="Please upload PDF or DOCX resume."
        )

    try:
        # Read uploaded resume
        file_bytes = await resume.read()

        if not file_bytes:
            raise HTTPException(
                status_code=400,
                detail="Uploaded resume is empty."
            )

        # Extract resume text
        resume_text = extract_resume_text(
            resume.filename,
            file_bytes
        )

        if not resume_text.strip():
            raise HTTPException(
                status_code=400,
                detail=(
                    "Could not extract text from the resume. "
                    "Please upload a text-based PDF or DOCX."
                )
            )

        # Check job description
        if not job_description.strip():
            raise HTTPException(
                status_code=400,
                detail="Job description is required."
            )

        # Calculate match
        result = calculate_resume_match(
            resume_text,
            job_description
        )

        return {
            "success": True,
            "filename": resume.filename,
            "score": result["score"],
            "matched_skills": result["matched_skills"],
            "missing_skills": result["missing_skills"],
            "suggestions": result["suggestions"],
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )