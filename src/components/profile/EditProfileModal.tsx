import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';
import { updateProfile } from 'firebase/auth';
import { auth, storage } from '@/services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentPhotoURL: string;
}

const AVATAR_SUGGESTIONS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200&auto=format&fit=crop', // Abstract 3D liquid
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=200&auto=format&fit=crop', // Neon sphere
  'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=200&auto=format&fit=crop', // Dark geometric
  'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=200&auto=format&fit=crop', // Purple abstract waves
  'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=200&auto=format&fit=crop', // Gradient blur (Fixed)
];

export default function EditProfileModal({ isOpen, onClose, currentName, currentPhotoURL }: EditProfileModalProps) {
  const { t } = useLanguage();
  const [name, setName] = useState(currentName || '');
  const [photoURL, setPhotoURL] = useState(currentPhotoURL || '');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    if (!auth.currentUser) return;
    
    setLoading(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photoURL,
      });
      toast.success(t('epSuccess'));
      onClose();
      // Reload to ensure all components (Navbar, Profile) get the fresh user data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('File selected:', file?.name);
    if (!file) return;
    if (!auth.currentUser) {
      console.error('No authenticated user found');
      toast.error('You must be logged in to upload an image.');
      return;
    }

    // Validate file type and size (e.g., max 2MB)
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB.');
      return;
    }

    setUploading(true);
    try {
      console.log('Starting upload for file:', file.name);
      // Create a unique file name
      const fileName = `avatars/${auth.currentUser.uid}_${Date.now()}_${file.name}`;
      const fileRef = ref(storage, fileName);
      console.log('File reference created:', fileRef.fullPath);
      
      // Upload the file
      const snapshot = await uploadBytes(fileRef, file);
      console.log('Upload successful, snapshot:', snapshot);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      setPhotoURL(downloadURL);
      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(`Upload failed: ${error.message || 'Check your connection'}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-6"
          >
            <div className="relative overflow-hidden rounded-[2rem] bg-black border border-white/10 shadow-2xl p-8">
              {/* Glow effects */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-[50px] pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-[50px] pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-display font-bold text-white">{t('epTitle')}</h2>
                  <button 
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Avatar Section */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-white/70 block mb-3">{t('epAvatar')}</label>
                    <div className="flex justify-center">
                      <Avatar className="w-24 h-24 border-2 border-white/10">
                        <AvatarImage src={photoURL || undefined} />
                        <AvatarFallback className="bg-primary text-white text-xl">
                          {name.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Suggestions */}
                    <div className="pt-2">
                      <p className="text-xs text-white/50 mb-3">{t('epSuggestions')}</p>
                      <div className="flex flex-wrap gap-3 justify-center">
                        {AVATAR_SUGGESTIONS.map((url, idx) => (
                          <button
                            key={idx}
                            onClick={() => setPhotoURL(url)}
                            className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${photoURL === url ? 'border-primary shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'border-white/10 hover:border-white/30'}`}
                          >
                            <img src={url || undefined} alt={`Suggestion ${idx + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Name Section */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white/70 block">{t('epName')}</label>
                    <Input 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-white/5 border-white/10 text-white rounded-xl h-12"
                    />
                  </div>

                  {/* Email Section (Read-only) */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-white/70 block">{t('epEmail')}</label>
                    <Input 
                      value={auth.currentUser?.email || ''}
                      disabled
                      className="bg-white/5 border-white/10 text-white/50 rounded-xl h-12 cursor-not-allowed opacity-70"
                    />
                  </div>

                  {/* Actions */}
                  <div className="pt-4 flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={onClose}
                      className="flex-1 rounded-xl h-12 border-white/10 text-white hover:bg-white/5"
                    >
                      {t('epCancel')}
                    </Button>
                    <Button 
                      onClick={handleSave}
                      disabled={loading}
                      className="flex-1 rounded-xl h-12 bg-primary text-black hover:bg-primary/90 border-none font-bold"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> {t('epSave')}</>}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
