"""
Install the Google AI Python SDK

$ pip install google-generativeai
"""

import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

genai.configure(api_key=api_key)

# Create the model
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
  # safety_settings = Adjust safety settings
  # See https://ai.google.dev/gemini-api/docs/safety-settings
)

def text_corrector(text):
    response = model.generate_content([
    "請移除多餘的空格和換行符, 保持語義完整：「確保段落分隔處的句子語義完整，不要打斷連貫的句子。」",
    "input: 2022年，在全球政經局勢動盪、氣候變遷加劇的挑戰下，彰化銀行秉持「根植本土、永續發展」的經營理念，將永續發展融入企業文化，致力於成為「最具企圖心之 \n優質金融集團」，為客戶、員工、股東及社會創造共同價值。\n\n聚焦ESG，深化永續治理\n\n我們依循聯合國永續發展目標(SDGs)和國際永續準則，積極回應利害關係人關注議題，將永續發展策略涵蓋環境、社會和治理(ESG)三大面向，並訂定明確的短、中、\n長期目標。\n\n2022年，我們完成了ISO 14064-1溫室氣體盤查，涵蓋範圍達100%，並簽署科學基礎減碳目標倡議(SBTi)，承諾2030年達成範疇1和2碳排放升溫控制在1.5°C內。我們 \n也積極推動綠色金融，簽署赤道原則，將ESG指標納入授信審核流程，並發行可持續發展債券，支持綠色產業發展。此外，彰化分行更完成碳中和轉型，並取得PAS 2060碳中和查證，成為推動永續金融的具體實踐。\n\n實踐社會責任，創造共好未來\n\n我們深信，企業的永續發展與社會福祉息息相關。我們長期關注社會公益，積極參與社區關懷活動，推動金融知識普及，並持續投入偏鄉教育及弱勢關懷，以實際行 \n動回饋社會。\n\n展望未來，彰化銀行將持續精進ESG各面向的作為，強化風險管理，深化公司治理，並積極與利害關係人溝通合作，發揮金融影響力，引導資金投入永續發展領域，共\n同為打造更美好的未來而努力。",
    "output: 2022年，在全球政經局勢動盪、氣候變遷加劇的挑戰下，彰化銀行秉持「根植本土、永續發展」的經營理念，將永續發展融入企業文化，致力於成為「最具企圖心之 優質金融集團」，為客戶、員工、股東及社會創造共同價值。\n\n聚焦ESG，深化永續治理\n\n我們依循聯合國永續發展目標(SDGs)和國際永續準則，積極回應利害關係人關注議題，將永續發展策略涵蓋環境、社會和治理(ESG)三大面向，並訂定明確的短、中、長期目標。\n\n2022年，我們完成了ISO 14064-1溫室氣體盤查，涵蓋範圍達100%，並簽署科學基礎減碳目標倡議(SBTi)，承諾2030年達成範疇1和2碳排放升溫控制在1.5°C內。我們也積極推動綠色金融，簽署赤道原則，將ESG指標納入授信審核流程，並發行可持續發展債券，支持綠色產業發展。此外，彰化分行更完成碳中和轉型，並取得PAS 2060碳中和查證，成為推動永續金融的具體實踐。\n\n實踐社會責任，創造共好未來\n\n我們深信，企業的永續發展與社會福祉息息相關。我們長期關注社會公益，積極參與社區關懷活動，推動金融知識普及，並持續投入偏鄉教育及弱勢關懷，以實際行動回饋社會。\n\n展望未來，彰化銀行將持續精進ESG各面向的作為，強化風險管理，深化公司治理，並積極與利害關係人溝通合作，發揮金融影響力，引導資金投入永續發展領域，共同為打造更美好的未來而努力。",
    f"input: {text}",
    "output: ",
    ])
    return response.text

print(text_corrector('''2022 年，彰化銀行秉持著「根植地方、厚植未來」的理念，將永續發展視為核心價值，致力於成為「最值得信賴的金融服務夥伴」。我們將永續發展目標融入公司願
景及策略方針，從「環境永續」、「社會參與」及「公司治理」三大面向，積極回應利害關係人期待，並接軌國際永續趨勢，深化 ESG 各面向作為，攜手員工、客戶
及社會大眾，共創美好未來。

在環境永續方面，我們積極響應國際倡議，於 2022 年簽署赤道原則，並承諾於 2030 年達成範疇一及範疇二碳排放升溫控制在 1.5°C 內的目標。同時，我們也完成
 ISO 14064-1 溫室氣體盤查，涵蓋範圍達 100%，並領先同業，取得彰化分行碳中和 PAS 2060 查證。此外，我們更發行可持續發展債券，將資金挹注於綠色產業， 
以金融影響力，促進產業綠色轉型。

在社會參與方面，我們持續關注社會議題，積極投入各項公益活動，包含關懷弱勢族群、推廣金融知識、培育在地人才等，更鼓勵員工參與志工服務，以實際行動回 
饋社會。

在公司治理方面，我們不斷精進公司治理架構，強化董事會職能，提升資訊透明度，並積極落實法令遵循及風險管理，以確保公司永續經營。

展望未來，彰化銀行將持續深耕 ESG 各面向作為，積極與利害關係人溝通合作，接軌國際永續趨勢，期許成為永續金融的領航者，為台灣社會及環境永續發展貢獻心
力。'''))