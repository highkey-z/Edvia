# 🆓 Free AI APIs Setup Guide

## 🎯 **Recommended: Google Gemini (Completely Free!)**

### ✅ **Why Gemini is Perfect:**
- **1,500 requests/day** (completely free)
- **1M tokens/day** (very generous)
- **No credit card required**
- **High quality** text generation
- **Fast response times**

### 📝 **Setup Steps:**

1. **Get your free API key:**
   - Go to: https://makersuite.google.com/app/apikey
   - Sign in with Google account
   - Click "Create API Key"
   - Copy the key (starts with `AIza...`)

2. **Add to your app:**
   ```bash
   # Edit server/.env file
   GEMINI_API_KEY=AIza-your-actual-key-here
   ```

3. **Restart the server:**
   ```bash
   npm run dev
   ```

## 🌟 **Other Free AI Options**

### 1. **Groq (Free Tier)**
- **14,400 requests/day** (very generous!)
- **Speed**: Extremely fast
- **Models**: Llama, Mixtral
- **Setup**: https://console.groq.com/

### 2. **Hugging Face (Free Tier)**
- **1,000 requests/month**
- **Models**: Many open-source options
- **Setup**: https://huggingface.co/inference-api

### 3. **Together AI (Free Tier)**
- **1M tokens/month**
- **Models**: Llama, Mistral
- **Setup**: https://api.together.xyz/

## 💰 **Cost Comparison (Per 1K Tokens)**

| Service | Input Cost | Output Cost | Free Tier |
|---------|------------|-------------|-----------|
| **Gemini Pro** | $0.00125 | $0.005 | 1.5K requests/day |
| **Groq** | $0.00059 | $0.00059 | 14.4K requests/day |
| **OpenAI GPT-3.5** | $0.0015 | $0.002 | $5 free credit |
| **OpenAI GPT-4** | $0.03 | $0.06 | $5 free credit |
| **Anthropic Claude** | $0.008 | $0.024 | $5 free credit |

## 🚀 **Quick Start with Gemini**

1. **Get API Key**: https://makersuite.google.com/app/apikey
2. **Update .env**: Replace `your_gemini_api_key_here` with your key
3. **Test**: Try the app - it should work immediately!

## 📊 **Usage Estimates**

### **For Reading Companion App:**
- **Average request**: ~500 tokens
- **Gemini free tier**: 1,500 requests/day = ~750,000 tokens
- **Estimated usage**: 100+ text simplifications per day

### **Example Costs (if you exceed free tier):**
- **1,000 text simplifications/month**: ~$2.50 with Gemini
- **Same with OpenAI**: ~$8-15
- **Same with GPT-4**: ~$60-120

## 🎯 **Recommendation**

**Start with Gemini** - it's completely free and perfect for your use case!

1. **Free tier is generous** (1,500 requests/day)
2. **High quality output**
3. **Easy setup**
4. **No credit card required**
5. **Fast and reliable**

---

**Lexia is already updated to use Gemini! Just add your free API key and you're ready to go! 🎉**
