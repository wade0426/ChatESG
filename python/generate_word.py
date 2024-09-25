# 會輸入這段程式，幫我生成 word 檔案
# 不同的title要加入換頁符號
# title 和 content 要換行
# title要有標題1的格式
# content 要有標題2的格式
# 圖片要放在 word 裡面
# 圖片要加上說明 說明要在圖片置中下方

# {'groups': [{'title': '關於本報告書', 'content': '無法分類：關於本報告書', 'charts': [{'base64': 'base64編碼的圖片', 'imageDescription': '圖', 'url': ''}, {'base64': 'base64編碼的圖片', 'imageDescription': '', 'url': ''}]}, {'title': '測試', 'content': '內文', 'charts': []}]}

# pip install python-docx Pillow
from docx import Document
from docx.shared import Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Pt
from PIL import Image
import os
import datetime

def generate_word_document(data):
    document = Document()
    
    for group in data['groups']:
        # 添加標題
        title = document.add_paragraph(group['title'])
        title.style = 'Heading 1'
        title.alignment = WD_ALIGN_PARAGRAPH.CENTER
        
        # 添加內文
        # 將 <br> 轉換成換行符
        content = document.add_paragraph(group['content'].replace('<br>', '\n'))
        content.style = 'Heading 2'
        
        # 添加圖片
        for chart in group['charts']:
            if chart['base64']:
                image_path = chart['base64']
                
                if os.path.exists(image_path):
                    # 添加圖片到文件
                    document.add_picture(image_path, width=Inches(6))
                    
                    # 添加圖片說明
                    if chart['imageDescription']:
                        caption = document.add_paragraph(chart['imageDescription'])
                        caption.alignment = WD_ALIGN_PARAGRAPH.CENTER
                        caption.runs[0].font.size = Pt(10)
                else:
                    print(f"警告: 圖片文件 {image_path} 不存在")
        
        # 在每個組（章節）結束後加換頁符
        document.add_page_break()
    
    # 指定一個新的目錄來保存文件
    save_dir = os.path.join(f"{os.getcwd()}", 'generated_reports')
    os.makedirs(save_dir, exist_ok=True)
    
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = os.path.join(save_dir, f'generated_report_{timestamp}.docx')
    
    try:
        document.save(filename)
        print(f"文件已保存為: {filename}")
    except PermissionError:
        print(f"無法保存文件 {filename}。請確保您有寫入權限。")
    except Exception as e:
        print(f"保存文件時發生錯誤: {str(e)}")




if __name__ == "__main__":
    # 示例數據
    sample_data = {
        'groups': [
            {
                'title': '關於本報告書',
                'content': '無法分類：關於本報告書',
                'charts': [
                    {'base64': 'D:\\NTCUST\\Project\\ESG\\ChatESG\\python\\temp_image\\0.png', 'imageDescription': '圖1', 'url': ''},
                    {'base64': 'D:\\NTCUST\\Project\\ESG\\ChatESG\\python\\temp_image\\2.png', 'imageDescription': '圖2', 'url': ''}
                ]
            },
            {
                'title': '測試',
                'content': '內文',
                'charts': []
            }
        ]
    }

    # 調用函數生成Word文件
    generate_word_document(sample_data)


