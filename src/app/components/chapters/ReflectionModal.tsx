import { motion, AnimatePresence } from "framer-motion";
import { SavedReflection } from "@/types/quran";

type Props = {
  savedReflections: SavedReflection[];
  onClose: () => void;
  onDelete: (i: number) => void;
};

function ReflectionModal({ savedReflections, onClose, onDelete }: Props) {
  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      >
        <motion.div
          key="modal"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          role="dialog"
          aria-modal="true"
          className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative"
        >  
          <button 
            onClick={() => onClose()}
            aria-label="Close"
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>

          <h2 className="text-2xl font-semibold text-emerald-800 mb-6 text-center">
            🌸 Your Saved Reflections
          </h2>

          {savedReflections.length === 0 ? (
            <p className="text-gray-600 text-center">No reflections saved yet.</p>
          ) : (
            <ul className="space-y-4 max-h-[60vh] overflow-y-auto">
              {savedReflections.map((item, index) => (
                <li
                  key={index}
                  className="border border-emerald-100 rounded-xl p-4 bg-emerald-50/40 hover:bg-emerald-50 transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-500 italic">
                      {new Date(item.date).toLocaleDateString()} • Verse {item.verseKey}
                    </p>
                    <button onClick={() => onDelete(index)} className="text-red-500 text-sm hover:underline">
                      Delete
                    </button>
                  </div>
                  <p className="text-gray-800 mb-2">{item.verse}</p>
                  <p className="text-emerald-800 font-medium italic">“{item.userReflection}”</p>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ReflectionModal;