import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useUser } from '@/contexts/UserContext';
import { CheckCircle } from 'lucide-react';

const avatarOptions = [
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/26.jpg',
  'https://randomuser.me/api/portraits/men/75.jpg',
  'https://randomuser.me/api/portraits/women/75.jpg',
  'https://randomuser.me/api/portraits/men/86.jpg',
];

interface AvatarSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AvatarSelectionModal = ({ isOpen, onClose }: AvatarSelectionModalProps) => {
  const { avatar, setAvatar } = useUser();

  const handleSelectAvatar = (newAvatar: string) => {
    setAvatar(newAvatar);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-[#1f2937] to-[#111827] border-purple-700 text-white max-w-lg shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-300">Selecione um Avatar</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 py-4">
          {avatarOptions.map((src, index) => (
            <div
              key={index}
              className="relative cursor-pointer group"
              onClick={() => handleSelectAvatar(src)}
            >
              <Avatar className="h-24 w-24 border-4 border-transparent group-hover:border-purple-500 transition-all rounded-full">
                <AvatarImage src={src} />
                <AvatarFallback>AV</AvatarFallback>
              </Avatar>
              {avatar === src && (
                <div className="absolute top-0 right-0 bg-green-500 rounded-full p-1">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}; 