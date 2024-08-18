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

    group_count = data.get('groupCount', 0)
    groups_data = []

    for i in range(1, group_count + 1):
        group_key = f'group{i}'
        if group_key in data:
            groups_data.append(data[group_key])

    # 這裡你可以處理接收到的數據
    # 例如，你可以將數據傳遞給一個函數來生成 ESG 報告
    # response = generate_esg_report(groups_data)

    # 暫時的示例響應
    response = f"Received {group_count} groups of data. Processing..."

    print(f"Output: {response}")
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(debug=True)