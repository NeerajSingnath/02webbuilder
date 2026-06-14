import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';

const Generate = () => {
  const PHASES = [
    'Analyzing your idea…',
    'Designing layout & structure…',
    'Writing HTML & CSS…',
    'Adding animations & interactions…',
    'Final quality checks…',
  ];
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [error, setError] = useState('');

  const handleGenerateWebsite = async () => {
    if (!prompt.trim() || loading) return;
    const promptToSend = prompt;
    setPrompt('');
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/website/generate`,
        { prompt: promptToSend },
        { withCredentials: true },
      );
      setProgress(100);
      navigate('/editor/' + result.data.websiteId);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to generate website');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      setPhaseIndex(0);
      setProgress(0);
      return;
    }

    let value = 0;
    let phase = 0;

    const interval = setInterval(() => {
      const increment =
        value < 20
          ? Math.random() * 1.5
          : value < 60
            ? Math.random() * 1.2
            : Math.random() * 0.6;
      value += increment;

      if (value >= 93) value = 93;

      phase = Math.min(
        Math.floor((value / 100) * PHASES.length),
        PHASES.length - 1,
      );

      setProgress(Math.floor(value));
      setPhaseIndex(phase);
    }, 1200);

    return () => clearInterval(interval);
  }, [loading]);

  return (
    <div className="min-h-screen bg-linear-to-br from-[#050505] via-[#0b0b0b] to-[#050505] text-white">
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="p-2 rounded-lg hover:bg-white/10 transition"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-lg font-semibold">
              GenWeb<span className="text-zinc-400">.ai</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
            Build Websites with
            <span className="block bg-linear-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Real AI Power
            </span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            This process may take several minutes. GenWeb.ai focuses on quality,
            not shortcuts.
          </p>
        </motion.div>
        <div className="mb-14">
          <h1 className="text-xl font-semibold mb-2">
            {!loading
              ? 'Describe your website'
              : 'Please wait while we generate your website'}
          </h1>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              placeholder={
                loading
                  ? 'Generating your website, please wait...'
                  : 'Describe your website in detail...'
              }
              className="w-full h-56 p-6 rounded-3xl bg-black/60 border border-white/30 outline-none resize-none text-sm leading-relaxed focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            ></textarea>
          </div>
          <div className="flex justify-center">
            <motion.button
              onClick={handleGenerateWebsite}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.96 }}
              className="px-14 py-4 rounded-2xl font-semibold text-lg bg-white text-black hover:bg-zinc-200 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : 'Generate Website'}
            </motion.button>
          </div>
        </div>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-xl mx-auto mt-12"
          >
            <div className="flex justify-between mb-2 text-xs text-zinc-400">
              <span>{PHASES[phaseIndex]}</span>
              <span>{progress}%</span>
            </div>

            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-linear-to-r from-white to-zinc-300"
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.8 }}
              />
            </div>

            <div className="text-center text-xs text-zinc-400 mt-4">
              Estimated time remaining:{' '}
              <span className="text-white font-medium">~8–12 minutes</span>
            </div>
          </motion.div>
        )}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto mt-8 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center"
          >
            <p className="text-sm text-red-400">{error}</p>
            <button
              onClick={() => setError('')}
              className="mt-4 px-4 py-2 text-xs font-semibold bg-red-500/20 hover:bg-red-500/30 rounded-lg transition"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Generate;
