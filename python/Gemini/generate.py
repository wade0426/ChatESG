"""
Install the Google AI Python SDK

$ pip install google-generativeai
"""

import os
from dotenv import load_dotenv
import google.generativeai as genai
from google.api_core import exceptions as google_exceptions

# 加載環境變量
load_dotenv()

# 獲取兩個API密鑰
api_key_1 = os.getenv("GEMINI_API_KEY_1")
api_key_2 = os.getenv("GEMINI_API_KEY_2")
api_key_3 = os.getenv("GEMINI_API_KEY_3")

# 當前使用的API密鑰
current_api_key = api_key_3

def switch_api_key():
    global current_api_key
    if current_api_key == api_key_1:
        current_api_key = api_key_2
        print(f"切換到新的API密鑰: GEMINI_API_KEY_2")

    elif current_api_key == api_key_2:
        current_api_key = api_key_3
        print(f"切換到新的API密鑰: GEMINI_API_KEY_3")

    elif current_api_key == api_key_3:
        current_api_key = api_key_1
        print(f"切換到新的API密鑰: GEMINI_API_KEY_1")
    genai.configure(api_key=current_api_key)

try:
    genai.configure(api_key=current_api_key)
except Exception as e:
    print(f"取得Gemini API Key發生錯誤，請檢查.env文件是否正確: {e}")

# 創建模型（保持不變）
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-pro",
    generation_config=generation_config,
)

