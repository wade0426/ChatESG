# pip install flask
from flask import Flask, request, jsonify, render_template
from title_classification import title_classification
from preamble import preamble
from SustainableGovernance import SustainableGovernance
import re

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



# 表示當用戶使用 POST 方法訪問 /send_message 路徑時，會執行 send_message 函數。
@app.route('/send_message', methods=['POST'])
# 用於處理發送訊息的請求，接收 JSON 格式的訊息，並返回處理後的結果。
def send_message():
    data = request.json
    print("Received data:", data)  # 打印接收到的所有數據，用於調試

    info_count = int(data.get('infoCount', 0)) # type: ignore
    group_count = int(data.get('groupCount', 0)) # type: ignore
    info_data = data.get('資訊', {}) # type: ignore
    groups_data = []

    for i in range(1, group_count + 1):
        group_key = f'group{i}'
        if group_key in data.get('章節', {}): # type: ignore
            groups_data.append(data['章節'][group_key]) ## type: ignore

    print(f"接收資訊：{info_data}")
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
    return jsonify(response)  # 直接返回 response 字典，jsonify 会自动使用双引号

# 修改生成 ESG 报告的函数
def generate_esg_report(groups_data, info_str="", preamble_str="", Sustainable_Governance_str=""):
    print("處理中...")

    print(f"有{len(groups_data)}個章節")
    # print(groups_data)

    # 處理章節內容
    for group in groups_data:
        # 取得章節名稱
        title_name = group['title']
        # 將章節名稱分類
        title_agent = title_classification(title_name)
        # title_agent = "長官的話"
        # title_agent = "無法分類"
        # print(f"暫時將AI功能關閉")
        # print(type(title_agent))
        
        # 取代 title_agent 所有不是中文字的內容
        title_agent = re.sub(r'[^\u4e00-\u9fff]', '', title_agent)
        
        # 提示
        print(f"章節名稱：{title_name} 分類：{title_agent}")

        if (title_agent == "長官的話"):
            tmp = preamble(group['content'], preamble_str=preamble_str)
            tmp = tmp.replace('\n', '<br> ')
            tmp = tmp.replace(' ', '')
            group['content'] = f"{tmp}"
            print("長官的話生成成功")
            # group['content'] = f"AI生成"

        elif title_agent == "公司簡介":
            group['content'] = f"處理後的內容：{group['content']}"

        elif (title_agent == "永續治理") or (title_agent == "永續治理公司"):
            tmp = SustainableGovernance(group['content'], Sustainable_Governance_str)
            tmp = tmp.replace('\n', '<br> ')
            tmp = tmp.replace(' ', '')
            group['content'] = f"{tmp}"
            print("永續治理生成成功")

        else:
            # group['content'] = f"無法分類：{group['content']}"
            group['content'] = f"無法分類：{title_agent}"

            

    print(groups_data)
    print(f"ESG 報告生成成功！")



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