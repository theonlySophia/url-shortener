// ============================================================
// IMPORTANT: Change this to match your server's base URL
// During local development: 'http://localhost:3000'
// After deploying to Render: 'https://yourapp.onrender.com'
// ============================================================
const API_BASE = 'http://localhost:3000';


// ============================================================
// SECTION 1: SHORTEN A URL
// ============================================================

const shortenBtn = document.getElementById('shortenBtn');
const originalUrlInput = document.getElementById('originalUrl');
const shortenError = document.getElementById('shorten-error');
const shortenResult = document.getElementById('shorten-result');
const shortUrlDisplay = document.getElementById('shortUrlDisplay');
const qrCodeDisplay = document.getElementById('qrCodeDisplay');
const copyBtn = document.getElementById('copyBtn');

// When the Shorten button is clicked
shortenBtn.addEventListener('click', async () => {
    const originalUrl = originalUrlInput.value.trim();

    // Clear previous results and errors
    shortenError.textContent = '';
    shortenResult.classList.remove('visible');

    // Basic check — don't send empty input
    if (!originalUrl) {
        shortenError.textContent = 'Please enter a URL.';
        return;
    }

    // Change button text to show loading
    shortenBtn.textContent = 'Shortening...';
    shortenBtn.disabled = true;

    try {
        // Send POST request to your backend
        const response = await fetch(`${API_BASE}/api/v1/shorten`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ originalUrl }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Backend returned an error (400, 500 etc)
            shortenError.textContent = data.error || 'Something went wrong.';
            return;
        }

        // Success! Show the result
        shortUrlDisplay.textContent = data.shortUrl;
        shortUrlDisplay.href = data.shortUrl;
        qrCodeDisplay.src = data.qrCode;
        shortenResult.classList.add('visible');

    } catch (err) {
        // Network error or server is down
        shortenError.textContent = 'Could not connect to the server. Is it running?';
    } finally {
        // Restore button regardless of outcome
        shortenBtn.textContent = 'Shorten';
        shortenBtn.disabled = false;
    }
});

// Copy button — copies short URL to clipboard
copyBtn.addEventListener('click', () => {
    const text = shortUrlDisplay.textContent;
    navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = 'Copy';
        }, 2000); // reset after 2 seconds
    });
});

// Allow pressing Enter in the input to trigger shorten
originalUrlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') shortenBtn.click();
});


// ============================================================
// SECTION 2: LOOK UP ORIGINAL URL
// ============================================================

const lookupBtn = document.getElementById('lookupBtn');
const shortUrlInput = document.getElementById('shortUrlInput');
const lookupError = document.getElementById('lookup-error');
const lookupResult = document.getElementById('lookup-result');
const originalUrlDisplay = document.getElementById('originalUrlDisplay');

// When the Look up button is clicked
lookupBtn.addEventListener('click', async () => {
    const shortUrl = shortUrlInput.value.trim();

    // Clear previous results and errors
    lookupError.textContent = '';
    lookupResult.classList.remove('visible');

    if (!shortUrl) {
        lookupError.textContent = 'Please enter a short URL.';
        return;
    }

    // Extract just the urlId from the short URL
    // e.g. 'http://localhost:3000/ab3xz' → 'ab3xz'
    const urlId = shortUrl.split('/').pop();

    lookupBtn.textContent = 'Looking up...';
    lookupBtn.disabled = true;

    try {
        // NOTE: You haven't built this backend route yet!
        // This will need a GET /api/lookup/:urlId route on your backend
        const response = await fetch(`${API_BASE}/api/v1/lookup/${urlId}`);
        const data = await response.json();

        if (!response.ok) {
            lookupError.textContent = data.error || 'URL not found.';
            return;
        }

        // Show the original URL
        originalUrlDisplay.textContent = data.originalUrl;
        originalUrlDisplay.href = data.originalUrl;
        lookupResult.classList.add('visible');

    } catch (err) {
        lookupError.textContent = 'Could not connect to the server. Is it running?';
    } finally {
        lookupBtn.textContent = 'Look up';
        lookupBtn.disabled = false;
    }
});

// Allow pressing Enter in the input to trigger lookup
shortUrlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') lookupBtn.click();
});
