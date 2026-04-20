import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyCoyr3sBIlSCbir6OH8QI7wG8XcmX0m6Dc');

async function testModel(modelName) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const prompt = 'Test';
    const result = await model.generateContent(prompt);
    console.log(`Success ${modelName}:`, await result.response.text());
  } catch (err) {
    console.error(`Error ${modelName}:`, err.message);
  }
}

async function run() {
  await testModel('gemini-2.5-flash');
  await testModel('gemini-flash-latest');
}
run();
