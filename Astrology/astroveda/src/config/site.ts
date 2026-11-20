/**
 * AstroVeda Central Site & Contact Configuration
 * 
 * Edit this single file to update the name, phone number, WhatsApp link,
 * email address, and physical sanctuary location across the entire platform.
 */

export const siteConfig = {
  // Brand & Astrologer Details
  name: 'MyGuruji',
  tagline: 'Ancient Wisdom, Brighter Tomorrow',
  astrologer: {
    name: 'Omkar Ransing Guruji',
    title: 'Vedic Astrologer & Jyotish Visharad',
    lineage: 'Parashari & Jaimini Lineage',
  },

  // Contact Coordinates
  contact: {
    // Primary phone for calling
    phone: '+91 7776970890',
    phoneRaw: '+917776970890',

    // Official WhatsApp phone number (country code without '+' for wa.me URL)
    whatsappNumber: '917776970890',
    whatsappDisplay: '+91 7776970890',

    // Official enquiry email
    email: 'info@myguruji.com',

    // Sanctuary physical location
    address: {
      line1: 'Sacred Sanctuary Chamber',
      locality: 'Chembur, Pune',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      pincode: '411028',
      // Formatted text displayed in footer and cards
      shortText: 'Pune, Maharashtra, India',
      fullText: 'Sacred Sanctuary Chamber, Chembur, Pune, Maharashtra 400071',
    },

    // Sanctuary consultation hours
    workingHours: 'Mon - Sat: 10:00 AM - 7:00 PM (IST)',
    closedDays: 'Sunday: Closed for Planetary Prayers',
  },

  // Helper generators for WhatsApp URLs
  getWhatsAppUrl: (customMessage?: string) => {
    const msg = customMessage || 'Namaste MyGuruji, I would like to enquire about an astrological consultation.';
    return `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  },
};

