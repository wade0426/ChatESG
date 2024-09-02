from flask import Flask, request, jsonify, render_template

app = Flask(__name__)

# 訪問根目錄時，會執行 index 函數。
@app.route('/')
def index():
    return render_template('index.html')

# 表示當用戶使用 POST 方法訪問 /send_message 路徑時，會執行 send_message 函數。
@app.route('/send_message', methods=['POST'])
# 用於處理發送訊息的請求，接收 JSON 格式的訊息，並返回處理後的結果。
def send_message():
    data = request.json
    print("Received data:", data)  # 打印接收到的所有數據，用於調試
    # 輸出 Received data: {'groupCount': 3, 'group1': {'title': '前言a', 'content': 'a'}, 'group2': {'title': '關於公司', 'content': 'a'}, 'group3': {'title': '公司治理', 'content': 'a'}}

    # 如果 groupCount 不存在，則預設為 0
    group_count = data.get('groupCount', 0)
    groups_data = []

    for i in range(1, group_count + 1):
        group_key = f'group{i}'
        if group_key in data:
            groups_data.append(data[group_key])

    # 輸出 處理數據：[{'title': '前言a', 'content': 'a'}, {'title': '關於公司', 'content': 'a'}, {'title': '公司治理', 'content': 'a'}]
    print(f"處理數據：{groups_data}")

    # 這裡你可以處理接收到的數據
    # 例如，你可以將數據傳遞給一個函數來生成 ESG 報告
    generate_esg_report(groups_data)

    # 暫時的示例響應
    response = f"Received {group_count} groups of data. Processing..."
    response = f"{groups_data}"

    print(f"Output: {response}")
    
    # 
    return jsonify({"response": response})

# 用於切換瀏覽器
@app.route('/main')
def main():
    return render_template('main.html')

# 生成 ESG 報告的函數
def generate_esg_report(groups_data):
    print("處理中...")

    # 先將標題分類
    import title_classification
    obj = title_classification
    print(obj.title_classification("前言"))
    
    # groups_data = [{'title': '前言a', 'content': 'a'}, {'title': '關於公司', 'content': 'a'}, {'title': '公司治理', 'content': 'a'}]
    # 將 每一個 content 加入 "hello" 字串
    for group in groups_data:
        group['content'] = f"hello {group['content']}"
    # print(f"ESG 報告生成成功！")


if __name__ == '__main__':
    app.run(debug=True)  # 啟動 Flask 服務