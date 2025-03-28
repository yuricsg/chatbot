import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const WELCOME_MESSAGE = (name: string) => `👋 Olá, ${name}! Seja muito bem-vindo à B4B. Como podemos ajudá-lo hoje?\n\n1️⃣ Ver nossos produtos e serviços\n2️⃣ Consultar informações sobre preços\n3️⃣ Falar com um de nossos atendentes especializados\n4️⃣ Conhecer mais sobre nossa empresa e políticas\n5️⃣ Voltar ao menu principal`;
const PRODUCTS_MESSAGE = (name: string) => `📦 Aqui estão nossas categorias de produtos e serviços, ${name}:\n1️⃣ Smartphones e acessórios 📱\n2️⃣ Computadores e periféricos 💻\n3️⃣ Serviços de manutenção e suporte técnico 🛠️\n\nDigite o número da categoria para mais detalhes ou digite 5️⃣ para voltar ao menu principal.`;
const PRICES_MESSAGE = (name: string) => `💰 Para consultar preços detalhados, você pode acessar nosso site oficial em [www.nossaempresa.com] ou falar diretamente com um de nossos atendentes especializados, ${name}.\n\nDigite 5️⃣ para voltar ao menu principal.`;
const ATTENDANT_MESSAGE = (name: string) => `👨‍💼 Um de nossos atendentes estará com você em instantes, ${name}. Por favor, aguarde enquanto conectamos você ao suporte.\n\nDigite 5️⃣ para voltar ao menu principal.`;
const ABOUT_US_MESSAGE = (name: string) => `🏢 Somos a B4B, uma empresa dedicada a oferecer produtos e serviços de alta qualidade. Nosso compromisso é com a sua satisfação, ${name}! Para mais informações, visite nosso site: [https://www.instagram.com/b4b.digital/]\n\nDigite 5️⃣ para voltar ao menu principal.`;
const CELLPHONES_MESSAGE = (name: string) => `📱 Smartphones disponíveis, ${name}:\n- iPhone 14 Pro Max\n- Samsung Galaxy Z Fold 4\n- Xiaomi 12 Pro\n\nAcessórios:\n- Capas protetoras\n- Carregadores rápidos\n- Fones de ouvido Bluetooth\n\nDigite 5️⃣ para voltar ao menu principal.`;
const LAPTOPS_MESSAGE = (name: string) => `💻 Computadores e periféricos, ${name}:\n- Notebooks: MacBook Air, Dell XPS 15, Lenovo ThinkPad X1\n- Periféricos: Monitores 4K, Teclados mecânicos, Mouses ergonômicos\n\nDigite 5️⃣ para voltar ao menu principal.`;
const SERVICES_MESSAGE = (name: string) => `🛠️ Serviços de manutenção e suporte técnico, ${name}:\n- Reparos em smartphones e notebooks\n- Instalação de softwares\n- Consultoria técnica personalizada\n\nDigite 5️⃣ para voltar ao menu principal.`;
const UNKNOWN_MESSAGE = (name: string) => `❓ Desculpe, ${name}, não conseguimos entender sua mensagem. Por favor, escolha uma das opções abaixo para continuar:\n\n` + WELCOME_MESSAGE(name);
const BACK_MESSAGE = WELCOME_MESSAGE;

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
});

// Armazena os nomes dos clientes e o estado da conversa
const clientStates: { [key: string]: { name?: string; firstMessage: boolean } } = {};


client.on("message", async (message) => {
    const chatId = message.from;

    if (!clientStates[chatId]) {
        clientStates[chatId] = { firstMessage: true };
        await client.sendMessage(chatId, "👋 Olá! Antes de começarmos, como posso te chamar?");
        return;
    }

    const userState = clientStates[chatId];
    if (userState.firstMessage && !userState.name) {
        // Armazena o nome do cliente
        userState.name = message.body.trim();
        userState.firstMessage = false;

        await client.sendMessage(chatId, WELCOME_MESSAGE(userState.name));
        return;
    }
});


client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
});


client.on("ready", () => {
    console.log("✅ Bot está online e pronto para atender os clientes!");
});

// Função para processar mensagens do usuário
const getResponse = (userMessage: string, name: string): string => {
    if (userMessage.includes("1")) {
        return PRODUCTS_MESSAGE(name);
    } else if (userMessage.includes("2")) {
        return PRICES_MESSAGE(name);
    } else if (userMessage.includes("3")) {
        return ATTENDANT_MESSAGE(name);
    } else if (userMessage.includes("4")) {
        return ABOUT_US_MESSAGE(name);
    } else if (userMessage.includes("5")) {
        return BACK_MESSAGE(name);
    } else if (userMessage.includes("smartphones") || userMessage.includes("acessórios")) {
        return CELLPHONES_MESSAGE(name);
    } else if (userMessage.includes("computadores") || userMessage.includes("periféricos")) {
        return LAPTOPS_MESSAGE(name);
    } else if (userMessage.includes("manutenção") || userMessage.includes("suporte técnico")) {
        return SERVICES_MESSAGE(name);
    }
    return UNKNOWN_MESSAGE(name);
};

// Lida com mensagens recebidas
client.on("message", async (message) => {
    try {
        const chatId = message.from;
        const userMessage = message.body.toLowerCase();

        const userState = clientStates[chatId];
        if (!userState || !userState.name) return;

        const response = getResponse(userMessage, userState.name);
        await client.sendMessage(chatId, response);
    } catch (error) {
        console.error("❌ Erro ao processar a mensagem:", error);
    }
});


client.initialize();
