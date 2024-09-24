# pip install flask
from flask import Flask, request, jsonify, render_template
from title_classification import title_classification
from preamble import preamble
from SustainableGovernance import SustainableGovernance
from generate_esg_report import generate_esg_report
from ftp import upload_file
import base64
# import io
# import re
# from ftplib import FTP

app = Flask(__name__)

# 訪問根目錄時，會執行 index 函數。
@app.route('/')
def index():
    return render_template('index.html')

# 用於切換瀏覽器
@app.route('/main')
def main():
    return render_template('main.html')

# 用於切換瀏覽器
@app.route('/edit')
def edit():
    return render_template('edit.html')

# 用於切換瀏覽器
@app.route('/chart')
def chart():
    return render_template('Chart.html')

# 表示當用戶使用 POST 方法訪問 /send_message 路徑時，會執行 send_message 函數。
@app.route('/send_message', methods=['POST'])
# 用於處理發送訊息的請求，接收 JSON 格式的訊息，並返回處理後的結果。
def send_message():
    data = request.json
    print("Received data:", data, "type:", type(data))  # 打印接收到的所有數據，於調試

    info_count = int(data.get('infoCount', 0)) # type: ignore
    group_count = int(data.get('groupCount', 0)) # type: ignore
    info_data = data.get('資訊', {}) # type: ignore
    groups_data = []

    for i in range(1, group_count + 1):
        group_key = f'group{i}'
        if group_key in data.get('章節', {}): # type: ignore
            groups_data.append(data['章節'][group_key]) ## type: ignore

    print(f"接收章節資訊：{info_data}")
    print(f"接收章節：{groups_data}")

    # 這裡可以調用函數處理數據
    info_str, preamble_str, Sustainable_Governance_str = process_info_data(info_data)
    generate_esg_report(groups_data, info_str, preamble_str, Sustainable_Governance_str)

    response = {
        # 暫時不回傳 info_str
        # "info": info_str,
        "groups": groups_data
    }

    print(f"Output: {response}")
    return jsonify(response)  # 直接返回 response 字典，jsonify 會自動使用雙引號


@app.route('/use-chart', methods=['POST'])
def use_chart():
    data = request.json
    image_data = data['imageData']
    
    # 移除 base64 編碼的前缀
    image_data = image_data.split(',')[1]
    
    # 解碼 base64 數據
    image_binary = base64.b64decode(image_data)

    res = upload_file(image_binary)
    if res:
        return jsonify({"message": "Chart saved successfully"}), 200
    else:
        return jsonify({"message": "Chart saved failed"}), 500
    

# 定義一個處理公司訊息的函數
def process_info_data(info_data):
    # 將 info_data 轉換成 "key: value, key: value" 的格式 資料型態為 str
    info_str = ", ".join([f"{key}: {value}" for key, value in info_data.items()])
    preamble_str = ", ".join([f"{key}: {value}" for key, value in info_data.items() if key in ["公司名稱", "成立時間", "報告年度", "公司簡介", "公司願景與使命", "核心價值觀"]])
    Sustainable_Governance_str = ", ".join([f"{key}: {value}" for key, value in info_data.items() if key in ["公司名稱", "報告年度", "公司簡介", "永續發展委員會設立", "永續發展委員會成員", "永續發展委員會職責", "永續發展政策和守則", "核心價值觀"]])
    
    print(f"轉換後的公司訊息：{info_str}")
    # print(f"轉換後的資料型態：{type(info_str)}")

    return info_str, preamble_str, Sustainable_Governance_str




if __name__ == '__main__':
    app.run(debug=True)  # 啟動 Flask 服務