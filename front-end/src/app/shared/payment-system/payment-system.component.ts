import { DatePipe, DecimalPipe, NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';


interface PaymentData {
  amount: number;
  patientId: string;
  patientName: string;
  serviceType: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
}

@Component({
  selector: 'app-payment-system',
  imports: [NgIf, ReactiveFormsModule, FormsModule, DecimalPipe, NgClass],
  templateUrl: './payment-system.component.html',
  providers: [DatePipe, DecimalPipe],
  styleUrl: './payment-system.component.scss'
})
export class PaymentSystemComponent {
  paymentForm: FormGroup;
  isProcessing = false;
  paymentSuccess = false;
  paymentError = false;
  errorMessage = '';
  transactionId = '';

  // Mock payment data - would come from route params or service in real app
  paymentInfo = {
    amount: 1250.00,
    patientId: 'P-2024-001',
    patientName: 'John Doe',
    serviceType: 'Cardiology Consultation',
    invoiceNumber: 'INV-2024-0456'
  };

  constructor(private fb: FormBuilder) {
    this.paymentForm = this.createPaymentForm();
  }

  ngOnInit(): void {
    this.formatCardNumber();
    this.formatExpiryDate();
  }

  private createPaymentForm(): FormGroup {
    return this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      cardholderName: ['', [Validators.required, Validators.minLength(2)]],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]],
      acceptTerms: [false, Validators.requiredTrue]
    });
  }

  private formatCardNumber(): void {
    const cardNumberControl = this.paymentForm.get('cardNumber');
    if (cardNumberControl) {
      cardNumberControl.valueChanges.subscribe(value => {
        if (value) {
          const formattedValue = value
            .replace(/\s/g, '')
            .replace(/(.{4})/g, '$1 ')
            .trim()
            .substring(0, 19);
          if (formattedValue !== value) {
            cardNumberControl.setValue(formattedValue, { emitEvent: false });
          }
        }
      });
    }
  }

  private formatExpiryDate(): void {
    const expiryControl = this.paymentForm.get('expiryDate');
    if (expiryControl) {
      expiryControl.valueChanges.subscribe(value => {
        if (value) {
          const formattedValue = value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1/$2')
            .substring(0, 5);
          if (formattedValue !== value) {
            expiryControl.setValue(formattedValue, { emitEvent: false });
          }
        }
      });
    }
  }

  getCardType(cardNumber: string): string {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    if (cleanNumber.startsWith('4')) return 'visa';
    if (cleanNumber.startsWith('5') || cleanNumber.startsWith('2')) return 'mastercard';
    if (cleanNumber.startsWith('3')) return 'amex';
    return 'unknown';
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      this.processPayment();
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.paymentForm.controls).forEach(key => {
      const control = this.paymentForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  private processPayment(): void {
    this.isProcessing = true;
    this.paymentError = false;
    this.errorMessage = '';

    // Simulate API call with realistic delay
    setTimeout(() => {
      const paymentData: PaymentData = {
        amount: this.paymentInfo.amount,
        patientId: this.paymentInfo.patientId,
        patientName: this.paymentInfo.patientName,
        serviceType: this.paymentInfo.serviceType,
        cardNumber: this.paymentForm.value.cardNumber,
        expiryDate: this.paymentForm.value.expiryDate,
        cvv: this.paymentForm.value.cvv,
        cardholderName: this.paymentForm.value.cardholderName,
        billingAddress: {
          street: this.paymentForm.value.street,
          city: this.paymentForm.value.city,
          state: this.paymentForm.value.state,
          zipCode: this.paymentForm.value.zipCode
        }
      };

      // Simulate payment processing logic
      const response = this.simulatePaymentProcessing(paymentData);

      this.isProcessing = false;

      if (response.success) {
        this.paymentSuccess = true;
        this.transactionId = response.transactionId || '';
      } else {
        this.paymentError = true;
        this.errorMessage = response.message;
      }
    }, 2500);
  }

  private simulatePaymentProcessing(data: PaymentData): PaymentResponse {
    // Simulate various payment scenarios
    const random = Math.random();

    // 5% chance of card declined
    if (random < 0.05) {
      return {
        success: false,
        message: 'Payment declined. Please check your card details or try a different payment method.'
      };
    }

    // 3% chance of insufficient funds
    if (random < 0.08) {
      return {
        success: false,
        message: 'Insufficient funds. Please check your account balance or try a different card.'
      };
    }

    // 2% chance of network error
    if (random < 0.10) {
      return {
        success: false,
        message: 'Network error occurred. Please try again in a few moments.'
      };
    }

    // 90% success rate
    return {
      success: true,
      transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      message: 'Payment processed successfully!'
    };
  }

  startNewPayment(): void {
    this.paymentSuccess = false;
    this.paymentError = false;
    this.paymentForm.reset();
    this.transactionId = '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.paymentForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.paymentForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['pattern']) return `Invalid ${fieldName} format`;
      if (field.errors['minlength']) return `${fieldName} is too short`;
    }
    return '';
  }
}
