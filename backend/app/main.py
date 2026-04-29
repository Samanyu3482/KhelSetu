from fastapi import FastAPI,Depends,HTTPException
from sqlalchemy.orm import Session
from db.session import SessionLocal, get_db
from api.v1.endpoints import auth
from db import models



app = FastAPI()



app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])

@app.get("/")
def read_root():
    return {"message": "Hello World"}

@app.get("/db")
def get_db_test(db: Session = Depends(get_db)):
    try:
        # Example simple query: count athletes
        count = db.query(models.Athlete).count()
        return {"status": "success", "athlete_count": count}
    except Exception as e:
        # Something went wrong connecting to DB or querying
        raise HTTPException(status_code=500, detail=str(e))





