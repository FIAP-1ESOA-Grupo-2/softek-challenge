const USER_MESSAGE = 'user-message';
const BOT_MESSAGE = 'bot-message';
const ERROR_MESSAGE = 'error-message';
const HIDDEN = 'hidden';

let softtekData;

fetch('data.json')
    .then(response => response.json())
    .then(data => {
        softtekData = data.softtekData;
    })
    .catch(error => console.error('Error:', error));

const getById = id => document.getElementById(id);

const toggleSidebar = () => {
    const sidebar = getById('sidebar');
    const chatSection = getById('chatSection');

    if (sidebar.classList.contains(HIDDEN)) {
        sidebar.classList.remove(HIDDEN);
        chatSection.classList.add(HIDDEN);
    } else {
        sidebar.classList.add(HIDDEN);
        chatSection.classList.remove(HIDDEN);
    }
}

const createMessage = (type, text) => {
    const message = document.createElement('div');
    message.classList.add(type);
    message.innerHTML = text; // Use innerHTML instead of textContent
    return message;
}

const formatAnswer = answer => {
    // Format bold text
    answer = answer.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    // Format italic text
    answer = answer.replace(/\* (.*?)\ */g, '<i>$1</i>');

    // Format inline code
    answer = answer.replace(/`([^`]*)`/g, '<code>$1</code>');

    // Format code blocks
    answer = answer.replace(/```([^`]*)```/g, '<pre><code>$1</code></pre>');

    //Format headers (h1, h2, etc.)
    answer = answer.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    answer = answer.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    answer = answer.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    return answer;
}

const sendPrompt = async () => {
    const userInput = getById('userInput').value;
    const messageContainer = getById('messageContainer');
    const loadingIndicator = getById('loading');

    const userMessage = createMessage(USER_MESSAGE, userInput);
    messageContainer.appendChild(userMessage);

    getById('userInput').value = '';
    loadingIndicator.style.display = 'flex';

    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyATsb5Oiz_kY9lAURtnVe3rMINS4wr_nFU', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        "parts": [{
                            "text": `Com base nesses dados: ${softtekData}\nTente solucionar o problema: ${userInput}`
                        }]
                    }
                ]
            })
        })

        const data = await response.json();
        let answer = formatAnswer(data.candidates[0].content.parts[0].text);

        const botMessage = createMessage(BOT_MESSAGE, answer);
        messageContainer.appendChild(botMessage);

        // Scroll to the bottom of the message container
        messageContainer.scrollTop = messageContainer.scrollHeight;

    } catch (error) {
        const errorMessage = createMessage(BOT_MESSAGE, ERROR_MESSAGE, error.message || 'Ocorreu um erro ao se comunicar com a IA. Por favor, tente novamente mais tarde.');
        messageContainer.appendChild(errorMessage);
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

const handleClickQuestion = (problem) => {
    getById('userInput').value = problem;
    sendPrompt();
}