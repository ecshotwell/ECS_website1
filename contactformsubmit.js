document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Stop the page from reloading
    
    const form = e.target;
    const button = document.getElementById('submitBtn');
    const responseBox = document.getElementById('formResponse');
    
    // Disable button and show sending status
    button.disabled = true;
    button.textContent = 'Sending...';
    
    const formData = new FormData(form);
    
    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(async (response) => {
        let json = await response.json();
        if (response.status === 200) {
            // Success Acknowledgment
            responseBox.style.display = 'block';
            responseBox.className = 'success';
            responseBox.innerHTML = '<strong>Thank you!</strong> Your message has been sent successfully. Eric will get back to you soon.';
            form.reset(); // Clear the form fields
        } else {
            // Error handling
            responseBox.style.display = 'block';
            responseBox.className = 'error';
            responseBox.innerHTML = `<strong>Submission Failed:</strong> ${json.message || 'Something went wrong.'}`;
        }
    })
    .catch(error => {
        responseBox.style.display = 'block';
        responseBox.className = 'error';
        responseBox.innerHTML = '<strong>Error:</strong> Unable to connect to the server. Please check your network connection.';
    })
    .finally(() => {
        // Reset button state
        button.disabled = false;
        button.textContent = 'Send Message';
    });
});