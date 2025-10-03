// ملف مساعد لرسائل أخطاء تسجيل الدخول
export interface LoginError {
  type: string;
  message: string;
  suggestion: string;
  field?: string;
}

export const LOGIN_ERROR_MESSAGES: Record<string, LoginError> = {
  email_not_found: {
    type: 'email_not_found',
    message: 'البريد الإلكتروني غير مسجل في النظام',
    suggestion: 'تأكد من البريد الإلكتروني أو قم بإنشاء حساب جديد',
    field: 'email'
  },
  invalid_password: {
    type: 'invalid_password', 
    message: 'كلمة المرور غير صحيحة',
    suggestion: 'تأكد من كلمة المرور أو استخدم "نسيت كلمة المرور"',
    field: 'password'
  },
  account_disabled: {
    type: 'account_disabled',
    message: 'حسابك معطل',
    suggestion: 'يرجى التواصل مع الإدارة لتفعيل حسابك',
    field: 'account'
  },
  validation_error: {
    type: 'validation_error',
    message: 'بيانات غير صحيحة',
    suggestion: 'تأكد من صحة البيانات المدخلة',
    field: 'form'
  },
  connection_error: {
    type: 'connection_error',
    message: 'خطأ في الاتصال بالخادم',
    suggestion: 'تحقق من اتصال الإنترنت والمحاولة مرة أخرى',
    field: 'network'
  }
};

export const getLoginErrorMessage = (errorType: string, defaultMessage?: string): LoginError => {
  return LOGIN_ERROR_MESSAGES[errorType] || {
    type: 'unknown',
    message: defaultMessage || 'حدث خطأ غير متوقع',
    suggestion: 'يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني',
    field: 'general'
  };
};

// دالة لتحديد نوع الخطأ من الاستجابة
export const parseLoginError = (response: any): LoginError => {
  if (response.error_type) {
    return getLoginErrorMessage(response.error_type, response.message);
  }
  
  // تحليل رسائل الخطأ التقليدية
  const message = response.message?.toLowerCase() || '';
  
  if (message.includes('email') || message.includes('بريد')) {
    return getLoginErrorMessage('email_not_found', response.message);
  }
  
  if (message.includes('password') || message.includes('كلمة المرور')) {
    return getLoginErrorMessage('invalid_password', response.message);
  }
  
  if (message.includes('disabled') || message.includes('معطل')) {
    return getLoginErrorMessage('account_disabled', response.message);
  }
  
  return getLoginErrorMessage('unknown', response.message);
};

// دالة للحصول على نصائح إضافية حسب نوع الخطأ
export const getErrorSuggestions = (errorType: string): string[] => {
  switch (errorType) {
    case 'email_not_found':
      return [
        'تأكد من كتابة البريد الإلكتروني بشكل صحيح',
        'تحقق من عدم وجود مسافات إضافية',
        'جرب استخدام بريد إلكتروني آخر',
        'قم بإنشاء حساب جديد إذا لم تكن مسجلاً'
      ];
    
    case 'invalid_password':
      return [
        'تأكد من كتابة كلمة المرور بشكل صحيح',
        'تحقق من حالة الأحرف (كبيرة/صغيرة)',
        'تأكد من عدم تفعيل Caps Lock',
        'استخدم "نسيت كلمة المرور" لإعادة تعيينها'
      ];
    
    case 'account_disabled':
      return [
        'تواصل مع خدمة العملاء',
        'تحقق من بريدك الإلكتروني لرسائل من الإدارة',
        'قد يكون حسابك مؤقتاً معطلاً لأسباب أمنية'
      ];
    
    default:
      return [
        'تحقق من اتصال الإنترنت',
        'حاول مرة أخرى بعد قليل',
        'امسح ذاكرة التخزين المؤقت للمتصفح'
      ];
  }
};