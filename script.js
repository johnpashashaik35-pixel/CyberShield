
"use strict";

// 1. Password Strength Checker
const passwordInput = document.getElementById("password");
const passwordButton = document.getElementById("checkPassword");
const passwordResult = document.getElementById("passwordResult");

passwordButton.addEventListener("click", () => {
    const password = passwordInput.value;
    let score = 0;

    if (!password) {
        passwordResult.textContent = "Please enter a sample password.";
        return;
    }

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let message;

    if (password.length < 8 || score <= 2) {
        message = "Weak password";
    } else if (score <= 3) {
        message = "Medium password";
    } else {
        message = "Strong password";
    }

    passwordResult.textContent = message + " — Score: " + score + "/5";
});


// 2. Basic URL Safety Checker
const urlInput = document.getElementById("url");
const urlButton = document.getElementById("checkUrl");
const urlResult = document.getElementById("urlResult");

urlButton.addEventListener("click", () => {
    const value = urlInput.value.trim();

    if (!value) {
        urlResult.textContent = "Please enter a URL.";
        return;
    }

    let parsedURL;

    try {
        parsedURL = new URL(value);
    } catch {
        urlResult.textContent =
            "Invalid URL. Enter a complete address, such as https://example.com";
        return;
    }

    if (!["http:", "https:"].includes(parsedURL.protocol)) {
        urlResult.textContent = "Unsupported URL protocol.";
        return;
    }

    const warnings = [];

    if (parsedURL.protocol !== "https:") {
        warnings.push("Not using HTTPS");
    }

    if (parsedURL.username || parsedURL.password) {
        warnings.push("Contains login information in the URL");
    }

    if (parsedURL.hostname.includes("xn--")) {
        warnings.push("Contains an internationalized domain name");
    }

    if (parsedURL.hostname.split(".").some(part => part.length > 30)) {
        warnings.push("Unusually long domain name");
    }

    if (warnings.length > 0) {
        urlResult.textContent =
            "Caution: " + warnings.join("; ") +
            ". This basic check cannot confirm whether a site is safe.";
    } else {
        urlResult.textContent =
            "No basic warning detected. This does NOT guarantee the URL is safe.";
    }
});


// 3. File SHA-256 Hash Generator
const fileInput = document.getElementById("file");
const fileButton = document.getElementById("hashFile");
const fileResult = document.getElementById("fileResult");

fileButton.addEventListener("click", async () => {
    const file = fileInput.files[0];

    if (!file) {
        fileResult.textContent = "Please choose a file first.";
        return;
    }

    if (!window.crypto || !window.crypto.subtle) {
        fileResult.textContent =
            "Secure hashing is unavailable. Open this site through localhost.";
        return;
    }

    fileResult.textContent = "Generating SHA-256 hash...";

    try {
        const fileData = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest("SHA-256", fileData);

        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
            .map(byte => byte.toString(16).padStart(2, "0"))
            .join("");

        fileResult.textContent = "SHA-256: " + hashHex;
    } catch (error) {
        fileResult.textContent =
            "Could not generate the hash. Please try another file.";
    }
});
