// ===== Stadium Data =====
const stadium = {
    gates: {
        "Gate 1": { crowd: 30, location: "North Entrance" },
        "Gate 2": { crowd: 80, location: "Main Entrance" },
        "Gate 3": { crowd: 20, location: "South Entrance" }
    },
    stalls: {
        "Stall A": { wait: 15, type: "Food" },
        "Stall B": { wait: 5, type: "Beverages" },
        "Stall C": { wait: 8, type: "Snacks" }
    },
    washrooms: {
        "Near Gate 1": "Low crowd area",
        "Near Gate 2": "High traffic",
        "Section A": "Moderate"
    }
};

// ===== DOM Elements =====
const routeResultEl = document.getElementById("routeResult");
const chatHistoryEl = document.getElementById("chatHistory");
const chatResponseEl = document.getElementById("chatResponse");
const alertBoxEl = document.getElementById("alertBox");
const alertTextEl = document.getElementById("alertText");
const toastEl = document.getElementById("toast");

// ===== Toast Notification =====
function showToast(message, type = 'success') {
    const toastContent = toastEl.querySelector('.toast-content');
    const toastIcon = toastEl.querySelector('.toast-icon');
    const toastMessage = toastEl.querySelector('.toast-message');

    const icons = {
        success: '✓',
        warning: '⚠️',
        error: '✕',
        info: 'ℹ'
    };

    toastIcon.textContent = icons[type] || icons.success;
    toastMessage.textContent = message;

    toastEl.style.background = type === 'success' ? 'var(--success)' :
        type === 'warning' ? 'var(--warning)' :
            type === 'error' ? 'var(--danger)' : 'var(--primary)';

    toastEl.classList.add('show');

    setTimeout(() => {
        toastEl.classList.remove('show');
    }, 3000);
}

