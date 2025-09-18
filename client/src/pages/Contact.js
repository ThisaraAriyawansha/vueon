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
      <section className="py-16 bg-gradient-to-b from-cyan-50 via-cyan-50 to-cyan-50">
        <div className="container px-6 mx-auto mt-24 mb-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              initial="hidden"
              animate="visible"
              variants={slideUp}
              className="mb-6 text-5xl font-light text-gray-900 md:text-6xl"
            >
              Get in <span className="font-medium bg-gradient-to-r from-[#0077b6] to-[#00a8e8] bg-clip-text text-transparent">Touch</span>
            </motion.h1>
            <motion.p 
              initial="hidden"
              animate="visible"
              variants={slideUp}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto text-xl font-light text-gray-600"
            >
              We'd love to hear from you. Let's start a conversation.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 lg:ml-8 lg:mr-8">
        <div className="container px-6 mx-auto">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Information */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 variants={slideUp} className="mb-8 text-3xl font-light text-gray-900">Contact Information</motion.h2>
              <motion.p variants={slideUp} className="mb-10 text-lg leading-relaxed text-gray-600">
                Have questions about Vueon? Our team is here to help you bring your creative vision to life.
              </motion.p>
              
              <div className="space-y-6">
                <motion.div variants={slideUp} className="flex items-start p-6 bg-white border border-gray-100 shadow-md rounded-xl">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#0077b6] to-[#005691] rounded-lg flex items-center justify-center mr-4">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-medium text-gray-900">Email Us</h3>
                    <p className="text-gray-600">hello@vueon.com</p>
                    <p className="text-gray-600">support@vueon.com</p>
                  </div>
                </motion.div>

                <motion.div variants={slideUp} className="flex items-start p-6 bg-white border border-gray-100 shadow-md rounded-xl">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#0077b6] to-[#005691] rounded-lg flex items-center justify-center mr-4">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-medium text-gray-900">Call Us</h3>
                    <p className="text-gray-600">+94 (777) 987-2345</p>
                    <p className="text-gray-600">Mon-Fri, 9AM-6PM </p>
                  </div>
                </motion.div>

                <motion.div variants={slideUp} className="flex items-start p-6 bg-white border border-gray-100 shadow-md rounded-xl">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#0077b6] to-[#005691] rounded-lg flex items-center justify-center mr-4">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-medium text-gray-900">Visit Us</h3>
                    <p className="text-gray-600">123 Innovation Drive</p>
                    <p className="text-gray-600">Colombo Sri Lanka, CA 94107</p>
                  </div>
                </motion.div>

                <motion.div variants={slideUp} className="p-6 bg-gradient-to-r from-[#0077b6] to-[#00a8e8] rounded-xl text-white">
                  <h3 className="mb-2 text-lg font-medium">Follow Us</h3>
                  <p className="mb-4 opacity-90">Stay updated with our latest news and updates</p>
                  <div className="flex space-x-4">
                    <a href="#" className="flex items-center justify-center w-10 h-10 transition-colors rounded-full bg-white/20 hover:bg-white/30">
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a href="#" className="flex items-center justify-center w-10 h-10 transition-colors rounded-full bg-white/20 hover:bg-white/30">
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a href="#" className="flex items-center justify-center w-10 h-10 transition-colors rounded-full bg-white/20 hover:bg-white/30">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href="#" className="flex items-center justify-center w-10 h-10 transition-colors rounded-full bg-white/20 hover:bg-white/30">
                      <Youtube className="w-5 h-5" />
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
              <div className="p-8 bg-white border border-gray-100 shadow-lg rounded-xl">
                <h3 className="mb-2 text-2xl font-light text-gray-900">Send us a message</h3>
                <p className="mb-8 text-gray-600">We'll get back to you within 24 hours</p>
                {status && <p className={`mb-4 ${status.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>{status}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="relative">
                      <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">Your Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <User className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => setActiveField('name')}
                          onBlur={() => setActiveField(null)}
                          className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${activeField === 'name' ? 'border-[#0077b6]' : 'border-gray-200'} rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#0077b6] focus:border-transparent transition-all`}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </div>
                    <div className="relative">
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Your Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setActiveField('email')}
                          onBlur={() => setActiveField(null)}
                          className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${activeField === 'email' ? 'border-[#0077b6]' : 'border-gray-200'} rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#0077b6] focus:border-transparent transition-all`}
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-700">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => setActiveField('subject')}
                      onBlur={() => setActiveField(null)}
                      className={`w-full px-4 py-3 bg-gray-50 border ${activeField === 'subject' ? 'border-[#0077b6]' : 'border-gray-200'} rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#0077b6] focus:border-transparent transition-all`}
                      placeholder="How can we help?"
                      required
                    />
                  </div>
                  <div className="relative">
                    <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-700">Your Message</label>
                    <div className="relative">
                      <div className="absolute pointer-events-none top-3 left-3">
                        <MessageSquare className="w-5 h-5 text-gray-400" />
                      </div>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setActiveField('message')}
                        onBlur={() => setActiveField(null)}
                        rows="5"
                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${activeField === 'message' ? 'border-[#0077b6]' : 'border-gray-200'} rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#0077b6] focus:border-transparent transition-all`}
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
                    className={`group w-full inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#0077b6] to-[#00a8e8] text-white rounded-lg font-medium transition-all duration-300 shadow-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    <Send className={`w-5 h-5 ml-2 transition-transform ${isSubmitting ? '' : 'group-hover:translate-x-1'}`} />
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-6 mx-auto">
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <h2 className="mb-4 text-3xl font-light text-gray-900">Frequently Asked Questions</h2>
            <p className="text-gray-600">Find quick answers to common questions about Vueon</p>
          </div>
          
          <div className="grid max-w-4xl gap-6 mx-auto md:grid-cols-2">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideUp}
              className="p-6 bg-white border border-gray-100 shadow-md rounded-xl"
            >
              <h3 className="mb-2 text-lg font-medium text-gray-900">How do I create an account?</h3>
              <p className="text-gray-600">
                Click the "Sign Up" button in the top right corner, enter your email address, 
                create a password, and you're ready to start sharing your content.
              </p>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideUp}
              className="p-6 bg-white border border-gray-100 shadow-md rounded-xl"
            >
              <h3 className="mb-2 text-lg font-medium text-gray-900">What content can I share?</h3>
              <p className="text-gray-600">
                Vueon supports videos, images, articles, and audio files. We're constantly 
                expanding our supported formats to empower creators.
              </p>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideUp}
              className="p-6 bg-white border border-gray-100 shadow-md rounded-xl"
            >
              <h3 className="mb-2 text-lg font-medium text-gray-900">How does Vueon protect privacy?</h3>
              <p className="text-gray-600">
                Your data is encrypted, and we never share your personal information with 
                third parties without your consent. You control your privacy settings.
              </p>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideUp}
              className="p-6 bg-white border border-gray-100 shadow-md rounded-xl"
            >
              <h3 className="mb-2 text-lg font-medium text-gray-900">Can I collaborate with others?</h3>
              <p className="text-gray-600">
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