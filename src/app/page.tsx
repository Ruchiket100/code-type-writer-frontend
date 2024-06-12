"use client";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneLight, ascetic } from 'react-syntax-highlighter/dist/esm/styles/hljs';
export default function Home() {
  const generateQuery = useQuery(["generate"], async () => {
    const text = await fetch("http://127.0.0.1:8787/generate");
    return text.json();
  });
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [text, setText] = useState<string>();
  const [startTime, setStartTime] = useState<number>();
  const [endTime, setEndTime] = useState<number>();
  const [wordCount, setWordCount] = useState<number>();

  const calculateWPM = () => {
    if (startTime && endTime) {
      const durationInMinutes = (endTime - startTime) / 1000 / 60;
      const wordCount = text?.split(' ').length || 0;
      setWordCount(Math.round(wordCount / durationInMinutes))
    }
    return 0;
  };

  useEffect(() => {
    calculateWPM();
  }, [startTime, endTime])

  useEffect(() => {
    if (generateQuery.data && !text) {
      let data = generateQuery.data?.response.replace(/^```|```$/g, "");
      if (data[0] === ('\n' || " ")) data = data.slice(1)
      if (data[data.length - 1] === ('\n' || " ")) data = data.slice(0, -1)
      setText(data)
    }
  }, [generateQuery.data])

  // get cursor position  
  const cursor = () => {
    let spaces = input.replace(/[^\n]/g, ' ');
    spaces += "_"
    return spaces;
  }

  // get errors
  const showError = () => {
    let spaces = input.replace(/[^\n]/g, ' ');
    spaces += error
    return spaces;
  }

  const styles = { backgroundColor: "transparent", position: "absolute" }


  const handleInputChange = (e: any) => {
    if (!startTime) setStartTime(Date.now())

    const value = e.target.value || "";
    if (value.length < input.length) return;
    if (text && value === text.slice(0, value.length)) {
      if (error) setError(undefined)
      return setInput(value);
    }
    if (input === text && !endTime) {
      setEndTime(Date.now())
    }
    text && setError(text[value.length - 1])
  }

  return (
    <div className="flex gap-6 flex-col items-center justify-center min-h-screen">
      {wordCount && <div className="flex flex-col w-full p-4 md:w-2/4">
        <p className="text-sm text-gray-400">WPM</p>
        <b className="text-gray-700 text-4xl">{wordCount}</b>
      </div>}
      <div className="relative font-bold p-4 w-full h-full md:w-2/4">
        {/* Input Layer */}
        <textarea value={input} className="z-[9999] absolute opacity-0 input-transparent outline-none bg-transparent w-full h-full" onChange={handleInputChange} />
        <SyntaxHighlighter customStyle={{ ...styles, zIndex: "30" } as any} language="typescript" style={atomOneLight}>
          {input}
        </SyntaxHighlighter>
        {/* Cursor Layer */}
        <SyntaxHighlighter customStyle={{ ...styles, color: "black", fontWeight: "bold", zIndex: "30", width: "100%" } as any} language="typescript" style={atomOneLight}>
          {cursor()}
        </SyntaxHighlighter>
        {/* Error  Layer */}
        {error && <SyntaxHighlighter customStyle={{ ...styles, color: "red", zIndex: "20", width: "100%" } as any} language="typescript" style={atomOneLight}>
          {showError()}
        </SyntaxHighlighter>}
        {/* Reference Layer */}
        <SyntaxHighlighter customStyle={{ backgroundColor: "transparent", color: "gray" }} language="typescript" style={ascetic}>
          {text || ""}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
