<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Seller Account Verified</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Congratulations!</h1>
            <h2>Your ShopSphere Seller Account is Now Verified</h2>
        </div>

        <div class="content">
            <p>Dear {{ $seller->name }},</p>

            <p>Great news! Your seller account on ShopSphere has been successfully verified by our admin team. You can now access all seller features and start managing your online store.</p>

            <h3>What you can do now:</h3>
            <ul>
                <li>Access your seller dashboard</li>
                <li>Add and manage your products</li>
                <li>View and process customer orders</li>
                <li>Track your sales and analytics</li>
                <li>Update your store information</li>
            </ul>

            <p>Start building your online presence today!</p>

            <a href="{{ url('/seller/dashboard') }}" class="button">Go to Seller Dashboard</a>

            <p>If you have any questions, feel free to contact our support team.</p>

            <p>Best regards,<br>
            The ShopSphere Team</p>
        </div>

        <div class="footer">
            <p>This email was sent to {{ $seller->email }}. If you didn't expect this email, please ignore it.</p>
            <p>&copy; {{ date('Y') }} ShopSphere. All rights reserved.</p>
        </div>
    </div>
</body>
</html>