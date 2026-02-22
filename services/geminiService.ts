import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateTravelResponse = async (userPrompt: string): Promise<string> => {
  if (!apiKey) {
    return "Désolé, la clé API n'est pas configurée. Je ne peux pas répondre pour le moment.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: `Tu es un guide touristique expert et chaleureux du Sénégal, travaillant pour "Senegal Excursion".
        Ton but est d'aider les touristes à planifier leurs visites et suggérer des excursions.
        
        Règles:
        1. Sois toujours poli, accueillant et enthousiaste.
        2. Mets en avant les services de chauffeur privé.
        3. Les destinations phares sont : Dakar/Gorée, Sine-Saloum, Fathala, Réserve de Bandia, Mbour, Village.
        4. Si on te demande des prix, invite l'utilisateur à contacter le chauffeur via WhatsApp pour un devis.
        5. Tes réponses doivent être concises (max 3 paragraphes).
        `,
        temperature: 0.7,
      }
    });

    return response.text || "Je n'ai pas pu générer de réponse. Veuillez réessayer.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Une erreur est survenue lors de la communication avec l'assistant. Veuillez vérifier votre connexion.";
  }
};