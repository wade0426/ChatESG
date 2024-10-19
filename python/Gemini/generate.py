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
    # API調用失敗 最大重試次數為4(4組API)。處理暫時性錯誤，提高程序的穩定性
    max_retries = 4
    for attempt in range(max_retries):
        try:
            if title == "關於本報告書":
                print("*關於本報告書*生成中...")
                response = model.generate_content([
                    "請撰寫一篇企業ESG報告書中的\"關於本報告書\"，內容需全面介紹報告的目的、範圍、編制原則以及使用的方法和數據來源。語氣需正式且清晰，突出公司的透明度與誠信。\n\n內容要求：正式語氣與語言，內容應保持專業且正式，使用適當的專業術語，以展示報告的權威性與公信力。\n報告期間：說明ESG報告書的時間範圍。\n範疇與邊界：明確說明本報告的撰寫目的與範圍，若有範疇不一致之情形將於報告書中特別說明。\n編制原則：描述報告編制所遵循的原則，如準確性、相關性和透明度，確保報告內容的可靠性。\n聯絡資訊：使用條列式顯示。",
                    "input: 公司名稱:\n綠色金控\n\n報告期間:\n2024年\n\n報告書範疇:\n本報告書涵蓋的範疇包括 綠色金融控股公司及其全資子公司（綠色銀行、綠色證券、綠色人壽、綠色 投信、綠色 投顧）之企業永續發展實踐與成果。報告書中提到的「綠色金控」、或「本公司」皆指包含以上所有營運個體之整體。\n\n報告書撰寫原則:\n依據GRI，SASB，TCFD\n\n聯絡資訊:\nGreen Financial Holding Co., Ltd. 地址：106台北市大安區敦化南路一段233號10樓 電話：(02)2709-2888 傳真：(02)2709-2899 信箱：green@greenfinancial.com.tw 網站\n：www.greenfinancial.com.tw",
                    "output: 本報告書旨在全面闡述綠色金控於2024年度在環境（Environmental）、社會（Social）與公司治理（Governance）三大面向的績效表現、策略規劃與未來展望。我們致力於秉持透明與誠信的原則，向所有利益關係人清楚揭露綠色金控在永續發展方面的承諾與實踐成果。\n\n報告期間：\n\n本報告涵蓋之期間為2024年1月1日至2024年12月31日。部分內容因應報告主題或數據需求，涵蓋至報告發布日前最新之資料。\n\n範疇與邊界：\n\n本報告書範圍涵蓋綠色金融控股公司及其全資子公司（綠色銀行、綠色證券、綠色人壽、綠色投信、綠色投顧）。報告書中提到的「綠色金控」或「本公司」皆指包含以上所有營運個體之整體，若有範疇不一致之情形將於報告書中特別說明。\n\n編制原則：\n\n本報告書的編制遵循全球報告倡議組織（GRI）、永續會計準則委員會（SASB）以及氣候相關財務揭露工作小組（TCFD）的框架和指南，並參酌其他相關國際標準和最佳實務。我們致力於確保報告內容的準確性、相關性、完整性、平衡性和可比性，以提升報告的透明度和可信度。\n\n聯絡資訊：\n\n公司名稱： 綠色金融控股公司 (Green Financial Holding Co., Ltd.)\n地址： 106台北市大安區敦化南路一段233號10樓\n電話： (02)2709-2888\n傳真： (02)2709-2899\n信箱： green@greenfinancial.com.tw\n網站： www.greenfinancial.com.tw",
                    "input: 本報告書的目的是展現台中商業銀行(以下簡稱「台中銀行」或「本行」)實踐永續價值的精神。報告書涵蓋台中銀行在2022年1月1日至2022年12月31日期間的永續發展作為。報告書編制方法是依循以下標準：台灣證券交易所「上市公司編製與申報永續報告書作業辦法」、台灣證券交易所「上市上櫃公司永續發展實務守則」、全球永續性報告協會(GRI)發布之GRI通用準則與重大主題準則、永續會計準則委員會(SASB)發布之SASB準則、氣候相關財務揭露(TCFD)議題、聯合國永續發展目標(SDGs)",
                    "output: 本報告書旨在展現台中商業銀行（以下簡稱「台中銀行」或「本行」）於2022年度在環境（Environmental）、社會（Social）與公司治理（Governance）三大面向的永續發展績效、策略及未來展望，並闡述本行實踐永續價值的精神。透過本報告書，我們期盼與所有利害關係人溝通本行在永續發展方面的努力與承諾，並促進彼此之間的理解與信任。\n\n報告期間：\n\n本報告書涵蓋期間為2022年1月1日至2022年12月31日。\n\n範疇與邊界：\n\n本報告書內容涵蓋台中銀行及其子公司的永續發展作為。報告範圍聚焦於對本行營運及利害關係人影響最顯著之ESG議題。\n\n編制原則：\n\n本報告書依循以下標準編制，以確保資訊的完整性、正確性及透明度：\n\n台灣證券交易所「上市公司編製與申報永續報告書作業辦法」\n台灣證券交易所「上市上櫃公司永續發展實務守則」\n全球永續性報告協會（GRI）發布之GRI通用準則與重大主題準則\n永續會計準則委員會（SASB）發布之SASB準則\n氣候相關財務揭露（TCFD）建議\n聯合國永續發展目標（SDGs）\n\n聯絡資訊：\n\n(因使用者無提供相關聯絡資訊，請台中銀行自行填寫聯絡資訊，例如地址、電話、電子郵件地址、網站等)",
                    f"input: {info_message}",
                    "output: ",
                ])
                response_text = response.text.replace("#", "").replace("*", "")
                return response_text
            
            elif title == "長官的話":
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
                    "input: 公司名稱: 彰化銀行& 環境: 2022 年共計 34 個營業單位參與「全面汰換為 LED 照明設備」策略，預估節省約 184.55 公噸 CO2e。& 社會: 員工發展：員工取得外語證照之比率將從 2022 年的 24% 提升至 2023 年的 25%，並於 2027 年達到 33%。客戶滿意度：2022 年網路銀行客戶滿意度調查中，「企業網銀及企業行動網」獲 87.61% 滿意以上評價；「個人網銀及彰銀行動網」使用滿意度達 87.79%。供應鏈管理：2022 年新供應商簽署供應商社會責任承諾書及自評表，簽署率達 100%。& 治理:公司治理：在臺灣證券交易所第 8 屆及第 9 屆公司治理評鑑中名列整體上市公司前 5%，金融保險類前 4 名。資訊安全：推動 ISO27001 資安管理系統升版作業，APP 通過資安檢測，取得工業局合檢證書，認證標章數量達 90%。& 榮耀與肯定:責任投資：2022 年投資國內上市櫃公司 45 家，其中入選道瓊永續指數 (DJSI) 及臺灣永續指數成份股 32 家，投資金額占比約為 79.14%。",
                    "output: 公司治理: 在臺灣證券交易所股份有限公司第 8 屆及第 9 屆公司治理評鑑名列整體上市公司前 5%，金融保險類前 4 名。責任投資: 2022 年投資國內上市櫃公司 45 家，其中入選道瓊永續指數 (DJSI) 及臺灣永續指數成份股共 32 家，投資金額占比約為 79.14%。溫室氣體減量: 2022 年共計 34 個營業單位參與「全面汰換為 LED 照明設備」策略，預估節省約 184.55 公噸 CO2e。員工發展：員工取得外語證照之比率將從 2022 年的 24% 提升至 2023 年的 25%，並於 2027 年達到 33%。資訊安全：推動資訊安全管理系統 ISO27001 升版作業，並透過每年複審，確保證書有效性。行動應用程式 (APP) 通過資安檢測，並取得工業局合檢證書及認證標章數量達 90%(含)以上。客戶滿意度：2022 年度客戶滿意度調查前三名依序為「服務態度及專業能力」、「整體服務滿意度」及「金融商品滿意度」。2022 年網路銀行客戶滿意度調查，「企業網銀及企業行動網」獲 87.61% 滿意以上評價；「個人網銀及彰銀行動網」使用滿意度獲 87.79% 滿意以上的評價。供應鏈管理：2022 年新供應商簽署供應商社會責任承諾書及自評表，簽署率達 100%。",
                    "input: 公司名稱: 京城銀行& 環境:從碳排放量指標來看，2020 年的碳排放量為 2,344 t-CO2e，2021 年為 2,123 t-CO2e，而 2022 年增至 2,306 t-CO2e。& 社會:員工教育訓練的時數平均達到 54.48 小時。& 治理:在 ESG 永續產業的放款佔比達到 9.26%，並於 2022 年正式成為「赤道原則」會員。至於每股盈餘，2020 年為 NT$4.90，2021 年為 NT$5.02，但在 2022 年下降至 NT$1.98。& 榮耀與肯定",
                    "output: 京城銀行在 ESG 永續產業的放款佔比達到 9.26%，並於 2022 年正式成為「赤道原則」會員。從碳排放量指標來看，2020 年的碳排放量為 2,344 t-CO2e，2021 年為 2,123 t-CO2e，而 2022 年增至 2,306 t-CO2e。至於每股盈餘，2020 年為 NT$4.90，2021 年為 NT$5.02，但在 2022 年下降至 NT$1.98。此外，員工教育訓練的時數平均達到 54.48 小時。",
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