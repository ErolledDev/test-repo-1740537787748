import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Search, ChevronDown, ChevronUp, ExternalLink, FileText, Video, Book, MessageCircle } from 'lucide-react';

const HelpCenterPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaqs, setExpandedFaqs] = useState<string[]>([]);

  const faqs = [
    {
      id: 'faq-1',
      question: 'How do I install the chat widget on my website?',
      answer: 'To install the chat widget, go to the Widget Settings page and copy the integration code. Paste this code just before the closing </body> tag on your website. The widget will automatically appear on your site.'
    },
    {
      id: 'faq-2',
      question: 'How do keyword responses work?',
      answer: 'Keyword responses allow your chat widget to automatically reply to common questions. When a visitor types a message containing a keyword you\'ve set up, the widget will respond with your pre-defined answer. You can set up keywords and responses in the Keyword Responses section.'
    },
    {
      id: 'faq-3',
      question: 'Can I customize the appearance of the chat widget?',
      answer: 'Yes, you can fully customize the appearance of your chat widget in the Widget Settings page. You can change colors, position, welcome message, and more to match your brand.'
    },
    {
      id: 'faq-4',
      question: 'How do I respond to live chats?',
      answer: 'You can respond to active chat sessions in the Live Chat section. When a visitor starts a conversation, you\'ll receive a notification and can join the chat to respond in real-time.'
    },
    {
      id: 'faq-5',
      question: 'What analytics are available?',
      answer: 'The Analytics section provides insights into your chat performance, including total chats, response times, visitor satisfaction, and keyword matches. You can filter data by date range to track improvements over time.'
    }
  ];

  const resources = [
    {
      title: 'Getting Started Guide',
      description: 'Learn the basics of setting up and using your chat widget',
      icon: <FileText className="w-6 h-6 text-indigo-600" />,
      link: '#'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step video guides for all features',
      icon: <Video className="w-6 h-6 text-indigo-600" />,
      link: '#'
    },
    {
      title: 'API Documentation',
      description: 'Technical documentation for developers',
      icon: <Book className="w-6 h-6 text-indigo-600" />,
      link: '#'
    },
    {
      title: 'Contact Support',
      description: 'Get help from our support team',
      icon: <MessageCircle className="w-6 h-6 text-indigo-600" />,
      link: '#'
    }
  ];

  const toggleFaq = (id: string) => {
    if (expandedFaqs.includes(id)) {
      setExpandedFaqs(expandedFaqs.filter(faqId => faqId !== id));
    } else {
      setExpandedFaqs([...expandedFaqs, id]);
    }
  };

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Help Center">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">How can we help you?</h2>
          <p className="mt-2 text-lg text-gray-600">
            Find answers to common questions and learn how to get the most out of your chat widget
          </p>
          
          <div className="relative max-w-2xl mx-auto mt-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for help..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        
        {/* Resources */}
        <div className="mb-12">
          <h3 className="mb-6 text-xl font-semibold text-gray-900">Resources</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {resources.map((resource, index) => (
              <a 
                key={index} 
                href={resource.link}
                className="flex flex-col items-center p-6 text-center bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-center w-12 h-12 mb-4 bg-indigo-100 rounded-full">
                  {resource.icon}
                </div>
                <h4 className="mb-2 text-lg font-medium text-gray-900">{resource.title}</h4>
                <p className="text-sm text-gray-600">{resource.description}</p>
                <div className="flex items-center mt-4 text-indigo-600">
                  <span className="text-sm font-medium">View</span>
                  <ExternalLink className="w-4 h-4 ml-1" />
                </div>
              </a>
            ))}
          </div>
        </div>
        
        {/* FAQs */}
        <div>
          <h3 className="mb-6 text-xl font-semibold text-gray-900">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {filteredFaqs.length === 0 ? (
              <div className="p-6 text-center bg-white rounded-lg">
                <p className="text-gray-600">No results found for "{searchTerm}"</p>
              </div>
            ) : (
              filteredFaqs.map((faq) => (
                <div key={faq.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="flex items-center justify-between w-full px-6 py-4 text-left focus:outline-none"
                  >
                    <h4 className="text-lg font-medium text-gray-900">{faq.question}</h4>
                    {expandedFaqs.includes(faq.id) ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  
                  {expandedFaqs.includes(faq.id) && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Contact Support */}
        <div className="p-6 mt-12 text-center bg-indigo-50 rounded-lg">
          <h3 className="mb-2 text-xl font-semibold text-indigo-900">Still need help?</h3>
          <p className="mb-4 text-indigo-700">
            Our support team is ready to assist you with any questions
          </p>
          <button className="px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Contact Support
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default HelpCenterPage;