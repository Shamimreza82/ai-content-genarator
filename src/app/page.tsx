/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, ReactNode, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Edit3 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// --- Button Props ---
interface ButtonProps {
  onClick: () => void;
  loading: boolean;
  children: ReactNode;
}
function Button({ onClick, loading, children }: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition"
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="animate-spin h-5 w-5" />
      ) : (
        <Edit3 className="h-5 w-5" />
      )}
      {children}
    </motion.button>
  );
}

// --- TextArea Props ---
interface TextAreaProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}
function TextArea({ value, onChange }: TextAreaProps) {
  return (
    <div className="relative flex-1">
      <textarea
        id="prompt"
        className="peer w-full h-32 p-4 pt-6 border-0 bg-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-300 transition resize-none"
        placeholder=" "
        value={value}
        onChange={onChange}
      />
      <label
        htmlFor="prompt"
        className="absolute top-2 left-4 text-gray-500 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm transition"
      >
        Enter your topic...
      </label>
    </div>
  );
}

// --- Select Props ---
interface SelectOption {
  value: string;
  label: string;
}
interface SelectProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
}
function Select({ value, onChange, options }: SelectProps) {
  return (
    <div className="relative w-40">
      <select
        id="tone"
        className="peer w-full p-3 pt-6 border-0 bg-gray-100 rounded-2xl focus:ring-2 focus:ring-pink-300 transition appearance-none"
        value={value}
        onChange={onChange}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <label
        htmlFor="tone"
        className="absolute top-2 left-4 text-gray-500 text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm transition"
      >
        Select tone
      </label>
    </div>
  );
}

// --- MarkdownResult Props ---
interface MarkdownResultProps {
  content: string;
}
function MarkdownResult({ content }: MarkdownResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="prose prose-lg max-w-none mt-8 bg-white p-6 rounded-2xl shadow-md"
    >
      <ReactMarkdown
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = (props as any).inline;
            return !isInline && match ? (
              <SyntaxHighlighter
                language="javascript"
                style={atomDark} // This is correct!
                customStyle={{ borderRadius: 8 }} // Use this for your own CSS
              >
                {`const x = 1;`}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props} />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </motion.div>
  );
}

// --- Home Page ---
export default function Home() {
  const [prompt, setPrompt] = useState<string>('');
  const [tone, setTone] = useState<string>('friendly');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);


  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt, tone }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data: { result: string } = await res.json();
      setResult(data.result);
    } catch (error) {
      console.error(error);
      // optionally show an error state
    } finally {
      setLoading(false);
    }
  };



  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 flex items-center justify-center p-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white bg-opacity-80 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full p-10 flex flex-col"
      >
        <h1 className="flex items-center justify-center space-x-3 text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-400 mb-6">
          <Edit3 className="h-8 w-8" />
          <span>AI Content Generator</span>
        </h1>

        <div className="flex flex-col md:flex-row gap-8 mb-6">
          <TextArea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            options={[
              { value: 'friendly', label: 'Friendly' },
              { value: 'formal', label: 'Formal' },
              { value: 'witty', label: 'Witty' },
            ]}
          />
        </div>

        <Button onClick={generate} loading={loading}>
          Generate Content
        </Button>

        {result && <MarkdownResult content={result} />}
      </motion.div>
    </main>
  );
}
