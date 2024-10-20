const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * 路由1：根据 mealPlan 生成购物清单
 */
app.post('/generate-shopping-list', async (req, res) => {
  const { mealPlan } = req.body;

  try {
    // 为所有菜品生成提示
    const allPrompts = mealPlan.map(({ dish, portion }) =>
      `Generate a shopping list with ingredients and quantities for ${portion} servings of ${dish}. Return only the shopping list in the format 'Ingredient: Quantity'.`
    ).join(' ');

    const result = await model.generateContent(allPrompts);
    const recipeText = await result.response.text();

    res.json({ recipe: recipeText });
  } catch (error) {
    console.error('生成购物清单时发生错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});


app.get('/nutrition-facts/suggested', async (req, res) => {
  try {
      // 返回示例的建议营养数据
      const suggestedNutrition = { carbs: 55, protein: 27.5, fat: 22.5 }; // 示例数据
      res.json(suggestedNutrition);
  } catch (error) {
      console.error('获取推荐营养成分时发生错误:', error);
      res.status(500).json({ error: '服务器错误' });
  }
});



app.post('/nutrition-facts/generated', async (req, res) => {
  const { mealPlan } = req.body;

  try {
      // 根据 mealPlan 生成营养数据
      const generatedNutrition = { carbs: 80, protein: 25, fat: 10 };  // 示例数据
      res.json(generatedNutrition);
  } catch (error) {
      console.error('生成营养成分时发生错误:', error);
      res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * 启动服务器
 */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`服务器正在运行，端口：${PORT}`);
});


