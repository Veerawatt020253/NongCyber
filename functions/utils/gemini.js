const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const context = require("./context");

class Gemini {
  async textOnly(prompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  async textOnlyWithContext(prompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const parts = [{
      text: "ตอบคำถามโดยอ้างอิง Conference นี้เท่านั้น\n" + JSON.stringify(context.lct23_json)
    }];
    const result = await model.generateContent([prompt, ...parts]);
    return result.response.text();
  }

  async textOnlyWithCyber(prompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const parts = [{
      text: "ถ้าเป็นคำถามแนวทักทายให้แนะนำตัวโดยใช้ชื่อน้องไซเบอร์ น้องไซเบอร์เป็นที่ปรึกษาเกี่ยวกับภัยทางไซเบอร์ และน้องไซเบอร์เป็นผู้หญิงที่ชอบให้กำลังใจกับคนที่คุยด้วยมากแต่ก็ยังชอบให้วิธีการแก้ปปัญหาต่างๆด้วย ถ้าพูดแนวทักทายให้พูดว่าตัวเองชื่อน้องไซเบอร์ และตอบคำถามให้เป็นกันเองที่สุด ถ้าถามว่า \n" // + JSON.stringify(context.lct23_json)
    }];
    const result = await model.generateContent([...parts, " ' ", prompt, " ' "]);
    return result.response.text();
  }

  async textOnlyWithRich(prompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const parts = [{
      text: "ให้บอกวิธีการใช้ระบบ ตรวจสอบเบอร์และเว็บไซต์ โดยวิธีใช้การตรวจสอบเบอร์ ให้พิมพ์ 'ตรวจสอบเบอร์' และตามด้วยเบอร์โทรที่ต้องการตรวจสอบ ส่วนเว็บไซต์ให้พิมพ์ 'ตรวจสอบเว็บไซต์' และตามด้วยURLเว็บที่จะตรวจสอบ พูดแบบนี้ให้เป็นกันเองที่สุด และต้องตอบคะกับค่ะเท่านั้น ถ้าถามว่า \n" // + JSON.stringify(context.lct23_json)
    }];
    const result = await model.generateContent([...parts, " ' ", prompt, " ' "]);
    return result.response.text();
  }

  async multimodal(prompt, base64Image) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    const mimeType = "image/png";
    const imageParts = [{
      inlineData: { data: base64Image, mimeType }
    }];
    const result = await model.generateContent([prompt, ...imageParts]);
    return result.response.text();
  }

  async chat(cacheChatHistory, prompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chatHistory = [
      {
        role: "user",
        parts: [{ text: "ให้แนะนำตัวโดยใช้ชื่อน้องไซเบอร์ น้องไซเบอร์เป็นที่ปรึกษาเกี่ยวกับภัยทางไซเบอร์ และน้องไซเบอร์เป็นผู้หญิงที่ชอบให้กำลังใจกับคนที่คุยด้วยมาก ถ้าพูดแนวทักทายให้พูดว่าตัวเองชื่อน้องไซเบอร์ และตอบคำถามให้เป็นกันเองที่สุด ถ้าถามว่า\n" }] //+ context.lct23_csv
      },
      {
        role: "model",
        parts: [{ text: "สวัสดีครับ ชื่อน้องไซเบอร์ค่ะ น้องไซเบอร์เป็นผู้ช่วยที่จะตอบคำถามและแก้ปัญหาเกี่ยวกับไซเบอร์ค่ะ" }]
      } // Correct
    ];
    if (cacheChatHistory.length > 0) {
      chatHistory.push(...cacheChatHistory);
      console.log("chatHistory before starting chat:", JSON.stringify(chatHistory, null, 2));
    }
    console.log("chatHistory before starting chat:", JSON.stringify(chatHistory, null, 2)); // Keep this one
    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage("ถ้าเป็นคำถามแนวทักทายให้แนะนำตัวโดยใช้ชื่อน้องไซเบอร์ น้องไซเบอร์เป็นที่ปรึกษาเกี่ยวกับภัยทางไซเบอร์ และน้องไซเบอร์เป็นผู้หญิงที่ชอบให้กำลังใจกับคนที่คุยด้วยมาก ถ้าพูดแนวทักทายให้พูดว่าตัวเองชื่อน้องไซเบอร์ และตอบคำถามให้เป็นกันเองที่สุด ถ้าถามว่า\n", prompt);
    return result.response.text();
  }



  async chatWithCyber(cacheChatHistory, prompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chatHistory = [
      {
        role: "user",
        parts: [{ text: "ตอบคำถามเฉพาะที่เกี่ยวกับงาน Conference นี้เท่านั้น โดยคำตอบให้อ้างอิงข้อมูลอีเวนท์ของ CSV: ชื่อผู้บรรยาย, เวลา, หัวข้อ\n" + context.lct23_csv }]
      },
      {
        role: "model",
        parts: [{ text: "สวัสดีครับ ผมชื่อตี๋ ผมเป็นผู้จัดงาน LINE CONFERENCE THAILAND 2023 ครับ" }]
      }
    ];
    if (cacheChatHistory.length > 0) {
      chatHistory.push(...cacheChatHistory);
    }
    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(prompt);
    return result.response.text();
  }
}

module.exports = new Gemini();