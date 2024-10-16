# pip install flask 
from title_classification import title_classification
from Gemini.generate import * # type: ignore
import re

# 長官的話:["公司名稱", "公司歷史與成就", "經營成果與財務績效", "永續發展策略與目標", "氣候變遷與環境承諾", "數位轉型與創新", "社會責任與公益", "未來展望"]
# 永續績效 : ["環境", "社會", "治理"]
def process_info_message(title_name, info_data):

    # print(f"info_data: {info_data}")

    title_info_mapping = {
        "關於本報告書": ["公司名稱", "報告期間", "報告書範疇", "報告書撰寫原則", "聯絡資訊"],
        "長官的話": ["公司名稱", "公司歷史與成就", "經營成果與財務績效", "永續發展策略與目標", "氣候變遷與環境承諾", "數位轉型與創新", "社會責任與公益", "未來展望"],
        "永續績效_Bad": ["公司名稱", "環境", "社會", "治理", "榮耀與肯定"],
        "永續績效": ["公司名稱", "環境", "社會", "治理", "榮耀與肯定"],
        "永續績效v4": ["公司名稱", "環境", "社會", "治理", "榮耀與肯定"],
        "關於本公司": ["公司名稱", "產業類別", "總部位置", "成立日期", "資本額", "實收資本額", "資產總額", "員工人數", "股票代號", "業務範圍", "經營據點"],
        "經營績效": ["公司名稱", "營運績效", "財務績效"],
        "稅務管理": ["公司名稱", "稅務治理政策", "所得稅資訊", "國別稅務資訊"],
        "永續發展策略": ["公司名稱", "永續發展委員會", "永續策略主軸", "永續目標", "重大主題鑑別流程", "重大主題衝擊評估", "利害關係人鑑別", "利害關係人議和"],
    }
    
    if title_name in title_info_mapping:
        relevant_keys = title_info_mapping[title_name]
        info_message = "\n\n".join([f"{key}:\n {value}" for key, value in info_data.items() if key in relevant_keys])
    else:
        print("title_name 不在 title_info_mapping 中")
        info_message = "\n\n".join([f"{key}:\n {value}" for key, value in info_data.items()])
    
    return info_message


# 修改生成 ESG 報告的函數
def generate_esg_report(title_name, prompt, info_data):
    print("處理中...")

    # print(f"有{len(groups_data)}個章節")
    # print(groups_data)

    # AI 分類已被註解暫時關閉
    # title_agent = title_classification(title_name)
    title_agent = title_name

    # 取代 title_agent 所有不是中文字的內容
    # title_agent = re.sub(r'[^\u4e00-\u9fff]', '', title_agent)

    print(f"\n章節名稱：{title_name} 分類：{title_agent}")

    # 這邊使用 title_agent 而非 title_name
    info_message = process_info_message(title_agent, info_data)
    print(f"{title_agent} 的 info_message: {info_message}\n")
    prompt = "" if prompt == "使用預設" else prompt
    response = gemini_generate_response(title_agent, prompt, info_message)
    print(f"chapter: {title_agent} 生成完成\n")
    return response

    # if title_agent == "長官的話":
    #     info_message = process_info_message(title_name, info_data)
    #     print(f"{title_agent} 的 info_message: {info_message}\n")

    #     # generate_leader 在 generate.py 裡面
    #     response = generate_leader(prompt, info_message) # type: ignore
    #     print("長官的話生成完成")
    #     return response
    
    # elif title_agent == "永續績效":
    #     info_message = process_info_message(title_name, info_data)
    #     print(f"{title_agent} 的 info_message: {info_message}\n")

    #     # generate_leader 在 generate.py 裡面
    #     response = generate_SustainabilityPerformance(prompt, info_message) # type: ignore
    #     print("永續績效生成完成")
    #     return response

    # else:
    #     return "通用分類"
    


if __name__ == '__main__':
    # print(generate_leader("測試", "測試")) # type: ignore
    pass