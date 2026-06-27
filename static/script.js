const chatArea = document.getElementById("chatArea");
const input = document.getElementById("destination");

// ----------------------------
// Generate Trip
// ----------------------------

async function generateTrip() {

    const destination = input.value.trim();

    if (destination === "") return;

    // User Message
    chatArea.innerHTML += `
        <div class="user-message">

            <img src="/static/avatar.png" class="avatar">

            <div class="message">
                ${destination}
            </div>

        </div>
    `;

    input.value = "";

    chatArea.scrollTop = chatArea.scrollHeight;

    // Typing Animation
    chatArea.innerHTML += `
        <div class="bot-message" id="typing">

            <img src="/static/logo.png" class="avatar">

            <div class="message">

                🤖 Travel AI

                <br><br>

                <div class="typing">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

            </div>

        </div>
    `;

    chatArea.scrollTop = chatArea.scrollHeight;

    try {

        const response = await fetch("/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                destination: destination
            })
        });

        if (!response.ok) {
            throw new Error("Server Error");
        }

        const data = await response.json();

        // Remove Typing Box
        document.getElementById("typing").remove();

        let answer = data.response;

        answer = answer
            .replace(/\*\*(.*?)\*\*/g, "<h3>$1</h3>")
            .replace(/\n/g, "<br>");

        chatArea.innerHTML += `
            <div class="bot-message">

                <img src="/static/logo.png" class="avatar">

                <div class="message">

                    ${answer}

                    <br><br>

                    <button class="copy-btn" onclick="copyText(this)">
                        📋 Copy
                    </button>

                </div>

            </div>
        `;

        chatArea.scrollTop = chatArea.scrollHeight;

    }

    catch (error) {

        if (document.getElementById("typing")) {
            document.getElementById("typing").remove();
        }

        chatArea.innerHTML += `
            <div class="bot-message">

                <img src="/static/logo.png" class="avatar">

                <div class="message">

                    ❌ Unable to generate travel plan.

                    <br><br>

                    Please try again.

                </div>

            </div>
        `;

        chatArea.scrollTop = chatArea.scrollHeight;

        console.error(error);

    }

}

// ----------------------------
// Copy Button
// ----------------------------

function copyText(button) {

    const text = button.parentElement.innerText.replace("📋 Copy", "");

    navigator.clipboard.writeText(text);

    button.innerHTML = "✅ Copied";

    setTimeout(() => {

        button.innerHTML = "📋 Copy";

    }, 2000);

}

// ----------------------------
// New Chat
// ----------------------------

function newChat() {

    chatArea.innerHTML = `
        <div class="bot-message">

            <img src="/static/logo.png" class="avatar">

            <div class="message">

                👋 <strong>Hello!</strong>

                <br><br>

                I can help you plan trips anywhere in the world.

                <br><br>

                Try asking:

                <br><br>

                • 5 Day Trip to Goa

                <br>

                • Budget Trip to Dubai

                <br>

                • Honeymoon in Bali

                <br>

                • Kerala Family Tour

            </div>

        </div>
    `;

    input.value = "";

}

// ----------------------------
// Enter Key
// ----------------------------

input.addEventListener("keydown", function (event) {

    if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();

        generateTrip();

    }

});