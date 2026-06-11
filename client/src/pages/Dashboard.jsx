import { ArrowLeft, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="p-2 rounded-lg hover:bg-white/10 transition"
              onClick={() => navigate('/')}
            >
              <ArrowLeft />
            </button>
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:scale-105 transition"
            onClick={() => navigate('/generate')}
          >
            <Plus size={16} /> New Website
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="text-sm text-zinc-400 mb-1">Welcome </p>
          <h1 className="text-3xl font-bold">{userData?.user?.name}</h1>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
