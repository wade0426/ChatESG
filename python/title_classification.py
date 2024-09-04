"""
Install the Google AI Python SDK

$ pip install google-generativeai
$ pip install python-dotenv
"""

import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

# .env
api_key = os.getenv("GEMINI_API_KEY")

# genai.configure(api_key=os.environ["GEMINI_API_KEY"])
genai.configure(api_key=api_key)

# Create the model
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 20,
  "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config = generation_config, # type: ignore
  # safety_settings = Adjust safety settings
  # See https://ai.google.dev/gemini-api/docs/safety-settings
)

# response = model.generate_content([
#   "你是一個標題分類器 你只會輸出標題 \"長官的話\", \"公司簡介\", \"營運績效\"",
#   "input: 總經理的話",
#   "output: 長官的話",
#   "input: CEO的話",
#   "output: 長官的話",
#   "input: 執行長的話",
#   "output: 長官的話",
#   "input: 主席的話",
#   "output: 長官的話",
#   "input: 高層的話",
#   "output: 長官的話",
#   "input: 管理層的話",
#   "output: 長官的話",
#   "input: 部門主管的話",
#   "output: 長官的話",
#   "input: 總裁的話",
#   "output: 長官的話",
#   "input: 長官的話",
#   "output: 長官的話",
#   "input: 前言",
#   "output: ​長官的話",
#   "input: 關於本公司",
#   "output: 公司簡介",
#   "input: 公司簡介",
#   "output: 公司簡介",
#   "input: 創辦人的話",
#   "output: 長官的話",
#   "input: 公司介紹",
#   "output: 公司簡介",
#   "input: 本公司概況",
#   "output: 公司簡介",
#   "input: 關於我們",
#   "output: 公司簡介",
#   "input: 我們的公司",
#   "output: 公司簡介",
#   "input: 公司背景",
#   "output: 公司簡介",
#   "input: 企業簡介",
#   "output: 公司簡介",
#   "input: 公司資訊",
#   "output: 公司簡介",
#   "input: 公司背景介紹",
#   "output: 公司簡介",
#   "input: 公司概覽",
#   "output: 公司簡介",
#   "input: 企業概況",
#   "output: 公司簡介",
#   "input: 關於我們公司",
#   "output: 公司簡介",
#   "input: 企業背景",
#   "output: 公司簡介",
#   "input: 公司介紹資料",
#   "output: 公司簡介",
#   "input: 營運成果",
#   "output: 營運績效",
#   "input: 營運表現",
#   "output: 營運績效",
#   "input: 營運效益",
#   "output: 營運績效",
#   "input: 營運回報",
#   "output: 營運績效",
#   "input: 業務表現",
#   "output: 營運績效",
#   "input: 經營效益",
#   "output: 營運績效",
#   "input: 企業表現",
#   "output: 營運績效",
#   "input: 營業成績",
#   "output: 營運績效",
#   "input: 財務績效",
#   "output: 營運績效",
#   "input: 營運狀況",
#   "output: ",
# ])

def title_classification(title):
  response = model.generate_content([
    "你是一個標題分類器 你只會輸出標題 \"長官的話\", \"公司簡介\", \"營運績效\", \"無法分類\"",
    "input: 總經理的話",
    "output: 長官的話",
    "input: CEO的話",
    "output: 長官的話",
    "input: 執行長的話",
    "output: 長官的話",
    "input: 主席的話",
    "output: 長官的話",
    "input: 高層的話",
    "output: 長官的話",
    "input: 管理層的話",
    "output: 長官的話",
    "input: 部門主管的話",
    "output: 長官的話",
    "input: 總裁的話",
    "output: 長官的話",
    "input: 長官的話",
    "output: 長官的話",
    "input: 前言",
    "output: ​長官的話",
    "input: 關於本公司",
    "output: 公司簡介",
    "input: 公司簡介",
    "output: 公司簡介",
    "input: 創辦人的話",
    "output: 長官的話",
    "input: 公司介紹",
    "output: 公司簡介",
    "input: 本公司概況",
    "output: 公司簡介",
    "input: 關於我們",
    "output: 公司簡介",
    "input: 我們的公司",
    "output: 公司簡介",
    "input: 公司背景",
    "output: 公司簡介",
    "input: 企業簡介",
    "output: 公司簡介",
    "input: 公司資訊",
    "output: 公司簡介",
    "input: 公司背景介紹",
    "output: 公司簡介",
    "input: 公司概覽",
    "output: 公司簡介",
    "input: 企業概況",
    "output: 公司簡介",
    "input: 關於我們公司",
    "output: 公司簡介",
    "input: 企業背景",
    "output: 公司簡介",
    "input: 公司介紹資料",
    "output: 公司簡介",
    "input: 營運成果",
    "output: 營運績效",
    "input: 營運表現",
    "output: 營運績效",
    "input: 營運效益",
    "output: 營運績效",
    "input: 營運回報",
    "output: 營運績效",
    "input: 業務表現",
    "output: 營運績效",
    "input: 經營效益",
    "output: 營運績效",
    "input: 企業表現",
    "output: 營運績效",
    "input: 營業成績",
    "output: 營運績效",
    "input: 財務績效",
    "output: 營運績效",
    f"input: {title}",
    "output: ",
  ])
  return response.text

print(title_classification(""))