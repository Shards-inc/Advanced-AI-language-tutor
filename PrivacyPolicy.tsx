
import React from 'react';
import { FeatureId } from './types';

const BackIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>);

interface PrivacyPolicyProps {
  setActiveFeature: (feature: FeatureId) => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ setActiveFeature }) => {
  return (
    <div className="p-4 sm:p-8 h-full flex flex-col bg-background-primary text-text-primary">
      <header className="flex items-center pb-4 border-b border-background-tertiary/50">
        <button
          onClick={() => setActiveFeature('settings')}
          className="p-2 rounded-full hover:bg-background-secondary"
          aria-label="Back to settings"
        >
          <BackIcon />
        </button>
        <h1 className="text-xl font-bold ml-4">Privacy Policy</h1>
      </header>

      <main className="flex-1 overflow-y-auto mt-6">
        <div className="max-w-3xl mx-auto prose prose-invert prose-lg prose-headings:font-heading prose-headings:text-accent-primary prose-a:text-accent-primary hover:prose-a:text-accent-primary-dark">
          <p className="text-sm text-text-secondary">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <h2>1. Introduction</h2>
          <p>Welcome to Linguamate.ai. We are committed to protecting your privacy and handling your data in an open and transparent manner. This Privacy Policy explains how we collect, use, process, and safeguard your information when you use our application.</p>

          <h2>2. Information We Collect</h2>
          <p>We collect information to provide and improve our service. The types of information we collect are:</p>
          <ul>
            <li><strong>User-Provided Information:</strong> This includes information you provide during onboarding, such as your native language, learning language, experience level, goals, and interests. It also includes any text you type, images or videos you upload, and audio you record within the app.</li>
            <li><strong>AI-Generated Content:</strong> To provide our services, your prompts and uploaded content are processed by Google's Gemini API. We store the conversations, translations, analyses, and generated media to maintain your session history and learning continuity.</li>
            <li><strong>Device Permissions:</strong> With your consent, we may access your device's microphone for features like Live Tutoring and Pronunciation Practice, and your geolocation for features like Explore & Discover to provide location-aware results.</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>Your information is used to:</p>
          <ul>
            <li>Personalize your learning path and content.</li>
            <li>Operate and maintain the app's features, such as providing translations, generating images, and facilitating conversations with our AI tutor.</li>
            <li>Improve our AI models and the overall effectiveness of our learning ecosystem.</li>
            <li>Communicate with you about app updates or support inquiries.</li>
          </ul>

          <h2>4. How We Share Your Information</h2>
          <p>We do not sell your personal data. We may share information under the following circumstances:</p>
          <ul>
            <li><strong>With Service Providers:</strong> Your prompts, conversations, and uploaded content are securely sent to Google to be processed by the Gemini API, which powers our core AI features. We encourage you to review <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a>.</li>
            <li><strong>For Legal Reasons:</strong> We may disclose information if required by law or in response to valid requests by public authorities.</li>
          </ul>

          <h2>5. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your data from unauthorized access, use, alteration, or destruction. However, please be aware that no method of electronic transmission or storage is 100% secure.</p>

          <h2>6. Your Rights and Choices</h2>
          <p>You have control over your data. Within the <strong>Settings</strong> page of this application, you can:</p>
          <ul>
            <li><strong>Export Progress:</strong> You can download a file containing your learning data and settings at any time.</li>
            <li><strong>Reset Progress:</strong> You can clear all your learning data from the application, which will permanently delete your history and reset all settings to their defaults.</li>
          </ul>

          <h2>7. Children's Privacy</h2>
          <p>Linguamate.ai is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it.</p>

          <h2>8. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.</p>

          <h2>9. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us through the "Contact Support" option in the app's settings.</p>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
