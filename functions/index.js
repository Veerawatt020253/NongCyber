/* 0. Initial */
// 0.1. Install dependencies
// 0.2. Fill out values in .env

const { onRequest } = require("firebase-functions/v2/https");
const line = require("./utils/line");
const gemini = require("./utils/gemini");

// const NodeCache = require("node-cache");
// const { user } = require("firebase-functions/v1/auth");
// const cache = new NodeCache();
const CACHE_IMAGE = "image_";
const CACHE_CHAT = "chat_";

exports.webhook = onRequest(async (req, res) => {
  const events = req.body.events;
  for (const event of events) {
    // const userId = event.source.userId;
    // console.log("UserID : ", userId)

    switch (event.type) {
      case "message":
        // // ตรวจสอบเบอร์
        // if (event.message.type === "text" && event.message.text.startsWith("ตรวจสอบเบอร์ ")) {

        //   const phoneNumber = event.message.text.replace("ตรวจสอบเบอร์ ", "");  // ดึงเบอร์โทรจากข้อความ

        //   console.log("Phone : " + phoneNumber)

        //   let text = ""
        //   try {
        //     // ตรวจสอบเบอร์
        //     axios.get("http://localhost:3001/phone/" + phoneNumber)
        //       .then((res) => {
        //         let phone_status = "";
        //         console.log("API Response:", res.data);

        //         // ตรวจสอบว่ามีในdatabase
        //         if (!res.data || res.data.length === 0 || !res.data[0]) {
        //           const text = `ไม่พบข้อมูลเบอร์ ${phoneNumber} ในระบบ`;
        //           line.reply(event.replyToken, [{ type: "text", text: text }]);
        //           // return;
        //         } else {
        //           phone_status = res.data[0].status
        //           // ถ้ามีเบอร์แต่ไม่ได้ยืนยัน
        //           if (phone_status == "") {
        //             const text = `เบอร์ ${phoneNumber} อาจจะไม่ปลอดภัย`
        //             phone_status = "Not verify"
        //             line.reply(event.replyToken, [{ type: "text", text: text }]);
        //             console.log(phone_status)
        //             //เบอร์ยืนยันแล้ว
        //           } else if (phone_status == "verify") {
        //             const text = `เบอร์ ${phoneNumber} ไม่ปลอดภัย`
        //             console.log(phone_status)
        //             line.reply(event.replyToken, [{ type: "text", text: text }]);

        //           }
        //         }
        //       })
        //     // await line.reply(event.replyToken, [{ type: "text", text: text }]);
        //   } catch (err) {
        //     console.log(err)
        //   }

        //   break;
        // }
        // // ตรวจสอบเว็บ
        // if (event.message.type === "text" && event.message.text.startsWith("ตรวจสอบเว็บ ")) {

        //   const webUrl = event.message.text.replace("ตรวจสอบเว็บ ", "");  // ดึงเบอร์โทรจากข้อความ

        //   console.log("url : " + webUrl)

        //   let text = ""
        //   try {
        //     // ตรวจสอบเบอร์
        //     axios.get("http://localhost:3001/web/" + webUrl)
        //       .then((res) => {
        //         let phone_status = "";
        //         console.log("API Response:", res.data);

        //         // ตรวจสอบว่ามีในdatabase
        //         if (!res.data || res.data.length === 0 || !res.data[0] || !res.data[0].status) {
        //           const text = `ไม่พบข้อมูลเว็บ ${webUrl} ในระบบ`;
        //           line.reply(event.replyToken, [{ type: "text", text: text }]);
        //           console.log(text)
        //           return;
        //         } else {
        //           phone_status = res.data[0].status
        //           // ถ้ามีเบอร์แต่ไม่ได้ยืนยัน
        //           if (phone_status == "") {
        //             const text = `เว็บ ${webUrl} อาจจะไม่ปลอดภัย`
        //             phone_status = "Not verify"
        //             line.reply(event.replyToken, [{ type: "text", text: text }]);
        //             console.log(phone_status)
        //             //เบอร์ยืนยันแล้ว
        //           } else if (phone_status == "verify") {
        //             const text = `เว็บ ${webUrl} ไม่ปลอดภัย`
        //             console.log(phone_status)
        //             line.reply(event.replyToken, [{ type: "text", text: text }]);

        //           }
        //         }
        //       })
        //     // await line.reply(event.replyToken, [{ type: "text", text: text }]);
        //   } catch (err) {
        //     console.log(err)
        //   }

        //   break;
        // }

        //rich menu
        if (event.message.text == "วิธีใช้ตรวจสอบเบอร์และเว็บไซต์") {
          const prompt = event.message.text;
          console.log("Prompt : ", prompt)

          const text = await gemini.textOnlyWithRich(prompt)

          await line.reply(event.replyToken, [{ type: "text", text: text }]);

          break;
        }

        // ผู้ช่วย
        if (event.message.type === "text") {
          const prompt = event.message.text;
          console.log("Prompt : ", prompt)

          // // 2.1. Send a prompt to Gemini
          const text = await gemini.textOnlyWithCyber(prompt);

          // let chatHistory = cache.get(CACHE_CHAT + userId)

          // if (!chatHistory) {
          //   chatHistory = [];
          // }

          // const text = await gemini.chat(chatHistory, prompt)

          // 2.2. Reply a generated text
          await line.reply(event.replyToken, [{ type: "text", text: text }]);

          // chatHistory.push({ role: "user", part: prompt })
          // chatHistory.push({ role: "model", part: text })

          // cache.set(CACHE_CHAT + userId, chatHistory, 600)

          break;
        }

        if (event.message.type === "image") {
          /* 3. Generate text from text-and-image input (multimodal) */
          // 3.1. Get an image binary
          // 3.2. Convert binary to base64
          // 3.3. Set a cache image
          // 3.4. Ask for prompt
          break;
        }
        break;
    }
  }
  res.end();
});