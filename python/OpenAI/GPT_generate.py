from openai import OpenAI
import time
import os
from dotenv import load_dotenv
from ftp import upload_openai_api_record

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")

model = "gpt-4o-mini-2024-07-18"

# 設置OpenAI API密鑰
client = OpenAI(
    api_key=api_key,
)

def calculate_price(input_tokens, output_tokens, model, start_time):
    # 定義不同模型的價格
    model_prices = {
        "gpt-4o-mini-2024-07-18": {"input": 0.003, "output": 0.012},
        # 可以在這裡添加其他模型的價格
    }
    
    # 獲取當前模型的價格,如果模型不在列表中,使用默認價格
    model_price = model_prices.get(model, {"input": 0.003, "output": 0.012})
    
    # 計算價格
    input_price = (input_tokens / 1000) * model_price["input"]
    output_price = (output_tokens / 1000) * model_price["output"]
    total_price = input_price + output_price
    
    # 計算使用時間
    duration = time.time() - start_time
    
    # 打開 record.txt 文件並寫入記錄
    record_file_path = "python/OpenAI/record.txt"
    with open(record_file_path, "a") as file:
        file.write(f"{time.strftime('%Y/%m/%d-%H:%M:%S')}, {input_price:.6f}, {output_price:.6f}, {total_price:.6f}, {model}, {input_tokens}, {output_tokens}, {api_key[:3]}***{api_key[-3:]}, {duration:.2f}\n")
    
    # 將記錄上傳到FTP
    if upload_openai_api_record(record_file_path):
        print("記錄上傳成功")
    else:
        print("記錄上傳失敗")
    
    return total_price

def openai_generate(prompt):
    start_time = time.time()
    try:
        response = client.chat.completions.create(
            model=model,
            # 隨機性
            temperature=0.5,
            # 最大數出token數
            max_tokens=3,
            messages=[
                {
                    "role": "user",
                    "content": f"{prompt}",
                }
            ],
        )
    except Exception as e:
        return f"An error occurred: {str(e)}"
    
    # 調用計算價格函數
    price = calculate_price(response.usage.prompt_tokens, response.usage.completion_tokens, model, start_time)
    
    return response.choices[0].message.content, price

# 使用示例
if __name__ == "__main__":
    user_prompt = "输出:no"
    result, price = openai_generate(user_prompt)
    print(f"生成的內容: {result}")
    print(f"API調用價格: ${price:.6f}")
