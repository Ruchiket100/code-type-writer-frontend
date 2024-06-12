"use client";
import { useState } from "react";
import { useQuery } from "react-query";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneLight, ascetic } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import hightlightSyntax from "../utils/highlightSyntax";
export default function Home() {
  // const generateQuery = useQuery("generate", async () => {
  //   const response = await fetch("http://127.0.0.1:8787/generate");
  //   return response.json();
  // });
  // console.log(generateQuery.data?.response)
  const [text, setText] = useState("");
  const [error, setError] = useState<string | undefined>();
  const response = "interface Book {\n  title: string;\n  author: string;\n  pages: number;\n}\n\nclass Library {\n  private books: Book[];\n\n  constructor() {\n    this.books = [];\n  }\n\n  addBook(title: string, author: string, pages: number) {\n    this.books.push({ title, author, pages });\n  }\n\n  getBooks() {\n    return this.books;\n  }\n}\n\nlet library = new Library();\nlibrary.addBook(\"Book 1\", \"Author 1\", 100);\nlibrary.addBook(\"Book 2\", \"Author 2\", 200);\nlibrary.addBook(\"Book 3\", \"Author 3\", 300);\n\nconsole.log(\"All Books:\");\nfor (let book of library.getBooks()) {\n  console.log(`Title: ${book.title}, Author: ${book.author}, Pages: ${book.pages}`);\n}"


  // get cursor position  
  const cursor = () => {
    let spaces = text.replace(/[^\n]/g, ' ');
    spaces += "_"
    return spaces;
  }

  // get errors
  const showError = () => {
    let spaces = text.replace(/[^\n]/g, ' ');
    spaces += error
    return spaces;
  }

  const styles = { backgroundColor: "transparent", position: "absolute" }


  const handleInputChange = (e: any) => {
    const value = e.target.value || "";
    if (value.length < text.length) return;
    if (value === response.slice(0, value.length)) {
      if (error) setError(undefined)
      return setText(value);
    }
    setError(response[value.length - 1])
  }

  return (
    <div className="relative font-bold p-4 ">
      {/* Input Layer */}
      <textarea value={text} className="z-[9999] absolute opacity-0 text-transparent outline-none bg-transparent w-full h-full" onChange={handleInputChange} />
      <SyntaxHighlighter customStyle={{ ...styles, zIndex: "20" } as any} language="typescript" style={atomOneLight}>
        {text}
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
        {response}
      </SyntaxHighlighter>
    </div>
  );
}
