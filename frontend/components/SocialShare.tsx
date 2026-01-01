'use client';

import { Share2, Facebook, Twitter, Mail, Link as LinkIcon } from 'lucide-react';
import { useState } from 'react';

interface SocialShareProps {
  productName: string;
  productUrl: string;
  productImage?: string;
}

export default function SocialShare({ productName, productUrl, productImage }: SocialShareProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}${productUrl}` : productUrl;
  const shareText = `Check out ${productName} on BibaLuxe!`;

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const shareToPinterest = () => {
    const imageUrl = productImage || '';
    window.open(
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareText)}&media=${encodeURIComponent(imageUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const shareViaEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`Check out this product: ${shareUrl}`)}`;
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-semibold text-gray-700">Share:</span>
      <div className="flex items-center gap-2">
        <button
          onClick={shareToFacebook}
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          aria-label="Share on Facebook"
        >
          <Facebook className="w-4 h-4" />
        </button>
        <button
          onClick={shareToTwitter}
          className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"
          aria-label="Share on Twitter"
        >
          <Twitter className="w-4 h-4" />
        </button>
        <button
          onClick={shareToPinterest}
          className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          aria-label="Share on Pinterest"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
          </svg>
        </button>
        <button
          onClick={shareViaEmail}
          className="p-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Share via Email"
        >
          <Mail className="w-4 h-4" />
        </button>
        <button
          onClick={copyLink}
          className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors relative"
          aria-label="Copy link"
        >
          <LinkIcon className="w-4 h-4" />
          {copied && (
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              Copied!
            </span>
          )}
        </button>
      </div>
    </div>
  );
}

