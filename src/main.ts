import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const client = new Client({
    authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("✅ Bot está online e pronto para receber mensagens!");
});

client.on("message", async (message) => {
    const chatId = message.from;
    const userMessage = message.body.toLowerCase();

    let response = "Olá! Bem-vindo à nossa loja. Como posso te ajudar?\n\n";
    response += "1️⃣ Ver produtos\n";
    response += "2️⃣ Consultar preços\n";
    response += "3️⃣ Falar com um atendente";

    if (userMessage.includes("1")) {
        response = "📦 Nossos produtos:\n- Celulares 📱\n- Notebooks 💻\n- Acessórios 🎧";
    } else if (userMessage.includes("2")) {
        response = "💰 Para consultar os preços, visite nosso site ou fale com um atendente!";
    } else if (userMessage.includes("3")) {
        response = "👨‍💼 Um atendente entrará em contato com você em breve.";
    }

    client.sendMessage(chatId, response);
});

client.initialize();
