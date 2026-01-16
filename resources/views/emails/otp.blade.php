<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .email-header {
            background-color: #4F46E5;
            color: #ffffff;
            padding: 30px;
            text-align: center;
        }
        .email-header h1 {
            margin: 0;
            font-size: 24px;
        }
        .email-body {
            padding: 40px 30px;
            color: #333333;
        }
        .otp-box {
            background-color: #F3F4F6;
            border: 2px dashed #4F46E5;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #4F46E5;
            letter-spacing: 8px;
            margin: 10px 0;
        }
        .email-footer {
            background-color: #F9FAFB;
            padding: 20px 30px;
            text-align: center;
            color: #6B7280;
            font-size: 14px;
        }
        .warning {
            background-color: #FEF3C7;
            border-left: 4px solid #F59E0B;
            padding: 15px;
            margin: 20px 0;
            color: #92400E;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>{{ $type === 'registration' ? 'Email Verification' : 'Password Reset' }}</h1>
        </div>
        
        <div class="email-body">
            <p>Hello,</p>
            
            @if($type === 'registration')
                <p>Thank you for registering! Please use the following OTP code to verify your email address:</p>
            @else
                <p>We received a request to reset your password. Please use the following OTP code to proceed:</p>
            @endif
            
            <div class="otp-box">
                <p style="margin: 0; font-size: 14px; color: #6B7280;">Your OTP Code</p>
                <div class="otp-code">{{ $otp }}</div>
                <p style="margin: 0; font-size: 12px; color: #6B7280;">Valid for 10 minutes</p>
            </div>
            
            <div class="warning">
                <strong>⚠️ Security Notice:</strong> Never share this code with anyone. Our team will never ask for your OTP code.
            </div>
            
            <p>If you didn't request this code, please ignore this email or contact our support team.</p>
            
            <p>Best regards,<br>The Team</p>
        </div>
        
        <div class="email-footer">
            <p>&copy; {{ date('Y') }} Your Company. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
        </div>
    </div>
</body>
</html>
