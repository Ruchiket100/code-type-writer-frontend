"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneLight, ascetic, srcery } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { FaReact } from "react-icons/fa";
export default function Home() {
  const generateQuery = useQuery(["generate"], async () => {
    const text = await fetch(" https://calm-disk-0cc0.ruchiket100.workers.dev/generate");
    return text.json();
  });
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [text, setText] = useState<string>();
  const [startTime, setStartTime] = useState<number>();
  const [endTime, setEndTime] = useState<number>();
  const [wordCount, setWordCount] = useState<number>();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

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

  const isInputRefFocused = () => {
    return document.activeElement === inputRef.current || false;
  }

  useEffect(() => {
    setIsInputFocused(isInputRefFocused())
  }, [inputRef.current])

  console.log(isInputRefFocused())

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
    <div className="flex gap-3 flex-col items-center justify-center min-h-screen bg-black">
      <div className="p-4 flex flex-col gap-3 w-full h-full md:w-2/4 transition-all">
        <h1 className="text-4xl font-bold text-white w-full">Improve Your Typing Skills</h1>
        {wordCount && <div className="fixed top-1/2 left-[10%] flex flex-col w-full p-4 md:w-2/4">
          <p className="text-sm text-gray-400">WPM</p>
          <b className="text-gray-700 text-4xl">{wordCount}</b>
        </div>}

        <div className="relative font-medium  text-xl pt-10">
          {
            generateQuery.isLoading && (
              <div className="text-gray-500 flex gap-2 items-center text-sm p-4">
                <FaReact className="text-2xl animate-spin text-purple-600" />
                generating syntax...
              </div>
            )
          }
          {!isInputFocused && !generateQuery.isLoading && (
            <div onClick={(e) => {
              setIsInputFocused(true)
              inputRef.current?.focus()
            }} className="text-md rounded-sm flex justify-center items-center absolute w-full h-full z-[999] p-4 backdrop-blur-sm bg-gray-800/10 text-gray-200">
              Click here to start typing
            </div>
          )}
          {!generateQuery.isLoading && <>
            {/* Input Layer */}
            <textarea onClick={() => setIsInputFocused(true)} ref={inputRef} value={input} className=" z-[999] absolute bg-transparent input-transparent outline-none opacity-0  w-full h-full" onChange={handleInputChange} />
            <SyntaxHighlighter customStyle={{ ...styles, zIndex: "30" } as any} language="typescript" style={srcery}>
              {input}
            </SyntaxHighlighter>
            {/* Cursor Layer */}
            <SyntaxHighlighter customStyle={{ ...styles, color: "white", fontWeight: "bold", zIndex: "30", width: "100%" } as any} language="typescript" style={srcery}>
              {cursor()}
            </SyntaxHighlighter>
            {/* Error  Layer */}
            {error && <SyntaxHighlighter customStyle={{ ...styles, color: "red", zIndex: "20", width: "100%" } as any} language="typescript" style={srcery}>
              {showError()}
            </SyntaxHighlighter>}
            {/* Reference Layer */}
            <SyntaxHighlighter customStyle={{ backgroundColor: "transparent", color: "gray" }} language="typescript" style={ascetic}>
              {text || ""}
            </SyntaxHighlighter>
          </>}
        </div>
      </div>
    </div>
  );
}
