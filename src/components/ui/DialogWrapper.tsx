import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./dialog";

interface DialogWrapperProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DialogWrapper({
  children,
  title,
  description = "",
  className = "",
  open,
  onOpenChange,
}: DialogWrapperProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle className="text-white">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-gray-400">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
