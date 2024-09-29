"""
Install the Google AI Python SDK

$ pip install google-generativeai
$ pip install python-dotenv
"""

import os
from dotenv import load_dotenv
import google.generativeai as genai # type: ignore

try:
    # 從專案根目錄的 .env 文件中讀取環境變數
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
except Exception as e:
    print(f"取得Gemini API Key發生錯誤，請檢查.env檔案是否正確: {e}")

# genai.configure(api_key=os.environ["GEMINI_API_KEY"])
genai.configure(api_key=api_key)

# Create the model
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 200,
  "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config, # type: ignore
  # safety_settings = Adjust safety settings
  # See https://ai.google.dev/gemini-api/docs/safety-settings
)

def title_classification(title):
  response = model.generate_content([
    "你只會輸出最多6個字，例如：\"關於本公司\"、\"長官的話\"、\"無法分類\"",
    "input: 總經理的話",
    "output: 使用者輸入「總經理的話」，通常這樣的話會涉及公司的整體戰略方向、管理層的願景或政策。這種內容大多屬於高階管理人員或領導層的發言，因此，根據標題分類器的邏輯，我可以將其歸類為 '長官的話'。",
    "input: 公司簡介",
    "output: 使用者輸入「公司簡介」，這類標題通常用來介紹公司本身，涵蓋其歷史、使命、願景、核心業務、業務範圍、服務範圍或市場定位。這些內容一般歸類為對公司進行概述和背景介紹。 根據標題分類器的邏輯，這樣的內容應該被歸類為 '關於本公司'。",
    "input: 營運成果",
    "output: 使用者輸入「營運成果」，這種報告一般會涉及公司的業務績效和財務表現，可能包括收入、成本、利潤等關鍵數據。根據標題分類器的邏輯，這樣的內容應該歸類為 '營運績效'。",
    
    f"input: {title}",
    "output: ",
  ])
    
  return response.text

if __name__ == "__main__":
  # input_title = "前言"
  # input_title = "業務範圍"
  input_title = "營運表現"
  print(title_classification(input_title))