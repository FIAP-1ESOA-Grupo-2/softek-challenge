document.getElementById('queryForm').addEventListener('submit', async function (event) {
    event.preventDefault()

    const userInput = document.getElementById('userInput').value
    const messageContainer = document.getElementById('messageContainer')
    const loadingIndicator = document.getElementById('loading')

    const userMessage = document.createElement('div')
    userMessage.classList.add('user-message')
    userMessage.textContent = userInput
    messageContainer.appendChild(userMessage)

    document.getElementById('userInput').value = ''
    loadingIndicator.style.display = 'block'

    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=dwwdwdwddw', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    { "parts": [{ "text": userInput + "(Responda sempre em portugues) - E agora você se chama Assistente da Softek - (Retorne a resposta em HTML (Separe a respota em um p e o titulo em um h1))" }] }
                ]
            })
        })

        const data = await response.json()
        const answer = data.candidates[0].content.parts[0].text

        const botMessage = document.createElement('div')
        botMessage.classList.add('bot-message')
        botMessage.innerHTML = answer
        messageContainer.appendChild(botMessage)

    } catch (error) {
        const errorMessage = document.createElement('div')
        errorMessage.classList.add('error-message')
        errorMessage.textContent = 'Erro ao se comunicar com o Gemini.'
        messageContainer.appendChild(errorMessage)
        console.error('Error:', error)
    } finally {
        loadingIndicator.style.display = 'none'
    }
})
