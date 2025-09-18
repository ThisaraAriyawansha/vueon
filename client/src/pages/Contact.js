import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Users, ArrowRight, Check } from 'lucide-react';

// Mock Link component for demonstration
const Link = ({ to, children, className, ...props }) => (
  <a href={to} className={className} {...props}>
    {children}
  </a>
);

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help from our support team',
      contact: 'hello@vueon.com',
      response: 'Within 24 hours',
      gradient: 'from-[#0077b6] to-[#005691]'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with us in real-time',
      contact: 'Available now',
      response: 'Instant response',
      gradient: 'from-[#005691] to-[#003366]'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with our team',
      contact: '+1 (555) 123-4567',
      response: 'Mon-Fri, 9AM-6PM PST',
      gradient: 'from-[#003366] to-[#192f4a]'
    }
  ];

  const offices = [
    {
      city: 'San Francisco',
      address: '1 Infinite Loop\nCupertino, CA 95014',
      timezone: 'PST (UTC-8)',
      isHeadquarters: true
    },
    {
      city: 'New York',
      address: '123 Broadway\nNew York, NY 10001',
      timezone: 'EST (UTC-5)',
      isHeadquarters: false
    },
    {
      city: 'London',
      address: '20 Eastbourne Terrace\nLondon W2 6LG',
      timezone: 'GMT (UTC+0)',
      isHeadquarters: false
    }
  ];

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white" style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Icons', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
      }}>
        <div className="max-w-md px-6 mx-auto text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#0077b6] to-[#005691] rounded-full flex items-center justify-center mx-auto mb-8">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-semibold text-[#192f4a] mb-4">Message Sent</h2>
          <p className="mb-8 text-lg leading-relaxed text-gray-600">
            Thanks for reaching out. We'll get back to you within 24 hours.
          </p>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="inline-flex items-center px-6 py-3 bg-[#0077b6] text-white rounded-full font-medium hover:bg-[#005691] transition-colors"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Icons', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
    }}>
      
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="container px-6 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl font-thin text-[#192f4a] mb-6 tracking-tight">
              Get in <span className="font-semibold bg-gradient-to-r from-[#0077b6] to-[#005691] bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl font-light leading-relaxed text-gray-600">
              We're here to help. Reach out to us through any of these channels, 
              and we'll get back to you as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="pb-20">
        <div className="container px-6 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8 md:grid-cols-3">
              {contactMethods.map((method, idx) => (
                <div key={idx} className="cursor-pointer group">
                  <div className="p-8 transition-all duration-300 border border-gray-100 bg-gray-50 rounded-2xl hover:bg-gray-100 hover:scale-105">
                    <div className={`w-16 h-16 bg-gradient-to-br ${method.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:rotate-3 transition-transform duration-300`}>
                      <method.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-[#192f4a] mb-3">{method.title}</h3>
                    <p className="mb-4 leading-relaxed text-gray-600">{method.description}</p>
                    <div className="space-y-2">
                      <div className="font-medium text-[#0077b6]">{method.contact}</div>
                      <div className="text-sm text-gray-500">{method.response}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gray-50">
        <div className="container px-6 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="mb-16 text-center">
              <h2 className="text-4xl font-light text-[#192f4a] mb-4">Send us a Message</h2>
              <p className="text-lg font-light text-gray-600">
                Fill out the form below and we'll respond within 24 hours
              </p>
            </div>
            
            <div className="overflow-hidden bg-white border border-gray-200 shadow-xl rounded-3xl">
              <div className="p-12">
                <div className="space-y-8">
                  
                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-medium text-[#192f4a] mb-4">
                      What can we help you with?
                    </label>
                    <div className="grid gap-3 md:grid-cols-3">
                      {['General Inquiry', 'Technical Support', 'Partnership'].map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => setFormData({...formData, category})}
                          className={`p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                            formData.category === category
                              ? 'border-[#0077b6] bg-[#0077b6]/5 text-[#0077b6]'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <div className="font-medium">{category}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Name and Email */}
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField('')}
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0077b6] focus:border-transparent transition-all duration-200 bg-white"
                        placeholder=" "
                        required
                      />
                      <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                        formData.name || focusedField === 'name'
                          ? '-top-2 text-sm bg-white px-2 text-[#0077b6]'
                          : 'top-4 text-gray-500'
                      }`}>
                        Full Name
                      </label>
                    </div>
                    
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField('')}
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0077b6] focus:border-transparent transition-all duration-200 bg-white"
                        placeholder=" "
                        required
                      />
                      <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                        formData.email || focusedField === 'email'
                          ? '-top-2 text-sm bg-white px-2 text-[#0077b6]'
                          : 'top-4 text-gray-500'
                      }`}>
                        Email Address
                      </label>
                    </div>
                  </div>
                  
                  {/* Subject */}
                  <div className="relative">
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('subject')}
                      onBlur={() => setFocusedField('')}
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0077b6] focus:border-transparent transition-all duration-200 bg-white"
                      placeholder=" "
                      required
                    />
                    <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                      formData.subject || focusedField === 'subject'
                        ? '-top-2 text-sm bg-white px-2 text-[#0077b6]'
                        : 'top-4 text-gray-500'
                    }`}>
                      Subject
                    </label>
                  </div>
                  
                  {/* Message */}
                  <div className="relative">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField('')}
                      rows={6}
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0077b6] focus:border-transparent transition-all duration-200 bg-white resize-none"
                      placeholder=" "
                      required
                    />
                    <label className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                      formData.message || focusedField === 'message'
                        ? '-top-2 text-sm bg-white px-2 text-[#0077b6]'
                        : 'top-4 text-gray-500'
                    }`}>
                      Message
                    </label>
                  </div>
                  
                  {/* Submit Button */}
                  <div className="flex justify-end">
                      <button
                      onClick={handleSubmit}
                      className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#0077b6] to-[#005691] text-white rounded-full font-medium hover:from-[#005691] hover:to-[#003366] transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      Send Message
                      <Send className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-20">
        <div className="container px-6 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16 text-center">
              <h2 className="text-4xl font-light text-[#192f4a] mb-4">Our Offices</h2>
              <p className="text-lg font-light text-gray-600">
                Find us around the world
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              {offices.map((office, idx) => (
                <div key={idx} className="relative">
                  <div className={`bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:bg-gray-100 transition-all duration-300 ${
                    office.isHeadquarters ? 'ring-2 ring-[#0077b6]/20 bg-[#0077b6]/5' : ''
                  }`}>
                    {office.isHeadquarters && (
                      <div className="absolute -top-3 left-6">
                        <span className="bg-gradient-to-r from-[#0077b6] to-[#005691] text-white text-xs font-medium px-3 py-1 rounded-full">
                          Headquarters
                        </span>
                      </div>
                    )}
                    <div className="flex items-center mb-4">
                      <MapPin className="w-6 h-6 text-[#0077b6] mr-3" />
                      <h3 className="text-xl font-semibold text-[#192f4a]">{office.city}</h3>
                    </div>
                    <div className="space-y-3">
                      <p className="text-gray-600 whitespace-pre-line">{office.address}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        {office.timezone}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container px-6 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="mb-16 text-center">
              <h2 className="text-4xl font-light text-[#192f4a] mb-4">Frequently Asked</h2>
              <p className="text-lg font-light text-gray-600">
                Quick answers to common questions
              </p>
            </div>
            
            <div className="space-y-6">
              {[
                {
                  question: "How quickly do you respond to support requests?",
                  answer: "We aim to respond to all support requests within 24 hours during business days, and often much sooner."
                },
                {
                  question: "Do you offer phone support?",
                  answer: "Yes, phone support is available Monday through Friday, 9 AM to 6 PM PST for all our users."
                },
                {
                  question: "Can I schedule a demo or consultation?",
                  answer: "Absolutely! Contact us through any channel and we'll set up a personalized demo at your convenience."
                }
              ].map((faq, idx) => (
                <div key={idx} className="p-6 bg-white border border-gray-200 rounded-xl">
                  <h3 className="text-lg font-semibold text-[#192f4a] mb-3">{faq.question}</h3>
                  <p className="leading-relaxed text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 bg-gradient-to-r from-[#192f4a] to-[#003366]">
        <div className="container px-6 mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="mb-6 text-4xl font-light text-white">
              Ready to get started?
            </h2>
            <p className="text-xl text-[#add8e6]/80 font-light mb-10 leading-relaxed">
              Join thousands of creators who trust Vueon with their content
            </p>
            <Link
              to="/register"
              className="group inline-flex items-center px-8 py-4 bg-white text-[#192f4a] rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105"
            >
              Get Started Today
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;