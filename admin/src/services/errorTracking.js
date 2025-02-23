class ErrorTrackingService {
  constructor() {
    this.errors = [];
    this.maxErrors = 100;
  }

  captureError(error, context = {}) {
    const errorInfo = {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      context,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    this.errors.push(errorInfo);
    
    // Trim old errors if we exceed maxErrors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Send to your error tracking service
    this.sendToErrorService(errorInfo);

    return errorInfo;
  }

   async sendToErrorService(errorInfo) {
    // Implement your error service integration here
    console.error('Error captured:', errorInfo);
  }
}

export const errorTracker = new ErrorTrackingService(); 