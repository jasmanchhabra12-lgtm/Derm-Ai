import { GoogleGenAI } from "@google/genai";

function getAI() {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Gemini API key is not set. Please set NEXT_PUBLIC_GEMINI_API_KEY environment variable.",
    );
  }
  return new GoogleGenAI({ apiKey });
}

export async function analyzeSkinLesion(imageBase64: string, patientData: any) {
  const prompt = `
You are an expert dermatologist and an advanced AI diagnostic system.
Analyze the provided image of a skin lesion along with the patient's clinical data.

Patient Clinical Data:
- Age: ${patientData.age}
- Biological Gender: ${patientData.gender}
- Skin Type (Fitzpatrick): ${patientData.skinType}
- Personal History of Skin Cancer: ${patientData.personalHistory ? "Yes" : "No"}
- Family History of Skin Cancer: ${patientData.familyHistory ? "Yes" : "No"}
- Immunosuppressed: ${patientData.immunosuppressed ? "Yes" : "No"}
- New or Changing Lesion: ${patientData.newOrChanging ? "Yes" : "No"}
- Lab Results / Notes: ${patientData.notes || "None provided"}

Please provide a detailed report including:
1. **Differential Diagnosis**: List the top potential conditions (benign and malignant) based on visual features and clinical data.
2. **Visual Analysis**: Describe the lesion's characteristics (ABCDE criteria: Asymmetry, Border, Color, Diameter, Evolving).
3. **Biopsy Recommendation (Simulated Grad-CAM Insight)**: Identify the most suspicious region of this lesion that would yield the most diagnostically valuable tissue sample. Describe exactly where a biopsy should be taken.
4. **Preventative Care & Next Steps**: Recommend immediate actions, follow-up timelines, and preventative measures.
5. **Risk Level**: Conclude with a clear risk level (Low, Moderate, High).

Format the response in Markdown. Be professional, objective, and detailed.
`;

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageBase64.split(",")[1] || imageBase64,
          },
        },
        { text: prompt },
      ],
    },
  });

  return response.text || "";
}

export async function analyzeLongitudinal(
  images: { base64: string; date: string }[],
) {
  const prompt = `
You are an expert dermatologist and an advanced AI diagnostic system.
Analyze the following sequence of images of the same skin lesion taken over time.

The images are provided in chronological order.
Dates:
${images.map((img, i) => `Image ${i + 1}: ${img.date}`).join("\n")}

Please provide a detailed longitudinal analysis:
1. **Evolution Tracking**: Compare the images sequentially. Track changes in borders, color drift, size estimation, and any new satellite lesions.
2. **Timeline of Concern**: Flag exactly when and how the lesion started changing significantly.
3. **Clinical Recommendation**: Based on the evolution, what are the recommended next steps? Is a biopsy urgently needed?
4. **Risk Assessment**: How has the risk level changed over this period?

Format the response in Markdown. Be professional, objective, and detailed.
`;

  const parts: any[] = images.map((img) => ({
    inlineData: {
      mimeType: "image/jpeg",
      data: img.base64.split(",")[1] || img.base64,
    },
  }));

  parts.push({ text: prompt });

  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    contents: { parts },
  });

  return response.text || "";
}