def gemini_generate_response(title, prompt_content, info_message):
    global current_api_key
    # API調用失敗 最大重試次數為3(3組API)。處理暫時性錯誤，提高程序的穩定性
    max_retries = 3
    for attempt in range(max_retries):
        try:
            if title == "長官的話":
                print("*長官的話*生成中...")
                response = model.generate_content([
                    f"{prompt_content}",
                    f"input: {info_message}",
                    "output: ",
                ])
                return response.text
            
            elif title == "永續績效":
                print("*永續績效*生成中...")
                response = model.generate_content([
                    f"{prompt_content}",
                    f"input: {info_message}",
                    "output: ",
                ])
                response_text = response.text.replace("#", "").replace("*", "")
                return response_text
            
            elif title == "永續績效v3":
                print("*永續績效v3*生成中...")
                response = model.generate_content([
                    f"{prompt_content}",
                    "input: 公司名稱: 彰化銀行& 環境: 2022 年共計 34 個營業單位參與「全面汰換為 LED 照明設備」策略，預估節省約 184.55 公噸 CO2e。& 社會: 員工發展：員工取得外語證照之比率將從 2022 年的 24% 提升至 2023 年的 25%，並於 2027 年達到 33%。客戶滿意度：2022 年網路銀行客戶滿意度調查中，「企業網銀及企業行動網」獲 87.61% 滿意以上評價；「個人網銀及彰銀行動網」使用滿意度達 87.79%。供應鏈管理：2022 年新供應商簽署供應商社會責任承諾書及自評表，簽署率達 100%。& 治理:公司治理：在臺灣證券交易所第 8 屆及第 9 屆公司治理評鑑中名列整體上市公司前 5%，金融保險類前 4 名。資訊安全：推動 ISO27001 資安管理系統升版作業，APP 通過資安檢測，取得工業局合檢證書，認證標章數量達 90%。& 榮耀與肯定:責任投資：2022 年投資國內上市櫃公司 45 家，其中入選道瓊永續指數 (DJSI) 及臺灣永續指數成份股 32 家，投資金額占比約為 79.14%。",
                    "output: 公司治理: 在臺灣證券交易所股份有限公司第 8 屆及第 9 屆公司治理評鑑名列整體上市公司前 5%，金融保險類前 4 名。責任投資: 2022 年投資國內上市櫃公司 45 家，其中入選道瓊永續指數 (DJSI) 及臺灣永續指數成份股共 32 家，投資金額占比約為 79.14%。溫室氣體減量: 2022 年共計 34 個營業單位參與「全面汰換為 LED 照明設備」策略，預估節省約 184.55 公噸 CO2e。員工發展：員工取得外語證照之比率將從 2022 年的 24% 提升至 2023 年的 25%，並於 2027 年達到 33%。資訊安全：推動資訊安全管理系統 ISO27001 升版作業，並透過每年複審，確保證書有效性。行動應用程式 (APP) 通過資安檢測，並取得工業局合檢證書及認證標章數量達 90%(含)以上。客戶滿意度：2022 年度客戶滿意度調查前三名依序為「服務態度及專業能力」、「整體服務滿意度」及「金融商品滿意度」。2022 年網路銀行客戶滿意度調查，「企業網銀及企業行動網」獲 87.61% 滿意以上評價；「個人網銀及彰銀行動網」使用滿意度獲 87.79% 滿意以上的評價。供應鏈管理：2022 年新供應商簽署供應商社會責任承諾書及自評表，簽署率達 100%。",
                    "input: 公司名稱: 京城銀行& 環境:從碳排放量指標來看，2020 年的碳排放量為 2,344 t-CO2e，2021 年為 2,123 t-CO2e，而 2022 年增至 2,306 t-CO2e。& 社會:員工教育訓練的時數平均達到 54.48 小時。& 治理:在 ESG 永續產業的放款佔比達到 9.26%，並於 2022 年正式成為「赤道原則」會員。至於每股盈餘，2020 年為 NT$4.90，2021 年為 NT$5.02，但在 2022 年下降至 NT$1.98。& 榮耀與肯定",
                    "output: 京城銀行在 ESG 永續產業的放款佔比達到 9.26%，並於 2022 年正式成為「赤道原則」會員。從碳排放量指標來看，2020 年的碳排放量為 2,344 t-CO2e，2021 年為 2,123 t-CO2e，而 2022 年增至 2,306 t-CO2e。至於每股盈餘，2020 年為 NT$4.90，2021 年為 NT$5.02，但在 2022 年下降至 NT$1.98。此外，員工教育訓練的時數平均達到 54.48 小時。",
                    f"input: {info_message}",
                    "output: ",
                ])
                response_text = response.text.replace("#", "").replace("*", "")
                return response_text
            
            elif title == "永續績效v4":
                print("*永續績效v4*生成中...")
                response = model.generate_content([
                    f"{prompt_content}",
                    "input: 公司名稱:\n彰化銀行\n\n環境:\n2022 年共計 34 個營業單位參與「全面汰換為 LED 照明設備」策略，預估節省約 184.55 公噸 CO2e。\n\n社會:\n員工發展：員工取得外語證照之比率將從 2022 年的 24% 提升至 2023 年的 25%，並於 2027 年達到 33%。\n客戶滿意度：2022 年網路銀行客戶滿意度調查中，「企業網銀及企業行動網」獲 87.61% 滿意以上評價；「個人網銀及彰銀行動網」使用滿意度達 87.79%。\n供應鏈管理：2022 年新供應商簽署供應商社會責任承諾書及自評表，簽署率達 100%。\n\n治理:\n公司治理：在臺灣證券交易所第 8 屆及第 9 屆公司治理評鑑中名列整體上市公司前 5%，金融保險類前 4 名。\n資訊安全：推動 ISO27001 資安管理系統升版作業，APP 通過資安檢測，取得工業局合檢證書，認證標章數量達 90%。\n\n榮耀與肯定:\n責任投資：2022 年投資國內上市櫃公司 45 家，其中入選道瓊永續指數 (DJSI) 及臺灣永續指數成份股 32 家，投資金額占比約為 79.14%。",
                    "output: 公司治理: 在臺灣證券交易所股份有限公司第 8 屆及第 9 屆公司治理評鑑名列整體上市公司前 5%，金融保險類前 4 名。責任投資: 2022 年投資國內上市櫃公司 45 家，其中入選道瓊永續指數 (DJSI) 及臺灣永續指數成份股共 32 家，投資金額占比約為 79.14%。溫室氣體減量: 2022 年共計 34 個營業單位參與「全面汰換為 LED 照明設備」策略，預估節省約 184.55 公噸 CO2e。員工發展：員工取得外語證照之比率將從 2022 年的 24% 提升至 2023 年的 25%，並於 2027 年達到 33%。資訊安全：推動資訊安全管理系統 ISO27001 升版作業，並透過每年複審，確保證書有效性。行動應用程式 (APP) 通過資安檢測，並取得工業局合檢證書及認證標章數量達 90%(含)以上。客戶滿意度：2022 年度客戶滿意度調查前三名依序為「服務態度及專業能力」、「整體服務滿意度」及「金融商品滿意度」。2022 年網路銀行客戶滿意度調查，「企業網銀及企業行動網」獲 87.61% 滿意以上評價；「個人網銀及彰銀行動網」使用滿意度獲 87.79% 滿意以上的評價。供應鏈管理：2022 年新供應商簽署供應商社會責任承諾書及自評表，簽署率達 100%。",
                    "input: 公司名稱:\n京城銀行\n\n環境:\n2020 年的碳排放量為 2,344 t-CO2e，2021 年為 2,123 t-CO2e，而 2022 年增至 2,306 t-CO2e。\n\n社會:\n員工教育訓練的時數平均達到 54.48 小時。\n\n治理:\n1.ESG 永續產業的放款佔比達到 9.26%。\n2.每股盈餘，2020 年為 NT$4.90，2021 年為 NT$5.02，但在 2022 年下降至 NT$1.98。\n\n榮耀與肯定 : \n2022 年正式成為「赤道原則」會員。",
                    "output: 京城銀行在 ESG 永續產業的放款佔比達到 9.26%，並於 2022 年正式成為「赤道原則」會員。從碳排放量指標來看，2020 年的碳排放量為 2,344 t-CO2e，2021 年為 2,123 t-CO2e，而 2022 年增至 2,306 t-CO2e。至於每股盈餘，2020 年為 NT$4.90，2021 年為 NT$5.02，但在 2022 年下降至 NT$1.98。此外，員工教育訓練的時數平均達到 54.48 小時。",
                    "input: 公司名稱:\n台中銀行\n\n環境:\n環境永續：推動綠色金融與環境保護措施。\n\n社會:\n1.員工照顧：重視員工健康、安全及職業發展。\n2.社會公益：積極參與社會慈善活動，促進社會關懷。\n\n治理:\n1.台中銀行從事企業經營時，積極實踐永續發展，並將環境、社會、與公司治理的議題納入營運管理。\n2.永續治理：推動公司治理，建立完善的治理制度。\n3.客戶權益：強化金融產品與服務，保障客戶權益。\n4.台中銀行採用了多項國際永續性標準，諸如TCFD（氣候相關財務揭露）、SASB（永續會計準則委員會）等，以提升其永續發展表現。",
                    "output: 台中銀行從事企業經營時，積極實踐永續發展，並將環境、社會、與公司治理的議題納入營運管理。其永續發展策略延伸至以下五大主軸：永續治理：推動公司治理，建立完善的治理制度。客戶權益：強化金融產品與服務，保障客戶權益。環境永續：推動綠色金融與環境保護措施。員工照顧：重視員工健康、安全及職業發展。社會公益：積極參與社會慈善活動，促進社會關懷。此外，台中銀行採用了多項國際永續性標準，諸如TCFD（氣候相關財務揭露）、SASB（永續會計準則委員會）等，以提升其永續發展表現。",
                    "input: 公司名稱:\n高雄銀行\n\n環境:\n1.溫室氣體盤查通過第三方查證，且達成了每年1%的溫室氣體減量與節電目標。\n2.本行積極推出多元化的綠色金融產品，推動客戶在環保和社會責任領域的轉型，並連續多年提升股東的投資回報。\n\n社會:\n1.高雄銀行成立於1961年，作為高雄地區的在地銀行，專注於支持地方經濟發展和企業融資需求。\n2.企業使命是提供卓越金融服務，促進地方經濟繁榮。\n    \n治理:\n1.核心業務涵蓋商業銀行服務、企業金融、個人理財、資本市場服務及國際金融等多領域。\n2.高雄銀行的價值觀包括誠信經營、穩健發展和創新求變。\n3.本行在全台設有眾多分行，並積極拓展國際市場，持續擴展經營版圖 。",
                    "output: 高雄銀行在永續發展方面取得了多項顯著成就，涵蓋經濟、社會和環境等多個層面。2022年，本行在綠色金融、社會責任以及治理機制方面不斷強化，並成功實現了溫室氣體減排目標，溫室氣體盤查通過第三方查證，且達成了每年1%的溫室氣體減量與節電目標。本行積極推出多元化的綠色金融產品，推動客戶在環保和社會責任領域的轉型，並連續多年提升股東的投資回報雄銀行成立於1961年，作為高雄地區的在地銀行，專注於支持地方經濟發展和企業融資需求。核心業務涵蓋商業銀行服務、企業金融、個人理財、資本市場服務及國際金融等多領域。企業使命是提供卓越金融服務，促進地方經濟繁榮。高雄銀行的價值觀包括誠信經營、穩健發展和創新求變。本行在全台設有眾多分行，並積極拓展國際市場，持續擴展經營版圖 。",
                    f"input: {info_message}",
                    "output: ",
                ])
                response_text = response.text.replace("#", "").replace("*", "")
                return response_text

            else:
                print("通用分類")
                return "通用分類"
        
        except google_exceptions.ResourceExhausted as e:
            if "500" in str(e):
                print(f"網路錯誤，請再次嘗試 Error(500): {e}")
                return f"網路錯誤，請再次嘗試 Error(500): {e}"
            
            elif "429" in str(e) and attempt < max_retries - 1:
                print(f"API請求超過限制。正在切換API密鑰並重試。錯誤: 429")
                switch_api_key()
        
        except google_exceptions.ServiceUnavailable as e:
            print(f"Gemini API服務暫時不可用。請稍後再試。錯誤: {e}")
            return f"Gemini API服務暫時不可用。請稍後再試。錯誤: {e}"
        
        except Exception as e:
            print(f"生成響應時發生錯誤: {str(e)}")
            return f"生成響應時發生錯誤: {str(e)}"

    return "嘗試所有API密鑰後仍無法生成響應。"

if __name__ == "__main__":
    print("當前路徑:", os.getcwd())
    os.chdir("../")
    print("當前路徑:", os.getcwd())