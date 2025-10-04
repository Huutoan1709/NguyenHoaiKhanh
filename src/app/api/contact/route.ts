import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message, phone } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng điền đầy đủ thông tin bắt buộc (tên, email, tin nhắn)' },
        { status: 400 }
      );
    }

    // Validate name
    if (name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Họ tên phải có ít nhất 2 ký tự' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Định dạng email không hợp lệ' },
        { status: 400 }
      );
    }

    // Message validation
    if (message.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Nội dung tin nhắn phải có ít nhất 10 ký tự' },
        { status: 400 }
      );
    }

    if (message.trim().length > 1000) {
      return NextResponse.json(
        { success: false, error: 'Nội dung tin nhắn không được vượt quá 1000 ký tự' },
        { status: 400 }
      );
    }

    // Get client info
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'Unknown';

    // Log the contact form submission with detailed info
    const contactData = {
      timestamp: new Date().toISOString(),
      vietnamTime: new Date().toLocaleString('vi-VN', { 
        timeZone: 'Asia/Ho_Chi_Minh',
        weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      name: name.trim(),
      email: email.trim(),
      phone: phone?.trim() || 'Không cung cấp',
      subject: subject?.trim() || 'Không có chủ đề',
      message: message.trim(),
      technical: {
        ip,
        userAgent,
        messageLength: message.trim().length,
        hasPhone: !!phone?.trim(),
        hasSubject: !!subject?.trim()
      }
    };

    console.log('📧 ==============================================');
    console.log('📧 TIN NHẮN MỚI TỪ WEBSITE');
    console.log('📧 ==============================================');
    console.log(`⏰ Thời gian: ${contactData.vietnamTime}`);
    console.log(`👤 Họ tên: ${contactData.name}`);
    console.log(`📧 Email: ${contactData.email}`);
    console.log(`📱 Điện thoại: ${contactData.phone}`);
    console.log(`📋 Chủ đề: ${contactData.subject}`);
    console.log('💬 Nội dung:');
    console.log('─'.repeat(50));
    console.log(contactData.message);
    console.log('─'.repeat(50));
    console.log(`🌐 IP: ${contactData.technical.ip}`);
    console.log(`📊 Độ dài tin nhắn: ${contactData.technical.messageLength} ký tự`);
    console.log('📧 ==============================================');

    // Simulate email processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    // TODO: Replace with actual email sending when nodemailer is configured
    // For production, integrate with:
    // - Nodemailer + Gmail SMTP
    // - SendGrid API
    // - AWS SES
    // - Or other email service

    return NextResponse.json({
      success: true,
      message: 'Tin nhắn đã được gửi thành công! Cảm ơn bạn đã liên hệ.',
      data: {
        timestamp: contactData.timestamp,
        vietnamTime: contactData.vietnamTime,
        messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` // Generate unique message ID
      }
    });

  } catch (error: any) {
    console.error('❌ Contact form error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Có lỗi hệ thống xảy ra. Vui lòng thử lại sau hoặc liên hệ trực tiếp qua email/điện thoại.' 
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Please use POST to submit contact form.' },
    { status: 405 }
  );
}