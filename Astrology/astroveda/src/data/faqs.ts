export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const sampleFaqs: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Booking & Consultation',
    question: 'How do I book a consultation with MyGuruji?',
    answer: 'Select your preferred service, choose an available date and time slot in Indian Standard Time (IST), and enter your basic details. Your booking will enter pending status and you will receive a WhatsApp confirmation with appointment details.',
  },
  {
    id: 'faq-2',
    category: 'Consultation Format',
    question: 'Can I consult via video call if I live outside Pune or abroad?',
    answer: 'Yes, consultations are conducted globally via high-definition Google Meet, Zoom, or direct phone call. In-person chamber visits in Pune are also available by scheduled appointment.',
  },
  {
    id: 'faq-3',
    category: 'Birth Details',
    question: 'What if I do not have my exact birth time?',
    answer: 'If you have an approximate time window, MyGuruji conducts Janma Kundli time rectification based on major past life events, or can cast a Prashna Kundli (Horary chart) for specific immediate dilemmas.',
  },
  {
    id: 'faq-4',
    category: 'Payments & Dakshina',
    question: 'How does offline payment work?',
    answer: 'In adherence to traditional Vedic principles, no online payment gateway is used and no advance deposit is demanded. Dakshina is settled directly via UPI, bank transfer, or cash after your consultation is satisfactorily completed.',
  },
  {
    id: 'faq-5',
    category: 'Remedies & Ethics',
    question: 'Do you sell expensive gemstones or require costly poojas?',
    answer: 'Never. MyGuruji practices strictly constructive, non-commercial Jyotish. Remedies focus on self-discipline, classical Beej Mantras, charity, fasting, and practical lifestyle adjustments without fear-mongering.',
  },
];