// ===== Smart Route Function =====
function findRoute() {
    const from = document.getElementById("from").value.trim();
    const to = document.getElementById("to").value.trim();

    if (!from || !to) {
        showToast("Please enter both From and To locations", "warning");
        return;
    }

    // Find least crowded gate
    let bestGate = null;
    let minCrowd = Infinity;

    for (let gate in stadium.gates) {
        if (stadium.gates[gate].crowd < minCrowd) {
            minCrowd = stadium.gates[gate].crowd;
            bestGate = gate;
        }
    }

    // Calculate estimated time (simulated)
    const distance = Math.floor(Math.random() * 10) + 3;
    const estimatedTime = distance * 2 + Math.floor(Math.random() * 5);

    // Display result with animation
    routeResultEl.innerHTML = `
        <div class="result-content">
            <div class="route-display">
                <div class="route-path">
                    <div class="route-step">${from}</div>
                    <div class="route-arrow">→</div>
                    <div class="route-step">${bestGate}</div>
                    <div class="route-arrow">→</div>
                    <div class="route-step">${to}</div>
                </div>
                <div class="route-stats">
                    <div class="stat-item">
                        <span>🚶 Crowd Level:</span>
                        <span class="stat-value">${minCrowd}%</span>
                    </div>
                    <div class="stat-item">
                        <span>⏱️ Est. Time:</span>
                        <span class="stat-value">${estimatedTime} min</span>
                    </div>
                    <div class="stat-item">
                        <span>📏 Distance:</span>
                        <span class="stat-value">${distance} min walk</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    showToast("Smart route calculated!", "success");

    // Add to chat history
    addMessage('user', `Find route from ${from} to ${to}`);
    addMessage('bot', `✅ Optimal route found via ${bestGate} (${minCrowd}% crowd). Estimated time: ${estimatedTime} minutes.`);
}

// ===== AI Assistant =====
function askAI() {
    const queryInput = document.getElementById("query");
    const query = queryInput.value.trim().toLowerCase();

    if (!query) {
        showToast("Please enter a question", "warning");
        return;
    }

    let response = "";
    let emoji = "🤖";

    // Emergency detection
    if (query.includes("emergency") || query.includes("exit") || query.includes("help") || query.includes("evacuate")) {
        let safestGate = Object.entries(stadium.gates)
            .sort((a, b) => a[1].crowd - b[1].crowd)[0];

        response = `🚨 Emergency! Proceed immediately to ${safestGate[0]} (${safestGate[1].location}) - Crowd: ${safestGate[1].crowd}%`;
        emoji = "🚨";
        showToast("Emergency route activated", "error");
    }

    // Washroom query
    else if (query.includes("washroom") || query.includes("toilet") || query.includes("restroom")) {
        const washrooms = Object.entries(stadium.washrooms);
        const bestWashroom = washrooms[0];
        response = `🚻 Nearest washroom: ${bestWashroom[0]} - ${bestWashroom[1]}.`;
        emoji = "🚻";
    }

    // Crowd level query
    else if (query.includes("crowd") || query.includes("busy") || query.includes("packed") || query.includes("empty")) {
        let crowded = Object.entries(stadium.gates)
            .sort((a, b) => b[1].crowd - a[1].crowd)[0];
        let leastCrowded = Object.entries(stadium.gates)
            .sort((a, b) => a[1].crowd - b[1].crowd)[0];

        if (query.includes("empty") || query.includes("least")) {
            response = `✅ ${leastCrowded[0]} is least crowded (${leastCrowded[1].crowd}%). Best for entry.`;
        } else {
            response = `📊 ${crowded[0]} is most crowded (${crowded[1].crowd}%). Try ${leastCrowded[0]} (${leastCrowded[1].crowd}%) instead.`;
        }
        emoji = "📊";
    }

    // Food query
    else if (query.includes("food") || query.includes("eat") || query.includes("menu") || query.includes("stall") || query.includes("hungry")) {
        let bestStall = Object.entries(stadium.stalls)
            .sort((a, b) => a[1].wait - b[1].wait)[0];
        let stallList = Object.entries(stadium.stalls)
            .sort((a, b) => a[1].wait - b[1].wait)
            .map(s => `${s[0]} (${s[1].wait}m)`)
            .join(', ');

        response = `🍔 Food stalls: ${stallList}. Quickest: ${bestStall[0]} (${bestStall[1].wait} min wait).`;
        emoji = "🍔";
    }

    // Parking query
    else if (query.includes("parking") || query.includes("park")) {
        response = "🅿️ Parking available at Gates 1 & 2. Gate 3 has limited spots. Arrive 45 min early for best spots.";
        emoji = "🅿️";
    }

    // Seat query
    else if (query.includes("seat") || query.includes("section") || query.includes("block")) {
        response = "🎫 Use the stadium map to locate your section. Need help? Check your ticket or ask staff near any gate.";
        emoji = "🎫";
    }

    // Unknown query
    else {
        response = "I can help with: crowd levels, emergency exits, washrooms, food stalls, parking, or navigation. What do you need?";
        emoji = "💡";
        showToast("Try asking about crowd or food", "info");
    }

    // Add to chat
    addMessage('user', queryInput.value);
    addMessage('bot', response, emoji);

    // Clear input
    queryInput.value = "";
}

// ===== Add Message to Chat =====
function addMessage(sender, text, emoji = null) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = sender === 'user' ? '👤' : (emoji || '🤖');

    const content = document.createElement('div');
    content.className = 'message-content';

    if (sender === 'bot' && emoji) {
        content.innerHTML = `<p>${text}</p>`;
    } else {
        content.textContent = text;
    }

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);

    chatHistoryEl.appendChild(messageDiv);
    chatHistoryEl.scrollTop = chatHistoryEl.scrollHeight;
}

// ===== Update Live Status =====
function updateUI() {
    // Update crowd percentages
    document.getElementById("g1").textContent = stadium.gates["Gate 1"].crowd + "%";
    document.getElementById("g2").textContent = stadium.gates["Gate 2"].crowd + "%";
    document.getElementById("g3").textContent = stadium.gates["Gate 3"].crowd + "%";

    // Update crowd meters
    updateMeter("meter-g1", stadium.gates["Gate 1"].crowd);
    updateMeter("meter-g2", stadium.gates["Gate 2"].crowd);
    updateMeter("meter-g3", stadium.gates["Gate 3"].crowd);

    // Update status classes
    updateStatusClass("g1", stadium.gates["Gate 1"].crowd);
    updateStatusClass("g2", stadium.gates["Gate 2"].crowd);
    updateStatusClass("g3", stadium.gates["Gate 3"].crowd);

    // Find most crowded gate for alert
    let crowded = Object.entries(stadium.gates)
        .sort((a, b) => b[1].crowd - a[1].crowd)[0];

    alertTextEl.textContent = `${crowded[0]} is highly crowded (${crowded[1].crowd}%)`;

    // Update alert styling based on crowd level
    if (crowded[1].crowd > 75) {
        alertBoxEl.style.background = "rgba(239, 68, 68, 0.1)";
        alertBoxEl.style.borderColor = "rgba(239, 68, 68, 0.3)";
        alertBoxEl.querySelector('.alert-icon').textContent = "🚨";
    } else if (crowded[1].crowd > 50) {
        alertBoxEl.style.background = "rgba(245, 158, 11, 0.1)";
        alertBoxEl.style.borderColor = "rgba(245, 158, 11, 0.3)";
        alertBoxEl.querySelector('.alert-icon').textContent = "⚠️";
    } else {
        alertBoxEl.style.background = "rgba(16, 185, 129, 0.1)";
        alertBoxEl.style.borderColor = "rgba(16, 185, 129, 0.3)";
        alertBoxEl.querySelector('.alert-icon').textContent = "✅";
    }
}

function updateMeter(meterId, percentage) {
    const meter = document.getElementById(meterId);
    meter.style.width = percentage + "%";

    // Change color based on percentage
    if (percentage > 75) {
        meter.style.background = "linear-gradient(90deg, #ef4444, #dc2626)";
    } else if (percentage > 50) {
        meter.style.background = "linear-gradient(90deg, #f59e0b, #d97706)";
    } else {
        meter.style.background = "linear-gradient(90deg, #10b981, #059669)";
    }
}

function updateStatusClass(gateId, crowd) {
    const gateElement = document.getElementById(gateId).closest('.status-item');
    gateElement.classList.remove('high', 'medium', 'low');

    if (crowd > 75) {
        gateElement.classList.add('high');
    } else if (crowd > 50) {
        gateElement.classList.add('medium');
    } else {
        gateElement.classList.add('low');
    }
}

// ===== Simulate Live Updates =====
setInterval(() => {
    for (let gate in stadium.gates) {
        // Gradual change (±10%)
        const change = Math.floor(Math.random() * 21) - 10;
        stadium.gates[gate].crowd = Math.max(5, Math.min(95, stadium.gates[gate].crowd + change));
    }

    // Occasionally update stall wait times
    if (Math.random() > 0.7) {
        for (let stall in stadium.stalls) {
            const change = Math.floor(Math.random() * 5) - 2;
            stadium.stalls[stall].wait = Math.max(1, stadium.stalls[stall].wait + change);
        }
    }

    updateUI();
}, 4000);

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    updateUI();

    // Add enter key support for inputs
    document.getElementById("from").addEventListener("keypress", (e) => {
        if (e.key === "Enter") findRoute();
    });
    document.getElementById("to").addEventListener("keypress", (e) => {
        if (e.key === "Enter") findRoute();
    });
    document.getElementById("query").addEventListener("keypress", (e) => {
        if (e.key === "Enter") askAI();
    });

    // Welcome toast
    setTimeout(() => {
        showToast("Welcome to Smart Stadium AI! 🏟", "success");
    }, 1000);
});

// Remove the alert and replace with toast
console.log("Smart Stadium AI initialized successfully!");
