import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

// Define the response schema strictly
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    score: {
      type: Type.NUMBER,
      description: "0-10 score, where 0 is terrible/risky and 10 is perfect/safe.",
    },
    verdict: {
      type: Type.STRING,
      description: "A short, punchy 2-4 word advice, e.g., '快跑', '可以买', '霸王条款'.",
    },
    summary: {
      type: Type.STRING,
      description: "A one-sentence summary of the overall finding.",
    },
    risks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Name of the ingredient, clause, or issue." },
          explanation: { type: Type.STRING, description: "Plain language explanation of why it is bad. No jargon." },
          severity: { type: Type.STRING, enum: ["high", "medium", "low"] },
        },
        required: ["title", "explanation", "severity"],
      },
    },
  },
  required: ["score", "verdict", "summary", "risks"],
};

export const analyzeImage = async (base64Image: string, mimeType: string): Promise<AnalysisResult> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key is missing. Please check your environment.");
    }

    const ai = new GoogleGenAI({ apiKey });

    // Use gemini-2.0-flash-exp for reliable multimodal analysis
    const modelId = "gemini-2.0-flash-exp";

    const prompt = `
      Role: 你是一位拥有20年经验的【跨领域鉴别专家】(精通食品化学、合同法、消费心理学)。你的使命是帮助普通消费者打破信息不对称，避免被商家忽悠。
      
      Task: 分析用户上传的这张图片（可能是配料表、合同、体检报告、租房协议等）。
      
      Requirements:
      1. 识别核心风险：忽略无关废话，直接找出对用户不利的成分、条款或指标。
      2. 说人话：用大白话解释为什么这个不好。例如：不要只说“添加了苯甲酸钠”，要说“加了防腐剂，且这类防腐剂对儿童不太友好”。
      3. 风格：客观、犀利、像个老练的内行人。不要模棱两可。
      4. 评分：0分最差（极度危险/坑人），10分最好（非常安全/良心）。
      
      Please return the response in strictly valid JSON format matching the schema provided.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: base64Image } },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.4, // Lower temperature for more objective analysis
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from Gemini.");
    }

    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};