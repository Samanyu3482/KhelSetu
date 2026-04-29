import cv2
import mediapipe as mp
import numpy as np
import tempfile
import os

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

def calculate_angle(a, b, c):
    """
    Calculate the angle between three points.
    Points are typically (x, y) coordinates of body landmarks.
    """
    a = np.array(a) # First
    b = np.array(b) # Mid (Vertex)
    c = np.array(c) # End
    
    radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
    angle = np.abs(radians*180.0/np.pi)
    
    if angle > 180.0:
        angle = 360 - angle
        
    return angle

def analyze_squat_video(video_path: str):
    """
    Reads a video file, uses Mediapipe to track the pose,
    and counts the number of valid squats performed.
    Returns the total rep count and diagnostic data.
    """
    cap = cv2.VideoCapture(video_path)
    
    # Check if video opened successfully
    if not cap.isOpened():
        raise Exception(f"Error opening video stream or file: {video_path}")

    # Variables for squat tracking
    counter = 0 
    stage = None # "up" or "down"
    
    # Setup mediapipe instance
    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
        while cap.isOpened():
            ret, frame = cap.read()
            
            # Break if video is over
            if not ret:
                break
            
            # Recolor image to RGB for mediapipe
            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            image.flags.writeable = False
          
            # Make detection
            results = pose.process(image)
            
            # Extract landmarks
            try:
                landmarks = results.pose_landmarks.landmark
                
                # Get coordinates for Left Hip, Knee, and Ankle
                hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
                knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
                ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]
                
                # Calculate the knee angle
                angle = calculate_angle(hip, knee, ankle)
                
                # Squat counting logic
                if angle > 160:
                    stage = "up"
                if angle < 100 and stage == 'up':
                    stage = "down"
                    counter += 1
                    
            except:
                pass # Landmarks might not be visible in this frame
                
    cap.release()
    
    return {
        "exercise": "Squat",
        "reps_counted": counter,
        "status": "success",
        "feedback": f"Great job! We counted {counter} squats." if counter > 0 else "We couldn't detect any complete squats. Ensure your full body is in the frame and go deep enough."
    }
