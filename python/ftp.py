from ftplib import FTP
import io

def upload_file(image_binary):
    try:
        # 使用FTP將圖表上傳到檔案伺服器
        ftp = FTP('files.000webhost.com')
        ftp.login(user='lian-jw', passwd='Aa1212123.')

        # 切換到目標目錄
        ftp.cwd('/public_html/py_image')

        # 將圖表數據上傳到FTP伺服器
        ftp.storbinary('STOR chart123.png', io.BytesIO(image_binary))

        # 關閉FTP連接
        ftp.quit()
    except Exception as e:
        print(f"上傳圖表時發生錯誤: {e}")
        return False
    return True

