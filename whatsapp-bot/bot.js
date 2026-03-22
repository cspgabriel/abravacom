const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, onSnapshot, query, where, updateDoc, doc } = require('firebase/firestore');
require('dotenv').config();

// Impede que o terminal feche imediatamente ao dar erro
process.on('uncaughtException', (err) => {
    console.error('\n❌ ERRO FATAL: O programa encontrou um erro e não pode continuar.\n');
    console.error(err);
    console.log('\n⏳ Fechando em 60 segundos para você ler o erro acima...');
    setTimeout(() => process.exit(1), 60000);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('\n❌ ERRO FATAL: Promessa rejeitada inesperadamente.\n');
    console.error(reason);
    console.log('\n⏳ Fechando em 60 segundos para você ler o erro acima...');
    setTimeout(() => process.exit(1), 60000);
});// Firebase Configuration from .env
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID || process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// WhatsApp Client Initialization
const client = new Client({
    authStrategy: new LocalAuth(), // Saves session locally, no need to scan QR again
    puppeteer: {
        // Look for typical Chrome installation paths to avoid bundling 200MB Chromium in pkg
        executablePath: process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", 
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox', 
            '--disable-dev-shm-usage',
            '--js-flags=--expose-gc'
        ],
        headless: true
    }
});

client.on('qr', (qr) => {
    console.log('\n\n--- ESCANEIE ESTE QR CODE COM O WHATSAPP DA AGÊNCIA ---\n');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('\n✅ Tudo certo! O Robô do WhatsApp está conectado!');
    console.log('📡 Escutando novos leads do site em tempo real...\n');
    console.log('Mantenha esta janela aberta para o robô continuar funcionando.');
    listenForLeads();
});

function listenForLeads() {
    const leadsRef = collection(db, 'simulations');
    // Listen for new simulations/leads that haven't been notified yet
    const q = query(leadsRef, where("whatsappNotified", "==", null));

    let isInitialLoad = true;
    
    onSnapshot(q, (snapshot) => {
        if (isInitialLoad) {
            isInitialLoad = false;
            return; // Ignore past leads, only listen for new ones while the program is open
        }

        snapshot.docChanges().forEach(async (change) => {
            if (change.type === 'added') {
                const data = change.doc.data();
                await sendWhatsAppAlert(data, change.doc.id);
            }
        });
    }, (error) => {
        console.error("Erro de conexão com o banco de dados:", error);
    });
}

async function sendWhatsAppAlert(lead, docId) {
    try {
        // The agency number to receive alerts (or the user's phone if configured differently)
        const agencyNumber = process.env.AGENCY_WHATSAPP_NUMBER || "5521993165605"; 
        const formattedNumber = `${agencyNumber.replace(/\D/g, '')}@c.us`;

        const message = `*🔔 NOVO LEAD GERADO (FINANCE8)!*\n\n` +
                        `*Nome:* ${lead.name || 'N/A'}\n` +
                        `*WhatsApp:* ${lead.phone || 'N/A'}\n` +
                        `*E-mail:* ${lead.email || 'N/A'}\n` +
                        `*Origem:* ${lead.source || 'Portal/Simulador'}\n` +
                        `*Data:* ${lead.date || new Date().toLocaleString('pt-BR')}\n\n` +
                        `Para ver os detalhes da simulação na íntegra, acesse o CRM!`;

        await client.sendMessage(formattedNumber, message);
        console.log(`\n📨 Alerta enviado com sucesso para a agência sobre o lead: ${lead.name || lead.email}`);

        // OPTIONAL: mark as notified in Firebase to avoid duplicated alerts in the future
        try {
            const docRef = doc(db, 'simulations', docId);
            await updateDoc(docRef, { whatsappNotified: true });
        } catch (updateErr) {
            console.warn("Aviso: Lead alertado mas falha ao marcar no Firebase.");
        }

    } catch (error) {
        console.error("Erro ao enviar a mensagem de alerta:", error);
    }
}

console.log("Iniciando o WhatsApp Web... Aguarde.");
client.initialize();
