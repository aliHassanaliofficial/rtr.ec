// Decrypt a single encrypted ID
function decryptUserID(encryptedText, secretKey) {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);  // Convert decrypted bytes to plain text
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
}

// Fetch encrypted user IDs and determine the user type
document.getElementById("submitBtn").addEventListener("click", function () {
    const inputVal = document.getElementById("userID").value;

    // Fetch the encrypted user IDs from the JSON file
    fetch("./assets/userIDs.json")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const secretKey = "mySecretKey123";  // Must match the encryption key

            // Decrypt all director and member IDs
            const decryptedDirectors = data.directors.map(encryptedID =>
                decryptUserID(encryptedID, secretKey)
            );
            const decryptedMembers = data.members.map(encryptedID =>
                decryptUserID(encryptedID, secretKey)
            );

            console.log("Decrypted Director IDs:", decryptedDirectors);  // Debugging
            console.log("Decrypted Member IDs:", decryptedMembers);  // Debugging

            // Check if the input matches any director or member ID
            if (decryptedDirectors.includes(inputVal)) {
                localStorage.setItem("isAuthorized", "true");
                location.href = "./get-board/director/index.html";
            } else if (decryptedMembers.includes(inputVal)) {
                localStorage.setItem("isAuthorized", "true");
                location.href = "./get-board/member/index.html";
            } else {
                alert("Invalid passcode. Access denied.");
            }
        })
        .catch(error => console.error("Error loading encrypted data:", error));
});
