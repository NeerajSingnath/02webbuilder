import axios from 'axios';
import { Code2, MessageSquare, Monitor, Rocket, Send, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { serverUrl } from '../App';

function Editor() {
  const { id } = useParams();
  const [website, setWebsite] = useState(null);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  const iframeRef = useRef(null);
  useEffect(() => {
    const handleGetWebsite = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/website/getById/${id}`,
          { withCredentials: true },
        );
        setWebsite(result.data);
      } catch (error) {
        setError(error.response.data.message);
      }
    };
    handleGetWebsite();
  }, [id]);

  useEffect(() => {
    if (!iframeRef.current || !website?.latestCode) return;
    const blob = new Blob([website.latestCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    iframeRef.current.src = url;
    return () => URL.revokeObjectURL(url);
  }, [website?.latestCode]);

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-red-400">
        {error}
      </div>
    );
  }
  if (!website) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }
  return (
    <div className="h-screen w-screen flex bg-black text-white overflow-hidden">
      <aside className="hidden lg:flex w-95 flex-col border-r border-white/10 bg-black/80">
        <Header />
        {/* <Chat /> */}

        <>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] ${
                  m.role === 'user' ? 'ml-auto' : 'mr-auto'
                }`}
              >
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-white text-black'
                      : 'bg-white/5 border border-white/10 text-zinc-200'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-white/10">
            <div className="flex gap-2">
              <input
                placeholder="Describe Changes..."
                className="flex-1 resize-none rounded-2xl px-4 py-3 bg-white/5 border border-white/10 text-sm outline-none"
                onChange={(e) => null}
                value={null}
              />
              <button
                className="px-4 py-3 rounded-2xl bg-white text-black"
                onClick={null}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </>
      </aside>
      <div className="flex-1 flex flex-col">
        <div className="h-14 px-4 flex justify-between items-center border-b border-white/10 bg-black/80">
          <span className="text-xs text-zinc-400">Live Preview</span>
          <div className="flex gap-2">
            {website.deployed ? (
              <button
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 text-sm font-semibold hover:scale-105 transition"
                onClick={null}
              >
                <Rocket size={14} /> View Live
              </button>
            ) : (
              <button
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-linear-to-r from-indigo-500 to-purple-500 text-sm font-semibold hover:scale-105 transition"
                onClick={null}
              >
                <Rocket size={14} /> Deploy
              </button>
            )}

            <button className="p-2 lg:hidden" onClick={() => null}>
              <MessageSquare size={18} />
            </button>

            <button className="p-2" onClick={() => null}>
              <Code2 size={18} />
            </button>
            <button className="p-2" onClick={() => null}>
              <Monitor size={18} />
            </button>
          </div>
        </div>

        <iframe
          ref={iframeRef}
          sandbox="allow-scripts allow-same-origin allow-forms"
          className="flex-1 w-full bg-white"
        />
      </div>
    </div>
  );
  function Header({ onclose }) {
    return (
      <div className="h-14 px-4 flex items-center justify-between border-b border-white/10">
        <span className="font-semibold truncate">{website.title}</span>
        {onclose && (
          <button onClick={onclose}>
            <X size={18} color="white" />
          </button>
        )}
      </div>
    );
  }
}

export default Editor;
