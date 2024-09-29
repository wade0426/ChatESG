import base64
import os

# ImageCount 是 ImageCount 類別的實例
def process_chapter_data(group_data, ImageCount):
    processed_group = group_data.copy()
    # {'group1': {'title': '長官的話', 'generatedResult': '中科金控秉持永續發展理念，致力創造企業價值，與社會共榮共好。 \n', 'charts': [{'base64': 'ht tp://127.0.0.1:5000/static/index_js/image/picture_file.png', 'imageTitle': '測試', 'imageDescription': '測試', 'url': ''}, {'base64': 'http://127.0.0.1:5000/ static/index_js/image/picture_file.png', 'imageTitle': '', 'imageDescription': '', 'url': ''}]}, 'group2': {'title': '測試', 'generatedResult': '測試', 'char ts': []}}
    # type:dict
    
    for group_key, group_data in processed_group.items():
        print(f"處理: {group_key}")
        print(f"Title: {group_data.get('title', 'No title')}")
        print(f"Generated Result: {group_data.get('generatedResult', 'No generated result')}")
        
        # 判斷 group_data 裡面 charts 是否長這樣 {'charts': []}
        if group_data['charts'] != []:
            for chart in group_data['charts']:
                # print(chart)
                if 'base64' in chart["base64"]:
                    base64_string = chart['base64']
                    if base64_string.startswith('data:image'):
                        base64_string = base64_string.split(',')[1]
                        chart['base64'] = process_base64_image(base64_string, ImageCount)
                    else:
                        print("沒有 data:image 可能不是圖片")
                        chart['base64'] = ""
                else:
                    chart['base64'] = ""
                
        else:
            print(f"{group_key} 裡面 charts 為空")
    
    print(processed_group,"\n\n")

    return processed_group

def process_image_description(description):
    # 在這裡添加處理圖片描述的邏輯
    # 例如：去除多餘空格，添加標點符號等
    return description.strip()

def process_base64_image(base64_data, ImageCount):
    # 在這裡添加處理base64圖片數據的邏輯
    # 例如：壓縮圖片，調整大小等

    # 將 base64_data 轉換為圖片
    # 處理圖表數據
    
    # 解碼 Base64 字符串
    from PIL import Image
    import io

    # 解碼 Base64 字符串
    image_data = base64.b64decode(base64_data)

    # 使用 PIL 打開圖片
    image = Image.open(io.BytesIO(image_data))

    # 獲取原始尺寸
    width, height = image.size

    # 計算新的尺寸（縮小 10%）
    new_width = int(width * 1)
    new_height = int(height * 1)

    # 調整圖片大小
    resized_image = image.resize((new_width, new_height), Image.LANCZOS)

    # 指定一個新的目錄來保存文件
    save_dir = os.path.join(f"{os.getcwd()}", 'temp_image')
    os.makedirs(save_dir, exist_ok=True)

    # 將調整後的圖片保存為文件
    path = os.path.join(save_dir, f'{ImageCount.get_image_count()}.png')
    resized_image.save(path)

    print(f"圖片已成功保存為 {path}")
    ImageCount.add_image_count()
    return path

def process_content(content):
    # 在這裡添加處理章節內容的邏輯
    # 例如：格式化文本，檢查錯別字等
    return content.strip()