import React, { useState } from 'react';
import Header from '../components/landingPage/Header';
import Footer from '../components/landingPage/Footer';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import contactImg from '../assets//landingPage/Contact_us.png';
import { contactService } from '../services/contact.service';
import { toast } from 'sonner';

// --- Hero Banner ---
const ContactHero = (): React.JSX.Element => (
  <section className="mt-20 relative  to-indigo-100 px-6 pt-12 pb-0 overflow-hidden" style={{ minHeight: '340px' }}>
    {/* Decorative dots */}
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(24)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-purple-300/40"
          style={{
            width: (i % 3 === 0 ? 6 : 4) + 'px',
            height: (i % 3 === 0 ? 6 : 4) + 'px',
            top: ((i * 17) % 100) + '%',
            left: ((i * 23) % 100) + '%',
          }}
        />
      ))}
    </div>

    {/* Text */}
    <div className="container mx-auto pb-12 md:pr-[340px] z-10 relative">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
        Connect <span className="text-primary">with us</span>{' '}
        <span className="inline-block text-purple-400 text-2xl align-middle">✦</span>
      </h1>
      <p className="text-gray-500 mb-8 leading-relaxed max-w-md">
        We'd love to hear from you! Get in touch with our Customer Success
        Team to inquire about speaking events, advertising rates, or just say
        hello.
      </p>
      <a
        href="mailto:nedjar.abdelilah.wail@gmail.com"
        className="btn btn-primary inline-flex items-center gap-2"
      >
        <Mail size={18} />
        Email us
      </a>
    </div>

    {/* Image — absolutely pinned to bottom-right, always flush with section bottom */}
    <div className="absolute -bottom-16 right-0 md:right-12 lg:right-24 z-10 leading-[0]">
      <img
        src={contactImg}
        alt="Customer support agent"
        className="block w-auto h-auto select-none"
        style={{ maxHeight: '480px' }}
      />
    </div>
  </section>
);

// --- Contact Info + Form ---
const ContactBody = (): React.JSX.Element => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        await contactService.send(form);
        setSubmitted(true);
    } catch (err: any) {
        toast.error(err.response?.data?.message || 'Failed to send message');
    }
};

  return (
    <section className="py-20 px-6 bg-white" id="contact">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-14">
          Contact Us
        </h2>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left — Info */}
          <div>
            <p className="text-gray-700 mb-8 leading-relaxed text-lg">
              Will you be in Los Angeles or any other branches any time soon?
              Stop by the office! We'd love to meet.
            </p>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 text-primary">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
                    Address
                  </p>
                  <p className="text-gray-600">
                    Constantine , Algeria
                    <br />
                    New York, USA
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 text-primary">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
                    Phone Number
                  </p>
                  <p className="text-gray-600">
                    (213) 562-510-029
                    <br />
                    (219) 555-0114
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 text-primary">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
                    Email Address
                  </p>
                  <p className="text-gray-600">
                    eduNovaAi@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Get in touch
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Feel free to contact with us, we love to make new partners &amp;
              friends
            </p>

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Send size={28} className="text-primary" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800">
                  Message Sent!
                </h4>
                <p className="text-gray-500">
                  Thank you for reaching out. We'll get back to you soon.
                </p>
                <button
                  className="btn btn-outline mt-2"
                  onClick={() => setSubmitted(false)}
                >
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-700 font-medium block mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First name..."
                      value={form.firstName}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 font-medium block mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last name..."
                      value={form.lastName}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-700 font-medium block mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700 font-medium block mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Message Subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700 font-medium block mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    placeholder="Write your message..."
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full flex items-center justify-center gap-2"
                >
                  Send Message
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Page ---
const ContactPage = (): React.JSX.Element => {
  return (
    <>
      <Header />
      <main>
        <ContactHero />
        <div className='relative bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100 px-12 pt-18 pb-0 overflow-hidden'>

        </div>
        <ContactBody />
      </main>
      <Footer />
    </>
  );
};

export default ContactPage;
