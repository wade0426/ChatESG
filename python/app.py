# pip install flask
from flask import Flask, request, jsonify, render_template
from title_classification import title_classification
# 從 Gemini 資料夾 引入 generate_leader
# from Gemini.leader_agent import generate_leader
from generate_esg_report import generate_esg_report
from ftp import upload_file
import base64
# import io
# import re
# from ftplib import FTP
from process_chapter_data import process_chapter_data
from generate_word import generate_word_document


class ImageCount:
    image_count = 0
    
    @classmethod
    def get_image_count(cls):
        return cls.image_count
    
    @classmethod
    def add_image_count(cls):
        cls.image_count += 1

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


# 表示當用戶使用 POST 方法訪問 /send_message 路徑時，會執行 send_message 函數。
@app.route('/send_message', methods=['POST'])
# 用於處理發送訊息的請求，接收 JSON 格式的訊息，並返回處理後的結果。
def send_message():
    data = request.json
    print("Received data:", data, "type:", type(data))  # 打印接收到的所有數據，於調試
    print()
    # Received data: {'infoCount': 2, 'groupCount': 1, '資訊': {'報告年度': '', '公司名稱': ''}, '章節': {'group1': {'title': '關於本報告書', 'prompt': '測試', 'generatedResult': '', 'charts': [{'base64': 'http://127.0.0.1:5000/static/index_js/image/picture_file.png', 'imageTitle': '圖表測試', 'imageDescription': '描述測試', 'url': ''}]}}} type: <class 'dict'>
    # 有改 修正圖表標題和描述

    info_count = int(data.get('infoCount', 0)) # type: ignore
    group_count = int(data.get('groupCount', 0)) # type: ignore
    # 用來存放公司訊息
    info_data = data.get('資訊', {}) # type: ignore
    # 用來存放章節
    groups_data = []

    # 處理章節數據
    for i in range(1, group_count + 1):
        group_key = f'group{i}'
        if group_key in data.get('章節', {}): # type: ignore
            group_data = data['章節'][group_key]
            # generate_esg_report(標題, prompt, info訊息)
            data['章節'][group_key]['generatedResult'] = generate_esg_report(data['章節'][group_key]['title'], data['章節'][group_key]['prompt'], info_data)

            
            # processed_group = process_chapter_data(group_data, ImageCount)
            # groups_data.append(processed_group)

    # print(f"公司訊息：{info_data}")
    # print()
    # print(f"章節：{groups_data}")
    # print()
    
    # 這裡可以調用函數處理數據
    # info_str, preamble_str, Sustainable_Governance_str = process_info_data(info_data)

    # leader_message = process_leader_message(info_data)

    # generate_esg_report(groups_data, leader_message)

    # word_data = {
    #     'groups': groups_data
    # }

    # print("\n word_data", word_data, "\n")

    # # 生成word檔案
    # generate_word_document(word_data)

    response = {
        # 暫時不回傳 info_str
        # "info": info_str,
        # "groups": groups_data
        "data": data
    }

    print(f"Output: {response}")
    return jsonify(response)  # 直接返回 response 字典，jsonify 會自動使用雙引號


# edit 頁面
@app.route('/generate_word', methods=['POST'])
def generate_word():
    # 生成word檔案
    data = request.json
    response = {
        "data": "測試word"
    }

    print(f"Output: {response}")
    return jsonify(response)  # 直接返回 response 字典，jsonify 會自動使用雙引號

@app.route('/again_generate_response', methods=['POST'])
def again_generate_response():
    data = request.json
    # 輸出 收到的 data
    print(f"Received data: {data}")
    response = {
        "data": "再次生成"
    }

    print(f"Output: {response}")
    return jsonify(response)  # 直接返回 response 字典，jsonify 會自動使用雙引號




# 處理長官的話
def process_leader_message(info_data):
    leader_message = ", ".join([f"{key}: {value}" for key, value in info_data.items() if key in ["公司名稱", "公司歷史與成就", "經營成果與財務績效", "永續發展策略與目標", "氣候變遷與環境承諾", "數位轉型與創新", "社會責任與公益", "未來展望"]])
    return leader_message

if __name__ == '__main__':
    app.run(debug=True)  # 啟動 Flask 服務