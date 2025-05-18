/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, ReactNode, ChangeEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Edit3, Clock } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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


// --- Home Page ---
export default function BlogGenerator() {
  const [prompt, setPrompt] = useState<string>('');
  const [tone, setTone] = useState<string>("friendly");
  const [result, setResult] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [instant, setInstant] = useState<boolean>(false)


  console.log(result)

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    // localStorage.removeItem("Blogs")
    try { 
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt, tone }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      localStorage.setItem("blogs", JSON.stringify(data.result))
      const result = localStorage.getItem("blogs")

      if (result) {
        setResult(JSON.parse(result));
      } else {
        setResult([]);
      }
    } catch (error) {
      console.error(error);
      // optionally show an error state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setInstant(true)
    const result = localStorage.getItem("blogs")
    if (result) {
      setResult(JSON.parse(result));

    } else {
      setResult([]);
    }
  }, [])



  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 p-8 ">
      <div >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white bg-opacity-80 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl p-10 flex flex-col mx-auto mb-4"
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

        </motion.div>
      </div>
      <div className='lg:grid grid-cols-2 gap-2  lg:w-[80%] mx-auto border p-2 '>
        {
          result.map((post: any, idx: number) => (
            <Card
              key={post.id || idx}
              className="
    group
    relative
    overflow-hidden
    rounded-3xl
    bg-white dark:bg-gray-800
    shadow-md
    hover:shadow-xl
    transition-shadow duration-300
  "
            >
              {/* Image with zoom & gradient */}
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={post.photo}
                  alt={post.title}
                  fill
                  className="
        object-cover
        group-hover:scale-110
        transition-transform duration-500
      "
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Content */}
              <CardContent className="px-6 py-4">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-2">


                    <span>By {post.author}</span>
                  </div>
                  <span>
                    {post.date
                      ? new Date(post.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                      : ""}
                  </span>
                </div>

                <CardTitle className="mt-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {post.title}
                </CardTitle>

                <CardDescription className="mt-2 text-gray-700 dark:text-gray-300 line-clamp-3">
                  {post.excerpt}
                </CardDescription>
              </CardContent>

              {/* Footer with reading time, action button & tags */}
              <CardFooter className="flex flex-col gap-4 px-6 pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{post.readingTime}</span>
                  </div>
                  <Button onClick={() => { }} loading={false}>
                    Read More
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags?.map((tag: any) => (
                    <Badge key={tag} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardFooter>
            </Card>
          ))
        }
        {
          loading === true ? <div>Loading</div> : ""
        }
      </div>
      <div>
        <Dialog open={instant} onOpenChange={setInstant}>
          {/* <DialogTrigger>Open</DialogTrigger> */}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  )
}
