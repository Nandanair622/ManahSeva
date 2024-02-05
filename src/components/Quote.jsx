import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiFillSound } from "react-icons/ai";
import { MdFileCopy } from "react-icons/md";

const Quote = () => {
  const [quote, setQuote] = useState({
    content: "",
    author: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const lastFetched = localStorage.getItem("lastFetched");
    const oneDayInMillis = 24 * 60 * 60 * 1000;

    // If lastFetched is not available or more than one day has passed, fetch a new quote
    if (!lastFetched || Date.now() - lastFetched > oneDayInMillis) {
      randomQuote();
    } else {
      // Use the stored quote
      const storedQuote = JSON.parse(localStorage.getItem("quote"));
      if (storedQuote) {
        setQuote(storedQuote);
      }
    }
  }, []);

  const randomQuote = () => {
    setLoading(true);
    axios
      .get("http://api.quotable.io/random")
      .then((response) => {
        const { content, author } = response.data;
        setQuote({ content, author });
        setLoading(false);

        // Store the new quote and update lastFetched in local storage
        localStorage.setItem("quote", JSON.stringify({ content, author }));
        localStorage.setItem("lastFetched", Date.now());
      })
      .catch((error) => {
        console.error("Error fetching quote:", error);
        setLoading(false);
      });
  };

  const speakQuote = () => {
    const synth = window.speechSynthesis;
    if (!loading) {
      let utterance = new SpeechSynthesisUtterance(
        `${quote.content} by ${quote.author}`
      );
      synth.speak(utterance);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(quote.content);
  };
  return (
    <div className="wrapper bg-white rounded p-8 shadow-lg max-w-3xl mx-auto flex flex-col items-center justify-center">
      <div className="content mt-4 text-center">
        <div className="quote-area">
          <i className="fas fa-quote-left text-2xl"></i>
          <p className="quote text-xl break-all">{quote.content}</p>
          <i className="fas fa-quote-right text-2xl"></i>
        </div>
        <div className="author italic text-lg mt-4">
          <span className="font-mono">-</span>
          <span className="name">{quote.author}</span>
        </div>
      </div>
      <div className="buttons border-t border-gray-300 mt-4">
        <div className="features flex mt-4 items-center justify-between">
          <ul className="flex">
            <li
              className={`speech relative ${
                loading ? "active" : ""
              } cursor-pointer mr-2 h-12 w-12 flex items-center justify-center border-2 border-blue-800 rounded-full transition duration-300 hover:after:absolute hover:after:content-['Hear'] hover:after:bg-white hover:after:text-blue-800`}
              onClick={speakQuote}
            >
              <AiFillSound
                className={`text-xl ${
                  loading ? "text-white" : "text-blue-800"
                }`}
              />
            </li>
            <li
              className="copy relative cursor-pointer mr-2 h-12 w-12 flex items-center justify-center border-2 border-blue-800 rounded-full transition duration-300 hover:after:absolute hover:after:content-['Copy'] hover:after:bg-white hover:after:text-blue-800"
              onClick={copyToClipboard}
            >
              <MdFileCopy
                className={`text-xl ${
                  loading ? "text-white" : "text-blue-800"
                }`}
              />
            </li>
          </ul>
          <button
            onClick={randomQuote}
            disabled={loading}
            className={`border-none text-white outline-none text-base cursor-pointer px-6 py-3 rounded-full bg-blue-800 ${
              loading ? "opacity-70 pointer-events-none" : ""
            }`}
          >
            {loading ? "Loading Quote..." : "New Quote"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quote;
