from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from typing import Any
import tempfile
import os
import uuid

from db.session import get_db
from api.deps import get_current_user
from db import models
from core.cv_analyzer import analyze_squat_video

router = APIRouter()

@router.post("/upload-video")
async def upload_video_assessment(
    file: UploadFile = File(...),
    current_user: models.Athlete = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Upload a video for Live Assessment.
    The video is processed by OpenCV/Mediapipe to count squats.
    """
    if not file.content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="File provided is not a video.")
        
    # Create a temporary file to save the uploaded video
    # OpenCV needs a real file path on disk to read from
    try:
        suffix = os.path.splitext(file.filename)[1]
        if not suffix:
            suffix = ".mp4"
            
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp_video:
            content = await file.read()
            temp_video.write(content)
            temp_video_path = temp_video.name
            
        # Run ML Analysis
        try:
            analysis_result = analyze_squat_video(temp_video_path)
        except Exception as e:
            # Clean up temp file on ML failure
            os.unlink(temp_video_path)
            raise HTTPException(status_code=500, detail=f"Error processing video: {str(e)}")
            
        # Clean up temp file after successful ML processing
        os.unlink(temp_video_path)
        
        # In a real app, we would upload the video to AWS S3 here
        # For now, we just save the result to the database
        
        # 1. Create or get an AssessmentTest definition for Squats
        test_def = db.query(models.AssessmentTest).filter(models.AssessmentTest.name == "Squat (CV)").first()
        if not test_def:
            test_def = models.AssessmentTest(
                name="Squat (CV)",
                description="Live video AI squat analysis",
                unit="reps"
            )
            db.add(test_def)
            db.flush()
            
        # 2. Create an AthleteAssessment session
        assessment = models.AthleteAssessment(
            athlete_id=current_user.id,
            status=models.AssessmentStatusEnum.COMPLETED
        )
        db.add(assessment)
        db.flush()
        
        # 3. Create the AssessmentResult
        result = models.AssessmentResult(
            assessment_id=assessment.id,
            test_id=test_def.id,
            recorded_value=float(analysis_result["reps_counted"]),
            ai_analysis_data=analysis_result
        )
        db.add(result)
        db.commit()
        db.refresh(result)
        
        return {
            "message": "Video processed successfully",
            "analysis": analysis_result,
            "result_id": result.id
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/my-results")
def get_my_results(
    current_user: models.Athlete = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all assessment results for the currently logged-in athlete.
    """
    results = db.query(models.AssessmentResult)\
        .join(models.AthleteAssessment)\
        .filter(models.AthleteAssessment.athlete_id == current_user.id)\
        .order_by(models.AthleteAssessment.created_at.desc() if hasattr(models.AthleteAssessment, 'created_at') else models.AthleteAssessment.started_at.desc())\
        .all()
        
    response = []
    for r in results:
        response.append({
            "id": r.id,
            "test_name": r.test.name,
            "score": r.recorded_value,
            "unit": r.test.unit,
            "date": r.assessment.started_at.strftime("%Y-%m-%d"),
            "ai_feedback": r.ai_analysis_data.get("feedback", "") if r.ai_analysis_data else None
        })
        
    return response
