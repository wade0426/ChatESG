import base64
import os

def process_chapter_data(group_data, ImageCount):
    processed_group = group_data.copy()
    
    # 處理圖表數據
    if 'charts' in processed_group:
        for chart in processed_group['charts']:
            # 處理圖片描述
            if 'imageDescription' in chart:
                chart['imageDescription'] = process_image_description(chart['imageDescription'])
            
            # 處理base64圖片數據
            if 'base64' in chart:
                base64_string = chart['base64']
                if base64_string.startswith('data:image'):
                    base64_string = base64_string.split(',')[1]

                # 解碼 Base64 字符串
                image_data = base64.b64decode(base64_string)

                # 指定一個新的目錄來保存文件
                save_dir = os.path.join(f"{os.getcwd()}", 'temp_image')
                os.makedirs(save_dir, exist_ok=True)

                # 將圖片數據保存為文件
                with open(os.path.join(save_dir, f'{ImageCount.image_count}.png'), 'wb') as file:
                    file.write(image_data)

                print(f"圖片已成功保存為 {os.path.join(save_dir, f'{ImageCount.image_count}.png')}")
                chart['base64'] = os.path.join(save_dir, f'{ImageCount.image_count}.png')
                ImageCount.add_image_count()
    
    # 處理章節內容
    if 'content' in processed_group:
        processed_group['content'] = process_content(processed_group['content'])
    
    return processed_group

def process_image_description(description):
    # 在這裡添加處理圖片描述的邏輯
    # 例如：去除多餘空格，添加標點符號等
    return description.strip()

# def process_base64_image(base64_data, image_count):
#     # 在這裡添加處理base64圖片數據的邏輯
#     # 例如：壓縮圖片，調整大小等
#     return base64_data

def process_content(content):
    # 在這裡添加處理章節內容的邏輯
    # 例如：格式化文本，檢查錯別字等
    return content.strip()