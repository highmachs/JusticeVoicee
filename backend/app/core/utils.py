import shutil

def validate_audio_file(filename: str) -> bool:
    """
    Validates if the uploaded file is a supported audio format.
    """
    valid_extensions = {'.wav', '.mp3', '.m4a', '.aac', '.ogg'}
    return any(filename.lower().endswith(ext) for ext in valid_extensions)

def save_upload_file(upload_file, destination):
    try:
        with open(destination, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
    finally:
        upload_file.file.close()
