const toggleSidebar = () => {
    const sidebar = document.getElementById('sidebar')
    const chatSection = document.getElementById('chatSection')

    if (sidebar.classList.contains('hidden')) {
        sidebar.classList.remove('hidden')
        sidebar.classList.add('fullscreen')
        chatSection.classList.add('hidden')
    } else {
        sidebar.classList.add('hidden')
        sidebar.classList.remove('fullscreen')
        chatSection.classList.remove('hidden')
    }
}

const sendPrompt = async () => {
    const userInput = document.getElementById('userInput').value
    const messageContainer = document.getElementById('messageContainer')
    const loadingIndicator = document.getElementById('loading')

    const userMessage = document.createElement('div')
    userMessage.classList.add('user-message')
    userMessage.textContent = userInput
    messageContainer.appendChild(userMessage)

    document.getElementById('userInput').value = ''
    loadingIndicator.style.display = 'flex'

    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=wdwdwd', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    {
                        "parts": [{
                            "text": "Tente solucionar o problema" + userInput
                        }]
                    }
                ]
            })
        })

        const data = await response.json()
        const answer = data.candidates[0].content.parts[0].text

        const botMessage = document.createElement('div')
        botMessage.classList.add('bot-message')
        botMessage.innerHTML = answer.replace('```', '<code>').replace('```', '</code>')

        // Add the bot message to the message container
        messageContainer.appendChild(botMessage)

    } catch (error) {
        const errorMessage = document.createElement('div')
        errorMessage.classList.add('error-message')
        errorMessage.textContent = 'Erro ao se comunicar com o Gemini.'
        messageContainer.appendChild(errorMessage)
    } finally {
        loadingIndicator.style.display = 'none'
    }
} 