# pip install flask 
from title_classification import title_classification
from preamble import preamble
from SustainableGovernance import SustainableGovernance
import re

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
    pass