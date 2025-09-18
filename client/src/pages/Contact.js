import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageSquare, Send, Clock, User, ArrowRight, Twitter, Instagram, Linkedin, Youtube, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [activeField, setActiveField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for button disable

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable button
    try {
      const response = await axios.post('http://localhost:5000/api/email/contact', formData);
      setStatus('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form
      // Optionally, re-enable button after a delay (e.g., 3 seconds)
      setTimeout(() => setIsSubmitting(false), 3000);
    } catch (error) {
      setStatus('Failed to send message. Please try again.');
      console.error('Error submitting form:', error);
      setIsSubmitting(false); // Re-enable button on error
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}

      {/* Hero Section */}
      <section className="py-8 bg-gradient-to-b from-cyan-50 via-cyan-50 to-cyan-50 md:py-16">
        <div className="container px-4 mx-auto mt-16 mb-8 md:px-6 md:mt-24 md:mb-8">
          <div className="max-w-3xl mx-auto text-center md:max-w-4xl">
            <motion.h1 
              initial="hidden"
              animate="visible"
              variants={slideUp}
              className="mb-4 text-3xl font-light text-gray-900 md:text-5xl lg:text-6xl"
            >
              Get in <span className="font-medium bg-gradient-to-r from-[#0077b6] to-[#00a8e8] bg-clip-text text-transparent">Touch</span>
            </motion.h1>
            <motion.p 
              initial="hidden"
              animate="visible"
              variants={slideUp}
              transition={{ delay: 0.2 }}
              className="max-w-xl mx-auto text-sm font-light text-gray-600 md:text-xl md:max-w-2xl"
            >
              We'd love to hear from you. Let's start a conversation.
            </motion.p>
          </div>
        </div>
      </section>

            {/* Main Content */}
      <section className="py-8 lg:ml-8 lg:mr-8 md:py-16">
        <div className="container px-4 mx-auto md:px-6">
          <div className="grid gap-8 lg:grid-cols-2 md:gap-12">
            {/* Contact Information */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 variants={slideUp} className="mb-6 text-2xl font-light text-gray-900 md:text-3xl md:mb-8">Contact Information</motion.h2>
              <motion.p variants={slideUp} className="mb-6 text-sm leading-relaxed text-gray-600 md:text-lg md:mb-10">
                Have questions about Vueon? Our team is here to help you bring your creative vision to life.
              </motion.p>
              
              <div className="space-y-4 md:space-y-6">
                <motion.div variants={slideUp} className="flex items-start p-4 bg-white border border-gray-100 rounded-lg shadow-md md:p-6 md:rounded-xl">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#0077b6] to-[#005691] rounded-md flex items-center justify-center mr-3 md:w-12 md:h-12 md:mr-4 md:rounded-lg">
                    <Mail className="w-5 h-5 text-white md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-base font-medium text-gray-900 md:text-lg">Email Us</h3>
                    <p className="text-sm text-gray-600 md:text-base">hello@vueon.com</p>
                    <p className="text-sm text-gray-600 md:text-base">support@vueon.com</p>
                  </div>
                </motion.div>

                <motion.div variants={slideUp} className="flex items-start p-4 bg-white border border-gray-100 rounded-lg shadow-md md:p-6 md:rounded-xl">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#0077b6] to-[#005691] rounded-md flex items-center justify-center mr-3 md:w-12 md:h-12 md:mr-4 md:rounded-lg">
                    <Phone className="w-5 h-5 text-white md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-base font-medium text-gray-900 md:text-lg">Call Us</h3>
                    <p className="text-sm text-gray-600 md:text-base">+94 (777) 987-2345</p>
                    <p className="text-sm text-gray-600 md:text-base">Mon-Fri, 9AM-6PM</p>
                  </div>
                </motion.div>

                <motion.div variants={slideUp} className="flex items-start p-4 bg-white border border-gray-100 rounded-lg shadow-md md:p-6 md:rounded-xl">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#0077b6] to-[#005691] rounded-md flex items-center justify-center mr-3 md:w-12 md:h-12 md:mr-4 md:rounded-lg">
                    <MapPin className="w-5 h-5 text-white md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-base font-medium text-gray-900 md:text-lg">Visit Us</h3>
                    <p className="text-sm text-gray-600 md:text-base">123 Innovation Drive</p>
                    <p className="text-sm text-gray-600 md:text-base">Colombo Sri Lanka, CA 94107</p>
                  </div>
                </motion.div>

                <motion.div variants={slideUp} className="p-4 bg-gradient-to-r from-[#0077b6] to-[#00a8e8] rounded-lg text-white md:p-6 md:rounded-xl">
                  <h3 className="mb-2 text-base font-medium md:text-lg">Follow Us</h3>
                  <p className="mb-3 text-sm opacity-90 md:text-base md:mb-4">Stay updated with our latest news and updates</p>
                  <div className="flex space-x-3 md:space-x-4">
                    <a href="#" className="flex items-center justify-center w-8 h-8 transition-colors rounded-full bg-white/20 hover:bg-white/30 md:w-10 md:h-10">
                      <Twitter className="w-4 h-4 md:w-5 md:h-5" />
                    </a>
                    <a href="#" className="flex items-center justify-center w-8 h-8 transition-colors rounded-full bg-white/20 hover:bg-white/30 md:w-10 md:h-10">
                      <Instagram className="w-4 h-4 md:w-5 md:h-5" />
                    </a>
                    <a href="#" className="flex items-center justify-center w-8 h-8 transition-colors rounded-full bg-white/20 hover:bg-white/30 md:w-10 md:h-10">
                      <Linkedin className="w-4 h-4 md:w-5 md:h-5" />
                    </a>
                    <a href="#" className="flex items-center justify-center w-8 h-8 transition-colors rounded-full bg-white/20 hover:bg-white/30 md:w-10 md:h-10">
                      <Youtube className="w-4 h-4 md:w-5 md:h-5" />
                    </a>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              transition={{ duration: 0.8 }}
            >
              <div className="p-6 bg-white border border-gray-100 rounded-lg shadow-lg md:p-8 md:rounded-xl">
                <h3 className="mb-2 text-xl font-light text-gray-900 md:text-2xl">Send us a message</h3>
                <p className="mb-6 text-sm text-gray-600 md:text-base md:mb-8">We'll get back to you within 24 hours</p>
                {status && <p className={`mb-4 text-sm ${status.includes('successfully') ? 'text-green-600' : 'text-red-600'} md:text-base`}>{status}</p>}
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 md:gap-6">
                    <div className="relative">
                      <label htmlFor="name" className="block mb-1 text-xs font-medium text-gray-700 md:text-sm md:mb-2">Your Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <User className="w-4 h-4 text-gray-400 md:w-5 md:h-5" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => setActiveField('name')}
                          onBlur={() => setActiveField(null)}
                          className={`w-full pl-9 pr-3 py-2 bg-gray-50 border ${activeField === 'name' ? 'border-[#0077b6]' : 'border-gray-200'} rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:ring-2 focus:ring-[#0077b6] focus:border-transparent transition-all md:pl-10 md:pr-4 md:py-3 md:text-base`}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <label htmlFor="email" className="block mb-1 text-xs font-medium text-gray-700 md:text-sm md:mb-2">Your Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Mail className="w-4 h-4 text-gray-400 md:w-5 md:h-5" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setActiveField('email')}
                          onBlur={() => setActiveField(null)}
                          className={`w-full pl-9 pr-3 py-2 bg-gray-50 border ${activeField === 'email' ? 'border-[#0077b6]' : 'border-gray-200'} rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:ring-2 focus:ring-[#0077b6] focus:border-transparent transition-all md:pl-10 md:pr-4 md:py-3 md:text-base`}
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <label htmlFor="subject" className="block mb-1 text-xs font-medium text-gray-700 md:text-sm md:mb-2">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => setActiveField('subject')}
                      onBlur={() => setActiveField(null)}
                      className={`w-full px-3 py-2 bg-gray-50 border ${activeField === 'subject' ? 'border-[#0077b6]' : 'border-gray-200'} rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:ring-2 focus:ring-[#0077b6] focus:border-transparent transition-all md:px-4 md:py-3 md:text-base`}
                      placeholder="How can we help?"
                      required
                    />
                  </div>
                  <div className="relative">
                    <label htmlFor="message" className="block mb-1 text-xs font-medium text-gray-700 md:text-sm md:mb-2">Your Message</label>
                    <div className="relative">
                      <div className="absolute pointer-events-none top-2 left-3 md:top-3">
                        <MessageSquare className="w-4 h-4 text-gray-400 md:w-5 md:h-5" />
                      </div>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setActiveField('message')}
                        onBlur={() => setActiveField(null)}
                        rows="4"
                        className={`w-full pl-9 pr-3 py-2 bg-gray-50 border ${activeField === 'message' ? 'border-[#0077b6]' : 'border-gray-200'} rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:ring-2 focus:ring-[#0077b6] focus:border-transparent transition-all md:pl-10 md:pr-4 md:py-3 md:text-base md:rows-5`}
                        placeholder="Tell us about your project or inquiry..."
                        required
                      ></textarea>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }} // Disable hover effect when submitting
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }} // Disable tap effect when submitting
                    type="submit"
                    disabled={isSubmitting} // Disable button
                    className={`group w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#0077b6] to-[#00a8e8] text-white rounded-lg font-medium transition-all duration-300 shadow-md text-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'} md:px-8 md:py-4 md:text-base`}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    <Send className={`w-4 h-4 ml-2 transition-transform ${isSubmitting ? '' : 'group-hover:translate-x-1'} md:w-5 md:h-5`} />
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

          {/* FAQ Section */}
    <section className="py-8 bg-gray-50 md:py-16">
      <div className="container px-4 mx-auto md:px-6">
        <div className="max-w-3xl mx-auto mb-8 text-center md:max-w-4xl md:mb-12">
          <h2 className="mb-3 text-2xl font-light text-gray-900 md:text-3xl md:mb-4">Frequently Asked Questions</h2>
          <p className="text-sm text-gray-600 md:text-base">Find quick answers to common questions about Vueon</p>
        </div>
        
        <div className="grid max-w-3xl gap-4 mx-auto md:grid-cols-2 md:gap-6 md:max-w-4xl">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideUp}
            className="p-4 bg-white border border-gray-100 rounded-lg shadow-md md:p-6 md:rounded-xl"
          >
            <h3 className="mb-1 text-base font-medium text-gray-900 md:text-lg md:mb-2">How do I create an account?</h3>
            <p className="text-sm text-gray-600 md:text-base">
              Click the "Sign Up" button in the top right corner, enter your email address, 
              create a password, and you're ready to start sharing your content.
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideUp}
            className="p-4 bg-white border border-gray-100 rounded-lg shadow-md md:p-6 md:rounded-xl"
          >
            <h3 className="mb-1 text-base font-medium text-gray-900 md:text-lg md:mb-2">What content can I share?</h3>
            <p className="text-sm text-gray-600 md:text-base">
              Vueon supports videos, images, articles, and audio files. We're constantly 
              expanding our supported formats to empower creators.
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideUp}
            className="p-4 bg-white border border-gray-100 rounded-lg shadow-md md:p-6 md:rounded-xl"
          >
            <h3 className="mb-1 text-base font-medium text-gray-900 md:text-lg md:mb-2">How does Vueon protect privacy?</h3>
            <p className="text-sm text-gray-600 md:text-base">
              Your data is encrypted, and we never share your personal information with 
              third parties without your consent. You control your privacy settings.
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideUp}
            className="p-4 bg-white border border-gray-100 rounded-lg shadow-md md:p-6 md:rounded-xl"
          >
            <h3 className="mb-1 text-base font-medium text-gray-900 md:text-lg md:mb-2">Can I collaborate with others?</h3>
            <p className="text-sm text-gray-600 md:text-base">
              Absolutely! Vueon offers collaboration tools to work with other creators on 
              projects, share editing capabilities, and co-publish content.
            </p>
          </motion.div>
        </div>
      </div>
    </section>

      {/* CTA Section */}
      


    </div>
  );
};

export default ContactUs;