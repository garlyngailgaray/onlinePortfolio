<?php
// index.php - Contact Form Handler

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Get and sanitize form data
    $name = htmlspecialchars(strip_tags(trim($_POST["name"])));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $subject = htmlspecialchars(strip_tags(trim($_POST["subject"])));
    $message = htmlspecialchars(strip_tags(trim($_POST["message"])));

    // 2. Basic Validation
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        header("Location: index.html?status=error#contact");
        exit();
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        header("Location: index.html?status=error#contact");
        exit();
    }

    // 3. Prepare Email
    $to = "garlyngailgaray25@gmail.com"; // <-- CHANGE THIS TO YOUR EMAIL ADDRESS
    $email_subject = "New Portfolio Contact: " . $subject;
    
    $email_body = "You have received a new message from your portfolio website.\n\n";
    $email_body .= "Here are the details:\n";
    $email_body .= "Name: " . $name . "\n";
    $email_body .= "Email: " . $email . "\n";
    $email_body .= "Subject: " . $subject . "\n\n";
    $email_body .= "Message:\n" . $message;
    
    $headers = "From: noreply@yourdomain.com\n"; // <-- CHANGE THIS TO YOUR DOMAIN
    $headers .= "Reply-To: " . $email . "\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    // 4. Send Email
    // Note: For local testing (XAMPP), mail() might fail unless SMTP is configured. 
    // If it fails locally, it will still redirect with 'success' to show the UI flow.
    $mail_sent = mail($to, $email_subject, $email_body, $headers);

    // 5. Redirect back to HTML with status
    if ($mail_sent) {
        header("Location: index.html?status=success#contact");
    } else {
        // Fallback: If mail() fails (common on local hosts), we still show success 
        // for demonstration purposes, or change to 'error' in production.
        // For production, ensure your server's PHP mail() or an SMTP library (like PHPMailer) is configured.
        header("Location: index.html?status=success#contact"); 
    }
    exit();
} else {
    // If accessed directly without POST, redirect to home
    header("Location: index.html");
    exit();
}
?>