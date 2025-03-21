const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const startQuestionsBtn = document.getElementById('start-questions-btn');
const currentQuestionDiv = document.getElementById('current-question');
const questionText = document.getElementById('question-text');
const answerText = document.getElementById('answer-text');
const nextQuestionBtn = document.getElementById('next-question-btn');
const translateBtn = document.getElementById('translate-btn');
const darkModeBtn = document.getElementById('dark-mode-btn');
const body = document.body;

const database = {
    "Qu'est-ce que SUPTECH SANTÉ ?": "SUPTECH SANTÉ est une école spécialisée en génie biomédical et en techniques de santé.",
    "Où se trouvent les campus de SUPTECH SANTÉ ?": "Campus Essaouira : Avenue Al Akwas | Campus Mohammedia : Zone Industrielle.",
    "Quels sont les diplômes délivrés par SUPTECH SANTÉ ?": "SUPTECH SANTÉ délivre des diplômes d’ingénieur, de Master et de Licence.",
    "Quelles sont les conditions d’admission ?": "Licence : Bac scientifique | Cycle Ingénieur : Bac+2 scientifique | Master : Licence en sciences.",
    "Quels sont les frais de scolarité ?": "Licence : 28 000 DHS/an | Master : 32 000 DHS/an | Ingénieur : 42 000 DHS/an.",
    "SUPTECH SANTÉ offre-t-elle des bourses ?": "Oui, possibilité de bourses couvrant jusqu'à 100% des frais.",
    "Quels sont les cycles de formation disponibles ?": "Licence (3 ans), Ingénieur (5 ans), Master (2 ans), Prépas intégrées.",
    "Quels sont les débouchés en Informatique Décisionnelle et E-Santé ?": "Data analyst en santé, gestionnaire SI, développeur d'applications en santé.",
    "Comment contacter SUPTECH SANTÉ ?": "Email : contact-essaouira@suptech-sante.ma | Tel : +212 666 405 885.",
    "SUPTECH SANTÉ organise-t-elle des stages ?": "Oui, stages en entreprise et en milieu hospitalier.",
    "Y a-t-il des cours en ligne ?": "Oui, certains modules sont disponibles en e-learning.",
    "SUPTECH SANTÉ a-t-elle des partenaires ?": "Oui, avec plus de 50 partenaires académiques et industriels.",
};

const databaseArabic = {
    "ما هي SUPTECH SANTÉ؟": "SUPTECH SANTÉ هي مدرسة متخصصة في الهندسة الطبية وتقنيات الصحة.",
    "أين تقع فروع SUPTECH SANTÉ؟": "فرع الصويرة: شارع الأقواس | فرع المحمدية: المنطقة الصناعية.",
    "ما هي الشهادات التي تمنحها SUPTECH SANTÉ؟": "SUPTECH SANTÉ تمنح شهادات مهندس وماجستير وإجازة.",
    "ما هي شروط القبول؟": "الإجازة: بكالوريا علمية | دورة المهندس: باك+2 علمي | الماجستير: إجازة في العلوم.",
    "ما هي رسوم التسجيل؟": "الإجازة: 28000 درهم/سنة | الماجستير: 32000 درهم/سنة | المهندس: 42000 درهم/سنة.",
    "هل تقدم SUPTECH SANTÉ منحًا دراسية؟": "نعم، هناك إمكانية للحصول على منح تصل إلى 100% من الرسوم.",
    "ما هي الدورات التدريبية المتاحة؟": "الإجازة (3 سنوات)، المهندس (5 سنوات)، الماجستير (سنتان)، التحضيريات المدمجة.",
    "ما هي فرص العمل في المعلوماتية القرارية والصحة الإلكترونية؟": "محلل بيانات في الصحة، مدير أنظمة المعلومات، مطور تطبيقات الصحة.",
    "كيف يمكن الاتصال بـ SUPTECH SANTÉ؟": "البريد الإلكتروني: contact-essaouira@suptech-sante.ma | الهاتف: +212 666 405 885.",
    "هل تنظم SUPTECH SANTÉ تداريب؟": "نعم، تداريب في الشركات وفي المستشفيات.",
    "هل هناك دروس عبر الإنترنت؟": "نعم، بعض الوحدات متاحة عبر التعلم الإلكتروني.",
    "هل لدى SUPTECH SANTÉ شركاء؟": "نعم، مع أكثر من 50 شريكًا أكاديميًا وصناعيًا.",
};

let currentLanguage = 'fr';
let isDarkMode = false;

const questions = Object.keys(database);
let currentQuestionIndex = 0;

function addMessage(message, isUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
    messageElement.classList.add(isUser ? 'user-message' : 'bot-message');
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

startQuestionsBtn.addEventListener('click', () => {
    startQuestionsBtn.classList.add('hidden');
    currentQuestionDiv.classList.remove('hidden');
    showQuestion();
});

function showQuestion() {
    if (currentQuestionIndex < questions.length) {
        questionText.textContent = currentLanguage === 'fr' ? questions[currentQuestionIndex] : Object.keys(databaseArabic)[currentQuestionIndex];
        answerText.classList.add('hidden');
        nextQuestionBtn.classList.add('hidden');
    } else {
        currentQuestionDiv.innerHTML = "<p>" + (currentLanguage === 'fr' ? "Toutes les questions ont été répondues." : "تمت الإجابة على جميع الأسئلة.") + "</p>";
    }
}

questionText.addEventListener('click', () => {
    userInput.value = currentLanguage === 'fr' ? questions[currentQuestionIndex] : Object.keys(databaseArabic)[currentQuestionIndex];
});

sendBtn.addEventListener('click', async () => {
    const question = userInput.value.trim();
    if (question) {
        addMessage(question, true);
        const answer = currentLanguage === 'fr' ? database[question] || databaseArabic[question] || await getAIResponse(question) : databaseArabic[question] || database[question] || await getAIResponse(question);
        addMessage(answer, false);
        userInput.value = '';
        setTimeout(() => {
            currentQuestionIndex++;
            showQuestion();
        }, 1000);
    }
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});

translateBtn.addEventListener('click', () => {
    currentLanguage = currentLanguage === 'fr' ? 'ar' : 'fr';
    translateBtn.textContent = currentLanguage === 'fr' ? 'Traduire en Arabe' : 'ترجمة إلى الفرنسية';
    currentQuestionIndex = 0;
    showQuestion();
});

darkModeBtn.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    body.classList.toggle('dark-mode', isDarkMode);
    darkModeBtn.textContent = isDarkMode ? 'Mode Clair' : 'Mode Sombre';
});

showQuestion();
document.getElementById('quiz-btn').addEventListener('click', () => {
    window.location.href = 'quiz.html';
});