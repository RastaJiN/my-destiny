/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google Gen AI lazily
let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required. Please check your secrets configurations.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API: Analyze Astrology/Fortune using Gemini JSON schema
app.post('/api/analyze-fortune', async (req, res) => {
  try {
    const { birthProfile, baziChart, ziweiChart } = req.body;

    if (!birthProfile) {
      res.status(400).json({ error: 'Birth profile details are required.' });
      return;
    }

    const ai = getAIClient();

    // Construct the prompts incorporating traditional astrology terms and facts
    const baziPillarsText = `
      【八字命盘】
      年柱: ${baziChart.year.stem}${baziChart.year.branch} (${baziChart.year.fiveElement}系, 十神: ${baziChart.year.tenDeities})
      月柱: ${baziChart.month.stem}${baziChart.month.branch} (${baziChart.month.fiveElement}系, 十神: ${baziChart.month.tenDeities})
      日柱: ${baziChart.day.stem}${baziChart.day.branch} (${baziChart.day.fiveElement}系, 主曜星/日元)
      时柱: ${baziChart.hour.stem}${baziChart.hour.branch} (${baziChart.hour.fiveElement}系, 十神: ${baziChart.hour.tenDeities})
      五行平衡: 金(${baziChart.fiveElementsCount.gold}) 木(${baziChart.fiveElementsCount.wood}) 水(${baziChart.fiveElementsCount.water}) 火(${baziChart.fiveElementsCount.fire}) 土(${baziChart.fiveElementsCount.earth})
    `;

    const ziweiPalacesText = ziweiChart.map((p: any) => 
      `宫位: ${p.name}, 宫干地支: ${p.heavenlyStem}${p.earthlyBranch}, 主星: [${p.majorStars.join(', ')}], 辅星: [${p.minorStars.join(', ')}], 星曜亮度: ${p.brightness}`
    ).join('\n');

    const promptText = `
      【星勺居命理研究所 - 生辰排盘推演】
      缘主姓名/雅号: ${birthProfile.name || '天机缘主 (未具名名录)'}
      出生地: ${birthProfile.birthplace || '未具体指定 (默认中原中州区域坐标)'}
      性别: ${birthProfile.gender === 'male' ? '乾造 (阳男命)' : '坤造 (阴女命)'}
      公历生辰: ${birthProfile.birthDate} ${birthProfile.birthTime}
      所诞时辰: ${birthProfile.doubleHour}
      太阳星座: ${birthProfile.zodiacSign}

      ${baziPillarsText}

      【紫微斗数十二宫盘数据】
      ${ziweiPalacesText}

      【倪海厦《天纪》知识库核心考订 (来源于开源项目 Renhuai123/ziwei-doushu)】
      - 体系源流：承袭倪海厦先生正统《天纪·紫微斗数》与《紫微斗数全书》典藏知识库。
      - 核心四化法门：甲廉破武阳、乙机梁紫阴、丙同机昌廉、丁阴同机巨、戊贪阴右机、己武贪梁曲、庚阳武阴同、辛巨阳曲昌、壬梁紫左武、癸破巨阴贪。化禄为主财福，化权主魄力执行，化科主声名清贵，化忌为人生修道之磨砺与执念警示。
      - 疾厄五脏心法：除疾厄宫外，需审视全盘凶煞最重之处对应地支脏腑（如子水主生殖泌尿、午火主心脏血液、卯木主肝目、酉金主肺呼吸），给予中医养生与经络养生劝诫。
      - 处世哲学：“命为定数，运为变数，阳宅为解数”。六亲重在相互理解修德，以退为进化解执念。

      请星勺居的大宗师结合东方八字命底(五行配比配克、十神神煞)、倪海厦《天纪》紫微主曜四化知识库，与西方日月星耀四象守护星盘进行重叠共振。
      1. 深度撰写八字命理精解、紫微斗数精解(融合《天纪》断语与格局知识)、西方星象密语与中西宿命交叠重合剖析。
      2. 批注详细的 姻缘红鸾、官禄事业、禄库财富、疾厄阴阳 四大核心运势评分(1~100)与极度详细、通俗中带命理解释的论述。
      3. 精准演算流日的双重运势：中式流日吉神开运格(luckyColors, luckyNumbers, luckyDirection, luckyHours, talismanQuote, cosmicScore) ；西方流日星位预示(westernDaily: rating、forecast、luckyPlanet、aspectTip)。中西每天的批语、指南都需深刻嵌入命理解密，阐释词汇奥秘。
    `;

    const systemInstruction = `你是一位精通华夏传统命理（八字五行、十神神煞、紫微十二宫星曜、真太阳时校正）、融合已故大师倪海厦《天纪》开源知识库体系，与西方古典现代占星术（星盘宫位、行星相位、流日移位）的中西玄学大宗师。
      你作为「星勺居命理研究所」的首席批命官，行文风格应具有古雅、神秘、通俗与深度交融的“古风白话研究所体”。
      请以渊雅温润、治愈解惑的立场进行解答。要求：
      - 文风极具国学底蕴与宇宙哲思，吸收倪海厦《天纪》开源知识库的经典断语真理。
      - 对每一个重要的玄学词组（如“比肩”、“日元”、“兄弟宫”、“武曲”、“第七宫”、“命主星”、“月亮合相”、“天纪四化”）解释得一清二楚，阐明其吉凶转化，体现星勺居极其专业的命理解析。
      - 所有的评分必须在 1 至 100 之间，不可为空或为 0。
      - 答复必须严格为干净合法的 JSON，严格贴合以下 schema。不要掺杂 Markdown 标记块以外的附加废话。`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptText,
      config: {
        systemInstruction,
        temperature: 0.75,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            baziSummary: {
              type: Type.STRING,
              description: "八字命理精解：结合天干地支五行制化、日主喜忌和藏干神煞，进行极度硬核又雅致的命底精析（限400字内，包含对排盘里‘日元’、‘十神’、‘比劫’等行话的科普解释）。"
            },
            ziweiSummary: {
              type: Type.STRING,
              description: "紫微斗数格局剖析：深度分析其命宫主星(如紫微天府武曲等)在各宫位分布的意义，揭示人生终极气场（限400字内，解释所及星宿词组如‘庙旺平陷’、‘会照’的行文概念）。"
            },
            zodiacSummary: {
              type: Type.STRING,
              description: "西方星象密语：阐释其星座守护星、本命盘行星落宫（如太阳第一宫、金星第十宫等）的生命本能、灵性意志与潜意识，限300字内，并对‘上升’、‘相位’等词汇辅以易懂的概念注解。"
            },
            overlappingAnalysis: {
              type: Type.STRING,
              description: "中西合璧星宿交融精解：解释东方命星紫微与西方黄道四象之能量交叠。描述中西方天星解读重合时产生的神奇命运共振点，限550字内。"
            },
            romanceFortune: {
              type: Type.OBJECT,
              properties: {
                rating: { type: Type.INTEGER, description: "姻缘评分，1-100之间" },
                description: { type: Type.STRING, description: "姻缘感情气运批示，必须详细解释红鸾星、夫妻宫等概念对配偶与心智模式的潜在影响，限180字。" }
              },
              required: ["rating", "description"]
            },
            careerFortune: {
              type: Type.OBJECT,
              properties: {
                rating: { type: Type.INTEGER, description: "事业官禄评分，1-100之间" },
                description: { type: Type.STRING, description: "官禄事业定位批示，深刻释义官禄宫、十神财官配比等辞藻，限180字。" }
              },
              required: ["rating", "description"]
            },
            wealthFortune: {
              type: Type.OBJECT,
              properties: {
                rating: { type: Type.INTEGER, description: "财帛禄库评分，1-100之间" },
                description: { type: Type.STRING, description: "财星（正偏财、禄存）入库聚散析，并解释如何守好财富能量，限180字。" }
              },
              required: ["rating", "description"]
            },
            healthFortune: {
              type: Type.OBJECT,
              properties: {
                rating: { type: Type.INTEGER, description: "疾厄安康评分，1-100之间" },
                description: { type: Type.STRING, description: "针对八字五行缺属与疾厄宫星系（如武曲金主肺，天同水主肾等），论述气血养生之良言，限180字。" }
              },
              required: ["rating", "description"]
            },
            overallAdvice: {
              type: Type.STRING,
              description: "给这位缘主的终身命理开局修心大德指点，中西结合，限200字内。"
            },
            dailyAdvice: {
              type: Type.OBJECT,
              properties: {
                luckyColors: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "今日吉色2个，如'天青', '黛黑'"
                },
                luckyNumbers: {
                  type: Type.ARRAY,
                  items: { type: Type.INTEGER },
                  description: "契合灵数2个"
                },
                luckyDirection: {
                  type: Type.STRING,
                  description: "今日吉位八卦方向"
                },
                luckyHours: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "今日转运吉时"
                },
                talismanQuote: {
                  type: Type.STRING,
                  description: "流日避祸、修行心斋与福慧箴言，限50字。"
                },
                cosmicScore: {
                  type: Type.INTEGER,
                  description: "综合星数，50到100以内"
                }
              },
              required: ["luckyColors", "luckyNumbers", "luckyDirection", "luckyHours", "talismanQuote", "cosmicScore"]
            },
            westernDaily: {
              type: Type.OBJECT,
              properties: {
                rating: { type: Type.INTEGER, description: "西方今日运势评分 1-100" },
                forecast: { type: Type.STRING, description: "西方星座本日太阳流年移宫、相位角度守护预测（必须详细解析如‘拱相’、‘刑冲’等西洋星象词汇的含义），限180字。" },
                luckyPlanet: { type: Type.STRING, description: "今日产生有利拱护相位的星曜（落入本命星座的守护吉星，如‘木星吉相位’、‘月亮太行星曜’）" },
                aspectTip: { type: Type.STRING, description: "西洋行星逆行或流日趋避箴言，限50字。" }
              },
              required: ["rating", "forecast", "luckyPlanet", "aspectTip"]
            }
          },
          required: [
            "baziSummary", "ziweiSummary", "zodiacSummary", "overlappingAnalysis",
            "romanceFortune", "careerFortune", "wealthFortune", "healthFortune",
            "overallAdvice", "dailyAdvice", "westernDaily"
          ]
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{}');
    res.json(parsedData);
  } catch (error: any) {
    console.error('Fortune Analysis Error:', error);
    res.status(500).json({ error: error.message || 'Celestial derivation failure. The secrets of stars are temporarily veiled.' });
  }
});

// Serve frontend with Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Celestial Astrolabe running server on port ${PORT}`);
  });
}

startServer();
