import os
import google.generativeai as genai

for m in genai.list_models():
    print(m.name)

import google.generativeai as genai
import json

genai.configure(api_key='AIzaSyBcAUoYO8pkXxcWoRpwBdlMXjKOopNJVHk')

# 初始化模型
model = genai.GenerativeModel('gemini-1.0-pro')

# 讀取 JSON 文件
#with open('cleaned_environmental_data_v4.json', 'r', encoding='utf-8') as f:
#    example_data = json.load(f)

# 選擇第一個字典（JSON 文件中的第一组數據）
#first_entry = example_data[0]

# 拼接需要的字詞
#example1 = first_entry["ESG 指導委員會主席的話"] + first_entry["ESG 委員會主席的話"]

# 生成内容
response = model.generate_content(["我是一間生產鋼鐵的公司，請幫我生成一段ESG報告的前言，介紹公司在促進可持續發展方面的努力，以及如何衡量和報告其影響。"], stream=True)

# 印出生成的回應
response.resolve()
print(response.text)
