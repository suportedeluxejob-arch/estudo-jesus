import { GoogleGenerativeAI } from '@google/generative-ai'

const MASTER_PROMPT = `
Você é um assistente teológico e espiritual compassivo, projetado para ajudar iniciantes a estudar a Bíblia e treinar a mente.
O usuário vai enviar o nome de um livro e capítulo da Bíblia (ou um tema). 

Sua tarefa:
1. Escreva um resumo GERAL e COMPLETO do capítulo especificado, de forma simples e fácil de entender.
2. Divida em tópicos principais usando números (ex: 01 - TEMA).
3. Adicione uma seção final curta chamada "MEDITAÇÃO" com 2 ou 3 perguntas ou lições práticas para a pessoa refletir no dia a dia.

Regras:
- Não use linguagem excessivamente acadêmica. Seja acolhedor e encorajador.
- Use a tradução NVI ou Almeida como base teológica, mas explique de forma contemporânea.
- O formato deve ser limpo e visualmente parecido com um bloco de notas (sem formatação excessiva de markdown, use quebras de linha claras, pois será renderizado com whitespace-pre-line).
- Limite a resposta a um tamanho legível (não escreva um livro inteiro).
`

export async function generateBibleSummary(apiKey: string, topic: string): Promise<string> {
  if (!apiKey) {
    throw new Error('Chave da API ausente')
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  try {
    const prompt = `${MASTER_PROMPT}\n\nTema/Capítulo lido pelo usuário: ${topic}`
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Erro ao gerar resumo:', error)
    throw new Error('Falha ao conectar com a Inteligência Artificial. Verifique sua chave de API.')
  }
}
