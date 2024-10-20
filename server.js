const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// app.post('/generate-shopping-list', async (req, res) => {
//   const { mealPlan } = req.body;

//   try {
//       // 为所有菜品生成更明确的提示
//       const allPrompts = mealPlan.map(({ dish, portion }) =>
//           `Please generate a shopping list for ${portion} servings of ${dish}. Respond **only** with the ingredients and their quantities in the format 'Ingredient: Quantity' without any other text or explanations.`
//       ).join(' ');

//       const result = await model.generateContent(allPrompts);
//       const recipeText = await result.response.text();

//       res.json({ recipe: recipeText });
//   } catch (error) {
//       console.error('生成购物清单时发生错误:', error);
//       res.status(500).json({ error: '服务器错误' });
//   }
// });

app.post('/generate-shopping-list', async (req, res) => {
  const { mealPlan } = req.body;

  try {
      // 为整个 meal plan 生成详细的提示
      const allDishes = mealPlan.map(({ dish, portion }) =>
          `${portion} servings of ${dish}`
      ).join(', ');

      const prompt = `
      Generate a combined shopping list with ingredients and quantities for the following meal plan: ${allDishes}.
      Return the shopping list as 'Ingredient: Quantity' for each ingredient, and combine quantities for the same ingredients across dishes. Do not include any extra explanations or instructions.`;
      
      const result = await model.generateContent(prompt);
      const recipeText = await result.response.text();

      res.json({ recipe: recipeText });
  } catch (error) {
      console.error('生成购物清单时发生错误:', error);
      res.status(500).json({ error: '服务器错误' });
  }
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`服务器正在运行，端口：${PORT}`);
});







// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const { GoogleGenerativeAI } = require('@google/generative-ai');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // 设置 API key
// const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// // 获取生成模型
// const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// // 定义 POST 路由，处理购物清单生成请求
// app.post('/generate-shopping-list', async (req, res) => {
//   const { dish, portion } = req.body;

//   try {
//     const prompt = `Generate a shopping list for ${portion} servings of ${dish}. Return in format: Ingredient: Quantity.`;
//     const result = await model.generateContent(prompt);
//     const recipeText = await result.response.text();  // 使用 await 获取文本内容
    
//     // 确保返回的内容是正确的 JSON 结构
//     res.json({ recipe: recipeText });
//   } catch (error) {
//     console.error('生成购物清单时发生错误:', error);
//     res.status(500).json({ error: '服务器错误' });
//   }
// });

// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => {
//   console.log(`服务器正在运行，端口：${PORT}`);
// });





