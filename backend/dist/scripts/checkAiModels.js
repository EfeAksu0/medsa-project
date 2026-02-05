"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// import fetch from 'node-fetch'; // Using native fetch
// Load env from backend root
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error('❌ GEMINI_API_KEY is missing in .env');
    process.exit(1);
}
console.log(`🔑 Checking API Key: ${apiKey.substring(0, 5)}...`);
async function listModels() {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
            const text = await response.text();
            console.error(`❌ API Request Failed: ${response.status} ${response.statusText}`);
            console.error(text);
            return;
        }
        const data = await response.json();
        console.log('\n✅ Available Models:');
        if (data.models) {
            data.models.forEach((m) => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                    console.log(`- ${m.name}`);
                }
            });
        }
        else {
            console.log('No models found in response.');
            console.log(data);
        }
    }
    catch (error) {
        console.error('❌ Network or Script Error:', error);
    }
}
listModels();
