from ftplib import FTP

# 連接到 FTP 伺服器
ftp = FTP('files.000webhost.com')
ftp.login(user='lian-jw', passwd='Aa1212123.')

# 切換到目標目錄
ftp.cwd('/public_html/py_image')

# 上傳文件
import os

# 獲取當前腳本的絕對路徑
script_dir = os.path.dirname(os.path.abspath(__file__))
# 構建test.jpg的完整路徑
file_path = os.path.join(script_dir, 'test.jpg')

try:
    with open(file_path, 'rb') as file:
        ftp.storbinary('STOR test.jpg', file)
except FileNotFoundError:
    print(f"錯誤：文件 '{file_path}' 不存在。")
except Exception as e:
    print(f"發生錯誤：{str(e)}")

# 關閉連接
ftp.quit()
