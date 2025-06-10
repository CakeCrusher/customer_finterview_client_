import React, { useState } from 'react';
import { Copy, Mail, Link, Check } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

interface InviteCandidatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  interviewTitle: string;
}

export const InviteCandidatesModal: React.FC<InviteCandidatesModalProps> = ({
  isOpen,
  onClose,
  interviewTitle
}) => {
  const [copied, setCopied] = useState(false);
  const [emails, setEmails] = useState('');
  const [sending, setSending] = useState(false);

  // Mock interview link
  const interviewLink = `https://ai-finance-interviewer.com/interview/abc123`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(interviewLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link');
    }
  };

  const handleSendEmails = async () => {
    setSending(true);
    // Mock sending emails
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSending(false);
    setEmails('');
    // Show success message or close modal
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite Candidates"
      size="lg"
    >
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {interviewTitle}
          </h3>
          <p className="text-gray-600">
            Share the interview link with candidates or send email invitations
          </p>
        </div>

        {/* Copy Link Section */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Link size={20} className="text-blue-600" />
              <h4 className="font-medium text-gray-900">Interview Link</h4>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex-1 bg-gray-50 p-3 rounded-lg font-mono text-sm text-gray-700 border">
              {interviewLink}
            </div>
            <Button
              variant="outline"
              icon={copied ? Check : Copy}
              onClick={handleCopyLink}
              className={copied ? 'text-green-600 border-green-300' : ''}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 mt-2">
            Anyone with this link can take the interview. Share it securely with your candidates.
          </p>
        </Card>

        {/* Email Invitations Section */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Mail size={20} className="text-teal-600" />
              <h4 className="font-medium text-gray-900">Send Email Invitations</h4>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Addresses
              </label>
              <textarea
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                rows={4}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter email addresses separated by commas or new lines&#10;candidate1@email.com&#10;candidate2@email.com"
              />
            </div>
            
            <Button
              onClick={handleSendEmails}
              loading={sending}
              disabled={!emails.trim()}
              icon={Mail}
              className="w-full"
            >
              {sending ? 'Sending Invitations...' : 'Send Invitations'}
            </Button>
          </div>
        </Card>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};