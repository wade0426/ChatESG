from ftplib import FTP
import io
import os
from dotenv import load_dotenv

load_dotenv()

ftp_user = os.getenv("FTP_USER")
ftp_password = os.getenv("FTP_PASSWORD")


def upload_openai_api_record(record_file_path):
    try:
        # 使用FTP將記錄上傳到檔案伺服器
        ftp = FTP('files.000webhost.com')
        ftp.login(user=ftp_user, passwd=ftp_password)

        # 切換到目標目錄
        ftp.cwd('/public_html/OpenAI')

        # 讀取記錄文件內容
        with open(record_file_path, 'rb') as file:
            file_content = file.read()

        # 將記錄上傳到FTP伺服器
        ftp.storbinary('STOR record.txt', io.BytesIO(file_content))

        # 關閉FTP連接
        ftp.quit()
        print("記錄上傳成功")
        return True
    
    except Exception as e:
        print(f"上傳記錄時發生錯誤: {e}")
        return False