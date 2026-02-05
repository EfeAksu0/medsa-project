"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const REGISTER_URL = 'http://localhost:4000/api/auth/register';
async function testRegister() {
    console.log(`Attempting to register at ${REGISTER_URL}...`);
    try {
        const response = await axios_1.default.post(REGISTER_URL, {
            email: 'debug_user_001@test.com',
            name: 'Debug User',
            password: 'password123',
            plan: 'knight'
        });
        console.log('✅ Registration SUCCESS!', response.data);
    }
    catch (error) {
        console.error('❌ Registration FAILED!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
        else {
            console.error('Error Message:', error.message);
        }
    }
}
testRegister();
